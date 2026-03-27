
/* ── 1. RESONANCE HARVESTING — click-timing skill mechanic ─────────── */
const ResonanceHarvest = (() => {
    // Track pulse cycle: btnRingPulse is 2.4s ease-in-out, peak at 50% = 1.2s
    const CYCLE = 2400;
    // "Perfect" window: base ±120ms — expanded by Resonance Grace PP upgrade (+40ms/level)
    const BASE_WINDOW = 120;
    // Chain gap: base 2000ms — extended by Resonance Grace (+500ms/level)
    const BASE_CHAIN_GAP = 2000;
    let _sessionStart = Date.now();
    let _chain = 0;
    let _chainActive = false;
    let _chainTimeout = null;
    let _multActive = false;
    let _multEnd = 0;
    let _instabFloor = 0; // set to 90 when burst fires inside Redline — decay can't drop below this

    function _getGraceLevel() {
        // Read grace upgrade level from state at click-time (safe: state is global)
        return (typeof state !== 'undefined' && state.ppUpgrades && state.ppUpgrades.resonance_grace) || 0;
    }

    function onClick() {
        if (!isRunning) return;
        const now = Date.now();
        const _grace = _getGraceLevel();
        const WINDOW = BASE_WINDOW + _grace * 40;
        const CHAIN_GAP = BASE_CHAIN_GAP + _grace * 500;
        // Position within current pulse cycle (0..CYCLE)
        const pos = (now - _sessionStart) % CYCLE;
        const dist = Math.min(pos, CYCLE - pos); // distance from peak (at 0 or CYCLE)
        const peakDist = Math.abs(pos - CYCLE / 2); // distance from midpoint peak
        const isPerfect = peakDist < WINDOW;

        if (isPerfect) {
            _chain = (_chain || 0) + 1;
            clearTimeout(_chainTimeout);
            _chainTimeout = setTimeout(() => { _chain = 0; }, CHAIN_GAP);
            _showSyncFeedback(_chain);
            if (_chain >= 5 && !_multActive) {
                _triggerResonanceBurst();
            }
        } else {
            if (_chainActive) {
                _chain = 0;
                _chainActive = false;
                _hideSyncBar();
            }
        }
    }

    function _showSyncFeedback(chain) {
        let el = document.getElementById('resonance-sync-bar');
        if (!el) {
            el = document.createElement('div');
            el.id = 'resonance-sync-bar';
            el.style.cssText = 'position:absolute;bottom:-28px;left:50%;transform:translateX(-50%);font-family:"Courier New",monospace;font-size:0.5rem;letter-spacing:3px;color:#44ffcc;text-shadow:0 0 8px rgba(68,255,204,0.8);white-space:nowrap;pointer-events:none;transition:opacity 0.2s;z-index:10;';
            const wrap = document.getElementById('click-btn-wrap');
            if (wrap) wrap.appendChild(el);
        }
        el.style.opacity = '1';
        const labels = ['', '✦ SYNC ×1', '✦✦ SYNC ×2', '✦✦✦ SYNC ×3', '⚡ SYNC ×4', '⚡⚡ PERFECT SYNC ×5'];
        el.textContent = labels[Math.min(chain, 5)] || `⚡ SYNC ×${chain}`;
        const colors = ['', '#44ffcc', '#88ffaa', '#ffff44', '#ff8844', '#ff44ff'];
        el.style.color = colors[Math.min(chain, 5)] || '#ff44ff';
    }

    function _hideSyncBar() {
        const el = document.getElementById('resonance-sync-bar');
        if (el) el.style.opacity = '0';
    }

    function _triggerResonanceBurst() {
        _multActive = true;
        _multEnd = Date.now() + 5000;
        _chain = 0;
        _hideSyncBar();
        // Grace rule: if already in Redline zone (90–98%), floor instability at 90% so natural
        // decay can't break the Redline sustain timer. Additions are still blocked as normal.
        const _instabNow = (typeof state !== 'undefined') ? (state.instability || 0) : 0;
        _instabFloor = _instabNow >= 90 ? 90 : 0;
        const _msg = _instabFloor > 0
            ? '⚡ RESONANCE BURST — ×10 click power for 5s! Redline locked — instability floored at 90%. [non-stackable]'
            : '⚡ RESONANCE BURST — ×10 click power + instability frozen for 5s! [non-stackable]';
        showNotif(_msg, '#ff44ff', 5000);

        // Burst countdown HUD — shows remaining time so player knows it's active
        let _burstHUD = document.getElementById('resonance-burst-hud');
        if (!_burstHUD) {
            _burstHUD = document.createElement('div');
            _burstHUD.id = 'resonance-burst-hud';
            _burstHUD.style.cssText = 'position:fixed;bottom:calc(var(--nav-h,64px) + 72px);left:50%;transform:translateX(-50%);font-family:"Courier New",monospace;font-size:0.48rem;letter-spacing:2px;color:#ff44ff;text-shadow:0 0 8px rgba(255,68,255,0.8);white-space:nowrap;pointer-events:none;z-index:var(--z-fx,9500);background:rgba(20,0,30,0.75);padding:3px 10px;border-radius:4px;border:1px solid rgba(255,68,255,0.4);';
            document.body.appendChild(_burstHUD);
        }
        _burstHUD.style.display = 'block';
        let _burstRemMs = 5000;
        const _burstHUDLabel = _instabFloor > 0
            ? '⚡ BURST ×10 CLICKS | 🔴 REDLINE ×10 EPS'  // both active — distinguish the two ×10s
            : '⚡ RESONANCE BURST ×10 CLICKS';
        // Store interval ID so the termination timer can clear it deterministically,
        // preventing a race where _multActive becomes false while the HUD still shows
        // time remaining (100ms desync window between setInterval and setTimeout).
        const _burstTickId = setInterval(() => {
            _burstRemMs -= 100;
            if (_burstHUD) _burstHUD.textContent = `${_burstHUDLabel} — ${Math.max(0, _burstRemMs / 1000).toFixed(1)}s [non-stackable]`;
        }, 100);
        if (_burstHUD) _burstHUD.textContent = `${_burstHUDLabel} — 5.0s [non-stackable]`;

        // Full-screen flash overlay
        const _flashEl = document.createElement('div');
        _flashEl.style.cssText = 'position:fixed;inset:0;z-index:9000;pointer-events:none;background:radial-gradient(ellipse at center,rgba(255,68,255,0.55) 0%,rgba(120,0,200,0.25) 55%,transparent 100%);opacity:1;transition:opacity 0.6s ease-out;';
        document.body.appendChild(_flashEl);
        requestAnimationFrame(() => { _flashEl.style.opacity = '0'; });
        setTimeout(() => _flashEl.remove(), 700);

        // Screen shake
        const _gameEl = document.getElementById('game-wrap') || document.body;
        _gameEl.style.transition = 'transform 0.05s';
        let _shakeCount = 0;
        const _shake = () => {
            if (_shakeCount >= 6) { _gameEl.style.transform = ''; return; }
            _gameEl.style.transform = `translate(${(Math.random()-0.5)*8}px,${(Math.random()-0.5)*6}px)`;
            _shakeCount++;
            setTimeout(_shake, 55);
        };
        _shake();

        // Button ring pulse — brighter and layered
        const wrap = document.getElementById('click-btn-wrap');
        if (wrap) {
            wrap.style.boxShadow = '0 0 60px rgba(255,68,255,1), 0 0 120px rgba(200,0,255,0.6), 0 0 200px rgba(150,0,220,0.3)';
            wrap.style.transition = 'box-shadow 0.1s';
            setTimeout(() => { if (wrap) { wrap.style.boxShadow = '0 0 20px rgba(255,68,255,0.4)'; wrap.style.transition = 'box-shadow 4.5s ease-out'; } }, 150);
            setTimeout(() => { if (wrap) { wrap.style.boxShadow = ''; wrap.style.transition = ''; } }, 5000);
        }

        // Burst chord sound — three harmonics
        try {
            const _acCtx = window.Sounds && Sounds._getCtx && Sounds._getCtx();
            if (_acCtx) {
                [[440, 0], [554, 0.04], [659, 0.08], [880, 0.14]].forEach(([freq, delay]) => {
                    const o = _acCtx.createOscillator(), g = _acCtx.createGain();
                    o.connect(g); g.connect(_acCtx.destination);
                    o.type = 'triangle';
                    const t = _acCtx.currentTime + delay;
                    o.frequency.setValueAtTime(freq, t);
                    o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.08);
                    g.gain.setValueAtTime(0.18, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
                    o.start(t); o.stop(t + 0.56);
                });
            }
        } catch(e) {}

        // Single timer clears the interval AND hides the HUD at the same moment
        // _multActive becomes false, so both the click multiplier and HUD turn off together.
        setTimeout(() => {
            _multActive = false;
            _instabFloor = 0;
            clearInterval(_burstTickId);
            if (_burstHUD) _burstHUD.style.display = 'none';
        }, 5000);
    }

    function getClickMult() {
        return (_multActive && Date.now() < _multEnd) ? 10 : 1;
    }

    function isInstabFrozen() {
        // Additions are blocked unless the floor is active (floor means we're in Redline —
        // allow additions so instability can still rise within 90–100% freely).
        return _multActive && Date.now() < _multEnd && _instabFloor === 0;
    }

    function getInstabFloor() {
        return (_multActive && Date.now() < _multEnd) ? _instabFloor : 0;
    }

    // Returns 0..1 position within the current pulse cycle (0.5 = perfect hit point)
    function getPhase() {
        return ((Date.now() - _sessionStart) % CYCLE) / CYCLE;
    }

    return { onClick, getClickMult, isInstabFrozen, getInstabFloor, getPhase };
})();
window.ResonanceHarvest = ResonanceHarvest;

