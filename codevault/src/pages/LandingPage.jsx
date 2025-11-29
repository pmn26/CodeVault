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
        import compiler from "../assets/Compiler.png";
        import myprojects from "../assets/MyProjects.png";
        import allprojects from "../assets/AllProjects.png";    
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
                    <li className="nav-item nav-hover dropdown">
                <a className="nav-link text-white underline-hover" href="#">
                    Features
                </a>

                <div className="mega-menu">
                    <div className="mega-column">
                    <h6>UPLOAD</h6>
                    <div className="mega-item">
                        <i className="bi bi-journal-text"></i>
                        <div>
                        <h5>Upload</h5>
                        <p> Upload files, manage projects, and access them anywhere.</p>
                        </div>
                    </div>
                    <div className="mega-item">
                        <i className="bi bi-camera-video"></i>
                        <div>
                        <h5>Download</h5>
                        <p>Download public snippets or full projects to study</p>
                        </div>
                    </div>
                    </div>

                    <div className="mega-column">
                    <h6>CONNECT</h6>
                    <div className="mega-item">
                        <i className="bi bi-chat-dots"></i>
                        <div>
                        <h5>Explore</h5>
                        <p>Discover code from developers around the world.
                                                </p>
                        </div>
                    </div>
                    <div className="mega-item">
                        <i className="bi bi-people"></i>
                        <div>
                        <h5>Grow</h5>
                        <p>Enhance your coding journey all within one platform.</p>
                        </div>
                    </div>
                    </div>

                    <div className="mega-column">
                    <h6>CODE</h6>
                    <div className="mega-item">
                        <i className="bi bi-code"></i>
                        <div>
                        <h5>Built-in Compiler</h5>
                        <p>Write, test, and debug directly in your browser.</p>
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
                    <li className="nav-item nav-hover">
                        <a className="nav-link text-white" href="#faqs">
                        FAQs
                        </a>
                    </li>
                    </ul>
                    <div className="d-flex gap-2">
                    <button className="btn-outline-primary colorwhite" onClick={() => setContactOpen(true)}>
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
                <h6 className="section-label">BUILD. SHARE. EXECUTE.</h6>
                <h1 className="section-title">
                Workspace for Every Student Developer.
                </h1>
                <p className="section-subtitle">
                Upload your code, compile it online, and share results seamlessly.
    CodeVault gives you the freedom to code, test, and download — all in your browser.
                </p>
            </div>

            {/* INTEGRATIONS / CONNECT SECTION */}
            <section id="about" className="integrations-section text-white text-center fade-section">
            <div className="integration-grid">

                {/* LEFT HEADER TEXT */}
                <div className="integration-intro">
                <h6 className="section-label">PROGRAMMING LANGUAGES</h6>
                <h1 className="section-title">Code in Your Favorite Language</h1>
                <p className="section-subtitle">
                    CodeVault isn’t just a place to write code, it’s where ideas take shape. Build, run, and explore projects in your favorite languages, all in one powerful, beginner-friendly platform.
                </p>
                </div>

                {/* RIGHT GRID CARDS */}
                <div className="integration-card">
                <span className="integration-tag">js</span>
                <h3>JavaScript</h3>
                <p>The language of the web, ideal for creating dynamic, interactive projects. Write and test your scripts instantly right in your browser.
    </p>
                </div>

                <div className="integration-card">
                <span className="integration-tag">ts</span>
                <h3>TypeScript</h3>
                <p>JavaScript with superpowers. Enjoy cleaner, more reliable code with real-time feedback and built-in compiler support.</p>
                </div>

                <div className="integration-card">
                <span className="integration-tag">py</span>
                <h3>Python</h3>
                <p>Simple yet powerful, great for beginners and pros alike. Run your programs, test logic, and explore ideas without any setup.
    </p>
                </div>

                <div className="integration-card">
                <span className="integration-tag">java</span>
                <h3>Java</h3>
                <p>A trusted language for robust applications. Compile and execute your code in seconds and focus on building, not configuring.</p>
                </div>

                <div className="integration-card">
                <span className="integration-tag">C#</span>
                <h3>CSharp</h3>
                <p>Modern, efficient, and perfect for games or enterprise apps. Write and run C# code instantly in a clean, ready-to-use workspace.</p>
                </div>

                <div className="integration-card">
                <span className="integration-tag">php</span>
                <h3>PHP</h3>
                <p>A classic choice for web development. Test backend logic, experiment freely, and see results fast — all in one streamlined environment.</p>
                </div>
            </div>
            </section>

            {/* FEATURES */}
            <div className="features-wrapper" id="integrations">
                {/* 1st Section - Image Right */}
                <div className="feature-section fade-section">
                <div className="feature-text">
                    <h6 className="feature-label">CODE & RUN</h6>
                    <h1 className="feature-title">Code using the built-in compiler</h1>
                    <ul className="feature-list">
                    <li>Supports multiple programming languages</li>
                    <li>Instant feedback and live output</li>
                    <li>Save progress seamlessly in your workspace</li>
                    <li>Visually fine-tune every style</li>
                    </ul>
                </div>
                <div className="feature-image">
                    <img
                    src= {compiler}
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
                    src={myprojects }
                    alt="Build user interfaces"
                    className="feature-preview"
                    loading="lazy"
                    />
                </div>
                <div className="feature-text">
                    <h6 className="feature-label">UPLOAD & ORGANIZE</h6>
                    <h1 className="feature-title">Upload your code with ease</h1>
                    <ul className="feature-list">
                    <li>Import existing files in seconds</li>
                    <li>Organize projects by language or purpose </li>
                    <li>Access your work from any device</li>
                    </ul>
                </div>
                </div>

                {/* 3rd Section - Image Right */}
                <div className="feature-section fade-section">
                <div className="feature-text">
                    <h6 className="feature-label">EXPLORE & DOWNLOAD</h6>
                    <h1 className="feature-title">Browse and learn from other developers</h1>
                    <ul className="feature-list">
                    <li>View community-shared code instantly</li>
                    <li>Learn new techniques from other developers</li>
                    <li>Download and customize snippets </li>
                    </ul>
                </div>
                <div className="feature-image">
                    <img
                    src={allprojects}    
                    alt="EXPLORE & DOWNLOAD"
                    className="feature-preview"
                    loading="lazy"
                    />
                </div>
                </div>
            </div>

            {/*QUOTE*/}
            <div className="testimonial-card fade-section">
            <span className="quot   e-mark">“</span>
            <p className="testimonial-text">
                CodeVault has honestly made my coding life so much easier. I now have a streamlined website where I can test and save my work, rather than switching to multiple apps. Everything is now in one place. I can write, compile, and organize my code instantly, and even look through public projects when I need inspiration. It feels like having my own online coding lab.
            </p>
            <p className="testimonial-author">
                <strong>Precious Magpale</strong>, BS Information Technology Student at De La Salle University - Dasmarinas
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
                        <i className="bi bi-check-circle-fill"></i> View Access to public codes
                    </li>
                    <li>
                        <i className="bi bi-x-circle"></i> Limited customization
                    </li>
                    <li>
                        <i className="bi bi-x-circle"></i> Limited Downloads
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
                        <i className="bi bi-check-circle-fill"></i> Unlimited Download/View access to public code
                    </li>
                    <li>
                        <i className="bi bi-check-circle-fill"></i> Priority support
                    </li>
                    <li>
                        <i className="bi bi-check-circle-fill"></i> Unlimited uploads
                    </li>   
                    </ul>
                    <Link to="/Signup">
                    <button className="pricing-btn premium-btn"> Upgrade Now</button>
                    </Link>
                </div>
                </div>
            </div>

            {/* FAQ SECTION */}
            <section className="faq-section fade-section" id="faqs">
            <h3 className="faq-subtitle">FREQUENTLY ASKED QUESTIONS</h3>
            <h2 className="faq-title">Get answers to common questions</h2>

            <div className="faq-list">
                {[
                {
                    q: "What is CodeVault?",
                    a: "CodeVault is an online platform where you can store, compile, and share your code in one place. It supports multiple programming languages and lets you explore public projects from other developers.",
                },
                {
                    q: "Do I need an account to use CodeVault?",
                    a: "You can browse public code without signing up, but you’ll need an account to save, compile, or share your own code."
                },
                {
                    q: "What’s the difference between the Free and Premium plans?",
                    a: "Free Plan (₱0/month): Access to basic features, community support, and limited customization."
                },
                {
                    q: "Is my code private?",
                    a: "Yes, your code is private by default. You can choose to make any project public to share it with others."
                },
                {
                    q: "Can I use or copy code from other users?",
                    a: "Yes, you can view and learn from public code. It is located in the “All Projects” button in the main page. "
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
                    <h2 className="font-bold mb-2">For student ready to code</h2>
                    <p className="mb-4 text-gray-300">
                    Experience CodeVault with your own codebase and design system. Upload your files and begin coding.
                    </p>
                    <Link to="/Signup">
                    <button className="btn btn-primary">Get started</button>
                    </Link>
                </div>

                <div className="get-started-card">
                    <div className="icon mb-4">
                    <i className="bi bi-camera-video text-2xl"></i>
                    </div>
                    <h2 className="font-bold mb-2">See CodeVault in action</h2>
                    <p className="mb-4 text-gray-300">
                    See how students like yours are using CodeVault to create and upload.
                    </p>
                    <Link to="/contact">
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
