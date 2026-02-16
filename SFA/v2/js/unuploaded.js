var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var startPickDate, endPickDate, if1dayisSelected;
var sourceData;
var tableData;
var prerouteData, postrouteData, stoctakeData, eodData;
var dssdate;

determineUserType(usertype); 
// getcompname();
getcompname_dynamic("Unuploaded", "titleHeading");
loadSalesman();
dsspicker();
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Unuploaded');
        }
    });
}    

$('#userConnection').val(user);

datePicker();
function datePicker(){
    var start = moment().subtract(29, 'days');
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
        $('#stockRequest_TAB').hide();
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        salesmanDataObject(start, end);
        tableData.clear().rows.add(sourceData).draw();
    });
}

salesmanDataTable();

VirtualSelect.init({
    ele: '#salesmanList_beta',
});

function salesmanDataObject(start, end){
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> fetching unploaded sales data...</p>',
        backdrop: true,
        //closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"UNUPLOADED_SALES", "start":start, "end":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,   
        async: false,         
        success: function(r){
            var sucmessage = '';
            if(r.length != 0){
                sourceData = r;
                dialog.modal('hide');
            }else{
                sourceData = [];
                if(if1dayisSelected == '86399999'){
                    sucmessage = startPickDate;
                }else{
                    sucmessage = startPickDate +' to ' + endPickDate;
                }
                bootbox.alert({
                    message: "<p class='text-danger'><i class='fas fa-exclamation-triangle'></i> Data not found on your requested date: </p><p>"+sucmessage+'</p>',
                    size: 'medium'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<p class="text-danger"><b>Ops! Unable to retrived unuploaded sales data!</b></p>' + XMLHttpRequest.responseText;
            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
        }
    }).done(function () {
        setTimeout(() => {
            dialog.modal('hide');
        }, 1000);
    });
    
}

function clearunuploaded(){
    var mdCode = $('#salesmanList_beta').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"CLEAR_INVENTORY_UPLOADED", "mdCode":mdCode, "transdate":dssdate, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,   
        async: false,         
        success: function(r){
            alert('Unuploaded transation was of '+mdCode+' successfully cleared.');
        }
    });
}

