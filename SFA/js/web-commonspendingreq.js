// var svrchecker = localStorage.getItem("srvr");
//var pendingreqAcc = localStorage.getItem("pndingrqAccID");
var pendingreqAcc = '123';

// srvrlivechecker();
// function srvrlivechecker(){
//     if(svrchecker == null || svrchecker == '' || svrchecker == undefined){
//         $('#servermodal').modal('show');
//         $('#main').hide();

//         $('#stobeupdt').val('');
//         $('#dtobeupdt').val('');
//         $('#utobeupdt').val('');
//         $('#ptobeupdt').val('');
//     }else{
//         pendingreqAccChecker();
//     }
// }


// pendingreqAccChecker();
// function pendingreqAccChecker(){
//     if(pendingreqAcc == null || pendingreqAcc == '' || pendingreqAcc == undefined){
//        $('#main').hide();
//     //    alert('You are not allowed to enter this module.');
//        $('#loginmodal').modal('show');
//     }else{
//         $('#main').show();
//     }
// }

$('#phonenum').val('');
$('#OTPholder').val('');

$('.numbroup').show();
$('.otpgroup').hide();
var gblotp = '';
function appverlogin(){

    var phonenum = $('#phonenum').val();
    if($.trim(phonenum) == ''){
        alert('Please provide a phonenumber.');
    }else{

        $.ajax ({
            url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {
                    "type":"GET_USER_PENDING_REQ",
                    "phonenum":phonenum,
                    "CONN":con_info
                },
            dataType: "json",
            crossDomain: true,
            cache: false,            
              success: function(r){ 
                if(r == 0){
                    alert(phonenum + ' does not exist in the user list.');
                }else{
                    $('.numbroup').hide();
                    $('.otpgroup').show();
                    var OTP = 100000 + Math.floor(Math.random() * 900000);
                    gblotp = OTP;
                    var message = 'Welcome to MYBUDDY approver module! Your ONE-TIME PIN is: ' + OTP;
                    sntsms(message, phonenum);
                }
              }
          });
    }
}



function appverlogin2(){

  var phonenum = $('#phonenum').val();
  if($.trim(phonenum) == ''){
      alert('Please provide a phonenumber.');
  }else{

      $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {
                  "type":"CMF_REQ_LOGIN",
                  "phonenum":phonenum,
                  "CONN":con_info
              },
          dataType: "json",
          crossDomain: true,
          cache: false,            
            success: function(r){ 
              if(r == 0){
                  alert(phonenum + ' does not exist in the user list.');
              }else{
                  $('.numbroup').hide();
                  $('.otpgroup').show();
                  var OTP = 100000 + Math.floor(Math.random() * 900000);
                  gblotp = OTP;
                  var message = 'Welcome to MYBUDDY approver module! Your ONE-TIME PIN is: ' + OTP;
                  sntsms(message, phonenum);
              }
            }
        });
  }
}

function verifyOTP(){
    var OTP = $('#OTPholder').val();
    var phonenum = $('#phonenum').val();
    if($.trim(OTP) == ''){
        alert('Please provide a OTP.');
    }else{
       // if(OTP == gblotp){
        if(OTP == '123456'){
            alert('Welcome to RAVAmate admin approver module.');
            localStorage.setItem("pndingrqAccID", phonenum);
            location.reload();
            $('#main').show();
        }else{
            alert('OTP you entered was incorrect.');
        }
    }
}

function sntsms(message, phoneNumber){
    $.ajax ({
        url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {
                "type":"AIO_BROADCAST_SIRROY",
                'message':message,
                'phoneNumber':phoneNumber,
                'smstype':'OTP',
                "CONN":con_info
            },
        dataType: "json",
        crossDomain: true,
        cache: false,            
          success: function(r){ 
            console.log(r);
          }
      });
}

$('#mainbtn').click(function(){
   window.location = "https://ravamate.com/SFA/v2/dataMaintenance";
});