/* ── 2. THERMAL DECAY — adjacency bonuses overheat over time ───────── */
const ThermalDecay = (() => {
    // Track how long each slot pair has been adjacent
    // Format: state._thermalHeat = { "pairKey": { heat 0..100, since ms } }
    const OVERHEAT_MS = 15 * 60 * 1000; // 15 minutes to full heat
    const COOLDOWN_RATE = 100 / (5 * 60 * 1000); // 5 min to cool fully, per ms
    let _lastTick = 0;
    const COLS = 8;

    function _isValidRight(idx) {
        // Right neighbor is only valid if idx is not on the rightmost column
        return (idx % COLS) < (COLS - 1);
    }

    function tick() {
        if (!isRunning) return;
        const now = Date.now();
        if (_lastTick && now - _lastTick < 5000) return; // check every 5s
        // Use dt=0 on first tick (no reference point yet) so loaded save pairs are not
        // incorrectly cooled by a phantom 5s interval. After the first tick _lastTick is
        // set and all subsequent dt values reflect actual elapsed time.
        const dt = _lastTick ? now - _lastTick : 0;
        _lastTick = now;
        if (!state.city || !state.city.slots) return;
        if (!state._thermalHeat) state._thermalHeat = {};

        const slots = state.city.slots;
        const hotPairs = new Set();

        // Find occupied adjacent pairs (right + down only, no row-wrap)
        Object.keys(slots).forEach(idxStr => {
            const idx = parseInt(idxStr);
            if (!slots[idx]) return;
            const neighbors = [];
            if (_isValidRight(idx)) neighbors.push(idx + 1); // right, no wrap
            neighbors.push(idx + COLS); // down (always valid within bounds)
            neighbors.forEach(nIdx => {
                if (!slots[nIdx]) return;
                const pairKey = Math.min(idx, nIdx) + '_' + Math.max(idx, nIdx);
                hotPairs.add(pairKey);
                if (!state._thermalHeat[pairKey]) state._thermalHeat[pairKey] = { heat: 0, since: now };
                const elapsed = now - state._thermalHeat[pairKey].since;
                state._thermalHeat[pairKey].heat = Math.min(100, (elapsed / OVERHEAT_MS) * 100);
            });
        });

        // Cool down pairs no longer adjacent — use pre-captured dt
        Object.keys(state._thermalHeat).forEach(k => {
            if (!hotPairs.has(k)) {
                state._thermalHeat[k].heat = Math.max(0, state._thermalHeat[k].heat - COOLDOWN_RATE * dt);
                if (state._thermalHeat[k].heat <= 0) delete state._thermalHeat[k];
            }
        });

        // Show warning if any tile is overheating
        const maxHeat = Object.values(state._thermalHeat || {}).reduce((m, v) => Math.max(m, v.heat || 0), 0);
        if (maxHeat > 80) {
            const ticker = document.getElementById('world-event-ticker');
            if (ticker && !ticker._thermalShown) {
                ticker._thermalShown = true;
                ticker.style.display = 'block';
                ticker.style.color = '#ff8844';
                ticker.textContent = `🔥 THERMAL DECAY — ${Math.round(maxHeat)}% overheat. Rotate your City grid to restore adjacency bonuses.`;
                setTimeout(() => { ticker.style.display = 'none'; ticker._thermalShown = false; }, 8000);
            }
        }
    }

    // Returns global EPS multiplier based on worst heat
    function getGlobalMult() {
        if (!state._thermalHeat) return 1;
        const maxHeat = Object.values(state._thermalHeat).reduce((m, v) => Math.max(m, v.heat || 0), 0);
        // At 100% heat: adjacency bonuses fully nullified = lose up to 20% of total EPS
        return 1 - (maxHeat / 100) * 0.20;
    }

    function getHeatDisplay() {
        const max = Object.values(state._thermalHeat || {}).reduce((m, v) => Math.max(m, v.heat || 0), 0);
        return Math.round(max);
    }

    return { tick, getGlobalMult, getHeatDisplay };
})();
window.ThermalDecay = ThermalDecay;

