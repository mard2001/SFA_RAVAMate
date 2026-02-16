
var user = 'leysam';

if(user == 'panay'){
 $('.subHeader').html('(PANAY)');
}else if(user == 'cebu'){
  $('.subHeader').html('(CEBU)');
}else if(user == 'leysam'){
  $('.subHeader').html('(ADMIN)');
}else if(user == 'bohol'){
  $('.subHeader').html('(BOHOL)');
}else if(user == 'negros'){
  $('.subHeader').html('(NEGROS)');
}
  
  //map fullscreen orn ot function
  $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
            var isFullScreen = document.fullScreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen;
            if (isFullScreen) {
                console.log('fullScreen!');
            } else {
                console.log('NO fullScreen!');
            }
        });

  $('.fixedHead').click(function (){
    DeleteMarkers();
    dashBoard_direct_marker();
  });

  $(function () {
   $('[data-toggle="tooltip"]').tooltip()
  });

  $(".searchInput").hide();
  $(".searchIcon").click(function(){
    $(".searchInput").fadeIn();
  });

  var territoryColor = document.getElementById("terrcolor");
   var names=[];
  var ids=[];
  var salesmanID=[];
  var dateMPA=[];
  var color=[];
  function displayMPA (){
         /*  var dialog = bootbox.dialog({
                          message: '<p class="text-center"><i class="fa fa-spin fa-spinner"></i> Rendering geofence on map please wait...</p>',
                          closeButton: false
                              });
                       var ajaxTime= new Date().getTime() - 2;
                       var totalTime= 0;*/
               $.ajax ({
                   url: "../geofencing/GeofencingAPI.php", 
                    type: "GET",
                    data: {"type":"get_all_mpa_json_fui"+user},
                    dataType: "html",
                    crossDomain: true,
                    cache: false,            
                    success: function(response){
                    // alert(response);
                    if(response == 0){
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
                                strokeWeight: 2,
                                fillColor: mpa_header[i][5],
                                fillOpacity: 0.40,
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

                             /* myLatlng_buddy = new google.maps.LatLng(md_lat[i], md_lang[i]);
                              console.log(Object.keys(md_lat));
                              if(google.maps.geometry.poly.containsLocation(myLatlng, mpa_polygon[i])){    
                                         alert("NAA KO SA MPA");
                                }*/
                        }
                    }//main else close tag
                    
                    }//succes close tag
                });/*.done(function () {
                                   totalTime = new Date().getTime()-ajaxTime;
                                  dialog.init(function(){
                                        setTimeout(function(){
                                            dialog.modal('hide');
                                        }, totalTime);
                                  });
                                   
                  });*/
           
        }//displayMPA

    var incruchment = [];
    function checkWithinMPA (latitude, longitude, salesman, sales, date, customer, refno){
      //alert(latitude + " " +  longitude);    
          
          var isOutside; 
          var latlng = new google.maps.LatLng(latitude,longitude);
          //console.log(latlng);
            //var latlng = latitude +','+ longitude;
          //var point = new google.maps.LatLng(52.05249047600099, -0.6097412109375);
          
          for(var i = 0; i < mpa_polygon.length; i++){
              if(google.maps.geometry.poly.containsLocation(latlng, mpa_polygon[i])){ 
                if(salesman != salesmanID[i]){
                  //console.log('Salesman: ' + salesman + ' transacted in ' + salesmanID[i] + ' with the sales of: ' + sales);
                  //incruchment.push(salesman + ' transacted in the area of: ' + salesmanID[i] + ' with the sales of: ' + sales);
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
                       data: {"type":"encruchment_Save_fui"+user, "boundOwnerEncruch": boundOwner,"salesmanEncruch":salesman, "salesEncruch": sales, "dateEncruch": date,
                               "customerEncruch": customer, "lat":lat, "long":long, "boundaryEncruch":boundary, "documentNo":refno},
                       dataType: "html",
                       crossDomain: true,
                       cache: false,            
                        success: function(response){                    
                          console.log(response.trim());
                          if(response.trim() == 'Successfuly saved.'){
                            showNotif();
                            Push.create("Encroachment Alert",{
                              body: salesman + ' transacted outside his boundary!',
                              icon: 'img/mdlogo_web.png',
                              timeout: 5000,
                              onClick: function () {
                                  window.focus();
                                  this.close();
                              }
                            });
                           var a = new Audio('js/notif-sound/to-the-point.mp3'); 
                           a.play();
                          }
                        }    
                 });
        }

        function flip1() {
            $(".container_salesman").animate({width:'toggle'},350);
            $('.arrow-side-icon').toggleClass('fa-angle-right');
            $('.loading-table').hide();
        }

        function flip2() {
            $(".container_productCat").animate({width:'toggle'},350);
            $('.arrow-side-icon2').toggleClass('fa-angle-right');
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

      

        var greatest = 0;
        function storeTblValues()
        {
            var salesBased = 0;
            var basedSalesForRefresh = 0;
             $.ajax ({
              url: "../nai/sqlApi_nutri.php",
              type: "POST",
              data: {"type":"dashBoard_totalSales_bohol", "siteCode":user},
              dataType: "json",
              crossDomain: true,
              cache: false,          
                success: function(res){ 
                  if(res[0].salesman == 0){
                   $('.loading-table').html('<h6>No transaction found as of now.</h6><p>'+DisplayCurrentTime()+'</p>');
                  }else{
                    var sales = parseFloat(Number(res[0].total).toFixed(2));
                    var salesman = res[0].salesman;
                    $('#total').html('Total ('+salesman+') : &#8369; ' +sales.toLocaleString());
                      salesBased = sales;
                       if(salesBased != greatest){
                          if(salesBased > greatest){
                             // DeleteMarkers();
                             console.log('total sales change to: GREATEST');
                              dashBoardData();
                              dashBoard_direct_marker();
                              productCategory();
                              
                            }else{
                              console.log('total sales change to: LESS');
                              DeleteMarkers();
                              dashBoard_direct_marker();
                              productCategory();
                            }
                            greatest = salesBased;
                       }//second if
                   }//main else
                }//success
            });
         }

        function DisplayCurrentTime() {
          var date = new Date();
          var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
          var am_pm = date.getHours() >= 12 ? "PM" : "AM";
          hours = hours < 10 ? "0" + hours : hours;
          var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
          //var lblTime = document.getElementById("time");
          var day;
          if(date.getDay() == 1){
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
            day = 'SUN';
          }
         return day+ ' | ' +getDate() +' | '+ time;
      }

      function currentTimeDash() {
        var date = new Date();
        var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        var am_pm = date.getHours() >= 12 ? "PM" : "AM";
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
        var lblTime = document.getElementById("time");
        var day;
       if(date.getDay() == 1){
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
        }
       lblTime.innerHTML = day+ ' | ' +getDate() +' | '+ time;

    }

          function productCategory(){
            $.ajax ({
                  url: "../nai/sqlApi_nutri.php",
                  type: "GET",
                  data: {"type":"dashBoardData_product", "siteCode":user},
                  dataType: "JSON",
                  crossDomain: true,
                  cache: false,          
                    success: function(response){ 
                      //console.log(computeTAmount());
                      $('#cateogoryDataTable').html(response.tableDetails);
                      $('.footerDetails').html(response.footerDetails);
                    }//success
                });

          }

           var delimeter = 0;
          function dashBoardData(){
             $.ajax ({
              url: "../nai/sqlApi_nutri.php",
              type: "POST",
              data: {"type":"dashboard_beta", "siteCode":user},
              dataType: "html",
              crossDomain: true,
              cache: false,            
                success: function(response){ 
                 $("#dashboardDisplay").html(response);
                 
                 var count = $('#dashboardDisplay tr').length;
                 if(count != delimeter){
                  $('#lateSalesman tr').remove();
                 
                  //lateSalesman();
                  //DeleteMarkers();

                  delimeter = count;
                 }

                }//success
            });
        }



        function showOnMap(){
          $('#dispModal_deviation').modal('hide');
           var latLng = $("#latLng").val();
         
           for(var x = 0; x < markers.length; x++){
              if(latLng == markers[x].loc && markers[x].transCount == 1){
              markers[x].setAnimation(null);
                markers[x].setAnimation(google.maps.Animation.BOUNCE);
                map.setCenter(markers[x].getPosition());
                map.setZoom(18);
              }
           }
         }
        
        function lateSalesman(){
           $.ajax({
             url: "../nai/sqlApi_nutri.php",
             type: "GET",
             data: {"type":"getLate", "siteCode":user},
             dataType: "json",
             crossDomain: true,
             cache: false,            
              success: function(response){ 
               //console.log(response);  
                var txt = "<tr>";
                for(var i=0;i<response.length;i++){
                    if(response[i].alert == 'EARLY'){
                        txt += "<td><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\","
                        +" \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+"\","
                        +" \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].location+"\"," 
                        +"\""+response[i].customerName+"\")' data-toggle='tooltip' title='"+response[i].salesmanName+
                        "' id='early' alt='"+response[i].salesmanName+"' src='../img/salesman_fui"+user+"/"+
                        response[i].mdCode+".jpg' onError='imgError(this)'/></td>";
                     }else{
                        txt += "<td><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\","
                        +" \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+"\", "
                        +" \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].location+"\", "
                        +" \""+response[i].customerName+"\")' data-toggle='tooltip' title='"+response[i].salesmanName
                        +"' id='late' alt='"+response[i].salesmanName+"' src='../img/salesman_fui"+user+"/"+response[i].mdCode
                        +".jpg' onError='imgError(this)'/></td>";
                     }
                }
                txt += "</tr>";
                  if(txt != ""){
                      $("#lateSalesman").append(txt);
                  }
              }    
           });
          }

          /*function lateSalesman(){
           $.ajax({
             //url: "../nai/sqlApi_nutri.php",
             url: "../nestle/sqlApi_bohol",
             type: "GET",
             data: {"type":"getLate", "siteCode":user},
             dataType: "json",
             crossDomain: true,
             cache: false,            
              success: function(response){ 
               //console.log(response);  
                var txt = "";
                for(var i=0;i<response.length;i++){
                    if(response[i].alert == 'EARLY'){
                        txt += "<div id='insideSalesman'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\","
                        +" \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+"\","
                        +" \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].location+"\"," 
                        +"\""+response[i].customerName+"\")' data-toggle='tooltip' title='"+response[i].salesmanName+
                        "' id='early' alt='"+response[i].salesmanName+"' src='../img/salesman_fui"+user+"/"+
                        response[i].mdCode+".jpg' onError='imgError(this)'/></div>";
                     }else{
                        txt += "<div id='insideSalesman'><img onclick='remarkSalesmanClick(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\","
                        +" \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+"\", "
                        +" \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].location+"\", "
                        +" \""+response[i].customerName+"\")' data-toggle='tooltip' title='"+response[i].salesmanName
                        +"' id='late' alt='"+response[i].salesmanName+"' src='../img/salesman_fui"+user+"/"+response[i].mdCode
                        +".jpg' onError='imgError(this)'/></div>";
                     }
                }
                txt += "</tr>";
                  if(txt != ""){
                      $("#lateSalesman").append(txt);
                  }
                
              }    

           });
          }*/

       function remarkSalesmanClick(salesman, transaction, date, time, alert, mobileNo, mdCode, location, customerName){
        var transtime = date +' '+ time;
       
        if(alert == 'LATE'){
          $("#salesman_remarks").css("color", "red");
         }else{
          $("#salesman_remarks").css("color", "green");
         }
          
          //$('#dispModal_deviation').modal('show');
         
          //$('#salesmanColor').css({"font-size":"10px", "border-radius":"100%", "float":"center", "background-color": mdColor});
          $("#salesmanImage").attr("src","../img/salesman_fui"+user+"/"+mdCode+".jpg");
          $("#salesman_name").html(salesman);
          //$("#first_transaction").html(transaction);
          $("#dateTime_transaction").html(date);
          $("#salesman_remarks").html(alert);
          $("#salesman_num").html(mobileNo);
          $("#location").html(location);
          $("#firstCallLoc").html(customerName);
          $("#latLng").val(location);

          location_mdCode = mdCode;
           $('#dispModal_deviation').appendTo("body").modal('show');
       }


         var markers = [];
         function DeleteMarkers() {
          //Loop through all the markers and remove
          console.log('marker is refresh');
          for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);

          }


          markers = [];
         }
          
        function getmarkerLoc(markerPos, markerOBJ){

             var latilongi = new google.maps.LatLng(lattitudeFromDB, longitudeFromDB);

            if(latilongi.equals(markerPos) == true){
          
              for (var i = 0; i < markers.length; i++) {
                    markers[i].setAnimation(null);
                  }
               
               markerOBJ.setAnimation(google.maps.Animation.BOUNCE);
               map.setCenter(markerOBJ.getPosition());
               map.setZoom(18);

               lattitudeFromDB = 0;
               longitudeFromDB = 0;
            }

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
            return metreDist.toFixed(2) + ' m';
          }

          return d.toFixed(2) + ' km';
        }

        
      }


          function timeSpentFunc(timeSpent){
        if(timeSpent == undefined || timeSpent == 0){
          return timeSpent = 'N/A';
         }else if(timeSpent === '1'){
            return timeSpent = timeSpent + ' minute';

          }else if(timeSpent < 60){
            return timeSpent = timeSpent + ' minutes';
           
          }else{
            var hours = Math.floor( timeSpent / 60);          
            var minutes = timeSpent % 60;
            return timeSpent = hours+':'+minutes+' minutes';
          }
      }

      function convertTimeGap(timegap){
        if(timegap == '0' || timegap < 0){
            return timegap = 'N/A'; 
          }else if(timegap === '1'){
            return timegap = timegap + ' minute';

          }else if(timegap < 60){
            return timegap = timegap + ' minutes';
           
          }else{
            var hours = Math.floor( timegap / 60);          
            var minutes = timegap % 60;
            return timegap = hours+':'+minutes+' minutes';
          }
      }

         function bounceMarkOtherWin(markerPos, markerObj){
            var latilongi = new google.maps.LatLng(pasthisLat, pasthisLong);

            if(latilongi.equals(markerPos) == true){
          
              for (var i = 0; i < markers.length; i++) {
                    markers[i].setAnimation(null);
                  }
               
               markerObj.setAnimation(google.maps.Animation.BOUNCE);
               map.setCenter(markerObj.getPosition());
               map.setZoom(18);

               pasthisLat = 0;
               pasthisLong = 0;
               Cookies.remove('lattitude');
               Cookies.remove('longitude');
               
            }
          }

     $('#categoryTable').hide(); 
     $('#salesmanBtn').hide();
     $("#productBtn").click(function(){
        $('.product-data-container tbody').hide();
        DeleteMarkers();
        restoreLoc();
        showAllProduct();
        displayAllData.pause();

        $('.loading-table').show();
        $('#salesmanCategory').slideUp();
        $('#categoryTable').show();
        
        $('#salesmanBtn').show();
        $('#productBtn').hide();
        
     });

     $("#salesmanBtn").click(function(){
        $("#dashboardDisplay").hide();
        removeProdutMarker();
        dashBoard_direct_marker();
        restoreLoc();
        displayAllData.resume();
        $('.loading-table').show();
        $("#salesmanCategory").slideDown();
        $('#categoryTable').hide();
        
        $('#salesmanBtn').hide();
        $('#productBtn').show();
     });

     $('.categoryProp table thead').click(function (){
        removeProdutMarker();
        showAllProduct();
     });

        $("#hideDashbordTab").click(function(){
          $(".outerContainer").toggle();
        });

        var markerProd;
     function showAllProduct(){
      var ajaxTime= new Date().getTime();
      var totalTime= 0;
          $.ajax ({
              url: "../nai/sqlApi_nutri.php",
              type: "GET",
              data: {"type":"getAllProduct", "siteCode":user},
              dataType: "json",
              crossDomain: true,
              cache: false,
              success: function(response){ 
                DeleteMarkers();
                if(response.length == ''){
                   alert('NO PRODUCT TO SHOW AS OF NOW!');
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
                        icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|'+data[x].BrandColor.substr(1)
                   
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

        var productMarker = [];
         function removeProdutMarker(){

              //Loop through all the markers and remove
              console.log('product marker is refresh');
              for (var i = 0; i < productMarker.length; i++) {
                  productMarker[i].setMap(null);
              }
              productMarker = [];
         }

          //hide dashboard table details
    // $("#dashboardDisplay").hide();
      var marker, infoWindow;
           function dashBoard_direct_marker(){
            var compDist = 0;

           var ajaxTime= new Date().getTime();
            var totalTime= 0;

             $.ajax ({
              url: "../nai/sqlApi_nutri.php",
              type: "POST",
              data: {"type":"dashBoard_marker_bohol", "siteCode":user},
              dataType: "html",
              crossDomain: true,
              cache: false,            
                success: function(response){ 
                removeProdutMarker();
                if(response == ''){
                      console.log('empty dashboard!');
                }else{
                  var data = JSON.parse(response); 
                  for(var x=0; x<data.length; x++){

                    checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
                    compDist = distance(data[x].latitude, data[x].longitude, data[x].transCount);
                     var contentString = "<div style='margin: 0 auto;'><div class='modal-header' style='text-align: center;'>"+
                          "<div class='cont_marker_header'><img class='salesmanPic' alt='salesmanPic' style='border: solid 3px "+data[x].mdColor+"' src='../img/salesman_fui"+user+"/"+data[x].mdCode+".jpg' onError='imgError(this)'/>"+
                           "<br/><span class='label label-pill label-danger countSM' style='background-color:"+data[x].mdColor+";' id='getThisTransCount'>"+data[x].transCount+"</span>"+
                           "<span class='fa fa-chevron-left pull-left' onclick='prevInfo()' id='prevMD'></span><span id='nextMD' onclick='nextInfo()' class='fa fa-chevron-right pull-right'></span></div></div>"+
                              "<div class='table-responsive'>" +
                                 "<table class='table table-sm table-hover'>" +
                                  "<tr><td>Salesman:</td><td id='getThisSalesman'>"+data[x].Salesman+"</td></tr>"+
                                   "<tr><td>Customer:</td><td>"+data[x].Customer+"</td></tr>"+
                                   /*"<tr><td>Location:</td><td id='getThisLongLat'>"+data[x].latitude +' '+data[x].longitude+"</td></tr>"+*/
                                   "<tr><td>Document No:</td><td>"+data[x].DocumentNo+"</td></tr>"+
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
                        icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+data[x].transCount+'|'+data[x].mdColor.substr(1)+'|FAFAFA'
                        //icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+data[x].mdColor.substr(1)+data[x].transCount+'.png'
        
                      });
                        //hitme(marker.id, marker);
                        markers.push(marker);
                       
                        //nextInfo();
                       // prevInfo(data[x].transCount); 
                       
                        google.maps.event.addListener(marker, 'click', (function(marker, x) {
                          return function(){
                                          
                          lat1 = data[x].latitude; 
                          lon1 = data[x].longitude;
                                
                                infoWindow.setContent(this.content);
                                infoWindow.open(map, marker);
                            }
                        
                        })(marker, x));
                  }//end for  

                   google.maps.event.addListener(infoWindow, 'closeclick', function() {  
                          displayAllData.resume();
                      }); 
                   
                }
              }//close else
            }).done(function () {
                  setTimeout(function(){
                    $("#dashboardDisplay").fadeIn();
                    $('.loading-table').fadeOut();
                  }, totalTime);
                                 });

          infoWindow = new google.maps.InfoWindow;
        }//end direct dashboard colpal


        function getTransaction(){
        $("#transaction-details-holder table").remove();
                 var transactionID = $('#skuHolder-data').val();
                 $.ajax ({
                      url: "../nai/sqlApi_nutri.php",
                      type: "GET",
                      data: {"type":"getTransactionDetails", "transactionID":transactionID, "siteCode":user},
                      dataType: "html",
                      crossDomain: true,
                      cache: false,
                      success: function(response){ 
                              $('#transaction-details-holder').append(response);
                              $('#transaction-details-holder table').addClass('table table-sm table-hover table-bordered');
                              $('#transaction-details-holder').addClass('height-details');
                        }//success
                    });
        }


        function prevInfo(){
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
         console.log('i was click');
         var mdNameNext  = $('#getThisSalesman').text();
         var transCountNext = $('#getThisTransCount').text();
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

          function showSalesmanOnMap(mdCode){
            var salesmanCode = mdCode.substring(0, 4);
            console.log(salesmanCode);
            deleteBounce();
            for(var x = 0; x < markers.length; x++){
              if(salesmanCode == markers[x].id && markers[x].transCount == 1){
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

        function imgError(image) {
          image.onerror = "";
          image.src = "img/salesmanDefault.png";
          return true;
        }  

         function imgError2(image) {
          image.onerror = "";
          image.src = "img/salesmanDefault.png";
          return true;
        }  

         function deleteBounce(){
            for (var i = 0; i < markers.length; i++) {
                markers[i].setAnimation(null);
            }
         }

        function restoreLoc(){
          $('#mapUserControlCont').fadeOut();
          deleteBounce();
          map.setCenter(myLatlng);
          map.setZoom(zoomPerSite);
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
         if(user == 'bohol'){
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
          
       var mapZoom, myLatlng, mapOptions, map, marker, mpaPolygon, contentString = "", mpa_coords = [[]];
       var mpa_header=[[]];  //DATA TO HOLD THE LONG AND LAT
       var mpa_polygon=[];
       var displayAllData;
        $('#mapUserControlCont').hide();
        function init(){
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 60000 });
        function onSuccess(position) {
          var lat, lang;
            lat = 9.8500;
            lang = 124.1435;
            mapZoom = 7;
           
             myLatlng = new google.maps.LatLng(lat,lang);
             mapOptions = {
                zoom: mapZoom, 
                center: myLatlng,
                mapTypeId: 'roadmap',
                controlSize: 25,
                zoomControl: false,
                scaleControl: false,
                streetViewControl: true,
                fullscreenControl: false,
                mapTypeControl: false
              }
          
       
          map = new google.maps.Map(document.getElementById('map'), mapOptions);

          //new deviationModal(map);
          new deviation(map);
          new AutocompleteDirectionsHandler(map);
          new geofences(map);
          new mapBtnsContainer(map);
          new mapUserControlCont(map);
          new salesmanBtn(map);
          new categoryProductBtn(map);

          enterFullScreen();
          zoomOut();
          zoomIn();
          streetView();
          setSatellite();

           map.addListener('click', function() {
                infoWindow.close(); 
                deleteBounce();    
                displayAllData.resume();

            });

           map.addListener('dragend', function() {
              $('#mapUserControlCont').fadeIn();
          });


         displayAllData = new IntervalTimer(function () {
            currentTimeDash();
            storeTblValues();
          }, 2000);
         
          }//onSuccess  

      function onBoundsChanged() {
          /*if ( $(map.getDiv()).children().eq(0).height() == window.innerHeight &&
               $(map.getDiv()).children().eq(0).width()  == window.innerWidth ) {*/
              dispDeviation = document.getElementById("dispModal_deviation");
              map.controls[google.maps.ControlPosition.RIGHT].push(dispDeviation);
         /* }else {
              console.log ('NOT FULL SCREEN');
               //map.controls[google.maps.ControlPosition.TOP_CENTER].clear(dispDeviation);
          }*/
      }

      function deviationModal(map){
            this.map = map;
            var dispDeviation = document.getElementById("dispModal_deviation");
            this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(dispDeviation);
      }

      function deviation(map){
             this.map = map;
             var btn = document.getElementById('lateSalesman');
             this.map.controls[google.maps.ControlPosition.BOTTOM].push(btn);

      }
          
        function AutocompleteDirectionsHandler(map){
               this.map = map;
               var dashbaord_table = document.getElementById('outerContainer_id');
             // document.getElementById('outerContainer_id').style.marginLeft = "50px"; 
               this.map.controls[google.maps.ControlPosition.LEFT].push(dashbaord_table);

        }

        function salesmanBtn(map){
               this.map = map;
               var btn = document.getElementById('salesmanBtn');
               this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);

        }

        function categoryProductBtn(map){
               this.map = map;
               var btn = document.getElementById('productBtn');
               this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);

        }

        function geofences(map){
               this.map = map;
               var btn = document.getElementById('showGeofence');
               this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);

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
          function onError(error) {
              alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
          }//onError    

        google.maps.event.addDomListener(window, 'load', onSuccess);
        
      }//init


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

          $("#showGeofence").clickToggle(function() {   
              //$('#showGeofence').text('Hide Geofence');
               dashBoard_direct_marker();
              displayMPA();
            }, function() {
              //$('#showGeofence').text('Show Geofence');
             if(mpa_polygon.length > 0){  
                for(var i = 0; i < mpa_polygon.length; i++){ 
                  mpa_polygon[i].setMap(null);
                }
                mpa_polygon = [];
              }
          });