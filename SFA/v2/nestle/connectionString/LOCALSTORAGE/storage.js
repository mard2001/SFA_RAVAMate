var s = (CryptoJS.AES.decrypt(localStorage.getItem("srvr"),"/")).toString(CryptoJS.enc.Utf8);
var u = (CryptoJS.AES.decrypt(localStorage.getItem("usrnm"),"/")).toString(CryptoJS.enc.Utf8);
var p = (CryptoJS.AES.decrypt(localStorage.getItem("psswrd"),"/")).toString(CryptoJS.enc.Utf8);
var d = (CryptoJS.AES.decrypt(localStorage.getItem("dtbse"),"/")).toString(CryptoJS.enc.Utf8);


var con_info = [s, p, u, d];