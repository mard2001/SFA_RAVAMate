
let coordinates=[];
var drawingManager;
var GBLPOLYGON;
var map;
var Longitude = [], Latitude = [], salesmanName=[], customer = [], names=[], ids=[], salesmanID=[], dateMPA=[], color=[];
var territoryColor = document.getElementById("terrcolor");
var mapOptions, map, mpaPolygon, contentString = "", mpa_coords = [[]];
var mpa_header=[[]];
var mpa_polygon=[];
var sitelat, sitelng, sitezoom;
var inside_fence_markers = [];
var insidemarkers = [];
var responseArray = [];

var GBLSITEINDI_SOSYO;
var GLOBALDISTDBNAME;
var marker, infoWindow;
var markers = [];
var startPickDate, endPickDate;
var sosyomarkers = [];
var sosyomarker = [];
var sosyoStoresArrHolder = [];
var sysproStoresArrHolder = [];
var sosyocustomer = 0;
var allFences = [];


siteLocation();

function createRightControl(map) {
  const controlButton = document.getElementById('mapbuttonsdiv');

  $('#mdi-fullscreen-maps-btn').click(function (){
    $('#map div.gm-style button[title="Toggle fullscreen view"]').trigger('click');
  });

  $('#mdi-hand-back-left-outline-maps-btn').click(function (){
    drawingManager.setMap(null);
    drawingManager.setDrawingMode(null);
  });

  $('#mdi-earth-maps-btn').click(function (){
    if (map.getMapTypeId() != google.maps.MapTypeId.HYBRID) {
          map.setMapTypeId(google.maps.MapTypeId.HYBRID)
      }else if(map.getMapTypeId() != google.maps.MapTypeId.ROADMAP){
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
      }
  }); 

  $('#mdi-satellite-maps-btn').click(function (){
    if (map.getMapTypeId() != google.maps.MapTypeId.TERRAIN) {
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN)
    }else if(map.getMapTypeId() != google.maps.MapTypeId.ROADMAP){
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
    }
    var element = $('#mdi-earth-maps-btn span');
    element.removeClass("mdi-map-outline").addClass("mdi-earth");
  });

  $('#mdi-draw-pen-maps-btn').click(function (){
    drawingManager.setMap(map);
    drawingManager.setOptions({
      drawingControl: false
    });
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  });

  $('#mdi-eraser-maps-btn').click(function (){
    drawingManager.setMap(null);
    drawingManager.setDrawingMode(null);
  });

  $('#mdi-refresh-maps-btn').click(function (){
    map.setCenter({ lat: 9.8500, lng: 124.1435 });
    map.setZoom(11);
  });

  return controlButton;
}

function initMap() {
  var lat, lang, zoomLevel = 0;
  lat = parseFloat(sitelat);
  lang = parseFloat(sitelng);
  zoomLevel = parseInt(sitezoom);
  myLatlng = new google.maps.LatLng(lat, lang);
  mapOptions = {
    zoom: zoomLevel, 
    center: myLatlng,
    mapTypeId: 'roadmap',
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    disableDefaultUI: false,
    drawingControl: false,
  }

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  const rightControlDiv = document.createElement('div');
  const rightControl = createRightControl(map);
  rightControlDiv.appendChild(rightControl);
  map.controls[google.maps.ControlPosition.RIGHT].push(rightControlDiv);

  const topLeftDiv = document.createElement('div');
  const topLeftTable = document.getElementById('mainMapDiv');
  topLeftDiv.appendChild(topLeftTable);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(topLeftDiv);

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    }, 
    polygonOptions: {
      fillColor: getRandomColor(),
      fillOpacity: 0.6,
      strokeWeight: 5,
      clickable: true,
      editable: true
    }
  });

  google.maps.event.addListener(drawingManager,'polygoncomplete',function(polygon) {
    // $('#proceed-mpa-btn').removeAttr('disabled');
    polygon.setEditable(true);
    GBLPOLYGON = polygon;

    dragendpolygon(polygon);
    contentString="";

    $('#mdi-eraser-maps-btn').click(function() {
      erase(polygon);
    });
    getsosyostores(polygon);
    checkWithinMPA(polygon);
  });

  map.addListener('click', function() {
    deleteInsideMarkers();
  });
  
  
  displayGeofences();
}
initMap(); 

