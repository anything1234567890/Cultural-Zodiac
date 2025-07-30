// --- FILE: frontend/src/components/TasteTwin.js ---

import React from 'react';

const TasteTwin = ({ twin }) => {
  if (!twin) return null;

  return (
    <div className="mt-8 p-6 bg-gray-800/50 backdrop-blur-sm border border-blue-500 rounded-2xl">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">Your Taste Twin</h3>
      <div className="text-center">
        <div className="text-5xl mb-3">{twin.emoji}</div>
        <h4 className="text-xl font-semibold text-white">{twin.name}</h4>
        <p className="text-gray-400 mt-2 italic">"{twin.bio}"</p>
      </div>
    </div>
  );
};

export default TasteTwin;