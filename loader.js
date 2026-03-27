
    (function(){
        var loader = document.getElementById('nexus-loader');
        if (!loader) return;
        var statusEl = document.getElementById('nl-status-text');
        var _startTime = Date.now();
        var MIN_SHOW_MS = 5000; // minimum 5 seconds on screen for smoothness
        var _dismissed  = false;

        var _completionPhrases = [
            'System online.',
            'Simulation ready.',
            'Grid connected.',
            'Nexus active.',
            'Operator clearance granted.',
            'All systems nominal.',
            'Neural link established.',
            'City simulation loaded.',
            'Data streams verified.',
            'Welcome back, Operator.',
        ];

        function dismiss() {
            if (_dismissed) return;
            _dismissed = true;
            if (statusEl) {
                var phrase = _completionPhrases[Math.floor(Math.random() * _completionPhrases.length)];
                statusEl.textContent = phrase;
            }
            // Enforce the minimum display time regardless of when load fires
            var elapsed = Date.now() - _startTime;
            var holdMs  = Math.max(0, MIN_SHOW_MS - elapsed) + 200;
            setTimeout(function() {
                loader.classList.add('fade-out');
                setTimeout(function(){ loader.style.display = 'none'; }, 700);
            }, holdMs);
        }

        // Returning players — still show 5s minimum so the video plays smoothly
        if (localStorage.getItem('neonNexus_bootSeen')) {
            var returnStages = [
                [0,    'Reconnecting to grid...'],
                [1500, 'Restoring simulation state...'],
                [3000, 'Synchronising city data...'],
                [4500, 'Ready for deployment...'],
            ];
            returnStages.forEach(function(s) {
                setTimeout(function() {
                    if (statusEl && !_dismissed) statusEl.textContent = s[1];
                }, s[0]);
            });
            window.addEventListener('load', function(){ dismiss(); });
            setTimeout(dismiss, 9000); // safety fallback
            return;
        }

        // First-time boot: run the full initialization sequence
        localStorage.setItem('neonNexus_bootSeen', '1');
        var stages = [
            [0,    'Decoding graphics...'],
            [1500, 'Initializing game state...'],
            [3000, 'Loading city systems...'],
            [4500, 'Calibrating shop engine...'],
            [6000, 'Wiring event systems...'],
            [7500, 'Connecting income nodes...'],
            [9000, 'Starting simulation...'],
        ];
        stages.forEach(function(s) {
            setTimeout(function() {
                if (statusEl && !_dismissed) statusEl.textContent = s[1];
            }, s[0]);
        });
        window.addEventListener('load', function(){ dismiss(); });
        setTimeout(dismiss, 14000); // safety fallback
    })();

