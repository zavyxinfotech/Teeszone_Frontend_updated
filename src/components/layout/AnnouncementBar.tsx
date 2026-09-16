const messages = [
  "Direct Manufacturer · Tiruppur",
  "In-House Printing & Embroidery",
  "Pan-India Delivery",
];

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2">
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-center text-xs font-medium tracking-wide text-white">
        {messages.map((m, i) => (
          <span key={m} className="flex items-center gap-3">
            {i > 0 && <span className="hidden text-gold sm:inline">•</span>}
            <span className={i > 0 ? "hidden sm:inline" : ""}>{m}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