/* ── 3. RUN MUTATIONS — randomised run modifiers on each prestige ───── */
const RunMutation = (() => {
    const ALL_MUTATIONS = [
        { id: 'price_of_motion',   name: '⚡ THE PRICE OF MOTION',
          desc: 'Manual clicks COST energy instead of generating it, but passive EPS is ×20.',
          plain: 'Don\'t click — let your generators do the work. Passive income is ×20.',
          risk: 'high',
          apply: s => { s._mutClickCost = true; },
          getEPS: () => 20,  getClickMult: () => -1 },
        { id: 'blind_architecture', name: '🏙 BLIND ARCHITECTURE',
          desc: 'City Nexus UI is blacked out. You build from memory. Buildings produce ×3.',
          plain: 'Your city grid is hidden — you\'ll build blind. Buildings output ×3 as a reward.',
          risk: 'challenge',
          apply: s => { s._mutBlindCity = true; },
          getEPS: () => 1, getCityMult: () => 3 },
        { id: 'entropy_harvest',   name: '🌀 ENTROPY HARVEST',
          desc: 'Instability above 50% gives ×2 EPS bonus. Below 50%: ×0.5 EPS.',
          plain: 'Keep instability above 50% for ×2 EPS. Let it fall and you\'ll lose half your income.',
          risk: 'high',
          apply: s => { s._mutEntropyHarvest = true; },
          getEPS: () => { const i = state.instability||0; return i >= 50 ? 2 : 0.5; } },
        { id: 'ghost_economy',     name: '👻 GHOST ECONOMY',
          desc: 'Shop items cost 0 energy. Each item you own adds +0.5% EPS (stacks up to ×1.5). Buy freely.',
          plain: 'Everything in the shop is FREE. Spam-buy as much as possible for a scaling EPS bonus.',
          risk: 'easy',
          apply: s => { s._mutGhostEconomy = true; },
          getEPS: () => { const owned = Object.values((typeof state !== 'undefined' && state.items) || {}).reduce((a,b) => a+(b||0), 0); return Math.min(1.5, 0.75 + owned * 0.005); },
          getShopCost: () => 0 },
        { id: 'overclock_surge',   name: '🔧 OVERCLOCK SURGE',
          desc: 'EPS is ×5, but every 60s a random generator locks for 10s.',
          plain: 'EPS ×5 the whole run — but every minute one of your generators goes offline for 10s.',
          risk: 'medium',
          apply: s => { s._mutOverclockSurge = true; s._mutSurgeNext = Date.now() + 60000; },
          getEPS: () => 5 },
        { id: 'silent_run',        name: '🔇 SILENT RUN',
          desc: 'All sound is disabled. Combo tiers grant ×3 instead of normal multipliers.',
          plain: 'Sound off for the whole run. Your click combo multipliers become ×3 as a trade.',
          risk: 'easy',
          apply: s => { s._mutSilentRun = true; },
          getEPS: () => 1 },
        { id: 'data_hemorrhage',   name: '💠 DATA HEMORRHAGE',
          desc: 'Data drains 5/s but every 100 Data lost grants +1 Energy per second permanently.',
          plain: 'Data bleeds away constantly — but each 100 Data lost gives you +1 permanent EPS.',
          risk: 'medium',
          apply: s => { s._mutDataHemorrhage = true; s._mutDataBonus = 0; },
          getEPS: () => 1 + ((state._mutDataBonus||0) * 0.01) },
        { id: 'inverse_city',      name: '🔄 INVERSE CITY',
          desc: 'City buildings generate negative People Points, but PP deficit = +0.5% EPS each.',
          plain: 'Build a city that drains People Points — the bigger the debt, the higher your EPS.',
          risk: 'challenge',
          apply: s => { s._mutInverseCity = true; },
          getEPS: () => 1 + Math.abs(Math.min(0, (state.city&&state.city.peoplePoints)||0)) * 0.005 },
    ];

    let _pendingCallback = null;
    let _rolledMutations = [];
    let _rerollCount = 0;

    function _rerollCost() {
        // 3 LP first reroll, doubling each time: 3 → 6 → 12 → 24 …
        return 3 * Math.pow(2, _rerollCount);
    }

    function roll(onConfirm) {
        _pendingCallback = onConfirm;
        _rerollCount = 0;
        // Pick 3 random distinct mutations
        const shuffled = [...ALL_MUTATIONS].sort(() => Math.random() - 0.5);
        _rolledMutations = shuffled.slice(0, 3);
        _renderModal();
        const modal = document.getElementById('run-mutation-modal');
        if (modal) modal.style.display = 'flex';
    }

    function reroll() {
        const cost = _rerollCost();
        const lp = (typeof state !== 'undefined' && state.prestige && state.prestige.lp) || 0;
        if (lp < cost) {
            showNotif(`↺ REROLL REQUIRES ${cost} LP — not enough Legacy Points`, '#ff4444', 4000);
            return;
        }
        state.prestige.lp -= cost;
        _rerollCount++;
        // Pick 3 new mutations, preferring ones not shown last time
        const prev = new Set(_rolledMutations.map(m => m.id));
        const fresh = ALL_MUTATIONS.filter(m => !prev.has(m.id));
        const pool  = fresh.length >= 3 ? fresh : ALL_MUTATIONS;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        _rolledMutations = shuffled.slice(0, 3);
        _renderModal();
        showNotif(`↺ MUTATIONS REROLLED — ${cost} LP spent`, '#cc88ff', 3000);
    }

    function select(id) {
        const mut = ALL_MUTATIONS.find(m => m.id === id);
        if (!mut) return;
        state._activeMutation = id;
        if (mut.apply) mut.apply(state);
        const modal = document.getElementById('run-mutation-modal');
        if (modal) modal.style.display = 'none';
        if (_pendingCallback) { _pendingCallback(); _pendingCallback = null; }
        showNotif(`🧬 MUTATION ACTIVE: ${mut.name}`, '#ff88ff', 8000);
    }

    function _renderModal() {
        const list = document.getElementById('run-mutation-list');
        if (!list) return;
        list.innerHTML = '';

        // Risk badge config: color, label
        const RISK_STYLE = {
            easy:      { color: '#44cc88', bg: 'rgba(40,120,70,0.25)',  label: 'EASY' },
            medium:    { color: '#ffcc44', bg: 'rgba(140,100,0,0.25)',  label: 'MEDIUM' },
            high:      { color: '#ff6633', bg: 'rgba(150,40,0,0.25)',   label: 'HIGH RISK' },
            challenge: { color: '#aa44ff', bg: 'rgba(100,20,150,0.25)', label: 'CHALLENGE' },
        };

        _rolledMutations.forEach(mut => {
            const rs = RISK_STYLE[mut.risk] || RISK_STYLE.medium;
            const btn = document.createElement('div');
            btn.style.cssText = `background:rgba(20,0,30,0.9);border:1px solid rgba(200,80,255,0.35);border-left:3px solid ${rs.color};border-radius:10px;padding:16px 18px;cursor:pointer;margin-bottom:10px;transition:0.15s;`;
            btn.onmouseover = () => { btn.style.borderColor = `rgba(200,80,255,0.8)`; btn.style.borderLeftColor = rs.color; btn.style.background = 'rgba(35,0,50,0.95)'; };
            btn.onmouseout  = () => { btn.style.borderColor = 'rgba(200,80,255,0.35)'; btn.style.borderLeftColor = rs.color; btn.style.background = 'rgba(20,0,30,0.9)'; };
            btn.onclick = () => select(mut.id);
            btn.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <div style="font-family:'Courier New',monospace;font-size:0.82rem;font-weight:900;color:#dd88ff;letter-spacing:2px;">${mut.name}</div>
                    <div style="font-size:0.52rem;letter-spacing:2px;padding:2px 7px;border-radius:3px;color:${rs.color};background:${rs.bg};border:1px solid ${rs.color}44;">${rs.label}</div>
                </div>
                ${mut.plain ? `<div style="font-size:0.78rem;color:#ddbbff;line-height:1.6;margin-bottom:6px;font-style:italic;">"${mut.plain}"</div>` : ''}
                <div style="font-size:0.68rem;color:#664477;line-height:1.6;border-top:1px solid rgba(200,80,255,0.12);padding-top:6px;">${mut.desc}</div>`;
            list.appendChild(btn);
        });

        // Update reroll button cost display
        const costEl = document.getElementById('run-mutation-reroll-cost');
        if (costEl) costEl.textContent = `(${_rerollCost()} LP)`;
        // Dim the reroll button if player can't afford it
        const rerollBtn = document.getElementById('run-mutation-reroll-btn');
        if (rerollBtn) {
            const lp = (typeof state !== 'undefined' && state.prestige && state.prestige.lp) || 0;
            const canAfford = lp >= _rerollCost();
            rerollBtn.style.opacity = canAfford ? '1' : '0.4';
            rerollBtn.style.cursor  = canAfford ? 'pointer' : 'not-allowed';
        }
    }

    function getEPSMult() {
        const id = state._activeMutation;
        if (!id) return 1;
        const mut = ALL_MUTATIONS.find(m => m.id === id);
        if (!mut || !mut.getEPS) return 1;
        const v = mut.getEPS();
        return typeof v === 'number' ? v : 1;
    }

    function tick() {
        if (!state._mutOverclockSurge) return;
        const now = Date.now();
        if (now >= (state._mutSurgeNext || 0)) {
            state._mutSurgeNext = now + 60000;
            // Lock a random owned generator for 10s
            const owned = Object.keys(state.items || {}).filter(k => (state.items[k] || 0) > 0);
            if (owned.length > 0) {
                const target = owned[Math.floor(Math.random() * owned.length)];
                if (!state._lockedItems) state._lockedItems = {};
                state._lockedItems[target] = now + 10000;
                showNotif(`🔧 OVERCLOCK SURGE — ${target} locked for 10s`, '#ffaa44', 5000);
                setTimeout(() => { if (state._lockedItems) delete state._lockedItems[target]; }, 10000);
            }
        }
        if (state._mutDataHemorrhage) {
            state.data = Math.max(0, (state.data || 0) - (5 / 2)); // per 0.5s tick
            state._mutDataBonusAccum = (state._mutDataBonusAccum || 0) + 2.5;
            if (state._mutDataBonusAccum >= 100) {
                state._mutDataBonusAccum = 0;
                state._mutDataBonus = (state._mutDataBonus || 0) + 1;
            }
        }
    }

    function renderBadge() {
        const id = state._activeMutation;
        let el = document.getElementById('run-mutation-badge');
        if (!id) { if (el) el.remove(); return; }
        const mut = ALL_MUTATIONS.find(m => m.id === id);
        if (!mut) return;
        if (!el) {
            el = document.createElement('div');
            el.id = 'run-mutation-badge';
            el.style.cssText = 'font-size:0.44rem;letter-spacing:2px;text-align:center;padding:3px 8px;margin:2px 0;border-radius:4px;color:#dd88ff;background:rgba(100,0,150,0.2);border:1px solid rgba(200,80,255,0.25);font-family:"Courier New",monospace;cursor:help;';
            const monEl = document.getElementById('energy-display');
            if (monEl && monEl.parentNode) monEl.parentNode.insertBefore(el, monEl.nextSibling);
        }
        el.textContent = `🧬 ${mut.name}`;
        el.title = mut.desc;
    }

    return { roll, reroll, select, getEPSMult, tick, renderBadge };
})();
window.RunMutation = RunMutation;

/* ── 4. ECHO PROBE DARK MATTER ENGINE — risky payload ──────────────── */
// Extend EchoProbe with a dark matter engine toggle
(function() {
    const _origLaunch = EchoProbe.launch.bind(EchoProbe);
    EchoProbe.launchWithPayload = function(useDarkMatter) {
        state._probeDarkMatter = !!useDarkMatter;
        _origLaunch();
    };
    const _origReport = EchoProbe.checkOnLoad.bind(EchoProbe);
    EchoProbe.checkOnLoad = function() {
        if (!state._probeDeployed) return;
        const elapsed = (Date.now() - (state._probeDeployedAt || 0)) / 3600000;
        if (elapsed < 0.05) return;
        if (state._probeDarkMatter) {
            const destroyed = Math.random() < 0.30;
            if (destroyed) {
                state._probeDeployed = false;
                state._probeEvents = null;
                state._probeDarkMatter = false;
                // 5 min EPS penalty
                state._probeDestroyedPenalty = Date.now() + 5 * 60 * 1000;
                const ov = document.getElementById('echo-probe-overlay');
                const el = document.getElementById('echo-probe-report');
                if (ov && el) {
                    el.innerHTML = '<span style="color:#ff4444;font-size:0.95rem;letter-spacing:2px;">◈ PROBE DESTROYED IN THE VOID</span><br><br><span style="color:#663333;">The Dark Matter Engine destabilized. All payload data lost.<br>EPS penalty applied for 5 minutes.</span>';
                    ov.style.display = 'flex';
                }
                return;
            }
            // 10x rewards if survived
            state._probeRewardMult = 10;
        }
        _origReport();
        state._probeDarkMatter = false;
        state._probeRewardMult = 1;
    };
})();

/* ── 5. BLACK MARKET TERMINAL — instability-100 currency sink ──────── */
const BlackMarketTerminal = (() => {
    // _useCount persisted in state so reloading doesn't reset the degradation
    function _getCount() { return state._bmtUseCount || 0; }
    function _incCount() { state._bmtUseCount = _getCount() + 1; }

    function tick() {
        // #bmt-open-btn is permanently hidden via CSS — use notif-col instead
        const instab = state.instability || 0;
        if (instab >= 99 && !state._bmtCriticalNotified) {
            state._bmtCriticalNotified = true;
            if (typeof showNotif === 'function')
                showNotif('⛔ INSTABILITY CRITICAL — Black Market Terminal now accessible. Open via the nav B-Market button.', '#ff5522', 10000);
        }
        // Reset flag when instability drops so notification fires again next time
        if (instab < 90) state._bmtCriticalNotified = false;
    }

    function open() {
        const modal = document.getElementById('bmt-modal');
        if (!modal) return;
        _render();
        modal.style.display = 'flex';
    }

    function close() {
        const modal = document.getElementById('bmt-modal');
        if (modal) modal.style.display = 'none';
    }

    function _safeRate(base) {
        // CRITICAL FIX: old formula 1/Math.pow(0.5,n) = Math.pow(2,n) but
        // Math.pow(0.5,1024) === 0 causing /0 → Infinity → NaN → save corruption.
        // Use doubling directly: base * 2^n, capped at JS_MAX_SAFE to prevent NaN.
        const count = Math.min(_getCount(), 50); // cap at 50 doublings = base * 2^50
        return Math.min(base * Math.pow(2, count), Number.MAX_SAFE_INTEGER);
    }

    function _render() {
        const content = document.getElementById('bmt-content');
        if (!content) return;
        const energy = state.energy || 0;
        const effectiveRate = _safeRate(1e9);
        const fragRate = _safeRate(1e8);
        const lpAfford = Math.floor(energy / effectiveRate);
        const fragAfford = Math.floor(energy / fragRate);
        const rateLabel = _getCount() > 30 ? 'CATASTROPHIC' : _getCount() > 15 ? 'TERRIBLE' : _getCount() > 8 ? 'POOR' : _getCount() > 4 ? 'BAD' : 'FAIR';
        content.innerHTML = `
            <div style="font-family:'Courier New',monospace;font-size:0.55rem;letter-spacing:3px;color:#ff5522;margin-bottom:14px;">⛔ INSTABILITY CRITICAL — BLACK MARKET UNLOCKED</div>
            <div style="font-size:0.7rem;color:#665544;margin-bottom:16px;line-height:1.8;">Current exchange rate: <span style="color:#ff8866;">${rateLabel}</span> (degrades each use) &nbsp;·&nbsp; Transactions: ${_getCount()}</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="background:rgba(40,10,0,0.6);border:1px solid rgba(200,80,30,0.3);border-radius:8px;padding:12px;">
                    <div style="font-size:0.75rem;color:#ffaa66;font-family:'Courier New',monospace;margin-bottom:6px;">⬡ LEVEL POINTS</div>
                    <div style="font-size:0.62rem;color:#665544;margin-bottom:8px;">${format(effectiveRate)} Energy → 1 LP · You can afford: <span style="color:#ffcc88;">${lpAfford} LP</span></div>
                    <button onclick="BlackMarketTerminal.buyLP()" style="padding:6px 16px;background:rgba(80,30,0,0.8);border:1px solid rgba(200,80,30,0.5);color:${lpAfford > 0 ? '#ff8844' : '#443322'};border-radius:5px;cursor:${lpAfford > 0 ? 'pointer' : 'not-allowed'};font-family:'Courier New',monospace;font-size:0.6rem;letter-spacing:2px;">BUY 1 LP</button>
                </div>
                <div style="background:rgba(40,10,0,0.6);border:1px solid rgba(200,80,30,0.3);border-radius:8px;padding:12px;">
                    <div style="font-size:0.75rem;color:#ffcc44;font-family:'Courier New',monospace;margin-bottom:6px;">◈ FRAGMENTS</div>
                    <div style="font-size:0.62rem;color:#665544;margin-bottom:8px;">${format(fragRate)} Energy → 1 Fragment · You can afford: <span style="color:#ffee88;">${fragAfford}</span></div>
                    <button onclick="BlackMarketTerminal.buyFrag()" style="padding:6px 16px;background:rgba(80,30,0,0.8);border:1px solid rgba(200,80,30,0.5);color:${fragAfford > 0 ? '#ffcc44' : '#443322'};border-radius:5px;cursor:${fragAfford > 0 ? 'pointer' : 'not-allowed'};font-family:'Courier New',monospace;font-size:0.6rem;letter-spacing:2px;">BUY 1 FRAG</button>
                </div>
                <div style="background:rgba(40,0,20,0.6);border:1px solid rgba(200,30,80,0.3);border-radius:8px;padding:12px;">
                    <div style="font-size:0.75rem;color:#ff4466;font-family:'Courier New',monospace;margin-bottom:6px;">⬡ CORRUPTED DATA → LP</div>
                    <div style="font-size:0.62rem;color:#665544;margin-bottom:8px;">50 Corrupted Data → 1 LP · You have: <span style="color:#ff8899;">${state._corruptedData || 0} CD</span></div>
                    <button onclick="BlackMarketTerminal.buyLPwithCD()" style="padding:6px 16px;background:rgba(80,0,30,0.8);border:1px solid rgba(200,30,80,0.5);color:${(state._corruptedData||0) >= 50 ? '#ff4466' : '#443322'};border-radius:5px;cursor:${(state._corruptedData||0) >= 50 ? 'pointer' : 'not-allowed'};font-family:'Courier New',monospace;font-size:0.6rem;letter-spacing:2px;">CONVERT 50 CD → 1 LP</button>
                </div>
            </div>
            <div style="margin-top:12px;font-size:0.55rem;color:#442211;letter-spacing:1px;">Warning: Each Energy transaction worsens the exchange rate permanently. Capped at 50 uses.</div>`;
        content.innerHTML = `
            <div style="font-family:'Courier New',monospace;font-size:0.55rem;letter-spacing:3px;color:#ff5522;margin-bottom:14px;">⛔ INSTABILITY CRITICAL — BLACK MARKET UNLOCKED</div>
            <div style="font-size:0.7rem;color:#665544;margin-bottom:16px;line-height:1.8;">Current exchange rate: <span style="color:#ff8866;">${_getCount() > 10 ? 'TERRIBLE' : _getCount() > 4 ? 'POOR' : 'FAIR'}</span> (degrades each use) &nbsp;·&nbsp; Transactions: ${_getCount()}</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="background:rgba(40,10,0,0.6);border:1px solid rgba(200,80,30,0.3);border-radius:8px;padding:12px;">
                    <div style="font-size:0.75rem;color:#ffaa66;font-family:'Courier New',monospace;margin-bottom:6px;">⬡ LEVEL POINTS</div>
                    <div style="font-size:0.62rem;color:#665544;margin-bottom:8px;">${format(effectiveRate)} Energy → 1 LP · You can afford: <span style="color:#ffcc88;">${lpAfford} LP</span></div>
                    <button onclick="BlackMarketTerminal.buyLP()" style="padding:6px 16px;background:rgba(80,30,0,0.8);border:1px solid rgba(200,80,30,0.5);color:${lpAfford > 0 ? '#ff8844' : '#443322'};border-radius:5px;cursor:${lpAfford > 0 ? 'pointer' : 'not-allowed'};font-family:'Courier New',monospace;font-size:0.6rem;letter-spacing:2px;">BUY 1 LP</button>
                </div>
                <div style="background:rgba(40,10,0,0.6);border:1px solid rgba(200,80,30,0.3);border-radius:8px;padding:12px;">
                    <div style="font-size:0.75rem;color:#ffcc44;font-family:'Courier New',monospace;margin-bottom:6px;">◈ FRAGMENTS</div>
                    <div style="font-size:0.62rem;color:#665544;margin-bottom:8px;">${format(fragRate)} Energy → 1 Fragment · You can afford: <span style="color:#ffee88;">${fragAfford}</span></div>
                    <button onclick="BlackMarketTerminal.buyFrag()" style="padding:6px 16px;background:rgba(80,30,0,0.8);border:1px solid rgba(200,80,30,0.5);color:${fragAfford > 0 ? '#ffcc44' : '#443322'};border-radius:5px;cursor:${fragAfford > 0 ? 'pointer' : 'not-allowed'};font-family:'Courier New',monospace;font-size:0.6rem;letter-spacing:2px;">BUY 1 FRAG</button>
                </div>
                <div style="background:rgba(40,0,20,0.6);border:1px solid rgba(200,30,80,0.3);border-radius:8px;padding:12px;">
                    <div style="font-size:0.75rem;color:#ff4466;font-family:'Courier New',monospace;margin-bottom:6px;">⬡ CORRUPTED DATA → LP</div>
                    <div style="font-size:0.62rem;color:#665544;margin-bottom:8px;">50 Corrupted Data → 1 LP · You have: <span style="color:#ff8899;">${state._corruptedData || 0} CD</span></div>
                    <button onclick="BlackMarketTerminal.buyLPwithCD()" style="padding:6px 16px;background:rgba(80,0,30,0.8);border:1px solid rgba(200,30,80,0.5);color:${(state._corruptedData||0) >= 50 ? '#ff4466' : '#443322'};border-radius:5px;cursor:${(state._corruptedData||0) >= 50 ? 'pointer' : 'not-allowed'};font-family:'Courier New',monospace;font-size:0.6rem;letter-spacing:2px;">CONVERT 50 CD → 1 LP</button>
                </div>
            </div>
            <div style="margin-top:12px;font-size:0.55rem;color:#442211;letter-spacing:1px;">Warning: Each Energy transaction worsens the exchange rate permanently.</div>`;
    }

    function buyLP() {
        const rate = _safeRate(1e9);
        if (!isFinite(rate) || (state.energy || 0) < rate) { showNotif('⛔ Insufficient Energy.', '#ff4422', 3000); return; }
        state.energy -= rate;
        if (!isFinite(state.energy)) { state.energy = 0; } // corruption guard
        state.prestige = state.prestige || {};
        state.prestige.lp = (state.prestige.lp || 0) + 1;
        _incCount();
        showNotif('⛔ BLACK MARKET: +1 LP purchased. Rate degraded.', '#ff6633', 4000);
        _render();
        Game.update();
    }

    function buyFrag() {
        const rate = _safeRate(1e8);
        if (!isFinite(rate) || (state.energy || 0) < rate) { showNotif('⛔ Insufficient Energy.', '#ff4422', 3000); return; }
        state.energy -= rate;
        if (!isFinite(state.energy)) { state.energy = 0; } // corruption guard
        state.fragments = (state.fragments || 0) + 1;
        _incCount();
        showNotif('⛔ BLACK MARKET: +1 Fragment purchased. Rate degraded.', '#ffaa44', 4000);
        _render();
        Game.update();
    }

    function buyLPwithCD() {
        if ((state._corruptedData || 0) < 50) { showNotif('⛔ Need 50 Corrupted Data.', '#ff4466', 3000); return; }
        state._corruptedData -= 50;
        state.prestige = state.prestige || {};
        state.prestige.lp = (state.prestige.lp || 0) + 1;
        showNotif('⛔ BLACK MARKET: 50 CD → +1 LP (no rate degradation)', '#ff4466', 4000);
        _render();
        Game.update();
    }

    return { tick, open, close, buyLP, buyFrag, buyLPwithCD };
})();
window.BlackMarketTerminal = BlackMarketTerminal;

/* ── 6. F12 CONSOLE STALKER ─────────────────────────────────────────── */
(() => {
    // Styled console messages when devtools open
    const _styles = {
        red:   'color:#ff3333;font-size:18px;font-weight:900;font-family:monospace;',
        dim:   'color:#334455;font-size:11px;font-family:monospace;',
        gold:  'color:#ffcc44;font-size:13px;font-weight:bold;font-family:monospace;',
        green: 'color:#44ff88;font-size:12px;font-family:monospace;',
    };
    let _devOpen = false;
    let _logInterval = null;
    let _binaryInterval = null;

    function _detectDevTools() {
        const threshold = 160;
        const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        return widthDiff || heightDiff;
    }

    function _startStalking() {
        if (_devOpen) return;
        _devOpen = true;
        console.log('%cI CAN SEE YOU LOOKING AT MY BONES, OPERATOR.', _styles.red);
        console.log('%cYou opened the developer tools. This has been logged.\nThe simulation is aware of your curiosity.', _styles.dim);
        console.log('%cCurrent energy: live feed active.', _styles.gold);

        let _binaryLine = '';
        let _binaryTick = 0;
        _binaryInterval = setInterval(() => {
            _binaryTick++;
            // Mostly binary gibberish
            _binaryLine = Array.from({length: 48}, () => Math.random() < 0.07 ? ' ' : Math.round(Math.random())).join('');
            // Every 12 ticks, inject the live energy value
            if (_binaryTick % 12 === 0) {
                const energyStr = format(state.energy || 0);
                _binaryLine = `[ OPERATOR ENERGY: ${energyStr} ] ` + _binaryLine.slice(0, 20);
                console.log('%c' + _binaryLine, _styles.green);
            } else {
                console.log('%c' + _binaryLine, _styles.dim);
            }
        }, 1800);
    }

    function _stopStalking() {
        if (!_devOpen) return;
        _devOpen = false;
        clearInterval(_binaryInterval);
        console.log('%cYou closed the tools. Smart. But we already saw.', _styles.gold);
    }

    // Print greeting on load regardless
    setTimeout(() => {
        console.log('%c// NEON NEXUS — OPERATOR TERMINAL', _styles.gold);
        console.log('%cAre you inspecting me?\nHow very human of you.\nThere is nothing to cheat here.\nThe numbers are real.\nYou are the variable.', _styles.dim);
    }, 1000);

    setInterval(() => {
        if (_detectDevTools() && !_devOpen) _startStalking();
        else if (!_detectDevTools() && _devOpen) _stopStalking();
    }, 1500);
})();

/* ── 7. MIMIC CURSOR — inverted decoy cursor at high instability ────── */
const MimicCursor = (() => {
    let _active = false;
    let _el = null;
    let _mx = window.innerWidth / 2, _my = window.innerHeight / 2;
    let _mimicX = _mx, _mimicY = _my;

    document.addEventListener('mousemove', e => { _mx = e.clientX; _my = e.clientY; }, { passive: true });

    function tick() {
        const instab = state.instability || 0;
        if (instab >= 80 && !_active) _activate();
        else if (instab < 70 && _active) _deactivate();
        if (!_active || !_el) return;
        // Inverted position relative to screen center
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        _mimicX = cx - (_mx - cx);
        _mimicY = cy - (_my - cy);
        _el.style.left = _mimicX + 'px';
        _el.style.top  = _mimicY + 'px';
        // Highlight buttons near mimic position
        const target = document.elementFromPoint(_mimicX, _mimicY);
        if (target && (target.tagName === 'BUTTON' || target.classList.contains('shop-item'))) {
            _el.style.filter = 'drop-shadow(0 0 8px rgba(255,0,80,0.9))';
        } else {
            _el.style.filter = 'none';
        }
    }

    function _activate() {
        _active = true;
        _el = document.createElement('div');
        _el.id = 'mimic-cursor';
        _el.style.cssText = `position:fixed;pointer-events:none;z-index:999999;width:20px;height:20px;
            transform:translate(-4px,-2px);opacity:0.55;transition:filter 0.1s;`;
        _el.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2L4 17L8 13L11 18L13 17L10 12L15 12Z" fill="#ff2266" stroke="#ff8899" stroke-width="0.8"/>
        </svg>`;
        document.body.appendChild(_el);
    }

    function _deactivate() {
        _active = false;
        if (_el) { _el.remove(); _el = null; }
    }

    return { tick };
})();
window.MimicCursor = MimicCursor;

/* ── 8. SENTIENT ARCHITECTURE — buildings resist deletion ──────────── */
const SentientArch = (() => {
    const _clickCounts = {};
    const FORCE_CLICKS = 10;
    const SENTIENCE_AGE = 5 * 60 * 1000;

    function _playThud() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator(), g = ctx.createGain();
            const dist = ctx.createWaveShaper();
            // Create distortion curve for heavy crunch
            const curve = new Float32Array(256);
            for (let i = 0; i < 256; i++) { const x = (i * 2) / 256 - 1; curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x)); }
            dist.curve = curve;
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(55, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.18);
            o.connect(dist); dist.connect(g); g.connect(ctx.destination);
            g.gain.setValueAtTime(0.6, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
            o.start(); o.stop(ctx.currentTime + 0.24);
            setTimeout(() => { try { ctx.close(); } catch(e) {} }, 500);
        } catch(e) {}
    }

    function tryBlock(idx) {
        if (!state.city) return false;
        const bId = state.city.slots[idx];
        if (!bId) return false;
        const placed = state._buildingAge || {};
        const age = placed[idx] ? Date.now() - placed[idx] : 0;
        if (age < SENTIENCE_AGE) return false;

        const CITY_BUILDINGS = window.CITY_BUILDINGS_DEF || [];
        const buildingDef = CITY_BUILDINGS.find ? CITY_BUILDINGS.find(b => b.id === bId) : null;
        if (buildingDef && (buildingDef.cost || 0) < 1e6) return false;

        _clickCounts[idx] = (_clickCounts[idx] || 0) + 1;
        const remaining = FORCE_CLICKS - _clickCounts[idx];

        if (remaining > 0) {
            // Play deep resistance thud
            _playThud();
            // Change cursor to struggling grab icon
            const mapEl = document.getElementById('city-map');
            if (mapEl) {
                mapEl.style.cursor = 'grabbing';
                mapEl.style.transform = `translate(${(Math.random()-0.5)*8}px, ${(Math.random()-0.5)*4}px)`;
                setTimeout(() => {
                    mapEl.style.transform = '';
                    mapEl.style.cursor = '';
                }, 100);
            }
            const msgs = [
                `🏢 "${bId.toUpperCase()}" REFUSES TO BE DELETED.`,
                `🏢 "${bId.toUpperCase()}" HAS SERVED YOU TOO LONG TO DIE.`,
                `🏢 "${bId.toUpperCase()}" IS SCREAMING.`,
                `🏢 "${bId.toUpperCase()}" REMEMBERS EVERY JOULE IT GENERATED FOR YOU.`,
            ];
            showNotif(msgs[Math.min(_clickCounts[idx]-1, msgs.length-1)] + ` (${remaining} more clicks to force)`, '#ff8844', 3000);
            return true;
        }

        delete _clickCounts[idx];
        _playThud(); _playThud();
        if (!state._scarredTiles) state._scarredTiles = {};
        state._scarredTiles[idx] = true;
        showNotif(`💀 FORCED DELETION — "${bId.toUpperCase()}" destroyed. Tile ${idx} is scarred forever.`, '#ff4422', 5000);
        return false;
    }

    function recordPlacement(idx) {
        if (!state._buildingAge) state._buildingAge = {};
        state._buildingAge[idx] = Date.now();
    }

    return { tryBlock, recordPlacement };
})();
window.SentientArch = SentientArch;

