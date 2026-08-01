(() => {
  const root = document.body?.dataset?.root ?? "";
  const r = (path) => `${root}${path}`;

  const logo = `
    <span class="logo-mark" aria-hidden="true">
      <img src="${r("images/logo.png")}" alt="" width="40" height="40" />
    </span>`;

  const btnLabel = (text) =>
    `<span class="btn-label"><span>${text}</span><span>${text}</span></span>`;

  const navLink = (href, label) =>
    `<a class="nav-link" href="${href}" data-magnetic><span>${label}</span></a>`;

  const headerHTML = `
    <header class="site-header" data-site-header>
      <div class="header-inner">
        <a class="logo" href="${r("index.html")}" aria-label="Lolikha home" data-magnetic>
          ${logo}
          <span class="logo-word">Lolikha</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
          <span class="nav-toggle-bars" aria-hidden="true"></span>
          <span class="visually-hidden">Menu</span>
        </button>
        <nav id="site-nav" class="site-nav" data-nav>
          ${navLink(r("works/index.html"), "Works")}
          ${navLink(r("about/index.html"), "About")}
          ${navLink(r("pricing/index.html"), "Pricing")}
          ${navLink(r("services/index.html"), "Services")}
          <a class="btn btn-dark btn-slide header-cta" href="${r("contact/index.html")}" data-magnetic>${btnLabel("Book a call")}</a>
        </nav>
      </div>
    </header>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a class="logo" href="${r("index.html")}" aria-label="Lolikha home">
              ${logo}
              <span class="logo-word">Lolikha</span>
            </a>
            <p>Creative solutions that elevate your digital presence. Founder-led. International.</p>
          </div>
          <div class="footer-nav">
            <div>
              <h4>Pages</h4>
              <a href="${r("index.html")}">Home</a>
              <a href="${r("works/index.html")}">Works</a>
              <a href="${r("about/index.html")}">About</a>
              <a href="${r("services/index.html")}">Services</a>
              <a href="${r("pricing/index.html")}">Pricing</a>
              <a href="${r("contact/index.html")}">Contact</a>
            </div>
            <div>
              <h4>Services</h4>
              <a href="${r("services/website-design-management.html")}">Website Design</a>
              <a href="${r("services/video-editing-production.html")}">Video Production</a>
              <a href="${r("services/social-media-management.html")}">Social Media</a>
              <a href="${r("services/business-executive-support.html")}">Business Support</a>
              <a href="${r("services/content-design-production.html")}">Content Design</a>
            </div>
            <div>
              <h4>Contact</h4>
              <a href="mailto:hello@lolikha.com">hello@lolikha.com</a>
              <a href="${r("contact/index.html")}">Book a call</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© <span data-year>2026</span> Lolikha. All rights reserved.</p>
          <div class="socials">
            <a href="https://www.instagram.com/lolikha_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg>
            </a>
            <a href="https://www.facebook.com/Lolikha.co" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" fill="currentColor"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>`;

  const headerMount = document.querySelector("[data-header]");
  const footerMount = document.querySelector("[data-footer]");
  if (headerMount) headerMount.outerHTML = headerHTML;
  if (footerMount) footerMount.outerHTML = footerHTML;

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
