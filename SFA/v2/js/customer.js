var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("username");
var sourceData;
var tableData;
var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/applicationBeta.php";
var selectedCustomer;

$('.loading-table').hide();
// getcompname();
getcompname_dynamic("Customer", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Customer');
        },error: function(jqXHR, textStatus, errorThrown) {
            alert('ERROR CONNECTING TO SERVER:\n Please Check your connection settings.');
        }
    });
} 

$('.job-inpt-data-h').attr('disabled', 'disabled');

VirtualSelect.init({
    ele: '#VSmdCode',
});

// initVS();
customerDataTable2();
customerData2();

// function customerData(){
//     $('#stockRequest_TAB').hide();
//     $('.loading-table').show();
//     $.ajax ({
//         url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
//         type: "POST",
//         data: {"type":"CUSTOMER_TAGGING_DATA", "CONN":con_info},
//         dataType: "JSON",
//         crossDomain: true,
//         cache: false,     
//         async: false,       
//         success: function(r){ 
//             if(r.lenght != 0){ 
//             sourceData = r;
//                 $('#stockRequest_TAB').show();
//                 $('.loading-table').hide();
//             }else{
//                 alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
//             }
//         }
//     });
// }

function initVS(){
    $.ajax ({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data:{
            "type": "SALESMAN_FETCHALL",
            "CONN": con_info,
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            if(r.lenght != 0){ 
                document.querySelector('#VSmdCode').destroy();
                console.log(r);
                var salesmanData = r.data;
                var myOptions = [];

                for (var x = 0; x < salesmanData.length; x++) {
                    var obj = { label: salesmanData[x].mdName, value: salesmanData[x].mdCode };
                    myOptions.push(obj);
                }
                VirtualSelect.init({
                    ele: '#VSmdCode',
                    options: myOptions,
                    search: true,
                    maxWidth: '100%', 
                    placeholder: 'Select Assigned Salesman',
                    multiple: false
                });
            }else{
                alert('NO DATA FOUND');
            }
        }
    });

    
}

function customerData2(){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data:{
            "type": "CUSTOMER_FETCHALL",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            if(r.lenght != 0){ 
            sourceData = r;
            tableData.clear().rows.add(sourceData).draw();
                $('#stockRequest_TAB').show();
                $('.loading-table').hide();
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
            }
        }
    });
}

function refreshCustomerData(){
    $.ajax ({
       url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data:{
            "type": "CUSTOMER_FETCHALL",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            if(r.lenght != 0){ 
                sourceData = r.data;
                tableData.clear().rows.add(sourceData).draw();
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
            }
        }
    });
}

// function customerDataTable(){
//     tableData =  $('table.customerList').DataTable({
//         "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
//         "data": sourceData,
//         "scrollX": true,
//         "ordering": false,
//         "language": {
//             "emptyTable": "No available records as of now.",
//             "paginate": {
//                 "previous": "<i class='fa-solid fa-caret-left'></i>",
//                 "next": "<i class='fa-solid fa-caret-right'></i>"
//             },
//         },
//         "columns": [
//             { "data": "salesmanAssign", title: "Salesman"},
//             { "data": "CustomerName", title: "Customer Name"},
//             { "data": "DefaultOrdType", title: "Order Type" },
//             { "data": "SoldToAddr1", title: "Address" },
//             { "data": "Contact", title: "Contact Person"},
//             { "data": "Telephone", title: "Contact #" },
//             { "data": "CustType", title: "Cust Type"}
//         ],
//         buttons: [ 'excel', 'print', 'copy' ],
//         // "aaSorting": [[ 0, "desc" ]],
//         rowCallback: function(row, data, index){
//             var statIndicator = $(row).find('td:eq(2)').text();
//             if(statIndicator == 'B'){ 
//             // $(row).find('td:eq(2)').text('BOOKING');
//                 $(row).find('td:eq(2)').css({'color': 'white', "background-color": "#e06335", "text-align":"center"});
//             }else{
//                 $(row).find('td:eq(2)').text('T');
//                 $(row).find('td:eq(2)').css({'color': 'white', "background-color": "#00A86B", "text-align":"center"});
//             }
//         }
//     });

