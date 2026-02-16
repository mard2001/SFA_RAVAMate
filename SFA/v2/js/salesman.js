var user = localStorage.getItem("adminUserName");
var sourceData = [];
var tableData;
var prerouteData, postrouteData, stoctakeData, eodData, ishybridData, newCustomer, otpdisabledData, SalesmanTypeData, OSAChecking;
var imgHolderURL;
var GLOBALBTDTACCOUNTHODER = [];
var GLOBALSWEEPERACCOUNTHOLDER = [];


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
 
$('#calltimeH').bootstrapMaterialDatePicker({
    date: false,
    format: 'HH:mm'
});

$('#calltime').bootstrapMaterialDatePicker({
    date: false,
    format: 'HH:mm:ss'
});

$('#passwordEyeIcon').click(function () {
    var icon = $(this).find('span'); 
    var isHidden = icon.hasClass('mdi-eye-off-outline');

    if (isHidden) {
        icon.removeClass('mdi-eye-off-outline').addClass('mdi-eye-outline');
        $('.updatePassword').attr('type', 'text');
    } else {
        icon.removeClass('mdi-eye-outline').addClass('mdi-eye-off-outline');
        $('.updatePassword').attr('type', 'password');
    }
});

$('#navDrop').click(function() {
   $("i", this).toggleClass("glyphicon-menu-up glyphicon-menu-down");
});

$('.error').hide();

function openSweeperModal(){
    $('#sweeperModal').modal('show');
}
  

VirtualSelect.init({
    ele: '#mdNameH',
});

VirtualSelect.init({
    ele: '#warehouseCodeList',
});

VirtualSelect.init({
    ele: '#good_warehouseCodeList',
});

VirtualSelect.init({
    ele: '#bad_warehouseCodeList',
});

VirtualSelect.init({
    ele: '#sweeperSelect',
});

VirtualSelect.init({
    ele: '#btdtsalesmanSelect',
});

VirtualSelect.init({
    ele: '#priceCodeH',
});

function openBTDTModal(){
    $('#btdtsalesmanModal').modal('show');
}

function salesmanDataObject(){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"salesmanMaintenance", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,   
        async: false,         
        success: function(r){ 
            var localObj = [];
            for(var x = 0; x < r.length; x++){
                var salesmantype = salesmantypechecker(r[x].DefaultOrdType, r[x].DriverType);
                // localObj.push({
                //     // mdCodeplusColor: '<i class="fas fa-circle" style="color: '+r[x].mdColor+'"></i> ' +r[x].mdCode,
                //     mdCodeplusColor: r[x].mdCode,
                //     mdCode:r[x].mdCode,
                //     sname: r[x].sname,
                //     contactCellNumber: r[x].contactCellNumber,
                //     eodNumber1: r[x].eodNumber1,
                //     eodNumber2: r[x].eodNumber2,
                //     mdUserCreated: r[x].mdUserCreated,
                //     geoLocking: r[x].geoLocking,
                //     mdLevel: r[x].mdLevel,
                //     calltime: r[x].calltime,
                //     mdColor: r[x].mdColor,
                //     mdPassword: r[x].mdPassword,
                //     customerLastDateReset: r[x].customerLastDateReset,
                //     priceCode: r[x].priceCode,
                //     isGEORest: r[x].isGEORest,
                //     siteCode: r[x].siteCode,
                //     Password1: r[x].Password1,
                //     PreRouteCL: r[x].PreRouteCL,
                //     PostRouteCL: r[x].PostRouteCL,
                //     StockTakeCL: r[x].StockTakeCL,
                //     ImmediateHead: r[x].ImmediateHead,
                //     EOD: r[x].EOD,
                //     DefaultOrdType: r[x].DefaultOrdType,
                //     stkRequired: r[x].stkRequired,
                //     stkList: r[x].stkList,
                //     capacity: r[x].loadingCap,
                //     ishybrid: r[x].ishybrid,
                //     newCustomer: r[x].newCustomer,
                //     otpdisabled: r[x].DisableOTP,
                //     SalesmanType: r[x].SalesmanType,
                //     WarehouseCode: r[x].WarehouseCode,
                //     DefaultOrdType_text: salesmantype,
                //     activestatus_buddy: r[x].activestatus_buddy	
                // });
                localObj.push({
                    mdCodeplusColor: r[x].mdCode ? r[x].mdCode.trim() : "",
                    mdCode: r[x].mdCode ? r[x].mdCode.trim() : "",
                    sname: r[x].sname ? r[x].sname.trim() : "",
                    contactCellNumber: r[x].contactCellNumber ? r[x].contactCellNumber.trim() : "",
                    eodNumber1: r[x].eodNumber1 ? r[x].eodNumber1.trim() : "",
                    eodNumber2: r[x].eodNumber2 ? r[x].eodNumber2.trim() : "",
                    mdUserCreated: r[x].mdUserCreated ? r[x].mdUserCreated.trim() : "",
                    geoLocking: r[x].geoLocking ? r[x].geoLocking.trim() : "",
                    mdLevel: r[x].mdLevel ? r[x].mdLevel.trim() : "",
                    calltime: r[x].calltime ? r[x].calltime.trim() : "",
                    mdColor: r[x].mdColor ? r[x].mdColor.trim() : "",
                    mdPassword: r[x].mdPassword ? r[x].mdPassword.trim() : "",
                    customerLastDateReset: r[x].customerLastDateReset ? r[x].customerLastDateReset.trim() : "",
                    priceCode: r[x].priceCode ? r[x].priceCode.trim() : "",
                    isGEORest: r[x].isGEORest ? r[x].isGEORest.trim() : "",
                    siteCode: r[x].siteCode ? r[x].siteCode.trim() : "",
                    Password1: r[x].Password1 ? r[x].Password1.trim() : "",
                    PreRouteCL: r[x].PreRouteCL ? r[x].PreRouteCL.trim() : "",
                    PostRouteCL: r[x].PostRouteCL ? r[x].PostRouteCL.trim() : "",
                    StockTakeCL: r[x].StockTakeCL ? r[x].StockTakeCL.trim() : "",
                    ImmediateHead: r[x].ImmediateHead ? r[x].ImmediateHead.trim() : "",
                    EOD: r[x].EOD ? r[x].EOD.trim() : "",
                    DefaultOrdType: r[x].DefaultOrdType ? r[x].DefaultOrdType.trim() : "",
                    stkRequired: r[x].stkRequired ? r[x].stkRequired.trim() : "",
                    stkList: r[x].stkList ? r[x].stkList.trim() : "",
                    capacity: r[x].loadingCap ? r[x].loadingCap.trim() : "",
                    ishybrid: r[x].ishybrid ? r[x].ishybrid.trim() : "",
                    newCustomer: r[x].newCustomer ? r[x].newCustomer.trim() : "",
                    otpdisabled: r[x].DisableOTP ? r[x].DisableOTP.trim() : "",
                    SalesmanType: r[x].SalesmanType ? r[x].SalesmanType.trim() : "",
                    WarehouseCode: r[x].WarehouseCode ? r[x].WarehouseCode.trim() : "",
                    DefaultOrdType_text: salesmantype ? salesmantype.trim() : "",
                    activestatus_buddy: r[x].activestatus_buddy ? r[x].activestatus_buddy.trim() : "",
                    DriverType: r[x].DriverType ? r[x].DriverType.trim() : "",
                    BOWarehouse: r[x].BOWarehouse ? r[x].BOWarehouse.trim() : "",
                    GoodStockReturnWarehouse: r[x].GoodStockReturnWarehouse ? r[x].GoodStockReturnWarehouse.trim() : "",
                });
            }
            sourceData = localObj;
            $('#stockRequest_TAB').show();
            $('.loading-table').hide();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
        }
    });
}

