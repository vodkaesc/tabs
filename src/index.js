chrome.storage.sync.get(["username", "tabTitle", "dynamicTitle", "titleEffect", "faviconType", "messageEnabled", "messageFontType", "messageFontFamily", "messageTextColor", "messageTextSize", "messageType", "messageCustomText"], (result) => {
  const greetingEl = document.getElementById("greeting");

  // greeting
  if (result.messageEnabled === false) {
    greetingEl.style.display = "none";
  } else {

    // apply custom font
    if (result.messageFontType === "custom" && result.messageFontFamily) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(result.messageFontFamily)}&display=swap`;
      document.head.appendChild(link);
      greetingEl.style.fontFamily = `'${result.messageFontFamily}', sans-serif`;
    }

    // apply text color
    if (result.messageTextColor) {
      greetingEl.style.color = result.messageTextColor;
    }

    // apply text size
    if (result.messageTextSize) {
      greetingEl.style.fontSize = `${result.messageTextSize}rem`;
    }

    // build message based on type
    const name = result.username || "user";
    const now = new Date();
    const hour = now.getHours();
    const time = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
    const messageType = result.messageType || "afternoon-morning";

    let greeting = "";

    if (messageType === "afternoon-morning") {
      greeting = `Good ${time}, ${name}`;
    } else if (messageType === "date") {
      greeting = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    } else if (messageType === "time-12") {
      greeting = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    } else if (messageType === "time-24") {
      greeting = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    } else if (messageType === "custom") {
      greeting = result.messageCustomText || "";
    }

    if (result.titleEffect === "typewriter") {
      let i = 0;
      const type = () => {
        if (i < greeting.length) {
          greetingEl.textContent += greeting[i];
          i++;
          setTimeout(type, 60);
        }
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
      if (local.faviconBase64) {
        document.getElementById("favicon").href = local.faviconBase64;
      }
    });
  }

  // search
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  });

  if (result.dynamicTitle) {
    searchInput.addEventListener("input", () => {
      document.title = searchInput.value || defaultTitle;
    });
  }
});