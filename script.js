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

const researchControls = document.querySelector(".research-controls");
if (researchControls) {
  const buttons = [...researchControls.querySelectorAll("button")];
  const views = buttons.map((button) => document.getElementById(button.getAttribute("aria-controls")));

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      buttons.forEach((candidate, position) => {
        const isSelected = position === index;
        candidate.setAttribute("aria-pressed", String(isSelected));
        views[position].hidden = !isSelected;
      });
    });
  });
  researchControls.hidden = false;
}
