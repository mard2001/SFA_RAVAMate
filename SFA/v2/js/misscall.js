var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var dssdate;
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var total;
var pageTotal;

determineUserType(usertype); 
      
// dsspicker();
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

getcompname_dynamic("Miss Call", "titleHeading");
// getcompname();
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Miss Call');
        }
    });
} 
      

function stockRequestSourceData(start, end) {
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "GET_MISS_CALL", "start": start, "end": end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,
        success: function (r) {
            if (r.length !== 0) {
                sourceDat = r;
                tableData.clear().rows.add(sourceDat).draw();
                $('#stockRequest_TAB').show();
            } else {
                // alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start + ' to ' + end);
                Swal.fire({
                    title: "No results found",
                    html: 'For the selected date range: ' + start + ' to ' + end,
                    icon: "warning"
                });
            }
            dialog.modal('hide');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b class="text-danger">Ops! Something went wrong!</b><br/>' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!';
            dialog.init(function () {
                setTimeout(function () {
                    dialog.find('.bootbox-body').html('<p>' + botboxMsg + '</p>');
                }, 1000);
            });
        }
    }).done(function () {
        dialog.init(function () {
            setTimeout(function () {
                dialog.find('.bootbox-body').html('<p>' + botboxMsg + '</p>');
            }, 1000);
        });
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
        // $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        // startPickDate = start.format('YYYY-MM-DD');
        // endPickDate = end.format('YYYY-MM-DD')
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
        $('#stockRequest_TAB').hide();
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        stockRequestSourceData(start, end);
        // tableData.clear().rows.add(sourceDat).draw();
    });
}

datatableApp();
function datatableApp(){
    console.log(sourceDat);
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
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
            { data: "mdCode", title: "MDCode" },
            { data: "salesmanname", title: "Salesman" },
            { data: "custCode", title: "CustCode" },
            { data: "customername", title: "Customer Name"},
            { data: "reason", title: "Reason" },
            { data: "date", title: "Date" }
        ],
        buttons: [ 'excel', 'print', 'copy' ],
        columnDefs: [
            // {
            //     targets: [0, 2, 3, 13],
            //     className: 'dt-body-left',
            //     // render: $.fn.dataTable.render.ellipsis(20)
            // },
            // {
            //     targets: 6,
            //     className: 'dt-body-right',
            //     render: function (data, type, row, meta) {
            //         return 'â‚±' + Number(parseFloat(data).toFixed(2)).toLocaleString();
            //     }
            // },
            // {
            //     targets: [1, 9, 10, 11, 12],
            //     className: 'dt-body-center'
            // }
        ],
    });

    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-print').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-copy').trigger('click');
    });

    $('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        //viewDetails(row.data());
    });

    function viewDetails(r){
        $('#transactionDateH').html(r.deliveryDate);
        //$('#salesmanH').html(r.Salesman);
        //$('#transactionIDH').html(r.transactionID);
        $('#customerH').html(r.CustomerID +' '+ r.Customer);
        $('#rangeH').html(r.SKU);
        $('#amountH').html(Number(parseFloat(r.Sales).toFixed(2)).toLocaleString());
        $('#timepentH').html(r.upTime);
        $('#remarksH').html(r.Notation);
        $('#addressH').html(r.Address);
        // $('#custPersonH').html(r.ContactPerson);

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
                $('#refnoH').html(r[0].refno);
                for(var x = 0; x < r.length; x++){
                    ctr++;
                    cont += '<tr>'+
                                '<td>'+r[x].stockCode+'</td>'+
                                '<td style="text-align: left !important;">'+r[x].description+'</td>'+
                                '<td style="text-align: center !important;">'+r[x].quantity+'</td>'+
                                '<td style="text-align: right !important;">'+r[x].amount+'</td>'+
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


$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});


function execprintDSS(){
    if(dssdate == 'undefined' || dssdate == null){
        alert('Please select a date.');
    }else{
        localStorage.setItem('DSSdateSelected', dssdate);
        window.open('https://mybuddy-sfa.com/SFA/print-dashboard-dailysales.html', '_blank');
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