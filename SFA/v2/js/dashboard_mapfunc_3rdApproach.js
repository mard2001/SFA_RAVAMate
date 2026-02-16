var GBLCOMPNAMEHOLDER = '';
var GLOBALIMGHOLDER;
var GLOBALDISTDBNAME = '';
var map;
var sitelat, sitelng, sitezoom;
var displayAllData;
var realTimeChecker = 1;
var dateToTextSelected;
var markers = [];
var selecterChecker = 2;
var marker, infoWindow, infoWindow2 = new google.maps.InfoWindow({ maxWidth: 500});;
var productMarker = [];
var greatest = 0;
var incruchment = [];
var lat1 = 0, lon1 = 0;
var delimeter = 0;
var mpa_polygon=[];
var bybrandchecker = 0;
var displaySalesmanDataByCategory;
var remainingHolder;
var prevremainingHolder;
var lateSalesmanListHolder = [];
var specificMarker = [];
var isFullScreen = false;
var myLatlng;
var zoomPerSite;
var onViewLeftTransacDetails = false;
var dataTables;
var dataTablesProd;
var selectedCatogery;
var markerProd;
var selecterChecker = 2;
var brandMarker;
var specificComputedDistStr;
var mdCodeHolder;
var sourceData_salesman = [];
var currentInfoWindow;
var isMarkerOpened = false;
var todaysDate;
var isfirstLoadMarkers = true;
var isViewSpecMarkersLine = false;
var allowableHeight = 0;
var tableExpanded = false;
var dataTablesRemaining1;
var dataTablesRemaining2;
// var directionsService;
// var directionsRenderer;
var polylineArrHolder = [];
var NumOfDataTableRows = 5;
var overview_mtd_percentage = 0;
var overview_daily_percentage = 0;
var date_today;
var date_selected;
var markersbckup = [];

var isShowLine = false;
var isShowUnpro = false;
var isShowUnvi = false;

var images = [];
var currentIndex = 0;


getHeight2();

var dispCurrentTime = new IntervalTimer2(function () {
    DisplayCurrentTime();
    visibleContent(isFullScreen);
}, 500);  

getTodaysDate();
setupChecker();
siteLocation();
// getcompname();
getcompname_dynamic("Dashboard", "headingTitle");


setDatatables();


function createRightControl(map) {
    const controlButton = document.getElementById('defaultmapBtns');
  
    $('#mdi-earth-maps-btn').click(function (){
      if (map.getMapTypeId() != google.maps.MapTypeId.HYBRID) {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID)
        }else if(map.getMapTypeId() != google.maps.MapTypeId.ROADMAP){
          map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
        }
    }); 

    $('#mdi-target-btn').click(function (){
        restoreLoc();
    });

    $('#mdi-magnify-plus-outline-btn').click(function (){
        map.setZoom(map.getZoom() + 1);
    });
    
    $('#mdi-magnify-minus-outline-btn').click(function (){
        map.setZoom(map.getZoom() - 1);
    });

    return controlButton;
}

function imgError(image) {
    image.onError = "";
    image.src = "img/salesmanPic.jpg";
    // image.src = "../img/salesmanPic.jpg";
    return true;
}  

function DeleteMarkers() {
    //Loop through all the markers and remove
    console.log('markers deleted');

    for (var i = 0; i < markers.length; i++) {
        try {
            markers[i].setMap(null);
        } catch (error) {
            console.error("Error deleting marker:", error);
        }
    }
    markers = [];
    // restoreLoc()
}

function centerMap(map){
    map.setCenter({ lat: 11.0891, lng: 124.8923 });
    map.setZoom(10);
}

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        async: false,
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#headingTitle').html(r[0].company.toUpperCase() +' | Dashboard');
            updateUserSiteName(r[0].company.toUpperCase());
            GBLCOMPNAMEHOLDER = r[0].company.toUpperCase();
            GLOBALDISTDBNAME = r[0].DIST_INDI;
        },error: function(jqXHR, textStatus, errorThrown) {
            // alert('ERROR CONNECTING TO SERVER:\n Please Check your connection settings.');

            var s = '202.182.112.176,1433';
            var d = 'MondeSFA';
            var u = 'ravamatesfa';
            var p = 'Us3r@sfa2025';

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

function setupChecker(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"CHECK_SITE_SETUP", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            if(r==0){
                $('#setUpSiteModal').modal('show');
                $('#setUpSiteModal').modal({backdrop: 'static', keyboard: false});
            }
        }
    });
}

function updateUserSiteName(siteName) {
	//var siteName = $('#companyHolder').val();
  var userID = localStorage.getItem("user_id");
	$.ajax ({
    url: "https://fastdevs-api.com/MYBUDDYGLOBALAPI/web/databaseApi.php",
    type: "GET",
    data: {"type":"UPDATE_USER_SITENAME", "userID":userID, "siteName":siteName},
    dataType: "json",
    crossDomain: true,
    cache: false
  });
}

function fitToScreen(map){
    this.map = map;
    var fts = document.getElementById("fitToScreenBtn");
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(fts);
}



initMap();
function initMap(){
    // onSuccess();
    function onSuccess() {
        var lat, lang;
        lat = parseFloat(sitelat);
        lang = parseFloat(sitelng);
        zoomPerSite = parseInt(sitezoom);
        myLatlng = new google.maps.LatLng(lat, lang);

        mapOptions = {
            center: myLatlng,
            zoom: zoomPerSite,
            mapTypeId: 'roadmap',
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: true,
            rotateControl: false,
            fullscreenControl: false,
            disableDefaultUI: false,
            drawingControl: false,
            disableDoubleClickZoom: true,
            gestureHandling: "greedy", // No need to press CTRL to zoom in and out
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

        const rightControlDiv = document.createElement('div');
        const rightControl = createRightControl(map);
        let customDiv = document.getElementById('outerContainer_id');
        if(rightControl){
            rightControlDiv.appendChild(rightControl);
            map.controls[google.maps.ControlPosition.RIGHT].push(rightControlDiv);    
        } 

        let customerArrow = document.getElementById('arrow-side3');
        map.controls[google.maps.ControlPosition.LEFT_CENTER].push(customerArrow);   

        new deviation(map);
        new deviationModal(map);
        new fitToScreen(map);
        new AutocompleteDirectionsHandler(map);
        new overviewBarOnMap(map);
        
        map.addListener('click', function() {
            infoWindow.close(); 
            isMarkerOpened = false;
            displayAllData.resume();
            if(isViewSpecMarkersLine == false){
                changeMarkerBounce(); 
            } else{
                deleteBounce();
            }
        });


        // directionsService = new google.maps.DirectionsService();
        // directionsRenderer = new google.maps.DirectionsRenderer({
        //     suppressMarkers: true
        // });
        // directionsRenderer.setMap(map);
        
        map.addListener('dblclick', function() {
            if(isViewSpecMarkersLine){
                hideAllShown();
            }
        });


        let salesmanModal = document.getElementById('deviationRemaingModal_OnMap');
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(salesmanModal);  
        document.addEventListener('fullscreenchange', function () {
            if (document.fullscreenElement === map.getDiv()) {
                // Show the div when entering fullscreen
                customDiv.style.display = 'block'; 
                customerArrow.style.display = 'none'; 
                isFullScreen = true;
                visibleContent(isFullScreen);
                $('#overviewBarOnMap').show();

                $("#mtd-progress-bar").circularProgress('animate', overview_mtd_percentage, 3000);
                $("#daily-progress-bar").circularProgress('animate', overview_daily_percentage, 3000);
                $('#fitToScreenBtn').html('Exit Fullscreen');
                getHeight3();
            } else {
                // Hide the div when exiting fullscreen
                customDiv.style.display = 'none'; 
                customerArrow.style.display = 'block'; 
                isFullScreen = false;
                visibleContent(isFullScreen);
                $('#deviationRemaingModal_OnMap').hide();
                $('#overviewBarOnMap').hide();
                $('#fitToScreenBtn').html('Fit to Screen');
            }
            
        });

        $('#fitToScreenBtn').click(function (){
            if (!document.fullscreenElement) {
                map.getDiv().requestFullscreen();
                dataTables.search('').draw();
                if($("#categoryBox").prop("checked") == false){
                    $('#salesmanCategory').show();   
                }
                
            } else {
                document.exitFullscreen();
                $('#dispModal_deviation').hide();
                dataTables.search('').draw();

            }
        });        
    }
    function onError(error) {
        alert('code: ' + error.code + '\n' +
              'message: ' + error.message + '\n' +
              'Kindly reload your browser.');
    }//onError  
    google.maps.event.addDomListener(window, 'load', onSuccess);

}//init

function hideAllShown(){
    if(isShowUnpro){
        removeUnprodMarkers();
        $('#unprodSW').prop('checked', false);
        isShowUnpro = false;
    }
    if(isShowUnvi){
        removeUnvisitedMarkers();
        $('#unvisitedSW').prop('checked', false);
        isShowUnvi = false;
    }
    if(isShowLine){
        hideMakersLine();
        isShowLine = false;
    }

    if(!isShowUnpro && !isShowUnvi && !isShowLine){
        removeSpecSalesmanMarkers();
    }
}


displayAllData = new IntervalTimer(function () {
    storeTblValues();
    $('#deviationRemaingModal').modal('hide');
    $('#deviationRemaingModal_OnMap').hide();
}, 5000, 600000);

function visibleContent(screenStatus){
    if(screenStatus == true){
        // true if fullscreen, otherwise, false
        $('.contentFull').show();
        $('#timespentTemp').hide();
    } else{
        $('.contentFull').hide();
        $('#timespentTemp').show();
    }
}

function hideModal(){
    $('#deviationRemaingModal_OnMap').hide();
}


function viewPrevious_markerDetails(date){
    isfirstLoadMarkers = true;
    $('#loading-table-main').show();
    $('.loading-table').show();
    $('.loading-table').html('<h5><i class="fa fa-spin fa-spinner"></i> Retreving data..</h5>');
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"displayPreviousDash", "dateSelected":date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,     
        async: false,       
        success: function(data){ 
            removeProdutMarker();
            DeleteMarkers();
            // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
            // var imgstorelink = GLOBALLINKAPI+"/nestle/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
            var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
            var imgstorelink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
            if(data == 0){
                $('.loading-table').html('<h5><i class="fas fa-exclamation-circle"></i> No data found on '+date+'</h5>');
            }else{
                dateToTextSelected = data[0].daysToText;
                $('.loading-table').html('');
                $('.loading-table').hide();
                $("#dashboardDisplay").show();

                $.ajax({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {"type":"previous_getLate", "dateSelected": date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
                    dataType: "json",
                    crossDomain: true,
                    cache: false,
                    async: true,         
                    success: function(response){ 
                        $("#lateSalesman").html('');
                        prevremainingHolder = response;
                        lateSalesmanListHolder = response;
                        var txt = "<tr>";
            
                        for(var i=0;i<response.length;i++){
                            if(i < 15){
                                
                                if(response[i].alert == 'EARLY'){
                                    txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                                    "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                                    "\" id='early' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
                                }else{
                                    txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                                    "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\",  \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                                    "\" id='late' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
                                }
                            }else{
                                var rsalesman = response.length - 15;
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

                        // dataItem = main Array item for markers
                        // responseItem = salesman Item
                        response.forEach(function(responseItem) {
                            var matchFound = false;
                            data.forEach(function(dataItem) {
                                if (dataItem.mdCode == responseItem.mdCode && dataItem.mdCode == responseItem.mdCode) {
                                    matchFound = true;
                                    for (var key in responseItem) {
                                        if (!dataItem.hasOwnProperty(key)) {
                                            dataItem[key] = responseItem[key];
                                        }
                                    }
                                }
                            });
                            if (!matchFound) {
                                data.push(responseItem);
                            }
                        });
                    }
                });
                markers = [];
                for(var x=0; x<data.length; x++){
                    var markerDetail = data[x];
                    var sendDate = data[x].hasOwnProperty('sendDate') ? data[x].sendDate : data[x].deliveryDate;
                    checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
                    var contentString = mainMarkerContentStr(data[x].mdCode, data[x].mdColor, data[x].customerID, data[x].transCount, data[x].Salesman, data[x].Customer, data[x].address, data[x].deliveryDate, data[x].timeSpent, data[x].time, data[x].Sales, data[x].noSku, data[x].latitude, data[x].longitude, data[x].transactionID ,imgstorelink, sendDate, data[x].Notation);

                    var specMarker = mainSpecificMarker(data[x], contentString);
                    
                    markers.push(specMarker);
                    
                    google.maps.event.addListener(specMarker, 'click', (function(specMarker, x) {
                        return function(){
                            $('#indicatorImg').html("Click here to view store image");
                            $('.storeIc').show();
                            lat1 = data[x].latitude; 
                            lon1 = data[x].longitude;

                            if(currentInfoWindow){
                                currentInfoWindow.close();
                                isMarkerOpened = true;
                            }
                            deleteBounce();
                            
                            new google.maps.InfoWindow({ maxWidth: 500});
                            infoWindow.setContent(this.content);
                            infoWindow.open(map, specMarker);
                            marker_leftDetails(specMarker.dataArr);
                            specMarker.setAnimation(google.maps.Animation.BOUNCE);
                        }
                    })(specMarker, x));
                }//end for  
            }
            infoWindow = new google.maps.InfoWindow;
        }
    }).done(function(data){
        setTimeout(() => { // Added a short delay to have time for markers to render successfully in map.
            Swal.close();
            $('#loading-table-main').fadeOut();
            if(data.length <= 0){
                // Swal.close();
                Swal.fire({
                    icon: "info",
                    title: "Oops!",
                    text: 'We couldn’t find any transactions for '+date
                });
                $("#lateSalesman").html('');
            }
        }, 5000);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
    });
}

function viewPrevious_tableDetails(date) {
    $("#dashboardDisplay").html('');
    $("#outerTabDashboardDisplay").html('');
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "displayPreviousDash_tableDetails_v2", "dateSelected": date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,
        success: function (response) {
            convertSourceData(response);
            dataTables.clear().rows.add(sourceData_salesman).draw();
        }
    });
}

function viewPrevious_totalSales(date){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"displayPreviousDash_totalSales", "dateSelected":date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            var sales = r.sales;
            var salesmanCount = r.salesmanCount;
            // $('#total').html('TOTAL (' +salesmanCount+ ') : ' +sales);
            // $('#total').html('Total ('+salesmanCount+') : <span class="fw-bold"> &#8369;' +sales.toLocaleString()+ '</span>' );
            // $('#outerTableTotal').html('Total ('+salesmanCount+') : <span class="fw-bold"> &#8369;' +sales.toLocaleString()+ '</span>' );
        }
   });
}

