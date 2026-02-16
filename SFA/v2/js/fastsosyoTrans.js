var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("username");
var sourceData;
var tableData;
var infoWindow = new google.maps.InfoWindow;
var map, marker, icon;

function sentDetails(){
    $('#salesman_phonenum').val('');
    $('#sentDetailsModal').modal('show');
}

$('.loading-table').hide();

function sentTransItems(){
    var transID = $('#transactionID_res').val();
    var phonenumber =  $('#salesman_phonenum').val();

    if($.trim(phonenumber) == ''){
        alert('Phonenumber is required.');
    }else{
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
            type: "POST",
            data: {
                "type":"EXEC_SEND_TRANSDETAILS_TO_SALESMAN",
                'transactionID':transID,
                'contactno':phonenumber,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,         
            async: false,   
            success: function(r){ 
                if(r){
                    alert('Transaction items successfully sent to salesman.');
                    $('#sentDetailsModal').modal('hide');
                }
            },error: function(jqXHR, textStatus, errorThrown) {
                alert('ERROR CONNECTING TO SERVER:\n Please Check your connection settings.');
            }
        });
    }
}

getcompname();
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,         
        async: false,   
        success: function(r){ 
            localStorage.setItem('DISTCD', r[0].DIST_CD);
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Fastsosyo Transactions | v.1.8');
        },error: function(jqXHR, textStatus, errorThrown) {
            alert('ERROR CONNECTING TO SERVER:\n Please Check your connection settings.');
        }
    });
} 

$('.job-inpt-data-h').attr('disabled', 'disabled');
// showNotif();

$('#navDrop').click(function() {
    $("i", this).toggleClass("glyphicon-menu-up glyphicon-menu-down");
});
      
// $(document).on('click', '.dropdown-toggle', function(){
//     $('.count').html('');
//     showNotif('yes');
// });

function feedback(){
    window.open('https://mybuddy-sfa.com/SFA/feedback', '_blank');
}

getDistPreselectedAcs();
function getDistPreselectedAcs(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
        type: "POST",
        data: {
            "type":"GET_AIO_DISTRIBUTORSCUSTOMERLIST",
            "DIST_CODE":$.trim(localStorage.getItem('DISTCD')),
            "distCode": GBL_DISTCODE
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            var cont = '';
            for(var x = 0; x < r.length; x++){
                var statChecker = '';
                if(r[x].isLIkedTo == null || r[x].isLIkedTo == ''){
                    statChecker = '<b style="color: green;">AVAILABLE</b>';
                }else{
                    statChecker = '<b style="color: red;">USED</b>';
                }
                cont += `<tr>
                          <td>`+r[x].partnerID+`<td>
                          <td>`+r[x].custCode+`</td>
                          <td>`+r[x].custName+`</td>
                          <td>`+statChecker+`</td>
                        </tr>`;
            }
            $('#preselactsBody').html(cont);
        }
    });
}

var dssdate;
var GBLSTARTDATE = moment().format('YYYY-MM-DD'), GBLENDDATE = moment().format('YYYY-MM-DD');
function dsspicker(){
    var start = moment().subtract(29, 'days');
    var end = moment();

    $('.datePickerDrow').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        // "maxDate": moment(),
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
        $('.datePickerDrow').html('<span class="mdi mdi-calendar-month-outline"></span><span>'+start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY')+'</span>');
        // getSOreference(start, end);
        });

    $('.datePickerDrow').on('apply.daterangepicker', function(ev, picker) {
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        GBLSTARTDATE = start;
        GBLENDDATE = end;
        customerData(GBLSTARTDATE, GBLENDDATE);
        tableData.clear().rows.add(sourceData).draw();
    });

}

customerData(GBLSTARTDATE, GBLENDDATE);
customerDataTable();
dsspicker();

