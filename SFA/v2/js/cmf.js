var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("username");

$('#customerListSelect').html('<option value="">Select a salesman first..</option>');
// getcompname();
getcompname_dynamic("Customer Maintenance Form | v.1.3", "titleHeading");
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
            localStorage.setItem('DISTCD', r[0].DIST_CD);
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Customer Maintenance Form | v.1.3');
        },error: function(jqXHR, textStatus, errorThrown) {
            alert('ERROR CONNECTING TO SERVER:\n Please Check your connection settings.');
        }
    });
} 

function printCMF(){
    var cmfID = $('#cmfIDHolder').val();
    localStorage.setItem('CMFID', cmfID);
    window.open('print_cmf', '_blank');
}

$('.loading-table').hide();
$('.job-inpt-data-h').attr('disabled', 'disabled');
// showNotif();

// $(document).on('click', '.dropdown-toggle', function(){
// $('.count').html('');
//     showNotif('yes');
// });

// customerData(startPickDate, endPickDate);
customerDataTable();

var sourceData;
function customerData(start, end){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_CMF_DATA",
            'start':start,
            'end':end,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            if(r.length != 0){ 
                sourceData = r;
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
            }
            dialog.modal('hide');
            $('#stockRequest_TAB').show();
            $('.loading-table').hide();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b class="text-danger">Ops! Something went wrong!</b><br/>' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!';
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        }
    }).done(function () {
        setTimeout(() => {
            dialog.modal('hide');
        }, 1000);
    });
}

var tableData;
function customerDataTable(){
    tableData =  $('table.customerList').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "data": sourceData,
        "scrollX": true,
        "ordering": true,
        "columns": [
            { "data": "CMFID", title: "CMFID"},
            { "data": "SALESPERSON", title: "Salesperson"},
            { "data": "CUSTCODE", title: "Cust Code"},
            { "data": "SOLDTONAME", title: "Sold To Name" },
            { "data": "CUST_CONT_PERSON", title: "Customer Contact Person" },
            { "data": "CUST_CONTNO", title: "Customer Contact #" },
            { "data": "EMAIL", title: "Email" },
            { "data": "GEOAREA", title: "Geo Area" },
            { "data": "CHAIN", title: "Chain" },
            { "data": "COV_DAY", title: "Coverage Day" },
            { "data": "TIN", title: "TIN" },
            { "data": "SLD_POSTCODE", title: "Postal Code" },
            { "data": "SHP_MUNICIPALITY_CITY_PROV", title: "Municipality" },
            { "data": "SHP_STREET_BRGY", title: "Barangay" },
            { "data": "LONGITUDE", title: "Longitude" },
            { "data": "LATITUDE", title: "Latitude" },
            { "data": "SHP_OTHERINFO", title: "Other Info (Ship to)"},
            { "data": "SLD_OTHERINFO", title: "Other Info (Sold to)"},
            { "data": "CUST_CLASS", title: "Customer Class"},
            { "data": "COV_FREQ", title: "Frequency"},
            { "data": "REQ_DATE", title: "Request Date"}
        ],
        buttons:  [
            'csv', 'excel',
            {
                text: 'Reload',
                className: 'filterdate_booking',
                action: function(e, dt, node, config){
                customerData(startPickDate, endPickDate);
                tableData.clear().rows.add(sourceData).draw();
                }
            }
        ],
        "language": {
            "emptyTable": "No available records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            },
        },
        columnDefs: [
            {
                targets: [6, 7, 8, 10, 11, 16, 17],
                className: 'text-center'
            }
        ],
        // "aaSorting": [[ 0, "desc" ]],
        rowCallback: function(row, data, index){
        }
    });

    $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
        var searchTerm = $(this).val();
        tableData.search(searchTerm).draw();
    });
    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#csvBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-csv').trigger('click');
    });

    $('table.customerList tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        cmfDetails(row.data());
    });

    function cmfDetails(r){
        $('#vl_cmfID').html(r.CMFID);
        $('#vl_custCode').html(r.CUSTCODE);
        $('#vl_soldname').html(r.SOLDTONAME);
        $('#vl_salesperson').html(r.SALESPERSON);
        $('#vl_custnumber').html(r.CUST_CONTNO);
        $('#vl_address').html(r.SHP_STREET_BRGY);
        $('#vl_reqdate').html(r.REQ_DATE);
        $('#cmfIDHolder').val(r.cID);

        $('#cmfmodaletails').modal('show');            
    }
}

