// --- FILE: frontend/src/components/ZodiacCard.js (THE TAROT CARD VERSION) ---

import React from 'react';
import { motion } from 'framer-motion';

const ZodiacCard = ({ sign, isFlipped }) => {
  if (!sign) return null;
  const rarityWidth = (sign.absurdity || 1) * 20;

  const cardVariants = {
    unflipped: { rotateY: 0 },
    flipped: { rotateY: 180 }
  };

  return (
    // This is the container that will handle the 3D perspective for the flip
    <div style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-[500px]" // Set a fixed height for the card area
        style={{ transformStyle: 'preserve-3d' }}
        variants={cardVariants}
        initial="unflipped"
        animate={isFlipped ? "flipped" : "unflipped"}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {/* --- Card Back --- */}
        <div
          className="absolute w-full h-full bg-gradient-to-br from-purple-800 via-gray-900 to-indigo-900 border-2 border-purple-400 rounded-2xl flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-6xl text-purple-300 animate-pulse">🔮</div>
        </div>

        {/* --- Card Front (The actual content) --- */}
        <div
          className="absolute w-full h-full bg-gray-900/80 border border-purple-500 rounded-2xl p-6 text-left shadow-2xl space-y-4 flex flex-col"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <div className="text-center border-b border-purple-800 pb-3">
            <h2 className="text-3xl font-bold text-cyan-400">{sign.emoji} {sign.name}</h2>
            <p className="text-purple-400 italic">Part of the "{sign.constellation}" constellation</p>
          </div>
          <div className="flex-grow space-y-3 overflow-y-auto pr-2">
            <div>
              <h3 className="font-bold text-lg text-purple-300 mb-1">The Prophecy</h3>
              <p className="text-gray-300 italic">"{sign.prophecy}"</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-purple-300 mb-1">The Card's Symbolism</h3>
              <p className="text-gray-400"><strong className="text-cyan-400">Imagery:</strong> "{sign.description}"</p>
              <p className="mt-2 text-gray-400"><strong className="text-cyan-400">Interpretation:</strong> {sign.symbolism}</p>
            </div>
          </div>
          <div className="border-t border-purple-800 pt-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-bold text-gray-400">Absurdity Level</p>
              {sign.rare && (<span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">RARE</span>)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2.5 rounded-full" style={{ width: `${rarityWidth}%` }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ZodiacCard;