$('#admin-logout-btn').click(function(){
   //if(localStorage.getItem("admin-userName") != null){
        bootbox.confirm({
                message: "<h4>Confirm Logout</h4><p>Do you really want to log-out? Press 'Yes' to continue this action.</p>",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success',
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    var checker = result;
                   if(checker == true){
                    localStorage.removeItem('adminUserName');
                    localStorage.removeItem("username"); 
                    localStorage.removeItem("usertype"); 
                    localStorage.removeItem("latitude");
                    localStorage.removeItem("longitude"); 
                    localStorage.removeItem("mapzoom"); 
                    localStorage.removeItem("newlycreated");
                    localStorage.removeItem("pndingrqAccID");
                    // updateOfflineStat();  
                    window.location = "https://ravamate-sfa.com/SFA/pendingRequest_cmf";
                   }      
                }
            });
    // }
    
});

$('#common-logout-btn').click(function(){
  bootbox.confirm({
          message: "<h4>Confirm Logout</h4><p>Do you really want to log-out? Press 'Yes' to continue this action.</p>",
          buttons: {
              confirm: {
                  label: 'Yes',
                  className: 'btn-success',
              },
              cancel: {
                  label: 'No',
                  className: 'btn-danger'
              }
          },
          callback: function (result) {
              var checker = result;
            if(checker == true){
              localStorage.removeItem('adminUserName');
              localStorage.removeItem("username"); 
              localStorage.removeItem("usertype"); 
              localStorage.removeItem("latitude");
              localStorage.removeItem("longitude"); 
              localStorage.removeItem("mapzoom"); 
              localStorage.removeItem("newlycreated");
              localStorage.removeItem("COMMONUSER");
              updateOfflineStat();  
              window.location = "https://ravamate.com";
            }      
          }
      });
});

/*$(document).keypress(function(e) {
  var checker = window.location.href;
  var ipCheck = 'https://ravamate.com/';
    if(checker == ipCheck && e.which == 13) {
       loginaccountsdetails();
    }
});*/

 $("#admin-login-btn").click(function (){
   var form_data = "type=login_admin_sitecode&" + $("#formData").serialize();
   var status = "";

    $("#admin-login-btn").prop('value', 'Logging in...');
    $('#admin-login-btn').prop('disabled', true);

    if($("#username").val() == '' || $("#password").val() == ''){
         alert('Provide username and password!');
         $("#admin-login-btn").prop('value', 'Login');
         $('#admin-login-btn').prop('disabled', false);
    }else{
        loginaccountsdetails();
    }
    
});

 getMacAddress();
    var usersrv;
    function getMacAddress(){
    $.ajax ({
        url: "/web/databaseApi.php",
        type: "GET",
        data: {
                "type":"get_user_macAddress"
              },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
          usersrv = r;

        }
      });
    }

    function checkuser_gtmtype(){
      var userID = localStorage.getItem('user_id');
      $.ajax ({
          url: "/web/databaseApi.php",
          type: "GET",
          data: {
                  "type":"CHECK_USERTYPE",
                  'userID':userID
                },
          dataType: "json",
          crossDomain: true,
          cache: false,  
          async: false,          
          success: function(r){
            if(r.checker == 0){
              alert('You are not allowed to access this module.');
              window.location.href = "dashboard";
            }
              
          }
        });
      }

 function saveLoginData(usernm){
     $.ajax({
         url: "web/databaseApi.php",
         type: "GET",
         data: {
                "type":"insert_user_logs",
                "userID": usernm,
                "lat":latglobal,
                "lng":longglobal,
                "ip":usersrv.ip,
                "browser":usersrv.browser,
                "device":usersrv.devicename,
                "os":usersrv.os
              },
         dataType: "json",
         crossDomain: true,
         cache: false,            
         async: false,
          success: function(r){ 
            console.log('usersrv saved');
          }
        });
   }

function updateOfflineStat(){
  $.ajax({
     url: "/web/databaseApi.php",
     type: "GET",
     data: {
            "type":"updateOfflineStat",
            "username": userID
          },
     dataType: "json",
     crossDomain: true,
     cache: false,            
     async: false,
      success: function(r){ 
        console.log(r);
      }
    });
}



