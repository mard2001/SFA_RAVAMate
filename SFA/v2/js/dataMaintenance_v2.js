var usernm = localStorage.getItem("username");
var user = localStorage.getItem("adminUserName");
var GLBLCIDHOLDER;
var GBLCOMPANYNAME = '';
var dssdate;
var priosychingData = '';
var GBLSELECTEDITEMS = [];
var GBLSELECTEDPAYMENTS = [];
var LOCALLINK = "https://php-7.4.ravamate.com"
var tableData_SO_pending, tableData_SO_failed, tableData_SO_success, tableData_SO_exempted;
var tableData_Payment_pending, tableData_Payment_failed, tableData_Payment_success, tableData_Payment_exempted;
var tableData_Returns_pending, tableData_Returns_failed, tableData_Returns_success, tableData_Returns_exempted;
var tableData_Transfer_pending, tableData_Transfer_failed, tableData_Transfer_success, tableData_Transfer_exempted;
var sourceDataSO_pending = [], sourceDataSO_failed = [], sourceDataSO_success = [], sourceDataSO_exempted = [];
var sourceDataPayment_pending = [], sourceDataPayment_failed = [], sourceDataPayment_success = [], sourceDataPayment_exempted = [];
var sourceDataReturns_pending = [], sourceDataReturns_failed = [], sourceDataReturns_success = [], sourceDataReturns_exempted = [];
var sourceDataTransfer_pending = [], sourceDataTransfer_failed = [], sourceDataTransfer_success = [], sourceDataTransfer_exempted = [];
var startPickDateSO, startPickDatePayment, startPickDateReturns, startPickDateTransfer;
var endPickDateSO, endPickDatePayment, endPickDateReturns, endPickDateTransfer;
var GBLREPROCESSSELECTEDITEMS = [];
var GBLREVERTSELECTEDITEMS = [];
const datetime_options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
};

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
            // getcompname();
            getcompname_dynamic("", "titleHeading");
            ercsoloadSalesman();
            getercpendingrec();
            getPaymentSourceData();
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

VirtualSelect.init({
    ele: '#salesmanList_paymenteric',
});

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
            console.log(myOptions);
            document.querySelector('#salesmanList_soeric').destroy();
            VirtualSelect.init({
                ele: '#salesmanList_soeric',
                options: myOptions,
                search: false,
                maxWidth: '400px', 
                placeholder: 'Select Salesman'
            });
        }
    });
}

function ercpaymentloadSalesman(){
    var data = sourcepaymentDat;
    const salesMap = {};

    data.forEach(item => {
        const raw = item.Salesman.replace(/\s+/g, ' ').trim();

        const salesmancode = raw.split(' ')[0];
        const salesmanname = raw.substring(salesmancode.length + 1);

        const transaction = item.MyBuddyTransNumber;

        if (!salesMap[salesmancode]) {
            salesMap[salesmancode] = {
                SalesmanCode: salesmancode,
                SalesmanName: salesmanname,
                Transactions: new Set()
            };
        }

        salesMap[salesmancode].Transactions.add(transaction);
    });

    const result = Object.values(salesMap).map(item => ({
        SalesmanCode: item.SalesmanCode,
        SalesmanName: item.SalesmanName,
        UniqueTransactions: item.Transactions.size
    }));

    var myOptions = [];
    for (var x = 0; x < result.length; x++) {
        var obj = { label: result[x].SalesmanName+" ("+result[x].UniqueTransactions+")", value: result[x].SalesmanCode };
        myOptions.push(obj);
    }

    document.querySelector('#salesmanList_paymenteric').destroy();
    VirtualSelect.init({
        ele: '#salesmanList_paymenteric',
        options: myOptions,
        search: true,
        maxWidth: '400px', 
        placeholder: 'Select Salesman'
    });
}

function exec_eric_payment(){
    $('#paymentchoicesModal').modal('hide');
    $('#syncpaymenttoericmodal').modal('show');
    
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
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}

function execAlignMCP(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}

function execSyncBtdt(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
});
}
      
function invSync(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
                        botboxMsg = '<b style="color: green;">Success!</b><p>RAVAmate inventory Successfully updated. Thank You!</p>';
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
    });
}

function custSync(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
                        botboxMsg = '<b style="color: green;">Success!</b><p>RAVAmate customers Successfully updated. Thank You!</p>';
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
    });
}

function custSync2(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}

function sync_saleman_image(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}

function executeQueingSync_beta(){
    var salesmanList = $('#salesmanList_beta').val();
    if(salesmanList == undefined || salesmanList == ''){
        Swal.fire({
            text: "Please select a salesman",
            icon: "info"
        });
    }else if(dssdate == ''){
        Swal.fire({
            text: "Please select a date",
            icon: "info"
        });
    }else{
        Swal.fire({
            icon: "question",
            text: "This could take time, please wait while we process your request.",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Okay",
        }).then((result) => {
            if (result.isConfirmed) {
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
        });
    }
}


function goSyncinVoice(){
    $('#SyncInvoiceModal').modal('show');
}

function execSyncInvoiceIdeliver(){
    if(dssdate == null || dssdate == '' || dssdate == undefined){
        Swal.fire({
            title: "Unable to Proceed:",
            text: "Please select invoice date.",
            icon: "info"
        });
    }else{
        Swal.fire({
            icon: "question",
            text: "This could take time, please wait while we process your request.",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Okay",
        }).then((result) => {
            if (result.isConfirmed) {
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
        });
    }
}

function executeQueingSync(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}

function exec_view_stocktakeModal(){
    $('#syncStockRequestModal').modal('show');
}
    
function exec_stockTake(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}

function execDatareplication(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
            if(!$('#salesmanList').val()){
                Swal.fire({
                    text: "No Salesman Selected",
                    icon: "info"
                });
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
                        botboxMsg = '<b style="color: green;">Success!</b><p>RAVAmate Data Replication was Successful. Thank You!</p>';
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
    });
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
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
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

                    Swal.fire({
                        html: 'Stockcode '+stockCode+' successfully replaced to ' + newstockCode,
                        icon: "success"
                    });
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
                Swal.fire({
                    text: "Priority syching is enabled.",
                    icon: "success"
                });
            }else{
                Swal.fire({
                    text: "Priority syching is disabled.",
                    icon: "success"
                });
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

            $('#failedValue_so').html(r.sores_failed);
            $('#failedValue_payment').html(r.paymentres_failed);
            $('#failedValue_returns').html(r.returnres_failed);
            $('#failedValue_autotrans').html(r.autotransfer_failed);

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
    
    var salesmanlist = [];
    salesmanlist.push($('#salesmanList_soeric').val());

    if(salesmanlist == undefined || salesmanlist == ''){
        Swal.fire({
            text: "Please select a salesman.",
            icon: "info"
        });
    }else{
        Swal.fire({
            icon: "question",
            text: "This could take time, please wait while we process your request.",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Okay",
        }).then((result) => {
            if (result.isConfirmed) {
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

                        // getercpendingrec();
                        // ercsoloadSalesman();

                        // stockRequestSourceData();

                        //call syching eric after
                        // syncallericrequirements();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Sales Order transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
                        var totalTime = new Date().getTime()-ajaxTime;
                        dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                                dialog.find('.bootbox-close-button').on('click', function () {
                                    automaticResyncAfterSO();
                                });
                            }, 1000);
                            
                        });
                    }
                }).done(function () {
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                            dialog.find('.bootbox-close-button').on('click', function () {
                                automaticResyncAfterSO();
                            });
                        }, 1000);
                    });
                });
            }//if
        })
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
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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

                    sourceData_SO(startPickDateSO, endPickDateSO);
                    sourceData_Payment(startPickDatePayment, endPickDatePayment);
                    sourceData_Returns(startPickDateReturns, endPickDateReturns);
                    sourceData_Transfer(startPickDateTransfer, endPickDateTransfer);
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
        }
    });
}

function dailyexporttoanalytics(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
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
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
                    datePickerPayment();
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
        }
    });
}
// return groups

function exec_eric_returns(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
                    datePickerReturns();
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
        }
    });
}

function exec_eric_autotransfer(){
    Swal.fire({
        icon: "question",
        text: "This could take time, please wait while we process your request.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
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
                    datePickerTransfer();
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
        }
    });
}


function admsynclogs(){
    var win = window.open('adm_sync_logs', '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        Swal.fire({
            text: "Please allow popups for this website.",
            icon: "error"
        });
    }
}

function exec_eric_so_per_transaction(){
    // As per sir Roy, 01/20/26, TEMPORARILY UNAVAILABLE TUNGOD SA ISSUE SA SITE NA NI REFLECT NA DIAY SA ERIC BUT FAIL PA SA ATOA.
    // Temporary for specific sites only

    if(localStorage.getItem('DISTCODE') == 'FUC' || localStorage.getItem('DISTCODE') == 'FUB' || localStorage.getItem('DISTCODE') == 'FUO'){
        Swal.fire({
            icon: "info",
            html: `<h5>This Feature is Temporarily Under Maintenance.</h5><br/><span style='font-size:11px;'><b>NOTE: </b> <i>You can still be able to send Sales Order to ERIC by syncing per salesman.</i></span>`,
        });
    } else {
        $('#syncsotoericmoda_perTrans').modal('show');
        $('#sochoicesModal').modal('hide');
    }
}

