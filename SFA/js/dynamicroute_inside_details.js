
var sourceDat4;
function view_dynamic_route_data(){
    
    var cID = $('#cancelRouteIDRefHolder').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {"type":"GET_DYNAMIC_ROUTE_DETAILS", "cID":cID, "CONN":con_info},
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



datatableApp4();

var tableData4;
var GBLSELECTEDITEMS;
function datatableApp4(){
   tableData4 = $('table.transactionDetails').DataTable({
        "dom": 'Bfrtip',
        "responsive": true,
        "data": sourceDat4,
        "scrollX": true,
        "ordering": true,
        order: [[ 2, 'desc' ]],
        language: {
                  select: {
                      rows: ""
                  }
              },
              select: true,
              select: {
                  style: 'multi',
                  //selector: 'td:first-child'
              },
        columns: [
              {   
              'data': null,
              'targets': 0,
              'checkboxes': {
                  'selectRow': true
                  }
              },
            { data: "deliveryDate" },
            { data: "MUNICIPALITY"},
            { data: "BARANGAY"},
            { data: "SALESMAN"},
            { data: "DAYS_LAPSE" },
            { data: "refno" },
            { data: "CUSTOMER" },
            { data: "totalAmountFormatted" }
          ],
          columnDefs: [
            {
              targets: [8],
              className: 'dt-body-right',
              // render: $.fn.dataTable.render.ellipsis(20)
            },
          ],
          buttons: [
              {
                  text: 'Remove Items',
                  className: 'approveBtn_stocReq',
                  action: function(e, dt, node, config){

                      $('#maincreationdrl').hide();
                      $('#updatedrl').show();
                      var row = tableData4.rows('.selected').data();
                          if(row.length == 0){
                              alert('NO DATA SELECTED!');
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
                                  
                                  alert('Transaction details successfully removed.');
                                  location.reload();
                              }

                              
                          }
                          
                  }
              }
           
          ],
          "language": {
                "emptyTable": "No available records as of now."
          },
          "drawCallback": function( settings ) {
            $('[data-toggle="tooltip1"]').tooltip();
            $('[data-toggle="tooltip2"]').tooltip();
          },
          "aaSorting": [[ 0, "desc" ]],
    });

}



function exec_remove_details(cID){
    
    $.ajax ({
        url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {"type":"REMOVE_DYNAMIC_ROUTE_DETAILS_D", "cID":cID, "CONN":con_info},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
       
    });
}