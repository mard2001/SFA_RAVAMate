var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var dssdate;
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var total;
var pageTotal;

determineUserType(usertype); 
      
dsspicker();
function dsspicker(){
    $('#datestring').html('Pick a date');
    $('#dssdatePicker').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {
        dssdate = start.format('YYYY-MM-DD');
        var today = moment().format('YYYY-MM-DD');
        $('#datestring').html(dssdate);
    });
}

// getcompname();
getcompname_dynamic("Sales Report v.6.9.8", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Sales Report v.6.9.8');
        }
    });
} 
      

function stockRequestSourceData(start, end){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    Swal.fire({
        html: "Please Wait... Executing Request...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"salesReport", "startDate":start, "endDate":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(r){ 
            if(r.length != 0){ 
                sourceDat = r;
                tableData.clear().rows.add(sourceDat).draw();
                $('#stockRequest_TAB').show();
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
            }

            Swal.close();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                icon: "error",
                title: "Ops! Something went wrong!",
                html: "CONTACT SYSTEM ADMINISTRATOR! " + XMLHttpRequest.responseText
            });
        }
    }).done(function () {
        setTimeout(() => {
            Swal.close();
        }, 1000);
    });
}

datePicker();
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
        if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrange1 span').html('<b>' + dayOfWeek+ '</b>' + ' | '+start.format('MMMM D, YYYY'));
        } else{
            $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        startPickDate = start.format('YYYY-MM-DD');
        endPickDate = end.format('YYYY-MM-DD')
    });

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
        $('#stockRequest_TAB').hide();
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        stockRequestSourceData(start, end);
        // tableData.clear().rows.add(sourceDat).draw();
    });
}

