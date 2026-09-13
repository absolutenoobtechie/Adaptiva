import { AIChat } from "@/components/tutor/ai-chat";
import { CallMode } from "@/components/tutor/call-mode";

export default function TutorPage() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex max-w-5xl justify-end">
        <CallMode />
      </div>
      <AIChat />
    </div>
  );
}