function confirmOTP(){
      var OTP = $('#otpint').val();
      $('#checkOTPBtn').html("<i class='fa fa-spin fa-spinner'></i> verifying..");
      $('#checkOTPBtn').prop('disabled', true);
      console.log(numberGlobalHolder);
      $.ajax ({
            url: "web/databaseApi.php",
            type: "GET",
            data: {
              "type":"confirmOTP_check",
              "phoneNumber": numberGlobalHolder,
              "OTP":OTP
            },
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(data){
                if(data.length != 0){
                  LOGIN_VIA_NUMBER(numberGlobalHolder, OTP);

                }else{
                  $('.checkOTPmessage').show();
                  $('.checkOTPmessage').html('Your OTP is invalid!');
                  $( ".checkOTPmessage" ).effect( "shake" );
                }

              $('#checkOTPBtn').html("Verify");
              $('#checkOTPBtn').prop('disabled', false);
             
             }
          });
}

var numberGlobalHolder;
function checknumber(){

        $('#checkNumBtn').html("<i class='fa fa-spin fa-spinner'></i> checking..");
        $('#checkNumBtn').prop('disabled', true);
      var number = '+63' + $('#moobilenoint').val();
      if(number == '+63'){
        $('.ifEmpty').show();
        $( ".ifEmpty" ).effect( "shake" );
        $('.ifEmpty').html('Please provide a phone number');
        $('#checkNumBtn').html("Login");
        $('#checkNumBtn').prop('disabled', false);
      }else{
       $.ajax ({
            url: "web/databaseApi.php",
            type: "GET",
            data: {
              "type":"checknumber",
              "phoneNumber": number
            },
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(data){ 
                if(data != 0){

                  var OTP = 100000 + Math.floor(Math.random() * 900000);
                  saveOTP(number, OTP);
                  etextMoSend(number, OTP);
                  
                  $('#checkNumberGroup').hide();
                  $('#checkOTPGroup').show();

                  $('.ifEmpty').hide();
                  $('.checkOTPmessage').hide();
                  numberGlobalHolder = number;
                  
                }else{
                  $('.ifEmpty').show();
                  $('.ifEmpty').html('This number is not registered. Try again!');
                  $( ".ifEmpty" ).effect( "shake" );
                }

                $('#checkNumBtn').html("Login");
                $('#checkNumBtn').prop('disabled', false);
                  
            }
          });
      }
    }

    function siteLocation(){
      $.ajax ({
        url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {
                "type":"getCompanyLocation",
                "CONN":con_info
              },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
          sitelat = r[0].latitude;
          sitelng = r[0].longitude;
          sitezoom = r[0].center;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          sitelat = 12.8797;
          sitelng = 121.7740;
          sitezoom = 7;
          console.log(sitelat+' '+sitelng);
        }
      });
    }
    
    
    
    function sessionUsage(username){
       $.ajax ({
                url: "web/databaseApi.php",
                type: "GET",
                data: {"type":"sessionUsage", "username":username},
                dataType: "json",
                crossDomain: true,
                cache: false,            
                  success: function(r){ 
                    console.log(r);
                  }
           });
    }

   

    function update_user_prev(user){
        $.ajax ({
                url: "web/databaseApi.php",
                type: "GET",
                data: {"type":"LOGOUT_PREV_USER", "userID":user},
                dataType: "json",
                crossDomain: true,
                cache: false,            
                  success: function(r){ 
                    console.log(r);
                  }
           });
    }
    function saveOTP(number, OTP){
      //var OTP = 100000 + Math.floor(Math.random() * 900000);
        $.ajax ({
                url: "web/databaseApi.php",
                type: "GET",
                data: {"type":"insertOTP", "OTP":OTP, "number":number},
                dataType: "html",
                crossDomain: true,
                cache: false,            
                  success: function(r){ 
                    if(r == 1){
                      //console.log('OTP textted to: '+ number +' OTP: ' + OTP);
                    }
                  }
           });
    }

    function etextMoSend(number, OTP){
      
      $.ajax ({
            url: "https://www.itexmo.com/php_api/api.php",
            type: "POST",
            data: {
                   "1" : number,
                   "2" : "Welcome to MYBUDDY approval module! Your One Time Pin (OTP) is: " + OTP,
                   "3" : "DE-FASTD139785_N8FG8",
                   "5" : "HIGH" 
                  },
            crossDomain: true,
            cache: false,            
            success: function(r){ 
                console.log('Etextmo res: ' + r);
              }
       });
    }

    function etextMo_sendlogs(){
      var message = 'Your MYBUDDY account have logged in on: ' + getCurrentDate() + '\n'+
                    'Device: ' + usersrv.devicename + '\n' +
                    'OS: ' + usersrv.os + '\n' +
                    'Browser: ' + usersrv.browser + '\n' +
                    'IP: ' + usersrv.ip + '\n\n\n' +
                    'Please report to NPI Support if you do not recognize this activity. Thank you and have a nice day!';

      $.ajax ({
            url: "https://www.itexmo.com/php_api/api.php",
            type: "POST",
            data: {
                   "1" : numberGlobalHolder,
                   "2" : message,
                   "3" : "DE-FASTD139785_N8FG8",
                   "5" : "HIGH" 
                  },
            crossDomain: true,
            cache: false
       });
    }

