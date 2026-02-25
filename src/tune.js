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

let selectedEffect = "none";
let selectedFaviconType = "default";
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
chrome.storage.sync.get(["username", "tabTitle", "dynamicTitle", "titleEffect", "faviconType"], (result) => {
  if (result.username) usernameInput.value = result.username;
  if (result.tabTitle) tabTitleInput.value = result.tabTitle;
  dynamicTitleToggle.checked = result.dynamicTitle || false;

  selectedEffect = result.titleEffect || "none";
  effectBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedEffect);
  });

  selectedFaviconType = result.faviconType || "default";
  faviconTypeBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === selectedFaviconType);
  });
  customFaviconSection.style.display = selectedFaviconType === "custom" ? "block" : "none";

  // load saved favicon from local storage (too big for sync)
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
  }, () => {
    // favicon goes to local storage because it's a big base64 string
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