    import React, { useEffect, useRef, useState } from "react";
    import * as THREE from "three";
    import NET from "vanta/dist/vanta.net.min.js";
    import "../assets/style.css";
    import logo from "../assets/CODEVAULT-LOGO.png";
    import { Link } from "react-router-dom";
    import demoVideo from "../assets/demo.mp4";
    import logo1 from "../assets/1.png";
    import logo2 from "../assets/2.png";
    import logo3 from "../assets/3.png";
    import logo4 from "../assets/4.png";
    import logo5 from "../assets/5.png";
    import logo6 from "../assets/6.png";
    import logo7 from "../assets/7.png";
    import logo8 from "../assets/8.png";
    import Modal from "../components/modal"; 
    import ContactForm from "../components/ContactForm";

    const avatars = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8];

    function Home() {
    const backgroundRef = useRef(null);
    const [isContactOpen, setContactOpen] = useState(false);


    function FAQItem({ question, answer }) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={`faq-item ${open ? "active" : ""}`}>
        <button className="faq-question" onClick={() => setOpen(!open)}>
            {question}
            <span className="arrow">{open ? "▴" : "▾"}</span>
        </button>
        {open && <p className="faq-answer">{answer}</p>}
        </div>
    );
    }


    useEffect(() => {
        THREE.Material.prototype.setValues = (function (original) {
            return function (values) {
            if (values && values.vertexColors === undefined) values.vertexColors = false;
            original.call(this, values);
            };
        })(THREE.Material.prototype.setValues);

        const vantaEffect = NET({
        el: backgroundRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x7d99ef,
        backgroundColor: 0x40426,
        points: 10.0,
        maxDistance: 20.0,
        spacing: 20.0,
        THREE,
        });

        return () => {
        if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

        useEffect(() => {
        const sections = document.querySelectorAll(".fade-section");

        const observer = new IntersectionObserver(
            (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); 
                }
            });
            },
            { threshold: 0.1 } 
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
        }, []);


    return (
        <div>
            <Modal isOpen={isContactOpen} onClose={() => setContactOpen(false)}>
            <ContactForm onSubmit={(data) => {
                console.log("Contact form submitted:", data);
                setContactOpen(false);
            }} />
            </Modal>

        {/* NAVBAR */}
        <nav
            className="navbar navbar-expand-lg navbar-dark bg-transparent px-4"
            style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1030 }}
        >
            <div className="container-fluid">
            <a className="navbar-brand d-flex align-items-center" href="#">
                <img src={logo} alt="CodeVault Logo" id="logo" style={{ height: "50px" }} />
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mx-auto gap-4">
                <li className="nav-item nav-hover">
                    <a className="nav-link text-white" href="#about">
                    About
                    </a>
                </li>
                <li className="nav-item nav-hover dropdown">
            <a className="nav-link text-white underline-hover" href="#">
                Features
            </a>

            <div className="mega-menu">
                <div className="mega-column">
                <h6>LEARN</h6>
                <div className="mega-item">
                    <i className="bi bi-journal-text"></i>
                    <div>
                    <h5>Blog</h5>
                    <p>Latest insights, tutorials, and announcements</p>
                    </div>
                </div>
                <div className="mega-item">
                    <i className="bi bi-camera-video"></i>
                    <div>
                    <h5>Webinars</h5>
                    <p>Upcoming events and recorded sessions</p>
                    </div>
                </div>
                </div>

                <div className="mega-column">
                <h6>CONNECT</h6>
                <div className="mega-item">
                    <i className="bi bi-chat-dots"></i>
                    <div>
                    <h5>Builder Forum</h5>
                    <p>Join the discussion, ask questions</p>
                    </div>
                </div>
                <div className="mega-item">
                    <i className="bi bi-people"></i>
                    <div>
                    <h5>Partners</h5>
                    <p>Explore Builder partners and connect with a team</p>
                    </div>
                </div>
                </div>

                <div className="mega-column">
                <h6>UPDATES</h6>
                <div className="mega-item">
                    <i className="bi bi-megaphone"></i>
                    <div>
                    <h5>Product Updates</h5>
                    <p>Latest features and improvements</p>
                    </div>
                </div>
                <div className="mega-footer">
                    <a
                        href="#integrations"
                        className="learn-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            const megaMenu = document.querySelector(".mega-menu");
                            megaMenu.classList.remove("active");
                            setTimeout(() => {
                            const target = document.querySelector("#integrations");
                            if (target) {
                                target.scrollIntoView({ behavior: "smooth" });
                            }
                            }, 50);
                        }}
                        >
                        Learn More
                    </a>
                </div>
                </div>
            </div>
            </li>
                <li className="nav-item nav-hover">
                    <a className="nav-link text-white" href="#pricing">
                    Pricing
                    </a>
                </li>
                </ul>
                <div className="d-flex gap-2">
                <button className="btn-outline-primary" onClick={() => setContactOpen(true)}>
                    Contact Us
                </button>
                <Link to="/Signup">
                    <button className="btn-primary">Sign Up</button>
                </Link>
                </div>
            </div>
            </div>
        </nav>

        {/* BACKGROUND ONLY FOR WELCOME + VIDEO */}
        <div ref={backgroundRef} id="background" className="min-h-screen">
            <div className="Welcome mt-32 text-center text-white fade-section">
            <h5>INTRODUCING</h5>
            <h1>CodeVault</h1>
            <p>Where student ideas compile.</p>
            <div className="d-flex justify-content-center gap-3 mt-3 navbar-buttons">
                <Link to="/Signup">
                <button className="btn btn-outline-primary">Try it now</button>
                </Link>
                <Link to="/demo">
                <button className="btn btn-primary">Get a demo</button>
                </Link>
            </div>
            <div className="video-container mt-5 fade-section">
                <video
                src={demoVideo}
                autoPlay
                loop
                muted
                playsInline
                className="video-placeholder"
                poster="" 
                >
                Your browser does not support the video tag.
                </video>
            </div>
            </div>
        </div>

        {/* SCROLLER SECTION */}
        <div className="scroller">
            <div className="scroller__wrapper">
            {[...avatars, ...avatars].map((src, idx) => (
                <img
                key={idx}
                src={src}
                alt={`Partner ${idx + 1}`}
                className="avatar-img"
                loading="lazy" 
                />
            ))} 
            </div>
        </div>

        {/* PLATFORM INTRO */}
        <div className="Container2 text-center text-white fade-section" id="features">
            <h6 className="section-label">VISUAL DEVELOPMENT PLATFORM</h6>
            <h1 className="section-title">
            Bring the power of development to your entire team
            </h1>
            <p className="section-subtitle">
            Let both developers and non-developers leverage your existing tech
            investments to iterate and ship faster
            </p>
        </div>

        {/* INTEGRATIONS / CONNECT SECTION */}
        <section id="about" className="integrations-section text-white text-center fade-section">
        <div className="integration-grid">

            {/* LEFT HEADER TEXT */}
            <div className="integration-intro">
            <h6 className="section-label">DEEPLY INTEGRATED</h6>
            <h1 className="section-title">Connects to your full context</h1>
            <p className="section-subtitle">
                Other AI tools create generic results—Builder understands your design tokens, 
                component libraries, APIs, and coding patterns.
            </p>
            </div>

            {/* RIGHT GRID CARDS */}
            <div className="integration-card">
            <span className="integration-tag">API</span>
            <h3>Your APIs & data</h3>
            <p>Connect to existing APIs and databases to build with real data and endpoints.</p>
            </div>

            <div className="integration-card">
            <span className="integration-tag">MCP</span>
            <h3>MCP servers</h3>
            <p>Extend AI capabilities with custom Model Context Protocol servers for specialized workflows.</p>
            </div>

            <div className="integration-card">
            <span className="integration-tag">DOCS</span>
            <h3>Documentation</h3>
            <p>Reference technical docs, style guides, and team knowledge to maintain consistency.</p>
            </div>

            <div className="integration-card">
            <span className="integration-tag">Figma</span>
            <h3>Figma designs</h3>
            <p>Automatically convert Figma designs into clean, production-ready code using your existing components.</p>
            </div>

            <div className="integration-card">
            <span className="integration-tag">Jira</span>
            <h3>Linear & Jira</h3>
            <p>Sync project requirements and user stories directly into your development workflow.</p>
            </div>

            <div className="integration-card">
            <span className="integration-tag">GH</span>
            <h3>Multiple GH repos</h3>
            <p>Access components and patterns across multiple repositories for comprehensive context.</p>
            </div>
        </div>
        </section>

        {/* FEATURES */}
        <div className="features-wrapper" id="integrations">
            {/* 1st Section - Image Right */}
            <div className="feature-section fade-section">
            <div className="feature-text">
                <h6 className="feature-label">GENERATE & ITERATE</h6>
                <h1 className="feature-title">Generate on-brand landing pages</h1>
                <ul className="feature-list">
                <li>Prompt to generate on-brand pages</li>
                <li>Leverage your existing code components</li>
                <li>Copy from Figma, paste to the visual editor</li>
                <li>Visually fine-tune every style</li>
                </ul>
            </div>
            <div className="feature-image">
                <img
                src="" 
                alt="Generate landing pages"
                className="feature-preview"
                loading="lazy"
                />
            </div>
            </div>

            {/* 2nd Section - Image Left */}
            <div className="feature-section fade-section">
            <div className="feature-image">
                <img
                src=""
                alt="Build user interfaces"
                className="feature-preview"
                loading="lazy"
                />
            </div>
            <div className="feature-text">
                <h6 className="feature-label">DESIGN & BUILD</h6>
                <h1 className="feature-title">Visually build modern user interfaces</h1>
                <ul className="feature-list">
                <li>Drag-and-drop intuitive layout builder</li>
                <li>Instant preview across all screen sizes</li>
                <li>Adaptive grid and responsive scaling</li>
                <li>Design tokens synced automatically</li>
                </ul>
            </div>
            </div>

            {/* 3rd Section - Image Right */}
            <div className="feature-section fade-section">
            <div className="feature-text">
                <h6 className="feature-label">DEPLOY & SCALE</h6>
                <h1 className="feature-title">Deploy faster with built-in automation</h1>
                <ul className="feature-list">
                <li>One-click deployment to multiple environments</li>
                <li>Continuous integration made visual</li>
                <li>Smart error detection and rollbacks</li>
                <li>Collaborate and monitor in real-time</li>
                </ul>
            </div>
            <div className="feature-image">
                <img
                src=""    
                alt="Deploy and scale"
                className="feature-preview"
                loading="lazy"
                />
            </div>
            </div>
        </div>

        {/*QUOTE*/}
        <div className="testimonial-card fade-section">
        <span className="quote-mark">“</span>
        <p className="testimonial-text">
            Our developer team is ecstatic about working with Builder. They’re far
            and away the best vendor that we work with in terms of customer service,
            development processes, and documentation.
        </p>
        <p className="testimonial-author">
            <strong>Colin Tracy</strong>, Director of Engineering at Black Rifle Coffee
        </p>
        </div>

        {/* PRICING */}
        <div className="pricing-section text-center text-white fade-section" id="pricing">
            <h6 className="pricing-label">PRICING</h6>
            <h1 className="pricing-title">Simple and transparent plans</h1>

            <div className="pricing-grid">
            <div className="pricing-card">
                <i className="bi bi-box icon"></i>
                <h2>Free Plan</h2>
                <p className="price">
                ₱0 <span>/month</span>
                </p>
                <ul>
                <li>
                    <i className="bi bi-check-circle-fill"></i> Access to basic features
                </li>
                <li>
                    <i className="bi bi-check-circle-fill"></i> Community support
                </li>
                <li>
                    <i className="bi bi-x-circle"></i> Limited customization
                </li>
                </ul>
                <Link to="/Signup">
                <button className="pricing-btn">Get Started</button>
                </Link>
            </div>

            <div className="pricing-card premium">
                <i className="bi bi-gem icon"></i>
                <h2>Premium Plan</h2>
                <p className="price">
                ₱499 <span>/month</span>
                </p>
                <ul>
                <li>
                    <i className="bi bi-check-circle-fill"></i> All free features included
                </li>
                <li>
                    <i className="bi bi-check-circle-fill"></i> Unlimited access & storage
                </li>
                <li>
                    <i className="bi bi-check-circle-fill"></i> Priority support
                </li>
                </ul>
                <Link to="/Signup">
                <button className="pricing-btn premium-btn">     Now</button>
                </Link>
            </div>
            </div>
        </div>

        {/* FAQ SECTION */}
        <section className="faq-section fade-section">
        <h3 className="faq-subtitle">FREQUENTLY ASKED QUESTIONS</h3>
        <h2 className="faq-title">Get answers to common questions</h2>

        <div className="faq-list">
            {[
            {
                q: "What changes or integrations are required?",
                a: "Builder connects to your existing repositories and design systems without requiring architectural changes. Most teams are up and running in a day or less and there's no SDKs to learn or integrations to build—the visual editor uses AI to work directly with your current codebase."
            },
            {
                q: "Does it work with our tech stack?",
                a: "Yes! Builder works with any modern tech stack including React, Next.js, Vue, and more."
            },
            {
                q: "How does it understand our design system?",
                a: "Builder uses AI to automatically detect your design tokens, components, and layout structure to match your existing design system."
            },
            {
                q: "Does it train on our data?",
                a: "No, Builder does not train on your private data. Everything stays secure within your project environment."
            },
            {
                q: "Can we connect multiple repositories?",
                a: "Yes, you can connect multiple repositories and manage them in one unified dashboard with Builder’s integrations."
            }   
            ].map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
        </div>
        </section>

        {/* GET STARTED TODAY */}
        <div className="get-started-section text-white text-center fade-section">
            <h1 className="section-title">Get started today</h1>

            <div className="get-started-grid">
            <div className="get-started-card">
                <div className="icon mb-4">
                <i className="bi bi-hammer text-2xl"></i>
                </div>
                <h2 className="font-bold mb-2">For teams ready to build</h2>
                <p className="mb-4 text-gray-300">
                Experience Builder with your own codebase and design system. Connect your repository and start building in minutes.
                </p>
                <Link to="/Signup">
                <button className="btn btn-primary">Get started</button>
                </Link>
            </div>

            <div className="get-started-card">
                <div className="icon mb-4">
                <i className="bi bi-camera-video text-2xl"></i>
                </div>
                <h2 className="font-bold mb-2">See Builder in action</h2>
                <p className="mb-4 text-gray-300">
                See how teams like yours are using Builder to ship web applications faster than ever.
                </p>
                <Link to="/demo">
                <button className="btn btn-outline-primary">Book a demo</button>
                </Link>
            </div>
            </div>
        </div>

        {/* NEWSLETTER SECTION */}
        <section className="newsletter-section fade-section">
        <h2 className="newsletter-title">Get the latest from CodeVault</h2>

        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
            type="email"
            placeholder="Enter your email *"
            className="newsletter-input"
            required
            />
            <button type="submit" className="newsletter-button">→</button>
        </form>

        <p className="newsletter-policy">
            By submitting, you agree to our{" "}
            <a href="#" className="newsletter-link">Privacy Policy</a>.
        </p>
        </section>


        <footer className="site-footer">
            <hr className="hrr"></hr>
        <div className="footer-top text-center mb-3">
            <p>© 2025 Builder.io, Inc.</p>
            <div className="footer-links">
            <a href="#" className="mx-2">Security</a>
            <a href="#" className="mx-2">Privacy Policy</a>
            <a href="#" className="mx-2">SaaS Terms</a>
            <a href="#" className="mx-2">Compliance</a>
            <a href="#" className="mx-2">Cookie Preferences</a>
            </div>
        </div>

        <div className="footer-bottom text-center">
            <a href="#" className="mx-2"><i className="bi bi-youtube"></i></a>
            <a href="#" className="mx-2"><i className="bi bi-github"></i></a>
            <a href="#" className="mx-2"><i className="bi bi-facebook"></i></a> 
            <a href="#" className="mx-2"><i className="bi bi-instagram"></i></a> 
            <a href="#" className="mx-2"><i className="bi bi-x"></i></a>
        </div>
        </footer>

        </div>
    );
    }

    export default Home;
