(function () {
    var dot = document.getElementById('cursor-dot');
    var outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;
    var mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = (mouseX - 4) + 'px';
        dot.style.top = (mouseY - 4) + 'px';
    });
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.left = (outlineX - 20) + 'px';
        outline.style.top = (outlineY - 20) + 'px';
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    document.querySelectorAll('a, button, [role="button"], .btn').forEach(function (el) {
        el.addEventListener('mouseenter', function () { outline.classList.add('hover'); });
        el.addEventListener('mouseleave', function () { outline.classList.remove('hover'); });
    });
    document.addEventListener('mousedown', function () { outline.classList.add('click'); });
    document.addEventListener('mouseup', function () { outline.classList.remove('click'); });
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
    var anim = document.querySelectorAll('.animate-in');
    if (!anim.length) return;
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 }) : null;
    if (io) anim.forEach(function (el) { io.observe(el); });
    else anim.forEach(function (el) { el.classList.add('is-visible'); });
})();

(function () {
    var btns = document.querySelectorAll('.btn-magnetic');
    if (!btns.length) return;
    btns.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            var y = (e.clientY - rect.top - rect.height / 2) * 0.15;
            btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        });
        btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
})();
