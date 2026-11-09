const menuButton = document.querySelector(".menu-toggle");
const masthead = document.querySelector(".masthead");
const siteNav = document.querySelector("#site-nav");

if (menuButton && masthead && siteNav) {
  const mobile = window.matchMedia("(max-width: 760px)");
  const menuIsOpen = () => menuButton.getAttribute("aria-expanded") === "true";
  const setMenu = (open) => menuButton.setAttribute("aria-expanded", String(open));

  menuButton.addEventListener("click", () => setMenu(!menuIsOpen()));
  siteNav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !menuIsOpen()) return;

    setMenu(false);
    // Keep focus at the destination when the mobile disclosure closes.
    if (link.hash && link.pathname === location.pathname) {
      const destination = document.getElementById(link.hash.slice(1));
      if (destination) {
        destination.tabIndex = -1;
        destination.focus({ preventScroll: true });
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuIsOpen()) {
      setMenu(false);
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (menuIsOpen() && !masthead.contains(event.target)) setMenu(false);
  });

  masthead.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !masthead.contains(event.relatedTarget)) setMenu(false);
  });

  mobile.addEventListener("change", () => setMenu(false));
  menuButton.hidden = false;
  document.documentElement.classList.add("nav-enhanced");
}

const atlas = document.querySelector(".atlas");
if (atlas) {
  const controls = atlas.querySelector(".atlas-controls");
  const buttons = controls.querySelectorAll("button");
  const note = atlas.querySelector(".atlas-note");
  const link = atlas.querySelector(".atlas-link");
  const modes = {
    research: {
      note: "Research starts by deciding which question is worth pursuing.",
      href: "#experience",
    },
    analytics: {
      note: "Analytics tests whether the pattern holds when you change the comparison.",
      href: "#project-edmonton",
    },
    engineering: {
      note: "Engineering makes the work repeatable, with checks you can inspect.",
      href: "#project-engineering",
    },
  };

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const mode = button.dataset.mode;
      atlas.dataset.mode = mode;
      buttons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      note.textContent = modes[mode].note;
      link.href = modes[mode].href;
    }),
  );
  controls.hidden = false;
}