function f_exec_eric_payment_per_salesman(){
    var transdateso = dssdate;
    var salesmanlist = $('#salesmanList_paymenteric').val();

    if(salesmanlist == undefined || salesmanlist == ''){
        Swal.fire({
            text: "Please select a salesman.",
            icon: "info"
        });
    }else{
        Swal.fire({
            icon: "question",
            text: "This could take time, please wait while we process your request.",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Okay",
        }).then((result) => {
            if (result.isConfirmed) {
                insertsyncLogs('ERIC_PAYMENT_SYNCHING_PER_SALESMAN');
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
                            "type":"SYNC_PAYMENTS_ERIC_PER_SALESMAN",
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
                            botboxMsg = '<div><b style="color: green;">Success!</b><p>Payment transaction successfully sync to ERIC. Thank You!</p>'+
                                        '<br>ERIC API Response: <br>'+resp_cont;
                        }else{
                            botboxMsg = '<b style="color: red;">Ops! Unable to Sync Payment transaction to Eric!</b>' + response;
                        }

                        // getercpendingrec();
                        // ercsoloadSalesman();

                        // stockRequestSourceData();

                        //call syching eric after
                        // syncallericrequirements();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync Payment transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
                        var totalTime = new Date().getTime()-ajaxTime;
                        dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                                dialog.find('.bootbox-close-button').on('click', function () {
                                    automaticResyncAfterSO();
                                });
                            }, 1000);
                            
                        });
                    }
                }).done(function () {
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                            dialog.find('.bootbox-close-button').on('click', function () {
                                automaticResyncAfterSO();
                            });
                        }, 1000);
                    });
                });
            }//if
        })
    }//else
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
                    console.log(tableData.rows({ selected: true }).data());
                    GBLSELECTEDITEMS = [];

                    var row = tableData.rows({ selected: true }).data();
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
        async: false,          
        success: function(r){ 
            $("#select-all").prop('checked', false);
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
        backdrop: true,
        className: 'SOSyncing_bootbox'
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
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SO transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
            var totalTime = new Date().getTime()-ajaxTime;
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    dialog.find('.bootbox-close-button').on('click', function () {
                    automaticResyncAfterSO();
                });
                }, 1000);
            });
        }
    }).done(function () {
        dialog.init(function(){
            setTimeout(function(){
                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                dialog.find('.bootbox-close-button').on('click', function () {
                    automaticResyncAfterSO();
                });
            }, 1000);
        });
    });
}

// listen only for this bootbox close button click


function automaticResyncAfterSO(){
    Swal.fire({
        html: "Please Wait... Preparing New Data...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
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
            getercpendingrec();
            ercsoloadSalesman();
            stockRequestSourceData();
            getPaymentSourceData();

            sourceData_SO(startPickDateSO, endPickDateSO);
            sourceData_Payment(startPickDatePayment, endPickDatePayment);
            sourceData_Returns(startPickDateReturns, endPickDateReturns);
        },error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                html: 'Something went wrong! Contact administrator <br/>' + XMLHttpRequest.responseText,
                icon: "error"
            });
        }
    }).done(function(){
        // Swal.fire({
        //     html: 'Success',
        //     icon: "success"
        // });
    });
}

//main funct reprocess so
function reprocess_SO_transaction(datatosync){
    var localdata = [];
    for(var x =0; x < datatosync.length; x++){
        localdata.push(datatosync[x].MyBuddyTransNumber);
    }

    var uniqueArray = localdata.filter(function(item, index) {
        return localdata.indexOf(item) === index;
    });

    console.log(uniqueArray);
    insertsyncLogs('REPROCESS_ERIC_SALESORDER_PER_TRANSACTION_SYNCHING');

    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Ongoing SO reprocessing please wait...</p>',
        backdrop: true
        // closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"EXEC_SYNC_TO_ERIC_SO_PER_TRANSACTION_REPROCESS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "datatosync":uniqueArray},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(response){   
            var resp_cont = eric_response(response);
            if(response){
                botboxMsg = '<div><b style="color: green;">Success!</b><p>SO transactions successfully reprocess to ERIC. Thank You!</p>'+
                            '<br>ERIC API Response: <br>'+resp_cont;
            }else{
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to SO transactions to Eric!</b>' + response;
            }

            getercpendingrec();
            stockRequestSourceData();
            datePickerSO();
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

//reprocess payment
function reprocess_payment_transaction(datatosync){
    var localdata = [];
    for(var x =0; x < datatosync.length; x++){
        localdata.push(datatosync[x].MyBuddyTransNumber);
    }

    var uniqueArray = localdata.filter(function(item, index) {
        return localdata.indexOf(item) === index;
    });

    console.log(uniqueArray);
    insertsyncLogs('REPROCESS_SYNC_PENDING_ERC_PAYMENTS');

    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Ongoing payment reprocessing please wait...</p>',
        backdrop: true
        // closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"SYNC_PAYMENTS_ERIC_TRANSACTIONS_REPROCESS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "datatosync":uniqueArray},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(response){   
            var resp_cont = eric_response(response);
            if(response){
                botboxMsg = '<div><b style="color: green;">Success!</b><p>Payment transactions successfully reprocess to ERIC. Thank You!</p>'+
                            '<br>ERIC API Response: <br>'+resp_cont;
            }else{
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Payment transactions to Eric!</b>' + response;
            }

            getercpendingrec();
            stockRequestSourceData();
            datePickerSO();
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
}

//reprocess retruns
function reprocess_returns_transaction(datatosync){
    var localdata = [];
    for(var x =0; x < datatosync.length; x++){
        localdata.push(datatosync[x].MyBuddyTransNumber);
    }

    var uniqueArray = localdata.filter(function(item, index) {
        return localdata.indexOf(item) === index;
    });

    console.log(uniqueArray);
    insertsyncLogs('REPROCESS_SYNC_PENDING_ERC_RETURNS');

    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Ongoing returns reprocessing please wait...</p>',
        backdrop: true
        // closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"SYNC_RETURNS_ERIC_TRANSACTIONS_REPROCESS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "datatosync":uniqueArray},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(response){   
            var resp_cont = eric_response(response);
            if(response){
                botboxMsg = '<div><b style="color: green;">Success!</b><p>Returns transactions successfully reprocess to ERIC. Thank You!</p>'+
                            '<br>ERIC API Response: <br>'+resp_cont;
            }else{
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Returns transactions to Eric!</b>' + response;
            }

            getercpendingrec();
            stockRequestSourceData();
            datePickerSO();
            // ercsoloadSalesman();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Returns transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
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

//reprocess stock transfer
function reprocess_stocktransfer_transaction(datatosync){
    var localdata = [];
    for(var x =0; x < datatosync.length; x++){
        localdata.push(datatosync[x].MyBuddyTransNumber);
    }

    var uniqueArray = localdata.filter(function(item, index) {
        return localdata.indexOf(item) === index;
    });

    console.log(uniqueArray);
    insertsyncLogs('REPROCESS_SYNC_PENDING_ERC_STOCKTRANSFER');

    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Ongoing stock transfer reprocessing please wait...</p>',
        backdrop: true
        // closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"SYNC_STOCKTRANSFER_ERIC_TRANSACTIONS_REPROCESS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "datatosync":uniqueArray},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(response){   
            var resp_cont = eric_response(response);
            if(response){
                botboxMsg = '<div><b style="color: green;">Success!</b><p>Stock transfer transactions successfully reprocess to ERIC. Thank You!</p>'+
                            '<br>ERIC API Response: <br>'+resp_cont;
            }else{
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Stock transfer transactions to Eric!</b>' + response;
            }

            getercpendingrec();
            stockRequestSourceData();
            datePickerSO();
            // ercsoloadSalesman();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Stock transfer transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
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

// LOGS DATATABLE
function sourceData_SO(start, end){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            type: "v2_GET_SO_LOGS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            start: start,
            end: end,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        success: function(r){ 
            sourceDataSO_pending = []; 
            sourceDataSO_failed = []; 
            sourceDataSO_success = [];
            sourceDataSO_exempted = [];
            var ctr_pending = 0;
            var ctr_failed = 0;
            var ctr_success = 0;
            var ctr_exempt = 0;

            for(var x = 0; x < r.length; x++){
                if (r[x].api_status == "S"){
                    sourceDataSO_success.push(r[x]);
                    ctr_success++;
                } else if (r[x].api_status == "E"){
                    sourceDataSO_failed.push(r[x]);
                    ctr_failed++;
                } else if (r[x].api_status == "X"){
                    sourceDataSO_exempted.push(r[x]);
                    ctr_exempt++;
                } else if (r[x].api_status == null){
                    sourceDataSO_pending.push(r[x]);
                    ctr_pending++;
                }
            }

            tableData_SO_pending.clear().rows.add(sourceDataSO_pending).draw();
            tableData_SO_failed.clear().rows.add(sourceDataSO_failed).draw();
            tableData_SO_success.clear().rows.add(sourceDataSO_success).draw();
            tableData_SO_exempted.clear().rows.add(sourceDataSO_exempted).draw();

            $('#nav-so_pending-tab-ctr').html(ctr_pending+" "+(ctr_pending > 1 ? "SKUs":"SKU"));
            $('#nav-so_fail-tab-ctr').html(ctr_failed+" "+(ctr_failed > 1 ? "SKUs":"SKU"));
            $('#nav-so_success-tab-ctr').html(ctr_success+" "+(ctr_success > 1 ? "SKUs":"SKU"));
            $('#nav-so_exempted-tab-ctr').html(ctr_exempt+" "+(ctr_exempt > 1 ? "SKUs":"SKU"));

            $('#select-all-failed-so').prop('checked', false);
            $('#select-all-exempt-so').prop('checked', false);
        },//success
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    }).done(function () {
        Swal.close();
    });
}

function sourceData_Payment(start, end){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            type: "v2_GET_PAYMENTLOGS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            start: start,
            end: end,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        success: function(r){ 
            sourceDataPayment_pending = []; 
            sourceDataPayment_failed = []; 
            sourceDataPayment_success = [];
            sourceDataPayment_exempted = [];
            var ctr_pending = 0;
            var ctr_failed = 0;
            var ctr_success = 0;
            var ctr_exempt = 0;

            for(var x = 0; x < r.length; x++){
                if (r[x].api_status == "S"){
                    sourceDataPayment_success.push(r[x]);
                    ctr_success++;
                } else if (r[x].api_status == "E"){
                    sourceDataPayment_failed.push(r[x]);
                    ctr_failed++;
                } else if (r[x].api_status == "X"){
                    sourceDataPayment_exempted.push(r[x]);
                    ctr_exempt++;
                }  else if (r[x].api_status == null){
                    sourceDataPayment_pending.push(r[x]);
                    ctr_pending++;
                }
            }

            tableData_Payment_pending.clear().rows.add(sourceDataPayment_pending).draw();
            tableData_Payment_failed.clear().rows.add(sourceDataPayment_failed).draw();
            tableData_Payment_success.clear().rows.add(sourceDataPayment_success).draw();
            tableData_Payment_exempted.clear().rows.add(sourceDataPayment_exempted).draw();

            $('#nav-payment_pending-tab-ctr').html(ctr_pending+" "+(ctr_pending > 1 ? "SKUs":"SKU"));
            $('#nav-payment_fail-tab-ctr').html(ctr_failed+" "+(ctr_failed > 1 ? "SKUs":"SKU"));
            $('#nav-payment_success-tab-ctr').html(ctr_success+" "+(ctr_success > 1 ? "SKUs":"SKU"));
            $('#nav-payment_exempted-tab-ctr').html(ctr_exempt+" "+(ctr_exempt > 1 ? "SKUs":"SKU"));

            $('#select-all-failed-payment').prop('checked', false);
            $('#select-all-exempt-payment').prop('checked', false);
        },//success
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    }).done(function () {
        Swal.close();
    });
}

