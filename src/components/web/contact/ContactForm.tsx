"use client";

import { useState } from "react";

const inputClass =
  "w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3 text-sm focus:border-white focus:outline-none transition-colors duration-150";

export function ContactForm() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", fields);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex items-center justify-center h-full py-16">
        <p className="text-white text-sm tracking-widest uppercase">
          Mensaje enviado ✓
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Your Name *"
        required
        value={fields.name}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email *"
        required
        value={fields.email}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        type="text"
        name="subject"
        placeholder="Subject *"
        required
        value={fields.subject}
        onChange={handleChange}
        className={inputClass}
      />
      <textarea
        name="message"
        placeholder="Your Message *"
        required
        rows={4}
        value={fields.message}
        onChange={handleChange}
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        className="mt-2 bg-[var(--color-accent)] text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 transition-colors duration-200 hover:bg-[#c1121f] self-start"
      >
        SEND
      </button>
    </form>
  );
}
