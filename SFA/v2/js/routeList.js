
var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var startPickDate_e, endPickDate_e, if1dayisSelected;
var startPickDate_b, endPickDate_b, if1dayisSelected_b;
var sourceDat;
var tableData;
var sourceDat2;
var tableData2;
var GBLSELECTEDITEMS;
var GBLDRIVERLISTHOLDER;
var dssdate;


VirtualSelect.init({
    ele: '#driverselect',
});

VirtualSelect.init({
    ele: '#driverselect_ra',
});

VirtualSelect.init({
    ele: '#salesmanList_stk',
});

Swal.fire({
    html: "Please Wait... Preparing Data...",
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => {
        Swal.showLoading();

        setTimeout(() => {
            loadSalesman();
            // getcompname();
            getcompname_dynamic("Dynamic Load Planning", "titleHeading");

            datatableApp();
            datatableApp2();
            datatableApp3();

            datepicker_adjustrouting();
            datePicker_booking();
            //CALL LOADING CAP HEADER
            stockRequestSourceData();
            tableData.clear().rows.add(sourceDat).draw();
            datePicker_extruct();
            get_btdt_driver();
            dsspicker();
            datatableApp4();
        }, 1500);
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
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Dynamic Load Planning');
        }
    });
} 

$('#maincreationdrl').show();
$('#updatedrl').hide();

function datePicker_booking() {
    const start = moment();
    const end = moment();

    startPickDate_b = start.format('MMMM D, YYYY');
    endPickDate_b = end.format('MMMM D, YYYY');

    $('.filterdate_booking').daterangepicker({
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
    }, function(start, end, label) {
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
                $('.filterdate_booking span').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            } else{
                $('.filterdate_booking span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
    });
    $('.filterdate_booking').on('apply.daterangepicker', function(ev, picker) {
        Swal.fire({
            html: "Please wait... Getting Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => { // Setting timeout so that Swal can execute well.
                    const d1 = picker.startDate;
                    const d2 = picker.endDate;
                    if1dayisSelected = d2.diff(d1, 'days');

                    startPickDate_b = d1.format('YYYY-MM-DD');
                    endPickDate_b = d2.format('YYYY-MM-DD');

                    stockRequestSourceData(); 
                    tableData.clear().rows.add(sourceDat).draw();
                }, 1500);
            }
        });
    });
}


$('.hideselectioncontents').hide();
function datePicker_extruct(){
    var start = moment().subtract(0, 'days');
    var end = moment();

    $('.filterdate_extruct').daterangepicker({
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
        var d1 = moment(start);
        var d2 = moment(end);
        if1dayisSelected = d2.diff(d1);
        startPickDate = start.format('MMMM D, YYYY');
        endPickDate = end.format('MMMM D, YYYY');

        let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
        if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
            $('.filterdate_extruct span').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY'));
            $('.filterTrans').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY'));
        } else{
            $('.filterdate_extruct span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            $('.filterTrans').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
    });
    $('.filterdate_extruct').on('apply.daterangepicker', function(ev, picker) {
        startPickDate_e = picker.startDate.format('YYYY-MM-DD');
        endPickDate_e = picker.endDate.format('YYYY-MM-DD');

        // $('.filterdate_extruct span').html(startPickDate_e + ' - ' + endPickDate_e);
        $('.hideselectioncontents').show();
    });
}
     
function filter_dynaroute_transaction(){
    var opstype = $('#operation_type').val();
    if(opstype == undefined || opstype == ''){
         Swal.fire({
            text: 'Please select operation type.',
            icon: "info"
        });
    }else if(startPickDate_e == undefined || startPickDate_e == null){
        Swal.fire({
            text: 'Please select a date.',
            icon: "info"
        });
    }else{
        stockRequestSourceData2();
        tableData2.clear().rows.add(sourceDat2).draw();

        $('#filterTransModal').modal('hide');
        $('.hideselectioncontents').hide();
    }
}


function datefiltersearch_booking(start, end){
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var min = start;
            var max = end;
            var testdate = new Date(data[1]);
            var startDate = moment(testdate).format('YYYY-MM-DD');

            if (min == null && max == null) { return true; }
            if (min == null && startDate <= max) { return true;}
            if(max == null && startDate >= min) {return true;}
            if (startDate <= max && startDate >= min) { return true; }
            return false;
        }
    );

    tableData.draw();
}

