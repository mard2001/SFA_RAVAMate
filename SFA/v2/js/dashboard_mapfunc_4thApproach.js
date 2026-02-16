// LINKS
const podLink = 'https://fastdevs-api.com/FASTSOSYO/download/image/mybuddyPODImages/';
const markerLink = 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/';
const imglink = 'https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/';
const datatable_imgLink = "https://fastdevs-api.com/FASTSOSYO/download/image/salesmanImages/";
const imgstorelink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/";
// const LOCALLINK = "https://fastdevs-api.com";
// const API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


// Conditional
var isMarkerOpened = false;
var isViewSpecMarkersLine = false;
var isfirstLoadMarkers = true;
var selecterChecker = 2;
var realTimeChecker = 1;
var isFullScreen = false;
var tableExpanded = false;
var bybrandchecker = 0;
var onViewLeftTransacDetails = false;
var displayCategoryDataTable = true;
var isShowLine = false;
var isShowUnpro = false;
var isShowUnvi = false;
var isProductView = false

// Lists
var allTransactionList = [];
var allSalesmanAttendance = [];
var allMarkersList = [];
var allMarkersList_BckUp = [];
var categorizedMarkers = [];
var allSalesmanTableData = [];
var categoryOperationSource = [];
var categorizedSalesmanTableData = [];
var perOpsSource = [];
var polylineArrHolder = [];
var allProdCategoryList = [];
var productMarkers = [];
var productSourceData = [];

// Datatable
var dataTablesSalesmanMain;
var dataTablesSalesmanMap;
var dataTablesOperationMap;
var dataTablesProductMain;
var dataTablesProductMap;

var sitelat;
var sitelng;
var sitezoom;
var lat1 = 0, lon1 = 0;
var infoWindow;
var currentInfoWindow;
var salesBased = 0;
var greatest = 0;
var displayAllData;
var dispCurrentTime;
var date_selected;
var NumOfDataTableRows = 5;
var allowableHeight = 0;
var todaysDate;
var mdCodeHolder;
var images = [];
var currentIndex = 0;
var dateToTextSelected;
var date_today;


$(document).ready(function () {
    siteLocation();
    // getcompname();
    getcompname_dynamic('Dashboard', 'headingTitle');
    DatetimeFunc.getTodaysDate();

    MapFunc.initMap(sitelat, sitelng, sitezoom);

    // SourceDataFunc.createMainList();
    DatetimeFunc.datePickerDashboard();


    $(document).on('click', '.IW2_headerContainer', function (e) {
        if ($(e.target).closest('button').length > 0) {
            return; 
        }

        MapFunc.showInfoWindowHeader();
    });

    displayAllData = new IntervalTimer(function () {
        SourceDataFunc.fetchDataChecker();
        $('#deviationRemaingModal').modal('hide');
        $('#deviationRemaingModal_OnMap').hide();
    }, 5000, 600000);

    dispCurrentTime = new IntervalTimer2(function () {
        DatetimeFunc.DisplayCurrentTime();
        visibleContent(isFullScreen);
    }, 500);  

    DataTablesFunc.initDataTable_mainSalesman();
    DataTablesFunc.setMapOperationDatatable();
    DataTablesFunc.initDataTableMap_categorizedSalesman();
    DataTablesFunc.initDataTable_mainProduct();
    DataTablesFunc.initDataTableMap_product();
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
            // $('#titleHeading').html(r[0].company.toUpperCase() +' | Dashboard');
            $('#headingTitle').html(r[0].company.toUpperCase() +' | Dashboard');
            $('#company_file').val(r[0].company.toUpperCase());
            console.log(r[0].company.toUpperCase());
        }
    });
} 
 

