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
            $('#titleHeading').html(r[0].company.toUpperCase() +' / Pending Request / v.1.9.1');
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
            buttons: [ 'excel', 'print', 'copy' ],
       
        });

      $('#stockRequest_TAB tbody').on('click', 'tr', function () {
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
        var token = getToken(mdCode);
        var approverNumber = $('#appvNumHolder').val();
        var otp = $('#otpHolder').val();

        // Notification payload
        const notificationPayload = {
          message: {
            token: token,  // The FCM device token of the target device
            notification:  {
              "title": header,
              "body": message
            },
            data: {
                  "title": header,
                  "body": message,
                  "approverNumber":approverNumber,
                  "otp":otp,
                  "status":reqstat
                }
          }
        };

        fetch(`https://fcm.googleapis.com/v1/projects/my-buddy-275708/messages:send`, {
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



        //  $.ajax({        
        //     type : 'POST',
        //     url : "https://fcm.googleapis.com/fcm/send",
        //     headers : {
        //         Authorization : 'key=' + 
        //         'AAAA4OmJn2o:APA91bGBe9aHcLoJxAkkJbwN9ozac6St2BimIOVtWtb7dv-GV50v2S5-vIQzS_bZfxgl9385wyBeW4qA2GOR-BfnBV63mOHFDKMEfgZn9PNM-EAbvBtKFPEYszCLZ0OxZZPPvjyfqQMD'
        //     },
        //     contentType : 'application/json',
        //     dataType: 'json',
        //     data: JSON.stringify({"to": token,
        //       "data": {
        //               "title": header,
        //               "body": message,
        //               "approverNumber":approverNumber,
        //               "otp":otp,
        //               "status":reqstat
        //             }
        //         }),
        //     success : function(response) {
        //         console.log(response);
        //     },
        //     error : function(xhr, status, error) {
        //         console.log(xhr.error);                   
        //     }
        // });
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