function salesmantypechecker(salesmantype, drivertype){

    // if(salesmantype == 'T'){
    //     return 'Van Sales';
    // }else if(salesmantype == 'B'){
    //     return 'Booking';
    // }else if(salesmantype == 'X'){
    //     return 'BTDT Salesman';
    // }else if(salesmantype == 'D'){
    //     return 'Logistic Driver';
    // }else if(salesmantype == 'Y'){
    //      return 'Pre Booking';
    // }else if(salesmantype == 'H'){
    //      return 'Hybrid Salesman';
    // }


     if(salesmantype == 'T'){
        return 'Van Sales';
    }else if(salesmantype == 'B'){
        return 'Booking';
    }else if(salesmantype == 'D'){
        return 'Logistics - ' + drivertype;
    }else if(salesmantype == 'X'){
         return 'Pre Booking';
    }else if(salesmantype == 'Y'){
         return 'Hybrid';
    }
}
 $('#logisticfield').hide();
function salesmanDataTable(){
    $('.loader-indicator h3').hide();
    tableData = new DataTable('table.overridesList', {
        dom: '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        data: sourceData,
        scrollX: true,
        ordering: true,
        select: false,
        columns: [
            { "data": "mdCodeplusColor", title:"SFA User ID"},
            { "data": "sname", title:"Name"},
            { "data": "contactCellNumber", title:"Salesman Contact No." },
            { "data": "eodNumber1", title:"Cashier Contact No." },
            { "data": "eodNumber2", title:"Supervisor Contact No." },
            {
                data: "mdUserCreated",
                title: "Date Created",
                // render: function (data, type, row) {
                //     const dateObj = new Date(data);
                //     const iso = dateObj.toISOString(); 

                //     return type === 'display' || type === 'filter' ? `<span data-order="${iso}">${data}</span>` : iso;
                // }
            },
            { "data": "geoLocking", title:"Geo Locking"},
            { "data": "DefaultOrdType_text", title:"Salesman Type"},
            { "data": "activestatus_buddy", title:"Status"}
        ],
        buttons: [
            'excel', 'print', 'copy',
        ],
        language: {
            "emptyTable": "No available salesman records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columnDefs: [
            {
                targets: [6],
                className: 'dt-body-center'
            }
        ],
        rowCallback: function(row, data, index){
            $(row).find('td:eq(0)').css({'border-left': '5px solid '+data.mdColor});
        },
    });

    $('table.overridesList').css('width', '100%');

    salesmanList();
    warehouseList();
    warehouseList_GOODWh();
    warehouseList_BADWh();

    $('#addBtn').on('click', function() {
        Swal.fire({
            html: "Please Wait...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        
        setTimeout(() => {
            $('.error').hide();
            $('#mdNameH').val('');
            $('#salesmanTypeSelect').val('').change();
            $('#passwordH').val('k1m123');
            $('#calltimeH').val('07:00');
            $('#mdcolorH').val('');
            $('#capacityH').val(0);
            $('#contactH').val('');
            $('#eod1H').val('');
            $('#eod2H').val('');

            Swal.close();
            $('#addSalesmanModal').modal('show');
        }, 1000);
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

    $('table.overridesList tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        var mdCode = tr.find('td:eq(0)').text();
        // console.log(mdCode);
        viewsalesman(row.data());
    });

    function viewsalesman(r){
        console.log('viewsalesman', r);
        GLOBALSWEEPERACCOUNTHOLDER = [];
        GLOBALBTDTACCOUNTHODER = [];
        $('#sweeperTbody #btdtTbody').html(` <tr id="defaultTr">
                                                <td colspan="3" style="text-align: center;">Press 'Add Account' button to set-up sweeper account/s for this salesman.</td>
                                            </tr>`);

        $('#salesmanpicImg').css({'border':'5px solid '+ r.mdColor});
        $('#sweeperTable').hide();
        $('#btdtTableCont').hide();
        $('.rowButton').hide();
        $('#mdcode').html(r.mdCode);
        $('#name').html(r.sname);
        $('#contact').val(r.contactCellNumber);
        $('#password').val(r.mdPassword);
        $('#mdcodeholder').val(r.mdCode);

        $('#mdcolor').val(r.mdColor);
        $('#password1').val(r.Password1);
        $('#mdlevel').val(r.mdLevel);
        $('#eodnum1').val(r.eodNumber1);
        $('#eodnum2').val(r.eodNumber2);
        $('#geolocking').val(r.geoLocking);
        $('#priceCode').val(r.priceCode);
        $('#calltime').val(r.calltime);
        $('#capacityUpdate').val(r.capacity);
			
        $('#defaultORDSelect').val(r.DefaultOrdType);
        $('#logistictypeselect').val(r.DriverType);       

        $('#stkListSelect').val(r.stkList);
        $('#minstksku').val(r.stkRequired);

        $('#upt_supvisorName').val(r.ImmediateHead);

        $('#btdtwarehouseSelect').val(r.WarehouseCode);

        $('#whCode').val(r.WarehouseCode);
        $('#badWH').val(r.BOWarehouse);
        $('#goodWH').val(r.GoodStockReturnWarehouse);

        if(r.DefaultOrdType == 'Y'){
            $('.btdtfield').show();
        }else{
            $('.btdtfield').hide();
        }

        if($.trim(r.DefaultOrdType) == 'D'){
            $('#logisticfield').addClass('d-flex justify-content-between align-items-center').show();
            // $("#whCode").prop("disabled", false);
        }else{
            $('#logisticfield').removeClass('d-flex justify-content-between align-items-center').hide();
            // $("#whCode").prop("disabled", true);
        }

        if(r.PreRouteCL == '1'){
            $('.text-indicator-preroute').html('<span style="color: green">ENABLED</span>');
            $('.preroutecheck').prop("checked", true);
        }else{
            $('.text-indicator-preroute').html('<span style="color: red">DISABLED</span>');
            $('.preroutecheck').prop("checked", false);
        }

        if(r.PostRouteCL == '1'){
            $('.text-indicator-postroute').html('<span style="color: green">ENABLED</span>');
            $('.postroutecheck').prop("checked", true);
        }else{
            $('.text-indicator-postroute').html('<span style="color: red">DISABLED</span>');
            $('.postroutecheck').prop("checked", false);
        }
    
        if(r.StockTakeCL == '1'){
            $('.text-indicator-stocktake').html('<span style="color: green">ENABLED</span>');
            $('.stocktakecheck').prop("checked", true);
        }else{
            $('.text-indicator-stocktake').html('<span style="color: red">DISABLED</span>');
            $('.stocktakecheck').prop("checked", false);
        }

        if(r.EOD == '1'){
            $('.eodcheck').prop("checked", true);
            $('.text-indicator-eod').html('<span style="color: green">ENABLED</span>');
        }else{
            $('.eodcheck').prop("checked", false);
            $('.text-indicator-eod').html('<span style="color: red">DISABLED</span>');
        }
		
        if(r.ishybrid == '1'){
            $('.ishybrid').prop("checked", true);
            $('.text-indicator-hybrid').html('<span style="color: green">ENABLED</span>');
        }else{
            $('.ishybrid').prop("checked", false);
            $('.text-indicator-hybrid').html('<span style="color: red">DISABLED</span>');
        }

        if(r.newCustomer == '1'){
            $('.newcustomer').prop("checked", true);
            $('.text-indicator-newcustomer').html('<span style="color: green">ENABLED</span>');
        }else{
            $('.newcustomer').prop("checked", false);
            $('.text-indicator-newcustomer').html('<span style="color: red">DISABLED</span>');
        }

        if(r.otpdisabled == 'Y'){
            $('.otpdisabled').prop("checked", true);
            $('.text-indicator-otpdisabled').html('<span style="color: green">YES</span>');
        }else{
            $('.otpdisabled').prop("checked", false);
            $('.text-indicator-otpdisabled').html('<span style="color: red">NO</span>');
          }


         if(r.stkRequired == '1'){
            $('.osachecking').prop("checked", true);
            $('.text-indicator-osachecking').html('<span style="color: green">YES</span>');
        }else{
            $('.osachecking').prop("checked", false);
            $('.text-indicator-osachecking').html('<span style="color: red">NO</span>');
          }

        if(r.SalesmanType == null || r.SalesmanType == ''){
            $('.SalesmanType').prop("checked", true);
            $('.text-indicator-SalesmanType').html('<span style="color: green">GROC</span>');
        }else if(r.SalesmanType == 'GROC'){
            $('.SalesmanType').prop("checked", true);
            $('.text-indicator-SalesmanType').html('<span style="color: green">GROC</span>');
        }else{
            $('.SalesmanType').prop("checked", false);
            $('.text-indicator-SalesmanType').html('<span style="color: red">NP</span>');
        }
        // // original
        // if(r.DefaultOrdType == 'S'){
        //     get_sweeper_accounts(r.mdCode);
        //     $('.rowButton').show();
        //     $('#btdtTableCont').hide();
        //     $('#sweeperTable').show();
        // }

        // if(r.DefaultOrdType == 'D'){
        //     get_btdt_salesman_accounts(r.mdCode);
        //     $('.rowButton').show();
        //     $('#sweeperTable').hide();
        //     $('#btdtTableCont').show();
        // }


        // modified by sir roy june 30 1:55 pm
        if(r.DefaultOrdType == 'Y'){
            get_btdt_salesman_accounts(r.mdCode);
            $('.rowButton').show();
            $('#sweeperTable').hide();
            $('#btdtTableCont').show();
        }
        $('#salesmanDetailsModal').modal('show');
    }
}

function openAssignedSalesmanListModal(){
    $('#assignedSalesmanListModal').modal('show');
}

// salesmanList_sweeper();
salesmanList_btdt();

$('.osachecking').click(function() {
    if($('.osachecking').prop("checked") == true){
        $('.text-indicator-osachecking').html('<span style="color: green">YES</span>');
        OSAChecking = 1;
    }
    else if($('.osachecking').prop("checked") == false){
        $('.text-indicator-osachecking').html('<span style="color: red">NO</span>');
        OSAChecking = 0;
    }
});


$('.preroutecheck').click(function() {
    if($('.preroutecheck').prop("checked") == true){
        $('.text-indicator-preroute').html('<span style="color: green">ENABLED</span>');
        prerouteData = 1;
    }
    else if($('.preroutecheck').prop("checked") == false){
        $('.text-indicator-preroute').html('<span style="color: red">DISABLED</span>');
        prerouteData = 0;
    }
});

$('.postroutecheck').click(function() {
    if($('.postroutecheck').prop("checked") == true){
        $('.text-indicator-postroute').html('<span style="color: green">ENABLED</span>');
        postrouteData = 1;
    }
    else if($('.postroutecheck').prop("checked") == false){
        $('.text-indicator-postroute').html('<span style="color: red">DISABLED</span>');
        postrouteData = 0;
    }
});

$('.stocktakecheck').click(function() {
    if($('.stocktakecheck').prop("checked") == true){
        $('.text-indicator-stocktake').html('<span style="color: green">ENABLED</span>');
        stoctakeData = 1;
    }
    else if($('.stocktakecheck').prop("checked") == false){
        $('.text-indicator-stocktake').html('<span style="color: red">DISABLED</span>');
        stoctakeData = 0;
    }
});

$('.eodcheck').click(function() {
    if($('.eodcheck').prop("checked") == true){
        $('.text-indicator-eod').html('<span style="color: green">ENABLED</span>');
        eodData = 1;
    }
    else if($('.eodcheck').prop("checked") == false){
        $('.text-indicator-eod').html('<span style="color: red">DISABLED</span>');
        eodData = 0;
    }
});
		
$('.ishybrid').click(function() {
    if($('.ishybrid').prop("checked") == true){
        $('.text-indicator-hybrid').html('<span style="color: green">ENABLED</span>');
        ishybridData = 1;
        console.log('hybrid val: ' + ishybridData);
        }
        else if($('.ishybrid').prop("checked") == false){
            $('.text-indicator-hybrid').html('<span style="color: red">DISABLED</span>');
        ishybridData = 0;
        console.log('hybrid val: ' + ishybridData);
    }
});


$('.newcustomer').click(function() {
    if($('.newcustomer').prop("checked") == true){
        $('.text-indicator-newcustomer').html('<span style="color: green">ENABLED</span>');
        newCustomer = 1;
        console.log('newCustomer val: ' + newCustomer);
    }
    else if($('.newcustomer').prop("checked") == false){
        $('.text-indicator-newcustomer').html('<span style="color: red">DISABLED</span>');
        newCustomer = 0;
        console.log('newCustomer val: ' + newCustomer);
    }
});

$('.otpdisabled').click(function() {
    if($('.otpdisabled').prop("checked") == true){
        $('.text-indicator-otpdisabled').html('<span style="color: green">YES</span>');
        otpdisabledData = 'Y';
        console.log('otpdisabled val: ' + otpdisabledData);
    }
    else if($('.otpdisabled').prop("checked") == false){
        $('.text-indicator-otpdisabled').html('<span style="color: red">NO</span>');
        otpdisabledData = 'N';
        console.log('otpdisabled val: ' + otpdisabledData);
    }
});

$('.SalesmanType').click(function() {
    if($('.SalesmanType').prop("checked") == true){
        $('.text-indicator-SalesmanType').html('<span style="color: green">GROC</span>');
        SalesmanTypeData = 'GROC';
        console.log('SalesmanType val: ' + SalesmanTypeData);
    }
    else if($('.SalesmanType').prop("checked") == false){
        $('.text-indicator-SalesmanType').html('<span style="color: red">NP</span>');
        SalesmanTypeData = 'NP';
        console.log('SalesmanType val: ' + SalesmanTypeData);
    }
});

function viewSalesmanDetails(data){
    $('#savaChangesBtn').hide();
    var mdCode = data.mdCode;
    imgHolderURL = "../img/salesman_"+user+"/"+data.mdCode+".jpg";
      
    $('#s_body_info').html(thisBodyDetails);
    $('#salesmanDetailsModal').modal('show');
    $('#imgMdCode').val(mdCode);
    $('#imgSite').val(user);
    $(".s_Maintenace").attr("src","../img/salesman_"+user+"/"+mdCode+".jpg"+"?"+ new Date().getTime());

    $("#but_upload").show();
    $("#uploadImg_BTN").hide();
    $("#cancelImg_BTN").hide();
}

salesmanDataObject();
salesmanDataTable();
$('.loading-table').hide();

function checksalesmannumber(){
    var contact = $('#contact').val();
    var mdcode = $('#mdcodeholder').val();
    var res = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"CHECK_SALESMAN_NUMBER",
            "contact": contact,
            "mdcode":mdcode,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,   
        async: false,
        success: function(r){
            console.log(r);
            res = r;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
        }
    });

    return res;
}

$('#sweeperTable').hide();
$('#defaultORDSelect').on('change', function() {
    var val = this.value;
    if(val == 'S'){
        $('.rowButton').show();
        $('#sweeperTable').show();
        $('#btdtTableCont').hide();
    }else{
        $('.rowButton').show();
        $('#sweeperTable').hide();
        $('#btdtTableCont').hide();
        GLOBALSWEEPERACCOUNTHOLDER = [];
    }

    if(val == 'D'){
        $('.rowButton').show();
        $('#btdtTableCont').show();
        $('#sweeperTable').hide();
        $('#logisticfield').val('');
        $('#logisticfield').show().addClass('d-flex justify-content-between align-items-center salesManRow');
    }else{
        $('.rowButton').hide();
        $('#btdtTableCont').hide();
        $('#sweeperTable').hide();
        GLOBALBTDTACCOUNTHODER = [];
        $('#logisticfield').removeClass('d-flex justify-content-between align-items-center salesManRow').hide();
        $('#logisticfield').val('');
    }
});

function saveDataChanges(){
    Swal.fire({
        html: "Please Wait... Verifying Data...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();

            setTimeout(() => {
                var mdcode = $('#mdcodeholder').val();
                var password = $('#password').val();
                var contact = $('#contact').val();
                var color = $('#mdcolor').val();
                var password1 = $('#password1').val();
                var mdlevel = $('#mdlevel').val();
                var eod1 = $('#eodnum1').val();
                var eod2 = $('#eodnum2').val();
                var geolocking = $('#geolocking').val();
                var pricecode = $('#priceCode').val();
                var calltime = $('#calltime').val();	
                var capacity = $('#capacityUpdate').val();

                var defordsel = $('#defaultORDSelect').val();
                var stklist = $('#stkListSelect').val();
                var stkreq = $('#minstksku').val();
                var supervisor = $('#upt_supvisorName').val();

                // var warehouseCode = $('#btdtwarehouseSelect').val();
                var warehouseCode = $('#whCode').val();
                var logistictype = $('#logistictypeselect').val();

                if($.trim(contact) == ''){
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        title: 'Salesman contact number is required.',
                    });
                }else if($.trim(supervisor) == ''){
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        title: 'Supervisor name is required.',
                    });
                } else{
                    // Fix for driver bug: 12-16-2025
                    if(defordsel != 'D'){
                        logistictype = null;
                        $('#logistictypeselect').val('');
                    } else{
                        if(logistictype == '' || logistictype == null){
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                html: 'Logistic Salesman should have a logistic type.<br/><small>Make sure to choose logistic type.<small>',
                            });
                            return;
                        }
                    }

                    var phonechecker = checksalesmannumber();
                    if(phonechecker == 1){
                        Swal.close();
                        Swal.fire({
                            icon: "error",
                            title: 'Phone number ' + contact + ' already exist. Please try again.',
                        });
                    }else{
                        Swal.close();
                        Swal.fire({
                            title: "Are you sure?",
                            text: "You want to save all these changes?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes"
                        }).then((result) => {
                            if (result.isConfirmed) {

                                Swal.fire({
                                    html: "Please Wait... Executing Request...",
                                    timerProgressBar: true,
                                    allowOutsideClick: false,
                                    didOpen: () => {
                                        Swal.showLoading();
                                    },
                                });

                                $.ajax ({
                                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                                    type: "POST",
                                    data: {
                                        "type":"update_salesman_maintenance",
                                        "geolocking": geolocking,
                                        "mdPassword":password,
                                        "password1":password1,
                                        "mdlevel":mdlevel,
                                        "eodNumber1":eod1,
                                        "eodNumber2":eod2,
                                        "contactcell":contact,
                                        "color":color,
                                        "pricecode":pricecode,
                                        //"thumbnail": '',
                                        "calltime":calltime,
                                        "defordsel":defordsel,
                                        "stklist":stklist,
                                        "stkreq":stkreq,
                                        "pre": prerouteData,
                                        "post": postrouteData,
                                        "stack": stoctakeData,
                                        "oedcl": eodData,
                                        "ishybrid":ishybridData,
                                        "mdCode": mdcode,
                                        "capacity":capacity,
                                        "newCustomer":newCustomer,
                                        'otpdisabled':otpdisabledData,
                                        'SalesmanTypeData':SalesmanTypeData,
                                        'supervisor':supervisor,
                                        'warehouseCode':warehouseCode,
                                        'OSAChecking':OSAChecking,
                                        'WarehouseCode':warehouseCode,
                                        'logistictype':logistictype,
                                        "userID": GBL_USERID,
                                        "distCode": GBL_DISTCODE
                                    },
                                    dataType: "json",
                                    crossDomain: true,
                                    cache: false,   
                                    success: function(r){ 
                                        if(r == 1){
                                            // //check if defortype is sweeper
                                            // //original
                                            // if(defordsel == 'S'){
                                            //     execinsert_Sweeper();
                                            // }
                                            // if(defordsel == 'D'){
                                            //     console.log('btdt_driver');
                                            //     execinsert_btdt();
                                            // }
                                            // salesmanDataObject();
                                            // tableData.clear().rows.add(sourceData).draw();
                                            // Swal.fire({
                                            //     icon: "success",
                                            //     title: 'All data was successfully updated!',
                                            // });

                                            //check if defortype is sweeper
                                            //original
                                            if(defordsel == 'S'){
                                                execinsert_Sweeper();
                                            }
                                            if(defordsel == 'Y'){
                                                console.log('btdt_driver');
                                                execinsert_btdt();
                                            }
                                            salesmanDataObject();
                                            tableData.clear().rows.add(sourceData).draw();
                                            Swal.fire({
                                                icon: "success",
                                                title: 'All data was successfully updated!',
                                            });

                                        }else{
                                            Swal.fire({
                                                icon: "error",
                                                title: 'Something went wrong!',
                                                text: r,
                                            });
                                        }
                                    },
                                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                                        alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
                                    }
                                });
                            }
                        });
                    } //else
                }//else

            }, 1000);
        },
    });
}

