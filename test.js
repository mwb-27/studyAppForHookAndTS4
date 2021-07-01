const crypto = require("crypto");
var token = "9984a5ff35f7aa9a0182380cd237897c";
var time = Date.now();
var stringToSign = time.toString();
var signature = crypto
  .createHmac("sha256", token)
  .update(stringToSign)
  .digest()
  .toString("base64");
var url =
  "http://www.tangzhiyong.to" +
  "?time=" +
  time +
  "&signature=" +
  encodeURIComponent(signature);
console.log(url);
