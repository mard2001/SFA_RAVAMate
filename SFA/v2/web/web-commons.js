var ipadd = "https://wonderful-sammet.207-148-112-51.plesk.page/indexOTP"; 
var url ="https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php";
var urltrack = "/tracking/TrackingAPI.php";
var urlgeofence = "/web/GeofencingAPI.php";
var urlgeofence = "http://" + ipadd + "/geofencing/GeofencingAPI.php"; 


var url = localStorage.getItem("remote-url");

//dont allow appv to view this module
checkappreq();
function checkappreq(){
  var checker = localStorage.getItem("pndingrqAccID");
  if(checker == null || checker == undefined || checker == ''){
    console.log('allowedusr');
  }else{
    alert('You are not allowed to view this module.');
    location.href = 'https://wonderful-sammet.207-148-112-51.plesk.page/SFA/pendingRequest';
  }
}

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
                    updateOfflineStat();  
                    window.location = "https://wonderful-sammet.207-148-112-51.plesk.page";
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
              window.location = "https://wonderful-sammet.207-148-112-51.plesk.page";
            }      
          }
      });
});

/*$(document).keypress(function(e) {
  var checker = window.location.href;
  var ipCheck = 'https://wonderful-sammet.207-148-112-51.plesk.page/';
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
        url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
        type: "GET",
        data: {
                "type":"get_user_macAddress"
              },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(r){
          usersrv = r;

        }
      });
    }

    function checkuser_gtmtype(){
      var userID = localStorage.getItem('user_id');
      $.ajax ({
          url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
              window.location.href = "Dashboard";
            }
              
          }
        });
      }

 function saveLoginData(usernm){
     $.ajax({
         url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
     url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
            url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
            url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
                "type":"getCompanyLocation",
                "distCode": GBL_DISTCODE
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
    
    var userID;
    function LOGIN_VIA_NUMBER(number, otp){
     var site_status_ifnew = localStorage.getItem('srvr');
     console.log(site_status_ifnew);
      $.ajax ({
                url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
                type: "GET",
                data: {"type":"LOGIN_VIA_NUMBER", "number":number, "OTP":otp},
                dataType: "json",
                crossDomain: true,
                cache: false, 
                async:false,           
                  success: function(data){ 
                    var dialog = bootbox.dialog({
                        message: '<p class="loadingText"><i class="fa fa-spin fa-spinner"></i> Connection established, waiting for welcome message...</p>',
                        backdrop: true
                     });

                  userID = data[0].AUSERID;
                  //var usercheker = select_status_checker(data[0].AUSERID);
                  localStorage.setItem("user_id", data[0].AUSERID);
                  
                 if(data != 1){
                    if(data[0].AISONLINE == '1'){
                            bootbox.confirm({
                      message: "<h5 class='text-warning font-weight-bold'><i class='fas fa-exclamation-circle'></i> UNABLE TO LOGIN</h5><p>Your account is being used on another device. You may close the previous session to continue.</p>",
                      backdrop: true,
                      buttons: {
                          confirm: {
                              label: 'FORCE LOGIN',
                              className: 'btn-primary',
                          },
                          cancel: {
                              label: 'CANCEL',
                              className: 'btn-default'
                          }
                      },
                      callback: function (result) {
                          var checker = result;
                         if(checker == true){
                          dialog.modal('show');
                           //update_user_prev(data[0].AUSERID);
                           saveLoginData(userID);
                           if(data[0].AUSERTYPE == 'WEB'){
                                var sitename =  data[0].sitename.toLowerCase();
                                var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY " + data[0].AFULLNAME+ "!</p>"; 
                                localStorage.setItem("REGULARUSER", '1');
                                localStorage.setItem("adminUserName", sitename);
                                localStorage.setItem("username", data[0].AUSERNAME);
                                localStorage.setItem("usertype", data[0].AUSERTYPE); 
                                localStorage.setItem("latitude", data[0].latitude);
                                localStorage.setItem("longitude", data[0].longitude); 
                                localStorage.setItem("mapzoom", data[0].mapZoom);
                                localStorage.setItem("newlycreated", data[0].site_status_ifnew);
                                
                                dialog.init(function(){
                                    setTimeout(function(){
                                        dialog.find('.bootbox-body').html(notif);
                                    },1000);
                                  });
                                
                                etextMo_sendlogs();

                                 setTimeout(function() {
                                     window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/SFA/Dashboard";
                                 }, 2000);
                           }else if(data[0].AUSERTYPE == 'WEB_ADMIN'){
                                  var sitename =  data[0].sitename.toLowerCase();
                                  var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY admin " +data[0].AFULLNAME + " !</p>"; 
                                  
                                  localStorage.setItem("admin_username", data[0].AUSERNAME);

                                   dialog.init(function(){
                                      setTimeout(function(){
                                          dialog.find('.bootbox-body').html(notif);
                                      },1000);
                                    });

                                   etextMo_sendlogs();
                                  
                                   setTimeout(function() {
                                          window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/admin/managemdaccounts";
                                   }, 2000);
                           }else if(data[0].AUSERTYPE == 'WEB_GUEST'){
                                  var sitename =  data[0].sitename.toLowerCase();
                                  var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY guest " + data[0].AFULLNAME + " !</p>"; 
                                  localStorage.setItem("REGULARUSER", '1');
                                  localStorage.setItem("adminUserName", sitename);
                                  localStorage.setItem("username", data[0].AUSERNAME);
                                  localStorage.setItem("usertype", data[0].AUSERTYPE); 
                                  localStorage.setItem("latitude", data[0].latitude);
                                  localStorage.setItem("longitude", data[0].longitude); 
                                  localStorage.setItem("mapzoom", data[0].mapZoom);
                                  
                                  etextMo_sendlogs();
                                  
                                  dialog.init(function(){
                                      setTimeout(function(){
                                          dialog.find('.bootbox-body').html(notif);
                                      },1000);
                                  });

                                   setTimeout(function() {
                                          window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/SFA/Dashboard";
                                   }, 2000);
                           }else if(data[0].AUSERTYPE == 'NPI_ADMIN'){
                                  var sitename =  data[0].sitename.toLowerCase();
                                  var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY admin " + data[0].AFULLNAME + " !</p>"; 
                                  
                                  localStorage.setItem("admin_username", data[0].AUSERNAME);

                                   dialog.init(function(){
                                      setTimeout(function(){
                                          dialog.find('.bootbox-body').html(notif);
                                      },1000);
                                    });

                                   setTimeout(function() {
                                          window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/admin";
                                   }, 2000);
                           }
                         }

                                 dialog.modal('hide');
                              }
                          });
                    }else{
                      /*if(site_status_ifnew == null){
                      console.log(site_status_ifnew);
                      bootbox.confirm({
                      message: "<h5 class='text-info font-weight-bold'><i class='fas fa-exclamation-circle'></i> WELCOME TO MYBUDDY</h5><p>Your MYBUDDY site account is newly created, we just need to set a few things up!</p>",
                      backdrop: true,
                      buttons: {
                          confirm: {
                              label: 'SET UP',
                              className: 'btn-primary',
                          }
                      },
                      callback: function (result) {
                          if(result){
                              window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/indexTryIP";
                          }
                          dialog.modal('hide');
                        }
                      });

                      }else{*/
                        if(data[0].ASTATUS == 'IN'){
                        var notif =  "<h5 class='text-warning font-weight-bold'>" + "<i class='fas fa-exclamation-circle'></i> ACCOUNT DISABLED</h5><p> Your account is currently disabled as of now. Please contact system administrator for more details." + "</p>";
                         dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html(notif);
                            },1000);
                          });
                          $("#admin-login-btn").prop('value', 'Login');
                          $('#admin-login-btn').prop('disabled', false);
                        }else{
                          saveLoginData(userID);
                          if(data[0].AUSERTYPE == 'WEB'){
                              var sitename =  data[0].sitename.toLowerCase();
                              var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY " + data[0].AFULLNAME+ "!</p>"; 
                              console.log(sitename);
                              localStorage.setItem("REGULARUSER", '1');
                              localStorage.setItem("adminUserName", sitename);
                              localStorage.setItem("username", data[0].AUSERNAME);
                              localStorage.setItem("usertype", data[0].AUSERTYPE); 
                              localStorage.setItem("latitude", data[0].latitude);
                              localStorage.setItem("longitude", data[0].longitude); 
                              localStorage.setItem("mapzoom", data[0].mapZoom);
                              localStorage.setItem("newlycreated", data[0].site_status_ifnew);

                              dialog.init(function(){
                                  setTimeout(function(){
                                      dialog.find('.bootbox-body').html(notif);
                                  },1000);
                                });
                              
                              etextMo_sendlogs();
                              setTimeout(function() {
                                  window.location.replace("https://wonderful-sammet.207-148-112-51.plesk.page/SFA/Dashboard");
                               }, 2000);          
                          }else if(data[0].AUSERTYPE == 'WEB_ADMIN'){
                              var sitename =  data[0].sitename.toLowerCase();
                              var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY admin " + data[0].AFULLNAME + " !</p>"; 
                              
                              localStorage.setItem("admin_username", data[0].AUSERNAME);

                               dialog.init(function(){
                                  setTimeout(function(){
                                      dialog.find('.bootbox-body').html(notif);
                                  },1000);
                                });

                               etextMo_sendlogs();

                               setTimeout(function() {
                                      window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/admin/managemdaccounts";
                               }, 2000);
                          }else if(data[0].AUSERTYPE == 'WEB_GUEST'){
                              var sitename =  data[0].sitename.toLowerCase();
                              var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY guest " + data[0].AFULLNAME + " !</p>"; 
                              localStorage.setItem("REGULARUSER", '1');
                              localStorage.setItem("adminUserName", sitename);
                              localStorage.setItem("username", data[0].AUSERNAME);
                              localStorage.setItem("usertype", data[0].AUSERTYPE); 
                              localStorage.setItem("latitude", data[0].latitude);
                              localStorage.setItem("longitude", data[0].longitude); 
                              localStorage.setItem("mapzoom", data[0].mapZoom);

                              etextMo_sendlogs();

                               dialog.init(function(){
                                  setTimeout(function(){
                                      dialog.find('.bootbox-body').html(notif);
                                  },1000);
                                });
                               setTimeout(function() {
                                      window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/SFA/Dashboard";
                               }, 2000);
                          }else if(data[0].AUSERTYPE == 'NPI_ADMIN'){
                              var sitename =  data[0].sitename.toLowerCase();
                              var notif = "<h5 class='text-success font-weight-bold'><i class='far fa-check-circle'></i> User Verified:</h5><p>Welcome to MYBUDDY admin " + data[0].AFULLNAME + " !</p>"; 
                              
                              localStorage.setItem("admin_username", data[0].AUSERNAME);

                               dialog.init(function(){
                                  setTimeout(function(){
                                      dialog.find('.bootbox-body').html(notif);
                                  },1000);
                                });
                               etextMo_sendlogs();
                               setTimeout(function() {
                                      window.location.href = "https://wonderful-sammet.207-148-112-51.plesk.page/admin";
                               }, 2000);
                          }
                        }
                      }
                       
                    //}
                  //save user weblogs
                 }else{
                     var notif =  "<h5 class='text-danger font-weight-bold'>" + "<i class='far fa-times-circle'></i> Invalid Credentials:</h5><p> Please check your username or password then try again." + "</p>";
                     dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html(notif);
                        },1000);
                      });
                }
                
                  }
           });
    }

    
    function sessionUsage(username){
       $.ajax ({
                url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
                url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
                url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
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
                   "2" : "Welcome to MYBUDDY! Your One Time Pin (OTP) is: " + OTP,
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

    /*$(document).keypress(function(e) {
      var checker = window.location.href;
      var ipCheck = 'https://wonderful-sammet.207-148-112-51.plesk.page/';
        if(checker == ipCheck && e.which == 13) {
          checknumber();
        }
    });*/

    function siteLocSetting(){
      localStorage.setItem('p_lat', sitelat);
      localStorage.setItem('p_lng', sitelng);
      localStorage.setItem('p_center', sitezoom);
      window.location = "https://wonderful-sammet.207-148-112-51.plesk.page/admin/setUpDistributor";
    }

    var latglobal, longglobal;
    function initMap() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            latglobal = pos.lat;
            longglobal = pos.lng;

          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        }else {
            alert('unable to find location');
        }
      }

