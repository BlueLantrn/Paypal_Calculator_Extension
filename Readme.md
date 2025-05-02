Little extension that listen to paypal transactions request (only for COMPLETED ones)
The extension is active only on paypal, and only listens when on activity page.
It filters out all request, and only retrieve the payload of the transactions request to calculate the total.
It does not retain any information, except the total (that you can reset).
Total is stored on browser memory, and will be lost when closing the broswer.