function check_if_empty(){
    var mdName = $('#mdNameH').val();
    var mdPassword = $('#passwordH').val();
    var contCellNum = $('#mdcolorH').val();
    var capacity = $('#capacityH').val();
    var mdColor = $('#contactH').val();
    var eod1 = $('#eod1H').val();
    var eod2 = $('#eod2H').val();
    var calltimeH = $('#calltimeH').val();
    var priceCodeH = $('#priceCodeH').val();
    var defOrdTypeH = $('#defOrdTypeH').val();
    // var salesmanType = $('#salesmanTypeSelect').val();
     var salesmanType = 'GROC';

    var warehouseCode = $('#warehouseCodeList').val();
    var good_warehouseCodeList = $('#good_warehouseCodeList').val();
    var bad_warehouseCodeList = $('#bad_warehouseCodeList').val();

    if(mdName == '' ||
        mdPassword == '' ||
        contCellNum == '' ||
        mdColor == '' ||
        eod1 == '' ||
        eod2 == '' ||
        calltimeH == '' ||
        priceCodeH == '' ||
        capacity == '' ||
        defOrdTypeH == '' ||
        salesmanType == undefined ||
        warehouseCode == '' ||
        good_warehouseCodeList == '' ||
        bad_warehouseCodeList == ''){
        return false;
    }

    return true;
}

