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
var markerClustererHolder;
var filteredArray;
var heatmapArr;
var heatmap1;
var markClustering;
var tableData1;
var tableData2;
var tableData3;
var sourceData;
var sourceData3;
var markers = [];
var sitelat, sitelng, sitezoom;
var inside_fence_markers = [];
var insidemarkers = [];
var infoWindow = new google.maps.InfoWindow;
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


function flip1() {
    if($('.arrow-side-icon').hasClass('fa-angle-left')){
        $("#dataTab_salesmanCategory_MainCont").show();
        $('.arrow-side-icon').removeClass('fa-angle-left').addClass('fa-angle-right');
    } else{
        $("#dataTab_salesmanCategory_MainCont").hide();
        $('.arrow-side-icon').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
}

function flip2() {
    $("#dataTab_salesmanCategory_MainCont").animate({width:'toggle'});
    if($('.arrow-side-icon').hasClass('fa-angle-left')){
        $('.arrow-side-icon').removeClass('fa-angle-left').addClass('fa-angle-right');
    } else {
        $('.arrow-side-icon').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
    // $('.arrow-side-icon-toggleZoom').toggleClass('fa-angle-right');
}

// var s = localStorage.getItem("srvr");
// var u = localStorage.getItem("usrnm");
// var p = localStorage.getItem("psswrd");
// var d = localStorage.getItem("dtbse");
// var con_info = [s, p, u, d];

determineUserType(usertype); 

// getAllSalesmanfuipanay();
/*NOTIFICATION SECTION*/
// showNotif();

// getcompname();
getcompname_dynamic("Site Admin - IT Champion v.1", "headingTitle");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,       
        async: false,     
        success: function(r){ 
            $('#headingTitle').html(r[0].company.toUpperCase() +' / Site Admin - IT Champion v.1');
            GBLSITEINDI_SOSYO = r[0].DIST_CD;
            GLOBALDISTDBNAME = r[0].DIST_INDI;
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"get_all_salesman_bohol", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php", 
        type: "POST",
        data: {"type":"get_all_color_bohol", "site":user, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(data){    
            fuipanay_salescolor = data.mdColor;
        }  //success here;
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
    var infoWindow = new google.maps.InfoWindow();
    $.ajax ({
        url: "https://fastdevs-api.com/FASTSOSYO/dist/API/applicationAPI.php",
        type: "GET",
        data: {
            'type':'GET_GEOFENCE_PER_DISTRIBUTOR',
            'distCode':GBLSITEINDI_SOSYO
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
                mpa_header[ctr][0] = this.pID;
                mpa_header[ctr][1] = this.pNAME;
                mpa_header[ctr][2] = this.pContact;
                mpa_header[ctr][3] = this.Notation;
                mpa_header[ctr][4] = this.PARTNERS;
                mpa_header[ctr][5] = this.BUYINGCUSTOMERS;
                mpa_header[ctr][6] = this.FSOSYO_DIST_CODE;
                mpa_header[ctr][7] = [];
                mpa_header[ctr][8] = this.COORDS;
                mpa_header[ctr][9] = this.DATEADDED;
                mpa_header[ctr][10] ='#97bcf7';
                mpa_header[ctr][11] = this.pPartnersCount;
                mpa_header[ctr][12] = this.cID;
                mpa_header[ctr][13] = this.PARTNERID;
                mpa_header[ctr][14] = this.PRICECODE;
            
                ctr++;
                });

                for(var i = 0; i < mpa_header.length; i++){
                    var coord_ary=[];

                    //alert("MPAID " + mpa_header[i][5]);
                    for(var j = 0; j < mpa_header[i][8].length; j++){
                    //alert("COORDS " + mpa_header[i][5][j].MPALATITUDE + " " +  mpa_header[i][5][j].MPALONGITUDE);
                    coord_ary.push({lat: Number(mpa_header[i][8][j].HAZLATITUDE), 
                                    lng: Number(mpa_header[i][8][j].HAZLONGITUDE)});
                    }
                    var boundary = coord_ary;

                    mpaPolygon = new google.maps.Polygon({
                        paths: boundary,
                        strokeColor: mpa_header[i][10],
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        fillColor: mpa_header[i][10],
                        fillOpacity: 0.7,
                        editable: false,
                        draggable: false,
                        pName: mpa_header[i][1],
                        pID: mpa_header[i][0],
                        acounts: mpa_header[i][5],
                        PARTNERS: mpa_header[i][4],
                        pContact: mpa_header[i][2],
                        Notation: mpa_header[i][3],
                        FSOSYO_DIST_CODE: mpa_header[i][6],
                        DATEADDED: mpa_header[i][9],
                        principalID:mpa_header[i][13],
                        partnerID:mpa_header[i][13],
                        priceCode:mpa_header[i][14]
                    });
                    mpa_polygon.push(mpaPolygon);
                }
                //loop for polygon vertices
                for(var i = 0; i < mpa_polygon.length; i++){ 
                    mpa_polygon[i].setMap(map);
                
                    google.maps.event.addListener(mpa_polygon[i], 'mouseout', function (e) {
                        infoWindow.close();
                    });

                    google.maps.event.addListener(mpa_polygon[i], 'click', function(e){
                        infoWindow.close();


                        $('#sys_distcode').val(this.FSOSYO_DIST_CODE);
                        $('#sys_areaname').val(this.pName);
                        $('#sys_contact').val(this.pContact);
                        $('#sys_notation').val(this.Notation);
                        $('#sys_partners').val(this.PARTNERS);
                        $('#sys_priceCode').val(this.priceCode);
                        $('#areaID').val(this.pID);

                        var cont = `
                                    <tr>
                                        <td colspan="3" class="text-center">no partners as of now.</td>
                                    </tr>`;
                        
                        $('#distCodeHolder').val(this.pID);
                        $('#partnersTab').html(cont);

                        get_dist_partners(this.pID);
                        
                        $('#updatePartnersModal').modal('show');

                    });
                } 
            }
        }
    });
}//displayFCGeofences


