var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");

determineUserType(usertype); 

// getcompname();
getcompname_dynamic("BO Report", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | BO Report');
        }
    });
}

var sourceDat;
function stockRequestSourceData(start, end){
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
        // closeButton: false
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"BOreports", "startDate":start, "endDate":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                sourceDat = r;
                dialog.modal('hide');
                $('#stockRequest_TAB').show();
            }
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
        dialog.init(function(){
            setTimeout(() => {
                dialog.modal('hide');
            }, 1000);
        });
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
            { data: "mdCode", title: "Mdcode" },
            { data: "transactionID", title: "Transaction ID" },
            { data: "refno", title: "Ref No." },
            { data: "custCode", title: "Customer Code" },
            { data: "deliveryDate", title: "Delivery Date" },
            { data: "stockCode", title: "Stock Code" },
            { data: "Description", title: "Description" },
            { data: "Uom", title: "UOM" },
            { data: "quantity", title: "Qty" },
            { data: "piecePrice", title: "Piece Price" },
            { data: "ReasonCode", title: "ReasonCode" },
            { data: "BOReason", title: "BO Reason" }
        ],
        buttons: [ 'excel', 'print', 'copy' ],
        columnDefs: [
            {
                targets: [7, 8],
                className: 'dt-body-center'
            },
            {
                targets: 9,
                className: 'dt-body-right',
                render: function (data, type, row, meta) {
                    return '₱ ' + Number(parseFloat(data).toFixed(2)).toLocaleString();
                }
            }
        ]
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
        
function getJobberData(){
    var salesman = $('#salesmanList').val();
    var date = $('#jobberDate').val();
         
    $('#selectedDate').html(date);
    $('#prepBy').html($('#salesmanList option:selected').text());
          
    $.ajax ({
        url: "../nestle/sqlApi_"+user+".php",
        type: "GET",
        data: {"type":"jobberRequest", "salesman": salesman, "date":date},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){ 
            $('#jobberTableBody').html(response);
        }//success
    });
}

    
$("#btn-print").click(function () {
    var salesman = $("#salesmanList option:selected").text();
    var selectedSalesman = $("#salesmanList").val();
    var date = $('#jobberDate').val();
    var datePrinted = new Date().toLocaleString();

    if(selectedSalesman == ''){
        alert('Please select date first!');
    }else{
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

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});