function sourceData_Returns(start, end){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            type: "v2_GET_RETURN_LOGS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            start: start,
            end: end,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        success: function(r){ 
            sourceDataReturns_pending = []; 
            sourceDataReturns_failed = []; 
            sourceDataReturns_success = [];
            sourceDataReturns_exempted = [];
            var ctr_pending = 0;
            var ctr_failed = 0;
            var ctr_success = 0;
            var ctr_exempt = 0;

            for(var x = 0; x < r.length; x++){
                if (r[x].api_status == "S"){
                    sourceDataReturns_success.push(r[x]);
                    ctr_success++;
                } else if (r[x].api_status == "E"){
                    sourceDataReturns_failed.push(r[x]);
                    ctr_failed++;
                } else if (r[x].api_status == "X"){
                    sourceDataReturns_exempted.push(r[x]);
                    ctr_exempt++;
                }  else if (r[x].api_status == null){
                    sourceDataReturns_pending.push(r[x]);
                    ctr_pending++;
                }
            }

            tableData_Returns_pending.clear().rows.add(sourceDataReturns_pending).draw();
            tableData_Returns_failed.clear().rows.add(sourceDataReturns_failed).draw();
            tableData_Returns_success.clear().rows.add(sourceDataReturns_success).draw();
            tableData_Returns_exempted.clear().rows.add(sourceDataReturns_exempted).draw();

            $('#nav-returns_pending-tab-ctr').html(ctr_pending+" "+(ctr_pending > 1 ? "SKUs":"SKU"));
            $('#nav-returns_fail-tab-ctr').html(ctr_failed+" "+(ctr_failed > 1 ? "SKUs":"SKU"));
            $('#nav-returns_success-tab-ctr').html(ctr_success+" "+(ctr_success > 1 ? "SKUs":"SKU"));
            $('#nav-returns_exempted-tab-ctr').html(ctr_exempt+" "+(ctr_exempt > 1 ? "SKUs":"SKU"));

            $('#select-all-failed-returns').prop('checked', false);
            $('#select-all-exempt-returns').prop('checked', false);
        },//success
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    }).done(function () {
        Swal.close();   
    });
}

function sourceData_Transfer(start, end){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            type: "v2_GET_TRANSFER_LOGS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            start: start,
            end: end,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        success: function(r){ 
            sourceDataTransfer_pending = []; 
            sourceDataTransfer_failed = []; 
            sourceDataTransfer_success = [];
            sourceDataTransfer_exempted = [];
            var ctr_pending = 0;
            var ctr_failed = 0;
            var ctr_success = 0;
            var ctr_exempt = 0;

            for(var x = 0; x < r.length; x++){
                if (r[x].api_status == "S"){
                    sourceDataTransfer_success.push(r[x]);
                    ctr_success++;
                } else if (r[x].api_status == "E"){
                    sourceDataTransfer_failed.push(r[x]);
                    ctr_failed++;
                } else if (r[x].api_status == "X"){
                    sourceDataTransfer_exempted.push(r[x]);
                    ctr_exempt++;
                }  else if (r[x].api_status == null){
                    sourceDataTransfer_pending.push(r[x]);
                    ctr_pending++;
                }
            }

            tableData_Transfer_pending.clear().rows.add(sourceDataTransfer_pending).draw();
            tableData_Transfer_failed.clear().rows.add(sourceDataTransfer_failed).draw();
            tableData_Transfer_success.clear().rows.add(sourceDataTransfer_success).draw();
            tableData_Transfer_exempted.clear().rows.add(sourceDataTransfer_exempted).draw();

            $('#nav-transfer_pending-tab-ctr').html(ctr_pending+" "+(ctr_pending > 1 ? "SKUs":"SKU"));
            $('#nav-transfer_fail-tab-ctr').html(ctr_failed+" "+(ctr_failed > 1 ? "SKUs":"SKU"));
            $('#nav-transfer_success-tab-ctr').html(ctr_success+" "+(ctr_success > 1 ? "SKUs":"SKU"));
            $('#nav-transfer_exempted-tab-ctr').html(ctr_exempt+" "+(ctr_exempt > 1 ? "SKUs":"SKU"));

            $('#select-all-failed-transfer').prop('checked', false);
            $('#select-all-exempt-transfer').prop('checked', false);
        },//success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
 
        }
    }).done(function () {
        Swal.close();
    });
}

datePickerSO();
function datePickerSO() {
    var start = moment();
    var end = moment();

    function setLabelAndVariables(start, end) {
        if (start.format('MMMM D, YYYY') === end.format('MMMM D, YYYY')) {
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrangeSO span').html('<b>' + dayOfWeek + '</b>' + ' | ' +
                start.format('MMMM D, YYYY'));
        } else {
            $('#reportrangeSO span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        startPickDateSO = start.format('YYYY-MM-DD');
        endPickDateSO = end.format('YYYY-MM-DD');
    }

    $('#reportrangeSO').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "maxDate": moment(),
        "applyClass": "btn-primary",
        "autoApply": false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, setLabelAndVariables);

    $('#reportrangeSO').on('apply.daterangepicker', function (ev, picker) {
        Swal.fire({
            html: "Please Wait... Preparing Sales Order Logs...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        sourceData_SO(start, end);
    });

    setLabelAndVariables(start, end);
    sourceData_SO(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
}

datatableApp_SO_pending();
function datatableApp_SO_pending(){
    tableData_SO_pending = $('#Tbl_SO_pending').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataSO_pending,
        "scrollX": true,
        "order": [[12, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "transactionID", title:"Transaction ID" },
            { data: "salesman", title:"Saleman" },
            { data: "orderType", title:"Order Type" },
            { data: "custCode", title:"Customer Code" },
            { data: "itemNumber", title:"Item Number" },
            { data: "um", title:"UM"},
            { data: "qtyOrdered", title:"QTY Ordered" },
            { data: "discount", title:"Discount 1" },
            { data: "discount2", title:"Discount 2" },
            { data: "discount3", title:"Discount 3" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
             {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Sales-Order-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Sales-Order-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        order: [[12, 'desc']],
        createdRow: function (row, data, dataIndex) {
            row.id = `${data.transactionID}`;
        }

    });
    $('#Tbl_SO_pending tbody').on('click', 'tr', function () {
        Swal.fire({
            html: "Please Wait... Preparing Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                    var row = tableData_SO_pending.row(this);     
                    var rowData = row.data();  
                    var rowId = $(this).attr('id');   
                    viewDetails_dataModal(rowId, rowData);
                }, 1000);
            },
        });
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_SO_pending').is(':visible')) {
            $('#Tbl_SO_pending').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_SO_pending').is(':visible')) {
            $('#Tbl_SO_pending').DataTable().button('.buttons-excel').trigger();
        }
    });
}

