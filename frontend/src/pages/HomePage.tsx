import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const revealsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Handle nav scroll
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealsRef.current.includes(el)) {
      revealsRef.current.push(el);
    }
  };

  return (
    <div className="home-page">
      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>

      {/* Nav */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark">🦷</div>
          <span className="nav-logo-text">Dentique</span>
        </Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <div className="nav-cta">
          <Link to="/login" className="btn-ghost">Sign in</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-deco-1"></div>
        <div className="hero-deco-2"></div>

        <svg className="hero-arc" viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="220" cy="220" r="200" stroke="#1a3328" strokeWidth="1"/>
          <circle cx="220" cy="220" r="160" stroke="#b8922a" strokeWidth="0.5"/>
          <circle cx="220" cy="220" r="120" stroke="#1a3328" strokeWidth="0.5"/>
        </svg>

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <div className="eyebrow-dot"></div>
            Dental Practice Management
          </div>
          <h1>Your practice,<br/><em>perfectly</em> managed.</h1>
          <p className="hero-body">
            Everything a modern dental practice needs — patient records, imaging, visit notes, and intelligent reminders — in one beautifully simple platform.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-hero">Get started free →</Link>
            <a href="#features" className="btn-hero-ghost">See how it works <span>↓</span></a>
          </div>
        </div>

        {/* Floating UI Card */}
        <div className="hero-card-float">
          <div className="card-header">
            <div>
              <div className="card-header-title">Today's Schedule</div>
            </div>
            <div className="card-header-date">THU · FEB 12</div>
          </div>
          <div className="card-appt">
            <div className="card-time">9:00</div>
            <div className="card-dot green"></div>
            <div className="card-appt-info">
              <div className="card-patient">Marcus Rodriguez</div>
              <div className="card-procedure">Root Canal · #19</div>
            </div>
          </div>
          <div className="card-appt">
            <div className="card-time">10:30</div>
            <div className="card-dot amber"></div>
            <div className="card-appt-info">
              <div className="card-patient">Emily Watson</div>
              <div className="card-procedure">Cleaning + Checkup</div>
            </div>
          </div>
          <div className="card-appt">
            <div className="card-time">2:15</div>
            <div className="card-dot blue"></div>
            <div className="card-appt-info">
              <div className="card-patient">Amara Patel</div>
              <div className="card-procedure">Braces Adjustment</div>
            </div>
          </div>
          <div className="card-reminder-banner">
            🔔 &nbsp;SMS sent to 3 patients for tomorrow
          </div>
        </div>

        {/* Floating Badge */}
        <div className="hero-badge-2">
          <div className="badge-icon">✓</div>
          <div>
            <strong>Reminder sent</strong>
            <span>2 hrs before · auto</span>
          </div>
        </div>

        <div className="hero-scroll-cue">
          <div className="scroll-line"></div>
          Scroll to explore
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="trust-label">Trusted by practices at</div>
        <div className="trust-divider"></div>
        <div className="trust-logos">
          <div className="trust-logo">BrightSmile Dental</div>
          <div className="trust-logo">Arch & Associates</div>
          <div className="trust-logo">Westlake Family Dentistry</div>
          <div className="trust-logo">PeakDental Group</div>
          <div className="trust-logo">Ivory Dental Co.</div>
        </div>
      </div>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-label reveal" ref={addToRefs}>Core Features</div>
        <h2 className="section-title reveal reveal-delay-1" ref={addToRefs}>
          Everything your practice <em>actually needs</em>
        </h2>

        <div className="features-grid reveal" ref={addToRefs}>
          <div className="feature-card highlight">
            <div className="feature-num">01</div>
            <div className="feature-icon-wrap">👤</div>
            <div className="feature-name">Patient Records</div>
            <div className="feature-desc">
              A complete clinical profile for every patient. Contact info, medical history, insurance, treatment plans — structured, searchable, and always at your fingertips.
            </div>
            <div className="feature-pill-list">
              <span className="feature-pill">Medical history</span>
              <span className="feature-pill">Insurance info</span>
              <span className="feature-pill">Treatment plans</span>
              <span className="feature-pill">Contact details</span>
            </div>
            <div className="feature-deco-arc"></div>
          </div>

          <div className="feature-card">
            <div className="feature-num">02</div>
            <div className="feature-icon-wrap">🩻</div>
            <div className="feature-name">Imaging & X-Rays</div>
            <div className="feature-desc">
              Store, tag, and retrieve X-rays and intraoral photos linked directly to the patient and visit. Supports panoramic, bitewing, periapical, and intraoral capture formats.
            </div>
            <div className="feature-pill-list">
              <span className="feature-pill">X-ray storage</span>
              <span className="feature-pill">Intraoral photos</span>
              <span className="feature-pill">Linked to visits</span>
            </div>
            <div className="feature-deco-arc"></div>
          </div>

          <div className="feature-card">
            <div className="feature-num">03</div>
            <div className="feature-icon-wrap">📋</div>
            <div className="feature-name">Visit Notes & History</div>
            <div className="feature-desc">
              Document every visit with structured clinical notes, procedures performed, follow-up instructions, and attachments. A full chronological record per patient, always in context.
            </div>
            <div className="feature-pill-list">
              <span className="feature-pill">Clinical notes</span>
              <span className="feature-pill">Procedure log</span>
              <span className="feature-pill">Visit timeline</span>
            </div>
            <div className="feature-deco-arc"></div>
          </div>

          <div className="feature-card highlight">
            <div className="feature-num">04</div>
            <div className="feature-icon-wrap">🔔</div>
            <div className="feature-name">Smart Reminders</div>
            <div className="feature-desc">
              Automated appointment reminders sent 24 hours before and again 2 hours before — via SMS and email. Zero manual follow-up. No-shows drop, patients appreciate it.
            </div>
            <div className="feature-pill-list">
              <span className="feature-pill">24hr reminder</span>
              <span className="feature-pill">2hr reminder</span>
              <span className="feature-pill">SMS & Email</span>
              <span className="feature-pill">Auto-sent</span>
            </div>
            <div className="feature-deco-arc"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how" id="how">
        <div className="section-label reveal" ref={addToRefs}>How It Works</div>
        <h2 className="section-title reveal reveal-delay-1" ref={addToRefs}>
          Set up in minutes,<br/>run your practice forever.
        </h2>

        <div className="steps-row">
          <div className="step reveal" ref={addToRefs}>
            <div className="step-num">1</div>
            <div className="step-title">Add your patients</div>
            <div className="step-desc">Import existing records or add patients one by one. Profiles are instantly ready.</div>
          </div>
          <div className="step reveal reveal-delay-1" ref={addToRefs}>
            <div className="step-num">2</div>
            <div className="step-title">Schedule appointments</div>
            <div className="step-desc">Book visits with a clean calendar view. Assign procedures and notes ahead of time.</div>
          </div>
          <div className="step reveal reveal-delay-2" ref={addToRefs}>
            <div className="step-num">3</div>
            <div className="step-title">Log visits & imaging</div>
            <div className="step-desc">After each visit, add clinical notes and upload X-rays or intraoral photos directly.</div>
          </div>
          <div className="step reveal reveal-delay-3" ref={addToRefs}>
            <div className="step-num">4</div>
            <div className="step-title">Reminders go out — automatically</div>
            <div className="step-desc">Dentique sends SMS and email reminders 24hrs and 2hrs before every appointment. Done.</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-label reveal" ref={addToRefs}>Testimonials</div>
        <h2 className="section-title reveal reveal-delay-1" ref={addToRefs}>
          Dentists who <em>love</em> using it
        </h2>

        <div className="testimonials-grid">
          <div className="testimonial-card reveal" ref={addToRefs}>
            <div className="star-row">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <div className="quote-mark">"</div>
            <div className="testimonial-text">
              The automatic reminders alone have cut our no-show rate nearly in half. Our front desk staff couldn't believe how much time they got back in a single week.
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">PK</div>
              <div>
                <div className="author-name">Dr. Priya Kapoor</div>
                <div className="author-role">Principal Dentist · Kapoor Family Dental</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card featured reveal reveal-delay-1" ref={addToRefs}>
            <div className="star-row">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <div className="quote-mark">"</div>
            <div className="testimonial-text">
              Having patient photos, X-rays, and notes all in one place has completely changed how I review cases. I open Dentique before I walk into every room.
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">MB</div>
              <div>
                <div className="author-name">Dr. Marcus Bell</div>
                <div className="author-role">Prosthodontist · Arch & Associates</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card reveal reveal-delay-2" ref={addToRefs}>
            <div className="star-row">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <div className="quote-mark">"</div>
            <div className="testimonial-text">
              The visit note timeline is brilliant. I can scroll back through a patient's entire history in seconds. Setup took less than an afternoon. Genuinely surprised by how good this is.
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">SC</div>
              <div>
                <div className="author-name">Dr. Sofía Castillo</div>
                <div className="author-role">General Dentist · Westlake Dental</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="section-label reveal" ref={addToRefs}>Pricing</div>
        <h2 className="section-title reveal reveal-delay-1" ref={addToRefs}>
          Simple, <em>transparent</em> plans
        </h2>

        <div className="pricing-grid">
          <div className="pricing-card reveal" ref={addToRefs}>
            <div className="plan-name">Solo</div>
            <div className="plan-desc">For individual practitioners.</div>
            <div className="plan-price">
              <span className="price-currency">Rs.</span>
              <span className="price-num">7,000</span>
              <span className="price-period">/mo</span>
            </div>
            <ul className="plan-features">
              <li>Up to 200 patients</li>
              <li>Appointment scheduling</li>
              <li>Visit notes & history</li>
              <li>X-ray & photo storage (5 GB)</li>
              <li>Automated reminders</li>
            </ul>
            <Link to="/signup" className="btn-plan btn-plan-outline">Get started</Link>
          </div>

          <div className="pricing-card popular reveal reveal-delay-1" ref={addToRefs}>
            <div className="popular-badge">MOST POPULAR</div>
            <div className="plan-name">Practice</div>
            <div className="plan-desc">For growing dental practices.</div>
            <div className="plan-price">
              <span className="price-currency">Rs.</span>
              <span className="price-num">14,000</span>
              <span className="price-period">/mo</span>
            </div>
            <ul className="plan-features">
              <li>Unlimited patients</li>
              <li>Up to 3 practitioners</li>
              <li>Full imaging library (50 GB)</li>
              <li>SMS + Email reminders</li>
              <li>Analytics dashboard</li>
              <li>Priority support</li>
            </ul>
            <Link to="/signup" className="btn-plan btn-plan-filled">Start free trial</Link>
          </div>

          <div className="pricing-card reveal reveal-delay-2" ref={addToRefs}>
            <div className="plan-name">Group</div>
            <div className="plan-desc">For multi-location clinics.</div>
            <div className="plan-price">
              <span className="price-currency">Rs.</span>
              <span className="price-num">28,000</span>
              <span className="price-period">/mo</span>
            </div>
            <ul className="plan-features">
              <li>Unlimited everything</li>
              <li>Unlimited practitioners</li>
              <li>Multi-location support</li>
              <li>Custom integrations</li>
              <li>Dedicated onboarding</li>
            </ul>
            <Link to="/signup" className="btn-plan btn-plan-outline">Contact us</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-deco"></div>
        <div className="cta-deco-2"></div>
        <div className="section-label reveal" ref={addToRefs}>Get started today</div>
        <h2 className="reveal reveal-delay-1" ref={addToRefs}>
          Ready to run a <em>better</em> practice?
        </h2>
        <p className="cta-sub reveal reveal-delay-2" ref={addToRefs}>
          Try Dentique free for 14 days. No credit card required. Cancel anytime.
        </p>
        <div className="cta-actions reveal reveal-delay-3" ref={addToRefs}>
          <Link to="/signup" className="btn-hero">Start free trial →</Link>
          <a href="#demo" className="btn-hero-ghost">Book a demo <span>→</span></a>
        </div>
      </section>

    </div>
  );
};
