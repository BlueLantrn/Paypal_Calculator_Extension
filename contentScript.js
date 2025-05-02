// Inject our patch into the page itself
if (window.location.pathname.includes("unifiedtransactions")) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("injected.js");
  script.onload = () => script.remove(); // Clean up once loaded
  (document.head || document.documentElement).appendChild(script);

  // Listen for messages from the injected script
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "FETCH_DATA") {
      chrome.runtime.sendMessage({
        type: "FETCH_RESPONSE",
        data: event.data.payload.body,
      });
    }
  });
}
