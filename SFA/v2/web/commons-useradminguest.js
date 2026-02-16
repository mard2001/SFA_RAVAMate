var cred_delimeter = localStorage.getItem("REGULARUSER");
if(cred_delimeter == '' || cred_delimeter == null || cred_delimeter == 'null' ||
  cred_delimeter == 'undefined' || cred_delimeter == undefined){
    window.location = "https://mybuddy-sfa.com";
}