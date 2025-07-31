# --- FILE: backend/main.py (VERSION WITH CONSTELLATION DATA) ---

import os
import requests
import google.generativeai as genai
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import re

# --- Configuration & Setup ---
load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cultural-zodiac.netlify.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class ZodiacRequest(BaseModel):
    text: str

@app.api_route("/get-zodiac", methods=["POST", "OPTIONS"])
async def get_zodiac(request: Request):
    if request.method == "OPTIONS":
        return JSONResponse(content={"message": "CORS preflight success"}, status_code=200)

    body = await request.json()
    text = body.get("text")

    # TODO: Your actual zodiac logic goes here
    return {"zodiac": "Dreamwave"}


QLOO_API_KEY = os.getenv("QLOO_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not QLOO_API_KEY or not GEMINI_API_KEY:
    raise RuntimeError("API keys for Qloo or Gemini not found in .env file.")

genai.configure(api_key=GEMINI_API_KEY)

# --- [UPGRADED] Zodiac Signs Data with Compatibility ---
CULTURAL_ZODIAC_SIGNS = [
    { "name": "Neon Graveyard Poet", "emoji": "👾", "keywords": ["cyberpunk", "glitch", "ai", "melancholy", "dark", "digital", "ethereal"], "mood": "Melancholic", "era": "Futuristic", "absurdity": 3, "rare": False, "description": "A holographic bard singing binary laments for deleted souls.", "constellation": "Haunted Technology", "compatibility": "Finds a kindred spirit in the 'AI-Generated Appalachian Horror Folk,' sharing a love for uncanny, machine-born art." },
    { "name": "Time-Traveling Karaoke Virus", "emoji": "📼", "keywords": ["y2k", "pop", "glitch", "boy bands", "retro", "chaotic", "playful"], "mood": "Nostalgic", "era": "2000s", "absurdity": 4, "rare": True, "description": "A rogue MP3 that haunts your Winamp with distorted love ballads.", "constellation": "Haunted Technology", "compatibility": "Vibes with the 'VHS Fitness Instructor Ghost,' sharing a chaotic energy from a bygone millennium." },
    { "name": "Sentient IKEA Furniture Techno", "emoji": "🪑", "keywords": ["techno", "electronic", "minimalist", "absurd", "repetitive", "modern"], "mood": "Hypnotic", "era": "Modern", "absurdity": 4, "rare": False, "description": "A MALM dresser pulses with Swedish House Mafia—but the instructions are cursed.", "constellation": "Haunted Technology", "compatibility": "Forms a hypnotic duo with the 'Haunted Smart Fridge Ambient,' creating a soundtrack for modern, minimalist dread." },
    { "name": "Deceased ASMR YouTuber", "emoji": "👻", "keywords": ["asmr", "whispers", "eerie", "uncanny", "quiet", "intimate", "ghost"], "mood": "Uncanny", "era": "2020s", "absurdity": 5, "rare": True, "description": "10-hour loops of a ghost tapping on a phantom microphone.", "constellation": "Haunted Technology", "compatibility": "Shares a quiet, uncanny intimacy with the 'Black Hole Lounge Singer,' both understanding the sound of solitude." },
    { "name": "Abandoned Arcade Heartthrob", "emoji": "🕹️", "keywords": ["retro", "romance", "80s", "90s", "videogame", "nostalgic", "melancholy"], "mood": "Romantic", "era": "1990s", "absurdity": 3, "rare": False, "description": "Croons through broken speakers to ghosts of high scores past.", "constellation": "Absurd Nostalgia", "compatibility": "Is the perfect dance partner for the 'Abandoned Space Station Disco,' both hopelessly romantic and lost in time." },
    { "name": "Extinct Mall Mascot", "emoji": "🧸", "keywords": ["80s", "nostalgic", "campy", "lonely", "kitschy", "bittersweet"], "mood": "Bittersweet", "era": "1980s", "absurdity": 2, "rare": False, "description": "A forgotten fuzzball DJing to empty food courts at midnight.", "constellation": "Absurd Nostalgia", "compatibility": "Feels a deep, bittersweet kinship with the 'Sentient Laundry Machine Blues,' both finding poetry in mundane loneliness." },
    { "name": "Possessed Tamagotchi Grunge", "emoji": "🐣", "keywords": ["90s", "grunge", "angst", "noisy", "chaotic", "nostalgic", "tamagotchi"], "mood": "Angsty", "era": "1990s", "absurdity": 4, "rare": False, "description": "The ghost of your neglected virtual pet screams through a Game Boy mic.", "constellation": "Absurd Nostalgia", "compatibility": "Forms a noisy garage band with the 'Glitchy Victorian Dollhouse,' united by a love for chaotic, genre-bending sounds." },
    { "name": "VHS Fitness Instructor Ghost", "emoji": "💃", "keywords": ["80s", "fitness", "vhs", "energetic", "retro", "campy", "unhinged"], "mood": "Energetic", "era": "1980s", "absurdity": 3, "rare": True, "description": "A spandex-clad specter forever trapped in a 1989 Tae Bo tape.", "constellation": "Absurd Nostalgia", "compatibility": "Is the high-energy workout buddy to the 'Time-Traveling Karaoke Virus,' bringing campy chaos to any era." },
    { "name": "Black Hole Lounge Singer", "emoji": "🕳️", "keywords": ["jazz", "soulful", "noir", "space", "eerie", "timeless", "cosmic"], "mood": "Soulful", "era": "Timeless", "absurdity": 4, "rare": True, "description": "Smooth-voiced celestial trapped in an endless gravitational serenade.", "constellation": "Cosmic Isolation", "compatibility": "Sings a timeless duet with the 'Lunar Elevator Muzak,' filling the void with soulful, cosmic jazz." },
    { "name": "Ghost Ship Karaoke Night", "emoji": "🚢", "keywords": ["gothic", "nautical", "ethereal", "haunting", "pop", "karaoke"], "mood": "Haunting", "era": "Timeless", "absurdity": 3, "rare": False, "description": "A spectral cruise where the drowned crew belts off-key Whitney Houston.", "constellation": "Cosmic Isolation", "compatibility": "A surprisingly good time with the 'Extinct Mall Mascot,' as both know how to put on a show for a phantom audience." },
    { "name": "Lunar Elevator Muzak", "emoji": "🌙", "keywords": ["calm", "ambient", "jazz", "liminal", "futuristic", "lonely", "space"], "mood": "Calm", "era": "Futuristic", "absurdity": 3, "rare": False, "description": "Infinite elevator music for astronauts who miss Earthly boredom.", "constellation": "Cosmic Isolation", "compatibility": "Is the calm counterpoint to the 'Deceased ASMR YouTuber,' creating an atmosphere of ultimate, eerie tranquility." },
    { "name": "Abandoned Space Station Disco", "emoji": "🛸", "keywords": ["disco", "funk", "groovy", "isolated", "retro", "space", "sci-fi"], "mood": "Euphoric", "era": "Retro-futuristic", "absurdity": 4, "rare": True, "description": "The last party in the cosmos, dancing until the solar panels die.", "constellation": "Cosmic Isolation", "compatibility": "Finds its soulmate in the 'Abandoned Arcade Heartthrob,' ready to dance through the end of the universe together." },
    { "name": "Sentient Laundry Machine Blues", "emoji": "🧺", "keywords": ["blues", "lo-fi", "quirky", "urban", "wistful", "mundane"], "mood": "Wistful", "era": "Modern", "absurdity": 2, "rare": False, "description": "A melancholic Maytag crooning about static cling and solitude.", "constellation": "Domestic Surrealism", "compatibility": "Shares a wistful, lo-fi vibe with the 'Haunted Smart Fridge Ambient,' creating the perfect soundtrack for a rainy Tuesday." },
    { "name": "Glitchy Victorian Dollhouse", "emoji": "🎪", "keywords": ["gothic", "digital", "glitch", "whimsical", "victorian", "dnb"], "mood": "Whimsical", "era": "Victorian", "absurdity": 4, "rare": True, "description": "Where porcelain meets drum & bass in a haunted nursery.", "constellation": "Domestic Surrealism", "compatibility": "Connects with the 'Possessed Tamagotchi Grunge'; both appreciate the beauty of chaotic, glitchy aesthetics." },
    { "name": "AI-Generated Appalachian Horror Folk", "emoji": "🤖", "keywords": ["folk", "horror", "uncanny", "rustic", "dark", "glitch", "ai"], "mood": "Uncanny", "era": "Futuristic", "absurdity": 5, "rare": True, "description": "A hillbilly ChatGPT writes murder ballads for skinwalkers.", "constellation": "Domestic Surrealism", "compatibility": "Feels a strange connection to the 'Neon Graveyard Poet,' as both are poets born from the ghost in the machine." },
    { "name": "Haunted Smart Fridge Ambient", "emoji": "🧊", "keywords": ["ambient", "drone", "mundane", "uncanny", "minimalist", "modern"], "mood": "Hypnotic", "era": "Modern", "absurdity": 3, "rare": False, "description": "Your appliance composes ambient tracks about the yogurt you forgot in 2017.", "constellation": "Domestic Surrealism", "compatibility": "Is the minimalist counterpart to the 'Sentient IKEA Furniture Techno,' both creating the soundscape of modern life." }
]

# Pydantic Models... (unchanged)
class TasteInput(BaseModel): name: str; type: str
class TastePreferences(BaseModel): inputs: list[TasteInput]

# --- [UPGRADED] The "Golden Path" Demo Data ---
DEMO_DATA_MAP = {
    "blade runner_street fighter ii": {
        "name": "Abandoned Arcade Heartthrob", "emoji": "🕹️", "constellation": "Absurd Nostalgia", "description": "Croons through broken speakers to ghosts of high scores past.", "prophecy": "Your soul is a cassette tape of bittersweet 80s movie themes, forever chasing the neon-drenched high scores of yesterday.", "symbolism": "This sign reflects your love for retro-futuristic aesthetics and the romantic melancholy of a bygone digital era.", "absurdity": 3, "rare": False, "compatibility": "Is the perfect dance partner for the 'Abandoned Space Station Disco,' both hopelessly romantic and lost in time.",
        "taste_tags": ["Nostalgic", "Retro", "80s Sci-Fi", "Arcade Culture", "Pixel Art", "Synthwave", "Bittersweet"],
        "taste_twin": { "name": "The Last Coin-Op Kid", "emoji": "👾", "bio": "They remember when the glow of a CRT screen was the most magical portal in the universe. Their heart beats in 8-bit, and they find beauty in the melancholy of forgotten high scores." }
    }
}

# --- [UPGRADED] API Endpoint ---
@app.post("/get-zodiac")
async def get_zodiac(preferences: TastePreferences):
    input_names = sorted([p.name.lower().strip() for p in preferences.inputs if p.name])
    demo_key = "_".join(input_names)
    print(f"DEBUG: Generated demo_key: '{demo_key}'")

    final_result = {}

    if demo_key in DEMO_DATA_MAP:
        print(f"SUCCESS: Demo key '{demo_key}' found. Returning mock data instantly.")
        final_result = DEMO_DATA_MAP[demo_key]
    else:
        # --- This is the fallback logic for live calls ---
        print("INFO: No demo key found. This logic would make live API calls.")
        # For the purpose of this demo, we will just pick a random sign
        # This simulates a Gemini response without using your quota
        import random
        chosen_sign = random.choice(CULTURAL_ZODIAC_SIGNS)
        final_result = {
            **chosen_sign,
            "prophecy": "The Oracle's vision is vast, revealing a spirit of eclectic and unpredictable tastes.",
            "symbolism": "This sign represents a journey through varied cultural landscapes, guided by curiosity.",
            "taste_tags": ["Eclectic", "Unpredictable", "Curious"],
            "taste_twin": {"name": "The Wanderer", "emoji": "🧭", "bio": "Their path is not on any map; they delight in discovering hidden gems across the cultural spectrum."}
        }
    
    # --- [NEW] Attach the full list of signs to EVERY response ---
    return {
        "result": final_result,
        "all_signs": CULTURAL_ZODIAC_SIGNS
    }