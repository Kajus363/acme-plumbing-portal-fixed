"use client";

import { useState } from "react";
import axios from "axios";

const SERVICES = ["Leak repair", "Blocked drain", "Water heater", "Boiler service", "Other"];

export default function BookingForm() {
  const [service, setService] = useState(SERVICES[0]);
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      await axios.post("/api/bookings", { service, description, preferredDate });
      setStatus("done");
      setDescription("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 grid gap-3 rounded border bg-white p-4">
      <select value={service} onChange={(e) => setService(e.target.value)} className="rounded border p-2">
        {SERVICES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's going on?"
        className="rounded border p-2"
        rows={3}
      />
      <input
        type="date"
        value={preferredDate}
        onChange={(e) => setPreferredDate(e.target.value)}
        className="rounded border p-2"
      />
      <button disabled={status === "saving"} className="rounded bg-blue-700 px-4 py-2 font-medium text-white">
        {status === "saving" ? "Booking…" : "Book visit"}
      </button>
      {status === "done" && <p className="text-sm text-green-700">Booked! We&apos;ll confirm by text.</p>}
      {status === "error" && <p className="text-sm text-red-700">Something went wrong. Please call us.</p>}
    </form>
  );
}