function datefiltersearch_extruct(start, end){
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var min = start;
            var max = end;
            var testdate = new Date(data[1]);
            var startDate = moment(testdate).format('YYYY-MM-DD');

            if (min == null && max == null) { return true; }
            if (min == null && startDate <= max) { return true;}
            if(max == null && startDate >= min) {return true;}
            if (startDate <= max && startDate >= min) { return true; }
            return false;
        }
    );
    tableData2.draw();
}

// $('#approved_stockrequestlist').removeClass('hidden');
// $('#approved_stockrequestlist').hide();

$('.btn1').click(function (){
    $('.btn1').removeClass('inactiveTab');
    $('.btn1').addClass('activeTab');

    $('.btn2').removeClass('activeTab');
    $('.btn3').removeClass('activeTab');

    $('#approved_stockrequestlist').hide();
    $('#btdt_stockrequestlist').hide();
    $('#pending_stockrequestlist').show();
});

$('.btn2').click(function (){
    $('.btn2').addClass('activeTab');

    $('.btn1').removeClass('activeTab');
    $('.btn3').removeClass('activeTab');

    $('#pending_stockrequestlist').hide();
    $('#btdt_stockrequestlist').hide();
    $('#approved_stockrequestlist').show();
});

$('.btn3').click(function (){
    $('.btn2').removeClass('activeTab');
    $('.btn1').removeClass('activeTab');
    $('.btn3').addClass('activeTab');

    $('#pending_stockrequestlist').hide();
    $('#approved_stockrequestlist').hide();
    $('#btdt_stockrequestlist').show();
});


function stockRequestSourceData(){
    var start = startPickDate_b;
    var end = endPickDate_b;

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_DYNAMIC_ROUTE_HEADER", "start":start, "end":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            sourceDat = r;
            Swal.close();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                title: "Oops! Something went wrong!",
                html: XMLHttpRequest.responseText,
                icon: "error"
            });
        }
    });
}

function datatableApp(){
    tableData = $('table.pendingTBL').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTableBottomPagination"p>>',
        responsive: false,
        data: sourceDat,
        scrollX: true,
        ordering: true,
        columns: [
            { data: "cID", title: "Transaction ID" },
            { data: "SALESMAN", title: "Plate No." },
            { data: "TOTALTRANSACTIONS", title: "Total Drops" },
            { data: "LOADINGCAP", title: "Loading Capacity"},
            { data: "BALANCEAMOUNT", title: "Balance" },
            { data: "TOTALAMOUNT_f", title: "Total Amount" },
            { data: "UNLOADINGdate", title: "Unloading Date" },
            { data: "STATUSDIF", title: "Status" },
            { data: "DATECREATED", title: "Date Created" },
        ],
        buttons: [
            {
                text: '<i class="fas fa-calendar-alt"></i> Filter Date',
                className: 'filterdate_booking customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                }
            }
        ],
        columnDefs: [
            {
                targets: [0, 2, 7],
                className: 'text-center',
            },
            {
                targets: [3, 4, 5],
                className: 'text-end',
            },
        ]
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    $('table.pendingTBL tbody').on( 'click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails_routelist(row.data());
    });
}

