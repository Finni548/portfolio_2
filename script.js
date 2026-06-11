(function () {
  // ─────────────────────────────────────────────
  // SANITY CONFIGURATION
  // Replace YOUR_PROJECT_ID with your actual Sanity project ID.
  // You find it on sanity.io/manage after creating the project.
  // ─────────────────────────────────────────────
  const SANITY_PROJECT_ID = "b3k4pncg";
  const SANITY_DATASET = "portfolio";
  const SANITY_API_VERSION = "2024-01-01";

  function sanityFetch(query) {
    const url =
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}` +
      `/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    return fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Sanity API error " + r.status);
        return r.json();
      })
      .then((r) => r.result);
  }

  // GROQ queries – map Sanity document structure to the shape
  // that renderSite() and renderProjects() already expect.
  const SITE_QUERY = `*[_type == "site"][0]{
    "hero": {
      "title": hero.title,
      "subtitle": hero.subtitle,
      "copy": hero.copy,
      "portrait": hero.portrait.asset->url + "?w=900&auto=format"
    },
    "about": {
      "title": about.title,
      "bio": about.bio[]{ "text": text },
      "image": about.image.asset->url + "?w=900&auto=format"
    },
    "skills": skills[],
    "tools": tools[]{ label, name, detail },
    "contact": {
      "email": contact.email,
      "instagram": contact.instagram,
      "linkedin": contact.linkedin
    }
  }`;

  const PROJECTS_QUERY = `{
    "groups": *[_type == "projectGroup"] | order(order asc) {
      "name": name,
      "sub": subtitle
    },
    "items": *[_type == "project"] | order(order asc) {
      "id": _id,
      title,
      category,
      "group": group->name,
      desc,
      cardDesc,
      "cover": cover.asset->url + "?w=800&auto=format",
      tech,
      year,
      accent,
      "images": images[]{
        "src": asset.asset->url + "?w=1200&auto=format",
        phone,
        wide,
        half
      },
      "video": video.asset->url
    }
  }`;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const esc = (v) =>
    String(v == null ? "" : v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  const getPath = (obj, path) =>
    path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

  let projectsById = {};

  // ─────────────────────────────────────────────
  // 1) Inhalte von Sanity laden und ins DOM rendern
  // ─────────────────────────────────────────────
  async function boot() {
    let site = null;
    let projects = null;

    try {
      const [s, p] = await Promise.all([
        sanityFetch(SITE_QUERY),
        sanityFetch(PROJECTS_QUERY),
      ]);
      site = s;
      projects = p;
    } catch (err) {
      console.error(
        "Sanity konnte nicht geladen werden. Prüfe SANITY_PROJECT_ID und " +
          "stelle sicher, dass CORS für diese Domain in sanity.io/manage " +
          "freigegeben ist.",
        err,
      );
    }

    if (site) renderSite(site);
    if (projects) renderProjects(projects);

    initInteractions();
  }

  function renderSite(site) {
    $$("[data-content]").forEach((el) => {
      const val = getPath(site, el.getAttribute("data-content"));
      if (val != null) el.textContent = val;
    });

    // Portrait-Bild (Hero)
    if (site.hero && site.hero.portrait) {
      const portrait = $(".hero__portrait");
      if (portrait) portrait.src = site.hero.portrait;
    }

    // About-Bild
    if (site.about && site.about.image) {
      const aboutImg = $(".about-hero__img");
      if (aboutImg) aboutImg.src = site.about.image;
    }

    const bio = $("#aboutBio");
    if (bio && Array.isArray(site.about && site.about.bio)) {
      bio.innerHTML = site.about.bio
        .map((p) => `<p class="reveal" data-split>${esc(p.text)}</p>`)
        .join("");
    }

    const pills = $("#skillsPills");
    if (pills && Array.isArray(site.skills)) {
      pills.innerHTML = site.skills
        .map((s) => `<span class="pill reveal">${esc(s)}</span>`)
        .join("");
    }

    const tools = $("#toolsGrid");
    if (tools && Array.isArray(site.tools)) {
      tools.innerHTML = site.tools
        .map(
          (t) =>
            `<div class="tool-card reveal" data-tilt>` +
            `<span class="tool-card__label">${esc(t.label)}</span>` +
            `<span class="tool-card__name">${esc(t.name)}</span>` +
            `<span class="tool-card__detail">${esc(t.detail)}</span>` +
            `</div>`,
        )
        .join("");
    }

    const links = $("#contactLinks");
    if (links && site.contact) {
      const c = site.contact;
      let html = "";
      if (c.email)
        html += `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`;
      if (c.instagram)
        html += `<a href="${esc(c.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>`;
      if (c.linkedin)
        html += `<a href="${esc(c.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
      links.innerHTML = html;
    }
  }

  function projectCardHTML(p) {
    return (
      `<article class="projectCard reveal" data-project="${esc(p.id)}">` +
      `<div class="projectCard__media"><img src="${esc(p.cover)}" alt="${esc(p.title)}" /></div>` +
      `<div class="projectCard__body">` +
      `<p class="projectCard__category">${esc(p.category)}</p>` +
      `<h3 class="projectCard__title">${esc(p.title)}</h3>` +
      `<p class="projectCard__desc">${esc(p.cardDesc || p.desc)}</p>` +
      `<p class="projectCard__tech">${esc(p.tech)}</p>` +
      `</div>` +
      `<div class="projectCard__cta">View Project <span aria-hidden="true">→</span></div>` +
      `</article>`
    );
  }

  function renderProjects(data) {
    const items = Array.isArray(data.items) ? data.items : [];
    const groups = Array.isArray(data.groups) ? data.groups.slice() : [];

    projectsById = {};
    items.forEach((p) => {
      projectsById[p.id] = p;
    });

    const count = $("#projectsCount");
    if (count) count.textContent = items.length + " Projekte";

    const container = $("#projectsContainer");
    if (!container) return;

    items.forEach((p) => {
      if (p.group && !groups.some((g) => g.name === p.group)) {
        groups.push({ name: p.group, sub: "" });
      }
    });

    let html = "";
    groups.forEach((g) => {
      const inGroup = items.filter((p) => p.group === g.name);
      if (!inGroup.length) return;
      html +=
        `<div class="categoryBlock">` +
        `<div class="categoryHead"><h3>${esc(g.name)}</h3><span>${esc(g.sub)}</span></div>` +
        `<div class="projectGrid">${inGroup.map(projectCardHTML).join("")}</div>` +
        `</div>`;
    });
    container.innerHTML = html;
  }

  // ─────────────────────────────────────────────
  // 2) Interaktionen / Animationen (nach dem Rendern)
  // ─────────────────────────────────────────────
  function initInteractions() {
    const glow = $(".cursor-glow");
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let glowRaf = 0;

    if (!prefersReduced && glow) {
      window.addEventListener(
        "pointermove",
        (e) => {
          mx = e.clientX;
          my = e.clientY;
        },
        { passive: true },
      );

      const tick = () => {
        gx += (mx - gx) * 0.14;
        gy += (my - gy) * 0.14;
        glow.style.left = gx + "px";
        glow.style.top = gy + "px";
        glowRaf = requestAnimationFrame(tick);
      };
      glowRaf = requestAnimationFrame(tick);
    }

    if (!prefersReduced) {
      $$("[data-magnet]").forEach((el) => {
        let rect;
        el.addEventListener(
          "pointerenter",
          () => {
            rect = el.getBoundingClientRect();
          },
          { passive: true },
        );

        el.addEventListener(
          "pointermove",
          (e) => {
            if (!rect) rect = el.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            el.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
          },
          { passive: true },
        );

        el.addEventListener(
          "pointerleave",
          () => {
            el.style.transform = "translate3d(0,0,0)";
          },
          { passive: true },
        );
      });

      $$("[data-tilt]").forEach((el) => {
        let rect;
        el.addEventListener(
          "pointermove",
          (e) => {
            rect = rect || el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            el.style.transform = `perspective(700px) rotateX(${(py - 0.5) * -6}deg) rotateY(${(px - 0.5) * 8}deg)`;
          },
          { passive: true },
        );
        el.addEventListener(
          "pointerleave",
          () => {
            rect = null;
            el.style.transform =
              "perspective(700px) rotateX(0deg) rotateY(0deg)";
          },
          { passive: true },
        );
      });

      $$("[data-float]").forEach((el, i) => {
        const seed = i * 2.2 + Math.random();
        const amp = 8 + i * 4;
        const speed = 0.001 + i * 0.0002;
        const loop = (t) => {
          const x = Math.cos(t * speed + seed) * amp;
          const y = Math.sin(t * speed + seed) * amp;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      });
    }

    let lenis = null;
    if (!prefersReduced && window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.2,
        smoothWheel: true,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      $$('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          const target =
            href && href.length > 1 ? document.querySelector(href) : null;
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: -90, duration: 1.05 });
        });
      });
    }

    const hasGsap = !!window.gsap && !!window.ScrollTrigger;
    if (hasGsap) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const splitWords = (el) => {
        if (!el || el.dataset.done === "1") return;
        el.dataset.done = "1";
        const text = el.textContent || "";
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const span = document.createElement("span");
          span.textContent = part;
          span.style.display = "inline-block";
          span.className = "w";
          frag.appendChild(span);
        });
        el.textContent = "";
        el.appendChild(frag);
      };

      $$("[data-split]").forEach(splitWords);

      $$(".reveal").forEach((el) => {
        const words = $$(".w", el);
        if (words.length) {
          window.gsap.fromTo(
            words,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.03,
              scrollTrigger: { trigger: el, start: "top 82%" },
            },
          );
          window.gsap.set(el, { opacity: 1, y: 0 });
        } else {
          window.gsap.fromTo(
            el,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 86%" },
            },
          );
        }
      });

      $$(".projectCard__media img").forEach((img) => {
        window.gsap.to(img, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      });
    } else {
      $$(".reveal").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }

    const navLinks = $$('.nav__link[href^="#"]');
    const sections = $$("section[id]");
    if (
      navLinks.length &&
      sections.length &&
      "IntersectionObserver" in window
    ) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((l) => l.classList.remove("is-active"));
            const current = navLinks.find(
              (l) => l.getAttribute("href") === `#${entry.target.id}`,
            );
            if (current) current.classList.add("is-active");
          });
        },
        { threshold: 0.45 },
      );

      sections.forEach((sec) => io.observe(sec));
    }

    const form = $(".contactForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = $("button", form);
        if (btn) {
          btn.textContent = "Message Sent";
          btn.disabled = true;
        }
      });
    }

    window.addEventListener("pagehide", () => {
      if (glowRaf) cancelAnimationFrame(glowRaf);
    });

    // ─── Projekt-Detail-Modal ───
    const modal = $("#projectModal");
    const lightbox = $("#lightbox");

    const openLightbox = (src) => {
      if (!lightbox) return;
      lightbox.querySelector(".lightbox__img").src = src;
      lightbox.removeAttribute("hidden");
      if (window.gsap) {
        window.gsap.fromTo(
          lightbox,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: "power2.out" },
        );
        window.gsap.fromTo(
          lightbox.querySelector(".lightbox__wrap"),
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.36, ease: "power3.out" },
        );
      }
    };

    const closeLightbox = () => {
      if (!lightbox || lightbox.hasAttribute("hidden")) return;
      if (window.gsap) {
        window.gsap.to(lightbox, {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
          onComplete: () => lightbox.setAttribute("hidden", ""),
        });
      } else {
        lightbox.setAttribute("hidden", "");
      }
    };

    const openProject = (id) => {
      const p = projectsById[id];
      if (!p || !modal) return;

      document.documentElement.style.setProperty(
        "--modal-accent",
        p.accent || "",
      );
      modal.querySelector(".pModal__category").textContent = p.category;
      modal.querySelector(".pModal__title").textContent = p.title;
      modal.querySelector(".pModal__tech").textContent =
        (p.tech || "") + (p.year ? " · " + p.year : "");
      modal.querySelector(".pModal__desc").textContent = p.desc;

      const images = Array.isArray(p.images) ? p.images : [];
      const isPhone = images.some(
        (img) => typeof img === "object" && img.phone,
      );
      const gallery = modal.querySelector(".pModal__gallery");
      gallery.className =
        "pModal__gallery" + (isPhone ? " pModal__gallery--phone" : "");
      gallery.innerHTML = images
        .map((img) => {
          const src = typeof img === "string" ? img : img.src;
          const wide = typeof img === "object" && (img.wide || img.half);
          return (
            '<div class="pGallery__item' +
            (isPhone && wide ? " pGallery__item--wide" : "") +
            '">' +
            '<img src="' +
            esc(src) +
            '" alt="' +
            esc(p.title) +
            '" loading="lazy" /></div>'
          );
        })
        .join("");

      $$(".pGallery__item", gallery).forEach((item) => {
        item.addEventListener("click", () =>
          openLightbox(item.querySelector("img").src),
        );
      });

      const videoWrap = modal.querySelector(".pModal__video");
      if (p.video) {
        videoWrap.innerHTML =
          '<video controls preload="none" playsinline poster="' +
          esc(p.cover || "") +
          '">' +
          '<source src="' +
          esc(p.video) +
          '" type="video/mp4" />' +
          '<source src="' +
          esc(p.video) +
          '" type="video/quicktime" /></video>';
      } else {
        videoWrap.innerHTML = "";
      }

      modal.removeAttribute("hidden");
      modal.querySelector(".pModal__panel").scrollTop = 0;
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      if (window.gsap) {
        window.gsap.fromTo(
          modal,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: "power2.out" },
        );
        window.gsap.fromTo(
          modal.querySelector(".pModal__panel"),
          { yPercent: 8, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.42, ease: "power3.out" },
        );
      }
    };

    const closeModal = () => {
      if (!modal || modal.hasAttribute("hidden")) return;
      const done = () => {
        modal.setAttribute("hidden", "");
        document.body.style.overflow = "";
        if (lenis) lenis.start();
        const vid = modal.querySelector("video");
        if (vid) vid.pause();
      };
      if (window.gsap) {
        window.gsap.to(modal, {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
          onComplete: done,
        });
      } else {
        done();
      }
    };

    $$("[data-project]").forEach((card) => {
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", () => openProject(card.dataset.project));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProject(card.dataset.project);
        }
      });
    });

    if (modal) {
      modal
        .querySelector(".pModal__backdrop")
        .addEventListener("click", closeModal);
      modal
        .querySelector(".pModal__close")
        .addEventListener("click", closeModal);
    }

    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("lightbox__bg") ||
          e.target.classList.contains("lightbox")
        ) {
          closeLightbox();
        }
      });
      const lightboxClose = lightbox.querySelector(".lightbox__close");
      if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (lightbox && !lightbox.hasAttribute("hidden")) {
        closeLightbox();
      } else {
        closeModal();
      }
    });

    // ─── Mobile-Navigation (Hamburger) ───
    const hamburger = $(".nav__hamburger");
    const navEl = hamburger ? hamburger.closest(".nav") : null;
    if (hamburger && navEl) {
      const closeMenu = () => {
        hamburger.setAttribute("aria-expanded", "false");
        navEl.classList.remove("nav--open");
      };

      hamburger.addEventListener("click", () => {
        const isOpen = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!isOpen));
        navEl.classList.toggle("nav--open", !isOpen);
      });

      $$(".nav__link").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("click", (e) => {
        if (!navEl.contains(e.target)) closeMenu();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
      });
    }
  }

  boot();
})();