//     $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
//         var searchTerm = $(this).val();
//         tableData.search(searchTerm).draw();
//     });
//     $('#excelBtn').on('click', function() {
//         console.log('Custom button clicked');
//         $('.buttons-excel').trigger('click');
//     });
//     $('#printBtn').on('click', function() {
//         console.log('Custom button clicked');
//         $('.buttons-print').trigger('click');
//     });
//     $('#copyBtn').on('click', function() {
//         console.log('Custom button clicked');
//         $('.buttons-copy').trigger('click');
//     });

//     $('table.customerList tbody').on('click', 'tr', function () {
//         var tr = $(this).closest('tr');
//         var row = tableData.row(tr);
//         exec_savetojobber(row.data());
//     });

//     function exec_savetojobber(r){
//         var ordtype = 'BOOKING';
//         if(r.DefaultOrdType != 'B'){
//             ordtype = 'TRUCK';
//             $('.infoFooter').html("Click 'Yes' if you want to change order type to <strong>BOOKING</strong>");
//             $('#revertBtn').hide();
//             $('#addJobberBtn').show();
//         }else{
//             $('.infoFooter').html("Click 'Yes' if you want to change order type to <strong>TRUCK</strong>");
//             $('#addJobberBtn').hide();
//             $('#revertBtn').show();
//         }

//         $('#mdCodeH').val(r.Salesperson);
//         $('#custCodeH').val(r.Customer);
//         $('#customerH').val(r.Name);
//         $('#contactnumH').val(r.Telephone);
//         $('#contactPersonH').val(r.Contact);
//         $('#addressH').val(r.SoldToAddr1);
//         $('#isLockH').val(r.isLockOn);
//         $('#custTypeH').val(r.CustType);
//         $('#latH').val(r.Latitude);
//         $('#longH').val(r.Longitude);
//         $('#orderTypeText').html(ordtype);
//         //$('#isLockText').html(islockOnverifyer(r.isLockOn));
//         $('#tojobbermodal').modal('show');
//     }
// }

