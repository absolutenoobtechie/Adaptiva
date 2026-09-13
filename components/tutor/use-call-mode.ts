"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CallStatus = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "ended";

export interface CallTurn {
  role: "user" | "assistant";
  content: string;
}

// Minimal ambient types so this compiles without extra @types packages.
// Web Speech API is not in default TS lib.dom yet.
type SpeechRecognitionResultLike = { transcript: string };
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>> }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export function useCallMode(context?: Record<string, unknown>) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [turns, setTurns] = useState<CallTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const activeRef = useRef(false);

  const speak = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      setStatus("speaking");
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const listenOnce = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const recognition = getRecognition();
      if (!recognition) {
        reject(new Error("Speech recognition is not supported in this browser. Try Chrome or Edge."));
        return;
      }
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript ?? "";
        resolve(transcript);
      };
      recognition.onerror = (event) => {
        reject(new Error((event as { error?: string })?.error ?? "Speech recognition error"));
      };
      recognition.onend = () => {
        // no-op: resolution already handled by onresult, or rejection by onerror
      };
      recognitionRef.current = recognition;
      setStatus("listening");
      recognition.start();
    });
  }, []);

  const askAdaptiva = useCallback(
    async (history: CallTurn[]) => {
      setStatus("thinking");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context })
      });
      if (!response.ok) {
        throw new Error("Adaptiva could not respond right now.");
      }
      const data = await response.json();
      return data.reply.content as string;
    },
    [context]
  );

  const loop = useCallback(
    async (history: CallTurn[]) => {
      if (!activeRef.current) return;
      try {
        const userText = await listenOnce();
        if (!activeRef.current) return;
        if (!userText.trim()) {
          loop(history);
          return;
        }
        const nextHistory: CallTurn[] = [...history, { role: "user", content: userText }];
        setTurns(nextHistory);

        const reply = await askAdaptiva(nextHistory);
        if (!activeRef.current) return;
        const withReply: CallTurn[] = [...nextHistory, { role: "assistant", content: reply }];
        setTurns(withReply);

        await speak(reply);
        if (!activeRef.current) return;
        loop(withReply);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong during the call.");
        setStatus("ended");
        activeRef.current = false;
      }
    },
    [askAdaptiva, listenOnce, speak]
  );

  const startCall = useCallback(
    (greeting = "Hi, I'm Adaptiva. What would you like to talk through?") => {
      setError(null);
      setTurns([]);
      activeRef.current = true;
      setStatus("connecting");
      speak(greeting).then(() => {
        if (activeRef.current) loop([{ role: "assistant", content: greeting }]);
      });
    },
    [loop, speak]
  );

  const endCall = useCallback(() => {
    activeRef.current = false;
    recognitionRef.current?.stop();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setStatus("ended");
  }, []);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      recognitionRef.current?.stop();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  return { status, turns, error, startCall, endCall };
}
