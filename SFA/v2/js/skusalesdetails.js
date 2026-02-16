var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");

determineUserType(usertype); 

dsspicker();
var dssdate;
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

var siteIndicator = '';
// getcompname();
getcompname_dynamic("SKU Salesreport Details v.1.0.0", "titleHeading");
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
            siteIndicator = r[0].DIST_INDI;
            $('#titleHeading').html(r[0].company.toUpperCase() +' | SKU Salesreport Details v.1.0.0');
        }
    });
} 
  
var sourceDat;
$('.loading-table').hide();
function stockRequestSourceData(start, end){
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
        data: {"type":"GET_SALESREP_SKU_DETAILS", "startDate":start, "endDate":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            console.log(siteIndicator);
            if(r.lenght != 0){ 
              sourceDat = r;
              $('#stockRequest_TAB').show();
              $('.loading-table').hide();
            }else{
              alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
            }

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
        if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrange1 span').html('<b>' + dayOfWeek+ '</b>' + ' | '+start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
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
        tableData.clear().rows.add(sourceDat).draw();
    });
}

datatableApp();
var tableData;
function datatableApp(){
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
            { data: "transactionID", title: "transaction ID" },
            { data: "deliveryDate", title: "Delivery Date" },
            { data: "Salesman", title: "Salesman" },
            { data: "custCode", title: "CustCode" },
            { data: "StockCode", title: "StockCode" },
            { data: "Description", title: "Description" },
            { data: "orderedQTY", title: "Ordered QTY" },
            { data: "totalorderAmount", title: "Total Order Amount" },
            { data: "remarks", title: "Remarks" }
        ],
        buttons: [
            'print', 'csv', 'excel'
        ],
        columnDefs: [
            {
                targets: 6,
                className: 'dt-body-center' 
            },
            {
                targets: 7,
                className: 'dt-body-right' 
            }
        ],rowCallback: function(row, data, index){
            $(row).find('td:eq(7)').text('₱' + Number(parseFloat(data.totalorderAmount).toFixed(2)).toLocaleString());
        }        
    });

    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-print').trigger('click');
    });
    $('#csvBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-csv').trigger('click');
    });
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