function customerData(start, end){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
        type: "POST",
        data: {
            "type":"GET_AIO_TRANSACTION",
            'start':start,
            'end':end,
            "DIST_CODE":$.trim(localStorage.getItem('DISTCD')),
            "distCode": GBL_DISTCODE
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            sourceData = r;
            $('#stockRequest_TAB').show();
            $('.loading-table').hide();
        }
    });
}

VirtualSelect.init({
    ele: '#salesmanList',
});
VirtualSelect.init({
    ele: '#customerListSelect',
    // disabled: true,
    placeholder: 'Select Salesman First'
});

function customerDataTable(){
    tableData =  $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "data": sourceData,
        "scrollX": true,
        "ordering": true,
        "language": {
            "emptyTable": "No available records as of now.",
            "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            },
            "aria": {
                "sortAscending": ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            }
        },
        "columns": [
            { "data": "deliveryDate", title: "Trans Date"},
            { "data": "STORENAME", title: "Store Name"},
            { "data": "custCode", title: "CustCode"},
            { "data": "TOTALSKU", title: "# SKU" },
            { "data": "salesman_name", title: "Salesman"},
            { "data": "totalAmount_raw", title: "Amount" },
            { "data": "status", title: "Status" }
        ],
        columnDefs: [
            {
                targets: [ 4 ],
                className: 'text-start',
            },
            {
                targets: [ 5 ],
                className: 'text-end',
            },
            {
                targets: [ 3, 6 ],
                className: 'dt-body-center',
            },
        ],
        // "aoColumnDefs": [
        //     { 
        //         "sClass": "text-end", "aTargets": 4,
        //         "sClass": "text-center", "aTargets": [ 3, 6 ]  
        //     }
        //     //You can also set 'sType' to 'numeric' and use the built in css.           
        // ],
        buttons:  [
            // {
            //     text: 'Reload',
            //     className: 'filterdate_booking',
            //     id: 'reloadButton',
            //     action: function(e, dt, node, config){
            //         customerData();
            //         tableData.clear().rows.add(sourceData).draw();
            //     }
            // },
            // {
            //     text: 'Sync Salesman to Sosyo',
            //     className: 'filterdate_booking',
            //     id: 'syncButtonDT',
            //     action: function(e, dt, node, config){
            //         syncsalesmantoSosyo();
            //     }
            // },
            'excel', 'csv'
        ],
        rowCallback: function(row, data, index){
            var statIndicator = data.status.toString();
            var salesmanIndi = $(row).find('td:eq(5)').text();
            var mdCode = data.partnerID.toString();
            var STORENAME = data.STORENAME.toString().toUpperCase();
            var download_indi = data.DOWNLOADED_MYBUDDY_STAT.toString();

            $(row).find('td:eq(1)').html(STORENAME);
                      
            if(download_indi == '' || download_indi == 'null'){
                if(statIndicator == '1'){ 
                    $(row).find('td:eq(6)').css({'color': 'white', "background-color": "#e06335", "text-align":"center"});
                    $(row).find('td:eq(6)').text('PENDING');
                }else{
                    $(row).find('td:eq(6)').text('VERIFIED');
                    $(row).find('td:eq(6)').css({'color': 'white', "background-color": "#00A86B", "text-align":"center"});
                }
            } else {
                $(row).find('td:eq(6)').css({'color': 'white', "background-color": "#037ffc", "text-align":"center"});
                $(row).find('td:eq(6)').text('DOWNLOADED');
            }

            // if(salesmanIndi == null || salesmanIndi == 'null' || salesmanIndi == ''){
            //     $(row).find('td:eq(4)').text('---');
            // }
            // $(row).find('td:eq(5)').text('₱ ' + Number(parseFloat(salesmanIndi).toFixed(2)).toLocaleString());
            $(row).find('td:eq(5)').text('₱ ' + data.totalAmount);
            console.log(data);
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
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            pageTotal = api
                .column( 5, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            $( api.column( 5 ).footer() ).html(
                pageTotal.toLocaleString() +' <b>('+ total.toLocaleString() +')</b>'
            );
            $('.tableFooter').html('Total Sales: ₱'+pageTotal.toLocaleString()+' <b>(₱'+total.toLocaleString()+')</b>');
        }
    });

    $('#refreshBtn').on('click', function() {
        customerData();
        tableData.clear().rows.add(sourceData).draw();
        $('.datePickerDrow').html('<span class="mdi mdi-calendar-month-outline"></span><span>Filter Date</span>');
    });
    $('#downloadOrdersBtn').on('click', function() {
        downloadOrder_GLOBAL();
    }); 
    $('#sysncSosyoSalesmanBtn').on('click', function() {
        syncsalesmantoSosyo();
    });    
    $('#excelBtn').on('click', function() {
        $('.buttons-excel').trigger('click');
    });
    $('#csvBtn').on('click', function() {
        $('.buttons-csv').trigger('click');
    });


    $('#sosyo_mcp_Btn').on('click', function() {
        sync_mcpday()
    });
    $('#sosyo_customer_Btn').on('click', function() {
        sync_sosyo_customer_list()
    });
    $('#sosyo_pricelist_Btn').on('click', function() {
        sync_sosyo_pricelist()
    });
    $('#sosyo_int_Btn').on('click', function() {
        sync_sosyo_inventorylistt()
    });
    $('#sosyo_dmb_Btn').on('click', function() {
        sync_sosyo_datiMongbili()
    });

    $('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        exec_savetojobber(row.data());
    });

    function exec_savetojobber(r){
        // console.log(r);
        if(r.DOWNLOADED_MYBUDDY_STAT == "1"){
            $('#dlorder').hide();
            $('.scorder').show();
            $('#status_aio').html("<span style='background-image: linear-gradient(#037ffc, #013264); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding-bottom:7px; padding-top:1px' class='px-4'>Downloaded</span>")
        } else{
            $('#dlorder').show();
            $('.scorder').hide();
            if(r.status == '1'){
                $('#status_aio').html("<span style='background-image: linear-gradient(#B13E3E, #600000); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding-bottom:7px; padding-top:1px' class='px-4'>Pending</span>")
            } else{
                $('#status_aio').html("<span style='background-image: linear-gradient(#40B13E, #026000); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding-bottom:7px; padding-top:1px' class='px-4'>Verified</span>")
            }
        }

        if(r.status == '1'){
            $('.modal-fullscreen').css({'height':'85vh'});
            $('.validateGroup').show();
            $('.verifyBtn').show();
            $('.conf_section').hide();
            $('.resendBtn').hide();
            // $('#status_aio').html("<span style='background-image: linear-gradient(#B13E3E, #600000); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding-bottom:7px; padding-top:1px' class='px-4'>Pending</span>")

        }else{
            $('.modal-fullscreen').css({'height':'70vh'});
            $('#salesman_res').val(r.partnerID);
            $('#storeID_res').val(r.STOREID);
            $('#customer_res').val(r.custCode);
            $('#refno_res').val(r.refno);

            var salesmanDetails = getSalesmanDetails(r.partnerID);
            $('#salesman_conf').val(salesmanDetails[0].Salesman).show();
            $('#customer_conf').val(displaycustomer(r.custCode)).show();
            $('.validateGroup').hide();
            $('.verifyBtn').hide();
            $('.conf_section').show();
            $('.resendBtn').show();
            // $('#status_aio').html("<span style='background-image: linear-gradient(#40B13E, #026000); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding-bottom:7px; padding-top:1px' class='px-4'>Verified</span>")
        }

        showmarker(r.LATITUDE, r.LONGITUDE, r.STORENAME, r.ADDRESS);
        $('#transactionID_res').val(r.transactionID);
        $('#storeIDHolder').val(r.STOREID);
        
        $('#refNo_aio').html(r.refno);
        $('#storename_aio').html(r.STORENAME.toUpperCase());
        $('#owner_aio').html(r.STOREOWNER);
        $('#address_aio').html(r.ADDRESS);
        $('#sku_aio').html(r.TOTALSKU);
        // $('#amount_aio').html(r.totalAmount);
        // $('#amount_aio').html('₱'+Number(parseFloat(r.totalAmount).toFixed(2)).toLocaleString()); 
        $('#amount_aio').html('₱'+r.totalAmount); 
        $('#customerCode_aio').html(displaycustomer(r.custCode));
        $('#salesman_aio').html(r.partnerID);
        $('#storecontno_aio').html(r.STORECONTNO);
        $('#latlng_aio').html(r.LATITUDE+', '+r.LONGITUDE);
        $('#modal_typeChecker').html(r.salesman_name);
        
        if(r.partnerID == null || r.partnerID == 'null'){
            $('#salesman_aio').html('---');
        }

        if(r.custCode == null || r.custCode == 'null'){
            $('#customerCode_aio').html('---');
        }

        $('#tojobbermodal').modal('show'); 
    }
}


