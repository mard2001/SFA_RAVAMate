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
allSalesman();

/*NOTIFICATION SECTION*/
// showNotif();

 $('#outerContainer_id').hide();
 $(document).on('click', '.dropdown-toggle', function(){
   $('.count').html('');
    // showNotif('yes');
 });

//  setInterval(function(){
//   showNotif();
// }, 9000);

  $('#navDrop').click(function() {
   $("i", this).toggleClass("glyphicon-menu-up glyphicon-menu-down");
 });

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
           $('#headingTitle').html(r[0].company.toUpperCase() +' / Customer Mapping');
           }
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
        // console.log('Notification function has been refresh');                
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
             data: {"type":"update_digitalMap", "CONN":con_info},
             dataType: "html",
             crossDomain: true,
             cache: false,            
               success: function(response){ 
                 console.log(response);
                 if(response != 0){
                   alert('Update was successfull !');
                 }else{
                   alert('Update was not successfull: ' + response);
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

   datePicker2();

   var territoryColor = document.getElementById("terrcolor");
   var GlobalColor = "";

     
     //history.pushState(null, null, document.URL);
     window.addEventListener('popstate', function () {
             history.pushState(null, null, document.URL);
      });

     //interval to get geofences
     var countSalesman; 
 setInterval(function () { 
     //reset mpa
    /* if(mpa_polygon.length > 0){  
       for(var i = 0; i < mpa_polygon.length; i++){ 
         mpa_polygon[i].setMap(null);
       }
       mpa_polygon = [];
     }
   
     displayMPA();*/
      countSales();
      //remvDubTables();
      
 }, 1000);

  
function graphicalRep(salesman, c_startDate, c_endDate){

  $("#chart").empty();
     $.ajax ({
           url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
           type: "GET",
           data: {"type":"dashBoardData_bohol_filter_graph", "resultSalesman": salesman,"start":c_startDate, "end":c_endDate, "CONN":con_info},
           dataType: "html",
           crossDomain: true,
           cache: false,            
             success: function(response){   
               console.log(response); 
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

     var startPickDate, endPickDate;
     function datePicker2(){
       
          var start = moment().subtract(29, 'days');
           var end = moment();

           $('#reportrange').daterangepicker({
               "alwaysShowCalendars": true,
               "startDate": start,
               "endDate": end,
               "applyClass": "btn-primary",
               ranges: {
                  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
               }
           }, function(start, end, label) {
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
               console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
               startPickDate = start.format('YYYY-MM-DD');
               endPickDate = end.format('YYYY-MM-DD')
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
           data: {"type":"dashBoard_totalSales_bohol_filter", "salesman": salesman, "start":startPickDate, "end":endPickDate, "CONN":con_info},
           dataType: "html",
           crossDomain: true,
           cache: false,            
             success: function(response){ 
               console.log(response);
               var data = [];
               var data = JSON.parse(response);
               var sales = data.sales;
               var salesmanCount = data.salesmanCount;
               console.log('Sales: '+sales + 'Salesman: '+ salesmanCount);
               //console.log(data);
               //countSales();
               countSalesResults = sales;
               //$('#total').html('TOTAL (' +countSalesmanResults+ ') : ' +sales);

             }
         });
      }
   
     function countSales(){
        var count = $('#dashboardDisplay tr').length;
         $('#total').html('TOTAL STORE: (' +count+ ')');
          
     }

    function allSalesman(){
     $('.loading-table').show();
     var ajaxTime= new Date().getTime();
     var totalTime= 0;
       $.ajax ({
             url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
             type: "GET",
             data: {"type":"get_all_salesman_bohol", "CONN":con_info},
             dataType: "html",
             crossDomain: true,
             cache: false,            
             success: function(response){                  
              var data = JSON.parse(response);
              // console.log(data);
                     var html;
                  

                     for(var x = 0; x<data.length; x++){
                      $('#salesmanList').append('<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>');

                     }
                      $('#salesmanList').multiselect({
                         numberDisplayed: 1,
                         enableCaseInsensitiveFiltering: true,
                         includeSelectAllOption: true,
                         selectAllNumber: true,
                         buttonWidth: '300px',
                         nonSelectedText: 'Choose salesman',
                         maxHeight: 300,


                      });
                    
                     
                     //$("#framework").multiselect('rebuild');

             }//success here;
         }).done(function () {
               setTimeout(function(){
                 $('.loading-table').fadeOut();
               }, totalTime);
         });
    }

    function dashBoardData(){
     var salesman = $('#salesmanList').val();
      var mcp = $('#mcpDaysSelection').val();
          $.ajax ({
           url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
           type: "GET",
           data: {"type":"customerMappingTableData","salesman":salesman, "mcp":mcp, "CONN":con_info},
           dataType: "html",
           crossDomain: true,
           cache: false,            
             success: function(res){ 
                 $("#dashboardDisplay").html(res);
             }
         });
     }

   
    function clickSalesmanList() {
         var x = document.getElementById("salesmanList").selectedIndex;
         var result = document.getElementsByTagName("option")[x].value;
         alert(result);
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
  $('#salesmanCategory').removeClass('hidden');
  $('.loading-table').show();
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

       //Loop through all the markers and remove
       console.log('product marker is refresh');
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

  
   function productCategory(){
     $.ajax ({
           url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
           type: "GET",
           data: {"type":"dashBoardData_product_digiMapFilter","start":startPickDate, "end":endPickDate, "CONN":con_info},
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



   
   function timeSpentFunc(timeSpent){
  
       if(timeSpent == undefined || timeSpent < 0){
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

   function convertTimeGap(timegap, transCount){
     if(transCount == 0){
       return timegap = 0;
     }else{
         if(timegap == undefined || timegap < 0){
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
   }

    var lat1 = 0, lon1 = 0;
   function distance(lat2, lon2, transCount){
     if(transCount == 1){
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

                        /* myLatlng_buddy = new google.maps.LatLng(md_lat[i], md_lang[i]);
                         console.log(Object.keys(md_lat));
                         if(google.maps.geometry.poly.containsLocation(myLatlng, mpa_polygon[i])){    
                                    alert("NAA KO SA MPA");
                           }*/
                   }
                 }
             })
        
     }//displayMPA

   function deleteBounce(){
     for (var i = 0; i < markers.length; i++) {
             markers[i].setAnimation(null);
           }
   }

   var markers = [];
  function DeleteMarkers() {
     for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(null);
     }
     markers = [];
  }

  function fitCustomerMarkerstoMap(){
    var bounds = new google.maps.LatLngBounds();
     if (markers.length>0) { 
         for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
           }    
           map.fitBounds(bounds);
       }
   }

   function getPoints() {
         var dat = storeLocations();
         var arr = [];
         for(var x = 0; x < dat.length; x++){
            arr.push(new google.maps.LatLng(dat[x].latitude, dat[x].longitude));
         }
         
         return arr;
       }
  var latlng_heatmaHolder;
  function storeLocations(){
      var salesman = $('#salesmanList').val();
      var mcp = $('#mcpDaysSelection').val();
      dashBoardData();
      DeleteMarkers();
      //var bounds = new google.maps.LatLngBounds();

      $('#filterBtn').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
      $('#filterBtn').prop('disabled', true);

      var ajaxTime= new Date().getTime();
      var totalTime= 0;

     //heatmap.setMap(null);
     $.ajax ({
       url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
       type: "GET",
       data: {"type":"customerMappingData", "salesman":salesman, "mcp":mcp, "CONN":con_info},
       dataType: "JSON",
       crossDomain: true,
       cache: false,            
       async: false,
       success: function(r){
        var arr = []; 
         for(var x = 0; x < r.length; x++){
           arr.push(new google.maps.LatLng(r[x].latitude, r[x].longitude));
         }
          
          console.log(arr);
          heatmap = new google.maps.visualization.HeatmapLayer({
             data:arr,
             map: map
           });
         //latlng_heatmaHolder = arr;
       }
     }).done(function () {
           setTimeout(function(){
               $('#outerContainer_id').show();
               $('#filterBtn').html("Generate");
               $('#filterBtn').prop('disabled', false);
           }, totalTime);
     });
   }//display salesman funciton

   function defaultStore(image) {
   image.onerror = "";
   image.src = "../img/mdstoreloactor.png";
   return true;
 }

 var infoWindow = new google.maps.InfoWindow();
 function showCustomer(custCode){
   deleteBounce();
    for(var x = 0; x<markers.length; x++){
       if(custCode == markers[x].custCode){
          markers[x].setAnimation(null);
          markers[x].setAnimation(google.maps.Animation.BOUNCE);
          infoWindow.close();
          infoWindow.setContent(markers[x].content);
          infoWindow.open(map, markers[x]);
          map.setCenter(markers[x].getPosition());
          map.setZoom(18);
       }
    }
  }

    function storeLocations_pinType(){
     var salesman = $('#salesmanList').val();
     var mcp = $('#mcpDaysSelection').val();
     if(salesman == '' || salesman == null){
       alert('Please select a salesman first.');
     }else{
       $('#filterBtn').html("<i class='fa fa-spin fa-spinner'></i> Generating..");
       $('#filterBtn').prop('disabled', true);

       dashBoardData();
       DeleteMarkers();

       $.ajax ({
         url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
         type: "GET",
         data: {"type":"customerMappingData", "salesman":salesman, "mcp":mcp,"CONN":con_info},
         dataType: "json",
         crossDomain: true,
         cache: false,           
         success: function(data){
             console.log(data.length);
             if(data.length == 0){
               $('.loading-table').show().html('NO DATA FOUND ON YOUR REQUEST');
             }else{
               $('.loading-table').html('');
               for(var x=0; x<data.length; x++){
                 var contentString = "<div>"+
                                       '<h4>CUSTOMER DETAILS</h4>'+
                                         '<table class="table table-condensed">'+
                                           "<tr class='customerHolder' onClick='showCustImage(\""+data[x].custCode+"\")'><td colspan='2' id='customerData'><span id='indicatorImg'>Click here to view store image</span> <i class='fa fa-picture-o storeIc' aria-hidden='true'></i></td></tr>"+
                                           '<tr><td>Code:</td><td>'+data[x].custCode+'</td></tr>'+
                                           '<tr><td>Name:</td><td>'+data[x].custName+'</td></tr>'+
                                           '<tr><td>Salesman:</td><td>'+data[x].salesmanCode +'_'+data[x].salesmanName+'</td></tr>'+
                                         '</table>'+
                                       "</div>";
                 marker = new google.maps.Marker({
                   position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                   map: map,
                   content: contentString,
                   custCode: data[x].custCode,
                   icon: {
                     url:'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/'+data[x].mdColor.substr(1),
                       //scaledSize: new google.maps.Size(33, 33)
                   }
                 });
                 markers.push(marker);

                 google.maps.event.addListener(marker, 'click', (function(marker, x) {
                   return function(){
                     new google.maps.InfoWindow({ maxWidth: 500});
                     infoWindow.setContent(this.content);
                     infoWindow.open(map, marker);
                     }
                 
                 })(marker, x));
               }//end for  
               google.maps.event.addListener(infoWindow, 'closeclick', function() {  
                       //displayAllData.resume();
                   });
             }      
           }//on succjess
         }).done(function () {
         setTimeout(function(){
             $('#outerContainer_id').show();
             $('#filterBtn').html("Generate");
             $('#filterBtn').prop('disabled', false);
         }, 1000);
       });
     }
   }//display salesman funciton

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
  }

   siteLocation();
   var myLatlng, mapOptions, map, marker, mpaPolygon, contentString = "", mpa_coords = [[]];
   var mpa_header=[[]];  //DATA TO HOLD THE LONG AND LAT
   var mpa_polygon=[];
   var md_lang = [];
   var md_lat = []; 
   var myLatlng_buddy = [];
   var displayAllData, heatmap, sitelat, sitelng, sitezoom;
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
       

       new custSelection(map);
       new setRestoreBtn(map);
       new categoryProductBtn(map);
       new salesmanBtn(map);

       map.addListener('click', function() {
         infoWindow.close(); 
         deleteBounce();
       });

      
        //storeLocations();

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

    function custSelection(map){
          this.map = map;
          var btn = document.getElementById('custSelection');
          this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);

   }

    function setRestoreBtn(map){
          this.map = map;
          var btn = document.getElementById('restorBtn');
          this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);

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
   

   function restoreLoc(){
     
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

 function defaultStore(image) {
   image.onerror = "";
   image.src = "../img/store-image.png";
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