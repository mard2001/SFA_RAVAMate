var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var dssdate;
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var total;
var pageTotal;
var transactionType = "BOOKING SALES";

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

loadSalesman();
function loadSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"TRN_SALESMAN_TYPE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(data){ 
            for(var x = 0; x<data.length; x++){
                
                switch(data[x].trn_type) {
                    case "BOOKING SALES":
                        $('#salesmanList').append('<button class="transacBtn dropdown-item" value="'+data[x].trn_type+'"><span class="transacBtnIcon mdi mdi-book-open"></span>'+data[x].trn_type+'</button>');
                      break;
                    case "STOCK REQUEST":
                        $('#salesmanList').append('<button class="transacBtn dropdown-item" value="'+data[x].trn_type+'"><span class="transacBtnIcon mdi mdi-dropbox"></span>'+data[x].trn_type+'</button>');
                      break;
                      case "TRADE RETURNS":
                        $('#salesmanList').append('<button class="transacBtn dropdown-item" value="'+data[x].trn_type+'"><span class="transacBtnIcon mdi mdi-clipboard-arrow-left"></span>'+data[x].trn_type+'</button>');
                      break;
                    case "TRUCK SALES":
                        $('#salesmanList').append('<button class="transacBtn dropdown-item" value="'+data[x].trn_type+'"><span class="transacBtnIcon mdi mdi-truck-cargo-container"></span>'+data[x].trn_type+'</button>');
                      break;
                  }
            }

            $('#salesmanList').multiselect({
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

// getcompname();
getcompname_dynamic("", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
          $('#titleHeading').html(r[0].company.toUpperCase());
        }
    });
}

function generateLedger(){
    inventoryValuationReport();
    tableData.clear().rows.add(sourceDat).draw();
}

function inventoryValuationReport(){
    $('#salesmanListModal').modal('hide');
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    var salesman = $('#salesmanList').val();
    var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
            backdrop: true
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"TRN_TRANSACTION_BY_TYPE", "trnType": transactionType, "start": startPickDate, "end":endPickDate, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,           
        success: function(r){ 
            if(r.length != 0){ 
                sourceDat = r;
                tableData.clear().rows.add(sourceDat).draw();
                $('#stockRequest_TAB').show();
                $('.loading-table').hide();
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + startPickDate +' to '+ startPickDate);
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
            $('#reportrange1 span').html('<b>'+dayOfWeek+'</b> | '+start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
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
        generateLedger();
    });
}

datatableApp();
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><"#tableTitle"><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "language": {
          "emptyTable":"No data available, Click the <span style='color: blue;'>'Filter by Date'</span> button to get started.",
          "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "TRN_TYPE", title:"TRN_TYPE" },
            { data: "TXN_DT", title:"TXN_DT" },
            { data: "SALESPERSON", title:"SALESPERSON" },
            { data: "CALLS", title:"CALLS" },
            { data: "AMOUNT", title:"AMOUNT" },
            { data: "BEGINNING", title:"BEGINNING" },
            { data: "ENDING", title:"ENDING" }
        ],
        columnDefs: [
            {
                targets: 4,
                className: 'dt-body-right'
            },
            {
                targets: 3,
                className: 'dt-body-center'
            }
        ],
        rowCallback: function(row, data, index){
            var salesFormat = data.AMOUNT.toString();
            $(row).find('td:eq(4)').text('₱ ' + Number(parseFloat(salesFormat).toFixed(2)).toLocaleString());
        },
        buttons: ['excel']
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

$('#tableTitle').html(transactionType);
$('#salesmanList').on('click', '.transacBtn', function() {
    transactionType = $(this).val();
    $('#tableTitle').html(transactionType);
    generateLedger();
});