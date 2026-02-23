// site.js
(() => {
  // ===== SETTINGS =====
  const HOME_URL = "home.html";
  const LOGO_DELAY_MS = 1500;

  // ===== HELPERS =====
  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  // ===== 1) AUTO-FIT (no scroll, no cut) =====
  // Erwartet:
  //   <div class="stage" id="stage"> ... <div class="wrap" id="fitContent"> ... </div> ... </div>
  function initAutoFit(){
    const stage = qs("#stage");
    const content = qs("#fitContent");
    if (!stage || !content) return;

    function fit(){
      // Reset für korrektes Messen
      stage.style.transform = "scale(1)";
      stage.style.left = "0px";
      stage.style.top = "0px";

      const rect = content.getBoundingClientRect();
      const needW = rect.width;
      const needH = rect.height;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // nur runter skalieren
      const s = Math.min(1, vw / needW, vh / needH);

      stage.style.transformOrigin = "top center";
      stage.style.transform = `scale(${s})`;

      // horizontal zentrieren
      const scaledW = needW * s;
      const offsetX = (vw - scaledW) / 2;
      stage.style.left = offsetX + "px";
    }

    window.addEventListener("load", fit);
    window.addEventListener("resize", fit);
    fit();
  }

  // ===== 2) MENU FADE TRANSITION =====
  // Erwartet:
  //   <div class="pageFade" id="pageFade"></div>
  //   Links: a.sticker
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
  // Erwartet:
  //   Button: #logoBtn
  //   Audio:  #logoSound
  function initLogoClick(){
    const logoBtn = qs("#logoBtn");
    const logoSound = qs("#logoSound");
    const fade = qs("#pageFade");

    if (!logoBtn) return;

    logoBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Wenn wir schon auf home sind: nur Sound abspielen (kein Redirect)
      const current = location.pathname.split("/").pop();
      if (current === HOME_URL){
        try { if (logoSound){ logoSound.currentTime = 0; logoSound.play(); } } catch(_){}
        return;
      }

      // Sound abspielen
      try { if (logoSound){ logoSound.currentTime = 0; logoSound.play(); } } catch(_){}

      // optional fade
      if (fade) fade.classList.add("show");

      setTimeout(() => {
        window.location.href = HOME_URL;
      }, LOGO_DELAY_MS);
    });
  }

  // ===== INIT =====
  initAutoFit();
  initMenuFade();
  initLogoClick();
})();