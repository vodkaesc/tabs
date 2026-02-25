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
const messageTypeBtns = document.querySelectorAll("#message-type-group .option-btn");
const customMessageSection = document.getElementById("custom-message-section");
const messageCustomTextInput = document.getElementById("message-custom-text");
const wallpaperEnabledToggle = document.getElementById("wallpaper-enabled");
const wallpaperTypeBtns = document.querySelectorAll("#wallpaper-type-group .option-btn");
const wallpaperSolidSection = document.getElementById("wallpaper-solid-section");
const wallpaperUrlSection = document.getElementById("wallpaper-url-section");
const wallpaperFileSection = document.getElementById("wallpaper-file-section");
const wallpaperColorInput = document.getElementById("wallpaper-color");
const wallpaperUrlInput = document.getElementById("wallpaper-url");
const wallpaperUpload = document.getElementById("wallpaper-upload");
const wallpaperFilename = document.getElementById("wallpaper-filename");
const wallpaperReset = document.getElementById("wallpaper-reset");
const wallpaperPreviewImg = document.getElementById("wallpaper-preview-img");
const wallpaperPreviewEmpty = document.getElementById("wallpaper-preview-empty");
const wallpaperBrightnessInput = document.getElementById("wallpaper-brightness");
const wallpaperBlurInput = document.getElementById("wallpaper-blur");

let selectedEffect = "none";
let selectedFaviconType = "default";
let selectedMessageFont = "default";
let selectedMessageType = "afternoon-morning";
let selectedWallpaperType = "default";
let faviconBase64 = null;
let wallpaperBase64 = null;

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

// message type buttons
messageTypeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    messageTypeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMessageType = btn.dataset.value;
    customMessageSection.style.display = selectedMessageType === "custom" ? "block" : "none";
  });
});

// wallpaper type buttons
wallpaperTypeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    wallpaperTypeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedWallpaperType = btn.dataset.value;
    updateWallpaperSections();
  });
});

function updateWallpaperSections() {
  wallpaperSolidSection.style.display = selectedWallpaperType === "solid-color" ? "block" : "none";
  wallpaperUrlSection.style.display = selectedWallpaperType === "url" ? "block" : "none";
  wallpaperFileSection.style.display = selectedWallpaperType === "file-upload" ? "block" : "none";
}

function updateWallpaperPreview() {
  if (selectedWallpaperType === "file-upload" && wallpaperBase64) {
    wallpaperPreviewImg.src = wallpaperBase64;
    wallpaperPreviewImg.style.display = "block";
    wallpaperPreviewEmpty.style.display = "none";
  } else if (selectedWallpaperType === "url" && wallpaperUrlInput.value) {
    wallpaperPreviewImg.src = wallpaperUrlInput.value;
    wallpaperPreviewImg.style.display = "block";
    wallpaperPreviewEmpty.style.display = "none";
  } else if (selectedWallpaperType === "solid-color" && wallpaperColorInput.value) {
    wallpaperPreviewImg.style.display = "none";
    wallpaperPreviewEmpty.style.display = "block";
    wallpaperPreviewEmpty.style.color = wallpaperColorInput.value;
    document.getElementById("wallpaper-preview").style.background = wallpaperColorInput.value;
  } else {
    wallpaperPreviewImg.style.display = "none";
    wallpaperPreviewEmpty.style.display = "block";
    document.getElementById("wallpaper-preview").style.background = "#1e1e1e";
    wallpaperPreviewEmpty.style.color = "#555";
    wallpaperPreviewEmpty.textContent = "no wallpaper";
  }
}

// wallpaper url preview on input
wallpaperUrlInput.addEventListener("input", updateWallpaperPreview);
wallpaperColorInput.addEventListener("input", updateWallpaperPreview);

// wallpaper file upload
wallpaperUpload.addEventListener("change", () => {
  const file = wallpaperUpload.files[0];
  if (!file) return;
  wallpaperFilename.textContent = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    wallpaperBase64 = e.target.result;
    updateWallpaperPreview();
  };
  reader.readAsDataURL(file);
});

// wallpaper reset
wallpaperReset.addEventListener("click", () => {
  wallpaperBase64 = null;
  wallpaperUpload.value = "";
  wallpaperFilename.textContent = "No file selected.";
  updateWallpaperPreview();
});

// file upload (favicon)
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
chrome.storage.sync.get(["username", "tabTitle", "dynamicTitle", "titleEffect", "faviconType", "messageEnabled", "messageFontType", "messageFontFamily", "messageTextColor", "messageTextSize", "messageType", "messageCustomText", "wallpaperEnabled", "wallpaperType", "wallpaperColor", "wallpaperUrl", "wallpaperBrightness", "wallpaperBlur"], (result) => {
  if (result.username) usernameInput.value = result.username;
  if (result.tabTitle) tabTitleInput.value = result.tabTitle;
  dynamicTitleToggle.checked = result.dynamicTitle || false;
  messageEnabledToggle.checked = result.messageEnabled !== false;
  wallpaperEnabledToggle.checked = result.wallpaperEnabled !== false;
  if (result.messageTextColor) messageColorInput.value = result.messageTextColor;
  if (result.messageTextSize) messageSizeInput.value = result.messageTextSize;
  if (result.messageCustomText) messageCustomTextInput.value = result.messageCustomText;
  if (result.wallpaperColor) wallpaperColorInput.value = result.wallpaperColor;
  if (result.wallpaperUrl) wallpaperUrlInput.value = result.wallpaperUrl;
  if (result.wallpaperBrightness) wallpaperBrightnessInput.value = result.wallpaperBrightness;
  if (result.wallpaperBlur) wallpaperBlurInput.value = result.wallpaperBlur;

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

  selectedMessageType = result.messageType || "afternoon-morning";
  messageTypeBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedMessageType);
  });
  customMessageSection.style.display = selectedMessageType === "custom" ? "block" : "none";

  selectedWallpaperType = result.wallpaperType || "default";
  wallpaperTypeBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedWallpaperType);
  });
  updateWallpaperSections();

  chrome.storage.local.get(["faviconBase64", "wallpaperBase64"], (local) => {
    if (local.faviconBase64) {
      faviconBase64 = local.faviconBase64;
      faviconPreviewImg.src = faviconBase64;
      faviconPreviewImg.style.display = "block";
      faviconPreviewEmpty.style.display = "none";
      faviconFilename.textContent = "saved icon";
    }
    if (local.wallpaperBase64) {
      wallpaperBase64 = local.wallpaperBase64;
      wallpaperFilename.textContent = "saved wallpaper";
      updateWallpaperPreview();
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
    messageType: selectedMessageType,
    messageCustomText: messageCustomTextInput.value,
    wallpaperEnabled: wallpaperEnabledToggle.checked,
    wallpaperType: selectedWallpaperType,
    wallpaperColor: wallpaperColorInput.value,
    wallpaperUrl: wallpaperUrlInput.value,
    wallpaperBrightness: wallpaperBrightnessInput.value,
    wallpaperBlur: wallpaperBlurInput.value,
  }, () => {
    const saves = [];
    if (faviconBase64) saves.push(new Promise(res => chrome.storage.local.set({ faviconBase64 }, res)));
    else saves.push(new Promise(res => chrome.storage.local.remove("faviconBase64", res)));
    if (wallpaperBase64) saves.push(new Promise(res => chrome.storage.local.set({ wallpaperBase64 }, res)));
    else saves.push(new Promise(res => chrome.storage.local.remove("wallpaperBase64", res)));
    Promise.all(saves).then(() => showToast("changes saved"));
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "✓  " + message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}