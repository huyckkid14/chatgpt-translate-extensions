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

(() => {
  // Wait until the target Google Translate element appears
  const observer = new MutationObserver(() => {
    const targetDiv = document.querySelector(
      'div[jscontroller="c6uA6d"][jsaction="fBzasf:UgToCc;qE2zJe:xXaSuf;"]'
    );
    if (!targetDiv) return;

    // Stop observing once found
    observer.disconnect();

// 💬 Create ChatGPT Translate Button
const gptBtn = document.createElement("button");
gptBtn.id = "gptTranslateBtn";
gptBtn.textContent = "💬 Translate with ChatGPT Translate";

// --- centered & pretty ---
Object.assign(gptBtn.style, {
  display: "block",
  margin: "15px auto", // centers horizontally
  padding: "12px 20px",
  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
  color: "#fff",
  border: "none",
  borderRadius: "40px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
});


    gptBtn.addEventListener("mouseenter", () => {
      gptBtn.style.transform = "scale(1.05)";
      gptBtn.style.boxShadow = "0 5px 12px rgba(0,0,0,0.3)";
    });

    gptBtn.addEventListener("mouseleave", () => {
      gptBtn.style.transform = "scale(1)";
      gptBtn.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";
    });

    // Insert after the specific Google Translate div
    targetDiv.insertAdjacentElement("afterend", gptBtn);

    // On click, run ChatGPT translation via background.js
    gptBtn.addEventListener("click", async () => {
      console.log("ChatGPT Translate: Button clicked");

      const params = new URLSearchParams(window.location.search);
      const sourceLang = params.get("sl") || "auto";
      const targetLang = params.get("tl") || "en";
      const sourceText =
        document.querySelector("textarea[aria-label='Source text']")?.value ||
        "";

      if (!sourceText.trim()) {
        alert("Please enter text to translate first!");
        return;
      }

      const resp = await chrome.runtime.sendMessage({
        type: "translate",
        sourceLang,
        targetLang,
        text: sourceText,
      });

      const translation = resp?.translation;
      if (!translation) {
        alert("Translation failed. Try again!");
        return;
      }

      // Try overlaying Google Translate’s output
      const nativeOuter = document.querySelector(
        'span.HwtZe[jsname="jqKxS"]'
      );

      if (nativeOuter) {
        const translationText = translation;

        const rect = nativeOuter.getBoundingClientRect();

        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
          position: "absolute",
          left: `${rect.left + window.scrollX}px`,
          top: `${rect.top + window.scrollY}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          background: "rgba(255,255,255,0.9)",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4px",
          fontSize: "0.9em",
          zIndex: 2147483647,
          pointerEvents: "auto",
        });

        // Inject tooltip CSS once
        if (!document.getElementById("gptCustomTooltipStyles")) {
          const style = document.createElement("style");
          style.id = "gptCustomTooltipStyles";
          style.textContent = `
            .gpt-info {
              position: relative;
              display: inline-block;
              margin-left: 4px;
              cursor: help;
            }
            .gpt-info .gpt-tooltip {
              visibility: hidden;
              width: 180px;
              background: #333;
              color: #fff;
              text-align: center;
              border-radius: 4px;
              padding: 4px;
              position: absolute;
              bottom: 125%;
              left: 50%;
              transform: translateX(-50%);
              opacity: 0;
              transition: opacity 0.2s;
              pointer-events: none;
              font-size: 0.75em;
              line-height: 1.2;
              z-index: 2147483647;
            }
            .gpt-info:hover .gpt-tooltip {
              visibility: visible;
              opacity: 1;
            }
          `;
          document.head.appendChild(style);
        }

        const textSpan = document.createElement("span");
        textSpan.textContent = translationText;
        overlay.appendChild(textSpan);

        const info = document.createElement("span");
        info.className = "gpt-info";
        info.textContent = " ℹ️";

        const tip = document.createElement("div");
        tip.className = "gpt-tooltip";
        tip.textContent = "This translation was provided by ChatGPT.";
        info.appendChild(tip);

        overlay.appendChild(info);
        document.body.appendChild(overlay);
      } else {
        console.warn(
          "ChatGPT Translate: native span not found — showing modal fallback"
        );
        showFallbackModal(translation);
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 🪟 Fallback modal logic (kept from your original)
  function showFallbackModal(translation) {
    const overlay = document.createElement("div");
    overlay.id = "gptFallbackOverlay";
    overlay.style = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    `;

    const modal = document.createElement("div");
    modal.id = "gptFallbackModal";
    modal.style = `
      background: white;
      padding: 1.5em;
      max-width: 90%;
      width: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: sans-serif;
      position: relative;
    `;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style = `
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      border: none;
      background: transparent;
      font-size: 1.2em;
      cursor: pointer;
    `;
    closeBtn.addEventListener("click", () => overlay.remove());
    modal.appendChild(closeBtn);

    const title = document.createElement("h2");
    title.textContent = "Translation";
    title.style.marginTop = "0";
    modal.appendChild(title);

    const p = document.createElement("p");
    p.textContent = translation;
    p.style.whiteSpace = "pre-wrap";
    modal.appendChild(p);

    const tooltipWrapper = document.createElement("div");
    tooltipWrapper.className = "gpt-tooltip";
    tooltipWrapper.textContent = "Why am I seeing this?";

    const tooltipText = document.createElement("span");
    tooltipText.className = "gpt-tooltiptext";
    tooltipText.textContent =
      "The ChatGPT Translator couldn't find the spot in Google Translate to insert your result.";
    tooltipWrapper.appendChild(tooltipText);

    const style = document.createElement("style");
    style.textContent = `
      .gpt-tooltip {
        position: relative;
        display: inline-block;
        margin-top: 1em;
        color: #007bff;
        cursor: help;
        font-size: 0.9em;
        text-decoration: underline;
      }
      .gpt-tooltiptext {
        visibility: hidden;
        width: 220px;
        background-color: #333;
        color: #fff;
        text-align: left;
        border-radius: 4px;
        padding: 0.5em;
        position: absolute;
        z-index: 1000000;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 0.8em;
        line-height: 1.2;
      }
      .gpt-tooltip:hover .gpt-tooltiptext {
        visibility: visible;
        opacity: 1;
      }
    `;
    modal.appendChild(style);

    modal.appendChild(tooltipWrapper);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
})();
