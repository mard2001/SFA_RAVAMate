var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("adminUserName");

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// getcompname();
getcompname_dynamic("BTDT Product List", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | BTDT Product List');
            $('#company_file').val(r[0].company.toUpperCase());
            console.log(r[0].company.toUpperCase());
        }
    });
} 
 

$('.emptyindicator').hide();

$('#uploadImg_BTN').hide();
$('#cancelImg_BTN').hide();
 
$("#but_upload").click(function(){
    $(".hidden").click();
});

$(".hidden").change(function(){
    readURL(this);
    $("#but_upload").show();
});

VirtualSelect.init({
    ele: '#btdtwhList',
});

VirtualSelect.init({
    ele: '#btdtskulist',
});

$('.loading-table').hide();

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
var sourceData;
function salesmanDataObject(){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"BTDT_PRODUCT_LIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
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
                    DATEADDED: r[x].DATEADDED,
                    WarehouseCode: r[x].WarehouseCode,
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
var tableData, prioskuindicator;
function salesmanDataTable(){
    $('.loader-indicator h3').hide();
    tableData =  $('#productList').DataTable({
        dom: '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><"#tableTopLeftBtn"><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',        
        "data": sourceData,
        "scrollX": true,
        "ordering": false,
        "language": {
            "emptyTable": "No available records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>",
                select: {
                    rows: ""
                }
            },
        },
        select: {
            style: 'multi',
            selector: 'td:first-child'
        },
        // order: [[1, 'asc']],
        "columns": [
            {   
                data: null,
                orderable: false,
                className: 'selectcheckbox text-center',
                render: function(data, type, row, meta) {
                    return '<input type="checkbox">';
                }
            },
            {'data':'WarehouseCode', title:"Warehouse Code"},
            {'data':'stockCode', title:"Stock Code"},
            {'data':'supplier', title:"Supplier"},
            {'data':'Description', title:"Description"},
            {'data':'brand', title:"Brand"},
            {'data':'stockuom', title:"Stock UOM"},
            {'data':'alternateuom', title:"Alternate UOM"},
            {'data':'confactaltuom', title:"Confactalt UOM"},
            {'data':'pricewithvat', title:"Price With Vat"},
            {'data':'pricewithvatm', title:"Price With Vatm"},
            {'data':'DATEADDED', title:"Date Added"},
            {'data':'shortname', title:"Short Name"},
            {'data':'templatecode', title:"Template Code"},
            {'data':'musthave', title:"Must Have"},
            {'data':'syncstat', title:"Sync Stat"},
            {'data':'templatename', title:"Template Name"},
            {'data':'datetemp', title:"Date Temp"},
            {'data':'timestamp', title:"Timestamp"},
            {'data':'buyingaccounts', title:"Buying Accounts"},
            {'data':'priosku', title:"Prio Sku"}
        ],
        columnDefs: [
            {
                targets: '_all',
                orderable: false // Disable sorting for all columns
            },
            {
                targets: [8, 9, 10, 14, 19, 20],
                className: 'text-center'
            },
        ],
        buttons: [
            {
                text: 'REMOVE',
                action: function ( e, dt, node, config ) {
                    var row = tableData.rows('.selected').data();
                    if(row.length == 0){
                        alert('NO DATA SELECTED!');
                    }else{
                        var c = confirm('Are you sure you want to update this selected skus?');
                        if(c){
                            var dialog = bootbox.dialog({
                                message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> tagging unploaded sales please wait...</p>',
                                backdrop: true,
                                //closeButton: false
                                });
                            for(var x = 0; x < row.length; x++){
                                var warehouse = row[x].WarehouseCode;
                                var sku = row[x].stockCode;
                                // exec_isexport_datatables(row[x].transactionID);
                                exec_remove_btdt_sku(sku, warehouse);
                            }
                            
                            // salesmanDataObject_datatables(startPickDate, endPickDate);
                            // tableData.clear().rows.add(sourceData).draw();
                            dialog.modal('hide');
                            alert('SKUs successfull removed!');
                            location.reload();
                        }
                    }
                }
            },
            {
                text: 'ADD',
                action: function ( e, dt, node, config ) {
                    empt_input();
                //   $('.dynamicheader').html('<i class="fas fa-clipboard-list"></i> New Check List');
                //   $('#savaChangesBtn').hide();
                //   $('#addCLBtn').show();
                    $('#addbtdtskuModal').modal('show');
                }
            },
            {
                text: 'UPLOAD',
                action: function ( e, dt, node, config ) {
                    empt_input();
                //   $('.dynamicheader').html('<i class="fas fa-clipboard-list"></i> New Check List');
                //   $('#savaChangesBtn').hide();
                //   $('#addCLBtn').show();
                    $('#updatebtdtskuModal').modal('show');
                }
            },
            'print', 'csv', 'excel', 'copy'
        ],
        rowCallback: function(row, data, index){
            var DivBtnString =
                '<button class="topleftBtn" id="addBTDT_btn" aria-controls="productList">'+
                    '<span><span class="mdi mdi-plus-circle-outline"></span> Add </span>'+
                '</button>'+
                '<button class="topleftBtn" id="uploadBTDT_btn" aria-controls="productList">'+
                    '<span><span class="mdi mdi-upload"></span> Upload</span>'+
                '</button>'+
                '<button class="topleftBtn" id="removeBTDT_btn" aria-controls="productList">'+
                    '<span><span class="mdi mdi-minus-circle-outline"></span> Remove</span>'+
                '</button>'
                
            $('#tableTopLeftBtn').html(DivBtnString);
        },
        headerCallback: function(thead, data, start, end, display) {
            $(thead).find('th').eq(0).html('<input type="checkbox" id="selectAllCheckbox">');
        }
    });

    // Check or uncheck all checkboxes when header checkbox is clicked
    $(document).on('click', '#selectAllCheckbox', function() {
        var isChecked = $(this).prop('checked');
        var $filteredRows = tableData.rows({ filter: 'applied' }).nodes().to$();
        $('.selectcheckbox input[type="checkbox"]', $filteredRows).prop('checked', isChecked);
    
        if (isChecked) {
            $filteredRows.addClass('selected');
        } else {
            $filteredRows.removeClass('selected');
        }
    });

    $('#productList').on('change', '.selectcheckbox input[type="checkbox"]', function() {
        var $checkbox = $(this);
        var $row = $checkbox.closest('tr');
    
        if ($checkbox.prop('checked')) {
            $row.addClass('selected');
        } else {
            $row.removeClass('selected');
        }
    });

    $('#productList tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        // updateProduct(row.data());
    });

    $(document).on('click', '#removeBTDT_btn', function() {
        tableData.button(0).trigger();
    });
    $(document).on('click', '#addBTDT_btn', function() {
        tableData.button(1).trigger();
    });
    $(document).on('click', '#uploadBTDT_btn', function() {
        tableData.button(2).trigger();
    });
    $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
        var searchTerm = $(this).val();
        tableData.search(searchTerm).draw();
    });
    $('#copyBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-copy').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-print').trigger('click');
    });    
    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#csvBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-csv').trigger('click');
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
    }
    getproduct();
    function getproduct(){
        var id = $('#productIDHolderinpt').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"PRODUCT_LIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(r){
                var myOptions = [];
                for (var x = 0; x < r.length; x++) {
                    var obj = { label: r[x].StockCode+' - '+r[x].Description, value: r[x].StockCode };
                    myOptions.push(obj);
                }

                document.querySelector('#btdtskulist').destroy();
                VirtualSelect.init({
                    ele: '#btdtskulist',
                    options: myOptions,
                    search: true,
                    maxWidth: '100%',
                    placeholder: 'Choose here'
                });
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR RETRIVING IMAGE: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}
// salesmanDataTable();
// var tableData, prioskuindicator;
//   function salesmanDataTable(){
//      $('.loader-indicator h3').hide();
//       tableData =  $('#productList').DataTable({
//                   "dom": 'Bfrtip',
//                   "data": sourceData,
//                   "scrollX": true,
//                   "select": true,
//                   "ordering": false,
//                   language: {
//                       select: {
//                           rows: ""
//                       }
//                   },
//                   select: true,
//                   select: {
//                       style: 'multi',
//                       //selector: 'td:first-child'
//                   },
//                   "columns": [
//                       // {"data":'thumbnail_stockCode'},
//                       // {'data':'holdskuchecker'},
//                       {   
//                       'data': null,
//                       'targets': 0,
//                       'checkboxes': {
//                           'selectRow': true
//                           }
//                       },
//                       {'data':'WarehouseCode'},
//                       {'data':'stockCode'},
//                       {'data':'supplier'},
//                       {'data':'Description'},
//                       {'data':'brand'},
//                       {'data':'stockuom'},
//                       {'data':'alternateuom'},
//                       {'data':'confactaltuom'},
//                       {'data':'pricewithvat'},
//                       {'data':'pricewithvatm'},
//                       {'data':'DATEADDED'},
//                       {'data':'shortname'},
//                       {'data':'templatecode'},
//                       {'data':'musthave'},
//                       {'data':'syncstat'},
//                       {'data':'templatename'},
//                       {'data':'datetemp'},
//                       {'data':'timestamp'},
//                       {'data':'buyingaccounts'},
//                       {'data':'priosku'}
//                   ],
//                    columnDefs: [
//                     {
//                         targets: [8, 9, 10, 19, 20],
//                         className: 'text-right'
//                     }
//                   ],
//                   "language": {
//                     "emptyTable": "No available records as of now."
//                   },
//                   // "aaSorting": [[ 0, "desc" ]],
//                    buttons: [
//                        {
//                           text: 'REMOVE',
//                           action: function ( e, dt, node, config ) {
//                               var row = tableData.rows('.selected').data();
//                               if(row.length == 0){
//                                   alert('NO DATA SELECTED!');
//                               }else{
//                                   var c = confirm('Are you sure you want to update this selected skus?');
//                                   if(c){
//                                       var dialog = bootbox.dialog({
//                                           message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> tagging unploaded sales please wait...</p>',
//                                           backdrop: true,
//                                           //closeButton: false
//                                           });
//                                       for(var x = 0; x < row.length; x++){
//                                           var warehouse = row[x].WarehouseCode;
//                                           var sku = row[x].stockCode;
//                                           // exec_isexport_datatables(row[x].transactionID);
//                                           exec_remove_btdt_sku(sku, warehouse);
//                                       }
                                      