function displaycustomer(cust){
    if(cust == 'NEW_CUSTOMER'){
        return cust;
    }else{
        return getCustomerName(cust);
    }
}

function islockOnverifyer(r){
    if(r == 0){
        return '<strong style="color: red;">NO</strong>';
    }
    return '<strong style="color: #5ee663;">YES</strong>';
}
      
function syncsalesmantoSosyo(){
    var f = confirm('Are you sure you want to sync salesman details to fast sosyo?');
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
            type: "POST",
            data: {
                "type":"SYNC_SALESMAN_DETAILS_TO_SOSYO", 
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    alert('Sync to sosyo was successful.');
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function exec_insertCustomer(){
    var r = confirm("Press 'OK' to proceed.");
    if(r){
        $('#addJobberBtn').html('<i class="fa fa-spinner fa-spin"></i> updating.. ');
        $( "#addJobberBtn").prop( "disabled", true );
        var custCode = $('#custCodeH').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
            type: "POST",
            data: {
                "type":"UPDATE_ORDERTYPE", 
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
            url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
            type: "POST",
            data: {
                "type":"UPDATE_ORDERTYPE_REVERT", 
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

$('#closeToJobberModal').on('click', function() {
    allSalesman();

    document.querySelector('#customerListSelect').destroy();
    VirtualSelect.init({
        ele: '#customerListSelect',
        // disabled: true,
        noOptionsText: 'No results, choose salesman first',
        placeholder: 'Select salesman first'
    });
});

function showNotif(view=''){
    $.ajax ({
        url: "../geofencing/GeofencingAPI.php",
        type: "GET",
        data: {"type":"view_notifications_icon_"+user, "view":view},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
        success: function(response){                 
            $("#notifs-icon-div").html(response.notification);
            if(response.unseen_notification > 0){
                $('.count').html(response.unseen_notification);
            }
        }
    });
}

function getToken(mdCode){
    var token = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
        type: "POST",
        data: {
            "type":"GET_USER_TOKEN",
            "distCode": GBL_DISTCODE,
            "mdCode":mdCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,         
        success: function(r){
            token = r;
        }
    });
    return token;
}

function printPickList(){
    var transID = $('#transactionID_res').val();
    var phoneNumber =  $('#storecontno_aio').html();
    var custName = $('#customerCode_aio').html();
    localStorage.setItem('PRTBRTRANSID', transID);
    localStorage.setItem('STOREPHONENUMBER', phoneNumber);
    localStorage.setItem('SOSYOSTORENAME', custName);
    window.open('https://mybuddy-sfa.com/SFA/print_picklist.html', '_blank');
}

function getSalesmanDetails(mdCode){
    var details = [];
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
        type: "POST",
        data: {
            "type":"GET_AIO_SALESAMAN_DETAILS",
            "distCode": GBL_DISTCODE,
            "mdCode":mdCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,         
        success: function(r){
            details = r;
        }
    });
    return details;
}

function getCustomerName(custCode){
    var customer = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
        type: "POST",
        data: {
            "type":"GET_MYBUDDY_STORENAME",
            "distCode": GBL_DISTCODE,
            "custCode":custCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,         
        success: function(r){
            customer = r[0].custCode+'_'+r[0].custName;
        }
    });
    return customer;
}

function getAioStoreToken(storeID){
    var token = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
        type: "POST",
        data: {
            "type":"GET_AIO_TOKEN",
            "distCode": GBL_DISTCODE,
            "storeID":storeID
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,         
        success: function(r){
            token = r;
        }
    });
    return token;
}
     
$(window).bind("load", function () {
    $('#work-in-progress').fadeOut();
});

function showmarker(latval, lngval, storeName, address){
    var contentString = '<p class="text-start">Storename: <b class="fw-bold">' + storeName.toUpperCase() + '</b></p>'+
            'Address: <b class="fw-bold">'+ address+'</b>';
    var myLatLng = { lat: parseFloat(latval), lng: parseFloat(lngval) };
    var marker = new google.maps.Marker({
        position: myLatLng,
        map,
        infowindow: infoWindow,
        content: contentString,
        title: storeName,
    });
    map.setCenter(marker.getPosition());  
    infoWindow.setContent(contentString);
    infoWindow.open(map, marker);
}

// init ();
siteLocation();
function init(){
    // var lat = parseFloat(sitelat);
    // var lang = parseFloat(sitelng);
    var lat = 9.8500;
    var lang = 124.1435;

    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: {lat: 11.0891, lng: 124.8923},
        zoom: 15
    });
}//init  


