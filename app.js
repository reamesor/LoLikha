(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  /* Lenis: short lerp settle so scroll stops with the user — never idle-drift */
  let lenis;
  if (!reduceMotion && window.Lenis) {
    document.documentElement.classList.add("has-smooth-scroll");
    lenis = new window.Lenis({
      lerp: 0.14,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  const getScrollY = () => (lenis ? lenis.scroll : window.scrollY || 0);

  const progress = document.querySelector("[data-progress]");
  const header = document.querySelector("[data-site-header]");
  const onScrollUI = () => {
    if (header) header.classList.toggle("is-scrolled", getScrollY() > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? getScrollY() / max : 0;
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    }
  };
  onScrollUI();
  if (lenis) lenis.on("scroll", onScrollUI);
  else window.addEventListener("scroll", onScrollUI, { passive: true });

  /* Custom cursor — single colorful dot, 1:1 with pointer (desktop only) */
  const cursor = document.querySelector("[data-cursor]");
  if (cursor && finePointer && canHover) {
    document.body.classList.add("has-cursor");
    const dot = cursor.querySelector(".cursor-dot");
    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        if (!dot) return;
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        cursor.classList.remove("is-hidden");
      },
      { passive: true }
    );
    window.addEventListener("pointerleave", () => cursor.classList.add("is-hidden"));
    window.addEventListener("pointerenter", () => cursor.classList.remove("is-hidden"));
  }

  /* Mobile nav */
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* Soft page leave */
  if (!reduceMotion) {
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (
          !href ||
          href.startsWith("#") ||
          href.includes("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("http") ||
          link.target === "_blank" ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return;
        }
        event.preventDefault();
        document.body.classList.add("is-leaving");
        window.setTimeout(() => {
          window.location.href = link.href;
        }, 320);
      });
    });
  }

  /* Hero atmosphere — pointer-reactive only (no idle page drift) */
  const hero = document.querySelector("[data-hero]");
  const atmosphereLayers = document.querySelectorAll("[data-orb]");
  if (hero && atmosphereLayers.length && finePointer && canHover && !reduceMotion) {
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let atmosRaf = 0;

    const paintAtmosphere = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      atmosphereLayers.forEach((layer) => {
        const depth = Number(layer.getAttribute("data-orb")) || 0.04;
        layer.style.transform = `translate3d(${current.x * depth * 100}px, ${current.y * depth * 100}px, 0)`;
      });
      if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
        atmosRaf = requestAnimationFrame(paintAtmosphere);
      } else {
        atmosRaf = 0;
      }
    };

    hero.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        const rect = hero.getBoundingClientRect();
        target.x = (event.clientX - rect.left) / rect.width - 0.5;
        target.y = (event.clientY - rect.top) / rect.height - 0.5;
        if (!atmosRaf) atmosRaf = requestAnimationFrame(paintAtmosphere);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", () => {
      target.x = 0;
      target.y = 0;
      if (!atmosRaf) atmosRaf = requestAnimationFrame(paintAtmosphere);
    });
  }

  /* FAQ */
  document.querySelectorAll("[data-faq] .faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      item.parentElement?.querySelectorAll(".faq-item.is-open").forEach((el) => {
        if (el !== item) el.classList.remove("is-open");
      });
      item.classList.toggle("is-open", !open);
    });
  });

  /* GSAP motion — scroll/hover driven only; no idle page transforms */
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap && ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    // Rise + fade (no overflow mask) so serif descenders never clip
    tl.from("[data-hero-word]", {
      y: 56,
      opacity: 0,
      duration: 1.15,
      stagger: 0.1,
      clearProps: "transform,opacity",
    }, 0.05)
      .from(".hero-underline", { scaleX: 0, duration: 0.85 }, 0.5)
      .from("[data-hero-fade]", { y: 28, opacity: 0, duration: 0.85, stagger: 0.1 }, 0.45);

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 56,
        opacity: 0,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    gsap.utils.toArray("[data-reveal-stagger]").forEach((group) => {
      gsap.from(group.children, {
        y: 48,
        opacity: 0,
        duration: 0.95,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 86%", once: true },
      });
    });
  } else {
    document.querySelectorAll("[data-reveal], [data-hero-fade], [data-hero-word]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  /* Magnetic buttons */
  if (!reduceMotion && finePointer && canHover) {
    document.querySelectorAll("[data-magnetic]").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate3d(${x * 0.18}px, ${y * 0.22}px, 0)`;
      });
      item.addEventListener("pointerleave", () => {
        item.style.transform = "";
      });
    });
  }

  /* Contact form → mailto */
  const form = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");
  if (form && formStatus) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.classList.remove("is-error", "is-success");
      if (!form.checkValidity()) {
        formStatus.classList.add("is-error");
        formStatus.textContent = "Please fill in all fields.";
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const projectType = String(data.get("projectType") || data.get("subject") || "").trim();
      const message = String(data.get("message") || "").trim();
      const subject = encodeURIComponent(`Lolikha inquiry — ${projectType || "Project"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nProject: ${projectType}\n\n${message}`
      );
      formStatus.classList.add("is-success");
      formStatus.textContent = "Opening your email app…";
      window.location.href = `mailto:hello@lolikha.com?subject=${subject}&body=${body}`;
    });
  }
})();