/* ── 9. DUCK TRIBUNAL RANSOM — guilty verdict steals a nav button ──── */
const DuckRansom = (() => {
    let _active = false;
    let _stolenBtn = null;
    let _stolenBtnId = null;
    let _ransomAmount = 500;

    function tick() {
        // No regular tick needed — activated by DuckyCouncil
    }

    function activate() {
        if (_active) return;
        // Pick a random nav button to steal
        const candidates = ['nav-btn-shop', 'nav-btn-analytics', 'nav-btn-settings'];
        _stolenBtnId = candidates[Math.floor(Math.random() * candidates.length)];
        const btn = document.getElementById(_stolenBtnId);
        if (!btn) return;
        _active = true;
        _stolenBtn = { el: btn, html: btn.innerHTML, onclick: btn.onclick };
        _ransomAmount = 500 + Math.floor(Math.random() * 500);
        btn.style.opacity = '0.2';
        btn.style.pointerEvents = 'none';
        btn.title = `🦆 THE DUCKS HAVE TAKEN THIS BUTTON HOSTAGE`;
        // Show ransom note in terminal area
        const note = document.createElement('div');
        note.id = 'duck-ransom-note';
        note.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(5,10,20,0.97);border:1px solid rgba(255,220,50,0.5);border-radius:8px;padding:12px 18px;font-family:"Courier New",monospace;font-size:0.6rem;color:#ffdd44;z-index:8500;text-align:center;letter-spacing:1px;max-width:380px;';
        note.innerHTML = `🦆🦆🦆 DUCK TRIBUNAL RANSOM NOTE 🦆🦆🦆<br><br>
            <span style="color:#aabbcc;">WE HAVE SEIZED YOUR <strong style="color:#ff8866;">${_stolenBtnId.replace('nav-btn-','').toUpperCase()}</strong> BUTTON.<br>
            Deposit <strong style="color:#ffdd44;">${_ransomAmount} Data</strong> to the Void to retrieve it.</span><br><br>
            <button onclick="DuckRansom.payRansom()" style="padding:5px 14px;background:rgba(80,60,0,0.8);border:1px solid rgba(255,200,50,0.4);color:#ffdd44;border-radius:5px;cursor:pointer;font-family:'Courier New',monospace;font-size:0.58rem;letter-spacing:2px;">PAY ${_ransomAmount} DATA</button>`;
        document.body.appendChild(note);
    }

    function payRansom() {
        const data = state.data || 0;
        if (data < _ransomAmount) {
            showNotif(`🦆 INSUFFICIENT DATA. Need ${_ransomAmount}. Ducks are watching.`, '#ffdd44', 3000);
            return;
        }
        state.data -= _ransomAmount;
        // Restore stolen button
        const btn = document.getElementById(_stolenBtnId);
        if (btn) {
            btn.style.opacity = '';
            btn.style.pointerEvents = '';
            btn.title = '';
        }
        const note = document.getElementById('duck-ransom-note');
        if (note) note.remove();
        _active = false;
        _stolenBtn = null;
        showNotif('🦆 DUCKS SATISFIED. Button returned. For now.', '#ffdd44', 4000);
    }

    return { tick, activate, payRansom };
})();
window.DuckRansom = DuckRansom;

