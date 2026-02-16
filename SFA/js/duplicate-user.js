//check_user_usage_stat();
var userID = localStorage.getItem('user_id');
function check_user_usage_stat(){
    var serialNo = localStorage.getItem('SERIALNO');
    var stllLgnStts = checkIfstillLogin(userID, serialNo);

     $.ajax ({
      url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
        type: "GET",
        data: {"type":"CHECK_DUPLICATED_LOGIN_WEB", "userID":userID},
        dataType: "json",
        crossDomain: true,
        cache: false,         
        aysnc: false,   
        success: function(r){ 
          var rstatHolder = r.statusCount;
          //console.log('Duplicatestatus: '+rstatHolder+' stillloginstat: ' + stllLgnStts + '\nserialno: ' + serialNo);
          if(rstatHolder == '4'){
            if(stllLgnStts == 1){
              localStorage.removeItem('username');
              logoutThisUser(userID, serialNo);
              $('#duplicateUserModal').modal({backdrop: 'static', keyboard: false});
            }else{
              console.log('Previous user executed');
            }
          }

          if(stllLgnStts == 0){
            console.log('false in 0 stat');
            $('#duplicateUserModal').modal({backdrop: 'static', keyboard: false});
            localStorage.removeItem('username');
          }
        }
      });
  }

  function cofirmationDupUser(){
    window.location = 'https://mybuddy-sfa.com';
  }
  
  function logoutThisUser(userID, serialNo){
    $.ajax ({
      url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
      type: "GET",
      data: {"type":"LOGOUT_DUPLICATED_LOGIN_WEB", "userID":userID, "serialNo":serialNo},
      dataType: "json",
      crossDomain: true,
      cache: false,            
      success: function(r){ 
        localStorage.removeItem('SERIALNO');
      }
    });
  }
 
  
  function checkIfstillLogin(userID, serialNo){
    $.ajax ({
      url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
      type: "GET",
      data: {"type":"CHECK_IFSTILL_LOGIN_WEB", "userID":userID, "serialNo":serialNo},
      dataType: "json",
      crossDomain: true,
      cache: false,
      async: false,            
      success: function(r){ 
        //console.log('still login: ' +r.statusCount + ' serialNo: ' + serialNo);
        status = r.statusCount;
      }
    });
     
    return status;
  }