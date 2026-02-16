
var sourceDat4;
var tableData4;
var GBLSELECTEDITEMS;

function view_dynamic_route_data(){
    
    var cID = $('#cancelRouteIDRefHolder').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_DYNAMIC_ROUTE_DETAILS", "cID":cID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){
            sourceDat4 = r;
            tableData4.clear().rows.add(sourceDat4).draw();
        },
    });
}

function datatableApp4(){
    tableData4 = $('table.transactionDetails').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTablePagination"p>>',
        responsive: false,
        data: sourceDat4,
        scrollX: true,
        ordering: true,
        order: [[ 2, 'desc' ]],
        language: {
            select: {
                rows: ""
            }
        },
        select: true,
        select: {
            style: 'multi+shift',
            selector: 'td.select-checkbox'
        },
        columns: [
            {
                data: null,
                className: 'select-checkbox',
                orderable: false,
                defaultContent: '',
                title: '',
            },
            { data: "deliveryDate", title: "Booking Date" },
            { data: "transactionID", title: "Transaction ID" },
            { data: "MUNICIPALITY", title: "Municipality"},
            { data: "BARANGAY", title: "Barangay"},
            { data: "SALESMAN", title: "Salesman"},
            { data: "DAYS_LAPSE", title: "Days Lapse" },
            { data: "refno", title: "Reference" },
            { data: "CUSTOMER", title: "Customer" },
            { data: "totalAmountFormatted", title: "Amount" }
        ],
          columnDefs: [
            {
              targets: [9],
              className: 'dt-body-right',
              // render: $.fn.dataTable.render.ellipsis(20)
            },
        ],
        buttons: [
            {
                text: 'Remove Items',
                className: 'approveBtn_stocReq customDTTables dt-button buttons-collection removeTransactionInGroup',
                action: function(e, dt, node, config){

                    $('#maincreationdrl').hide();
                    $('#updatedrl').show();
                    var row = tableData4.rows('.selected').data();
                        if(row.length == 0){
                            Swal.fire({
                                text: "No Data Selected.",
                                icon: "info"
                            });
                        }else{
                            var c = confirm('Are you sure you want to remove these transaction?');
                            if(c){
                                // var dialog = bootbox.dialog({
                                //     message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> tagging unploaded sales please wait...</p>',
                                //     backdrop: true,
                                //     //closeButton: false
                                //     });

                                for(var x = 0; x < row.length; x++){
                                exec_remove_details(row[x].cID);
                                }
                                
                                Swal.fire({
                                    text: 'Transaction details successfully removed.',
                                    icon: "success"
                                });
                                location.reload();
                            }

                            
                        }
                        
                }
            }
        ],
        "language": {
            "emptyTable": "No available records as of now."
        },
        "aaSorting": [[ 0, "desc" ]],
    });

    $('.customDTTables').removeClass('btn btn-secondary');

}

function exec_remove_details(cID){
    
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"REMOVE_DYNAMIC_ROUTE_DETAILS_D", "cID":cID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
       
    });
}