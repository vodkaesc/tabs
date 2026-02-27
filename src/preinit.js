(function () {
  try {
    const c = JSON.parse(localStorage.getItem("tabs_cache") || "{}");
    const root = document.documentElement;
    if (c.searchBorderColor)
      root.style.setProperty("--search-focus-color", c.searchBorderColor);
    if (c.searchTextColor)
      root.style.setProperty("--search-text-color", c.searchTextColor);
    if (c.searchIconColor)
      root.style.setProperty("--search-icon-color", c.searchIconColor);
    if (c.wallpaper) {
      const el = document.createElement("div");
      el.style.cssText = c.wallpaper;
      document.documentElement.appendChild(el);
    }
  } catch (e) {}
})();
