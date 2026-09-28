// Trace Zero — small progressive enhancements. Every page works without it.
(function () {
    // Paste the App Store link here once the app is live, e.g.
    // 'https://apps.apple.com/app/id1234567890'. While it's empty, the
    // download buttons read "Coming soon to the App Store".
    var APP_STORE_URL = '';

    document.documentElement.classList.remove('no-js');

    document.querySelectorAll('[data-appstore]').forEach(function (btn) {
        if (APP_STORE_URL) {
            btn.href = APP_STORE_URL;
            btn.target = '_blank';
            btn.rel = 'noopener';
        } else {
            btn.removeAttribute('href');
            btn.setAttribute('aria-disabled', 'true');
            btn.style.cursor = 'default';
            var label = btn.querySelector('[data-appstore-label]');
            if (label) { label.textContent = 'Coming soon to the App Store'; }
        }
    });

    // Mobile menu
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    if (nav && toggle) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        nav.querySelectorAll('.nav-links a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    }

    // Reveal on scroll
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    // Legal pages: table of contents is open on wide screens, collapsible on
    // small ones, and highlights the section being read.
    var toc = document.querySelector('.toc');
    if (toc) {
        var mq = window.matchMedia('(max-width: 880px)');
        var syncToc = function () { toc.open = !mq.matches; };
        syncToc();
        if (mq.addEventListener) { mq.addEventListener('change', syncToc); }

        toc.querySelector('summary').addEventListener('click', function (e) {
            if (!mq.matches) { e.preventDefault(); }
        });

        var links = toc.querySelectorAll('a[href^="#"]');
        var byId = {};
        links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

        if ('IntersectionObserver' in window) {
            var spy = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) { return; }
                    links.forEach(function (a) { a.classList.remove('active'); });
                    var link = byId[entry.target.id];
                    if (link) { link.classList.add('active'); }
                });
            }, { rootMargin: '-20% 0px -70% 0px' });
            document.querySelectorAll('.legal-content section[id]').forEach(function (s) { spy.observe(s); });
        }
    }

    var year = document.getElementById('year');
    if (year) { year.textContent = new Date().getFullYear(); }
})();