function viewDetails_routelist(r){
    $('#dist_transacID').html(r.cID);
    $('#dist_transacStatus').html(r.STATUSDIF);
    $('#listStatus').val(r.STATUS);
    $('#dist_plateno').html(r.SALESMAN);
    $('#disp_ttransaction').html(r.TOTALTRANSACTIONS);
    $('#disp_loadingcap').html(r.LOADINGCAP);
    $('#disp_totalamount').html(r.TOTALAMOUNT_f);
    $('#disp_balance').html(r.BALANCEAMOUNT);


    $('#driverselect').val(r.PLATENO);
    $('#cIDhoLDERforUpdate').val(r.cID);
    $('#cancelRouteIDRefHolder').val(r.cID);


    $('#unloadingDate').val(r.UNLOADINGdate);

    $('#platenoRouteHolder').val(r.PLATENO);
    $('#unloadingDateRouteHolder').val(r.UNLOADINGdate);

    $('.printloadplanbtn').hide();
    if(r.STATUS == '2'){
        $('.alreadyconfirmed').hide();
        $('.printloadplanbtn').show();
    }else{
        $('.alreadyconfirmed').show();
    }

    $('#updatecustomerModal').modal('show');
}

function checkListStatus(){
    var status = $('#listStatus').val();

    if(status == 2){
        $('.removeTransactionInGroup').hide();
    } else if(status == 1){
        $('.removeTransactionInGroup').show();
    }
}

function stockRequestSourceData2(){
    Swal.fire({
        html: "Please Wait... Executing Request...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    var opstype = $('#operation_type').val();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_ADNVANCE_ORDER_TABULAR",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "start":startPickDate_e,
            "end":endPickDate_e,
            "opstype":opstype
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            sourceDat2 = r;
            Swal.close();
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

function printPickList(){
    var cIDHolder = $('#cIDhoLDERforUpdate').val();
    var unloadingDate = $('#unloadingDateRouteHolder').val();
    var plateno = $('#dist_plateno').text();

    localStorage.setItem('LDNG_UNLOADINGDATE', unloadingDate)
    localStorage.setItem('LDNG_CID', cIDHolder);
    localStorage.setItem('LDNG_PLATENO', plateno);

    window.open('../print_dynamic_loadplanning_picklist', '_blank');
}

function printloadplan(){
    var cIDHolder = $('#cIDhoLDERforUpdate').val();
    var unloadingDate = $('#unloadingDateRouteHolder').val();

    localStorage.setItem('LDNG_UNLOADINGDATE', unloadingDate)
    localStorage.setItem('LDNG_CID', cIDHolder);

    window.open('https://ravamate.com/SFA/print_load_plan', '_blank')
}

function usemapdr(){
    // window.open('dynamic_routing_map_v', '_blank')
    window.open('dynamicRouting', '_blank')
}

function datatableApp2(){
    tableData2 = $('table.approvedTBL').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTableBottomPagination"p>>',
        responsive: false,
        data: sourceDat2,
        scrollX: true,
        ordering: true,
        order: [[ 2, 'desc' ]],
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
            { data: "SynctDate", title: "Sync Date" },
            { data: "deliveryDate", title: "Booking Date" },
            { data: "transactionID", title: "Transaction ID" },
            { data: "MUNICIPALITY", title: "Municipality"},
            { data: "BARANGAY", title: "Barangay"},
            { data: "SALESMAN", title: "Salesman"},
            { data: "DAYS_LAPSE", title: "Days Lapse" },
            { data: "refno", title: "Reference" },
            { data: "CUSTOMER", title: "Customer" },
            { data: "totalAmountFormatted", title: "Amount" }
        ],
        columnDefs: [
            {
            targets: [9],
            className: 'dt-body-right',
            },
        ],
        buttons: [
            {
                text: 'Group Transaction',
                className: 'approveBtn_stocReq customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                    console.log(tableData2.rows({ selected: true }).data());
                    GBLSELECTEDITEMS = [];

                    $('#maincreationdrl').show();
                    $('#updatedrl').hide();
                    var row = tableData2.rows({ selected: true }).data();
                    if(row.length == 0){
                        Swal.fire({
                            text: "No Data Selected.",
                            icon: "info"
                        });
                    }else{
                        Swal.fire({
                            text: "Are you sure you want to group these transaction?",
                            icon: "warning",
                            cancelButtonColor: "#d33",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Yes, Group",
                            showCancelButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                var totaltransaction = row.length;
                                var totalAmount = 0.0;
                                
                                GBLSELECTEDITEMS = row.toArray();

                                for(var x = 0; x < row.length; x++){
                                    console.log(row[x].transactionID);
                                    totalAmount += parseFloat(row[x].totalAmount);
                                }         
                                
                                $('#totalTransactionHolder').val(totaltransaction);
                                $('#totalAmountHolderDisplay').val(totalAmount.toLocaleString());
                                $('#totalAmountHolder').val(totalAmount);
                                $('#loadingCapHolder').val('');
                                $('#driverselect').val('');
                                $('#updateDyanamicRouteModal').modal('show');  
                            } 
                        });
                    }

                    document.querySelector('#driverselect').addEventListener('change', function() {
                        var val = this.value;
                        var r = GBLDRIVERLISTHOLDER;

                        for(var x = 0; x < r.length; x++){
                            if(val == r[x].mdCode){
                                $('#loadingCapHolder').val(r[x].loadingCap);
                            }
                        }
                    });
                }
            },
            {
                text: 'Filter by Sync Date',
                className: 'filter filterTrans customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                    // Show your modal
                    $('#filterTransModal').modal('show');
                },
                // Add tooltip attributes when button is created
                init: function(api, node, config) {
                    $(node)
                        .attr('data-bs-toggle', 'tooltip')
                        .attr('data-bs-placement', 'right')
                        .attr('data-bs-custom-class', 'custom-tooltip')
                        .attr('data-bs-title', 'Click to filter data based on Sync Date');

                    // Initialize Bootstrap tooltip
                    var tooltip = new bootstrap.Tooltip(node);
                }
            }
        ],
        "drawCallback": function( settings ) {
            // $('[data-toggle="tooltip1"]').tooltip();
            // $('[data-toggle="tooltip2"]').tooltip();
        },
        "aaSorting": [[ 0, "desc" ]],
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    $('table.approvedTBL tbody').on( 'dblclick', 'tr', function () {
        $('.checker').html('');
        var tr = $(this).closest('tr');
        var row = tableData2.row(tr);
        var transactionID = tr.find('td:eq(0)').text();
        var mdCode = tr.find('td:eq(2)').text();
        customerList(row.data());
        $('#transactionIDHolder').val(transactionID);
        $('.selected_trasactionID').html(transactionID);
        $('#salesmanTypeHolder').val('extruct');
        $('#updatecustomerModal').modal('toggle');
    });

    $('#select-all').prop('checked', false);
    $('#select-all').on('click', function () {
        if (this.checked) {
            tableData2.rows({ search: 'applied' }).select();
        } else {
            tableData2.rows({ search: 'applied' }).deselect();
        }
    });
}

setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    console.log("ADJUST");
}, 5000);

function exec_dynaroute_transaction(){
    var loadingcap = $('#loadingCapHolder').val();
    var totalAmountHolder = $('#totalAmountHolder').val();
    var plateNo = $('#driverselect').val();
    var totaltransaction = $('#totalTransactionHolder').val();
    var unloadingDate = $('#unloadingDate').val();

    if(plateNo == undefined){
        Swal.fire({
            text: "Please select vehicle.",
            icon: "info"
        });
    }else if(unloadingDate == undefined || unloadingDate == ''){
        Swal.fire({
            text: "Please select unloading date.",
            icon: "info"
        });
    }else if(loadingcap == undefined || loadingcap == ''){
        Swal.fire({
            text: "Please maintain driver's loading capacity first.",
            icon: "info"
        });
    } else{
        if(parseFloat(totalAmountHolder) > parseFloat(loadingcap)){
            Swal.fire({
                html: 'Unable to Proceed: Loading cap must not exceed to ' + loadingcap,
                icon: "info"
            });
        }else{
            Swal.fire({
                html: "Please Wait... Executing Request...",
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                    setTimeout(() => {
                        $.ajax ({
                            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                            type: "POST",
                            data: {
                                "type":"INSERT_DYNAMIC_ROUTE_HEADER", 
                                loadingcap:loadingcap,
                                totalAmountHolder:totalAmountHolder,
                                plateNo:plateNo,
                                totaltransaction:totaltransaction,
                                unloadingDate:unloadingDate,
                                "userID": GBL_USERID,
                                "distCode": GBL_DISTCODE,
                                },
                            dataType: "json",
                            crossDomain: true,
                            cache: false,           
                            async: false, 
                            success: function(r){
                                Swal.close();
                                $('#maincreationdrl').html('<i class="fa fa-spin fa-spinner"></i> please wait..');
                                $('#maincreationdrl').prop('disabled', true);
                                var routingrefno = r;
                                var y = GBLSELECTEDITEMS;
                                for(var x = 0; x < y.length; x++){
                                    exec_tagged_dynamicroute_transactions(y[x].cID, routingrefno, plateNo, unloadingDate);
                                }

                                setTimeout(function() { 
                                    // Swal.fire({
                                    //     text: 'Dynamic Route Successfully Created.',
                                    //     icon: "info"
                                    // });
                                    $('#updateDyanamicRouteModal').modal('hide');

                                    $('#updatecustomerModal').modal('hide');
                                    
                                    $('#maincreationdrl').html('Execute');
                                    $('#maincreationdrl').prop('disabled', false);
                                }, 2000);
                                stockRequestSourceData();
                                tableData.clear().rows.add(sourceDat).draw();

                                stockRequestSourceData2();
                                tableData2.clear().rows.add(sourceDat2).draw();

                                $('#select-all').prop('checked', false);
                            }//success
                        });
                    }, 2000);
                },
            });
        }
    }
}