//                                       // salesmanDataObject_datatables(startPickDate, endPickDate);
//                                       // tableData.clear().rows.add(sourceData).draw();
//                                       dialog.modal('hide');
//                                       alert('SKUs successfull removed!');
//                                       location.reload();
//                                   }
//                               }
//                           }
//                       },
//                       {
//                           text: 'ADD',
//                           action: function ( e, dt, node, config ) {
//                             empt_input();
//                           //   $('.dynamicheader').html('<i class="fas fa-clipboard-list"></i> New Check List');
//                           //   $('#savaChangesBtn').hide();
//                           //   $('#addCLBtn').show();
//                             $('#addbtdtskuModal').modal('show');
//                           }
//                       },
//                       {
//                           text: 'UPLOAD',
//                           action: function ( e, dt, node, config ) {
//                             empt_input();
//                           //   $('.dynamicheader').html('<i class="fas fa-clipboard-list"></i> New Check List');
//                           //   $('#savaChangesBtn').hide();
//                           //   $('#addCLBtn').show();
//                             $('#updatebtdtskuModal').modal('show');
//                           }
//                       },
//                       {
//                         extend: 'collection',
//                         text: 'Export',
//                         autoClose: true,
//                         buttons: [
//                         'print', 'csv', 'excel', 'copy'
//                         ]
//                     }
//                   ],
//                   rowCallback: function(row, data, index){
//                 } 
//          });

