const usernameInput = document.getElementById("username");
const tabTitleInput = document.getElementById("tab-title");
const dynamicTitleToggle = document.getElementById("dynamic-title");
const effectBtns = document.querySelectorAll("#title-effect-group .option-btn");
const faviconTypeBtns = document.querySelectorAll("#favicon-type-group .option-btn");
const customFaviconSection = document.getElementById("custom-favicon-section");
const faviconUpload = document.getElementById("favicon-upload");
const faviconFilename = document.getElementById("favicon-filename");
const faviconPreviewImg = document.getElementById("favicon-preview-img");
const faviconPreviewEmpty = document.getElementById("favicon-preview-empty");
const faviconReset = document.getElementById("favicon-reset");
const messageEnabledToggle = document.getElementById("message-enabled");
const messageFontBtns = document.querySelectorAll("#message-font-group .option-btn");
const customFontSection = document.getElementById("custom-font-section");
const messageFontInput = document.getElementById("message-font");
const messageColorInput = document.getElementById("message-color");
const messageSizeInput = document.getElementById("message-size");

let selectedEffect = "none";
let selectedFaviconType = "default";
let selectedMessageFont = "default";
let faviconBase64 = null;

// title effect buttons
effectBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    effectBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedEffect = btn.dataset.value;
  });
});

// favicon type buttons
faviconTypeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    faviconTypeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedFaviconType = btn.dataset.value;
    customFaviconSection.style.display = selectedFaviconType === "custom" ? "block" : "none";
  });
});

// message font buttons
messageFontBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    messageFontBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMessageFont = btn.dataset.value;
    customFontSection.style.display = selectedMessageFont === "custom" ? "block" : "none";
  });
});

// file upload
faviconUpload.addEventListener("change", () => {
  const file = faviconUpload.files[0];
  if (!file) return;
  faviconFilename.textContent = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    faviconBase64 = e.target.result;
    faviconPreviewImg.src = faviconBase64;
    faviconPreviewImg.style.display = "block";
    faviconPreviewEmpty.style.display = "none";
  };
  reader.readAsDataURL(file);
});

// reset favicon
faviconReset.addEventListener("click", () => {
  faviconBase64 = null;
  faviconUpload.value = "";
  faviconFilename.textContent = "No file selected.";
  faviconPreviewImg.style.display = "none";
  faviconPreviewImg.src = "";
  faviconPreviewEmpty.style.display = "flex";
});

// load
chrome.storage.sync.get(["username", "tabTitle", "dynamicTitle", "titleEffect", "faviconType", "messageEnabled", "messageFontType", "messageFontFamily", "messageTextColor"], (result) => {
  if (result.username) usernameInput.value = result.username;
  if (result.tabTitle) tabTitleInput.value = result.tabTitle;
  dynamicTitleToggle.checked = result.dynamicTitle || false;
  messageEnabledToggle.checked = result.messageEnabled !== false;
  if (result.messageTextColor) messageColorInput.value = result.messageTextColor;
  if (result.messageTextSize) messageSizeInput.value = result.messageTextSize;

  selectedEffect = result.titleEffect || "none";
  effectBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedEffect);
  });

  selectedFaviconType = result.faviconType || "default";
  faviconTypeBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedFaviconType);
  });
  customFaviconSection.style.display = selectedFaviconType === "custom" ? "block" : "none";

  selectedMessageFont = result.messageFontType || "default";
  messageFontBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedMessageFont);
  });
  customFontSection.style.display = selectedMessageFont === "custom" ? "block" : "none";
  if (result.messageFontFamily) messageFontInput.value = result.messageFontFamily;

  chrome.storage.local.get(["faviconBase64"], (local) => {
    if (local.faviconBase64) {
      faviconBase64 = local.faviconBase64;
      faviconPreviewImg.src = faviconBase64;
      faviconPreviewImg.style.display = "block";
      faviconPreviewEmpty.style.display = "none";
      faviconFilename.textContent = "saved icon";
    }
  });
});

// save
document.querySelector(".btn-save").addEventListener("click", () => {
  chrome.storage.sync.set({
    username: usernameInput.value,
    tabTitle: tabTitleInput.value,
    dynamicTitle: dynamicTitleToggle.checked,
    titleEffect: selectedEffect,
    faviconType: selectedFaviconType,
    messageEnabled: messageEnabledToggle.checked,
    messageFontType: selectedMessageFont,
    messageFontFamily: messageFontInput.value,
    messageTextColor: messageColorInput.value,
    messageTextSize: messageSizeInput.value,
  }, () => {
    if (faviconBase64) {
      chrome.storage.local.set({ faviconBase64 }, () => showToast("changes saved"));
    } else {
      chrome.storage.local.remove("faviconBase64", () => showToast("changes saved"));
    }
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "✓  " + message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}