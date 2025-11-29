import React, { useState } from "react";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      data: [
        {
          name,
          email,
          message,
        },
      ],
    };

    try {
      const res = await fetch("https://sheetdb.io/api/v1/4rkr6c94sipfk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("❌ Failed to send message. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>Contact Us</h3>

      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </label>

      <label>
        Message
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Your message..."
        />
      </label>

      <button type="submit" className="submit-btn">
        Submit
      </button>

      {status && <p className="status">{status}</p>}
    </form>
  );
}

export default ContactForm;
