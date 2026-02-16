var userID = localStorage.getItem('user_id');
var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("username");
var usertype = localStorage.getItem("usertype");
var site_lat = localStorage.getItem("latitude");
var site_long = localStorage.getItem("longitude"); 
var site_mapzoom = localStorage.getItem("mapzoom");  
var dataTables;
var GBLSITEINDI_SOSYO;
var GLOBALDISTDBNAME;
var territoryColor = document.getElementById("terrcolor");
var GlobalColor = "";
var ishide = false;
var markers = [];
var marker, infoWindow, marker;
var sitelat, sitelng, sitezoom;
var inside_fence_markers = [];
var insidemarkers = [];
var GBLPOLYGON;
var mapOptions, map, marker, mpaPolygon, contentString = "", mpa_coords = [[]];
var mpa_header=[[]];
var mpa_polygon=[];
var startPickDate, endPickDate;
var sosyomarkers = [];
var sosyomarker = [];
var sosyoStoresArrHolder = [];
var sysproStoresArrHolder = [];
var sosyocustomer = 0;
var driverSourceDat = [];

// determineUserType(usertype); 
// getcompname();
getcompname_dynamic("Dynamic Route - Map Version v.1.0.5", "titleHeading");
VirtualSelect.init({
    ele: '#fencesalesmanList',
});

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Dynamic Route - Map Version v.1.0.5');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('#titleHeading').html('<i class="fa fa-circle blinking"></i> <b style="color:red;">ERROR:</b> Unable to establish a connection from your server. Please check your server settings.');
        }
    });
} 
$(".arrow-side-icon").hide();

function flip1() {
    if(ishide){
        // $(".container_salesman.step_2").hide();
        $(".container_salesman.step_2").animate( { marginLeft: "-100%" }, 400, function () { $(this).hide().css({ marginLeft: "0" }); } );

        setTimeout(() => {
            $(".container_salesman.step_1").css({ display: "block", marginLeft: "-100%" }).animate( { marginLeft: "0" }, 400 );
        }, 500);
        // $(".arrow-side-icon").css({"margin-top":"325px"});
        $(".arrow-side-icon").hide();
        setTimeout(() => {
          var height = $(".container_salesman.step_1").outerHeight();
          $(".arrow-side-icon").css({"margin-top":(height/2)+"px"});
          $(".arrow-side-icon").show();
        }, 900);
        
        ishide = false;  
    } else{
        // $(".container_salesman.step_1").hide();
        $(".container_salesman.step_1").animate( { marginLeft: "-100%" }, 400, function () { $(this).hide().css({ marginLeft: "0" }); } );

        setTimeout(() => {
            $(".container_salesman.step_2").css({ display: "block", marginLeft: "-100%" }).animate( { marginLeft: "0" }, 400 );
        }, 500);
        // $(".arrow-side-icon").css({"margin-top":"155px"});
        
        $(".arrow-side-icon").hide();
        setTimeout(() => {
            var height = $(".container_salesman.step_2").outerHeight();
            $(".arrow-side-icon").css({"margin-top":(height/2)+"px"});
            $(".arrow-side-icon").show();
        }, 900);
        
        ishide = true;
    }
    // $(".container_salesman").animate({width:'toggle'},500);
    $('.arrow-side-icon').toggleClass('fa-angle-right');
}

// getAllSalesmanfuipanay();

// $('[data-toggle="tooltip"]').tooltip(); 

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
          // console.log('Notification function has been refresh');                
            $("#notifs-icon-div").html(response.notification);
            if(response.unseen_notification > 0)
            {
            $('.count').html(response.unseen_notification);
            }
        }
    });
}
 
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
});

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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"get_all_salesman_bohol", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){  
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"get_all_color_bohol", "site":user, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(data){    
            fuipanay_salescolor = data.mdColor;
        }//success here;
    });
    //return color;
}
 
function clickSalesmanList() {
    var x = document.getElementById("salesmanList").selectedIndex;
    var result = document.getElementsByTagName("option")[x].value;
    alert(result);
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

                    for(var j = 0; j < mpa_header[i][8].length; j++){
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
        }
    });
}//displayFCGeofences