function salesmanDataObject_datatables(start, end){
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"UNUPLOADED_SALES", "start":start, "end":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,   
        async: false,         
        success: function(r){
            var sucmessage = '';
            if(r.length != 0){
                sourceData = r;
            }else{
                sourceData = [];
                if(if1dayisSelected == '86399999'){
                    sucmessage = startPickDate;
                }else{
                    sucmessage = startPickDate +' to ' + endPickDate;
                }
                bootbox.alert({
                    message: "<p class='text-danger'><i class='fas fa-exclamation-triangle'></i> Data not found on your requested date: </p><p>"+sucmessage+'</p>',
                    size: 'medium'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<p class="text-danger"><b>Ops! Unable to retrived unuploaded sales data!</b></p>' + XMLHttpRequest.responseText;
            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
        }
    });
}


function salesmanDataTable(){
    tableData =  $('table.overridesList').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<B><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',        
        "responsive": true,
        "data": sourceData,
        "scrollX": true,
        "ordering": false,
        "language": {
            "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            },
            "emptyTable": "No available records as of now."
        },
        select: true,
        select: {
            style: 'multi',
        },
        columns: [
            {   
                'data': null,
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
            },
            { "data": "Salesperson", title:"Salesperson"},
            { "data": "PO Number", title:"PO Number"},
            { "data": "Customer", title:"Customer ID"},
            { "data": "Customer Name", title:"Customer Name" },
            { "data": "Sales Order Date", title:"Sales Order Date" },
            { "data": "Required Delivery Date", title:"Required Delivery Date" },
            { "data": "PO: 2", title:"PO: 2"},
            { "data": "Stock Code", title:"Stock Code"},
            { "data": "CASE", title:"Case"},
            { "data": "PIECE", title:"Piece" },
            { "data": "ITEM DESCRIPTION", title:"Item Description" },
            { "data": "PIECESPERCASE", title:"Piece/Case"},
            { "data": "PRICEPERCASE", title:"Price/Case"},
            { "data": "UNIT PRICE", title:"Unit Price"},
            { "data": "TOTAL_AMOUNT", title:"Total Amount" },
            { "data": "GRAND TOTAL", title:"Grand Total"}
        ],
        columnDefs: [
            {
                className: 'text-right',
                "targets": 11
            },
            {
                className: 'text-center',
                "targets": [0, 7, 8, 9, 10, 12],
            },
            {
                className: 'text-right',
                "targets": [13, 16],
                render: function (data, type, row, meta) {
                    return '₱' + data;
                }
            },
        ],
        buttons: [ 
            {
                text: ' <span class="mdi mdi-account-tag-outline"></span> Tag as uploaded ',
                className: 'approveBtn_stocReq upperLeftBtn customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                var row = tableData.rows('.selected').data();
                    if(row.length == 0){
                        alert('NO DATA SELECTED!');
                    }else{
                        var c = confirm('Are you sure you want to update this transaction?');
                        if(c){
                            var dialog = bootbox.dialog({
                                message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> tagging unploaded sales please wait...</p>',
                                backdrop: true,
                                //closeButton: false
                                });
                            for(var x = 0; x < row.length; x++){
                                console.log(row[x].transactionID);
                                exec_isexport_datatables(row[x].transactionID);
                            }
                            
                            salesmanDataObject_datatables(startPickDate, endPickDate);
                            tableData.clear().rows.add(sourceData).draw();
                            dialog.modal('hide');
                            alert('Transaction successfull updated!');
                        }
                    }
                },   
            },
            {
                text: '<span class="mdi mdi-backspace-reverse-outline"></span> Clear',
                className: 'approveBtn_stocReq upperLeftBtn customDTTables dt-button buttons-collection',
                action: function(e, dt, node, config){
                    $('#clearModal').modal('show');
                },   
            },
            {
                text: '<span class="mdi mdi-microsoft-excel"></span> excel',
                extend: 'excelHtml5',
                className: 'upperLeftBtn customDTTables dt-button buttons-collection',
            },
            { 
                text: '<span class="mdi mdi-printer-outline"></span> print',
                extend: 'print',
                className: 'upperLeftBtn customDTTables dt-button buttons-collection',
            }
        ],
        "drawCallback": function( settings ) {
            // $('[data-toggle="tooltip1"]').tooltip();
            // $('[data-toggle="tooltip2"]').tooltip();
        },
        "aaSorting": [[ 0, "desc" ]],
        rowCallback: function(row, data, index){
            var salesFormat = $(row).find('td:eq(14)').text();
            var grandSalesFormat = $(row).find('td:eq(15)').text();
            $(row).find('td:eq(14)').text('₱' + Number(parseFloat(salesFormat).toFixed(2)).toLocaleString());
            $(row).find('td:eq(15)').text('₱' + Number(parseFloat(grandSalesFormat).toFixed(2)).toLocaleString());
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
                .column( 15 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
         
            pageTotal = api
                .column( 15, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
         
            $( api.column( 15 ).footer() ).html(
                '&#x20b1;'+Number(parseFloat(pageTotal).toFixed(2)).toLocaleString() +' ( &#x20b1;'+ Number(parseFloat(total).toFixed(2)).toLocaleString() +')'
            );

            var connectStr = 
                "<div class='div1'>"+
                    // "<span style='color: #949494;'>Total Sales</span>"+
                    "<div class='mx-1 mt-2'>"+
                        "<span class='mdi mdi-finance'></span>"+
                        "<span class='fw-bold' ><span style='font-size: 13px; font-weight: 300; color: #949494;'>Total Sales:</span> ₱ "+pageTotal.toLocaleString() +" (₱"+ total.toLocaleString() +")"+"</span>"+
                    "</div>"+
                "</div>";

            $('#dt-body-right').html(connectStr);
        } 
        
    });

    $('.customDTTables').removeClass('btn btn-secondary');
    
    $('table.overridesList tbody').on( 'dblclick', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        var po = tr.find('td:eq(2)').text();
        // var cust = tr.find('td:eq(2)').text() +' '+ tr.find('td:eq(3)').text();
        var cust = tr.find('td:eq(4)').text();
        var stock = tr.find('td:eq(8)').text();
        var item = tr.find('td:eq(11)').text();
        exec_update_isexport(row.data(), po, cust, stock, item);
    });

    function exec_update_isexport(r, po, cust, stock, item){
        $('#transactionIDH').html(r.transactionID);
        $('#ponumberH').html(po);
        $('#salespersonH').html(r.Salesperson);
        $('#customerH').html(cust);
        
        $('#stockH').html(stock);
        $('#descH').html(item);
        $('#quantH').html(r.CASE +' / '+ r.PIECESPERCASE);
        $('#totalH').html(Number(parseFloat(r.TOTAL_AMOUNT).toFixed(2)).toLocaleString());
        $('#transactionGlobalHolder').val(r.transactionID);
        $('#updateIsexportModal').modal('show');
    }    
}

function exec_isexport(){
    var transactionID = $('#transactionGlobalHolder').val();
    console.log(transactionID);
    var c = confirm('Are you sure you want to update this transaction?');
    if(c){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"EXEC_ISEXPORT_UPDATE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, 'transactionID':transactionID},
            dataType: "JSON",
            crossDomain: true,
            cache: false,            
            success: function(r){
                if(r){
                    salesmanDataObject(startPickDate, endPickDate);
                    tableData.clear().rows.add(sourceData).draw();
                    alert('Transaction successfull updated!');
                    $('#updateIsexportModal').modal('hide');
                }
            }
        });
    }
}

function exec_isexport_datatables(transactionID){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"EXEC_ISEXPORT_UPDATE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, 'transactionID':transactionID},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
    });
}


function dsspicker(){
    $('.datestring').html('Pick a date here..');
    $('.dssdatePicker').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {
        dssdate = start.format('YYYY-MM-DD');
        var today = moment().format('YYYY-MM-DD');
        $('.datestring').html(dssdate);
    });
}

function loadSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"dsr_salesmanLoad", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(data){ 
            // var cont = '<option value="" selected disabled hidden>Select salesman here..</option>';
            // for(var x = 0; x<data.length; x++){
            //     cont += '<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>';
            // }
            // $('#salesmanList_beta').html(cont);

            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }

            document.querySelector('#salesmanList_beta').destroy();
            VirtualSelect.init({
                ele: '#salesmanList_beta',
                options: myOptions,
                search: true,
                placeholder: 'Select Salesman'
            });
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

// function showNotif(view=''){
//     $.ajax ({
//     url: "../geofencing/GeofencingAPI.php",
//     type: "GET",
//     data: {"type":"view_notifications_icon_"+user, "view":view},
//     dataType: "JSON",
//     crossDomain: true,
//     cache: false,            
//     success: function(response){ 
//         // console.log('Notification function has been refresh');                
//         $("#notifs-icon-div").html(response.notification);

//         if(response.unseen_notification > 0)
//         {
//             $('.count').html(response.unseen_notification);
//         }
          
//         }
//     });
// }

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});