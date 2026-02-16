var user = localStorage.getItem("adminUserName");
      var usertype = localStorage.getItem("usertype");

    //   var s = localStorage.getItem("srvr");
    //   var u = localStorage.getItem("usrnm");
    //   var p = localStorage.getItem("psswrd");
    //   var d = localStorage.getItem("dtbse");
    //   var con_info = [s, p, u, d];

      determineUserType(usertype); 
      
      getcompname();
      function getcompname(){
      $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {"type":"GET_COMPANYNAME", "CONN":con_info},
          dataType: "json",
          crossDomain: true,
          cache: false,            
            success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' / Sync Report');
            }
        });
      } 
      
      var sourceDat;
      $('.loading-table').hide();
      function stockRequestSourceData(start, end){
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
                        "type":"syncReportData",
                        "startDate":start,
                        "endDate":end,
                        "CONN":con_info
                    },
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
                  alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
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

      datePicker();
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
      datatableApp();
      var tableData;
      function datatableApp(){
           tableData = $('#stockRequest_TAB').DataTable({
              "dom": 'Bfrtip',
              "responsive": true,
              "data": sourceDat,
              "scrollX": true,
              columns: [
                  { data: "mdCode" },
                  { data: "Salesperson" },
                  { data: "datesync" }
                ]
            ,rowCallback: function(row, data, index){
                // var stat = data.Status.toString().toUpperCase();
                // var salesFormat = data.Sales.toString();
                //   if(stat == 'VALID'){
                //     $(row).find('td:eq(0)').css({'color': 'green', 'font-size':'10px;', 'letter-spacing': '0.5em'});
                //     $(row).find('td:eq(0)').html('&#10003; VALID');
                //   }else{
                //     $(row).find('td:eq(0)').css({'color': 'red', 'font-size':'10px;', 'letter-spacing': '0.5em', 'text-decoration':'line-through'});
                //   }
                //   $(row).find('td:eq(13)').text(Number(parseFloat(salesFormat).toFixed(2)).toLocaleString());
            },
            buttons: [ 'excel', 'print', 'copy' ]
        });

      $('#stockRequest_TAB tbody').on('click', 'tr', function () {
            var tr = $(this).closest('tr');
            var row = tableData.row(tr);
            viewDetails(row.data());
      });

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