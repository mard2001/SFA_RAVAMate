
var startPickDate_r, endPickDate_r;
var tableData3;
var GBLSELECTEDITEMS;

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

function datatableApp3(){
  tableData3 = $('table.uptDynamicTBL').DataTable({
    dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"i<"dataTableBottomPagination"p>>',
    responsive: false,
    data: sourceDat2,
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
      style: 'multi+shift', // or 'multi', 'single'
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
        className: 'text-end',
        // render: $.fn.dataTable.render.ellipsis(20)
      },
    ],
    buttons: [
      {
        text: '<i class="fas fa-calendar-alt"></i> Filter Date',
        className: 'filterdate_upt_dynamicroute customDTTables dt-button buttons-collection',
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
        className: 'approveBtn_stocReq customDTTables dt-button buttons-collection',
        action: function(e, dt, node, config){
          GBLSELECTEDITEMS = [];

          $('#maincreationdrl').hide();
          $('#updatedrl').show();
          var row = tableData3.rows('.selected').data();
          if(row.length == 0){
            Swal.fire({
              text: "No Data Selected.",
              icon: "info"
            });
          }else{
            var c = confirm('Are you sure you want to update these transaction?');
            if(c){
              var totaltransaction = row.length;
              var totalAmount = 0.0;
              GBLSELECTEDITEMS = row;

              for(var x = 0; x < row.length; x++){
                totalAmount += parseFloat(row[x].totalAmount);
              }
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
    "aaSorting": [[ 0, "desc" ]],
  });
  $('.customDTTables').removeClass('btn btn-secondary');
}

function cancelroutelist(){
  var cID = $('#cancelRouteIDRefHolder').val();
  Swal.fire({
        text: "Are you sure you want to remove this transaction?",
        icon: "warning",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, Remove",
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
        $.ajax ({
          url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
          type: "POST",
          data: {
              "type":"EXEC_REMOVE_DYNAMIC_TRANS", 
              cID:cID,
              "userID": GBL_USERID,
              "distCode": GBL_DISTCODE,
              },
          dataType: "json",
          crossDomain: true,
          cache: false,           
          async: false,
          success: function(r){
            Swal.fire({
              text: "Transaction was successfully removed.",
              icon: "info"
            });
            setTimeout(() => {
              location.reload();
            }, 1500);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              html: "ERROR OCCUR: " + XMLHttpRequest.responseText,
              icon: "info"
            });
          }
        });
      }
    });
}