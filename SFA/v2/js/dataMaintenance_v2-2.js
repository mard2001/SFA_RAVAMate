var usernm = localStorage.getItem("username");
var user = localStorage.getItem("adminUserName");
var GLBLCIDHOLDER;
var GBLCOMPANYNAME = '';
var dssdate;
var priosychingData = '';
var GBLSELECTEDITEMS = [];

$('#userConnection').val(user);

$(window).on('beforeunload', function(){ 
    var e = confirm('Do you really want to close?');
    if(e){

        insertsyncLogs('testing');
    }
});

// checkuser_gtmtype();
Swal.fire({
    html: "Please Wait... Preparing Data...",
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => {
        Swal.showLoading();
        setTimeout(() => {
            getcompname_dynamic("", "titleHeading");
            getcompname();
            //dsspicker();
            //loadSalesman();
            ercsoloadSalesman();
            // getProductList();
            //loadActiveBTDTDrivers();
            getercpendingrec();
        }, 400);
    },
});


function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase());
            GLBLCIDHOLDER = r[0].DIST_CD;
            GBLCOMPANYNAME = r[0].DIST_INDI;
        }
    });
} 

$('#navDrop').click(function() {
    $("i", this).toggleClass("glyphicon-menu-up glyphicon-menu-down");
});
  
$('#purgePass').val('').change();


function dsspicker(){
    $('.datestring').html('Pick a date here..');
    $('.dssdatePicker').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {
        dssdate = start.format('YYYY-MM-DD');
        var today = moment().format('YYYY-MM-DD');
        $('.datestring').html(dssdate);
    });

    $('#btdtspan').html('Pick a date here..');
    $('#btdtBookingDate').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {
        dssdate = start.format('YYYY-MM-DD');
        var today = moment().format('YYYY-MM-DD');
        $('#btdtspan').html(dssdate);
    });
}
  

function betasSync(){
    salesmansendingchecker();
    $('#syncBetaModal').modal('show');
}

VirtualSelect.init({
    ele: '#salesmanList',
});

VirtualSelect.init({
    ele: '#salesmanList_beta',
});

VirtualSelect.init({
    ele: '#salesmanList_stk',
});

VirtualSelect.init({
    ele: '#btdtdrvierList',
});

VirtualSelect.init({
    ele: '#salesmanList_soeric',
});

function loadSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"dsr_salesmanLoad", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            // for(var x = 0; x<data.length; x++){
            //     $('#salesmanList').append('<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>');
            //     $('#salesmanList_beta').append('<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>');
            //     $('#salesmanList_stk').append('<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>');
            // }

            // $('#salesmanList').multiselect({
            //     numberDisplayed: 1,
            //     enableCaseInsensitiveFiltering: true,
            //     includeSelectAllOption: true,
            //     selectAllNumber: true,
            //     buttonWidth: '300px',
            //     maxHeight: 300
            // });

            // $('#salesmanList_beta').multiselect({
            //     numberDisplayed: 1,
            //     enableCaseInsensitiveFiltering: true,
            //     includeSelectAllOption: true,
            //     selectAllNumber: true,
            //     buttonWidth: '300px',
            //     maxHeight: 300
            // });

            // $('#salesmanList_stk').multiselect({
            //     numberDisplayed: 1,
            //     enableCaseInsensitiveFiltering: true,
            //     includeSelectAllOption: true,
            //     selectAllNumber: true,
            //     buttonWidth: '300px',
            //     maxHeight: 300
            // });

            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }

            document.querySelector('#salesmanList').destroy();
            VirtualSelect.init({
                ele: '#salesmanList',
                options: myOptions,
                search: true,
                maxWidth: '400px', 
                placeholder: 'Select Salesman'
            });

            document.querySelector('#salesmanList_beta').destroy();
            VirtualSelect.init({
                ele: '#salesmanList_beta',
                options: myOptions,
                search: true,
                maxWidth: '400px', 
                placeholder: 'Select Salesman'
            });

            document.querySelector('#salesmanList_stk').destroy();
            VirtualSelect.init({
                ele: '#salesmanList_stk',
                options: myOptions,
                search: true,
                maxWidth: '400px', 
                placeholder: 'Select Salesman'
            });

            document.querySelector('#salesmanList_soeric').destroy();
            VirtualSelect.init({
                ele: '#salesmanList_soeric',
                options: myOptions,
                search: true,
                maxWidth: '400px', 
                placeholder: 'Select Salesman'
            });
        }
    });
}

function ercsoloadSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"ERIC_SO_SALESMANLIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 

            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }

            document.querySelector('#salesmanList_soeric').destroy();
            VirtualSelect.init({
                ele: '#salesmanList_soeric',
                options: myOptions,
                search: true,
                maxWidth: '400px', 
                placeholder: 'Select Salesman'
            });
        }
    });
}