function getpolygonpath(){
  var vertices = GBLPOLYGON.getPath();
  for (var i =0; i < vertices.getLength(); i++) {
    var xy = vertices.getAt(i);
    mpa_coords[i]=[];
    mpa_coords[i][0]= i;
    mpa_coords[i][1]= xy.lat();
    mpa_coords[i][2]= xy.lng();
    
    contentString += mpa_coords[i][0] + " " + mpa_coords[i][1] + " " + mpa_coords[i][2] + "&#13;&#10;";
  }

  $("#test").html(contentString);
  // contentString="";
}

function customizeDrawingControl() {
  const drawingControlElement = getDrawingControlElement();

  if (drawingControlElement) {
    // Apply custom styles using CSS
    drawingControlElement.style.backgroundColor = 'lightblue';
    drawingControlElement.style.border = '1px solid #ccc';
    // Add any additional styles as needed
  }
}

function getDrawingControlElement() {
  return document.querySelector('.gmnoprint:first-child');
}

function setSatellite(){
  $('#mdi-satellite-maps-btn').click(function (){
    if (map.getMapTypeId() != google.maps.MapTypeId.HYBRID) {
          map.setMapTypeId(google.maps.MapTypeId.HYBRID)
          map.setTilt(0); // disable 45 degree imagery
      }else if(map.getMapTypeId() != google.maps.MapTypeId.ROADMAP){
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
        map.setTilt(0); // disable 45 degree imagery
      }
  });
}