datatableApp_SO_failed();
function datatableApp_SO_failed(){
    tableData_SO_failed = $('#Tbl_SO_failed').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataSO_failed,
        "scrollX": true,
        "order": [[13, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-failed-so" />',
            },
            { data: "transactionID", title:"Transaction ID" },
            { data: "salesman", title:"Saleman" },
            { data: "orderType", title:"Order Type" },
            { data: "custCode", title:"Customer Code" },
            { data: "itemNumber", title:"Item Number" },
            { data: "um", title:"UM"},
            { data: "qtyOrdered", title:"QTY Ordered" },
            { data: "discount", title:"Discount 1" },
            { data: "discount2", title:"Discount 2" },
            { data: "discount3", title:"Discount 3" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[12, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
             {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Sales-Order-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Sales-Order-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        createdRow: function (row, data, dataIndex) {
            row.id = `${data.transactionID}`;
        }
    });
    $('#Tbl_SO_failed tbody').on('click', 'td:not(:first-child)', function () {
        var tr = $(this).closest('tr');

        Swal.fire({
            html: "Please Wait... Preparing Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                    var row = tableData_SO_failed.row(tr);     
                    var rowData = row.data();  
                    var rowId = tr.attr('id');   
                    viewDetails_dataModal(rowId, rowData);
                }, 1000);
            },
        });
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_SO_failed').is(':visible')) {
            $('#Tbl_SO_failed').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_SO_failed').is(':visible')) {
            $('#Tbl_SO_failed').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-failed-so').prop('checked', false);
    $('#select-all-failed-so').on('click', function () {
        if (this.checked) {
            tableData_SO_failed.rows({ search: 'applied' }).select();
        } else {
            tableData_SO_failed.rows({ search: 'applied' }).deselect();
        }
    });
}

datatableApp_SO_success();
function datatableApp_SO_success(){
    tableData_SO_success = $('#Tbl_SO_success').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataSO_success,
        "scrollX": true,
        "order": [[12, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "transactionID", title:"Transaction ID" },
            { data: "salesman", title:"Saleman" },
            { data: "orderType", title:"Order Type" },
            { data: "custCode", title:"Customer Code" },
            { data: "itemNumber", title:"Item Number" },
            { data: "um", title:"UM"},
            { data: "qtyOrdered", title:"QTY Ordered" },
            { data: "discount", title:"Discount 1" },
            { data: "discount2", title:"Discount 2" },
            { data: "discount3", title:"Discount 3" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[12, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Sales-Order-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Sales-Order-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        createdRow: function (row, data, dataIndex) {
            row.id = `${data.transactionID}`;
        }
    });
    $('#Tbl_SO_success tbody').on('click', 'tr', function () {
        Swal.fire({
            html: "Please Wait... Preparing Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                    var row = tableData_SO_success.row(this);     
                    var rowData = row.data();  
                    var rowId = $(this).attr('id');   
                    viewDetails_dataModal(rowId, rowData);
                }, 1000);
            },
        });
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_SO_success').is(':visible')) {
            $('#Tbl_SO_success').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_SO_success').is(':visible')) {
            $('#Tbl_SO_success').DataTable().button('.buttons-excel').trigger();
        }
    });
}

datatableApp_SO_exempted();
function datatableApp_SO_exempted(){
    tableData_SO_exempted = $('#Tbl_so_exempted').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataSO_exempted,
        "scrollX": true,
        "order": [[12, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-exempt-so" />',
            },
            { data: "transactionID", title:"Transaction ID" },
            { data: "salesman", title:"Saleman" },
            { data: "orderType", title:"Order Type" },
            { data: "custCode", title:"Customer Code" },
            { data: "itemNumber", title:"Item Number" },
            { data: "um", title:"UM"},
            { data: "qtyOrdered", title:"QTY Ordered" },
            { data: "discount", title:"Discount 1" },
            { data: "discount2", title:"Discount 2" },
            { data: "discount3", title:"Discount 3" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[12, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Sales-Order-To-ERIC-LOGS-ManuallyHandled-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Sales-Order-To-ERIC-LOGS-ManuallyHandled-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        createdRow: function (row, data, dataIndex) {
            row.id = `${data.transactionID}`;
        }
    });

    $('#Tbl_SO_exempted tbody').on('click', 'tr', function () {
        Swal.fire({
            html: "Please Wait... Preparing Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                    var row = tableData_SO_exempted.row(this);     
                    var rowData = row.data();  
                    var rowId = $(this).attr('id');   
                    viewDetails_dataModal(rowId, rowData);
                }, 1000);
            },
        });
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_SO_exempted').is(':visible')) {
            $('#Tbl_SO_exempted').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_SO_exempted').is(':visible')) {
            $('#Tbl_SO_exempted').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-exempt-so').prop('checked', false);
    $('#select-all-exempt-so').on('click', function () {
        if (this.checked) {
            tableData_SO_exempted.rows({ search: 'applied' }).select();
        } else {
            tableData_SO_exempted.rows({ search: 'applied' }).deselect();
        }
    });
}

$('#searchBtn_SO').on('keyup', function() {
    var searchTerm = $(this).val();

    tableData_SO_pending.search(searchTerm).draw();
    tableData_SO_failed.search(searchTerm).draw();
    tableData_SO_success.search(searchTerm).draw();
    tableData_SO_exempted.search(searchTerm).draw();
});

//reprocess SO
$('#failedBtnSO').on('click', function(){
    // Swal.fire({
    //     text: "This feature will be available soon.",
    //     icon: "info"
    // });

    GBLREPROCESSSELECTEDITEMS = []; 
    var row = tableData_SO_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            text: "Do you want to re-process only the selected SO transaction?",
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray();//
                reprocess_SO_transaction(GBLREPROCESSSELECTEDITEMS);
            } 
        });
    }

});

$('#nav-so_fail-tab').on('shown.bs.tab', function () {
    $('#failedBtnSO, #exemptBtnSO').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                    let scale = 0.8 + (0.2 * now); 
                    $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-so_fail-tab').on('hidden.bs.tab', function () {
    $('#failedBtnSO, #exemptBtnSO').prop("disabled", true).fadeOut(400); 
});

$('#nav-so_exempted-tab').on('shown.bs.tab', function () {
    $('#revertBtnSO').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                let scale = 0.8 + (0.2 * now); 
                $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-so_exempted-tab').on('hidden.bs.tab', function () {
    $('#revertBtnSO').prop("disabled", true).fadeOut(400); 
});

//exempt SO
$('#exemptBtnSO').on('click', function(){
    GBLREPROCESSSELECTEDITEMS = []; 
    var row = tableData_SO_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to exempt the selected transaction?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These logs have already been handled/reflected in ERIC. If you continue, they will be moved to another tab and will no longer appear as failed in Ravamate.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray();//
                exempt_transaction(GBLREPROCESSSELECTEDITEMS, 'X', 'SALES_ORDER');
            } 
        });
    }
});

//revert SO
$('#revertBtnSO').on('click', function(){
    GBLREVERTSELECTEDITEMS = []; 
    var row = tableData_SO_exempted.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to revert the selected exempted transaction to fail?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These exempted logs will be returned to the Failed tab so they can be reprocessed.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREVERTSELECTEDITEMS = row.toArray();//
                exempt_transaction(GBLREVERTSELECTEDITEMS, 'E', 'SALES_ORDER');
            } 
        });
    }
});

