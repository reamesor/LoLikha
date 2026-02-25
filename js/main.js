(function () {
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-spotlight') || document.getElementById('cursor-outline');
    if (!dot) return;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch || prefersReduced) {
        document.documentElement.classList.add('cursor-default');
        return;
    }
    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });
    function animateRing() {
        ringX += (mouseX - ringX) * 0.42;
        ringY += (mouseY - ringY) * 0.42;
        if (ring) {
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
        }
        requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, [role="button"], .btn, .btn-magnetic').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            if (dot) dot.classList.add('hover');
            if (ring) ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', function () {
            if (dot) dot.classList.remove('hover');
            if (ring) ring.classList.remove('hover');
        });
    });
    document.addEventListener('mousedown', function () {
        if (ring) ring.classList.add('click');
    });
    document.addEventListener('mouseup', function () {
        if (ring) ring.classList.remove('click');
    });
})();

(function () {
    var glow = document.getElementById('hero-glow');
    var hero = document.querySelector('.hero-lolikha');
    if (!glow || !hero) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targetX = 0.5, targetY = 0.5;
    var currentX = 0.5, currentY = 0.5;
    function onMove(e) {
        var rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / rect.width;
        targetY = (e.clientY - rect.top) / rect.height;
    }
    function animate() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        if (!reduceMotion) {
            var x = (currentX - 0.5) * 30;
            var y = (currentY - 0.5) * 30;
            glow.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))';
        }
        requestAnimationFrame(animate);
    }
    hero.addEventListener('mousemove', onMove);
    animate();
})();

(function () {
    var headline = document.querySelector('.hero-headline');
    if (!headline) return;
    function startHeadline() {
        headline.classList.add('hero-headline--ready');
    }
    if (document.readyState === 'complete') setTimeout(startHeadline, 120);
    else window.addEventListener('load', function () { setTimeout(startHeadline, 120); });
})();

(function () {
    var cue = document.getElementById('hero-scroll-cue');
    if (!cue) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    function onScroll() {
        cue.classList.toggle('is-hidden', window.scrollY > 120);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* Awwwards-inspired: Scroll Background – hero background reacts to scroll */
(function () {
    var hero = document.querySelector('.hero-lolikha');
    var heroBg = hero ? hero.querySelector('.hero-bg') : null;
    if (!hero || !heroBg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    function onScroll() {
        var rect = hero.getBoundingClientRect();
        var past = rect.bottom < window.innerHeight * 0.5;
        heroBg.classList.toggle('is-scrolled', past);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

(function () {
    var hero = document.querySelector('.hero-lolikha');
    var headline = document.querySelector('.hero-headline');
    if (!hero || !headline) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var targetX = 0, targetY = 0;
    var currentX = 0, currentY = 0;
    hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / rect.width - 0.5;
        targetY = (e.clientY - rect.top) / rect.height - 0.5;
    });
    hero.addEventListener('mouseleave', function () { targetX = 0; targetY = 0; });
    function animateTilt() {
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;
        var rotY = currentX * 4;
        var rotX = -currentY * 3;
        headline.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        requestAnimationFrame(animateTilt);
    }
    animateTilt();
})();

(function () {
    var section = document.getElementById('milestone-section');
    if (!section) return;
    var list = document.getElementById('milestone-list');
    var progress = document.getElementById('milestone-progress');
    var items = list ? list.querySelectorAll('.vertical-milestone__item') : [];
    function updateMilestones() {
        var viewportMid = window.innerHeight * 0.35;
        items.forEach(function (item) {
            item.classList.remove('is-active', 'is-passed');
            var itemRect = item.getBoundingClientRect();
            if (itemRect.top < viewportMid && itemRect.bottom > viewportMid) item.classList.add('is-active');
            else if (itemRect.bottom <= viewportMid) item.classList.add('is-passed');
        });
        var activeIndex = -1;
        items.forEach(function (item, i) {
            if (item.classList.contains('is-active')) activeIndex = i;
            else if (item.classList.contains('is-passed')) activeIndex = i;
        });
        if (progress && items.length) {
            var container = list.parentElement;
            var firstDot = items[0].querySelector('.vertical-milestone__dot');
            var activeOrLast = items[Math.max(0, activeIndex)];
            var endDot = activeOrLast ? activeOrLast.querySelector('.vertical-milestone__dot') : firstDot;
            if (firstDot && endDot && container) {
                var startY = firstDot.getBoundingClientRect().top + window.scrollY;
                var endY = endDot.getBoundingClientRect().top + window.scrollY;
                var containerTop = container.getBoundingClientRect().top + window.scrollY;
                progress.style.top = (startY - containerTop) + 'px';
                progress.style.height = Math.max(0, endY - startY) + 'px';
            }
        }
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) updateMilestones(); });
    }, { root: null, rootMargin: '0px', threshold: 0 });
    observer.observe(section);
    window.addEventListener('scroll', function () {
        if (section.getBoundingClientRect().bottom < 0 || section.getBoundingClientRect().top > window.innerHeight) return;
        updateMilestones();
    }, { passive: true });
    window.addEventListener('resize', updateMilestones);
    updateMilestones();
})();

(function () {
    var nav = document.querySelector('.nav-main');
    var toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;
    toggle.addEventListener('click', function () { nav.classList.toggle('is-open'); });
})();

(function () {
    var slides = document.querySelectorAll('.testimonial-slide');
    var dots = document.querySelectorAll('.testimonial-dots button');
    if (!slides.length || !dots.length) return;
    var current = 0;
    function show(i) {
        current = (i + slides.length) % slides.length;
        slides.forEach(function (s, j) { s.style.display = j === current ? 'block' : 'none'; });
        dots.forEach(function (d, j) { d.classList.toggle('is-active', j === current); });
    }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });
    show(0);
})();

(function () {
    var anim = document.querySelectorAll('.animate-in, .reveal-up, .reveal-left, .reveal-right');
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0 }) : null;
    if (anim.length && io) anim.forEach(function (el) { io.observe(el); });
    else if (anim.length) anim.forEach(function (el) { el.classList.add('is-visible'); });
})();

(function () {
    var stagger = document.querySelectorAll('.stagger-children');
    if (!stagger.length) return;
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var children = e.target.children;
            for (var i = 0; i < children.length; i++) children[i].classList.add('is-visible');
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 }) : null;
    if (io) stagger.forEach(function (el) { io.observe(el); });
    else stagger.forEach(function (el) {
        var children = el.children;
        for (var i = 0; i < children.length; i++) children[i].classList.add('is-visible');
    });
})();

(function () {
    var btns = document.querySelectorAll('.btn-magnetic');
    if (!btns.length) return;
    btns.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            var y = (e.clientY - rect.top - rect.height / 2) * 0.15;
            btn.style.transform = 'scale(1.03) translateY(-2px) translate(' + x + 'px, ' + y + 'px)';
        });
        btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
})();

(function () {
    var list = document.getElementById('capabilities-accordion');
    if (!list) return;
    var items = list.querySelectorAll('.accordion-item');
    var triggers = list.querySelectorAll('.accordion-item__trigger');
    triggers.forEach(function (btn, i) {
        btn.addEventListener('click', function () {
            var item = items[i];
            var isOpen = item.classList.contains('is-open');
            items.forEach(function (it) { it.classList.remove('is-open'); });
            triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
})();