function displaycustomer(cust){
    if(cust == 'NEW_CUSTOMER'){
        return cust;
    }else{
        return getCustomerName(cust);
    }
}

function islockOnverifyer(r){
    if(r == 0){
        return '<strong style="color: red;">NO</strong>';
    }
    return '<strong style="color: #5ee663;">YES</strong>';
}

datePicker();
var startPickDate, endPickDate;
function datePicker(){
    var start = moment().subtract(29, 'days');
    var end = moment();

    $('#reportrange1').daterangepicker({
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
    }, function(start, end, label) {
        $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        startPickDate = start.format('YYYY-MM-DD');
        endPickDate = end.format('YYYY-MM-DD')
    });

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
        $('#stockRequest_TAB').hide();
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        customerData(start, end);
        tableData.clear().rows.add(sourceData).draw();
    });
}

function exec_insertCustomer(){
    var r = confirm("Press 'OK' to proceed.");
    if(r){
        $('#addJobberBtn').html('<i class="fa fa-spinner fa-spin"></i> updating.. ');
        $( "#addJobberBtn").prop( "disabled", true );
        var custCode = $('#custCodeH').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"UPDATE_ORDERTYPE", 
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "custCode":custCode
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    customerData();
                    tableData.clear().rows.add(sourceData).draw();
                    alert('Customer succesfully updated!');
                }else{
                    alert('UNABLE TO INSERT: Customer is already in the jobber list!');
                }
                    $("#addJobberBtn").prop( "disabled", false );
                    $('#addJobberBtn').html('Add');
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR CUSTOMER UPDATE: ' + JSON.stringify(XMLHttpRequest.responseText));
                $( "#addJobberBtn").prop( "disabled", false );
                $('#addJobberBtn').html('Add');
            }
        });
    }
}

function exec_insertCustomer_revert(){
    var r = confirm("Press 'OK' to proceed.");
    if(r){
        $('#revertBtn').html('<i class="fa fa-spinner fa-spin"></i> updating.. ');
        $( "#revertBtn").prop( "disabled", true );
        var custCode = $('#custCodeH').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"UPDATE_ORDERTYPE_REVERT", 
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "custCode":custCode
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    customerData();
                    tableData.clear().rows.add(sourceData).draw();
                    alert('Customer succesfully updated!');
                }else{
                    alert('UNABLE TO INSERT: Customer is already in the jobber list!');
                }
                    $("#revertBtn").prop( "disabled", false );
                    $('#revertBtn').html('Add');
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR CUSTOMER UPDATE: ' + JSON.stringify(XMLHttpRequest.responseText));
                $( "#revertBtn").prop( "disabled", false );
                $('#revertBtn').html('Add');
            }
        });
    }
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
           // console.log('Notification function has been refresh');                
            $("#notifs-icon-div").html(response.notification);
            if(response.unseen_notification > 0){
               $('.count').html(response.unseen_notification);
            }
        }
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

function getSalesmanDetails(mdCode){
    var details = [];
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_AIO_SALESAMAN_DETAILS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "mdCode":mdCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,         
        success: function(r){
            details = r;
        }
    });
    return details;
}

function getCustomerName(custCode){
    var customer = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_MYBUDDY_STORENAME",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "custCode":custCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,         
        success: function(r){
            customer = r[0].custCode+'_'+r[0].custName;
        }
    });
    return customer;
}

function getAioStoreToken(storeID){
    var token = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_AIO_TOKEN",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "storeID":storeID
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