function salesmanList(){
    document.querySelector('#mdNameH').destroy();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"SALESMAN_LIST_FOR_INSERT", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(data){           
            $('#fetchCont').hide();      
            $('#sweeperSelect').html('');
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].name, value: data[x].mdsalesmancode };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#mdNameH',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });
        }//success here;
    })
}



function warehouseList(){
    // document.querySelector('#mdNameH').destroy();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"GET_WAREHOUSETYPE_SLS_FOR_INSERT", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(data){    
            var cont = '';
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].warehoousedesc, value: data[x].warehouseCode};
                myOptions.push(obj);

                cont += '<option value="'+data[x].warehouseCode.trim()+'">'+data[x].warehoousedesc+'</option>';
            }
            
            // console.log(myOptions);
            document.querySelector('#warehouseCodeList').destroy();
            VirtualSelect.init({
                ele: '#warehouseCodeList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });

            $('#whCode').append(cont);
        }//success here;
    })
}

function warehouseList_GOODWh(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"GET_GOODSTOCK_WAREHOUSE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(data){    
            var cont = '';
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Description, value: data[x].Warehouse};
                myOptions.push(obj);

                cont += '<option value="'+data[x].Warehouse.trim()+'">'+data[x].Description+' ('+data[x].Warehouse.trim()+')</option>';
            }

            document.querySelector('#good_warehouseCodeList').destroy();
            VirtualSelect.init({
                ele: '#good_warehouseCodeList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });

            $('#goodWH').append(cont);
        }//success here;
    })
}

