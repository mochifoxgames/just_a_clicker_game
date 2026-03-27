
        /* === JUST A CLICKER GAME — state.js === */
        /* DEFAULT_STATE, mergeDeep, migrate — loaded before game.js */

        /* --- 1c. SAVE UTILITY — mergeDeep ─────────────────────────────────
           Recursively fills in missing keys from `defaults` into `loaded`.
           - Missing/null leaf in loaded → deep-clone of default value used.
           - Both are plain objects → recurse.
           - Otherwise → loaded value wins (user data preserved).
           - Extra keys in loaded that aren't in defaults are preserved as-is
             (forward-compat: keeps deprecated fields, runtime-only flags, etc.)
        ─────────────────────────────────────────────────────────────────── */
        function mergeDeep(defaults, loaded) {
            const out = {};
            for (const key of Object.keys(defaults)) {
                const dv = defaults[key];
                const lv = (loaded != null) ? loaded[key] : undefined;
                if (lv === undefined || lv === null) {
                    // Missing in save — use default (deep-clone so mutations don't alias)
                    out[key] = (typeof dv === 'object' && dv !== null)
                        ? JSON.parse(JSON.stringify(dv))
                        : dv;
                } else if (
                    typeof dv === 'object' && !Array.isArray(dv) && dv !== null &&
                    typeof lv === 'object' && !Array.isArray(lv) && lv !== null
                ) {
                    // Both plain objects — recurse so nested fields are filled
                    out[key] = mergeDeep(dv, lv);
                } else {
                    // Scalar, array, or type mismatch — loaded value wins
                    out[key] = lv;
                }
            }
            // Preserve extra loaded keys not present in defaults
            if (loaded != null) {
                for (const key of Object.keys(loaded)) {
                    if (!(key in out)) out[key] = loaded[key];
                }
            }
            return out;
        }

        /* --- STATE MANAGEMENT --- */
        /* DEFAULT_STATE is the single source of truth for save shape.
           Every field that migrate() used to manually null-check lives here.
           mergeDeep(DEFAULT_STATE, loaded) handles all missing-field fills
           automatically, so migrate() only needs conditional logic now.     */
        const DEFAULT_STATE = {
            // ── Core ────────────────────────────────────────────────────
            energy: 0, multiplier: 1, items: {}, highScore: 0,
            totalClicks: 0, birdsClicked: 0, achievements: {},
            slag: 0, lastSaveTime: 0,

            // ── Subsystems ───────────────────────────────────────────────
            city: {
                slots: [], peoplePoints: 0, policy: 'balanced',
                awareness: 0, rebellionUntil: 0,
            },
            stats: {
                totalEnergyEarned: 0, sessionStart: 0, peakEPS: 0,
                itemsBought: 0, birdsMissed: 0, totalPlaytimeMs: 0,
            },
            prestige: { count: 0, lp: 0, upgrades: {}, clickCount: 0, clickThreshold: 0 },

            // ── Collections ─────────────────────────────────────────────
            ppUpgrades: {}, loreSeen: {}, achieveBonus: {}, behavior: {},
            realityEdits: {}, megaProjects: {}, fragUpgrades: {},
            voidBranch: {}, _synergyNotified: {}, _epsNotifSeen: {},
            simSlots: [], cityDistricts: [],

            // ── Lore / narrative ────────────────────────────────────────
            simChoice: null,
            loreEffects: {
                phase3Started: false, phase5Started: false,
                multiversalAccess: false, parallelSiphon: false,
                temporalSensors: false, cycleConfirmed: false,
                gravityRewrite: false, lightRewrite: false,
                timeRewrite: false, entropyRewrite: false,
                matterRewrite: false,
            },

            // ── Resources ───────────────────────────────────────────────
            data: 0, instability: 0, fragments: 0, comboOverdriveEnd: 0,
            _corruptedData: 0,

            // ── Run meta ────────────────────────────────────────────────
            clickLimit: 5, comboMaxTier: 0,
            personality: null, personalityBonus: null,
            _existentialPath: null, _runSpec: null, _runSpecStart: 0,

            // ── Runtime flags ───────────────────────────────────────────
            _maxInstab: 0, _lastClickTime: 0,
            _lotteryJackpot: false, _usedGlitchMarket: false,
            _usedOverdrive: false, _hadCollapse: false,
            _clickLocked: false, _clickLockedUntil: 0,
            _chainTutorialShown: false, _kineticNotified: false,
            _cosmicAnchorNotified: false,
            _terminalUsed: false, _overrideUsed: false,
            _hardwareFatigued: false, _megaFirstNotified: false,
            _accessLog7: false, _terminalDecrypted: false,
            _v1202: true,
            // These two are false by default; migrate() upgrades them
            // for existing saves that already have slag (see below).
            _slagNotified: false, _bmNavNotified: false,
            // ── Instability one-time events (V1.20.1.9: moved from window to state) ─
            // Persisted so reload/prestige cannot re-trigger rewards already given.
            _instab20fired: false,          // energy windfall at first 20% instability
            _realityFractureExpires: 0,     // timestamp — fracture cooldown end (0 = ready)
            _realityEchoExpires: 0,         // timestamp — echo active until this time (0 = off)
            // ── Feature unlock one-time notifications ────────────────────────────────
            _prestigeUnlockNotified: false, // prestige row "1B energy" popup shown once
        };

        function migrate(save) {
            const raw = save.state || save; // handle versioned {v,state} or legacy flat saves
            // mergeDeep fills every missing/null field from DEFAULT_STATE recursively.
            // No more manual if-null chains — add new fields to DEFAULT_STATE instead.
            const s = mergeDeep(DEFAULT_STATE, raw);
            // Only conditional migrations that compute a value from OTHER state fields:
            // Existing saves with slag already accumulated should not re-fire the notif.
            if (!s._slagNotified  && (s.slag||0) > 0)   s._slagNotified  = true;
            if (!s._bmNavNotified && (s.slag||0) >= 100) s._bmNavNotified = true;
            // V1.20.1.9: instab 20% bonus is once-per-run. Mark it as fired for
            // existing saves that already passed 20% so they don't re-receive the windfall.
            if (!s._instab20fired && (s.instability||0) > 20) s._instab20fired = true;
            // V1.20.1.9: prestige unlock notification — suppress for players who have
            // already prestiged at least once (they clearly already know about it).
            if (!s._prestigeUnlockNotified && (s.prestige && s.prestige.count > 0)) {
                s._prestigeUnlockNotified = true;
            }
            return s;
        }
