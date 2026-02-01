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
// 🟦 Show intro modal on Gmail load
function showNewFeatureModal() {
  if (sessionStorage.getItem("chatgptTranslateModalShown")) return; // only show once per session
  sessionStorage.setItem("chatgptTranslateModalShown", "true");

  const modal = document.createElement("div");
  modal.id = "chatgptTranslateModal";
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      font-family: Arial, sans-serif;
    ">
      <div style="
        background: #fff;
        color: #333;
        border-radius: 12px;
        width: 480px;
        max-width: 90%;
        padding: 24px;
        box-shadow: 0 6px 25px rgba(0,0,0,0.3);
        text-align: center;
        position: relative;
        animation: fadeIn 0.3s ease;
      ">
        <h2 style="margin-bottom: 14px; color: #0072ff;">🌟 New Feature: Translate Emails!</h2>

        <video autoplay muted loop playsinline style="
          width: 100%;
          border-radius: 8px;
          margin-bottom: 16px;
        ">
          <source src="chrome-extension://bimapebcngdobhpcfpgoncjnjjddllim/assets/chatgpt-translate-gmail-video.mp4" type="video/mp4">
        </video>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          You can now translate entire Gmail emails instantly!<br><br>
          Just open any email, find the <b>ChatGPT Translate</b> button near Gmail’s “Translate to English” option, and click it.<br><br>
          Enter your target language (like <code>en</code> or <code>ko</code>), and your message will be translated in seconds. 🌍✨ <br><br>
	  Please note that this feature is not perfect, and we are improving it as we move on.
        </p>

        <button id="closeChatgptModal" style="
          background: linear-gradient(135deg, #0072ff, #00c6ff);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">Got it!</button>
      </div>

      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        #closeChatgptModal:hover {
          transform: scale(1.05);
        }
      </style>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector("#closeChatgptModal").addEventListener("click", () => modal.remove());
}

// run modal a few seconds after Gmail loads
window.addEventListener("load", showNewFeatureModal);


  async function injectButtons() {
    const gmailDivs = document.querySelectorAll(
      'div.meFepe div.bzc-Uw-LV-Zr[data-is-touch-wrapper="true"]'
    );
    if (!gmailDivs.length) return;

    gmailDivs.forEach(div => {
      if (div.querySelector(".gptGmailTranslateBtn")) return;

      const gptBtn = document.createElement("button");
      gptBtn.className = "gptGmailTranslateBtn";
      gptBtn.textContent = "ChatGPT Translate";

      Object.assign(gptBtn.style, {
        marginLeft: "8px",
        padding: "6px 14px",
        borderRadius: "20px",
        border: "none",
        background: "linear-gradient(135deg, #00c6ff, #0072ff)",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "13px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      });

      gptBtn.addEventListener("mouseenter", () => {
        gptBtn.style.transform = "scale(1.05)";
        gptBtn.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)";
      });
      gptBtn.addEventListener("mouseleave", () => {
        gptBtn.style.transform = "scale(1)";
        gptBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
      });

      div.appendChild(gptBtn);

      gptBtn.addEventListener("click", async () => {
        const emailBody =
          div.closest("tr")?.querySelector("div.ii.gt") ||
          document.querySelector("div.ii.gt");
        if (!emailBody) {
          alert("Could not find email body!");
          return;
        }

        const text = emailBody.textContent.trim();
        if (!text) {
          alert("No email text found to translate!");
          return;
        }

        const targetLang = prompt(
          "Enter target language (e.g., en, es, ko):",
          "en"
        );
        if (!targetLang) return;

        // 🔄 show loading effect while translating
        const loadingHTML = `
          <div id="gptTranslating" style="
            text-align: center;
            padding: 40px;
            font-size: 16px;
            font-family: Arial, sans-serif;
            color: #555;
          ">
            <div class="spinner" style="
              border: 4px solid #ccc;
              border-top: 4px solid #0072ff;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              animation: spin 1s linear infinite;
              margin: 0 auto 15px auto;
            "></div>
            Translating with ChatGPT...
          </div>

          <style>
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          </style>
        `;

        // save original before overwriting
        if (!emailBody.dataset.originalText) {
          emailBody.dataset.originalText = emailBody.innerHTML;
        }

        emailBody.innerHTML = loadingHTML;

        try {
          const resp = await chrome.runtime.sendMessage({
            type: "translate",
            sourceLang: "auto",
            targetLang,
            text,
          });

          console.log("RAW GPT OUTPUT:", JSON.stringify(resp.translation));

          const translation = resp?.translation;
          if (!translation) {
            alert("Translation failed. Try again!");
            return;
          }

          const formattedTranslation = translation
            .replace(/\\n/g, "<br>")
            .replace(/\n/g, "<br>");

          emailBody.innerHTML = `
            <div style="
              white-space: normal;
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.7;
            ">
              ${formattedTranslation}
            </div>
            <hr style="margin: 12px 0;">
            <button id="restoreOriginal" style="
              background: #f44336;
              color: #fff;
              border: none;
              border-radius: 5px;
              padding: 6px 10px;
              cursor: pointer;
              font-size: 13px;
            ">Restore Original</button>
          `;

          document.getElementById("restoreOriginal").addEventListener("click", () => {
            if (emailBody.dataset.originalText) {
              emailBody.innerHTML = emailBody.dataset.originalText;
            }
          });
        } catch (e) {
          emailBody.innerHTML = `<div style="color:red;">❌ Error translating: ${e.message}</div>`;
        }
      });

      console.log("✅ ChatGPT Translate button added inside .meFepe div!");
    });
  }

  injectButtons();
  setInterval(injectButtons, 5000);
})();
