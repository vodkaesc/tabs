const usernameInput = document.getElementById("username");
const tabTitleInput = document.getElementById("tab-title");

// load saved values when page opens
chrome.storage.sync.get(["username", "tabTitle"], (result) => {
  if (result.username) usernameInput.value = result.username;
  if (result.tabTitle) tabTitleInput.value = result.tabTitle;
});

// save on button click
document.querySelector(".btn-save").addEventListener("click", () => {
  chrome.storage.sync.set({
    username: usernameInput.value,
    tabTitle: tabTitleInput.value,
  }, () => {
    showToast("changes saved");
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "✓  " + message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}