function getProductList(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_ALL_PRODUCT_BTDT", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            for(var x = 0; x<data.length; x++){
                $('#btdtProductList').append('<option value="'+data[x].stockCode+'">'+data[x].stockCode+' - '+data[x].Description+'</option>');                  
            }

            $('#btdtProductList').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '300px',
                maxHeight: 300
            });
        }
    });
}

function loadPopup(){
    $.ajax ({
        url: "../geofencing/GeofencingAPI.php",
        type: "GET",
        data: {"type":"view_notifications_popUp"},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){              
            $(".content").html(response);
        }
    });
}

function showNotif(view=''){
    $.ajax ({
        url: "../geofencing/GeofencingAPI.php",
        type: "GET",
        data: {"type":"view_notifications_icon_"+user, "view":view},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
        success: function(response){          
            $("#notifs-icon-div").html(response.notification);
            if(response.unseen_notification > 0){
                $('.count').html(response.unseen_notification);
            }
        }
    });
}
      
function executeInventorySync(){
    $('#SyncInventoryModal').modal('show');
}

function executSyncSweeperTransaction(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing sweeper transaction please wait...</p>',
            backdrop: true
            // closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"SYNC_SWEEPER_TRANSACTION", "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>Sosyo sweeper transaction successfully sync. Thank You!</p>';
                }else{
                  botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Sosyo sweeper transaction!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Sosyo sweeper transaction!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}

function execAlignMCP(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Re-aligning sosyo mcp and customer assignment please wait...</p>',
            backdrop: true
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
            type: "POST",
                data: {
                    "type":"MCP_REALIGNMENT", 
                    "site":GLBLCIDHOLDER,
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE
                }, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>MCP realignment was successfull. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Re-align MCP!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Re-align MCP!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}

function execSyncBtdt(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing BTDT please wait...</p>',
            backdrop: true
            // closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();

        var btdtdriver = $('#btdtdrvierList').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
            type: "POST",
            data: {
                "type":"SYNC_BTDT_DATA",
                "btdtdrivermdCode":btdtdriver,
                "bookingDate":dssdate,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            }, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>Sync BTDT was successfull. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync BTDT data!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync BTDT data!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                      setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}
      
function invSync(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        insertsyncLogs('PRODUCT_PRICE_INV_SYNC');

        var mdCode = $('#salesmanList').val();
        var dialog = bootbox.dialog({
              message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing inventory please wait...</p>',
              backdrop: true
             // closeButton: false
            });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"SyncInventory", "mdCode":mdCode, "userID": GBL_USERID, "distCode": GBL_DISTCODE, "site":user}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>MyBuddy inventory Successfully updated. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Inventory!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Inventory!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}

function custSync(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        insertsyncLogs('CUSTOMER_SYNC');
        var dialog = bootbox.dialog({
           // title: '<h4 id="botboxT">Server Response</h4>',
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing customer please wait...</p>',
            backdrop: true
            //closeButton: false
        });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"SyncCustomer", "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
        dataType: 'json',     
        crossDomain: true,
        cache: false,   
        success: function(response){   
            if(response == 1){
                botboxMsg = '<b style="color: green;">Success!</b><p>MyBuddy customers Successfully updated. Thank You!</p>';
            }else{
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Customer!</b>' + response;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Customer!</b> Please try again. ' + XMLHttpRequest.responseText;
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });    
        });
    }
}

function custSync2(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        insertsyncLogs('CUSTOMER_SYNC');
        var dialog = bootbox.dialog({
            // title: '<h4 id="botboxT">Server Response</h4>',
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing customer please wait...</p>',
            backdrop: true
            //closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"SyncCustomer2", "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response == 1){
                    botboxMsg = '<b style="color: green;">Success!</b><p>Buddy customers Successfully updated. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Customer!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Customer!</b> Please try again. ' + XMLHttpRequest.responseText;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });    
        });
    }
}

function sync_saleman_image(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Converting salesman images please wait...</p>',
            backdrop: true
            // closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: "https://fastdevs-api.com/BUDDYGBLAPI/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {
                "type":"GET_SALESMAN_IMAGES_FOR_CONVERTION", 
                // "site":GLBLCIDHOLDER,
                "companyName":GBLCOMPANYNAME,
                "CONN":con_info
            }, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>Converting salesman images to .jpeg was successfull. Thank You!</p>';
                }else{
                  botboxMsg = '<b style="color: red;">Ops! Unable to convert salesman image!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to convert salesman image!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}

function executeQueingSync_beta(){
    var salesmanList = $('#salesmanList_beta').val();
    if(salesmanList == undefined || salesmanList == ''){
        alert('Please select a salesman');
    }else if(dssdate == ''){
        alert('Please select a date');
    }else{
        var r = confirm('This could take time, please wait while we process your request.');
        if(r){
            insertsyncLogs('QUEUING_SYNC');
            exec_salesman_sending_priority();

            var salesmanList = $('#salesmanList_beta').val();
            var dialog = bootbox.dialog({
                // title: '<h4 id="botboxT">Server Response</h4>',
                message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing SFA queues please wait...</p>',
                backdrop: true
                //closeButton: false
            });
            var message = 'Successfully Saved!';
            var botboxMsg = '';
            var ajaxTime= new Date().getTime();
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
                type: "POST",
                data: {
                    "type":"SYNC_SFA_QUEUING_BETA",
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE,
                    "date":dssdate,
                    "salesman":salesmanList
                }, 
                dataType: 'json',     
                crossDomain: true,
                cache: false,   
                success: function(response){   
                    if(response == 1){
                        botboxMsg = '<b style="color: green;">Success!</b><p>SFA Queuing successfully updated. Thank You!</p>';
                    }else{
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SFA Queuing!</b> ' + response;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SFA Queuing!</b> ' + XMLHttpRequest.responseText;
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                }   
            }).done(function () {
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            });
        }
    }
}

