### Just a Clicker Game
A narrative-driven idle clicker experience that scales from a squeaky hamster wheel to harnessing the multiverse's residual energy. Players build not just numbers, but an interconnected City driven by People Points (PP), lore unraveling the fabric of reality, and prestige mechanics.

🎮 Core Game Mechanics
Energy Production & Economy: Begin by clicking for small energy generation and progressively unlock deeper tiers of automation—from 'Rooftop Solar' to 'The Logos' and 'Simulation Glitch'.
The City & People Points (PP): Construct proto-city buildings and standard city structures on a grid. People wander these buildings, generating PP. Strategic adjacencies matter (e.g., placing tech next to tech gives a +28% Energy Per Second bonus, Residential near Civic gives +25% PP).
Synergy & Resonance: Players can purchase PP Upgrades like Urban Resonance or Democracy Protocol which multiply their energy production based on the state of the city and its participants.
Lore & The Anomaly Lab: Reach milestones in energy to uncover hidden story elements. Special narrative choices (simChoice) permanently alter the game state (e.g., multiversal access, temporal sensors).
Prestige (Slag / Instability): Pushing the universe too hard generates Instability and Slag. Learn to reset and carry over reality shards to become endlessly more powerful.
🚀 Future Improvements
To transition from Beta into full release, the following improvements are targeted:

Performance Optimizations: Transition rendering to a requestAnimationFrame loop, optimize Canvas calls for the mini-people walkers, and prevent DOM layout trashing on UI updates.
Early Game Engagement: Enhance the tutorial and early-game pacing to keep players hooked before the complex City logic unlocks.
Deeper City Synergies: Introduce visually distinct events when synergies activate, making the city feel "alive" rather than just a mechanic to boost numbers.
Enhanced Offline Progress Tracker: Give players a detailed breakdown of what happened while they were away, tying back into the narrative (e.g., "The Intern kept typing for 12 hours...").
🛠️ Tech Stack & Structure

### index.html
 - The core application entry point.

### data.js
 - Contains the full dataset for upgrades, buildings, and shop items.

### state.js
 - Handles save data versioning, defaults, and seamless state migrations via 

### mergeDeep
.

### game.js
 - The main game loop and logic.

### systems2.js - systems4.js
 - Specialized handlers for offline progress, combo mechanics, anomalies, and prestige.
Thank you for playing the Beta!