function displayMPA (){
  var dialog = 
    bootbox.dialog({
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
    });
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function erase(polygon){
  polygon.setMap(null);
}

function dragendpolygon(polygon){
  google.maps.event.addListener(polygon,'click',function() {
    checkWithinMPA(polygon);
    $('#createTerrModal').modal('show');
    getsosyostores(polygon);
  });
}

function calculateCenter(coordinates) {
  const longitudes = coordinates.map(coordinate => parseFloat(coordinate.LONGITUDE));
  const latitudes = coordinates.map(coordinate => parseFloat(coordinate.LATITUDE));

  // sort the arrays low to high
  latitudes.sort();
  longitudes.sort();

  // get the min and max of each
  const lowX = latitudes[0];
  const highX = latitudes[latitudes.length - 1];
  const lowy = longitudes[0];
  const highy = longitudes[latitudes.length - 1];

  // center of the polygon is the starting point plus the midpoint
  const centerX = lowX + ((highX - lowX) / 2);
  const centerY = lowy + ((highy - lowy) / 2);

  map.setZoom(15);
  map.setCenter({ lat: centerX, lng: centerY });
}


function clickFence(encodedCoordsArray) {
  try {
    var coordsArray = JSON.parse(decodeURIComponent(encodedCoordsArray));
    calculateCenter(coordsArray);

  } catch (error) {
    console.error("Error in clickFence:", error);
  }
}

function getAllFences() {
  var x, contentString = "";
  var tAmount = 0;
  var tFence = 0;

  if (allFences.length > 0) {
    tFence = allFences.length + 1;
    for (x = 0; x < allFences.length; x++) {
      var coordsArray = allFences[x].COORDS;
      // Convert coordsArray to JSON string and encode for HTML attribute
      var encodedCoordsArray = encodeURIComponent(JSON.stringify(coordsArray));
      // console.log(encodedCoordsArray);
      contentString +=
        `<tr onclick="clickFence('${encodedCoordsArray}')">
            <td>${allFences[x].FENCENAME}</td>
            <td class="text-center">${allFences[x].TSOSYO}</td>
            <td class="text-center">${allFences[x].TSYSPRO}</td>
            <td class="text-center">${allFences[x].TOTALSALES}<i class="fa-solid fa-arrow-down" style="color: #FF0000;"></i></td>
        </tr>`;

      tAmount += parseFloat((allFences[x].TOTALSALES.replaceAll(',', '')));
    }

    $('#fenceTableDataDisplay').show().html(contentString);
    $('#totalFence').html('Total (' + tFence + ') : ' + `<span class="fw-bold" id="totalFenceSales">` + `₱ ` + tAmount.toLocaleString() + `</span>`);
  } else {
    console.log("No data in allFences Array");
  }
}

function savefenceStores(refno, storeType, salesman, custcode,
  storename, datecreated_info, address, noOfOrders, totalOrders, latitude, longitude, lastOrder){

  $.ajax ({
    url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php", 
    type: "POST",
    data: {
      'type':'INSERT_FENCE_STORES',
      refno:refno,
      storeType:storeType,
      salesman:salesman,
      custcode:custcode,
      storename:storename,
      datecreated_info:datecreated_info,
      address:address,
      noOfOrders:noOfOrders,
      totalOrders:totalOrders,
      latitude:latitude,
      longitude:longitude,
      lastOrder:lastOrder,
      "userID": GBL_USERID,
      "distCode": GBL_DISTCODE
    },
    dataType: "json",
    crossDomain: true,
    cache: false, 
    async: true,     
    error: function (err, statusText, errorThrown){
      alert(errorThrown);
    }
  });
}

function saveMPA(){

  getpolygonpath();

  var userID = localStorage.getItem('user_id');
  var fullname = localStorage.getItem('fullname');
  var fenceName= $('#newFenceName').val();

  var tsysprostores = $('#newFenceSysproStores').val();
  var tsosyostores = $('#newFenceSosyoStores').val();
  var daterange = $('#newFenceDataRange').val();
  var totalSelected = $('#newFenceTotalSales').val();
  
  var storeListForInsert = sosyoStoresArrHolder;
  var f = confirm('Are you sure you want to set this MCP calibration?');
  if(f){

    $('#createTerritoryBtn').html('<i class="fa fa-spin fa-spinner"></i> please wait...');
    $('#createTerritoryBtn').prop('disabled', true);
    $.ajax ({
      url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php", 
      type: "POST",
      data: {
        'type':'INSERT_FENCE_TERRITORY',
        'fenceName': fenceName,
        'userID':userID+' '+fullname,
        "boundary_coordinates": mpa_coords,
        'tsysprostores':tsysprostores,
        'tsosyostores':tsosyostores,
        'daterange':daterange,
        'totalSales':totalSelected,
        "userID": GBL_USERID,
        "distCode": GBL_DISTCODE
      },
      dataType: "json",
      crossDomain: true,
      cache: false, 
      async: false,          
      success: function(response){          
        mpa_coords = [[]];      
        var r = sosyoStoresArrHolder;
        for(var x = 0; x < r.length; x++){
          savefenceStores(response.cIDheader,
            r[x].STORETYPE,
            r[x].SALESMAN,
            r[x].CUSTCODE,
            r[x].STORENAME,
            r[x].DATECREATED_INFO,
            r[x].ADDRESS,
            r[x].NOORDERS,
            r[x].TOTALORDERS,
            r[x].LONGITUDE,
            r[x].LATITUDE,
            r[x].LASTORDER);
        }

        setTimeout(function() { 
          alert("Fence " +fenceName+ " was successfully created.");
          location.reload();
        }, 10000);
      },
      error: function (err, statusText, errorThrown){
        alert(errorThrown);
      }
    });
  }
}//saveMPA

function displayGeofences (){
  var siteID = localStorage.getItem('SITEID');
  //  getfencesList();
  var infoWindow = new google.maps.InfoWindow();
  
  $.ajax ({
    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
    type: "POST",
    data: {
    'type':'GET_ALL_FC_GEOFENCE',
    "userID": GBL_USERID,
    "distCode": GBL_DISTCODE
    },
    dataType: "html",
    crossDomain: true,
    cache: false,            
    async: false,
    success: function(response){
      
      if(response != 0){
        allFences = JSON.parse(response);
        $("#res").html(response);
        var ctr=0;

        $(jQuery.parseJSON(response)).each(function() {   
          mpa_header[ctr] = [];
          mpa_header[ctr][0] = this.cID;
          mpa_header[ctr][1] = this.FENCENAME;
          mpa_header[ctr][2] = this.USERID;
          mpa_header[ctr][3] = this.DATECREATED;
          mpa_header[ctr][4] = this.TSYSPRO;
          mpa_header[ctr][5] = this.DATEUPDATED;
          mpa_header[ctr][6] = this.TSOSYO;
          mpa_header[ctr][7] = [];
          mpa_header[ctr][8] = this.COORDS;
          mpa_header[ctr][9] = this.TOTALSALES;
              
          ctr++;
        });
        
        for(var i = 0; i < mpa_header.length; i++){
          var coord_ary=[];

          //alert("MPAID " + mpa_header[i][5]);
          for(var j = 0; j < mpa_header[i][8].length; j++){
            //alert("COORDS " + mpa_header[i][5][j].MPALATITUDE + " " +  mpa_header[i][5][j].MPALONGITUDE);
            coord_ary.push({lat: Number(mpa_header[i][8][j].LATITUDE), 
                          lng: Number(mpa_header[i][8][j].LONGITUDE)});
            }
            var boundary = coord_ary;

            mpaPolygon = new google.maps.Polygon({
              paths: boundary,
              strokeColor: '#6156d6',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: '#6156d6',
              fillOpacity: 0.7,
              editable: false,
              draggable: false,
              cID:mpa_header[i][0],
              FENCENAME: mpa_header[i][1],
              DATECREATED: mpa_header[i][3],
              // FENCENAME: mpa_header[i][2],
              TSYSPRO: mpa_header[i][4],
              TSOSYO: mpa_header[i][6],
              TOTALSALES: mpa_header[i][9],
            });

            mpa_polygon.push(mpaPolygon);
        }
        //loop for polygon vertices
        for(var i = 0; i < mpa_polygon.length; i++){ 
          mpa_polygon[i].setMap(map);

          google.maps.event.addListener(mpa_polygon[i], 'click', function(e){
            infoWindow.close();

            var contentString = `
              <div style='margin: 0 auto;'>
                  <table class="table table-sm table-striped">
                      <tr>
                          <td>Name</td>
                          <td><strong>` + this.FENCENAME.toUpperCase() + `</strong></td>
                      </tr>
                      <tr>
                          <td>Syspro Stores</td>
                          <td><strong>` + this.TSYSPRO + `</strong></td>
                      </tr>
                      <tr>
                          <td>Sosyo Stores</td>
                          <td><strong>` + this.TSOSYO + `</strong></td>
                      </tr>
                      <tr>
                          <td>Total Sales</td>
                          <td><strong>` + this.TOTALSALES + `</strong></td>
                      </tr>
                      <tr>
                          <td>Date Created</td>
                          <td><strong>` + this.DATECREATED + `</strong></td>
                      </tr>
                      
                  </table>
              <div/>`;

              $('#fenceIDHolder').val(this.cID);
              $('#fenceContent').html(contentString);
              $('#updateFenceModal').modal('show');
          });
        } 

      }
    }, error: function (err, statusText, errorThrown){
      alert(errorThrown);
      alert("UNSUCCESSFUL");
    }
  });
}//displayFCGeofences

function removeFence(){
  var cID = $('#fenceIDHolder').val();
  var f = confirm('Are you sure you want to remove this geofence?');

  if(f){
    $.ajax({
      type: "POST",
      url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
      data: {
        "type": 'REMOVE_FENCE',
        'cID': cID,
        "userID": GBL_USERID,
        "distCode": GBL_DISTCODE
      },
      dataType: "JSON",
      crossDomain: true,
      cache: false,
      async: false,
      success: function (r) {
        if(r){
          alert('Fence successfully remove.');
          location.reload();
        }
      }
    });
  }
}

function viewmarkers_inside_fence(){
  deleteSoysoMarkers();
  DeleteMarkers();
  deleteInsideMarkers();
  var fenceID = $('#fenceIDHolder').val();
  $.ajax ({
    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
    type: "POST",
    data: {
      'type':'GET_INSIDE_FENCE_STORES',
      'fenceID': fenceID,
      "userID": GBL_USERID,
      "distCode": GBL_DISTCODE
    },
    dataType: "json",
    crossDomain: true,
    cache: false, 
    async: false,          
    success: function(data){           
      var iconselector;
      var contentstringselector;
      for(var x=0; x<data.length; x++){
        if(data[x].STORETYPE == 'SYSPROSTORES'){
          iconselector ={
            url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/d65656',
            scaledSize: new google.maps.Size(15, 17)
          };

          var imglink = GLOBALLINKAPI+"/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
          contentstringselector = "<div style='margin: 0 auto;'><div class='modal-header' style='text-align: center;'>"+
              "<div class=''><img class='salesmanPic' alt='salesmanPic' src='"+imglink+data[x].CUSTCODE+".jpg' onError='imgError(this)'/><br/>"+
              "</div></div>"+
                "<div class='table-responsive'>" +
                  "<table class='table table-condensed' style='color: black !important;'>" +
                    "<tr><td>Salesman:</td><td id='getThisSalesman'>"+data[x].SALESMAN+"</td></tr>"+
                    "<tr><td>Customer:</td><td>"+data[x].CUSTCODE +' '+ data[x].STORENAME+"</td></tr>"+
                    "<tr><td>Location:</td><td id='getThisLongLat'>"+data[x].LONGITUDE +' '+data[x].LATITUDE+"</td></tr>"+
                    "<tr><td>Sales:</td><td>&#8369; "+data[x].TOTALORDERS+"</td></tr>"+
                    "<tr><td>Range:</td><td>"+data[x].DATECREATED_INFO+"</td></tr>"+
                    "</div>"+
                  "</table>"+
                "</div>";
        }else{
          iconselector = {
              url: 'https://fastsosyo.com/comports/admin/v2/html/AIOSTORE_MARKER/sosyo2_marker.png',
              scaledSize: new google.maps.Size(11, 17)
          };
          contentstringselector = `
          <div style='margin: 0 auto; color: black !important;'>
              <div style='text-align: center;'>
                  <img class='storemarkerImage' alt='storeImage' src="https://fastdevs-api.com/FASTSOSYO/download/image/storeimage/`+data[x].CUSTCODE+`.jpg"/>
              </div>
              <table class="table table-sm table-striped">
                  <tr>
                      <td style="width: 100px;">Store Name</td>
                      <td><strong>` + data[x].STORENAME.toUpperCase() + `</strong></td>
                  </tr>
                  <tr>
                      <td>Date Created</td>
                      <td><strong>` + data[x].DATECREATED + `</strong></td>
                  </tr>
                  <tr>
                      <td>Address</td>
                      <td><strong>` + data[x].ADDRESS + `</strong></td>
                  </tr>
                  <tr>
                      <td># Orders</td>
                      <td><strong>` + data[x].NOORDERS + `</strong></td>
                  </tr>
                  <tr>
                      <td>Total Orders</td>
                      <td><strong>&#8369;` + data[x].TOTALORDERS + `</strong></td>
                  </tr>
                  <tr>
                      <td>Last Order</td>
                      <td><strong>` + data[x].LASTORDER + `</strong></td>
                  </tr>
              </table>
          <div/>`;
       }

       insidemarkers = new google.maps.Marker({
          loc: data[x].LATITUDE+' '+data[x].LONGITUDE,
          longitude: data[x].LATITUDE,
          latitude: data[x].LONGITUDE,
          storename: data[x].STORENAME,
          infoWindow: infoWindow,
          contentString:contentstringselector,
          position: new google.maps.LatLng(data[x].LONGITUDE, data[x].LATITUDE),
          map: map,
          icon: iconselector
        });

        inside_fence_markers.push(insidemarkers);    

        google.maps.event.addListener(insidemarkers, 'click', (function(insidemarkers, x) {
          return function(){            
            infoWindow.setContent(this.contentString);
            infoWindow.open(map, insidemarkers);
          }
        })(insidemarkers, x));
      }//end for  
    }
  });
  infoWindow = new google.maps.InfoWindow;
}

getcompname_dynamic("MCP Calibration", "headingTitle");
// getcompname();
function getcompname(){
    $.ajax ({
    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
    type: "POST",
    data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
    dataType: "json",
    crossDomain: true,
    cache: false,            
    success: function(r){ 
        $('#headingTitle').html(r[0].company.toUpperCase() +' | MCP Calibration');
        GBLSITEINDI_SOSYO = r[0].DIST_CD;
        GLOBALDISTDBNAME = r[0].DIST_INDI;
        }
    });
} 

datePicker();
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
    // dashBoard_direct_marker(start, end);

    startPickDate = start;
    endPickDate = end;

    });
}