function exec_update_dynaroute_transaction(){
    var loadingcap = $('#loadingCapHolder').val();
    var totalAmountHolder = $('#totalAmountHolder').val();
    var plateNo = $('#driverselect').val();
    var totaltransaction = $('#totalTransactionHolder').val();

    var cID_for_update = $('#cIDhoLDERforUpdate').val();
    var unloadingDate = $('#unloadingDate').val();

    if(plateNo == undefined){
        Swal.fire({
            text: 'Please select a vehicle.',
            icon: "info"
        });
    }else{
        if(parseFloat(totalAmountHolder) > parseFloat(loadingcap)){
            Swal.fire({
                html: 'Unable to Proceed: Loading cap must not exceed to ' + loadingcap,
                icon: "info"
            });
        }else{
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {
                    "type":"UPDATE_DYNAMIC_ROUTE_HEADER", 
                    loadingcap:loadingcap,
                    totalAmountHolder:totalAmountHolder,
                    plateNo:plateNo,
                    totaltransaction:totaltransaction,
                    cID_for_update:cID_for_update,
                    unloadingDate:unloadingDate,
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE,
                    },
                dataType: "json",
                crossDomain: true,
                cache: false,           
                async: false, 
                success: function(r){
                    $('#updatedrl').html('<i class="fa fa-spin fa-spinner"></i> please wait..');
                    $('#updatedrl').prop('disabled', true);

                    var routingrefno = r;
                    var y = GBLSELECTEDITEMS;
                    for(var x = 0; x < y.length; x++){
                        exec_tagged_dynamicroute_transactions(y[x].cID, cID_for_update, plateNo, unloadingDate);
                    }

                    setTimeout(function() { 
                        Swal.fire({
                            text: 'Dynamic Route Successfully Updated.',
                            icon: "success"
                        });
                        $('#updateDyanamicRouteModal').modal('hide');
                        $('#updatecustomerModal').modal('hide');

                        $('#updatedrl').html('Execute');
                        $('#updatedrl').prop('disabled', false);

                        location.reload();
                    }, 5000);

                    stockRequestSourceData2();
                    tableData3.clear().rows.add(sourceDat2).draw();
                }//success
            });
        }
    }
}

function exec_tagged_dynamicroute_transactions(cID, routingrefno, plateNo, unloadingDate){
    $.ajax ({
    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"EXEC_UPDATE_DYNAROUTE_TRANS", 
            cID:cID,
            routingrefno:routingrefno,
            plateNo:plateNo,
            unloadingDate:unloadingDate,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            },
        dataType: "json",
        crossDomain: true,
        cache: false,           
        async: true
    });
}