function dashBoard_direct_marker(start, end){
   var compDist = 0;
   var salesman = $('#fencesalesmanList').val();

   var dialog = bootbox.dialog({
                  message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> processing request please wait...</p>',
                  backdrop: true
                // closeButton: false
                });
    var message = 'Successfully Saved!';
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
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "html",
        crossDomain: true,
        cache: false,
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
                    //   transCount: data[x].transCount,
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
                        //   url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/'+data[x].mdColor.substr(1),
                            url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/a83232',
                            // scaledSize: new google.maps.Size(32, 36)
                            scaledSize: new google.maps.Size(15, 17)
                        }
                    });
                    markers.push(marker);
                    heatmapArr.push(new google.maps.LatLng(data[x].latitude, data[x].longitude));

                    google.maps.event.addListener(marker, 'click', (function(marker, x) {
                        return function(){
                            //  compDist = distance(data[x].latitude, data[x].longitude, data[x].transCount);
                    
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
        //   getsosyostores(polygon);
    });
}
 
siteLocation();

function init(){
    var lat, lang, zoomLevel = 0;
    lat = parseFloat(sitelat);
    lang = parseFloat(sitelng);
    zoomLevel = parseInt(sitezoom);
    myLatlng = new google.maps.LatLng(lat, lang);
    
    mapOptions = {
       zoom: 9,
       center: myLatlng,
       mapTypeId: 'roadmap',
       controlSize: 20,
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
    new mapControls(map);
    new setRestoreBtn(map);
    new setEraseBtn(map);
    new generateBaseMarker(map);
    new maintab(map);

    view_vehilcle_details();
    displayGeofences();

    setDataTable_VehicleDetails();

    import("https://cdn.skypack.dev/@googlemaps/markerclusterer@2.3.1")
    .then(({ MarkerClusterer }) => {
        if (MarkerClusterer) {
            markerClustererHolder = MarkerClusterer;
            console.log("Markers are now clustered. No Markers as of now.");
            filteredArray = markers;
            makeCluster();
            // showHeatMap();
        } else {
            console.error("MarkerClusterer could not be loaded.");
        }
    })
    .catch((error) => {
        console.error("Error loading MarkerClusterer:", error);
    });

    heatmap1 = new google.maps.visualization.HeatmapLayer({
    });

    map.addListener('click', function() {
        infoWindow.close(); 
    });

    $('#clusteringchk').prop('checked', true);
    $('#heatmapchk').prop('checked', false);
    // clearHeatMap();
    $('#showmarkerschk').prop('checked', false);
    $('#showfenceschk').prop('checked', true);
}//init

function makeCluster() {
    //clearMarkCluster(); // Clear existing cluster if any
    // console.log("markers: " + markers.length + " filtered: "+filteredArray.length);

    // Ensure markersToCluster is an array before creating the cluster  
    if (!Array.isArray(filteredArray)) {
        console.error("no filteredArray data");
        return;
    }
    clearMarkCluster();
    filteredArray = markers;
    markClustering = new markerClustererHolder({ markers: filteredArray, map });
}

function clearMarkCluster() {
    if (markClustering) {
        markClustering.clearMarkers();
        markClustering = null;
    }
}

function showHeatMap() {
    clearHeatMap();

    var heatmapDatas = filteredArray.map((item) => {
        return new google.maps.LatLng(item.getPosition())
    });

    heatmap1 = new google.maps.visualization.HeatmapLayer({
        data: heatmapDatas,
        map: map,
        radius: 20,
    });
    heatmap1.setMap(map);
}

function clearHeatMap() {
    if (heatmap1) {
        heatmap1.setMap(null);
        heatmap1 = null;
    }
}

function displayMarkers() {
    ClearMarkers();

    if (filteredArray.length > 0) {
        filteredArray.forEach(marker => {
            marker.setMap(map);
        });
    }
}

function ClearMarkers() {
    if (markers.length > 0) {
        markers.forEach(marker => {
            marker.setMap(null);
        });
    }

}

$('#clusteringchk').change(function() {
    if ($(this).is(':checked')) {
        makeCluster();

        $('#showmarkerschk').prop('checked', false);
        ClearMarkers();
        $('#heatmapchk').prop('checked', false);
        clearHeatMap();
    } else {
        clearMarkCluster();
    }
});


$('#heatmapchk').change(function() {
    if ($(this).is(':checked')) {
        showHeatMap();

        $('#clusteringchk').prop('checked', false);
        clearMarkCluster();
        $('#showmarkerschk').prop('checked', false);
        ClearMarkers();
    } else {
        clearHeatMap();
    }
});

$('#showmarkerschk').change(function() {
    if ($(this).is(':checked')) {
        displayMarkers();

        $('#clusteringchk').prop('checked', false);
        clearMarkCluster();
        $('#heatmapchk').prop('checked', false);
        clearHeatMap();
    } else {
        ClearMarkers();
    }
});


$('#showfenceschk').change(function() {
    if ($(this).is(':checked')) {
        mpaPolygon.setVisible(true);
    } else {
        mpaPolygon.setVisible(false);
    }
});

function setDataTable_VehicleDetails(){
    console.log(GBLDRIVERLISTHOLDER);
    tableData1 = new DataTable('#driverTable',{
        dom: '<"m-1"B<"datatableHeaderDiv"f>rt<"datatableFooterDiv" ip>>',
        pageLength: 10,
        order: true,    
        responsive: false,
        source: GBLDRIVERLISTHOLDER,
        bSort: true,
        // scrollY: '200px',
        "autoWidth": false,
        pagingType: 'simple_numbers',
        columns: [
            { data: "CustNameFull", title:"Customer"},
            { data: "Salesman", title:"Salesman"},
            { data: "mcpDay", title:"MCP"},
            { data: "sellingHrs", title:"Price Code"},
            { data: "warehouse", title:"Warehouse" },
            { data: "Status", title:"Status" },
            // { data: "mdCode", title:"mdCode" },
        ],
        columnDefs: [
        {
            targets: [3, 4, 5],
            className: 'text-center'
        },
        // {
        //   targets: 6,
        //   className: 'hidden'
        // }
        ],
        buttons: [
        {
            extend: 'collection',
            text: 'EXPORT',
            autoClose: true,
            buttons: [ 'excel', 'csv' ]
        },
        ]
        // rowCallback: function(row, data, index){
        //   $(row).find('td:eq(4)').text('₱' + data.sales);
        // }   
    });
    console.log("SET DATA TABLE");
}

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

    // var tsysprostores = $('#sysproStores').val();
    // var tsosyostores = $('#sosyoStores').val();
    // var daterange = $('#dateRangeselected').val();
    // var totalSelected = $('#totalSalesSelected').val();


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
                        // savefenceStores(response.cIDheader,
                        // r[x].STORETYPE,
                        // r[x].SALESMAN,
                        // r[x].CUSTCODE,
                        // r[x].STORENAME,
                        // r[x].DATECREATED_INFO,
                        // r[x].ADDRESS,
                        // r[x].NOORDERS,
                        // r[x].TOTALORDERS,
                        // r[x].LONGITUDE,
                        // r[x].LATITUDE,
                        // r[x].LASTORDER);

                        // console.log(r[x].cID);
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

function maintab(map){
    this.map = map;
    var dashbaord_table = document.getElementById('outerContainer_id');
    this.map.controls[google.maps.ControlPosition.LEFT].push(dashbaord_table);
}

function setRestoreBtn(map){
    this.map = map;
    var btn = document.getElementById('restorBtn');
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(btn);
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

function mapControls(map){
    this.map = map;
    var btn = document.getElementById('sideClyders');
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

// loadwarehouseTypes();
function loadwarehouseTypes(){   
    $("#fencesalesmanList").multiselect('destroy');
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_BTDT_WAREHOUSE_TYPES",
            // "salesmanType":salesmanType,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
            },
        dataType: "json",
        crossDomain: true,
        cache: false,          
        async: false,  
        success: function(data){ 
            var cont = '';
            for(var x = 0; x<data.length; x++){
                cont += '<option value="'+data[x].WarehouseCode+'">'+data[x].WAREHOUSEDESC+'</option>';
            }
            //  $("#fencesalesmanList").html('').html(cont);
            $("#fencesalesmanList").html(cont);
            //  $('#fencesalesmanList').multiselect('rebuild');

          
            // $("#fencesalesmanList").multiselect('refresh'); 
            // //  $('#fencesalesmanList').multiselect('refresh');

            $('#fencesalesmanList').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '300px',
                maxHeight: 300
            });
        }
    });
}