function loadSalesman(salesmanType){   
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"get_salesmanLoad_mcprecalibration",
            "salesmanType":salesmanType,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
            },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            var salesManArr = [];
            salesManArr.splice(0, data.length);
            for(var x = 0; x<data.length; x++){
                var salesMan = {
                    label: data[x].Salesman, value: data[x].mdCode
                }
                salesManArr.push(salesMan);
            }
            if (window.vsInstance) {
                // Update options in the existing VirtualSelect instance
                window.vsInstance.update(options);
            } else {
                // Initialize VirtualSelect if it doesn't exist
                VirtualSelect.init({
                    ele: '#multipleselectSalesMan',
                    options: salesManArr,
                    placeholder: 'None Selected'
                });
                selectOptions(salesManArr);
            }
            
        }
    });
}

loadSalesman('ALL');
$('#salesmanType').on('change', function() {
    var salesmanType = this.value;
    loadSalesman(salesmanType);
});

function selectOptions(option){
    // document.querySelector('#multipleselectSalesMan').destroy();
    document.querySelector('#multipleselectSalesMan').destroy();
    VirtualSelect.init({ 
        ele: '#multipleselectSalesMan',
        options: option,
        placeholder: 'None Selected'
    });
}

function DeleteMarkers() {
//Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    for (var i = 0; i < sosyomarkers.length; i++) {
        sosyomarkers[i].setMap(null);
    }
    sosyomarkers = [];
}