function warehouseList_BADWh(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"GET_BADSTOCK_WAREHOUSE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(data){    
            var cont = '';
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Description, value: data[x].Warehouse};
                myOptions.push(obj);

                cont += '<option value="'+data[x].Warehouse.trim()+'">'+data[x].Description+' ('+data[x].Warehouse.trim()+')</option>';
            }
            
            document.querySelector('#bad_warehouseCodeList').destroy();
            VirtualSelect.init({
                ele: '#bad_warehouseCodeList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });

            $('#badWH').append(cont);
        }//success here;
    })
}

// function salesmanList_sweeper(){
//     document.querySelector('#mdNameH').destroy();
//     document.querySelector('#warehouseCodeList').destroy();
//     $.ajax ({
//         url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
//         type: "GET",
//         data: {"type":"get_all_salesman_sweeper", "CONN":con_info},
//         dataType: "json",
//         crossDomain: true,
//         cache: false,     
//         async: false,       
//         success: function(data){    
//             var myOptions = [];
//             for (var x = 0; x < data.length; x++) {
//                 var obj = { label: data[x].Salesman, value: data[x].mdCode };
//                 myOptions.push(obj);
//             }
//             // console.log(myOptions);
//             document.querySelector('#sweeperSelect').destroy();
//             VirtualSelect.init({
//                 ele: '#sweeperSelect',
//                 options: myOptions,
//                 search: true,
//                 maxWidth: '350px', 
//                 placeholder: 'Select Salesman'
//             });
//             // console.log("sweeperSelect Virtual Select Successfully Initialized");
//         }//success here;
//     })
// }