datePickerPayment();
function datePickerPayment() {
    var start = moment();
    var end = moment();

    function setLabelAndVariables(start, end) {
        if (start.format('MMMM D, YYYY') === end.format('MMMM D, YYYY')) {
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrangePayment span').html('<b>' + dayOfWeek + '</b>' + ' | ' +
                start.format('MMMM D, YYYY'));
        } else {
            $('#reportrangePayment span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        startPickDatePayment = start.format('YYYY-MM-DD');
        endPickDatePayment = end.format('YYYY-MM-DD');
    }

    $('#reportrangePayment').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "maxDate": moment(),
        "applyClass": "btn-primary",
        "autoApply": false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, setLabelAndVariables);

    $('#reportrangePayment').on('apply.daterangepicker', function (ev, picker) {
        Swal.fire({
            html: "Please Wait... Preparing Payment Logs...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        var s
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        sourceData_Payment(start, end);
    });

    setLabelAndVariables(start, end);
    sourceData_Payment(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
}

datatableApp_Payment_pending();
function datatableApp_Payment_pending(){
    tableData_Payment_pending = $('#Tbl_Payment_pending').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataPayment_pending,
        "scrollX": true,
        "order": [[10, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "invoiceNo", title:"Invoice No." },
            { data: "paymentDocNo", title:"Document. #" },
            { data: "paymentMode", title:"Mode" },
            { data: "transAmount", title:"Transaction Amount" },
            { data: "bank", title:"Bank"},
            { data: "checkNumber", title:"Check No." },
            { data: "checkDate", title:"Check Date" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[10, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Payment-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Payment-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });
    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Payment_pending').is(':visible')) {
            $('#Tbl_Payment_pending').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Payment_pending').is(':visible')) {
            $('#Tbl_Payment_pending').DataTable().button('.buttons-excel').trigger();
        }
    });

}

datatableApp_Payment_failed();
function datatableApp_Payment_failed(){
    tableData_Payment_failed = $('#Tbl_Payment_failed').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataPayment_failed,
        "scrollX": true,
        "order": [[11, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-failed-payment" />',
            },
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "invoiceNo", title:"Invoice No." },
            { data: "paymentDocNo", title:"Document. #" },
            { data: "paymentMode", title:"Mode" },
            { data: "transAmount", title:"Transaction Amount" },
            { data: "bank", title:"Bank"},
            { data: "checkNumber", title:"Check No." },
            { data: "checkDate", title:"Check Date" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[10, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Payment-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Payment-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Payment_failed').is(':visible')) {
            $('#Tbl_Payment_failed').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Payment_failed').is(':visible')) {
            $('#Tbl_Payment_failed').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-failed-payment').prop('checked', false);
    $('#select-all-failed-payment').on('click', function () {
        if (this.checked) {
            tableData_Payment_failed.rows({ search: 'applied' }).select();
        } else {
            tableData_Payment_failed.rows({ search: 'applied' }).deselect();
        }
    });
}

datatableApp_Payment_success();
function datatableApp_Payment_success(){
    tableData_Payment_success = $('#Tbl_Payment_success').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataPayment_success,
        "scrollX": true,
        "order": [[10, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "invoiceNo", title:"Invoice No." },
            { data: "paymentDocNo", title:"Document. #" },
            { data: "paymentMode", title:"Mode" },
            { data: "transAmount", title:"Transaction Amount" },
            { data: "bank", title:"Bank"},
            { data: "checkNumber", title:"Check No." },
            { data: "checkDate", title:"Check Date" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[10, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Payment-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Payment-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });
    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Payment_success').is(':visible')) {
            $('#Tbl_Payment_success').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Payment_success').is(':visible')) {
            $('#Tbl_Payment_success').DataTable().button('.buttons-excel').trigger();
        }
    });

}

datatableApp_Payment_exempted();
function datatableApp_Payment_exempted(){
    tableData_Payment_exempted = $('#Tbl_payment_exempted').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataPayment_exempted,
        "scrollX": true,
        "order": [[10, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-exempt-payment" />',
            },
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "invoiceNo", title:"Invoice No." },
            { data: "paymentDocNo", title:"Document. #" },
            { data: "paymentMode", title:"Mode" },
            { data: "transAmount", title:"Transaction Amount" },
            { data: "bank", title:"Bank"},
            { data: "checkNumber", title:"Check No." },
            { data: "checkDate", title:"Check Date" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[10, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Payment-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Payment-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });
    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Payment_exempted').is(':visible')) {
            $('#Tbl_Payment_exempted').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Payment_exempted').is(':visible')) {
            $('#Tbl_Payment_exempted').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-exempt-payment').prop('checked', false);
    $('#select-all-exempt-payment').on('click', function () {
        if (this.checked) {
            tableData_Payment_exempted.rows({ search: 'applied' }).select();
        } else {
            tableData_Payment_exempted.rows({ search: 'applied' }).deselect();
        }
    });
}

$('#searchBtn_Payment').on('keyup', function() {
    var searchTerm = $(this).val();

    tableData_Payment_pending.search(searchTerm).draw();
    tableData_Payment_failed.search(searchTerm).draw();
    tableData_Payment_success.search(searchTerm).draw();
});

//re process payment
$('#failedBtnPayment').on('click', function(){
    // Swal.fire({
    //     text: "This feature will be available soon.",
    //     icon: "info"
    // });

    GBLREPROCESSSELECTEDITEMS = [];
    var row = tableData_Payment_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            text: "Do you want to re-process only the selected payment transaction?",
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray();//
                reprocess_payment_transaction(GBLREPROCESSSELECTEDITEMS);
            } 
        });
    }

});

$('#nav-payment_fail-tab').on('shown.bs.tab', function () {
    $('#failedBtnPayment, #exemptBtnPayment').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                    let scale = 0.8 + (0.2 * now); 
                    $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-payment_fail-tab').on('hidden.bs.tab', function () {
    $('#failedBtnPayment, #exemptBtnPayment').prop("disabled", true).fadeOut(400); 
});

$('#nav-payment_exempted-tab').on('shown.bs.tab', function () {
    $('#revertBtnPayment').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                let scale = 0.8 + (0.2 * now); 
                $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-payment_exempted-tab').on('hidden.bs.tab', function () {
    $('#revertBtnPayment').prop("disabled", true).fadeOut(400); 
});

//exempt Payment
$('#exemptBtnPayment').on('click', function(){
    GBLREPROCESSSELECTEDITEMS = []; 
    var row = tableData_Payment_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to exempt the selected transaction?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These logs have already been handled/reflected in ERIC. If you continue, they will be moved to another tab and will no longer appear as failed in Ravamate.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray();//
                exempt_transaction(GBLREPROCESSSELECTEDITEMS, 'X', 'PAYMENTS');
            } 
        });
    }
});

//revert Payment
$('#revertBtnPayment').on('click', function(){
    GBLREVERTSELECTEDITEMS = []; 
    var row = tableData_Payment_exempted.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to revert the selected exempted transaction to fail?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These exempted logs will be returned to the Failed tab so they can be reprocessed.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREVERTSELECTEDITEMS = row.toArray();//
                exempt_transaction(GBLREVERTSELECTEDITEMS, 'E', 'PAYMENTS');
            } 
        });
    }
});