function cancelUnprocessed(){
    var transactionID = $('#transactionIDHolder').val();
    Swal.fire({
        text: "Are you sure you want to cancel this transaction?",
        icon: "warning",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Cancel",
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
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
                    Swal.fire({
                        text: 'Transaction was successfully cancelled.',
                        icon: "success"
                    });
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Swal.fire({
                        html: "ERROR OCCUR: " + XMLHttpRequest.responseText,
                        icon: "error"
                    });
                }
            });
        }
    });
}

function confirmroutelist(){
    var plateno = $('#platenoRouteHolder').val();
    var unloadingdate = $('#unloadingDateRouteHolder').val();
    var cID = $('#cancelRouteIDRefHolder').val();

    Swal.fire({
        text: "Are you sure you want to confirm this transaction?",
        icon: "warning",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Transfer",
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {
                        "type":"EXEC_CONFIRM_ROUTeLIST",
                        unloadingdate:unloadingdate,
                        plateno:plateno,
                        cID:cID,
                        "userID": GBL_USERID,
                        "distCode": GBL_DISTCODE
                        },
                dataType: "json",
                crossDomain: true,
                cache: false,  
                async: false,          
                success: function(r){
                    Swal.fire({
                        text: 'Transaction was successfully confirmed.',
                        icon: "success"
                    });
                    location.reload();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Swal.fire({
                        html: "ERROR OCCUR: " + XMLHttpRequest.responseText,
                        icon: "error"
                    });
                }
            });
        }
    });
}
  
function getmunicipality(startPickDate_e, endPickDate_e){
    $('#municipalityselect').multiselect('destroy');

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_DYNAROUTE_PLACES",
            "start":startPickDate_e,
            "end":endPickDate_e,
            "places":'municipality',
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            for(var x = 0; x<data.length; x++){
                $('#municipalityselect').append('<option value="'+data[x].PLACES+'">'+data[x].PLACES+'</option>');
            }

            $('#municipalityselect').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '100%',
                maxHeight: 300
            });
        }
    });
}

function getBarangaySelect(startPickDate_e, endPickDate_e){
    $('#barangayselect').multiselect('destroy');
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_DYNAROUTE_PLACES",
            "start":startPickDate_e,
            "end":endPickDate_e,
            "places":'barangay',
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            for(var x = 0; x<data.length; x++){
                $('#barangayselect').append('<option value="'+data[x].PLACES+'">'+data[x].PLACES+'</option>');
            }

            $('#barangayselect').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '100%',
                maxHeight: 300
            });
        }
    });
}

function getSalesmanselect(startPickDate_e, endPickDate_e){
    $('#salesmanSelect').multiselect('destroy');

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_DYNAROUTE_SALESMANLIST",
            "start":startPickDate_e,
            "end":endPickDate_e,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            for(var x = 0; x<data.length; x++){
                $('#salesmanSelect').append('<option value="'+data[x].mdCode+'">'+data[x].salesman+'</option>');
            }

            $('#salesmanSelect').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '100%',
                maxHeight: 300
            });
        }
    });
}
      

$('#operation_type').on('change', function() {
  var val = this.value;
  get_btdt_driver(val);

});

function get_btdt_driver(opstype){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_BTDT_VEHICLE_LIST",
            "opstype":opstype,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            },
        dataType: "json",
        crossDomain: true,
        cache: false,           
        async: true, 
        success: function(r){
            GBLDRIVERLISTHOLDER = r;
            var myOptions = [];
            for (var x = 0; x < r.length; x++) {
                var obj = { label: r[x].Salesman, value: r[x].mdCode};
                myOptions.push(obj);
            }

            // console.log(myOptions);
            document.querySelector('#driverselect').destroy();
            VirtualSelect.init({
                ele: '#driverselect',
                options: myOptions,
                multiple: false,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });

            document.querySelector('#driverselect_ra').destroy();
            VirtualSelect.init({
                ele: '#driverselect_ra',
                options: myOptions,
                multiple: false,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });
        }//success
    });
}

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
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }

            document.querySelector('#salesmanList_stk').destroy();
            VirtualSelect.init({
                ele: '#salesmanList_stk',
                options: myOptions,
                search: true,
                minWidth: '400px', 
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });
        }
    });
}