function visibleContent(screenStatus){
    if(screenStatus == true){
        $('.contentFull').show();
        $('#timespentTemp').hide();
    } else{
        $('.contentFull').hide();
        $('#timespentTemp').show();
    }
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

function salesmanTypeIcons(defaultOrd){
    var img;
    switch (defaultOrd) {
        case "B":
            img = "Booking.svg";
            break;
        case "D":
            img = "Logistics.svg";
            break;
        case "T":
            img = "Vansales.svg";
            break;
        case "X":
            img = "Pre-Booking.svg";
            break;
        case "Y":
            img = "Hybrid.svg";
            break;
        default:
            console.log("---");
            break;
    }

    return "<img src='img/"+img+"' style='height:20px; width:20px;' onError='DefaultFunc.defaultStore(this)'>";
}

function getHeight() {
    var divElement = document.querySelector(".mainOutsideContainer");
    var elemHeight = divElement.offsetHeight;
    allowableHeight = Math.floor((elemHeight - 180) / 31);
}

function flip3() {
    // Toggle icon direction
    $('.arrow-side-icon-leftDiv').toggleClass('fa-angle-left fa-angle-right');

    var left = $('.DashboardLeftContent');
    var right = $('.DashboardRightContent');

    if (left.is(':visible')) {
        // Hide left panel and make right panel full width
        left.hide();
        right.removeClass('col-lg-8 col-xl-8 col-xxl-9').addClass('col-12').removeClass('halfFullWidth');
    } else {
        // Show left panel and restore original width
        left.show();
        right.removeClass('col-12').addClass('col-lg-8 col-xl-8 col-xxl-9').addClass('halfFullWidth');
    }
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

function viewPopUpImg(imgElement, indx){
    images = [];

    if(indx == -1){
        const src = imgElement.src;
        console.log(imgElement,src)

        $('.popupStoreImg').css('display', 'block');
        $('#popup_sliderImage').attr('src', src);
        $('.popup_prevBtn').hide();
        $('.popup_nextBtn').hide();
    } else{
        
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

function changeSlide(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;

    $('#popup_sliderImage').attr('src', images[currentIndex]);
}

function closePopUp(){
    $('.popupStoreImg').css('display', 'none');
}

function toggleUnprodMarkers(checked) {
    if (checked) {
        Swal.fire({
            html: "Please Wait... Fetching Unproductive Calls...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        MarkersFunc.fetchUnproMarkers();
    } else {
        MarkersFunc.removeUnprodMarkers();
        if (!isShowLine && !isShowUnpro && !isShowUnvi) {
            MarkersFunc.removeSpecSalesmanMarkers();
        }
    }
}

function toggleUnvisitedMarkers(checked) {
    if (checked) {
        Swal.fire({
            html: "Please Wait... Fetching Unvisited Calls...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        MarkersFunc.fetchUnvistedMarkers();
    } else {
        MarkersFunc.removeUnvisitedMarkers();
        if (!isShowLine && !isShowUnpro && !isShowUnvi) {
            MarkersFunc.removeSpecSalesmanMarkers();
        }
    }
}

function toggleRouteMarkers(checked) {
    if (checked) {
        // Swal.fire({
        //     html: "Please Wait... Fetching Route...",
        //     timerProgressBar: true,
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //         Swal.showLoading();
        //     },
        // });
        MarkersFunc.showMakersLine();
    } else {
        MarkersFunc.restoreMapMarkersState();
    }
}


const Computations = {
    distance:(lat2, lon2, transCount) => {
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
    },

    convertTimeGap: (timegap, transCount) => {
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
}

const MapFunc = {
    map: null,

    initMap(lat = 12.8797, lng = 121.7740, zoom = 7) {
        const myLatlng = new google.maps.LatLng(lat, lng);

        const mapOptions = {
            center: myLatlng,
            zoom: zoom,
            mapTypeId: 'roadmap',
            controlSize: 20,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: true,
            rotateControl: false,
            fullscreenControl: false,
            disableDefaultUI: false,
            drawingControl: false,
            disableDoubleClickZoom: true,
            gestureHandling: "greedy",
            styles: this.getMapStyles()
        };

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        this.createRightControl();
        this.fitToScreen();
        this.mapTopLeftTable();
        this.arrowControl();
        this.salesmanList();
        // this.overviewDivOnMap();

        this.loadSiteLocation();

        infoWindow = new google.maps.InfoWindow({ maxWidth: 500 });

        this.map.addListener('click', function() {
            infoWindow.close(); 
            isMarkerOpened = false;
            
            if(isViewSpecMarkersLine == false && isShowLine == false && isShowUnpro == false && isShowUnvi == false && displayCategoryDataTable == true && isProductView == false){
                MarkersFunc.changeMarkerBounce();
                if(date_selected == moment().format('YYYY-MM-DD')){
                    displayAllData.resume();
                }
            } else{
                MarkersFunc.deleteBounce();
            }
        });

        this.map.addListener('dblclick', function() {
            if(isViewSpecMarkersLine){
                MarkersFunc.hideAllShown();
            }
        });

        document.addEventListener('fullscreenchange', () => { // Listen for any fullscreen exit including pressing ESC
            if (!document.fullscreenElement) {
                $('#dashboardUpperLeftMapDiv').hide();
                $('#mapOverviewMainOuterDiv').hide();
                $('#arrow-side3').show();
            }
        });

        setTimeout(() => {
            $('#fitToScreenBtn').fadeIn();
            $('#defaultmapBtns').fadeIn();
            $('#lateSalesmanCont').fadeIn();
            $('#arrow-side3').fadeIn();
        }, 8000);
    },

    getMapStyles() {
        return [
            { featureType: "landscape.man_made", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.attraction", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.business", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.government", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.medical", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.park", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.place_of_worship", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.school", elementType: "geometry.fill", stylers: [{ visibility: "off" }] },
            { featureType: "poi.school", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "poi.sports_complex", elementType: "geometry.stroke", stylers: [{ visibility: "off" }] },
            { featureType: "poi.sports_complex", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "road.highway", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "transit.line", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "transit.station", elementType: "labels.icon", stylers: [{ visibility: "off" }] },

            /* Grey desaturated theme */
            // { elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
            // { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            // { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
            // { featureType: "road", elementType: "geometry", stylers: [{ color: "#cccccc" }] },
            // { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#b3b3b3" }] },
            // { featureType: "water", elementType: "geometry", stylers: [{ color: "#d6d6d6" }] },
            // { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
            // { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] }
            
            /* Bluish grey theme */
            // { elementType: "geometry", stylers: [{ color: "#f0f0f0" }] },
            // { elementType: "labels.text.fill", stylers: [{ color: "#4d4d4d" }] },
            // { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
            // { featureType: "road", elementType: "geometry", stylers: [{ color: "#d9d9d9" }] },
            // { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#c0c0c0" }] },
            // { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },
            // { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfd8dc" }] },
            // { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#808080" }] },
            // { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e6e6e6" }] },
            // { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#737373" }] },
            // { featureType: "transit", elementType: "geometry", stylers: [{ color: "#dadada" }] },
            // { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#6e6e6e" }] },

            /* A little condensed bluish grey theme */
            // { elementType: "geometry", stylers: [{ color: "#f7f5f2" }] },
            // { elementType: "labels.text.fill", stylers: [{ color: "#5d5d5d" }] },
            // { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
            // { featureType: "road", elementType: "geometry", stylers: [{ color: "#e4dfd9" }] },
            // { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#c9c5c0" }] },
            // { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#6a6a6a" }] },
            // { featureType: "water", elementType: "geometry", stylers: [{ color: "#d8ede9" }] },
            // { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#7b8a86" }] },
            // { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f1ede8" }] },
            // { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#7a726c" }] },
            // { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e6e1db" }] },
            // { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#6d6d6d" }] },

            /* Greyish */
            // { elementType: "geometry", stylers: [{ color: "#f2f2f2" }] },
            // { elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },
            // { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
            // { featureType: "road", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
            // { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#c2c2c2" }] },
            // { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#4d4d4d" }] },
            // { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfd8dc" }] },
            // { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#6b757a" }] },
            // { featureType: "poi", elementType: "geometry", stylers: [{ color: "#ededed" }] },
            // { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#666666" }] },
            // { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e6e6e6" }] },
            // { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },

            /* Green and blue (light) */
            { elementType: "geometry", stylers: [{ color: "#e6f2e6" }] }, // light green land
            { elementType: "labels.text.fill", stylers: [{ color: "#4a4a4a" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#d6e6d6" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#b5cbb5" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#cce0f5" }] }, // soft blue
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#527a99" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e0f0e0" }] }, // slightly greener
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#4f6f4f" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#d9e9e9" }] },
            { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#4a6464" }] },

            /* Green and blue (stronger) */
            // { elementType: "geometry", stylers: [{ color: "#b5d6a7" }] }, // rich leafy green
            // { elementType: "labels.text.fill", stylers: [{ color: "#3c3c3c" }] },
            // { elementType: "labels.text.stroke", stylers: [{ color: "#f0f0f0" }] },
            // { featureType: "road", elementType: "geometry", stylers: [{ color: "#a5c896" }] }, // greenish roads
            // { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#7fa86f" }] },
            // { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#2f2f2f" }] },
            // { featureType: "water", elementType: "geometry", stylers: [{ color: "#5ba4e6" }] }, // stronger blue
            // { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#2e5a8a" }] },
            // { featureType: "poi", elementType: "geometry", stylers: [{ color: "#c2e0b7" }] }, // softer green for parks
            // { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#3b5d3b" }] },
            // { featureType: "transit", elementType: "geometry", stylers: [{ color: "#92c0d9" }] }, // bluish tint
            // { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#365a73" }] },
        ];
    },

    createRightControl() {
        const controlButton = document.getElementById("defaultmapBtns");
        const map = this.map;

        document.getElementById("mdi-earth-maps-btn").addEventListener("click", function () {
            if (map.getMapTypeId() !== google.maps.MapTypeId.HYBRID) {
                map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            } else {
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            }
        });

        document.getElementById("mdi-magnify-plus-outline-btn").addEventListener("click", function () {
            map.setZoom(map.getZoom() + 1);
        });

        document.getElementById("mdi-magnify-minus-outline-btn").addEventListener("click", function () {
            map.setZoom(map.getZoom() - 1);
        });

        document.getElementById("mdi-target-btn").addEventListener("click", () => {
            this.restoreLoc();
        });

        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(controlButton);
    },

    mapTopLeftTable(){
        var topleftTableDiv = document.getElementById('dashboardUpperLeftMapDiv');
        this.map.controls[google.maps.ControlPosition.LEFT].push(topleftTableDiv);
    },

    arrowControl(){
        var customerArrow = document.getElementById('arrow-side3');
        this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(customerArrow);
    },

    salesmanList(){
        var attendanceList = document.getElementById('lateSalesmanCont');
        this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(attendanceList);
    },

    overviewDivOnMap(){
        var overviewMainDiv = document.getElementById('mapOverviewMainOuterDiv');
        this.map.controls[google.maps.ControlPosition.LEFT].push(overviewMainDiv);
    },

    restoreLoc(){
        if(allMarkersList.length > 0){
            isMarkerOpened = false;
            MarkersFunc.changeMarkerBounce();
        }
        this.map.setCenter(new google.maps.LatLng(sitelat, sitelng));
        this.map.setZoom(parseInt(sitezoom));
    },

    fitToScreen() {
        // $('#fitToScreenBtn').show();
        const fts = document.getElementById("fitToScreenBtn");
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(fts);

        document.addEventListener('fullscreenchange', () => {
            (document.fullscreenElement == this.map.getDiv())? $('#fitToScreenBtn').html('Exit Fullscreen') : $('#fitToScreenBtn').html('Fit to Screen');     
        });

        $('#fitToScreenBtn').off('click').on('click', () => {   
            if (!document.fullscreenElement) {
                this.map.getDiv().requestFullscreen();
                isFullScreen = true;

                $('#dashboardUpperLeftMapDiv').fadeIn(250);
                $('#arrow-side3').hide();

                if (isProductView == false) {
                    $('#mapOverviewMainOuterDiv').fadeIn(250);
                    $('.productMapTableDiv').fadeOut(250);

                    if(displayCategoryDataTable){
                        $('.operationMapTableDiv').show();
                        $('.salesmanMapTableDiv').hide();
                    } else {
                        $('.operationMapTableDiv').hide();
                        $('.salesmanMapTableDiv').show();
                    }
                } else {
                    $('.productMapTableDiv').fadeIn(250);
                    $('#mapOverviewMainOuterDiv').hide();
                    $('.operationMapTableDiv').hide();
                    $('.salesmanMapTableDiv').hide();
                }
            } else {
                document.exitFullscreen();
                isFullScreen = false;
                // $('#dashboardUpperLeftMapDiv').hide();
                $('.operationMapTableDiv').hide();
                $('.salesmanMapTableDiv').hide();
                $('.productMapTableDiv').hide();
                $('#mapOverviewMainOuterDiv').hide();
                $('#arrow-side3').show();
            }
        });
    },

    loadSiteLocation(){
        setTimeout(() => {
            if (!isNaN(sitelat) && !isNaN(sitelng)) {
                this.map.setCenter({ lat: parseFloat(sitelat), lng: parseFloat(sitelng) });
            }
            if (!isNaN(sitezoom)) {
                this.map.setZoom(parseInt(sitezoom));
            }
        }, 5000);
    },

    mainMarkerInfoWindow(mdCode, mdColor, customerID, transCount, Salesman, Customer, address, deliveryDate, timeSpent, time, Sales, noSku, latitude, longitude, transactionID, imglink, sendDate, Notation){
        var compDist = Computations.distance( latitude, longitude,transCount);
        var custCode = Customer.split(" ")[0];
        var match = Customer.match(/^[^\s]+\s+(.*?)\s+\[/); 
        var custName = match ? match[1] : Customer.replace(/^\S+\s+/, ''); 
        var match2 = Customer.match(/\[\s*(.*?)\s*\]/);
        var battery = match2 ? match2[1] : null;
        var computedDist = specificComputedDistStr = compDist + " in " + Computations.convertTimeGap(time, transCount);

        var contentVal = `
            <div>
                <div class="IW2_headerContainer">
                    <div class="carousel-track-btn">
                        <div class="carouselHeader">
                            <div class="IW2_custCodeDiv">
                                <span class="IW2_custCode">${custCode}</span>
                            </div>
                            <div class="IW2_custStatusDiv" style="background: #CCFFC9; color: #0FA30F">
                                <span class=""><span class="mdi mdi-clock-outline"></span> Visited Customer</span>
                            </div>
                        </div>
                        <div class="CarouselButtons">
                            <button onclick='MapFunc.scrollCarousel(-1)'>
                                <i class="fa fa-chevron-left pull-left"></i>
                            </button>
                            <button class='SyncStoreImgBtn' id='SyncStoreImgBtn-${mdCode+"-"+customerID}' onclick='DefaultFunc.SyncStoreImg("${mdCode+"-"+customerID}")'>
                                <span class="mdi mdi-sync"></span> Sync Store Image
                            </button>
                            <button onclick='MapFunc.scrollCarousel(1)'>
                                <i class="fa fa-chevron-right"></i>
                            </button>
                        </div>
                        <div class="CarouselFooter d-flex">
                            <div class="IW2_TransNum">
                                <img id='IW2_marker' src='https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/${transCount}/${mdColor.substr(1)}' />
                            </div>
                            <div class="IW2_CustomerDetails flex-grow-1">
                                <span>${custName}</span>
                                <span>${address}</span>
                            </div>
                            <div class="IW2_FooterBtn">
                                <button class="IW2_storeBtn" onclick='MarkersFunc.prevInfo("${mdCode}", ${transCount})'><span class="mdi mdi-chevron-left"></span> Prev Store</button>
                                <button class="IW2_storeBtn" onclick='MarkersFunc.nextInfo("${mdCode}", ${transCount})'>Next Store <span class="mdi mdi-chevron-right"></span></button>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-track">
                        <img id='storeImg1' class='storeImg' alt='' src='${imglink+customerID+"_1.jpg"}' onError='DefaultFunc.storeimgError(this)' style='object-fit:cover;'/>
                        <img id='storeImg2' class='storeImg' alt='' src='${imglink+customerID+"_2.jpg"}' onError='DefaultFunc.storeimgError(this)' style='object-fit:cover;'/>
                    </div>
                </div>
                <div class="IW2_bodyContainer">
                    <ul class="nav IW2_bodyContainer_pills  mb-1" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="pills-transaction-tab" data-bs-toggle="pill" data-bs-target="#pills-transaction" type="button" role="tab" aria-controls="pills-transaction" aria-selected="true">Transaction Details</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-items-tab" data-bs-toggle="pill" data-bs-target="#pills-items" type="button" role="tab" aria-controls="pills-items" aria-selected="false">Item Details</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-pod-tab" data-bs-toggle="pill" data-bs-target="#pills-pod" type="button" role="tab" aria-controls="pills-pod" aria-selected="false">Supporting Docs</button>
                        </li>
                    </ul>
                    <div class="tab-content IW2_bodyContentContainer" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-transaction" role="tabpanel" aria-labelledby="pills-transaction-tab" tabindex="0">
                            <div class='IW2_ContentDetail'>
                                <div class='mb-2 textdiv'>
                                    <span class='titleText'>Salesman Assigned:</span>
                                    <span class='valueText' id='IW_salesman'>${Salesman + " (" + mdCode + ") - " + battery + "%" }</span>
                                </div>  
                                <div class='mb-2 textdiv'>
                                    <span class='titleText'>Transaction ID:</span>
                                    <span class='valueText' id='IW_transacID'>${transactionID}</span>
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
                                <div class='row'>    
                                    <div class='col-6'>  
                                        <div class='mb-2 textdiv'>
                                            <span class='titleText'>Remarks:</span>
                                            <span class='valueText' id='IW_remarks'>${(Notation)? Notation : "---"}</span>
                                        </div>    
                                    </div>    
                                    <div class='col-6'>
                                        <div class='mb-2 textdiv'>
                                            <span class='titleText'>Transaction Sales:</span>
                                            <span class='valueText' id='IW_sales'>
                                                &#8369 ${Sales} (${noSku} SKU)
                                            </span>
                                        </div>
                                    </div>   
                                </div>  
                            </div>
                        </div>
                        <div class="tab-pane fade" id="pills-pod" role="tabpanel" aria-labelledby="pills-pod-tab" tabindex="0">
                            <div class="row g-2">
                                <div class="col-6">
                                    <button id='IW_PODBtn' onclick='getPOD()' style="display: none;">Refresh Proof of Delivery</button>
                                    <div class="image-wrapper">
                                        <a href='${podLink + transactionID + ".jpg"}' target='_blank' onclick="$('#dashboardUpperLeftMapDiv').hide(); $('#mapOverviewMainOuterDiv').hide(); $('#arrow-side3').show();">
                                            <img src='${podLink+transactionID+".jpg"}' onError='DefaultFunc.defaultStore(this)' />
                                        </a>
                                        <div class="overlay">
                                            <i class="fa-solid fa-maximize"></i> Click to View Full Size
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 IW2_ContentDetail">
                                        <div class='mb-2 textdiv'>
                                            <span class='titleText'>Reference Number:</span>
                                            <span class='valueText' id='IW2_ReferenceNum'>${(transactionID)?transactionID : "---"}</span>
                                        </div>
                                        <div class='mb-2 textdiv'>
                                            <span class='titleText'>Remarks:</span>
                                            <span class='valueText' id='IW2_Remarks'>${(Notation)? Notation : "---"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="pills-items" role="tabpanel" aria-labelledby="pills-items-tab" tabindex="0">
                            <div class="item_mainDiv">
                                <div class="item_headerDiv" id="skuHolder" onclick="MarkersFunc.getTransaction2()">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <img src="img/PesoSign.svg" height="20" width="20" />
                                        </div>
                                        <div>
                                            <p>Transaction Items</p>
                                        </div>
                                        <div class="ms-auto d-flex">
                                            <p>&#8369 ${Sales} (${noSku} SKU)</p>
                                            <span class="mdi mdi-menu-down-outline"></span>
                                        </div>
                                    </div>
                                </div>
                                <div id='transaction-details-holder'>
                                    <span style="margin-top:5px; font-size:9px">
                                        <span class="mdi mdi-arrow-up-left"></span> 
                                        Click to view items
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return contentVal;
    },

    mainSpecificMarker(data, contentString){
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
            map: MapFunc.map,
            content: contentString,
            markerType: "mainMarker",
            icon: {
                url: markerLink+data.transCount+'/'+data.mdColor.substr(1),
                scaledSize: new google.maps.Size(32, 36)
            },
            dataArr: data,
        });

        return marker;
    },

    scrollCarousel(direction) {
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
    },

    showInfoWindowHeader(){
        ($('.carouselHeader').hasClass('hiddenOpacity'))? $('.carouselHeader, .CarouselFooter').removeClass('hiddenOpacity') : $('.carouselHeader, .CarouselFooter').addClass('hiddenOpacity');
    },

    showSalesmanOnMap(mdCode) {
        var salesmanCode = mdCode;
        if(currentInfoWindow){
            currentInfoWindow.close();
            isMarkerOpened = true;
        }
        MarkersFunc.deleteBounce();
        allMarkersList[allMarkersList.length - 1].setAnimation(null);

        for (var x = 0; x < allMarkersList.length; x++) {
            if (salesmanCode == allMarkersList[x].id && allMarkersList[x].transCount == "1") {
                displayAllData.pause();
        
                if(tableExpanded == false){
                    allMarkersList[x].setAnimation(google.maps.Animation.BOUNCE);
                    MapFunc.map.setCenter(allMarkersList[x].getPosition());
                    MapFunc.map.setZoom(13);
                    infoWindow.close();
                    infoWindow.setContent(allMarkersList[x].content);
                    infoWindow.open(MapFunc.map, allMarkersList[x]);
                }
                LeftDataFunc.marker_leftDetails(allMarkersList[x].dataArr);
            }
        }
    },

    showCurrentOnMap(){
        var latLng = $("#currentLocStoreBtnVal").val();

        for(var x = 0; x < allMarkersList.length; x++){
            if(latLng == allMarkersList[x].loc){
                if(currentInfoWindow){
                    currentInfoWindow.close();
                    isMarkerOpened = true;
                }
                allMarkersList[x].setAnimation(null);
                allMarkersList[x].setAnimation(google.maps.Animation.BOUNCE);
                MapFunc.map.setCenter(allMarkersList[x].getPosition());
                MapFunc.map.setZoom(18);
                infoWindow.close();
                infoWindow.setContent(allMarkersList[x].content);
                infoWindow.open(MapFunc.map, allMarkersList[x]);
                marker_leftDetails(allMarkersList[x].dataArr);
            }
        }
    },

    adjustMapView(){
        var padding = 20;
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < allMarkersList.length; i++) {
            var point1 = parseFloat((allMarkersList[i].loc).split(" ")[0]); //lat
            var point2 = parseFloat((allMarkersList[i].loc).split(" ")[1]); //lng
            var position = new google.maps.LatLng(point1, point2);
            bounds.extend(position);
        }
        MapFunc.map.fitBounds(bounds, padding);
    },
    
    refreshMapManually(){
        $(".manualRefresh").prop("disabled", true);
        $(".manualRefresh").html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');
        SourceDataFunc.fetchDataChecker()
    }
};

const OverviewFunc = {
    getMapOverviewDetails(){
        var useDate;
        if(!date_selected){
            useDate = todaysDate;
        } else if(date_selected){
            useDate = date_selected;
        } else{
            alert("No value for todaysDate... Try Again...");
        }

        $.ajax ({
            url: LOCALLINK + API_ENDPOINT,
            type: "GET",
            data: {"type":"FETCH_MAP_OVERVIEW_DATA", "CONN":con_info, "date": date_selected},
            dataType: "json",
            // async: false,
            crossDomain: true,
            cache: false,            
            success: function(response){ 
                // console.log(r);
                overview_mtd_percentage = Math.ceil((response.monthlySales / response.monthlyTargetSales) * 100);
                overview_daily_percentage = Math.ceil((response.dailySales/response.dailyTargetSales)*100);

                OverviewFunc.modifyCircularProgressBar(response.monthlySales, response.monthlyTargetSales, response.prevMonthSales, response.monthlySalesman, response.prevMonthSalesman, "#mtd-progress-bar", '.overview_mtd_total', '.overview_mtd_target', '#mtdPreviousSales', '.overviewSalesmanMonthly', '#mtdPreviousSalesman', '#mtdPreviousPercentage', '#mtdPreviousPercentageSalesman');
                OverviewFunc.modifyCircularProgressBar(response.dailySales, response.dailyTargetSales, response.prevDaySales, response.dailySalesman, response.prevDaySalesman, "#daily-progress-bar", '.overview_daily_total', '.overview_daily_target', '#dailyPreviousSales', '.overviewSalesmanDaily', '#dailyPreviousSalesman', '#dailyPreviousPercentage', '#dailyPreviousPercentageSalesman');  
                
            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
            }
        });
    },

    modifyCircularProgressBar(sales, target, prevSales, salesmanCtr, prevSalesmanCtr, barId, salesDiv, targetDiv, prevDiv, salesmanDiv, prevSalesmanDiv, prevPerDiv, prevPerSalesmanDiv){
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
}

const MarkersFunc = {
    deleteMarkers(){
        for (var i = 0; i < allMarkersList.length; i++) {
            try {
                allMarkersList[i].setMap(null);
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
        allMarkersList = [];
    },

    deleteBounce(){
        for (var i = 0; i < allMarkersList.length; i++) {
            allMarkersList[i].setAnimation(null);
        }
    },

    changeMarkerBounce(){
        this.deleteBounce();
        if(allMarkersList.length > 0){
            this.getLatestMarker();
        }
    },

    getLatestMarker(){
        if(currentInfoWindow){
            currentInfoWindow.close();
        }

        // Sorting to get the Latest Marker
        for (var i = 0; i < allMarkersList.length; i++) {
            allMarkersList[i].setAnimation(null);
        }

        allMarkersList.sort(function(a,b){
            return new Date(a.dataArr.deliveryDate) - new Date(b.dataArr.deliveryDate);
        });
        var lastMarker = allMarkersList[allMarkersList.length - 1];
        var lastMarkerIndex = allMarkersList.length - 1;
        // var sendDate = (lastMarker.dataArr.sendDate)? (new Date(lastMarker.dataArr.sendDate)).toISOString() : (new Date(lastMarker.dataArr.deliveryDate)).toISOString();
        var sendDate = lastMarker.dataArr.hasOwnProperty('sendDate') ? (new Date(lastMarker.dataArr.sendDate)).toISOString() : (new Date(lastMarker.dataArr.deliveryDate)).toISOString();
        var customer = lastMarker.dataArr.Customer;
        var storename = customer.substring(customer.indexOf(" ") + 1, customer.indexOf("[")).trim();

        var infoWindowContent2 = `<div onclick='MarkersFunc.clickLatest(${lastMarkerIndex})' id='latestMarkerInfoWindow'>
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

        var infoWindowContent = `<div onclick='MarkersFunc.clickLatest(${lastMarkerIndex})' id='latestMarkerInfoWindow'>
                                    <div class="latestIW2_header">
                                        <div class="d-flex ">
                                            <span class="mdi mdi-map-marker-outline"></span>
                                            <div class="">
                                                <span>Latest Transaction</span>
                                                <div class="timeDiv">
                                                    <span>added </span>
                                                    <time class="timeago" datetime="${sendDate}"></time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="latestIW2_body">
                                        <div class='latestIW2ContentTitle'>
                                            <span class="custNameText">${storename}</span>
                                            <span class="custAddressText">${ lastMarker.dataArr.address}</span>
                                        </div>
                                        <div class='latestIW2ContentDetail'>
                                            <div class='mb-0 textdiv'>
                                                <span class='titleText'>Salesman Assigned:</span>
                                                <span class='valueText' id='IW_salesman'>${ lastMarker.dataArr.Salesman }</span>
                                            </div>
                                            <div class='mb-2 textdiv'>
                                                <span class='titleText'>Transaction Sales:</span>
                                                <span class='valueText' id='IW_salesman'>₱ ${lastMarker.dataArr.Sales} (${lastMarker.dataArr.noSku} SKU)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

        // Open the info window on the last marker
        infoWindow.close();
        if(isMarkerOpened == false){
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(MapFunc.map, lastMarker);
            currentInfoWindow = infoWindow;
        }

        // Initialize timeago after info window is opened
        setTimeout(function() {
            jQuery(".timeago").timeago();
        }, 0);
    },
    
    clickLatest(lastMarkerIndex){
        displayAllData.pause();

        if(currentInfoWindow){
            currentInfoWindow.close();
            isMarkerOpened = true;
        }
        this.deleteBounce();
        allMarkersList[allMarkersList.length - 1].setAnimation(null);
        allMarkersList[lastMarkerIndex].setAnimation(google.maps.Animation.BOUNCE);
        MapFunc.map.setCenter(allMarkersList[lastMarkerIndex].getPosition());
        MapFunc.map.setZoom(18);
        infoWindow.close();
        infoWindow.setContent(allMarkersList[lastMarkerIndex].content);
        infoWindow.open(MapFunc.map, allMarkersList[lastMarkerIndex]);
        LeftDataFunc.marker_leftDetails(allMarkersList[lastMarkerIndex].dataArr);
    },

    prevInfo(mdCode, transCount){
        var newPreview = parseInt(transCount) - 1; 
        this.deleteBounce();
        allMarkersList[allMarkersList.length - 1].setAnimation(null);
        if(transCount == "1"){
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "No previous transaction!"
            });
        }else{
            for(var x=0; x<allMarkersList.length; x++){
                if(allMarkersList[x].dataArr.mdCode == mdCode && allMarkersList[x].dataArr.transCount == newPreview){
                    infoWindow.close();
                    infoWindow.setContent(allMarkersList[x].content);
                    infoWindow.open(map, allMarkersList[x]);
                    allMarkersList[x].setAnimation(google.maps.Animation.BOUNCE);
                    LeftDataFunc.marker_leftDetails(allMarkersList[x].dataArr);
                }
            }
            if(onViewLeftTransacDetails){
                LeftDataFunc.getTransactionDisplayLeft();
            }        
        }
    },

    prevInfoLeft(){
        var transCount = $('#left_storeLocTransacNumber').val();
        var mdCode = $('#hiddenInput_mdCode').val();

        var newPreview = parseInt(transCount) - 1; 
        this.deleteBounce();
        allMarkersList[allMarkersList.length - 1].setAnimation(null);
        if(transCount == "1"){
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "No previous transaction!"
            });
        }else{
            for(var x=0; x<allMarkersList.length; x++){
                if(allMarkersList[x].dataArr.mdCode == mdCode && allMarkersList[x].dataArr.transCount == newPreview){
                    if(!tableExpanded){
                        infoWindow.close();
                        infoWindow.setContent(allMarkersList[x].content);
                        infoWindow.open(MapFunc.map, allMarkersList[x]);
                        allMarkersList[x].setAnimation(google.maps.Animation.BOUNCE);
                    }
                    LeftDataFunc.marker_leftDetails(allMarkersList[x].dataArr);
                }
            }
            if(onViewLeftTransacDetails){
                LeftDataFunc.getTransactionDisplayLeft()
            }        
        }
    },

    nextInfo(mdCode, transCount){
        var newNext = transCount + 1; 

        this.deleteBounce();
        allMarkersList[allMarkersList.length - 1].setAnimation(null);
        for(var x=0; x<allMarkersList.length; x++){
            if(allMarkersList[x].dataArr.mdCode == mdCode && allMarkersList[x].dataArr.transCount == newNext){
                infoWindow.close();
                infoWindow.setContent(allMarkersList[x].content);
                infoWindow.open(map, allMarkersList[x]);
                allMarkersList[x].setAnimation(google.maps.Animation.BOUNCE);
                LeftDataFunc.marker_leftDetails(allMarkersList[x].dataArr);
            }
        }
        if(onViewLeftTransacDetails){
            LeftDataFunc.getTransactionDisplayLeft();
        }
    },

    nextInfoLeft(){
        var transCount = $('#left_storeLocTransacNumber').val();
        var mdCode = $('#hiddenInput_mdCode').val();

        var newNext = parseInt(transCount) + 1; 
        this.deleteBounce();
        allMarkersList[allMarkersList.length - 1].setAnimation(null);
        for(var x=0; x<allMarkersList.length; x++){
            if(allMarkersList[x].dataArr.mdCode == mdCode && allMarkersList[x].dataArr.transCount == newNext){
                if(!tableExpanded){
                    infoWindow.close();
                    infoWindow.setContent(allMarkersList[x].content);
                    infoWindow.open(MapFunc.map, allMarkersList[x]);
                    allMarkersList[x].setAnimation(google.maps.Animation.BOUNCE);
                }
                LeftDataFunc.marker_leftDetails(allMarkersList[x].dataArr);
            }
        }
        if(onViewLeftTransacDetails){
            LeftDataFunc.getTransactionDisplayLeft();
        }
    },

    categorizeDisplayMarkers(selectedType){
        var selType = salesmanType(selectedType);
        // allMarkersList = allMarkersList_BckUp;
        // allMarkersList_BckUp = allMarkersList;
        
        for (var i = 0; i < allMarkersList.length; i++) {
            try {
                if(allMarkersList[i].dataArr.DefaultORDType == selType){
                    allMarkersList[i].setMap(MapFunc.map);
                } else {
                    allMarkersList[i].setMap(null);  
                }
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
    },
    
    showAllMarkers(){
        for (var i = 0; i < allMarkersList.length; i++) {
            try {
                allMarkersList[i].setMap(MapFunc.map);
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
    },

    showOnlySpecificSalesmanMarkers(mdCode){
        if(isViewSpecMarkersLine == false){
            allMarkersList_BckUp = allMarkersList;
            for (var i = 0; i < allMarkersList.length; i++) {
                try {
                    if(allMarkersList[i].id != mdCode){
                        allMarkersList[i].setMap(null);
                    }
                } catch (error) {
                    console.error("Error hiding marker:", error);
                }
            }
            isViewSpecMarkersLine = true;
            allMarkersList = allMarkersList.filter(marker => marker.id === mdCode);

            // $('.mainMarker_SWDIV').css({display: "flex", alignItems: "start"});
            // $('#mainMarkerSW').prop('checked', true);
        }
    },

    fetchUnproMarkers(){
        var mdCode = mdCodeHolder;
        var date = date_selected;

        $.ajax({
            url: LOCALLINK + API_ENDPOINT,
            type: "GET",
            data: { "type": "FETCH_MAP_MARKERS_UNPRODUCTIVE", "CONN": con_info, "mdCode": mdCode, "date": date },
            dataType: "JSON",
            crossDomain: true,
            cache: false,
            success: function(data){
                var othMarkers = [];
                Swal.close();

                if(data.length > 0){    
                    infoWindow.close(); 
                    MarkersFunc.deleteBounce();
                    isShowUnpro = true;
                    MarkersFunc.showOnlySpecificSalesmanMarkers(mdCode);

                    data.forEach(function(value, x) {
                        var specUnproMark = MarkersFunc.othMarkerInfoWindow(value, "unprodMarker");
                        allMarkersList.unshift(specUnproMark);
                        othMarkers.push(specUnproMark);
                        google.maps.event.addListener(specUnproMark, 'click', (function(specUnproMark, x) {
                            return function(){
                                lat1 = (data[x].latitude != null)? data[x].latitude : '0.00'; 
                                lon1 = (data[x].longitude != null)? data[x].longitude : '0.00';

                                if(currentInfoWindow){
                                    currentInfoWindow.close();
                                    isMarkerOpened = true;
                                }
                                MarkersFunc.deleteBounce();
                                
                                new google.maps.InfoWindow({ maxWidth: 300});
                                infoWindow.setContent(this.content);
                                infoWindow.open(MapFunc.map, specUnproMark);
                                console.log(specUnproMark.dataArr)
                                LeftDataFunc.othMarker_leftDetails(specUnproMark.dataArr);
                                specUnproMark.setAnimation(google.maps.Animation.BOUNCE);
                            }
                        })(specUnproMark, x));
                    });

                    MapFunc.adjustMapView();
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
    },

    fetchUnvistedMarkers(){
        var mdCode = mdCodeHolder;
        var date = date_selected;

        $.ajax({
            url: LOCALLINK + API_ENDPOINT,
            type: "GET",
            data: { "type": "FETCH_MAP_MARKERS_UNVISITED", "CONN": con_info, "mdCode": mdCode, "date": date },
            dataType: "JSON",
            crossDomain: true,
            cache: false,
            success: function(data){
                var othMarkers = [];
                Swal.close();

                if(data.length > 0){    
                    infoWindow.close(); 
                    MarkersFunc.deleteBounce();
                    isShowUnvi = true;
                    MarkersFunc.showOnlySpecificSalesmanMarkers(mdCode);

                    data.forEach(function(value, x) {
                        var specVisitedMark = MarkersFunc.othMarkerInfoWindow(value, "unvistedMarker");
                        allMarkersList.unshift(specVisitedMark);
                        othMarkers.push(specVisitedMark);
                        google.maps.event.addListener(specVisitedMark, 'click', (function(specVisitedMark, x) {
                            return function(){
                                lat1 = (data[x].latitude != null)? data[x].latitude : '0.00'; 
                                lon1 = (data[x].longitude != null)? data[x].longitude : '0.00';

                                if(currentInfoWindow){
                                    currentInfoWindow.close();
                                    isMarkerOpened = true;
                                }
                                MarkersFunc.deleteBounce();
                                
                                new google.maps.InfoWindow({ maxWidth: 300});
                                infoWindow.setContent(this.content);
                                infoWindow.open(map, specVisitedMark);
                                console.log(specVisitedMark.dataArr);
                                LeftDataFunc.othMarker_leftDetails(specVisitedMark.dataArr);
                                specVisitedMark.setAnimation(google.maps.Animation.BOUNCE);
                            }
                        })(specVisitedMark, x));
                    });

                    MapFunc.adjustMapView();
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
    },

    othMarkerInfoWindow(data, markerType){
        var title, iconSrc, reason, custCode, transactime = '', reasonDiv = '', bgColor = '', textColor = '';

        if(markerType == "unprodMarker"){
            title = "Unproductive Customer";
            iconSrc = "img/unprodMarker.png";
            bgColor = '#FFC9C9';
            textColor = '#A30F0F';
            reason = (data.Reason == 'OT')? data.remarks : data.Reason;
            custCode = data.custCode;
            // transactime2 = `<div class='mb-2 textdiv'>
            //                     <span class='titleText'>Transaction ID:</span>
            //                     <span class='valueText' id='IW_transacID'>${data.transactionID}</span>
            //                 </div>
            //                 <div class='row'>
            //                     <div class='col-6'>
            //                         <div class='mb-2 textdiv'>
            //                             <span class='titleText'>Delivery Date:</span>
            //                             <span class='valueText' id='IW_delDate'>${new Date(data.trnDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
            //                         </div>
            //                     </div>
            //                     <div class='col-6'>
            //                         <div class='mb-2 textdiv'>
            //                             <span class='titleText'>Sent Date:</span>
            //                             <span class='valueText' id='IW_sentDate'>${new Date(data.sentDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
            //                         </div>
            //                     </div>
            //                 </div>`;
            transactime =`<div class='mb-2 textdiv'>
                            <span class='titleText'>Transaction ID:</span>
                            <span class='valueText' id='IW_transacID'>${data.transactionID}</span>
                        </div>
                        <div class='row'>
                            <div class='col-6'>
                                <div class='mb-2 textdiv'>
                                    <span class='titleText'>Delivery Date:</span>
                                    <span class='valueText' id='IW_delDate'>${new Date(data.trnDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
                                </div>
                            </div>
                            <div class='col-6'>
                                <div class='mb-2 textdiv'>
                                    <span class='titleText'>Sent Date:</span>
                                    <span class='valueText' id='IW_sentDate'>${new Date(data.sentDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  })}</span>
                                </div>
                            </div>
                        </div>`;
            reasonDiv = `<div class='mb-2 textdiv'>
                            <span class='titleText'>Reason of ${title}:</span>
                            <span class='valueText' id='IW_Reason'>${reason}</span>
                        </div>`;
        } else if(markerType == "unvistedMarker"){
            title = "Unvisited Customer";
            iconSrc = "img/unvisitedMarker.png";
            bgColor = '#CACACA';
            textColor = '#4A4A4A';
            reason = data.reason;
            custCode = data.Customer;
        }
        
        
        // var contentStr = `
        //     <div class='IWMainContainer'>
        //         <div class='IWMarkerStatus'>
        //             <img src='${iconSrc}' style='height:12px;' />
        //             <span class='IWBanner'>${title}</span>
        //         </div>
        //         <div class='IWImageBtn'>
        //             <button onclick='scrollCarousel(-1)'>
        //                 <i class="fa fa-chevron-left pull-left"></i>
        //             </button>
        //             <button class='SyncStoreImgBtn' id='SyncStoreImgBtn-${data.mdCode+"-"+custCode}' onclick='SyncStoreImg("${data.mdCode+"-"+custCode}")'>
        //                 <span class="mdi mdi-sync"></span> Sync Store Image
        //             </button>
        //             <button onclick='scrollCarousel(1)'>
        //                 <i class="fa fa-chevron-right"></i>
        //             </button>
        //         </div>
        //         <div class='IWImageContainer' id='${data.mdCode+"-"+custCode}'>
        //             <div class="carousel-track">
        //                 <img id='storeImg1' class='storeImg' alt='' src='${imgstorelink+custCode+"_1.jpg"}' onError='storeimgError(this)'/>
        //                 <img id='storeImg2' class='storeImg' alt='' src='${imgstorelink+custCode+"_2.jpg"}' onError='storeimgError(this)'/>
        //             </div>
        //             <div class='toggleStoreDiv'>
        //                 <button onclick='toggleStoreImg("${data.mdCode+"-"+custCode}")'>
        //                     <i class="fa-solid fa-angle-down"></i>
        //                 </button>
        //             </div>
        //         </div>
        //         <div class='IWContentHeader'>
        //             <div class='row'>
        //                 <div class='col-10 custDetails'>
        //                     <span class='valueText' id='IW_CustCode'>${custCode}</span>
        //                     <span class='valueText' id='IW_CustName'>${data.custName}</span>
        //                     <span class='valueText' id='IW_Address'>${data.address}</span>
        //                 </div>
        //                 <div class='col-2'>
        //                 </div>
        //             </div>
        //         </div>
        //         <div class='IWMarkerDiv'>
        //             <div class=' '>
        //             </div>
        //             <div class=' ' style='padding-left: 18px;'>
        //                 <div class='d-flex'>
        //                     <span class='badge rounded-pill arrowStoreBtn' onclick='prevInfo( )' style='cursor: pointer; margin-right:5px; opacity:0'>
        //                         <span class='fa-solid fa-angles-left' id='prevMD'></span>
        //                     </span>
        //                     <span class='badge rounded-pill arrowStoreBtn' onclick='nextInfo( )' style='cursor: pointer; margin-left:5px; opacity:0'>
        //                         <span id='nextMD' class='fa-solid fa-angles-right' ></span>
        //                     </span>
        //                 </div>
        //                 <img id='IW_marker' src='${iconSrc}' />
        //             </div>
        //         </div>
        //         <div class='d-flex'>
        //             <div class='IWContentDetail'>
        //                 <div class='mb-2 textdiv'>
        //                     <span class='titleText'>Salesman Assigned:</span>
        //                     <span class='valueText' id='IW_salesman'>${data.mdName + " (" + data.mdCode + ") "}</span>
        //                 </div>
        //                 ${transactime}              
        //                 ${reasonDiv}
        //             </div>
        //         </div>
        //     </div>
        // `;

        var contentVal = `
            <div style="min-width:300px">
                <div class="IW2_headerContainer">
                    <div class="carousel-track-btn">
                        <div class="carouselHeader">
                            <div class="IW2_custCodeDiv">
                                <span class="IW2_custCode"> ${custCode}</span>
                            </div>
                            <div class="IW2_custStatusDiv" style="background: ${bgColor}; color: ${textColor}">
                                <span class=""><span class="mdi mdi-clock-outline"></span>${title}</span>
                            </div>
                        </div>
                        <div class="CarouselButtons">
                            <button onclick='MapFunc.scrollCarousel(-1)'>
                                <i class="fa fa-chevron-left pull-left"></i>
                            </button>
                            <button class='SyncStoreImgBtn' id='SyncStoreImgBtn-${data.mdCode+"-"+custCode}' onclick='DefaultFunc.SyncStoreImg("${data.mdCode+"-"+custCode}")'>
                                <span class="mdi mdi-sync"></span> Sync Store Image
                            </button>
                            <button onclick='MapFunc.scrollCarousel(1)'>
                                <i class="fa fa-chevron-right"></i>
                            </button>
                        </div>
                        <div class="CarouselFooter d-flex">
                            <div class="IW2_TransNum">
                                <img id='IW2_marker' src='${iconSrc}' />
                            </div>
                            <div class="IW2_CustomerDetails flex-grow-1">
                                <span>${custCode} ${data.custName}</span>
                                <span>${data.address}</span>
                            </div>
                            <div class="IW2_FooterBtn" style="display:none;">
                                <button class="IW2_storeBtn" onclick='MarkersFunc.prevInfo("", "")'><span class="mdi mdi-chevron-left"></span> Prev Store</button>
                                <button class="IW2_storeBtn" onclick='MarkersFunc.nextInfo("", "")'>Next Store <span class="mdi mdi-chevron-right"></span></button>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-track">
                        <img id='storeImg1' class='storeImg' alt='' src='${imgstorelink+custCode+"_1.jpg"}' onError='DefaultFunc.storeimgError(this)' style='object-fit:cover;'/>
                        <img id='storeImg2' class='storeImg' alt='' src='${imgstorelink+custCode+"_2.jpg"}' onError='DefaultFunc.storeimgError(this)' style='object-fit:cover;'/>
                    </div>
                </div>
                <div class="IW2_bodyContainer">
                    <ul class="nav IW2_bodyContainer_pills  mb-1" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="pills-transaction-tab" data-bs-toggle="pill" data-bs-target="#pills-transaction" type="button" role="tab" aria-controls="pills-transaction" aria-selected="true">Transaction Details</button>
                        </li>
                    </ul>
                    <div class="tab-content IW2_bodyContentContainer" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-transaction" role="tabpanel" aria-labelledby="pills-transaction-tab" tabindex="0">
                            <div class='IW2_ContentDetail'>
                                <div class='mb-2 textdiv'>
                                    <span class='titleText'>Salesman Assigned:</span>
                                    <span class='valueText' id='IW_salesman'>${data.mdName + " (" + data.mdCode + ") "}</span>
                                </div>  
                                ${transactime}
                                ${reasonDiv}
                            </div>
                        </div>
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
            map: MapFunc.map,
            content: contentVal,
            markerType: markerType,
            icon: {
                url: iconSrc,
                scaledSize: new google.maps.Size(34, 38)
            },
            dataArr: data,
        });

        return marker;
    },

    removeUnprodMarkers(){
        isShowUnpro = false;
        for (var i = 0; i < allMarkersList.length; i++) {
            try {
                if(allMarkersList[i].markerType == "unprodMarker"){
                    allMarkersList[i].setMap(null);
                }
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
    },

    removeUnvisitedMarkers(){
        isShowUnvi = false;
        for (var i = 0; i < allMarkersList.length; i++) {
            try {
                if(allMarkersList[i].markerType == "unvistedMarker"){
                    allMarkersList[i].setMap(null);
                }
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
    },

    removeSpecSalesmanMarkers(){
        Swal.fire({
            html: "Please Wait... Retrieving Map Markers...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        allMarkersList = allMarkersList_BckUp;
        for (var i = 0; i < allMarkersList.length; i++) {
            try {
                allMarkersList[i].setMap(MapFunc.map);
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
        
        // $('.mainMarker_SWDIV').css({display: "none"});

        setTimeout(() => {
            isViewSpecMarkersLine = false;
            if(date_selected == todaysDate){
                displayAllData.resume();
            };
            MapFunc.restoreLoc();
            Swal.close();
        }, 2000);
    },

    showMakersLine(){
        infoWindow.close();
        var specMdCode = $('#mdCodeHolder').val();

        this.showOnlySpecificSalesmanMarkers(specMdCode);
        MapFunc.adjustMapView();
        this.getMarkerLine();
        // $('#showmarkersLineBtn').hide();
        // $('#hidemarkersLineBtn').show();

        // $('#showmarkersLineBtn2').hide();
        // $('#hidemarkersLineBtn2').show();

        // if(!$('#mainMarkerSW').is(':checked')){
        //     this.toggleMainMarkers(MapFunc.map);
        //     $('#mainMarkerSW').prop('checked', true);
        // }
    },

    getMarkerLine(){
        isShowLine = true;
        var markersToLine = allMarkersList.filter(marker => marker.markerType == "mainMarker");

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
                    map: MapFunc.map
                });

                polylineArrHolder.push(polLine);
            }
        });
    },

    toggleMainMarkers(mapTarget){
        allMarkersList.forEach(marker => {
            try {
                if (marker.id === mdCodeHolder && marker.markerType === "mainMarker") {
                    marker.setMap(mapTarget);
                }
            } catch (error) {
                console.error("Error updating marker visibility:", error);
            }
        });
    },

    restoreMapMarkersState(){
        Swal.fire({
            html: "Please Wait... Retrieving Map Markers and Selecting Specific Salesman...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        this.removeSpecSalesmanMarkers();
        this.removeAllPolylines();

        setTimeout(() => {
            Swal.close();
        }, 3000);
    },

    removeAllPolylines() {
        isShowLine = false;
        polylineArrHolder.forEach(polyline => {
            polyline.setMap(null);  
        });
        polylineArrHolder.length = 0; 
    },

    resetOthMarkers(){
        $('#unprodSW').prop('checked', false);
        this.removeUnprodMarkers();
        $('#unvisitedSW').prop('checked', false);
        this.removeUnvisitedMarkers();
    },

    hideMakersLine(){
        if(isShowLine){
            this.removeAllPolylines();
            isShowLine = false;
        }
        if(!isShowLine && !isShowUnpro && !isShowUnvi){
            this.removeSpecSalesmanMarkers();
        }
    },

    hideAllShown(){
        if(isShowUnpro){
            this.removeUnprodMarkers();
            $('#unprodSW').prop('checked', false);
            isShowUnpro = false;
        }
        if(isShowUnvi){
            this.removeUnvisitedMarkers();
            $('#unvisitedSW').prop('checked', false);
            isShowUnvi = false;
        }
        if(isShowLine){
            this.hideMakersLine();
            $('#showRouteSW').prop('checked', false);
            isShowLine = false;
        }

        if(!isShowUnpro && !isShowUnvi && !isShowLine){
            this.removeSpecSalesmanMarkers();
        }
    },

    getTransaction2(transactionID){
        $('.item_headerDiv').prop('disabled', true);
        var transactionID = $('#IW_transacID').html();
        $('.IWContentOthDetail').show();

        $('#transaction-details-holder').html('<div class="m-auto text-center"><i class="fa fa-spin fa-spinner"></i> please wait...</p></div>');

        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"getTransactionDetails", "transactionID":transactionID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "html", 
            crossDomain: true,
            cache: false,
            success: function(response){ 
                $('#transaction-details-holder').html("");
                $('#transaction-details-holder').append(response);
                $('#transaction-details-holder table').addClass('table table-condensed table-bordered');
                $('#transaction-details-holder').addClass('height-details');
                setTimeout(() => {
                    $('.item_headerDiv').prop('disabled', false);
                }, 5000);
            }//success
        });
    }

}

const DefaultFunc = {
    defaultStore:(image) => {
        image.onError = "";
        image.src = "img/no-image.png";
        return true;
    },

    imgError(image) {
        image.onError = "";
        image.src = "img/salesmanPic.jpg";
        return true;
    },

    storeimgError(image) {
        image.onError = "";
        image.src = "img/storePic.jpg";

        $('.SyncStoreImgBtn').show();
        return true;
    },
    
    checkImg(imglink, mdCode){
        var img = new Image();
        img.src = imglink + mdCode + ".jpg";

        $(img).on('load', function() {
            $("#left_salesmanImage").attr("src", img.src);
        }).on('error', function() {
            $("#left_salesmanImage").attr("src", "img/salesmanPic.jpg");
        });
    },

    checkStoreImg(imglink, custCode){
        var img = new Image();
        img.src = imglink + custCode + "_1.jpg";

        $(img).on('load', function() {
            $("#left_storeImage").attr("src", img.src);
        }).on('error', function() {
            $("#left_storeImage").attr("src", "img/storePic.jpg");
        });
    },

    SyncStoreImg(codeString){
        $('.SyncStoreImgBtn').html("<i class='fa fa-spin fa-spinner'></i> please wait..");
        var mdCode = codeString.split('-')[0];
        var custCode = codeString.split('-')[1];
        $('#SyncStoreImgBtn-' + mdCode + '-' + custCode).prop('disabled', true);

        $.ajax ({
            url: LOCALLINK + API_ENDPOINT,
            type: "GET",
            data: {"type":"SYNC_CUSTOMER_IMAGE", "mdCode":mdCode, "custCode":custCode, "CONN":con_info},
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
                            type: 'GET',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(res) {
                                $('#left_storeImage').attr('src', imglink+formData.get('imgSourceDataFile')+'.jpg');
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
                            type: 'GET',
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

}

const DataTablesFunc = {
    initDataTable_mainSalesman(){
        dataTablesSalesmanMain = new DataTable('.dataTableMainClass',{
            dom: '<"d-flex flex-column flex-sm-row justify-content-between py-2"<"customDTBtn"><f>>t<"d-flex justify-content-between"<"d-flex align-items-center"<"dataTableTopPagination"p>i><"outerTableOverallTotal"<"#outerTableTotal""px-2">>>',
            lengthChange: true,
            pageLength: NumOfDataTableRows,
            order: true,    
            responsive: false,
            scrollX: true,
            source: allSalesmanTableData,
            columns: [
                {   
                    title:"Salesman Name", 
                    data: null,
                    render: function(data,type,row){
                        return '<img src="' + datatable_imgLink + row.mdCode+ '.jpg" onError="DefaultFunc.imgError(this)" height="20" width="20" style="border-radius:50%;border:2px solid '+row.mdColor+'"> '+ ' ' + row.salesmanName;
                    }
                },
                {   
                    title: "Attendance", 
                    data: null,
                    render: function(data,type,row){
                        var timeStr = DatetimeFunc.checkTime(row.FirstCall);
                        var attendance;
                        
                        if(timeStr){
                            attendance = '<span class="badge rounded-pill" style="color: #00894F; background-color: #D9F8EB; font-size:10px;"><span class="mdi mdi-emoticon-happy-outline"></span> Early</span>';
                        } else {
                            attendance = '<span class="badge rounded-pill" style="color: #AC5A2B; background-color: #FDE6D8; font-size:10px;"><span class="mdi mdi-emoticon-sad-outline"></span> Late</span>';
                        }

                        return attendance;
                    }
                },
                {   
                    title:"Target MCP", 
                    data: null,
                    render: function(data,type,row){
                        return (row["Total Calls"] != null)? row["Total Calls"] : 0;
                    }
                },
                {   
                    title:"Productive", 
                    data: null,
                    render: function(data,type,row){
                        return (row["Productive Calls"] != null)? row["Productive Calls"] : 0;
                    }
                },
                {   
                    title:"Unproductive", 
                    data: null,
                    render: function(data,type,row){
                        return (row["Unproductive Calls"] != null)? row["Unproductive Calls"] : 0;
                    }
                },
                {   
                    title:"Strike Rate", 
                    data: "percentage",
                    render: function(data,type,row){
                        return (row["Productive Calls"] != null && row["Total Calls"] != null && row["Total Calls"] != 0)? Math.round((parseInt(row["Productive Calls"])/parseInt(row["Total Calls"]))*100)+"%" : 0+"%";
                    }
                },
                {   
                    title:"Selling Hrs", 
                    data: "sellingHours",
                },
                {   
                    title:"Sales", 
                    data: "Sales",
                    render: function(data, type, row){
                        return (data != null)? "₱"+Number(data).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "₱0.00";
                    }
                },
            ],
            columnDefs: [
                {
                    targets: [1,2,3,4,5],
                    className: 'text-center'
                },
                {
                    targets: [2,6],
                    className: 'text-nowrap'
                },
                {
                    targets: 7,
                    className: 'text-end'
                },
            ],
            language: {
                "search": "",
                "searchPlaceholder": "Search Salesman..."
            },
            initComplete: function (settings, json) {
                DataTablesFunc.setStyles();
                $('.dt-search input[type="search"]').css({
                    'margin-right': '15px',
                    'border-radius': '30px',
                    'border': '1px solid #FFF',
                    'font-size': '11px',
                    'width': '200px',
                    'color': '#FFF',
                    'background': 'transparent'
                });
            },
        })

        // Attach event listener to each row
        $('.dataTableMainClass tbody').on('click', 'tr', function () {
            if(isViewSpecMarkersLine == false){
                var tr = $(this).closest('tr');
                var row = dataTablesSalesmanMain.row(tr).data();
                
                if (!row) {
                    return;
                }

                var mdCode = row.mdCode;
                MapFunc.showSalesmanOnMap(mdCode);
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
                var row = dataTablesSalesmanMain.row(tr);

                if (!row) {
                    return;
                }

                var mdCode = row.mdCode;
                MarkersFunc.showMakersLine();
                MarkersFunc.resetOthMarkers();
                
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

        dataTablesSalesmanMain.on('search.dt', function() {
            var initialData = dataTablesSalesmanMain.rows({ search: 'applied' }).data();
            DataTablesFunc.getTblTotal(initialData);
        });
    },

    initDataTableMap_categorizedSalesman(){
        dataTablesSalesmanMap = new DataTable('#salesmanMapTable', {
            dom: '<"mapTableHeader d-flex justify-content-between py-2 px-2"<"customDTBtn"><f>>t<"mapTableFooter d-flex justify-content-between px-2"<"d-flex align-items-center"<"dataTableTopPagination mx-2 mb-2"p>i>>',
            lengthChange: true,
            pageLength: 5,
            order: true,    
            responsive: false,
            scrollX: true,
            source: [],
            columns: [
                {   
                    title:"Salesman Name", 
                    data: null,
                    render: function(data,type,row){
                        return '<img src="' + datatable_imgLink + row.mdCode+ '.jpg" onError="DefaultFunc.imgError(this)" height="20" width="20" style="border-radius:50%;border:2px solid '+row.mdColor+'"> '+ ' ' + row.salesmanName;
                    }
                },
                {   
                    title: "Attendance", 
                    data: null,
                    render: function(data,type,row){
                        var timeStr = DatetimeFunc.checkTime(row.FirstCall);
                        var attendance;
                        
                        if(timeStr){
                            attendance = '<span class="badge rounded-pill" style="color: #00894F; background-color: #D9F8EB; font-size:10px;"><span class="mdi mdi-emoticon-happy-outline"></span> Early</span>';
                        } else {
                            attendance = '<span class="badge rounded-pill" style="color: #AC5A2B; background-color: #FDE6D8; font-size:10px;"><span class="mdi mdi-emoticon-sad-outline"></span> Late</span>';
                        }

                        return attendance;
                    }
                },
                {   
                    title:"Target MCP", 
                    data: null,
                    render: function(data,type,row){
                        return (row["Total Calls"] != null)? row["Total Calls"] : 0;
                    }
                },
                {   
                    title:"Productive", 
                    data: null,
                    render: function(data,type,row){
                        return (row["Productive Calls"] != null)? row["Productive Calls"] : 0;
                    }
                },
                {   
                    title:"Unproductive", 
                    data: null,
                    render: function(data,type,row){
                        return (row["Unproductive Calls"] != null)? row["Unproductive Calls"] : 0;
                    }
                },
                {   
                    title:"Strike Rate", 
                    data: "percentage",
                    render: function(data,type,row){
                        return (row["Productive Calls"] != null && row["Total Calls"] != null && row["Total Calls"] != 0)? Math.round((parseInt(row["Productive Calls"])/parseInt(row["Total Calls"]))*100)+"%" : 0+"%";
                    }
                },
                {   
                    title:"Selling Hrs", 
                    data: "sellingHours",
                },
                {   
                    title:"Sales", 
                    data: "Sales",
                    render: function(data, type, row){
                        return (data != null)? "₱"+Number(data).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "₱0.00";
                    }
                },
            ],
            columnDefs: [
                {
                    targets: [1,2,3,4,5],
                    className: 'text-center'
                },
                {
                    targets: [2,6],
                    className: 'text-nowrap'
                },
                {
                    targets: 7,
                    className: 'text-end'
                },
            ],
            language: {
                "search": "",
                "searchPlaceholder": "Search Salesman..."
            },
            initComplete: function (settings, json) {
                var a = 
                    `<div class="d-flex align-items-center">
                        <button id="backToOpsBtn" class="datatableCustBtn backToOpsBtn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Return to Operations Datatable.">
                            <span class="mdi mdi-arrow-left"></span>
                        </button>
                        <div id="dropDownSalesmanCategory" class="dropdown d-flex align-items-center">
                            <button class="salesmanCatIndi datatableCustBtn" type="button" data-bs-toggle="dropdown"> 
                                Operation Type
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu selectCustDD"></ul>
                        </div>
                        <div class="dropdown">
                            <button id="dynamicRefresher" class="dynamicRefresher datatableCustBtn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span class="mdi mdi-chevron-down"></span>
                                <span class="mdi mdi-timer-refresh-outline"></span>
                                <span class="intervalValueHolder">10 Mins.</span>
                            </button>
                            <ul class="dropdown-menu refreshIntervals"  >
                                <li class="dropdown-item" data-value="OFF">OFF <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="1">1 Minute <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="5">5 Minutes <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="10">10 Minutes <span class="mdi mdi-check"></span></li>
                                <li class="dropdown-item" data-value="15">15 Minutes <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="30">30 Minutes <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="60">60 Minutes <span class="mdi "></span></li>
                            </ul>
                        </div>
                        <button class="datatableCustBtn manualRefresh" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Manually refresh map markers data" onclick='MapFunc.refreshMapManually()'>
                            <span class="mdi mdi-refresh"></span>
                        </button>
                    </div>`;
            
                $('.salesmanMapTableDiv .customDTBtn').html(a);

                $('.refreshIntervals li').on('click', function() {
                    var value = $(this).data('value');
                    $('.refreshIntervals li span').removeClass('mdi-check');
                    $('.refreshIntervals li[data-value="' + value + '"] span').addClass('mdi-check');
                    
                    if(value == 'OFF'){
                        displayAllData.pause();
                    } else{
                        var intervalValue = value * 60000;
                        displayAllData.resume();
                        displayAllData.changeInterval(intervalValue);
                    }
                    $('.intervalValueHolder').html(value+" "+checkVal(value));
                });

                $('.dt-search input[type="search"]').css({
                    'margin-right': '15px',
                    'border-radius': '30px',
                    'border': '1px solid #FFF',
                    'font-size': '11px',
                    'width': '200px',
                    'color': '#FFF',
                    'background': 'transparent'
                }).addClass('white-placeholder');
            },
        });

        $('#salesmanMapTable tbody').on('click', 'tr', function () {
            if(isViewSpecMarkersLine == false){
                var tr = $(this).closest('tr');
                var row = dataTablesSalesmanMap.row(tr).data();

                if (!row) {
                    return;
                }

                var mdCode = row.mdCode;
                MapFunc.showSalesmanOnMap(mdCode);
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

        $('#backToOpsBtn').on('click', function() {
            $('.salesmanCatIndi').html('All Salesman <span class="mdi mdi-chevron-down"></span>');
            displayCategoryDataTable = true; 
            $('.salesmanMapTableDiv').fadeOut();
            $('.productMapTableDiv').fadeOut();

            displayAllData.resume();
            bybrandchecker = 0;

            dataTablesSalesmanMain.clear().rows.add(allSalesmanTableData).draw();
            dataTablesSalesmanMap.clear().rows.add(allSalesmanTableData).draw();

            setTimeout(() => {
                MarkersFunc.showAllMarkers();
                MarkersFunc.changeMarkerBounce();
                $('.operationMapTableDiv').fadeIn();  
            }, 1000);
        });
    },

    initDataTable_mainProduct(){
        dataTablesProductMain = new DataTable('.dataTableProductClass',{
            dom: '<"d-flex justify-content-start align-items-center"<"allProdBtnDiv">>t<"d-flex justify-content-between"<"d-flex align-items-center"<"dataTableTopPagination"p>i>>',
            lengthChange: true,
            pageLength: 5,
            order: true,    
            responsive: false,
            scrollX: true,
            source: productSourceData,
            columns: [
                {
                    title: "Product Category",
                    data: "Brand",
                    render: function(data, type, row) {
                        return `<i class="fa-solid fa-box-open" style="color:${row.BrandColor}; margin-right:6px;"></i>${data}`;
                    }
                },
                {   
                    title:"Total Sales", 
                    data: "totalAmount",
                    render: function(data,type,row){
                        return (data != null)? "₱"+data.toLocaleString() : 0;
                    }
                },
                {   
                    title:"Percentage", 
                    data: "percentage",
                    render: function(data,type,row){
                        return (data != null)? data+"%" : "0%";
                    }
                },
            ],
            columnDefs: [
                {
                    targets: 0,
                    className: 'text-start px-3'
                },
                {
                    targets: 2,
                    className: 'text-center'
                },
                {
                    targets: 1,
                    className: 'text-end'
                },
            ],
            initComplete: function (settings, json) {
                var btnContent= `<button class="datatableCustBtn datatableProdCustBtn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="View All Product Category Markers" onClick="ProductDataFunc.showAllProdMarkers()">
                                    View All Product Category
                                </button>`;
                $('.allProdBtnDiv').html(btnContent);
            }
        });

        $('.dataTableProductClass tbody').on('click', 'tr', function () {
            var tr = $(this).closest('tr');
            var row = dataTablesProductMain.row(tr).data();

            if (!row) {
                return;
            }
            
            ProductDataFunc.showSpecificProfMarkers(row.Brand);
            // showSpecificProfMarkers(row.)
        });
    },

    initDataTableMap_product(){
        dataTablesProductMap = new DataTable('#productMapTable',{
            dom: '<"mapTableHeader d-flex justify-content-start align-items-center"<"allProdBtnDiv">>t<"mapTableFooter d-flex justify-content-between"<"d-flex align-items-center"<"dataTableTopPagination mx-2 mb-2"p>i>>',
            lengthChange: true,
            pageLength: 5,
            order: true,    
            responsive: false,
            scrollX: true,
            source: productSourceData,
            columns: [
                {
                    title: "Product Category",
                    data: "Brand",
                    render: function(data, type, row) {
                        return `<i class="fa-solid fa-box-open" style="color:${row.BrandColor}; margin-right:6px;"></i>${data}`;
                    }
                },
                {   
                    title:"Total Sales", 
                    data: "totalAmount",
                    render: function(data,type,row){
                        return (data != null)? "₱"+data.toLocaleString() : 0;
                    }
                },
                {   
                    title:"Percentage", 
                    data: "percentage",
                    render: function(data,type,row){
                        return (data != null)? data+"%" : "0%";
                    }
                },
            ],
            columnDefs: [
                {
                    targets: 0,
                    className: 'text-start px-3'
                },
                {
                    targets: 2,
                    className: 'text-center'
                },
                {
                    targets: 1,
                    className: 'text-end'
                },
            ],
            initComplete: function (settings, json) {
                var btnContent= `<button class="datatableCustBtn datatableProdCustBtn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="View All Product Category Markers" onClick="ProductDataFunc.showAllProdMarkers()">
                                    View All Product Category
                                </button>`;
                $('.allProdBtnDiv').html(btnContent);
            }
        })

        $('#productMapTable tbody').on('click', 'tr', function () {
            var tr = $(this).closest('tr');
            var row = dataTablesProductMap.row(tr).data();

            if (!row) {
                return;
            }
            
            ProductDataFunc.showSpecificProfMarkers(row.Brand);
            // showSpecificProfMarkers(row.)
        });
    },

    setMapOperationDatatable(){
        dataTablesOperationMap = new DataTable('#operationMapTable', {
            dom: '<"mapTableHeader d-flex justify-content-between py-2 px-2"<"customDTBtn mapOperationTable"><f>>t<"mapTableFooter">',
            lengthChange: true,
            pageLength: 5,
            order: true,    
            responsive: false,
            scrollX: true,
            source: categoryOperationSource,
            columns: [
                { 
                    title:"Operation Type", 
                    data: "defaultOrderType",
                    render: function(data, type, row){
                        return row.iconImg +" "+ data;
                    }
                },
                { 
                    title:"Target MCP",
                    data: "accu_totalCalls",
                    render: function(data, type, row){
                        return Number(data).toLocaleString();
                    } 
                },
                { 
                    title:"Productive",
                    data: "accu_productiveCalls",
                    render: function(data, type, row){
                        return Number(data).toLocaleString();
                    }
                },
                { 
                    title:"Unproductive",
                    data: "accu_unproductiveCalls",
                    render: function(data, type, row){
                        return Number(data).toLocaleString();
                    },
                },
                { 
                    title:"Strike Rate", 
                    data: null,
                    render: function(data, type, row){
                        return (row != null && row.accu_totalCalls != 0)? Math.round((parseInt(row.accu_productiveCalls)/parseInt(row.accu_totalCalls))*100)+"%" : 0.00+"%";
                    }
                },
                { 
                    title:"Sales", 
                    data: "accu_totalSales",
                    render: function(data, type, row){
                        return (data != null)? "₱"+Number(data).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "₱0.00";
                    }
                },
            ],
            columnDefs: [
                {
                    targets: [1,2,3,4],
                    className: 'text-center'
                },
                {
                    targets: [0,1,2,3,4,5],
                    className: 'text-nowrap'
                },
                {
                    targets: 5,
                    className: 'text-end'
                },
                {
                    targets: 0,
                    className: 'text-start'
                }
            ],
            language: {
                "search": "",
                "searchPlaceholder": "Search Operation Type..."
            },
            initComplete: function (settings, json) {
                var a = 
                    `<div class="d-flex align-items-center">
                        <div class="dropdown">
                            <button id="dynamicRefresher" class="dynamicRefresher datatableCustBtn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span class="mdi mdi-chevron-down"></span>
                                <span class="mdi mdi-timer-refresh-outline"></span>
                                <span class="intervalValueHolder">10 Mins.</span>
                            </button>
                            <ul class="dropdown-menu refreshIntervals"  >
                                <li class="dropdown-item" data-value="OFF">OFF <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="1">1 Minute <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="5">5 Minutes <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="10">10 Minutes <span class="mdi mdi-check"></span></li>
                                <li class="dropdown-item" data-value="15">15 Minutes <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="30">30 Minutes <span class="mdi "></span></li>
                                <li class="dropdown-item" data-value="60">60 Minutes <span class="mdi "></span></li>
                            </ul>
                        </div>
                        <button class="datatableCustBtn manualRefresh" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Manually refresh map markers data" onclick='MapFunc.refreshMapManually()'>
                            <span class="mdi mdi-refresh"></span>
                        </button>
                    </div>`;
            
                $('.operationMapTableDiv .customDTBtn.mapOperationTable').html(a);

                $('.refreshIntervals li').on('click', function() {
                    var value = $(this).data('value');
                    $('.refreshIntervals li span').removeClass('mdi-check');
                    $('.refreshIntervals li[data-value="' + value + '"] span').addClass('mdi-check');
                    
                    if(value == 'OFF'){
                        displayAllData.pause();
                    } else{
                        var intervalValue = value * 60000;
                        displayAllData.resume();
                        displayAllData.changeInterval(intervalValue);
                    }
                    $('.intervalValueHolder').html(value+" "+checkVal(value));
                });

                $('.dt-search input[type="search"]').css({
                    'margin-right': '15px',
                    'border-radius': '30px',
                    'border': '1px solid #FFF',
                    'font-size': '11px',
                    'width': '200px',
                    'color': '#FFF',
                    'background': 'transparent'
                }).addClass('white-placeholder');           
            },
        });

        // Attach event listener to each row
        $('#operationMapTable tbody').on('click', 'tr', function () {
            if(isShowLine || isShowUnpro || isShowUnvi){
                Swal.fire({
                    title: "Restore Map Markers First.",
                    text: "Double Click on Map To Restore"
                });
                return;
            }

            var tr = $(this).closest('tr');
            var row = dataTablesOperationMap.row(tr).data();

            if (!row) {
                return;
            }

            var defaultOrderType = row.defaultOrderType;

            DataTablesFunc.selectType(defaultOrderType);

            // $('.operationMapTableDiv').hide();
            // $('.salesmanMapTableDiv').show();
            $('.productMapTableDiv').hide();
            displayCategoryDataTable = false;
        });
    },

    getTblTotal(dataTables){
        var filteredData = dataTables.rows({ search: 'applied' }).data();

        var tblTotal = 0;
        var dataTotalCtr = 0;

        filteredData.each(function(row) {
            var amountStr = parseFloat(row.Sales);
            tblTotal+=amountStr;
        });

        tblTotal = tblTotal;
        dataTotalCtr = (filteredData.length);

        $('#total').html('Total (' + dataTotalCtr + ') : <span class="fw-bold"> &#8369; ' + tblTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span>');
        $('#outerTableTotal').html('Total ('+dataTotalCtr+') : <span class="fw-bold"> &#8369;' + tblTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span>' );
    },

    setStyles() {
        var a = 
            `<div class="d-flex align-items-center">
                <div id="dropDownSalesmanCategory" class="dropdown d-flex align-items-center">
                    <button class="salesmanCatIndi datatableCustBtn" type="button" data-bs-toggle="dropdown"> 
                        Operation Type
                        <span class="mdi mdi-chevron-down">
                    </button>
                    <ul class="dropdown-menu selectCustDD"></ul>
                </div>
                <div class="dropdown">
                    <button id="dynamicRefresher" class="dynamicRefresher datatableCustBtn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="mdi mdi-chevron-down"></span>
                        <span class="mdi mdi-timer-refresh-outline"></span>
                        <span class="intervalValueHolder">10 Mins.</span>
                    </button>
                    <ul class="dropdown-menu refreshIntervals"  >
                        <li class="dropdown-item" data-value="OFF">OFF <span class="mdi "></span></li>
                        <li class="dropdown-item" data-value="1">1 Minute <span class="mdi "></span></li>
                        <li class="dropdown-item" data-value="5">5 Minutes <span class="mdi "></span></li>
                        <li class="dropdown-item" data-value="10">10 Minutes <span class="mdi mdi-check"></span></li>
                        <li class="dropdown-item" data-value="15">15 Minutes <span class="mdi "></span></li>
                        <li class="dropdown-item" data-value="30">30 Minutes <span class="mdi "></span></li>
                        <li class="dropdown-item" data-value="60">60 Minutes <span class="mdi "></span></li>
                    </ul>
                </div>
                <button class="datatableCustBtn manualRefresh" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Manually refresh map markers data" onclick='MapFunc.refreshMapManually()'>
                    <span class="mdi mdi-refresh"></span>
                </button>
            </div>`;
    
        $('.customDTBtn').html(a);

        $('.refreshIntervals li').on('click', function() {
            var value = $(this).data('value');
            $('.refreshIntervals li span').removeClass('mdi-check');
            $('.refreshIntervals li[data-value="' + value + '"] span').addClass('mdi-check');
            
            if(value == 'OFF'){
                displayAllData.pause();
            } else{
                var intervalValue = value * 60000;
                displayAllData.resume();
                displayAllData.changeInterval(intervalValue);
            }
            $('.intervalValueHolder').html(value+" "+checkVal(value));
        });

        $('#dataTableExpandBtn').remove();
        $('#outerTab_wrapper .dt-search').prepend('<button id="dataTableExpandBtn" onclick="DataTablesFunc.expandDatatabale()">Expand</button>');
    },

    getAvailableOperations(){
        var cont = '';
        cont = '<li><a href="#" class="dropdown-item selectCust" style="font-size:13px" onclick="DataTablesFunc.selectType(\'All\')">All</a></li>';

        var availableOps = [...new Set(allSalesmanTableData.map(item => item.DefaultORDType))];;
        availableOps.forEach(element => {
            if(element){
                var type = salesmanType(element);
                cont += '<li><a href="#" class="dropdown-item selectCust" style="font-size:13px" onclick="DataTablesFunc.selectType(\''+type+'\')">'+type+'</a></li>';
            }
        });

        $('.selectCustDD').html(cont);
    },

    expandDatatabale(){
        getHeight();
        var left = $('.DashboardLeftContent');
        var right = $('.DashboardRightContent');

        if (!right.hasClass('halfFullWidth')) {
            $('.arrow-side-icon-leftDiv').toggleClass('fa-angle-left fa-angle-right');
            left.show();
            right.removeClass('col-12')
                .addClass('col-lg-8 col-xl-8 col-xxl-9')
                // .addClass('col-xl-8 col-xxl-9')
                .addClass('halfFullWidth');
        }
        if(tableExpanded == false){ 
            // $('.dashboardMapDiv').css({'height': '5%'});
            $('.dashboardMainUpperRightDiv').removeClass('flex-grow-1');
            $(".dashboardMapDiv").hide();
            $('#datePicker').hide();
            $('#dataTableExpandBtn').html('Collapse');
            $('.selectCust, .selectCustHr').hide();
            dataTablesSalesmanMain.page.len(allowableHeight).draw();
            tableExpanded = true;
            $('.otherActivities ').css('visibility', 'hidden');
        } else{
            // $('.dashboardMapDiv').css({'height': '60vh'});
            $('.dashboardMainUpperRightDiv').addClass('flex-grow-1');
            $(".dashboardMapDiv").show();
            $('#datePicker').show();
            $('#dataTableExpandBtn').html('Expand');
            $('.selectCust, .selectCustHr').show();
            dataTablesSalesmanMain.page.len(NumOfDataTableRows).draw();
            tableExpanded = false;
            $('.otherActivities ').css('visibility', 'visible');
        }
    },

    selectType(type){
        if(isShowLine || isShowUnpro || isShowUnvi){
            Swal.fire({
                title: "Restore Map Markers First.",
                text: "Double Click on Map To Restore"
            });
            return;
        }
        LeftDataFunc.defaultLeftScreen(true);
        var selected = type;
        var sel_conv = $.trim(selected);
        console.log(selected, sel_conv)
        $('.salesmanCatIndi').html(selected + ' Salesman <span class="mdi mdi-chevron-down"></span>');
        
        if (sel_conv == 'All') {
            displayCategoryDataTable = true;
            displayAllData.resume();
            bybrandchecker = 0;

            dataTablesSalesmanMain.clear().rows.add(allSalesmanTableData).draw();
            dataTablesSalesmanMap.clear().rows.add(allSalesmanTableData).draw();

            MarkersFunc.showAllMarkers();
            MarkersFunc.changeMarkerBounce();

            $('.operationMapTableDiv').show();
            $('.salesmanMapTableDiv').hide();
        } else {
            displayCategoryDataTable = false;
            displayAllData.pause();
            bybrandchecker = 1;

            categoryOperationSource.forEach(element => {
                if(element.defaultOrderType == selected){
                    dataTablesSalesmanMain.clear().rows.add(element.items).draw();
                    dataTablesSalesmanMap.clear().rows.add(element.items).draw();
                }
            });
            MarkersFunc.categorizeDisplayMarkers(selected);

            currentInfoWindow.close();
            MarkersFunc.deleteBounce();

            $('.operationMapTableDiv').hide();
            $('.salesmanMapTableDiv').show();
        }
        
    },

    clearAllTables(){
        dataTablesOperationMap.clear().draw();
        dataTablesSalesmanMain.clear().draw();
        dataTablesSalesmanMap.clear().draw();
        $('#lateSalesmanInnerList').html("");
    }
}
 
const SourceDataFunc = {
    fetchDataChecker: () => {
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"TOTAL_SALES_DASHBOARD_DATA_TABLE_LOCAL", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            async: true,
            cache: false,          
            success: function(res){ 
                if(res[0].salesman == 0){
                    Swal.fire({
                        icon: "info",
                        title: "No Data Available",
                        text: 'There’s nothing to display at the moment.',
                        allowOutsideClick: false,  
                        allowEscapeKey: false, 
                        allowEnterKey: false 
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('#loading-table-main').fadeOut();
                        }
                    });
                }else{
                    var sales = parseFloat(Number(res[0].total).toFixed(2));
                    var salesman = res[0].salesman;
                    var indicator = res[0].indicator;
                    salesBased = indicator;

                    if(selecterChecker == 2){
                        if(salesBased != greatest){
                            if(salesBased > greatest){
                                SourceDataFunc.createMainList();
                                
                                // dashBoardData();
                                // dashBoard_direct_marker();
                                // productCategory();
                                // loadSalesmanCategory();
                                // MarkersFunc.deleteMarkers();
                                OverviewFunc.getMapOverviewDetails();
                                
                            }else{
                                // loadSalesmanCategory();
                                // MarkersFunc.deleteMarkers();
                                // dashBoard_direct_marker();
                                // productCategory();
                            }
                            greatest = salesBased;
                        }//second if
                    }
                }

                $('.manualRefresh').html('<span class="mdi mdi-refresh"></span>');
                $(".manualRefresh").prop("disabled", false);
            }
        });
    },

    fetchAllMarkers: () => {
        return $.ajax({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"DASHBOARD_MARKERS", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false,
        });
    },

    fetchAllMarkers_PREV: (date) => {
        return $.ajax({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"displayPreviousDash", "dateSelected":date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false,
        });
    },

    fetchAllSalesmanAttendance: () => {
        return $.ajax({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"GET_LATE", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false
        });
    },

    fetchAllSalesmanAttendance_PREV : (date) => {
        return $.ajax({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"previous_getLate", "dateSelected": date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false
        });
    },

    fetchAllSalesmanTableData: () => {
        return $.ajax({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"DASHBOARD_SALESMAN_DATA_TABLE_v2", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false
        });
    },

    fetchAllSalesmanTableData_PREV: (date) => {
        return $.ajax({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: { "type": "displayPreviousDash_tableDetails_v2", "dateSelected": date, "userID": GBL_USERID, "distCode": GBL_DISTCODE },
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false
        });
    },

    createMainList: () => {
        if(isfirstLoadMarkers){
            $('#loading-table-main').show();
            isfirstLoadMarkers = false;
        }

        $.when(
            SourceDataFunc.fetchAllSalesmanAttendance(),
            SourceDataFunc.fetchAllMarkers()
        ).done((salesmanAttendance, transactions) => {
            DataTablesFunc.clearAllTables();
            
            var salesmanAttendance = salesmanAttendance[0];
            var transactions = transactions[0];

            allTransactionList = [];
            allSalesmanAttendance = [];
            allMarkersList = [];

            if(salesmanAttendance && transactions){
                transactions.forEach(transac => {
                    let match = salesmanAttendance.find(salesman => salesman.mdCode == transac.mdCode);
                    if (match) {
                        $.each(match, function (key, value) {
                            if (!(key in transac)) {
                                transac[key] = value;  
                            }

                            if (!('DefaultORDType' in match)) {  // Work around to get defaultOrdType which will be used for categorizing salesman. 
                                match.DefaultORDType = transac.DefaultORDType;
                            }
                        });
                    }
                })  

                allTransactionList = transactions;
                allSalesmanAttendance = salesmanAttendance
                SourceDataFunc.createTableSalesmanList();
                SourceDataFunc.createMapList(allSalesmanAttendance);

                for(var x=0; x<allTransactionList.length; x++){
                    var data = allTransactionList;
                    
                    var sendDate = data[x].hasOwnProperty('sendDate') ? data[x].sendDate : data[x].deliveryDate;
                    var contentString = MapFunc.mainMarkerInfoWindow(data[x].mdCode, data[x].mdColor, data[x].customerID, data[x].transCount, data[x].Salesman, data[x].Customer, data[x].address, data[x].deliveryDate, data[x].timeSpent, data[x].time, data[x].Sales, data[x].noSku, data[x].latitude, data[x].longitude, data[x].transactionID, imglink, sendDate, data[x].Notation);
                    var specMarker = MapFunc.mainSpecificMarker(data[x], contentString);

                    allMarkersList.push(specMarker);

                    google.maps.event.addListener(specMarker, "click", function () {
                        lat1 = this.dataArr.latitude;
                        lon1 = this.dataArr.longitude;
                        console.log('1');
                        if(currentInfoWindow){
                            currentInfoWindow.close();
                            isMarkerOpened = true;
                        }
                        MarkersFunc.deleteBounce(allMarkersList);

                        infoWindow.setContent(this.content); 
                        infoWindow.open(MapFunc.map, this);
                        console.log(this.dataArr);
                        LeftDataFunc.marker_leftDetails(this.dataArr);
                        this.setAnimation(google.maps.Animation.BOUNCE);
                    });
                }
            }

            setTimeout(() => { // Added a short delay to have time for markers to render successfully in map.
                Swal.close();
                $('#loading-table-main').fadeOut();
                if(allMarkersList.length > 0 ){
                    if(isMarkerOpened){
                        isMarkerOpened = false
                    }
                    MarkersFunc.changeMarkerBounce();
                } else{
                    Swal.fire({
                        icon: "info",
                        title: "Oops!",
                        text: 'We couldn’t find any transactions today. '
                    });


                }
            }, 5000);

        }).fail((err) => {
            console.error("Error fetching data", err);
        });
    },

    createMainList_PREV: () => {
        if(isfirstLoadMarkers){
            $('#loading-table-main').show();
            isfirstLoadMarkers = false;
        }

        $.when(
            SourceDataFunc.fetchAllSalesmanAttendance_PREV(date_selected),
            SourceDataFunc.fetchAllMarkers_PREV(date_selected)
        ).done((salesmanAttendance, transactions) => {
            DataTablesFunc.clearAllTables();

            var salesmanAttendance = salesmanAttendance[0];
            var transactions = transactions[0];

            allTransactionList = [];
            allSalesmanAttendance = [];
            allMarkersList = [];

            if(salesmanAttendance && transactions){
                transactions.forEach(transac => {
                    let match = salesmanAttendance.find(salesman => salesman.mdCode == transac.mdCode);
                    if (match) {
                        $.each(match, function (key, value) {
                            if (!(key in transac)) {
                                transac[key] = value;  
                            }

                            if (!('DefaultORDType' in match)) { // Work around to get defaultOrdType which will be used for categorizing salesman. 
                                match.DefaultORDType = transac.DefaultORDType;
                            }
                        });
                    }
                })

                allTransactionList = transactions;
                allSalesmanAttendance = salesmanAttendance;
                allMarkersList = [];

                SourceDataFunc.createTableSalesmanList_PREV(date_selected);
                SourceDataFunc.createMapList(allSalesmanAttendance);

                for(var x=0; x<allTransactionList.length; x++){
                    var data = allTransactionList;
                    
                    var sendDate = data[x].hasOwnProperty('sendDate') ? data[x].sendDate : data[x].deliveryDate;
                    var contentString = MapFunc.mainMarkerInfoWindow(data[x].mdCode, data[x].mdColor, data[x].customerID, data[x].transCount, data[x].Salesman, data[x].Customer, data[x].address, data[x].deliveryDate, data[x].timeSpent, data[x].time, data[x].Sales, data[x].noSku, data[x].latitude, data[x].longitude, data[x].transactionID, imglink, sendDate, data[x].Notation);
                    var specMarker = MapFunc.mainSpecificMarker(data[x], contentString);

                    allMarkersList.push(specMarker);

                    google.maps.event.addListener(specMarker, "click", function () {
                        lat1 = this.dataArr.latitude;
                        lon1 = this.dataArr.longitude;

                        if(currentInfoWindow){
                            currentInfoWindow.close();
                            isMarkerOpened = true;
                        }
                        MarkersFunc.deleteBounce(allMarkersList);

                        infoWindow.setContent(this.content); 
                        infoWindow.open(MapFunc.map, this);
                        console.log(this.dataArr);
                        LeftDataFunc.marker_leftDetails(this.dataArr);
                        this.setAnimation(google.maps.Animation.BOUNCE);
                    });
                }
            }

            setTimeout(() => { // Added a short delay to have time for markers to render successfully in map.
                Swal.close();
                $('#loading-table-main').fadeOut();
                if(allMarkersList.length > 0 ){
                    if(isMarkerOpened){
                        isMarkerOpened = false
                    }
                    MarkersFunc.changeMarkerBounce();
                } else{
                    Swal.fire({
                        icon: "info",
                        title: "Oops!",
                        text: 'We couldn’t find any transactions this day. '
                    });
                }
            }, 5000);

        }).fail((err) => {
            console.error("Error fetching data", err);
        });
    },

    createTableSalesmanList: () => {
        $.when(
            SourceDataFunc.fetchAllSalesmanTableData()
        ).done((allSalesman) => {
            if (allSalesmanAttendance.length > 0) { 
                var salesmanTableData = Array.isArray(allSalesman) ? allSalesman : allSalesman[0];

                // Merge attendance into salesman data
                allSalesmanAttendance.forEach(attendance => {
                    let match = salesmanTableData.find(salesman => salesman.mdCode == attendance.mdCode);
                    if (match) {
                        $.each(match, function (key, value) {
                            if (!(key in attendance)) {
                                attendance[key] = value;
                            }
                        });
                    }
                });

                allSalesmanTableData = allSalesmanAttendance;

                dataTablesSalesmanMain.clear().rows.add(allSalesmanTableData).draw();
                DataTablesFunc.getAvailableOperations();
                SourceDataFunc.categorizeSalesmanPerOps(allSalesmanTableData);
            }
        });
    },

    createTableSalesmanList_PREV: () => {
        $.when(
            SourceDataFunc.fetchAllSalesmanTableData_PREV(date_selected)
        ).done((allSalesman) => {
            if (allSalesmanAttendance.length > 0) { 
                var salesmanTableData = Array.isArray(allSalesman) ? allSalesman : allSalesman[0];

                // Merge attendance into salesman data
                allSalesmanAttendance.forEach(attendance => {
                    let match = salesmanTableData.find(salesman => salesman.mdCode == attendance.mdCode);
                    if (match) {
                        $.each(match, function (key, value) {
                            if (!(key in attendance)) {
                                attendance[key] = value;
                            }
                        });
                    }
                });

                allSalesmanTableData = allSalesmanAttendance;

                dataTablesSalesmanMain.clear().rows.add(allSalesmanTableData).draw();
                DataTablesFunc.getAvailableOperations();
                SourceDataFunc.categorizeSalesmanPerOps(allSalesmanTableData);
            }
        });
    },

    categorizeSalesmanPerOps: (salesmanArr) => {
        // console.log(salesmanArr);
        $.each(salesmanArr, function(_, salesman) {
            // let str = salesman.mdName;
            // let match = str.match(/\(([A-Z]+)(?:-[A-Za-z]*)?\)/);
            let group = categoryOperationSource.find(g => g.defaultOrderType == salesmanType(salesman.DefaultORDType));

            if (!group) {
                group = {
                    defaultOrderType: salesmanType(salesman.DefaultORDType),
                    iconImg: salesmanTypeIcons(salesman.DefaultORDType),
                    items: [],
                    accu_totalSales: 0,  
                    salesmanCount: 0,
                    accu_totalCalls: 0,
                    accu_productiveCalls: 0,
                    accu_unproductiveCalls: 0
                };
                categoryOperationSource.push(group);
            }
            // allSalesmanSource.push(salesman);
            group.items.push(salesman);
            group.accu_totalSales += parseFloat(salesman.Sales) || 0;
            group.salesmanCount++;
            group.accu_totalCalls += parseInt(salesman['Total Calls']);
            group.accu_productiveCalls += parseInt(salesman['Productive Calls']);
            group.accu_unproductiveCalls += parseInt(salesman['Unproductive Calls']);
        });

        dataTablesOperationMap.clear().rows.add(categoryOperationSource).draw();
        // dataTables.clear().rows.add(allSalesmanSource).draw();
    },

    createMapList: (salesmanAttendanceArr) => {
        if (!salesmanAttendanceArr || salesmanAttendanceArr.length === 0) {
            return;
        }

        let content = '';
        salesmanAttendanceArr.forEach(element => {
            let elem = `
                <li>
                    <img 
                        src="${datatable_imgLink}${element.mdCode}.jpg" 
                        height="28" 
                        width="28"
                        class="${element.alert.toLowerCase()}-att"
                        onclick="LeftDataFunc.remarkSalesmanClick_mainCall(
                            '${element.salesmanName}',
                            '${element.refNo}',
                            '${element.deliveryDate}',
                            '${element.TransTime}',
                            '${element.alert}',
                            '${element.mobileNo}',
                            '${element.mdCode}',
                            '${element.mdColor}',
                            '${element.customerLoc}',
                            '${element.latLng}',
                            '${element.thumbnail}',
                            '${element.calltime}'
                        )"
                        onerror="DefaultFunc.imgError(this)"
                    />
                </li>`;
            content += elem;
        });

        $('#lateSalesmanInnerList').html(content);
    }

};

const ProductDataFunc = {
    fetchAllProducts: () => {
        return $.ajax({
            // url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            url: "https://fastdevs-api.com/BUDDYGBLAPI/MTDAPI/application.php",
            type: "GET",
            data: {"type":"getAllProduct", "CONN":con_info},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: false,
        });
    },
    toggleProduct(toggleStat) {
        LeftDataFunc.defaultLeftScreen(true);
        if(toggleStat){
            isProductView = true;
            displayAllData.pause();
            Swal.fire({
                html: "Please Wait... Fetching Product Categories...",
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();

                    ProductDataFunc.fetchAllProducts().done(response => {
                        allProdCategoryList = response;

                        if(allProdCategoryList.length > 0){
                            allMarkersList_BckUp = allMarkersList;
                            for (var i = 0; i < allMarkersList.length; i++) {
                                try {
                                    allMarkersList[i].setMap(null);
                                } catch (error) {
                                    console.error("Error hiding marker:", error);
                                }
                            }

                            if(productMarkers.length != allProdCategoryList.length){
                                var data = allProdCategoryList; 
                                for (var x = 0; x < data.length; x++) {
                                    var markerProd = new google.maps.Marker({
                                        map: MapFunc.map,
                                        brandColor: data[x].BrandColor,
                                        brandName: data[x].Brand,
                                        long: data[x].longitude,
                                        lat: data[x].latitude,
                                        position: new google.maps.LatLng(data[x].latitude, data[x].longitude),
                                        icon: {
                                            path: google.maps.SymbolPath.CIRCLE,
                                            scale: 7,
                                            fillColor: data[x].BrandColor,
                                            fillOpacity: 0.4,
                                            strokeWeight: 0
                                        }
                                    });
                                    productMarkers.push(markerProd);
                                }

                                ProductDataFunc.createProductSourceDataTable();
                            } else{
                                ProductDataFunc.showAllProdMarkers();
                                dataTablesProductMain.clear().rows.add(productSourceData).draw();
                                dataTablesProductMap.clear().rows.add(productSourceData).draw();
                            }
                        } 

                        $("#salesmanMainDiv").hide();
                        $("#productsMainDiv").show();
                        $("#lateSalesmanCont").fadeOut();

                        Swal.close();
                    });
                },
            });
        } else {
            isProductView = false;
            displayAllData.resume();
            allMarkersList = allMarkersList_BckUp;
            ProductDataFunc.deleteAllProdMarkers();
            MarkersFunc.showAllMarkers();

            $("#salesmanMainDiv").show();
            $("#productsMainDiv").hide();
            $("#lateSalesmanCont").fadeIn();
        }

        if(isFullScreen){
            if (isProductView == false) {
                $('#mapOverviewMainOuterDiv').fadeIn(250);
                $('.productMapTableDiv').fadeOut(250);

                if(displayCategoryDataTable){
                    $('.operationMapTableDiv').show();
                    $('.salesmanMapTableDiv').hide();
                } else {
                    $('.operationMapTableDiv').hide();
                    $('.salesmanMapTableDiv').show();
                }
            } else {
                $('.productMapTableDiv').fadeIn(250);
                $('#mapOverviewMainOuterDiv').hide();
                $('.operationMapTableDiv').hide();
                $('.salesmanMapTableDiv').hide();
            }
        }
    },

    deleteAllProdMarkers(){
        if(productMarkers.length > 0){
            for (var i = 0; i < productMarkers.length; i++) {
                try {
                    productMarkers[i].setMap(null);
                } catch (error) {
                    console.error("Error deleting marker:", error);
                }
            }
        }
    },

    showAllProdMarkers(){
        for (var i = 0; i < productMarkers.length; i++) {
            try {
                productMarkers[i].setMap(MapFunc.map);
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
    },

    showSpecificProfMarkers(specificBrand){
        for (var i = 0; i < productMarkers.length; i++) {
            try {
                if(productMarkers[i].brandName == specificBrand){
                    productMarkers[i].setMap(MapFunc.map);
                } else {
                    productMarkers[i].setMap(null);
                }
            } catch (error) {
                console.error("Error deleting marker:", error);
            }
        }
    },

    createProductSourceDataTable() {
        var merged = {};

        // Step 1: Merge totals per brand
        allProdCategoryList.forEach(item => {
            var brand = item.Brand;
            var amount = parseFloat(item.tAmount) || 0;

            if (!merged[brand]) {
                merged[brand] = {
                    Brand: brand,
                    BrandColor: item.BrandColor,
                    totalAmount: 0
                };
            }

            merged[brand].totalAmount += amount;
        });

        var productData = Object.values(merged).map(item => ({
            ...item, totalAmount: parseFloat(item.totalAmount.toFixed(2))
        }));

        var grandTotal = productData.reduce((sum, item) => sum + item.totalAmount, 0);

        productData = productData.map(item => ({
            ...item, percentage: ((item.totalAmount / grandTotal) * 100).toFixed(2)
        }));

        productSourceData = productData;
        dataTablesProductMain.clear().rows.add(productSourceData).draw();
        dataTablesProductMap.clear().rows.add(productSourceData).draw();
    }
}

const DatetimeFunc = {
    datePickerDashboard(){
        $('#datePicker').daterangepicker({
            "singleDatePicker": true,
            "opens": 'left',
            "startDate": moment(),
            "endDate": moment(),
            "maxDate": moment(),
        }, function(start, end, label) {    
            Swal.fire({
                html: "Please Wait... Fetching Salesmans for the Day...",
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            setTimeout(() => {  // Added delay so rendering screen will have time to load.
                if(isViewSpecMarkersLine || isShowLine || isShowUnpro || isShowUnvi){
                    Swal.close();
                    
                    Swal.fire({
                        title: "Restore Map Markers First.",
                        text: "Double Click on Map To Restore"
                    });
                    setTimeout(()=>{
                        Swal.close();
                    },3000);
                    
                    return;
                }
                if(isProductView){
                    Swal.close();
                    
                    Swal.fire({
                        title: "Back To Salesman View First.",
                        text: "Disable Product Category View"
                    });
                    setTimeout(()=>{
                        Swal.close();
                    },3000);
                    
                    return;
                }

                var selectedDate = start.format('YYYY-MM-DD');
                date_selected = selectedDate
                $('#lateDateHolder').val(selectedDate);
                var today = moment().format('YYYY-MM-DD');
                date_today = today;
                $('#categoryTable').hide();
                MarkersFunc.deleteMarkers();
                
                if(selectedDate == today){
                    realTimeChecker = 1;
                    dispCurrentTime.resume();
                    displayAllData.resume();
                    // $('#lateSalesman').show();
                    // lateSalesman();
                    // forceLoadDashboard();
                    // forceLoadHtmlDashboard();
                    
                    // adjsutMap();
                    // getMapOverviewDetails();
                    SourceDataFunc.createMainList();
                    
                    $('.manualRefresh').show();
                    $('.dynamicRefresher').show();
                }else{
                    realTimeChecker = 0;
                    dispCurrentTime.pause();
                    displayAllData.pause();

                    $('#dashboardDisplay').html('');
                    
                    SourceDataFunc.createMainList_PREV();
                    // viewPrevious_markerDetails(selectedDate);
                    // viewPrevious_tableDetails(selectedDate);
                    // viewPrevious_totalSales(selectedDate);
                    // getMapOverviewDetails();
                    // // viewPrevious_getLate(selectedDate);
                    DatetimeFunc.getPreviousDay(selectedDate);
                    if(dateToTextSelected == undefined){
                        dateToTextSelected = 'SUN';
                    }
                    $('#time').html('<b>'+dateToTextSelected+'</b> | PREVIOUS DATA | ' + selectedDate);
                    
                    $('.manualRefresh').hide();
                    $('.dynamicRefresher').hide();
                }
                
                mdCodeHolder ='';
                $('.salesmanCatIndi').html('Operation Type <span class="mdi mdi-chevron-down"></span>');
                LeftDataFunc.defaultLeftScreen(true);
            }, 2000);
        });
    },

    DisplayCurrentTime() {
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
        $('#lateDateHolder').val(DatetimeFunc.getDate());
        lblTime.innerHTML = day+ ' | ' + DatetimeFunc.getDate() +' | '+ time;
    },

    getDate(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;  
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 

        today =  yyyy+'-'+ mm + '-' + dd;
        return String(today);
    },

    checkTime(timeString) {
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
            if (hours > 8 || (hours === 8 && minutes > 0)) {
                checkTime = false;
            } else {
                checkTime = true;
            }
        } else {
            checkTime = false;
        }
        return checkTime;
    },

    getTodaysDate(){
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();
        var formattedDate = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');

        todaysDate = formattedDate;
        date_selected = todaysDate;
    },

    getPreviousDay(selectedDate) {
        var selected = new Date(selectedDate); 
        var days = ['', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        for (var x = 1; x < days.length; x++) {
            if (selected.getDay() == x % 7) {
                dateToTextSelected = days[x];
            }
        }

        // var lblTime = document.getElementById("time");
        // lblTime.innerHTML = day+ ' | ' + DatetimeFunc.getDate() +' | '+ time;
        $('#time').html('<b>'+dateToTextSelected+'</b> | PREVIOUS DATA | ' + selectedDate);
    }
}

const LeftDataFunc = {
    marker_leftDetails(dataArray){
        // $('#upperMainDiv, #mtdOverviewMainDiv').css("visibility", "visible");
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
        DefaultFunc.checkImg(datatable_imgLink,dataArray.mdCode);
        $("#hiddenInput_mdCode").val(dataArray.mdCode);
        $("#left_salesman_name").html(dataArray.Salesman);
        $("#left_salesman_type").html(salesmanType(dataArray.DefaultORDType));
        $("#left_salesman_num").html(dataArray.mobileNo);
        $("#left_calltime").html(dataArray.calltime);
        $("#left_dateTime_transaction").html((dataArray.TransTime).split('.')[0]);
        $("#left_salesman_remarks").html(currentHTML + dataArray.alert.toUpperCase());
        $('#left_Loc').html(storename);
        $('#left_LocAddress').html(dataArray.address);
        
        $('#left_completedDist').html(dataArray.specificComputedDistStr);
        $('#left_dateVisited').html(moment(dataArray.deliveryDate).format("MMM DD, YYYY"));
        $('#left_timeVisited').html(time);
        $('#left_dateBooking').html(moment(dataArray.deliveryDate).format("MMM DD, YYYY"));
        $('#left_batteryLife').html(getBatteryLife(dataArray.Customer) + "% battery usage");
        DefaultFunc.checkStoreImg(imglink, dataArray.customerID);
        $('.storeLocBtnPinNumber').html(dataArray.transCount);
        $('#left_storeLocTransacNumber').val(dataArray.transCount);
        $("#left_transactionID").val(dataArray.transactionID);
        $('#currentLocStoreBtnVal').val(latitudeLongitude);
        $('.storeFootCol p ').html("Sales: <span class='fw-bold'> ₱ "+dataArray.Sales+"</span><span class='fw-light'> ("+dataArray.noSku+" SKU)</span>")
        $('.totalSales').html('<span class="mdi mdi-currency-php"></span> '+dataArray.Sales+' ');
        $('.totalSku').html(' ('+dataArray.noSku+' SKU)');

        LeftDataFunc.defaultLeftScreen(false);
        $('.transacDets').hide();
        $('#left_transaction-details-holder').hide();
        onViewLeftTransacDetails = false;
        if(mdCodeHolder != dataArray.mdCode){
            mdCodeHolder = dataArray.mdCode;
            var dateCall = $('#lateDateHolder').val();
            mtdOverviewMainCall(dataArray.mdCode, dateCall);
        }
    },

    othMarker_leftDetails(dataArr){       
        $('#left_Loc').html(dataArr.custName);
        $('#left_LocAddress').html(dataArr.address);
        $('#left_completedDist').html("---");
        $('#left_timeVisited').html((dataArr.trnDate)?(dataArr.trnDate.split(" ")[1]).split(".")[0] : "---");
        $('#left_dateVisited').html((dataArr.trnDate)? moment(dataArr.trnDate).format("MMM DD, YYYY") : "---");
        $('#left_batteryLife').html("");
        checkStoreImg(imglink, dataArr.custCode);
        $('.storeLocBtnPinNumber').html("-");
        $('#left_storeLocTransacNumber').val(-1);
        $("#left_transactionID").val(dataArr.transactionID);
        $('#salesman-code').val(dataArr.mdCode);
        $('#currentLocStoreBtnVal').val(dataArr.latitude +" "+dataArr.longitude);

        $('.totalSales').html('<span class="mdi mdi-currency-php"></span> 0.00 ');
        $('.totalSku').html(' (- SKU)');
    },

    remarkSalesmanClick_left(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime){
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

        DefaultFunc.checkImg(datatable_imgLink,mdCode);
        $("#left_salesman_name").html(salesman);
        $("#left_salesman_num").html(mobileNo);
        $("#left_calltime").html(calltime);
        $("#left_dateTime_transaction").html(date);
        var currentHTML = $("#left_salesman_remarks").html(); // Get the current HTML content of the element
        $("#left_salesman_remarks").html(currentHTML + alert.toUpperCase()); // Append the current HTML content to itself
        $('#left_Loc').html(customerLocation);

        var markers = allMarkersList;
        for(var i = 0; i<markers.length;i++){
            if((markers[i].dataArr.Customer.includes(customerLocation)) && markers[i].dataArr.transCount == "1"){

                $('#left_LocAddress').html(markers[i].dataArr.address);
                $('#left_completedDist').html(markers[i].dataArr.specificComputedDistStr);
                $('#left_dateVisited').html(moment(markers[i].dataArr.deliveryDate).format("MMM DD, YYYY"));
                $('#left_timeVisited').html(date);
                $('#left_dateBooking').html(moment(markers[i].dataArr.deliveryDate).format("MMM DD, YYYY"));
                $('#left_batteryLife').html(getBatteryLife(markers[i].dataArr.Customer) + "% battery usage");
                DefaultFunc.checkStoreImg(imgstorelink, markers[i].dataArr.customerID);
                $('.storeLocBtnPinNumber').html(markers[i].dataArr.transCount);
                $('#left_storeLocTransacNumber').val(markers[i].dataArr.transCount);
                $("#left_transactionID").val(markers[i].dataArr.transactionID);
                $('#salesman-code').val(mdCode);
                $('#currentLocStoreBtnVal').val(latLng);
                $('.totalSales').html('<span class="mdi mdi-currency-php"></span> '+markers[i].dataArr.Sales+' ');
                $('.totalSku').html(' ('+markers[i].dataArr.noSku+' SKU)');
            }
        }
    },

    getTransactionDisplayLeft(){
        $('.loadingTransactions').show();
        onViewLeftTransacDetails = !onViewLeftTransacDetails;
        $("#left_transaction-details-holder table").remove();
        var transactionID = $('#left_transactionID').val();

        if(onViewLeftTransacDetails){
            $('.kpimainContainer').hide();
            $('.transacDets').show();
            $('.transactionContainer').show();
            $('#left_transaction-details-holder').show();
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {"type":"getTransactionDetails", "transactionID":transactionID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
                dataType: "html", 
                crossDomain: true,
                cache: false,
                success: function(response){ 
                    $('#left_transaction-details-holder').html('').append(response);
                    $('#left_transaction-details-holder table').addClass('table');
                    $('#left_transaction-details-holder').addClass('height-details');
                }//success
            }).done(function(){
                $('.loadingTransactions').hide();
            });
        } else{
            $('.kpimainContainer').show();
            $('.transacDets').hide();
            $('.transactionContainer').hide();
            $('#left_transaction-details-holder').hide();
        }
    },

    remarkSalesmanClick_mainCall(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime){
        // if (document.fullscreenElement) {
        //     $('#salesmanCategory').fadeOut('normal', function() {
        //         $('#dispModal_deviation').fadeIn('normal');
        //     })
        // }

        // $('#upperMainDiv, #mtdOverviewMainDiv').css("visibility", "visible");

        MapFunc.restoreLoc();
        infoWindow.close(); 
        MarkersFunc.deleteBounce();    
        allMarkersList[allMarkersList.length - 1].setAnimation(null);
        // remarkSalesmanClick(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime);
        LeftDataFunc.remarkSalesmanClick_left(salesman, transaction, date, time, alert, mobileNo, mdCode, mdColor, customerLocation, latLng, thumbnail, calltime);
        if(mdCodeHolder != mdCode){
            mdCodeHolder = mdCode;
        }
        var dateCall = $('#lateDateHolder').val();
        mtdOverviewMainCall(mdCode, dateCall);

        LeftDataFunc.defaultLeftScreen(false);
        $('.transacDets').hide();
        $('#left_transaction-details-holder').hide();
        onViewLeftTransacDetails = false;
        MapFunc.showSalesmanOnMap(mdCode);
    },

    defaultLeftScreen(isDefault){
        if(isDefault){
            $('#upperMainDiv, #mtdOverviewMainDiv').fadeOut('normal', function() {
                $('#defaultPopUpScreen').fadeIn('normal');
            });     
        } else{
            $('#defaultPopUpScreen').fadeOut('normal', function() {
                $('#upperMainDiv, #mtdOverviewMainDiv').fadeIn('normal');
            });
        }

    },

    
}

class IntervalTimer {
    constructor(callback, initialInterval, subsequentInterval) {
        this.callback = callback;
        this.initialInterval = initialInterval;
        this.subsequentInterval = subsequentInterval;

        this.timerId = null;
        this.startTime = null;
        this.remaining = 0;
        this.interval = initialInterval;
        this.state = 0; // 0 = idle, 1 = running, 2 = paused

        // Start with the initial interval
        this.start();
    }

    start() {
        this.startTime = new Date();
        this.state = 1;
        this.timerId = window.setTimeout(() => {
            this.callback();
            this.changeInterval(this.subsequentInterval);
        }, this.initialInterval);
    }

    pause() {
        if (this.state !== 1) return;
        console.log("-- pause");
        this.remaining = this.interval - (new Date() - this.startTime);
        window.clearTimeout(this.timerId);
        window.clearInterval(this.timerId);
        this.state = 2;
    }

    resume() {
        if (this.state !== 2) return;
        console.log("-- resume");
        this.state = 1;
        this.timerId = window.setTimeout(() => this._timeoutCallback(), this.remaining);
    }

    _timeoutCallback() {
        if (this.state !== 1) return;
        this.callback();
        this.startTime = new Date();
        this.timerId = window.setInterval(this.callback, this.interval);
        this.state = 1;
    }

    changeInterval(newInterval) {
        this.interval = newInterval;
        console.log("-- change interval:", newInterval);
        if (this.state === 1) {
            window.clearInterval(this.timerId);
            this.timerId = window.setInterval(this.callback, newInterval);
            this.startTime = new Date();
        }
    }

    stop() {
        console.log("-- stop");
        window.clearTimeout(this.timerId);
        window.clearInterval(this.timerId);
        this.state = 0;
        this.remaining = 0;
    }
}

class IntervalTimer2 {
    constructor(callback, initialInterval, subsequentInterval) {
        this.callback = callback;
        this.initialInterval = initialInterval;
        this.subsequentInterval = subsequentInterval;

        this.timerId = null;
        this.startTime = null;
        this.remaining = 0;
        this.state = 0; // 0 = idle, 1 = running, 2 = paused, 3 = resumed
        this.interval = initialInterval;

        // kick off initial timeout
        this.startTime = new Date();
        this.timerId = window.setTimeout(this.initialTimeoutCallback.bind(this), this.initialInterval);
        this.state = 1;
    }

    pause() {
        if (this.state !== 1) return;
        console.log('-- pause');
        this.remaining = this.interval - (new Date() - this.startTime);
        window.clearInterval(this.timerId);
        this.state = 2;
    }

    resume() {
        if (this.state !== 2) return;
        console.log('-- resume');
        this.state = 3;
        window.setTimeout(this.timeoutCallback.bind(this), this.remaining);
    }

    timeoutCallback() {
        if (this.state !== 3) return;

        this.callback();

        this.startTime = new Date();
        this.timerId = window.setInterval(this.callback, this.interval);
        this.state = 1;
    }

    changeInterval(newInterval) {
        console.log('-- change interval: ' + newInterval);
        this.interval = newInterval;
        if (this.state === 1 || this.state === 3) {
            window.clearInterval(this.timerId);
            this.timerId = window.setInterval(this.callback, newInterval);
            this.startTime = new Date();
        }
    }

    initialTimeoutCallback() {
        this.callback();
        this.changeInterval(this.subsequentInterval);
    }
}

$('.defaultPopUpScreen-owl-carousel').owlCarousel({
    items: 3,
    center: true,
    loop: true,
    margin: -8,
    nav: false,
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



$('#unprodSW').prop('checked', false);
$('#unvisitedSW').prop('checked', false);
$('#showRouteSW').prop('checked', false);
$('#categoryBox').prop('checked', false);

$('.popup_sliderDiv').on('click', function(e) {
    if (e.target === this) {
        closePopUp();
    }
});


$('#unprodSW')
    .prop('checked', false)
    .on('click', function () {
        toggleUnprodMarkers($(this).is(':checked'));
    });

$(".othBtnUnpro").on('click', function () {
    let currentState = $('#unprodSW').is(':checked');
    let newState = !currentState;  
    $('#unprodSW').prop('checked', newState);
    toggleUnprodMarkers(newState);
});


$('#unvisitedSW')
    .prop('checked', false)
    .on('click', function () {
        toggleUnvisitedMarkers($(this).is(':checked'));
    });

$(".othBtnUnvisited").on('click', function () {
    let currentState = $('#unvisitedSW').is(':checked');
    let newState = !currentState;  
    $('#unvisitedSW').prop('checked', newState);
    toggleUnvisitedMarkers(newState);
});


$('#showRouteSW')
    .prop('checked', false)
    .on('click', function () {
        toggleRouteMarkers($(this).is(':checked'));
    });

$(".othBtnRoute").on('click', function () {
    let currentState = $('#showRouteSW').is(':checked');
    let newState = !currentState; 
    $('#showRouteSW').prop('checked', newState);
    toggleRouteMarkers(newState);
});


$('#categoryBox')
    .prop('checked', false)
    .on('click', function () {
        ProductDataFunc.toggleProduct($(this).is(':checked'));
    });

$(".categoryBtnRoute").on('click', function () {
    let currentState = $('#categoryBox').is(':checked');
    let newState = !currentState;  

    if(!isShowLine && !isShowUnpro && !isShowUnvi){
        $('#categoryBox').prop('checked', newState);
        ProductDataFunc.toggleProduct(newState);
    } else{
        Swal.fire({
            title: "Restore Map Markers First.",
            text: "Double Click on Map To Restore"
        });
        setTimeout(()=>{
            Swal.close();
        },3000);
    }
});


