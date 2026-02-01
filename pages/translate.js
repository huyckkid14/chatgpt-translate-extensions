document.getElementById("translateBtn").addEventListener("click", async () => {
const redirectToggle = document.getElementById("redirectToggle");

// Load saved setting on startup
chrome.storage.local.get("useGoogleTranslate", (data) => {
  redirectToggle.checked = !!data.useGoogleTranslate;
});

// Save setting when changed
redirectToggle.addEventListener("change", () => {
  chrome.storage.local.set({ useGoogleTranslate: redirectToggle.checked });
});

  const text = document.getElementById("sourceText").value.trim();
  const targetLang = document.getElementById("targetLang").value.trim();
  const redirect = document.getElementById("redirectToggle").checked;

  if (!text || !targetLang) {
    alert("Enter text and target language!");
    return;
  }

  // Built-in ChatGPT translation
  const resp = await chrome.runtime.sendMessage({
    type: "translate",
    sourceLang: "auto",
    targetLang,
    text,
  });

  document.getElementById("output").textContent =
    resp?.translation || "[error]";
});