allSalesman();
function allSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
        type: "POST",
        data: {"type":"get_all_salesman_georeset", "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){                  
            var data = JSON.parse(response);
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].mdSalesmancode+' '+data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }

            document.querySelector('#salesmanList').destroy();
            VirtualSelect.init({
                ele: '#salesmanList',
                options: myOptions,
                search: true,
                maxWidth: '250px',
                placeholder: 'Select Salesman'
            });
        }//success here;
    })
}

$('#salesmanList').on('change', function() {
    var val = $('#salesmanList').val();
    if(val){
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
            backdrop: true
        });
        var botboxMsg = '';

        allcustomer(this.value);

        setTimeout(function(){
            dialog.modal('hide');
        }, 3000)
    } else{
        document.querySelector('#customerListSelect').destroy();
        VirtualSelect.init({
            ele: '#customerListSelect',
            // disabled: true,
            noOptionsText: 'No results, choose salesman first',
            placeholder: 'Select salesman first'
        });
    }
    
});

    
function allcustomer(){
    var mdCode = $('#salesmanList').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
        type: "POST",
        data: {
            "type":"CUSTOMER_LIST_AIO",
            "distCode": GBL_DISTCODE,
            "mdCode":mdCode
        },
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){                  
            var data = JSON.parse(response);
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].custCode+' '+data[x].custName, value: data[x].custCode };
                myOptions.push(obj);
            }

            document.querySelector('#customerListSelect').destroy();
            VirtualSelect.init({
                ele: '#customerListSelect',
                options: myOptions,
                search: true,
                maxWidth: '250px',
                placeholder: 'Select Customer'
            });
        }//success here;
    });
}