function deleteSoysoMarkers(){
    for (var i = 0; i < sosyomarkers.length; i++) {
        sosyomarkers[i].setMap(null);
    }
    sosyomarkers = [];
}

function deleteInsideMarkers(){
    for (var i = 0; i < inside_fence_markers.length; i++) {
        inside_fence_markers[i].setMap(null);
    }
    inside_fence_markers = [];
}

function proceedFilter(){
    $('#filterDetailsModal').modal('hide');
    deleteSoysoMarkers();
    DeleteMarkers();
    deleteInsideMarkers();
    dashBoard_direct_marker(startPickDate, endPickDate);
}

function dashBoard_direct_marker(start, end){
    var compDist = 0;
    var salesman = $('#multipleselectSalesMan').val();

    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> processing request please wait...</p>',
        backdrop: true,
        closeButton: false
    });
    var message = 'Successfully Saved!';
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {
            "type":"NO_NAME_TAGGING", 
            'start': start,
            'end': end,
            'salesman':salesman,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "html",
        crossDomain: true,
        cache: false,
        // async: false,
        success: function(response){ 
            var imglink = GLOBALLINKAPI+"/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
            dialog.modal('hide');
            if(response == 0){
                console.log('empty dashboard!');
            }else{
                var data = JSON.parse(response); 
                for(var x=0; x<data.length; x++){
                    marker = new google.maps.Marker({
                        id: data[x].mdCode,
                        transCount: data[x].transCount,
                        loc: data[x].latitude+' '+data[x].longitude,
                        longitude: data[x].longitude,
                        latitude: data[x].latitude,
                        mdName: data[x].Salesman,
                        mdCode: data[x].mdCode,
                        infowindow: infoWindow,
                        Address: data[x].Address,
                        Customer: data[x].Customer,
                        custCode: data[x].custCode,
                        dateRange: data[x].dateRange,
                        totalAmount: data[x].totalAmount,
                        totalAmount_raw: data[x].totalAmount_raw,
                        position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                        map: map,
                        icon: {
                            url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/'+data[x].mdColor.substr(1),
                            // scaledSize: new google.maps.Size(32, 36)
                            scaledSize: new google.maps.Size(15, 17)
                        }
                    });
                    
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, x) {
                        return function(){
                            //  compDist = distance(data[x].latitude, data[x].longitude, data[x].transCount);
                            lat1 = data[x].latitude; 
                            lon1 = data[x].longitude;
                            var contentString = "<div style='margin: 0 auto;'><div class='modal-header' style='text-align: center;'>"+
                                "<div class=''><img class='salesmanPic' alt='salesmanPic' src='"+imglink+data[x].custCode+".jpg' onError='imgError(this)'/><br/>"+
                                "</div></div>"+
                                    "<div class='table-responsive'>" +
                                    "<table class='table table-condensed' style='color: black !important;'>" +
                                        "<tr><td>Salesman:</td><td id='getThisSalesman'>"+data[x].Salesman+"</td></tr>"+
                                        "<tr><td>Customer:</td><td>"+data[x].Customer+"</td></tr>"+
                                        "<tr><td>Location:</td><td id='getThisLongLat'>"+data[x].latitude +' '+data[x].longitude+"</td></tr>"+
                                        "<tr><td>Sales:</td><td>&#8369; "+data[x].totalAmount+"</td></tr>"+
                                        "<tr><td>Range:</td><td>"+data[x].dateRange+"</td></tr>"+
                                        "</div>"+
                                    "</table>"+
                                    "</div>";
                                    
                            infoWindow.setContent(contentString);
                            infoWindow.open(map, marker);
                        }   
                    })(marker, x));
                }//end for  
            } 
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Something went wrong!</b>' + XMLHttpRequest.responseText;
            var totalTime = new Date().getTime()-ajaxTime;
            
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        }
        });
    infoWindow = new google.maps.InfoWindow;
}//end direct dashboard colpal

