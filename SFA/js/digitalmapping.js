  var userID = localStorage.getItem('user_id');
  var user = localStorage.getItem("adminUserName");
  var usernm = localStorage.getItem("username");
  var usertype = localStorage.getItem("usertype");
  var site_lat = localStorage.getItem("latitude");
  var site_long = localStorage.getItem("longitude"); 
  var site_mapzoom = localStorage.getItem("mapzoom"); 

  // var s = localStorage.getItem("srvr");
  // var u = localStorage.getItem("usrnm");
  // var p = localStorage.getItem("psswrd");
  // var d = localStorage.getItem("dtbse");
  // var con_info = [s, p, u, d];

   determineUserType(usertype); 
   
   //allSalesman();
   /*NOTIFICATION SECTION*/
  //  showNotif();

  //   $(document).on('click', '.dropdown-toggle', function(){
  //     $('.count').html('');
  //      showNotif('yes');
  //   });
  
  
  $('#categoryTable').removeClass('hidden');

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
            $('#headingTitle').html(r[0].company.toUpperCase() +' / Digital Mapping');
            }
        });
  }  


  //   setInterval(function(){
  //    showNotif();
  //  }, 9000);

     $('#navDrop').click(function() {
      $("i", this).toggleClass("glyphicon-menu-up glyphicon-menu-down");
    });

    function showNotif(view=''){
      $.ajax ({
        url: "../geofencing/GeofencingAPI.php",
        type: "GET",
        data: {"type":"view_notifications_icon_"+user, "view":view},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
          success: function(response){              
          $("#notifs-icon-div").html(response.notification);
            if(response.unseen_notification > 0)
            {
              $('.count').html(response.unseen_notification);
            }  
          }
      });
    }

    function updateDigitalMapping(){
      var ajaxTime= new Date().getTime();
      var totalTime= 0;
      
      var r = confirm("This could take time, please wait while we process your request.");
      if (r == true) {
          $('#updateBtn').html("<i class='fa fa-spin fa-spinner'></i> Updating..");
          $('#updateBtn').prop('disabled', true);
          
          $.ajax ({ 
            url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"UPDATE_DIGITALMAPPING", "CONN":con_info},
            dataType: "html",
            crossDomain: true,
            cache: false,            
              success: function(response){ 
                if(response == 0){
                  alert('Update was successfull !');
                }else{
                  alert('ERROR ON UPDATE | Reason:'+response +' '+'Please contact system administrator for this matter!');
                }
              }
            }).done(function () 
              {
                  setTimeout(function(){
                      $('#updateBtn').html("Update");
                      $('#updateBtn').prop('disabled', false);
                  }, totalTime);
              });
        }
    }

      var territoryColor = document.getElementById("terrcolor");
      var GlobalColor = "";

        //history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
              history.pushState(null, null, document.URL);
      });

      //interval to get geofences
      var countSalesman; 
    setInterval(function () { 
         countSales();
    }, 1000);

     
   function graphicalRep(salesman, c_startDate, c_endDate){
    $("#chart").empty();
    $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {"type":"digitalmapping_graph_report", "resultSalesman": salesman,"start":c_startDate, "end":c_endDate, "CONN":con_info},
          dataType: "html",
          crossDomain: true,
          cache: false,            
            success: function(response){   
              var data = JSON.parse(response);   
              var chart_Data;
              var newDat = [];

            var acctregs = new Morris.Bar({
                barSizeRatio:0.56,
                element: 'chart',
                data: $.parseJSON(response),
                hoverCallback: function(index, options, content) {
                    return(content);
                },
                xkey: ['salesmanName'],
                ykeys: ['sales'],
                labels: ['Sales'],
                xLabelAngle: 45,

                /*for line graph of morries*/
                // pointFillColors: ,
                pointSize: 10,
                /*for line graph of morries*/

                xLabelMargin: 10,
                /*barColors: function (row, series, type) {
                  if (type === 'bar') {
                        var red = Math.ceil(255 * row.y / this.ymax);
                        return 'rgb(' + red + ',0,0)';
                    }
                    else {
                        return '#000';
                    }
                }, */
                resize: true,
                hideHover: 'auto'
                // dateFormat:function (x) { return new Date(x).toString().split("00:00:00")[0]; }
            });
              
            }
        });
    }

    function hitme(marker_id, marker_object, transCount){
        var salesman, mdCode;
        $(".showSalesman").click( function() {
           salesman = $(this).closest('td').text();
           mdCode = salesman.substring(1, 5);

           if(mdCode == marker_id && transCount == 1){
              map.setCenter(marker_object.getPosition());
              map.setZoom(12);
           }
        });
     }

        function remvDubTables(){
           var seen = {};
           $('#dashboardDisplay tr ').each(function () {
               var txt = $("td:first-child", $(this)).text();
               if (seen[txt]) $(this).remove();
               else seen[txt] = true;
           });
        }

        datePicker2();
        var startPickDate, endPickDate, if1dayisSelected;
        function datePicker2(){
          var start = moment().subtract(29, 'days');
          var end = moment();

          $('#reportrange').daterangepicker({
              "alwaysShowCalendars": true,
              "startDate": start,
              "endDate": end,
              "maxDate": moment(),
              "applyClass": "btn-primary",
              ranges: {
                  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
              }
          }, function(start, end, label) {
                $('#salectedDates').html(start.format('MMMM D') + ' - ' + end.format('MMMM D, YYYY'));
                var d1 = moment(start);
                var d2 = moment(end);
                if1dayisSelected = d2.diff(d1);
                console.log(if1dayisSelected);
                startPickDate = start.format('YYYY-MM-DD');
                endPickDate = end.format('YYYY-MM-DD');
                $('#salesmanSselectionModal').modal('show');
                allSalesman_sp(startPickDate, endPickDate);
            });

            $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
             // $('#salectedDates').html(start.format('MMMM D') + ' - ' + end.format('MMMM D, YYYY'));
              var d1 = moment(start);
              var d2 = moment(end);
              //if1dayisSelected = d2.diff(d1);
              console.log(if1dayisSelected);
              var start = picker.startDate.format('YYYY-MM-DD');
              var end = picker.endDate.format('YYYY-MM-DD');
              $('#salesmanSselectionModal').modal('show');
              allSalesman_sp(start, end);
            });
        }

        function getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }
        var countSalesResults = 0;
        function storeTblValues(salesman)
        {
             $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {"type":"digitalMapping_totalsales_filter", "salesman": salesman, "start":startPickDate, "end":endPickDate, "CONN":con_info},
              dataType: "json",
              crossDomain: true,
              cache: false,            
                success: function(data){ 
                  if(data.sales == 0){
                    alert('NO DATA TO SHOW ON YOUR SELECTED DATE!');
                  }else{
                      var sales = data.sales;
                      countSalesResults = sales;
                  }
                }
            });
         }
      
        function countSales(){
           var count = $('#dashboardDisplay tr').length;
            $('#total').html('TOTAL (' +count+ ') : ' +countSalesResults);
        }


        function allSalesman_sp(start, end){
          //$('.loading-table').show();
          $('#fetchCont').show();
          $('#salesmanListCont').hide();
          var ajaxTime= new Date().getTime();
          var totalTime= 0;
          $('#salesmanList').multiselect('destroy');
            $.ajax ({
                  url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
                  type: "GET",
                  data: {"type":"salesman_list_digimap", "CONN":con_info, "start":start, "end":end},
                  dataType: "json",
                  crossDomain: true,
                  cache: false,            
                  success: function(data){
                    $('#salesmanListCont').show();
                    $('#fetchCont').hide();
                    $('#salesmanList').html('');
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
                  }//success here;
              }).done(function () {
                    setTimeout(function(){
                      //$('.loading-table').fadeOut();
                      //$('#dashboardDisplay').html('<tr><td colspan="4" style="text-align:center;">Click "Select Date Range" to get started.</td></tr>');
                      //$('#total').html('');
                    }, totalTime);
              });
         }
                 
        function allSalesman(){
        $('.loading-table').show();
        var ajaxTime= new Date().getTime();
        var totalTime= 0;
          $.ajax ({
                url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
                type: "GET",
                data: {"type":"get_all_salesman_bohol", "CONN":con_info},
                dataType: "json",
                crossDomain: true,
                cache: false,            
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
                }//success here;
            }).done(function () {
                  setTimeout(function(){
                    $('.loading-table').fadeOut();
                    $('#dashboardDisplay').html('<tr><td colspan="4" style="text-align:center;">Click "Select Date Range" to get started.</td></tr>');
                    $('#overAllTotal').html('');
                  }, totalTime);
            });
       }
       function dashBoardData(values){
             $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {"type":"digital_mapping_table_data","resultSalesman":values, "start":startPickDate, "end":endPickDate, "CONN":con_info},
              dataType: "html",
              crossDomain: true,
              cache: false,            
                success: function(response){ 
                 $("#dashboardDisplay").html(response);
                }
            });
        }


        function dashBoardDatav2(values){
          $.ajax ({
           url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
           type: "GET",
           data: {"type":"digital_mapping_table_data_v2","resultSalesman":values, "start":startPickDate, "end":endPickDate, "CONN":con_info},
           dataType: "html",
           crossDomain: true,
           cache: false,            
             success: function(r){ 
              console.log(r);
             }
         });
     }
  function showmarkersback(){
    for(var x = 0; x < markers.length; x++){
       markers[x].setMap(map);
      }
  }
  function showSalesmanOnMap(mdCode){
      for(var x = 0; x < markers.length; x++){
        if(if1dayisSelected == '86399999'){
          deleteBounce();
         if(mdCode != markers[x].id && markers[x].transCount == 1){
            markers[x].setAnimation(google.maps.Animation.BOUNCE);
            map.setCenter(markers[x].getPosition());
            map.setZoom(13);
            infoWindow.close();
            infoWindow.setContent(markers[x].content);
            infoWindow.open(map, markers[x]);
         }
        }else{
         markers[x].setMap(map);
         if(mdCode != markers[x].id){
            markers[x].setMap(null);
            infoWindow.close();
         }
        }//else
      }//for
    }

  
   function clickSalesmanList() {
        var x = document.getElementById("salesmanList").selectedIndex;
        var result = document.getElementsByTagName("option")[x].value;
        alert(result);
    }

    var markers = [];
     function DeleteMarkers() {
      //Loop through all the markers and remove
      for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
      }
      markers = [];
     }

    function currentDate(){
      var d = new Date();
      var month = d.getMonth()+1;
      var day = d.getDate();

      var date_today = d.getFullYear() + '-' +
          ((''+month).length<2 ? '0' : '') + month + '-' +
          ((''+day).length<2 ? '0' : '') + day;

      return date_today;

    }

    function flip1() {
        $(".container_salesman").animate({width:'toggle'},350);
        $('.arrow-side-icon').toggleClass('fa-angle-right');
    }

    function flip2() {
        $(".container_productCat").animate({width:'toggle'},350);
        $('.arrow-side-icon2').toggleClass('fa-angle-right');
        //$('#categoryTable div:not(.arrow-side2)').hide();
    }

     $('.loading-table').hide();
     $('#salesmanBtn').hide();
     $('#categoryTable').hide();
     $("#productBtn").click(function(){
      if(startPickDate == undefined && endPickDate == undefined){
        alert('Please select a date first.');
      }else{
        $('.product-data-container tbody').hide();
        DeleteMarkers();
        restoreLoc();
        showAllProduct();
        //displayAllData.pause();
        productCategory();
        
        $('#salesmanCategory').slideUp();
        $('#categoryTable').show();
        
        $('#salesmanBtn').show();
        $('#productBtn').hide();
      }
        
     });

     $("#salesmanBtn").click(function(){
        //$("#dashboardDisplay").show();
        removeProdutMarker();
        displaySalesMan();
        //dashBoard_direct_marker();
        restoreLoc();
        //displayAllData.resume();
        //$('.loading-table').show();
       
        $("#salesmanCategory").slideDown();
        $('#categoryTable').hide();
        
        $('#salesmanBtn').hide();
        $('#productBtn').show();
     });

     $('.categoryProp table thead').click(function (){
        removeProdutMarker();
        showAllProduct();
     });

     var productMarker = [];
     function removeProdutMarker(){
          for (var i = 0; i < productMarker.length; i++) {
              productMarker[i].setMap(null);
          }
          productMarker = [];
     }

     function hideProdutMarker(){
       for (var i = 0; i < productMarker.length; i++) {
              productMarker[i].setMap(null);
          }
     }

     function pinSymbol(color) {
        return {
            //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#333',
            strokeWeight: 0.5,
            scale: 0.9,
            labelOrigin: new google.maps.Point(1, -27)
       };
    }

     var markerProd;
     function showAllProduct(){
      $('.loading-table').show();
      var ajaxTime= new Date().getTime();
      var totalTime= 0;
          $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {"type":"getAllProduct_digiMapFilter","start":startPickDate, "end":endPickDate, "CONN":con_info},
              dataType: "html",
              crossDomain: true,
              cache: false,
              success: function(response){ 
                DeleteMarkers();
                if(response == 0){
                      console.log('empty dashboard!');
                }else{
                  var data = JSON.parse(response); 
                  for(var x=0; x<data.length; x++){
                      markerProd = new google.maps.Marker({
                        map: map,
                        brandColor: data[x].BrandColor,
                        brandName: data[x].Brand,
                        long: data[x].longitude,
                        lat: data[x].latitude,
                        position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                        icon: pinSymbol(data[x].mdColor)
                        //icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|'+data[x].BrandColor.substr(1)
                        /*icon: {
                                  path: fontawesome.markers.MAP_MARKER,
                                  scale: 0.5,
                                  strokeWeight: 1,
                                  strokeColor: '#000000',
                                  strokeOpacity: 0.1,
                                  fillColor: data[x].BrandColor,
                                  fillOpacity: 1
                              }*/
                      });
                      productMarker.push(markerProd);
                    }
                  }
                }//success
                }).done(function () {
                  setTimeout(function(){
                    $('.loading-table').fadeOut();
                     $('.product-data-container tbody').show();
                  }, totalTime);
                                 });
     }

     
      function productCategory(){
        $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {"type":"dashBoardData_product_digiMapFilter","start":startPickDate, "end":endPickDate, "CONN":con_info},
              dataType: "JSON",
              crossDomain: true,
              cache: false,          
                success: function(response){ 
                  $('#cateogoryDataTable').html(response.tableDetails);
                  $('.footerDetails').html(response.footerDetails);
                }//success
            });

      }

     var productName, brandMarker;
     function brand(){
        $(".brandName").click( function() {
           var productName = $(this).closest('td').text().trim();
           $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {"type":"getProduct_digiMapFilter", "productName":productName, "start":startPickDate, "end":endPickDate, "CONN":con_info},
              dataType: "html",
              crossDomain: true,
              cache: false,     
              async: false,  
                success: function(response){ 
                   removeProdutMarker();
                  if(response == 0){
                      console.log('empty dashboard!');
                    }else{
                      var data = JSON.parse(response); 
                      for(var x=0; x<data.length; x++){
                          marker = new google.maps.Marker({
                            map: map,
                            position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                           icon: pinSymbol(data[x].mdColor)
                             
                          });
                          productMarker.push(marker);
                        }
                      }
                }//success
            });
        });

     }

     function IntervalTimer(callback, interval) {
        var timerId, startTime, remaining = 0;
        var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

        this.pause = function () {
            if (state != 1) return;
            console.log('-- pause');
            remaining = interval - (new Date() - startTime);
            window.clearInterval(timerId);
            state = 2;
        };

        this.resume = function () {
            if (state != 2) return;
            console.log('-- resume');
            state = 3; 
            window.setTimeout(this.timeoutCallback, remaining);
        };

        this.timeoutCallback = function () {
            if (state != 3) return;

            callback();

            startTime = new Date();
            timerId = window.setInterval(callback, interval);
            state = 1;
        };

        startTime = new Date();
        timerId = window.setInterval(callback, interval);
        state = 1;
    }

      function pinSymbol(color) {
          return {
              //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
              path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 0.5,
              scale: 0.8,
         };
      }

      function heatmap(){
         var gradient = [
              'rgba(0, 255, 255, 0)',
              'rgba(0, 255, 255, 1)',
              'rgba(0, 191, 255, 1)',
              'rgba(0, 127, 255, 1)',
              'rgba(0, 63, 255, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(0, 0, 223, 1)',
              'rgba(0, 0, 191, 1)',
              'rgba(0, 0, 159, 1)',
              'rgba(0, 0, 127, 1)',
              'rgba(63, 0, 91, 1)',
              'rgba(127, 0, 63, 1)',
              'rgba(191, 0, 31, 1)',
              'rgba(255, 0, 0, 1)'
            ];

            heatmap = new google.maps.visualization.HeatmapLayer({
              data:heatmapArr,
              map: map
            });
           
           heatmap.set('gradient', gradient);
           //heatmap.set('radius', 20);
           heatmap.setMap(null);
      }

       var Longitude = [];
       var Latitude = [];
       //alert boundary
        var salesmanName=[];
        var newdata = [];
        var customer = [];
        var marker = [];
        var infoWindow = new google.maps.InfoWindow;
        var heatmapArr;
       function displaySalesMan(){
        var values = $('#salesmanList').val();
        var compDist = 0;
        heatmapArr = [];
        
        if(values == null){
          alert('Please select a salesman first!');
        }else if(startPickDate == undefined || endPickDate == undefined){
          alert('Please select your date range!');
        }else{
          dashBoardData(values);
          dashBoardDatav2(values)
          storeTblValues(values);
          //graphicalRep(values, startPickDate, endPickDate);
          var names=[];
          var ids=[];
          
          var dateMPA=[];
          var longlat=[];
          var header=[];
          var loc=[[]];
          
         // var infoWindow = new google.maps.InfoWindow();
         var dialog = bootbox.dialog({
                        message: '<p class="text-center"><i class="fa fa-spin fa-spinner"></i> Fetching large amount of data please wait...</p>',
                        closeButton: false
                    });
         var ajaxTime= new Date().getTime();
         var totalTime= 0;
      
        $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
          type: "GET",
          data: {"type":"get_salesmanlocation_digitalMapping", "resultSalesman":values, "start":startPickDate, "end":endPickDate, "CONN":con_info},
          dataType: "json",
          crossDomain: true,
          cache: false,           
          success: function(data){ 
                DeleteMarkers();
                   for(var x=0; x<data.length; x++){
                    compDist = distance(data[x].latitude, data[x].longitude, data[x].transCount);
                     var contentString = "<div style='margin: 0 auto;'><div class='modal-header' style='text-align: center;'>"+
                          "<div class=''><img class='salesmanPic' alt='salesmanPic' style='border: solid 3px "+data[x].mdColor+"' src='../img/salesman_"+user+"/"+data[x].mdCode+".jpg' onError='imgError(this)'/>"+
                           "<br/><span class='label label-pill label-danger count' style='font-size: 10px; border-radius:100%; float:center; background-color:"+data[x].mdColor+";' id='getThisTransCount'>"+data[x].transCount+"</span>"+
                           "<span class='fa fa-chevron-left pull-left' style='float: left; font-size: 30px;' onclick='prevInfo()' id='prevMD'></span><span id='nextMD' onclick='nextInfo()' class='fa fa fa-chevron-right pull-right' style='float: left; font-size: 30px;'></span></div></div>"+
                              "<div class='table-responsive'>" +
                                 "<table class='table table-condensed'>" +
                                  "<tr><td>Salesman:</td><td id='getThisSalesman'>"+data[x].Salesman+"</td></tr>"+
                                   "<tr><td>Customer:</td><td>"+data[x].Customer+"</td></tr>"+
                                   "<tr><td>Address:</td><td>"+data[x].address+"</td></tr>"+
                                   /*"<tr><td>Location:</td><td id='getThisLongLat'>"+data[x].latitude +' '+data[x].longitude+"</td></tr>"+*/
                                   "<tr class='customerHolder' onClick='showCustImage(\""+data[x].customerID+"\")'><td colspan='2' id='customerData'><span id='indicatorImg'>Click here to view store image</span> <i class='fa fa-picture-o storeIc' aria-hidden='true'></i></td></tr>"+
                                   /*"<tr><td>Document No:</td><td>"+data[x].DocumentNo+"</td></tr>"+*/
                                   "<tr><td>Delivery Date:</td><td>"+data[x].deliveryDate+"</td></tr>"+
                                   "<tr><td>Time Spent:</td><td>"+timeSpentFunc(data[x].timeSpent, data[x].transCount)+"</td></tr>"+
                                   "<tr><td>Distance Travel:</td><td><span id='distanceDisp'>"+compDist+"</span> in " +convertTimeGap(data[x].time, data[x].transCount)+"</td></tr>"+
                                   "<tr><td>Sales:</td><td>&#8369; "+data[x].Sales+" <span id='skuHolder' onclick='getTransaction()'>("+data[x].noSku+" SKU)<i class='fa fa-caret-down' aria-hidden='true'></i><input type='hidden' id='skuHolder-data' value="+data[x].transactionID+"><input type='hidden' id='click-data' value='0'></td>"+
                                   "</tr>"+
                                "</table>"+
                                "</div>"+
                                "<div id='transaction-details-holder'></div>"+
                              "</div>";
                      if(if1dayisSelected == '86399999'){
                        marker = new google.maps.Marker({
                          id: data[x].mdCode,
                          transCount: data[x].transCount,
                          loc: data[x].latitude+' '+data[x].longitude,
                          mdName: data[x].Salesman,
                          infowindow: infoWindow,
                          position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                          map: map,
                          content: contentString,
                          icon: {
                             url:'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/'+data[x].transCount+'/'+data[x].mdColor.substr(1),
                              scaledSize: new google.maps.Size(36, 40)
                          }
                          /*icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+data[x].transCount+'|'+data[x].mdColor.substr(1)+'|FAFAFA'*/
                        });
                      }else{
                        marker = new google.maps.Marker({
                          id: data[x].mdCode,
                          transCount: data[x].transCount,
                          loc: data[x].latitude+' '+data[x].longitude,
                          mdName: data[x].Salesman,
                          infowindow: infoWindow,
                          position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                          map: map,
                          content: contentString,
                          icon: {
                             url:'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/'+data[x].mdColor.substr(1),
                              //scaledSize: new google.maps.Size(33, 33)
                          }
                          //icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+data[x].transCount+'|'+data[x].mdColor.substr(1)+'|FAFAFA'
                          //icon: pinSymbol(data[x].mdColor)
                        });
                      }
                      
                        //hitme(marker.id, marker, marker.transCount);
                        markers.push(marker);
                       
                        google.maps.event.addListener(marker, 'click', (function(marker, x) {
                          return function(){
                          $('#indicatorImg').html("Click here to view store image");
                          $('.storeIc').show();
                          lat1 = data[x].latitude; 
                          lon1 = data[x].longitude;
                                new google.maps.InfoWindow({ maxWidth: 500});
                                infoWindow.setContent(this.content);
                                infoWindow.open(map, marker);
                            }
                        
                        })(marker, x));

                    //******************* heat map *********************

                     heatmapArr.push(new google.maps.LatLng(data[x].latitude, data[x].longitude));

                  }//end for  

                  //heatmap();

                   google.maps.event.addListener(infoWindow, 'closeclick', function() {  
                          //displayAllData.resume();
                      }); 
                     }//on succjess
                }).done(function () {
                        dialog.init(function(){
                              setTimeout(function(){
                                  dialog.modal('hide');
                              }, 1000);
                        });
                         
                   });
        }//close else
          
      }//display salesman funciton

      function defaultStore(image) {
        image.onerror = "";
        image.src = "../img/no-image.png";
        return true;
      } 

      function showCustImage(custID){
        $('.storeImageTable').remove();
        $("#transaction-details-holder table").remove();
        $('#indicatorImg').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
        $('.storeIc').hide();
         var ajaxTime= new Date().getTime();
         var totalTime= 0;
          $.ajax ({
              url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
              type: "GET",
              data: {"type":"displayCustImage", "custID":custID, "CONN":con_info},
              dataType: "JSON",
              crossDomain: true,
              cache: false,            
                success: function(r){ 
                    var content = "<table class='storeImageTable'><tr><td><img onError='defaultStore(this)' class='store1' src='data:image/jpeg;base64,"+r.storeImage+"'/></td>"+
                    "<td><img onError='defaultStore(this)' src='data:image/jpeg;base64,"+r.storeImage2+"'/></td></tr><tr><td>Outside View</td><td>Inside View</td></tr><table/>"; 
                    $('#customerData').append(content);      
                }
            }).done(function () {
                      setTimeout(function(){
                    $('#indicatorImg').html("");
                      }, totalTime);
           });
        //});
      }

      function getTransaction(){
        $("#transaction-details-holder table").remove();
        $('.storeImageTable').remove();
        $('#indicatorImg').html("Click here to view store image");
                 var transactionID = $('#skuHolder-data').val();
                 $.ajax ({
                      url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
                      type: "GET",
                      data: {"type":"getTransactionDetails", "transactionID":transactionID, "CONN":con_info},
                      dataType: "html", 
                      crossDomain: true,
                      cache: false,
                      success: function(response){ 
                              $('#transaction-details-holder').append(response);
                              $('#transaction-details-holder table').addClass('table table-condensed table-bordered');
                              $('#transaction-details-holder').addClass('height-details');
                        }//success
                    });
      }

     function prevInfo(){
        $('#indicatorImg').html("Click here to view store image");
        $('.storeIc').show();
        var mdNamePrev  = $('#getThisSalesman').text();
        var transCountPrev = $('#getThisTransCount').text();
             var newPreview = transCountPrev - 1; 
             deleteBounce();

              if(transCountPrev == 1){
                 alert('No previous transaction!');
              }else{
                 for(var x = 0; x<markers.length; x++){
                    if(newPreview == markers[x].transCount && mdNamePrev == markers[x].mdName){
                       infoWindow.close();
                       infoWindow.setContent(markers[x].content);
                       infoWindow.open(map, markers[x]);
                       markers[x].setAnimation(google.maps.Animation.BOUNCE);
                    }
                  }
              }
      }

      //nextInfo();
       function nextInfo(){
         var mdNameNext  = $('#getThisSalesman').text();
         var transCountNext = $('#getThisTransCount').text();
         $('#indicatorImg').html("Click here to view store image");
         $('.storeIc').show();
        //$('#nextMD').on('click', function(){
             var newNext = parseInt(transCountNext) + 1; 
             var newWindow;
             deleteBounce();
             for(var x = 0; x<markers.length; x++){
              if(newNext == markers[x].transCount && mdNameNext == markers[x].mdName){
                 //compDist = distance(markers[x].getPosition().lat(), markers[x].getPosition().lng(), markers[x].transCount);
                 infoWindow.close();
                 infoWindow.setContent(markers[x].content);
                 infoWindow.open(map, markers[x]);
                 markers[x].setAnimation(google.maps.Animation.BOUNCE);
                 //$('#distanceDisp').html(compDist);
                // map.setCenter(markers[x].getPosition());
                //map.setZoom(18);
              }
             }
       // });
      }
      function timeSpentFunc(timeSpent){
            
          if(timeSpent == undefined || timeSpent < 0){
            return timeSpent = 'N/A';
           }else if(timeSpent === '&ast;'){
              return 0;
           }else if(timeSpent === '1' || timeSpent == 0){
              return timeSpent = timeSpent + ' minute';

            }else if(timeSpent < 60){
              return timeSpent = timeSpent + ' minutes';
             
            }else{
              var hours = Math.floor( timeSpent / 60);          
              var minutes = timeSpent % 60;
              return timeSpent = hours+':'+minutes+' minutes';
            }
      }

      function convertTimeGap(timegap, transCount){
        if(transCount == 0){
          return timegap = 0;
        }else{
            if(timegap == undefined || timegap < 0){
              return timegap = 'N/A'; 
            }else if(timegap === '1' || timegap == 0){
              return timegap = timegap + ' minute';

            }else if(timegap < 60){
              return timegap = timegap + ' minutes';
             
            }else{
              var hours = Math.floor( timegap / 60);          
              var minutes = timegap % 60;
              return timegap = hours+':'+minutes+' minutes';
            }
        }
      }

        var lat1 = 0, lon1 = 0;
      function distance(lat2, lon2, transCount){
        if(transCount == 1){
          lat1 = lat2;
          lon1 = lon2;
          return 0.0 + ' km';
        }else{
          var R = 6371; // Radius of the earth in km
          var subLat = (lat2-lat1);  // Javascript functions in radians
          var dLat = subLat * Math.PI / 180;
          var subLong = (lon2-lon1);
          var dLon = subLong * Math.PI / 180; 
          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2); 
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          var d = R * c; // Distance in km

          lat1 = lat2;
          lon1 = lon2;
          var metreDist = 0;
          if(d < 1){
            metreDist = d/0.0010000;
            return metreDist.toFixed(2) + ' meters';
          }

          return d.toFixed(2) + ' km';
        }
      }
           var names=[];
            var ids=[];
            var salesmanID=[];
            var dateMPA=[];
            var color=[];
        function displayMPA (){

               $.ajax ({
                    url: "/geofencing/GeofencingAPI.php", 
                    type: "GET",
                    data: {"type":"get_all_mpa_json_"+user},
                    dataType: "html",
                    crossDomain: true,
                    cache: false,            
                    success: function(response){
                    // alert(response);
                      $("#res").html(response);
                      var ctr=0;
                      $(jQuery.parseJSON(response)).each(function() {   
                        mpa_header[ctr] = [];
                        mpa_header[ctr][0] = this.MPAID;
                        mpa_header[ctr][1] = this.MPANAME;
                        mpa_header[ctr][2] = this.AUTHORITYID;
                        mpa_header[ctr][3] = this.MPADATETIME;
                        mpa_header[ctr][4] = this.SALESMAN_ID;
                        mpa_header[ctr][5] = this.TERRCOLOR;
                        mpa_header[ctr][6] = this.MPASTATUS;
                        mpa_header[ctr][7] = [];
                        mpa_header[ctr][8] = this.COORDS;
                  

                        names.push(mpa_header[ctr][1]);
                        salesmanID.push(mpa_header[ctr][4]);
                        ids.push(mpa_header[ctr][0]);
                        dateMPA.push(mpa_header[ctr][3]);
                        color.push(mpa_header[ctr][5]);
                       
                        ctr++;
                      });

                      for(var i = 0; i < mpa_header.length; i++){
                          var coord_ary=[];
                          //alert("MPAID " + mpa_header[i][5]);
                          for(var j = 0; j < mpa_header[i][8].length; j++){
                            //alert("COORDS " + mpa_header[i][5][j].MPALATITUDE + " " +  mpa_header[i][5][j].MPALONGITUDE);
                            coord_ary.push({lat: Number(mpa_header[i][8][j].MPALATITUDE), 
                                            lng: Number(mpa_header[i][8][j].MPALONGITUDE)});
                          }
                          var boundary = coord_ary;

                          mpaPolygon = new google.maps.Polygon({
                              paths: boundary,
                              strokeColor: mpa_header[i][5],
                              strokeOpacity: 1,
                              strokeWeight: 2,
                              fillColor: mpa_header[i][5],
                              fillOpacity: 0,
                              editable: false,
                              draggable: false
                          });
                          //mpaPolygon.setMap(map);
                          mpa_polygon.push(mpaPolygon);
                      }

                      /*alert(lat + " " + lang);
                      // Construct the polygon.*/
                      for(var i = 0; i < mpa_polygon.length; i++){ 
                          mpa_polygon[i].setMap(map);
                          var n=names[i];
                          var id=ids[i];
                          var sID=salesmanID[i];
                          var date=dateMPA[i];
                          var terrcolor=color[i];
                         
                         
                          /*mpa_polygon[i].addListener('click', function(event){
                            $('#dispModal').modal('show');
                            var yehey = "MPA NAME";
                            $("#name-lbl").html(names[i]);
                          });*/
                            var det={
                                'id':id,
                                'sID':sID,
                                'name':n,
                                'datesaved':date,
                                'color':terrcolor
                            };
                            mpa_polygon[i].objInfo=det;
                            google.maps.event.addListener(mpa_polygon[i], 'click', function(event){
                                $('#dispModal').modal('show');
                                $("#name-lbl").html(this.objInfo.name);
                                $("#disp-salesman").html(this.objInfo.sID);
                                $("#date-created").html(this.objInfo.datesaved);
                                $("#terrcolor").html(this.objInfo.color);
                                territoryColor.style.color = this.objInfo.color;
                                $("#mpa-id").val(this.objInfo.id);
                            });
                      }
                    }
                })
           
        }//displayMPA

      function deleteBounce(){
        for (var i = 0; i < markers.length; i++) {
                markers[i].setAnimation(null);
              }
      }
        function setZoom(){
          var zoomOutDelimeter = map.getZoom();
          zoomOutDelimeter--;
          map.setZoom(zoomOutDelimeter);
        }

      $('#fullScreen').click(function() {
         $(".fs_icon", this).toggleClass("fa-compress fa-expand");
      });

      $('#setSatellite').click(function (){
         $(".sat_icon", this).toggleClass("fa-globe-americas fa-map");
      });

      function enterFullScreen(){
        $('#fullScreen').click(function (){
         $('#map div.gm-style button[title="Toggle fullscreen view"]').trigger('click');
        });
      }


      function addZoom(){
        var addZoom = map.getZoom();

        if(addZoom != 17){
          addZoom = 17;
        }
        map.setZoom(addZoom);
      }

      function subZoom(){
        var addZoom = map.getZoom();
        
        if(addZoom != 12){
          addZoom = 12;
        }
        map.setZoom(addZoom);
      }
      
      function zoomIn(){
        $('#zoomIn').click(function (){
          var zoomInDelimeter = map.getZoom();
          zoomInDelimeter++;
          map.setZoom(zoomInDelimeter);
        }); 
      }

      function zoomOut(){
        $('#zoomOut').click(function (){
          var zoomOutDelimeter = map.getZoom();
          zoomOutDelimeter--;
          map.setZoom(zoomOutDelimeter);
        }); 
      }

      function streetView(){
        $('#streetViewBtn').click(function (){
          openStreetView();
        });
      }

      function setSatellite(){
        $('#setSatellite').click(function (){
          if (map.getMapTypeId() != google.maps.MapTypeId.HYBRID) {
                map.setMapTypeId(google.maps.MapTypeId.HYBRID)
                map.setTilt(0); // disable 45 degree imagery
            }else if(map.getMapTypeId() != google.maps.MapTypeId.ROADMAP){
              map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
              map.setTilt(0); // disable 45 degree imagery
            }
        });
      }
      
      siteLocation();
      $('#mapUserControlCont').hide();
      var myLatlng, mapOptions, map, marker, mpaPolygon, contentString = "", mpa_coords = [[]];
      var mpa_header=[[]];  //DATA TO HOLD THE LONG AND LAT
      var mpa_polygon=[];
      var md_lang = [];
      var md_lat = []; 
      var myLatlng_buddy = [];
      var displayAllData;
      var heatmap, sitelat, sitelng, sitezoom;
      function init(){
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000 });
        
        function onSuccess(position) {
          var lat, lang, zoomLevel = 0;
          lat = parseFloat(sitelat);
          lang = parseFloat(sitelng);
          zoomLevel = parseInt(sitezoom);
          myLatlng = new google.maps.LatLng(lat, lang);
          mapOptions = {
            zoom: zoomLevel, 
            center: myLatlng,
            mapTypeId: 'roadmap',
            controlSize: 25,
            zoomControl: false,
            scaleControl: false,
            streetViewControl: true,
            fullscreenControl: false,
            mapTypeControl: false,
            styles: [
              {
                "featureType": "landscape.man_made",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.attraction",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.government",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.medical",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.place_of_worship",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.school",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.school",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.sports_complex",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.sports_complex",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              }
            ]
          }
          map = new google.maps.Map(document.getElementById('map'), mapOptions);
          AutocompleteDirectionsHandler(map)
          
          new mapBtnsContainer(map);
          new mapUserControlCont(map);

          enterFullScreen();
          zoomOut();
          zoomIn();
          streetView();
          setSatellite();

          map.addListener('dragend', function() {
              $('#mapUserControlCont').fadeIn();
          });

        map.addListener('click', function() {
            infoWindow.close(); 
            deleteBounce();    
            showmarkersback();
        });

         /*displayAllData = new IntervalTimer(function () {
           // dashBoard_direct_marker();
            storeTblValues();
            showNotif();
          }, 2000);*/

          }//onSuccess  
          
          function onError(error) {
              alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
          }//onError    

        google.maps.event.addDomListener(window, 'load', onSuccess);
      }//init

      function AutocompleteDirectionsHandler(map){
             this.map = map;
             var dashbaord_table = document.getElementById('outerContainer_id');
           // document.getElementById('outerContainer_id').style.marginLeft = "50px"; 
             this.map.controls[google.maps.ControlPosition.LEFT].push(dashbaord_table);

      }

      function mapBtnsContainer(map){
          this.map = map;
          var btn = document.getElementById('mapBtnsContainer');
          this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
      }

      function mapUserControlCont(map){
          this.map = map;
          var btn = document.getElementById('mapUserControlCont');
          this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(btn);
      }

      function restoreLoc(){
        $('#mapUserControlCont').fadeOut();
         for (var i = 0; i < markers.length; i++) {
                markers[i].setAnimation(null);
              }
          map.setCenter(myLatlng);
          map.setZoom(10);
          pasthisLat = 0;
          pasthisLong = 0;
      }

    $(window).bind("load", function () {
          $('#work-in-progress').fadeOut();
      });

    function myFunction() {
      var x = document.getElementById("myTopnav");
      if (x.className === "topnav") {
          x.className += " responsive";
      } else {
          x.className = "topnav";
      }
    } 

    function empt(){
        alert('Link is temporarily not available!');
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

     //$('[data-toggle="tooltip"]').tooltip();   

     $("#showGeofence").clickToggle(function() {   
        displayMPA();
    }, function() {
       if(mpa_polygon.length > 0){  
          for(var i = 0; i < mpa_polygon.length; i++){ 
            mpa_polygon[i].setMap(null);
          }
          mpa_polygon = [];
        }
    });

    $("#heatmapBtn").clickToggle(function() {   
       for(var x = 0; x < markers.length; x++){
        markers[x].setMap(null);
       }
        heatmap.setMap(map);
      }, function() {
        heatmap.setMap(null);
        for(var x = 0; x < markers.length; x++){
        markers[x].setMap(map);
       }
    });


    function imgError2(image) {
      image.onerror = "";
      image.src = "../img/salesmanPic.jpg";
      return true;
    }  

    function imgError(image) {
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
