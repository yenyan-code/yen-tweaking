document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 1. Header scroll effect
    const header = document.querySelector('.header-nav');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    if (hamburger && mobileOverlay) {
        hamburger.addEventListener('click', () => {
            mobileOverlay.classList.toggle('active');
            hamburger.textContent = mobileOverlay.classList.contains('active') ? 'Close' : 'Menu';
        });
    }

    // 3. Copy Email Functionality
    const copyEmailBtns = document.querySelectorAll('.btn-copy-email, [data-copy-email]');
    copyEmailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = "mahmoudashrf047@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                const originalText = btn.innerHTML;
                btn.innerHTML = `<span>Copied! ✓</span>`;
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy email: ", err);
            });
        });
    });

    // 4. Highlight Active Navigation Link
    const currentPath = window.location.pathname.split('/').pop() || 'Home.html';
    const navLinks = document.querySelectorAll('.nav-link-item, .mobile-nav-item');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'Home.html')) {
            link.classList.add('active');
        }
    });

    // 5. Scramble Text Effect (Originkit Glitch Reveal)
    class ScrambleText {
        constructor(el) {
            this.el = el;
            this.originalText = el.getAttribute('data-value') || el.innerText;
            this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█0123456789!@#$%^&*()';
            this.queue = [];
            this.isAnimating = false;
            this.init();
        }

        init() {
            this.el.addEventListener('mouseenter', () => this.scramble());
            // Trigger initial entrance scramble
            setTimeout(() => this.scramble(), 300);
        }

        scramble() {
            if (this.isAnimating) return;
            const length = this.originalText.length;
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const to = this.originalText[i];
                const start = Math.floor(Math.random() * 20);
                const end = start + Math.floor(Math.random() * 30) + 12;
                this.queue.push({ to, start, end, char: '' });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.isAnimating = true;
            this.update();
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0; i < this.queue.length; i++) {
                let { to, start, end, char } = this.queue[i];

                if (to === ' ' || to === '—' || to === '&') {
                    output += to;
                    complete++;
                    continue;
                }

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.35) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="glitch-char">${char}</span>`;
                } else {
                    output += to;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.isAnimating = false;
            } else {
                this.frameRequest = requestAnimationFrame(() => this.update());
                this.frame++;
            }
        }
    }

    // Initialize scramble text on all targets
    const scrambleTargets = document.querySelectorAll('.scramble-text-target');
    scrambleTargets.forEach(el => new ScrambleText(el));

    // 6. Floating Case Study TOC Navigation Bar & Scrollspy
    const csTocToggleBtn = document.querySelector('.cs-toc-toggle-btn');
    const csTocPopup = document.querySelector('.cs-toc-popup');
    const csTocLinks = document.querySelectorAll('.cs-toc-link');

    if (csTocToggleBtn && csTocPopup) {
        csTocToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            csTocPopup.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!csTocPopup.contains(e.target) && !csTocToggleBtn.contains(e.target)) {
                csTocPopup.classList.remove('active');
            }
        });

        csTocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        csTocPopup.classList.remove('active');
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Scrollspy for TOC links
        const sections = document.querySelectorAll('section[id], div[id]');
        if (sections.length > 0) {
            window.addEventListener('scroll', () => {
                let current = '';
                const scrollPos = window.scrollY + 200;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });

                csTocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });
        }
    }
});