var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat; 
var tableData;

$('#salesmanHolder').click(function() {
    $('#salesmanListModal').modal('show');
});

VirtualSelect.init({
    ele: '#salesmanList',
});

determineUserType(usertype); 
loadSalesman();
function loadSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"dsr_salesmanLoad", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
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
                maxWidth: '400px',
                placeholder: 'Select Salesman'
            });
            console.log("Virtual Select Successfully Initialized");
        }
    });
}

getcompname_dynamic("", "titleHeading");
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
            $('#titleHeading').html(r[0].company.toUpperCase());
        }
    });
}
      
function generateSalesmanInventory(){
    inventoryValuationReport();
    tableData.clear().rows.add(sourceDat).draw();

    var name = document.querySelector('#salesmanList').getDisplayValue();
    // $('#tableTitle').html(name+'</br><span style="color:#FFF; font-weight: 300; font-size:12px"><span style="color:#FF0000">*NOTE:</span> Let the salesman HIT \'sync inventory\' for accurate results.</span>');
    $('#tableTitle').html(name);
}
       
function inventoryValuationReport(){
    $('#salesmanListModal').modal('hide');
    $('#stockRequest_TAB').hide();
    var salesman = $('#salesmanList').val();
    console.log(salesman);
    getLastUpdatedInventory(salesman);
    var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
            backdrop: true
        });
    var botboxMsg = '';
    $.ajax ({
        // url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_RAVAMATE_SALESMAN_INV", "mdCode":salesman, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                sourceDat = r;
                $('#stockRequest_TAB').show();
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

function getLastUpdatedInventory(mdCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_LASTUPDATED_INVENTORY_VALUATION", "mdCode":mdCode, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            console.log(r);
            $('#reportrange1').html('<span>'+formatDate(r[0].lastupdated)+'</span><i class="mdi mdi-calendar-month-outline" style="font-size: 20px;"></i>');
        }
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
            "emptyTable":"No data available, Click the <span style='color: blue;'>'Filter by Salesman'</span> button to get started.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "mdCode", title: "mdCode" },
            { data: "mdSalesmancode", title: "Salesman Code" },
            { data: "mdName", title: "Salesman" },
            { data: "stockCode" , title: "Stock Code"},
            { data: "Description", title: "Description" },
            { data: "Brand", title: "Brand" },
            { data: "MainCategory", title: "Main Category" },
            { data: "quantity", title: "Quantity (PCS.)" },
            {  
                data: null, 
                title: "Inv Amount",
                render: function(data, type, row){
                    var quantity = parseInt(row.quantity, 10); 
                    var unitcost = parseFloat(row.unit_cost); 

                    var invAmount = quantity * unitcost;

                    return "₱" + invAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });     
                }

            },
            { data: "lastupdated", title: "Last Updated" },
        ],
        columnDefs: [
            {
                targets: 2,
                className: 'dt-body-left'
            },
            {
                targets: [1, 3, 5, 6, 7],
                className: 'dt-body-center'
            },
            {
                targets: 8,
                className: 'dt-body-right'
            },
        ],
        buttons: [ 'excel' ]
    });
}

$('#excelBtn').on('click', function() {
    console.log('Custom button clicked');
    $('.buttons-excel').trigger('click');
});

function formatDate(dateString) {
    let retVal='';
    let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let date = new Date(dateString);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let dayOfWeek = days[(new Date(date)).getDay()];

    retVal = '<b>' + dayOfWeek + '</b>' + " | " + date.toLocaleDateString('en-US', options);

    return retVal;
}


$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    var searchTerm = $(this).val();
    tableData.search(searchTerm).draw();
});