function dashBoard_direct_marker(start, end, min, max){
    Swal.fire({
        html: "processing request please wait...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    var botboxMsg = '';
    var ajaxTime= new Date().getTime();
              
    var warehouselist = $('#fencesalesmanList').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {
            "type":"GET_ADNVANCE_ORDER", 
            "start":startPickDate,
            "end":endPickDate,
            "warehouselist":warehouselist,
            "minamount":min,
            "maxamount":max,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "html",
        crossDomain: true,
        cache: false,
        success: function(response){ 
            var imglink = GLOBALLINKAPI+"/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
            Swal.close();
            if(response == 0){
                console.log('empty dashboard!');
                Swal.fire({
                    text: "Dashboard is empty as of the moment.",
                    icon: "info"
                });
            }else{
                var data = JSON.parse(response); 
                for(var x=0; x<data.length; x++){

                    marker = new google.maps.Marker({
                        id: data[x].mdCode,
                        // transCount: data[x].transCount,
                        loc: data[x].latitude+' '+data[x].longitude,
                        longitude: data[x].longitude,
                        latitude: data[x].latitude,
                        mdName: data[x].Salesman,
                        cID: data[x].cID,
                        mdCode: data[x].mdCode,
                        infowindow: infoWindow,
                        Address: data[x].Address,
                        Customer: data[x].CUSTOMER,
                        custCode: data[x].custCode,
                        dateRange: data[x].dateRange,
                        totalAmount: data[x].totalAmountFormatted,
                        totalAmount_raw: data[x].totalAmount,
                        position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                        map: map,
                        icon: {
                            // url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/'+data[x].mdColor.substr(1),
                            url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/a83232',
                            // scaledSize: new google.maps.Size(32, 36)
                            scaledSize: new google.maps.Size(15, 17)
                        }
                    });
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, x) {
                        return function(){
                            lat1 = data[x].latitude; 
                            lon1 = data[x].longitude;
                            var contentString = "<div style='margin: 0 auto;'><div class='modal-header' style='text-align: center;'>"+
                                                    "<div class=''><img class='salesmanPic' alt='salesmanPic' src='"+imglink+data[x].custCode+".jpg' onError='imgError(this)'/><br/>"+
                                                        "<span class='fa fa-chevron-left pull-left' style='float: left; font-size: 30px;' id='prevMD'></span><span id='nextMD' class='fa fa fa-chevron-right pull-right' style='float: left; font-size: 30px;'></span></div></div>"+
                                                        "<div class='table-responsive'>" +
                                                            "<table class='table table-condensed' style='color: black !important;'>" +
                                                                "<tr><td>Salesman:</td><td id='getThisSalesman'>"+data[x].SALESMAN+"</td></tr>"+
                                                                "<tr><td>Customer:</td><td>"+data[x].CUSTOMER+"</td></tr>"+
                                                                "<tr><td>Location:</td><td id='getThisLongLat'>"+data[x].latitude +' '+data[x].longitude+"</td></tr>"+
                                                                "<tr><td>Sales:</td><td>&#8369; "+data[x].totalAmountFormatted+"</td></tr>"+
                                                            "</table>"+
                                                        "</div>"+
                                                    "</div>";


                            let parts = (data[x].CUSTOMER).trim().split(/\s+/); 

                            var customerID = parts[0];
                            var custName = parts.slice(2).join(' ');
                            var address = '';
                            var contentVal = `
                                    <div class='IWMainContainer'>
                                        <div class='IWMarkerStatus'>
                                            <i class="fa-solid fa-circle-check" style='color: var(--cust-success);'></i>
                                            <span class='IWBanner'>Customer Info</span>
                                        </div>
                                        <div class='IWImageContainer'>
                                            <div class="carousel-track">
                                                <img id='storeImg1' class='storeImg' alt='' src='${imglink+data[x].custCode+".jpg"}' onError='storeimgError(this)'/>
                                            </div>
                                        </div>
                                        <div class='IWContentHeader'>
                                            <div class='row'>
                                                <div class='col-10 custDetails'>
                                                    <span class='valueText' id='IW_CustCode'>${customerID}</span>
                                                    <span class='valueText' id='IW_CustName'>${custName}</span>
                                                    <span class='valueText' id='IW_Address'>${address}</span>
                                                </div>
                                               
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='d-flex'>
                                        <div class='IWContentDetail'>
                                            <div class='mb-2 textdiv'>
                                                <span class='titleText'>Salesman Assigned:</span>
                                                <span class='valueText'>${ data[x].SALESMAN }</span>
                                            </div>
                                            <div class='mb-2 textdiv'>
                                                <span class='titleText'>Location: </span>
                                                <span class='valueText'>${data[x].latitude +' '+data[x].longitude}</span>
                                            </div>      
                                            <div class='mb-2 textdiv'>
                                                <span class='titleText'>Sales:</span>
                                                <span class='valueText'>
                                                    &#8369 ${data[x].totalAmountFormatted}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            infoWindow.setContent(contentVal);
                            infoWindow.open(map, marker);
                        }
                    })(marker, x));
                }//end for  
            }
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                title: "Oops! Something went wrong!",
                html: XMLHttpRequest.responseText,
                icon: "error"
            });
        }
    });
       
    infoWindow = new google.maps.InfoWindow;
}//end direct dashboard colpal
   
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

function dragendpolygon(polygon){
    google.maps.event.addListener(polygon,'click',function() {
        checkWithinMPA(polygon);
     
        $('#createTerrModal').modal('show');
        // getsosyostores(polygon);
    });
}
 
siteLocation();
init();
function init(){
    var lat, lang, zoomLevel = 0;
    lat = parseFloat(sitelat);
    lang = parseFloat(sitelng);
    zoomLevel = parseInt(sitezoom);
    myLatlng = new google.maps.LatLng(lat, lang);
    
    mapOptions = {
        zoom: 10,
        center: myLatlng,
        mapTypeId: 'roadmap',
        controlSize: 20,
        fullscreenControl: false,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#f5f5f5"
                }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#616161"
                }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#f5f5f5"
                }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#bdbdbd"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#eeeeee"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#757575"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#e5e5e5"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#9e9e9e"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#ffffff"
                }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#757575"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#dadada"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#616161"
                }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#9e9e9e"
                }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#e5e5e5"
                }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#eeeeee"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#c9c9c9"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#9e9e9e"
                }
                ]
            }
        ]
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    new fullScreenMap(map);
    new handTool(map);
    new penTool(map);
    new setEraseBtn(map);
    new generateBaseMarker(map);
    new maintab(map);
    new setRestoreBtn(map);


    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: false,
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
            // editable: true
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

    google.maps.event.addListener(drawingManager,'polygoncomplete',function(polygon) {
        polygon.setEditable(true);
        GBLPOLYGON = polygon;

        dragendpolygon(polygon);
        $('#eraseBtn').click(function() {
            erase(polygon);
        });

        checkWithinMPA(polygon);
        $('#fenceName').val('');
       
        google.maps.event.addListener(polygon.getPath(), 'set_at', function(index) {
            refreshTerr();
        });

        // Detect when a new vertex is added
        google.maps.event.addListener(polygon.getPath(), 'insert_at', function(index) {
            refreshTerr();
        });
    });

    

    drawingManager.setDrawingMode(null);

    map.addListener('click', function() {
        deleteInsideMarkers();
    });
    
    document.addEventListener('fullscreenchange', function () {
        if (document.fullscreenElement) {
            // You are now IN fullscreen
            $('#fullScreenMap').html('<i class="fa-solid fa-compress"></i>');
        } else {
            // You are now OUT of fullscreen
            $('#fullScreenMap').html('<i class="fa-solid fa-expand"></i>');
        }

        google.maps.event.addListener(polygon.getPath(), 'set_at', function() {
            // Editing Polygon
            refreshTerr();
            console.log('polygon')
        });

        google.maps.event.addListener(polygon.getPath(), 'insert_at', function() {
            // Adding new Vertex in Polygon
            refreshTerr();
            console.log('polygon')
        });
        
    });

    setTimeout(() => {
        $(".arrow-side-icon").css({"margin-top":$(".container_salesman.step_1").outerHeight()/2});
        $(".arrow-side-icon").show();
    }, 5000);
}//init


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

    $("#coords-info").html(contentString);

    contentString="";
}

function createterremodal(){
    var checker = $('#sysproStores').val();
    if($.trim(checker) == ''){
        alert('Please select a salesman and draw a territory fence first.');
    }else{
        $('#fenceName').val('');
        $('#createTerrModal').modal('show');
    }
    console.log(checker);
}

function refreshTerr(){
    // getsosyostores(GBLPOLYGON);
    checkWithinMPA(GBLPOLYGON);
    $('#fenceName').val('');
}

function saveMPA(){
    getpolygonpath();

    var userID = localStorage.getItem('user_id');
    var fullname = localStorage.getItem('fullname');
    var fenceName= $('#fenceName').val();

    var loadingcap = $('#loadingCap').val();
    var totalAmountHolder = $('#totalAmountHolder').val();
    var plateNo = $('#plateNumberHolder').val();
    var totaltransaction = $('#sysproStores').val();
    var unloadingDate = $('#unloadingDate').val();

    if(plateNo == ''){
        alert('Please select a vehicle.');
    }else if(unloadingDate == undefined || unloadingDate == ''){
        alert('Please select unloading date.');
    }else{
        var f = confirm('Are you sure you want to create this route?');
        if(f){
            $('#createTerritoryBtn').html('<i class="fa fa-spin fa-spinner"></i> please wait...');
            $('#createTerritoryBtn').prop('disabled', true);
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
                type: "POST",
                data: {
                    "type":"INSERT_DYNAMIC_ROUTE_HEADER", 
                    loadingcap:loadingcap,
                    totalAmountHolder:totalAmountHolder,
                    plateNo:plateNo,
                    totaltransaction:totaltransaction,
                    unloadingDate:unloadingDate,
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE,
                },
                dataType: "json",
                crossDomain: true,
                cache: false, 
                async: true,          
                success: function(response){           
                    mpa_coords = [[]];      
                    var r = sosyoStoresArrHolder;
                    var routingrefno = response;

                    // console.log(r);
                    for(var x = 0; x < r.length; x++){
                        exec_tagged_dynamicroute_transactions(r[x].cID, routingrefno, plateNo, unloadingDate);
                    }

                      // alert("Route plan was successfully created.");

                      setTimeout(function() { 
                          alert("Route plan was successfully created.");
                          location.reload();
                      }, 2000);
                   
                  },
                error: function (err, statusText, errorThrown){
                    alert(errorThrown);
                }
            });
        }//inside if close
    }//main else close
}//saveMPA

function exec_tagged_dynamicroute_transactions(cID, routingrefno, plateNo, unloadingDate){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"EXEC_UPDATE_DYNAROUTE_TRANS", 
            cID:cID,
            routingrefno:routingrefno,
            plateNo:plateNo,
            unloadingDate:unloadingDate,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },
        dataType: "json",
        crossDomain: true,
        cache: false,           
        async: false
    });
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
                                                "<span class='fa fa-chevron-left pull-left' style='float: left; font-size: 30px;' id='prevMD'></span><span id='nextMD' class='fa fa fa-chevron-right pull-right' style='float: left; font-size: 30px;'></span></div></div>"+
                                                "<div class='table-responsive'>" +
                                                    "<table class='table table-condensed' style='color: black !important;'>" +
                                                        "<tr><td>Salesman:</td><td id='getThisSalesman'>"+data[x].SALESMAN+"</td></tr>"+
                                                        "<tr><td>Customer:</td><td>"+data[x].CUSTCODE +' '+ data[x].STORENAME+"</td></tr>"+
                                                        "<tr><td>Location:</td><td id='getThisLongLat'>"+data[x].LONGITUDE +' '+data[x].LATITUDE+"</td></tr>"+
                                                        "<tr><td>Sales:</td><td>&#8369; "+data[x].TOTALORDERS+"</td></tr>"+
                                                        "<tr><td>Range:</td><td>"+data[x].DATECREATED_INFO+"</td></tr>"+
                                                    "</table>"+
                                                "</div>"+
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

function savefenceStores(refno, storeType, salesman, custcode, storename, datecreated_info, address, noOfOrders, totalOrders, latitude, longitude, lastOrder){
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

$('#dashboardDisplay').hide();
function checkWithinMPA (mpa_polygon){
    var isOutside; 
    var r = markers;
    var s = sosyomarkers;
    var cont = ``;
    var tAmount = 0.0;
    var tCustomer = 0;

    sosyoStoresArrHolder = [];

    // getsosyostores(mpa_polygon);
    for(var x = 0; x < r.length; x++){
        var latlng = new google.maps.LatLng(r[x].latitude, r[x].longitude);
        if(google.maps.geometry.poly.containsLocation(latlng, mpa_polygon)){ 
            tCustomer++;
            tAmount += parseFloat(r[x].totalAmount_raw);

            cont += `<tr>
                        <td>`+r[x].mdCode+`</td>
                        <td>`+r[x].Customer+`</td>
                        <td style="text-align: right;">`+r[x].totalAmount+`</td>
                    </tr>`;

            sosyoStoresArrHolder.push({
                STORETYPE: 'SYSPROSTORES',
                cID: r[x].cID,
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

    $('#sysproStores').val(tCustomer);
    $('#sosyoStores').val(sosyocustomer);
    $('#dateRangeselected').val(startPickDate + ' to ' +endPickDate);
    $('#totalSalesSelected').val(tAmount.toLocaleString(2));

    $('#totalAmountHolder').val(tAmount);

    $('#totalCustomer').html('('+tCustomer+')');
    $('#totalSales').html('Total: ' + parseFloat(tAmount).toLocaleString(2));
    $('#dashboardDisplay').show().html(cont);
}//checkWithinMPA

function maintab(map){
    this.map = map;
    var dashbaord_table = document.getElementById('outerContainer_id');
    this.map.controls[google.maps.ControlPosition.LEFT].push(dashbaord_table);
}

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

function generateBaseMarker(map){
    this.map = map;
    var btn = document.getElementById('generateBaseMarker');
    this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
}

function fullScreenMap(map){
    this.map = map;
    var btn = document.getElementById('fullScreenMap');
    this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
}

$('#fullScreenMap').click(function (){
    $('#map div.gm-style button[title="Toggle fullscreen view"]').trigger('click');
});

function handTool(map){
    this.map = map;
    var btn = document.getElementById('handTool');
    this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
}

$('#handTool').click(function (){
    drawingManager.setMap(null);
    drawingManager.setDrawingMode(null);
  });

function penTool(map){
    this.map = map;
    var btn = document.getElementById('penTool');
    this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
}

$('#penTool').click(function (){
    drawingManager.setMap(map);
    drawingManager.setOptions({
        drawingControl: false
    });
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
});

function restoreLoc(){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
    map.setCenter(myLatlng);
    map.setZoom(10);
    pasthisLat = 0;
    pasthisLong = 0;
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
    
function proceedFilter(){
    $('#filterDetailsModal').modal('hide');
    deleteSoysoMarkers();
    DeleteMarkers();
    deleteInsideMarkers();
    dashBoard_direct_marker(startPickDate, endPickDate);
}

loadwarehouseTypes();
function loadwarehouseTypes(){   
    document.querySelector('#fencesalesmanList').destroy();

    // For Testing Purposes Only
    var myOptions = [];

    var testOBJ1 = { label: "Main Warehouse - Tagbilaran", value: "Main Warehouse - Tagbilaran" };
    var testOBJ2 = { label: "Secondary Warehouse - Ubay", value: "Secondary Warehouse - Ubay" };
    myOptions.push(testOBJ1,testOBJ2);

    VirtualSelect.init({
        ele: '#fencesalesmanList',
        options: myOptions,
        search: true,
        maxWidth: '100%', 
        placeholder: 'Select Warehouse'
    });

    gtmArrSelectList = myOptions;

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_BTDT_WAREHOUSE_TYPES",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].WAREHOUSEDESC, value: data[x].WarehouseCode };
                myOptions.push(obj);
            }

            VirtualSelect.init({
                ele: '#fencesalesmanList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Warehouse'
            });

            gtmArrSelectList = myOptions;
        }
    });
}


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
                        cID: data[x].cID,
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

view_vehilcle_details();
function view_vehilcle_details(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_BTDT_VEHICLE_LIST",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,           
        async: false, 
        success: function(r){
            GBLDRIVERLISTHOLDER = r;
            // driverSourceDat = r;
            var cont = ``;
            for(var x = 0; x <r.length; x++){
                cont += `<tr>
                            <td><i class="fa fa-truck text-danger"></i> `+r[x].Salesman+`<br>`+r[x].vehicleDetails+`</td>
                            <td style="text-align: center;">`+r[x].loadingCap+`</td>`
                            +'<td style="text-align: right;"><button class="btn btn-info useBtn" onclick="useplateNumber(\''+r[x].mdCode+'\', \''+r[x].Salesman+'\', \''+r[x].loadingCap+'\')">Use</button></td>'+`
                        </tr>`;
            }   
            driverSourceDat

            $('#vehicleListData').html(cont);
        }//success
    });
            
}


$('.step_1').show();
$('.step_2').hide();
function useplateNumber(mdCode, salesmanname, loadingcap){
    $('#vehicleName').val(salesmanname);
    $('#loadingCap').val(loadingcap);
    $('#plateNumberHolder').val(mdCode);
    $('#vehicleinuse').html(mdCode +' ('+salesmanname + ')<br>Loading Capacity: '+parseFloat(loadingcap).toLocaleString());

    $('.step_1').hide();
    $('.step_2').show();
    
    var height = $(".container_salesman.step_2").outerHeight();
    $(".arrow-side-icon").css({"margin-top":(height/2)+"px"});
    $(".arrow-side-icon").show();
    ishide = true;
}

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

function exportFence(){
    // var win = window.open('../dynamic_route', '_blank');
    var win = window.open('dynamicRouteList', '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
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

$("#generateBaseMarker").click(function() {   
    // dashBoard_direct_marker();
    DeleteMarkers();
    $('#filterDetailsModal').modal('show');
});

function imgError2(image) {
    image.onerror = "";
    image.src = "../img/salesmanPic.jpg";
    return true;
}  

function storeimgError(image) {
    image.onError = "";
    image.src = "img/storePic.jpg";

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

initDataTable();
  function initDataTable(){
    dataTables = $('#driverTable').DataTable({
        dom: 'frt<"d-flex justify-content-between align-items-center"i<"dataTablePagination" p>>',
        paging: true,
        searching: true,
        pageLength: 5, 
        // pagingType: "simple_numbers",
    });
  }

function filtermtfunc(){
    $('#filterAmountModal').modal('show');
}
//   $( function() {
$( "#slider-range" ).slider({
    range: true,
    min: 100,
    max: 10000,
    values: [ 200, 2000 ],
    slide: function( event, ui ) {
        console.log(ui.values[ 0 ]);
        // var amountfiltered_min = parseFloat().toLocaleString();
        var amountfiltered_max = parseFloat(ui.values[ 1 ]).toLocaleString();
        $( "#amount" ).val( + ui.values[ 0 ] + " - " + amountfiltered_max);
        
        $('#minval').val( ui.values[ 0 ]);
        $('#maxval').val(  ui.values[ 1 ]);
    }
});
    
$( "#amount" ).val( "" + $( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ) );

function checkvalueminmax(){
    var min =  $( "#slider-range" ).slider( "values", 0 );
    var max = $( "#slider-range" ).slider( "values", 1 );

    console.log('min - ' +min+ ' max - ' + max);

    $('#filterAmountModal').modal('hide');
    deleteSoysoMarkers();
    DeleteMarkers();
    deleteInsideMarkers();
    dashBoard_direct_marker(startPickDate, endPickDate, min, max);
}