function salesmanList_btdt(){
    document.querySelector('#btdtsalesmanSelect').destroy();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"get_all_salesman_avl_btdt", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(data){    
            var myOptions = [];
            var cont = ``;
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
                cont += `<option value=`+data[x].mdCode+`>`+data[x].Salesman+`</option>`;
            }

            VirtualSelect.init({
                ele: '#btdtsalesmanSelect',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });

            $('#n_btdtdriverlist').html(cont);

        }//success here;
    })
}

 $('#showdriveraddtionbtdt').hide();
    $('#defOrdTypeH').on('change', function() {
        var salemantype = this.value;
        console.log(salemantype);
        if(salemantype == 'Y'){
            $('#showdriveraddtionbtdt').show();
        }else{
            $('#showdriveraddtionbtdt').hide();
        }
    });

priceCode();
function priceCode(){
    $('#fetchCont').hide();
    // document.querySelector('#mdNameH').destroy();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"PRICE_CODE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){         
            var myOptions = [];
            for (var x = 0; x < r.length; x++) {
                var obj = { label: r[x].priceCode, value: r[x].priceCode };
                myOptions.push(obj);
            }
            document.querySelector('#priceCodeH').destroy();
            VirtualSelect.init({
                ele: '#priceCodeH',
                options: myOptions,
                search: true,
                maxWidth: '350px', 
                placeholder: 'Choose here'
            });
        }//success here;
    })
}

(function($) {
    $.fn.inputFilter = function(inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    };
}(jQuery));

$("#contactH").inputFilter(function(value) {
    return /^\d*$/.test(value); 
});

$("#contact").inputFilter(function(value) {
    return /^\d*$/.test(value); 
});

$("#eodnum1").inputFilter(function(value) {
    return /^\d*$/.test(value); 
});

$("#eodnum2").inputFilter(function(value) {
    return /^\d*$/.test(value); 
});

$("#eod1H").inputFilter(function(value) {
    return /^\d*$/.test(value); 
});

$("#eod2H").inputFilter(function(value) {
    return /^\d*$/.test(value); 
});

function exec_Save_Salesman(){
    var mdName = '';
    var mdSalesmanCode = $('#mdNameH').val();
    var mdPassword = $('#passwordH').val();
    var mdColor = $('#mdcolorH').val();
    var contCellNum = $('#contactH').val();
    var capacity = $('#capacityH').val();
    var eod1 = $('#eod1H').val();
    var eod2 = $('#eod2H').val();
    var calltimeH = $('#calltimeH').val();
    var priceCodeH = $('#priceCodeH').val();
    var defOrdTypeH = $('#defOrdTypeH').val();
    var supervisor = $('#supvisorName').val();
    var salesmanType = 'GROC';

    var warehouseCode = $('#warehouseCodeList').val();

    var good_warehouseCodeList = $('#good_warehouseCodeList').val();
    var bad_warehouseCodeList = $('#bad_warehouseCodeList').val();

    var cret_logistictype = $('#cret_logistictype').val();
    


    if(!check_if_empty()){
        Swal.fire({
            icon: "error",
            title: "Fill In All Fields!",
            text: "Please try again."
        });
    }else{
        $('#saveBtn').html("<i class='fa fa-spin fa-spinner'></i> saving...");
        $('#saveBtn').prop('disabled', true);

        Swal.fire({
            html: "Please Wait... Saving New Salesman...",
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
                Swal.showLoading();

                setTimeout(() => {
                    $.ajax ({
                        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                        type: "POST",
                        data: {
                            "type":"INSERT_SALESMAN",
                            "mdName":mdName.toUpperCase(),
                            "mdSalesmanCode": mdSalesmanCode.toUpperCase().trim(),
                            "mdPassword":mdPassword,
                            "contCellNum":contCellNum,
                            "mdColor":mdColor,
                            "eod1":eod1,
                            "eod2":eod2,
                            "capacity":capacity,
                            "calltimeH":calltimeH,
                            "priceCodeH":priceCodeH.trim(),
                            "defOrdTypeH":defOrdTypeH,
                            "supervisor":supervisor,
                            "salesmanType":salesmanType,
                            "warehouseCode":warehouseCode.trim(),
                            "good_warehouseCodeList":good_warehouseCodeList,
                            "bad_warehouseCodeList":bad_warehouseCodeList,
                            "cret_logistictype":cret_logistictype,
                            "userID": GBL_USERID,
                            "distCode": GBL_DISTCODE
                        },
                        dataType: "json",
                        crossDomain: true,
                        cache: false,   
                        async: false,         
                        success: function(r){ 
                            if(r == 1){
                                salesmanList();
                                salesmanDataObject();
                                tableData.clear().rows.add(sourceData).draw();

                                $('#addSalesmanModal').modal('hide');
                                $('#mdNameH')[0].setValue([]);
                                $('#warehouseCodeList')[0].setValue([]);
                                $('#good_warehouseCodeList')[0].setValue([]);
                                $('#bad_warehouseCodeList')[0].setValue([]);
                                $('#calltimeH').val("07:00");
                                $('#priceCodeH')[0].setValue([]);
                                $('#defOrdTypeH').val('');
                                $('#capacityH').val(0);
                                $('#mdcolorH').val("#000");
                                $('#contactH').val("");
                                $('#eod1H').val("");
                                $('#supvisorName').val("");
                                $('#eod2H').val("");
                                
                                Swal.close();
                                Swal.fire({
                                    title: 'Success',
                                    icon: "success",
                                    text: "Salesman Successfully Added",
                                });

                            }else if(r == 'DUPLICATED'){
                                $('#addSalesmanModal').modal('hide');

                                Swal.close();
                                Swal.fire({
                                    title: 'Salesman Already Exist',
                                    icon: "error",
                                    html: 'Could not insert salesman ' + mdName.toUpperCase().trim() + '\n\nFor more details please call system administrator.'
                                });
                            }
                        },error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            $('#addSalesmanModal').modal('hide');
                            
                            Swal.close();
                            Swal.fire({
                                title: 'ERROR OCCUR:',
                                icon: "error",
                                html: XMLHttpRequest.responseText
                            });
                        } 
                    });
                }, 1000);
            },
        });

        
        $('#saveBtn').html("Save Changes");
        $('#saveBtn').prop('disabled', false);
    }
}