function removeTagging(){
    var storeID = $('#storeID_res').val();
    var f = confirm('Are you sure you want to remove this sosyo store tagging?');
    if(f){
        $.ajax({        
            url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
            type: "POST",
            data: {
                "type":"REMOVE_SOSYO_TAGGING",
                "distCode": GBL_DISTCODE,
                "storeID":storeID
            },
            dataType: "html",
            crossDomain: true,
            cache: false,            
            async: false,
            success : function(r) {
                if(r){
                    location.reload();
                }
            }
        });
    }   
}

function resend_transaction(){
    var mdCode = $('#salesman_res').val();
    var storeID = $('#storeID_res').val();
    var custCode = $('#customer_res').val();
    var refNo = $('#refno_res').val();
    var transactionID = $('#transactionID_res').val();

    var f = confirm('Are you sure you want to resend this transaction?');
    if(f){
        resend_linking_aio_transaction(mdCode, transactionID, storeID, custCode, refNo);
    }
}

function resend_linking_aio_transaction(mdCode, transactionID, storeID, custCode, refNo){
    console.log('transactionID:' + transactionID);
    $.ajax({        
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
        type: "POST",
        data: {
            "type":"UPDATE_LINKING_AIOTRANSACTION", 
            "distCode": GBL_DISTCODE,
            'mdCode':mdCode,
            'storeID':storeID,
            'transactionID':transactionID,
            'custCode':custCode
        },
        dataType: "html",
        crossDomain: true,
        cache: false,        
        async: false,    
        success : function(r) {
            pushnotif(transactionID, mdCode, custCode);
            alert('Transaction has been resend.');
        }
    });
}

