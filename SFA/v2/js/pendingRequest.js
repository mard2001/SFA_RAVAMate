

// getcompname();
getcompname_dynamic("", "titleHeading");
datatableApp();
datePicker_so();
var respond = '';
var startPickDate_so, endPickDate_so, if1dayisSelected_so;
var startPickDate_cmf, endPickDate_cmf, if1dayisSelected_cmf;
var sourceDat;

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            // $('#titleHeading').html(r[0].company.toUpperCase() +' | Hold Orders | v.1.9.1');
            $('#titleHeading').html(r[0].company.toUpperCase());
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            var s = '180.232.64.82,6001';
            var d = 'MondeSFA';
            var u = 'sfauser';
            var p = 'WtbmCU2A';

            var encryptedS =  CryptoJS.AES.encrypt(s,"/");
            var encryptedU =  CryptoJS.AES.encrypt(u,"/");
            var encryptedP =  CryptoJS.AES.encrypt(p,"/");
            var encryptedD =  CryptoJS.AES.encrypt(d,"/");

            localStorage.setItem("srvr", encryptedS);
            localStorage.setItem("usrnm", encryptedU);
            localStorage.setItem("psswrd", encryptedP);
            localStorage.setItem("dtbse", encryptedD);

            location.reload();
            
        }
    });
} 

function datePicker_so() {
    const start = moment();
    const end = moment();

    startPickDate_so = start.format('MMMM D, YYYY');
    endPickDate_so = end.format('MMMM D, YYYY');

    $('.filterdate_so').daterangepicker({
        alwaysShowCalendars: true,
        startDate: moment(),
        endDate: moment(),
        maxDate: moment(),
        applyClass: "btn-primary",
        autoApply: false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ]
        }
    });
    $('.filterdate_so').on('apply.daterangepicker', function(ev, picker) {
        Swal.fire({
            html: "Please wait... Getting data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => { // Setting timeout so that Swal can execute well.
                    const d1 = picker.startDate;
                    const d2 = picker.endDate;
                    if1dayisSelected_so = d2.diff(d1, 'days');

                    startPickDate_so = d1.format('YYYY-MM-DD');
                    endPickDate_so = d2.format('YYYY-MM-DD');

                    SOSourceData(startPickDate_so, endPickDate_so); 
                    tableData.clear().rows.add(sourceDat).draw();
                }, 1500);
            }
        });
    });
}

function SOSourceData(start, end){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
                "type":"GET_PENDING_REQ",
                "start":start,
                "end":end,
                "appvid":localStorage.getItem('pndingrqAccID'),
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            console.log(r);
            if(r.lenght != 0){ 
                sourceDat = r;
                Swal.close();
            }else{
                Swal.fire({
                    icon: "info",
                    html: 'NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                icon: "error",
                title: "Ops! Something went wrong!",
                html: "CONTACT SYSTEM ADMINISTRATOR! " + XMLHttpRequest.responseText
            });
        }
    });
}

function datatableApp(){
    tableData = $('table.pendingSO_TBL').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTableBottomPagination"p>>',
        responsive: false,
        data: sourceDat,
        scrollX: true,
        ordering: true,
        columns: [
            { data: "transType", title: "Trans Type" },
            { data: "transDate", title: "Trans Date" },
            { data: "mdCode", title: "MdCode" },
            { data: "refNo", title: "Reference No."},
            { data: "SKUCount", title: "No. of SKU" },
            { data: "VolumeQty", title: "Volume Qty." },
            { data: "Amount", title: "Amount" },
            { data: "ApprovalStatus", title: "Status" },
            { data: "Remarks", title: "Remarks" },
            { data: "ApproveDate", title: "Last Updated" },
        ],
        buttons: [
            {
                extend: 'collection',
                className: 'customDTTables dt-button buttons-collection',
                text: '<i class="fa fa-file-archive-o"></i> Others',
                autoClose: true,
                buttons: [
                    'excel', 'csv'
                ]
            },
            {
                text: '<i class="fas fa-calendar-alt"></i> Filter Date',
                className: 'filterdate_so customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                }
            }
        ],
        columnDefs: [
            {
                targets: [2, 3, 4, 5, 7],
                className: 'text-center',
            },
            {
                targets: [6],
                className: 'text-end',
                render: function (data, type, row, meta) {
                    return '₱' + Number(parseFloat(data).toFixed(2)).toLocaleString();
                }
            },
        ],
        rowCallback: function(row, data, index){
            var stat = data.ApprovalStatus.toString().toUpperCase();
            // var salesFormat = data.Sales.toString();
            if(stat == 'APPROVED'){
                // $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'green', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                $(row).find('td:eq(7)').html(`<span class="badge rounded-pill py-1 mx-2" style='width:80px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>${stat}</span>`);
            }else if(stat == 'DENIED'){
                // $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'red', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                $(row).find('td:eq(7)').html(`<span class="badge rounded-pill py-1 mx-2" style='width:80px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>${stat}</span>`);
            }else{
                // $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'orange', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                $(row).find('td:eq(7)').html(`<span class="badge rounded-pill py-1 mx-2" style='width:80px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>${stat}</span>`);
            }
        }
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    $('table.pendingSO_TBL tbody').on( 'click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
    });
}

