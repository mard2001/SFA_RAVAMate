var cred_delimeter = localStorage.getItem("COMMONUSER");
console.log('COMMONUSER USER: '+ cred_delimeter);
if(cred_delimeter == '' || cred_delimeter == null || cred_delimeter == 'null' ||
   cred_delimeter == 'undefined' || cred_delimeter == undefined){
   window.location = "https://mybuddy-sfa.com/generic_user";
}