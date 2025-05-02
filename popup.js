chrome.runtime.sendMessage({ type: "GET_DATA" }, (response) => {
  const el = document.getElementById("result");
  if (response?.data) {
    el.textContent = JSON.stringify(response.data, null, 2);
  } else {
    el.textContent = "No data captured yet.";
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "RESET_DATA" }, () => {
    document.getElementById("result").textContent = "Data reset.";
  });
});