function viewDetails(r){
    $('#req_remarks').val('');
    $('#upt_transtype').html(r.transType);
    $('#upt_transdate').html(formatDate(r.transDate));
    $('#upt_mdcode').html(r.mdCode);
    $('#upt_refno').html(r.refNo);
    $('#upt_sku').html(r.SKUCount);
    $('#upt_vol').html(r.VolumeQty);
    $('#upt_amt').html(r.Amount);
    $('#upt_status').html(statchecker(r.ApprovalStatus));
    $('#upt_remarks').html(r.Remarks);
    $('#cIDHolder').val(r.cID);
    $('#mdCodeHolder').val(r.mdCode);
    $('#appvNumHolder').val(r.ApproverContactNumber);
    $('#otpHolder').val(r.ApprovalCode);

    var checker = r.transactionDetails;
    var cont = ``;
    console.log(r);
    if(checker.length == 0){
        cont = `<tr style="color: red !important; text-align: center;">
                    <td colspan="2">
                    Unable to view SO details. You need to approve this transaction first.
                    </td>
                </tr>`;
    }else{
        cont = `<tr>
                    <td>Transaction ID:</td>
                    <td>`+r.transactionDetails[0].transactionID	+`</td>
                </tr>
                <tr>
                    <td>Reference #:</td>
                    <td>`+r.transactionDetails[0].refno	+`</td>
                </tr>
                <tr>
                    <td>Customer Code:</td>
                    <td>`+r.transactionDetails[0].custCode+` - `+r.custName+`</td>
                </tr>
                <tr>
                    <td>Transaction Date:</td>
                    <td>`+formatDate(r.transactionDetails[0].deliveryDate)+`</td>
                </tr>
                <tr>
                    <td>Amount:</td>
                    <td>`+r.transactionDetails[0].totalAmount	+`</td>
                </tr>
                <tr>
                    <td>LongLat</td>
                    <td>`+r.transactionDetails[0].longitude+` - `+r.transactionDetails[0].latitude+`</td>
                </tr>`;
    }

    $('#transacitondetails_data').html(cont);
    $('#pendingReqmodal').modal('show');
}

function statchecker(stat){
    $('.resendBtn').show();
    if(stat == 'PENDING'){
        $('.btnactions').show();
        return '<span style="color:orange; font-weight: bold;">PENDING</span>';
    }else if(stat == 'DENIED'){
        $('.btnactions').hide();
        return '<span style="color:red; font-weight: bold;">DENIED</span>';
    }else if(stat == 'APPROVED'){
        $('.btnactions').hide();
        $('.resendBtn').show();
        return '<span style="color:green; font-weight: bold;">APPROVED</span>';
    }else{
        $('.btnactions').hide();
        return '<span style="color:green; font-weight: bold;">APPROVED</span>';
    }
}

function formatDate(rawDate){
    let dateObj = new Date(rawDate.replace(' ', 'T'));

    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    let formatted = dateObj.toLocaleString('en-US', options);

    return formatted;
}

function denyreq(){
    Swal.fire({
        icon: 'info',
        text: "Are you sure you want to deny this request?",
        showDenyButton: true,
        showConfirmButton: false,
        showCancelButton: true,
        denyButtonText: "Yes, Deny",
    }).then((result) => {
        if (result.isDenied) {
            respond = 'DENIED';
            $('#actionModal').modal('show');
            // Swal.fire("Request Successfully Denied", "", "success");
        }
    });
}

