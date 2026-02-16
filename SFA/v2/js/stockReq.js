var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var startPickDate_e, endPickDate_e, if1dayisSelected;
var sourceDat;
var tableData;
var sourceDat2;
var tableData2;

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

determineUserType(usertype); 

stockRequestSourceData();
datatableApp();
datatableApp2();

datePicker_extruct();

function datePicker_extruct(){
    var start = moment().subtract(0, 'days');
    var end = moment();
    $('#reportrange1').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "maxDate": end,
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
            var d1 = moment(start);
            var d2 = moment(end);
            if1dayisSelected = d2.diff(d1);

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
        startPickDate_e = picker.startDate.format('YYYY-MM-DD');
        endPickDate_e = picker.endDate.format('YYYY-MM-DD');
        
        stockRequestSourceData2(startPickDate_e, endPickDate_e);
        tableData2.clear().rows.add(sourceDat2).draw();
    });
}
      
VirtualSelect.init({
    ele: '#salesmanList',
});

VirtualSelect.init({
    ele: '#refnoList',
});

$('#pending_stockrequestlist table').removeClass('hidden');
$('#pending_stockrequestlist').hide();
$('.btn1').click(function (){         
    $('.btn1').removeClass('inactiveTab');
    $('.btn1').addClass('activeTab');

    $('.btn2').removeClass('activeTab');
    $('.btn2').addClass('inactiveTab');

    $('#approved_stockrequestlist').show();
    $('#pending_stockrequestlist').hide();      
});

$('.btn2').click(function (){
    $('.btn2').removeClass('inactiveTab');
    $('.btn2').addClass('activeTab');

    $('.btn1').removeClass('activeTab');
    $('.btn1').addClass('inactiveTab');

    $('#pending_stockrequestlist').show();
    $('#approved_stockrequestlist').hide();

    stockRequestSourceData();
    tableData.clear().rows.add(sourceDat).draw();
});

function execute_print(){
    var salesman = $('#salesmanList').val();
    var refno = $('#refnoList').val();
    localStorage.setItem("fillteredSalesman_stockrequest", salesman);
    localStorage.setItem("fillteredRefno_stockrequest", refno);
    localStorage.setItem("fillteredSite_stockrequest", user);
    if(!GBL_DOMAIN){
        alert('No GBL_DOMAIN');
    }
    window.open(`${GBL_DOMAIN}/SFA/print-this-stockrequest`, "_blank");
}

function allSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"stockRequest_salesman_selection", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){            
            var data = JSON.parse(response);
            console.log(data);
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].mdCode+' '+data[x].mdName, value: data[x].mdCode };
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
            console.log("Salesman Virtual Successfully Initialized");
        }
    })
}

$('#salesmanList').on('change', function() {
    var value = $(this).val();
    get_refno(value);
});

$('#refnosection').on('change', function() {
    $('#printbtn').prop('disabled', false);
});
          
$('#refnosection').hide();
$('#loadingsection').hide();

function get_refno(mdCode){
    $('#refnosection').hide();
    $('#loadingsection').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"get_stockRequest_refNo", "mdCode":mdCode, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            $('#loadingsection').hide();
            $('#refnosection').show();
            var myOptions = [];
            for(var x = 0; x < r.length; x++){
                var obj = { label: r[x].refNo, value: r[x].refNo };
                myOptions.push(obj);
            }
            console.log(myOptions);

            document.querySelector('#refnoList').destroy();
            VirtualSelect.init({
                ele: '#refnoList',
                options: myOptions,
                maxWidth: '250px',
                placeholder: 'Select Reference Number'
            });
            console.log("Reference Number Virtual Successfully Initialized");
        }
    });
}


function stockRequestSourceData(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"stockRequest_pend", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            sourceDat = r;
        }//success
    });
}