// function executeQueingSync_beta(){
//     var salesmanList = $('#salesmanList_beta').val();
//     if(salesmanList == undefined || salesmanList == ''){
//         alert('Please select a salesman');
//     }else if(dssdate == ''){
//         alert('Please select a date');
//     }else{
//         var r = confirm('This could take time, please wait while we process your request.');
//         if(r){
//             insertsyncLogs('QUEUING_SYNC');
//             exec_salesman_sending_priority();

//             var salesmanList = $('#salesmanList_beta').val();
//             var dialog = bootbox.dialog({
//                 // title: '<h4 id="botboxT">Server Response</h4>',
//                 message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing SFA queues please wait...</p>',
//                 backdrop: true
//                 //closeButton: false
//                 });
//             var message = 'Successfully Saved!';
//             var botboxMsg = '';
//             var ajaxTime= new Date().getTime();
//             $.ajax ({
//                 url: GLOBALLINKAPI+"/nestle/connectionString/POST_applicationApi.php",
//                 type: "POST",
//                 data: {
//                         "type":"SYNC_SFA_QUEUING_BETA",
//                         "CONN":con_info,
//                         "date":dssdate,
//                         "salesman":salesmanList
//                     }, 
//                 dataType: 'json',     
//                 crossDomain: true,
//                 cache: false,   
//                 success: function(response){   
//                     if(response == 1){
//                         botboxMsg = '<b style="color: green;">Success!</b><p>SFA Queuing successfully updated. Thank You!</p>';
//                     }else{
//                         botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SFA Queuing!</b>' + response;
//                     }
//                 },
//                 error: function(XMLHttpRequest, textStatus, errorThrown) {
//                     botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SFA Queuing!</b>' + XMLHttpRequest.responseText;
//                     dialog.init(function(){
//                         setTimeout(function(){
//                             dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
//                         }, 1000);
//                     });
//                 }
//             }).done(function () {
//                 dialog.init(function(){
//                     setTimeout(function(){
//                         dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
//                     }, 1000);
//                 }); 
//             });
//         }
//     }
// }

function goSyncinVoice(){
    $('#SyncInvoiceModal').modal('show');
}

function execSyncInvoiceIdeliver(){
    if(dssdate == null || dssdate == '' || dssdate == undefined){
        alert('Unable to Proceed:\nPlease select invoice date.');
    }else{
        var r = confirm('This could take time, please wait while we process your request.');
        if(r){
            console.log(dssdate);
            $('#SyncInvoiceModal').modal('hide');
            var dialog = bootbox.dialog({
                message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing Ideliver invoice please wait...</p>',
                backdrop: true
             // closeButton: false
            });
            var message = 'Successfully Saved!';
            var botboxMsg = '';
            var ajaxTime= new Date().getTime();
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/POST_applicationAPI.php",
                type: "POST",
                data: {"type":"SYNC_IDELIVER_INVOICE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "site":GLBLCIDHOLDER, 'dateselected':dssdate}, 
                dataType: 'json',     
                crossDomain: true,
                cache: false,   
                success: function(response){   
                    if(response){
                        botboxMsg = '<b style="color: green;">Success!</b><p>Ideliver invoice date '+dssdate+' was successfully sync. Thank You!</p>';
                    }else{
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Ideliver invoice!</b>' + response;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Ideliver invoice!</b>' + XMLHttpRequest.responseText;
                    var totalTime = new Date().getTime()-ajaxTime;
                    dialog.init(function(){
                        setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                }
            }).done(function () {
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            });
        }
    }
}

function executeQueingSync(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        insertsyncLogs('QUEUING_SYNC');
        var dialog = bootbox.dialog({
            // title: '<h4 id="botboxT">Server Response</h4>',
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing SFA queues please wait...</p>',
            backdrop: true
            //closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"SYNC_SFA_QUEUING", "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response == 1){
                    botboxMsg = '<b style="color: green;">Success!</b><p>SFA Queuing successfully updated. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync SFA QUEUING!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync SFA QUEUING!</b>' + XMLHttpRequest.responseText;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });           
        });
    }
}

