"use client";

import { Mic, PhoneCall, PhoneOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { useCallMode } from "@/components/tutor/use-call-mode";

const statusLabel: Record<string, string> = {
  idle: "Ready to call",
  connecting: "Connecting…",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
  ended: "Call ended"
};

export function CallMode() {
  const { status, turns, error, startCall, endCall } = useCallMode();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button
        type="button"
        onClick={() => {
          setOpen(true);
          startCall();
        }}
        className="gap-2"
      >
        <PhoneCall aria-hidden="true" size={18} />
        Call Adaptiva
      </Button>
    );
  }

  return (
    <Panel className="mx-auto max-w-xl text-center">
      <div className="flex flex-col items-center gap-4 py-6">
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full border-4",
            status === "listening" && "border-moss animate-pulse",
            status === "speaking" && "border-ink",
            status === "thinking" && "border-graphite/40",
            (status === "idle" || status === "connecting" || status === "ended") && "border-ink/10"
          )}
        >
          <Sparkles aria-hidden="true" size={32} />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-moss">
          {statusLabel[status] ?? status}
        </p>
        <p className="max-h-24 max-w-md overflow-y-auto text-sm text-graphite">
          {turns.length > 0 ? turns[turns.length - 1].content : "Say something once the call connects."}
        </p>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
        <div className="flex gap-3">
          {status !== "ended" ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                endCall();
                setOpen(false);
              }}
              className="gap-2"
            >
              <PhoneOff aria-hidden="true" size={18} />
              Hang up
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                startCall();
              }}
              className="gap-2"
            >
              <Mic aria-hidden="true" size={18} />
              Call again
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
}
