var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";
var API_ENDPOINT2 = "/BUDDYGBLAPI/MTDAPI/applicationCharlie.php";

var GBLCUSTTYPE = [];
var GBLCHANNEL = [];
var GBLLEVEL = [];

determineUserType(usertype); 

// getcompname();
getcompname_dynamic("Customer Channel Mapping", "titleHeading");

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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Customer Channel Mapping');
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
            type: "GET_CUSTCHANNEL_MAPING",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        async: false,
        success: function(r){ 
            sourceDat = r;
            $('#stockRequest_TAB').show();
            tableData.clear().rows.add(sourceDat).draw();

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
            { data: "Channel", title:"Channel" },
            { data: "Level", title:"Level" },
            { data: "lastUpdated", title:"lastUpdated" }
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

    $('#addBtn').on('click', function() {
       $('#addtiercust').modal('show');
    });


    $('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
    });

    function viewDetails(r){

        $('#custtype').val(r.cust_type);
        $('#custdescription').val(r.cust_type_desc);
        // $('#tering_val').val(r.tiering_val);
        // $('#custtype_val').val(r.cust_type);

        $('#mappinglevel').val(r.Channel);
        $('#tering_val').val(r.Level);
        $('#lastupdated').html(r.lastUpdated);
        $('#mappingID').val(r.cID);
        

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

   
    var custtype = $('#custtype').val();
    var custdesc = $('#custdescription').val();

    var channel = $('#mappinglevel').val();
    var tierlevel = $('#tering_val').val();
    var cID = $('#mappingID').val();

    if($.trim(custtype) == '' ||
       $.trim(custdesc) == '' ||
       $.trim(channel) == '' ||
       $.trim(tierlevel) == ''){
        alert('All fields are required. Please try again.');
    }else{
        var f = confirm('Are you sure you want to udpate this customer?');
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {
                    type: "UPDATE_CUST_TIER_MAPPING",
                    custtype:custtype,
                    custdesc:custdesc,
                    channel:channel,
                    tierlevel:tierlevel,
                    cID:cID,
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
}

function get_select_Tags(){
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



function add_cust_tieirng(){
    var custtype = $('#n_custtype').val();
    var custdesc = $('#n_custdescription').val();

    var channel = $('#n_mappinglevel').val();
    var tierlevel = $('#n_tering_val').val();

    if($.trim(custtype) == '' ||
       $.trim(custdesc) == '' ||
       $.trim(channel) == '' ||
       $.trim(tierlevel) == ''){
        alert('All fields are required. Please try again.');
    }else{

        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {
                    type: "INSERT_CUST_TIER_MAPPING",
                    custtype:custtype,
                    custdesc:custdesc,
                    channel:channel,
                    tierlevel:tierlevel,
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE,
                },  
                dataType: "JSON",
                crossDomain: true,
                cache: false,  
                async: false,
                success: function(r){ 
                    if(r){
                        alert('Successfully Inserted Customer Channel Mapping');
                    }
                    stockRequestSourceData();
                    $('#addtiercust').modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert('Something went wrong!\n' + XMLHttpRequest.responseText);
                }
            });

       
    }
}

function remove_Custtagging(){
    
    var cID = $('#mappingID').val();

    var f = confirm('Are you sure you want to remove this data?');
    if(f){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                type: "DELETE_CUST_TIER_MAPPING",
                cID:cID,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
            },  
            dataType: "JSON",
            crossDomain: true,
            cache: false,  
            async: false,
            success: function(r){ 
                if(r){
                    alert('Successfully Remove Customer Channel Mapping');
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
loaditelesence();
function loaditelesence(){
    var r = sourceDat;

    for(var x = 0; x < r.length; x++){
        if(r[x].cust_type){

            GBLCUSTTYPE.push(r[x].cust_type);
        }

        if(r[x].Channel){
            GBLCHANNEL.push(r[x].Channel);
        }

        if(r[x].Level){
            GBLLEVEL.push(r[x].Level);
        }
    }

    var uniqueArr_cust = $.grep(GBLCUSTTYPE, function(el, index) {
        return index === $.inArray(el, GBLCUSTTYPE);
    });

    var uniqueArr_level = $.grep(GBLCHANNEL, function(el, index) {
        return index === $.inArray(el, GBLCHANNEL);
    });

    var uniqueArr_tiering = $.grep(GBLLEVEL, function(el, index) {
        return index === $.inArray(el, GBLLEVEL);
    });

    $("#n_custtype").autocomplete({
        source: uniqueArr_cust,
        minLength: 1,   // start suggesting after 1 character
        delay: 100      // delay in ms before showing suggestions
    });


    $("#n_mappinglevel").autocomplete({
        source: uniqueArr_level,
        minLength: 1,   // start suggesting after 1 character
        delay: 100      // delay in ms before showing suggestions
    });

    $("#n_tering_val").autocomplete({
        source: uniqueArr_tiering,
        minLength: 1,   // start suggesting after 1 character
        delay: 100      // delay in ms before showing suggestions
    });
}


