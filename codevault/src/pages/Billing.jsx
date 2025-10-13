import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/Billing.module.css";

const Billing = () => {
const navigate = useNavigate();
const [activePlan, setActivePlan] = useState("Monthly"); // default

const handleSelect = (plan) => {
    navigate("/review", { state: { plan } });
};

// Set active tab based on URL hash
useEffect(() => {
    if (window.location.hash === "#annual") setActivePlan("Annual");
    else if (window.location.hash === "#monthly") setActivePlan("Monthly");
}, []);

return (
    <div className={styles.container}>
    <div className={styles.card}>
        <h2>Free 7 day Pro Trial</h2>
        <p>We’ll remind you 2 days ahead of your trial ending. You can cancel anytime.</p>

        <div className={styles.plans}>
        <div
            className={`${styles.plan} ${
            activePlan === "Annual" ? styles.mostPopular : ""
            }`}
        >
            <span className={styles.label}>Most popular</span>
            <h3>Annual</h3>
            <p className={styles.price}>$0.00 today</p>
            <p className={styles.savings}>60% savings $12.00 USD / month</p>
            <button onClick={() => handleSelect("Annual")}>Select</button>
        </div>

        <div className={styles.plan}>
            <h3>Monthly</h3>
            <p className={styles.price}>$0.00 today</p>
            <p className={styles.savings}>$30.00 USD / month</p>
            <button onClick={() => handleSelect("Monthly")}>Select</button>
        </div>
        </div>
    </div>
    </div>
);
};

export default Billing;