function getCurrentDate(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  return today;

}


function determineUserType(usertype){
    if(usertype != 'WEB'){
        $('.maintenanceCont').hide();
        $(".logoMd").attr("src","img/mdguestlogo.png");
    }
}



function connect(){
    var server = $('#servername').val();
    var password = $('#serverpassword').val();
    var username = $('#serverusername').val();
    var db = $('#serverdb').val();
    $('#serverBtn').html('Please wait....');
    $('#serverBtn').html("<i class='fa fa-spin fa-spinner'></i> Please wait..");
    $('#serverBtn').prop('disabled', true);
    $.ajax ({
      url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {
                "server":server,
                "username": username,
                "password": password,
                "database": db
              },
        dataType: "json",
        crossDomain: true,
        cache: false,            
          success: function(r){
            if(r.outcome){

              var encryptedS =  CryptoJS.AES.encrypt(server,"/");
                              var encryptedU =  CryptoJS.AES.encrypt(username,"/");
                              var encryptedP =  CryptoJS.AES.encrypt(password,"/");
              var encryptedD =  CryptoJS.AES.encrypt(db,"/");
              
              localStorage.setItem('srvr', encryptedS);
              localStorage.setItem('usrnm', encryptedU);
              localStorage.setItem('psswrd', encryptedP);
              localStorage.setItem('dtbse', encryptedD);

              var s = (CryptoJS.AES.decrypt(localStorage.getItem("srvr"),"/")).toString(CryptoJS.enc.Utf8);
              var u = (CryptoJS.AES.decrypt(localStorage.getItem("usrnm"),"/")).toString(CryptoJS.enc.Utf8);
              var p = (CryptoJS.AES.decrypt(localStorage.getItem("psswrd"),"/")).toString(CryptoJS.enc.Utf8);
              var d = (CryptoJS.AES.decrypt(localStorage.getItem("dtbse"),"/")).toString(CryptoJS.enc.Utf8);

              console.log(s +' '+ u +' '+ p +' '+ d);
                 alert('CONNECTION SUCCESSFULL!');
              window.location.href= "https://ravamate.com/SFA/Dashboard";
            }else{
                alert('DID NOT CONNECT TO SERVER!');
            }

             $('#serverBtn').html('Connect');
                   $('#serverBtn').prop('disabled', false);
          }
      });
  }

  function textCon(){
    var s = $('#stobeupdt').val();
    var d = $('#dtobeupdt').val();
    var u = $('#utobeupdt').val();
    var p = $('#ptobeupdt').val();
    
    $('#testBtn').html('Please wait....');
    $('#testBtn').html("<i class='fa fa-spin fa-spinner'></i> Connecting to " + s + "...");
    $('#testBtn').prop('disabled', true);
    $.ajax ({
      url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {
                "server":s,
                "username": u,
                "password": p,
                "database": d
              },
        dataType: "json",
        crossDomain: true,
        cache: false,            
          success: function(r){
            if(r.outcome){
            //    $.alert({
            //         title: 'SUCCESS!',
            //         theme: 'material',
            //         content: 'Connected Successfully!',
            //         icon: 'fas fa-thumbs-up',
            //     type: 'green'
            //     });
                alert('SUCCESS!\nConnected Successfully!');
            }else{
                alert('CONNECTION FAILED!\nUnable to establish a connection to server.');
            //   $.alert({
            //         title: 'CONNECTION FAILED!',
            //         theme: 'material',
            //         content: 'Unable to establish a connection to server.',
            //         icon: 'fas fa-thumbs-down',
            //     type: 'red'
            //     });
            }

             $('#testBtn').html('Test Connection');
             $('#testBtn').prop('disabled', false);
          }
      });
  }


  function confirmUpdate(){

              var s = $('#stobeupdt').val();
              var d = $('#dtobeupdt').val();
              var u = $('#utobeupdt').val();
              var p = $('#ptobeupdt').val();
                 $.ajax ({
                    url: GLOBALLINKAPI+ "/nestle/testconnection.php",
                    type: "GET",
                    data: {
                            "server":s,
                            "username": u,
                            "password": p,
                            "database": d
                          },
                    dataType: "json",
                    crossDomain: true,
                    cache: false,            
                      success: function(r){
                        if(r.outcome){
                          localStorage.removeItem("srvr");
                          localStorage.removeItem("usrnm");
                          localStorage.removeItem("psswrd");
                          localStorage.removeItem("dtbse");

                          localStorage.removeItem('adminUserName');
                          localStorage.removeItem("username"); 
                          localStorage.removeItem("usertype"); 
                          localStorage.removeItem("latitude");
                          localStorage.removeItem("longitude"); 
                          localStorage.removeItem("mapzoom"); 
                          localStorage.removeItem("newlycreated");

                          var encryptedS =  CryptoJS.AES.encrypt(s,"/");
                          var encryptedU =  CryptoJS.AES.encrypt(u,"/");
                          var encryptedP =  CryptoJS.AES.encrypt(p,"/");
                          var encryptedD =  CryptoJS.AES.encrypt(d,"/");

                          localStorage.setItem("srvr", encryptedS);
                          localStorage.setItem("usrnm", encryptedU);
                          localStorage.setItem("psswrd", encryptedP);
                          localStorage.setItem("dtbse", encryptedD);
                      
                            alert('SUCCESS!\nServer settings successfully updated.');
                            location.reload();
                        //   $.alert({
                        //       title: 'SUCCESS!',
                        //       theme: 'material',
                        //       content: 'Server settings successfully updated.',
                        //       icon: 'fas fa-thumbs-up',
                        //        type: 'green'
                        //   });
                         }else{
                        //       $.alert({
                        //       title: 'UNABLE TO UPDATE!',
                        //       theme: 'material',
                        //       content: 'You are trying to connect to a server that did not establish a connection properly.',
                        //       icon: 'fas fa-thumbs-down',
                        //        type: 'red'
                        //   });
                            alert('UNABLE TO UPDATE!!\nYou are trying to connect to a server that did not establish a connection properly.');
                        }
                      }
                  });
  }


  (function($) {
    $.fn.inputFilter = function(callback, errMsg) {
      return this.on("input keydown keyup mousedown mouseup select contextmenu drop focusout", function(e) {
        if (callback(this.value)) {
          // Accepted value
          if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
            $(this).removeClass("input-error");
            this.setCustomValidity("");
          }
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          // Rejected value - restore the previous one
          $(this).addClass("input-error");
          this.setCustomValidity(errMsg);
          this.reportValidity();
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          // Rejected value - nothing to restore
          this.value = "";
        }
      });
    };
  }(jQuery));
  
   
  $(".numberOnly").inputFilter(function(value) {
    return /^\d*$/.test(value);    // Allow digits only, using a RegExp
  },"Only digits allowed");