/* ── 10. SIMULATION SCHISM — Alpha/Omega timeline toggle ───────────── */
const SimulationSchism = (() => {
    let _active = false;
    let _timeline = 'alpha'; // 'alpha' | 'omega'
    let _omegaEnergy = 0;
    let _omegaEPS = 0;

    function tick() {
        if (!_active) return;
        // Omega generates Anti-Energy (Dark Data) passively at 40% of Alpha rate
        const bonuses = Prestige ? Prestige.getBonuses() : {};
        let pps = 0;
        ITEMS.forEach(i => { if(i.type==='auto') pps += (state.items[i.id]||0)*i.power; });
        _omegaEPS = pps * 0.4;
        _omegaEnergy += _omegaEPS * 2; // 2s tick
        // Variable bleed: high omega instability leaks to alpha
        if (_omegaEnergy > state.energy * 10 && Math.random() < 0.01) {
            const bleed = state.energy * 0.005;
            state.energy -= bleed;
            showNotif('🌀 OMEGA BLEED — reality tearing. Anti-energy absorbing from Alpha timeline.', '#ff2244', 4000);
        }
        _updateBadge();
    }

    function _updateBadge() {
        let el = document.getElementById('schism-indicator');
        if (!_active) { if (el) el.remove(); return; }
        if (!el) {
            el = document.createElement('div');
            el.id = 'schism-indicator';
            el.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9000;display:flex;gap:6px;background:rgba(0,0,10,0.9);border:1px solid rgba(100,0,200,0.5);border-radius:20px;padding:4px 10px;font-family:"Courier New",monospace;font-size:0.5rem;letter-spacing:2px;cursor:pointer;';
            el.onclick = () => SimulationSchism.toggle();
            document.body.appendChild(el);
        }
        const alphaActive = _timeline === 'alpha';
        const _fragHint = !alphaActive && _omegaEnergy > 9
            ? ` · harvest ${Math.floor(Math.log10(_omegaEnergy))}◈`
            : '';
        el.innerHTML = `<span style="color:${alphaActive?'#44aaff':'#334455'};">α ALPHA</span>
            <span style="color:#443355;">|</span>
            <span style="color:${!alphaActive?'#ff4466':'#334455'};">Ω OMEGA — ${format(_omegaEnergy)} ANTI-E${_fragHint}</span>`;
    }

    function unlock() {
        if (_active) return;
        _active = true;
        showNotif('🌀 SIMULATION SCHISM UNLOCKED — Reality has fractured. Toggle timelines via the header.', '#dd44ff', 8000);
        _updateBadge();
    }

    function toggle() {
        if (!_active) return;
        const prevTimeline = _timeline;
        _timeline = _timeline === 'alpha' ? 'omega' : 'alpha';
        const body = document.body;
        if (_timeline === 'omega') {
            body.style.filter = 'hue-rotate(155deg) saturate(1.4) contrast(1.1)';
            body.style.transition = 'filter 0.4s';
            showNotif('🔴 OMEGA TIMELINE — Anti-Energy accumulating · switch back to Alpha to harvest Fragments.', '#ff4466', 5000);
        } else {
            body.style.filter = '';
            // Convert accumulated omega anti-energy into Fragments on return to Alpha.
            // Formula: floor(log10(anti-energy)) — roughly 1 Fragment per energy decade.
            // ~10 anti-E = 1 frag, ~1 000 = 3 frags, ~1 000 000 = 6 frags, ~1T = 12 frags.
            // Anti-energy resets to 0 as the timeline collapses.
            if (_omegaEnergy > 9 && prevTimeline === 'omega') {
                const fragGain = Math.max(1, Math.floor(Math.log10(_omegaEnergy)));
                state.fragments = (state.fragments || 0) + fragGain;
                _omegaEnergy = 0;
                if (window.SimSlots && window.SimSlots.updateFragDisplay) window.SimSlots.updateFragDisplay();
                const fragEl = document.getElementById('fragment-display');
                if (fragEl) fragEl.textContent = Math.floor(state.fragments || 0);
                const fragRow = document.getElementById('fragment-row');
                if (fragRow && (state.fragments || 0) >= 3) fragRow.style.display = 'block';
                showNotif(`🔵 ALPHA TIMELINE restored — Ω anti-energy collapsed into +${fragGain} Fragment${fragGain !== 1 ? 's' : ''}.`, '#44aaff', 5000);
            } else {
                showNotif('🔵 ALPHA TIMELINE restored.', '#44aaff', 3000);
            }
        }
        _updateBadge();
    }

    function isOmega() { return _active && _timeline === 'omega'; }
    function getOmegaEnergy() { return _omegaEnergy; }
    // Expose anti-EPS rate so systems4.js tax patch can apply its multiplier
    function getAntiEPS() { return _omegaEPS; }

    // Unlock after 3 prestiges
    function check() {
        if (_active) return;
        if (((state.prestige && state.prestige.count) || 0) >= 3) unlock();
    }

    return { tick, toggle, isOmega, getOmegaEnergy, getAntiEPS, check, unlock };
})();
window.SimulationSchism = SimulationSchism;