// loadSalesman('ALL');
function loadSalesman(salesmanType){   
    $("#fencesalesmanList").multiselect('destroy');
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
            var cont = '';
            for(var x = 0; x<data.length; x++){
                cont += '<option value="'+data[x].mdCode+'">'+data[x].Salesman+'</option>';
            }
            //  $("#fencesalesmanList").html('').html(cont);
            $("#fencesalesmanList").html(cont);
            //  $('#fencesalesmanList').multiselect('rebuild');

             
            // $("#fencesalesmanList").multiselect('refresh'); 
            // //  $('#fencesalesmanList').multiselect('refresh');

            $('#fencesalesmanList').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '300px',
                maxHeight: 300
            });

            $('#salesmanType').multiselect({
                numberDisplayed: 1,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                selectAllNumber: true,
                buttonWidth: '300px',
                maxHeight: 300
            });
        }
    });
}


$('#salesmanType').on('change', function() {
  var salesmanType = this.value;
  loadSalesman(salesmanType);
});

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
                // storeListForInsert.push(sosyoStoresArrHolder);
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


function view_vehilcle_details(){
    console.log(GBLSITEINDI_SOSYO);
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_NWSOSYO_ACTIVATIONS_ALL",
            'distCode':GBLSITEINDI_SOSYO,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,           
        async: false, 
        success: function(r){
            GBLDRIVERLISTHOLDER = r;
            var cont = ``;
            for(var x = 0; x <r.length; x++){
                var stattext = '<b style="color: #24ed85; font-weight: bold;">Activated</b>';
                if(r[x].Status == 'PENDING'){
                    stattext = '<b style="color: orange; font-weight: normal;">Pending</b>';
                }
                cont += '<tr onclick="viewmarkerdetails(\''+r[x].STOREID+'\')">'+`
                            <td>`+r[x].Customer+'_'+r[x].STORENAME+`</td>
                            <td>`+r[x].Salesman+`</td>
                            <td>`+r[x].mcpDay+`</td>
                            <td>`+r[x].priceCode+`</td>
                            <td>`+r[x].warehouse+`</td>
                            <td style="text-align: center;">`+stattext+`</td>
                        </tr>`;

                var contentString = `
                    <div style='text-align: center;'>
                        <img class='storemarkerImage' alt='storeImage' src="https://fastdevs-api.com/FASTSOSYO/download/image/storeimage/`+r[x].USERID+`.jpg"/>
                    </div>
                        <div style='margin: 0 auto;'>
                            <table class="table table-sm table-striped infoWindowTable" style="color: black !important;">
                                <tr>
                                    <td>Syspro Store name</td>
                                    <td><strong>` + r[x].Customer +'_'+r[x].CustName + `</strong></td>
                                </tr>
                                <tr>
                                    <td>Store Name</td>
                                    <td><strong>` + r[x].STORENAME.toUpperCase() + `</strong></td>
                                </tr>
                                <tr>
                                    <td>Salesman</td>
                                    <td><strong>` + r[x].Salesman.toUpperCase() + `</strong></td>
                                </tr>
                                <tr>
                                    <td>MCP Day</td>
                                    <td><strong>` + r[x].mcpDay + `</strong></td>
                                </tr>
                                <tr>
                                    <td>Price Code</td>`+
                                    '<td><strong>' + r[x].priceCode + '</strong> <span class="badgeReview" onclick="reviewsupp_pCode(\''+r[x].priceCode+'\')" style="margin-left: 20px; cursor: pointer; color: blue;">Review</span></td>'+`
                                </tr>
                                <tr>
                                    <td>Warehouse</td>`+
                                    '<td><strong>' + r[x].warehouse + '</strong> <span class="badgeReview" onclick="reviewsupp_whouse(\''+r[x].warehouse+'\')" style="margin-left: 9px; cursor: pointer; color: blue;">Review</span></td>'+`
                                </tr>
                                <tr>
                                    <td>Channel</td>
                                    <td><strong>` + r[x].Channel + `</strong></td>
                                </tr>
                                <tr>
                                    <td>Tier Description</td>
                                    <td><strong>` + r[x].TierDesc + `</strong></td>
                                </tr>
                                 <tr>
                                    <td>Version No.</td>
                                    <td>` + r[x].VERSIONNO + `</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>` + r[x].Status + `</td>
                                </tr>
                            </table>
                        <div/>`;

                var myLatLng = { lat: parseFloat(r[x].LATITUDE), lng: parseFloat(r[x].LONGITUDE) };
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    storeID: r[x].STOREID,
                    map,
                    infowindow: infoWindow,
                    content: contentString,
                    title: r[x].STORENAME,
                    icon: {
                        url:'https://fastsosyo.com/comports/admin/v2/html/AIOSTORE_MARKER/sosyo2_marker.png',
                        scaledSize: new google.maps.Size(11, 17)
                    }
                });
                // map.setCenter(marker.getPosition());

                google.maps.event.addListener(marker, 'click', (function(marker, x) {
                    return function(){
                    lat1 = r[x].latitude;
                    lon1 = r[x].longitude;
                        new google.maps.InfoWindow({ maxWidth: 500});
                        infoWindow.setContent(this.content);
                        infoWindow.open(map, marker);
                    }
                })(marker, x));

                markers.push(marker);
            }   
            $('#vehicleListData').html(cont);
        }//success
    });
}


