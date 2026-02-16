var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("adminUserName");
var sourceData;
var tableData, prioskuindicator;


getcompname_dynamic("Product List", "titleHeading");
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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Product List');
            $('#company_file').val(r[0].company.toUpperCase());
            console.log(r[0].company.toUpperCase());
        }
    });
} 

$('.emptyindicator').hide();
$('.loading-table').hide();
// $('#uploadImg_BTN').hide();
// $('#cancelImg_BTN').hide();

// $("#but_upload").click(function(){
//     $(".hidden").click();
// });

function readImage(inputElement) {
    var deferred = $.Deferred();

    var files = inputElement.get(0).files;
    if (files && files[0]) {
        var fr= new FileReader();
        fr.onload = function(e) {
            deferred.resolve(e.target.result);
        };
        fr.readAsDataURL( files[0] );
    } else {
        deferred.resolve(undefined);
    }

    return deferred.promise();
}

function exec_image_update(){
    $('.emptyindicator').removeClass('shakeit');
    $('.btn-text-cust').html('<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> updating please wait..');
       
    var stockCode = $('#productIDHolderinpt').val();
    var description = $('#discrptionHolderinpt').val();
    var formData = new FormData();
    var files = $('#fileToUpload')[0].files[0];
    var files_dir = $('#fileToUpload')[0].files[1];
    formData.append('fileToUpload', files);
    formData.append('description', $('input[name=description_file]').val());
    formData.append('company', $('input[name=company_file]').val());
    formData.append('site', $('input[name=site_file]').val());
    formData.append('s', $('input[name=s]').val());
    formData.append('u', $('input[name=u]').val());
    formData.append('p', $('input[name=p]').val());
    formData.append('d', $('input[name=d]').val());
    formData.append('stockCode', $('input[name=stockCode_file]').val());

    $.ajax ({
        url: '/upload/uploadProduct.php',
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'text',
        async: false,
        success: function(r){ 
            if(r == 1){
                updateProduct_exec();
            }else{
                alert('ERROR WHILE UPDATING: ' + r + '\n' + 'Please try again.');
            }
            $('.btn-text-cust').html('Save Changes');
        }
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
          
        reader.onload = function (e) {
            $('#productImageHolder').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

salesmanDataObject();
function salesmanDataObject(){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"PRODUCT_LIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,   
        async: false,         
        success: function(r){ 
            var localObj = [];
            for(var x = 0; x < r.length; x++){
                localObj.push({
                    //thumbnail_stockCode: "<img src='data:image/jpeg;base64,"+r[x].thumbnail+"' style='width: 35px; height:35px;' onerror='imgError(this)'/>",
                    holdskuchecker: holdchecker(r[x].HOLD_SKU_CHECKER),
                    thumbnail_stockCode: "<img src='/upload/store-image/nestle_product_images/"+r[x].StockCode+".jpg' style='width: 40px; height:40px;' onerror='imgError(this)'>",
                    thumbnail: r[x].thumbnail,
                    stockCode: r[x].StockCode,
                    supplier: r[x].Supplier,
                    Description: r[x].Description,
                    brand: r[x].Brand,
                    stockuom: r[x].StockUom,
                    alternateuom: r[x].AlternateUom,
                    confactaltuom: parseInt(r[x].ConvFactOthUom),
                    pricewithvat: Number(parseFloat(r[x].priceWithVat).toFixed(2)).toLocaleString(),
                    pricewithvatm: Number(parseFloat(r[x].priceWithVatM).toFixed(2)).toLocaleString(),
                    lastupdated: r[x].lastUpdated,
                    shortname: r[x].shortName,
                    templatecode: r[x].templateCode,
                    musthave: r[x].mustHave,
                    syncstat: r[x].syncstat,
                    templatename: r[x].templateName,
                    datetemp: r[x].dates_tamp,
                    timestamp: r[x].time_stamp,
                    buyingaccounts: r[x].buyingAccounts,
                    barcodepc: r[x].barcodePC,
                    barcodecs: r[x].barcodeCS,
                    priosku: r[x].PrioSKU,
                    productID: r[x].productID
                    //<button class="cust-del-btn"><i class="fas fa-trash-alt"></i></buttons>
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
  
function holdchecker(stat){
    if(stat == 1){
        return 'HOLD';
    }
    return 'AVAILABLE';
}

function empt_input(){
    $('#alerttype').val('');
    $('#ptype').val('');
    $('#description').val('');
    $('#sequence').val('');
    $('#remarks').val('');
}

function check_empty(){
    var a= $('#alerttype').val();
    var b= $('#ptype').val();
    var c= $('#description').val();
    var d= $('#sequence').val();
    var e= $('textarea#remarks').val();
    var res;
    if(a == '' || b == '' || c == '' || d == '' || e == ''){
        res = true;
    }else{
        res = false;
    }

    return res;
}

salesmanDataTable();
function salesmanDataTable(){
    $('.loader-indicator h3').hide();
    tableData =  $('#productList').DataTable({
        // "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<B><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "data": sourceData,
        "scrollX": true,
        "select": true,
        "ordering": false,
        "columns": [
            {'data':'holdskuchecker', title: 'Status'},
            {'data':'stockCode', title: 'Stock Code'},
            {'data':'supplier', title: 'Supplier'},
            {'data':'Description', title: 'Description'},
            {'data':'brand', title: 'Brand'},
            {'data':'stockuom', title: 'Stock UOM'},
            {'data':'alternateuom', title: 'Alternate UOM'},
            {'data':'confactaltuom', title: 'Confactalt UOM'},
            {'data':'pricewithvat', title: 'Price With Vat'},
            {'data':'pricewithvatm', title: 'Price With Vatm'},
            {'data':'lastupdated', title: 'Last Updated'},
            {'data':'shortname', title: 'Shortname'},
            {'data':'templatecode', title: 'Template Code'},
            {'data':'musthave', title: 'Must Have'},
            {'data':'syncstat', title: 'Sync Stat'},
            {'data':'templatename', title: 'Template Name'},
            {'data':'datetemp', title: 'Date Stamp'},
            {'data':'timestamp', title: 'Time Stamp'},
            {'data':'buyingaccounts', title: 'Buying Accounts'},
            {'data':'barcodepc', title: 'Barcode PC'},
            {'data':'barcodecs', title: 'Barcode CS'},
            {'data':'priosku', title: 'Prio Sku'}
        ],
        columnDefs: [
            {
                targets: [7, 8, 9, 13, 18, 21],
                className: 'text-center'
            }
        ],
        buttons: [
            {
                extend: 'collection',
                text: '<i class="fa-solid fa-download"></i> Export',
                autoClose: true,
                buttons: [
                    'print', 'csv', 'excel', 'copy'
                ],
            },
        ],
        "language": {
            "emptyTable": "No available records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            },
        },
        "aaSorting": [[ 0, "desc" ]],
        rowCallback: function(row, data, index){
        } 
    }).draw(true).columns.adjust();

    // $($.fn.dataTable.tables(true)).DataTable().columns.adjust().responsive.recalc();


    $('#productList tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        updateProduct(row.data());
    });

    $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
        var searchTerm = $(this).val();
        tableData.search(searchTerm).draw();
    });
    
    function updateProduct(r){
        $('#productDetailsModal').modal('show');
        $('#productIDHolder').html(r.stockCode);
        $('#productIDHolderinpt').val(r.stockCode);
        $('#discrptionHolderinpt').val(r.Description);
        $('#stockCodeHolder').html(r.stockCode);
        $('#discrptionHolder').html(r.Description);

        $('#siteHolder_file').val(user);
        $('#descriptionHolder_file').val(r.Description);
        $('#stockCodeHolder_file').val(r.stockCode);
        $('#s').val(s);
        $('#d').val(d);
        $('#u').val(u);
        $('#p').val(p);

        if(r.priosku == 1){
            $('.text-indicator').html('<span class="oncheck">ENABLED</span>');
            $('#prioskuHolder').prop("checked", true);
        }else if(r.priosku == 0){
            $('.text-indicator').html('<span class="onnotcheck">DISABLED</span>');
            $('#prioskuHolder').prop("checked", false);
        }

        $('#prioskuHolder').click(function() {
            if($('#prioskuHolder').prop("checked") == true){
                $('.text-indicator').html('<span class="oncheck">ENABLED</span>');
                prioskuindicator = 1;
                }
            else if($('#prioskuHolder').prop("checked") == false){
                $('.text-indicator').html('<span class="onnotcheck">DISABLED</span>');
                prioskuindicator = 0;
            }
        });


        $('#holdSKUbtn').hide();
        $('#activateSKUbtn').hide();

        if(r.holdskuchecker == 'HOLD'){
            $('#activateSKUbtn').show();
            $('#skustatusHolder').html('<span class="onnotcheck">HOLD</span>');
        }else{
            $('#holdSKUbtn').show();
            $('#skustatusHolder').html('<span class="oncheck">AVAILABLE</span>');
        }
        // getproduct(r.stockCode);
    }

    function getproduct(img){
        var id = $('#productIDHolderinpt').val();
        $.ajax ({
            url: "../admin/connection/applicationApi.php",
            type: "GET",
            data: {"type":"GET_PRODUCT_IMAGE", "CONN":con_info, "stockCode":img},
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(r){
                if(r.length != 0){
                    $('#productImageHolder').attr("src", "data:image/jpeg;base64,"+r[0].thumbnail);
                }else{
                    $('#productImageHolder').attr("src","../img/no-product-image.png");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR RETRIVING IMAGE: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function updateProduct_exec(){
    var productID = $('#productIDHolderinpt').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"UPDATE_PRODUCT_PRIOSKU", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "priosku":prioskuindicator, "stockCode":productID},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            if(r == 1){
                salesmanDataObject();
                tableData.clear().rows.add(sourceData).draw();
                alert('Successfully Updated!');
                $('#productDetailsModal').modal('hide');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('ERROR UPDATING STATUS: ' + JSON.stringify(XMLHttpRequest.responseText));
        }
    });
    $('.btn-text-cust').html('Save Changes');
}

function excecuteUpdate(){
    var id = $('#cidHolder').val();
    var a= $('#ptype').val();
    var b= $('#sequence').val();
    var c= $('textarea#remarks').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"UPDATE_CHECKLIST",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "ptype":a,
            "seq":b,
            "remarks":c,
            "cID":id
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            if(r == 1){
                salesmanDataObject();
                tableData.clear().rows.add(sourceData).draw();
                alert('UPDATED SUCCESSFULLY');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('ERROR UPDATING: ' + JSON.stringify(XMLHttpRequest.responseText));
        }
    });
}

function openHoldskumodal(){
    var stockCode = $('#productIDHolderinpt').val();
    var holdReason = $('textarea#skuholdreason').val();

    $('textarea#skuholdreason').val('');
    $('#holdSKUMODAL').modal('show');
    $('#prodsku').val(stockCode);
}

function exec_activate_Sku(){
    var stockCode = $('#productIDHolderinpt').val();
    var f = confirm('Are you sure you want to activate this sku?');
    if(f){
        $('#activateSKUbtn').html('<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> updating please wait..');
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"ACTIVATE_HOLD_SKU",
                "stockCode":stockCode,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: true,          
            success: function(r){
                if(r == 1){
                    salesmanDataObject();
                    tableData.clear().rows.add(sourceData).draw();
                    $('#activateSKUbtn').html('Activate SKU');
                    alert(stockCode + ' successfully activated.');
                    
                    $('#productDetailsModal').modal('hide');
                    $('#holdSKUMODAL').modal('hide');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR UPDATING: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function exec_holdsku(){
    var stockCode = $('#productIDHolderinpt').val();
    var holdReason = $('textarea#skuholdreason').val();

    if($.trim(holdReason) == ''){
        alert('Please indicate hold sku reason.');
    }else{
        $('#holdSKUbtn').html('<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> updating please wait..');

        var f = confirm('Are you sure you want to hold product ' +stockCode+'?');
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"ADD_HOLD_SKU",
                "stockCode":stockCode,
                "holdReason":holdReason,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(r){
                if(r == 1){
                    salesmanDataObject();
                    tableData.clear().rows.add(sourceData).draw();
                    $('#holdSKUbtn').html('Hold SKU');
                    alert(stockCode + ' successfully hold.');
            
                    $('#holdSKUMODAL').modal('hide');
                    $('#productDetailsModal').modal('hide');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR UPDATING: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function imgError(image) {
    image.onerror = "";
    image.src = "../img/no-product-image.png";
    return true;
}  

// showNotif();

$(document).on('click', '.dropdown-toggle', function(){
$('.count').html('');
    showNotif('yes');
});

setInterval(function(){
//showNotif();
}, 9000);

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