function viewPrevious_getLate(date){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"previous_getLate", "dateSelected": date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: true,
        success: function(response){ 
            $("#lateSalesman").html('');
            prevremainingHolder = response;
            lateSalesmanListHolder = response;
            var txt = "<tr>";

            // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
            var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
            for(var i=0;i<response.length;i++){
                if(i < 15){
                    
                    if(response[i].alert == 'EARLY'){
                        txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                        "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                        "\" id='early' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
                    }else{
                        txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                        "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\",  \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                        "\" id='late' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
                    }
                }else{
                    var rsalesman = response.length - 15;
                    txt += "<td class='expand'><span class='remainingSalesman' onclick='remaining2(\""+response+"\")'>"+rsalesman+"+</span></td>";
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
    if($('.arrow-side-icon').hasClass('fa-angle-left')){
        $('.arrow-side-icon').removeClass('fa-angle-left').addClass('fa-angle-right');
    } else {
        $('.arrow-side-icon').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
    // $('.arrow-side-icon-toggleZoom').toggleClass('fa-angle-right');
}

function flip2() {
    $(".container_productCat").animate({width:'toggle'},350);
    if($('.arrow-side-icon2').hasClass('fa-angle-left')){
        $('.arrow-side-icon2').removeClass('fa-angle-left').addClass('fa-angle-right');
    } else {
        $('.arrow-side-icon2').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
}  

function flip3() {
    // Toggle icon direction
    $('.arrow-side-icon-leftDiv').toggleClass('fa-angle-left fa-angle-right');

    var left = $('.DashboardLeftContent');
    var right = $('.DashboardRightContent');

    if (left.is(':visible')) {
        // Hide left panel and make right panel full width
        left.hide();
        right.removeClass('col-xl-8 col-xxl-9').addClass('col-12').removeClass('halfFullWidth');
    } else {
        // Show left panel and restore original width
        left.show();
        right.removeClass('col-12').addClass('col-xl-8 col-xxl-9').addClass('halfFullWidth');
    }
}


function defaultStore(image){
    image.onError = "";
    image.src = "img/no-image.png";
    // image.src = "../img/no-image.png";

    $('.image-wrapper .overlay').css({display:'none'});
    return true;
} 

function showSalesmanOnMap(mdCode) {
    //var salesmanCode = mdCode.substring(0, 4);
    var salesmanCode = mdCode;
    if(currentInfoWindow){
        currentInfoWindow.close();
        isMarkerOpened = true;
    }
    deleteBounce();
    markers[markers.length - 1].setAnimation(null);
    for (var x = 0; x < markers.length; x++) {
        if (salesmanCode == markers[x].id && markers[x].transCount == "1") {
            $('#prevMD').hide();
            displayAllData.pause();
    
            if(tableExpanded == false){
                markers[x].setAnimation(google.maps.Animation.BOUNCE);
                map.setCenter(markers[x].getPosition());
                map.setZoom(13);
                infoWindow.close();
                infoWindow.setContent(markers[x].content);
                infoWindow.open(map, markers[x]);
            }
            marker_leftDetails(markers[x].dataArr);
        }
    }
}

function showCurrentOnMap(){
    var latLng = $("#currentLocStoreBtnVal").val();

    for(var x = 0; x < markers.length; x++){
        if(latLng == markers[x].loc){
            if(currentInfoWindow){
                currentInfoWindow.close();
                isMarkerOpened = true;
            }
            markers[x].setAnimation(null);
            markers[x].setAnimation(google.maps.Animation.BOUNCE);
            map.setCenter(markers[x].getPosition());
            map.setZoom(18);
            infoWindow.close();
            infoWindow.setContent(markers[x].content);
            infoWindow.open(map, markers[x]);
            marker_leftDetails(markers[x].dataArr);
        }
    }
}

function distance(lat2, lon2, transCount){
    if(transCount == "1"){
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

datePickerDashboard();

function datePickerDashboard(){
    
    // $('#loading-table-main').show();
    $('#datePicker').daterangepicker({
        "singleDatePicker": true,
        "opens": 'left',
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
    }, function(start, end, label) {    
        if(isShowUnpro || isShowUnvi || isShowLine){ // Markers should be set back to normal state to avoid bugs.
            // Swal.fire({
            //     title: "Restore Map Markers First.",
            //     text: "Double Click on Map To Restore"
            // });
            // return;
        }
        // $('#loading-table-main').show();
        Swal.fire({
            // title: "Auto close alert!",
            html: "Please Wait... Fetching Salesmans for the Day...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        setTimeout(() => {  // Added delay so rendering screen will have time to load.
            var selectedDate = start.format('YYYY-MM-DD');
            date_selected = start.format('YYYY-MM-DD');
            $('#lateDateHolder').val(selectedDate);
            var today = moment().format('YYYY-MM-DD');
            date_today = moment().format('YYYY-MM-DD');
            $('#categoryTable').hide();
            DeleteMarkers();
            if(selectedDate == today){
                // $('#lateSalesman').show();
                lateSalesman();
                forceLoadDashboard();
                forceLoadHtmlDashboard();
                
                adjsutMap();
                getMapOverviewDetails();
                dispCurrentTime.resume();
                displayAllData.resume();
                realTimeChecker = 1;
                $('#EodTitle').html('Current Day Review');
            }else{
                forceLoadHtmlDashboard();
                realTimeChecker = 0;
                dispCurrentTime.pause();
                displayAllData.pause();

                $('#dashboardDisplay').html('');
                
                viewPrevious_markerDetails(selectedDate);
                viewPrevious_tableDetails(selectedDate);
                viewPrevious_totalSales(selectedDate);
                getMapOverviewDetails();
                // viewPrevious_getLate(selectedDate);
                if(dateToTextSelected == undefined){
                    if(date_selected){
                       dateToTextSelected = moment(date_selected).format('ddd');
                    } else{
                       dateToTextSelected = 'SUN'; 
                    }
                }
                $('#time').html('<b>'+dateToTextSelected.toUpperCase() +'</b> | PREVIOUS DATA | ' + selectedDate);
                $('#EodTitle').html('End of Day Review');
            }
            
            mdCodeHolder ='';
            $('.salesmanCatIndi').html('Operation Type <span class="caret"></span>');
            $('#upperMainDiv, #mtdOverviewMainDiv').fadeOut('normal', function() {
                $('#defaultPopUpScreen').fadeIn('normal');
            });
        }, 2000);
        // if(tableExpanded == true){
        //     $('#map').show();
        //     restoreLoc();
        //     $('#map').hide();
        // }
    });
}

function dashBoardData(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"DASHBOARD_SALESMAN_DATA_TABLE_v2", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){ 
            convertSourceData(response);
            dataTables.clear().rows.add(sourceData_salesman).draw();
            
            // var count = $('#dashboardDisplay tr').length;
            var count = sourceData_salesman.length;
            // console.log(count+"=="+delimeter);
            if(count != delimeter){
                lateSalesman();
                delimeter = count;
            }
        }//success
    });
}

function forceLoadHtmlDashboard(){
    loadSalesmanCategory();
    $('#dispModal_deviation').hide();
    $('#salesmanCategory').show();
}

function forceLoadDashboard(){
    dashBoardData();
    dashBoard_direct_marker();
    productCategory();
}

function storeTblValues(){
    var salesBased = 0;
    var basedSalesForRefresh = 0;
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"TOTAL_SALES_DASHBOARD_DATA_TABLE_LOCAL", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        async: true,
        cache: false,          
        success: function(res){ 
            $("#ifEmptyIndi").hide();
            if(res[0].salesman == 0){
                $('.loading-table').html('<h5>No transaction found as of now.</h5>');
                $('#loading-table-main').fadeOut();
                Swal.fire({
                    icon: "info",
                    title: "No Data Available",
                    text: 'There’s nothing to display at the moment.'
                });
            }else{
                var sales = parseFloat(Number(res[0].total).toFixed(2));
                var salesman = res[0].salesman;
                var indicator = res[0].indicator;
                // $('#total').html('Total ('+salesman+') : <span class="fw-bold"> &#8369;' +sales.toLocaleString()+ '</span>' );
                // $('#outerTableTotal').html('Total ('+salesman+') : <span class="fw-bold"> &#8369;' +sales.toLocaleString()+ '</span>' );
                salesBased = indicator;
                if(selecterChecker == 2){
                    if(salesBased != greatest){
                        if(salesBased > greatest){
                            dashBoardData();
                            dashBoard_direct_marker();
                            productCategory();
                            loadSalesmanCategory();
                            getMapOverviewDetails();
                        }else{
                            loadSalesmanCategory();
                            DeleteMarkers();
                            dashBoard_direct_marker();
                            productCategory();
                        }
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"dashBoardData_product", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,          
        success: function(response){ 
            removeProductDatatables();
            $('#cateogoryDataTable').html(response.tableDetails);
            $('.footerDetails').html(response.footerDetails);

            $('#outerCateogoryDataTable').html(response.tableDetails);
            $('.outerFooterDetails').html(response.footerDetails);
            setProductDatatables();
        }//success
    });
}

function brand(product, contriBution, totalSales, color){
    $('#categoryTable').hide();
    $('#selectedCategoryProd').show();
    $('#prodSelName').html('<i class="fa fa-shopping-cart cartSel"></i> '+ product);
    $('.cartSel').css("color", color);
    $('#prodSelSales').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
    $('#prodSelPercent').html('');
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"getProduct", "productName":product, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,     
        async: true,  
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

function dashBoard_direct_marker(){
    if(isfirstLoadMarkers){
        $('#loading-table-main').show();
        isfirstLoadMarkers = false;
    }
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"DASHBOARD_MARKERS", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,
        success: function(data){ 
            if(!data){  
                Swal.fire({
                    icon: "info",
                    title: "No Data Available",
                    text: 'There’s nothing to display at the moment.'
                });
            }
            removeProdutMarker();
            DeleteMarkers();
            // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
            var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
            // var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
            if(data && data.length == 0){
                Swal.close();
                console.log('empty dashboard');
            }else{
                $("#dashboardDisplay").fadeIn();
                $.ajax({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {"type":"GET_LATE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
                    dataType: "json",
                    crossDomain: true,
                    async: true,
                    cache: false,            
                    success: function(response){ 
                        salesmanlist = response;
                        // dataItem = main Array item for markers
                        // responseItem = salesman Item
                        response.forEach(function(responseItem) {
                            var matchFound = false;
                            data.forEach(function(dataItem) {
                                if (dataItem.mdCode == responseItem.mdCode && dataItem.mdCode == responseItem.mdCode) {
                                    matchFound = true;
                                    for (var key in responseItem) {
                                        if (!dataItem.hasOwnProperty(key)) {
                                            dataItem[key] = responseItem[key];
                                        }
                                    }
                                }
                            });
                            if (!matchFound) {
                                data.push(responseItem);
                            }
                        });
                    }
                });
                markers = [];
                for(var x=0; x<data.length; x++){
                    var markerDetail = data[x];
                    var sendDate = data[x].hasOwnProperty('sendDate') ? data[x].sendDate : data[x].deliveryDate;
                    checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
                    var contentString = mainMarkerContentStr(data[x].mdCode, data[x].mdColor, data[x].customerID, data[x].transCount, data[x].Salesman, data[x].Customer, data[x].address, data[x].deliveryDate, data[x].timeSpent, data[x].time, data[x].Sales, data[x].noSku, data[x].latitude, data[x].longitude, data[x].transactionID, imglink, sendDate, data[x].Notation);

                    var specMarker = mainSpecificMarker(data[x], contentString);

                    markers.push(specMarker);
                    
                    google.maps.event.addListener(specMarker, 'click', (function(specMarker, x) {
                        return function(){
                            $('#indicatorImg').html("Click here to view store image");
                            $('.storeIc').show();
                            lat1 = data[x].latitude; 
                            lon1 = data[x].longitude;

                            displayAllData.pause();

                            if(currentInfoWindow){
                                currentInfoWindow.close();
                                isMarkerOpened = true;
                            }
                            deleteBounce();
                            new google.maps.InfoWindow({ maxWidth: 500});
                            infoWindow.setContent(this.content);
                            infoWindow.open(map, specMarker);
                            // console.log(specMarker.dataArr);
                            marker_leftDetails(specMarker.dataArr);
                            
                            specMarker.setAnimation(google.maps.Animation.BOUNCE);

                            $('#defaultPopUpScreen').fadeOut('normal', function() {
                                $('#upperMainDiv, #mtdOverviewMainDiv').fadeIn('normal');
                            });
                            $('.transacDets').hide();
                            $('#left_transaction-details-holder').hide();
                            onViewLeftTransacDetails = false;
                        }
                    })(specMarker, x));
                }//end for  

                google.maps.event.addListener(infoWindow, 'closeclick', function() {  
                    // displayAllData.resume();
                    deleteBounce();
                }); 
            }
        }
    }).done(function() {
        setTimeout(() => { // Added a short delay to have time for markers to render successfully in map.
            Swal.close();
            $('#loading-table-main').fadeOut();
            if(markers.length > 0 ){
                if(isMarkerOpened){
                    isMarkerOpened = false
                }
                changeMarkerBounce();
            } else{
                Swal.fire({
                    icon: "info",
                    title: "Oops!",
                    text: 'We couldn’t find any transactions today '
                });
            }
        }, 5000);
    });
    infoWindow = new google.maps.InfoWindow;
}//end direct dashboard colpal

function getTransaction2(transactionID){
    $('#skuHolder').prop('disabled', true);
    $("#transaction-details-holder table").remove();
    $('#pod-holder').html("");
    $('#IW_PODBtn').html("Check Proof of Delivery");
    var transactionID = $('#IW_transacID').html();
    $('.IWContentOthDetail').show();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"getTransactionDetails", "transactionID":transactionID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html", 
        crossDomain: true,
        cache: false,
        success: function(response){ 
            $('#transaction-details-holder').append(response);
            $('#transaction-details-holder table').addClass('table table-condensed table-bordered');
            $('#transaction-details-holder').addClass('height-details');
            setTimeout(() => {
                $('#skuHolder').prop('disabled', false);
            }, 5000);
        }//success
    });
}

function getPOD(){
    $('#IW_PODBtn').prop('disabled', true);
    $("#transaction-details-holder table").remove();
    $('#pod-holder').html("");
    $('#IW_PODBtn').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
    var podLink = 'https://fastdevs-api.com/FASTSOSYO/download/image/mybuddyPODImages/';
    var transactionID = $('#IW_transacID').html();
    // var transactionID = "X0120250410142117";
    setTimeout(()=>{ 
        $('.IWContentOthDetail').show();
        $('#pod-holder').html('');
        $('#pod-holder').append(`<div class='pod-holder-title'><span class='titleText'>PROOF OF DELIVERY</span></div><div class="image-wrapper"><a href='${podLink + transactionID + ".jpg"}' target='_blank'><img src='${podLink+transactionID+".jpg"}' onError='defaultStore(this)' /></a><div class="overlay"><i class="fa-solid fa-maximize"></i> Click to View Full Size</div></div>`);
        $('#IW_PODBtn').html("Check Proof of Delivery");
    }, 1000);
    setTimeout(() => {
        $('#IW_PODBtn').prop('disabled', false);
    }, 5000);
}

function base64ToFile(base64, filename, mimeType = 'image/jpeg') {
    const byteString = atob(base64); // decode base64 string
    const byteArray = new Uint8Array(byteString.length);
    
    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }

    return new File([byteArray], filename, { type: mimeType });
}

function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
}

function SyncStoreImg(codeString){
    $('.SyncStoreImgBtn').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
    var mdCode = codeString.split('-')[0];
    var custCode = codeString.split('-')[1];
    $('#SyncStoreImgBtn-' + mdCode + '-' + custCode).prop('disabled', true);

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"SYNC_CUSTOMER_IMAGE", "mdCode":mdCode, "custCode":custCode, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(response){ 
            if(response.storeImage != null && response.storeImage != 'NULL'){
                $('#storeImg1').attr('src', 'data:image/jpeg;base64,' + response.storeImage);
                $('#left_storeImage').attr('src', 'data:image/jpeg;base64,' + response.storeImage);

                const file = base64ToFile(response.storeImage, custCode + '_1', 'image/jpeg');
                if(file){
                    const formData = new FormData();
                    formData.append('fileToUpload', file); 
                    formData.append('imgSourceDataFile', custCode + '_1'); 
                    formData.append('targetObject', 'v2Mybuddystores_images');

                    $.ajax({
                        url: 'https://fastdevs-api.com/FASTSOSYO/download/uploadImage.php',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(res) {
                            $('#left_storeImage').attr('src', 'https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/'+formData.get('imgSourceDataFile')+'.jpg');
                        },
                        error: function(err) {
                            Swal.fire({
                                icon: "warning",
                                title: "Warning",
                                text: "Image is NULL"
                            });
                        }
                    });
                }
            }
            if(response.storeImage2 != null && response.storeImage2 != 'NULL'){
                $('#storeImg2').attr('src', 'data:image/jpeg;base64,' + response.storeImage2);

                const file = base64ToFile(response.storeImage2, custCode + '_2', 'image/jpeg');
                if(file){
                    const formData = new FormData();
                    formData.append('fileToUpload', file); 
                    formData.append('imgSourceDataFile', custCode + '_2'); 
                    formData.append('targetObject', 'v2Mybuddystores_images');

                    $.ajax({
                        url: 'https://fastdevs-api.com/FASTSOSYO/download/uploadImage.php',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(res) {
                        },
                        error: function(err) {
                            Swal.fire({
                                icon: "warning",
                                title: "Warning",
                                text: "Image is NULL"
                            });
                        }
                    });
                }
            }

            setTimeout(() => {
                // $('.SyncStoreImgBtn').html("Sync Store Image");
                $('.SyncStoreImgBtn').hide();
            }, 1000);

        }//success
    });
}

