var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";
var API_ENDPOINT2 = "/BUDDYGBLAPI/MTDAPI/applicationCharlie.php";

determineUserType(usertype); 

// getcompname();
getcompname_dynamic("Customer Tiering", "titleHeading");

stockRequestSourceData();
datatableApp();

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Customer Tiering');
        }
    });
} 

$('.loading-table').hide();
function stockRequestSourceData(){
   
    // $('#filterReport').modal('hide');
    // $('#stockRequest_TAB').hide();
    // var dialog = bootbox.dialog({
    //     message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
    //     backdrop: true
    // });
    var botboxMsg = '';
    $.ajax ({
       url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            type: "GET_CUSTOMER_TIERING",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        async: false,
        success: function(r){ 
            console.log(r);
            sourceDat = r;
            $('#stockRequest_TAB').show();
            tableData.clear().rows.add(sourceDat).draw();
            // dialog.modal('hide');
        },//success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // botboxMsg = '<b class="text-danger">Ops! Something went wrong!</b><br/>' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!';
            // dialog.init(function(){
            //     setTimeout(function(){
            //         dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
            //     }, 1000);
            // });
        }
    }).done(function () {
        // setTimeout(() => {
        //     dialog.modal('hide');
        // }, 1000);
    });
}






function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "ordering": true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "cust_type", title:"Type" },
            { data: "cust_type_desc", title:"Description" },
            { data: "tiering", title:"Tiering" },
            { data: "lastUpdated", title:"Last Updated" }
        ],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: '',
                filename: 'Customer Tiering - '+ moment().format("DD-MMM-YYYY"),
                customize: function ( xlsx ) {
                },
                action: function(e, dt, button, config) {
                    var f = confirm('This would generate all salesman records based on the date you filter.\nPress OK to continue.');
                    if(f){
                        $('.loading').fadeIn();
                        var that = this;
                        setTimeout(function () {
                            $.fn.dataTable.ext.buttons.excelHtml5.action.call(that,e, dt, button, config);
                            $('.loading').fadeOut();
                        },500);
                    }
                },
            },
        ],
        columnDefs: [
            {
                targets: [2, 3],
                className: 'dt-body-center'
            },
        ],
    });
    $('#excelBtn').on('click', function() {
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        $('.buttons-print').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        $('.buttons-copy').trigger('click');
    });


    $('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
    });

    function viewDetails(r){

        $('#custtype').html(r.cust_type);
        $('#custdescription').html(r.cust_type_desc);
        $('#tering_val').val(r.tiering_val);
        $('#custtype_val').val(r.cust_type);

        $('#custtierdetailsModal').modal('show');
    }

}

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});
    
$('#printBtn').on('click', function() {
    console.log('Custom button clicked');
    if ( ! tableData.data().any() ) {
        alert( 'No data to print!' );
    }else{
        // loadSalesman(startPickDate, endPickDate);
        $('#salesmanListModal').modal('show');
    }
});

$("#btn-print").click(function () {
    var salesman = $("#salesmanList option:selected").text();
    var selectedSalesman = $("#salesmanList").val();
    var date = $('#jobberDate').val();
    var datePrinted = new Date().toLocaleString();

    if(selectedSalesman == ''){
        alert('Please select date first!');
    }else{
        //printData();
        $('#printThisTable').printThis({
            importCSS: true,
            header: "<div>"+salesman+"<small class='pull-right'> Date Created: "+datePrinted+"</small></div>",
            pageTitle: "JOBBER FULL OUT FORM",
            printContainer: true,
            copyTagClasses: true
        });
    }
        
});

function printData(){
    window.print();
}


function update_cust_tieirng(){

    var tiering = $('#tering_val').val();
    var custtype = $('#custtype_val').val();

   

    var f = confirm('Are you sure you want to udpate this customer?');
    if(f){
        $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                type: "UPDATE_CUST_TIERING",
                tiering:tiering,
                custtype:custtype,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
            },  
            dataType: "JSON",
            crossDomain: true,
            cache: false,  
            async: false,
            success: function(r){ 
             if(r){
                alert('Successfully Updated Customer');
             }
             stockRequestSourceData();
             $('#custtierdetailsModal').modal('hide');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Something went wrong!\n' + XMLHttpRequest.responseText);
            }
        });
    }
    
}

