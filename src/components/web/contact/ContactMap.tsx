export function ContactMap() {
  return (
    <div className="w-full" style={{ height: "450px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0!2d-58.4394!3d-34.5889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM1JzIwLjAiUyA1OMKwMjYnMjEuOCJX!5e0!3m2!1ses!2sar!4v1234567890"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Shaves Studio — Av. Dorrego 1865, Palermo, CABA"
      />
    </div>
  );
}
