// --- FILE: frontend/src/components/ConstellationMap.js (FULL CODE WITH CLICK-TO-ZOOM) ---

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Ensure framer-motion is installed: npm install framer-motion

// Sub-component for generating background stars within each constellation area
const BackgroundStars = ({ count = 50, constellationName, isZoomed }) => {
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const newStars = [];
      const starsToGenerate = isZoomed ? count * 2 : count; // More stars if zoomed
      const maxStarSize = isZoomed ? 3 : 2; // Slightly larger max size when zoomed

      for (let i = 0; i < starsToGenerate; i++) {
        const size = Math.random() * maxStarSize + 0.8; // Stars from 0.8px to maxStarSize
        const delay = Math.random() * 5; // Animation delay for varied twinkling
        const duration = Math.random() * 3 + 2; // Animation duration
        const top = Math.random() * 100; // % position
        const left = Math.random() * 100; // % position
        const opacity = Math.random() * 0.7 + 0.3; // Varying opacity

        newStars.push({ size, delay, duration, top, left, opacity });
      }
      setStars(newStars);
    }
    // Re-generate stars if zoom state or constellation changes
  }, [count, constellationName, isZoomed]);

  return (
    <div ref={containerRef} className="background-stars-container">
      {stars.map((star, index) => (
        <div
          key={index}
          className="background-star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: `var(--initial-opacity, ${star.opacity})`, // Use CSS var for initial opacity
          }}
        ></div>
      ))}
    </div>
  );
};


// This sub-component draws the beautiful, faint lines between stars
const ConstellationLines = ({ constellationName }) => {
  // Adjusted paths to better align with planned sign-node positions for better visual coherence
  const paths = {
    'Haunted Technology': "M 55 100 L 55 240 L 255 240 L 255 100 Z", // Closed loop
    'Absurd Nostalgia': "M 155 40 L 280 160 L 155 280 L 30 160 Z",
    'Cosmic Isolation': "M 40 250 Q 155 50 270 250 L 155 50 Z", // Connects back to middle point
    'Domestic Surrealism': "M 60 220 L 60 120 L 155 40 L 250 120 L 250 220 Z" // Closed loop
  };
  return <svg className="constellation-lines-svg" viewBox="0 0 310 320"><path d={paths[constellationName] || ""} /></svg>;
};

