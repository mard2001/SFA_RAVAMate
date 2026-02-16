$('.pulloutBTN').click(function (){
    window.open('stockCard', '_blank'); 
});
var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");

$('.loading-table').hide();

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

stockRequestSourceData();
datatableApp();

stockRequestSourceData2();
datatableApp2();

$('#approved_stockrequestlist').removeClass('hidden');
$('#approved_stockrequestlist').hide();
$('.btn1').click(function (){
       
    $('.btn1').removeClass('inactiveTab');
    $('.btn1').addClass('activeTab');

    $('.btn2').removeClass('activeTab');
    $('.btn2').addClass('inactiveTab');

    $('#approved_stockrequestlist').hide();
    $('#pending_stockrequestlist').show();

       //stockRequestSourceData();
       //tableData.clear().rows.add(sourceDat).draw();
});

$('.btn2').click(function (){

    $('.btn2').removeClass('inactiveTab');
    $('.btn2').addClass('activeTab');

    $('.btn1').removeClass('activeTab');
    $('.btn1').addClass('inactiveTab');

    $('#pending_stockrequestlist').hide();
    $('#approved_stockrequestlist').show();

    stockRequestSourceData2();
    tableData2.clear().rows.add(sourceDat2).draw();        
});

var sourceDat;
function stockRequestSourceData(){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"STOCKCARD_DATA_OPEN", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            sourceDat = r;
            $('#stockRequest_TAB').show();
            $('.loading-table').hide();
        }//success
    });
}

var tableData;
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><"#tableTopLeftBtn"><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
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
            { "data": "transDate", title:"Trans Date" },
            { "data": "salesmanrep", title:"Sales Person"},
            { "data": "refNo", title:"Reference No."},
            { "data": "tQuantity", title:"# items"},
            { "data": "tamount", title:"Amount" },
            { "data": "custCode", title:"Cust Code" },
            { "data": "remarks", title:"Remarks" },
        ],
        "footerCallback": function ( row, data, start, end, display ) {
            var DivBtnString =
                '<button class="topleftBtn" id="opentrans" aria-controls="stockRequest_TAB">'+
                    '<span>Open Transactions</span>'+
                '</button>'+
                '<button class="topleftBtn" id="verifiedtrans" aria-controls="stockRequest_TAB">'+
                    '<span>Verified Transactions</span>'+
                '</button>'
                
            $('#tableTopLeftBtn').html(DivBtnString);
        }
    });

    $('#stockRequest_TAB tbody').on( 'click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        var transactionID = tr.find('td:eq(7)').text();
        var mdCode = tr.find('td:eq(2)').text();

        $('.btn-updateVerified').hide();
        $('.btn-updateOpen').show();
        $('.textindicator').html("Click <b>'UPDATE'</b> button to verify pullout.");
        dislplayOpenTransModal(row.data());
    });

    function dislplayOpenTransModal(r){
        $('#mdCode_dataTrans').val(r.mdCode);
        $('#stockCode_dataTrans').val(r.StockCode);
        $('#refNo_dataTrans').val(r.refNo);
        $('#transDate_dataTrans').val(r.transDate);

        $('#transactionIDH').html(r.transactionID);
        $('#customerH').html(r.custCode);
        $('#salesmanH').html(r.salesmanrep);
        $('#refnoH').html(r.refNo);
        $('#stockCodeH').html(r.tQuantity);
        $('#transdateH').html(r.transDate);
        $('#amountH').html(r.tamount);
        //$('#totalAmount').html(r.tamount);

        get_stockCard_Details();
        $('#updateTransactionModal').modal('toggle');
    } 
}

function execute_update_open(){
    var mdCode = $('#mdCode_dataTrans').val();
    var stockCode = $('#stockCode_dataTrans').val();
    var refNo = $('#refNo_dataTrans').val();
    var transDate = $('#transDate_dataTrans').val();

    console.log(mdCode +' - '+ stockCode +' - '+ refNo +' - '+ transDate);

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"UPDATE_STOCKCARD_OPEN",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "mdCode":mdCode,
            "stockCode":stockCode,
            "refNo":refNo,
            "transDate":transDate
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            if(r == 1){
                stockRequestSourceData();
                tableData.clear().rows.add(sourceDat).draw();
                alert('Transaction successfully updated!');
                $('#updateTransactionModal').modal('hide');
            }
        }//success
    });
}