function getsosyostores(mpa_polygon){
    deleteSoysoMarkers();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {
        "type":"GET_SOSYO_STORES", 
        'fastsosyo_distcode': GBLSITEINDI_SOSYO,
        "userID": GBL_USERID,
        "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,
        success: function(data){ 
            sosyocustomer = 0;
            for(var x=0; x<data.length; x++){
                var contentString = `
                    <div style='margin: 0 auto; color: black !important;'>
                        <div style='text-align: center;'>
                            <img class='storemarkerImage' alt='storeImage' src="https://fastdevs-api.com/FASTSOSYO/download/image/storeimage/`+data[x].USERID+`.jpg"/>
                        </div>
                        <table class="table table-sm table-striped">
                            <tr>
                                <td style="width: 100px;">Store Name</td>
                                <td><strong>` + data[x].STORENAME.toUpperCase() + `</strong></td>
                            </tr>
                            <tr>
                                <td>Date Created</td>
                                <td><strong>` + data[x].DATECREATED + `</strong></td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td><strong>` + data[x].ADDRESS + `</strong></td>
                            </tr>
                            <tr>
                                <td># Orders</td>
                                <td><strong>` + data[x].NOOFORDERS + `</strong></td>
                            </tr>
                            <tr>
                                <td>Total Orders</td>
                                <td><strong>&#8369;` + data[x].TOTALORDERS + `</strong></td>
                            </tr>
                            <tr>
                                <td>Last Order</td>
                                <td><strong>` + data[x].LASTORDER + `</strong></td>
                            </tr>
                        </table>
                    <div/>`;

                var latlng = new google.maps.LatLng(data[x].LATITUDE, data[x].LONGITUDE);
                if(google.maps.geometry.poly.containsLocation(latlng, mpa_polygon)){ 
                    sosyocustomer++;
                    sosyomarker = new google.maps.Marker({
                        loc: data[x].LATITUDE+' '+data[x].LONGITUDE,
                        longitude: data[x].LONGITUDE,
                        latitude: data[x].LATITUDE,
                        storename: data[x].STORENAME,
                        infoWindow: infoWindow,
                        contentString:contentString,
                        position: new google.maps.LatLng(data[x].LATITUDE,data[x].LONGITUDE),
                        map: map,
                        icon: {
                        url: 'https://fastsosyo.com/comports/admin/v2/html/AIOSTORE_MARKER/sosyo2_marker.png',
                        scaledSize: new google.maps.Size(11, 17)
                        }
                    });
                    sosyomarkers.push(sosyomarker);    

                    sosyoStoresArrHolder.push({
                        STORETYPE: 'SOSYOSTORES',
                        SALESMAN: '---',
                        CUSTCODE: '---',
                        STORENAME: data[x].STORENAME,
                        DATECREATED_INFO: data[x].DATECREATED,
                        ADDRESS: data[x].ADDRESS,
                        NOORDERS: data[x].NOOFORDERS,
                        TOTALORDERS: data[x].TOTALORDERS,
                        LASTORDER: data[x].LASTORDER,
                        LONGITUDE: data[x].LONGITUDE,
                        LATITUDE: data[x].LATITUDE
                    });
                }
            
                google.maps.event.addListener(sosyomarker, 'click', (function(sosyomarker, x) {
                    return function(){
                        infoWindow.setContent(this.contentString);
                        infoWindow.open(map, sosyomarker);
                    }
                })(sosyomarker, x));
            }//end for  
        }
    });
    infoWindow = new google.maps.InfoWindow;
}

