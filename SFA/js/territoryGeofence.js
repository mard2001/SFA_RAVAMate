var userID = localStorage.getItem('user_id');
var user = 'bohol';
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

getAllSalesmanfuipanay();
/*NOTIFICATION SECTION*/
// showNotif();

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
     $('#headingTitle').html(r[0].company.toUpperCase() +' / Territory Geofencing');
     }
 });
} 
// $(document).on('click', '.dropdown-toggle', function(){
//  $('.count').html('');
//   showNotif('yes');
// });

// setInterval(function(){
// showNotif();
// }, 9000);

$('[data-toggle="tooltip"]').tooltip(); 

$('#navDrop').click(function() {
 $("i", this).toggleClass("glyphicon-menu-up glyphicon-menu-down");
});

   function showNotif(view=''){
      //notification

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
 
 var territoryColor = document.getElementById("terrcolor");
 var GlobalColor = "";

  /* if(localStorage.getItem("admin-userName") == null)
       window.location = "index.html";
   */
   history.pushState(null, null, document.URL);
   window.addEventListener('popstate', function () {
           history.pushState(null, null, document.URL);
    });

   //interval to get geofences 
/* setInterval(function () { 
   //reset mpa
  if(mpa_polygon.length > 0){  
     for(var i = 0; i < mpa_polygon.length; i++){ 
       mpa_polygon[i].setMap(null);
     }
     mpa_polygon = [];
   }

     displayMPA();
     dashBoard_direct_marker();
   
}, 20000);*/

   function getRandomColor() {
     var letters = '0123456789ABCDEF';
     var color = '#';
     for (var i = 0; i < 6; i++) {
       color += letters[Math.floor(Math.random() * 16)];
     }
     return color;
   }


  function getAllSalesmanfuipanay(){
      $.ajax ({
           url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
           type: "GET",
           data: {"type":"get_all_salesman_bohol", "CONN":con_info},
           dataType: "html",
           crossDomain: true,
           cache: false,            
           success: function(response){  
           //console.log(response);             
            var data = JSON.parse(response);
            var option = '';
            for(var x = 0; x<data.length; x++){
             option += '<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>';
            }
            $('#salesmanList').html(option);
           }//success here;
       })

   }

 function salesmanCol(salesman){
    var color;
    var fcolor;
    var ajaxTime= new Date().getTime();
    var totalTime= 0;

     $.ajax ({
             url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
             type: "GET",
             data: {"type":"get_all_color_bohol", "site":user, "CONN":con_info},
             dataType: "JSON",
             crossDomain: true,
             cache: false,  
             async: false,          
             success: function(data){    
               fuipanay_salescolor = '#158fd1';
             }//success here;
         });
    //return color;
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


    function clearMarker(){
     DeleteMarkers();

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
  //alert boundary
   var salesmanName=[];
   
   var customer = [];

   $('#proceed-mpa-btn').attr('disabled','disabled');

       var names=[];
       var ids=[];
       var salesmanID=[];
       var dateMPA=[];
       var color=[];
  function displayMPA (){
   /* for(var i = 0; i < mpa_polygon.length; i++){ 
       mpa_polygon[i].setMap(null);
     }
     mpa_polygon = [];*/

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
                         fillOpacity: 0.1,
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
               }
           })
      
   }//displayMPA

    var marker, infoWindow, marker;
 function dashBoard_direct_marker(){
   var compDist = 0;
        $.ajax ({
          url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
         type: "GET",
         data: {
                  "type":"SALES_REPORT", 
                  'start':'2023-10-01',
                  'end':'2023-10-30',
                  "CONN":con_info
               },
         dataType: "html",
         crossDomain: true,
         cache: false,
         success: function(response){ 

           if(response == 0){
                 console.log('empty dashboard!');
           }else{
             var data = JSON.parse(response); 
             for(var x=0; x<data.length; x++){

                       marker = new google.maps.Marker({
                         id: data[x].mdCode,
                         transCount: data[x].transCount,
                         loc: data[x].latitude+' '+data[x].longitude,
                         mdName: data[x].Salesman,
                         infowindow: infoWindow,
                         position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                         map: map,
                         icon: {
                              url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/'+data[x].transCount+'/'+data[x].mdColor.substr(1),
                              scaledSize: new google.maps.Size(32, 36)
                         }
                       });
                       
                     
                         markers.push(marker);

                         google.maps.event.addListener(marker, 'click', (function(marker, x) {
                           return function(){
                           
                         //  compDist = distance(data[x].latitude, data[x].longitude, data[x].transCount);
                           
                           lat1 = data[x].latitude; 
                           lon1 = data[x].longitude;
                           var contentString = "<div style='margin: 0 auto;'><div class='modal-header' style='text-align: center;'>"+
                             "<div class=''><img class='salesmanPic' alt='salesmanPic' style='border: solid 3px "+data[x].mdColor+"' src='../img/salesman_"+user+"/"+data[x].Salesman+".jpg' onError='imgError(this)'/>"+
                              "<br/><span class='label label-pill label-danger count' style='font-size: 10px; border-radius:100%; float:center; background-color:"+data[x].mdColor+";' id='getThisTransCount'>"+data[x].transCount+"</span>"+
                              "<span class='fa fa-chevron-left pull-left' style='float: left; font-size: 30px;' id='prevMD'></span><span id='nextMD' class='fa fa fa-chevron-right pull-right' style='float: left; font-size: 30px;'></span></div></div>"+
                                                         "<div class='table-responsive'>" +
                                                            "<table class='table table-condensed'>" +
                                                             "<tr><td>Salesman:</td><td id='getThisSalesman'>"+data[x].Salesman+"</td></tr>"+
                                                              "<tr><td>Customer:</td><td>"+data[x].Customer+"</td></tr>"+
                                                              "<tr><td>Location:</td><td id='getThisLongLat'>"+data[x].latitude +' '+data[x].longitude+"</td></tr>"+
                                                              "<tr><td>Document No:</td><td>"+data[x].DocumentNo+"</td></tr>"+
                                                              "<tr><td>Delivery Date:</td><td>"+data[x].deliveryDate+"</td></tr>"+
                                                              "<tr><td>Sales:</td><td>&#8369; "+data[x].Sales+"</td></tr>"+
                                                              "<tr><td>Time Spent:</td><td>"+data[x].timeSpent + ' '+data[x].transCount+"</td></tr>"+
                                                              "<tr><td>Distance Travel:</td><td>"+compDist+ " in " +data[x].time + " "+ data[x].transCount+"</td></tr>"+
                                                             "</div>"+
                                                           "</table>"+
                                                         "</div>";
                                   
                                   infoWindow.setContent(contentString);
                                   infoWindow.open(map, marker);
                                   nextInfo();
                                   prevInfo(); 
                                   
                             }
                         
                         })(marker, x));
             }//end for  
           }
         }//close else
       });
     infoWindow = new google.maps.InfoWindow;
   }//end direct dashboard colpal
   
   var myLatlng, mapOptions, map, marker, mpaPolygon, contentString = "", mpa_coords = [[]], fuipanay_salescolor;
   var mpa_header=[[]];  //DATA TO HOLD THE LONG AND LAT
   var mpa_polygon=[];
    function saveMPA()
     {

        var mdCode = $('#salesmanList').val();
        var salesmanName = $('#salesmanList').find(":selected").text();
        var userID = localStorage.getItem('user_id');
        // salesmanCol(mdCodedATA);

              if(salesmanName == "" || salesmanName == undefined){
                 alert("Please select a salesman");
               }else {
                   $.ajax ({
                     url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
                     type: "GET",
                     data: {
                              "type": "INSERT_FENCE_GEOFENCING_TERRITORY_LOCKING",
                              "mdCode":mdCode,
                              "gtm":'',
                              "salesmanname":salesmanName,
                              "terrcolor":'',
                              "createdby":userID,
                              "boundary_coordinates": mpa_coords,
                              "CONN":con_info
                            },
                     dataType: "html",
                     crossDomain: true,
                     cache: false, 
                     async: false,          
                     success: function(response){                  
                       alert("RESPONSE: " + response);
                        $('#saveModal').modal('toggle');
                     },
                     error: function (err, statusText, errorThrown){
                       alert(errorThrown);
                     }
                 })
             
                //  $("#saveModal").on("hidden.bs.modal", function () {
                //      location.reload();
                //  });
             }//else
        
       

     }//saveMPA

     function deleteMPA(){
          if (confirm("Are you sure do you want to delete this boundary?")) {
             $.ajax ({
                 url: "/geofencing/GeofencingAPI.php", 
                 type: "GET",
                 data: {"type":"delete_mpa_"+user, "id": $("#mpa-id").val()},
                 dataType: "html",
                 crossDomain: true,
                 cache: false,            
                 success: function(response){                  
                   alert(response);
                    $('#dispModal').modal('toggle');
                 },
                 error: function (err, statusText, errorThrown){
                   alert(errorThrown);
                 }
             })
             $("#dispModal").on("hidden.bs.modal", function (){
                     location.reload();
             });
       }
     }//deleteMPA

   function erase(polygon){
     polygon.setMap(null);
      }
 
 siteLocation();
 var sitelat, sitelng, sitezoom;
 function init(){
   navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 6000});
   
   function onSuccess(position) {
     var lat, lang, zoomLevel = 0;
     lat = parseFloat(sitelat);
     lang = parseFloat(sitelng);
     zoomLevel = parseInt(sitezoom);
     myLatlng = new google.maps.LatLng(lat, lang);

     mapOptions = {
       zoom: 10,
       center: myLatlng,
       mapTypeId: 'roadmap',
       controlSize: 20
     }
     map = new google.maps.Map(document.getElementById('map'), mapOptions);
     new setRestoreBtn(map);
     new setEraseBtn(map);
     new hideMarker(map);


     drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
      position: google.maps.ControlPosition.RIGHT,
      drawingModes: ['polygon'],
      fillColor: '#40a1de',
      fillColor: '#40a1de',
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      draggable: true,
      geodesic: true,
      //editable: true
      },  
      markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images'},
      // draggableCursor: 'default'

  });


  drawingManager.setMap(map);
  map.setOptions({draggableCursor:'default'});

  map.data.setStyle({
    fillColor: '#fff',
    fillOpacity: 1,
    clickable: false
  });


   //when polygon is formed
    google.maps.event.addListener(drawingManager,'polygoncomplete',function(polygon) {
       $('#proceed-mpa-btn').removeAttr('disabled');
       
        //polygon.setEditable(true);
       var vertices = polygon.getPath();
       
       for (var i =0; i < vertices.getLength(); i++) {
             var xy = vertices.getAt(i);
               mpa_coords[i]=[];
               mpa_coords[i][0]= i;
               mpa_coords[i][1]= xy.lat();
               mpa_coords[i][2]= xy.lng();
               
               contentString += mpa_coords[i][0] + " " + mpa_coords[i][1] + " " + mpa_coords[i][2] + "&#13;&#10;";
           }

           $("#coords-info").html(contentString);

            contentString="";

             $('#eraseBtn').click(function() {
                   erase(polygon);
             });
       });
      
       //dashBoard_direct_marker();
       displayMPA();
     }//onSuccess  
     
     function onError(error) {
         alert('code: ' + error.code + '\n' +
               'message: ' + error.message + '\n');
     }//onError    

   google.maps.event.addDomListener(window, 'load', onSuccess);
 }//init
 function setRestoreBtn(map){
    this.map = map;
    var btn = document.getElementById('restorBtn');
    this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);

 }

 function setEraseBtn(map){
    this.map = map;
    var btn = document.getElementById('eraseBtn');
    this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
 }

 function hideMarker(map){
    this.map = map;
    var btn = document.getElementById('hideMarker');
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


$("#hideMarker").clickToggle(function() {   
 dashBoard_direct_marker();
}, function() {
   DeleteMarkers();
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