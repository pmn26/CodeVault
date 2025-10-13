import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../assets/Review.module.css";

const Review = () => {
const location = useLocation();
const plan = location.state?.plan || "Annual";
const price = plan === "Annual" ? "$12/month" : "$30/month";

return (
    <div className={styles.container}>
    <div className={styles.card}>
        <div className={styles.summary}>
        <h3>Your order summary</h3>
        <p><strong>Plan:</strong> Grammarly Pro</p>
        <p><strong>Billing:</strong> {plan}</p>
        <p><strong>Today’s order:</strong> $0.00 USD</p>
        <p>{plan === "Annual" ? "$144.00/year ($12/month) charged after 7-day trial" : "$30.00/month charged after 7-day trial"}</p>

        <h4>How your trial works</h4>
        <ul>
            <li>Today - Your full access Pro plan trial is unlocked.</li>
            <li>Day 5 - We’ll send an end-of-trial email reminder.</li>
            <li>Day 7 - Your paid subscription begins unless you cancel beforehand.</li>
        </ul>
        </div>

        <div className={styles.payment}>
        <h3>Enter your payment details</h3>
        <input type="text" placeholder="Credit or debit card number" />
        <div className={styles.row}>
            <input type="text" placeholder="MM/YY" />
            <input type="text" placeholder="CVV" />
        </div>
        <input type="text" placeholder="Country/region" />
        <input type="text" placeholder="Postal code (Optional)" />
        <button>Start free trial</button>
        </div>
    </div>
    </div>
);
};

export default Review;
