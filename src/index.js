chrome.storage.sync.get(["username", "tabTitle"], (result) => {
  // greeting
  const name = result.username || "user";
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  document.getElementById("greeting").textContent = `Good ${time}, ${name}`;

  // tab title
  document.title = result.tabTitle || "tabs";
});