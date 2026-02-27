const engines = {
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  bing: "https://www.bing.com/search?q=",
  brave: "https://search.brave.com/search?q=",
  yahoo: "https://search.yahoo.com/search?p=",
};

const DEFAULT_WALLPAPER = "walp.png";

chrome.storage.sync.get([
  "username", "tabTitle", "dynamicTitle", "titleEffect", "faviconType",
  "messageEnabled", "messageFontType", "messageFontFamily", "messageTextColor",
  "messageTextSize", "messageType", "messageCustomText",
  "wallpaperEnabled", "wallpaperType", "wallpaperColor", "wallpaperUrl",
  "wallpaperBrightness", "wallpaperBlur",
  "searchEnabled", "searchEngine", "searchPlaceholder", "searchRecognizeLinks",
  "searchBorderColor", "searchTextColor", "searchIconColor",
  "bookmarks"
], (result) => {
  const greetingEl = document.getElementById("greeting");
  const searchInput = document.getElementById("search");
  const searchWrapper = document.getElementById("search-wrapper");
  const bookmarksRow = document.getElementById("bookmarks-row");
  const root = document.documentElement;

  // search colors
  if (result.searchBorderColor) root.style.setProperty("--search-focus-color", result.searchBorderColor);
  if (result.searchTextColor) root.style.setProperty("--search-text-color", result.searchTextColor);
  if (result.searchIconColor) root.style.setProperty("--search-icon-color", result.searchIconColor);
  if (result.searchPlaceholder) searchInput.placeholder = result.searchPlaceholder;
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
    } else if (result.wallpaperType === "url" && result.wallpaperUrl) {
      bg.style.backgroundImage = `url('${result.wallpaperUrl}')`;
      bg.style.backgroundSize = "cover";
      bg.style.backgroundPosition = "center";
      document.body.appendChild(bg);
    } else if (result.wallpaperType === "file-upload") {
      chrome.storage.local.get(["wallpaperBase64"], (local) => {
        if (local.wallpaperBase64) {
          bg.style.backgroundImage = `url('${local.wallpaperBase64}')`;
          bg.style.backgroundSize = "cover";
          bg.style.backgroundPosition = "center";
          document.body.appendChild(bg);
        }
      });
    } else {
      bg.style.backgroundImage = `url('${DEFAULT_WALLPAPER}')`;
      bg.style.backgroundSize = "cover";
      bg.style.backgroundPosition = "center";
      document.body.appendChild(bg);
    }
  }

  // bookmarks
  const bookmarks = result.bookmarks || [];
  bookmarks.forEach((bm) => {
    const a = document.createElement("a");
    a.className = "bookmark-tile";
    a.href = bm.url;
    a.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.button === 1) {
        e.preventDefault();
        window.open(bm.url, "_blank");
      }
    });

    // try to load favicon from google
    const domain = (() => { try { return new URL(bm.url).hostname; } catch { return null; } })();
    if (domain) {
      const img = document.createElement("img");
      img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      img.onerror = () => {
        img.remove();
        const fb = document.createElement("div");
        fb.className = "bm-fallback";
        fb.textContent = bm.name.charAt(0).toUpperCase();
        a.insertBefore(fb, a.firstChild);
      };
      a.appendChild(img);
    } else {
      const fb = document.createElement("div");
      fb.className = "bm-fallback";
      fb.textContent = bm.name.charAt(0).toUpperCase();
      a.appendChild(fb);
    }

    const name = document.createElement("div");
    name.className = "bm-name";
    name.textContent = bm.name;
    a.appendChild(name);
    bookmarksRow.appendChild(a);
  });

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
            ? new URL(query.startsWith("http") ? query : "https://" + query) : null;
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