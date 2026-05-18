import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import "./styles.css";

const sections = ["Overview", "Site Plan", "Benefits", "FAQ", "About", "Contact"];

const sitePlanManifest = {
  viewBox: "0 0 465 635",
  width: 465,
  height: 635,
  layers: [
    { slug: "project_site", name: "Project Site", file: "/site-plan/project_site.svg", color: "#231f20", locked: true },
    { slug: "power_lines", name: "Power Lines", file: "/site-plan/power_lines.svg", color: "#dc7b29" },
    { slug: "sewer_lines", name: "Sewer Lines", file: "/site-plan/sewer_lines.svg", color: "#e162a5" },
    { slug: "culinary_water", name: "Culinary Water", file: "/site-plan/culinary_water.svg", color: "#00aeef" },
    { slug: "storm_water", name: "Storm Water", file: "/site-plan/storm_water.svg", color: "#40ae49" },
    { slug: "natural_gas", name: "Natural Gas", file: "/site-plan/natural_gas.svg", color: "#8053a2" },
    { slug: "fiber_optics", name: "Fiber Optics", file: "/site-plan/fiber_optics.svg", color: "#ffcf2d" }
  ]
};

function GradientButton({ href, children, subtle = false }) {
  const className = subtle ? "btn btn-secondary" : "btn btn-primary";
  return href ? <a className={className} href={href}>{children}</a> : <button className={className} type="button">{children}</button>;
}

function Logo({ light = false }) {
  return (
    <div className="logo-wrap">
      <div className="logo-mark" aria-hidden="true">
        <div className="logo-glow" />
        <div className="logo-glass" />
        <div className="logo-core" />
      </div>
      <div className="logo-text-wrap">
        <div className={light ? "logo-text light" : "logo-text"}>The Hive</div>
        <div className="logo-subtitle">Industrial Campus</div>
      </div>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function ImagePlaceholder({ label, tall = false }) {
  return (
    <div className={tall ? "image-placeholder tall" : "image-placeholder"}>
      <div className="image-grid" />
      <div className="placeholder-label">{label}</div>
    </div>
  );
}

function HexAccent() {
  return <div className="hex-accent" aria-hidden="true" />;
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="nav-card">
        <Logo />
        <div className="nav-links">
          {sections.slice(0, 5).map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}>{item}</a>
          ))}
        </div>
        <a className="nav-cta" href="#contact">Contact Us</a>
        <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? "x" : "menu"}
        </button>
      </nav>
      {open && (
        <div className="mobile-menu">
          {sections.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setOpen(false)}>{item}</a>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="overview" className="hero section-pad">
      <HexAccent />
      <div className="container hero-grid">
        <motion.div className="hero-card" initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="eyebrow-pill">Precision Synergy</div>
          <h1>A connected campus for modern growth.</h1>
          <p>The Hive is a thoughtfully planned innovation park designed to support technology-ready users, resilient infrastructure, long-term employment, and meaningful community value.</p>
          <div className="button-row">
            <GradientButton href="#site-plan">Explore Site Plan &rarr;</GradientButton>
            <GradientButton href="#contact" subtle>Get Updates</GradientButton>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 32, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
          <ImagePlaceholder label="Hero aerial / campus rendering placeholder" tall />
        </motion.div>
      </div>
    </section>
  );
}

