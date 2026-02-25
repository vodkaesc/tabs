const usernameInput = document.getElementById("username");

// load saved value when page opens
chrome.storage.sync.get(["username"], (result) => {
  if (result.username) {
    usernameInput.value = result.username;
  }
});

// save on button click
document.querySelector(".btn-save").addEventListener("click", () => {
  chrome.storage.sync.set({ username: usernameInput.value }, () => {
    showToast("changes saved");
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "✓  " + message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}