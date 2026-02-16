var userID = localStorage.getItem('user_id');
var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("username");
var usertype = localStorage.getItem("usertype");
var site_lat = localStorage.getItem("latitude");
var site_long = localStorage.getItem("longitude"); 
var site_mapzoom = localStorage.getItem("mapzoom"); 
var s = localStorage.getItem("srvr");
var u = localStorage.getItem("usrnm");
var p = localStorage.getItem("psswrd");
var d = localStorage.getItem("dtbse");
var con_info = [s, p, u, d];

removeClasses();
getcompname();
//sessionUsage(usernm);           
determineUserType(usertype); 

/*if(user == null){
  window.location = "https://mybuddy.dynns.com";
}*/
  
function getcompname(){
  $.ajax ({
      url: "/nestle/connectionString/applicationipAPI.php",
      type: "GET",
      data: {"type":"GET_COMPANYNAME", "CONN":con_info},
      dataType: "json",
      crossDomain: true,
      cache: false,            
        success: function(r){ 
          $('#headingTitle').html(r[0].company.toUpperCase() +' / Dashboard');
        },error: function(jqXHR, textStatus, errorThrown) {
          alert('ERROR CONNECTING TO SERVER:\n Please Check your connection settings.');
        }
  });
}  

 var GlobalColor = "";
 if (typeof(Number.prototype.toRadians === "undefined")) {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
 }

 history.pushState(null, null, document.URL);
 window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
 });

  // showNotif();

  // $(document).on('click', '#dropThisDown', function(){
  //   $('.count').html('');
  //    showNotif('yes');
  // });

  $('#isolationBox').click(function(){
      if($(this).prop("checked") == true){
          alert("Checkbox is checked.");
      }
      else if($(this).prop("checked") == false){
          alert("Checkbox is unchecked.");
      }
  });

  $('.deviationcont').removeClass('hidden');
  $('.deviationcont').hide();
  $('#categoryTable').hide();
  $('#selectedCategoryProd').hide();
  function removeClasses(){
    $('#categoryTable').removeClass('hidden');
    $('#selectedCategoryProd').removeClass('hidden');
  }
  
  var dispCurrentTime = new IntervalTimer(function () {
        DisplayCurrentTime();
        //check_user_usage_stat();
        }, 500);  

  datePickerDashboard();

  /*window.addEventListener("beforeunload", function (e) {
    console.log('close or unload');
  });*/
  function printDSS(){
    $('#dssmodal').modal('show');
  }

  function check_user_usage_stat(){
     $.ajax ({
        url: "web/databaseApi.php",
        type: "GET",
        data: {"type":"STATUS_ACCOUNT_CHECKER", "userID":userID},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
          var rstatHolder = r[0].AISONLINE;
          if(rstatHolder == '2'){
            dispCurrentTime.pause();

            var dialog = bootbox.dialog({
                title: '<h5 class="text-danger">SESSION ENDED</h5>',
                message: '<p>Sorry, your session has been disconnected. Another user is currently using your account.</p>'
            });
                        
            dialog.init(function(){
                setTimeout(function(){
                    localStorage.removeItem('username');
                    update_user_prev();
                    window.location.href = "https://mybuddy.dynns.com";
                }, 1000);
            });
          }
        }
      });
  }

  function update_user_prev(){
    var userid = localStorage.getItem('user_id');
      $.ajax ({
          url: "web/databaseApi.php",
          type: "GET",
          data: {"type":"LOGIN_CURR_USER", "userID":userid},
          dataType: "json",
          crossDomain: true,
          cache: false,            
            success: function(r){ 
              console.log(r + ' user logout');
            }
      });
  }

  dsspicker();
  var dssdate;
  function dsspicker(){
    $('#datestring').html('Pick a date');
    $('#dssdatePicker').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {
      dssdate = start.format('YYYY-MM-DD');
      var today = moment().format('YYYY-MM-DD');
      $('#datestring').html(dssdate);
    });
  }

  function execprintDSS(){
    if(dssdate == 'undefined' || dssdate == null){
      alert('Please select a date.');
    }else{
      localStorage.setItem('DSSdateSelected', dssdate);
      window.open('https://mybuddy.dynns.com/SFA/print-dashboard-dailysales.html', '_blank');
    }  
  }

  var realTimeChecker = 1;
  function datePickerDashboard(){
    $('#datePicker').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {
      var selectedDate = start.format('YYYY-MM-DD');
      $('#lateDateHolder').val(selectedDate);
      var today = moment().format('YYYY-MM-DD');
      $('#categoryTable').hide();
      if(selectedDate == today){
        //$('#lateSalesman').show();
        forceLoadDashboard();
        forceLoadHtmlDashboard();

        lateSalesman();
        adjsutMap();
        dispCurrentTime.resume();
        displayAllData.resume();
        realTimeChecker = 1;
      }else{
        forceLoadHtmlDashboard();
        realTimeChecker = 0;
        dispCurrentTime.pause();
        displayAllData.pause();
        //$('#lateSalesman').hide();

        $('#dashboardDisplay').html('');
        
        viewPrevious_markerDetails(selectedDate);
        viewPrevious_tableDetails(selectedDate);
        viewPrevious_totalSales(selectedDate);
        viewPrevious_getLate(selectedDate);
        $('#time').html('<b>'+dateToTextSelected+'</b> | PREVIOUS DATA | ' + selectedDate);
      }
      
    });
  }

  var dateToTextSelected;
  function viewPrevious_markerDetails(date){
    $('.loading-table').show();
    $('.loading-table').html('<h5><i class="fa fa-spin fa-spinner"></i> Retreving data..</h5>');
      $.ajax ({
        url: "/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {"type":"displayPreviousDash", "dateSelected":date, "CONN":con_info},
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
          success: function(data){ 
            removeProdutMarker();
            DeleteMarkers();
              if(data == 0){
                $('.loading-table').html('<h5><i class="fas fa-exclamation-circle"></i> No data found on '+date+'</h5>');
              }else{
                dateToTextSelected = data[0].daysToText;
               $('.loading-table').html('');
               $('.loading-table').hide();
               $("#dashboardDisplay").show();
                for(var x=0; x<data.length; x++){
                  checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
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
                          url:'https://mdbuddyonline.access.ly/ideliverapi/api/index.php/getMarker/'+data[x].transCount+'/'+data[x].mdColor.substr(1),
                          scaledSize: new google.maps.Size(32, 36)
                        }
                    });

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

                }//end for  
              }
             infoWindow = new google.maps.InfoWindow;
          }
        });
  }

  function viewPrevious_tableDetails(date){
    $("#dashboardDisplay").html('');
      $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"displayPreviousDash_tableDetails","dateSelected":date, "CONN":con_info},
            dataType: "html",
            crossDomain: true,
            cache: false,            
              success: function(response){ 
               $("#dashboardDisplay").html(response);  
              }
          });
  } 

   function viewPrevious_totalSales(date){
       $.ajax ({
        url: "/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {"type":"displayPreviousDash_totalSales", "dateSelected":date, "CONN":con_info},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
          success: function(r){ 
            var sales = r.sales;
            var salesmanCount = r.salesmanCount;
             $('#total').html('TOTAL (' +salesmanCount+ ') : ' +sales);
          }
      });
   }

   var prevremainingHolder;
   function viewPrevious_getLate(date){
      $.ajax ({
          url: "/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {"type":"previous_getLate", "dateSelected": date,"CONN":con_info},
          dataType: "json",
          crossDomain: true,
          cache: false,
          async: false,
          success: function(response){ 
            $("#lateSalesman").html('');
            prevremainingHolder = response;
              var txt = "<tr>";
              for(var i=0;i<response.length;i++){
                if(i < 22){
                  //jQuery('#early').attr('data-tooltip', data[x].salesmanName);
                  if(response[i].alert == 'EARLY'){
                      txt += "<td class='expand'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                      "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                      "\" id='early' alt='"+response[i].salesmanName+"' src='data:image/jpeg;base64,"+response[i].thumbnail+"' onError='imgError(this)'/></td>";
                    }else{
                      txt += "<td class='expand'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                      "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\",  \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                      "\" id='late' alt='"+response[i].salesmanName+"' src='data:image/jpeg;base64,"+response[i].thumbnail+"' onError='imgError(this)'/></td>";
                      //src='../img/salesman_"+user+"/"+response[i].mdCode+".jpg' onError='imgError(this)''
                   }
                }else{

                  var rsalesman = response.length - 22;
                  txt += "<td class='expand'><span class='remainingSalesman' onclick='remaining(\""+response+"\")'>"+rsalesman+"+</span></td>";
                  //alert('salesmanCount: ' + response.length + ' remaining: ' + rsalesman);
                  break;
                }
              }
              txt += "</tr>";
                if(txt != ""){
                    $("#lateSalesman").append(txt);
                     restoreLoc();
                }
              }
        });
   }

  function flip1() {
      $(".container_salesman").animate({width:'toggle'},350);
      $('.arrow-side-icon').toggleClass('fa-angle-right');
      $('.arrow-side-icon-toggleZoom').toggleClass('fa-angle-right');
  }

  function flip2() {
      $(".container_productCat").animate({width:'toggle'},350);
      $('.arrow-side-icon2').toggleClass('fa-angle-right');
      //$('#categoryTable div:not(.arrow-side2)').hide();
  }  

  $('#navDrop').click(function() {
    $("i", this).toggleClass("glyphicon-menu-up glyphicon-menu-down");
  });

  function defaultStore(image) {
    image.onerror = "";
    image.src = "../img/no-image.png";
    return true;
  } 

  function showSalesmanOnMap(mdCode){
    //var salesmanCode = mdCode.substring(0, 4);
    var salesmanCode = mdCode;
    console.log(salesmanCode);
    deleteBounce();
    for(var x = 0; x < markers.length; x++){
      if(salesmanCode == markers[x].id && markers[x].transCount == 1){
        $('#prevMD').hide();
            displayAllData.pause();
            
            markers[x].setAnimation(google.maps.Animation.BOUNCE);
            map.setCenter(markers[x].getPosition());
            map.setZoom(13);
            infoWindow.close();
            infoWindow.setContent(markers[x].content);
            infoWindow.open(map, markers[x]);
         }
    }
  }

   function hitme(marker_id, markerObj){
      var salesman, mdCode;

      //displayAllData.pause();
      $(".showSalesman").click( function() {
         $('#prevMD').css("color", "white");

         salesman = $(this).closest('td').text();
         mdCode = salesman.substring(1, 5);
         markerObj.setAnimation(null);

          if(mdCode == marker_id && markerObj.transCount == 1){
            displayAllData.pause();
            markerObj.setAnimation(google.maps.Animation.BOUNCE);
            map.setCenter(markerObj.getPosition());
            map.setZoom(13);
            infoWindow.close();
            infoWindow.setContent(markerObj.content);
            infoWindow.open(map, markerObj);
         }
      });
   }


   function locateSalesman_enroach(lattitude, longitude){

     var latlang = lattitude +' '+ longitude;
     for(var x = 0; x < markers.length; x++){
      markers[x].setAnimation(null);
        if(markers[x].loc == latlang){
          markers[x].setAnimation(google.maps.Animation.BOUNCE);
         // map.setCenter(markers[x].getPosition());
          map.panTo(markers[x].position);
          map.setZoom(13);        
        }
     }
   }

  
  function changeColor(){
    bootbox.confirm("This action would generate new salesman color representation. Do you want to proceed?", 
      function(result){
       if(result == true){
         var dialog = bootbox.dialog({
                        message: '<p class="text-center"><i class="fa fa-spin fa-spinner"></i> Preparing new sets of color please wait..</p>',
                        closeButton: false
                    });
         var ajaxTime= new Date().getTime();
         var totalTime= 0;
           $.ajax ({
                url: "/nestle/connectionString/applicationipAPI.php",
                type: "GET",
                data: {"type":"CHANGE_MARKER_COLOR", "CONN":con_info},
                dataType: "html",
                crossDomain: true,
                cache: false,            
                  success: function(response){ 
                   location.reload();
                  }
              }).done(function () {
                   totalTime = new Date().getTime()-ajaxTime;
                   dialog.init(function(){
                        setTimeout(function(){
                            dialog.modal('hide');
                        }, totalTime);
                    });        
                });
       }
     });

    }
    function movePoint(lat, lng){
        var first;
        var second;
        first = lat;
        second = lng;

        if(first == lat && second == lng){
          console.log('match');
        }else{
          console.log('did not match');
        }
    }

    function newlat(lat, metre){
      var deg = lat;
      var x = lat % deg;
      var y = x * 60;
      var min = y;
      var x1 = y % min;
      var sec = x1 * 60;
      var sec1 = metre/30.84576;

      sec = sec + sec1;

      return deg + (min/60) + (sec/3600); 

    }
    
    //var lat1, lon1;
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

    function remvDubTables(){
         var seen = {};
         $('#dashboardDisplay tr ').each(function () {
             var txt = $("td:first-child", $(this)).text();
             if (seen[txt]) $(this).remove();
             else seen[txt] = true;
         });
    }

     function remvDubTables_image(){
         var seen = {};
         $('#lateSalesman tr ').each(function () {
             var txt = $("td:first-child", $(this)).text();
             if (seen[txt]) $(this).remove();
             else seen[txt] = true;
         });
    }

    var delimeter = 0;
    function dashBoardData(){
           $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"DASHBOARD_SALESMAN_DATA_TABLE", "CONN":con_info},
            dataType: "html",
            crossDomain: true,
            cache: false,            
              success: function(response){ 
               $("#dashboardDisplay").html(response);
               
               var count = $('#dashboardDisplay tr').length;
               if(count != delimeter){
                $('#lateSalesman tr').remove();
                lateSalesman();
               
                delimeter = count;
               }
              }//success
          });
      }

      function forceLoadHtmlDashboard(){
        //$("#lateSalesman").html('');
        loadSalesmanCategory();
        $('#dispModal_deviation').hide();
        $('#salesmanCategory').show();
      }

      function forceLoadDashboard(){
        //DeleteMarkers();
        dashBoardData();
        dashBoard_direct_marker();
        productCategory();
        //loadSalesmanCategory();
      }

      function checkTimeDeviation(hour, minute){
        if (hour > 7){
          return 'LATE';  
        }else{
          return 'EARLY';       
        }
      }
      var greatest = 0;
      function storeTblValues()
      {
          var salesBased = 0;
          var basedSalesForRefresh = 0;
           $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"TOTAL_SALES_DASHBOARD_DATA_TABLE_LOCAL", "CONN":con_info},
            dataType: "json",
            crossDomain: true,
            cache: false,          
              success: function(res){ 
                $("#ifEmptyIndi").hide();
               if(res[0].salesman == 0){
                 $('.loading-table').html('<h5>No transaction found as of now.</h5>');
                }else{
                  var sales = parseFloat(Number(res[0].total).toFixed(2));
                  var salesman = res[0].salesman;
                  var indicator = res[0].indicator;
                  $('#total').html('Total ('+salesman+') : &#8369; ' +sales.toLocaleString());
                    salesBased = indicator;
                    if(selecterChecker == 2){
                      if(salesBased != greatest){
                        if(salesBased > greatest){
                           // DeleteMarkers();
                            dashBoardData();
                            dashBoard_direct_marker();
                            productCategory();
                            loadSalesmanCategory();
                          }else{
                            loadSalesmanCategory();
                            DeleteMarkers();
                            dashBoard_direct_marker();
                            productCategory();
                          }
                          // showNotif();
                          greatest = salesBased;
                     }//second if
                    }
                 }//main else
              },//success
               error: function(jqXHR, textStatus, errorThrown) {
                  //$('.loading-table').html(jqXHR.responseText);
                  $('.loading-table').html('<i class="fa fa-exclamation-circle"></i> ERROR: COULD NOT CONNECT TO SERVER!');
                  
               }
          });

       }

    function productCategory(){
      $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"dashBoardData_product", "CONN":con_info},
            dataType: "JSON",
            crossDomain: true,
            cache: false,          
              success: function(response){ 
                $('#cateogoryDataTable').html(response.tableDetails);
                $('.footerDetails').html(response.footerDetails);
              }//success
          });
    }
    
  var brandMarker;
   function brand(product, contriBution, totalSales, color){
      $('#categoryTable').hide();
      $('#selectedCategoryProd').show();
      $('#prodSelName').html('<i class="fa fa-shopping-cart cartSel"></i> '+ product);
      $('.cartSel').css("color", color);
      $('#prodSelSales').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
      $('#prodSelPercent').html('');
         $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"getProduct", "productName":product, "CONN":con_info},
            dataType: "html",
            crossDomain: true,
            cache: false,     
            async: false,  
              success: function(response){ 
                 removeProdutMarker();
                if(response == 0){
                    console.log('empty dashboard!');
                  }else{
                    $('#prodSelSales').html('SALES: ' + totalSales);
                    $('#prodSelPercent').html('CONTRIBUTION: ' + contriBution + '%');
                    var data = JSON.parse(response); 
                    for(var x=0; x<data.length; x++){
                        marker = new google.maps.Marker({
                          map: map,
                          position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                          //icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|'+data[x].BrandColor.substr(1)
                          icon:{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 7,
                            fillColor: data[x].BrandColor,
                            fillOpacity: 0.4,
                            strokeWeight: 0
                          }
                        });
                        productMarker.push(marker);
                      }
                    }
              }//success
          });
   }


    function computeContri(){
        var sum = 0;
          $(".contriPer").each(function() {

              var value = $(this).text();
              // add only if the value is number
              if(!isNaN(value) && value.length != 0) {
                  sum += parseFloat(value);

              }
          });
         return sum;
      }

      function computeTAmount(){
        var sum = 0;
          $(".tAmount").each(function() {

              var value = $(this).text();
              // add only if the value is number
              if(!isNaN(value) && value.length != 0) {
                  sum += parseFloat(value);

              }
          });
         return sum;
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
  
   //hide dashboard table details
   $("#dashboardDisplay").hide();
    var marker, infoWindow;
    function dashBoard_direct_marker(){
      var compDist = 0;
      var ajaxTime= new Date().getTime();
      var totalTime= 0;

           $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"DASHBOARD_MARKERS", "CONN":con_info},
            dataType: "html",
            crossDomain: true,
            cache: false,
            success: function(response){ 
              removeProdutMarker();
              if(response == 0){
                    console.log('empty dashboard!');
              }else{

                $("#dashboardDisplay").fadeIn();
                
                
                var data = JSON.parse(response); 
                for(var x=0; x<data.length; x++){

                  checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
                  compDist = distance(data[x].latitude, data[x].longitude, data[x].transCount);
                  // src='data:image/jpeg;base64,"+data[x].thumbnail+"'
                   var contentString = "<div style='margin: 0 auto;'><div class='modal-header' style='text-align: center;'>"+
                        "<div class=''><img class='salesmanPic' alt='salesmanPic' style='border: solid 3px "+data[x].mdColor+"' src='img/erw.jpg' onError='imgError(this)'/>"+
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
                              "<div id='transaction-details-holder'>"+
                              /*"<table class='table table-transact'>"+
                                "<thead>"+
                                  "<tr>"+
                                      "<td>StockCode</td>"+
                                      "<td>Description</td>"+
                                      "<td>Quantity</td>"+
                                      "<td>Amount</td>"+
                                  "</tr>"+
                                "</thead>"+
                                "<tbody id='marker-details'></tbody></table>*/"</div>"+
                            "</div>";

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
                        url:'https://mdbuddyonline.access.ly/ideliverapi/api/index.php/getMarker/'+data[x].transCount+'/'+data[x].mdColor.substr(1),
                        scaledSize: new google.maps.Size(32, 36)
                      }
                      //icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+data[x].transCount+'|'+data[x].mdColor.substr(1)+'|FAFAFA'
                    });

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

                }//end for  

                 google.maps.event.addListener(infoWindow, 'closeclick', function() {  
                        displayAllData.resume();
                    }); 
              }
            }/*,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            var botboxMsg = '<b style="color: red;">Error in fetching salesman markers:</b>' + XMLHttpRequest.responseText;
            bootbox.alert(botboxMsg);
           }*/
          });

        infoWindow = new google.maps.InfoWindow;
      }//end direct dashboard colpal


    function showCustImage(custID){
      $('.storeImageTable').remove();
      $("#transaction-details-holder table").remove();
      $('#indicatorImg').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
      $('.storeIc').hide();
       var ajaxTime= new Date().getTime();
       var totalTime= 0;
        $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
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
                    url: "/nestle/connectionString/applicationipAPI.php",
                    type: "GET",
                    data: {"type":"getTransactionDetails", "transactionID":transactionID,"CONN":con_info},
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

    function deleteBounce(){
      for (var i = 0; i < markers.length; i++) {
              markers[i].setAnimation(null);
            }
    }

    function prevInfo(){
      $('#indicatorImg').html("Click here to view store image");
      $('.storeIc').show();
      var mdNamePrev  = $('#getThisSalesman').text();
      var transCountPrev = $('#getThisTransCount').text();
      //$('#prevMD').on('click', function(){
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
                      //$('#distanceDisp').html(compDist);
                     //map.setCenter(markers[x].getPosition());
                     //map.setZoom(18);
                  }
                }
            }
      //});
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

    function remvDubTables_icon(){
         var seen = {};
         $('#notifs-icon-div tr').each(function () {
             var txt = $("td:first-child", $(this)).text();
             if (seen[txt]) $(this).remove();
             else seen[txt] = true;
         });
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
              $("#notifs-icon-div").html(response.notification);
                if(response.unseen_notification > 0)
                {
                 $('.count').html(response.unseen_notification);
                }
              }
          });
      }

     // DeleteMarkers();
      var markers = [];
       function DeleteMarkers() {
        //Loop through all the markers and remove
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
       }

       function getDate(){
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();

          if(dd<10) {
              dd = '0'+dd
          } 

          if(mm<10) {
              mm = '0'+mm
          } 

          today =  yyyy+'-'+ mm + '-' + dd;
          return String(today);

        }

      var Longitude = [];
      var Latitude = [];
      var salesmanName=[];
      var customer = [];
      var names=[];
      var ids=[];
      var salesmanID=[];
      var dateMPA=[];
      var color=[];
      var territoryColor = document.getElementById("terrcolor");
      function displayMPA (){
         var dialog = bootbox.dialog({
                        message: '<p class="text-center"><i class="fa fa-spin fa-spinner"></i> Rendering geofence on map please wait...</p>',
                        closeButton: false
                            });
                     var ajaxTime= new Date().getTime() - 2;
                     var totalTime= 0;
             $.ajax ({
                 url: "/geofencing/GeofencingAPI.php", 
                  type: "GET",
                  data: {"type":"get_all_mpa_json_"+user},
                  dataType: "html",
                  crossDomain: true,
                  cache: false,            
                  success: function(response){
                  // alert(response);
                  if(response == 0){
                    dialog.modal('hide');
                    alert('There are no geofence drawn as of this moment!');
                  }else{

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
                              strokeWeight: 3,
                              fillColor: mpa_header[i][5],
                              fillOpacity: 0.3,
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
                  }//main else close tag
                  
                  }//succes close tag
              }).done(function () {
                                 totalTime = new Date().getTime()-ajaxTime;
                                dialog.init(function(){
                                      setTimeout(function(){
                                          dialog.modal('hide');
                                      }, totalTime);
                                });
                                 
                });//ajax close tag
         
      }//displayMPA

      var incruchment = [];
      function checkWithinMPA (latitude, longitude, salesman, sales, date, customer, refno){
            var isOutside; 
            var latlng = new google.maps.LatLng(latitude,longitude);
            
            for(var i = 0; i < mpa_polygon.length; i++){
                if(google.maps.geometry.poly.containsLocation(latlng, mpa_polygon[i])){ 
                  if(salesman != salesmanID[i]){
                    saveEncroachment(salesmanID[i],salesman, sales, date, customer, latitude, longitude, names[i], refno);
                  }
                }
            }//for loop end
           
          }//checkWithinMPA

      function saveEncroachment(boundOwner, salesman, sales, date, customer, lat, long, boundary, refno){
        var longlat = lat+','+long;
         $.ajax({
               url: "../geofencing/GeofencingAPI.php",
               type: "GET",
               data: {"type":"encruchment_Save_"+user, "boundOwnerEncruch": boundOwner,"salesmanEncruch":salesman, "salesEncruch": sales, "dateEncruch": date,
                       "customerEncruch": customer, "lat":lat, "long":long, "boundaryEncruch":boundary, "documentNo":refno},
               dataType: "html",
               crossDomain: true,
               cache: false,            
                success: function(response){  
                  console.log(response.trim());
                  if(response.trim() == 'Successfuly saved.'){
                    var a = new Audio('js/notif-sound/to-the-point.mp3'); 
                    a.play(); 
                    Push.create("Encroachment Alert",{
                      body: salesman + ' transacted outside his boundary!',
                      icon: 'img/mdlogo_web.png',
                      timeout: 10000,
                      onClick: function () {
                          window.focus();
                          this.close();
                      }
                    });
                   
                  }
                }    
         });
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
       if(user == 'bohol' || user == 'number1seller'){
          //if(bybrandchecker == 0){
            $("#scrollHolder").toggleClass("scroll scrollDiable");
            //$("#arrIconHolder").toggleClass("arrow-side-icon arrow-side-icon-toggleZoom");
         /* }else if(bybrandchecker == 1){
            $("#scrollHolder").removeClass("scrollDiable");
            $("#arrIconHolder").removeClass("arrow-side-icon-toggleZoom");
            $("#scrollHolder").addClass("scroll");
            $("#arrIconHolder").addClass("arrow-side-icon");
          }*/
          
        }
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
  

  document.addEventListener('fullscreenchange', exitHandler);
  document.addEventListener('webkitfullscreenchange', exitHandler);
  document.addEventListener('mozfullscreenchange', exitHandler);
  document.addEventListener('MSFullscreenChange', exitHandler);

  function exitHandler() {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        $("#scrollHolder").addClass("scroll");
        $("#scrollHolder").removeClass("scrollDiable");
        $(".fs_icon", this).toggleClass("fa-compress fa-expand");
      }
  }  

  siteLocation();
  var myLatlng, mapOptions, map, marker, mpaPolygon, contentString = "", mpa_coords = [[]],
  sitelat, sitelng, sitezoom;
  var mpa_header=[[]];  //DATA TO HOLD THE LONG AND LAT
  var mpa_polygon=[];
  var md_lang = [];
  var md_lat = []; 
  var myLatlng_buddy = [];
  var displayAllData;
  var zoomPerSite;
  $('#mapUserControlCont').hide();
  function init(){
     navigator.geolocation.getCurrentPosition(onSuccess,onError,{timeout:6000});

     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

           //saveLoginData(pos.lat, pos.lng);

        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
          alert('unable to find location');
      }


      function onSuccess(position) {
        var lat, lang;
        lat = parseFloat(sitelat);
        lang = parseFloat(sitelng);
        zoomPerSite = parseInt(sitezoom);
        
        myLatlng = new google.maps.LatLng(lat, lang);
        mapOptions = {
          zoom: zoomPerSite, 
          center: myLatlng,
          mapTypeId: 'roadmap',
          controlSize: 25,
          zoomControl: false,
          scaleControl: false,
          streetViewControl: true,
          fullscreenControl: false,
          mapTypeControl: false,
          styles: [{
                "featureType": "landscape.natural",
                "stylers": [
                    { "visibility": "off" }
                ]
            },{
                "featureType": "landscape.natural.landcover",
                "stylers": [
                    { "visibility": "on" }
                ]
            }]
        }
    
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        new mapBtnsContainer(map);
        new mapUserControlCont(map);
        new deviationModal(map);
        new deviation(map);
        new AutocompleteDirectionsHandler(map);

        enterFullScreen();
        zoomOut();
        zoomIn();
        streetView();
        setSatellite();

        map.addListener('dragend', function() {
            $('#mapUserControlCont').fadeIn();
        });

        map.addListener('tilesloaded', function() {
            $('#mapUserControlCont').fadeIn();
        });
         map.addListener('click', function() {
          if(realTimeChecker == 1){
             if(selecterChecker == 2){
              if(bybrandchecker == 0){
                displayAllData.resume();
              }else{
                displayAllData.pause();
              }
              
           }else if(selecterChecker == 1){
              $('#selectedCategoryProd').hide();
              $('#categoryTable').show();
              showAllProduct();
           }
          }else{
            console.log('not realtime');
          }
          
             infoWindow.close(); 
              deleteBounce();    
          });
       
      
       displayAllData = new IntervalTimer(function () {
         // dashBoard_direct_marker();
          storeTblValues();
        }, 2000);            

        }//onSuccess  
        
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n' +
                  'Kindly reload your browser.');
        }//onError    

      
      google.maps.event.addDomListener(window, 'load', onSuccess);
    }//init
    function mapBtnsContainer(map){
        this.map = map;
        var btn = document.getElementById('mapBtnsContainer');
        this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
    }

    function deviationModal(map){
          this.map = map;
          var dispDeviation = document.getElementById("dispModal_deviation");
          this.map.controls[google.maps.ControlPosition.LEFT].push(dispDeviation);
    }

    function deviation(map){
         var btn = document.getElementById('lateSalesmanCont');
         map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(btn);
    }

   
    function restoreLoc(){
      $('#mapUserControlCont').fadeOut();
       deleteBounce();
        map.setCenter(myLatlng);
        map.setZoom(zoomPerSite);
        pasthisLat = 0;
        pasthisLong = 0;
    }

    function AutocompleteDirectionsHandler(map){
           this.map = map;
           var dashbaord_table = document.getElementById('outerContainer_id');
         // document.getElementById('outerContainer_id').style.marginLeft = "50px"; 
           this.map.controls[google.maps.ControlPosition.LEFT].push(dashbaord_table);

    }

    function mapUserControlCont(map){
        this.map = map;
        var btn = document.getElementById('mapUserControlCont');
        this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(btn);
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

     $(window).bind("load", function () {
      $('#work-in-progress').fadeOut();
  });

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
     
   $('#geofenceBox').click(function(){
      if($(this).prop("checked") == true){
         dashBoard_direct_marker();
         displayMPA();
      }
      else if($(this).prop("checked") == false){
        if(mpa_polygon.length > 0){  
          for(var i = 0; i < mpa_polygon.length; i++){ 
            mpa_polygon[i].setMap(null);
          }
          mpa_polygon = [];
        }
      }
    });

   $("#hideDashbordTab").clickToggle(function() {   
      $('#hideDashbordTab').text('Show Table');
      $(".outerContainer").hide();
    }, function() {
      $('#hideDashbordTab').text('Hide Table');
       $(".outerContainer").show();
  });


   /*$("#productBtn").clickToggle(function() {   
      //$('#productBtn').text('Hide Category');
      $('#salesmanCategory').slideUp();
      $('#categoryTable').show();
      $('.loading-table').show();
      DeleteMarkers();
      restoreLoc();
      showAllProduct();
      displayAllData.pause();
    }, function() {
      $('.loading-table').show();
      $("#salesmanCategory").slideDown();
      $('#categoryTable').hide();
      removeProdutMarker();
      dashBoard_direct_marker();
      restoreLoc();
      displayAllData.resume();
  });*/
  var selecterChecker = 2;
  
  $('#salesmanBtn').hide();

  $("#categoryBox").prop("checked", false);
  $("#geofenceBox").prop("checked", false);
  
  $('#categoryBox').click(function(){
    $('#dispModal_deviation').hide();
      if($(this).prop("checked") == true){
        selecterChecker = 1;
        $('#lateSalesman').hide();
       
        displayAllData.pause();

        $('.loading-table').hide();
        $('#salesmanCategory').slideUp();
        $('#categoryTable').show();
        
        $('#salesmanBtn').show();
        $('#productBtn').hide();

         DeleteMarkers();
         restoreLoc();
         showAllProduct();
      }
      else if($(this).prop("checked") == false){
         selecterChecker = 2
        $('#selectedCategoryProd').hide();
        $('#lateSalesman').show();
        $("#dashboardDisplay").hide();

        displayAllData.resume();
        $('.loading-table').show();
        $("#salesmanCategory").slideDown();
        $('#categoryTable').hide();
        
        $('#salesmanBtn').hide();
        $('#productBtn').show();

        removeProdutMarker();
        dashBoard_direct_marker();
        restoreLoc();
      }
  });

   $('.closeBtn').click(function (){
      $('#selectedCategoryProd').hide();
      $('#categoryTable').show();
      showAllProduct();
   });

   $('.categoryProp table thead').click(function (){
      removeProdutMarker();
      showAllProduct();
   });

   /*?$('.fixedHead').click(function (){
        DeleteMarkers();
        dashBoard_direct_marker();
   });*/
   function upperCaseFirstLetter(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function lowerCaseAllWordsExceptFirstLetters(string) {
      return string.replace(/\w\S*/g, function (word) {
      return word.charAt(0) + word.slice(1).toLowerCase();
      });
  }
   
   //loadSalesmanCategory();
   var bybrandchecker = 0;
   var displaySalesmanDataByCategory;
   function loadSalesmanCategory(){
     var date = $('#lateDateHolder').val();
     $('.salesmanCatIndi').html('All Salesman <span class="caret"></span>');
      $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"loadSalesmanCat", "CONN":con_info, "date":date},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false,
            success: function(r){ 
              var cont = '';
              cont = '<li><a href="#" class="selectCust">All</a></li>';
              for(var x = 0; x < r.length; x++){
                cont += '<li><a href="#" class="selectCust">'+r[x].Type+'</a></li>';
              }

              $('.selectCustDD').html(cont);
            }
          });

      $('.selectCustDD li a').on('click', function (){
          var selected = $(this).text();
          var sel_conv = $.trim(selected);
          //if(selected == "All") ? displayAllData.resume() : displayAllData.pause();
          var menu_conv = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(selected));
          $('.salesmanCatIndi').html(menu_conv + ' Salesman <span class="caret"></span>');

          $("#dashboardDisplay").hide();
          $('#total').hide();
          $('.loading-table').show();
          removeProdutMarker();
          restoreLoc();
          
          getLateBySalesmanCat(sel_conv);
          showSelectedSalesman(sel_conv);
          showSalesmanByBrand(sel_conv);
          showTotalSalesByBrand(sel_conv);
          DeleteMarkers();

          displayAllData.pause();
          if(sel_conv == 'All'){
            //displaySalesmanDataByCategory.pause();
            displayAllData.resume();
            bybrandchecker = 0;

            /*if(user == 'bohol' && zoomIndicator == 'zoom'){
              $("#scrollHolder").toggleClass("scroll scrollDiable");
              $("#arrIconHolder").toggleClass("arrow-side-icon arrow-side-icon-toggleZoom");
            }*/
          }else{
            /*if(user == 'bohol' && zoomIndicator == 'notzoom'){
              $("#scrollHolder").toggleClass("scroll scrollDiable");
              $("#arrIconHolder").toggleClass("arrow-side-icon arrow-side-icon-toggleZoom");
            }*/
             displayAllData.pause();
             /*displaySalesmanDataByCategory = new IntervalTimer(function () {
              showSelectedSalesman(sel_conv);
              showSalesmanByBrand(sel_conv);
              showTotalSalesByBrand(sel_conv);
              }, 2000);*/
            bybrandchecker = 1;
            //FOR DASHBOARD TABLE SIZING
             /*$("#scrollHolder").removeClass("scrollDiable");
             $("#arrIconHolder").removeClass("arrow-side-icon-toggleZoom");
             $("#scrollHolder").addClass("scroll");
             $("#arrIconHolder").addClass("arrow-side-icon");*/
          }
      });

   }

   function showSelectedSalesman(brand){
      var date = $('#lateDateHolder').val();
      $.ajax ({
          url: "/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {"type":"filterSalesmanByCategory", "brand": brand, "CONN":con_info, "date":date},
          dataType: "html",
          crossDomain: true,
          cache: false,
          async: false,
          success: function(r){ 
             $("#dashboardDisplay").html(r);
          }
        });
   }

   function showTotalSalesByBrand(brand){
        var date = $('#lateDateHolder').val();
        $.ajax ({
          url: "/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {"type":"total_salesman_per_category", "brand": brand, "CONN":con_info, "date":date},
          dataType: "json",
          crossDomain: true,
          cache: false,
          async: false,
          success: function(r){ 
             $('#total').html('Total ('+r[0].salesman+') : &#8369; ' +r[0].total.toLocaleString());
          }
        });
   }

   function getLateBySalesmanCat(brand){
        var date = $('#lateDateHolder').val();
        //$("#lateSalesman").html('<tr><td class="expand loadingsalesman"><i class="fa fa-spin fa-spinner"></i></td></tr>');
        $.ajax ({
          url: "/nestle/connectionString/applicationipAPI.php",
          type: "GET",
          data: {
                  "type":"getLateBySalesmanCat",
                  "salesmanCat": brand,
                  "date":date,
                  "CONN":con_info
                },
          dataType: "json",
          crossDomain: true,
          cache: false,
          async: false,
          success: function(response){ 
            $('.mobileNoCont').show();
            $("#lateSalesman").html('');
             var txt = "<tr>";
              for(var i=0;i<response.length;i++){
                  if(response[i].alert == 'EARLY'){
                      txt += "<td class='expand'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                      "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                      "\" id='early' alt='"+response[i].salesmanName+"' src='data:image/jpeg;base64,"+response[i].thumbnail+"' onError='imgError(this)'/></td>";
                    }else{
                      txt += "<td class='expand'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                      "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\",  \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                      "\" id='late' alt='"+response[i].salesmanName+"' src='data:image/jpeg;base64,"+response[i].thumbnail+"' onError='imgError(this)'/></td>";
                   }
              }
              txt += "</tr>";
                if(txt != ""){
                    $("#lateSalesman").append(txt);
                     adjsutMap();
                }
          }
        });
   }

   function showSalesmanByBrand(brand){
      //DeleteMarkers();
      var thisdate = $('#lateDateHolder').val();
      var compDist = 0;
           $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"get_salesman_by_category", "brand": brand, "CONN":con_info, "date":thisdate},
            dataType: "html",
            crossDomain: true,
            cache: false,
            success: function(response){ 
              $('.loading-table').fadeOut();
              $("#dashboardDisplay").show();
              $('#total').show();
              if(response == 0){
                    console.log('empty dashboard!');
              }else{
                var data = JSON.parse(response); 
                for(var x=0; x<data.length; x++){

                  checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
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
                        url:'https://mdbuddyonline.access.ly/ideliverapi/api/index.php/getMarker/'+data[x].transCount+'/'+data[x].mdColor.substr(1),
                        scaledSize: new google.maps.Size(32, 36)
                      }
                      });

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

                }//end for  
              }
            }//close else
          });
        infoWindow = new google.maps.InfoWindow;
    }
   
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

   var markerProd;
   function showAllProduct(){
    var ajaxTime= new Date().getTime();
    var totalTime= 0;
        $('.product-data-container tbody').hide();
        $('.loading-table').show();
        $.ajax ({
            url: "/nestle/connectionString/applicationipAPI.php",
            type: "GET",
            data: {"type":"getAllProduct", "CONN":con_info},
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
                      /*icon: {
                         url:'https://mdbuddyonline.access.ly/ideliverapi/api/index.php/getMarker//'+data[x].BrandColor.substr(1),
                         //scaledSize: new google.maps.Size(50, 40)
                      }*/
                      icon:{
                         path: google.maps.SymbolPath.CIRCLE,
                          scale: 7,
                          fillColor: data[x].BrandColor,
                          fillOpacity: 0.4,
                          strokeWeight: 0
                      }
                     });
                    productMarker.push(markerProd);
                  }
                  $('.loading-table').hide();
                  $('.product-data-container tbody').show();
                }
                 
              }//success
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

 function DisplayCurrentTime() {
      var date = new Date();
      var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      var am_pm = date.getHours() >= 12 ? "PM" : "AM";
      hours = hours < 10 ? "0" + hours : hours;
      var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
      var lblTime = document.getElementById("time");
      var day;
      
      /*if(date.getDay() == 1){
        day = '<strong>MON</strong>';
      }else if(date.getDay() == 2){
        day ='<strong>TUE</strong>';
      }else if(date.getDay() == 3){
        day = '<strong>WED</strong>';
      }else if(date.getDay() == 4){
        day = '<strong>THU</strong>';
      }else if(date.getDay() == 5){
        day = '<strong>FRI</strong>';
      }else if(date.getDay() == 6){
        day = '<strong>SAT</strong>';
      }else{
        day = '<strong>SUN</strong>';
      }*/
      var days = ['', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
      for(var x = 1; x < days.length; x++){
        if(date.getDay() == x){
          day = '<b>'+days[x]+'</b>';
        }
      }
     $('#lateDateHolder').val(getDate());
     lblTime.innerHTML = day+ ' | ' + getDate() +' | '+ time;
  }

 //checkLastLog();
 function checkLastLog(){
   $.ajax({
       url: "web/databaseApi.php",
       type: "GET",
       data: {"type":"check_lastlog", "username": usernm},
       dataType: "json",
       crossDomain: true,
       cache: false,            
       async: false,
        success: function(r){ 
          if(r[0] !=  null){
            if(r[0].lastlogdate != getDate()){
              console.log( r[0].lastlogdate + 'not login proper');
               localStorage.removeItem('adminUserName');
               localStorage.removeItem("username");
               //alert('Session expired, please log in again.');
               updateOfflineStat();
               location.reload();
            }else{
              console.log('login proper');
            }
          }
         
        }
      });
 }

 /*function updateOfflineStat(){
    $.ajax({
       url: "web/databaseApi.php",
       type: "GET",
       data: {"type":"updateOfflineStat",
              "username": usernm
            },
       dataType: "json",
       crossDomain: true,
       cache: false,            
       async: false,
        success: function(r){ 
          console.log(r);
        }
      });
 }*/

 function playSound(){

    var snd = '<audio autoplay="true"><source src="notif-sound/to-the-point.mp3"></audio>';
    console.log(snd);
    $('body').append(snd);
  }

  function click_notify_button(){
 
      Push.create("Encroachment Alert",{
          body: "Salesman something transacted outside his boundary!",
          icon: 'img/mdlogo_web.png',
          timeout: 5000,
          onClick: function () {
              window.focus();
              this.close();
          }
      });
  }
  var remainingHolder;
  function lateSalesman(){
         $.ajax({
           url: "/nestle/connectionString/applicationipAPI.php",
           type: "GET",
           data: {"type":"GET_LATE", "CONN":con_info},
           dataType: "json",
           crossDomain: true,
           async: false,
           cache: false,            
            success: function(response){ 
              $('.loading-table').fadeOut();
              $('.mobileNoCont').show();
              $("#lateSalesman").html('');
              remainingHolder = response;
              var txt = "<tr>";
              for(var i=0;i<response.length;i++){
                if(i < 22){
                  var customer = unescape(response[i].customerLoc);
                  if(response[i].alert == 'EARLY'){
                      txt += "<td class='expand'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                      "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+customer+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                      "\" id='early' alt='"+response[i].salesmanName+"' src='data:image/jpeg;base64,"+response[i].thumbnail+"' onError='imgError(this)'/></td>";
                    }else{
                      txt += "<td class='expand'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                      "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+customer+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                      "\" id='late' alt='"+response[i].salesmanName+"' src='data:image/jpeg;base64,"+response[i].thumbnail+"' onError='imgError(this)'/></td>";
                      //src='../img/salesman_"+user+"/"+response[i].mdCode+".jpg' onError='imgError(this)''
                   }
                }else{

                  var rsalesman = response.length - 22;
                  txt += "<td class='expand'><span class='remainingSalesman' onclick='remaining(\""+response+"\")'>"+rsalesman+"+</span></td>";
                  break;
                }
              }
              txt += "</tr>";
                if(txt != ""){
                    $("#lateSalesman").append(txt);
                     restoreLoc();
                }
              
            },
             error: function(jq,status,message) {
                  alert('ERROR ON COLLECTING SALESMAN DEVIATION: Status: ' + status + ' - Message: ' + message);
              }    

         });
  }
  $('#dispModal_deviation').hide();
  $('.closeFirstTransBtn').click(function(){
    adjsutMap();
    $('#salesmanCategory').show();
    $('#dispModal_deviation').hide();
    deleteSpecificSalesmanMarkers();
    forceLoadDashboard();
    forceLoadHtmlDashboard();
  });

  var specificMarker = [];
  function deleteSpecificSalesmanMarkers(){
      for (var i = 0; i < specificMarker.length; i++) {
        specificMarker[i].setMap(null);
      }
      specificMarker = [];
  }

  function getSpecificSalesman(mdCode){
    
    var compDist = 0;
    DeleteMarkers();
     $.ajax({
           url: "/nestle/connectionString/applicationipAPI.php",
           type: "GET",
           data: {"type":"getSpecificSalesman", "mdCode": mdCode, "CONN":con_info},
           dataType: "json",
           crossDomain: true,
           cache: false,            
            success: function(data){ 
              deleteSpecificSalesmanMarkers();
              for(var x = 0; x < data.length; x++){
                checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
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

                   var marker = new google.maps.Marker({
                     id: data[x].mdCode,
                      transCount: data[x].transCount,
                      loc: data[x].latitude+' '+data[x].longitude,
                      mdName: data[x].Salesman,
                      infowindow: infoWindow,
                      position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                      map: map,
                      content: contentString,
                      icon: {
                        url:'https://mdbuddyonline.access.ly/ideliverapi/api/index.php/getMarker/'+data[x].transCount+'/'+data[x].mdColor.substr(1),
                        scaledSize: new google.maps.Size(32, 36)
                      }
                     });

                   specificMarker.push(marker);
                   markers.push(marker);
                }
              }
          });
  }

  function remarkSalesmanClick(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime){
    $('#salesmanCategory').hide();
    //getSpecificSalesman(mdCode);
    restoreLoc();
    infoWindow.close(); 
    deleteBounce();    
    var transtime = date +' '+ time;
    if(alert == 'LATE'){
      $("#salesman_remarks").css("color", "red");
    }else{
      $("#salesman_remarks").css("color", "#16e030");
    }
    
    $('#dispModal_deviation').show();
    //$("#salesmanImage").attr("src","../img/salesman_"+user+"/"+mdCode+".jpg");
    $("#salesmanImage").attr("src","data:image/jpeg;base64, " + thumbnail);
    $("#salesman_name").html(salesman);
    $("#dateTime_transaction").html(date);
    $("#salesman_remarks").html(alert);
    $("#salesman_num").html(mobileNo);
      $("#calltime").html(calltime);
    $("#firstCallLoc").html('<i class="fas fa-map-marker-alt"></i> ' + customerLocation);
    $("#latLng").val(latLng);

    location_mdCode = mdCode;
  }

  function showRemaining(mdCode){
    $('#salesmanCategory').hide();
    $('#deviationRemaingModal').modal('toggle');
    restoreLoc();
    infoWindow.close(); 
    deleteBounce();     
    var data = remainingHolder;
    for(var x = 0; x < data.length; x++){
      if(mdCode == data[x].mdCode){
        var salesman = data[x].mdCode+'_'+data[x].salesmanName;
         if(data[x].alert == 'LATE'){
            $("#salesman_remarks").css("color", "red");
          }else{
            $("#salesman_remarks").css("color", "#16e030");
          }
            
          $('#dispModal_deviation').show();
          $("#salesmanImage").attr("src","../img/salesman_"+user+"/"+data[x].mdCode+".jpg");
          $("#salesman_name").html(salesman);
          $("#dateTime_transaction").html(data[x].deliveryDate);
          $("#salesman_remarks").html(data[x].alert);
          $("#salesman_num").html(data[x].mobileNo);
                $("#calltime").html(data[x].calltime);
          $("#firstCallLoc").html('<i class="fas fa-map-marker-alt"></i> ' + data[x].customerLoc);
          $("#latLng").val(data[x].latLng);

          location_mdCode = data[x].mdCode;
      }
    }
  }

  function remaining(){
    var cont = '';
    var tabCont, alert;
    var data = remainingHolder;
    for(var x = 0; x < data.length; x++){
      if(data[x].alert == 'LATE'){
        alert = "<span style='color: red'>"+data[x].alert+"</span>";
      }else{
        alert = "<span style='color: green'>"+data[x].alert+"</span>";
      }
      cont += "<tr onclick='showRemaining(\""+data[x].mdCode+"\")'><td>"+(x+1)+" <img class='remainingDevPics' src='data:image/jpeg;base64,"+data[x].thumbnail+
      "' onError='imgError(this)'/> "+data[x].mdCode+'_'+data[x].salesmanName+" "+ alert+"</td></tr>";
    }

    tabCont = "<table class='table table-condensed table-hover'>"+cont+"</table>"
    $('.devRemainBody').html(tabCont);
    $('#deviationRemaingModal').modal('toggle');
  }

  function imgError(image) {
    image.onerror = "";
    image.src = "../img/salesmanPic.jpg";
    return true;
  }  

  function imgError2(image) {
    image.onerror = "";
    image.src = "../img/salesmanPic.jpg";
    return true;
  } 

  function imgErr3(image){
    return '<div>NO IMAGE</div>';
  } 


 function adjsutMap(){
    var zoomInDelimeter = map.getZoom();
    zoomInDelimeter++;
    zoomInDelimeter++;
    zoomInDelimeter--;
    zoomInDelimeter--;
    map.setZoom(zoomInDelimeter);
    console.log('adjusted');
 } 

 function showOnMap(){
     //$('#dispModal_deviation').hide();
     var latLng = $("#latLng").val();
   
     for(var x = 0; x < markers.length; x++){
        if(latLng == markers[x].loc && markers[x].transCount == 1){
        markers[x].setAnimation(null);
          markers[x].setAnimation(google.maps.Animation.BOUNCE);
          map.setCenter(markers[x].getPosition());
          map.setZoom(18);
          infoWindow.close();
          infoWindow.setContent(markers[x].content);
          infoWindow.open(map, markers[x]);
        }
     }
 }

 function openNav() {
    document.getElementById("mySidenav").style.width = "270px";
    document.getElementById("main").style.marginLeft = "270px";
 }

 function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
 }

 