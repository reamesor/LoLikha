(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sticky header */
  const header = document.querySelector("[data-site-header]");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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

  /* Nav dropdowns */
  document.querySelectorAll("[data-dd-toggle]").forEach((btn) => {
    const wrap = btn.closest(".nav-dd");
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = !wrap?.classList.contains("is-open");
      document.querySelectorAll(".nav-dd.is-open").forEach((el) => {
        if (el !== wrap) {
          el.classList.remove("is-open");
          el.querySelector("[data-dd-toggle]")?.setAttribute("aria-expanded", "false");
        }
      });
      wrap?.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-dd.is-open").forEach((el) => {
      el.classList.remove("is-open");
      el.querySelector("[data-dd-toggle]")?.setAttribute("aria-expanded", "false");
    });
  });

  /* GMT-7 clock */
  const clockEl = document.querySelector("[data-clock]");
  if (clockEl) {
    const tick = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(now);
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
      const email = btn.dataset.copyEmail || "hello@orionix.com";
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

  /* FAQ accordion */
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

  /* Animated counters */
  const counters = [...document.querySelectorAll("[data-counter]")];
  if (counters.length) {
    const animate = (el) => {
      const target = Number(el.dataset.counter || 0);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      if (reduceMotion) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animate(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => io.observe(el));
    } else {
      counters.forEach(animate);
    }
  }

  /* Works / blog filters */
  const filterRoot = document.querySelector("[data-filter-root]");
  if (filterRoot) {
    const chips = [...filterRoot.querySelectorAll("[data-filter]")];
    const items = [...document.querySelectorAll("[data-filter-item]")];
    const search = document.querySelector("[data-search]");
    let active = "all";

    const apply = () => {
      const q = (search?.value || "").trim().toLowerCase();
      items.forEach((item) => {
        const cats = (item.dataset.categories || "").toLowerCase();
        const text = (item.dataset.search || item.textContent || "").toLowerCase();
        const catOk = active === "all" || cats.split(/\s+/).includes(active);
        const searchOk = !q || text.includes(q);
        item.classList.toggle("is-hidden", !(catOk && searchOk));
      });
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        active = (chip.dataset.filter || "all").toLowerCase();
        chips.forEach((c) => c.classList.toggle("is-active", c === chip));
        apply();
      });
    });
    search?.addEventListener("input", apply);
  }

  /* Load more (works / blog) */
  const loadMoreBtn = document.querySelector("[data-load-more]");
  if (loadMoreBtn) {
    const hidden = [...document.querySelectorAll("[data-load-item].is-collapsed")];
    if (!hidden.length) {
      loadMoreBtn.hidden = true;
    }
    loadMoreBtn.addEventListener("click", () => {
      document.querySelectorAll("[data-load-item].is-collapsed").forEach((el) => {
        el.classList.remove("is-collapsed");
        el.classList.remove("is-hidden");
        el.style.display = "";
      });
      loadMoreBtn.hidden = true;
    });
    document.querySelectorAll("[data-load-item].is-collapsed").forEach((el) => {
      el.style.display = "none";
    });
  }

  /* Contact form */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const status = document.querySelector("[data-form-status]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      if (!name || !email || !message) {
        if (status) {
          status.textContent = "Please fill in all fields.";
          status.classList.remove("is-success");
        }
        return;
      }
      form.reset();
      if (status) {
        status.textContent = "Thanks — we’ll get back to you shortly.";
        status.classList.add("is-success");
      }
    });
  }
})();