function saveChanges(){
    if(confirm('Are you sure you want to save all these changes?')) {

    }
}

$("#but_upload").click(function(){
    $(".hidden").click();
});

$("#uploadImg_BTN").click(function (){
    uploadNow();
});

$("#cancelImg_BTN").click(function (){
   $("#but_upload").show();
   $("#uploadImg_BTN").hide();
   $("#cancelImg_BTN").hide();
   $(".s_Maintenace").attr("src",imgHolderURL+"?"+ new Date().getTime());
});

function uploadNow(){
    var fd = new FormData();
    var files = $('#fileToUpload')[0].files[0];
    fd.append( 'fileToUpload',files);
    fd.append( 'mdCode', $('input[name=mdCode]').val());
    fd.append( 'site', $('input[name=site]').val());
    console.log('img:' + $('#fileToUpload')[0].files[0] + ' mdCode:' + $('input[name=mdCode]').val() +' site:'+ $('input[name=site]').val());
    $.ajax({
        url: 'upload.php',
        type: 'post',
        data: fd, 
        contentType: false,
        processData: false,
        dataType: 'JSON',
        success: function(response){
            alert('Salesman image succesfully updated!');
            $('.s_Maintenace').fadeOut(800, function(){
                $(".s_Maintenace").attr("src",response+"?"+ new Date().getTime()); 
                $('.s_Maintenace').fadeIn().delay(1500);
            });
        },error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
            $('.picCont').fadeOut(800, function(){
                $('.picCont').fadeIn().delay(2000);

            });
        }
    });

    $("#but_upload").show();
    $("#uploadImg_BTN").hide();
    $("#cancelImg_BTN").hide();
}

$(".hidden").change(function(){
    readURL(this);
    $("#but_upload").hide();
    $("#uploadImg_BTN").show();
    $("#cancelImg_BTN").show();
});
  
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('.s_Maintenace').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function imgError(image) {
    image.onerror = "";
    image.src = "../img/salesmanPic.jpg";
    return true;
}  

// showNotif();

// $(document).on('click', '.dropdown-toggle', function(){
// $('.count').html('');
//     showNotif('yes');
// });

// setInterval(function(){
//     //showNotif();
// }, 9000);

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

function disableSalesman(){
    var mdcode = $('#mdcodeholder').val();
    var f = confirm('Are you sure you want to disable this salesman?');
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
            type: "POST",
            data: {"type":"DISABLE_SALESMAN", "mdCode":mdcode, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,            
            success: function(data){          
                alert('Salesman successfully disabled.');
                salesmanDataObject();
                tableData.clear().rows.add(sourceData).draw();
            }//success here;
        })
    }
}

function copyAccountBTDT(){
    var mdCode = $('#btdtsalesmanSelect').val();
    var salesman = document.querySelector('#btdtsalesmanSelect').getDisplayValue();
    if(mdCode == '' || mdCode == undefined){
        alert('Please select a salesman to assign to btdt driver account.');
    }else{
        var f = confirm('Are you sure you want to assign this account?');
        if(f){
            $('.toAddSalesman').hide();
            var holder = {
                'mdCode': mdCode,
                'salesman': salesman
            };
            //clear list
            GLOBALBTDTACCOUNTHODER = [];
            GLOBALBTDTACCOUNTHODER.push(holder);
            console.log(GLOBALBTDTACCOUNTHODER);

            holder = [];
            var r = GLOBALBTDTACCOUNTHODER;
            var cont = '';
            for(var x = 0; x < r.length; x++){
                cont += `
                <tr class="toAddSalesman">
                    <td class="py-2 text-center">`+r[x].mdCode+`</td>
                    <td colspan="2" class="py-2 text-start">`+r[x].salesman+`</td>  
                </tr>
                `;
            }
            $('#defaultTr').hide();
            $('#btdtTbody').append(cont); 
        }
        $('#btdtsalesmanModal').modal('hide');
    }
}

function copyAccountSweeper(){
    var mdCode = $('#sweeperSelect').val();
    var salesman = document.querySelector('#sweeperSelect').getDisplayValue();
    if(mdCode == '' || mdCode == undefined){
        alert('Please select a salesman to copy for sweeper account.');
    }else{
        var f = confirm('Are you sure you want to copy this account?');
        if(f){
            var holder = {
                'mdCode': mdCode,
                'salesman': salesman
            };

            GLOBALSWEEPERACCOUNTHOLDER.push(holder);
            console.log(GLOBALSWEEPERACCOUNTHOLDER);

            holder = [];
            var r = GLOBALSWEEPERACCOUNTHOLDER;
            var cont = '';
            for(var x = 0; x < r.length; x++){
                cont += `
                    <tr>
                        <td>`+r[x].mdCode+`</td>
                        <td colspan="2">`+r[x].salesman+`</td>  
                    </tr>
                    `;
            }
            $('#sweeperTbody').html(cont); 
        }
        $('#sweeperModal').modal('hide');
    }
}

function execinsert_Sweeper(){
    var sweeperID = $('#mdcodeholder').val();
    var r = GLOBALSWEEPERACCOUNTHOLDER;
    for(var x = 0; x < r.length; x++){
        insert_sweeperData(sweeperID, r[x].mdCode);
    }
}

function insert_sweeperData(sweeperID, mdCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"INSERT_SWEEPER",
            "sweeperID": sweeperID,
            "mdCode":mdCode,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,   
        success: function(r){ 
            if(r){
                console.log('Sweeper account inserted.');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
        }
    });
}

function execinsert_btdt(){
    var btdtdriverID = $('#mdcodeholder').val();
    var r = GLOBALBTDTACCOUNTHODER;
    console.log(r);
    for(var x = 0; x < r.length; x++){
        insert_btdtsalesmanData(btdtdriverID, r[x].mdCode);
    }
}

