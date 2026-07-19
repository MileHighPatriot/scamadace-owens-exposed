/* Scamdace Owens Exposed — shared UI */
(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  // Mobile nav
  const toggle = qs(".nav-toggle");
  const links = qs(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  // Active nav
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  qsa(".nav-links a").forEach(function (a) {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  window.SOE = {
    getClaim: function (id) {
      return (window.CLAIMS_DATA || []).find(function (c) {
        return c.id === id;
      });
    },
    verdictHtml: function (verdict) {
      const meta = (window.VERDICT_META || {})[verdict] || {
        label: verdict,
        className: "verdict-unsupported",
      };
      return (
        '<span class="verdict ' +
        meta.className +
        '">' +
        meta.label +
        "</span>"
      );
    },
    categoryLabels: function (cats) {
      const map = {};
      (window.CATEGORIES || []).forEach(function (c) {
        map[c.id] = c.label;
      });
      return (cats || []).map(function (id) {
        return map[id] || id;
      });
    },
    copyText: function (text, btn) {
      function done() {
        if (!btn) return;
        const old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.textContent = old;
        }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallback();
        });
      } else {
        fallback();
      }
      function fallback() {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    },
    tierLabel: function (tier) {
      const labels = {
        1: "Tier 1 — Court / charging / official case facts",
        2: "Tier 2 — Named officials & law-enforcement briefings",
        3: "Tier 3 — Primary video / audio of the event",
        4: "Tier 4 — Multi-outlet reporting citing documents",
        5: "Tier 5 — Analysis / logic (clearly labeled)",
      };
      return labels[tier] || "Evidence";
    },
  };
})();
