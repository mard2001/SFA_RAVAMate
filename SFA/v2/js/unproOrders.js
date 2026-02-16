var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var startPickDate, endPickDate, if1dayisSelected;
var transactionType = "BOOKING TRANSACTIONS";
var sourceDat;
var tableData;


// getcompname();
getcompname_dynamic("Unprocessed Orders v5.0", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
        $('#titleHeading').html(r[0].company.toUpperCase() +' | Unprocessed Orders v5.0');
        }
    });
} 

determineUserType(usertype); 
datatableApp();  
datePicker();

function datePicker(){
    var start = moment().subtract(5, 'days');
    var end = moment();
    $('#reportrange1').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "maxDate": end,
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
        if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrange1 span').html('<b>'+dayOfWeek+'</b> | '+start.format('MMMM D, YYYY'));
        } else{
            $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        startPickDate = start.format('YYYY-MM-DD');
        endPickDate = end.format('YYYY-MM-DD');
    });

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
        startPickDate = picker.startDate.format('YYYY-MM-DD');
        endPickDate = picker.endDate.format('YYYY-MM-DD');
        tableData.clear();

        if(transactionType == "BOOKING TRANSACTIONS"){
            stockRequestSourceData();
            tableData.clear().rows.add(sourceDat).draw();
        } else if (transactionType == "EXTRUCT TRANSACTIONS"){
            stockRequestSourceData2();
            tableData.clear().rows.add(sourceDat).draw();
        } else{
            stockRequestSourceData3();
            tableData.clear().rows.add(sourceDat).draw();
        }
    });
}


$('#tableTitle').html(transactionType);
$('#approved_stockrequestlist').removeClass('hidden');
$('#approved_stockrequestlist').hide();

$('#btdt_stockrequestlist').removeClass('hidden');
$('#btdt_stockrequestlist').hide();

$('.btn1').click(function (){
    transactionType = "BOOKING TRANSACTIONS";
    $('#tableTitle').html(transactionType);
    tableData.clear();
    stockRequestSourceData();
    tableData.clear().rows.add(sourceDat).draw();
});

$('.btn2').click(function (){
    transactionType = "EXTRUCT TRANSACTIONS";
    $('#tableTitle').html(transactionType);
    tableData.clear();
    stockRequestSourceData2();
    tableData.clear().rows.add(sourceDat).draw();
});

$('.btn3').click(function (){
    transactionType = "BTDT TRANSACTIONS";
    $('#tableTitle').html(transactionType);
    tableData.clear();
    stockRequestSourceData3();
    tableData.clear().rows.add(sourceDat).draw();
});

VirtualSelect.init({
    ele: '#customerList',
    options: [],
    search: true,
    maxWidth: '100%', 
    placeholder: 'Select Customer'
});

function customerList(r){
    console.log(r);
    var mdCode = r.mdCode;
    $('#transactionIDHolder').val(r.transactionID);
    $('.selected_trasactionID').html(r.transactionID);
    $('.selected_refNo').html(r.refno);
    $('#salesmanTypeHolder').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"CUSTOMER_LIST_UNPROCESSED", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode":mdCode},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(data){
             var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].custCode+' '+data[x].custName, value: data[x].custCode };
                myOptions.push(obj);
            }

            document.querySelector('#customerList').setOptions(myOptions);
            Swal.close();
            $('#updatecustomerModal').modal('show');
        }//success
    });
}   

function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><"#tableTitle"><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "ordering": true,
        "language": {
            "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "transactionID", title: "Transaction ID" },
            { data: "TXN_DT", title: "Date" },
            { data: "salesman", title: "Salesman"},
            { data: "refno", title: "TNX #" },
            { data: "custCode", title: "Custcode" },
            { data: "StockCode", title: "Product Code" },
            { data: "Description", title: "Description" },
            { data: "TTL_AMT", title: "Amount" },
            { data: "Notation", title: "Remarks"}
        ],
        buttons: [
            {
                text: '<i class="fas fa-calendar-alt"></i> Filter Date',
                className: 'filterdate_booking',
                action: function(e, dt, node, config){
                }
            },
            'excel'
        ]
    });

    $('#stockRequest_TAB tbody').on( 'dblclick', 'tr', function () {
        Swal.fire({
            html: "Please Wait... Fetching Pending Order...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();

                setTimeout(() => {
                    $('.checker').html('');
                    var tr = $(this).closest('tr');
                    var row = tableData.row(tr);
                    var transactionID = tr.find('td:eq(0)').text();
                    var mdCode = tr.find('td:eq(2)').text();
                    customerList(row.data());
                    
                    $('#salesmanTypeHolder').val('booking');
                    
                }, 1000);
            },
        });
    });
}

$('#excelBtn').on('click', function() {
    console.log('Custom button clicked');
    $('.buttons-excel').trigger('click');
});

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});


function stockRequestSourceData(){
    var start = startPickDate;
    var end = endPickDate;
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"UNPROCESSED_ORDERS_BOOKING", "start":start, "end":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            sourceDat = r;
            dialog.modal('hide');
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

function stockRequestSourceData2(){
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"UNPROCESSED_ORDERS_EXTRUCT", "userID": GBL_USERID, "distCode": GBL_DISTCODE,
            "start":startPickDate,
            "end":endPickDate
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            sourceDat = r;
            dialog.modal('hide');
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

     
function stockRequestSourceData3(){
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"UNPROCESSED_ORDERS_BTDT", 
            "userID": GBL_USERID, "distCode": GBL_DISTCODE,
            "start":startPickDate,
            "end":endPickDate
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            sourceDat = r;
            dialog.modal('hide');
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


function updateStockReq(refNo, mdCode, stockCode){
    alert('underscontruction');
}

function cancelUnprocessed(){
    var transactionID = $('#transactionIDHolder').val();
    var f = confirm('Are you sure you want to cancel this transaction?');
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"CANCEL_UNPROCESSED_TRANS",
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "transactionID":transactionID
            },
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(r){
                alert('Transaction was successfully cancelled.');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
            }
        });
    }
}

function execute_update(){
    var stype = $('#salesmanTypeHolder').val();
    var custcode = $('#customerList').val();
    var transactionID = $('#transactionIDHolder').val();
    console.log(custcode + ' ' + transactionID);
    if(custcode == ''){
        $('.checker').html('<p class="text-danger"><i class="fas fa-exclamation-circle"></i> Please select a customer first.</p>');
    }else{
        $('.checker').html('');
        if(confirm('Are you sure you want to update all transaction with transactionID: ?')){
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {
                    "type":"UPDATE_CUSTOMER_NAME_UNPROCESSED", 
                    "userID": GBL_USERID, "distCode": GBL_DISTCODE,
                    "newCustCode":custcode,
                    "transactionID":transactionID,
                    "salesmanType":stype
                },
                dataType: "json",
                crossDomain: true,
                cache: false,  
                async: false,          
                success: function(r){
                    if(r){
                        tableData.clear();
                        if(stype == 'booking'){
                            stockRequestSourceData();
                            tableData.clear().rows.add(sourceDat).draw();
                        }else if(stype == 'extruct'){
                            stockRequestSourceData2();
                            tableData.clear().rows.add(sourceDat).draw();
                        }else if(stype == 'btdt'){
                            stockRequestSourceData3();
                            tableData.clear().rows.add(sourceDat).draw();
                        }
                        $('#updatecustomerModal').modal('hide');
                        alert('Transaction updated successfully!');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
                }
            });
        } 
    }
}

    