function customerDataTable2(){
    tableData =  $('table.customerList').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<B><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "data": sourceData,
        "scrollX": true,
        "ordering": true,
        "language": {
            "emptyTable": "No available records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            },
        },
        "columns": [
            { "data": "mdCode", title: "Salesman"},
            { "data": "customerID", title: "CustomerID"},
            { "data": "custCode", title: "Customer Code"},
            { "data": "custName", title: "Customer Name"},
            { "data": "address", title: "Address" },
            { "data": "contactPerson", title: "Contact Person"},
            { "data": "contactCellNumber", title: "Contact #" },
            { "data": "contactLandline", title: "Landline" },
            { "data": "custType", title: "Customer Type"},
            { "data": "frequencyCategory", title: "Freq. Cat."},
            { "data": "mcpDay", title: "MCP Day"},
            { "data": "mcpSchedule", title: "MCP Schedule"},
            { "data": "priceCode", title: "Price Code"},
            { "data": "PRINTSORTING", title: "Print Sorting"},
			 { "data": "latitude", title: "Latitude"},
			 { "data": "longitude", title: "Longitude"},
        ],
        columnDefs: [
            {
                targets: [ 7, 8, 9, 11 ],
                className: 'text-center dt-body-center',
            },
        ],
        buttons: [
            {
                extend: 'collection',
                text: '<i class="fa-solid fa-download"></i> Export',
                className: 'customDTTables dt-button buttons-collection',
                autoClose: true,
                buttons: [
                    'print', 'csv', 'excel', 'copy'
                ],
            },
            {
                text: 'Customer Tiering',
                className: 'customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                    var win = window.open('customerTiering', '_blank');
                    if (win) {
                        //Browser has allowed it to be opened
                        win.focus();
                    } else {
                        //Browser has blocked it
                        alert('Please allow popups for this website');
                    }
                }   
            },
        ],
        rowCallback: function(row, data, index){
        
            var sorting = data.PRINTSORTING.toString().toUpperCase();
            //as per sir roy no need butangan og a-z ang alphabetical
                if(sorting == 'Y'){
                    $(row).find('td:eq(13)').css({'color': 'blue'});
                    $(row).find('td:eq(13)').html('Alphabetical');
                }else{
                    $(row).find('td:eq(13)').css({'color': 'blue'});
                    $(row).find('td:eq(13)').html('Chronological');
                }
        }
        
    });

    $('.customDTTables').removeClass('btn btn-secondary');

    $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
        var searchTerm = $(this).val();
        tableData.search(searchTerm).draw();
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

    $('table.customerList tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        // exec_savetojobber(row.data());
        selectedCustomer = row.data();
        getCustomerDetails(row.data())
    });

    function exec_savetojobber(r){
        var ordtype = 'BOOKING';
        if(r.DefaultOrdType != 'B'){
            ordtype = 'TRUCK';
            $('.infoFooter').html("Click 'Yes' if you want to change order type to <strong>BOOKING</strong>");
            $('#revertBtn').hide();
            $('#addJobberBtn').show();
        }else{
            $('.infoFooter').html("Click 'Yes' if you want to change order type to <strong>TRUCK</strong>");
            $('#addJobberBtn').hide();
            $('#revertBtn').show();
        }

        $('#mdCodeH').val(r.Salesperson);
        $('#custCodeH').val(r.Customer);
        $('#customerH').val(r.Name);
        $('#contactnumH').val(r.Telephone);
        $('#contactPersonH').val(r.Contact);
        $('#addressH').val(r.SoldToAddr1);
        $('#isLockH').val(r.isLockOn);
        $('#custTypeH').val(r.CustType);
        $('#latH').val(r.Latitude);
        $('#longH').val(r.Longitude);
        $('#orderTypeText').html(ordtype);
        //$('#isLockText').html(islockOnverifyer(r.isLockOn));
        $('#tojobbermodal').modal('show');
    }

    function getCustomerDetails(r){
        $('#mdCodeH').val(r.salesmanName);
        $('#custCodeH').val(r.custCode);
        $('#customerID').val(r.customerID);
        $('#customerH').val(r.custName);
        $('#contactnumH').val(r.contactCellNumber);
        $('#landline').val(r.contactLandline);
        $('#contactPersonH').val(r.contactPerson);
        $('#addressH').val(r.address);
        $('#custTypeH').val(r.custType);
        $('#mcpDay').val(r.mcpDay);
        $('#frequencyCategory').val(r.frequencyCategory);
        $('#mcpSchedule').val(r.mcpSchedule);
        $('#priceCode').val(r.priceCode);

        $('#printsorting').val(r.PRINTSORTING);
        $('#tojobbermodal').modal('show');
    }
}

function islockOnverifyer(r){
    if(r == 0){
        return '<strong style="color: red;">NO</strong>';
    }
    return '<strong style="color: #5ee663;">YES</strong>';
}

function exec_insertCustomer(){
    var r = confirm("Press 'OK' to proceed.");
    if(r){
        $('#addJobberBtn').html('<i class="fa fa-spinner fa-spin"></i> updating.. ');
        $( "#addJobberBtn").prop( "disabled", true );
        var custCode = $('#custCodeH').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"UPDATE_ORDERTYPE", 
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "custCode":custCode
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    customerData();
                    tableData.clear().rows.add(sourceData).draw();
                    alert('Customer succesfully updated!');
                }else{
                    alert('UNABLE TO INSERT: Customer is already in the jobber list!');
                }
                    $("#addJobberBtn").prop( "disabled", false );
                    $('#addJobberBtn').html('Add');
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR CUSTOMER UPDATE: ' + JSON.stringify(XMLHttpRequest.responseText));
                $( "#addJobberBtn").prop( "disabled", false );
                $('#addJobberBtn').html('Add');
            }
        });
    }
}

