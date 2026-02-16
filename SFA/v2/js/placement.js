var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";
var API_ENDPOINT2 = "/BUDDYGBLAPI/MTDAPI/applicationCharlie.php";

VirtualSelect.init({
    ele: '#n_itemnumber',
});

VirtualSelect.init({
    ele: '#upt_itemnumber',
});

determineUserType(usertype); 

// getcompname();
getcompname_dynamic("Placement Maintenance", "titleHeading");

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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Placement Maintenance');
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
            type: "GET_PLACEMENT",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        async: false,
        success: function(r){ 
            sourceDat = r;
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
            { data: "TYPE", title:"Type" },
            { data: "CUST_CLASS", title:"Customer Class" },
            { data: "item_number", title:"Item Number" },
            { data: "ITEMDESCRIPTION", title:"Item Description" },
            { data: "PLACEMENT", title:"Placement" },
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
                filename: 'Placement Maintenance - '+ moment().format("DD-MMM-YYYY"),
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
                targets: [5],
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
    $('#addplacementBtn').on('click', function() {
        $('#placementModal').modal('show');
    });


    $('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
    });

    function viewDetails(r){
        console.log(r.item_number);
            
        const vs = document.querySelector('#upt_itemnumber').virtualSelect;
        // For single-select:
        vs.setValue(r.item_number);

        $('#upt_typeselect').val(r.TYPE);
        $('#upt_custclass').val(r.CUST_CLASS);
        $('#upt_placement').val(r.PLACEMENT);

        $('#cIDHolder').val(r.cID);

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



function insert_cust_tieirng(){

    var custtype = $('#n_typeselect').val();
    var custclass = $('#n_custclass').val();
    var itemnumber = $('#n_itemnumber').val();
    var placement = $('#n_placement').val();

    var upt_itemdesc = $('#n_descriptionholder').val();
   
    var f = confirm('Are you sure you want to add this product placement?');
    if(f){
        $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                type: "INST_PLACEMENT",
                custtype:custtype,
                custclass:custclass,
                itemnumber:itemnumber,
                itemdesc:upt_itemdesc,
                placement:placement,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
            },  
            dataType: "JSON",
            crossDomain: true,
            cache: false,  
            async: false,
            success: function(r){ 
             if(r){
                alert('Successfully Updated Product Placement');
             }
             stockRequestSourceData();
             $('#placementModal').modal('hide');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Something went wrong!\n' + XMLHttpRequest.responseText);
            }
        });
    }
    
}



function update_cust_tieirng(){

    var custtype = $('#upt_typeselect').val();
    var custclass = $('#upt_custclass').val();
    var itemnumber = $('#upt_itemnumber').val();
    var placement = $('#upt_placement').val();

    var upt_itemdesc = $('#upt_itemdesc').val();

    var cID = $('#cIDHolder').val();

   
    var f = confirm('Are you sure you want to udpate this product placement?');
    if(f){
        $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                type: "UPDATE_PLACEMENT",
                custtype:custtype,
                custclass:custclass,
                itemnumber:itemnumber,
                itemdesc:upt_itemdesc,
                placement:placement,
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
                alert('Successfully Updated Product Placement');
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


function delete_cust_tieirng(){

    var cID = $('#cIDHolder').val();
    
    var f = confirm('Are you sure you want to remove this product placement?');
    if(f){
        $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                type: "DELETE_PLACEMENT",
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
                alert('Successfully Removed Product Placement');
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


get_select_data_nnd();
function get_select_data_nnd(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            type: "GET_PLACEMENT_PARAMS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        async: false,
        success: function(r){ 
            var cont1 = `<option selected disabled hidden value="">Choose here..</option>`,
                cont2 = `<option selected disabled hidden value="">Choose here..</option>`,
                cont3 = `<option selected disabled hidden value="">Choose here..</option>`,
                cont4 = `<option selected disabled hidden value="">Choose here..</option>`;

            for(var x = 0; x < r.SOURCETYPE.length; x++){
                console.log(r.SOURCETYPE[x].TYPE);
                cont1 += `<option value=`+r.SOURCETYPE[x].TYPE+`>`+r.SOURCETYPE[x].TYPE+`</option>`;
            }

            for(var x = 0; x < r.CUSTTYPE.length; x++){
                cont2 += `<option value=`+r.CUSTTYPE[x].custType+`>`+r.CUSTTYPE[x].custType+`</option>`;
            }

            for(var x = 0; x < r.ITEMSELECT.length; x++){
                cont3 += `<option value=`+r.ITEMSELECT[x].StockCode+`>`+r.ITEMSELECT[x].StockCode+` - `+r.ITEMSELECT[x].Description+`</option>`;
            }

            for(var x = 0; x < r.PLACEMENTDATA.length; x++){
                cont4 += `<option value=`+r.PLACEMENTDATA[x].PLACEMENT+`>`+r.PLACEMENTDATA[x].PLACEMENT+`</option>`;
            }


            $('#n_typeselect').html(cont1);
            $('#n_custclass').html(cont2);
            $('#n_placement').html(cont4);


            $('#upt_typeselect').html(cont1);
            $('#upt_custclass').html(cont2);
            $('#upt_placement').html(cont4);

            var myOptions = [];
            for (var x = 0; x < r.ITEMSELECT.length; x++) {
                var selectdat = r.ITEMSELECT[x].StockCode+` - `+r.ITEMSELECT[x].Description;
                var obj = { label: selectdat, value: r.ITEMSELECT[x].StockCode };
                myOptions.push(obj);
            }

            document.querySelector('#n_itemnumber').destroy();
            VirtualSelect.init({
                ele: '#n_itemnumber',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select product'
            });


            document.querySelector('#upt_itemnumber').destroy();
            VirtualSelect.init({
                ele: '#upt_itemnumber',
                options: myOptions,
                search: true,
                maxWidth: '100%'
            });
            
           
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Something went wrong!\n' + XMLHttpRequest.responseText);
        }
    });
}


$('#n_itemnumber').on('change', function() {
    var val = this.value;

    const opts = this.virtualSelect.getSelectedOptions();
    const arr = Array.isArray(opts) ? opts : [opts];
    const labels = arr.map(o => o.label);
    // alert(labels);

    $('#n_descriptionholder').val(labels);
});



$('#upt_itemnumber').on('change', function() {
    var val = this.value;

    const opts = this.virtualSelect.getSelectedOptions();
    const arr = Array.isArray(opts) ? opts : [opts];
    const labels = arr.map(o => o.label);
    // alert(labels);

    $('#upt_itemdesc').val(labels);
});