function exec_view_stocktakeModal(){
    $('#syncStockRequestModal').modal('show');
}
    
function exec_stockTake(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        insertsyncLogs('STOCKREQUEST_SYNC');
        var salesmanList = $('#salesmanList_stk').val();
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing stock request please wait...</p>',
            backdrop: true
            // closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationAPI.php",
            type: "POST",
            data: {
                "type":"SYNC_STOCKTAKE",
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "date":dssdate,
                "salesman":salesmanList
            }, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>Sync Stock Request was Successful. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to sync Stock Request data!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to sync Stock Request data!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}

function execDatareplication(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        if(!$('#salesmanList').val()){
            alert('No Salesman Selected');
            return;
        }
        insertsyncLogs('DATA_DUPLICATION');
        var mdCode = $('#salesmanList').val();
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Data Replicating please wait...</p>',
            backdrop: true
            // closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"SYNC_DATA_REPLACATION", "mdCode":mdCode, "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>MyBuddy Data Replication was Successful. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to replacate data!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to replacate data!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
             }
        }).done(function () {
            dialog.init(function(){
                    setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}

function insertsyncLogs(description){
    var lockby = localStorage.getItem('user_id') +'-'+localStorage.getItem('fullname');
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"INSERT_SYNC_LOGS",
            "description":description,
            "isLock":'1',
            "lockby":lockby,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        }, 
        dataType: 'json',     
        crossDomain: true,
        cache: false,   
        success: function(r){   
            console.log(r);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            var botboxMsg = '<b style="color: red;">Ops! Unable to replacate data!</b>' + XMLHttpRequest.responseText;
            console.log(botboxMsg);
        }
    });
}
    

//delivery tagging
function goSyncDelTagging(){
    var r = confirm('This could take time, please wait while we process your request.');
    if(r){
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing Ideliver delivery tagging please wait...</p>',
            backdrop: true
        // closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"SYNC_IDELIVER_DELIVERY_TAGGING", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "site":GLBLCIDHOLDER}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,   
            success: function(response){   
                if(response){
                    botboxMsg = '<b style="color: green;">Success!</b><p>Ideliver delivery tagging data successfully sync. Thank You!</p>';
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Ideliver delivery tagging!</b>' + response;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync Ideliver delivery tagging!</b>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
    }
}

function openBtdtDrivermodal(){
    $('#syncbtdtDriverModal').modal('show');
}

// loadBTDTDrivers();
function loadBTDTDrivers(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"get_all_btdt_Drivers", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            // $('#btdtdrvierList').html('<option value="" selected disabled hidden>Choose here..</option>');
            // for(var x = 0; x<data.length; x++){
            //     $('#btdtdrvierList').append('<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>');
            // }

            // $('#btdtdrvierList').multiselect({
            //     numberDisplayed: 1,
            //     enableCaseInsensitiveFiltering: true,
            //     includeSelectAllOption: true,
            //     selectAllNumber: true,
            //     buttonWidth: '300px',
            //     maxHeight: 300
            // });
        }
    });
}

function loadActiveBTDTDrivers(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"get_all_active_btdt_Drivers", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            document.querySelector('#btdtdrvierList').destroy();
            console.log(data);
            var drivers = data;
            var myOptions = [];

            for (var x = 0; x < drivers.length; x++) {
                var obj = { label: drivers[x].Salesman, value: drivers[x].mdCode };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#btdtdrvierList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Driver',
                multiple: false
            });
        }
    });
}

function showskutaggingbtdt(){
    $('#skutaggingModal').modal('show');
}

$('.skuDetailsTable').hide();

function searchbtdtSku(){
    var bdtdDriverSelection = $('#bdtdDriverSelection').val();
    var btdtspan = $('#btdtspan').text();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_BTDT_PRODUCT",
            "btdtDriver":bdtdDriverSelection,
            "btdtbookingDate":btdtspan, 
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(r){ 
            $('#btdtdrivername').html($('#bdtdDriverSelection option:selected').text());
            var cont = ``;
            for(var x = 0; x < r.length; x++){
                cont += `<tr>
                            <td>`+r[x].stockCode+`</td>
                            <td>`+r[x].Description+`</td>`+
                            '<td><button class="btn btn-danger btn-sm" onclick="replacedmodal(\''+r[x].stockCode+'\')">Replace</button></td>'+`
                        </tr>`;
            }
            $('#skuDetailstbody').html(cont);
        }
    });
    $('.skuDetailsTable').show();
}

function replacedmodal(stockCode){
    $('#stockCodetoReplaced').html(stockCode);
    $('#btdtstockCodeHolder').val(stockCode);

    $('#productselectionModal').modal('show');
}