function exec_insertCustomer_revert(){
    var r = confirm("Press 'OK' to proceed.");
    if(r){
        $('#revertBtn').html('<i class="fa fa-spinner fa-spin"></i> updating.. ');
        $( "#revertBtn").prop( "disabled", true );
        var custCode = $('#custCodeH').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"UPDATE_ORDERTYPE_REVERT", 
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "custCode":custCode
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    customerData();
                    tableData.clear().rows.add(sourceData).draw();
                    alert('Customer succesfully updated!');
                }else{
                    alert('UNABLE TO INSERT: Customer is already in the jobber list!');
                }
                    $("#revertBtn").prop( "disabled", false );
                    $('#revertBtn').html('Add');
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR CUSTOMER UPDATE: ' + JSON.stringify(XMLHttpRequest.responseText));
                $( "#revertBtn").prop( "disabled", false );
                $('#revertBtn').html('Add');
            }
        });
    }
}

function showNotif(view=''){
    $.ajax ({
        url: "../geofencing/GeofencingAPI.php",
        type: "GET",
        data: {"type":"view_notifications_icon_"+user, "view":view},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
        success: function(response){ 
           // console.log('Notification function has been refresh');                
            $("#notifs-icon-div").html(response.notification);
            if(response.unseen_notification > 0){
               $('.count').html(response.unseen_notification);
            }
        }
    });
}


document.getElementById('addCustomerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add New Customer!"
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData(this);
            const customerData = Object.fromEntries(formData.entries());
            customerData["mdCode"] = $('#VSmdCode').val(); 

            console.log(customerData);
            $.ajax({
                url: LOCALLINK + API_ENDPOINT,
                type: "POST",
                data: {
                    type: "CUSTOMER_INSERT", 
                    customerArray: JSON.stringify(customerData),
                    "CONN": con_info,
                },
                dataType: "JSON",
                crossDomain: true,
                cache: false,
                success: function(response) {
                    if (response.success) {
                        refreshCustomerData();

                        Swal.fire({
                            title: "Good job!",
                            text: response.message,
                            icon: "success"
                        });

                        $('#addCustomerModal').modal('hide');
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops... Something went wrong!",
                            text: response.message,
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX Error: ", error);
                }
            });
        }
    });
});

function delCustomer(){
    var customerID = selectedCustomer.customerID;

    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "POST",
        data: {
            type: "CUSTOMER_DELETE", 
            customerID: customerID,
            "CONN": con_info,
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(response) {
            if (response.success) {
                refreshCustomerData();
                Swal.fire({
                    title: "Good job!",
                    text: response.message,
                    icon: "success"
                });
                $('#tojobbermodal').modal('hide');
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops... Something went wrong!",
                    text: response.message,
                  });
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error: ", error);
        }
    });
}

function updateprintsorting(){
    
    var f = confirm('Are you sure you want to update this customer?');
    if(f){
        $('#uptsortingbtn').html('<i class="fa fa-spinner fa-spin"></i> updating.. ');
        $("#uptsortingbtn").prop( "disabled", true );

        var printsorting = $('#printsorting').val();
        var custCode = $('#custCodeH').val();

        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"UPDATECUST_PRINT_SORTING", 
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "custCode":custCode,
                printsorting:printsorting
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    customerData2();
                    tableData.clear().rows.add(sourceData).draw();
                    alert('Customer succesfully updated!');
                    $('#tojobbermodal').modal('hide');
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR CUSTOMER UPDATE: ' + JSON.stringify(XMLHttpRequest.responseText));
                $("#uptsortingbtn").prop( "disabled", false );
                $('#uptsortingbtn').html('Update');
            }
        });

    }


}