// --- FILE: frontend/src/components/VibeCheck.js ---

import React from 'react';

const VibeCheck = ({ tags, isLoading, error }) => {
  if (isLoading) {
    return <p className="text-lg mt-4 text-cyan-300">Analyzing your vibe...</p>;
  }

  if (error) {
    return <p className="mt-4 text-red-400">{error}</p>;
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gray-800/50 backdrop-blur-sm border border-green-500 rounded-2xl">
      <h3 className="text-2xl font-bold text-green-400 mb-4">Your True Vibe Check</h3>
      <p className="text-gray-400 mb-6">The Qloo AI found that your tastes are defined by these core tags:</p>
      
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-700 text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
            #{tag.replace(/\s+/g, '')} {/* Format as hashtags */}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VibeCheck;