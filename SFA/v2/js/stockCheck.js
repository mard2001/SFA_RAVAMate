var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";
var API_ENDPOINT2 = "/BUDDYGBLAPI/MTDAPI/applicationCharlie.php";

determineUserType(usertype); 

// getcompname();
getcompname_dynamic("Stocktake", "titleHeading");


VirtualSelect.init({
    ele: '#salesmanSelectList'
});

VirtualSelect.init({
    ele: '#customerSelectList'
});

function loadSalesman(start, end) {
    console.log(start, end);
    $.ajax({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data:{
            "type": "stockTake_Salesman",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "startdate": start,
            "enddate": end
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function (data) {
            document.querySelector('#salesmanSelectList').destroy();
            
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].MdName, value: data[x].mdCode };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#salesmanSelectList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Specific Salesman'
            });
            setTimeout(() => {
                Swal.close();   
            }, 1000);
        }
    });
}

function loadCustomer(start, end, mdCode) {
    console.log(start, end);
    $.ajax({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data:{
            "type": "stockTake_Customer",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "startdate": start,
            "salesman": mdCode,
            "enddate": end
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function (data) {
            document.querySelector('#customerSelectList').destroy();
            
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].custName, value: data[x].custCode };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#customerSelectList',
                options: myOptions,
                search: true,
                multiple: true,
                maxWidth: '100%', 
                placeholder: 'Select Specific Customer'
            });
            setTimeout(() => {
                Swal.close();   
            }, 1000);
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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Stocktake');
        }
    });
} 

$('.loading-table').hide();
function stockRequestSourceData(start, end, salesman){
    console.log('stockRequestSourceData');
    var customers = $('#customerSelectList').val();
    $('#filterReport').modal('hide');
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data: {
            type: "stockTake_Filtered",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            startdate: start,
            enddate: end,
            salesman: salesman,
            customerArray: customers
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        success: function(r){ 
            console.log(r);
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
                $('#reportrange1 span').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            } else{
                $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
            $('#dateSelected').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            startPickDate = start.format('YYYY-MM-DD');
            endPickDate = end.format('YYYY-MM-DD');

    });

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
        loadSalesman(startPickDate, endPickDate);
        Swal.fire({
            html: "Please Wait... Fetching Salesman...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        // $('#stockRequest_TAB').hide();
        // var start = picker.startDate.format('YYYY-MM-DD');
        // var end = picker.endDate.format('YYYY-MM-DD');
        // startPickDate = start;
        // endPickDate = end;
        // stockRequestSourceData(startPickDate, endPickDate);
        // tableData.clear().rows.add(sourceDat).draw();
    });
}

$('#salesmanSelectList').on('change', function () {
    let selectedValue = $(this).val();
    if (selectedValue) {
        // Perform your action here
        loadCustomer(startPickDate, endPickDate, selectedValue);
        Swal.fire({
            html: "Please Wait... Fetching Customers...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        $('.customerFilterDiv').show();
    }
});


$('#filterReportBtn').on('click', function() {
    console.log('clicks')

    var salesmanCode = $('#salesmanSelectList').val();
    var customers = $('#customerSelectList').val();
    if(!startPickDate || !endPickDate){
        Swal.fire({
            text: "Please Filter a Date!",
            icon: "error"
        });
        return;
    }
    if(!salesmanCode){
        Swal.fire({
            text: "Please select a salesman",
            icon: "error"
        });
        return;
    } 
    if(customers.length < 1){
        Swal.fire({
            text: "Please select a customers",
            icon: "error"
        });
        return;
    }

    stockRequestSourceData(startPickDate, endPickDate, salesmanCode)
});

datatableApp();
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "ordering": true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "transactionID", title:"Transaction ID" },
            { data: "stocCode", title:"Stock Code" },
            { data: "Description", title:"Item Description" },
            { data: "custCode", title:"CustCode" },
            { data: "custName", title:"Customer Name" },
            { data: "quantity", title:"Quantity"},
            { data: "mdCode", title:"MdCode" },
            { data: "transDate", title:"Transaction Date" },
        ],
        buttons: [
            {
                extend: 'print',
                text: 'print',
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
                targets: [1, 3, 5],
                className: 'dt-body-center'
            },
        ],
    });
    $('#excelBtn').on('click', function() {
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        $('.buttons-print').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        $('.buttons-copy').trigger('click');
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
        // loadSalesman(startPickDate, endPickDate);
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