function replacedBtdtProduct(){
    var stockCode = $('#btdtstockCodeHolder').val();
    var newstockCode = $('#btdtProductList').val();
    var btdtspan = $('#btdtspan').text();
    var f = confirm('Are you sure you want to replaced '+stockCode+' to '+newstockCode+' ?');
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"EXEC_REPLACED_BDTDT_PRODUCT",
                "stockCode":stockCode,
                "newstockCode":newstockCode, 
                "bookingDate":btdtspan,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,          
            async: false,  
            success: function(r){ 
                if(r){
                    $('#btdtstockCodeHolder').val('');
                    $('#productselectionModal').modal('hide');

                    alert('Stockcode '+stockCode+' successfully replaced to ' + newstockCode);
                }
            }
        });
    }
}


function exec_salesman_sending_priority(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"UPDATE_SALESMAN_SENDING",
            'switchChecker':priosychingData,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(r){ 
            if(priosychingData == 1){
                alert('Success:\nPriority syching is enabled.');
            }else{
                alert('Success:\nPriority syching is disabled.');
            }
        }
    });
}



function salesmansendingchecker(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"SALESMAN_SENDING_CHECKER",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(r){ 
            if(r == 1){
                $('.priosyching').prop("checked", true);
                $('.text-indicator-priosyching').html('PRIORITIZE SYNCHING: <b style="color: green">ENABLED</b>');
            }else{
                $('.priosyching').prop("checked", false);
                $('.text-indicator-priosyching').html('PRIORITIZE SYNCHING: <b style="color: red">DISABLED</b>');
            }
        }
    });
}

$('.priosyching').click(function() {
    if($('.priosyching').prop("checked") == true){
        $('.text-indicator-priosyching').html('PRIORITIZE SYNCHING: <b style="color: green">ENABLED</b>');
        priosychingData = 1;
    }
    else if($('.priosyching').prop("checked") == false){
        $('.text-indicator-priosyching').html('PRIORITIZE SYNCHING: <b style="color: red">DISABLED</b>');
        priosychingData = 0;
    }
});

$(window).bind("load", function () {
    $('#work-in-progress').fadeOut();
});

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
} 


(function($) {
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));


$("#navBtn").clickToggle(function() {   
    openNav();
}, function() {
    closeNav();
});

function imgError2(image) {
    image.onerror = "";
    image.src = "../img/salesmanPic.jpg";
    return true;
}  

function getercpendingrec(){
        $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_ERC_PENDING_REC", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(r){ 
            $('#ericsopending').html(r.sores);
            $('#ericpaymentspending').html(r.paymentres);
            $('#ericreturnspending').html(r.returnres);
            $('#ericautotrans').html(r.autotransfer);
        }
    }).done(function(response) {
        Swal.close();
    });
}

function exec_get_pending_erc_so(){

        var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing pending sales orders please wait...</p>',
                    backdrop: true
                    // closeButton: false
                });

        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"GET_PENDING_ERC_SO", "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,  
            async: false, 
            success: function(response){   
                    if(response){
                        botboxMsg = '<b style="color: green;">Success!</b><p>Pending Sales Order transaction successfully sync!</p>';
                    }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Pending Sales Order transaction!</b>' + response;
                    }

                    getercpendingrec();
                    ercsoloadSalesman();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Pending Sales Order transaction!</b><br>' + XMLHttpRequest.responseText;
                    var totalTime = new Date().getTime()-ajaxTime;
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                }
            }).done(function () {
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            });
}

function exec_eric_so(){
    console.log('click');
    
    $('#sochoicesModal').modal('hide');
    $('#syncsotoericmodal').modal('show');
    
}

function f_exec_eric_so(){
    var transdateso = dssdate;
    var salesmanlist = $('#salesmanList_soeric').val();

    if(salesmanlist == undefined || salesmanlist == ''){
        alert('Please select a salesman.');
    }else{
        var r = confirm('This could take time, please wait while we process your request.');
        if(r){
            insertsyncLogs('ERIC_SALES_ORDER_SYNCHING');
                var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing sales order transaction to ERIC please wait...</p>',
                    backdrop: true
                    // closeButton: false
                });
                var message = 'Successfully Saved!';
                var botboxMsg = '';
                var ajaxTime= new Date().getTime();
                $.ajax ({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {
                            "type":"SYNC_SO_ERIC_TRANSACTIONS",
                            "salesmanlist":salesmanlist,
                            "userID": GBL_USERID,
                            "distCode": GBL_DISTCODE
                        }, 
                    dataType: 'json',     
                    crossDomain: true,
                    cache: false,   
                    success: function(response){   
                        var resp_cont = eric_response(response);
                        if(response){
                            botboxMsg = '<div><b style="color: green;">Success!</b><p>Sales Order transaction successfully sync to ERIC. Thank You!</p>'+
                                        '<br>ERIC API Response: <br>'+resp_cont;
                        }else{
                            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Sales Order transaction to Eric!</b>' + response;
                        }

                        getercpendingrec();
                        ercsoloadSalesman();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Sales Order transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
                        var totalTime = new Date().getTime()-ajaxTime;
                        dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                            }, 1000);
                        });
                    }
                }).done(function () {
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                });
            }//if
    }//else
    
    
}