//       $('#productList tbody').on('click', 'tr', function () {
//           var tr = $(this).closest('tr');
//           var row = tableData.row(tr);
//           // updateProduct(row.data());
//       });

//       function updateProduct(r){
//         $('#productDetailsModal').modal('show');
//         $('#productIDHolder').html(r.stockCode);
//         $('#productIDHolderinpt').val(r.stockCode);
//         $('#discrptionHolderinpt').val(r.Description);
//         $('#stockCodeHolder').html(r.stockCode);
//         $('#discrptionHolder').html(r.Description);

//         $('#siteHolder_file').val(user);
//         $('#descriptionHolder_file').val(r.Description);
//         $('#stockCodeHolder_file').val(r.stockCode);
//         $('#s').val(s);
//         $('#d').val(d);
//         $('#u').val(u);
//         $('#p').val(p);

//         if(r.priosku == 1){
//           $('.text-indicator').html('<span class="oncheck">ENABLED</span>');
//           $('#prioskuHolder').prop("checked", true);
//         }else if(r.priosku == 0){
//           $('.text-indicator').html('<span class="onnotcheck">DISABLED</span>');
//           $('#prioskuHolder').prop("checked", false);
//         }

//         $('#prioskuHolder').click(function() {
//           if($('#prioskuHolder').prop("checked") == true){
//             $('.text-indicator').html('<span class="oncheck">ENABLED</span>');
//             prioskuindicator = 1;
//           }
//           else if($('#prioskuHolder').prop("checked") == false){
//               $('.text-indicator').html('<span class="onnotcheck">DISABLED</span>');
//             prioskuindicator = 0;
//           }
//         });


