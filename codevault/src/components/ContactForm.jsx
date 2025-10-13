import React, { useState } from "react";

function ContactForm({ onSubmit }) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
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
    </form>
);
}

export default ContactForm;