function check_if_custcode_preselectedAccs(custCode, mdCode){
    $.ajax({        
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
        type: "POST",
        data: {
            "type":"CHECK_PRESELECTEDACCTS", 
            "distCode": GBL_DISTCODE,
            'custCode':custCode,
            'distCode':$.trim(localStorage.getItem('DISTCD')),
            'mdCode':mdCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,        
        async: false,    
        success : function(r) {
            var checker = 0;
            if(r.length == 0){
                console.log('wa na link');
                checker = 0;
                UPDATE_PRESELECTEDACCTS(custCode, mdCode);
            }else{
                checker = 1;
                alert(custCode + ': CUSTOMER CODE ALREADY USED.');
            }

            return checker;
        }
    });
}

function UPDATE_PRESELECTEDACCTS(custCode, mdCode){
    $.ajax({        
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
        type: "POST",
        data: {
            "type":"UPDATE_PRESELECTEDACCTS", 
            "distCode": GBL_DISTCODE,
            'custCode':custCode,
            'distCode':$.trim(localStorage.getItem('DISTCD')),
            'mdCode':mdCode
        },
        dataType: "json",
        crossDomain: true,
        cache: false,        
        async: false
    });
}
 
function exec_asignSalesman(){
    var mdCode = $('#salesmanList').val();
    var storeID = $('#storeIDHolder').val();
    var custCode = $('#customerListSelect').val();
    var refNo = $('#refNo_aio').html();
    var f = confirm('Are you sure you want to continue?');
    if(f){
        var transactionID = $('#transactionID_res').val();
        update_linking_aio_transaction(mdCode, transactionID, storeID, custCode, refNo, '', '');
    }
}

function update_linking_aio_transaction(mdCode, transactionID, storeID, custCode, refNo, citymuncode, channel){
    console.log('transactionID:' + transactionID);
    $.ajax({        
        url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
        type: "POST",
        data: {
            "type":"UPDATE_LINKING_AIOTRANSACTION", 
            "distCode": GBL_DISTCODE,
            'mdCode':mdCode,
            'storeID':storeID,
            'transactionID':transactionID,
            'custCode':custCode,
            'citymuncode':citymuncode,
            'channel':channel,
        },
        dataType: "html",
        crossDomain: true,
        cache: false,        
        async: false,    
        success : function(r) {
            pushnotif(transactionID, mdCode, custCode);
            pushnotifAIOcustomer(refNo, mdCode, custCode);
            alert('Transaction has been verified.');
        }
    });
}

function pushnotif(transactionID, mdCode, custCode){
    var storeID = $('#storeIDHolder').val();
    var token = getToken(mdCode);
    var customername = getCustomerName(custCode);
    var customerToken = getAioStoreToken(storeID);
    var header = 'Order Request';
    var message = 'Fastsosyo Order from: ' + customername;
    alert(message);
    
    $.ajax({        
        type : 'POST',
        url : "https://fcm.googleapis.com/fcm/send",
        headers : {
            Authorization : 'key=' + 
            'AAAA4OmJn2o:APA91bGBe9aHcLoJxAkkJbwN9ozac6St2BimIOVtWtb7dv-GV50v2S5-vIQzS_bZfxgl9385wyBeW4qA2GOR-BfnBV63mOHFDKMEfgZn9PNM-EAbvBtKFPEYszCLZ0OxZZPPvjyfqQMD'
            //sir roy api 'AAAA6gFzY08:APA91bGhXSORj4yKI5GDwvYIsIRCqJJn2UwO7dz_l5ZFjGmUsMj2-zpOu9R1RA7QSh0ECQ_zRibaoDLv1Z5fzk3LXqqUuaKlKJ_18ba822I4iHpgVtjSdMGdLaB37IPoGt2zFmx9Kmfy'
        },
        contentType : 'application/json',
        dataType: 'json',
        data: JSON.stringify({"to": token,
            "data": {
                "title": header,
                "body": message,
                "transactionID":transactionID,
                "custCode":custCode,
                "customerToken": customerToken,
                "supplierID":'NPI',
                "click_action":"FLUTTER_NOTIFICATION_CLICK",
                "index":"3"
            }
        }),
        //change "to" parameter located in tblUser column TOKEN
        success : function(response) {
            console.log(response);
        },
        error : function(xhr, status, error) {
            console.log(xhr.error);                   
        }
    });
}

function sendSMS(message, phoneNumber){
    $.ajax ({
    url: GLOBALLINKAPI+"/connectionString/applicationipApi.php", 
    type: "POST",
    data: {
        "type": "AIO_BROADCAST_SIRROY",
        "distCode": GBL_DISTCODE,
        "phoneNumber" : phoneNumber,
        "message" : message,
        "smstype":"ORDER_CONFIRMATION"
    },
    crossDomain: true,
    cache: false
    });
}

function pushnotifAIOcustomer(refno, mdCode, custCode){
    var storeID = $('#storeIDHolder').val();
    var tokenCustomer = getAioStoreToken(storeID);
    var salesmantoken = getToken(mdCode);

    var storenumber = $('#storecontno_aio').val();

    var salesmanObj = getSalesmanDetails(mdCode);
    console.log(salesmanObj);
    var salesman = salesmanObj[0].Salesman;
    var phonenumber = salesmanObj[0].phonenumber;
    var latitude = salesmanObj[0].latitude;
    var longitude = salesmanObj[0].longitude;

    var header = 'Order Status';
    var message = 'Order# '+refno+' is now processed; our sales representative '+salesman+' will be reaching you anytime soon.\n\n'+
        'You may reach him at '+phonenumber+' for some clarifications. Thank you!';

    var sms_message = 'Order# '+refno+' is now processed; our sales representative '+salesman+' will be reaching you anytime soon.\n\n'+
        'You may reach him at '+phonenumber+' for some clarifications. Thank you!\n\n-FASTSOSYO';

    $.ajax({        
        type : 'POST',
        url : "https://fcm.googleapis.com/fcm/send",
        headers : {
            Authorization : 'key='+
            // 'AAAAAd0KUZg:APA91bG2txpQ42o-x0Hk13eBhL1iEYU_cZh6CDydc44i1ULgkvuasIgrFnaS0E65AtbWRqDGXehOQl3v3NFHN5F4h8gl8VvHdcKu_hjfyRmQvTjhiApP4r5Lw9-Pa9EAFILwWSsczyzu'
            'AAAAl6T0xOs:APA91bF0EvvM36u1T3vuz4hTl8ZY24IrnIKgktQsCidLjsZcw7Y1SXCKUCdiFtrV__h7371pox8u4hTjWJRlJeRQhPeEAHbGURDekudXaszhNW6SwyCnhAF4a90JUebE9eXaUf7T3Vxk'
        },
        contentType : 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            //"to": "eYAoHZHHT5qqMwY6NRXUFo:APA91bFI6oPFuBvUTdFzcyJ0-oDL7zRMe1TFvg8rekEn1N_MV5t5tIXn3hSRhgMob1ngxzp1s93ZdbWNs-jdseuJxBh-F3DDqPm5czY54uBCcm17lnq_gF4BSby4ZQcYIVgRetFsdDck",
            "to":tokenCustomer,
            "notification": {
                "title": header,
                "body": message
            },
            "data": {
                "title":header,
                "body":message,
                "Name":salesman,
                "mdCode":mdCode,
                "custCode":custCode,
                "PhoneNumber":phonenumber,
                "token":salesmantoken,
                "longitude":longitude,
                "latitude":latitude,
                "supplierID":'NPI',
            }
        }),
        //change "to" parameter located in tblUser column TOKEN
        success : function(response) {
            console.log(response);
        },
        error : function(xhr, status, error) {
            console.log(xhr.error);        
            alert('Message was not sent!');        
        }
    });
} 


