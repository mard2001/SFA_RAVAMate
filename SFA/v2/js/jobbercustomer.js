var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("username");


getcompname_dynamic("Jobber Customer", "titleHeading");
// getcompname();
function getcompname(){
    $.ajax ({
        url: "/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {"type":"GET_COMPANYNAME", "CONN":con_info},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Jobber Customer');
        }
    });
} 


// customerData();
customerDataTable();

var sourceData;
function customerData(){
    $.ajax ({
        url: "/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {"type":"JOBBER_MAINTENANCE_CUST_DATA", "CONN":con_info},
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(r){ 
            sourceData = r;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Error in fetching jobber customer:\n' + XMLHttpRequest.responseText);
        }
    });
}   

function customerDataTable(){
    var tableData =  $('table.customerList').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "data": sourceData,
        "scrollX": true,
        "ordering": false,
        "columns": [
            { "data": "salesmanAssign", title:"Salesman"},
            { "data": "CustomerName", title:"Customer Name"},
            { "data": "Contact", title:"Contact Person"},
            { "data": "SoldToAddr1", title:"Address" },
            { "data": "Telephone", title:"Contact #" },
            { "data": "isLockOn", title:"isLock On" },
            { "data": "CustType", title:"Cust Type"}
        ],
        "language": {
            "emptyTable": "No available records as of now."
        },
        "aaSorting": [[ 0, "desc" ]],
        rowCallback: function(row, data, index){
        }
    });

    $('table.customerList tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        exec_savetojobber(row.data());
    });

    function exec_savetojobber(r){
        $('#mdCodeH').val(r.Salesperson);
        $('#custCodeH').val(r.Customer);
        $('#customerH').val(r.Name);
        $('#contactnumH').val(r.Telephone);
        $('#contactPersonH').val(r.Contact);
        $('#addressH').val(r.SoldToAddr1);
        $('#isLockH').val(r.isLockOn);
        $('#custTypeH').val(r.CustType);
        $('#latH').val(r.Latitude);
        $('#longH').val(r.Longitude);
        $('#isLockText').html(r.isLockOn);
        //$('#isLockText').html(islockOnverifyer(r.isLockOn));
        $('#tojobbermodal').modal('show');
    }
}

function islockOnverifyer(r){    
    if(r == 0){
        return '<strong style="color: red;">NO</strong>';
    }
    return '<strong style="color: #5ee663;">YES</strong>';
}

function exec_insertCustomer(){
    var r = confirm('Are you sure you want to add this customer as jobber?');
    if(r){
        $('#addJobberBtn').html('<i class="fa fa-spinner fa-spin"></i> adding please wait.. ');
        $( "#addJobberBtn").prop( "disabled", true );
        var custCode = $('#custCodeH').val();
        var custName = $('#customerH').val();
        var contCell = $('#contactnumH').val();
        var contPerson = $('#contactPersonH').val();
        var address = $('#addressH').val();
        var lat = checkLatLngifzero($('#latH').val());
        var long = checkLatLngifzero($('#longH').val());
        var isLockOn = $('#isLockH').val();
        var custType = $('#custTypeH').val();

        $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {
                "type":"EXEC_INSERT_JOBBER_CUSTOMER", 
                "CONN":con_info,
                "custCode":custCode,
                "custName": custName,
                "contCell": contCell,
                "contPerson": contPerson,
                "address":address,
                "lat":lat,
                "long":long,
                "isLockOn":isLockOn,
                "custType":custType
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            async: false,       
            success: function(r){ 
                if(r != 'jobready'){
                    alert('Customer succesfully added to jobber list!');
                }else{
                    alert('UNABLE TO INSERT: Customer is already in the jobber list!');
                }
                    $( "#addJobberBtn").prop( "disabled", false );
                    $('#addJobberBtn').html('Add');
               
            }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('ERROR JOBBER INSERT: ' + JSON.stringify(XMLHttpRequest.responseText));
                $( "#addJobberBtn").prop( "disabled", false );
                $('#addJobberBtn').html('Add');
            }
        });
    }
}

function checkLatLngifzero(coor){
    var data = 0.0;
    if(coor < 0 || coor == '.000000'){
        return data;
    }
    return coor;
}

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