function appvreq(){
    Swal.fire({
        icon: 'info',
        text: "Are you sure you want to approve this request?",
        showDenyButton: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
    }).then((result) => {
        if (result.isConfirmed) {
            respond = 'APPROVED';
            $('#actionModal').modal('show');
            // Swal.fire("Request Successfully Denied", "", "success");
        }
    });
}

function resendappvreq(){
    Swal.fire({
        icon: 'info',
        text: "Are you sure you want to re-send this request for approval?",
        showDenyButton: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, Re-send",
    }).then((result) => {
        if (result.isConfirmed) {
            respond = 'APPROVED';
            $('#actionModal').modal('show');
            // Swal.fire("Request Successfully Denied", "", "success");
        }
    });
}

function submitreq(){
    var remarks = $('#req_remarks').val();
    var cIDHolder = $('#cIDHolder').val();

    Swal.fire({
        html: "Please wait... Executing request...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            setTimeout(() => { // Setting timeout so that Swal can execute well.
                execmodule(respond, cIDHolder, remarks);
            }, 1500);
        }
    });
}

function execmodule(reqstat, cID, remarks){
    var reqType = $('#upt_transtype').text();
    var mdCode = $('#mdCodeHolder').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
                "type":"EXEC_PENDING_REQ_APPV",
                cID:cID,
                appvStat:reqstat,
                remarks:remarks,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            Swal.close()
            if(r){ 
                var message = 'Your request for ' +reqType+ ' was ' + reqstat+' by the approving officer.';
                pushnotif(mdCode, 'OTPApproval', message, reqstat);
                Swal.fire({
                    icon: "success",
                    text: 'Request Successfully ' + reqstat,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    location.reload();
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                icon: "error",
                title: "Ops! Something went wrong!",
                html: "CONTACT SYSTEM ADMINISTRATOR! " + XMLHttpRequest.responseText
            });
        }
    });
}

function pushnotif(mdCode, header, message, reqstat){
    var ACCESS_TOKEN = get_firebase_accesstoken();;
    var DEVICETOKEN = getToken(mdCode);
    var approverNumber = $('#appvNumHolder').val();
    var otp = $('#otpHolder').val();

    // Notification payload
    const notificationPayload = {
        message: {
        token: DEVICETOKEN,  // The FCM device token of the target device
        notification:  {
            title: header,
            body: message
        },
        data: {
                title: header,
                body: message,
                approverNumber:approverNumber,
                otp:otp,
                status:reqstat
            }
        }
    };

    fetch(`https://fcm.googleapis.com/v1/projects/ravamate/messages:send`, {
        method: 'POST',
        headers: {
        'Authorization': 'Bearer ' + ACCESS_TOKEN,  // OAuth 2.0 Bearer token
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPayload),  // The notification payload
    })
    .then(response => response.json())
    .then(data => {
        console.log('Notification sent successfully:', data);
        // update_notif_status(cID);
    })
    .catch((error) => {
        console.error('Error sending notification:', error);
    });
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

function get_firebase_accesstoken(){
    var token = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
                "type":"GET_ACCESS_TOKEN",
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
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


// CMF PART

function datePicker_cmf() {
    const start = moment();
    const end = moment();

    startPickDate_cmf = start.format('MMMM D, YYYY');
    endPickDate_cmf = end.format('MMMM D, YYYY');

    $('.filterdate_cmf').daterangepicker({
        alwaysShowCalendars: true,
        startDate: moment(),
        endDate: moment(),
        maxDate: moment(),
        applyClass: "btn-primary",
        autoApply: false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ]
        }
    });
    $('.filterdate_cmf').on('apply.daterangepicker', function(ev, picker) {
        Swal.fire({
            html: "Please wait... Getting Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => { // Setting timeout so that Swal can execute well.
                    const d1 = picker.startDate;
                    const d2 = picker.endDate;
                    if1dayisSelected_cmf = d2.diff(d1, 'days');

                    startPickDate_cmf = d1.format('YYYY-MM-DD');
                    endPickDate_cmf = d2.format('YYYY-MM-DD');
                    
                    customerData(startPickDate_cmf, endPickDate_cmf);
                    tableData_cmf.clear().rows.add(sourceData_cmf).draw();
                }, 1500);
            }
        });
    });
}

customerDataTable();
datePicker_cmf();