function eric_response(r){
    
    var cont = ``;
    for(var x = 0; x < r.length; x++){
        cont += `<tr>
                    <td>`+(x+1)+`</td>
                        <td>`+r[x].Response+`</td>
                </tr>`;
    }

        var maincont = `
        <table class="table">
        <tbody>
            `+cont+`
            </tbody>    
    </table>`;

    return maincont;
}

function syncallericrequirements(){
    var r = confirm('This could take time, please wait while we process your request.');
        if(r){

            insertsyncLogs('ERIC_AUTH_SYCHING');
            var dialog = bootbox.dialog({
                message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing all ERIC data requirements please wait...</p>',
                backdrop: true
                // closeButton: false
            });
            var message = 'Successfully Saved!';
            var botboxMsg = '';
            var ajaxTime= new Date().getTime();
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {
                        "type":"SYNC_ALL_ERIC_REQUIREMENTS",
                        "userID": GBL_USERID,
                        "distCode": GBL_DISTCODE
                    }, 
                dataType: 'json',     
                crossDomain: true,
                cache: false,   
                success: function(response){   
                    if(response){
                        botboxMsg = '<b style="color: green;">Success!</b><p>All ERIC data requirements successfully sync. Thank You!</p>';
                    }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Eric requirements!</b><br>' + response;
                    }

                    getercpendingrec();
                    ercsoloadSalesman();
                    stockRequestSourceData();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Eric requirements!</b><br>' + XMLHttpRequest.responseText;
                    var totalTime = new Date().getTime()-ajaxTime;
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                }
            }).done(function () {
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            });
        }//if
}

function dailyexporttoanalytics(){
        var r = confirm('This could take time, please wait while we process your request.');
        if(r){
            var dialog = bootbox.dialog({
                message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing daily export please wait...</p>',
                backdrop: true
                // closeButton: false
            });
            var message = 'Successfully Saved!';
            var botboxMsg = '';
            var ajaxTime= new Date().getTime();
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {
                        "type":"SYNC_DAILY_EXPORT",
                        "userID": GBL_USERID,
                        "distCode": GBL_DISTCODE
                    }, 
                dataType: 'json',     
                crossDomain: true,
                cache: false,   
                success: function(response){   
                    if(response){
                        botboxMsg = '<b style="color: green;">Success!</b><p>Daily export successfully sync. Thank You!</p>';
                    }else{
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync daily export!</b><br>' + response;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync daily export!</b><br>' + XMLHttpRequest.responseText;
                    var totalTime = new Date().getTime()-ajaxTime;
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                }
            }).done(function () {
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            });
        }//if
}

// payments groups
function exec_get_pending_erc_payments(){
        var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing pending payments please wait...</p>',
                    backdrop: true
                    // closeButton: false
                });

        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"GET_PENDING_ERC_PAYMENTS", "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,  
            async: false, 
            success: function(response){   
                    var resp_cont = eric_response(response);
                    if(response){
                        botboxMsg = '<div><b style="color: green;">Success!</b><p>Payments successfully sync to ERIC. Thank You!</p>'+
                                    '<br>ERIC API Response: <br>'+resp_cont;
                    }else{
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync Payments to Eric!</b>' + response;
                    }

                    getercpendingrec();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Pending payments transaction!</b><br>' + XMLHttpRequest.responseText;
                    var totalTime = new Date().getTime()-ajaxTime;
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                }
            }).done(function () {
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            });
}



//end of payments groups
function exec_get_pending_returns(){
        var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing pending returns please wait...</p>',
                    backdrop: true
                    // closeButton: false
                });

        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"GET_PENDING_ERC_RETURNS", "userID": GBL_USERID, "distCode": GBL_DISTCODE}, 
            dataType: 'json',     
            crossDomain: true,
            cache: false,  
            async: false, 
            success: function(response){   
                    if(response){
                        botboxMsg = '<b style="color: green;">Success!</b><p>Pending returns transaction successfully sync!</p>';
                    }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Pending returns transaction!</b>' + response;
                    }

                    getercpendingrec();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync Pending returns transaction!</b><br>' + XMLHttpRequest.responseText;
                    var totalTime = new Date().getTime()-ajaxTime;
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                }
            }).done(function () {
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            });
}