function downloadOrder(){
    var f = confirm('Are you sure you want to downlaod this order?');
    if(f){
        var transactionID = $('#transactionID_res').val();
        var mdCode =  $('#salesman_res').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
            type: "POST",
            data: {
                "type":"DOWNLOAD_SOSYO_ORDER_TO_MYBUDDY", 
                "transactionID":transactionID,
                "mdCode":mdCode,
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    alert('Sosyo order was successful downloaded');
                    location.reload();
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function downloadOrder_GLOBAL(){
    var f = confirm('Are you sure you want to download all pending orders?');
    if(f){

      var distCode = localStorage.getItem('DISTCD');
      
      $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipApi.php",
            type: "POST",
            data: {
                    "type":"DOWNLOAD_SOSYO_ORDER_GLOBAL", 
                    "distCode": GBL_DISTCODE
                  },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
              success: function(r){ 
                if(r){
                  alert('Sosyo orders was successful downloaded');
                  location.reload();
                }
              },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
              }
        });


    }
  }

// Restricts input for the set of matched elements to the given inputFilter function.
(function($) {
    $.fn.inputFilter = function(callback, errMsg) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop focusout", function(e) {
            if (callback(this.value)) {
                // Accepted value
                if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
                    $(this).removeClass("input-error");
                    this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
            // Rejected value - restore the previous one
                $(this).addClass("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    };
}(jQuery));

$("#salesman_phonenum").inputFilter(function(value) {
    return /^\d*$/.test(value);    // Allow digits only, using a RegExp
},"Only digits allowed");

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});



