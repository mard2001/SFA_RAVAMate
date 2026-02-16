var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var dssdate;
var siteIndicator = '';
var sourceDat;
var startPickDate, endPickDate;
var tableData;


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
getcompname_dynamic("Strike Rate v.1.0", "titleHeading");
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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Strike Rate v.1.0');
        }
    });
} 
  
$('.loading-table').hide();
function stockRequestSourceData(start){
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
        data: {"type":"GET_STRIKE_RATE", "date_selected":start, "userID": GBL_USERID, "distCode": GBL_DISTCODE,},
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
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start);
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
    $('#reportrange1 span').html('Pick a date');
    $('#reportrange1').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
        "autoApply": true,
    }, function(start, end, label) {
        let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
        $('#reportrange1 span').html('<b>' + dayOfWeek+ '</b>' + ' | '+start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

        startPickDate = start.format('YYYY-MM-DD');
        stockRequestSourceData(startPickDate);
        tableData.clear().rows.add(sourceDat).draw();
    });
}

datatableApp();
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
            { data: "TrnDate", title: "TrnDate" },
            { data: "mdCode", title: "MdCode" },
            { data: "mdSalesmanCode", title: "MdSalesmanCode" },
            { data: "mdName", title: "MdName" },
            { data: "Calls", title: "Calls" },
            { data: "MCP" ,  title: "MCP"},
            { data: "StrikeRate" , title: "StrikeRate"},
            { data: "Remarks" , title: "Remarks"}
        ],
        buttons: [
            'print', 'csv', 'excel'
        ],
        columnDefs: [
            {
                targets: [4, 5, 7],
                className: 'dt-body-center' 
            }
        ],rowCallback: function(row, data, index){
            // var statIndicator = $(row).find('td:eq(7)').text();
            // if(statIndicator == 'MISS'){
            //     $(row).find('td:eq(7)').css({'color': '#FFF', "background-color": "#DC4D4D"});
            // }else{
            //     $(row).find('td:eq(7)').css({'color': '#FFF', "background-color": "#009958"});
            // }
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