function viewmarkerdetails(storeID){
//  var infoWindow = new google.maps.InfoWindow;
    console.log(storeID);
    var r = markers;
    for(var x =0; x < r.length; x++){
        if(r[x].storeID == storeID){
            new google.maps.InfoWindow({ maxWidth: 500});
            infoWindow.setContent(r[x].content);
            infoWindow.open(map, r[x]);
        }
    }
}

$('.step_1').show();
$('.step_2').hide();
function useplateNumber(mdCode, salesmanname, loadingcap){
    // alert(mdCode);

    $('#vehicleName').val(salesmanname);
    $('#loadingCap').val(loadingcap);

    $('#plateNumberHolder').val(mdCode);
    

    $('#vehicleinuse').html(mdCode +' ('+salesmanname + ')<br>Loading Capacity: '+parseFloat(loadingcap).toLocaleString());

    $('.step_1').hide();
    $('.step_2').show();
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
    var win = window.open('dynamic_route', '_blank');
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

function openNav() {
    document.getElementById("mySidenav").style.width = "270px";
    document.getElementById("main").style.marginLeft = "270px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}


function reviewsupp_pCode(priceCode){
    $('#pricecodetable').show();
    $('#warehousetable').hide();
    $('.datatableHeaderPCode').show();
    $('.datatableHeaderWHouse').hide();
    $('.datatableFooterPCode').show();
    $('.datatableFooterWHouse').hide();
    $('.exportBtnPCode').show();
    $('.exportBtnWHouse').hide();

    $('#inputsearch_rvw_price').show();
    $('#inputsearch_rvw_warehouse').hide();
    $.ajax ({
      url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
      type: "POST",
      data: {
          "type":"GET_DIST_PRICE_DETAILS",
          'distCode':GBLSITEINDI_SOSYO,
          'priceCode':priceCode,
          "userID": GBL_USERID,
          "distCode": GBL_DISTCODE
          },
      dataType: "json",
      crossDomain: true,
      cache: false,           
      async: false, 
      success: function(r){
        var cont = ``;
        for(var x =0; x < r.length; x++){
            cont+= `<tr>
                        <td>`+r[x].STOCKCODE+`</td> 
                        <td>`+r[x].DESCRIPTION+`</td>
                        <td>`+r[x].PRICECODE+`</td>
                        <td>`+r[x].UNITPRICE+`</td>
                   </tr>`;
        }
        // $('#pricecodetable_Details').html(cont);
        $('.dynamictitle').html('Price Code '+priceCode+ ' Details');
        $('#supportdetailsmodal').modal('show');
        tableData2.clear().rows.add(r).draw().draw('page');
      }
    });
}
setDataTable_reviewsupp_pCode();
setDataTable_reviewsupp_whouse();

function setDataTable_reviewsupp_pCode(){
    if (!$.fn.DataTable.isDataTable('#pricecodetable')) {
        tableData2 = new DataTable('#pricecodetable',{
            dom: '<"m-1 exportBtnPCode" B<"datatableHeaderDiv datatableHeaderPCode"f>rt<"datatableFooterDiv datatableFooterPCode" ip>>',
            pageLength: 10,
            order: true,    
            responsive: false,
            bSort: true,
            source: sourceData,
            "autoWidth": false,
            pagingType: 'simple_numbers',
            columns: [
                { data: "STOCKCODE", title: "STOCKCODE"},
                { data: "DESCRIPTION", title: "DESCRIPTION"},
                { data: "PRICECODE", title: "PRICECODE"},
                { data: "UNITPRICE", title: "UNITPRICE"},
            ],
            columnDefs: [
                {
                targets: [0,2],
                className: 'text-center'
                }
            ],
            buttons: [
                {
                extend: 'collection',
                text: 'EXPORT',
                autoClose: true,
                buttons: [ 'excel', 'csv' ]
                },
            ],
            rowCallback: function(row, data, index){
                $(row).find('td:eq(3)').text('₱' + data.UNITPRICE);
            }   
        });
    }
    console.log("SET DATA PRICE CODE TABLE");
}

function reviewsupp_whouse(warehouse){
    $('#pricecodetable').hide();
    $('#warehousetable').show();
    $('.datatableHeaderPCode').hide();
    $('.datatableHeaderWHouse').show();
    $('.datatableFooterPCode').hide();
    $('.datatableFooterWHouse').show();
    $('.exportBtnPCode').hide();
    $('.exportBtnWHouse').show();
    

    $('#inputsearch_rvw_price').hide();
    $('#inputsearch_rvw_warehouse').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_DIST_INV_DETAILS",
            'distCode':GBLSITEINDI_SOSYO,
            'warehouse':warehouse,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,           
        async: false, 
        success: function(r){
            var cont = ``;
            for(var x =0; x < r.length; x++){
                cont+= `<tr>
                            <td>`+r[x].STOCKCODE+`</td> 
                            <td>`+r[x].DESCRIPTION+`</td>
                            <td>`+warehouse+`</td>
                            <td>`+r[x].QUANTITY+`</td>
                            <td>`+r[x].StockUom+`</td>
                            <td>`+r[x].AlternateUom+`</td>
                            <td>`+r[x].OtherUom+`</td>
                            <td>`+r[x].ConvFactAltUom+`</td>
                            <td>`+r[x].ConvFactOthUom+`</td>
                    </tr>`;
            }
            // $('#warehousetable_Details').html(cont);
            $('.dynamictitle').html('Warehouse Code '+warehouse+ ' Details');
            $('#supportdetailsmodal').modal('show');
            tableData3.clear().rows.add(r).draw();
        }
    });
}

