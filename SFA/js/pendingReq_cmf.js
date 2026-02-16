var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");

    //   var s = localStorage.getItem("srvr");
    //   var u = localStorage.getItem("usrnm");
    //   var p = localStorage.getItem("psswrd");
    //   var d = localStorage.getItem("dtbse");
    //   var con_info = [s, p, u, d];

      determineUserType(usertype); 
      
      var startPickDate = moment().startOf('day').format('YYYY-MM-DD'), endPickDate = moment().endOf('month').format('YYYY-MM-DD');
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
              $('#titleHeading').html(r[0].company.toUpperCase() +' / Pending Request / v.1.9.1');

             
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                var s = '180.232.64.82,6001';
                var d = 'MondeSFA';
                var u = 'sfauser';
                var p = 'WtbmCU2A';

                var encryptedS =  CryptoJS.AES.encrypt(s,"/");
                var encryptedU =  CryptoJS.AES.encrypt(u,"/");
                var encryptedP =  CryptoJS.AES.encrypt(p,"/");
                var encryptedD =  CryptoJS.AES.encrypt(d,"/");

                localStorage.setItem("srvr", encryptedS);
                localStorage.setItem("usrnm", encryptedU);
                localStorage.setItem("psswrd", encryptedP);
                localStorage.setItem("dtbse", encryptedD);

                location.reload();
                
              
             }
        });
      } 
      
      var sourceDat;
      $('.loading-table').hide();
      function stockRequestSourceData(start, end){
      $('.stockRequest_TAB').hide();
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
                      "type":"GET_PENDING_REQ",
                      "start":start,
                      "end":end,
                      "appvid":localStorage.getItem('pndingrqAccID'),
                      "CONN":con_info
                    },
              dataType: "json",
              crossDomain: true,
              cache: false,  
              async: false,          
              success: function(r){ 
                if(r.lenght != 0){ 
                  sourceDat = r;
                  $('.stockRequest_TAB').show();
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

   
      function datePicker(){
       var start = moment().subtract(29, 'days');
        var end = moment();

        $('.datePickerDrow').daterangepicker({
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
            $('.datePickerDrow span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            startPickDate = start.format('YYYY-MM-DD');
            endPickDate = end.format('YYYY-MM-DD')
          });

        $('.datePickerDrow').on('apply.daterangepicker', function(ev, picker) {
          $('.stockRequest_TAB').hide();
          var start = picker.startDate.format('YYYY-MM-DD');
          var end = picker.endDate.format('YYYY-MM-DD');
          stockRequestSourceData(start, end);
          tableData.clear().rows.add(sourceDat).draw();
        });


        $('.filterdate_booking').daterangepicker({
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
          $('.filterdate_booking span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
          startPickDate = start.format('YYYY-MM-DD');
          endPickDate = end.format('YYYY-MM-DD')
        });

      $('.filterdate_booking').on('apply.daterangepicker', function(ev, picker) {
        $('.stockRequest_TAB').hide();
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        customerData(start, end);
        tableData_cmf.clear().rows.add(sourceData_cmf).draw();
      });



        
      }
      datatableApp();
      var tableData;
      function datatableApp(){
           tableData = $('table.stockRequest_TAB').DataTable({
              "dom": 'Bfrtip',
              "responsive": true,
              "data": sourceDat,
              "scrollX": true,
              columns: [
                  { data: "transType" },
                  { data: "transDate" },
                  { data: "mdCode" },
                  { data: "refNo"},
                  { data: "SKUCount" },
                  { data: "VolumeQty" },
                  { data: "Amount" },
                  { data: "ApprovalStatus" },
                  { data: "Remarks" },
                  { data: "ApproveDate" },
                //   { data: "lastUpdated" }
                ],
            // columnDefs: [
    		// 			{
    		// 				targets: 12,
    		// 				className: 'dt-body-left',
            //     render: $.fn.dataTable.render.ellipsis(20)
            //   },
            //   {
    		// 				targets: 13,
    		// 				className: 'dt-body-right'
    		// 			}
  			//],
            rowCallback: function(row, data, index){
                var stat = data.ApprovalStatus.toString().toUpperCase();
                // var salesFormat = data.Sales.toString();
                  if(stat == 'APPROVED'){
                    $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'green', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                  }else if(stat == 'DENIED'){
                    $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'red', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                  }else{
                    $(row).find('td:eq(7)').css({'text-align': 'center', 'color': 'white', 'background-color':'orange', 'font-size':'13px;', 'letter-spacing': '0.2em'});
                  }
            },
            buttons:  [
                        {
                        extend: 'collection',
                        text: '<i class="fa fa-file-archive-o"></i> Others',
                        autoClose: true,
                        buttons: [
                            'excel', 'csv'
                            ]
                        },
                        {
                            text: 'Filter Date',
                            className: 'datePickerDrow',
                            action: function ( e, dt, node, config ) {
                            // $('#soSelect').hide();
                            $('#suppSelect').val('').change();
                            $('#datestring').html('Pick a date');
                            // new bootstrap.Modal($('#createPLModal')).show();
                            }
                        },
                    ]
       
        });

      $('table.stockRequest_TAB tbody').on('click', 'tr', function () {
            var tr = $(this).closest('tr');
            var row = tableData.row(tr);
            viewDetails(row.data());
      });

      function viewDetails(r){
        $('#req_remarks').val('');
        $('#upt_transtype').html(r.transType);
        $('#upt_transdate').html(r.transDate);
        $('#upt_mdcode').html(r.mdCode);
        $('#upt_refno').html(r.refNo);
        $('#upt_sku').html(r.SKUCount);
        $('#upt_vol').html(r.VolumeQty);
        $('#upt_amt').html(r.Amount);
        $('#upt_status').html(statchecker(r.ApprovalStatus));
        $('#upt_remarks').html(r.Remarks);
        $('#cIDHolder').val(r.cID);
        $('#mdCodeHolder').val(r.mdCode);
        $('#appvNumHolder').val(r.ApproverContactNumber);
        $('#otpHolder').val(r.ApprovalCode);

        var checker = r.transactionDetails;
        var cont = ``;
        console.log();
        if(checker.length == 0){
          
           cont = `<tr style="color: red !important; text-align: center;">
              <td colspan="2">
                Unable to view SO details. You need to approve this transaction first.
              </td>
            </tr>`;
        }else{

         cont = `<tr>
          <td>
            Transaction ID: 
          </td>
          <td>`+r.transactionDetails[0].transactionID	+`</td>
        </tr>
        <tr>
          <td>
            Reference #: 
          </td>
          <td>`+r.transactionDetails[0].refno	+`</td>
        </tr>
        <tr>
          <td>
            Customer Code: 
          </td>
          <td>`+r.transactionDetails[0].custCode+` - `+r.custName+`</td>
        </tr>
        <tr>
          <td>
            Transaction Date: 
          </td>
          <td>`+r.transactionDetails[0].deliveryDate+`</td>
        </tr>
        <tr>
          <td>
            Amount: 
          </td>
          <td>`+r.transactionDetails[0].totalAmount	+`</td>
        </tr>
        <tr>
          <td>
            LongLat
          </td>
          <td>`+r.transactionDetails[0].longitude+` - `+r.transactionDetails[0].latitude+`</td>
        </tr>`;
        }
       
        $('#transacitondetails_data').html(cont);
        $('#pendingReqmodal').modal('show');
      }
    }

    function statchecker(stat){
      $('.resendBtn').show();
        if(stat == 'PENDING'){
            $('.btnactions').show();
            return '<span style="color:orange; font-weight: bold;">PENDING</span>';
        }else if(stat == 'DENIED'){
            $('.btnactions').hide();
            return '<span style="color:red; font-weight: bold;">DENIED</span>';
        }else if(stat == 'APPROVED'){
          $('.btnactions').hide();
          $('.resendBtn').show();
          return '<span style="color:green; font-weight: bold;">APPROVED</span>';
        }else{
            $('.btnactions').hide();
            return '<span style="color:green; font-weight: bold;">APPROVED</span>';
        }
    }

    var respond = '';
    function denyreq(){
        var f = confirm('Are you sure you want to deny this request?');
        if(f){
            respond = 'DENIED';
            $('#actionModal').modal('show');
        }
    }

    function appvreq(){
        var f = confirm('Are you sure you want to approve this request?');
        if(f){
            respond = 'APPROVED';
            $('#actionModal').modal('show');
        }
    }

    function resendappvreq(){
      var f = confirm('Are you sure you want to re-send this approved request?');
        if(f){
            respond = 'APPROVED';
            $('#actionModal').modal('show');
        }
    }

    function submitreq(){
        var remarks = $('#req_remarks').val();
        var cIDHolder = $('#cIDHolder').val();
       
        execmodule(respond, cIDHolder, remarks);


    }

    function execmodule(reqstat, cID, remarks){
        var reqType = $('#upt_transtype').text();
        var mdCode = $('#mdCodeHolder').val();
        $.ajax ({
            url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {
                    "type":"EXEC_PENDING_REQ_APPV",
                    cID:cID,
                    appvStat:reqstat,
                    remarks:remarks,
                    "CONN":con_info
                },
            dataType: "json",
            crossDomain: true,
            cache: false,  
            async: false,          
            success: function(r){ 
              if(r){ 
                var message = 'Your request for ' +reqType+ ' was ' + reqstat+' by the approving officer.';
                pushnotif(mdCode, 'OTPApproval', message, reqstat);
                alert('REQUEST SUCCESSFULLY ' + reqstat);
                location.reload();
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.responseText);
            }
        });
    }

    

    function pushnotif(mdCode, header, message, reqstat){
        var ACCESS_TOKEN = get_firebase_accesstoken();;
        var DEVICETOKEN = getToken(mdCode);
        var approverNumber = $('#appvNumHolder').val();
        var otp = $('#otpHolder').val();

        // Notification payload
        const notificationPayload = {
          message: {
            token: DEVICETOKEN,  // The FCM device token of the target device
            notification:  {
              title: header,
              body: message
            },
            data: {
                  title: header,
                  body: message,
                  approverNumber:approverNumber,
                  otp:otp,
                  status:reqstat
                }
          }
        };

        fetch(`https://fcm.googleapis.com/v1/projects/ravamate/messages:send`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + ACCESS_TOKEN,  // OAuth 2.0 Bearer token
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationPayload),  // The notification payload
        })
        .then(response => response.json())
        .then(data => {
          console.log('Notification sent successfully:', data);
          // update_notif_status(cID);
        })
        .catch((error) => {
          console.error('Error sending notification:', error);
        });
      }


      function getToken(mdCode){
        var token = '';
        $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {
                  "type":"GET_USER_TOKEN",
                  "CONN":con_info,
                  "mdCode":mdCode
                },
          dataType: "json",
          crossDomain: true,
          cache: false,
          async: false,         
          success: function(r){
            token = r;
          }
        });
        return token;
      }

       function get_firebase_accesstoken(){
        var token = '';
        $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {
                  "type":"GET_ACCESS_TOKEN",
                  "CONN":con_info
                },
          dataType: "json",
          crossDomain: true,
          cache: false,
          async: false,         
          success: function(r){
            token = r;
          }
        });
        return token;
      }



      // CMF PART
      customerData(startPickDate, endPickDate);
      customerDataTable();

      var sourceData_cmf;
      function customerData(start, end){
        $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {
                  "type":"GET_CMF_DATA",
                  'start':start,
                  'end':end,
                  "CONN":con_info
                },
          dataType: "JSON",
          crossDomain: true,
          cache: false,     
          async: false,       
            success: function(r){ 
                sourceData_cmf = r;
            }
        });
      }

      var tableData_cmf;
      function customerDataTable(){
        tableData_cmf =  $('table.cmf_Tab').DataTable({
                    "dom": 'Bfrtip',
                    "data": sourceData_cmf,
                    "scrollX": true,
                    "ordering": true,
                    "columns": [
                        { "data": "STATUS"},
                        // { "data": "CMFID"},
                        { "data": "SALESPERSON"},
                        { "data": "CUSTCODE"},
                        { "data": "SOLDTONAME" },
                        { "data": "CUST_CONT_PERSON" },
                        { "data": "CUST_CONTNO" },
                        { "data": "EMAIL" },
                        { "data": "GEOAREA" },
                        { "data": "CHAIN" },
                        { "data": "COV_DAY" },
                        { "data": "TIN" },
                        { "data": "SLD_POSTCODE" },
                        { "data": "SHP_MUNICIPALITY_CITY_PROV" },
                        { "data": "SHP_STREET_BRGY" },
                        { "data": "LONGITUDE" },
                        { "data": "LATITUDE" },
                        { "data": "SHP_OTHERINFO"},
                        { "data": "SLD_OTHERINFO"},
                        { "data": "CUST_CLASS"},
                        { "data": "COV_FREQ"},
                        { "data": "REQ_DATE"}
                    ],
                    // "aoColumnDefs": [
                    // { 
                    //   "sClass": "text-right", "aTargets": [ 3 ],
                    //   // "sClass": "text-center", "aTargets": [ 2 ]  
                    // }
                    //You can also set 'sType' to 'numeric' and use the built in css.           
                 // ],
                  buttons:  [
                          'csv', 'excel',
                          {
                              text: 'Filter Date',
                              className: 'filterdate_booking',
                              action: function(e, dt, node, config){
                                console.log('clickme');
                                // customerData(startPickDate, endPickDate);
                                // tableData_cmf.clear().rows.add(sourceData_cmf).draw();
                              }
                          }
                  ],
                    "language": {
                      "emptyTable": "No available records as of now."
                    },
                    // "aaSorting": [[ 0, "desc" ]],
                    rowCallback: function(row, data, index){
                      var statIndicator = data.STATUS.toString();
                    //   var salesmanIndi = $(row).find('td:eq(4)').text();
                    //   var mdCode = data.partnerID.toString();
                    //   // console.log(salesmanOBj);

                      
                      
                      if($.trim(statIndicator) == '1'){ 
                        // $(row).find('td:eq(2)').text('BOOKING');
                        $(row).find('td:eq(0)').css({'color': 'white', "background-color": "#e06335", "text-align":"center"});
                        $(row).find('td:eq(0)').text('Pending');
                      }else if($.trim(statIndicator) == '2'){
                        $(row).find('td:eq(0)').text('Approved');
                        $(row).find('td:eq(0)').css({'color': 'white', "background-color": "#00A86B", "text-align":"center"});
                      }else{
                        $(row).find('td:eq(0)').text('Denied');
                        $(row).find('td:eq(0)').css({'color': 'white', "background-color": "red", "text-align":"center"});
                      }

                    //   if(salesmanIndi == null || salesmanIndi == 'null' || salesmanIndi == ''){
                    //     $(row).find('td:eq(4)').text('---');
                    //   }
                    //   // else{
                    //   //   var salesmanOBj = getSalesmanDetails(mdCode);
                    //   //   $(row).find('td:eq(4)').text(mdCode+'_'+salesmanOBj[0].Salesman);
                    //   // }
                  }
           });

        $('table.cmf_Tab tbody').on('click', 'tr', function () {
            var tr = $(this).closest('tr');
            var row = tableData_cmf.row(tr);
            cmfDetails(row.data());
        });

        function cmfDetails(r){
            $('#vl_cmfID').html(r.CMFID);
            $('#vl_custCode').html(r.CUSTCODE);
            // $('#vl_soldname').html(r.SOLDTONAME);
            $('#vl_salesperson').html(r.SALESPERSON);
            // $('#vl_custnumber').html(r.CUST_CONTNO);
            // $('#vl_address').html(r.SHP_STREET_BRGY);
            $('#vl_reqdate').html(r.REQ_DATE);
            $('#vl_stat').html(r.STAT_DIFF);

            $('#cmfstatdiff').val(r.STATUS);
            $('#cmfIDHolder').val(r.cID);


            $('#vl_soldname').val(r.SOLDTONAME);
            // $('#vl_salesperson').val(r.SALESPERSON);
            $('#vl_custnumber').val(r.CUST_CONTNO);
            $('#vl_address').val(r.SHP_STREET_BRGY);


            $('#vl_contactperson').val(r.CUST_CONT_PERSON);
            $('#vl_email').val(r.EMAIL);
            $('#vl_geoarea').val(r.GEOAREA);
            $('#vl_chain').val(r.CHAIN);
            $('#vl_coverageday').val(r.COV_DAY);
            $('#vl_tin').val(r.TIN);
            $('#vl_postalcode').val(r.SLD_POSTCODE);
            $('#vl_municipaplity').val(r.SHP_MUNICIPALITY_CITY_PROV);
            $('#vl_barangay').val(r.SHP_STREET_BRGY);
            $('#vl_othershipto').val(r.SHP_OTHERINFO);
            $('#vl_othersoldto').val(r.SLD_OTHERINFO);
            $('#vl_custclass').val(r.CUST_CLASS);
            $('#vl_frequency').val(r.COV_FREQ);


            $('#cmfmodaletails').modal('show');
            
        }
      }

      function approveCMF(stat){
        var mess = 'Approve';
        if(stat == 0){
            mess = 'Denied';
        }
       
        var cmfID = $('#cmfIDHolder').val();
        var f = confirm('Are you sure you want to update this CMF?');
        if(f){

            $.ajax ({
                url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
                type: "GET",
                data: {
                        "type":"UPDATE_CMF_STAT",
                        "CONN":con_info,
                        "cmfID":cmfID,
                        "statcmf":stat
                      },
                dataType: "json",
                crossDomain: true,
                cache: false,
                async: false,         
                success: function(r){
                    customerData(startPickDate, endPickDate);
                    tableData_cmf.clear().rows.add(sourceData_cmf).draw();
                    alert('CMF Successfully ' + mess);
                    $('#cmfmodaletails').modal('hide');
                }
              });

        }
      }

      function displaycustomer(cust){
        if(cust == 'NEW_CUSTOMER'){
          return cust;
        }else{
          return getCustomerName(cust);
        }
      }

      function islockOnverifyer(r){
        
        if(r == 0){
          return '<strong style="color: red;">NO</strong>';
        }
         return '<strong style="color: #5ee663;">YES</strong>';
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




          function updatecmf(){
            var statdiff = $('#cmfstatdiff').val();
            console.log(statdiff);
            if(statdiff == '1'){
              var f = confirm('Are you sure you want to update this CMF ?');
              if(f){

                var cID = $('#cmfIDHolder').val();
                var soldname = $('#vl_soldname').val();
                var cust_contactno = $('#vl_custnumber').val();
                var st_brgy = $('#vl_address').val();
                var cust_contactperson = $('#vl_contactperson').val();
                var email = $('#vl_email').val();
                var geoarea = $('#vl_geoarea').val();
                var chain = $('#vl_chain').val();
                var covday = $('#vl_coverageday').val();
                var tin = $('#vl_tin').val();
                var postalcode = $('#vl_postalcode').val();
                var municipality = $('#vl_municipaplity').val();
                var brgy = $('#vl_barangay').val();
                var other_shipto = $('#vl_othershipto').val();
                var other_soldto = $('#vl_othersoldto').val();
                var custclass = $('#vl_custclass').val();
                var frequency = $('#vl_frequency').val();

                $.ajax ({
                  url: GLOBALLINKAPI+"/nestle/connectionString/POST_applicationApi.php",
                  type: "POST",
                  data: {
                          "type":"UPDATE_CMF_DATA",
                          cID:cID,
                          soldname:soldname,
                          cust_contactno:cust_contactno,
                          st_brgy:st_brgy,
                          cust_contactperson:cust_contactperson,
                          email:email,
                          geoarea:geoarea,
                          chain:chain,
                          covday:covday,
                          tin:tin,
                          postalcode:postalcode,
                          municipality:municipality,
                          brgy:brgy,
                          other_shipto:other_shipto,
                          other_soldto:other_soldto,
                          custclass:custclass,
                          frequency:frequency,
                          "CONN":con_info
                        },
                  dataType: "JSON",
                  crossDomain: true,
                  cache: false,     
                  async: false,       
                    success: function(r){ 
                       if(r){
                        alert('CMF data was successfully updated.');
                        location.reload();
                       }
                    }
                });

              }
            }else{
              alert('Updating of CMF data is restricted for Approved and Recjected CMF');
            }
           
          }

          
      datePicker();