// $('#driverselect').on( "change", function() {
//     var val = this.value;
//     var r = GBLDRIVERLISTHOLDER;

//     for(var x = 0; x < r.length; x++){
//         if(val == r[x].mdCode){
//             $('#loadingCapHolder').val(r[x].loadingCap);
//         }
//     }
//     console.log(val);
// });




function dsspicker(){
    $('.datestring').html('Pick a date here..');
    $('.dssdatePicker').daterangepicker({
        "singleDatePicker": true,
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {
        dssdate = start.format('YYYY-MM-DD');
        var today = moment().format('YYYY-MM-DD');
        $('.datestring').html(dssdate);
    });
}

function syncBTDTOrder(){
    $('#syncbtdtDriverModal').modal('show');
}

function execSyncBtdt(){
    Swal.fire({
        title: "This could take time,",
        text: "please wait while we process your request.",
        icon: "warning",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Okay",
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {

             var dialog = bootbox.dialog({
                message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
                backdrop: true
                // closeButton: false
            });

            var btdtdriver = $('#btdtdrvierList').val();
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/POST_applicationAPI.php",
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
                    
                    // dialog.hide();

                    if(response){
                        Swal.fire({
                            title: "Success!",
                            text: "Sync BTDT was successfull. Thank You!",
                            icon: "success"
                        });
                        stockRequestSourceData2();
                        // tableData2.clear().rows.add(sourceDat2).draw();
                    }else{
                        Swal.fire({
                            title: "Error!",
                            text: "Ops! Unable to Sync BTDT data!",
                            icon: "error"
                        });
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Swal.fire({
                        title: "Error!",
                        html: "Ops! Unable to Sync BTDT data! "+ XMLHttpRequest.responseText,
                        icon: "error"
                    });
                },
                }).done(function () {
                    dialog.init(function(){
                            setTimeout(function(){
                            dialog.find('.bootbox-body').html('<b style="color: green;">Success!</b><p>Refresh was successful</p>');
                        }, 1000);
                });
            });
        }
    });
}

function view_route_group_details(){
    checkListStatus();
    view_dynamic_route_data();
    $('#dynamicRoute_inside_details').modal('show');
}

function reassignLoadPlan(){
    $('#reassign_dynamicrouteModal').modal('show');
}

function exec_dynaroute_reassign(){
    Swal.fire({
        text: "Are you sure you want to transfer this load plan?",
        icon: "warning",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Transfer",
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            var mdCode = $('#driverselect_ra').val();
            var cID = $('#cancelRouteIDRefHolder').val();

            if(mdCode == undefined){
                Swal.fire({
                    text: 'Please select a driver first.',
                    icon: "info"
                });
            }else{
                $.ajax ({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {
                        "type":"EXEC_REASSIGN_DYNAROUTE",
                        "cID":cID,
                        "mdCode":mdCode,
                        "userID": GBL_USERID,
                        "distCode": GBL_DISTCODE
                    }, 
                    dataType: 'json',     
                    crossDomain: true,
                    cache: false,   
                    success: function(r){   
                        if(r){
                            Swal.fire({
                                text: 'Successfully re-assign load plan.',
                                icon: "info"
                            });
                            location.reload();
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        Swal.fire({
                            html: XMLHttpRequest.responseText,
                            icon: "error"
                        });
                    }
                });
            }//else close
        }
    });
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

$(window).bind("load", function () {
    $('#work-in-progress').fadeOut();
});
        
function imgError2(image) {
    image.onerror = "";
    image.src = "../img/salesmanPic.jpg";
    return true;
}  

function openNav() {
    document.getElementById("mySidenav").style.width = "270px";
    document.getElementById("main").style.marginLeft = "270px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
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

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))