function getTransaction(){
    $("#transaction-details-holder table").remove();
    $('.storeImageTable').remove();
    $('#indicatorImg').html("Click here to view store image");
    var transactionID = $('#skuHolder-data').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"getTransactionDetails", "transactionID":transactionID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
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

function getLatestMarker(){
    if(currentInfoWindow){
        currentInfoWindow.close();
    }
    // Sorting to get the Latest Marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
    markers.sort(function(a,b){
        return new Date(a.dataArr.deliveryDate) - new Date(b.dataArr.deliveryDate);
    });
    var lastMarker = markers[markers.length - 1];
    var lastMarkerIndex = markers.length - 1;
    // var sendDate = (lastMarker.dataArr.sendDate)? (new Date(lastMarker.dataArr.sendDate)).toISOString() : (new Date(lastMarker.dataArr.deliveryDate)).toISOString();
    var sendDate = lastMarker.dataArr.hasOwnProperty('sendDate') ? (new Date(lastMarker.dataArr.sendDate)).toISOString() : (new Date(lastMarker.dataArr.deliveryDate)).toISOString();
    var customer = lastMarker.dataArr.Customer;
    var storename = customer.substring(customer.indexOf(" ") + 1, customer.indexOf("[")).trim();
    var infoWindowContent2 = '<div onclick="clickLatest('+lastMarkerIndex+')" id="latestMarkerInfoWindow">'+
                                '<span>'+
                                    '<span style="font-weight:900;">'+(lastMarker.dataArr.Salesman).split("_")[0]+'</span>'+
                                    ' = ₱'+lastMarker.dataArr.Sales+
                                '</span>'+
                                '<br/>'+
                                '<span style="font-size:10px;">'+storename+'</span>'+
                                '<hr class="my-0" />'+
                                '<div class="text-end" style="color: #808080;"><span style="font-size:9px;">added </span><time class="timeago" datetime="'+sendDate+'" style="font-size:9px; white-space:no-wrap;"></time><span class="mdi mdi-tag-arrow-down-outline" style="font-size:14px;"></span></div>'+
                            '</div>';

    var infoWindowContent = `<div onclick='clickLatest(${lastMarkerIndex})' id='latestMarkerInfoWindow'>
                                <div class='IWMarkerStatus'>
                                    <i class="fa-solid fa-location-dot" ></i>
                                    <span class='IWBanner'>Latest Transaction</span>
                                </div>
                                <div class='latestMarkerInfoWindowDetails'>
                                    <span class='storename'>${storename}</span>
                                    <div class='textdiv' style='padding-left:10px'>
                                        <span class='titleText'>Salesman Assigned:</span>
                                        <span class='valueText' id='IW_salesman'>${ lastMarker.dataArr.Salesman }</span>
                                    </div>
                                    <div class='mb-2 textdiv' style='padding-left:10px'>
                                        <span class='titleText'>Total Amount</span>
                                        <span class='valueText' id='IW_salesman'>₱ ${lastMarker.dataArr.Sales}</span>
                                    </div>
                                    <hr class="my-0" />
                                    <div class="text-end mb-2" style="color: #808080;">
                                        <span style="font-size:9px;">added </span>
                                        <time class="timeago" datetime="${sendDate}" style="font-size:9px; white-space:no-wrap;"></time>
                                        <span class="mdi mdi-tag-arrow-down-outline" style="font-size:14px;"></span>
                                    </div>
                                </div>
                            </div>`;

    // infoWindow2 = new google.maps.InfoWindow({
    //     content: infoWindowContent
    // });

    // Open the info window on the last marker
    infoWindow.close();
    if(isMarkerOpened == false){
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, lastMarker);
        currentInfoWindow = infoWindow;
        // infoWindow2.open(map, lastMarker);
        // lastMarker.setAnimation(google.maps.Animation.BOUNCE);
    }

    // Initialize timeago after info window is opened
    setTimeout(function() {
        jQuery(".timeago").timeago();
    }, 0);
}

function clickLatest(lastMarkerIndex){
    displayAllData.pause();

    if(currentInfoWindow){
        currentInfoWindow.close();
        isMarkerOpened = true;
    }
    deleteBounce();
    markers[markers.length - 1].setAnimation(null);
    markers[lastMarkerIndex].setAnimation(google.maps.Animation.BOUNCE);
    map.setCenter(markers[lastMarkerIndex].getPosition());
    map.setZoom(18);
    infoWindow.close();
    infoWindow.setContent(markers[lastMarkerIndex].content);
    infoWindow.open(map, markers[lastMarkerIndex]);
    marker_leftDetails(markers[lastMarkerIndex].dataArr);
}

function deleteBounce(){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
}

function changeMarkerBounce(){
    deleteBounce();
    getLatestMarker();
}

function prevInfo(mdCode, transCount){
    $('#indicatorImg').html("Click here to view store image");
    $('.storeIc').show();
    var newPreview = parseInt(transCount) - 1; 
    deleteBounce();
    markers[markers.length - 1].setAnimation(null);
    if(transCount == "1"){
        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "No previous transaction!"
        });
    }else{
        for(var x=0; x<markers.length; x++){
            if(markers[x].dataArr.mdCode == mdCode && markers[x].dataArr.transCount == newPreview){
                infoWindow.close();
                infoWindow.setContent(markers[x].content);
                infoWindow.open(map, markers[x]);
                markers[x].setAnimation(google.maps.Animation.BOUNCE);
                marker_leftDetails(markers[x].dataArr);
            }
        }
        if(onViewLeftTransacDetails){
            getTransactionDisplayLeft()
        }        
    }
}

function prevInfoLeft(){
    var transCount = $('#left_storeLocTransacNumber').val();
    var mdCode = $('#hiddenInput_mdCode').val();
    $('#indicatorImg').html("Click here to view store image");
    $('.storeIc').show();
    var newPreview = parseInt(transCount) - 1; 
    deleteBounce();
    markers[markers.length - 1].setAnimation(null);
    if(transCount == "1"){
        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "No previous transaction!"
        });
    }else{
        for(var x=0; x<markers.length; x++){
            if(markers[x].dataArr.mdCode == mdCode && markers[x].dataArr.transCount == newPreview){
                if(!tableExpanded){
                    infoWindow.close();
                    infoWindow.setContent(markers[x].content);
                    infoWindow.open(map, markers[x]);
                    markers[x].setAnimation(google.maps.Animation.BOUNCE);
                }
                marker_leftDetails(markers[x].dataArr);
            }
        }
        if(onViewLeftTransacDetails){
            getTransactionDisplayLeft()
        }        
    }
}

function nextInfo(mdCode, transCount){
    $('#indicatorImg').html("Click here to view store image");
    $('.storeIc').show();
    var newNext = transCount + 1; 
    var newWindow;
    deleteBounce();
    markers[markers.length - 1].setAnimation(null);
    for(var x=0; x<markers.length; x++){
        if(markers[x].dataArr.mdCode == mdCode && markers[x].dataArr.transCount == newNext){
            infoWindow.close();
            infoWindow.setContent(markers[x].content);
            infoWindow.open(map, markers[x]);
            markers[x].setAnimation(google.maps.Animation.BOUNCE);
            marker_leftDetails(markers[x].dataArr);
        }
    }
    if(onViewLeftTransacDetails){
        getTransactionDisplayLeft()
    }
}

function nextInfoLeft(){
    var transCount = $('#left_storeLocTransacNumber').val();
    var mdCode = $('#hiddenInput_mdCode').val();
    $('#indicatorImg').html("Click here to view store image");
    $('.storeIc').show();
    var newNext = parseInt(transCount) + 1; 
    deleteBounce();
    markers[markers.length - 1].setAnimation(null);
    for(var x=0; x<markers.length; x++){
        if(markers[x].dataArr.mdCode == mdCode && markers[x].dataArr.transCount == newNext){
            if(!tableExpanded){
                infoWindow.close();
                infoWindow.setContent(markers[x].content);
                infoWindow.open(map, markers[x]);
                markers[x].setAnimation(google.maps.Animation.BOUNCE);
            }
            marker_leftDetails(markers[x].dataArr);
        }
    }
    if(onViewLeftTransacDetails){
        getTransactionDisplayLeft()
    }
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
        return timeSpent = hours+':'+minutes+' mins.';
      }
    // return timeSpent;
}

function convertTimeGap(timegap, transCount){
    if(transCount == "0"){
      return timegap = 0;
    }else{
        if(timegap == undefined || timegap < 0){
          return timegap = 'N/A'; 
        }else if(timegap === '1' || timegap == 0){
          return timegap = timegap + ' min';
        }else if(timegap < 60){
          return timegap = timegap + ' mins';
        }else{
          var hours = Math.floor( timegap / 60);          
          var minutes = timegap % 60;
          return timegap = hours+':'+minutes+' mins';
        }
    }
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

$('#geofenceBox').click(function(){
    if($(this).prop("checked") == true){
       dashBoard_direct_marker();
    //    displayMPA();
        $(this).prop("checked", false);
       alert('There are no geofence drawn as of this moment!');
    }
    else if($(this).prop("checked") == false){
    //   if(mpa_polygon.length > 0){  
    //     for(var i = 0; i < mpa_polygon.length; i++){ 
    //       mpa_polygon[i].setMap(null);
    //     }
    //     mpa_polygon = [];
    //   }
    }
});

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
        
        // $('#salesmanBtn').show();
        // $('#productBtn').hide();

        $('#upperMainDiv, #mtdOverviewMainDiv').fadeOut('normal', function() {
            $('#defaultPopUpScreen').fadeIn('normal');
        });
        // removeDatatables();
        $('#salesmanMainDiv').hide();
        // setProductDatatables();
        $('#productsMainDiv').show();
        // $('.dt-length').hide();
        $('.dt-length').html('');
        $('.dt-length').html('<button class="btn btn-naiCol btn-xs productAllBtn mx-2" type="button" onclick="showAllProduct()"> Show All Product</button>');

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
        
        // $('#salesmanBtn').hide();
        // $('#productBtn').show();
        // removeProductDatatables();
        $('#productsMainDiv').hide();
        // setDatatables();
        $('#salesmanMainDiv').show();
        $('.dt-length').html('');
        setStyles();
        

        removeProdutMarker();
        dashBoard_direct_marker();
        restoreLoc();
        $('.loading-table').hide();
    }
});

////

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseAllWordsExceptFirstLetters(string) {
    return string.replace(/\w\S*/g, function (word) {
        return word.charAt(0) + word.slice(1).toLowerCase();
    });
}

function loadSalesmanCategory() {
    var date = $('#lateDateHolder').val();
    $('.salesmanCatIndi').html('Operation Type <span class="caret"></span>');
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "loadSalesmanCat", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "date": date },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: false,
        success: function (r) {
            var cont = '';
            cont = '<li><a href="#" class="dropdown-item selectCust" style="font-size:13px">All</a></li>';
            for(var x = 0; x < r.length; x++){
                cont += '<li><a href="#" class="dropdown-item selectCust" style="font-size:13px">'+r[x].Type+'</a></li>';
            }
            cont += '<li><hr class="my-0 selectCustHr" /></li><li><span class="dropdown-item" id="syncAllSalesman" style="font-size:13px">Sync all Salesman</span></li>'
            $('.selectCustDD').html(cont);
            selectedCatogery && $('.salesmanCatIndi').html(selectedCatogery);
        }
    });

    $('.selectCustDD li #syncAllSalesman').click(function(){
        // var dialog = bootbox.dialog({
        //     message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        //     backdrop: true
        // });
        // var botboxMsg = '';
        Swal.fire({
            // title: "Auto close alert!",
            html: "Please Wait... Syncing Salesman Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        reportDetails = [];
        $('#upperMainDiv, #mtdOverviewMainDiv').fadeOut('normal', function() {
            $('#defaultPopUpScreen').fadeIn('normal');
        });
        var date = $('#lateDateHolder').val();
        var promises = lateSalesmanListHolder.map(function(salesman) {
            var mdCode = salesman.mdCode;
    
            return fetchMTD_All(mdCode, date).then(function(monthlydata) {
                if(date == todaysDat){
                    return fetch_CURRENTDAY(mdCode, date).then(function(currdatedata) {
                        var isHaveDayData = currdatedata.isHaveData;
                        var isHaveMonthlyData = monthlydata.isHaveData;
                        var salesmandets = {
                            mdCode: mdCode,
                            date: date,
                            sync: false,
                            isHaveDayData: isHaveDayData,
                            isHaveMonthlyData: isHaveMonthlyData,
                            perMonth: monthlydata,
                            perDay: currdatedata,
                        };
                        reportDetails.push(salesmandets);
                    });
                } else{
                    return fetch_EOD(mdCode, date).then(function(currdatedata) {
                        var isHaveDayData = currdatedata.isHaveData;
                        var isHaveMonthlyData = monthlydata.isHaveData;
                        var salesmandets = {
                            mdCode: mdCode,
                            date: date,
                            sync: false,
                            isHaveDayData: isHaveDayData,
                            isHaveMonthlyData: isHaveMonthlyData,
                            perMonth: monthlydata,
                            perDay: currdatedata,
                        };
                        reportDetails.push(salesmandets);
                    });
                }
                
            });
        });
    
        Promise.all(promises).then(function() {
            setTimeout(() => {
                // dialog.modal('hide');
                Swal.close();
            }, 1000);
        });
    
    })
    

    $('.selectCustDD li a').on('click', function () {
        Swal.fire({
            // title: "Auto close alert!",
            html: "Please Wait... Fetching Salesman...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        var selected = $(this).text();
        var sel_conv = $.trim(selected);
        var menu_conv = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(selected));
        selectedCatogery = menu_conv + ' Salesman <span class="caret"></span>'
        $('.salesmanCatIndi').html(selectedCatogery);
  
        $("#dashboardDisplay").hide();
        $("#outerTabDashboardDisplay").hide();
        $('#total').hide();
        $('#outerTableTotal').hide();
        $('.loading-table').show();
        removeProdutMarker();
        restoreLoc();
  
        // getLateBySalesmanCat(sel_conv);
        showSelectedSalesman(sel_conv);
        showSalesmanByBrand(sel_conv);
        showTotalSalesByBrand(sel_conv);
        DeleteMarkers();
  
        displayAllData.pause();
  
        if (sel_conv == 'All') {
            displayAllData.resume();
            bybrandchecker = 0;
        } else {
            displayAllData.pause();
            bybrandchecker = 1;
        }
        
        var intervalId = setInterval(function() {
            if (markers.length > 0) {
                isMarkerOpened = false;
                changeMarkerBounce();
                Swal.close();
                // Clear the interval to stop further checks
                clearInterval(intervalId);  
            }
        }, 3000);
        $('#floatTab tr:first-child th:first-child').text(sel_conv);
    });
}

function showSelectedSalesman(brand) {
    var date = $('#lateDateHolder').val();
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "filterSalesmanByCategory_v2", "brand": brand, "userID": GBL_USERID, "distCode": GBL_DISTCODE, "date": date },
        dataType: "html",
        crossDomain: true,
        cache: false,
        async: true,
        success: function (r) {
            convertSourceData(r);
            dataTables.clear().rows.add(sourceData_salesman).draw();
            
        }
    });
}

function showTotalSalesByBrand(brand) {
    var date = $('#lateDateHolder').val();
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "total_salesman_per_category", "brand": brand, "userID": GBL_USERID, "distCode": GBL_DISTCODE, "date": date },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: true,
        success: function (r) {
            // $('#total').html('Total (' + r[0].salesman + ') : <span class="fw-bold"> &#8369; ' + r[0].total.toLocaleString() + '</span>');
            // $('#outerTableTotal').html('Total (' + r[0].salesman + ') : <span class="fw-bold"> &#8369; ' + r[0].total.toLocaleString() + '</span>');
        }
    });
}

