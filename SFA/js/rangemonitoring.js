var user = localStorage.getItem("adminUserName");
      var usertype = localStorage.getItem("usertype");

    //   var s = localStorage.getItem("srvr");
    //   var u = localStorage.getItem("usrnm");
    //   var p = localStorage.getItem("psswrd");
    //   var d = localStorage.getItem("dtbse");
    //   var con_info = [s, p, u, d];

      determineUserType(usertype); 
      
      $('#reportrange1').click(function(){
        $('#SyncInventoryModal').modal('show');
      });

      

      var tableData;
      datatableApp();

    loadSalesman();
    function loadSalesman(){
     $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {"type":"dsr_salesmanLoad", "CONN":con_info},
          dataType: "json",
          crossDomain: true,
          cache: false,          
          async: false,  
            success: function(data){ 
              for(var x = 0; x<data.length; x++){
                  $('#salesmanList').append('<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>');      
               }

               $('#salesmanList').multiselect({
                  numberDisplayed: 1,
                  enableCaseInsensitiveFiltering: true,
                  includeSelectAllOption: true,
                  selectAllNumber: true,
                  buttonWidth: '300px',
                  maxHeight: 300
               });
             }
        });
    }


      getcompname();
      function getcompname(){
      $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {"type":"GET_COMPANYNAME", "CONN":con_info},
          dataType: "json",
          crossDomain: true,
          cache: false,       
          async: false,     
            success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' / Range Monitoring v.2.0.0');
            }
        });
      } 
      
      var sourceDat;
      $('.loading-table').hide();
      function stockRequestSourceData(){

      var mdCode = $('#salesmanList').val();
      $('#stockRequest_TAB').hide();
      $('.loading-table').show();
       var dialog = bootbox.dialog({
              message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
              backdrop: true
            });
        var botboxMsg = '';
         $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {
                        "type":"GET_RANGE_MONITORING",
                        "mdCode":mdCode,
                        "CONN":con_info
                    },
              dataType: "json",
              crossDomain: true,
              cache: false,  
              async: false,          
              success: function(r){ 
                if(r.lenght != 0){ 
                  tableData.clear().rows.add(r).draw();
                  $('#stockRequest_TAB').show();
                  $('.loading-table').hide();
                }else{
                  alert('NO DATA FOUND IN YOUR SELECTED SALESMAN: ' + mdCode);
                }

                dialog.modal('hide');
               },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
              botboxMsg = '<b class="text-danger">Ops! Something went wrong!</b><br/>' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!';
              dialog.init(function(){
                    setTimeout(function(){
                      dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                  }, 1000);
              });
             }
            }).done(function () {
                    dialog.init(function(){
                          setTimeout(function(){
                            dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                        }, 1000);
                  });
            });
      }

      //datePicker();
      var startPickDate, endPickDate;
      function datePicker(){
       var start = moment().subtract(29, 'days');
        var end = moment();

        $('#reportrange1').daterangepicker({
            "alwaysShowCalendars": true,
            "startDate": start,
            "endDate": end,
            "maxDate": moment(),
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
            $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            startPickDate = start.format('YYYY-MM-DD');
            endPickDate = end.format('YYYY-MM-DD')
          });

        $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
          $('#stockRequest_TAB').hide();
          var start = picker.startDate.format('YYYY-MM-DD');
          var end = picker.endDate.format('YYYY-MM-DD');
          stockRequestSourceData(start, end);
          tableData.clear().rows.add(sourceDat).draw();
        });
      }
      function datatableApp(){
           tableData = $('#stockRequest_TAB').DataTable({
              "dom": 'Bfrtip',
              "responsive": true,
              "data": sourceDat,
              "scrollX": true,
              columns: [
                  { data: "mdCode" },
                  { data: "Salesperson" },
                  { data: "Customer" },
                  { data: "custName" },
                  { data: "Range_Target" },
                  { data: "AltStockCodeDesc" },
                  { data: "DropSize" },
                  { data: "PurchaseQty" },
                  { data: "isHit" },
                  { data: "BalanceQty(pc)"}
                ],
                buttons: [
                  {
                      extend: 'collection',
                      text: 'Export',
                      autoClose: true,
                      buttons: [
                      'print', 'csv', 'excel'
                      ]
                  }
              ],
            columnDefs: [
    		// 			{
    		// 				targets: 12,
    		// 				className: 'dt-body-left',
            //     render: $.fn.dataTable.render.ellipsis(20)
            //   },
            //   {
    		// 				targets: 13,
    		// 				className: 'dt-body-right'
    		// 			}
  				  ],rowCallback: function(row, data, index){
                // var stat = data.Status.toString().toUpperCase();
                // var salesFormat = data.Sales.toString();
                //   if(stat == 'VALID'){
                //     $(row).find('td:eq(0)').css({'color': 'green', 'font-size':'10px;', 'letter-spacing': '0.5em'});
                //     $(row).find('td:eq(0)').html('&#10003; VALID');
                //   }else{
                //     $(row).find('td:eq(0)').css({'color': 'red', 'font-size':'10px;', 'letter-spacing': '0.5em', 'text-decoration':'line-through'});
                //   }
                //   $(row).find('td:eq(13)').text(Number(parseFloat(salesFormat).toFixed(2)).toLocaleString());
            }
            
        });

      $('#stockRequest_TAB tbody').on('click', 'tr', function () {
            // var tr = $(this).closest('tr');
            // var row = tableData.row(tr);
            // viewDetails(row.data());
      });

      function viewDetails(r){
        $('#transactionDateH').html(r.deliveryDate);
        //$('#salesmanH').html(r.Salesman);
        //$('#transactionIDH').html(r.transactionID);
        $('#customerH').html(r.CustomerID +' '+ r.Customer);
        $('#rangeH').html(r.SKU);
        $('#amountH').html(Number(parseFloat(r.Sales).toFixed(2)).toLocaleString());
        $('#timepentH').html(r.upTime);
        $('#remarksH').html(r.Notation);
        $('#addressH').html(r.Address);
       // $('#custPersonH').html(r.ContactPerson);

       
        $('#salesmanCode').val(r.salesmanCode);
        $('#salesman').val(r.Salesman);
        $('#refNo').val(r.DocumentNo);
        $('#transaction').val(r.transactionID);
        $('#deldate').val(r.deliveryDate);
        $('#custCode').val(r.CustomerID);
        $('#custName').val(r.Customer);
        $('#contactPerson').val(r.ContactPerson);
        $('#sku').val(r.SKU);
        $('#amount').val(Number(parseFloat(r.Sales).toFixed(2)).toLocaleString());
        $('#address').val(r.Address);

        
          $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {"type":"salesReport_details", "transactionID":r.transactionID, "CONN":con_info},
              dataType: "json",
              crossDomain: true,
              cache: false,  
              async: false,          
              success: function(r){
                var cont = '';
                $('#refnoH').html(r[0].refno);
                for(var x = 0; x < r.length; x++){
                  cont += '<tr>'+
                            '<td>'+r[x].stockCode+'</td>'+
                            '<td style="text-align: left !important;">'+r[x].description+'</td>'+
                            '<td style="text-align: center !important;">'+r[x].quantity+'</td>'+
                            '<td style="text-align: right !important;">'+r[x].amount+'</td>'+
                          '</tr>';
                }
                $('#salesDetailsBody').html(cont);
                $('#salesDmodal').modal('show');
              }
          });
      }
    }


    function execprintDSS(){
      if(dssdate == 'undefined' || dssdate == null){
        alert('Please select a date.');
      }else{
        localStorage.setItem('DSSdateSelected', dssdate);
        window.open('https://mybuddy-sfa.com/SFA/print-dashboard-dailysales.html', '_blank');
      }  
    }

       (function($) {
          $.fn.clickToggle = function(func1, func2) {
              var funcs = [func1, func2];
              this.data('toggleclicked', 0);
              this.click(function() {
                  var data = $(this).data();
                  var tc = data.toggleclicked;
                  $.proxy(funcs[tc], this)();
                  data.toggleclicked = (tc + 1) % 2;
              });
              return this;
          };
         }(jQuery));

       
          $("#navBtn").clickToggle(function() {   
            openNav();
          }, function() {
              closeNav();
          });

          $(window).bind("load", function () {
              $('#work-in-progress').fadeOut();
          });
        
          function imgError2(image) {
            image.onerror = "";
            image.src = "../img/salesmanPic.jpg";
            return true;
          }  

          function openNav() {
              document.getElementById("mySidenav").style.width = "270px";
              document.getElementById("main").style.marginLeft = "270px";
          }

          function closeNav() {
              document.getElementById("mySidenav").style.width = "0";
              document.getElementById("main").style.marginLeft= "0";
          }