datePickerReturns();
function datePickerReturns() {
    var start = moment();
    var end = moment();

    function setLabelAndVariables(start, end) {
        if (start.format('MMMM D, YYYY') === end.format('MMMM D, YYYY')) {
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrangeReturns span').html('<b>' + dayOfWeek + '</b>' + ' | ' +
                start.format('MMMM D, YYYY'));
        } else {
            $('#reportrangeReturns span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        startPickDateReturns = start.format('YYYY-MM-DD');
        endPickDateReturns = end.format('YYYY-MM-DD');
    }

    $('#reportrangeReturns').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "maxDate": moment(),
        "applyClass": "btn-primary",
        "autoApply": false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, setLabelAndVariables);

    $('#reportrangeReturns').on('apply.daterangepicker', function (ev, picker) {
        Swal.fire({
            html: "Please Wait... Preparing Return Logs...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        var s
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        sourceData_Returns(start, end);
    });

    setLabelAndVariables(start, end);
    sourceData_Returns(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
}

datatableApp_Returns_pending();
function datatableApp_Returns_pending(){
    tableData_Returns_pending = $('#Tbl_Returns_pending').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataReturns_pending,
        "scrollX": true,
        "order": [[11, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "Salesman", title:"Salesman" },
            { data: "CustCode", title:"Customer Code" },
            { data: "InvoiceNo", title:"Invoice No." },
            { data: "Site", title:"Site" },
            { data: "ItemNumber", title:"Item No."},
            { data: "Um", title:"UM" },
            { data: "Quantity", title:"Quantity" },
            { data: "ReasonCode", title:"Reason Code" },
            // { data: "api_status", title:"API Status" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdate", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[11, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Returns-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Returns-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Returns_pending').is(':visible')) {
            $('#Tbl_Returns_pending').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Returns_pending').is(':visible')) {
            $('#Tbl_Returns_pending').DataTable().button('.buttons-excel').trigger();
        }
    });
}

datatableApp_Returns_failed();
function datatableApp_Returns_failed(){
    tableData_Returns_failed = $('#Tbl_Returns_failed').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataReturns_failed,
        "scrollX": true,
        "order": [[12, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-failed-returns" />',
            },
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "Salesman", title:"Salesman" },
            { data: "CustCode", title:"Customer Code" },
            { data: "InvoiceNo", title:"Invoice No." },
            { data: "Site", title:"Site" },
            { data: "ItemNumber", title:"Item No."},
            { data: "Um", title:"UM" },
            { data: "Quantity", title:"Quantity" },
            { data: "ReasonCode", title:"Reason Code" },
            // { data: "api_status", title:"API Status" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdate", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
        ],
        order: [[11, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Returns-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Returns-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Returns_failed').is(':visible')) {
            $('#Tbl_Returns_failed').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Returns_failed').is(':visible')) {
            $('#Tbl_Returns_failed').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-failed-returns').prop('checked', false);
    $('#select-all-failed-returns').on('click', function () {
        if (this.checked) {
            tableData_Returns_failed.rows({ search: 'applied' }).select();
        } else {
            tableData_Returns_failed.rows({ search: 'applied' }).deselect();
        }
    });
}

datatableApp_Returns_success();
function datatableApp_Returns_success(){
    tableData_Returns_success = $('#Tbl_Returns_success').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataReturns_success,
        "scrollX": true,
        "order": [[11, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "Salesman", title:"Salesman" },
            { data: "CustCode", title:"Customer Code" },
            { data: "InvoiceNo", title:"Invoice No." },
            { data: "Site", title:"Site" },
            { data: "ItemNumber", title:"Item No."},
            { data: "Um", title:"UM" },
            { data: "Quantity", title:"Quantity" },
            { data: "ReasonCode", title:"Reason Code" },
            // { data: "api_status", title:"API Status" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdate", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }              
        ],
        order: [[11, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Returns-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Returns-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Returns_success').is(':visible')) {
            $('#Tbl_Returns_success').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Returns_success').is(':visible')) {
            $('#Tbl_Returns_success').DataTable().button('.buttons-excel').trigger();
        }
    });
}

datatableApp_Returns_exempted();
function datatableApp_Returns_exempted(){
    tableData_Returns_exempted = $('#Tbl_returns_exempted').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataReturns_exempted,
        "scrollX": true,
        "order": [[11, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-exempt-returns" />',
            },
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "Salesman", title:"Salesman" },
            { data: "CustCode", title:"Customer Code" },
            { data: "InvoiceNo", title:"Invoice No." },
            { data: "Site", title:"Site" },
            { data: "ItemNumber", title:"Item No."},
            { data: "Um", title:"UM" },
            { data: "Quantity", title:"Quantity" },
            { data: "ReasonCode", title:"Reason Code" },
            // { data: "api_status", title:"API Status" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastUpdate", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "dateInserted", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }              
        ],
        order: [[11, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Returns-To-ERIC-LOGS-ManuallyHandled' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Returns-To-ERIC-LOGS-ManuallyHandled' + moment().format("DD-MMM-YYYY"),
            }
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_returns_exempted').is(':visible')) {
            $('#Tbl_returns_exempted').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_returns_exempted').is(':visible')) {
            $('#Tbl_returns_exempted').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-exempt-returns').prop('checked', false);
    $('#select-all-exempt-returns').on('click', function () {
        if (this.checked) {
            tableData_Returns_exempted.rows({ search: 'applied' }).select();
        } else {
            tableData_Returns_exempted.rows({ search: 'applied' }).deselect();
        }
    });
}

$('#searchBtn_Returns').on('keyup', function() {
    var searchTerm = $(this).val();

    tableData_Returns_pending.search(searchTerm).draw();
    tableData_Returns_failed.search(searchTerm).draw();
    tableData_Returns_success.search(searchTerm).draw();
});

$('#failedBtnReturns').on('click', function(){
    // Swal.fire({
    //     text: "This feature will be available soon.",
    //     icon: "info"
    // });
    GBLREPROCESSSELECTEDITEMS = [];
    var row = tableData_Returns_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            text: "Do you want to re-process only the selected payment transaction?",
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray();//
                reprocess_returns_transaction(GBLREPROCESSSELECTEDITEMS);
            } 
        });
    }
});

$('#nav-returns_fail-tab').on('shown.bs.tab', function () {
    $('#failedBtnReturns, #exemptBtnReturns').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                    let scale = 0.8 + (0.2 * now); 
                    $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-returns_fail-tab').on('hidden.bs.tab', function () {
    $('#failedBtnReturns, #exemptBtnReturns').prop("disabled", true).fadeOut(400); 
});

$('#nav-returns_exempted-tab').on('shown.bs.tab', function () {
    $('#revertBtnReturns').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                let scale = 0.8 + (0.2 * now); 
                $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-returns_exempted-tab').on('hidden.bs.tab', function () {
    $('#revertBtnReturns').prop("disabled", true).fadeOut(400); 
});

//exempt Payment
$('#exemptBtnReturns').on('click', function(){
    GBLREPROCESSSELECTEDITEMS = []; 
    var row = tableData_Returns_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to exempt the selected transaction?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These logs have already been handled/reflected in ERIC. If you continue, they will be moved to another tab and will no longer appear as failed in Ravamate.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray();
                exempt_transaction(GBLREPROCESSSELECTEDITEMS, 'X', 'RETURNS');
            } 
        });
    }
});

//revert Payment
$('#revertBtnReturns').on('click', function(){
    GBLREVERTSELECTEDITEMS = []; 
    var row = tableData_Returns_exempted.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to revert the selected exempted transaction to fail?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These exempted logs will be returned to the Failed tab so they can be reprocessed.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREVERTSELECTEDITEMS = row.toArray();
                exempt_transaction(GBLREVERTSELECTEDITEMS, 'E', 'RETURNS');
            } 
        });
    }
});



