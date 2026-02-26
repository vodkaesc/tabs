const engines = {
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  bing: "https://www.bing.com/search?q=",
  brave: "https://search.brave.com/search?q=",
  yahoo: "https://search.yahoo.com/search?p=",
};

chrome.storage.sync.get([
  "username", "tabTitle", "dynamicTitle", "titleEffect", "faviconType",
  "messageEnabled", "messageFontType", "messageFontFamily", "messageTextColor",
  "messageTextSize", "messageType", "messageCustomText",
  "wallpaperEnabled", "wallpaperType", "wallpaperColor", "wallpaperUrl",
  "wallpaperBrightness", "wallpaperBlur",
  "searchEnabled", "searchEngine", "searchPlaceholder", "searchRecognizeLinks",
  "searchBorderColor", "searchTextColor", "searchIconColor"
], (result) => {
  const greetingEl = document.getElementById("greeting");
  const searchInput = document.getElementById("search");
  const searchWrapper = document.getElementById("search-wrapper");
  const root = document.documentElement;

  // search colors
  if (result.searchBorderColor) root.style.setProperty("--search-focus-color", result.searchBorderColor);
  if (result.searchTextColor) root.style.setProperty("--search-text-color", result.searchTextColor);
  if (result.searchIconColor) root.style.setProperty("--search-icon-color", result.searchIconColor);

  // search placeholder
  if (result.searchPlaceholder) searchInput.placeholder = result.searchPlaceholder;

  // hide search if disabled
  if (result.searchEnabled === false) searchWrapper.style.display = "none";

  // wallpaper
  if (result.wallpaperEnabled !== false) {
    const brightness = result.wallpaperBrightness || 1;
    const blur = result.wallpaperBlur || 0;
    const filter = `brightness(${brightness}) blur(${blur}px)`;
    const bg = document.createElement("div");
    bg.style.cssText = `position:fixed;inset:0;z-index:-1;background-size:cover;background-position:center;filter:${filter};`;

    if (result.wallpaperType === "solid-color" && result.wallpaperColor) {
      let color = result.wallpaperColor.trim();
      if (!color.startsWith("#")) color = "#" + color;
      bg.style.background = color;
      document.body.appendChild(bg);
      localStorage.setItem("tabs_bg_cache", `background:${color};`);

    } else if (result.wallpaperType === "url" && result.wallpaperUrl) {
      bg.style.backgroundImage = `url('${result.wallpaperUrl}')`;
      bg.style.backgroundSize = "cover";
      bg.style.backgroundPosition = "center";
      document.body.appendChild(bg);
      localStorage.setItem("tabs_bg_cache", `background:#111 url('${result.wallpaperUrl}') center/cover no-repeat;filter:${filter};`);

    } else if (result.wallpaperType === "file-upload") {
      chrome.storage.local.get(["wallpaperBase64"], (local) => {
        if (local.wallpaperBase64) {
          bg.style.backgroundImage = `url('${local.wallpaperBase64}')`;
          bg.style.backgroundSize = "cover";
          bg.style.backgroundPosition = "center";
          document.body.appendChild(bg);
          // don't cache base64 in localStorage — too big, use a color hint instead
          localStorage.setItem("tabs_bg_cache", `background:#111;`);
        }
      });

    } else {
      localStorage.removeItem("tabs_bg_cache");
    }
  } else {
    localStorage.removeItem("tabs_bg_cache");
  }

  // greeting
  if (result.messageEnabled === false) {
    greetingEl.style.display = "none";
  } else {
    if (result.messageFontType === "custom" && result.messageFontFamily) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(result.messageFontFamily)}&display=swap`;
      document.head.appendChild(link);
      greetingEl.style.fontFamily = `'${result.messageFontFamily}', sans-serif`;
    }
    if (result.messageTextColor) greetingEl.style.color = result.messageTextColor;
    if (result.messageTextSize) greetingEl.style.fontSize = `${result.messageTextSize}rem`;

    const name = result.username || "user";
    const now = new Date();
    const hour = now.getHours();
    const time = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
    const messageType = result.messageType || "afternoon-morning";

    let greeting = "";
    if (messageType === "afternoon-morning") greeting = `Good ${time}, ${name}`;
    else if (messageType === "date") greeting = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    else if (messageType === "time-12") greeting = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    else if (messageType === "time-24") greeting = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    else if (messageType === "custom") greeting = result.messageCustomText || "";

    if (result.titleEffect === "typewriter") {
      let i = 0;
      const type = () => {
        if (i < greeting.length) { greetingEl.textContent += greeting[i]; i++; setTimeout(type, 60); }
      };
      type();
    } else {
      greetingEl.textContent = greeting;
    }
  }

  // tab title
  const defaultTitle = result.tabTitle || "tabs";
  document.title = defaultTitle;

  // favicon
  if (result.faviconType === "custom") {
    chrome.storage.local.get(["faviconBase64"], (local) => {
      if (local.faviconBase64) document.getElementById("favicon").href = local.faviconBase64;
    });
  }

  // search
  const engine = engines[result.searchEngine] || engines.google;

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (!query) return;

      if (result.searchRecognizeLinks !== false) {
        try {
          const url = query.includes(".") && !query.includes(" ")
            ? new URL(query.startsWith("http") ? query : "https://" + query)
            : null;
          if (url) {
            e.ctrlKey ? window.open(url.href, "_blank") : (window.location.href = url.href);
            return;
          }
        } catch (_) { }
      }

      const href = engine + encodeURIComponent(query);
      e.ctrlKey ? window.open(href, "_blank") : (window.location.href = href);
    }
  });

  if (result.dynamicTitle) {
    searchInput.addEventListener("input", () => {
      document.title = searchInput.value || defaultTitle;
    });
  }
});