function exec_eric_payments(){
        var r = confirm('This could take time, please wait while we process your request.');
        if(r){
              insertsyncLogs('ERIC_PAYMENTS_SYNCHING');
                var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing payment transaction to ERIC please wait...</p>',
                    backdrop: true
                    // closeButton: false
                });
                var message = 'Successfully Saved!';
                var botboxMsg = '';
                var ajaxTime= new Date().getTime();
                $.ajax ({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {
                            "type":"SYNC_PAYMENTS_ERIC_TRANSACTIONS",
                            "userID": GBL_USERID,
                            "distCode": GBL_DISTCODE
                        }, 
                    dataType: 'json',     
                    crossDomain: true,
                    cache: false,   
                    success: function(response){   
                        var resp_cont = eric_response(response);
                        if(response){
                            botboxMsg = '<div><b style="color: green;">Success!</b><p>Payment transactions successfully sync to ERIC. Thank You!</p>'+
                                        '<br>ERIC API Response: <br>'+resp_cont;
                        }else{
                            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Payment transaction to Eric!</b>' + response;
                        }

                        getercpendingrec();
                        // ercsoloadSalesman();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Payment transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
                        var totalTime = new Date().getTime()-ajaxTime;
                        dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                            }, 1000);
                        });
                    }
                }).done(function () {
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                });
            }//if
}
// return groups

function exec_eric_returns(){
    var r = confirm('This could take time, please wait while we process your request.');
        if(r){
               insertsyncLogs('ERIC_RETURNS_SYNCHING');
                var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing return transactions to ERIC please wait...</p>',
                    backdrop: true
                    // closeButton: false
                });
                var message = 'Successfully Saved!';
                var botboxMsg = '';
                var ajaxTime= new Date().getTime();
                $.ajax ({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {
                            "type":"SYNC_RETURNS_ERIC_TRANSACTIONS",
                            "userID": GBL_USERID,
                            "distCode": GBL_DISTCODE
                        }, 
                    dataType: 'json',     
                    crossDomain: true,
                    cache: false,   
                    success: function(response){   
                        var resp_cont = eric_response(response);
                        if(response){
                            botboxMsg = '<div><b style="color: green;">Success!</b><p>Sales Return transactions successfully sync to ERIC. Thank You!</p>'+
                                        '<br>ERIC API Response: <br>'+resp_cont;
                        }else{
                            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Sales Return transactions to Eric!</b>' + response;
                        }

                        getercpendingrec();
                        // ercsoloadSalesman();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Return transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
                        var totalTime = new Date().getTime()-ajaxTime;
                        dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                            }, 1000);
                        });
                    }
                }).done(function () {
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                });
            }//if
}



function exec_eric_autotransfer(){
    var r = confirm('This could take time, please wait while we process your request.');
        if(r){
                 insertsyncLogs('ERIC_AUTO_STOCK_TRANSFER_SYNCHING');
                var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing return transactions to ERIC please wait...</p>',
                    backdrop: true
                    // closeButton: false
                });
                var message = 'Successfully Saved!';
                var botboxMsg = '';
                var ajaxTime= new Date().getTime();
                $.ajax ({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {
                            "type":"SYNC_AUTOTRANSFER_ERIC_TRANSACTIONS",
                            "userID": GBL_USERID,
                            "distCode": GBL_DISTCODE
                        }, 
                    dataType: 'json',     
                    crossDomain: true,
                    cache: false,   
                    success: function(response){   
                        var resp_cont = eric_response(response);
                        if(response){
                            botboxMsg = '<div><b style="color: green;">Success!</b><p>Auto Stock Transfer successfully sync to ERIC. Thank You!</p>'+
                                        '<br>ERIC API Response: <br>'+resp_cont;
                        }else{
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync Auto Stock Transfer to Eric!</b>' + response;
                        }
                        getercpendingrec();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Auto Stock Transfer transactions to Eric!</b><br>' + XMLHttpRequest.responseText;
                        var totalTime = new Date().getTime()-ajaxTime;
                        dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                            }, 1000);
                        });
                    }
                }).done(function () {
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                    });
                });
            }//if
}