//         $('#holdSKUbtn').hide();
//         $('#activateSKUbtn').hide();

//         if(r.holdskuchecker == 'HOLD'){
//           $('#activateSKUbtn').show();
//           $('#skustatusHolder').html('<span class="onnotcheck">HOLD</span>');
//         }else{
//           $('#holdSKUbtn').show();
//           $('#skustatusHolder').html('<span class="oncheck">AVAILABLE</span>');
//         }

       

//         // getproduct(r.stockCode);
//       }
//       getproduct();
//       function getproduct(){
//         var id = $('#productIDHolderinpt').val();
//         $.ajax ({
//           url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
//           type: "GET",
//           data: {"type":"PRODUCT_LIST", "CONN":con_info},
//           dataType: "json",
//           crossDomain: true,
//           cache: false,  
//           async: false,          
//           success: function(r){
//               for(var x = 0; x<r.length; x++){
//                   $('#btdtskulist').append('<option value="'+r[x].StockCode+'">'+r[x].StockCode+' - '+r[x].Description+'</option>');
//               }

//               $('#btdtskulist').multiselect({
//                   numberDisplayed: 1,
//                   enableCaseInsensitiveFiltering: true,
//                   includeSelectAllOption: true,
//                   selectAllNumber: true,
//                   buttonWidth: '100%',
//                   maxHeight: 300
//               });
//           },
//           error: function(XMLHttpRequest, textStatus, errorThrown) {
//             alert('ERROR RETRIVING IMAGE: ' + JSON.stringify(XMLHttpRequest.responseText));
//           }
//         });
//       }
//   }

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

getbtdtwarehouselist();
function getbtdtwarehouselist(){
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
        async: false,          
        success: function(r){
            var myOptions = [];
            for (var x = 0; x < r.length; x++) {
                var obj = { label: r[x].Description, value: r[x].Warehouse };
                myOptions.push(obj);
            }

            document.querySelector('#btdtwhList').destroy();
            VirtualSelect.init({
                ele: '#btdtwhList',
                options: myOptions,
                search: true,
                maxWidth: '100%',
                placeholder: 'Choose here..'
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('ERROR UPDATING: ' + JSON.stringify(XMLHttpRequest.responseText));
        }
    });
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

function exec_add_btdt_sku(){
    var f = confirm('Are you sure you want to add this skus?');
    if(f){
        var btdtskulist = $('#btdtskulist').val();
        var btdtwhList = $('#btdtwhList').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"EXEC_ADD_BTDT_SKU",
                "btdtskulist":btdtskulist,
                "btdtwhList":btdtwhList,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(r){
                if(r){
                    alert('BTDT SKUs successfully added');
                    location.reload();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR UPDATING: ' + JSON.stringify(XMLHttpRequest.responseText));
            }
        });
    }
}

function exec_remove_btdt_sku(sku, warehouse){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"EXEC_REMOVE_BTDT_SKU",
            "sku":sku,
            "warehouse":warehouse,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            if(r){
                console.log(r);
            } 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('ERROR UPDATING: ' + JSON.stringify(XMLHttpRequest.responseText));
        }
    });
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