function refreshTerr(){
    getsosyostores(GBLPOLYGON);
    checkWithinMPA(GBLPOLYGON);
    $('#newFenceName').val('');
}

function checkWithinMPA (mpa_polygon){
    var isOutside; 
    var r = markers;
    var s = sosyomarkers;
    var cont = ``;
    var tAmount = 0.0;
    var tCustomer = 0;

    sosyoStoresArrHolder = [];

    getsosyostores(mpa_polygon);
    for(var x = 0; x < r.length; x++){
        var latlng = new google.maps.LatLng(r[x].latitude, r[x].longitude);
        if(google.maps.geometry.poly.containsLocation(latlng, mpa_polygon)){ 
            tCustomer++;
            tAmount += parseFloat(r[x].totalAmount_raw);

            cont += 
                `<tr>
                    <td style="width:224.69px;">`+r[x].mdName+`</td>
                    <td class="text-start" style="width:280.98px; padding-left: 60px;">`+r[x].Customer+`</td>
                    <td class="text-end" style="width:194.33px; padding-right: 50px;">`+r[x].totalAmount+`<i class="fa-solid fa-arrow-down" style="color: #FF0000;"></i></td>
                </tr>`;

            sosyoStoresArrHolder.push({
                STORETYPE: 'SYSPROSTORES',
                SALESMAN: r[x].mdName,
                CUSTCODE: r[x].custCode,
                STORENAME: r[x].Customer,
                DATECREATED_INFO: r[x].dateRange,
                ADDRESS: r[x].Address,
                NOORDERS: '',
                TOTALORDERS: r[x].totalAmount,
                LASTORDER: '',
                LONGITUDE: r[x].longitude,
                LATITUDE: r[x].latitude
            });
        }
    }
    // console.log(markers);
    $('#saveNewFenceModalBtn').show();
    $('#newFenceSysproStores').val(tCustomer);
    $('#newFenceSosyoStores').val(sosyocustomer);
    $('#newFenceDataRange').val(startPickDate + ' to ' +endPickDate);
    $('#newFenceTotalSales').val(tAmount.toLocaleString(2));
    var totalnum = tCustomer+sosyocustomer;
    $('#totalCustomer').html('Total ('+totalnum+') : '+`<span class="fw-bold" id="totalSales">`+`₱ `+ parseFloat(tAmount).toLocaleString(2) +`</span>`);
    // $('#totalSales').html('₱ ' + parseFloat(tAmount).toLocaleString(2));
    $('#salesmanTableDataDisplay').show().html(cont);
    if(responseArray.length == 0){
        getAllFences();
    }
    
}//checkWithinMPA