function datatableApp(){
    tableData = $('table.pendingTBL').DataTable({
        "dom": 'Bfrtip',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "ordering": false,
        order: [[ 1, 'asc' ]],
        columns: [
            { data: "transDate", title:"Trans. Date" },
            { data: "refNo", title:"Ref #" },
            { data: "mdCode", title:"Md Code" },
            { data: "mdName", title:"Md Name" },
            { data: "StockCode", title:"Stock Code" },
            { data: "Description", title:"Description" },
            { data: "Cases", title:"Cases" },
            { data: "IB", title:"IB" },
            { data: "PCS", title:"PCS" },
            { data: "status", title:"Status"},
            { data: "contactCellNumber", title:"Contact #" },
            { data: "remarks", title:"Remarks" }
        ],
        buttons: [
            {
                    extend: 'collection',
                    text: 'EXPORT',
                    autoClose: true,
                    buttons: [ 'excel', 'copy' ]
            },
        ],rowCallback: function(row, data, index){
            var statIndicator = $(row).find('td:eq(9)').text();
            if(statIndicator == 'VERIFIED'){
                $(row).find('td:eq(9)').css({'color': 'white', "background-color": "#00A86B"});
            }else{
                $(row).find('td:eq(9)').css({'color': 'white', "background-color": "#e06335"});
            }
        }
    });
}


function stockRequestSourceData2(start, end){
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"stockRequest_appv", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "start":start, "end":end},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            sourceDat2 = r;
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
      
allSalesman();


function datatableApp2(){
    tableData2 = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat2,
        "scrollX": true,
        "ordering": false,
        "language": {
            "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "transDate", title: "Date" },
            { data: "refNo", title: "Ref #" },
            { data: "mdCode", title: "Md Code" },
            { data: "mdName", title: "Md Name" },
            { data: "stockCode", title: "Stock Code" },
            { data: "Description", title: "Description" },
            { data: "Cases", title: "Cases" },
            { data: "IB", title: "IB" },
            { data: "PCS", title: "PCS" },
            { data: 'Amount', title: "Amount"},
            { data: "STATUS", title: "Status"},
            { data: "contactCellNumber", title: "Contact #" },
            { data: "remarks", title: "Remarks" }
        ],
        buttons: [
            { 
                text: 'excel', 
                extend: 'excel',
            }, 
            {
                text:'copy',
                extend: 'copy',
            },
            {
                text: 'print',
                extend: 'print',
                className: 'addnewsalesman',
                action: function(e, dt, node, config){
                    $('#filterprintmodal').modal('show');
                    $('#printbtn').prop('disabled', true);
                    $('#refnosection').hide();
                }
            }
        ],
        columnDefs: [
            {
                targets: [6, 7, 8, 10],
                className: 'dt-body-center'
            },
            {
                targets: 9,
                className: 'dt-body-right'
            },
        ],
        rowCallback: function(row, data, index){
            var statIndicator = $(row).find('td:eq(10)').text();
            var total = $(row).find('td:eq(9)').text();
            $(row).find('td:eq(9)').text(Number(parseFloat(total).toFixed(2)).toLocaleString());
            if(statIndicator == 'VERIFIED'){
                $(row).find('td:eq(10)').css({'color': 'white', "background-color": "#00A86B"});
            }else{
                $(row).find('td:eq(10)').css({'color': 'white', "background-color": "#e06335"});
            }
            $(row).find('td:eq(9)').text('₱ ' + Number(parseFloat(data.Amount).toFixed(2)).toLocaleString());
        }
    });

    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        document.querySelector('#salesmanList').reset();
        $('.buttons-print').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-copy').trigger('click');
    });
}

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    var searchTerm = $(this).val();
    tableData2.search(searchTerm).draw();
});
    
function updateStockReq(refNo, mdCode, stockCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"updateStockRequest", 
            "userID": GBL_USERID, "distCode": GBL_DISTCODE,
            "refNo": refNo,
            "mdCode":mdCode,
            "stockCode":stockCode
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
