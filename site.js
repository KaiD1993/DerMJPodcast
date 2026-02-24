// site.js
(() => {
  // ===== SETTINGS =====
  const HOME_URL = "home.html";
  const LOGO_DELAY_MS = 1500;

  // ===== HELPERS =====
  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  // ===== 2) MENU FADE TRANSITION =====
  function initMenuFade(){
    const fade = qs("#pageFade");
    const links = qsa("a.sticker");
    if (!fade || links.length === 0) return;

    links.forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href) return;

        // externe Links nicht anfassen
        if (/^https?:\/\//i.test(href)) return;

        // gleicher Link -> nix
        if (href === location.pathname.split("/").pop()) return;

        e.preventDefault();
        fade.classList.add("show");

        setTimeout(() => {
          window.location.href = href;
        }, 550);
      });
    });
  }

  // ===== 3) LOGO CLICK: sound + delay + go home =====
  function initLogoClick(){
    const logoBtn = qs("#logoBtn");
    const logoSound = qs("#logoSound");
    const fade = qs("#pageFade");

    if (!logoBtn) return;

    logoBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const current = location.pathname.split("/").pop();
      if (current === HOME_URL){
        try { if (logoSound){ logoSound.currentTime = 0; logoSound.play(); } } catch(_){}
        return;
      }

      try { if (logoSound){ logoSound.currentTime = 0; logoSound.play(); } } catch(_){}

      if (fade) fade.classList.add("show");

      setTimeout(() => {
        window.location.href = HOME_URL;
      }, LOGO_DELAY_MS);
    });
  }

  // ===== INIT =====
  initMenuFade();
  initLogoClick();
})();