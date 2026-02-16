var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
const datetime_options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
};

determineUserType(usertype); 

// getcompname();
getcompname_dynamic("Admin Sync logs", "titleHeading"); 
VirtualSelect.init({
    ele: '#salesmanSelectList'
});

VirtualSelect.init({
    ele: '#customerSelectList'
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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Admin Sync logs');
        }
    });
} 

$('.loading-table').hide();
function stockRequestSourceData(start, end){
    var customers = $('#customerSelectList').val();
    $('#filterReport').modal('hide');
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            type: "GET_ADMIN_SYNC_LOGS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            startdate: start,
            enddate: end,
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
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
                $('#reportrange1 span').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY'));
                $('.filterBtn').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY'));
            } else{
                $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                $('.filterBtn').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
            $('#dateSelected').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            startPickDate = start.format('YYYY-MM-DD');
            endPickDate = end.format('YYYY-MM-DD');

    });

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
       
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
    var salesmanCode = $('#salesmanSelectList').val();
    var customers = $('#customerSelectList').val();
    if(!startPickDate || !endPickDate){
        Swal.fire({
            text: "Please Filter a Date!",
            icon: "error"
        });
        return;
    }

    stockRequestSourceData(startPickDate, endPickDate)
});

datatableApp();
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "order": [[2, "desc"]], 
        "ordering": true,
        "filtering":true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "Syncby", title:"Admin" },
            { data: "Description", title:"Module" },
            { 
                data: "syncStarted", 
                title: "Sync Date",
                render: function (data, type, row) {
                    if (!data) return '';
                    if (type === 'sort' || type === 'type') { return data; }

                    const d = new Date(data);
                    return d.toLocaleString('en-US', datetime_options);
                }
            }
               
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
                filename: 'AdminSyncLogs - '+ moment().format("DD-MMM-YYYY"),
                customize: function ( xlsx ) {
                },
                action: function(e, dt, button, config) {
                    var f = confirm('This would generate all records based on the date you filter.\nPress OK to continue.');
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
        createdRow: function (row, data, dataIndex) {
            row.id = `${data.transactionID}`;
            
        }
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

    // $('#stockRequest_TAB tbody').on('click', 'tr', function () {
    //     Swal.fire({
    //         html: "Please Wait... Preparing Data...",
    //         timerProgressBar: true,
    //         allowOutsideClick: false,
    //         didOpen: () => {
    //             Swal.showLoading();
    //             setTimeout(() => {
    //                 var row = tableData.row(this);     
    //                 var rowData = row.data();  
    //                 var rowId = $(this).attr('id');   
    //                 viewDetails(rowId, rowData);
    //             }, 1000);
    //         },
    //     });
    // });
}

function viewDetails(transacID, rowData){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_SO_DETAILS_ERIC_LOGS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "transactionID":transacID, "itemCode":rowData.itemNumber},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(response){
            var r = response[0];
            $('#modal_salesman').html(r.SALESMAN_DETAILS[0].mdName);
            if(rowData.api_status == null){
                $('#modal_status').html('PENDING');
                $('.resendBtn').show();
            }else if(rowData.api_status != null && (rowData.api_status).trim() == "S"){
                $('#modal_status').html('SUCCESS'  + '<span class="mdi mdi-check-decagram" style="color: #61C711;"></span>');
                $('.resendBtn').hide();
            } else{
                $('#modal_status').html('ERROR' + '<span class="mdi mdi-close-circle-outline" style="color: #FF0000;"></span>');
                $('.resendBtn').show();
            }
            $('#modal_docNo').html(r.transactionID);
            $('#modal_mdCode').html(r.SALESMAN_DETAILS[0].mdCode + " (" + r.SALESMAN_DETAILS[0].DefaultOrdType + ")");
            $('#modal_WHCode').html(r.SALESMAN_DETAILS[0].WarehouseCode);
            $('#modal_WHBO').html(r.SALESMAN_DETAILS[0].BOWarehouse);
            $('#modal_GSRW').html(r.SALESMAN_DETAILS[0].GoodStockReturnWarehouse);
            
            $('#modal2_customername').html(r.custName.split(" ").slice(0, -1).join(" "));
            $('#modal2_customerID').html(r.custCode);
            $('#modal2_address').html(r.address);
            $('#modal2_refnoH').html(r.refno + '<span class="mdi mdi-barcode"></span>');
            $('#modal2_transactionD').html(formatDate(r.deliveryDate.split(" ")[0]));
            $('#modal2_transactionT').html(r.deliveryDate.split(" ")[1]);
            $('#modal2_battPercentage').html(r.batteryStat + "%");
            $('#modal2_remarks').html(rowData.api_response);

            console.log(r);
            var cont = '';
            var ctr = 0;
            for(var x = 0; x < r.TRANSACTION_DETAILS.length; x++){
                ctr++;
                cont += '<tr>'+
                            '<td>'+r.TRANSACTION_DETAILS[x].stockCode+'</td>'+
                            '<td style="text-align: left !important;">'+r.TRANSACTION_DETAILS[x].Description+'</td>'+
                            '<td style="text-align: center !important;">'+r.TRANSACTION_DETAILS[x].quantity+'</td>'+
                            '<td style="text-align: right !important;">â‚± '+(parseFloat(r.TRANSACTION_DETAILS[x].piecePrice) * parseFloat(r.TRANSACTION_DETAILS[x].quantity)).toFixed(2)+'</td>'+
                        '</tr>';
            }
            for(; ctr < 2; ctr++){
                cont += '<tr style="height:41.1167px">'+
                            '<td></td>'+
                            '<td style="text-align: left !important;"></td>'+
                            '<td style="text-align: center !important;"></td>'+
                            '<td style="text-align: right !important;"></td>'+
                        '</tr>';
            }
            $('#salesDetailsBody').html(cont);
            $('#salesDmodal').modal('show');

            Swal.close();
        }
    });
} 

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});
    
$('#printBtn').on('click', function() {
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

function formatDate(originalDateString){
    var parts = originalDateString.split('-'); 
    var formattedDateString = parts[1] + '/' + parts[2] + '/' + parts[0]; 
    return formattedDateString;
}

function resendItem(){
    Swal.fire({
        icon: "info",
        title: 'Feature will be available soon.',
    });
}