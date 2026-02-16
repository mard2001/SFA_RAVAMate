var usernm = localStorage.getItem("adminUserName");
var user = localStorage.getItem("adminUserName");
    
$('#userConnection').val(user);
  
getcompname_dynamic("Georeset", "titleHeading");
// getcompname();
function getcompname(){
    console.log("TEST")
    $.ajax ({
        // url: "https://fastdevs-api.com/BUDDYGBLAPI/nestle/connectionString/applicationipAPI.php",
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() + ' | Georeset ');
        }
    });
} 

$("#dayList").val($("#target option:first").val());

function geoResetSalesman(){
    var mdCode = $('#salesmanList').val();
    var mcpDay = $('#dayList').val();

    var ajaxTime= new Date().getTime();
    var totalTime= 0;

    console.log(mdCode +' '+ mcpDay);

    if(mdCode == null){
        alert('Salesman is required!');
    }else if(mcpDay == null){
        alert('mcpDay is required!');
    }else{
        var r = confirm("Are you sure you want to reset all location of this salesman ?");
        if (r == true) {
            $('#generateBtn_salesman').html("<i class='fa fa-spin fa-spinner'></i> processing..");
            $('#generateBtn_salesman').prop('disabled', true);
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {"type":"geoResetSalesman", "mdCode":mdCode, "mcpDay":mcpDay, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
                dataType: "JSON",
                crossDomain: true,
                cache: false,            
                success: function(response){ 
                    if(response == 1){
                        pushnotif(mcpDay, mdCode);
                        alert('Salesman '+mdCode+' georeset was sucessfull!');
                    }else{
                        alert('ERROR: '+response+' Please contact HO IT for more assistance!');
                    }
                }
            }).done(function () {
                setTimeout(function(){
                    $('#generateBtn_salesman').html("RESET");
                    $('#generateBtn_salesman').prop('disabled', false);
                }, totalTime);
            });
        } else {
            alert('Georeset was cancelled!');
        } 
    }//main else
}

function geoResetCustomer(){
    var custCode = $('#customerCode').val();

    var ajaxTime= new Date().getTime();
    var totalTime= 0;

    if(custCode != ''){
        Swal.fire({
            html: "Are you sure you want to reset customer "+custCode+" ?",
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes, Reset",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                $('#byCustomerBtn').html("<i class='fa fa-spin fa-spinner'></i> processing..");
                $('#byCustomerBtn').prop('disabled', true);
                setTimeout(() => {
                    $.ajax ({
                        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                        type: "POST",
                        data: {"type":"geoResetCustomer", "custCode":custCode, "distCode": GBL_DISTCODE, "userID": GBL_USERID,},
                        dataType: "text",
                        crossDomain: true,
                        cache: false,           
                        success: function(response){ 
                            console.log(response);
                            if(response != 0 && response != 1){
                                Swal.fire({
                                    html: 'ERROR OCCUR: ' + response + ' please contact FDC IT for this matter.',
                                    icon: "info"
                                });
                            }else{
                                if(response == 0){
                                    pushnotif_customer(custCode);
                                    Swal.fire({
                                        html: 'Customer '+custCode+' georeset was sucessfull!',
                                        icon: "success"
                                    });
                                }else if(response == 1){
                                    Swal.fire({
                                        html: 'Invalid Customer code please try again!',
                                        icon: "error"
                                    });
                                }
                            }
                        }
                    }).done(function () {
                        setTimeout(function(){
                            $('#byCustomerBtn').html("Reset");
                            $('#byCustomerBtn').prop('disabled', false);
                        }, totalTime);
                    });
                }, 1000);
            } else{
                $('#byCustomerBtn').html("Reset");
                $('#byCustomerBtn').prop('disabled', false);
            }
        });
    }else{
        Swal.fire({
            text: "Customer code is required!",
            icon: "info"
        });
    }
}

