const usernameInput = document.getElementById("username");
const tabTitleInput = document.getElementById("tab-title");
const dynamicTitleToggle = document.getElementById("dynamic-title");
const effectBtns = document.querySelectorAll(".option-btn[data-value]");

let selectedEffect = "none";

// button group logic
effectBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    effectBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedEffect = btn.dataset.value;
  });
});

// load
chrome.storage.sync.get(["username", "tabTitle", "dynamicTitle", "titleEffect"], (result) => {
  if (result.username) usernameInput.value = result.username;
  if (result.tabTitle) tabTitleInput.value = result.tabTitle;
  dynamicTitleToggle.checked = result.dynamicTitle || false;

  selectedEffect = result.titleEffect || "none";
  effectBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedEffect);
  });
});

// save
document.querySelector(".btn-save").addEventListener("click", () => {
  chrome.storage.sync.set({
    username: usernameInput.value,
    tabTitle: tabTitleInput.value,
    dynamicTitle: dynamicTitleToggle.checked,
    titleEffect: selectedEffect,
  }, () => showToast("changes saved"));
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "✓  " + message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}