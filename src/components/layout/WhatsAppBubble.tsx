import { MessageCircle } from "lucide-react";
import { waLink, defaultWaMessage } from "@/lib/site";

export function WhatsAppBubble() {
  return (
    <a
      href={waLink(defaultWaMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with TeesZone on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform duration-150 hover:scale-110"
    >
      <MessageCircle size={26} />
    </a>
  );
}