datePickerTransfer();
function datePickerTransfer() {
    var start = moment();
    var end = moment();

    function setLabelAndVariables(start, end) {
        if (start.format('MMMM D, YYYY') === end.format('MMMM D, YYYY')) {
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrangeTransfer span').html('<b>' + dayOfWeek + '</b>' + ' | ' +
                start.format('MMMM D, YYYY'));
        } else {
            $('#reportrangeTransfer span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        startPickDateTransfer = start.format('YYYY-MM-DD');
        endPickDateTransfer = end.format('YYYY-MM-DD');
    }

    $('#reportrangeTransfer').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "maxDate": moment(),
        "applyClass": "btn-primary",
        "autoApply": false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, setLabelAndVariables);

    $('#reportrangeTransfer').on('apply.daterangepicker', function (ev, picker) {
        Swal.fire({
            html: "Please Wait... Preparing Auto Transfer Logs...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        sourceData_Transfer(start, end);
    });

    setLabelAndVariables(start, end);
    sourceData_Transfer(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
}

datatableApp_Transfer_pending();
function datatableApp_Transfer_pending(){
    tableData_Transfer_pending = $('#Tbl_Transfer_pending').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataTransfer_pending,
        "scrollX": true,
        "order": [[8, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "SourceSite", title:"Source" },
            { data: "DestinationSite", title:"Destination" },
            { data: "ItemNumber", title:"Item No." },
            { data: "Um", title:"UM" },
            { data: "QtyOrdered", title:"Qty Ordered"},
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastupdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "DATECREATED", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            } 
        ],
        order: [[8, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Transfer-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Transfer-To-ERIC-LOGS-Pending-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        columnDefs: [
            {
                targets: [1, 2, 4, 5],
                className: 'text-center'
            },
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Transfer_pending').is(':visible')) {
            $('#Tbl_Transfer_pending').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Transfer_pending').is(':visible')) {
            $('#Tbl_Transfer_pending').DataTable().button('.buttons-excel').trigger();
        }
    });

}

datatableApp_Transfer_failed();
function datatableApp_Transfer_failed(){
    tableData_Transfer_failed = $('#Tbl_Transfer_failed').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataTransfer_success,
        "scrollX": true,
        "order": [[9, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-failed-transfer" />',
            },
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "SourceSite", title:"Source" },
            { data: "DestinationSite", title:"Destination" },
            { data: "ItemNumber", title:"Item No." },
            { data: "Um", title:"UM" },
            { data: "QtyOrdered", title:"Qty Ordered"},
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastupdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "DATECREATED", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            } 
        ],
        order: [[8, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Transfer-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Transfer-To-ERIC-LOGS-Failed-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        columnDefs: [
            {
                targets: [1, 2, 4, 5],
                className: 'text-center'
            },
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Transfer_failed').is(':visible')) {
            $('#Tbl_Transfer_failed').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Transfer_failed').is(':visible')) {
            $('#Tbl_Transfer_failed').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-failed-transfer').prop('checked', false);
    $('#select-all-failed-transfer').on('click', function () {
        if (this.checked) {
            tableData_Transfer_failed.rows({ search: 'applied' }).select();
        } else {
            tableData_Transfer_failed.rows({ search: 'applied' }).deselect();
        }
    });
}

datatableApp_Transfer_success();
function datatableApp_Transfer_success(){
    tableData_Transfer_success = $('#Tbl_Transfer_success').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": sourceDataTransfer_success,
        "scrollX": true,
        "order": [[8, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "SourceSite", title:"Source" },
            { data: "DestinationSite", title:"Destination" },
            { data: "ItemNumber", title:"Item No." },
            { data: "Um", title:"UM" },
            { data: "QtyOrdered", title:"Qty Ordered"},
            // { data: "api_status", title:"API Status" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastupdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "DATECREATED", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }   
        ],
        order: [[8, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Transfer-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Transfer-To-ERIC-LOGS-Success-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        columnDefs: [
            {
                targets: [1, 2, 4, 5],
                className: 'text-center'
            },
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Transfer_success').is(':visible')) {
            $('#Tbl_Transfer_success').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Transfer_success').is(':visible')) {
            $('#Tbl_Transfer_success').DataTable().button('.buttons-excel').trigger();
        }
    });
}

datatableApp_Transfer_exempted();
function datatableApp_Transfer_exempted(){
    tableData_Transfer_exempted = $('#Tbl_Transfer_exempted').DataTable({
        "dom": "t<'d-flex justify-content-end align-items-center pt-2 pb-4'<'infoCont' i><'paginationCont dataTableBotPag'p>>",
        "responsive": false,
        "data": [],
        "scrollX": true,
        "order": [[8, "desc"]],
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
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
                title: '<input type="checkbox" id="select-all-exempt-transfer" />',
            },
            { data: "MyBuddyTransNumber", title:"Transaction ID" },
            { data: "SourceSite", title:"Source" },
            { data: "DestinationSite", title:"Destination" },
            { data: "ItemNumber", title:"Item No." },
            { data: "Um", title:"UM" },
            { data: "QtyOrdered", title:"Qty Ordered"},
            // { data: "api_status", title:"API Status" },
            { 
                data: "api_status", 
                title:"API Status",
                render: function(data, type) {
                    if (data && data == "S"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Success</span>`;
                    } else if (data && data == "E"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Error</span>`;
                    } else if (data && data == "X"){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #6c757d; border: 1px solid #6c757d; background-color: #e9ecef;'>Exempted</span>`;
                    } else{
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>To Sync</span>`;
                    };
                } 
            },
            { data: "api_response", title:"API Response" },
            { 
                data: "lastupdated", 
                title: "Last Updated",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            },
            { 
                data: "DATECREATED", 
                title: "Date Added",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }   
        ],
        order: [[8, 'desc']],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'csvHtml5',
                className: 'buttons-csv',
                text: 'CSV',
                title: '',
                filename: 'Transfer-To-ERIC-LOGS-ManuallyHandled-' + moment().format("DD-MMM-YYYY"),
            },
            {
                extend: 'excelHtml5',
                className: 'buttons-excel',
                text: 'Excel',
                title: '', 
                filename: 'Transfer-To-ERIC-LOGS-ManuallyHandled-' + moment().format("DD-MMM-YYYY"),
            }
        ],
        columnDefs: [
            {
                targets: [1, 2, 4, 5],
                className: 'text-center'
            },
        ],
    });

    $('.ericBtnCSV').on('click', function() {
        if ($('#Tbl_Transfer_exempted').is(':visible')) {
            $('#Tbl_Transfer_exempted').DataTable().button('.buttons-csv').trigger();
        }
    });

    $('.ericBtnExcel').on('click', function() {
        if ($('#Tbl_Transfer_exempted').is(':visible')) {
            $('#Tbl_Transfer_exempted').DataTable().button('.buttons-excel').trigger();
        }
    });

    $('#select-all-exempt-transfer').prop('checked', false);
    $('#select-all-exempt-transfer').on('click', function () {
        if (this.checked) {
            tableData_Transfer_exempted.rows({ search: 'applied' }).select();
        } else {
            tableData_Transfer_exempted.rows({ search: 'applied' }).deselect();
        }
    });
}


$('#searchBtn_Transfer').on('keyup', function() {
    var searchTerm = $(this).val();

    tableData_Transfer_pending.search(searchTerm).draw();
    tableData_Transfer_failed.search(searchTerm).draw();
    tableData_Transfer_success.search(searchTerm).draw();
});

$('#failedBtnTransfer').on('click', function(){
    // Swal.fire({
    //     text: "This feature will be available soon.",
    //     icon: "info"
    // });

    GBLREPROCESSSELECTEDITEMS = [];
    var row = tableData_Transfer_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            text: "Do you want to re-process only the selected payment transaction?",
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray();//
                reprocess_stocktransfer_transaction(GBLREPROCESSSELECTEDITEMS);
            } 
        });
    }


});

$('#nav-transfer_fail-tab').on('shown.bs.tab', function () {
    $('#failedBtnTransfer, #exemptBtnTransfer').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                    let scale = 0.8 + (0.2 * now); 
                    $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-transfer_fail-tab').on('hidden.bs.tab', function () {
    $('#failedBtnTransfer, #exemptBtnTransfer').prop("disabled", true).fadeOut(400); 
});

$('#nav-transfer_exempted-tab').on('shown.bs.tab', function () {
    $('#revertBtnTransfer').prop("disabled", false).css({ display: 'block', opacity: 0, transform: 'scale(0.8)' })
        .animate({ opacity: 1 }, 
            { duration: 300, step: function (now, fx) {
                let scale = 0.8 + (0.2 * now); 
                $(this).css('transform', 'scale(' + scale + ')');
        }});
});

$('#nav-transfer_exempted-tab').on('hidden.bs.tab', function () {
    $('#revertBtnTransfer').prop("disabled", true).fadeOut(400); 
});

//exempt Transfer
$('#exemptBtnTransfer').on('click', function(){
    GBLREPROCESSSELECTEDITEMS = []; 
    var row = tableData_Transfer_failed.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to exempt the selected transaction?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These logs have already been handled/reflected in ERIC. If you continue, they will be moved to another tab and will no longer appear as failed in Ravamate.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREPROCESSSELECTEDITEMS = row.toArray(); 
                exempt_transaction(GBLREPROCESSSELECTEDITEMS, 'X', 'STOCK_TRANSFER');
            } 
        });
    }
});

//revert Transfer
$('#revertBtnTransfer').on('click', function(){
    GBLREVERTSELECTEDITEMS = []; 
    var row = tableData_Transfer_exempted.rows({ selected: true }).data();
    if(row.length == 0){
        Swal.fire({
            text: "No Data Selected.",
            icon: "info"
        });
    }else{
        Swal.fire({
            html: `<h5>Do you want to revert the selected exempted transaction to fail?</h5><br/><span style='font-size:11px;'><b>NOTE:</b> <i> These exempted logs will be returned to the Failed tab so they can be reprocessed.</i></span>`,
            icon: "warning",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GBLREVERTSELECTEDITEMS = row.toArray(); 
                exempt_transaction(GBLREVERTSELECTEDITEMS, 'E', 'STOCK_TRANSFER');
            } 
        });
    }
});

function viewDetails_dataModal(transacID, rowData){
    console.log("transacID",rowData);
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_SO_DETAILS_ERIC_LOGS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "transactionID":transacID, "itemCode":rowData.itemNumber},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(response){
            var r = response[0];
            $('#modal_salesman').html(r.SALESMAN_DETAILS[0].mdName);
            if(rowData.api_status == null){
                $('#modal_status').html('PENDING');
                $('#modal_api_status').html('PENDING');
                $('.resendBtn').show();
            }else if(rowData.api_status != null && (rowData.api_status).trim() == "S"){
                $('#modal_status').html('SUCCESS'  + '<span class="mdi mdi-check-decagram" style="color: #61C711;"></span>');
                $('#modal_api_status').html('SUCCESS'  + '<span class="mdi mdi-check-decagram" style="color: #61C711;"></span>');
                $('.resendBtn').hide();
            } else{
                $('#modal_status').html('ERROR' + '<span class="mdi mdi-close-circle-outline" style="color: #FF0000;"></span>');
                $('#modal_api_status').html('ERROR' + '<span class="mdi mdi-close-circle-outline" style="color: #FF0000;"></span>');
                $('.resendBtn').show();
            }
            $('#modal_docNo').html(r.transactionID);
            $('#itemCodeHeaderRowDate').html(moment(r.deliveryDate).format("MMMM D, YYYY"));
            $('#modal_mdCode').html(r.SALESMAN_DETAILS[0].mdCode + " (" + r.SALESMAN_DETAILS[0].DefaultOrdType + ")");
            $('#modal_WHCode').html(r.SALESMAN_DETAILS[0].WarehouseCode);
            $('#modal_WHBO').html(r.SALESMAN_DETAILS[0].BOWarehouse);
            $('#modal_GSRW').html(r.SALESMAN_DETAILS[0].GoodStockReturnWarehouse);
            
            $('#modal2_customername').html(r.custName.split(" ").slice(0, -1).join(" "));
            $('#modal2_customerID').html(r.custCode);
            $('#modal2_address').html(r.address);
            $('#modal2_refnoH').html(r.refno + '<span class="mdi mdi-barcode"></span>');
            $('#modal2_transactionD').html(formatDate(r.deliveryDate.split(" ")[0]));
            $('#modal2_transactionT').html(r.deliveryDate.split(" ")[1]);
            $('#modal2_battPercentage').html(r.batteryStat + "%");
            $('#modal2_remarks').html(rowData.api_response);

            console.log(r);
            var cont = '';
            var ctr = 0;
            for(var x = 0; x < r.TRANSACTION_DETAILS.length; x++){
                ctr++;
                cont += '<tr>'+
                            '<td>'+r.TRANSACTION_DETAILS[x].stockCode+'</td>'+
                            '<td style="text-align: left !important;">'+r.TRANSACTION_DETAILS[x].Description+'</td>'+
                            '<td style="text-align: center !important;">'+r.TRANSACTION_DETAILS[x].quantity+'</td>'+
                            '<td style="text-align: right !important;">₱ '+(parseFloat(r.TRANSACTION_DETAILS[x].piecePrice) * parseFloat(r.TRANSACTION_DETAILS[x].quantity)).toFixed(2)+'</td>'+
                        '</tr>';
            }
            for(; ctr < 2; ctr++){
                cont += '<tr style="height:41.1167px">'+
                            '<td></td>'+
                            '<td style="text-align: left !important;"></td>'+
                            '<td style="text-align: center !important;"></td>'+
                            '<td style="text-align: right !important;"></td>'+
                        '</tr>';
            }
            $('#salesDetailsBody').html(cont);
            $('#salesDmodal').modal('show');

            Swal.close();
        }
    });
} 

function formatDate(originalDateString){
    var parts = originalDateString.split('-'); 
    var formattedDateString = parts[1] + '/' + parts[2] + '/' + parts[0]; 
    return formattedDateString;
}

function resendItem(){
    Swal.fire({
        icon: "info",
        title: 'Feature will be available soon.',
    });
}




datatableApp_payment();
var paymentTableData;
function datatableApp_payment(){
    paymentTableData = $('#paymentPerTransaction_TAB').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTableBottomPagination"p>>',
        "responsive": false,
        "data": sourcepaymentDat,
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
                title: '<input type="checkbox" id="select-all-payment" />',
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
            {
                text: 'Process To ERIC',
                className: 'approveBtn_stocReq customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                    console.log(paymentTableData.rows({ selected: true }).data());
                    GBLSELECTEDPAYMENTS = [];

                    var row = paymentTableData.rows({ selected: true }).data();
                    if(row.length == 0){
                        Swal.fire({
                            text: "No Data Selected.",
                            icon: "info"
                        });
                    }else{
                        Swal.fire({
                            text: "Do you want to sync only the selected payments?",
                            icon: "warning",
                            cancelButtonColor: "#d33",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Yes, Sync",
                            showCancelButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                GBLSELECTEDPAYMENTS = row.toArray(); 
                                sendpaymentstoeric_per_transaction(GBLSELECTEDPAYMENTS);
                            } 
                        });
                    }
                }
            },

        ],
        rowCallback: function(row, data, index){

        },
      
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    // Bypassing the table alignment to automatically align when loadded
    setTimeout(function() {
        $("#statusHeader").click();
        $("#salesmanHeader").click();
        $("#statusHeader").click();
        $("#statusHeader").click();
    }, 5000);

    $('#select-all-payment').prop('checked', false);
    $('#select-all-payment').on('click', function () {
        if (this.checked) {
            paymentTableData.rows({ search: 'applied' }).select();
        } else {
            paymentTableData.rows({ search: 'applied' }).deselect();
        }
    });
}

var sourcepaymentDat = [];
function getPaymentSourceData(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_PAYMENT_PER_TRANSACTION", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.length != 0){ 
                sourcepaymentDat = r;
                paymentTableData.clear().rows.add(sourcepaymentDat).draw();
                $('#paymentPerTransaction_TAB').show();
                ercpaymentloadSalesman();

                $("#select-all-payment").prop("checked", false);
            }
        }
    });
}

function exec_eric_payment_per_transaction(){
    $('#syncpaymenttoericmoda_perTrans').modal('show');
    $('#paymentchoicesModal').modal('hide');
}

function sendpaymentstoeric_per_transaction(datatosync){
    var localdata = [];
    for(var x =0; x < datatosync.length; x++){
        localdata.push(datatosync[x].MyBuddyTransNumber);
    }

    insertsyncLogs('ERIC_PAYMENTS_PER_TRANSACTION_SYNCHING');

    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing payments transactions to ERIC please wait...</p>',
        backdrop: true,
        className: 'SOSyncing_bootbox'
        // closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"SYNC_PAYMENTS_ERIC_PER_TRANSACTIONS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "datatosync":localdata},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(response){   
            var resp_cont = eric_response(response);
            if(response){
                botboxMsg = '<div><b style="color: green;">Success!</b><p>Payment transactions successfully sync to ERIC. Thank You!</p>'+
                            '<br>ERIC API Response: <br>'+resp_cont;
            }else{
                botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Payment transactions to Eric!</b>' + response;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Payment transaction to Eric!</b><br>' + XMLHttpRequest.responseText;
            var totalTime = new Date().getTime()-ajaxTime;
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                    dialog.find('.bootbox-close-button').on('click', function () {
                    // automaticResyncAfterSO();
                });
                }, 1000);
            });
        }
    }).done(function () {
        dialog.init(function(){
            setTimeout(function(){
                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                dialog.find('.bootbox-close-button').on('click', function () {
                    $('#syncpaymenttoericmoda_perTrans').modal('hide');
                    automaticResyncAfterSO();
                });
            }, 1000);
        });
    });
}


function sendpaymentstoeric_per_salesman(){
    var salesmanlist = $('#salesmanList_paymenteric').val();

    if(salesmanlist == undefined || salesmanlist == ''){
        Swal.fire({
            text: "Please select a salesman.",
            icon: "info"
        });
    }else{
        Swal.fire({
            icon: "question",
            text: "This could take time, please wait while we process your request.",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Okay",
        }).then((result) => {
            if (result.isConfirmed) {
                insertsyncLogs('ERIC_PAYMENTS_PER_SALESMAN_SYNCHING');
                var dialog = bootbox.dialog({
                    message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Syncing payments transactions to ERIC please wait...</p>',
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
                            "type":"SYNC_PAYMENTS_ERIC_PER_SALESMAN",
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
                            botboxMsg = '<div><b style="color: green;">Success!</b><p>Payment transactions successfully sync to ERIC. Thank You!</p>'+
                                        '<br>ERIC API Response: <br>'+resp_cont;
                        }else{
                            botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Payment transactions to Eric!</b>' + response;
                        }

                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        botboxMsg = '<b style="color: red;">Ops! Unable to Sync to Payment transactions to Eric!</b><br>' + XMLHttpRequest.responseText;
                        var totalTime = new Date().getTime()-ajaxTime;
                        dialog.init(function(){
                            setTimeout(function(){
                                dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                                dialog.find('.bootbox-close-button').on('click', function () {
                                    automaticResyncAfterSO();
                                });
                            }, 1000);
                            
                        });
                    }
                }).done(function () {
                    dialog.init(function(){
                        setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                            dialog.find('.bootbox-close-button').on('click', function () {
                                automaticResyncAfterSO();
                            });
                        }, 1000);
                    });
                });
            } 
        })
    } 
    
    
}


// EXEMPT TRANSACTIONS FROM FAILED LOGS TO EXEMPTED LOGS:


function exempt_transaction(datatosync, exec_status, ravamate_module){
    var localdata = [];
    for(var x=0; x < datatosync.length; x++){
        localdata.push(datatosync[x].MyBuddyTransNumber);
    }

    var uniqueArray = localdata.filter(function(item, index) {
        return localdata.indexOf(item) === index;
    });

    console.log(uniqueArray);
    insertsyncLogs(`EXEMPT_${ravamate_module}`);

    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Ongoing exemption of transaction please wait...</p>',
        backdrop: true
        // closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"EXEC_EXCEMPT_RAVAMATE_TO_ERIC_TRANSACTIONS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "datatosync":uniqueArray, exec_status, ravamate_module},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(response){   
            if(response){
                botboxMsg = `<div><b style="color: green;">Success!</b><p>${response.Message}</p>`;
            }else{
                botboxMsg = '<b style="color: red;">Ops! Unable to Exempt Records!</b>' + response.Message;
            }

            getercpendingrec();
            stockRequestSourceData();
            datePickerSO();
            datePickerPayment();
            datePickerReturns();
            datePickerTransfer();
            // ercsoloadSalesman();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Unable to Exempt Records!</b><br>' + XMLHttpRequest.responseText;
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