function setDataTable_reviewsupp_whouse(){
    if (!$.fn.DataTable.isDataTable('#warehousetable')) {
        tableData3 = new DataTable('#warehousetable',{
            dom: '<"m-1 exportBtnWHouse" B<"datatableHeaderDiv datatableHeaderWHouse"f>rt<"datatableFooterDiv datatableFooterWHouse" ip>>',
            pageLength: 10,
            order: true,    
            responsive: false,
            bSort: true,
            source: sourceData3,
            "autoWidth": false,
            pagingType: 'simple_numbers',
            columns: [
                { data: "STOCKCODE", title: "STOCKCODE"},
                { data: "DESCRIPTION", title: "DESCRIPTION"},
                { data: "warehouse", title: "WAREHOUSE"},
                { data: "QUANTITY", title: "QTY"},
                { data: "StockUom", title: "STOCKU OM"},
                { data: "AlternateUom", title: "ALTERNATIVE UOM"},
                { data: "OtherUom", title: "OTHER UOM"},
                { data: "ConvFactAltUom", title: "CONV FACT ALT UOM"},
            ],
            columnDefs: [
                {
                    targets: [0,2],
                    className: 'text-center'
                }
            ],
            buttons: [
                {
                    extend: 'collection',
                    text: 'EXPORT',
                    autoClose: true,
                    buttons: [ 'excel', 'csv' ]
                },
            ],
            rowCallback: function(row, data, index){
                $(row).find('td:eq(3)').text('₱' + data.UNITPRICE);
            }   
        });
    }
    console.log("SET DATA PRICE CODE TABLE");
}

$("#customerfilterinpt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#vehicleListData tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#inputsearch_rvw_price").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#pricecodetable_Details tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#inputsearch_rvw_warehouse").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#warehousetable_Details tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});