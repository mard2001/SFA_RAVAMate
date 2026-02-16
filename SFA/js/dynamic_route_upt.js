
var startPickDate_r, endPickDate_r;
function datepicker_adjustrouting(){
  var start = moment().subtract(0, 'days');
  var end = moment();
  $('.filterdate_upt_dynamicroute').daterangepicker({
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
       $('.filterdate_extruct span').html('<i class="fa fa-calendar"></i> ' +start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
       var d1 = moment(start);
       var d2 = moment(end);
       if1dayisSelected = d2.diff(d1);
       startPickDate = start.format('MMMM D, YYYY');
       endPickDate = end.format('MMMM D, YYYY');
    });

  $('.filterdate_upt_dynamicroute').on('apply.daterangepicker', function(ev, picker) {
    //$('#stockRequest_TAB').hide();
    startPickDate_e = picker.startDate.format('YYYY-MM-DD');
    endPickDate_e = picker.endDate.format('YYYY-MM-DD');

    $('.filterdate_upt_dynamicroute span').html('<i class="fa fa-calendar"></i> '  + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

    stockRequestSourceData2();
    tableData3.clear().rows.add(sourceDat2).draw();
  });
  


  
}


var tableData3;
var GBLSELECTEDITEMS;
function datatableApp3(){
   tableData3 = $('table.uptDynamicTBL').DataTable({
        "dom": 'Bfrtip',
        "responsive": true,
        "data": sourceDat2,
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
                text: '<i class="fas fa-calendar-alt"></i> Filter Date',
                className: 'filterdate_upt_dynamicroute',
                action: function(e, dt, node, config){
                  /* var row = tableData.rows('.selected').data();
                     if(row.length == 0){
                      console.log('empty selection');
                      alert('PLEASE SELECT A TRANSACTION TO UPDATED');
                     }else{
                       for(var x = 0; x < row.length; x++){
                           console.log(row[x].refNo +' '+ row[x].stockCode +' '+ row[x].mdCode);
                           updateStockReq(row[x].refNo, row[x].mdCode, row[x].stockCode);
                       }
                       stockRequestSourceData();
                       tableData.clear().rows.add(sourceDat).draw();
                     }*/
                }
              },
              {
                  text: 'Update Dynamic Route',
                  className: 'approveBtn_stocReq',
                  action: function(e, dt, node, config){
                      GBLSELECTEDITEMS = [];

                      $('#maincreationdrl').hide();
                      $('#updatedrl').show();
                      var row = tableData3.rows('.selected').data();
                          if(row.length == 0){
                              alert('NO DATA SELECTED!');
                          }else{
                              var c = confirm('Are you sure you want to update these transaction?');
                              if(c){
                                  // var dialog = bootbox.dialog({
                                  //     message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> tagging unploaded sales please wait...</p>',
                                  //     backdrop: true,
                                  //     //closeButton: false
                                  //     });
                                  var totaltransaction = row.length;
                                  var totalAmount = 0.0;
                                  GBLSELECTEDITEMS = row;

                                  for(var x = 0; x < row.length; x++){
                                      totalAmount += parseFloat(row[x].totalAmount);
                                  }
                                  
                                  // salesmanDataObject_datatables(startPickDate, endPickDate);
                                  // tableData.clear().rows.add(sourceData).draw();
                                  // dialog.modal('hide');
                                  // alert('Transaction successfull updated!');
                              
                              }

                              console.log(row[0]);
                              $('#totalTransactionHolder').val(totaltransaction);
                              $('#totalAmountHolderDisplay').val(totalAmount.toLocaleString());
                              $('#totalAmountHolder').val(totalAmount);

                              console.log(row[0].plateNo);

                              var dvr = $('#driverselect').val();

                              var r = GBLDRIVERLISTHOLDER;
                              for(var x = 0; x < r.length; x++){
                                    if(dvr == r[x].mdCode){
                                        $('#loadingCapHolder').val(r[x].loadingCap);
                                    }
                                }

                              $('#updateDyanamicRouteModal').modal('show');  
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


function cancelroutelist(){

  var cID = $('#cancelRouteIDRefHolder').val();
  var f = confirm('Are you sure you want to remove this transaction?');
  if(f){
    $.ajax ({
      url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {
              "type":"EXEC_REMOVE_DYNAMIC_TRANS", 
              cID:cID,
              "CONN":con_info,
              },
          dataType: "json",
          crossDomain: true,
          cache: false,           
          async: false,
          success: function(r){
            alert('Transaction was successfully removed.');
            location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              alert("ERROR OCCUR: " + XMLHttpRequest.responseText);
            }
          });
  }
}