function getLateBySalesmanCat(brand){
    var date = $('#lateDateHolder').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"getLateBySalesmanCat",
            "salesmanCat": brand,
            "date":date,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,
        async: true,
        success: function(response){ 
            $('.mobileNoCont').show();
            $("#lateSalesman").html('');
            // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
            var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
            var txt = "<tr>";
            for(var i=0;i<response.length;i++){
                if(response[i].alert == 'EARLY'){
                    txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                    "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                    "\" id='early' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
                }else{
                    txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                    "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\",  \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                    "\" id='late' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
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

function showSalesmanByBrand(brand) {
    $('#upperMainDiv, #mtdOverviewMainDiv').fadeOut('normal', function() {
        // if(todaysDate == $('#lateDateHolder').val()){
        //     $("#mtdLayout").show();
        //     $("#eodLayout").hide();
        // } else{
        //     $("#eodLayout").show();
        //     $("#mtdLayout").hide();
        // }
        $('#defaultPopUpScreen').fadeIn('normal');
        
    });
    $('.transacDets').hide();
    $('#left_transaction-details-holder').hide();
    onViewLeftTransacDetails = false;
    // DeleteMarkers();
    var thisdate = $('#lateDateHolder').val();
    var compDist = 0;
    // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
    // var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "get_salesman_by_category", "brand": brand, "userID": GBL_USERID, "distCode": GBL_DISTCODE, "date": thisdate },
        dataType: "html",
        crossDomain: true,
        cache: false,
        success: function (response) {
            $('.loading-table').fadeOut();
            $("#dashboardDisplay").show();
            $("#outerTabDashboardDisplay").show();
            $('#total').show();
            $('#outerTableTotal').show();
            if (response == 0) {
                console.log('empty dashboard!');
            } else {
                var data = JSON.parse(response);
                var date = $('#lateDateHolder').val();
                $.ajax ({
                    url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                    type: "POST",
                    data: {
                        "type":"getLateBySalesmanCat",
                        "salesmanCat": brand,
                        "date":date,
                        "userID": GBL_USERID,
                        "distCode": GBL_DISTCODE
                    },
                    dataType: "json",
                    crossDomain: true,
                    cache: false,
                    async: true,
                    success: function(response){ 
                        $('.mobileNoCont').show();
                        $("#lateSalesman").html('');
                        
                        var txt = "<tr>";
                        for(var i=0;i<response.length;i++){
                            if(response[i].alert == 'EARLY'){
                                txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                                "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                                "\" id='early' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
                            }else{
                                txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                                "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\",  \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                                "\" id='late' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'/></td>";
                            }
                        }
                        txt += "</tr>";
                        if(txt != ""){
                            $("#lateSalesman").append(txt);
                            adjsutMap();
                        }

                        response.forEach(function(responseItem) {
                            var matchFound = false;
                            data.forEach(function(dataItem) {
                                if (dataItem.mdCode == responseItem.mdCode && dataItem.mdCode == responseItem.mdCode) {
                                    matchFound = true;
                                    for (var key in responseItem) {
                                        if (!dataItem.hasOwnProperty(key)) {
                                            dataItem[key] = responseItem[key];
                                        }
                                    }
                                }
                            });
                            if (!matchFound) {
                                data.push(responseItem);
                            }
                        });
                    }
                });
                for (var x = 0; x < data.length; x++) {
                    var sendDate = data[x].hasOwnProperty('sendDate') ? data[x].sendDate : data[x].deliveryDate;
                    checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
                    var contentString = mainMarkerContentStr(data[x].mdCode, data[x].mdColor, data[x].customerID, data[x].transCount, data[x].Salesman, data[x].Customer, data[x].address, data[x].deliveryDate, data[x].timeSpent, data[x].time, data[x].Sales, data[x].noSku, data[x].latitude, data[x].longitude, data[x].transactionID, imglink, sendDate, data[x].Notation);

                    var specMarker = mainSpecificMarker(data[x], contentString);
                    
                    markers.push(specMarker);
    
                    google.maps.event.addListener(specMarker, 'click', (function(specMarker, x) {
                        return function(){
                            $('#indicatorImg').html("Click here to view store image");
                            $('.storeIc').show();
                            lat1 = data[x].latitude; 
                            lon1 = data[x].longitude;
                            new google.maps.InfoWindow({ maxWidth: 500});
                            infoWindow.setContent(this.content);
                            infoWindow.open(map, specMarker);
                            // console.log(specMarker.dataArr);
                            marker_leftDetails(specMarker.dataArr);
                            if(currentInfoWindow){
                                currentInfoWindow.close();
                                isMarkerOpened = true;
                            }
                            deleteBounce();
                            specMarker.setAnimation(google.maps.Animation.BOUNCE);

                            $('#defaultPopUpScreen').fadeOut('normal', function() {
                                $('#upperMainDiv, #mtdOverviewMainDiv').fadeIn('normal');
                            });
                            $('.transacDets').hide();
                            $('#left_transaction-details-holder').hide();
                            onViewLeftTransacDetails = false;
                        }
                    })(specMarker, x));
                }//end for  
            }
        }//close else
    });
    infoWindow = new google.maps.InfoWindow;
}

function removeProdutMarker(){
    for (var i = 0; i < productMarker.length; i++) {
        productMarker[i].setMap(null);
    }
    productMarker = [];
}

function hideProdutMarker() {
    for (var i = 0; i < productMarker.length; i++) {
      productMarker[i].setMap(null);
    }
}

function showAllProduct() {
    var ajaxTime = new Date().getTime();
    var totalTime = 0;
    $('.product-data-container tbody').hide();
    $('.loading-table').show();
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "getAllProduct", "userID": GBL_USERID, "distCode": GBL_DISTCODE },
        dataType: "html",
        crossDomain: true,
        cache: false,
        success: function (response) {
            DeleteMarkers();
            if (response == 0) {
                console.log('empty dashboard!');
            } else {
                var data = JSON.parse(response);
                for (var x = 0; x < data.length; x++) {
                    markerProd = new google.maps.Marker({
                        map: map,
                        brandColor: data[x].BrandColor,
                        brandName: data[x].Brand,
                        long: data[x].longitude,
                        lat: data[x].latitude,
                        position: new google.maps.LatLng(data[x].latitude, data[x].longitude),
                        /*icon: {
                        url:'https://mdbuddyonline.access.lyhttps://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker//'+data[x].BrandColor.substr(1),
                        //scaledSize: new google.maps.Size(50, 40)
                        }*/
                        icon: {
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

function IntervalTimer(callback, initialInterval, subsequentInterval) {
    var timerId, startTime, remaining = 0;
    var state = 0; // 0 = idle, 1 = running, 2 = paused, 3 = resumed

    this.pause = function() {
        if (state != 1) return;
        console.log('-- pause');
        remaining = interval - (new Date() - startTime);
        window.clearInterval(timerId);
        state = 2;
    };

    this.resume = function() {
        if (state != 2) return;
        console.log('-- resume');
        state = 1;
        window.setTimeout(this.timeoutCallback, remaining);        
    };

    this.timeoutCallback = function() {
        if (state != 1) return;
        callback();

        startTime = new Date();
        timerId = window.setInterval(callback, interval);
        state = 1;
    };

    this.changeInterval = function(newInterval) {
        interval = newInterval;
        console.log('-- change interval: ' + newInterval);
        if (state === 1 || state === 3) {
            window.clearInterval(timerId);
            timerId = window.setInterval(callback, newInterval);
            startTime = new Date();
        }
    };

    function initialTimeoutCallback() {
        callback();
        this.changeInterval(subsequentInterval);
    }

    var interval = initialInterval;
    startTime = new Date();
    timerId = window.setTimeout(initialTimeoutCallback.bind(this), initialInterval);
    state = 1;
}

function IntervalTimer2(callback, initialInterval, subsequentInterval) {
    var timerId, startTime, remaining = 0;
    var state = 0; // 0 = idle, 1 = running, 2 = paused, 3 = resumed

    this.pause = function() {
        console.log('-- pause1');
        if (state != 1) return;
        console.log('-- pause');
        remaining = interval - (new Date() - startTime);
        window.clearInterval(timerId);
        state = 2;
    };

    this.resume = function() {
        console.log('-- resume1');
        if (state != 2) return;
        console.log('-- resume');
        state = 3;
        window.setTimeout(this.timeoutCallback, remaining);
    };

    this.timeoutCallback = function() {
        if (state != 3) return;

        callback();

        startTime = new Date();
        timerId = window.setInterval(callback, interval);
        state = 1;
    };

    this.changeInterval = function(newInterval) {
        console.log('-- change interval: ' + newInterval);
        interval = newInterval;
        if (state === 1 || state === 3) {
            window.clearInterval(timerId);
            timerId = window.setInterval(callback, newInterval);
            startTime = new Date();
        }
    };

    function initialTimeoutCallback() {
        callback();
        this.changeInterval(subsequentInterval);
    }

    var interval = initialInterval;
    startTime = new Date();
    timerId = window.setTimeout(initialTimeoutCallback.bind(this), initialInterval);
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
    var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    for(var x = 0; x < days.length; x++){
      if(date.getDay() == x){
        day = '<b>'+days[x]+'</b>';
      }
    }
   $('#lateDateHolder').val(getDate());
   lblTime.innerHTML = day+ ' | ' + getDate() +' | '+ time;
}

function lateSalesman(){
    $.ajax({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_LATE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        async: true,
        cache: false,            
        success: function(response){ 
            $('.loading-table').fadeOut();
            $('.mobileNoCont').show();
            $("#lateSalesman").html('');
            remainingHolder = response;
            lateSalesmanListHolder = response;
            var obj = [];
            var txt = "<tr>";

            // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
            var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";

            for(var i=0;i<response.length;i++){
                //loadimages
                obj = {
                "mdCode":response[i].mdCode,
                "image":response[i].thumbnail
                };
                if(i < 15){
                var customer = unescape(response[i].customerLoc);
                if(response[i].alert == 'EARLY'){
                    txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                    "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\", \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' title=\""+response[i].salesmanName+
                    "\" id='early' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'"+" style='width: 1.75rem; height: 1.75rem; border-radius: 50%;' "+"/></td>";

                }else{
                    txt += "<td class='expand'><img onclick='remarkSalesmanClick_mainCall(\""+response[i].salesmanName+"\", \""+response[i].refNo+"\", \""+response[i].deliveryDate+"\", \""+response[i].TransTime+"\", \""+response[i].alert+
                    "\", \""+response[i].mobileNo+"\", \""+response[i].mdCode+"\", \""+response[i].mdColor+"\",  \""+response[i].customerLoc+"\", \""+response[i].latLng+"\", \""+response[i].thumbnail+"\", \""+response[i].calltime+"\")' data-toggle='tooltip' title=\""+response[i].salesmanName+
                    "\" id='late' alt='"+response[i].salesmanName+"' src="+imglink+response[i].mdCode+".jpg"+" onError='imgError(this)'"+" style='width: 1.75rem; height: 1.75rem; border-radius: 50%;' "+"/></td>";
                    }
                }else{

                var rsalesman = response.length - 15;
                txt += "<td class='expand'><span class='remainingSalesman' onclick='remaining2(\""+response+"\")'>"+rsalesman+"+</span></td>";
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"getSpecificSalesman", "mdCode": mdCode, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(data){ 
            deleteSpecificSalesmanMarkers();
            var imglink = GLOBALLINKAPI+"/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
            // var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
            for(var x = 0; x < data.length; x++){
                var markerDetail = data[x];
                var sendDate = data[x].hasOwnProperty('sendDate') ? data[x].sendDate : data[x].deliveryDate;
                checkWithinMPA (data[x].latitude, data[x].longitude, data[x].Salesman, data[x].Sales, data[x].deliveryDate, data[x].Customer, data[x].DocumentNo);
                var contentString = mainMarkerContentStr(data[x].mdCode, data[x].mdColor, data[x].customerID, data[x].transCount, data[x].Salesman, data[x].Customer, data[x].address, data[x].deliveryDate, data[x].timeSpent, data[x].time, data[x].Sales, data[x].noSku, data[x].latitude, data[x].longitude, data[x].transactionID, imglink, sendDate, data[x].Notation);

                var specMarker = mainSpecificMarker(data[x], contentString);

                specificMarker.push(marker);
                markers.push(specMarker);
            }
        }
    });
}

function remarkSalesmanClick_mainCall(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime){
    if (document.fullscreenElement) {
        $('#salesmanCategory').fadeOut('normal', function() {
            $('#dispModal_deviation').fadeIn('normal');
        })
    }

    $('#upperMainDiv, #mtdOverviewMainDiv').css("visibility", "visible");

    restoreLoc();
    infoWindow.close(); 
    deleteBounce();    
    markers[markers.length - 1].setAnimation(null);
    remarkSalesmanClick(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime);
    remarkSalesmanClick_left(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime);
    if(mdCodeHolder != mdCode){
        mdCodeHolder = mdCode;
    }
    var dateCall = $('#lateDateHolder').val();
    mtdOverviewMainCall(mdCode, dateCall);

    $('#defaultPopUpScreen').fadeOut('normal', function() {
        $('#upperMainDiv, #mtdOverviewMainDiv').fadeIn('normal');
    });
    $('.transacDets').hide();
    $('#left_transaction-details-holder').hide();
    onViewLeftTransacDetails = false;
}

function remarkSalesmanClick_left(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime){
    // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
    // var imgstorelink = GLOBALLINKAPI+"/nestle/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
    var imgstorelink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
    var compDist = 0;
    var transtime = date +' '+ time;

    if(alert == 'LATE'){
        $("#left_salesman_remarks")
        .html("<i class='fa-regular fa-face-frown-open'></i>")
        .css({
            "color": "#AC5A2B",
            "background-color": "#FDE6D8"
        });
        $(".imageColor").css("border","4px solid #FF0000");
    } else{
        $("#left_salesman_remarks")
        .html("<i class='fa-regular fa-face-smile'></i>")
        .css({
            "color": "#00894F",
            "background-color": "#D9F8EB"
        });
        $(".imageColor").css("border","4px solid #03F61B");
    }

    checkImg(imglink,mdCode);
    $("#left_salesman_name").html(salesman);
    $("#left_salesman_type").html('---');
    $("#left_salesman_num").html(mobileNo);
    $("#left_calltime").html(calltime);
    $("#left_dateTime_transaction").html(date);
    var currentHTML = $("#left_salesman_remarks").html(); // Get the current HTML content of the element
    $("#left_salesman_remarks").html(currentHTML + alert.toUpperCase()); // Append the current HTML content to itself
    $('#left_Loc').html(customerLocation);

    for(var i = 0; i<markers.length;i++){
        if((markers[i].dataArr.Customer.includes(customerLocation)) && markers[i].dataArr.transCount == "1"){

            $('#left_LocAddress').html(markers[i].dataArr.address);
            $('#left_completedDist').html(markers[i].dataArr.specificComputedDistStr);
            $('#left_dateVisited').html(moment(markers[i].dataArr.deliveryDate).format("MMM DD, YYYY"));
            $('#left_timeVisited').html(date);
            $('#left_dateBooking').html(moment(markers[i].dataArr.deliveryDate).format("MMM DD, YYYY"));
            $('#left_batteryLife').html(getBatteryLife(markers[i].dataArr.Customer) + "% battery usage");
            checkStoreImg(imgstorelink, markers[i].dataArr.customerID);
            $('.storeLocBtnPinNumber').html(markers[i].dataArr.transCount);
            $('#left_storeLocTransacNumber').val(markers[i].dataArr.transCount);
            $("#left_transactionID").val(markers[i].dataArr.transactionID);
            $('#salesman-code').val(mdCode);
            $('#currentLocStoreBtnVal').val(latLng);
            $('.storeFootCol p ').html("Sales: <span class='fw-bold'> ₱ "+markers[i].dataArr.Sales+"</span><span class='fw-light'> ("+markers[i].dataArr.noSku+" SKU)</span>")
        }
    }
}

function remarkSalesmanClick(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime){
    // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";

    if(alert == 'LATE'){
        $("#salesman_remarks").css("color", "red");
    }else{
        $("#salesman_remarks").css("color", "#16e030");
    }

    if (document.fullscreenElement) {
        $('#salesmanCategory').fadeOut('normal', function() {
            $('#dispModal_deviation').fadeIn('normal');
        })
    }

    $("#salesmanImage").attr("src", imglink+mdCode+".jpg");
    $("#salesman_name").html(salesman);
    $("#dateTime_transaction").html(date);
    $("#salesman_remarks").html(alert);
    $("#salesman_num").html(mobileNo);
    $("#calltime").html(calltime);
    $("#firstCallLoc").html('<i class="fas fa-map-marker-alt"></i> ' + customerLocation);
    $("#latLng").val(latLng);
    $("#currentLocStoreBtnVal").val(latLng);

    location_mdCode = mdCode;
}     

function showRemaining(mdCode, refNo, transactionID){
    $('#salesmanCategory').hide();
    $('#deviationRemaingModal').modal('hide');
    // $('#deviationRemaingModal').modal('toggle');
    restoreLoc();
    infoWindow.close(); 
    deleteBounce();     
    markers[markers.length - 1].setAnimation(null);
    var data = markers;
    // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
    for(var x = 0; x < data.length; x++){
        // if(mdCode == data[x].dataArr.mdCode && refNo == data[x].dataArr.refNo && transactionID == data[x].dataArr.transactionID){
        if(mdCode == data[x].dataArr.mdCode && data[x].dataArr.transCount == "1"){
            var salesman = data[x].dataArr.mdCode+'_'+data[x].dataArr.salesmanName;
            if(data[x].dataArr.alert == 'LATE'){
                $("#salesman_remarks").css("color", "#FF0000");
            }else{
                $("#salesman_remarks").css("color", "#16e030");
            }

            if (document.fullscreenElement) {
                $('#salesmanCategory').fadeOut('normal', function() {
                    $('#dispModal_deviation').fadeIn('normal');
                })
            }
        
            $("#salesmanImage").attr("src", imglink+mdCode+".jpg");
            $("#salesman_name").html(salesman);
            $("#dateTime_transaction").html(data[x].dataArr.deliveryDate);
            $("#salesman_remarks").html(data[x].dataArr.alert);
            $("#salesman_num").html(data[x].dataArr.mobileNo);
            $("#calltime").html(data[x].dataArr.calltime);
            $("#firstCallLoc").html('<i class="fas fa-map-marker-alt"></i> ' + data[x].dataArr.customerLoc);
            $("#latLng").val(data[x].dataArr.latLng);
            $("#currentLocStoreBtnVal").val(data[x].dataArr.latLng);
            location_mdCode = data[x].dataArr.mdCode;
            marker_leftDetails(data[x].dataArr);
        }
    }
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
    var latLng = $("#latLng").val();
  
    for(var x = 0; x < markers.length; x++){
        if(latLng == markers[x].loc && markers[x].transCount == "1"){
            
            if(currentInfoWindow){
                currentInfoWindow.close();
                isMarkerOpened = true;
            }
            markers[x].setAnimation(null);
            markers[x].setAnimation(google.maps.Animation.BOUNCE);
            map.setCenter(markers[x].getPosition());
            map.setZoom(18);
            infoWindow.close();
            infoWindow.setContent(markers[x].content);
            infoWindow.open(map, markers[x]);
            marker_leftDetails(markers[x].dataArr); 
        }
    }
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
    // $('#mapUserControlCont').fadeOut();
    if(markers.length > 0){
        isMarkerOpened = false;
        changeMarkerBounce();
    }
	// var latlngtemp = new google.maps.LatLng('14.6064812', '121.0403411');
    // map.setCenter(latlngtemp);
    map.setCenter(new google.maps.LatLng(sitelat, sitelng));
    map.setZoom(zoomPerSite);
    //   pasthisLat = 0;
    //   pasthisLong = 0;
    console.log("location restored");
}

function AutocompleteDirectionsHandler(map){
    this.map = map;
    var dashbaord_table = document.getElementById('outerContainer_id');
    // document.getElementById('outerContainer_id').style.marginLeft = "50px"; 
    this.map.controls[google.maps.ControlPosition.LEFT].push(dashbaord_table);

}

function overviewBarOnMap(map){
    this.map = map;
    var overviewProgressBar = document.getElementById('overviewBarOnMap');
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(overviewProgressBar);
}

$('.closeFirstTransBtn').click(function(){
    adjsutMap();
    $('#deviationRemaingModal_OnMap').hide();
    $('#salesmanCategory').show();
    $('#dispModal_deviation').hide();
    deleteSpecificSalesmanMarkers();
    forceLoadDashboard();
    forceLoadHtmlDashboard();
});

function getsalesmanDetails(specMarker_mdCode){
    $.ajax({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_LATE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        async: true,
        cache: false,            
        success: function(response){ 
            for(var i=0;i<response.length;i++){
                if(response[i].mdCode == specMarker_mdCode){
                    if(response[i].alert == 'LATE'){
                        $("#left_salesman_remarks")
                        .html("<i class='fa-regular fa-face-frown-open'></i>LATE")
                        .css({
                            "color": "#AC5A2B",
                            "background-color": "#FDE6D8"
                        });
                        $(".imageColor").css("border","4px solid #FF0000");
                    } else{
                        $("#left_salesman_remarks")
                        .html("<i class='fa-regular fa-face-smile'></i>EARLY")
                        .css({
                            "color": "#00894F",
                            "background-color": "#D9F8EB"
                        });
                        $(".imageColor").css("border","4px solid #03F61B");
                    }
                    $('#left_salesman_num').html(response[i].mobileNo);

                }
            }
        }
    });
}

function getTransactionDisplayLeft(){
    $('.loadingTransactions').show();
    onViewLeftTransacDetails = !onViewLeftTransacDetails;
    $("#left_transaction-details-holder table").remove();
    var transactionID = $('#left_transactionID').val();

    if(onViewLeftTransacDetails){
        $('.mtdOverviewMainDiv').hide();
        $('.transacDets').show();
        $('#left_transaction-details-holder').show();
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"getTransactionDetails", "transactionID":transactionID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "html", 
            crossDomain: true,
            cache: false,
            success: function(response){ 
                $('#left_transaction-details-holder').append(response);
                $('#left_transaction-details-holder table').addClass('table table-condensed table-bordered table-primary table-striped');
                $('#left_transaction-details-holder').addClass('height-details');
            }//success
        }).done(function(){
            $('.loadingTransactions').hide();
        });
    } else{
        $('.mtdOverviewMainDiv').show();
        $('.transacDets').hide();
        $('#left_transaction-details-holder').hide();
    }
}

function showCustImage(custID){
    $('.storeImageTable').remove();
    $("#transaction-details-holder table").remove();
    $('#indicatorImg').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
    $('.storeIc').hide();
    var ajaxTime= new Date().getTime();
    var totalTime= 0;
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"displayCustImage", "custID":custID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            var content = "<table class='storeImageTable' style='margin:auto; text-align:center;'><tr><td style='padding-left: 10px; padding-right: 10px;'><img onError='defaultStore(this)' class='store1' src='data:image/jpeg;base64,"+r.storeImage+"'/></td>"+
            "<td style='padding-left: 10px; padding-right: 10px;'><img onError='defaultStore(this)' src='data:image/jpeg;base64,"+r.storeImage2+"'/></td></tr><tr><td style='padding-left: 10px; padding-right: 10px;'>Outside View</td><td style='padding-left: 10px; padding-right: 10px;'>Inside View</td></tr><table/>"; 
            $('#customerData').append(content);      
        }
    }).done(function () {
        setTimeout(function(){
            $('#indicatorImg').html("");
        }, totalTime);
    });
}

function showCustImage_othMarker(custID){
    $(`#othMarkImg_${custID}`).html("<i class='fa fa-spin fa-spinner'></i> please wait..");
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"displayCustImage", "custID":custID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            var content = "<table class='storeImageTable' style='margin:auto; text-align:center; margin-top:10px;'>"+
                                "<tr>"+
                                    "<td style='padding-left: 10px; padding-right: 10px;'>"+
                                        "<img onError='defaultStore(this)' class='store1' src='data:image/jpeg;base64,"+r.storeImage+"'/>"+
                                    "</td>"+
                                    "<td style='padding-left: 10px; padding-right: 10px;'>"+
                                        "<img onError='defaultStore(this)' src='data:image/jpeg;base64,"+r.storeImage2+"'/>"+
                                    "</td>"+
                                "</tr>"+
                                "<tr>"+
                                    "<td style='padding-left: 10px; padding-right: 10px; font-size: 10px;'>Outside View</td>"+
                                    "<td style='padding-left: 10px; padding-right: 10px; font-size: 10px;'>Inside View</td>"+
                                "</tr>"+
                            "<table/>"; 
            $(`#othMarkCustImage_${custID}`).append(content);      
        }
    }).done(function () {
        setTimeout(function(){
            $(`#othMarkImg_${custID}`).html("");
        }, 100);
    });
}

function storeimgError(image) {
    image.onError = "";
    image.src = "img/storePic.jpg";
    // image.src = "../img/storePic.jpg";

    $('.SyncStoreImgBtn').show();
    return true;
}  

function marker_leftDetails(dataArray){
    // $('#salesmanCategory').hide();
    $('#upperMainDiv, #mtdOverviewMainDiv').css("visibility", "visible");
    // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
    // var imgstorelink = GLOBALLINKAPI+"/nestle/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
    var imgstorelink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
    var time = (dataArray.deliveryDate.split(" ")[1]).split(".")[0];
    var customer = dataArray.Customer;
    var storename = customer.substring(customer.indexOf(" ") + 1, customer.indexOf("[")).trim();
    var latitudeLongitude = dataArray.latitude + " " + dataArray.longitude;
    
    if(dataArray.alert == 'LATE'){
        $("#left_salesman_remarks")
        .html("<i class='fa-regular fa-face-frown-open'></i>")
        .css({
            "color": "#AC5A2B",
            "background-color": "#FDE6D8"
        });
        $(".imageColor").css("border","4px solid #FF0000");
    } else{
        $("#left_salesman_remarks")
        .html("<i class='fa-regular fa-face-smile'></i>")
        .css({
            "color": "#00894F",
            "background-color": "#D9F8EB"
        });
        $(".imageColor").css("border","4px solid #03F61B");
    }

    var currentHTML = $("#left_salesman_remarks").html();
    checkImg(imglink,dataArray.mdCode);
    $("#hiddenInput_mdCode").val(dataArray.mdCode);
    $("#left_salesman_name").html(dataArray.Salesman);
    $("#left_salesman_type").html(salesmanType(dataArray.DefaultORDType));
    $("#left_salesman_num").html(dataArray.mobileNo);
    $("#left_calltime").html(dataArray.calltime);
    $("#left_dateTime_transaction").html(dataArray.TransTime ? (dataArray.TransTime).split('.')[0]: '---');
    $("#left_salesman_remarks").html(currentHTML + dataArray.alert.toUpperCase());
    $('#left_Loc').html(storename);
    $('#left_LocAddress').html(dataArray.address);
    
    $('#left_completedDist').html(dataArray.specificComputedDistStr);
    $('#left_dateVisited').html(moment(dataArray.deliveryDate).format("MMM DD, YYYY"));
    $('#left_timeVisited').html(time);
    $('#left_dateBooking').html(moment(dataArray.deliveryDate).format("MMM DD, YYYY"));
    $('#left_batteryLife').html(getBatteryLife(dataArray.Customer) + "% battery usage");
    checkStoreImg(imgstorelink, dataArray.customerID);
    $('.storeLocBtnPinNumber').html(dataArray.transCount);
    $('#left_storeLocTransacNumber').val(dataArray.transCount);
    $("#left_transactionID").val(dataArray.transactionID);
    $('#currentLocStoreBtnVal').val(latitudeLongitude);
    $('.storeFootCol p ').html("Sales: <span class='fw-bold'> ₱ "+dataArray.Sales+"</span><span class='fw-light'> ("+dataArray.noSku+" SKU)</span>")


    $('#defaultPopUpScreen').fadeOut('normal', function() {
        $('#upperMainDiv, #mtdOverviewMainDiv').fadeIn('normal');
    });
    $('.transacDets').hide();
    $('#left_transaction-details-holder').hide();
    onViewLeftTransacDetails = false;
    if(mdCodeHolder != dataArray.mdCode){
        mdCodeHolder = dataArray.mdCode;
        var dateCall = $('#lateDateHolder').val();
        mtdOverviewMainCall(dataArray.mdCode, dateCall);
    }
}

// mainMarkerContent(data[x].mdCode, data[x].mdColor, data[x].customerID, data[x].transCount, data[x].Salesman, data[x].Customer, data[x].address, data[x].deliveryDate, data[x].timeSpent, data[x].time, data[x].Sales, data[x].noSku, data[x].latitude, data[x].longitude, data[x].transactionID, imglink);
function mainMarkerContentStr(mdCode, mdColor, customerID, transCount, Salesman, Customer, address, deliveryDate, timeSpent, time, Sales, noSku, latitude, longitude, transactionID, imglink, sendDate, Notation){
    var compDist = distance( latitude, longitude,transCount);
    var custCode = Customer.split(" ")[0];
    var match = Customer.match(/^[^\s]+\s+(.*?)\s+\[/); // Will only return store name; get rid of custcode and battery percentage;
    var custName = match ? match[1] : Customer.replace(/^\S+\s+/, ''); // in cases it will only get rid of custcode
    var match2 = Customer.match(/\[\s*(.*?)\s*\]/);
    var battery = match2 ? match2[1] : null;
    var computedDist = specificComputedDistStr = compDist + " in " + convertTimeGap(time, transCount);

    var contentVal = `
        <div class='IWMainContainer'>
            <div class='IWMarkerStatus'>
                <i class="fa-solid fa-circle-check" style='color: var(--cust-success);'></i>
                <span class='IWBanner'>Visited Customer</span>
            </div>
            <div class='IWImageBtnOuterDiv'>
                <div class='IWImageBtn'>
                    <button onclick='scrollCarousel(-1)'>
                        <i class="fa fa-chevron-left pull-left"></i>
                    </button>
                    <button class='SyncStoreImgBtn' id='SyncStoreImgBtn-${mdCode+"-"+customerID}' onclick='SyncStoreImg("${mdCode+"-"+customerID}")'>
                        <span class="mdi mdi-sync"></span> Sync Store Image
                    </button>
                    <button onclick='scrollCarousel(1)'>
                        <i class="fa fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class='IWImageContainer' id='${mdCode+"-"+customerID}'>
                <div class="carousel-track">
                    <img id='storeImg1' class='storeImg' alt='' src='${imglink+customerID+"_1.jpg"}' onError='storeimgError(this)' style='object-fit:cover;'/>
                    <img id='storeImg2' class='storeImg' alt='' src='${imglink+customerID+"_2.jpg"}' onError='storeimgError(this)' style='object-fit:cover;'/>
                </div>
                <div class='toggleStoreDiv'>
                    <button onclick='toggleStoreImg("${mdCode+"-"+customerID}")'>
                        <i class="fa-solid fa-angle-down"></i>
                    </button>
                </div>
            </div>
            <div class='IWContentHeader'>
                <div class='row'>
                    <div class='col-10 custDetails'>
                        <span class='valueText' id='IW_CustCode'>${customerID}</span>
                        <span class='valueText' id='IW_CustName'>${custName}</span>
                        <span class='valueText' id='IW_Address'>${address}</span>
                    </div>
                    <div class='col-2'>
                    
                    </div>
                </div>
            </div>
            <div class='IWMarkerDiv'>
                <div class=' '>
                </div>
                <div class=' ' style='padding-left: 18px;'>
                    <div class='d-flex'>
                        <span class='badge rounded-pill arrowStoreBtn' onclick='prevInfo("${mdCode}", ${transCount})' style='cursor: pointer; margin-right:5px'>
                            <span class='fa-solid fa-angles-left' id='prevMD'></span>
                        </span>
                        <span class='badge rounded-pill arrowStoreBtn' onclick='nextInfo("${mdCode}", ${transCount})' style='cursor: pointer; margin-left:5px'>
                            <span id='nextMD' class='fa-solid fa-angles-right' ></span>
                        </span>
                    </div>
                    <img id='IW_marker' src='https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/${transCount}/${mdColor.substr(1)}' />
                </div>
            </div>
            <div class='d-flex'>
                <div class='IWContentDetail'>
                    <div class='mb-2 textdiv'>
                        <span class='titleText'>Salesman Assigned:</span>
                        <span class='valueText' id='IW_salesman'>${Salesman + " (" + mdCode + ") - " + battery + "%" }</span>
                    </div>
                    <div class='mb-2 textdiv'>
                        <span class='titleText'>Transaction ID:</span>
                        <span class='valueText' id='IW_transacID'>${transactionID}</span>
                        <button id='IW_PODBtn' onclick='getPOD()'>Check Proof of Delivery</button>
                    </div>
                    <div class='row'>
                        <div class='col-6'>
                            <div class='mb-2 textdiv'>
                                <span class='titleText'>Transaction Date:</span>
                                <span class='valueText' id='IW_delDate'>${new Date(deliveryDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
                            </div>
                        </div>
                        <div class='col-6'>
                            <div class='mb-2 textdiv'>
                                <span class='titleText'>Sent Date:</span>
                                <span class='valueText' id='IW_sentDate'>${new Date(sendDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
                            </div>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-6'>
                            <div class='mb-2 textdiv'>
                                <span class='titleText'>Time Spent:</span>
                                <span class='valueText' id='IW_timeSpent'>${timeSpent}</span>
                            </div>
                        </div>
                        <div class='col-6'>
                            <div class='mb-2 textdiv'>
                                <span class='titleText'>Distance Travel:</span>
                                <span class='valueText' id='IW_distTravel'>${computedDist}</span>
                            </div>
                        </div>
                    </div>        
                    <div class='mb-2 textdiv'>
                        <span class='titleText'>Remarks:</span>
                        <span class='valueText' id='IW_remarks'>${(Notation)? Notation : "---"}</span>
                    </div>        
                    <div class='mb-2 textdiv'>
                        <span class='titleText'>Transaction Sales:</span>
                        <span class='valueText' id='IW_sales'>
                            &#8369 ${Sales}
                            <button id='skuHolder' onclick='getTransaction2()'>(${noSku} SKU)
                                <i class='fa fa-caret-down' aria-hidden='true'></i>
                            </button>
                        </span>
                    </div>
                </div>
                <div class='IWContentOthDetail'>
                    <div id='transaction-details-holder'></div>
                    <div id='pod-holder' style='text-align: center;'></div>
                </div>
            </div>
        </div>
    `;

    return contentVal;
}
function scrollCarousel(direction) {
    const image = document.getElementById('storeImg2');

    if (direction == '1') {
        if (image.src.includes('img/storePic.jpg')) {
            console.warn('Image failed to load.');
            return;
        }
    }
    const container = document.querySelector('.carousel-track');
    const width = container.offsetWidth;
    container.scrollBy({ left: width * direction, behavior: 'smooth' });
}

function toggleStoreImg(storeImgID) {
    var element = $('#' + storeImgID);
    var toggleIcon = $('.toggleStoreDiv i'); // target the icon only

    if (element.hasClass('extended_IWImageContainer')) {
        element.removeClass('extended_IWImageContainer');
        // back to default
        // $('.toggleStoreDiv').css({ top: '85px' });
        toggleIcon.css({ transform: 'rotate(0deg)' });
        $('.IWImageBtn').css({ top: '60px' });
        $('.carousel-track .storeImg').css({ objectFit: 'cover'});
    } else {
        element.addClass('extended_IWImageContainer');
        // rotate arrow
        // $('.toggleStoreDiv').css({ top: '185px' });
        toggleIcon.css({ transform: 'rotate(180deg)' }); 
        $('.IWImageBtn').css({ top: '110px' });
        $('.carousel-track .storeImg').css({ objectFit: 'fill'});
    }
}
function mainSpecificMarker(data, contentString){
    $.extend(data, {
        specificComputedDistStr: specificComputedDistStr
    });
    var marker = new google.maps.Marker({
        id: data.mdCode,
        transCount: data.transCount,
        loc: data.latitude+' '+data.longitude,
        mdName: data.Salesman,
        infowindow: infoWindow,
        position: new google.maps.LatLng(data.latitude,data.longitude),
        map: map,
        content: contentString,
        markerType: "mainMarker",
        icon: {
            url:'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/'+data.transCount+'/'+data.mdColor.substr(1),
            scaledSize: new google.maps.Size(32, 36)
        },
        dataArr: data,
    });

    return marker;
}

function mainSpecificMarker(data, contentString){
    $.extend(data, {
        specificComputedDistStr: specificComputedDistStr
    });
    var marker = new google.maps.Marker({
        id: data.mdCode,
        transCount: data.transCount,
        loc: data.latitude+' '+data.longitude,
        mdName: data.Salesman,
        infowindow: infoWindow,
        position: new google.maps.LatLng(data.latitude,data.longitude),
        map: map,
        content: contentString,
        markerType: "mainMarker",
        icon: {
            url:'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/'+data.transCount+'/'+data.mdColor.substr(1),
            scaledSize: new google.maps.Size(32, 36)
        },
        dataArr: data,
    });

    return marker;
}

function getBatteryLife(str){
    const regex = /\[([^\]]+)\]/;
    const match = regex.exec(str);
    var retVal = 'battery';

    if (match) {
        retVal = match[1];
    }
    return retVal;
}

function checkImg(imglink, mdCode){
    var img = new Image();
    img.src = imglink + mdCode + ".jpg";

    $(img).on('load', function() {
        $("#left_salesmanImage").attr("src", img.src);
    }).on('error', function() {
        $("#left_salesmanImage").attr("src", "img/salesmanPic.jpg");
    });
}

function checkStoreImg(imglink, custCode){
    var img = new Image();
    // img.src = imglink + custCode + ".jpg";
    img.src = imglink + custCode + "_1.jpg";

    $(img).on('load', function() {
        $("#left_storeImage").attr("src", img.src);
    }).on('error', function() {
        $("#left_storeImage").attr("src", "img/storePic.jpg");
    });
}

function checkStoreImg_othMark(imglink, custCode){
    var img = new Image();
    // img.src = imglink + custCode + ".jpg";
    img.src = imglink + custCode + "_1.jpg";


    $(img).on('load', function() {
        $("#othMarkStoreImg").attr("src", img.src);
    }).on('error', function() {
        $("#othMarkStoreImg").attr("src", "img/storePic.jpg");
    });
}

// function showRemaining(mdCode){
//     $('#deviationRemaingModal').modal('toggle');
//     restoreLoc();
//     infoWindow.close(); 
//     deleteBounce();     
//     var data = remainingHolder;
//     var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";

//     for(var x = 0; x < data.length; x++){
//         if(mdCode == data[x].mdCode){
//             var salesman = data[x].mdCode+'_'+data[x].salesmanName;
//             if(data[x].alert == 'LATE'){
//                 $("#salesman_remarks").css("color", "red");
//             }else{
//                 $("#salesman_remarks").css("color", "#16e030");
//             }

//             if (document.fullscreenElement) {
//                 $('#salesmanCategory').fadeOut('normal', function() {
//                     $('#dispModal_deviation').fadeIn('normal');
//                 })
//             }
        
//             $("#salesmanImage").attr("src", imglink+mdCode+".jpg");
//             $("#salesman_name").html(salesman);
//             $("#dateTime_transaction").html(data[x].deliveryDate);
//             $("#salesman_remarks").html(data[x].alert);
//             $("#salesman_num").html(data[x].mobileNo);
//             $("#calltime").html(data[x].calltime);
//             $("#firstCallLoc").html('<i class="fas fa-map-marker-alt"></i> ' + data[x].customerLoc);
//             $("#latLng").val(data[x].latLng);

//             location_mdCode = data[x].mdCode;

//             console.log(data[x].mdCode, data[x].refNo, data[x].transactionID)
//         }
//     }
// }

function remaining(){
    var cont = '';
    var tabCont, alert;
    var data = remainingHolder;
    // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
    console.log(data);
    for(var x = 0; x < data.length; x++){
      if(data[x].alert == 'LATE'){
        // alert = "<span style='color: red'>"+data[x].alert+"</span>";
        alert = '<span class="badge" style="color: #AC5A2B; background-color: #FDE6D8; font-size:10px;">'+data[x].alert+'</span>';
      }else{
        // alert = "<span style='color: green'>"+data[x].alert+"</span>";
        alert = '<span class="badge" style="color: #00894F; background-color: #D9F8EB; font-size:10px;">'+data[x].alert+'</span>'
      }
      cont +=   "<tr class='devRemainingSalesmanRow' onclick='showRemaining(\""+data[x].mdCode+"\",\""+data[x].refNo+"\",\""+data[x].transactionID+"\")'>"+
                    "<td>"+
                        (x+1)+
                        "  "+
                        "<img class='remainingDevPics' style='height:40px;width:40px' src='"+imglink+data[x].mdCode+".jpg' onError='imgError(this)'/> "
                        +data[x].mdCode+'_'+data[x].salesmanName+
                        " "+
                         alert+
                    "</td>"+
                "</tr>";
    }

    tabCont = "<table class='table table-condensed table-hover' style='height:300px'>"+cont+"</table>"
    $('.devRemainBody').html(tabCont);
    console.log(tabCont);
    if(isFullScreen){
        $('#deviationRemaingModal_OnMap').toggle();
    } else{
        $('#deviationRemaingModal').modal('toggle');
    }
}

function remaining2(){
    var cont = '';
    var tabCont, alert;
    var data = remainingHolder;
    // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
    
    for(var x = 0; x < data.length; x++){
        if(data[x].alert == 'LATE'){
            // alert = "<span style='color: red'>"+data[x].alert+"</span>";
            alert = '<span class="badge" style="color: #AC5A2B; background-color: #FDE6D8; font-size:10px;">'+data[x].alert+'</span>';
        }else{
            // alert = "<span style='color: green'>"+data[x].alert+"</span>";
            alert = '<span class="badge" style="color: #00894F; background-color: #D9F8EB; font-size:10px;">'+data[x].alert+'</span>'
        }
        cont +=   "<tr class='devRemainingSalesmanRow' onclick='showRemaining(\""+data[x].mdCode+"\",\""+data[x].refNo+"\",\""+data[x].transactionID+"\")'>"+
                        "<td style='white-space:nowrap;'>"+
                            "<img class='remainingDevPics' style='height:40px;width:40px' src='"+imglink+data[x].mdCode+".jpg' onError='imgError(this)'/> "+
                            data[x].mdCode+'_'+data[x].salesmanName+
                        "</td>"+
                        "<td class='text-center'>"+
                            alert+
                        "</td>"+
                    "</tr>";
    }

    tabCont = "<table class='table table-condensed table-hover devRemainingTable' style='height:300px;width:100% !important;'>"+
                    "<thead>"+
                        "<tr>"+
                            "<th class='text-center'>Salesman</th>"+
                            "<th class='text-center'>Attendance</th>"+
                        "</tr>"+
                    "</thead>"+
                    "<tbody>"+
                        cont+
                    "</tbody>"+
                "</table>"
    $('.devRemainBody').html(tabCont);
    setDevRemainingDatatables1();
    setDevRemainingDatatables2();
    if(isFullScreen){
        $('#deviationRemaingModal_OnMap').toggle();
    } else{
        $('#deviationRemaingModal').modal('toggle');
    }
}

$('.closeBtn').click(function (){
    $('#selectedCategoryProd').hide();
    $('#categoryTable').show();
    showAllProduct();
});

function checkTime(timeString) {
    var checkTime;
    var time = timeString.trim();
    var period = time.slice(-2);
    var [hours, minutes] = time.slice(0, -2).split(':').map(Number);

    if (period === 'AM' && hours === 12) {
        hours = 0;
    } else if (period === 'PM' && hours !== 12) {
        hours += 12;
    }

    if (period === 'AM') {
        if (hours > 7 || (hours === 7 && minutes > 0)) {
            checkTime = false;
        } else {
            checkTime = true;
        }
    } else {
        checkTime = false;
    }
    return checkTime;
}

function checkTimeFromCallTime(firstCall, callTime){
    var firstCallDate = timeToDateToday(firstCall);
    var callTimeDate = timeToDateToday(callTime);
    // const firstCallDate = new Date(`1970-01-01 ${firstcallVal}`);
    // const callTimeDate = new Date(`1970-01-01 ${callTime}`);
    console.log(firstCall, callTime, "===", firstCallDate, callTimeDate);
    return firstCallDate < callTimeDate;
}

function timeToDateToday(timeStr) {
    if (!timeStr) return null;

    const d = new Date();
    timeStr = timeStr.trim().toUpperCase();

    // 12-hour format: H:MM AM / PM (with or without space)
    let m12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (m12) {
        let [, h, m, p] = m12;
        let hour = +h;

        if (p === 'PM' && hour !== 12) hour += 12;
        if (p === 'AM' && hour === 12) hour = 0;

        d.setHours(hour, +m, 0, 0);
        return d;
    }

    // 24-hour format: HH:MM or HH:MM:SS
    let m24 = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m24) {
        const [, h, m, s = 0] = m24;
        d.setHours(+h, +m, +s, 0);
        return d;
    }

    return null; // invalid format
}



function convertSourceData(response){
    sourceData_salesman = [];
    var salesmanRow = JSON.parse(response);
    
    salesmanRow.forEach(salesman => {
        // var imglink = GLOBALLINKAPI+"/nestle/connectionString/images-salesman/"+GLOBALDISTDBNAME+"/";
        var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
        var photoHtmlString= '<img src="' + imglink + salesman.mdCode+ '.jpg" onError="imgError(this)" height="20" width="20" style="border-radius:50%;border:2px solid '+salesman.mdColor+'">';
        // var timeStr = checkTime(salesman.FirstCall);
        var timeStr = checkTimeFromCallTime(salesman.FirstCall, salesman.callTime);
        var sales = parseFloat(salesman.Sales).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        var attendance;
        
        if(timeStr){
            attendance = '<span class="badge" style="color: #00894F; background-color: #D9F8EB; font-size:10px;">Early</span>';
        } else {
            attendance = '<span class="badge" style="color: #AC5A2B; background-color: #FDE6D8; font-size:10px;">Late</span>';
        }

        var target = parseInt(salesman["Total Calls"]);
        var pro = parseInt(salesman["Productive Calls"]);
        var unpro =  parseInt(salesman["Unproductive Calls"]);
        var total = pro+unpro;
        var percentage = (target != 0)? Math.ceil((total/target)*100) +'%' : '-';
        // console.log(pro+'  +  '+unpro+'  /  '+target+"  ==  "+percentage);

        var salesmanObj = {
            mdCode: salesman.mdCode,
            salesmanName: photoHtmlString + " "+ salesman.mdName,
            alert: attendance,
            // calls: salesman["Productive Calls"] + " | " + salesman["Total Calls"],
            target: salesman["Total Calls"],
            pro: salesman["Productive Calls"],
            unpro: salesman["Unproductive Calls"],
            percentage: percentage,
            sellingHrs: salesman.sellingHours,
            sales: '\u20B1'+ sales
        }
        
        sourceData_salesman.push(salesmanObj);
    });
    
}


function setDatatables() {
    var isInit = ($('.dataTableMainClass').hasClass('dataTable'))?true:false;
    if (!DataTable.isDataTable('.dataTableMainClass') && isInit === false) {
        dataTables = new DataTable('.dataTableMainClass', {
            lengthChange: true,
            pageLength: NumOfDataTableRows,
            order: false,    
            responsive: true,
            source: sourceData_salesman,
            bSort: true,
            // scrollY: '200px',
            "autoWidth": false,
            columns: [
                { data: "salesmanName", title:"Salesman Name", "width": "50px" },
                { data: "alert", title: "Attendance" },
                // { data: "calls", title:"Calls"},
                { data: "target", title:"Target MCP"},
                { data: "pro", title:"Productive"},
                { data: "unpro", title:"Unproductive"},
                { data: "percentage", title:"Strike Rate"},
                { data: "sellingHrs", title:"Selling Hrs"},
                { data: "sales", title:"Sales" },
                { data: "mdCode"},
            ],
            columnDefs: [
                {
                    targets: [1,2,3,4,5],
                    className: 'dt-body-center text-center'
                },
                {
                    targets: [2,6],
                    className: 'text-nowrap'
                },
                {
                    targets: 7,
                    className: 'dt-body-right text-end'
                },
                {
                    targets: 8,
                    className: 'hidden'
                }
            ],
            "language": {
                "search": "",
                "searchPlaceholder": "Search Salesman..."
            },
            "createdRow": function (row) {
                $('td', row).css({
                "padding": "5px",
                'width': 'auto',
                'text-align': 'center'
                });
    
                $('td', row).attr('width', 'auto');
    
                $('td:first-child', row).css({
                'text-align': 'left'
                });

                $('td:last-child', row).css({
                    'text-align': 'right'
                });
            },
    
            "headerCallback": function (thead) {
                $('th', thead).css({
                "padding": "5px",
                'text-align': 'center'
                });
    
                $('th:first-child', thead).css({
                'text-align': 'left'
                });
            },
    
            "initComplete": function (settings, json) {
                setStyles();
                $('.dt-search input[type="search"]').css({
                    // 'margin-top': '5px',
                    'margin-right': '15px',
                    'border-radius': '8px',
                    'font-size': '11px',
                    'width': '200px',
                    'color': '#aaa'
                });
                $('#floatTab_wrapper .dataTables_paginate .paginate_button,#floatTab_wrapper .dataTables_length select,#floatTab_wrapper .dataTables_filter input,#floatTab_wrapper .dataTables_info,#floatTab_wrapper .dataTables_scrollHead table.dataTable thead th,#floatTab_wrapper .dataTables_scrollBody table.dataTable tbody td').css({
                    'font-size': '0.7rem', 
                });

                setInterval(() => {
                    var initialData = dataTables.rows({ search: 'applied' }).data();
                    getTblTotal(initialData);
                }, 5000);
                
            },
        });

        // let dataTable2 = $('#floatTab').DataTable(); // Get the DataTable instance for the second table
        let dataTable2 = new DataTable('#floatTab');
        dataTable2.page.len(18).draw();

        // Attach event listener to each row
        $('.dataTableMainClass tbody').on('click', 'tr', function () {
            if(isViewSpecMarkersLine == false){
                var tr = $(this).closest('tr');
                var row = dataTables.row(tr);
                var mdCode = tr.find('td:eq(8)').text();
                // console.log(mdCode);
                showSalesmanOnMap(mdCode);
            } else {
                Swal.fire({
                    title: "Restore Map Markers First.",
                    text: "Double Click on Map To Restore"
                });
                setTimeout(()=>{
                    Swal.close();
                },3000);
            }

            
        });

        // Attach event listener to each row (Double Click)
        $('.dataTableMainClass tbody').on('dblclick', 'tr', function () {
            if(isViewSpecMarkersLine == false){
                var tr = $(this).closest('tr');
                var row = dataTables.row(tr);
                var mdCode = tr.find('td:eq(8)').text();
                // getSpecSalesmanMarkersLine(mdCode);
                showMakersLine();
                resetOthMarkers();
            } else {
                Swal.fire({
                    title: "Restore Map Markers First.",
                    text: "Double Click on Map To Restore"
                });
                setTimeout(()=>{
                    Swal.close();
                },3000);
            }

            
        });

        // Attach event listener to the search input field
        $('.dt-search input[type="search"]').on('keyup', function() {

            var searchedData = dataTables.search(this.value).draw();
            getTblTotal(searchedData);
        });
    }
}

function showMakersLine(){
    
    // var specMdCode = $('#salesman-code').val();
    var specMdCode = $('#mdCodeHolder').val();

    // getSpecSalesmanMarkersLine(specMdCode, true);
    showOnlySpecificSalesmanMarkers(specMdCode);
    adjustMapView();
    getMarkerLine();
    $('#showmarkersLineBtn').hide();
    $('#hidemarkersLineBtn').show();

    $('#showmarkersLineBtn2').hide();
    $('#hidemarkersLineBtn2').show();

    if(!$('#mainMarkerSW').is(':checked')){
        toggleMainMarkers(map);
        $('#mainMarkerSW').prop('checked', true);
    }
}


function hideMakersLine(){
    if(isShowLine){
        removeAllPolylines();

        $('#hidemarkersLineBtn').hide();
        $('#showmarkersLineBtn').show();

        $('#hidemarkersLineBtn2').hide();
        $('#showmarkersLineBtn2').show();
        isShowLine - false;
    }
    if(!isShowLine && !isShowUnpro && !isShowUnvi){
        removeSpecSalesmanMarkers();
    }
}

function restoreMapMarkersState(){
    Swal.fire({
        html: "Please Wait... Retrieving Map Markers and Selecting Specific Salesman...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    removeSpecSalesmanMarkers();
    removeAllPolylines();

    setTimeout(() => {
        Swal.close();
    }, 3000);
}

function getSpecSalesmanMarkersLine(mdCode, isShowLine){
    markersbckup = markers;
    if(isViewSpecMarkersLine == false){
        for (var i = 0; i < markers.length; i++) {
            try {
                if(markers[i].id != mdCode){
                    markers[i].setMap(null);
                }
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
        isViewSpecMarkersLine = true;
        // markers = markers.filter(marker => marker.id === mdCode).map(marker => ({ lat: (marker.loc).split(" ")[0], lng: (marker.loc).split(" ")[1] }));
        markers = markers.filter(marker => marker.id === mdCode);
        var mainMarkers = markers.filter(marker => marker.markerType == "mainMarker");
        var padding = 20;
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < mainMarkers.length; i++) {
            var point1 = parseFloat((mainMarkers[i].loc).split(" ")[0]); //lat
            var point2 = parseFloat((mainMarkers[i].loc).split(" ")[1]); //lng
            var position = new google.maps.LatLng(point1, point2);
            bounds.extend(position);
        }
        map.fitBounds(bounds, padding);

        // getMarkerDirection(markers);
        // Show Marker Lines or Not?
        if(isShowLine){
            getMarkerLine(mainMarkers);
        }
        
    }
}

// function getMarkerDirection(markers){
//     var markerCtr = markers.length;
//     var reqwaypoints = [];
//     if(markerCtr > 2){
//         reqwaypoints = markers.slice(1,-1).map(marker =>{
//             var reqwaypoints_lat = parseFloat(marker.dataArr.latitude);
//             var reqwaypoints_lng = parseFloat(marker.dataArr.longitude);
//             return({
//                 location: { lat: reqwaypoints_lat, lng: reqwaypoints_lng },
//                 stopover: true
//             });
//         });
//     }
//     console.log(reqwaypoints);
//     var reqlat_origin = parseFloat(markers[0].dataArr.latitude);
//     var reqlng_origin = parseFloat(markers[0].dataArr.longitude);
//     var reqlat_origin1 = parseFloat(markers[11].dataArr.latitude);
//     var reqlng_origin1 = parseFloat(markers[11].dataArr.longitude);
//     var reqlat_dest = parseFloat(markers[markerCtr-1].dataArr.latitude);
//     var reqlng_dest = parseFloat(markers[markerCtr-1].dataArr.longitude);
//     var request = {
//         origin: { lat: reqlat_origin, lng: reqlng_origin }, // Start location
//         destination: { lat: reqlat_dest, lng: reqlng_dest }, // End location
//         waypoints: reqwaypoints,
//         // waypoints: [
//         //     {
//         //         location: { lat: reqlat_origin1, lng: reqlng_origin1 },
//         //         stopover: true
//         //     },
//         // ],
//         travelMode: 'DRIVING', // Can be 'WALKING', 'BICYCLING', etc.
//         //optimizeWaypoints: true // Optional: optimize the route for the most efficient path
//     };

//     directionsService.route(request, function(result, status) {
//         if (status === 'OK') {
//             directionsRenderer.setDirections(result);
//         } else {
//             console.error('Directions request failed due to ' + status);
//         }
//     });
// }

function removeSpecSalesmanMarkers(){
    Swal.fire({
        html: "Please Wait... Retrieving Map Markers...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    markers = markersbckup;
    for (var i = 0; i < markers.length; i++) {
        try {
            markers[i].setMap(map);
        } catch (error) {
            console.error("Error deleting marker:", error);
        }
    }
    
    $('.mainMarker_SWDIV').css({display: "none"});

    setTimeout(() => {
        isViewSpecMarkersLine = false;
        if(date_selected == todaysDate){
            displayAllData.resume();
        };
        restoreLoc();
        Swal.close();
    }, 2000);
}

function getMarkerLine(){
    isShowLine = true;
    var markersToLine = markers.filter(marker => marker.markerType == "mainMarker");

    var path = markersToLine.map(marker => {
        var reqlat = parseFloat(marker.dataArr.latitude);
        var reqlng = parseFloat(marker.dataArr.longitude);
        var strokeColor = marker.dataArr.mdColor ;
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3, 
            strokeColor: strokeColor,
            fillColor: '#000', 
            fillOpacity: 1,
        };

        return({
            lat: reqlat,
            lng: reqlng,
            lineSymbol,
            strokeColor
        })
    });
      
    path.forEach((point, index) => {
        if (index < path.length - 1) {
            var polLine = new google.maps.Polyline({
                path: [path[index], path[index + 1]],
                icons: [
                    {
                        icon: path[index].lineSymbol,
                        offset: '50%'
                    }
                ],
                strokeColor: path[index].strokeColor, 
                strokeOpacity: 0.8, 
                strokeWeight: 4,
                map: map
            });

            polylineArrHolder.push(polLine);
        }
    });
}

function removeAllPolylines() {
    isShowLine = false;
    polylineArrHolder.forEach(polyline => {
        polyline.setMap(null); // Remove polyline from map
    });
    polylineArrHolder.length = 0; // Clear the array
}


function getHeight() {
    var divElement = document.querySelector(".mainOutsideContainer");
    var elemHeight = divElement.offsetHeight;
    allowableHeight = Math.floor((elemHeight - 180) / 31);
}

function getHeight2(){
    var divElement = document.querySelector(".mainOutsideRightContainer");
    var elemHeight = divElement.offsetHeight;
    var mapElem = document.querySelector('.dashboardMapDiv');
    var mapElemHeight = mapElem.offsetHeight;

    // console.log("elemHeight: ",elemHeight, "mapElemHeight: ",mapElemHeight);

    if(!elemHeight > 790){
        NumOfDataTableRows = Math.floor(((elemHeight - mapElemHeight)-130) / 31);
    } else{
        NumOfDataTableRows = 5;
    }
}

function getHeight3(){
    var divElement = document.querySelector("#map");
    var elemHeight = divElement.offsetHeight;
    var fullScreenHeight = Math.floor((((elemHeight / 2) - 100) / 31));

    let dataTable2 = $('#floatTab').DataTable(); 
    dataTable2.page.len(fullScreenHeight).draw();
}

function expandDatatabale(){
    getHeight();
    var left = $('.DashboardLeftContent');
    var right = $('.DashboardRightContent');

    if (!right.hasClass('halfFullWidth')) {
        $('.arrow-side-icon-leftDiv').toggleClass('fa-angle-left fa-angle-right');
        left.show();
        right.removeClass('col-12')
            .addClass('col-xl-8 col-xxl-9')
            .addClass('halfFullWidth');
    }
    if(tableExpanded == false){ 
        // $('.dashboardMapDiv').css({'height': '5%'});
        $(".dashboardMapDiv").hide();
        $('#datePicker').hide();
        $('#dataTableExpandBtn').html('Collapse');
        $('.selectCust, .selectCustHr').hide();
        dataTables.page.len(allowableHeight).draw();
        tableExpanded = true;
        $('.otherActivities ').css('visibility', 'hidden');
    } else{
        // $('.dashboardMapDiv').css({'height': '60vh'});
        $(".dashboardMapDiv").show();
        $('#datePicker').show();
        $('#dataTableExpandBtn').html('Expand');
        $('.selectCust, .selectCustHr').show();
        dataTables.page.len(NumOfDataTableRows).draw();
        tableExpanded = false;
        $('.otherActivities ').css('visibility', 'visible');
    }
}


function getTblTotal(dataTables){
    var filteredData = dataTables.rows({ search: 'applied' }).data();
    var tblTotal = 0;
    var dataTotalCtr = 0;

    filteredData.each(function(row) {
        var amountStr = row.sales;
        let SalesString = amountStr.replace(/₱/g, '');
        let SalesAmt = parseFloat(SalesString.replace(/,/g, ''));
        tblTotal+=SalesAmt;
    });

    tblTotal = tblTotal/2;
    dataTotalCtr = (filteredData.length)/2;

    $('#total').html('Total (' + dataTotalCtr + ') : <span class="fw-bold"> &#8369; ' + tblTotal.toLocaleString() + '</span>');
    $('#outerTableTotal').html('Total ('+dataTotalCtr+') : <span class="fw-bold"> &#8369;' + tblTotal.toLocaleString() + '</span>' );
}


function getAllRowsOfSpecificColumns() {
    var data = table.rows({ search: 'applied' }).data();
    var result = [];
    data.each(function(value, index) {
        result.push({
            name: value[0], // Name column
            position: value[1], // Position column
            // Add more columns as needed
        });
    });
    return result;
}

function setProductDatatables() {
    var isInit = ($('.outerProductTable').hasClass('dataTable'))?true:false;
    // if( !$.fn.DataTable.isDataTable( '.outerProductTable' ) && isInit == false){
        // dataTablesProd = new DataTable('.outerProductTable', {
    if (!DataTable.isDataTable('.outerProductTable') && isInit === false) {
        dataTablesProd = new DataTable('.outerProductTable', {
            lengthChange: true,
            pageLength: 5,
            order: false,    
            responsive: true,
            // bSort: false,
            // scrollY: '200px',
            "language": {
                "search": "",
                "searchPlaceholder": "Search Product..."
            },
            "createdRow": function (row) {
                $('td', row).css({
                    "padding": "5px",
                    'width': 'auto',
                    'text-align': 'center'
                });
    
                $('td', row).attr('width', 'auto');
    
                $('td:first-child', row).css({
                    'text-align': 'left',
                    'padding-left': '50px'
                });

            },
    
            "headerCallback": function (thead) {
                $('th', thead).css({
                    "padding": "5px",
                    'text-align': 'center'
                });
    
                $('th:first-child', thead).css({
                    'text-align': 'left',
                    'padding-left': '150px'
                });
            },
    
            "initComplete": function (settings, json) {   
                $('.dt-search input[type="search"]').css({
                    // 'margin-top': '5px',
                    'margin-right': '15px',
                    'border-radius': '8px',
                    'font-size': '11px',
                    'width': '200px',
                    'color': '#aaa'
                });
            },
        });
    }
}
  
function setStyles() {
    var a = 
        `<div class="d-flex align-items-center">
            <div id="dropDownSalesmanCategory" class="dropdown" style="color: #FFF; margin-left: 5px; padding-top:0px;">
                <button class="btn btn-naiCol btn-xs dropdown-toggle salesmanCatIndi" type="button"
                    data-bs-toggle="dropdown"> ${$('#floatTab tr:first-child th:first-child').text()}
                    <span class="caret"></span></button>
                <ul class="dropdown-menu selectCustDD"></ul>
            </div>
            <div class="dropdown" style="margin: 0 0 0 10px;">
                <span class="mdi mdi-timer-refresh-outline" id="dynamicRefresher" data-bs-toggle="dropdown"><span class="mdi mdi-menu-down"></span></span>
                <ul class="dropdown-menu" id="refreshIntervals">
                    <li class="dropdown-item" data-value="OFF">OFF <span class="mdi "></span></li>
                    <li class="dropdown-item" data-value="1">1 Minute <span class="mdi "></span></li>
                    <li class="dropdown-item" data-value="5">5 Minutes <span class="mdi "></span></li>
                    <li class="dropdown-item" data-value="10">10 Minutes <span class="mdi mdi-check"></span></li>
                    <li class="dropdown-item" data-value="15">15 Minutes <span class="mdi "></span></li>
                    <li class="dropdown-item" data-value="30">30 Minutes <span class="mdi "></span></li>
                    <li class="dropdown-item" data-value="60">60 Minutes <span class="mdi "></span></li>
                </ul>
            </div>
            <span class="intervalValueHolder" style="font-size:10px; margin: 0 0 0 5px;">10 Mins.</span>
        </div>`;
  
    $('.dt-length').html(a);
    loadSalesmanCategory();

    $('#dataTableExpandBtn').remove();
    // $('#outerTab_wrapper .dt-layout-row .dt-search').prepend('<span id="dataTableExpandBtn" onclick="expandDatatabale()">Expand</span>');
    $('#outerTab_wrapper .row .dt-layout-end .dt-search').prepend('<span id="dataTableExpandBtn" onclick="expandDatatabale()">Expand</span>');
  
    $('#floatTab tr:first-child th:nth-child(3)').text("Target");
    $('#floatTab tr:first-child th:nth-child(4)').text("Productive");
    $('#floatTab tr:first-child th:nth-child(5)').text("Unproductive");
    $('#floatTab tr:first-child th:nth-child(6)').text("%");
    $('#floatTab tr:first-child th:nth-child(7)').text("Selling Hrs");
    $('#floatTab tr:first-child th:nth-child(8)').text("Sales");
    

    $('#floatTab tr:first-child th:nth-child(1)').text($('#floatTab tr:first-child th:nth-child(1)').text());
    $('#outerTab tr:first-child th:nth-child(1)').text($('#floatTab tr:first-child th:nth-child(1)').text());

    $('#refreshIntervals li').on('click', function() {
        $('#refreshIntervals li span').removeClass('mdi-check');
        $(this).find('span').addClass('mdi-check');
    
        var value = $(this).data('value');
        if(value == 'OFF'){
            displayAllData.pause();
        } else{
            var intervalValue = value * 60000;
            displayAllData.resume();
            displayAllData.changeInterval(intervalValue);
        }
        $('.intervalValueHolder').html(value+" "+checkVal(value));
    });
}

function checkVal(value){
    var retval;
    if(value == 'OFF'){
        retval="";
    } else if(value > 1){
        retval="Mins.";
    } else{
        retval="Min.";
    }
    return retval;
}
  
function removeDatatables() {
    if (dataTables) {
        dataTables.destroy();
        dataTables = null;
        $("#dashboardDisplay").html('');
        $("#outerTabDashboardDisplay").html('');
    }
}

function removeProductDatatables() {
    if (dataTablesProd) {
        dataTablesProd.destroy();
        dataTablesProd = null;
        $("#outerCateogoryDataTable").html('');
    }
}

function viewPopUpImg(imgElement, indx){
    console.log('viewPopImg',imgElement,indx)
    images = [];

    if(indx == -1){
        const src = imgElement.src;
        console.log(imgElement,src)

        $('.popupStoreImg').css('display', 'block');
        $('#popup_sliderImage').attr('src', src);
        $('.popup_prevBtn').hide();
        $('.popup_nextBtn').hide();
    } else{
        var imglink = 'https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/';
        const src = imgElement.src;
        var custCode = src.match(/\/([A-Z0-9]+)_\d+\.jpg$/i);

        images.push(imglink+custCode[1]+"_1.jpg");
        images.push(imglink+custCode[1]+"_2.jpg");
        
        $('.popupStoreImg').css('display', 'block');
        $('#popup_sliderImage').attr('src', images[indx]);
        $('.popup_prevBtn').show();
        $('.popup_nextBtn').show();
        currentIndex = indx;
    }

}

function closePopUp(){
    $('.popupStoreImg').css('display', 'none');
}

$('.popup_sliderDiv').on('click', function(e) {
    if (e.target === this) {
        closePopUp();
    }
});

function changeSlide(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;

    $('#popup_sliderImage').attr('src', images[currentIndex]);
}

function getTodaysDate(){
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var formattedDate = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');

    todaysDate = formattedDate;
    date_selected = todaysDate;
}

$('.defaultPopUpScreen-owl-carousel').owlCarousel({
    items: 3,
    center: true,
    loop:true,
    margin:5,
    nav:false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },

    }
});

$('.infowindow-owl-carousel').owlCarousel({
    items: 2,
    center: true,
    loop:true,
    margin:5,
    nav:false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },

    }
});

function setDevRemainingDatatables1() {
    var isInit = ($('#deviationRemaingModal .devRemainingTable').hasClass('dataTable'))?true:false;
    // if( !$.fn.DataTable.isDataTable( '#deviationRemaingModal .devRemainingTable' ) && isInit == false){
    //     dataTablesRemaining1 = new DataTable('#deviationRemaingModal .devRemainingTable', {
    if (!DataTable.isDataTable('#deviationRemaingModal .devRemainingTable') && isInit === false) {
        dataTablesRemaining1 = new DataTable('#deviationRemaingModal .devRemainingTable', {
            dom: '<"d-flex justify-content-end"f>rt<"d-flex justify-content-between"ip>',
            pageLength: 10,
            order: false,    
            // responsive: true,
            bSort: true,
            "language": {
                "search": "",
                "searchPlaceholder": "Search Salesman..."
            },
        })
    }
}

function setDevRemainingDatatables2() {
    var isInit = ($('#deviationRemaingModal_OnMap .devRemainingTable').hasClass('dataTable'))?true:false;
    if( !$.fn.DataTable.isDataTable( '#deviationRemaingModal_OnMap .devRemainingTable' ) && isInit == false){
        dataTablesRemaining2 = new DataTable('#deviationRemaingModal_OnMap .devRemainingTable', {
            dom: '<"d-flex justify-content-end"f>rt<"d-flex justify-content-between"ip>',
            pageLength: 5,
            order: false,    
            // responsive: true,
            bSort: true,
            "language": {
                "search": "",
                "searchPlaceholder": "Search Salesman..."
            },
        })
    }
}

$("#mtd-progress-bar").circularProgress({
    height: "50px",
    width: "50px",
    line_width: 5,
    starting_position: 0,
    percent: 0,
    counter_clockwise: false,
});

$("#daily-progress-bar").circularProgress({
    height: "50px",
    width: "50px",
    line_width: 5,
    starting_position: 0,
    percent: 0,
    counter_clockwise: false,
});

function modifyCircularProgressBar(sales, target, prevSales, salesmanCtr, prevSalesmanCtr, barId, salesDiv, targetDiv, prevDiv, salesmanDiv, prevSalesmanDiv, prevPerDiv, prevPerSalesmanDiv){
    var percent = target != 0 ? Math.ceil((sales / target) * 100) : 0;
    var progressColor = (percent >= 100) ? "#24e237" : "#eb4034";

    $(barId).circularProgress({
        color: progressColor,
        height: "50px",
        width: "50px",
        line_width: 5,
        starting_position: 0,
        percent: 0,
        counter_clockwise: false,
    }).circularProgress('animate', percent, 500);

    $(barId+ " .progress-percentage").css('color',progressColor);

    $(salesDiv).html('₱' + (sales).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).css('color',progressColor);
    $(targetDiv).html('₱' + (target).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $(prevDiv).html('₱' + (prevSales).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    $(salesmanDiv).html(salesmanCtr);
    $(prevSalesmanDiv).html(prevSalesmanCtr);

    let percentDiff = prevSales != 0 ? Math.ceil(((sales - prevSales) / prevSales) * 100) : 0;
    let percentDiffColor = percentDiff == 0 ? "" : ( percentDiff > 0 ? "#03F61B" : "#eb4034");
    let percentDiffArrow = percentDiff == 0 ? "" : ( percentDiff > 0 ? "fa-arrow-up" : "fa-arrow-down");
    let percentDiffStr = (percentDiff+"%").replace("-","");

    $(prevPerDiv).html(percentDiffStr+ ' <i class="fa-solid '+percentDiffArrow+'">').css('color', percentDiffColor);

    let percentDiffSalesman = prevSalesmanCtr != 0 ? Math.ceil(((salesmanCtr - prevSalesmanCtr) / prevSalesmanCtr) * 100) : 0;
    let percentDiffColorSalesman = percentDiffSalesman == 0 ? "#FFF" : (percentDiffSalesman > 0 ? "#03F61B" : "#eb4034");
    let percentDiffArrowSalesman = percentDiffSalesman == 0 ? "" : (percentDiffSalesman > 0 ? "fa-arrow-up" : "fa-arrow-down");
    let percentDiffSalesmanStr = (percentDiffSalesman+"%").replace("-","");

    $(prevPerSalesmanDiv).html(percentDiffSalesmanStr+ ' <i class="fa-solid '+percentDiffArrowSalesman+'">').css('color', percentDiffColorSalesman);
}

function getMapOverviewDetails(){
    var useDate;
    if(!date_selected){
        useDate = todaysDate;
    } else if(date_selected){
        useDate = date_selected;
    } else{
        alert("No value for todaysDate... Try Again...");
    }
        var LOCALLINK = "https://fastdevs-api.com";
        var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";
    
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"FETCH_MAP_OVERVIEW_DATA", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "date": date_selected},
            dataType: "json",
            async: false,
            crossDomain: true,
            cache: false,            
            success: function(response){ 
                // console.log(r);
                overview_mtd_percentage = Math.ceil((response.monthlySales / response.monthlyTargetSales) * 100);
                overview_daily_percentage = Math.ceil((response.dailySales/response.dailyTargetSales)*100);

                modifyCircularProgressBar(response.monthlySales, response.monthlyTargetSales, response.prevMonthSales, response.monthlySalesman, response.prevMonthSalesman, "#mtd-progress-bar", '.overview_mtd_total', '.overview_mtd_target', '#mtdPreviousSales', '.overviewSalesmanMonthly', '#mtdPreviousSalesman', '#mtdPreviousPercentage', '#mtdPreviousPercentageSalesman');
                modifyCircularProgressBar(response.dailySales, response.dailyTargetSales, response.prevDaySales, response.dailySalesman, response.prevDaySalesman, "#daily-progress-bar", '.overview_daily_total', '.overview_daily_target', '#dailyPreviousSales', '.overviewSalesmanDaily', '#dailyPreviousSalesman', '#dailyPreviousPercentage', '#dailyPreviousPercentageSalesman');  
                
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
            }
        });
    
}

function fetchUnproMarkers(){
    var mdCode = mdCodeHolder;
    var date = date_selected;

    $.ajax({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "FETCH_MAP_MARKERS_UNPRODUCTIVE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            var othMarkers = [];
            swal.close();
            if(data.length > 0){    
                infoWindow.close(); 
                deleteBounce();
                isShowUnpro = true;
                showOnlySpecificSalesmanMarkers(mdCode);

                data.forEach(function(value, x) {
                    var specUnproMark = othMarkerInfoWindow(value, "unprodMarker");
                    markers.unshift(specUnproMark);
                    othMarkers.push(specUnproMark);
                    google.maps.event.addListener(specUnproMark, 'click', (function(specUnproMark, x) {
                        return function(){
                            lat1 = (data[x].latitude != null)? data[x].latitude : '0.00'; 
                            lon1 = (data[x].longitude != null)? data[x].longitude : '0.00';

                            if(currentInfoWindow){
                                currentInfoWindow.close();
                                isMarkerOpened = true;
                            }
                            deleteBounce();
                            
                            new google.maps.InfoWindow({ maxWidth: 300});
                            infoWindow.setContent(this.content);
                            infoWindow.open(map, specUnproMark);
                            othMarkerDisplayLeft(specUnproMark.dataArr);
                            specUnproMark.setAnimation(google.maps.Animation.BOUNCE);
                        }
                    })(specUnproMark, x));
                });

                adjustMapView();
            } else {
                $('#unprodSW').prop('checked', false);
                Swal.fire({
                    icon: 'info',
                    text: "No unproductive calls recorded for this salesman at this time.",
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
        }
    })
}

function fetchUnvistedMarkers(){
    var mdCode = mdCodeHolder;
    var date = date_selected;

    $.ajax({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "FETCH_MAP_MARKERS_UNVISITED", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            var othMarkers = [];
            swal.close();
            if(data.length > 0){    
                infoWindow.close(); 
                deleteBounce();
                isShowUnvi = true;
                showOnlySpecificSalesmanMarkers(mdCode);

                data.forEach(function(value, x) {
                    var specVisitedMark = othMarkerInfoWindow(value, "unvistedMarker");
                    markers.unshift(specVisitedMark);
                    othMarkers.push(specVisitedMark);
                    google.maps.event.addListener(specVisitedMark, 'click', (function(specVisitedMark, x) {
                        return function(){
                            lat1 = (data[x].latitude != null)? data[x].latitude : '0.00'; 
                            lon1 = (data[x].longitude != null)? data[x].longitude : '0.00';

                            if(currentInfoWindow){
                                currentInfoWindow.close();
                                isMarkerOpened = true;
                            }
                            deleteBounce();
                            
                            new google.maps.InfoWindow({ maxWidth: 300});
                            infoWindow.setContent(this.content);
                            infoWindow.open(map, specVisitedMark);
                            othMarkerDisplayLeft(specVisitedMark.dataArr);
                            specVisitedMark.setAnimation(google.maps.Animation.BOUNCE);
                        }
                    })(specVisitedMark, x));
                });

                adjustMapView();
            } else{
                $('#unvisitedSW').prop('checked', false);
                Swal.fire({
                    icon: 'info',
                    text: "No unvisited calls recorded for this salesman at this time.",
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
        }
    })
}

$('#unprodSW').click(function() {
    if ($(this).is(':checked')) {
        Swal.fire({
            html: "Please Wait... Fetching Unproductive Calls...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        fetchUnproMarkers();
    } else {
        removeUnprodMarkers();
        if(!isShowLine && !isShowUnpro && !isShowUnvi){
            removeSpecSalesmanMarkers();
        }
    }
});

$('#unvisitedSW').click(function() {
    if ($(this).is(':checked')) {
        Swal.fire({
            html: "Please Wait... Fetching Unvisited Calls...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        fetchUnvistedMarkers();
    } else {
        removeUnvisitedMarkers();
        if(!isShowLine && !isShowUnpro && !isShowUnvi){
            removeSpecSalesmanMarkers();
        }
    }
});

$('#mainMarkerSW').on('click', function () {
    var show = $(this).is(':checked');
    var mapTarget = show ? map : null;

    toggleMainMarkers(mapTarget);
    
    if(!show){
        hideMakersLine();
    }
});

function toggleMainMarkers(mapTarget){
    markers.forEach(marker => {
        try {
            if (marker.id === mdCodeHolder && marker.markerType === "mainMarker") {
                marker.setMap(mapTarget);
            }
        } catch (error) {
            console.error("Error updating marker visibility:", error);
        }
    });
}


function othMarkerInfoWindow(data, markerType){
    // var imgstorelink = GLOBALLINKAPI+"/nestle/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
    var imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
    var title, iconSrc, reason, custCode, transactime = '', reasonDiv = '';

    if(markerType == "unprodMarker"){
        title = "Unproductive Store";
        iconSrc = "img/unprodMarker.png";
        reason = (data.Reason == 'OT')? data.remarks : data.Reason;
        custCode = data.custCode;
        transactime = `<div class='mb-2 textdiv'>
                            <span class='titleText'>Transaction ID:</span>
                            <span class='valueText' id='IW_transacID'>${data.transactionID}</span>
                        </div>
                        <div class='row'>
                            <div class='col-6'>
                                <div class='mb-2 textdiv'>
                                    <span class='titleText'>Delivery Date:</span>
                                    <span class='valueText' id='IW_delDate'>${new Date(data.trnDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
                                </div>
                            </div>
                            <div class='col-6'>
                                <div class='mb-2 textdiv'>
                                    <span class='titleText'>Sent Date:</span>
                                    <span class='valueText' id='IW_sentDate'>${new Date(data.sentDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
                                </div>
                            </div>
                        </div>`;
        reasonDiv = `<div class='mb-2 textdiv'>
                        <span class='titleText'>Reason of ${title}:</span>
                        <span class='valueText' id='IW_Reason'>${reason}</span>
                    </div>`;
    } else if(markerType == "unvistedMarker"){
        title = "Unvisited Store";
        iconSrc = "img/unvisitedMarker.png";
        reason = data.reason;
        custCode = data.Customer;
    }
    
    
    var contentStr = `
        <div class='IWMainContainer'>
            <div class='IWMarkerStatus'>
                <img src='${iconSrc}' style='height:12px;' />
                <span class='IWBanner'>${title}</span>
            </div>
            <div class='IWImageBtn'>
                <button onclick='scrollCarousel(-1)'>
                    <i class="fa fa-chevron-left pull-left"></i>
                </button>
                <button class='SyncStoreImgBtn' id='SyncStoreImgBtn-${data.mdCode+"-"+custCode}' onclick='SyncStoreImg("${data.mdCode+"-"+custCode}")'>
                    <span class="mdi mdi-sync"></span> Sync Store Image
                </button>
                <button onclick='scrollCarousel(1)'>
                    <i class="fa fa-chevron-right"></i>
                </button>
            </div>
            <div class='IWImageContainer' id='${data.mdCode+"-"+custCode}'>
                <div class="carousel-track">
                    <img id='storeImg1' class='storeImg' alt='' src='${imglink+custCode+"_1.jpg"}' onError='storeimgError(this)'/>
                    <img id='storeImg2' class='storeImg' alt='' src='${imglink+custCode+"_2.jpg"}' onError='storeimgError(this)'/>
                </div>
                <div class='toggleStoreDiv'>
                    <button onclick='toggleStoreImg("${data.mdCode+"-"+custCode}")'>
                        <i class="fa-solid fa-angle-down"></i>
                    </button>
                </div>
            </div>
            <div class='IWContentHeader'>
                <div class='row'>
                    <div class='col-10 custDetails'>
                        <span class='valueText' id='IW_CustCode'>${custCode}</span>
                        <span class='valueText' id='IW_CustName'>${data.custName}</span>
                        <span class='valueText' id='IW_Address'>${data.address}</span>
                    </div>
                    <div class='col-2'>
                    </div>
                </div>
            </div>
            <div class='IWMarkerDiv'>
                <div class=' '>
                </div>
                <div class=' ' style='padding-left: 18px;'>
                    <div class='d-flex'>
                        <span class='badge rounded-pill arrowStoreBtn' onclick='prevInfo( )' style='cursor: pointer; margin-right:5px; opacity:0'>
                            <span class='fa-solid fa-angles-left' id='prevMD'></span>
                        </span>
                        <span class='badge rounded-pill arrowStoreBtn' onclick='nextInfo( )' style='cursor: pointer; margin-left:5px; opacity:0'>
                            <span id='nextMD' class='fa-solid fa-angles-right' ></span>
                        </span>
                    </div>
                    <img id='IW_marker' src='${iconSrc}' />
                </div>
            </div>
            <div class='d-flex'>
                <div class='IWContentDetail'>
                    <div class='mb-2 textdiv'>
                        <span class='titleText'>Salesman Assigned:</span>
                        <span class='valueText' id='IW_salesman'>${data.mdName + " (" + data.mdCode + ") "}</span>
                    </div>
                    ${transactime}              
                    ${reasonDiv}
                </div>
            </div>
        </div>
    `;

    data.sendDate = data.sentDate;
    var dataLat = (data.latitude != null)? data.latitude : '0.00';
    var dataLng = (data.longitude != null)? data.longitude : '0.00';

    var marker = new google.maps.Marker({
        id: data.mdCode,
        transCount: '---',
        loc: dataLat+' '+dataLng,
        mdName: data.mdName,
        infowindow: infoWindow,
        position: new google.maps.LatLng(dataLat,dataLng),
        map: map,
        content: contentStr,
        markerType: markerType,
        icon: {
            url: iconSrc,
            scaledSize: new google.maps.Size(34, 38)
        },
        dataArr: data,
    });

    return marker;
}

function removeUnprodMarkers(){
    isShowUnpro = false;
    for (var i = 0; i < markers.length; i++) {
        try {
            if(markers[i].markerType == "unprodMarker"){
                markers[i].setMap(null);
            }
        } catch (error) {
            console.error("Error deleting marker:", error);
        }
    }
}

function removeUnvisitedMarkers(){
    isShowUnvi = false;
    for (var i = 0; i < markers.length; i++) {
        try {
            if(markers[i].markerType == "unvistedMarker"){
                markers[i].setMap(null);
            }
        } catch (error) {
            console.error("Error deleting marker:", error);
        }
    }
}

function othMarkerDisplayLeft(dataArr){
    var imgstorelink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
    // var imgstorelink = GLOBALLINKAPI+"/nestle/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
    
    $('#left_Loc').html(dataArr.custName);
    $('#left_LocAddress').html(dataArr.address);
    $('#left_completedDist').html("---");
    $('#left_timeVisited').html((dataArr.trnDate)?(dataArr.trnDate.split(" ")[1]).split(".")[0] : "---");
    $('#left_dateVisited').html((dataArr.trnDate)? moment(dataArr.trnDate).format("MMM DD, YYYY") : "---");
    $('#left_batteryLife').html("");
    checkStoreImg(imgstorelink, dataArr.custCode);
    $('.storeLocBtnPinNumber').html("-");
    $('#left_storeLocTransacNumber').val(-1);
    $("#left_transactionID").val(dataArr.transactionID);
    $('#salesman-code').val(dataArr.mdCode);
    $('#currentLocStoreBtnVal').val(dataArr.latitude +" "+dataArr.longitude);
    $('.storeFootCol p ').html("Sales: <span class='fw-bold'> ₱ 0.00</span><span class='fw-light'> (- SKU)</span>")
}

function resetOthMarkers(){
    $('#unprodSW').prop('checked', false);
    removeUnprodMarkers();
    $('#unvisitedSW').prop('checked', false);
    removeUnvisitedMarkers();
}


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


function showOnlySpecificSalesmanMarkers(mdCode){
    if(isViewSpecMarkersLine == false){
        markersbckup = markers;
        for (var i = 0; i < markers.length; i++) {
            try {
                if(markers[i].id != mdCode){
                    markers[i].setMap(null);
                }
            } catch (error) {
                console.error("Error hiding marker:", error);
            }
        }
        isViewSpecMarkersLine = true;
        markers = markers.filter(marker => marker.id === mdCode);

        $('.mainMarker_SWDIV').css({display: "flex", alignItems: "start"});
        $('#mainMarkerSW').prop('checked', true);
    }
}

function adjustMapView(){
        var padding = 20;
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            var point1 = parseFloat((markers[i].loc).split(" ")[0]); //lat
            var point2 = parseFloat((markers[i].loc).split(" ")[1]); //lng
            var position = new google.maps.LatLng(point1, point2);
            bounds.extend(position);
        }
        map.fitBounds(bounds, padding);
}

function salesmanType(value) {
    if(!value){ return ''}

    const map = {
        "B": "Booking",
        "D": "Driver",
        "T": "Van Sales",
        "X": "Prebooking",
        "Y": "Hybrid"
    };

    if (map[value]) {
        return map[value];
    }

    const entry = Object.entries(map).find(([k, v]) => v.toLowerCase() === value.toLowerCase());
    if (entry) {
        return entry[0];  
    }

    return null; 
}