function admsynclogs(){
    var win = window.open('adm_sync_logs', '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
}

function vsologs(){
    var win = window.open('so_to_erclogs', '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
}

function vpmntslogs(){
    var win = window.open('pymnts_to_erclogs', '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
}

function vreturnsslogs(){
    var win = window.open('rtrns_to_erclogs', '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
}

function vautostocklogs(){
    var win = window.open('auto_to_erclogs', '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
}


function exec_eric_so_per_transaction(){
    $('#syncsotoericmoda_perTrans').modal('show');
    $('#sochoicesModal').modal('hide');
}




datatableApp();
var tableData;
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTableBottomPagination"p>>',
        "responsive": false,
        "data": sourceDat,
        "scrollX": true,
        select: {
            style: 'multi+shift', // or 'multi', 'single'
            selector: 'td.select-checkbox'
        },
        columns: [
            {
                data: null,
                className: 'select-checkbox',
                orderable: false,
                defaultContent: '',
                title: '<input type="checkbox" id="select-all" />',
            },
            { data: "MyBuddyTransNumber", title: "Transaction ID" },
            { data: "Salesman", title: "Salesman" },
            { data: "Customer", title: "Customer" },
            { data: "Document #", title: "Document #" },

            { data: "#SKU", title: "Total SKU" },
            { data: "upTime", title: "Up Time" },
            { data: "Sales", title: "Sales" },
            { data: "address", title: "Address" },
            { data: "deliveryDate", title: "Delivery Date" },
        ],
        buttons: [
            // {
            //     extend: 'collection',
            //     text: 'Export',
            //     autoClose: true,
            //     buttons: [
            //         'copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5'
            //     ],
            // },
            {
                text: 'Process To ERIC',
                className: 'approveBtn_stocReq customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                    console.log(tableData.rows('.selected').data());
                    GBLSELECTEDITEMS = [];

                    var row = tableData.rows('.selected').data();
                    if(row.length == 0){
                        Swal.fire({
                            text: "No Data Selected.",
                            icon: "info"
                        });
                    }else{
                        Swal.fire({
                            text: "Do you want to sync only the selected sales orders?",
                            icon: "warning",
                            cancelButtonColor: "#d33",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Yes, Sync",
                            showCancelButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                GBLSELECTEDITEMS = row.toArray();//
                                sendtoeric_per_transaction(GBLSELECTEDITEMS);
                            } 
                        });
                    }
                }
            },
            // {
            //     text: 'Filter',
            //     className: 'filter',
            //     action: function(e, dt, node, config){
            //         $('#filterTransModal').modal('show');
            //     }
            // }
        ],
        rowCallback: function(row, data, index){
            // var stat = data.Status.toString().toUpperCase();
            // var salesFormat = data.Sales.toString();
            //     if(stat == 'VALID'){
            //         $(row).find('td:eq(0)').css({'color': 'green', 'font-size':'6px;', 'letter-spacing': '0.2em'});
            //         $(row).find('td:eq(0)').html('&#10003; VALID');
            //     }else{
            //         $(row).find('td:eq(0)').css({'color': 'red', 'font-size':'6px;', 'letter-spacing': '0.2em', 'text-decoration':'line-through'});
            //     }
            //     $(row).find('td:eq(13)').text('Ã¢â€šÂ±' + Number(parseFloat(salesFormat).toFixed(2)).toLocaleString());
            //     // READY
            //     // $(row).find('td:eq(0)').css({'border-left': '5px solid '+generateRandomHex()});
        },
      
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    $('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
    });

    function viewDetails(r){

        $('#dispcat').html(r.SUBCATEGORY);
        $('#dispdesc').val(r.DESCRIPTION);
        $('#dispdatecreated').html(r.DATECREATED);

        $('#cidHolder').val(r.cID);
        $('#vmodal').modal('show');
    }

    // Bypassing the table alignment to automatically align when loadded
    setTimeout(function() {
        $("#statusHeader").click();
        $("#salesmanHeader").click();
        $("#statusHeader").click();
        $("#statusHeader").click();
    }, 5000);

    $('#select-all').prop('checked', false);
    $('#select-all').on('click', function () {
        if (this.checked) {
            tableData.rows({ search: 'applied' }).select();
        } else {
            tableData.rows({ search: 'applied' }).deselect();
        }
    });
}

var sourceDat = [];
stockRequestSourceData();
function stockRequestSourceData(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_SO_PER_TRANSACTION", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(r){ 
            if(r.length != 0){ 
                sourceDat = r;
                tableData.clear().rows.add(sourceDat).draw();
                $('#stockRequest_TAB').show();
            }
        }
    });
}

function sendtoeric_per_transaction(datatosync){
    var localdata = [];
    for(var x =0; x < datatosync.length; x++){

        localdata.push(datatosync[x].MyBuddyTransNumber);
    }

         insertsyncLogs('ERIC_SALESORDER_PER_TRANSACTION_SYNCHING');

     var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing return transactions to ERIC please wait...</p>',
            backdrop: true
            // closeButton: false
        });
        var message = 'Successfully Saved!';
        var botboxMsg = '';
        var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"EXEC_SYNC_TO_ERIC_SO_PER_TRANSACTION", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "datatosync":localdata},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(response){   
                var resp_cont = eric_response(response);
                if(response){
                    botboxMsg = '<div><b style="color: green;">Success!</b><p>SO transactions successfully sync to ERIC. Thank You!</p>'+
                                '<br>ERIC API Response: <br>'+resp_cont;
                }else{
                    botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SO transactions to Eric!</b>' + response;
                }

                getercpendingrec();
                stockRequestSourceData();
                // ercsoloadSalesman();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SO transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
                var totalTime = new Date().getTime()-ajaxTime;
                dialog.init(function(){
                    setTimeout(function(){
                        dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    }, 1000);
                });
            }
        }).done(function () {
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        });
}