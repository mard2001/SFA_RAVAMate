var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var isLoadedSalesman = false;
var tableData;
var sourceDat;
var startPickDate, endPickDate;

determineUserType(usertype); 
      
getcompname_dynamic("DCR", "titleHeading");
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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | DCR');
        }
    });
} 
 
VirtualSelect.init({
    ele: '#salesmanList',
});

datatableApp();
datePicker();

function loadSalesman(start, end){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"DCR_SALESMAN_LIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "start":start, "end":end},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(data){ 
            if(data.length == 0){
                alert("No salesman available on this date.");
            }
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].mdSalesmancode+'_'+data[x].mdName, value: data[x].mdCode };
                myOptions.push(obj);
            }
            console.log(data);

            document.querySelector('#salesmanList').destroy();
            VirtualSelect.init({
                ele: '#salesmanList',
                options: myOptions,
                search: true,
                keepAlwaysOpen: true,
                placeholder: 'Select Salesman'
            });
            console.log("Virtual Select Successfully Initialized");
            isLoadedSalesman = true;
        }
    });
}

$('.loading-table').hide();
function dcrSourceData(start, end){
    $('#dcr_TAB').hide();
    var salesman = $('#salesmanList').val();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"DCR_MAIN_REPORT", "start":start, "end":end, "mdCode":salesman, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.length != 0){ 
                sourceDat = r;
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
            }
            $('#dcr_TAB').show();
            $('.loading-table').hide();
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
        console.log("Data Successfully Loaded")
    });
}


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
                $('#reportrange1 span').html('<b>' + dayOfWeek + '</b>' + ' | '+start.format('MMMM D, YYYY'));
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
        startPickDate = start;
        endPickDate = end;
        
        loadSalesman(startPickDate, endPickDate);
        // generate_Dcr_data();
        $('#tableTitle').html("");
        tableData.clear().draw();
        $("#myDropdown").addClass("showDropdown");
    });

}

function generate_Dcr_data(){
    dcrSourceData(startPickDate, endPickDate);
    tableData.clear().rows.add(sourceDat).draw();
}


function datatableApp(){
    tableData = $('#dcr_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><"#tableTitle"><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
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
            { data: "salesman", title: "SALESMAN"},
            { data: "ORNumber", title: "O.R." },
            { data: "custCode", title: "CUSTOMER" },
            { data: "InvoiceNumber", title: "S.I. NO." },
            { data: "InvoiceAmount", title: "S.I. AMNT"},
            { data: "CheckDate", title: "CHECKDATE" },
            { data: "BankCode", title: "BANKCODE" },
            { data: "CheckNo", title: "CHECK NO." },
            { data: "Amount", title: "AMOUNT" }
        ],
        buttons: [
            {
                text: 'Print',
                // className: 'bringtoprint',
                action: function(e, dt, node, config){
                    if ( ! tableData.data().any() ) {
                        alert( 'No data to print!' );
                    }else{
                        var salesman = $('#salesmanList').val();
                        localStorage.setItem('mdCode', salesman);
                        localStorage.setItem('startDate', startPickDate);
                        localStorage.setItem('endDate', endPickDate);
                        window.open('print-dcr', '_blank');
                    }
                }   
            }, 'excel'
        ],
        columnDefs: [
            {
                targets: [4,8],
                className: 'dt-body-right'
            },
        ],
        rowCallback: function(row, data, index){
            var salesFormat = data.Amount.toString();
            var invoiceAmount = data.InvoiceAmount.toString();
            var siAmount = data.InvoiceAmount.toString();
            var check = data.BankCode.toString();
            $(row).find('td:eq(4)').text('₱' + Number(parseFloat(invoiceAmount).toFixed(2)).toLocaleString());
            $(row).find('td:eq(8)').text('₱' + Number(parseFloat(salesFormat).toFixed(2)).toLocaleString());

            if(siAmount < 0){
                var amount = Number(parseFloat(Math.abs(invoiceAmount)).toFixed(2)).toLocaleString();
                $(row).find('td:eq(4)').html('<span style="color: red;">('+amount+')</span>');
            }

            if(check != '---'){
                $(row).find('td:eq(7)').html('<span class="text-primary" style="cursor:pointer;" onclick="checkImage(\''+data.InvoiceNumber+'\')">'+data.CheckNo+'</span>');
            } 
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
                .column( 8 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            pageTotal = api
                .column( 8, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            $('#tableTitle_totalSales').html(
                '₱ '+pageTotal.toLocaleString() +' (₱ '+ total.toLocaleString() +')'
            );
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
}

function checkImage(invoiceNum){
    $('#checkiMageModal').modal('show');  
    $('.imageSpinner').show();
    $('#checkImageSelected').hide();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"DCR_CHECK_IMAGE", "invoiceNum":invoiceNum, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            $('#checkImageSelected').attr("src","data:image/jpeg;base64, " + r).show();
            $('.imageSpinner').hide();
        }
    });
}

function dropDown() {
    if(startPickDate && endPickDate){
        if(isLoadedSalesman){
            $("#myDropdown").toggleClass("showDropdown");    
        } else {
            alert('The salesman data is currently loading. Please try again.');
        }
    } else {
        alert('Pick Date First.')
    }
    
}

$('#salesmanList').on('change', function() {
    var selectedSalesman = $(this).val();
    var name = document.querySelector('#salesmanList').getDisplayValue();
    if (selectedSalesman !== '') {
        $('#myDropdown').removeClass("showDropdown");
        $('#tableTitle').html('<span>'+name+'</span>'); 
    }
    
    $('#tableTitle').html('<span>'+name+'</span></br><span style="color:#FFF; font-weight: 300; font-size:12px">Total Sales: <span style="font-weight: 900" id="tableTitle_totalSales"></span></span>');
    generate_Dcr_data();

});

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    var searchTerm = $(this).val();
    tableData.search(searchTerm).draw();
});