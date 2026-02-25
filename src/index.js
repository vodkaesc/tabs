chrome.storage.sync.get(["username", "tabTitle", "dynamicTitle", "titleEffect", "faviconType"], (result) => {
  // greeting
  const name = result.username || "user";
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const greeting = `Good ${time}, ${name}`;
  const greetingEl = document.getElementById("greeting");

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