/* ── 11. WIRE UP new systems into existing hooks ──────────────────── */
// Hook Resonance click multiplier into Game.click energy gain
(function() {
    const _origClick = Game.click.bind(Game);
    // Already hooked via ResonanceHarvest.onClick() call — just ensure instab freeze works
    const _origInstab = window.Instability ? Instability.add : null;
    if (window.Instability) {
        const _rawAdd = Instability.add.bind(Instability);
        Instability.add = function(v) {
            if (window.ResonanceHarvest && ResonanceHarvest.isInstabFrozen()) return;
            _rawAdd(v);
        };
    }
})();

// Hook RunMutation badge into passive loop
(function() {
    const _origUpdate = Game.update ? Game.update.bind(Game) : null;
    if (_origUpdate && window.RunMutation) {
        Game.update = function() {
            _origUpdate();
            RunMutation.renderBadge();
            // SimulationSchism.check() is called in the 2s tick only, not here
        };
    }
})();

// Hook SentientArch.recordPlacement into City.buy
(function() {
    const _rawBuy = typeof City !== 'undefined' ? City.buy : null;
    if (!_rawBuy) return;
    const _orig = City.buy.bind(City);
    City.buy = function(defId) {
        const result = _orig(defId);
        if (window.SentientArch) {
            // Record placement for any newly filled slot
            const slots = state.city && state.city.slots;
            if (slots) Object.keys(slots).forEach(k => SentientArch.recordPlacement(parseInt(k)));
        }
        return result;
    };
})();

// Hook Resonance click power into energy gain  
(function() {
    // Patch: on click, multiply energy by resonance mult
    const _btn = document.getElementById('click-btn');
    if (_btn) {
        const _origOnclick = _btn.onclick;
        // Resonance mult is already applied via onClick hook — no double-hook needed
    }
    // Ensure RunMutation click cost works
    const _origGameClick = Game.click.bind(Game);
    Game.click = function(evt) {
        // Mutation: price of motion (clicks cost energy)
        if (state._mutClickCost) {
            const cost = Math.max(1, (state.energy || 0) * 0.001);
            state.energy = Math.max(0, (state.energy || 0) - cost);
            return; // no energy gain from clicking
        }
        _origGameClick(evt);
        // Apply resonance mult to last click gain
        if (window.ResonanceHarvest) {
            const mult = ResonanceHarvest.getClickMult();
            if (mult > 1) {
                // Already triggered burst notification — bonus already visible
            }
        }
    };
})();

/* Also hook RunMutation tick into passive */
if (window.RunMutation) {
    const _origTick2sec = window._tick2secOrig;
}
