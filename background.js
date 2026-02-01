/*!
 * ChatGPT Translate
 * Copyright (c) 2026 Jaewon Lee (huyckkid14)
 * Email: bestorangelover@gmail.com
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== "translate") return;

  const { sourceLang, targetLang, text } = msg;
  console.log("Background: received translate request", msg);

  fetch("https://chatgpt-translate-api.huyckkid14-projects.workers.dev/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceLang, targetLang, text })
  })
    .then(res => res.json())
    .then(data => {
      const translation = data.translation || "[no translation]";
      console.log("Background: got translation", translation);
      sendResponse({ translation });
    })
    .catch(err => {
      console.error("Background: translation error", err);
      sendResponse({ translation: "[error]" });
    });

  return true; // Keep the response async
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-text",
    title: "Translate text",
    contexts: ["selection"]
  });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "translate-text" || !info.selectionText) return;

  const payload = { type: "translate-selection", text: info.selectionText };

  // try to talk to that single frame
  chrome.tabs.sendMessage(
    tab.id,
    payload,
    { frameId: info.frameId },
    async (resp) => {
      // If the content-script isn’t injected yet, inject once and resend
      if (chrome.runtime.lastError) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id, frameIds: [info.frameId] },
          files: ["content/content-script.js"]
        });
        chrome.tabs.sendMessage(tab.id, payload, { frameId: info.frameId });
      }
    }
  );
});

chrome.action.onClicked.addListener(async () => {
  const { useGoogleTranslate } = await chrome.storage.local.get("useGoogleTranslate");

  if (useGoogleTranslate) {
    // 🚀 Go directly to Google Translate
    chrome.tabs.create({ url: "https://translate.google.com" });
  } else {
    // 🧠 Open your built-in translator page
    chrome.tabs.create({ url: chrome.runtime.getURL("pages/translate.html") });
  }
});