function sync_mcpday(){
    var f = confirm('Are you sure you want to proceed?');
    if(f){
        var distCode = localStorage.getItem('DISTCD');
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
            type: "POST",
            data: {
                "type":"SYNC_SOSYO_MCPDAT", 
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                alert('MCP days was successful sync!');
                location.reload();
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function sync_sosyo_customer_list(){
    var f = confirm('Are you sure you want to proceed?');
    if(f){
      var distCode = localStorage.getItem('DISTCD');
      $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
            type: "POST",
            data: {
                "type":"SYNC_SOSYO_CUSTOMERLIST", 
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                  alert('MCP days was successful sync!');
                  location.reload();
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function sync_sosyo_pricelist(){
    var f = confirm('Are you sure you want to proceed?');
    if(f){
        var distCode = localStorage.getItem('DISTCD');
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
            type: "POST",
            data: {
                "type":"SYNC_SOSYO_PRICELIST", 
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                    alert('Price list successfully sync!');
                    // location.reload();
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function sync_sosyo_inventorylistt(){
    var f = confirm('Are you sure you want to proceed?');
    if(f){
        var distCode = localStorage.getItem('DISTCD');
      
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
            type: "POST",
            data: {
                "type":"SYNC_SOSYO_INVENTORYLIST", 
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                  alert('Inventory list successfully sync!');
                  // location.reload();
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function sync_sosyo_datiMongbili(){
    var f = confirm('Are you sure you want to proceed?');
    if(f){
        var distCode = localStorage.getItem('DISTCD');
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php",
            type: "POST",
            data: {
                "type":"SYNC_SOSYO_DATIMONGBILI", 
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r){
                  alert('Dati mong binili was successfully!');
                  // location.reload();
                }
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Synching error: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}