function get_stockCard_Details(){
    $('.table-details-holder').show();
    var refNo = $('#refNo_dataTrans').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"EXEC_GET_STOCKCARD_DETAILS",
            "userID": GBL_USERID,
           "distCode": GBL_DISTCODE,
            "refNo":refNo
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            var cont = '';
            $('#customerH').html(r[0].customer);
            for(var x = 0; x < r.length; x++){
                cont += '<tr>'+
                    '<td>'+r[x].StockCode+'</td>'+
                    '<td>'+r[x].Description+'</td>'+
                    '<td class="text-center">'+r[x].QTYStockUOM+'</td>'+
                    '<td class="text-center">'+r[x].QTYOtherUom+'</td>'+
                    '<td class="text-center">'+r[x].QTYPCS+'</td>'+
                    '<td class="text-right">'+r[x].amount +'</td>'+
                +'</tr>';
            }
            $('#stockCard_details_body').html(cont);
        }//success
    });
}

function printJPS(){
    var refNo = $('#refNo_dataTrans').val();
    localStorage.setItem('jpsprintRefno', refNo);
    window.open('https://mybuddy-sfa.com/SFA/print-jps.html', '_blank');
    //alert('coming soon');
}

var sourceDat2;
function stockRequestSourceData2(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
                "type":"STOCKCARD_DATA_VERIFIED", "userID": GBL_USERID, "distCode": GBL_DISTCODE
            },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            sourceDat2 = r;
        }//success
    });
}

var tableData2;
function datatableApp2(){
    tableData2 = $('table.approvedTBL').DataTable({
        "dom": 'Bfrtip',
        "responsive": true,
        "data": sourceDat2,
        "scrollX": true,
        "ordering": false,
        order: [[ 1, 'asc' ]],
        columns: [
            { "data": "transDate" },
            { "data": "salesmanrep"},
            { "data": "refNo"},
            { "data": "tQuantity"},
            { "data": "tamount" },
            { "data": "custCode" },
            { "data": "remarks" },
        ],
    });

    $('table.approvedTBL tbody').on( 'click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData2.row(tr);
        var transactionID = tr.find('td:eq(7)').text();
        var mdCode = tr.find('td:eq(2)').text();
        $('.btn-updateOpen').hide();
        $('.btn-updateVerified').show();

        $('.textindicator').show();
        $('.textindicator').html("Note: Click only <b>'UPDATE'</b> when Jobber Pullout is already encoded in SYSPRO to allow salesman to sync data from SFA Server.");
        dislplayOpenTransModal2(row.data());
    });

    function dislplayOpenTransModal2(r){
        $('#mdCode_dataTrans').val(r.mdCode);
        $('#stockCode_dataTrans').val(r.StockCode);
        $('#refNo_dataTrans').val(r.refNo);
        $('#transDate_dataTrans').val(r.transDate);

        $('#transactionIDH').html(r.transactionID);
        $('#customerH').html(r.custCode);
        $('#salesmanH').html(r.salesmanrep);
        $('#refnoH').html(r.refNo);
        $('#stockCodeH').html(r.tQuantity);
        $('#transdateH').html(r.transDate);

        $('#amountH').html(r.tamount);
        get_stockCard_Details();
        $('#updateTransactionModal').modal('toggle');
    }
}

function execute_update_verified(){
    var mdCode = $('#mdCode_dataTrans').val();
    var stockCode = $('#stockCode_dataTrans').val();
    var refNo = $('#refNo_dataTrans').val();
    var transDate = $('#transDate_dataTrans').val();

    console.log(mdCode +' - '+ stockCode +' - '+ refNo +' - '+ transDate);

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"UPDATE_STOCKARD_VERIFIED",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "mdCode":mdCode,
            "stockCode":stockCode,
            "refNo":refNo,
            "transDate":transDate
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            if(r == 1){
                stockRequestSourceData2();
                tableData2.clear().rows.add(sourceDat2).draw();
                pushnotif(refNo, mdCode);
                alert('Transaction successfully updated!');
                $('#updateTransactionModal').modal('hide');
            }
        }//success
    });
}

function pushnotif(refno, mdCode){
    var token = getToken(mdCode);
    $.ajax({        
        type : 'POST',
        url : "https://fcm.googleapis.com/fcm/send",
        headers : {
            Authorization : 'key=' + 'AAAA6gFzY08:APA91bGhXSORj4yKI5GDwvYIsIRCqJJn2UwO7dz_l5ZFjGmUsMj2-zpOu9R1RA7QSh0ECQ_zRibaoDLv1Z5fzk3LXqqUuaKlKJ_18ba822I4iHpgVtjSdMGdLaB37IPoGt2zFmx9Kmfy'
        },
        contentType : 'application/json',
        dataType: 'json',
        data: JSON.stringify({"to": token,
            "data": {
                "title":"Jobber Pullout Status",
                "body":"Your jobber pullout with reference no: " + refno + " has been encoded."
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

function getToken(mdCode){
    var token = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_USER_TOKEN",
            "userID": GBL_USERID,
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