var sourceData_cmf;
var tableData_cmf;
function customerData(start, end){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
                "type":"GET_CMF_DATA",
                'start':start,
                'end':end,
                "distCode": GBL_DISTCODE
            },
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            sourceData_cmf = r;
            Swal.close();
        }
    });
}

function customerDataTable(){
    tableData_cmf = $('table.pendingCMF_TBL').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTableBottomPagination"p>>',
        responsive: false,
        data: sourceData_cmf,
        scrollX: true,
        ordering: true,
        columns: [
            { data: "STATUS", title: "Status" },
            { data: "SALESPERSON", title: "Salesperson" },
            { data: "CUSTCODE", title: "Customer Code" },
            { data: "SOLDTONAME", title: "Sold To Name"},
            { data: "CUST_CONT_PERSON", title: "Contact Person" },
            { data: "CUST_CONTNO", title: "Contact Number" },
            { data: "EMAIL", title: "Email" },
            { data: "GEOAREA", title: "Geo Area" },
            { data: "CHAIN", title: "Chain" },
            { data: "COV_DAY", title: "Coverage Day" },
            { data: "TIN", title: "TIN" },
            { data: "SLD_POSTCODE", title: "Postal Code" },
            { data: "SHP_MUNICIPALITY_CITY_PROV", title: "Municipality" },
            { data: "SHP_STREET_BRGY", title: "Barangay" },
            { data: "LONGITUDE", title: "Longitude" },
            { data: "LATITUDE", title: "Latitude" },
            { data: "SHP_OTHERINFO", title: "Other Info (Ship To)" },
            { data: "SLD_OTHERINFO", title: "Other Info (Sold To)" },
            { data: "CUST_CLASS", title: "Customer Class" },
            { data: "COV_FREQ", title: "Frequency" },
            { data: "REQ_DATE", title: "Request Date" }
        ],
        buttons: [
            {
                extend: 'collection',
                className: 'customDTTables dt-button buttons-collection',
                text: '<i class="fa fa-file-archive-o"></i> Others',
                autoClose: true,
                buttons: [
                    'excel', 'csv'
                ]
            },
            {
                text: '<i class="fas fa-calendar-alt"></i> Filter Date',
                className: 'filterdate_cmf customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                }
            }
        ],
        // columnDefs: [
        //     {
        //         targets: [2, 3, 4, 5, 7],
        //         className: 'text-center',
        //     },
        //     {
        //         targets: [6],
        //         className: 'text-end',
        //     },
        // ],
        rowCallback: function(row, data, index){
            var statIndicator = data.STATUS.toString();
            // var salesFormat = data.Sales.toString();

            if($.trim(statIndicator) == '2'){
                // $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'green', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                $(row).find('td:eq(0)').html(`<span class="badge rounded-pill py-1 mx-2" style='width:80px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>APPROVED</span>`);
            }else if($.trim(statIndicator) == '1'){
                // $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'red', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                $(row).find('td:eq(0)').html(`<span class="badge rounded-pill py-1 mx-2" style='width:80px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>PENDING</span>`);
            }else{
                // $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'orange', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                $(row).find('td:eq(0)').html(`<span class="badge rounded-pill py-1 mx-2" style='width:80px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>DENIED</span>`);
            }
        }
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    $('table.pendingCMF_TBL tbody').on( 'click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData_cmf.row(tr);
        cmfDetails(row.data());
    });
}

function cmfDetails(r){
    console.log(r);
    $('#vl_cmfID').html(r.CMFID);
    $('#vl_custCode').html(r.CUSTCODE);
    // $('#vl_soldname').html(r.SOLDTONAME);
    $('#vl_salesperson').html(r.SALESPERSON);
    // $('#vl_custnumber').html(r.CUST_CONTNO);
    // $('#vl_address').html(r.SHP_STREET_BRGY);
    $('#vl_reqdate').html(r.REQ_DATE);
    $('#vl_stat').html(r.STAT_DIFF);

    $('#cmfstatdiff').val(r.STATUS);
    $('#cmfIDHolder').val(r.cID);

    $('#vl_soldname').val(r.SOLDTONAME);
    // $('#vl_salesperson').val(r.SALESPERSON);
    $('#vl_custnumber').val(r.CUST_CONTNO);
    $('#vl_address').val(r.SHP_STREET_BRGY);

    $('#vl_contactperson').val(r.CUST_CONT_PERSON);
    $('#vl_email').val(r.EMAIL);
    $('#vl_geoarea').val(r.GEOAREA);
    $('#vl_chain').val(r.CHAIN);
    $('#vl_coverageday').val(r.COV_DAY);
    $('#vl_tin').val(r.TIN);
    $('#vl_postalcode').val(r.SLD_POSTCODE);
    $('#vl_municipaplity').val(r.SHP_MUNICIPALITY_CITY_PROV);
    $('#vl_barangay').val(r.SHP_STREET_BRGY);
    $('#vl_othershipto').val(r.SHP_OTHERINFO);
    $('#vl_othersoldto').val(r.SLD_OTHERINFO);
    $('#vl_custclass').val(r.CUST_CLASS);
    $('#vl_frequency').val(r.COV_FREQ);

    $('#cmfmodaletails').modal('show');
}

