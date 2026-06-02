import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { hiveGeojson } from "../data/hiveGeojson";
import "./HiveMapPage.css";

const AERIAL_IMAGE_SRC = "/images/hive-aerial-1.jpg";

const layerMeta = {
  entire_site: { name: "Entire Site", color: "#231f20", fill: "rgba(45,47,47,.08)", stroke: "#231f20" },
  future_phases: { name: "Next Phases", color: "#dc7b29", fill: "rgba(220,123,41,.24)", stroke: "#dc7b29" },
  phase1: { name: "Phase 1", color: "#ffc21c", fill: "rgba(255,194,28,.36)", stroke: "#ffc21c" }
};

function projectPoint([lng, lat], bounds, width, height, pad = 58) {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  
  const meanLat = (minLat + maxLat) / 2;
  const latRad = meanLat * Math.PI / 180;
  const cosLat = Math.cos(latRad);
  
  const dx = (maxLng - minLng) * cosLat;
  const dy = (maxLat - minLat);
  
  const availWidth = width - pad * 2;
  const availHeight = height - pad * 2;
  
  const scale = Math.min(availWidth / dx, availHeight / dy);
  
  const actualW = dx * scale;
  const actualH = dy * scale;
  const offsetX = pad + (availWidth - actualW) / 2;
  const offsetY = pad + (availHeight - actualH) / 2;
  
  const x = offsetX + ((lng - minLng) * cosLat) * scale;
  const y = height - (offsetY + ((lat - minLat) * scale));
  
  return [x, y];
}

function getBounds(features) {
  const coords = features.flatMap((feature) => feature.geometry.coordinates.flat());
  const lngs = coords.map(([lng]) => lng);
  const lats = coords.map(([, lat]) => lat);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}

function InteractiveHiveMap() {
  const initialLayers = useMemo(() => Object.fromEntries(hiveGeojson.features.map((feature) => [feature.properties.category, feature.properties.category !== 'future_phases'])), []);
  const [layers, setLayers] = useState(initialLayers);
  const [active, setActive] = useState(null);
  const bounds = useMemo(() => getBounds(hiveGeojson.features), []);
  const width = 1100;
  const height = 720;

  const legendFeatures = useMemo(() => {
    const order = { entire_site: 1, phase1: 2, future_phases: 3 };
    return [...hiveGeojson.features].sort((a, b) => order[a.properties.category] - order[b.properties.category]);
  }, []);

  const mapFeatures = useMemo(() => {
    const order = { entire_site: 1, future_phases: 2, phase1: 3 };
    return [...hiveGeojson.features].sort((a, b) => order[a.properties.category] - order[b.properties.category]);
  }, []);

  const toggle = (slug) => setLayers((current) => ({ ...current, [slug]: !current[slug] }));

  return (
    <div className="map-card hive-map-card">
      <div className="map-stage hive-map-stage">
        <img 
          src={AERIAL_IMAGE_SRC} 
          alt="Aerial view of The Hive site" 
          className="map-aerial"
          style={{
            transform: `translate(7.636%, 3.611%) scale(1.5) rotate(-0.7deg)`
          }}
        />
        <div className="map-aerial-overlay" />
        <div className="map-glow" />
        <svg className="fallback-map" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="The Hive phased parcel layer map">
          <rect width={width} height={height} fill="transparent" />
          {mapFeatures.map((feature) => {
            const slug = feature.properties.category;
            const meta = layerMeta[slug];
            if (!layers[slug]) return null;
            const path = feature.geometry.coordinates[0].map((coord, index) => {
              const [x, y] = projectPoint(coord, bounds, width, height, 74);
              return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(" ") + " Z";
            return (
              <motion.path
                key={slug}
                d={path}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: active && active !== slug ? 0.36 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                fill={meta.fill}
                stroke={meta.stroke}
                strokeWidth={slug === "entire_site" ? 3.5 : 3}
                strokeLinejoin="round"
              />
            );
          })}
        </svg>
        <img 
          src="/images/RAIL LINE.svg" 
          alt="Rail Line" 
          className="map-rail-line"
          style={{
            transform: `translate(0%, 0%) scale(1) rotate(0deg)`
          }}
        />
        <div className="map-note">Toggle boundaries for the full project site, Phase 1, and Next Phases.</div>
      </div>

      <div id="layers" className="layer-panel">
        <div className="layer-title">Map Layers</div>
        <div className="layer-grid">
          {legendFeatures.map((feature) => {
            const slug = feature.properties.category;
            const meta = layerMeta[slug];
            return (
              <button
                key={slug}
                type="button"
                onClick={() => toggle(slug)}
                onMouseEnter={() => setActive(slug)}
                onMouseLeave={() => setActive(null)}
                className={`layer-toggle ${layers[slug] ? "active" : "inactive"}`}
              >
                <span style={{ backgroundColor: meta.color }} />
                {meta.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HiveMapPage() {
  return (
    <section id="site-plan" className="section-pad surface-base single-map-section">
      <div className="container">
        <motion.div
          className="section-heading-row map-heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="heading-copy">
            <p className="section-kicker">Site Plan</p>
            <h2>Interactive phased parcel map.</h2>
            <p className="map-intro">Explore The Hive outline, Phase 1 boundary, and next development phases as individual toggleable layers.</p>
          </div>
          <div className="chip-row">
            <span className="chip">Entire Site</span>
            <span className="chip">Phase 1</span>
            <span className="chip">Next Phases</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <InteractiveHiveMap />
          <p style={{ marginTop: '20px', fontSize: '11px', color: 'var(--muted, #575b5b)', textAlign: 'center', lineHeight: '1.5' }}>
            Site boundaries, phases, and overlays are conceptual and for illustrative purposes only. Acreage, ownership boundaries, and development phases are preliminary and subject to refinement.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
