var userType = localStorage.getItem("usertype");
var checker = localStorage.getItem("srvr");
var con_info = [s, p, u, d];
var firstElemt;

if(checker == null || checker == 'null'){
    console.log('wsd');
}else{
    var s = (CryptoJS.AES.decrypt(localStorage.getItem("srvr"),"/")).toString(CryptoJS.enc.Utf8);
    var u = (CryptoJS.AES.decrypt(localStorage.getItem("usrnm"),"/")).toString(CryptoJS.enc.Utf8);
    var p = (CryptoJS.AES.decrypt(localStorage.getItem("psswrd"),"/")).toString(CryptoJS.enc.Utf8);
    var d = (CryptoJS.AES.decrypt(localStorage.getItem("dtbse"),"/")).toString(CryptoJS.enc.Utf8);
}

userInfo();
// getcompname();
getcompname_dynamic("", "ucompany");
getpatchlist();

/*if(s == 'undefined' || s == '' || s == undefined || s == null){
    localStorage.removeItem('adminUserName');
    localStorage.removeItem("username"); 
    localStorage.removeItem("usertype"); 
    localStorage.removeItem("latitude");
    localStorage.removeItem("longitude"); 
    localStorage.removeItem("mapzoom"); 
    localStorage.removeItem("newlycreated");
    window.location.href = 'https://mybuddy.dynns.com';
}*/

if(userType == 'WEB_GUEST'){
    $('.patchHolder').hide();
}

$('.texthelp').hide();

// $('#server').html(s);
$('#server').val(btoa('Marvin')).show();
// $('#db').html(d);
$('#db').val(btoa('The '));
// $('#username').html(u);
$('#username').val(btoa('Dev'));
$('#pass').val(btoa('Gwapo'));

$('#btnupdate').click(function (){
    $('#updateServerMOdal').modal('show');
    $('#stobeupdt').val(s);
    $('#dtobeupdt').val(d);
    $('#utobeupdt').val(u);
    $('#ptobeupdt').val(p);
});
		
function userSettings(){
    $('#updateUserModal').modal('show');
}

function updateUser(){
    var userID = localStorage.getItem("user_id");
    var c = confirm('Are you sure you want to updated your information?');
    if(c){
        var fullname = $('#fullnameupdt').val();
        var contno = $('#contactnoupdt').val();
        var email = $('#emailupdt').val();
        $.ajax ({
            url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi_mnc.php",
            type: "GET",
            data: {
                "type":"UPDATE_USER_INFO",
                "fullname":fullname,
                "contno":contno,
                "email":email,
                "id":userID
            },
            dataType: "json",
            crossDomain: true,
            cache: false,            
                success: function(r){ 
                    if(r){
                        userInfo();
                        alert('User successfully updated!');
                    }
                }
        });
    }
}

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('.ucompany').html(r[0].company.toUpperCase());
        }
    });
}  
	
function userInfo(){
    var userID = localStorage.getItem("user_id");
    $.ajax ({
        url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi_mnc.php",
        type: "GET",
        data: {"type":"GET_USER_INFO_BY_ID", "userID": userID},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){
            var accHolder = '';
            if(r[0].AUSERTYPE == 'WEB'){
                accHolder = 'ADMIN';
            }else 
                accHolder = 'GUEST';

            $('#ufname').html(r[0].AFULLNAME);
            $('#ucontno').html(r[0].ACONTACTNO);
            $('#uemail').html(r[0].AEMAIL);
            $('#uacctype').html(accHolder);

            $('#fullnameupdt').val(r[0].AFULLNAME);
            $('#contactnoupdt').val(r[0].ACONTACTNO);
            $('#emailupdt').val(r[0].AEMAIL);
            $('#accountTypeupdt').val(accHolder);
            //$('#userpass').val(r[0].APASSWORD);
        }
    });
} 

function confirmUpdate(){
    $.confirm({
        title: 'Confirm Action',
        theme: 'modern',
        icon: 'fas fa-question',
        content: 'You will be logout after this action, would you like to continue?',
        type: 'blue',
        typeAnimated: true,
        columnClass: 'medium',
        buttons: {
            confirm: {
                text: 'Proceed',
                btnClass: 'btn-primary',
                action: function () {
                var s = $('#stobeupdt').val();
                var d = $('#dtobeupdt').val();
                var u = $('#utobeupdt').val();
                var p = $('#ptobeupdt').val();
                    $.ajax ({
                        url: GLOBALLINKAPI+"/nestle/testconnection.php",
                        type: "POST",
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
                        
                            
                            $.alert({
                                title: 'SUCCESS!',
                                theme: 'material',
                                content: 'Server settings successfully updated.',
                                icon: 'fas fa-thumbs-up',
                                type: 'green'
                            });
                            updateOfflineStat();
                            }else{
                                $.alert({
                                title: 'UNABLE TO UPDATE!',
                                theme: 'material',
                                content: 'You are trying to connect to a server that did not establish a connection properly.',
                                icon: 'fas fa-thumbs-down',
                                type: 'red'
                            });
                            }
                        }
                    });
                    }
            },
            cancel: function () {
                $('#updateServerMOdal').modal('hide');
            },
        }
    });
}
	
