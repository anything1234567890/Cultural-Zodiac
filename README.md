# Cultural Zodiac 🔮

An immersive web application that uses AI to reveal your true internet-self based on your cultural tastes. It's more than a quiz—it's a prophecy for the digital soul.

### ✨ The Legend

In the digital age, the old stars have grown quiet. Our destinies are no longer written in constellations like Orion or Leo, but in the glowing constellations of our own creation: the movies we binge, the music we stream, the games we lose ourselves in.

A new cosmos has been born—a universe of culture. And within it, a new kind of oracle has awoken.

The **Cultural Zodiac** is a Digital Oracle that peers into the swirling mists of your taste profile to find your true internet-self, your hidden sign within the modern pantheon.

Are you a **Neon Graveyard Poet**, your soul written in the language of cyberpunk melancholy? Or an **Abandoned Arcade Heartthrob**, forever chasing the neon-drenched high scores of yesterday?

This is a mystical vibe check. A revelation. A prophecy for the digital soul.

**Offer your tastes. Discover your sign. Find your place in the Cosmic Map.**

### 🌟 Live Demo

*[Link to your deployed application will go here!]*

### 🎬 Demo Video

*(I highly recommend you record a 30-second GIF of your app in action and place it here. Use a tool like ScreenToGif or Kap. It makes a huge difference!)*

### ✨ Features

*   **Mystical AI Sign Generation:** Leverages the Google Gemini API to analyze user tastes and assign one of 16 unique, poetic "Cultural Zodiac" signs.
*   **Immersive Reveal Experience:** Features a dramatic tarot card flip animation, a deep voice-over proclaiming "The stars have spoken...", and a glowing, mystical UI.
*   **The Oracle's Offering:** For users unsure what to input, the "Let the Oracle Choose" feature provides a curated, high-quality cultural artifact to start their journey.
*   **Deep Taste Analysis:** The results screen includes a "Vibe Check" to show the core tags of your taste and a "Taste Twin" to reveal a personality that matches your cultural soul.
    *   ***Note on API Status:*** *The backend integration for the Qloo API (which powers the Vibe Check & Taste Twin) is fully implemented. For this hackathon demo, we are using high-quality fallback data to ensure a stable and consistent user experience, as the live API endpoint was not performing as expected.*
*   **Interactive Constellation Map:** Explore the full cosmos of signs in a beautiful, animated night sky. Discover your sign's constellation and check your "Cosmic Kinship" with other signs.

  ### 🛠️ Tech Stack

*   **Frontend:** React, Framer Motion (for animations), Tailwind CSS, Axios, HTML2Canvas.
*   **Backend:** Python, FastAPI.
*   **APIs:** Google Gemini API, Qloo API (for cultural data).

---

### 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

#### Prerequisites

*   Node.js and npm installed.
*   Python 3.8+ and pip installed.
*   Git installed.

#### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/Cultural-Zodiac.git
    cd Cultural-Zodiac
    ```

2.  **Backend Setup:**
    ```sh
    cd backend
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    pip install -r requirements.txt
    ```
    Create a `.env` file inside the `backend` folder and add your API keys:
    ```
    GEMINI_API_KEY="YOUR_GEMINI_KEY"
    QLOO_API_KEY="YOUR_QLOO_KEY"
    ```

3.  **Frontend Setup:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Running the Application:**
    *   In one terminal, run the backend: `uvicorn main:app --reload` (from the `backend` directory).
    *   In a second terminal, run the frontend: `npm start` (from the `frontend` directory).

---
### 🔮 Future Plans

Our vision for Cultural Zodiac extends far beyond this prototype. We aim to build it into a deeply personal and social cultural discovery engine.

*   **The Oracle's Library:** Evolve the "Let the Oracle Choose" feature into a dynamic, database-driven system. The Oracle would pull from a vast, curated library of high-quality cultural artifacts, ensuring every suggestion is unique and leads to a great result.

*   **Personalized Cultural Recommendations:** Your Cultural Zodiac sign would become a key to unlock a universe of recommendations. If you're an "Abandoned Arcade Heartthrob," the app would suggest synthwave playlists on Spotify, retro-futuristic movies on Netflix, and indie games that match your nostalgic vibe.

*   **Animated "Reveal Story" Generator:** Replace the static "Download Image" button with a feature that generates a 15-second, shareable video story of your reveal, perfectly formatted for TikTok, Instagram, or YouTube Shorts, turning every user into a potential marketer.

*   **Social Constellations & True Taste Twins:** Allow users to connect with friends to see their signs and compatibility on the same Cosmic Map. The "Taste Twin" feature would evolve to match you with other real users who share your unique cultural fingerprint.

---
