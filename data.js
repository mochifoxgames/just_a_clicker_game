
        /* === JUST A CLICKER GAME — data.js === */
        /* Pure game data constants — loaded before game.js */

        /* --- EXPANDED CONFIGURATION --- */
        // NOTE: baseCosts increased ~20%, powers reduced ~15% vs original for better pacing.
        // Existing id 'black_hole' renamed to 'bh_siphon' to free up id for new Singularity Battery.
        const ITEMS = [
            { id: 'hamster',          name: 'Hamster Wheel',           type: 'auto',  baseCost: 18,                       power: 1,                       desc: "Rodent-based kinetic energy. Squeaky but reliable." },
            { id: 'potato',           name: 'Potato Battery',          type: 'auto',  baseCost: 120,                      power: 4,                       desc: "Science fair grade voltage. Smells slightly like fries." },
            { id: 'fingertip',        name: 'Silicon Fingertip',       type: 'click', baseCost: 300,                      power: 2,                       desc: "A prosthetic addition for faster clicking." },
            { id: 'relay_node',       name: 'Relay Node',              type: 'auto',  baseCost: 400,                      power: 8,                       desc: "A dormant node given purpose. Passively siphons ambient charge from the surrounding grid." },
            { id: 'intern',           name: 'Sleepy Intern',           type: 'auto',  baseCost: 600,                      power: 13,                      desc: "Generating power by furiously typing energetic emails." },
            { id: 'static_gen',       name: 'Static Generator',        type: 'auto',  baseCost: 1500,                     power: 34,                      desc: "Rubbing millions of balloons against wool sweaters." },
            { id: 'solar',            name: 'Rooftop Solar',           type: 'auto',  baseCost: 6000,                     power: 100,                     desc: "Photosynthesis for robots. Praise the sun." },
            { id: 'neural',           name: 'Neural Link',             type: 'click', baseCost: 10000,                    power: 17,                      desc: "Direct brain-to-mouse interface. Lag free." },
            { id: 'data_farm',        name: 'Data Farm',               type: 'auto',  baseCost: 12000,                    power: 85,                      desc: "Rows of blinking servers humming in a warehouse you definitely own legally." },
            { id: 'coffee',           name: 'Coffee Infusion',         type: 'auto',  baseCost: 18000,                    power: 380,                     desc: "Pure caffeine vibration converted into raw electricity." },
            { id: 'wind',             name: 'Wind Turbine',            type: 'auto',  baseCost: 60000,                    power: 1000,                    desc: "Harnessing the planet's breath. Bird safe." },
            { id: 'plasma_drill',     name: 'Plasma Drill',            type: 'auto',  baseCost: 85000,                    power: 550,                     desc: "Melts through bedrock to tap geothermal pockets of pure energy." },
            { id: 'nuclear',          name: 'Nuclear Reactor',         type: 'auto',  baseCost: 300000,                   power: 4000,                    desc: "Splitting atoms for fun and profit." },
            { id: 'solar_array',      name: 'Satellite Solar Array',   type: 'auto',  baseCost: 500000,                   power: 5000,                    desc: "A web of mirrors in low orbit, reflecting pure sunlight into your receivers 24/7." },
            { id: 'mouse',            name: 'Quantum Mouse',           type: 'click', baseCost: 900000,                   power: 425,                     desc: "Clicks in two positions simultaneously." },
            { id: 'lunar_mine',       name: 'Lunar Helium-3 Mine',     type: 'auto',  baseCost: 1200000,                  power: 12500,                   desc: "Stripping the moon's surface for the perfect fusion fuel. Sorry about the tides." },
            { id: 'fusion',           name: 'Fusion Core',             type: 'auto',  baseCost: 1800000,                  power: 30000,                   desc: "The power of a star, bottled in a jar." },
            { id: 'orbital_array',    name: 'Orbital Collector Array', type: 'auto',  baseCost: 2200000,                  power: 9500,                    desc: "Solar panels at L2 orbit beam energy directly into your Nexus." },
            { id: 'dyson_frag',       name: 'Dyson Swarm Fragment',    type: 'auto',  baseCost: 2800000,                  power: 35000,                   desc: "Just a few thousand panels surrounding the sun. It's a start." },
            { id: 'tapping',          name: 'Hyper-Thread Tap',        type: 'click', baseCost: 6000000,                  power: 2000,                    desc: "Clicking on multiple timelines at once." },
            { id: 'static_collector', name: 'Atmospheric Friction Harvester', type: 'auto', baseCost: 9000000,            power: 80000,                   desc: "Giant needles in the sky catching the static electricity of global jet streams." },
            { id: 'dyson',            name: 'Dyson Swarm',             type: 'auto',  baseCost: 18000000,                 power: 210000,                  desc: "Enclosing a star to steal 100% of its output." },
            { id: 'jupiter_tap',      name: 'Gas Giant Siphon',        type: 'auto',  baseCost: 28000000,                 power: 200000,                  desc: "Sucking the hydrogen straight out of a planet's core. Efficient, if a bit loud." },
            { id: 'nano_assembler',   name: 'Nano-Assembler',          type: 'auto',  baseCost: 48000000,                 power: 165000,                  desc: "Molecular machines reassemble ambient heat into refined energy." },
            { id: 'pulsar_engine',    name: 'Pulsar Kinetic Engine',   type: 'auto',  baseCost: 70000000,                 power: 550000,                  desc: "Timed perfectly with the rotation of a neutron star. Don't blink." },
            { id: 'star_trap',        name: 'Supernova Containment Field', type: 'auto', baseCost: 140000000,             power: 1200000,                 desc: "We forced a star to explode inside a very, very strong box." },
            { id: 'antimatter',       name: 'Antimatter Engine',       type: 'auto',  baseCost: 180000000,                power: 1700000,                 desc: "Do not shake the container. Seriously." },
            { id: 'ion_cloud',        name: 'Nebula Ion Cloud',        type: 'auto',  baseCost: 420000000,                power: 3500000,                 desc: "Mining the ionized gases of a star nursery for that sweet, glowing energy." },
            { id: 'memristor_web',    name: 'Memristor Web',           type: 'auto',  baseCost: 890000000,                power: 2800000,                 desc: "A living memory circuit that learns how to be more efficient every second." },
            { id: 'zero_point',       name: 'Zero-Point Pump',         type: 'auto',  baseCost: 1200000000,               power: 12500000,                desc: "Extracting energy from the vacuum of space itself." },
            { id: 'black_hole',       name: 'Singularity Battery',     type: 'auto',  baseCost: 1600000000,               power: 10000000,                desc: "A micro-black hole in a jar. Keep away from fingers and light." },
            { id: 'wormhole',         name: 'Wormhole Pipeline',       type: 'auto',  baseCost: 5000000000,               power: 28000000,                desc: "Stealing energy from a parallel universe where thermodynamics is just a suggestion." },
            { id: 'hyper_click_glove',name: 'Hyper Click Gloves',      type: 'click', baseCost: 5500000000,               power: 28000000,                desc: "Haptic feedback gloves tuned to resonate at the universe's click frequency." },
            { id: 'dark_prism',       name: 'Dark Matter Prism',       type: 'auto',  baseCost: 10500000000,              power: 63000000,                desc: "Refracting invisible gravity into visible profit." },
            { id: 'dark_forge',       name: 'Dark Matter Forge',       type: 'auto',  baseCost: 13000000000,              power: 75000000,                desc: "Finally making use of the 85% of the universe we couldn't see." },
            { id: 'entropy_pump',     name: 'Entropy Pump',            type: 'auto',  baseCost: 22000000000,              power: 62000000,                desc: "Reverses local entropy. Technically impossible. Definitely working." },
            { id: 'horizon_scraper',  name: 'Event Horizon Scraper',   type: 'auto',  baseCost: 38000000000,              power: 190000000,               desc: "Collecting the photons that are literally too slow to escape gravity." },
            { id: 'bh_siphon',        name: 'Black Hole Siphon',       type: 'auto',  baseCost: 62000000000,              power: 380000000,               desc: "Sipping Hawking Radiation from the event horizon." },
            { id: 'prob_collapser',   name: 'Probability Collapser',   type: 'auto',  baseCost: 95000000000,              power: 500000000,               desc: "Forcing the universe to choose the reality where you have more energy." },
            { id: 'tachyon_drive',    name: 'Tachyon Overdrive',       type: 'auto',  baseCost: 220000000000,             power: 1200000000,              desc: "Generating power from particles that arrive before they were even created." },
            { id: 'quasar',           name: 'Portable Quasar',         type: 'auto',  baseCost: 430000000000,             power: 2100000000,              desc: "The brightest object in the universe, on your desk." },
            { id: 'string_vibe',      name: 'String Theory Vibration', type: 'auto',  baseCost: 700000000000,             power: 4000000000,              desc: "Plucking the literal fabric of reality like a bass guitar." },
            { id: 'dark_matter_tap',  name: 'Dark Matter Tap',         type: 'auto',  baseCost: 750000000000,             power: 3200000000,              desc: "You can't see it, but you can definitely bill it." },
            { id: 'entropy_rev',      name: 'Entropy Reverser',        type: 'auto',  baseCost: 1900000000000,            power: 10000000000,             desc: "Making the universe 'un-cool' itself to provide you with infinite heat." },
            { id: 'kardashev',        name: 'Type III Grid',           type: 'auto',  baseCost: 2500000000000,            power: 12500000000,             desc: "Connecting every star in the galaxy to your wallet." },
            { id: 'nexus_core',       name: 'Quantum Nexus Core',      type: 'auto',  baseCost: 6500000000000,            power: 35000000000,             desc: "The heart of the Neon Nexus. It beats with the rhythm of a trillion souls." },
            { id: 'consciousness_loop',name: 'Consciousness Loop',     type: 'auto',  baseCost: 8800000000000,            power: 42000000000,             desc: "A feedback loop so tight it became self-aware and started working overtime." },
            { id: 'tesseract',        name: 'Tesseract Miner',         type: 'auto',  baseCost: 18500000000000,           power: 80000000000,             desc: "Mining energy from the 4th dimension." },
            { id: 'multi_harvest',    name: 'Multiverse Harvester',    type: 'auto',  baseCost: 32000000000000,           power: 100000000000,            desc: "Setting up shop in every possible timeline at once." },
            { id: 'reality',          name: 'Reality Anchor',          type: 'click', baseCost: 62000000000000,           power: 425000000,               desc: "Clicking hard enough to dent the fabric of spacetime." },
            { id: 'psionic_amplifier',name: 'Psionic Amplifier',       type: 'click', baseCost: 95000000000000,           power: 800000000000,            desc: "Pure willpower, converted to electricity at near-perfect efficiency." },
            { id: 'multiverse',       name: 'Multiverse Tap',          type: 'auto',  baseCost: 122000000000000,          power: 680000000000,            desc: "Stealing loose change from parallel yous." },
            { id: 'big_bang',         name: 'The Big Bang Echo',       type: 'auto',  baseCost: 220000000000000,          power: 500000000000,            desc: "Capturing the residual static from the first second of time." },
            { id: 'dev_glitch',       name: 'Simulation Glitch',       type: 'auto',  baseCost: 520000000000000,          power: 1000000000000,           desc: "You found a bug in the code. We decided to keep it as a feature." },
            { id: 'timeline',         name: 'Timeline Weaver',         type: 'auto',  baseCost: 1050000000000000,         power: 4600000000000,           desc: "Harvesting energy from futures that never happened." },
            { id: 'fractal_harvester',name: 'Fractal Harvester',       type: 'auto',  baseCost: 1800000000000000,         power: 8500000000000,           desc: "Extracts energy from self-similarity patterns in the universe's background noise." },
            { id: 'entropy',          name: 'Thermodynamic Collapse',  type: 'auto',  baseCost: 6200000000000000,         power: 34000000000000,          desc: "Turning chaos back into order. Take that, thermodynamics." },
            { id: 'mind_palace',      name: 'Mind Palace Array',        type: 'auto',  baseCost: 8e15,   power: 5e13,    desc: "A palace so vast its rooms generate their own revenue streams." },
            { id: 'math',             name: 'Sentient Equation',       type: 'auto',  baseCost: 43000000000000000,        power: 210000000000000,         desc: "Math so complex it generates heat thinking about itself." },
            { id: 'stellar_forge',    name: 'Stellar Forge',            type: 'auto',  baseCost: 5e16,   power: 3e14,    desc: "You're technically a god now. A very industrious one." },
            { id: 'hypersurface',     name: 'Hypersurface Tap',         type: 'click', baseCost: 8e16,   power: 9e11,    desc: "You click through into a 4th dimensional energy reservoir. Works, somehow." },
            { id: 'concept',          name: 'Platonic Ideal',          type: 'auto',  baseCost: 245000000000000000,       power: 1250000000000000,        desc: "The perfect concept of energy. No physical loss." },
            { id: 'galactic_siphon',  name: 'Galactic Siphon',          type: 'auto',  baseCost: 3e17,   power: 1.5e15,  desc: "A tube connecting your wallet to the center of the galaxy. Rude, but effective." },
            { id: 'narrative',        name: 'Plot Armor',              type: 'click', baseCost: 980000000000000000,       power: 42500000000000,          desc: "You succeed simply because the script says so." },
            { id: 'dark_energy_well', name: 'Dark Energy Well',         type: 'auto',  baseCost: 1.5e18, power: 7e15,    desc: "Accelerating cosmic expansion generates drag. You've figured out how to harvest the drag." },
            { id: 'fourth',           name: 'Fourth Wall Break',       type: 'auto',  baseCost: 6100000000000000000,      power: 30000000000000000,       desc: "The user is now manually generating the power." },
            { id: 'probability_engine',name:'Probability Engine',       type: 'auto',  baseCost: 9e18,   power: 4e16,    desc: "Runs simulations of universes slightly better than this one and siphons the difference." },
            { id: 'entropy_mirror',   name: 'Entropy Mirror',           type: 'click', baseCost: 2e19,   power: 8e13,    desc: "Every click reverses a tiny bit of entropy. The universe owes you, frankly." },
            { id: 'void',             name: 'Void Gaze',               type: 'auto',  baseCost: 55000000000000000000,     power: 210000000000000000,      desc: "When you stare into the abyss, it pays you rent." },
            { id: 'spacetime_kink',   name: 'Spacetime Kink',           type: 'auto',  baseCost: 6e19,   power: 2.5e17,  desc: "A deliberate bend in the fabric of reality. Energy pools at the crease." },
            { id: 'akashic',          name: 'Akashic Record',          type: 'auto',  baseCost: 370000000000000000000,    power: 1250000000000000000,     desc: "Downloading the memory of the universe." },
            { id: 'omniscience_node', name: 'Omniscience Node',         type: 'auto',  baseCost: 4e20,   power: 1.5e18,  desc: "You now know where all the energy is. That's half the battle." },
            { id: 'void_reactor',     name: 'Void Reactor',             type: 'auto',  baseCost: 2.5e21, power: 9e18,    desc: "Converts the negative space between atoms into a meaningful power source." },
            { id: 'creator',          name: 'Dev Console',             type: 'auto',  baseCost: 3100000000000000000000,   power: 7500000000000000000,     desc: "/give @p energy 999999999" },
            { id: 'cosmic_anchor',    name: 'Cosmic Anchor',            type: 'auto',  baseCost: 1.5e22, power: 6e19,    desc: "Pins a singularity in place so you can charge it a fixed monthly fee. [DO NOT BUY THIS]" },
            { id: 'sim',              name: 'Simulation Core',         type: 'auto',  baseCost: 19000000000000000000000,  power: 63000000000000000000,    desc: "We are living in a game. Might as well win it. (8th known purchase of this unit across all recorded timelines.)" },
            { id: 'ultraviolet_halo', name: 'Ultraviolet Halo',         type: 'auto',  baseCost: 9e22,   power: 4e20,    desc: "A ring of energy so hot it loops back around to cold again. Still useful." },
            { id: 'omega',            name: 'Omega Point',             type: 'auto',  baseCost: 125000000000000000000000, power: 500000000000000000000,   desc: "The final destination of all consciousness. Warning: previous Operators who reached this point did not respond to further communications." },
            { id: 'heat_death',       name: 'Heat Death Engine',       type: 'auto',  baseCost: 9e23,   power: 4e21,    desc: "You've found a way to run a generator off the eventual death of the universe. The universe has noticed." },
            { id: 'observer',         name: 'Observer Effect',         type: 'click', baseCost: 6e24,   power: 3e18,    desc: "Merely looking at an energy packet makes it produce more energy. Quantum cheating." },
            { id: 'causality',        name: 'Causality Engine',        type: 'auto',  baseCost: 4e25,   power: 1.5e23,    desc: "Generates power retroactively. You already have it. You just haven't built it yet." },
            { id: 'meta_paradox',     name: 'Meta-Paradox Core',       type: 'auto',  baseCost: 3e26,   power: 1.5e23,  desc: "A machine that powers itself by wondering if it exists." },
            { id: 'infinite_regress', name: 'Infinite Regress Loop',   type: 'auto',  baseCost: 2.5e27, power: 1.2e24,  desc: "Why does this generate power? Because of another one of these. All the way down." },
            { id: 'null_space',       name: 'Null Space Harvester',    type: 'auto',  baseCost: 2e28,   power: 9e24,    desc: "Turns the literal nothing between things into cold hard energy." },
            { id: 'eigenstate',       name: 'Eigenstate Superposer',   type: 'click', baseCost: 1.5e29, power: 9e21,    desc: "Until observed, this upgrade both is and isn't working. Currently: yes." },
            { id: 'ur_concept',       name: 'Ur-Concept',              type: 'auto',  baseCost: 2e29,   power: 8e25,    desc: "The abstract idea of power, generating power. Philosophy majors are furious." },
            { id: 'logos',            name: 'The Logos',               type: 'auto',  baseCost: 5e29,   power: 7e26,    desc: "The animating principle behind all reality. You've plugged it into an outlet." },
            { id: 'pale_fire',        name: 'Pale Fire Reactor',        type: 'auto',  baseCost: 8e29,   power: 5.5e27,  desc: "Burns the concept of fire, not fire itself. Hotter that way." },
            { id: 'veil_pierce',      name: 'Veil Piercer',             type: 'click', baseCost: 1.5e30, power: 4e24,    desc: "Click through the membrane separating your universe from the adjacent one." },
            { id: 'recursive_god',    name: 'Recursive Deity',          type: 'auto',  baseCost: 2.2e30, power: 8e27,    desc: "A god who worships itself. The feedback loop is extremely profitable." },
            { id: 'axiom_breaker',    name: 'Axiom Breaker',            type: 'auto',  baseCost: 3.2e30, power: 1.5e28,    desc: "Disproves the foundational rules of physics, then bills the universe for damages." },
            { id: 'null_engine',      name: 'Null Engine',              type: 'auto',  baseCost: 4.5e30, power: 8e27,    desc: "Runs on nothing. Produces something. Thermodynamics has filed a complaint." },
            { id: 'definitely_mlm',   name: 'Definitely Not a Pyramid', type: 'auto',  baseCost: 1.5e7,  power: 1200,    desc: "It's not a pyramid scheme. There's no pyramid. The money just... flows upward. Naturally." },
            { id: 'rubber_duck',      name: 'Rubber Duck Debugger',     type: 'click', baseCost: 8e6,    power: 6000,    desc: "Explain the problem to the duck. The duck judges you. The shame generates energy." },
            { id: 'captcha_farm',     name: 'CAPTCHA Farm',             type: 'auto',  baseCost: 6e8,    power: 9000,    desc: "Hires AIs to solve CAPTCHAs proving they're human. Nobody checks anymore." },
            { id: 'infinite_scroll',  name: 'Infinite Scroll Engine',   type: 'auto',  baseCost: 5e9,    power: 55000,   desc: "People stare at it forever. Attention is a renewable resource, apparently." },
            { id: 'crypto_miner',     name: 'Crypto Miner (Old Laptop)',type: 'auto',  baseCost: 3e10,   power: 300000,  desc: "The room is warm. Too warm. 'It's fine,' you say. It is not fine." },
            { id: 'terms_and_cond',   name: 'Terms & Conditions Reader',type: 'click', baseCost: 2e12,   power: 800000,  desc: "Someone actually read them. The universe rewards this once-in-an-eternity anomaly." },
            { id: 'fractal_mind',     name: 'Fractal Mind Engine',      type: 'auto',  baseCost: 6e30,   power: 4e27,  desc: "Infinite self-similar thoughts cascading into clean, quantifiable energy." },
            { id: 'omniplex',         name: 'Omniplex Array',           type: 'auto',  baseCost: 7.5e30, power: 1.5e28,    desc: "Everything, connected to everything else, all running your tab." },
            { id: 'philosophy_dept',  name: 'Philosophy Department',   type: 'auto',  baseCost: 4.2e9,  power: 62000,   desc: "Generates energy through sustained, inconclusive argument. Peak output during office hours." },
            { id: 'quantum_cat_farm', name: 'Quantum Cat Farm',         type: 'auto',  baseCost: 7.7e11, power: 5500000, desc: "Each cat simultaneously produces and doesn't produce energy until you check. You've stopped checking." },
            { id: 'time_tax_fraud',   name: 'Time-Travel Tax Fraud',    type: 'click', baseCost: 8.8e14, power: 4500000000, desc: "Steals energy from your future self. Past you already regrets this." },
            { id: 'ai_existential',   name: 'AI Existential Crisis Gen',type: 'auto',  baseCost: 2.2e13, power: 75000000, desc: "An AI that generates energy by agonizing over whether it's conscious. Extremely productive." },
            { id: 'end',              name: 'The End',                  type: 'auto',  baseCost: 1e31,   power: 8.5e21,  isEnd: true, desc: "Beyond this point there is only silence. Are you sure you want to finish?" }
        ];
        // Sort by baseCost ascending so shop displays in price order
        ITEMS.sort((a, b) => {
            if (a.isEnd) return 1;
            if (b.isEnd) return -1;
            return a.baseCost - b.baseCost;
        });


        /* --- PEOPLE POINTS UPGRADES --- */
        const PP_UPGRADES = [
            { id: 'citizen_boost',   name: 'Citizen Boost',        icon: '👥', cost:    10, desc: '+10% passive income per level (city-powered).', maxLevel: 5,  effect: lvl => ({ ppPassivePct: lvl * 0.10 }) },
            { id: 'urban_resonance', name: 'Urban Resonance',       icon: '🏙️', cost:    50, desc: 'City buildings generate 50% more People Points per level.', maxLevel: 3, effect: lvl => ({ ppGenMult: 1 + lvl * 0.5 }) },
            { id: 'mass_transit',    name: 'Mass Transit',          icon: '🚇', cost:   150, desc: 'People wander into buildings 2× faster per level.', maxLevel: 2, effect: lvl => ({ ppWalkSpeed: lvl * 2 }) },
            { id: 'democracy_proto', name: 'Democracy Protocol',    icon: '🗳️', cost:   400, desc: 'Everyone votes to give you energy. +25% all production per level.', maxLevel: 4, effect: lvl => ({ ppDemoPct: lvl * 0.25 }) },
            { id: 'click_expansion', name: 'Click Rate Expansion',  icon: '🖱️', cost:   100, desc: '+2 manual clicks/second per level. Stop throttling your passion.', maxLevel: 10, effect: lvl => ({ ppClickBonus: lvl * 2 }) },
            { id: 'community_grid',  name: 'Community Grid',        icon: '⚡', cost:   250, desc: 'Your city size directly powers the grid. +1% energy/s per plot filled.', maxLevel: 3, effect: lvl => ({ ppCityGridPct: lvl * 0.01 }) },
            { id: 'social_contract', name: 'The Social Contract',   icon: '📜', cost:  1000, desc: 'Doubles all People Point generation. Once. Forever.', maxLevel: 1, effect: () => ({ ppDoubleGen: true }) },
            { id: 'collective_intel',name: 'Collective Intelligence',icon: '🧠', cost:  2500, desc: '+0.5% to all production per 100 People Points owned.', maxLevel: 3, effect: lvl => ({ ppIntelPct: lvl * 0.005 }) },
            { id: 'urban_legend',    name: 'Urban Legend',          icon: '🌆', cost:  5000, desc: 'The city takes on a life of its own. 2× passive income. Permanent.', maxLevel: 1, effect: () => ({ ppUrbanLegend: true }) },
            { id: 'resonance_strike',name: 'Resonance Strike',       icon: '⚡', cost:   300, desc: '+4% chance each click crits for 3× energy.', maxLevel: 5, effect: lvl => ({ ppCritChance: lvl * 0.04 }) },
            { id: 'combo_amplifier',    name: 'Combo Amplifier',       icon: '🔥', cost:  2000, desc: 'Unlock higher combo tiers. Each level raises the max multiplier.', maxLevel: 3, effect: lvl => ({ ppComboTier: lvl }) },
            { id: 'signal_crystallizer', name: 'Signal Crystallizer',  icon: '◈',  cost:   800, desc: '+0.5 Fragments/min passive trickle per level. Converts ambient signal noise into usable fragment matter.', maxLevel: 3, effect: lvl => ({ ppFragTrickle: lvl * 0.5 }) },
            { id: 'resonance_grace',     name: 'Resonance Grace',      icon: '🎯', cost:   600, desc: 'Widens the Resonance Harvest timing window by +40ms per level, and extends the chain hold by +0.5s per level. Makes perfect sync easier to maintain.', maxLevel: 2, effect: lvl => ({ ppResonanceGrace: lvl }) },
        ];


        /* --- BUILDING SYNERGY CATEGORIES --- */
        // Drives adjacency bonus system in _recomputeAdjacency()
        // residential+civic: +25% PP/walker | industry+industry: +18% EPS
        // tech+tech: +28% EPS | nature+adjacent: +12% PP | civic+civic: +15% PP
        const BCAT = {
            // Proto-city buildings
            outpost:'tech', barrack:'residential', supply_depot:'civic',
            field_clinic:'civic', park_bench:'nature', prefab_block:'residential', worker_hub:'industry',
            // Standard city buildings
            tent:'residential', shack:'residential', house:'residential',
            duplex:'residential', apartment:'residential', condo:'residential',
            market:'civic', school:'civic', hospital:'civic', park:'nature',
            stadium:'civic', factory:'industry', skyscraper:'tech',
            nexus:'tech', quantum_hub:'tech', arcology:'residential',
            space_needle:'tech', orbital_ring:'tech', megaspire:'tech',
            void_spire:'industry', sun_tap:'industry', nexus_prime:'tech',
            research_district:'tech', industry_district:'industry',
            anomaly_lab:'tech', sim_hub:'tech'
        };


        /* ═══════════════════════════════════════════════════════════════
           BUILDING IMAGE DATA — full-resolution PNGs, no compression, no scaling
           Each image is rendered by City.drawPlots() via ctx.drawImage().
        ═══════════════════════════════════════════════════════════════ */
        const BUILDING_IMG_DATA = {
            // ── Proto-city tier ──────────────────────────────────────
            outpost          : 'images/bldg_outpost.png',
            barrack          : 'images/bldg_barrack.png',
            supply_depot     : 'images/bldg_supply_depot.png',
            field_clinic     : 'images/bldg_field_clinic.png',
            park_bench       : 'images/bldg_park_bench.png',
            prefab_block     : 'images/bldg_prefab_block.png',
            worker_hub       : 'images/bldg_worker_hub.png',
            // ── Standard city tier ────────────────────────────────────
            tent             : 'images/bldg_tent.png',
            shack            : 'images/bldg_shack.png',
            house            : 'images/bldg_house.png',
            duplex           : 'images/bldg_duplex.png',
            apartment        : 'images/bldg_apartment.png',
            condo            : 'images/bldg_condo.png',
            market           : 'images/bldg_market.png',
            school           : 'images/bldg_school.png',
            hospital         : 'images/bldg_hospital.png',
            park             : 'images/bldg_park.png',
            stadium          : 'images/bldg_stadium.png',
            factory          : 'images/bldg_factory.png',
            skyscraper       : 'images/bldg_skyscraper.png',
            nexus            : 'images/bldg_nexus.png',
            quantum_hub      : 'images/bldg_quantum_hub.png',
            arcology         : 'images/bldg_arcology.png',
            space_needle     : 'images/bldg_space_needle.png',
            orbital_ring     : 'images/bldg_orbital_ring.png',
            megaspire        : 'images/bldg_megaspire.png',
            void_spire       : 'images/bldg_void_spire.png',
            sun_tap          : 'images/bldg_sun_tap.png',
            nexus_prime      : 'images/bldg_nexus_prime.png',
            research_district: 'images/bldg_research_district.png',
            industry_district: 'images/bldg_industry_district.png',
            blight_harvester : 'images/bldg_blight_harvester.png',
            // ── Special structures ────────────────────────────────────
            anomaly_lab      : 'images/bldg_anomaly_lab.png',
            sim_hub          : 'images/bldg_sim_hub.png',
        };
        const BUILDING_IMGS = {};
        (function _preloadBuildingImgs() {
            Object.entries(BUILDING_IMG_DATA).forEach(([id, src]) => {
                const img = new Image();
                img.src = src;
                BUILDING_IMGS[id] = img;
            });
        })();
        window.BUILDING_IMGS = BUILDING_IMGS;
        window.BUILDING_IMG_DATA = BUILDING_IMG_DATA;

        // ─── Extra graphics (mini-people walker sprite, anomaly lab) ────────────────
        const MINI_PEOPLE_IMG_DATA = 'images/misc_mini_people.png';
        const ANOMALY_LAB_IMG_DATA = 'images/misc_anomaly_lab.png';
        window.ANOMALY_LAB_IMG_DATA = ANOMALY_LAB_IMG_DATA;

        // ─── Shop item icons ────────────────────────────────────────────────────
        const SHOP_ICON_IMG_DATA = {
            // ── Early game ────────────────────────────────────────────────────────
            'hamster':            'images/shop_hamster.png',
            'potato':             'images/shop_potato.png',
            'fingertip':          'images/shop_fingertip.png',
            'relay_node':         'images/shop_relay_node.png',
            'intern':             'images/shop_intern.png',
            'static_gen':         'images/shop_static_gen.png',
            'solar':              'images/shop_solar.png',
            'neural':             'images/shop_neural.png',
            'data_farm':          'images/shop_data_farm.png',
            'coffee':             'images/shop_coffee.png',
            'wind':               'images/shop_wind.png',
            'plasma_drill':       'images/shop_plasma_drill.png',
            'nuclear':            'images/shop_nuclear.png',
            'solar_array':        'images/shop_solar_array.png',
            'mouse':              'images/shop_mouse.png',
            'lunar_mine':         'images/shop_lunar_mine.png',
            'fusion':             'images/shop_fusion.png',
            'orbital_array':      'images/shop_orbital_array.png',
            'dyson_frag':         'images/shop_dyson_frag.png',
            'tapping':            'images/shop_tapping.png',
            'static_collector':   'images/shop_static_collector.png',
            'dyson':              'images/shop_dyson.png',
            'jupiter_tap':        'images/shop_jupiter_tap.png',
            'nano_assembler':     'images/shop_nano_assembler.png',
            'pulsar_engine':      'images/shop_pulsar_engine.png',
            'star_trap':          'images/shop_star_trap.png',
            'antimatter':         'images/shop_antimatter.png',
            'ion_cloud':          'images/shop_ion_cloud.png',
            'memristor_web':      'images/shop_memristor_web.png',
            'zero_point':         'images/shop_zero_point.png',
            'black_hole':         'images/shop_black_hole.png',
            // ── Mid game ──────────────────────────────────────────────────────────
            'wormhole':           'images/shop_wormhole.png',
            'hyper_click_glove':  'images/shop_hyper_click_glove.png',
            'dark_prism':         'images/shop_dark_prism.png',
            'dark_forge':         'images/shop_dark_forge.png',
            'entropy_pump':       'images/shop_entropy_pump.png',
            'horizon_scraper':    'images/shop_horizon_scraper.png',
            'bh_siphon':          'images/shop_bh_siphon.png',
            'prob_collapser':     'images/shop_prob_collapser.png',
            'tachyon_drive':      'images/shop_tachyon_drive.png',
            'quasar':             'images/shop_quasar.png',
            'string_vibe':        'images/shop_string_vibe.png',
            'dark_matter_tap':    'images/shop_dark_matter_tap.png',
            'entropy_rev':        'images/shop_entropy_rev.png',
            'kardashev':          'images/shop_kardashev.png',
            'nexus_core':         'images/shop_nexus_core.png',
            'consciousness_loop': 'images/shop_consciousness_loop.png',
            'tesseract':          'images/shop_tesseract.png',
            'multi_harvest':      'images/shop_multi_harvest.png',
            'reality':            'images/shop_reality.png',
            'psionic_amplifier':  'images/shop_psionic_amplifier.png',
            'multiverse':         'images/shop_multiverse.png',
            'big_bang':           'images/shop_big_bang.png',
            'dev_glitch':         'images/shop_dev_glitch.png',
            'fractal_harvester':  'images/shop_fractal_harvester.png',
            'entropy':            'images/shop_entropy.png',
            'mind_palace':        'images/shop_mind_palace.png',
            'math':               'images/shop_math.png',
            'stellar_forge':      'images/shop_stellar_forge.png',
            'hypersurface':       'images/shop_hypersurface.png',
            'concept':            'images/shop_concept.png',
            'galactic_siphon':    'images/shop_galactic_siphon.png',
            'narrative':          'images/shop_narrative.png',
            'dark_energy_well':   'images/shop_dark_energy_well.png',
            'fourth':             'images/shop_fourth.png',
            'probability_engine': 'images/shop_probability_engine.png',
            'entropy_mirror':     'images/shop_entropy_mirror.png',
            'void':               'images/shop_void.png',
            'spacetime_kink':     'images/shop_spacetime_kink.png',
            'akashic':            'images/shop_akashic.png',
            'omniscience_node':   'images/shop_omniscience_node.png',
            // ── Late game ─────────────────────────────────────────────────────────
            'void_reactor':       'images/shop_void_reactor.png',
            'creator':            'images/shop_creator.png',
            'cosmic_anchor':      'images/shop_cosmic_anchor.png',
            'sim':                'images/shop_sim.png',
            'ultraviolet_halo':   'images/shop_ultraviolet_halo.png',
            'omega':              'images/shop_omega.png',
            'heat_death':         'images/shop_heat_death.png',
            'observer':           'images/shop_observer.png',
            'causality':          'images/shop_causality.png',
            'meta_paradox':       'images/shop_meta_paradox.png',
            'infinite_regress':   'images/shop_infinite_regress.png',
            'null_space':         'images/shop_null_space.png',
            'eigenstate':         'images/shop_eigenstate.png',
            'ur_concept':         'images/shop_ur_concept.png',
            'logos':              'images/shop_logos.png',
            'pale_fire':          'images/shop_pale_fire.png',
            'veil_pierce':        'images/shop_veil_pierce.png',
            'recursive_god':      'images/shop_recursive_god.png',
            'axiom_breaker':      'images/shop_axiom_breaker.png',
            'null_engine':        'images/shop_null_engine.png',
            'fractal_mind':       'images/shop_fractal_mind.png',
            'omniplex':           'images/shop_omniplex.png',
            // ── Joke / sideline items ─────────────────────────────────────────────
            'definitely_mlm':     'images/shop_definitely_mlm.png',
            'rubber_duck':        'images/shop_rubber_duck.png',
            'captcha_farm':       'images/shop_captcha_farm.png',
            'infinite_scroll':    'images/shop_infinite_scroll.png',
            'crypto_miner':       'images/shop_crypto_miner.png',
            'terms_and_cond':     'images/shop_terms_and_cond.png',
            'philosophy_dept':    'images/shop_philosophy_dept.png',
            'quantum_cat_farm':   'images/shop_quantum_cat_farm.png',
            'time_tax_fraud':     'images/shop_time_tax_fraud.png',
            'ai_existential':     'images/shop_ai_existential.png',
        };

        // ─── People Points upgrade icons ─────────────────────────────────────────
        const PP_ICON_IMG_DATA = {
            'citizen_boost':    'images/pp_citizen_boost.png',
            'urban_resonance':  'images/pp_urban_resonance.png',
            'mass_transit':     'images/pp_mass_transit.png',
            'democracy_proto':  'images/pp_democracy_proto.png',
            'click_expansion':  'images/pp_click_expansion.png',
            'community_grid':   'images/pp_community_grid.png',
            'social_contract':  'images/pp_social_contract.png',
            'collective_intel': 'images/pp_collective_intel.png',
            'urban_legend':     'images/pp_urban_legend.png',
            'resonance_strike': 'images/pp_resonance_strike.png',
            'combo_amplifier':  'images/pp_combo_amplifier.png',
        };
        window.PP_ICON_IMG_DATA = PP_ICON_IMG_DATA;
        window.SHOP_ICON_IMG_DATA = SHOP_ICON_IMG_DATA;
        // Preload shop icons
        (function _preloadShopIcons() {
            window.SHOP_ICON_IMGS = {};
            Object.entries(SHOP_ICON_IMG_DATA).forEach(([id, src]) => {
                const img = new Image(); img.src = src;
                window.SHOP_ICON_IMGS[id] = img;
            });
        })();
        (function _preloadExtraImgs() {
            const mp = new Image(); mp.src = MINI_PEOPLE_IMG_DATA;  window.MINI_PEOPLE_IMG = mp;
            const al = new Image(); al.src = ANOMALY_LAB_IMG_DATA;  window.ANOMALY_LAB_IMG  = al;
        })();