function updateOfflineStat(){
    var userID = localStorage.getItem("user_id"); 
    // $.ajax({
    // 	url: "https://mybuddy-sfa.com/web/databaseApi.php",
    // 	type: "GET",
    // 	data: {
    // 			"type":"updateOfflineStat",
    // 			"username": userID
    // 		},
    // 	dataType: "json",
    // 	crossDomain: true,
    // 	cache: false,            
    // 	async: false,
    // 	success: function(r){ 
            window.location.href = "dataMaintenance";
        // }
        // });
}

function getpatchlist(){
    console.log('getpatchlist');
    $('#patchTbody').html('<i class="fa fa-spin fa-spinner"></i> reloading...');
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"PATCHLIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            var cont = '';
            if(r.length == 0){
                cont = '<tr><td colspan="4" class="text-info">NO PATCH TO INSTALL AS OF NOW.</td></tr>';
            }else{
                firstElemt = r[0].patchLevel;
                for(var x = 0; x < r.length; x++){
                cont += '<tr>'+
                                    '<td>'+r[x].patchLevel+'</td>'+
                                    '<td>'+r[x].PLNotes+'</td>'+
                                    '<td>'+r[x].PLDate+'</td>'+
                                    //'<td><i class="fas fa-times text-danger"></i> not installed</td>'+
                                    '<td><button class="btn btn-primary btn-sm" id='+r[x].patchLevel+' onclick="installPL(\''+r[x].patchLevel+'\')">INSTALL</button></td>'+
                                    // '<td><button class="btn btn-danger btn-sm"  onclick="overrideins(\''+r[x].patchLevel+'\')">OVERRIDE</button></td>'+
                                '</tr>';
                }
            }
            $('#patchTbody').html(cont);
        }
    });
} 
	
function installPL(patchID){
    var plDelimeter = patchID.substring(7, 9);
    //console.log(plDelimeter);
    if(firstElemt == patchID){
        var c = confirm('Are you sure you want to install this patch?');
        if(c){
            var btn = '#'+patchID;
            $(btn).html('<i class="fa fa-spin fa-spinner"></i> installing...');
            $(btn).attr("disabled", true);
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {"type":"INSTALL_PATCH", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "patchID":patchID},
                dataType: "json",
                crossDomain: true,
                cache: false,            
                    success: function(r){
                        alert('Patch was successfully installed!'); 
                        getpatchlist();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert('UNABLE TO INSTALL PATCH \n REASON: ' + XMLHttpRequest.responseText);
                        $(btn).html('INSTALL');
                        $(btn).attr("disabled", false);
                    }
            }).done(function () {
                    $(btn).html('INSTALL');
                    $(btn).attr("disabled", false); 
            });
        }
    }else{
        alert('SERVER WARNING:\n\nPlease install patch '+firstElemt+' in order to proceed and to prevent server errors.');
    }
    
}

function overrideins(patchID){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"OVERRIDE_PATCH", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "patchID":patchID},
        dataType: "json",
        crossDomain: true,
        cache: false,            
            success: function(r){
                alert('Patch was successfully override installed!'); 
                location.reload();
            }
    });
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
        url: GLOBALLINKAPI+"/nestle/testconnection.php",
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
            window.location.href= "https://mybuddy-sfa.com/SFA/Dashboard";
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
        url: GLOBALLINKAPI+"/nestle/testconnection.php",
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
                $.alert({
                    title: 'SUCCESS!',
                    theme: 'material',
                    content: 'Connected Successfully!',
                    icon: 'fas fa-thumbs-up',
                type: 'green'
                });
            }else{
            $.alert({
                    title: 'CONNECTION FAILED!',
                    theme: 'material',
                    content: 'Unable to establish a connection to server.',
                    icon: 'fas fa-thumbs-down',
                type: 'red'
                });
            }

            $('#testBtn').html('Test Connection');
            $('#testBtn').prop('disabled', false);
        }
    });
}