datatableApp();
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<B><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": false,
        "data": sourceDat,
        "scrollX": true,
        "language": {
            "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "Status", title: "<span id='statusHeader'>Status</span>" },
            { data: "Salesman", title: "<span id='salesmanHeader'>Salesman</span>" },
            { data: "deliveryDate", title: "Date" },
            { data: "CustomerID", title: "Custcode"},
            { data: "Customer", title: "Customer" },
            { data: "DocumentNo", title: "Document No." },
            { data: "SKU", title: "Range" },
            { data: "TIMEBOUND", title: "Time Travel (Min.)" },
            { data: "upTime", title: "Time Spent (Min.)" },
            { data: "GEODIfference", title: "Geo Difference" },
            { data: "longitude", title: "Longitude" },
            { data: "latitude", title: "Latitude" },
            { data: "Notation", title: "Remarks" },
            { data: "PaymentType", title: "Payment Type" },
            { data: "Sales", title: "Sales" },
        ],
        buttons: [
            {
                extend: 'collection',
                text: 'Other Reports',
                className: 'customDTTables dt-button buttons-collection',
                autoClose: true,
                buttons: [
                    {
                        text: 'Sales Summary',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        // printDSS();
                        $('#dssmodal').modal('show');
                        }   
                    },
                    {
                    text: 'Range Summary',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('rangesum', '_blank');
                        }   
                    },
                    {
                        text: 'Range Monitoring',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('rangemon', '_blank');
                        }   
                    },
                    {
                    text: 'Geocall Rate',
                    // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('geoCallRate', '_blank');
                        }   
                    },
                    {
                        text: 'Strike Rate',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('strikeRate', '_blank');
                        }   
                    },
                    {
                        text: 'Salesrep SKU Details',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('skusalesdetails', '_blank');
                        }   
                    },
                    {
                        text: 'Unproductive',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('unproductive', '_blank');
                        }   
                    },
                    {
                        text: 'Sosyo Transaction',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('fastsosyoTrans', '_blank');
                        }   
                    },
                    {
                        text: 'Voucher History',
                        // className: 'bringtoprint',
                        action: function(e, dt, node, config){
                        window.open('voucherHistory', '_blank');
                        }   
                    },
                ],
            },
            {
                extend: 'collection',
                text: 'Export',
                className: 'customDTTables dt-button buttons-collection',
                autoClose: true,
                buttons: [
                    'print', 'csv', 'excel', 'copy'
                ],
            }
        ],
        columnDefs: [
            {
                targets: [0, 1, 12, 4, 5, 10, 11],
                className: 'text-left',
                // render: $.fn.dataTable.render.ellipsis(20)
            },
            {
                targets: [6, 7, 8, 9],
                className: 'text-center'
            },
            {
                targets: "_all",
                class:'text-nowrap'
            }
        ],rowCallback: function(row, data, index){
            var stat = data.Status.toString().toUpperCase();
            var salesFormat = data.Sales.toString();
                if(stat == 'VALID'){
                    $(row).find('td:eq(0)').css({'color': 'green', 'font-size':'6px;', 'letter-spacing': '0.2em'});
                    $(row).find('td:eq(0)').html('&#10003; VALID');
                }else{
                    $(row).find('td:eq(0)').css({'color': 'red', 'font-size':'6px;', 'letter-spacing': '0.2em', 'text-decoration':'line-through'});
                }
                $(row).find('td:eq(14)').text('₱' + Number(parseFloat(salesFormat).toFixed(2)).toLocaleString());
                // READY
                // $(row).find('td:eq(0)').css({'border-left': '5px solid '+generateRandomHex()});
        },
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            
            total = api
                .column( 14 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            pageTotal = api
                .column( 14, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            $( api.column( 14 ).footer() ).html(
                'Total Sales: â‚± '+pageTotal.toLocaleString() +' ('+ total.toLocaleString() +')'
            );

            var connectStr = 
                "<div class='div1'>"+
                    // "<span style='color: #949494;'>Total Sales</span>"+
                    "<div class='mx-1 mt-2'>"+
                        "<span class='mdi mdi-finance'></span>"+
                        "<span class='fw-bold' ><span style='font-size: 13px; font-weight: 300; color: #949494;'>Total Sales:</span> ₱ "+pageTotal.toLocaleString() +" (₱ "+ total.toLocaleString() +")"+"</span>"+
                    "</div>"+
                "</div>";

            $('#dt-body-right').html(connectStr);
        }
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    $('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
    });

    // Bypassing the table alignment to automatically align when loadded
    setTimeout(function() {
        $("#statusHeader").click();
        $("#salesmanHeader").click();
        $("#statusHeader").click();
        $("#statusHeader").click();
    }, 5000);

    $('#stockRequest_TAB').css("width: 100% !important");
    function viewDetails(r){
        if(r.Status === "VALID"){
            $('#modal_status').html(r.Status  + '<span class="mdi mdi-check-decagram" style="color: #61C711;"></span>');
        } else{
            $('#modal_status').html(r.Status + '<span class="mdi mdi-close-circle-outline" style="color: #FF0000;"></span>');
        }
        console.log(r);

        $('#transimgholder').val(r.PaymentType_img);
        $('#modal_salesman').html(r.Salesman);
        $('#modal_docNo').html(r.DocumentNo);
        $('#itemCodeHeaderRowDate').html(moment(r.deliveryDate).format("MMMM D, YYYY"));
        $('#modal_travel').html(r.TIMEBOUND);
        $('#modal_GeoD').html(r.GEODIfference);
        $('#modal_long').html(r.longitude);
        $('#modal_lat').html(r.latitude);
        $('#modal_typeChecker').html(r.transactionTypeChecker);

        $('#modal2_customername').html(r.Customer.split(" ").slice(0, -1).join(" "));
        $('#modal2_customerID').html(r.CustomerID);
        $('#modal2_address').html(r.Address);
        $('#modal2_transactionD').html(formatDate(r.deliveryDate.split(" ")[0]));
        $('#modal2_transactionT').html(r.deliveryDate.split(" ")[1]);
        $('#modal2_rangeH').html(r.SKU);
        $('#modal2_timespentH').html(r.upTime);
        $('#modal2_totalAm').html('₱' + parseFloat(r.Sales).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        $('#modal2_remarks').html(r.Notation);
        $('#modal2_battPercentage').html(r.Customer.match(/;(\d+)/)[1] + "%");

        $('#salesmanCode').val(r.salesmanCode);
        $('#salesman').val(r.Salesman);
        $('#refNo').val(r.DocumentNo);
        $('#transaction').val(r.transactionID);
        $('#deldate').val(r.deliveryDate);
        $('#custCode').val(r.CustomerID);
        $('#custName').val(r.Customer);
        $('#contactPerson').val(r.ContactPerson);
        $('#sku').val(r.SKU);
        $('#amount').val(Number(parseFloat(r.Sales).toFixed(2)).toLocaleString());
        $('#address').val(r.Address);


        $('#referencetypeholder').hide();
        if(r.PaymentType == 'Cash' || r.PaymentType == 'TERMS'){
             $('#paymentTypeh').html(r.PaymentType);
             $('#referencetypeholder').hide();
        }else{
             $('#referencetypeholder').show();

             $('#paymentTypeh').html(r.PaymentType_a);
             $('#paymentImage').html(r.PaymentTyperef);

            //  $('#paymentImage').attr('rel', r.PaymentType_img);
        }



    
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"salesReport_details", "transactionID":r.transactionID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(r){
                var cont = '';
                var ctr = 0;
                $('#refnoH').html(r[0].refno);
                $('#modal2_refnoH').html(r[0].refno + '<span class="mdi mdi-barcode"></span>');
                for(var x = 0; x < r.length; x++){
                    ctr++;
                    cont += '<tr>'+
                                '<td>'+r[x].stockCode+'</td>'+
                                '<td style="text-align: left !important;">'+r[x].description+'</td>'+
                                '<td style="text-align: center !important;">'+r[x].quantity+'</td>'+
                                '<td style="text-align: right !important;">₱ '+r[x].amount+'</td>'+
                            '</tr>';
                }
                for(; ctr < 9; ctr++){
                    cont += '<tr style="height:41.1167px">'+
                                '<td></td>'+
                                '<td style="text-align: left !important;"></td>'+
                                '<td style="text-align: center !important;"></td>'+
                                '<td style="text-align: right !important;"></td>'+
                            '</tr>';
                }
                $('#salesDetailsBody').html(cont);
                $('#salesDmodal').modal('show');
            }
        });
    } 
}

function viewpaymentreference(){
    var refimg =  $('#transimgholder').val();
    // var win = window.open(refimg, '_blank');
    // if (win) {
    //     //Browser has allowed it to be opened
    //     win.focus();
    // } else {
    //     //Browser has blocked it
    //     alert('Please allow popups for this website');
    // }

    $('#paymebtreferenceimageval').attr('src', refimg);
    $('#paymentModal').modal('show');
}

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});

$('#customizedExportBtn').on('click', function() {
    // Open the export dropdown
    tableData.buttons('.buttons-collection').trigger();
});


function execprintDSS(){
    if(dssdate == 'undefined' || dssdate == null){
        alert('Please select a date.');
    }else{
        localStorage.setItem('DSSdateSelected', dssdate);
        window.open('dailySalesSum.html', '_blank');
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
       

function formatDate(originalDateString){
    var parts = originalDateString.split('-'); 
    var formattedDateString = parts[1] + '/' + parts[2] + '/' + parts[0]; 
    return formattedDateString;
}

function generateRandomHex() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    while (randomColor.length < 6) {
        randomColor = '0' + randomColor;
    }
    randomColor = '#' + randomColor;
    return randomColor;
}