var usertype = localStorage.getItem("usertype");
var sourceDat;
var tableData;

determineUserType(usertype); 
// getcompname();
getcompname_dynamic("Bank Maintenance", "titleHeading");
function addBank(){
    $('#addBankModal').modal('show');
}

function showSalesmanModal(){
    $('#dssmodal').modal('show');
}

$('#bankCode').val('');
$('#bankName').val('');
function exec_Addbank(){
    var bankCode = $('#bankCode').val();
    var bankName = $('#bankName').val();
    var f = confirm('Are you sure you want to add this bank?'); 
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type":"EXEC_NW_BANK_INSRT",
                "bankname":bankName,
                "bankcode":bankCode,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,            
            success: function(r){ 
                if(r){
                    alert(bankName + ' successfully added.');
                    location.reload();
                }
            }
        });
    }
}

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Bank Maintenance');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('#titleHeading').html('<i class="fa fa-circle blinking"></i> <b style="color:red;">ERROR:</b> Unable to establish a connection from your server. Please check your server settings.');
        }
    });
} 

$('.loading-table').hide();
function customerTaggingData(){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_BANK_LIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                sourceDat = r;
                $('#stockRequest_TAB').show();
                $('.loading-table').hide();
            }else{
                alert('NO DATA FOUND');
            }
        },
    });
}

datatableApp();
customerTaggingData();
tableData.clear().rows.add(sourceDat).draw();

function datatableApp(){
    // $('[data-toggle="tooltip"]').tooltip();
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "language": {
            "emptyTable": "No available records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            },
        },
        columns: [
            { data: "bankCode", title: "Bank Code" },
            { data: "bankName", title: "Bank Name" },
            { data: "lastUpdated", title: "Last Updated" }
        ],
        drawCallback: function (settings) {
            // $('[data-toggle="tooltip"]').tooltip();
        },
        rowCallback: function(row, data, index){
        },
        buttons: [ 
            {
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [0, 1, 2]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [0, 1, 2]
                }
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [0, 1, 2]
                }
            }
        ]
    });

    $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
        var searchTerm = $(this).val();
        tableData.search(searchTerm).draw();
    });
    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-copy').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-print').trigger('click');
    });
}

tableData.on( 'draw', function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function showAddBankModal(){
    $('#addBankModal').modal('show');
}