function KeyHighlights() {
  const stats = ["Strategic acreage", "Technology-ready campus", "Privately funded infrastructure", "Natural buffers & open space"];
  return (
    <section className="section-pad surface-low">
      <Reveal className="container split-grid">
        <div>
          <p className="section-kicker">Key Highlights</p>
          <h2>Planned for scale. Designed for fit.</h2>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={stat} className="feature-card">
              <div className="card-watermark" />
              <div className="stat-number">0{index + 1}</div>
              <p>{stat}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function FallbackLayerSvg({ layers }) {
  return (
    <svg className="fallback-map" viewBox={sitePlanManifest.viewBox} role="img" aria-label="Fallback utility layer preview">
      <rect width="465" height="635" fill="#fbfbfb" />
      <g opacity="0.07" stroke="#2d2f2f" strokeWidth="1">
        {Array.from({ length: 13 }).map((_, i) => <line key={`v-${i}`} x1={i * 38} y1="0" x2={i * 38} y2="635" />)}
        {Array.from({ length: 17 }).map((_, i) => <line key={`h-${i}`} x1="0" y1={i * 38} x2="465" y2={i * 38} />)}
      </g>
      {layers.project_site && <path d="M 351 176 L 351 246 L 318 309 L 318 373 L 279 384 L 279 404 L 251 404 L 251 413 L 198 414 L 145 404 L 111 379 L 90 399 L 8 388 L -12 464 L 30 459 L 234 459 L 234 427 L 346 427 L 346 431 L 412 430 L 420 413 L 420 285 L 414 286 L 414 207 L 405 207 L 405 189 L 352 169 Z" fill="none" stroke="#231f20" strokeWidth="2.4" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" />}
      {layers.power_lines && <g stroke="#dc7b29" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M 426 11 L 427 361" /><path d="M 132 135 L 453 135" /><path d="M 15 325 L 58 240 L 133 135" /><path d="M 146 465 L 453 465" /><path d="M 147 465 L 277 622" /></g>}
      {layers.sewer_lines && <g stroke="#e162a5" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M 421 11 L 421 208" /><path d="M 421 129 L 453 129" /><path d="M 208 495 L 209 488 L 252 488 L 252 473 L 453 473" /><path d="M 418 434 L 411 471" /></g>}
      {layers.culinary_water && <g stroke="#00aeef" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M 430 12 L 429 388 L 428 417 L 409 490" /><path d="M 324 138 L 430 138" /><path d="M 153 468 L 453 468" /><path d="M 153 468 L 281 623" /></g>}
      {layers.storm_water && <g stroke="#40ae49" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M 423 11 L 424 417 L 411 453" /><path d="M 255 132 L 453 132" /><path d="M 332 463 L 453 462" /></g>}
      {layers.natural_gas && <g stroke="#8053a2" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M 272 622 L 142 464 C 136 456 118 435 113 428 C 103 416 91 405 84 399 C 75 392 55 380 50 375 C 46 370 44 366 43 363" /><path d="M 417 11 L 418 208" /><path d="M 140 462 L 234 463" /></g>}
      {layers.fiber_optics && <g stroke="#ffcf2d" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 4"><path d="M 260 126 L 452 126" /><path d="M 330 458 L 452 458" /></g>}
    </svg>
  );
}

function SitePlanLayerViewer() {
  const initialLayers = useMemo(() => Object.fromEntries(sitePlanManifest.layers.map((layer) => [layer.slug, true])), []);
  const [layers, setLayers] = useState(initialLayers);
  const [failedImages, setFailedImages] = useState({});
  const toggle = (slug) => setLayers((current) => ({ ...current, [slug]: !current[slug] }));
  const markFailed = (slug) => setFailedImages((current) => ({ ...current, [slug]: true }));
  const anyImageFailed = Object.values(failedImages).some(Boolean);

  return (
    <div className="map-card">
      <div className="layer-panel">
        <div className="layer-title">Map Layers</div>
        <div className="layer-grid">
          {sitePlanManifest.layers.map((layer) => (
            <button key={layer.slug} type="button" disabled={layer.locked} onClick={() => !layer.locked && toggle(layer.slug)} className={`layer-toggle ${layers[layer.slug] ? "active" : "inactive"} ${layer.locked ? "locked" : ""}`}>
              <span style={{ backgroundColor: layer.color }} />
              {layer.name}
            </button>
          ))}
        </div>
      </div>
      <div className="map-stage">
        <div className="map-glow" />
        <FallbackLayerSvg layers={layers} />
        {sitePlanManifest.layers.map((layer, index) => (
          layers[layer.slug] && !failedImages[layer.slug] ? (
            <img key={layer.slug} src={layer.file} alt={layer.name} className="map-layer-image" style={{ zIndex: index + 2 }} onError={() => markFailed(layer.slug)} loading={index === 0 ? "eager" : "lazy"} />
          ) : null
        ))}
        {anyImageFailed && <div className="map-note">Preview fallback shown. For exact production layers, place SVGs in <strong>/public/site-plan/</strong>.</div>}
      </div>
    </div>
  );
}

function SitePlan() {
  const parcels = ["Parcel A", "Parcel B", "Parcel C", "Parcel D", "Parcel E", "Parcel F", "Parcel G", "Parcel H"];
  const utilities = ["Power", "Water", "Fiber", "Roads", "Natural Gas", "Open Space"];
  return (
    <section id="site-plan" className="section-pad surface-base">
      <div className="container">
        <Reveal className="section-heading-row">
          <div className="heading-copy">
            <p className="section-kicker">Site Plan</p>
            <h2>Interactive plan, parcel status, and infrastructure layers.</h2>
          </div>
          <div className="chip-row">{utilities.map((item) => <span key={item} className="chip">{item}</span>)}</div>
        </Reveal>
        <Reveal className="site-plan-grid" delay={0.08}>
          <SitePlanLayerViewer />
          <div className="parcel-card">
            <h3>Parcel Status</h3>
            <div className="parcel-list">
              {parcels.map((parcel, index) => (
                <div key={parcel} className={index % 2 === 0 ? "parcel-row alt" : "parcel-row"}>
                  <div><strong>{parcel}</strong><p>Flexible acreage - Infrastructure-ready</p></div>
                  <span>Available</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: "Lightning", title: "Infrastructure", body: "Planned power, water, road, and connectivity improvements for future-ready users." },
    { icon: "People", title: "Economic Value", body: "A long-term tax base, construction activity, and high-quality employment opportunities." },
    { icon: "Growth", title: "Community Fit", body: "Meaningful buffers, open-space planning, and a measured approach to growth." }
  ];
  return (
    <section id="benefits" className="section-pad surface-low">
      <Reveal className="container split-grid">
        <div><p className="section-kicker">Community Benefits</p><h2>Growth that compounds locally.</h2></div>
        <div className="benefit-list">{items.map((item) => <div key={item.title} className="benefit-card"><div className="benefit-icon">{item.icon}</div><h3>{item.title}</h3><p>{item.body}</p></div>)}</div>
      </Reveal>
    </section>
  );
}

function MediaBand() {
  return <section className="section-pad surface-base"><Reveal className="container media-grid"><ImagePlaceholder label="Community / landscape image placeholder" /><ImagePlaceholder label="Infrastructure / road image placeholder" /></Reveal></section>;
}

function FAQ() {
  const faqs = ["What is being proposed at The Hive?", "How will infrastructure improvements be funded?", "How will nearby properties be buffered?", "How can community members stay involved?"];
  return (
    <section id="faq" className="section-pad surface-low">
      <Reveal className="container narrow">
        <p className="section-kicker">FAQ</p><h2>Common questions</h2>
        <div className="faq-list">{faqs.map((question) => <details key={question} className="faq-item"><summary>{question}<span>v</span></summary><p>Placeholder answer copy. Replace this with project-specific messaging, approvals, timelines, and community commitments.</p></details>)}</div>
      </Reveal>
    </section>
  );
}

function About() {
  return <section id="about" className="section-pad surface-base"><Reveal className="container about-grid"><div className="about-card"><div className="large-icon">Building</div><h2>About The Hive</h2><p>The Hive brings together land planning, infrastructure, and community-centered design to create a campus that supports responsible growth.</p><GradientButton href="#contact">Contact the team &rarr;</GradientButton></div><ImagePlaceholder label="About / team / regional image placeholder" tall /></Reveal></section>;
}

function Contact() {
  return (
    <section id="contact" className="section-pad surface-low">
      <Reveal className="container contact-grid">
        <div><p className="section-kicker">Get Involved</p><h2>Stay connected as the project moves forward.</h2><div className="contact-list"><p>Email: hello@thehive.example</p><p>Phone: (000) 000-0000</p><p>Location: Regional location placeholder</p></div><button className="download-button" type="button">Download project boards</button></div>
        <form className="contact-form"><input placeholder="First Name" /><input placeholder="Email" /><textarea placeholder="Message" /><button type="button">Send</button></form>
      </Reveal>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><div className="container footer-grid"><div><Logo light /><p>Supporting responsible growth, infrastructure readiness, and interconnected opportunity.</p></div><div className="footer-links">{sections.map((section) => <a key={section} href={`#${section.toLowerCase().replace(" ", "-")}`}>{section}</a>)}</div></div><div className="container footer-meta">© 2026 The Hive. Privacy Policy - Cookie Policy - Notice at Collection</div></footer>;
}

export default function App() {
  return (
    <main className="app">
      <Nav />
      <Hero />
      <KeyHighlights />
      <SitePlan />
      <Benefits />
      <MediaBand />
      <FAQ />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