function pushnotif(day, mdCode){
    var token = getToken(mdCode);
    var message = '', header = '';
    if(day == 0){
        header = 'Georeset All!';
        message = 'Georeset was successfull, all MCP days was affected.';
    }else{
        header = 'Georeset Day '+day;
        message = 'Georeset was successfull for day: ' + day;
    }

    $.ajax({        
        type : 'POST',
        url : "https://fcm.googleapis.com/fcm/send",
        headers : {
            Authorization : 'key=' + 
            'AAAA4OmJn2o:APA91bGBe9aHcLoJxAkkJbwN9ozac6St2BimIOVtWtb7dv-GV50v2S5-vIQzS_bZfxgl9385wyBeW4qA2GOR-BfnBV63mOHFDKMEfgZn9PNM-EAbvBtKFPEYszCLZ0OxZZPPvjyfqQMD'
            //sir roy api 'AAAA6gFzY08:APA91bGhXSORj4yKI5GDwvYIsIRCqJJn2UwO7dz_l5ZFjGmUsMj2-zpOu9R1RA7QSh0ECQ_zRibaoDLv1Z5fzk3LXqqUuaKlKJ_18ba822I4iHpgVtjSdMGdLaB37IPoGt2zFmx9Kmfy'
        },
        contentType : 'application/json',
        dataType: 'json',
        data: JSON.stringify({"to": token,
            "data": {
                "title": header,
                "body": message
            }
        }),
        //change "to" parameter located in tblUser column TOKEN
        success : function(response) {
            console.log(response);
        },
        error : function(xhr, status, error) {
            console.log(xhr.error);                   
        }
    });
}

function pushnotif_customer(custCode){
    var serviceToken = getServiceToken();
    var mdCode = getMdCode(custCode);
    var token = getToken(mdCode);
    // var token = "f6Cmd1-lQxiZIrSmkdmrVG:APA91bF2eMbG45YB2yzpaiTbWAIGCjvExp2CKu__Zj3ZaXpPFQ-C7Cj8oKqAGdYIudHT6vUp7yJDRLldIKze5baaaBhNL4Va9DylI2wX313YxV379Rqz72I";

    $.ajax({        
        type : 'POST',
        url : "https://fcm.googleapis.com/v1/projects/ravamate/messages:send",
        headers : {
            'Authorization': 'Bearer '+serviceToken
        },
        contentType : 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            'message':{ 
                "token": token,
                "data": {
                    "title":"Georeset Store " + custCode,
                    "body":"Georeset was successfull on store "+ custCode,
                    "custCode": custCode,
                }
            }
        }),
        //change "to" parameter located in tblUser column TOKEN
        success : function(response) {
            console.log(response);
        },
        error : function(xhr, status, error) {
            console.log(xhr.error);                   
        }
    });
}

function getServiceToken(){
    var token = '';
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"GET_ACCESS_TOKEN",
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
            },
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false,         
            success: function(r){
                token = r;
            }
        });
    return token;
}

function getToken(mdCode){
    var token = '';
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"GET_USER_TOKEN",
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "mdCode":mdCode
            },
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false,         
            success: function(r){
                token = r;
            }
        });
    return token;
}

function getMdCode(custCode){
    var mdCode = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_USER_MDCODE",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "custCode":custCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,         
        success: function(r){
            mdCode = r;
        }
    });
    return mdCode;
}

// allSalesman();
function allSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"get_all_salesman_georeset", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){                  
            var data = JSON.parse(response);
            for(var x = 0; x<data.length; x++){
                $('#salesmanList').append('<option value="'+data[x].mdCode+'">'+data[x].mdSalesmancode+' '+data[x].Salesman+'</option>');
            }
            $('#salesmanList').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '300px',
                maxHeight: 300
             });
        }//success here;
    })
}

//allCustomer();
function allCustomer(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"CUSTOMER_LIST_GEORESET", "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){                  
            var data = JSON.parse(response);
            for(var x = 0; x<data.length; x++){
                $('#customerCode').append('<option value="'+data[x].custCode+'">'+data[x].custCode+' '+data[x].custName+'</option>');
            }
            $('#customerCode').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '300px',
                maxHeight: 300
            });
        }//success here;
    })
}