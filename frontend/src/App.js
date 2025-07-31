// --- FILE: frontend/src/App.js (THE FINAL VERSION WITH CONSTELLATION MAP) ---

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { TypeAnimation } from 'react-type-animation';
import './App.css';
import ZodiacCard from './components/ZodiacCard.js';
import VibeCheck from './components/VibeCheck.js';
import TasteTwin from './components/TasteTwin.js';
import ConstellationMap from './components/ConstellationMap.js';

function App() {
  // --- MUSIC PLAYER ---
  const ORACLE_OFFERINGS = [
  { type: 'movie', name: 'Spirited Away' },
  { type: 'artist', name: 'Daft Punk' },
  { type: 'game', name: 'Stardew Valley' },
  { type: 'book', name: 'Dune' },
  { type: 'tv', name: 'Arcane' },
  { type: 'movie', name: 'Blade Runner 2049' },
  { type: 'artist', name: 'FKA Twigs' },
  { type: 'game', name: 'Hades' },
];

  useEffect(() => {
    const audio = new Audio('/oracle_music.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    const playAudio = () => {
      audio.play().catch(error => console.log("User interaction needed to play audio."));
      window.removeEventListener('click', playAudio);
    };
    window.addEventListener('click', playAudio);
    return () => {
      audio.pause();
      window.removeEventListener('click', playAudio);
    };
  }, []);

  // --- STATE MANAGEMENT ---
  const [inputs, setInputs] = useState([{ type: 'movie', name: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zodiacResult, setZodiacResult] = useState(null);
  const resultCardRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [tasteTags, setTasteTags] = useState(null);
  const [tasteTwin, setTasteTwin] = useState(null);
  
  // --- State for new features ---
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [allSigns, setAllSigns] = useState([]);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // --- Effect for Voice-Over and Card Flip ---
  useEffect(() => {
    if (zodiacResult) {
      // Play the audio immediately. It has 2s of silence, so the sound will be heard at T+2s.
      const voiceTimeout = setTimeout(() => {
        const voice = new Audio('/oracle_voice.mp3');
        voice.play();
      }, 100);

      // Flip the card ~3.5 seconds later, giving the voice time to play.
      const flipTimeout = setTimeout(() => {
        setIsCardFlipped(true);
      }, 3500); 

      return () => {
        clearTimeout(voiceTimeout);
        clearTimeout(flipTimeout);
      };
    }
  }, [zodiacResult]);


  // --- HANDLER FUNCTIONS ---
  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    setInputs([...inputs, { type: 'movie', name: '' }]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setZodiacResult(null);
    setTasteTags(null);
    setTasteTwin(null);
    setIsCardFlipped(false);
    setAllSigns([]); // Reset all signs

    const validInputs = inputs.filter(input => input.name.trim() !== '');
    if (validInputs.length === 0) {
      setError('The Oracle requires an offering. Please share a taste.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('https://cultural-zodiac.onrender.com/get-zodiac', {
        inputs: validInputs,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        const { result, all_signs } = response.data;
        const { taste_tags, taste_twin, ...zodiacData } = result;
        
        setZodiacResult(zodiacData);
        setTasteTags(taste_tags);
        setTasteTwin(taste_twin);
        setAllSigns(all_signs);
      }
    } catch (err) {
      setError('The cosmic rays are interfering! The server could not be reached.');
    } finally {
      setLoading(false);
    }
  };
  const handleOracleOffering = () => {
    // Pick a random offering from our list
    const offering = ORACLE_OFFERINGS[Math.floor(Math.random() * ORACLE_OFFERINGS.length)];
    // We will replace the *first* input field with the Oracle's choice
    setInputs([{...offering}, ...inputs.slice(1)]);
  };


  const handleCloseMap = () => {
    setIsMapVisible(false);
  };
  
  const handleDownloadImage = () => {
    if (resultCardRef.current) {
      const constellationColors = {"Haunted Technology": "#042f2e", "Absurd Nostalgia": "#4c1d95", "Cosmic Isolation": "#1e1b4b", "Domestic Surrealism": "#451a03"};
      const screenshotBg = zodiacResult ? constellationColors[zodiacResult.constellation] || '#111827' : '#111827';
      html2canvas(resultCardRef.current, { backgroundColor: screenshotBg, useCORS: true }).then((canvas) => {
        const imageName = zodiacResult ? `my-zodiac-${zodiacResult.name.toLowerCase().replace(/\s+/g, '-')}.png` : 'my-cultural-zodiac.png';
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = imageName;
        link.click();
      });
    }
  };

  const handleCopyText = () => {
    if (!zodiacResult) return;
    const shareText = `The Oracle has spoken! My Cultural Zodiac is the ${zodiacResult.name} ${zodiacResult.emoji}\n\nThe Prophecy: "${zodiacResult.prophecy}"\n\nDiscover your own sign here 👉 [Your App URL]\n#CulturalZodiac`;
    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setZodiacResult(null);
    setError('');
    setTasteTags(null);
    setTasteTwin(null);
    setIsCardFlipped(false);
    setIsMapVisible(false); // Reset map visibility too
  };

  const currentGradient = zodiacResult ? 'bg-gradient-to-br ' + {
    "Haunted Technology": "from-teal-900 via-gray-900 to-green-900",
    "Absurd Nostalgia": "from-pink-800 via-indigo-900 to-purple-900",
    "Cosmic Isolation": "from-blue-900 via-black to-purple-900",
    "Domestic Surrealism": "from-amber-800 via-stone-900 to-lime-900"
  }[zodiacResult.constellation] : 'bg-gradient-to-br from-purple-800 via-gray-900 to-indigo-900';

  return (
    <div className={`min-h-screen text-white p-4 sm:p-8 font-sans transition-colors duration-1000 ${currentGradient}`}>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Cultural Zodiac <span className="crystal-ball-glow">🔮</span>
          </h1>
          <p className="text-lg text-gray-300">Discover your true internet-self.</p>
        </header>

        <main className="min-h-[500px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            {isMapVisible ? (
              <ConstellationMap
                userSign={zodiacResult}
                allSigns={allSigns}
                onClose={handleCloseMap}
              />
            ) : (
              <>
                {/* SCREEN 1: THE INPUT FORM */}
                {!zodiacResult && !loading && !error && (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                      <p className="text-center text-lg text-gray-400 italic mb-6">✨ Step closer, curious soul... Offer your tastes to the swirling mist.</p>
                      <div className="space-y-4">
                        {inputs.map((input, index) => (
                          <div key={index} className="flex gap-4">
                            <select className="border p-2 rounded w-1/3 bg-gray-700 text-white border-gray-600 focus:ring-purple-500 focus:border-purple-500" value={input.type} onChange={(e) => handleChange(index, 'type', e.target.value)}>
                              <option value="movie">Movie</option><option value="artist">Artist</option><option value="book">Book</option><option value="tv">TV Show</option><option value="game">Game</option>
                            </select>
                            <input type="text" className="border p-2 rounded flex-1 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500" placeholder="Enter name..." value={input.name} onChange={(e) => handleChange(index, 'name', e.target.value)} />
                          </div>
                        ))}
                      </div>
                        <div className="flex justify-center items-center gap-4 pt-6 mt-6 border-t border-gray-700">
                        <button onClick={addInput} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all">+ Add Another</button>
                        
                        <button onClick={handleOracleOffering} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl transition-all animate-pulse">
                          ✨ Let the Oracle Choose
                        </button>

                        <button onClick={handleSubmit} disabled={loading} className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:bg-gray-600 disabled:cursor-not-allowed">
                          Reveal My Sign
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCREEN 2: THE LOADING ORACLE */}
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }} exit={{ opacity: 0 }}>
                    <div className="text-center p-8 min-h-[300px] flex flex-col justify-center">
                      <motion.div className="text-6xl mx-auto" animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                        🔮
                      </motion.div>
                      <p className="text-2xl mt-6 text-purple-300">The Oracle is peering into the swirling mists...</p>
                    </div>
                  </motion.div>
                )}

                {/* SCREEN 3: ERROR MESSAGE */}
                {error && !loading && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-xl inline-block text-center">
                      <p className="font-bold text-lg">A disturbance in the ether!</p>
                      <p className="mt-2">{error}</p>
                      <button onClick={handleReset} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold px-5 py-2 rounded-xl transition-all">Try Again</button>
                    </div>
                  </motion.div>
                )}
                
                {/* SCREEN 4: THE RESULT */}
                {zodiacResult && (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold mb-4 text-center">
                      <TypeAnimation
                        sequence={[ 2000, 'The stars have spoken...' ]}
                        wrapper="span"
                        speed={50}
                        cursor={false}
                      />
                    </h2>
                    
                    <div ref={resultCardRef} className="p-4 sm:p-8 bg-gray-900/20 rounded-2xl max-w-2xl mx-auto">
                      <ZodiacCard sign={zodiacResult} isFlipped={isCardFlipped} />
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: isCardFlipped ? 1 : 0 }} 
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                         <VibeCheck tags={tasteTags} />
                         <TasteTwin twin={tasteTwin} />
                      </motion.div>
                    </div>

                    <motion.div 
                      className="mt-4 p-6 flex flex-wrap justify-center gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isCardFlipped ? 1 : 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <button onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-5 py-2 rounded-xl transition-all">Spin Again</button>
                      <button onClick={handleCopyText} disabled={isCopied} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl transition-all disabled:bg-gray-500">
                        {isCopied ? 'Copied!' : 'Copy Prophecy'}
                      </button>
                      <button onClick={handleDownloadImage} className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-xl transition-all">Download Image</button>
                      <button onClick={() => setIsMapVisible(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl transition-all">
                        View Constellation Map
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;