function approveCMF(stat){
    var mess = 'Approve';
    if(stat == 0){
        mess = 'Denied';
    }
    
    var cmfID = $('#cmfIDHolder').val();
    Swal.fire({
        icon: 'info',
        text: "Are you sure you want to update this CMF?",
        showDenyButton: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, Update",
    }).then((result) => {
        if (result.isConfirmed) {
            $('#cmfmodaletails').modal('hide');

            Swal.fire({
                html: "Please wait... Executing request...",
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                    setTimeout(() => {
                        $.ajax ({
                            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                            type: "POST",
                            data: {
                                "type":"UPDATE_CMF_STAT",
                                "distCode": GBL_DISTCODE,
                                "cmfID":cmfID,
                                "statcmf":stat
                            },
                            dataType: "json",
                            crossDomain: true,
                            cache: false,
                            async: false,         
                            success: function(r){
                                customerData(startPickDate_cmf, endPickDate_cmf);
                                tableData_cmf.clear().rows.add(sourceData_cmf).draw();
                                Swal.close();

                                setTimeout(() => {
                                    Swal.fire({
                                        icon: "success",
                                        text: 'CMF Successfully ' + mess,
                                        allowOutsideClick: false,
                                        allowEscapeKey: false
                                    })  
                                }, 1000);
                            }
                        });
                    },1500);
                }
            });
        }
    });
}

function updatecmf(){
    var statdiff = $('#cmfstatdiff').val();
    console.log(statdiff);
    if(statdiff == '1'){
        var f = confirm('Are you sure you want to update this CMF ?');
        if(f){
            var cID = $('#cmfIDHolder').val();
            var soldname = $('#vl_soldname').val();
            var cust_contactno = $('#vl_custnumber').val();
            var st_brgy = $('#vl_address').val();
            var cust_contactperson = $('#vl_contactperson').val();
            var email = $('#vl_email').val();
            var geoarea = $('#vl_geoarea').val();
            var chain = $('#vl_chain').val();
            var covday = $('#vl_coverageday').val();
            var tin = $('#vl_tin').val();
            var postalcode = $('#vl_postalcode').val();
            var municipality = $('#vl_municipaplity').val();
            var brgy = $('#vl_barangay').val();
            var other_shipto = $('#vl_othershipto').val();
            var other_soldto = $('#vl_othersoldto').val();
            var custclass = $('#vl_custclass').val();
            var frequency = $('#vl_frequency').val();

            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
                type: "POST",
                data: {
                        "type":"UPDATE_CMF_DATA",
                        cID:cID,
                        soldname:soldname,
                        cust_contactno:cust_contactno,
                        st_brgy:st_brgy,
                        cust_contactperson:cust_contactperson,
                        email:email,
                        geoarea:geoarea,
                        chain:chain,
                        covday:covday,
                        tin:tin,
                        postalcode:postalcode,
                        municipality:municipality,
                        brgy:brgy,
                        other_shipto:other_shipto,
                        other_soldto:other_soldto,
                        custclass:custclass,
                        frequency:frequency,
                        "distCode": GBL_DISTCODE
                    },
                dataType: "JSON",
                crossDomain: true,
                cache: false,     
                async: false,       
                success: function(r){ 
                    if(r){
                    alert('CMF data was successfully updated.');
                    location.reload();
                    }
                }
            });
        }
    }else{
        alert('Updating of CMF data is restricted for Approved and Recjected CMF');
    }
    
}

function backToReports(){
    if(GBL_DOMAIN){
        window.location.href = `${GBL_DOMAIN}/SFA/v2/reports`;
    } else {
        console.log('GBL_DOMAIN not loaded.');
    }
}