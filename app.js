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

  /* Custom cursor — dot/label 1:1 with pointer; ring lightly lagged */
  const cursor = document.querySelector("[data-cursor]");
  const cursorLabel = document.querySelector("[data-cursor-label]");
  if (cursor && finePointer && canHover && !reduceMotion) {
    document.body.classList.add("has-cursor");
    const pos = { x: -100, y: -100 };
    const ring = { x: pos.x, y: pos.y };
    const dot = cursor.querySelector(".cursor-dot");
    const ringEl = cursor.querySelector(".cursor-ring");
    let ringRaf = 0;
    let ringActive = false;

    const placeInstant = (x, y) => {
      const t = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (dot) dot.style.transform = t;
      if (cursorLabel) cursorLabel.style.transform = t;
    };

    const tickRing = () => {
      ring.x += (pos.x - ring.x) * 0.42;
      ring.y += (pos.y - ring.y) * 0.42;
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      const dx = Math.abs(pos.x - ring.x);
      const dy = Math.abs(pos.y - ring.y);
      if (dx > 0.05 || dy > 0.05) {
        ringRaf = requestAnimationFrame(tickRing);
      } else {
        ringActive = false;
        ringRaf = 0;
        if (ringEl) {
          ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        }
      }
    };

    const kickRing = () => {
      if (!ringActive) {
        ringActive = true;
        ringRaf = requestAnimationFrame(tickRing);
      }
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        pos.x = event.clientX;
        pos.y = event.clientY;
        placeInstant(pos.x, pos.y);
        kickRing();
      },
      { passive: true }
    );

    document.querySelectorAll("[data-cursor-text], a, button, .work-card, .service-row").forEach((el) => {
      el.addEventListener("pointerenter", () => {
        cursor.classList.add("is-hover");
        const label = el.getAttribute("data-cursor-text");
        if (label && cursorLabel) {
          cursorLabel.textContent = label;
          cursor.classList.add("is-label");
        }
      });
      el.addEventListener("pointerleave", () => {
        cursor.classList.remove("is-hover", "is-label");
        if (cursorLabel) cursorLabel.textContent = "";
      });
    });

    window.addEventListener("pointerdown", () => cursor.classList.add("is-press"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-press"));
    window.addEventListener("pointerleave", () => {
      cursor.classList.add("is-hidden");
      if (ringRaf) cancelAnimationFrame(ringRaf);
      ringActive = false;
      ringRaf = 0;
    });
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

  /* PH / Manila clock */
  const clockEl = document.querySelector("[data-clock]");
  if (clockEl) {
    const tick = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const hour = parts.find((p) => p.type === "hour")?.value ?? "--";
      const minute = parts.find((p) => p.type === "minute")?.value ?? "--";
      clockEl.textContent = `${hour}:${minute}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Copy email */
  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.dataset.copyEmail || "hello@lolikha.com";
      const label = btn.querySelector(".copy-label");
      try {
        await navigator.clipboard.writeText(email);
        btn.classList.add("is-copied");
        if (label) label.textContent = "Copied";
        setTimeout(() => {
          btn.classList.remove("is-copied");
          if (label) label.textContent = "Copy";
        }, 1600);
      } catch {
        if (label) label.textContent = "Failed";
      }
    });
  });

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
    tl.from("[data-hero-word]", { yPercent: 110, duration: 1.15, stagger: 0.1 }, 0.05)
      .from(".hero-underline", { scaleX: 0, duration: 0.85 }, 0.5)
      .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.4);

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 48,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    gsap.utils.toArray("[data-reveal-stagger]").forEach((group) => {
      gsap.from(group.children, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
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
