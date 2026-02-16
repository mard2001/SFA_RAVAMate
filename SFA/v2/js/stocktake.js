var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;

determineUserType(usertype); 

// getcompname();
getcompname_dynamic("Placement Check", "titleHeading");


VirtualSelect.init({
    ele: '#salesmanList',
});

function loadSalesman(start, end) {
    $('#fetchCont').show();
    $('#emptySalesman').hide();
    $('#salesmanList').hide();
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "STK_SALESMAN_LIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "start": start, "end": end },
        dataType: "json",
        crossDomain: true,
        cache: false,
        success: function (data) {
            $('#fetchCont').hide();
            if(data.length == 0){
                $('#salesmanList').hide();
                $('#emptySalesman').show();
                $('#dcrbtn').prop('disabled', true);
            }else{
                $('#salesmanList').show();
                $('#dcrbtn').prop('disabled', false);
                var myOptions = [];
                for (var x = 0; x < data.length; x++) {
                    var obj = { label: data[x].SALESMAN, value: data[x].SALESMANCODE };
                    myOptions.push(obj);
                }
                console.log(myOptions.length);

                document.querySelector('#salesmanList').destroy();
                VirtualSelect.init({
                    ele: '#salesmanList',
                    options: myOptions,
                    search: true,
                    maxWidth: '350px',
                    placeholder: 'Select Salesman'
                });
            }
        }
    });
}

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Placement Check');
        }
    });
} 

$('.loading-table').hide();
function stockRequestSourceData(start, end){
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"stocktakeReportData_All", "startDate":start, "endDate":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(r){ 
            sourceDat = r;
            $('#stockRequest_TAB').show();
            tableData.clear().rows.add(sourceDat).draw();
            dialog.modal('hide');
        },//success
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
            // endPickDate = end.format('YYYY-MM-DD');
            if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
                let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
                $('#reportrange1 span').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY'));
                $('#dateSelected').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY'));
            } else{
                $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                $('#dateSelected').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
            startPickDate = start.format('YYYY-MM-DD');
            endPickDate = end.format('YYYY-MM-DD');
    });

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
        $('#stockRequest_TAB').hide();
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        startPickDate = start;
        endPickDate = end;
        stockRequestSourceData(startPickDate, endPickDate);
        tableData.clear().rows.add(sourceDat).draw();
    });
}

function generate_Dcr_data(){
    var salesman = document.querySelector('#salesmanList').value;
    
    localStorage.setItem('salesman', salesman);
    localStorage.setItem('startDate_stk', startPickDate);
    localStorage.setItem('endDate_stk', endPickDate);
    window.open('https://mybuddy-sfa.com/SFA/print-stocktake', '_blank');
}

datatableApp();
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "ordering": false,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "STKDATE", title:"STK Date" },
            { data: "SALESMAN", title:"Salesman" },
            { data: "CUSTOMER", title:"Customer" },
            { data: "CUSTOMERCHANNEL", title:"Customer Channel"},
            { data: "STAKENO", title:"Stake No." },
            { data: "STKREQUIRED", title:"STK Required" },
            { data: "STKAVAILABLE", title:"STK Available" },
            { data: "STKOUTOFSTOCK", title:"STK Out of Stock" }
        ],
        buttons: [
            {
                extend: 'print',
                text: 'print',
                action: function(e, dt, node, config){
                }   
            },
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: '',
                filename: 'STKREPORTS - '+ moment().format("DD-MMM-YYYY"),
                customize: function ( xlsx ) {
                },
                action: function(e, dt, button, config) {
                    var f = confirm('This would generate all salesman records based on the date you filter.\nPress OK to continue.');
                    if(f){
                        $('.loading').fadeIn();
                        var that = this;
                        setTimeout(function () {
                            $.fn.dataTable.ext.buttons.excelHtml5.action.call(that,e, dt, button, config);
                            $('.loading').fadeOut();
                        },500);
                    }
                },
            },
        ],
        columnDefs: [
            {
                targets: [3, 5, 6, 7],
                className: 'dt-body-center'
            },
        ],
    });
    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });

}


$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});

function exportAllData(startPickDate, endPickDate){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"stocktakeReportData_All", "startDate":startPickDate, "endDate":endPickDate, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            sourceDat = r;
        }
    });
}

function updateStockReq(refNo, mdCode, stockCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"updateStockRequest",
            "refNo": refNo,
            "mdCode":mdCode,
            "stockCode":stockCode,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "html",
        crossDomain: true,
        cache: false,           
        async: false, 
        success: function(r){
            if(r != 0){
                alert('Something went wrong! ERROR: ' + r);
            }
        }//success
    });
}

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});
    
$('#printBtn').on('click', function() {
    console.log('Custom button clicked');
    if ( ! tableData.data().any() ) {
        alert( 'No data to print!' );
    }else{
        loadSalesman(startPickDate, endPickDate);
        $('#salesmanListModal').modal('show');
    }
});

$("#btn-print").click(function () {
    var salesman = $("#salesmanList option:selected").text();
    var selectedSalesman = $("#salesmanList").val();
    var date = $('#jobberDate').val();
    var datePrinted = new Date().toLocaleString();

    if(selectedSalesman == ''){
        alert('Please select date first!');
    }else{
        //printData();
        $('#printThisTable').printThis({
            importCSS: true,
            header: "<div>"+salesman+"<small class='pull-right'> Date Created: "+datePrinted+"</small></div>",
            pageTitle: "JOBBER FULL OUT FORM",
            printContainer: true,
            copyTagClasses: true
        });
    }
        
});

function printData(){
    window.print();
}

