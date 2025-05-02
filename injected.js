(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url; // Save URL for later
    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("load", function () {
      try {
        // Only intercept specific endpoints (optional)
        if (
          this._url &&
          this._url.includes("/unifiedtransactions/v1/transactions")
        ) {
          window.postMessage(
            {
              type: "FETCH_DATA",
              payload: {
                url: this._url,
                body: JSON.parse(this.responseText),
                status: this.status,
              },
            },
            "*"
          );
        }
      } catch (err) {
        console.error("[Injected XHR] Failed to read XHR response", err);
      }
    });

    return originalSend.apply(this, args);
  };
})();
