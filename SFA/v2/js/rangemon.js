var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");

determineUserType(usertype); 
      
$('#salesmanHolder').click(function(){
    $('#SyncInventoryModal').modal('show');
});

VirtualSelect.init({
    ele: '#salesmanList',
});
    
var tableData;
datatableApp();

loadSalesman();
function loadSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"dsr_salesmanLoad", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }
            console.log(myOptions);
            document.querySelector('#salesmanList').destroy();
            VirtualSelect.init({
                ele: '#salesmanList',
                options: myOptions,
                search: true,
                maxWidth: '350px', 
                placeholder: 'Select Salesman'
            });
            console.log("Virtual Select Successfully Initialized");
        }
    });
}

getcompname_dynamic("Range Monitoring v.2.0.0", "titleHeading");
// getcompname();
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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Range Monitoring v.2.0.0');
        }
    });
} 
      
var sourceDat;
$('.loading-table').hide();
function stockRequestSourceData(){
    var mdCode = $('#salesmanList').val();
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
        data: {
                "type":"GET_RANGE_MONITORING",
                "mdCode":mdCode,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                tableData.clear().rows.add(r).draw();
                $('#stockRequest_TAB').show();
                $('.loading-table').hide();
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED SALESMAN: ' + mdCode);
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


function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "language": {
            "emptyTable":"No data available, Click the <span style='color: blue;'>'Filter by Salesman'</span> button to get started.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "mdCode", title: "mdCode" },
            { data: "Salesperson", title: "Salesperson" },
            { data: "Customer", title: "Customer" },
            { data: "custName", title: "custName" },
            { data: "Range_Target", title: "Range_Target" },
            { data: "AltStockCodeDesc", title: "AltStockCodeDesc" },
            { data: "DropSize", title: "DropSize" },
            { data: "PurchaseQty", title: "PurchaseQty" },
            { data: "isHit", title: "isHit" },
            { data: "BalanceQty(pc)", title: "BalanceQty(pc)" }
        ],
        buttons: [
            'print', 'csv', 'excel'
        ],
        columnDefs: [
            {
                targets: [4, 6, 7, 8, 9],
                className: 'dt-body-center'
            }
        ],rowCallback: function(row, data, index){
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