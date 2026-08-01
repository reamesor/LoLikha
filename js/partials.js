(() => {
  const root = document.body?.dataset?.root ?? "";
  const r = (path) => `${root}${path}`;

  const logoMark = `
    <span class="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="3.2"/>
        <ellipse cx="16" cy="7.2" rx="3.4" ry="5.2"/>
        <ellipse cx="16" cy="24.8" rx="3.4" ry="5.2"/>
        <ellipse cx="7.2" cy="16" rx="5.2" ry="3.4"/>
        <ellipse cx="24.8" cy="16" rx="5.2" ry="3.4"/>
        <ellipse cx="9.6" cy="9.6" rx="4.4" ry="3.1" transform="rotate(-45 9.6 9.6)"/>
        <ellipse cx="22.4" cy="9.6" rx="4.4" ry="3.1" transform="rotate(45 22.4 9.6)"/>
        <ellipse cx="9.6" cy="22.4" rx="4.4" ry="3.1" transform="rotate(45 9.6 22.4)"/>
        <ellipse cx="22.4" cy="22.4" rx="4.4" ry="3.1" transform="rotate(-45 22.4 22.4)"/>
      </svg>
    </span>`;

  const headerHTML = `
    <header class="site-header" data-site-header>
      <div class="header-inner">
        <a class="logo" href="${r("index.html")}" aria-label="Orionix home">
          ${logoMark}
          <span>orionix</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
          <span class="nav-toggle-bars" aria-hidden="true"></span>
          <span class="visually-hidden">Menu</span>
        </button>
        <nav id="site-nav" class="site-nav" data-nav>
          <a href="${r("works/index.html")}">Works</a>
          <a href="${r("about/index.html")}">About</a>
          <a href="${r("pricing/index.html")}">Pricing</a>
          <div class="nav-dd">
            <button class="nav-dd-btn" type="button" aria-expanded="false" data-dd-toggle>Services</button>
            <div class="nav-dd-menu" data-dd-menu>
              <a href="${r("services/brand-identity-strategy.html")}">Brand Identity &amp; Strategy</a>
              <a href="${r("services/digital-marketing-growth.html")}">Digital Marketing &amp; Growth</a>
              <a href="${r("services/social-media-content-marketing.html")}">Social Media &amp; Content</a>
              <a href="${r("services/ui-ux-product-design.html")}">UI/UX &amp; Product Design</a>
              <a href="${r("services/website-design-development.html")}">Website Design &amp; Dev</a>
            </div>
          </div>
          <a href="${r("blog/index.html")}">Blog</a>
          <div class="nav-dd">
            <button class="nav-dd-btn" type="button" aria-expanded="false" data-dd-toggle>Pages</button>
            <div class="nav-dd-menu" data-dd-menu>
              <a href="${r("index.html")}">Home</a>
              <a href="${r("works/index.html")}">Works</a>
              <a href="${r("about/index.html")}">About</a>
              <a href="${r("pricing/index.html")}">Pricing</a>
              <a href="${r("blog/index.html")}">Blog</a>
              <a href="${r("contact/index.html")}">Contact</a>
            </div>
          </div>
          <a class="btn btn-dark" href="${r("contact/index.html")}">Book a call</a>
        </nav>
      </div>
    </header>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a class="logo" href="${r("index.html")}" aria-label="Orionix home">
              ${logoMark}
              <span>orionix</span>
            </a>
            <p>Independent creative design studio crafting brands, websites, and digital experiences.</p>
          </div>
          <div class="footer-nav">
            <div>
              <h4>Pages</h4>
              <a href="${r("index.html")}">Home</a>
              <a href="${r("works/index.html")}">Works</a>
              <a href="${r("about/index.html")}">About</a>
              <a href="${r("pricing/index.html")}">Pricing</a>
              <a href="${r("blog/index.html")}">Blog</a>
              <a href="${r("contact/index.html")}">Contact</a>
            </div>
            <div>
              <h4>Services</h4>
              <a href="${r("services/brand-identity-strategy.html")}">Brand Identity</a>
              <a href="${r("services/website-design-development.html")}">Website Design</a>
              <a href="${r("services/ui-ux-product-design.html")}">UI/UX Design</a>
              <a href="${r("services/digital-marketing-growth.html")}">Digital Marketing</a>
              <a href="${r("services/social-media-content-marketing.html")}">Social Media</a>
            </div>
            <div>
              <h4>Social</h4>
              <a href="https://x.com/madebykota" target="_blank" rel="noopener">X (Twitter)</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
              <a href="https://behance.net/" target="_blank" rel="noopener">Behance</a>
              <a href="https://dribbble.com/" target="_blank" rel="noopener">Dribbble</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© <span data-year>2026</span> Copyright — Orionix | Designed by LoganCee Studio | Build by KOTA</p>
          <div class="socials">
            <a href="https://x.com/madebykota" target="_blank" rel="noopener">X</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://behance.net/" target="_blank" rel="noopener">Behance</a>
            <a href="https://dribbble.com/" target="_blank" rel="noopener">Dribbble</a>
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