const ConstellationMap = ({ userSign, allSigns, onClose }) => {
  const [selectedSign, setSelectedSign] = useState(userSign);
  const [zoomedConstellation, setZoomedConstellation] = useState(null); // NEW STATE for zoom

  const constellations = useMemo(() => allSigns.reduce((acc, sign) => {
    (acc[sign.constellation] = acc[sign.constellation] || []).push(sign);
    return acc;
  }, {}), [allSigns]);

  // This useEffect fixes the "black screen" bug when switching tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
        document.body.classList.toggle('animations-paused', document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleConstellationClick = (name, signToSelect = null) => {
    // If we're clicking on a constellation to zoom into it (or click a sign in overview)
    if (zoomedConstellation !== name) {
      setZoomedConstellation(name); // Zoom into this constellation
      // Determine which sign should be selected:
      // 1. If a specific sign was clicked (signToSelect is not null)
      // 2. If the user's sign is within this constellation
      // 3. Otherwise, select the first sign of this constellation
      setSelectedSign(signToSelect || signsInConstellation[name].find(s => s.name === userSign.name) || signsInConstellation[name][0]);
    } else {
      // We are already zoomed into this constellation. Now, clicking a sign should just select it.
      if (signToSelect) {
        setSelectedSign(signToSelect);
      }
    }
  };

  const handleZoomOut = () => {
    setZoomedConstellation(null);
    setSelectedSign(userSign); // Always revert to the user's sign when zooming out
  };

  // Define explicit positions for sign nodes per constellation
  // These positions are percentages relative to the parent container (signs-container)
  // These are *approximate* and designed to fit the SVG paths
  const signNodePositions = {
    'Haunted Technology': [
      { top: '30%', left: '20%' }, // Node 1
      { top: '30%', left: '80%' }, // Node 2
      { top: '75%', left: '20%' }, // Node 3
      { top: '75%', left: '80%' }  // Node 4
    ],
    'Absurd Nostalgia': [
      { top: '15%', left: '50%' },  // Node 1
      { top: '50%', left: '90%' },  // Node 2
      { top: '85%', left: '50%' },  // Node 3
      { top: '50%', left: '10%' }   // Node 4
    ],
    'Cosmic Isolation': [
      { top: '75%', left: '15%' },  // Node 1
      { top: '20%', left: '50%' },  // Node 2 (Peak of the curve)
      { top: '75%', left: '85%' },  // Node 3 (End of the curve)
      { top: '50%', left: '35%' } // Node 4 - Center point for Cosmic Isolation
    ],
    'Domestic Surrealism': [
      { top: '70%', left: '20%' },  // Node 1
      { top: '20%', left: '50%' },  // Node 2
      { top: '70%', left: '80%' },  // Node 3
      { top: '40%', left: '80%' }   // Node 4
    ]
  };

  // Helper to get signs for a given constellation name
  const signsInConstellation = useMemo(() => {
    const map = {};
    Object.entries(constellations).forEach(([name, signs]) => {
      map[name] = signs;
    });
    return map;
  }, [constellations]);


  return (
    <motion.div className="constellation-map-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Background stars for the entire map */}
      <div className="stars-bg stars1"></div>
      <div className="stars-bg stars2"></div>
      <div className="stars-bg stars3"></div>

      <div className="constellation-map-content">
        <div className="constellation-map-header">
          <h2 className="text-4xl font-bold">The Cosmic Map</h2>
          {/* Change button based on zoom state */}
          {zoomedConstellation ? (
            <button onClick={handleZoomOut} className="close-button">← Back to Map</button>
          ) : (
            <button onClick={onClose} className="close-button">← Back to Result</button>
          )}
        </div>
        
        {/* AnimatePresence allows components to animate in/out when added/removed from the tree */}
        <AnimatePresence mode="wait"> {/* 'wait' mode ensures one component finishes animating out before the next animates in */}
          {zoomedConstellation ? (
            // RENDER ONLY THE ZOOMED CONSTELLATION
            <motion.div
              key={zoomedConstellation} // Key must be unique for AnimatePresence
              layoutId={`constellation-${zoomedConstellation.toLowerCase().replace(/\s+/g, '-')}`} // Matches the layoutId in the grid view
              className="zoomed-constellation-view" // NEW CLASS for styling the zoomed state
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 20 }} // Smoother spring transition
            >
              {Object.entries(constellations).map(([name, signs]) => (
                name === zoomedConstellation && ( // Only render the selected constellation
                  <div key={name} className={`constellation-group active-constellation constellation-${name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <h3 className="constellation-name">{name}</h3>
                    <div className="signs-container">
                      {/* More background stars for a denser feel when zoomed */}
                      <BackgroundStars count={100} constellationName={name} isZoomed={true} />
                      <ConstellationLines constellationName={name} />
                      {signs.map((sign, index) => {
                        const position = signNodePositions[name] && signNodePositions[name][index] ? signNodePositions[name][index] : { top: '50%', left: '50%' };
                        return (
                          <button
                            key={sign.name}
                            onClick={() => setSelectedSign(sign)} // Now this just selects the sign
                            className={`sign-node sign-node-${index + 1} ${userSign.name === sign.name ? 'user-sign' : ''} ${selectedSign.name === sign.name ? 'selected-sign' : ''}`}
                            style={{ top: position.top, left: position.left }}
                          >
                            <div className="star"></div>
                            <div className="sign-tooltip">{sign.emoji} {sign.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </motion.div>
          ) : (
            // RENDER THE OVERVIEW GRID (when not zoomed)
            <motion.div
              key="constellations-grid-overview" // Unique key for AnimatePresence
              layout // This makes the entire grid animate its layout changes
              className="constellations-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 20 }}
            >
              {Object.entries(constellations).map(([name, signs]) => (
                <motion.div
                  key={name}
                  layoutId={`constellation-${name.toLowerCase().replace(/\s+/g, '-')}`} // Unique ID for Framer Motion layout transition
                  className={`constellation-group ${userSign.constellation === name ? 'active-constellation' : ''} constellation-${name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleConstellationClick(name)} // Click to zoom into this constellation
                  whileHover={{ scale: 1.05 }} // Subtle hover effect for clickable groups
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="constellation-name">{name}</h3>
                  <div className="signs-container">
                    <BackgroundStars count={70} constellationName={name} isZoomed={false} />
                    <ConstellationLines constellationName={name} />
                    {signs.map((sign, index) => {
                      const position = signNodePositions[name] && signNodePositions[name][index] ? signNodePositions[name][index] : { top: '50%', left: '50%' };
                      return (
                        <button
                          key={sign.name}
                          // Stop propagation so clicking a sign doesn't also trigger constellation group click immediately
                          onClick={(e) => { e.stopPropagation(); handleConstellationClick(name, sign); }}
                          className={`sign-node sign-node-${index + 1} ${userSign.name === sign.name ? 'user-sign' : ''} ${selectedSign.name === sign.name ? 'selected-sign' : ''}`}
                          style={{ top: position.top, left: position.left }}
                        >
                          <div className="star"></div>
                          <div className="sign-tooltip">{sign.emoji} {sign.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedSign && (
          <motion.div key={selectedSign.name} className="compatibility-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h4 className="font-bold text-xl">{selectedSign.emoji} {selectedSign.name}</h4>
            <p className="italic text-gray-300 mt-1">"{selectedSign.compatibility}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConstellationMap;