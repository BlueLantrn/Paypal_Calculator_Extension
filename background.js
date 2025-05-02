let latestData;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_RESPONSE") {
    let totalGross = 0;
    let totalFee = 0;
    let totalNet = 0;

    message.data?.transactions?.map((transaction) => {
      if (transaction.status.value === "COMPLETED") {
        let parsedTransactionGross = parseLocalizedNumber(transaction.gross);
        let parsedTransactionNet = parseLocalizedNumber(transaction.net);
        let parsedTransactionTax = parseLocalizedNumber(transaction.fee);

        totalGross += parsedTransactionGross;
        totalNet += parsedTransactionNet;
        totalFee += parsedTransactionTax;
      }
    });

    if (latestData) {
      latestData = {
        gross: latestData.gross + totalGross,
        net: latestData.net + totalNet,
        fee: latestData.fee + totalFee,
      };
    } else {
      latestData = {
        gross: totalGross,
        net: totalNet,
        fee: totalFee,
      };
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_DATA") {
    sendResponse({ data: latestData });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "RESET_DATA") {
    latestData = null;
    sendResponse({ success: true });
  }
});

function parseLocalizedNumber(str) {
  if (!str) return 0;

  // Remove all non-number/decimal symbols first
  str = str.replace(/[^0-9.,-]/g, "");

  const commaCount = (str.match(/,/g) || []).length;
  const dotCount = (str.match(/\./g) || []).length;

  // Case: comma as decimal (e.g. "2.000,45" or "2917,47")
  if (commaCount === 1 && dotCount === 0) {
    return parseFloat(str.replace(",", "."));
  }

  // Case: dot as decimal (e.g. "2,619.47")
  if (dotCount === 1 && commaCount > 0) {
    return parseFloat(str.replace(/,/g, ""));
  }

  // Case: no separators (e.g. "291747")
  if (dotCount === 0 && commaCount === 0) {
    return parseFloat(str);
  }

  // Fallback: strip all non-digits and try parseFloat
  const fallback = str.replace(/[^0-9.-]/g, "");
  return parseFloat(fallback);
}