function insert_btdtsalesmanData(btdt_samesman_mdCode, btdt_driver_mdCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"INSERT_BTDT_SALESMAN_ACCOUNT",
            // "btdt_samesman_mdCode": btdt_samesman_mdCode,
            // "btdt_driver_mdCode":btdt_driver_mdCode,
             "btdt_samesman_mdCode": btdt_driver_mdCode,
            "btdt_driver_mdCode":btdt_samesman_mdCode,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,   
        success: function(r){ 
            if(r){
                console.log('Btdt account added to driver.');
                salesmanList_btdt();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
        }
    });
}

function get_sweeper_accounts(mdCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_SWEEPER_ACCOUNT",
            "mdCode":mdCode,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,   
        success: function(r){ 
            if(r.length != 0){
                var cont = '';
                for(var x = 0; x < r.length; x++){
                    cont += `
                    <tr>
                        <td class="py-2 text-center">`+r[x].mdCode+`</td>
                        <td class="py-2 text-start">`+r[x].salesman+`</td>`+  
                        '<td style="text-align: center;"><button class="removeSalesmanBtn py-2" onclick="removeSweeperAcct(\''+r[x].sweeperID+'\', \''+r[x].mdCode+'\')"><span class="mdi mdi-minus-circle-outline"></span></button></td>'+`  
                    </tr>
                    `;
                }
                $('#sweeperTbody').html(cont); 
            }else{
                $('#sweeperTbody').html(` <tr id="defaultTr">
                                    <td colspan="3" style="text-align: center;">Press 'Add Account' button to set-up sweeper account/s for this salesman.</td>
                                  </tr>`);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
        }
    });
}


function get_btdt_salesman_accounts(mdCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_BTDT_SALESMAN_ACCOUNT",
            "mdCode":mdCode,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,   
        success: function(r){ 
            console.log(r);
            if(r.length != 0){
                var cont = '';
                for(var x = 0; x < r.length; x++){
                    cont += `
                    <tr>
                        <td class="py-2 text-center">`+r[x].BTDT_SALESMAN_MDCODE+`</td>
                        <td class="py-2 text-start">`+r[x].salesman+`</td>`+  
                        '<td style="text-align: center;"><button class="removeSalesmanBtn" onclick="removebtdtAcct(\''+r[x].BTDT_SALESMAN_MDCODE+'\', \''+r[x].BTDT_DRIVER_MDCODE+'\')"><span class="mdi mdi-minus-circle-outline"></span></button></td>'+`  
                    </tr>
                    `;
                }

              $('#btdtTbody').html(cont); 
            }else{
                $('#btdtTbody').html(` <tr id="defaultTr">
                                    <td colspan="3" style="text-align: center;">Press 'Add Account' button to set-up btdt driver for this salesman.</td>
                                  </tr>`);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
        }
    });
}

function removebtdtAcct(sweeperID, mdCode){
    var f = confirm('Are you sure you want to remove this account?');
    if(f){
        var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
            backdrop: true
        });
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"REMOVE_BTDT_SALESMAN_ACCOUNT",
                "btdt_samesman_mdCode":mdCode,
                "btdt_driver_mdCode":sweeperID,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,   
            success: function(r){ 
                if(r){
                    alert('btdt account ' +sweeperID+ ' was successfully removed.');
                    get_btdt_salesman_accounts(mdCode);
                    salesmanList_btdt();
                }
                dialog.modal('hide');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
            }
        }).done(function () {
            setTimeout(() => {
                dialog.modal('hide');
            });
        });
    }
}

function removeSweeperAcct(sweeperID, mdCode){
    var f = confirm('Are you sure you want to remove this account?');
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"REMOVE_SWEEPER_ACCOUNT",
                "mdCode":mdCode,
                "sweeperID":sweeperID,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,   
            success: function(r){ 
                if(r){
                    alert('Sweeper account ' +mdCode+ ' was successfully removed.');
                    get_sweeper_accounts(sweeperID);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
            }
        });
    }
}

// btdtwarehouse();
function btdtwarehouse(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_BTDT_WH_LIST",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,   
        success: function(r){ 
            var cont = '<option value="DEFAULT">DEFAULT</option>';
            for(var x = 0; x < r.length; x++){
                cont += `<option value=`+r[x].Warehouse+`>`+r[x].Description+`</option>`;
            }
            $('#btdtwarehouseSelect').html(cont);
        }
    });
}

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    var searchTerm = $(this).val();
    tableData.search(searchTerm).draw();
});

function resetAccount(){
    var mdCode = $('#mdcodeholder').val();
    if(mdCode == ''){
        Swal.fire({
            icon: "error",
            title: "Salesman mdCode is required! ",
            text: "Please try again."
        });
    }else{
        Swal.fire({
            title: "Are you sure?",
            text: "You want to reset this account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    html: "Please Wait... Executing Request...",
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                $('#resetBTN').html('<i class="fa fa-spin fa-spinner"></i> updating..');
                $.ajax ({
                    url: GLOBALLINKAPI+"/admin/connection/applicationApi.php",
                    type: "POST",
                    data: {"type":"RESET_ACCOUNT", 'mdCode':mdCode},
                    dataType: "json",
                    crossDomain: true,
                    cache: false,            
                    success: function(r){
                        Swal.close();
                        if(r){
                            Swal.fire({
                                icon: "success",
                                title: "Account Reset Successful",
                            });
                        }else{
                            Swal.fire({
                                icon: "error",
                                title: "INVALID SALESMAN CODE. ",
                                text: "Please try again."
                            });
                        }
                        $('#resetBTN').html(`<span class="mdi mdi-account-reactivate-outline"></span> <span>Reset Account</span>`);
                    }
                });
            }
        });
    }
}

function holdaccount(){
    var mdcode = $('#mdcodeholder').val();
    Swal.fire({
        title: "Are you sure?",
        text: "You want to hold this account?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                html: "Please Wait... Executing Request...",
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
                type: "POST",
                data: {"type":"HOLD_SALESMAN_ACCOUNT", "mdCode":mdcode, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
                dataType: "json",
                crossDomain: true,
                cache: false,            
                success: function(data){ 
                    Swal.close();         
                    if(data){
                        Swal.fire({
                            title: "Success!",
                            text: "Salesman successfully hold",
                            icon: "success"
                        });
                        salesmanDataObject();
                        tableData.clear().rows.add(sourceData).draw();
                    }
                }
            })
        }
    });
}

$(document).on('click', '.toggle-password', function () {
    const targetInput = $($(this).data('target'));
    const isPassword = targetInput.attr('type') === 'password';
    targetInput.attr('type', isPassword ? 'text' : 'password');

    const icon = $(this).find('i');
    icon.toggleClass('fa-eye-slash fa-eye');
});

