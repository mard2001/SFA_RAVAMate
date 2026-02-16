var userID = localStorage.getItem('user_id');
var user = localStorage.getItem("adminUserName");
var usernm = localStorage.getItem("username");
var usertype = localStorage.getItem("usertype");
var site_lat = localStorage.getItem("latitude");
var site_long = localStorage.getItem("longitude"); 
var site_mapzoom = localStorage.getItem("mapzoom"); 

var map;
var territoryColor = document.getElementById("terrcolor");
var GlobalColor = "";
//interval to get geofences
var countSalesman; 
var startPickDate, endPickDate, if1dayisSelected, daydiff=0;
var countSalesResults = 0;
var countSalesResultsCtr = 0;
var productMarker = [];
var lat1 = 0, lon1 = 0;
var names=[];
var ids=[];
var salesmanID=[];
var dateMPA=[];
var color=[];
var markers = [];
var latlng_heatmaHolder;
var markerProd;
var productName, brandMarker;
var Longitude = [];
var Latitude = [];
//alert boundary
var salesmanName=[];
var newdata = [];
var customer = [];
var marker = [];
var heatmapArr = [];
var myLatlng, mapOptions, marker, mpaPolygon, contentString = "", mpa_coords = [[]];
var mpa_header=[[]];  //DATA TO HOLD THE LONG AND LAT
var mpa_polygon=[];
var md_lang = [];
var md_lat = []; 
var myLatlng_buddy = [];
var displayAllData;
var heatmap, sitelat, sitelng, sitezoom;
var lat1 = 0, lon1 = 0;
var names=[];
var ids=[];
var salesmanID=[];
var dateMPA=[];
var markClustering;
var markerClustererHolder;
var filteredArray = [];
var MCPDayMarkerColor = ['000','ff3419', '30965d', 'e3db32', '5b2770', 'f76c00', '094375'];
var isMarkerColorsPerDay = false;
var isShown_salesmappingMainCont = true;
var currentData_vansales_arr;
var currentData_booking_arr;
var currentData_others_arr;
var currentData_vansales_totalSales;
var currentData_booking_totalSales;
var currentData_others_totalSales;
var salesmanMap_sourceData = [];
var tableData1v2;

var GBLSITEINDI_SOSYO;
var GLOBALDISTDBNAME;
var drawingManager;
var GBLPOLYGON;
var geofence_tableData;
var sourceDataGeofence = [];
var inside_fence_markers = [];
var insidemarkers = [];
var allFences;
var sosyocustomer = 0;
var sosyomarkers = [];
var sosyomarker = [];
var sosyoStoresArrHolder = [];
var sysproStoresArrHolder = [];

var isIncludeSosyo = 0; // 0 - false, 1 - true
var isIncludeSyspro = 1; // 0 - false, 1 - true
var isFilteredChannel = 0; // 0 - false, 1 - true
var filteredChannelArr = [];

var gtmArrSelectList = [];
var salesmanSelectList = [];

var defaultData = 1; // 0 - false, 1 - true; default data is when it is not yet filtered.

var productMarkers = [];
var sourceDataSelectedProducts = [];
var totalTransacSales = 0;

var heatmapRadius = 20;



VirtualSelect.init({
    ele: '#gtmList',
});

VirtualSelect.init({
    ele: '#salesmanList',
});

VirtualSelect.init({
    ele: '#channelList',
});

VirtualSelect.init({
    ele: '#prodCategoryList',
});

// determineUserType(usertype); 
siteLocation();
// getcompname();
getcompname_dynamic("Territory Geofencing", "headingTitle");
flip4();
geofenceDataTable();
getChannel();
setDataTable1v2();
productDataTable();


function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#headingTitle').html(r[0].company.toUpperCase() +' | Territory Geofencing');
            GBLSITEINDI_SOSYO = r[0].DIST_CD;
            GLOBALDISTDBNAME = r[0].DIST_INDI;
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
            if(response.unseen_notification > 0){
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
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"UPDATE_DIGITALMAPPING", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
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
        }).done(function (){
            setTimeout(function(){
                $('#updateBtn').html("Update");
                $('#updateBtn').prop('disabled', false);
            }, totalTime);
        });
    }
}

history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});

setInterval(function () { 
    // countSales();
}, 1000);

datePicker2();
function datePicker2(){
    var start = moment().subtract(29, 'days');
    var end = moment();

    $('#reportrange').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "maxDate": moment(),
        "opens": "left",
        "applyClass": "btn-primary",
        ranges: {
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    },
    function(start, end, label) {
        // console.log(start);
        $('#salectedDates').html(start.format('MMMM D') + ' - ' + end.format('MMMM D, YYYY'));
        var d1 = moment(start);
        var d2 = moment(end);
        if1dayisSelected = d2.diff(d1);
        console.log(if1dayisSelected);
        startPickDate = start.format('YYYY-MM-DD');
        endPickDate = end.format('YYYY-MM-DD');
        $('#salesmanSselectionModal').modal('show');
        // allSalesman_sp(startPickDate, endPickDate);
    });

    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        if(startPickDate == undefined){
            startPickDate = picker.startDate.format('YYYY-MM-DD');
        }
        if(endPickDate == undefined){
            endPickDate = picker.endDate.format('YYYY-MM-DD');
        }
        var d1 = moment(start);
        var d2 = moment(end);
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        $('#salesmanSselectionModal').modal('show');

        if(if1dayisSelected == daydiff){
            if(gtmArrSelectList.length == 0){
                document.querySelector('#gtmList').destroy();
                getImmediateHead(start, end);
            } else{
                $('#headListCont').show();
            }
        } else{
            daydiff = if1dayisSelected;
            document.querySelector('#gtmList').destroy();
            getImmediateHead(start, end);

        }
        $('#salesmanListCont').hide()
    });

     // Add a title to the container
     $('.daterangepicker').prepend('<div class="daterangepicker-title mx-1">Please Specify the Range of Sellout Dates:</div>');

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

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function storeTblValues(salesman, callback) {
    const batchSize = 50; 
    const batches = splitArrayIntoBatches(salesman, batchSize);
    var completedBatches = 0;  
    var allSuccess = true;  

    if(batches.length == 0){
        $('.closeBtn1').show();
        $('.closeBtn2').hide();

        Swal.fire({
            text: "Choose a salesman to proceed.",
            icon: "error"
        });

        return;
    }

    Swal.fire({
        html: "Checking Salesman Selected.",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    batches.forEach(batch => {
        $.ajax({
            url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type": "digitalMapping_totalsales_filter", //sir Jhun API
                "salesman": batch,
                "start": startPickDate,
                "end": endPickDate,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "json",
            crossDomain: true,
            cache: false,
            success: function (data) {
                if (data.sales == 0) {
                    allSuccess = false;
                } else {
                    countSalesResults += parseFloat((data.sales).replace(/,/g, '')); 
                    countSales(); 
                }
                completedBatches++;

                if (completedBatches === batches.length) {
                    callback(allSuccess); 
                }
            },
            error: function (error) {
                console.error("Error:", error);
                allSuccess = false; 
                completedBatches++;

                if (completedBatches === batches.length) {
                    callback(allSuccess);
                }
            }
        });
    });
}

function displaySalesManV2(){
    if(inside_fence_markers.length > 0){
        showFilteredArray();
        deleteInsideMarkers();
        $('#mdi-backtomarkers-maps-btn').hide();
        $('.geofenceBtns').hide();
    }
    var values = $('#salesmanList').val();
    
    heatmapArr = [];
        
    if(values == null){
        Swal.fire({
            text: "Please select a salesman first!",
            icon: "error"
        });
    }else if(startPickDate == undefined || endPickDate == undefined){
        Swal.fire({
            text: "Please select your date range!",
            icon: "error"
        });
    }else{
        // dashBoardData(values);
        storeTblValues(values, function(isHaveData) {
            if (isHaveData) {
                Swal.fire({
                    html: "Fetching large amount of data... Please wait...",
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                for(var i = 0; i < mpa_polygon.length; i++){ 
                    mpa_polygon[i].setMap(null);
                };

                isIncludeSosyo = 0;
                
                if(markers.length > 0){
                    ClearMarkers();
                    clearHeatMap();
                    ClearSosyoMarkers();
                    uncheckGeofence();
                    
                    markers = [];
                    filteredArray = [];
                }
                
                // $('#sideClyders').show();
                $('#showmarkerschk').prop('checked', true);
                $('#clusteringchk').prop('checked', true);
                $('#showSosyochk').prop('checked', false);
                $('#heatmapchk').prop('checked', false);
                $('#slider').hide();
                $('#colorperdaychk').prop('checked', false);
                $('.colorLegendBtn').prop('disabled', true);
                $('.dropstartColorLegendBtn').addClass('disbledBtn');   
                $('#channelchk').prop('checked', false);
                $('#geofencechk').prop('checked', false);
                isMarkerColorsPerDay = false;
                infoWindow.close();
                
                setTimeout(() => {
                    getTransacProducts(values, startPickDate, endPickDate);
                    displayGeofences();
                    uncheckGeofence();
                    $('#geofencechk').removeAttr('disabled');
                },100);

                mergeDigitalMapping(values, startPickDate, endPickDate);
                defaultData = 0;
                
                $('#showSosyochk').removeAttr('disabled');
                $('.dropstartControl').show();

                // console.log(values);
                const dataVar = new Set(markers.filter(obj => obj.id && obj.storeType === "SYSPROSTORES").map(obj => obj.id));
                // console.log(dataVar);

                const notIncludedValues = values.filter(value => !dataVar.has(value));
                
                updateMapStatus(2);

            } else {
                Swal.fire({
                    text: "No data from selected salesman.",
                    icon: "error"
                });
            }
        });       
    }//close else 

    $('.filterBtn2').hide();
    $('.filterBtn1').show();
}//display salesman funciton

function updateMapStatus(status){
    $('#mapStatusOuterCont').show();

    // Update Range Date
    if(startPickDate && endPickDate){
        $('#status_date').html( `${moment(startPickDate, 'YYYY-MM-DD').format('MMM. D, YYYY')} - ${moment(endPickDate, 'YYYY-MM-DD').format('MMM. D, YYYY')}` );
    } else{
        $('#status_date').html('---');
    }

    // Update Filtered GTM
    var gtmArr = $('#gtmList').val();
    $('#status_gtm').html( gtmArr.length == 0 ? '---' : (gtmArr.length > 1 ? `Selected (${gtmArr.length}) GTMs` : gtmArr));


    // Update Filtered Salesman
    var selectedSalesmen = document.querySelector('#salesmanList').virtualSelect.getSelectedOptions();
    var salesmanLabels = selectedSalesmen.map(option => option.label);
    $('#status_salesman').html( selectedSalesmen.length == 0 ? '---' : (selectedSalesmen.length > 1 ? `Selected (${selectedSalesmen.length}) Salesmans` : salesmanLabels ));


    // Update Map Status
    var statusText = [ '', 'Show Markers', 'Cluster', 'Heatmap', 'GeoFence' ];
    $('#status_map').html(statusText[status] || '---');


    // Update Map Filtering Status
    let filteringStatus = '---';

    if(status == 4){    
        filteringStatus = '---';
    } else {
        if (isFilteredChannel && isMarkerColorsPerDay) {
            filteringStatus = 'Filtered By Channel and Per MCP Day';
        } else if (isFilteredChannel) {
            var selectedChannels = document.querySelector('#channelList').virtualSelect.getSelectedOptions();
            var channelLabels = selectedChannels.map(option => option.label);
            filteringStatus = selectedChannels.length > 1
                ? `Filtered By (${selectedChannels.length}) Channels`
                : `Filtered By Channel (${channelLabels})`;
        } else if (isMarkerColorsPerDay) {
            filteringStatus = 'Filtered By MCP Day';
        }
    }

    $('#status_map_filtering').html(filteringStatus);
}

function mergeDigitalMapping(salesman, startdate, enddate){
    const batchSize = 50; 
    const batches = splitArrayIntoBatches(salesman, batchSize);
    var completedBatches = 0;  

    batches.forEach(batch => {
        $.ajax({
            url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
            type: "POST",
            data:{
                "type": "FETCH_DIGITALMAPPING_V2",
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE,
                "salesman": batch,
                "startdate": startdate,
                "enddate": enddate
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,
            success: function(data){
                for(var x=0; x<data.length; x++){
                    for(var y=0; y<data[x].stores.length; y++){
                        var transacCtr = (data[x].stores[y].transacCtr)? data[x].stores[y].transacCtr : 0;
                        var ttSales = (data[x].stores[y].totalSales)? (data[x].stores[y].totalSales).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0;

                        var contentString = 
                            "<div width='100%'>"+
                                "<div class='customerDetailsHeader'>"+
                                    "<h6>Customer Details <span style='font-size:12px; color: #909090'>("+data[x].stores[y].custCode+")</span></h6>"+
                                "</div>"+
                                "<div class='customerDetailsBody'>"+
                                    "<div class='d-flex mb-3'>"+
                                        "<div style='margint:0 10px 0 5px'>"+
                                            "<img class='rounded-circle' src='img/store-image.png'/>"+
                                        "</div>"+
                                        "<div class='mx-2' style='margin-top:5px;'>"+
                                            "<p class='fw-bolder mb-1' style='font-size: 15px;'><span class='mdi mdi-store-outline' style='margin-right:8px'></span>"+data[x].stores[y].custName+"</p>"+
                                            "<p class='m-0 mb-1' style='font-size: 11px;'><span class='mdi mdi-map-marker' style='font-size: 13px; margin-right:12px'></span>"+data[x].stores[y].address+"</p>"+
                                            "<p class='m-0' style='font-size: 11px;'><span class='mdi mdi-badge-account-outline' style='font-size: 13px; margin-right:12px'></span>"+data[x].salesman+"</p>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div class='d-flex justify-content-center text-center' style='background-color:#D4D4D4;color:#636363;height:30px; padding: 0 25px'>"+
                                        "<div class='d-flex justify-content-center align-items-center'>"+
                                            "<p class='m-0'><span class='mdi mdi-cart-outline mx-1'></span>"+transacCtr+" Transactions</p>"+
                                        "</div>"+
                                        "<div class='d-flex justify-content-center align-items-center' style='margin-left:15px; border-left: 1px solid #B4B4B4'>"+
                                            "<p class='m-0'><span style='margin-left:15px; '>₱</span> "+ttSales+" Total Sales</p>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div>"+
                                        "<div class='text-center py-1'>"+
                                            "<span id='indicatorImg' class='customerHolder' onClick='showCustImage(\""+data[x].stores[y].custCode+"\")'>Click here to view store image</span> <i class='fa fa-picture-o storeIc' aria-hidden='true'></i>"+
                                        "</div>"+
                                        "<div id='customerData'>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";

                        marker = new google.maps.Marker({
                            storeType: 'SYSPROSTORES',
                            id: data[x].mdCode,
                            loc: data[x].stores[y].lat+' '+data[x].stores[y].lng,
                            mdName: data[x].salesman,
                            type: (data[x].type).trim(),
                            markerColor: (data[x].mdColor).replace("#", ""),
                            sales: parseFloat(String(ttSales).replace(/,/g, '')),
                            mcpDay: data[x].stores[y].mcpDay,
                            channel: (data[x].stores[y].Channel).trim(),
                            infowindow: infoWindow,
                            position: new google.maps.LatLng(data[x].stores[y].lat, data[x].stores[y].lng),
                            map: map,
                            content: contentString,
                            markerDataArr: data[x].stores[y], 
                            icon: {
                                url:'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/'+data[x].mdColor.substr(1),
                                scaledSize: new google.maps.Size(20, 22)
                            }
                        });

                        markers.push(marker);
                                
                        google.maps.event.addListener(marker, 'click', (function(marker, x) {
                            return function(){
                                // lat1 = data[x].stores[y].lat; 
                                // lon1 = data[x].stores[y].lng;
                                new google.maps.InfoWindow({ maxWidth: 500});
                                infoWindow.setContent(this.content);
                                infoWindow.open(map, marker);
                                checkDataTblHiden();
                            }
                        })(marker, x));

                        // ******************* heat map *********************
                        heatmapArr.push(new google.maps.LatLng(data[x].stores[y].lat, data[x].stores[y].lng));
                    }
                }

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('Ops! Something went wrong! ' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
            }
        })
        .done(function(){
            completedBatches++;

            if (completedBatches === batches.length) {
                // makeCluster();
                // heatmap();

                google.maps.event.addListener(infoWindow, 'closeclick', function() {  
                    // displayAllData.resume();
                }); 
                displaysosyostores();

                filteredArray = markers;

                getMiniDashboardData();
                ClearSosyoMarkers();
                makeCluster();

                setTimeout(() => {
                    Swal.close();
                }, 1000);
            }
        });
    });
}

function countSales(){
    var count = $('#dashboardDisplay tr').length;
    // $('#total').html('Total (' +count+ ') : <span class="fw-bold"> &#8369;' +countSalesResults.toLocaleString()+ '</span>');
    $('#total').html('Total (' +countSalesResultsCtr+ ') : <span class="fw-bold"> &#8369;' +countSalesResults.toLocaleString()+ '</span>');
}

function goBackSelect(){
    $('#headListCont').show();
    $('#salesmanListCont').hide();

    $('.filterBtn2').hide();
    $('.filterBtn1').show();

    $('.closeBtn2').hide();
    $('.closeBtn1').show();
}

var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";

function getImmediateHead(startdate, enddate){
    $('#fetchCont').show();
    $('#headListCont').hide();
    $('#salesmanListCont').hide();
    $.ajax({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data:{
            "type": "immediateHead_list_digimap",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            "startdate": startdate,
            "enddate": enddate
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            $('#fetchCont').hide();
            $('#headListCont').show();
            // console.log(data);
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x], value: data[x] };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#gtmList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select GTM'
            });

            gtmArrSelectList = myOptions;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Ops! Something went wrong! ' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
        }
    })
}

$('#salesmanSselectionModal').on('hidden.bs.modal', function () {
    $('.filterBtn1').show();
    $('.filterBtn2').hide();
});

function allSalesman_sp(start, end, heads){
    //$('.loading-table').show();
    $('#fetchCont').show();
    $('#salesmanListCont').hide();
    var ajaxTime= new Date().getTime();
    var totalTime= 0;
    $.ajax ({
        // url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php", 
        // type: "GET",
        // data: {"type":"salesman_list_digimap", "CONN":con_info, "start":start, "end":end},
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data:{ "type": "salesman_list_digimap_v2", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "immediateHeads": heads, "startdate": start, "enddate": end },
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(data){
            $('#salesmanListCont').show();
            $('#fetchCont').hide();
            $('#salesmanList').html('');

            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }

            VirtualSelect.init({
                ele: '#salesmanList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Salesman'
            });
        }//success here;
    }).done(function () {
        $('.closeBtn2').prop('disabled', false);
        $('.filterBtn2').prop('disabled', false);
        setTimeout(function(){

        }, totalTime);
    });
}

function allSalesman_sp2(start, end, heads){
    //$('.loading-table').show();
    $('#salesmanListCont').hide();

    if(salesmanSelectList.length == 0){
        $('#fetchCont').show();
        $.ajax ({
            url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
            type: "POST",
            data:{ "type": "all_salesman_list_digimap_v2", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "startdate": start, "enddate": end },
            dataType: "json",
            crossDomain: true,
            cache: false,
            success: function(data){
                $('#salesmanListCont').show();
                $('#fetchCont').hide();
                $('#salesmanList').html('');

                var myOptions = [];
                for (var x = 0; x < data.length; x++) {
                    var obj = { label: data[x].mdName, value: data[x].mdCode, immediateHead: data[x].ImmediateHead };
                    myOptions.push(obj);
                }
                salesmanSelectList = myOptions;
                var filteredSalesmanOption = myOptions.filter(salesman => {
                    var salesmanhead = salesman.immediateHead;
                    return heads.includes(salesmanhead);
                });

                VirtualSelect.init({
                    ele: '#salesmanList',
                    options: filteredSalesmanOption,
                    search: true,
                    maxWidth: '100%', 
                    placeholder: 'Select Salesman'
                });

            }//success here;
        }).done(function () {
            $('.closeBtn2').prop('disabled', false);
            $('.filterBtn2').prop('disabled', false);
        });
    } else{
        $('#salesmanListCont').show();
        $('#fetchCont').hide();
        $('#salesmanList').html('');

        var filteredSalesmanOption = salesmanSelectList.filter(salesman => {
            var salesmanhead = salesman.immediateHead;
            return heads.includes(salesmanhead);
        });

        VirtualSelect.init({
            ele: '#salesmanList',
            options: filteredSalesmanOption,
            search: true,
            maxWidth: '100%', 
            placeholder: 'Select Salesman'
        });

        $('.closeBtn2').prop('disabled', false);
        $('.filterBtn2').prop('disabled', false);
    }
    
}

function displayChosenSalesman(){
    if($('#gtmList').val().length == 0){
        $('#salesmanSselectionModal').modal('hide');

        Swal.fire({
            text: "Please select a GTM first!",
            icon: "error"
        });
        return;
    }

    $('#fetchCont').show();
    $('#headListCont').hide();

    $('.filterBtn1').hide();
    $('.filterBtn2').show().prop('disabled', true);
    

    $('.closeBtn1').hide();
    $('.closeBtn2').show().prop('disabled', true);
    var gtmArr = $('#gtmList').val();
    document.querySelector('#salesmanList').destroy();
    allSalesman_sp2(startPickDate, endPickDate, gtmArr);   
}

var sourceData1 = [];

function splitArrayIntoBatches(mdCode_Array, batchSize) {
    let result = [];
    for (let i = 0; i < mdCode_Array.length; i += batchSize) {
        result.push(mdCode_Array.slice(i, i + batchSize));
    }
    return result;
}

function dashBoardData(values){
    const batchSize = 50; 
    const batches = splitArrayIntoBatches(values, batchSize);
    sourceData1 = [];

    batches.forEach(batch => {
        $.ajax({
            url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
            type: "POST",
            data: {
                "type": "digital_mapping_table_data_v2", // API from Sir Jhun
                "resultSalesman": batch,  
                "start": startPickDate,
                "end": endPickDate,
                "userID": GBL_USERID,
                "distCode": GBL_DISTCODE
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,      
            success: function(res){ 
                // console.log('response: '+ JSON.stringify(res, null, 2));
                // var res = JSON.parse(response);
                
                countSalesResultsCtr += res.length;
                res.forEach(function(item) {
                    item.salesmanNameRow = "<i class='fas fa-map-marker' style='color:"+item.mdColor+"; font-size:13px; margin-right:5px;'></i>"+item.mdName;
                    item.calls = item.pCalls + "|" + item.tcalls;
                    item.Type = item.Type.trim();

                    sourceData1.push(item);
                });
                // sourceData1 = res;
            }, error: function (err, statusText, errorThrown) {
                // Display detailed error information
                alert("Status: " + statusText + "\nError Thrown: " + errorThrown + "\nResponse: " + err.responseText);
            }
        });
    });

    // tableData1.clear().rows.add(sourceData1).draw();
    countSales();
}

function setDataTable1v2(){
    tableData1v2 = new DataTable('#salesMappingTable',{
        dom: '<"m-1"<"d-flex justify-content-end"f>rt<"d-flex justify-content-between" ip>>',
        pageLength: 10,
        order: true,    
        responsive: false,
        source: salesmanMap_sourceData,
        bSort: true,
        // scrollY: '200px',
        "autoWidth": false,
        columns: [
        // { data: "salesmanType", title:"Type"},
        { data: "salesmanName", title:"Salesman Name"},
        { data: "stores", title:"Stores"},
        { data: "sales", title:"Sales" },
        { data: "percentage", title:"%" },
        ],
        columnDefs: [
        {
            targets: [1,3],
            className: 'text-center'
        },
        ],
        rowCallback: function(row, data, index){
        $(row).find('td:eq(2)').text('₱' + data.sales);
        $(row).find('td:eq(3)').text(data.percentage + '%');
        }  
    });

    $('.dt-search input[type="search"]').on('keyup', function() {
        var searchedData = tableData1v2.search(this.value).draw();
        getTblTotalv2(searchedData);
    });
}

function getTblTotal(dataTables){
    var filteredData = dataTables.rows({ search: 'applied' }).data();
    var tblTotal = 0;
    var dataTotalCtr = filteredData.length;

    filteredData.each(function(row) {
        var amountStr = row.sales;
        let SalesString = amountStr.replace(/₱/g, '');
        let SalesAmt = parseFloat(SalesString.replace(/,/g, ''));
        tblTotal+=SalesAmt;
    });

    $('#total').html('Total (' +dataTotalCtr+ ') : <span class="fw-bold"> &#8369;' +tblTotal.toLocaleString()+ '</span>');
}

function getTblTotalv2(dataTables){
    var filteredData = dataTables.rows({ search: 'applied' }).data();
    var tblTotal = 0;
    var dataTotalCtr = filteredData.length;

    filteredData.each(function(row) {
        var amountStr = row.sales;
        let SalesString = amountStr.replace(/₱/g, '');
        let SalesAmt = parseFloat(SalesString.replace(/,/g, ''));
        tblTotal+=SalesAmt;
    });

    $('#salesmap_total').html('Total (' +dataTotalCtr+ ') : <span class="fw-bold"> &#8369;' + tblTotal.toLocaleString()+ '</span>');

}

function showmarkersback(){
    for(var x = 0; x < markers.length; x++){
        markers[x].setMap(map);
    }
}

function showSalesmanOnMap(mdCode){
    filteredArray = [];
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

        if(mdCode == markers[x].id){
            filteredArray.push(markers[x]);
        }
        $('#clusteringchk').prop('checked', false);
        clearMarkCluster();
        $('#heatmapchk').prop('checked', false);
        $('#slider').hide();
        clearHeatMap();
        $('#showmarkerschk').prop('checked', true);
    }//for
}

function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function hideFilteredArray() {
    for (var i = 0; i < filteredArray.length; i++) {
        filteredArray[i].setMap(null);
    }

    $('.sideClydersBody input[type="checkbox"]').attr('disabled','disabled');
    $('.colorLegendBtn').prop('disabled', true);
    $('.heatMapBtn').prop('disabled', true);
    $('.ProductiveBtn').prop('disabled', true);
}

function showFilteredArray() {
    deleteInsideMarkers();
    if(filteredArray.length > 0){
        $('.geofenceBtns').show(300);
    }
    for (var i = 0; i < filteredArray.length; i++) {
        filteredArray[i].setMap(map);
    }
    $('#clusteringchk').prop('checked', false);
    $('#heatmapchk').prop('checked', false);
    $('#slider').hide();
    $('#showSosyochk').prop('checked', true);
    isIncludeSosyo = 1;
    $('#showmarkerschk').prop('checked', true);
    isIncludeSyspro = 1;
    $('.sideClydersBody input[type="checkbox"]').removeAttr('disabled');
    $('.colorLegendBtn').prop('disabled', false);
    $('.heatMapBtn').prop('disabled', false);
    $('.ProductiveBtn').prop('disabled', false);
    $('#mdi-backtomarkers-maps-btn').hide(300);
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
    if($('.arrow-side-icon').hasClass('fa-angle-left')){
        $('.arrow-side-icon').removeClass('fa-angle-left').addClass('fa-angle-right');
    } else {
        $('.arrow-side-icon').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
    // $('.arrow-side-icon-toggleZoom').toggleClass('fa-angle-right');
}


function flip4() {
    $(".salesmappingMainCont").animate({width:'toggle'},350);
    if($('.arrow-side-icon4').hasClass('fa-angle-left')){
        $('.arrow-side-icon4').removeClass('fa-angle-left').addClass('fa-angle-right');
        isShown_salesmappingMainCont = false;
    } else {
        $('.arrow-side-icon4').removeClass('fa-angle-right').addClass('fa-angle-left');
        isShown_salesmappingMainCont = true;
    }
}  

function flip5() {
    $(".geofenceMainCont").animate({width:'toggle'},350);
    if($('.arrow-side-icon5').hasClass('fa-angle-left')){
        $('.arrow-side-icon5').removeClass('fa-angle-left').addClass('fa-angle-right');
    } else {
        $('.arrow-side-icon5').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
}  

function flip6() {
    $(".productMainCont").animate({width:'toggle'},350);
    if($('.arrow-side-icon6').hasClass('fa-angle-left')){
        $('.arrow-side-icon6').removeClass('fa-angle-left').addClass('fa-angle-right');
    } else {
        $('.arrow-side-icon6').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
}  
$('#categoryTable').removeClass('hidden');
$('#CM_salesmanCategory').fadeOut('fast');
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
    removeProdutMarker();
    displaySalesManV2();
    restoreLoc();
    
    $("#salesmanCategory").slideDown();
    $('#categoryTable').hide();
    
    $('#salesmanBtn').hide();
    $('#productBtn').show();
    $('#outerContainer_id .loading-table').hide();
});

$('.categoryProp table thead').click(function (){
    removeProdutMarker();
    showAllProduct();
});

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

function showAllProduct(){
    $('.loading-table').show();
    var ajaxTime= new Date().getTime();
    var totalTime= 0;
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"getAllProduct_digiMapFilter","start":startPickDate, "end":endPickDate, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"dashBoardData_product_digiMapFilter","start":startPickDate, "end":endPickDate, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,          
        success: function(response){ 
        $('#cateogoryDataTable').html(response.tableDetails);
        $('.footerDetails').html(response.footerDetails);
        }//success
    });
}

function brand(){
    $(".brandName").click( function() {
        var productName = $(this).closest('td').text().trim();
        $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"getProduct_digiMapFilter", "productName":productName, "start":startPickDate, "end":endPickDate, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
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
var infoWindow = new google.maps.InfoWindow;

function defaultStore(image) {
    image.onerror = "";
    image.src = "img/store-image.png";
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
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"displayCustImage", "custID":custID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "JSON",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
        var content = "<table class='storeImageTable'><tr><td><img onError='defaultStore(this)' class='store1' src='https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/"+custID+"_1.jpg'/></td>"+
        "<td><img onError='defaultStore(this)' src='https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/"+custID+"_2.jpg'/></td></tr><tr><td>Outside View</td><td>Inside View</td></tr><table/>"; 
        $('#customerData').append(content);      
        }
    }).done(function () {
        setTimeout(function(){
        $('#indicatorImg').html("");
        }, totalTime);
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
        $("#setSatellite .earthtogglebtn1", this).toggleClass("mdi-earth mdi-map-outline");
        if (map.getMapTypeId() != google.maps.MapTypeId.HYBRID) {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID)
            map.setTilt(0); // disable 45 degree imagery
        }else if(map.getMapTypeId() != google.maps.MapTypeId.ROADMAP){
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
            map.setTilt(0); // disable 45 degree imagery
        }
    });

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

siteLocation();
init();
$('#restorBtn').hide();
$('#mdi-backtomarkers-maps-btn').hide();

Swal.fire({
    html: "Fetching All Customer Data... Please wait...",
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => {
        Swal.showLoading();
    },
});

function init(){   
    function onSuccess(position) {
        var lat, lang;
        lat = parseFloat(sitelat);
        lang = parseFloat(sitelng);
        zoomLevel = parseInt(sitezoom);
        myLatlng = new google.maps.LatLng(lat, lang);
        mapOptions = {
            zoom: zoomLevel, 
            maxZoom: zoomLevel + 10,
            center: myLatlng,
            mapTypeId: 'roadmap',
            controlSize: 25,
            zoomControl: false,
            scaleControl: false,
            streetViewControl: false,
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
        heatmap1 = new google.maps.visualization.HeatmapLayer({
        });

        // AutocompleteDirectionsHandler(map, "outerContainer_id");
        new mapBtnsContainer(map, "mapBtnsContainer1");
        new mapControls(map);
        new dataTableCont(map);
        new proceedBtn(map);
        new digiMapDashboardCont(map);
        new mapStatusSection(map);

        streetView();

        map.addListener('dragend', function() {
            // $('#mapUserControlCont').fadeIn();
            $('#restorBtn').fadeIn();
        });

        enterFullScreen();
        zoomOut();
        zoomIn();
        // setSatellite();

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
        // drawingManager.setMap(null);

        //when polygon is formed
        google.maps.event.addListener(drawingManager,'polygoncomplete',function(polygon) {
            $('#proceed-mpa-btn').removeAttr('disabled');
            
            polygon.setEditable(true);
            GBLPOLYGON = polygon;
            getsosyostores(polygon);

            $('#mdi-eraser-maps-btn').click(function() {
                erase(polygon);
                geofence_tableData.clear().draw();
                $('#proceed-mpa-btn').attr('disabled','disabled');
                $('#dataTableGeoFenceTotalSales').html('');
                $('#geofencing_overAllTotal').hide();
            });

            google.maps.event.addListener(polygon.getPath(), 'set_at', function() {
                // Editing Polygon
                getsosyostores(polygon);
            });

            google.maps.event.addListener(polygon.getPath(), 'insert_at', function() {
                // Adding new Vertex in Polygon
                getsosyostores(polygon);
            });
        });

        $('#mdi-hand-back-left-outline-maps-btn').click(function (){
            drawingManager.setMap(null);
            drawingManager.setDrawingMode(null);
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
    
        map.addListener('click', function() {
            infoWindow.close(); 
            deleteBounce();    
            filteredArray = markers;
            checkDataTblHiden();
        });

        setTimeout(() => {
            // displayGeofences();
            getAllStores();
            
            // $('#digitalMapping_MainDiv .maploaderDiv').fadeOut();
            $('#showSosyochk').prop('checked', false);
            $('#showSosyochk').attr('disabled','disabled');
            $('#showmarkerschk').prop('checked', true);
            $('#clusteringchk').prop('checked', false);
            $('#heatmapchk').prop('checked', false);
            $('#slider').hide();
            $('#colorperdaychk').prop('checked', false);
            $('.colorLegendBtn').prop('disabled', true);
            $('.dropstartColorLegendBtn').addClass('disbledBtn');  
            $('#channelchk').prop('checked', false);
            $('#geofencechk').prop('checked', false);
            $('#geofencechk').attr('disabled','disabled');
        }, 2000);

        
    }//onSuccess  
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }//onError    

  google.maps.event.addDomListener(window, 'load', onSuccess);

}//init

function getMiniDashboardData(){
    var sourcedata = [];
    var salesmanCtr = 0;
    var storesCtr = 0;
    var accumSales = 0;

    if(isIncludeSyspro){
        sourcedata = [...sourcedata, ...filteredArray.filter(marker => marker.storeType == "SYSPROSTORES" && marker.map != null)];
    }
    if(isIncludeSosyo){
        sourcedata = [...sourcedata, ...filteredArray.filter(marker => marker.storeType == "SOSYOSTORES" && marker.map != null)];
    }

    if(defaultData){
        salesmanCtr = [...new Set(sourcedata.map(store => store.id))].length;
    } else {
        salesmanCtr = [...new Set(sourcedata.filter(store => store.storeType == 'SYSPROSTORES').map(store => store.id))].length;
        sourcedata
        // .filter(store => store.storeType == 'SYSPROSTORES')
        .map(store => { 
            accumSales += parseFloat(store.sales);
        })
        $('.digiMapDash_sales_total').html('₱'+accumSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }

    $('.digiMapDash_salesman_total').html(salesmanCtr);
    storesCtr = (sourcedata.length).toLocaleString();
    $('.digiMapDash_store_total').html(storesCtr);
}

function getAllStores(){
    $.ajax ({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php', 
        type: "POST",
        data:{
            "type": "Fetch_AllStores",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,         
        success: function(data){ 
            for(var x=0; x < data.length; x++){
                var contentString = 
                    "<div width='100%'>"+
                        "<div class='customerDetailsHeader'>"+
                            "<h6>Customer Details <span style='font-size:12px; color: #909090'> ("+data[x].custCode+")</span></h6>"+
                        "</div>"+
                        "<div class='customerDetailsBody'>"+
                            "<div class='d-flex mb-3'>"+
                                "<div style='margint:0 10px 0 5px'>"+
                                    "<img class='rounded-circle' src='img/store-image.png'/>"+
                                "</div>"+
                                "<div class='mx-2' style='margin-top:5px;'>"+
                                    "<p class='fw-bolder mb-1' style='font-size: 15px;'><span class='mdi mdi-store-outline' style='margin-right:8px'></span>"+data[x].custName+"</p>"+
                                    "<p class='m-0 mb-1' style='font-size: 11px;'><span class='mdi mdi-map-marker' style='font-size: 13px; margin-right:12px'></span>"+data[x].address+"</p>"+
                                    "<p class='m-0' style='font-size: 11px;'><span class='mdi mdi-badge-account-outline' style='font-size: 13px; margin-right:12px'></span>"+data[x].mdSalesmancode+"_"+data[x].mdName+"</p>"+
                                "</div>"+
                            "</div>"+
                            "<div>"+
                                "<div class='text-center py-1'>"+
                                    "<span id='indicatorImg' class='customerHolder' onClick='showCustImage(\""+data[x].custCode+"\")'>Click here to view store image</span> <i class='fa fa-picture-o storeIc' aria-hidden='true'></i>"+
                                "</div>"+
                                "<div id='customerData'>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>";

                marker = new google.maps.Marker({
                    storeType: 'SYSPROSTORES',
                    id: data[x].mdCode,
                    loc: data[x].lat+' '+data[x].lng,
                    mdName: data[x].mdSalesmancode+"_"+data[x].mdName,
                    markerColor: (data[x].mdColor).replace("#", ""),
                    sales: 0,
                    mcpDay: data[x].mcpDay,
                    type: '---',
                    channel: (data[x].Channel).trim(),
                    infowindow: infoWindow,
                    position: new google.maps.LatLng(data[x].lat, data[x].lng),
                    map: map,
                    content: contentString,
                    markerDataArr: data[x], 
                    icon: {
                        url:'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/'+data[x].mdColor.substr(1),
                        scaledSize: new google.maps.Size(20, 22)
                    }
                });

                markers.push(marker);
                        
                google.maps.event.addListener(marker, 'click', (function(marker, x) {
                    return function(){
                        new google.maps.InfoWindow({ maxWidth: 500});
                        infoWindow.setContent(this.content);
                        infoWindow.open(map, marker);
                        checkDataTblHiden();
                    }
                })(marker, x));

                // ******************* heat map *********************
                heatmapArr.push(new google.maps.LatLng(data[x].lat, data[x].lng));

                
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Ops! Something went wrong! ' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
        }//success here;
    })
    .done(function(){
        // markClustering = new markerClusterer.MarkerClusterer({ 
        //     markers, 
        //     map,            
        // });

        filteredArray = markers;

        getMiniDashboardData(); 
        setTimeout(() => {
            Swal.close();
        }, 1000);
    });
}

$('#proceed-mpa-btn').attr('disabled','disabled');

function checkDataTblHiden(){
    if(isShown_salesmappingMainCont){
        tableData1v2.clear().draw();
        $('#fastsosyo_total').html('');
        $('#salesmap_total').html('');
        flip4();
    }
}

function onclickTesting(){
    if (document.fullscreenElement) {
        map.controls[google.maps.ControlPosition.LEFT].push(document.getElementById("exampleModal"));
        $('#exampleModal').modal('show');
        $('#exampleModal').on('shown.bs.modal', function () {
        $(this).css({
            'top': '0',
            'transition': 'top 0.1s'
        });
        });
    } else{
        $('#exampleModal').modal('show');
    }
}



function makeCluster() {
    if (!Array.isArray(filteredArray)) {
        console.error("no filteredArray data");
        return;
    }
    clearMarkCluster();
    

    if(isIncludeSyspro && !isIncludeSosyo){
        filteredArray = filteredArray.filter(item => item.storeType === "SYSPROSTORES");
    } else if(!isIncludeSyspro && isIncludeSosyo){
        filteredArray = filteredArray.filter(item => item.storeType === "SOSYOSTORES");
    } 

    const customRenderer = {
        render: ({ count, position, markers }) => {
            const clusterMarker = new google.maps.Marker({
                position: position,
                icon: {
                    url: "img/clusterIcon2.svg", 
                    scaledSize: new google.maps.Size(40, 40), 
                },
                label: {
                    text: String(count),
                    color: "#FFF",  
                    fontSize: "10px",    
                    fontWeight: "light", 
                },
            });
    
            clusterMarker.addListener('click', () => {
                var tableSourceData = sourceData1;
                var vanSales_transacCtr = 0;
                var booking_transacCtr = 0;
                var others_transacCtr = 0;
                var accum_vanSales = 0;
                var accum_bookings = 0;
                var accum_others = 0;
                var vanSales_salesmanArr = [];
                var booking_salesmanArr = [];
                var others_salesmanArr = [];

                const vanSalesSet = new Set();
                const bookingSalesSet = new Set();
                const othersSalesSet = new Set();

                markers.forEach((marker) => {
                    if (marker.type === "TRUCK" || marker.type === "BRAND") {
                        if (!vanSalesSet.has(marker.id)) {
                            vanSalesSet.add(marker.id);
                            vanSales_salesmanArr.push(marker.id);
                        }
                        vanSales_transacCtr++;
                        accum_vanSales += marker.sales;
                    } else if (marker.type === "PRESELL") {
                        if (!bookingSalesSet.has(marker.id)) {
                            bookingSalesSet.add(marker.id);
                            booking_salesmanArr.push(marker.id);
                        }
                        booking_transacCtr++;
                        accum_bookings += marker.sales;
                    } else{
                        if (!othersSalesSet.has(marker.id)) {
                            othersSalesSet.add(marker.id);
                            others_salesmanArr.push(marker.id);
                            console.log('Others Cluster: ' + marker.type);
                        }
                        others_transacCtr++;
                        accum_others += marker.sales;
                    }
                });
                
                // Assigning current data
                currentData_vansales_arr = vanSales_salesmanArr;
                currentData_booking_arr = booking_salesmanArr;
                currentData_others_arr = others_salesmanArr;
                currentData_vansales_totalSales = accum_vanSales;
                currentData_booking_totalSales = accum_bookings;
                currentData_others_totalSales = accum_others;
                let content = `
                        <div class="d-flex justify-content-between align-items-center salesMapInfoWindow">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-center"></th>
                                        <th scope="col" class="text-center">Salesman</th>
                                        <th scope="col" class="text-center">Total Sales</th>
                                    </tr>
                                <thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Van Sales</th>
                                        <td  class="text-center">`+vanSales_salesmanArr.length+`</td>
                                        <td class="text-end">₱ `+accum_vanSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+`</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Booking Sales</th>
                                        <td  class="text-center">`+booking_salesmanArr.length+`</td>
                                        <td class="text-end">₱ `+accum_bookings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+`</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Others Sales</th>
                                        <td  class="text-center">`+others_salesmanArr.length+`</td>
                                        <td class="text-end">₱ `+accum_others.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+`</td>
                                    </tr>
                                </tbody>
                            </table>
                            <canvas id="salesmanChart"></canvas>
                        </div>`;
                
                infoWindow.setContent(content);
                infoWindow.open(map, clusterMarker);

                generateSalesmanPieChart();
            });
            return clusterMarker;
        },
    };

    markClustering = new markerClusterer.MarkerClusterer({ 
        markers: filteredArray, 
        map: map,
        renderer: customRenderer,
        onClusterClick: (cluster, map) => {
            event.preventMapZoom = true;
            // console.log("Cluster clicked:", cluster);
            // console.log("Cluster Marker clicked:", map);
            salesmanMap_sourceData = [];
            var markersArr = map.markers;
            var wholeTotal = currentData_vansales_totalSales + currentData_booking_totalSales + currentData_others_totalSales;
            var totalSosyoStore = 0;
            var totalSysproStore = 0;

            currentData_vansales_arr.map((salesman) =>{
                var totalStores = 0;
                var totalSales = 0;
                var percentage = 0;
                var mdName = '';

                markersArr.forEach((element) => {
                    if(salesman == element.id){
                        totalStores ++;
                        totalSales += element.sales;
                        mdName = element.mdName;
                    }
                });

                (wholeTotal <= 0)? 0 : percentage = (totalSales/wholeTotal)*100;
                

                let salesmanObj = { 
                    salesmanName: mdName,
                    mdCode: salesman, 
                    stores: totalStores,
                    sales: totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    percentage: percentage.toFixed(1)
                };

                salesmanMap_sourceData.push(salesmanObj);
                totalSysproStore += totalStores;
            });

            currentData_booking_arr.map((salesman) =>{
                var totalStores = 0;
                var totalSales = 0;
                var percentage = 0;
                var mdName = '';

                markersArr.forEach((element) => {
                    if(salesman == element.id){
                        totalStores ++;
                        totalSales += element.sales;
                        mdName = element.mdName;
                    }
                });

                (wholeTotal <= 0)? 0 : percentage = (totalSales/wholeTotal)*100;

                let salesmanObj = { 
                    salesmanName: mdName,
                    mdCode: salesman, 
                    stores: totalStores,
                    sales: totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    percentage: percentage.toFixed(1)
                };

                salesmanMap_sourceData.push(salesmanObj);
                totalSysproStore += totalStores;
            });

            currentData_others_arr.map((salesman) =>{
                var totalStores = 0;
                var totalSales = 0;
                var percentage = 0;
                var mdName = '';

                markersArr.forEach((element) => {
                    if(salesman == element.id){
                        totalStores ++;
                        totalSales += element.sales;
                        mdName = element.mdName;
                    }
                });

                (wholeTotal <= 0)? 0 : percentage = (totalSales/wholeTotal)*100;
                

                let salesmanObj = { 
                    salesmanName: mdName,
                    mdCode: salesman, 
                    stores: totalStores,
                    sales: totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    percentage: percentage.toFixed(1)
                };

                salesmanMap_sourceData.push(salesmanObj);
                totalSysproStore += totalStores;
            });

            markersArr.map((stores) => {
                if(stores.storeType == 'SOSYOSTORES'){
                    totalSosyoStore++;
                }
            })

            tableData1v2.clear().rows.add(salesmanMap_sourceData).draw();
            $('#fastsosyo_total').html('Sosyo Stores ('+ totalSosyoStore +') | Syspro Stores ('+ totalSysproStore +')');
            $('#salesmap_total').html('Salesman (' +salesmanMap_sourceData.length+ ') : <span class="fw-bold"> &#8369;' + wholeTotal.toLocaleString()+ '</span>');

            if(!isShown_salesmappingMainCont){
                if(!defaultData){
                    flip4();
                }
            }
        },
    });
    

    map.setOptions({ maxZoom: parseInt(sitezoom) + 2 });
    // markClustering = new markerClusterer.MarkerClusterer({ markers: filteredArray, map });
}

function clearMarkCluster() {
    if (markClustering) {
        markClustering.clearMarkers();
        markClustering = null;
    }
    checkDataTblHiden();
    map.setOptions({ maxZoom: parseInt(sitezoom) + 10 });
}

$('#clusteringchk').change(function() {
    if ($(this).is(':checked')) {
        if(isMarkerColorsPerDay){
            isMarkerColorsPerDay = false;
            markers.forEach(marker => {
                if(marker.mcpDay != 0){
                    let defaultmarkerColor = marker.markerColor;
                    marker.setIcon({
                        url: 'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/' + defaultmarkerColor,
                        scaledSize: new google.maps.Size(20, 22)
                    });
                }
            });
        }
        
        $('#heatmapchk').prop('checked', false);
        $('#slider').hide();
        clearHeatMap();
        $('#geofencechk').prop('checked', false);
        uncheckGeofence();
        checkIncluded();
        
        if(defaultData){
            markClustering = new markerClusterer.MarkerClusterer({
                map: map,
                markers: markers,
            });
            markers.forEach((marker) => marker.setMap(null));
        }else{
            clearMarkCluster();
            makeCluster();
        }

        updateMapStatus(2);
    } else {
        clearMarkCluster();
        $('#colorperdaychk').prop('checked', false);
        isMarkerColorsPerDay = false;
        $('#channelchk').prop('checked', false);

        if(isIncludeSosyo){
            displaySosyoMarkers();
        }
        if(isIncludeSyspro){
            displayMarkers();
            changeProductive(0);
        }
        updateMapStatus(1);
    }
});

function showHeatMap() { 
    var heatmapDatas;

    checkIncluded();
    ClearSosyoMarkers();
    ClearMarkers();
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#geofencechk').prop('checked', false);
    uncheckGeofence(); 
    $('#heatmapchk').prop('checked', true);  
    $('#slider').show();   
    clearHeatMap();
    if (isIncludeSyspro && isIncludeSosyo) {
        heatmapDatas = filteredArray.map((item) => item.getPosition());
    } else if (isIncludeSyspro && !isIncludeSosyo) {
        heatmapDatas = filteredArray.filter(item => item.storeType == "SYSPROSTORES").map(item => item.getPosition());
    } else if (!isIncludeSyspro && isIncludeSosyo) {
        heatmapDatas = filteredArray.filter(item => item.storeType == "SOSYOSTORES").map(item => item.getPosition());
    }

    $('.productOuterCont').hide();
    heatmap1 = new google.maps.visualization.HeatmapLayer({
        data: heatmapDatas,
        map: map,
        radius: heatmapRadius,
    });
    heatmap1.setMap(map);

    $('#status_map_filtering').html('Filtered By Location');
    isShowingHeatmapSetting();

}

function clearHeatMap() {
    if (heatmap1) {
        heatmap1.setMap(null);
        heatmap1 = null;
    }
}

function heatMapSales() {
    checkIncluded();
    ClearSosyoMarkers();
    ClearMarkers();
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#geofencechk').prop('checked', false);
    uncheckGeofence(); 
    $('.productOuterCont').hide();
    $('#heatmapchk').prop('checked', true);  
    $('#slider').show();   
    clearHeatMap();
    heatmapData = [];

    if (isIncludeSyspro == 1) {
        var tempheatmapData = filteredArray
            .filter(item => item.storeType == "SYSPROSTORES" && item.sales > 0)
            .map(item => ({
                location: new google.maps.LatLng(item.markerDataArr.lat, item.markerDataArr.lng),
                weight: Math.log(item.sales + 1)
            }));

        heatmapData = [...heatmapData, ...tempheatmapData];
    }

    if (isIncludeSosyo == 1) {
        var tempheatmapData = filteredArray
            .filter(item => item.storeType == "SOSYOSTORES" && item.sales > 0)
            .map(item => ({
                location: new google.maps.LatLng(item.markerDataArr.LATITUDE, item.markerDataArr.LONGITUDE),
                weight: Math.log(item.sales + 1)
            }));
        heatmapData = [...heatmapData, ...tempheatmapData];
    }

    heatmap1 = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: heatmapRadius,
        opacity: 0.8
    });
    $('#status_map_filtering').html('FIltered By Sales');
    isShowingHeatmapSetting();
    // heatmap1.set('radius', 30);
    // heatmap.set('opacity', 0.7);
    
}

$('#heatmapchk').change(function() {
    if ($(this).is(':checked')) {
        if(defaultData){
            $('#reportrange ').click();
            // Swal.fire({
            //     text: "Filter the Map Data to View More Heatmap Settings",
            //     showCancelButton: true,
            //     confirmButtonColor: "#3085d6",
            //     cancelButtonColor: "#d33",
            //     confirmButtonText: "Yes"
            // }).then((result) => {
            //     if(result.isConfirmed == true){
            //         $('#reportrange ').click();
            //     }
            // });
        }

        if(isMarkerColorsPerDay){
            isMarkerColorsPerDay = false;
            markers.forEach(marker => {
                if(marker.mcpDay != 0){
                    let defaultmarkerColor = marker.markerColor;
                    marker.setIcon({
                        url: 'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/' + defaultmarkerColor,
                        scaledSize: new google.maps.Size(20, 22)
                    });
                }
            });
        }
        showHeatMap();
        updateMapStatus(3);
    } else {
        clearHeatMap();
        updateMapStatus(1);
        
        $('#colorperdaychk').prop('checked', false);
        isMarkerColorsPerDay = false;
        $('#channelchk').prop('checked', false);
        $('.productOuterCont').hide();
        $('#slider').hide();
        
        if(isIncludeSosyo){
            displaySosyoMarkers();
        }
        if(isIncludeSyspro){
            displayMarkers();
            changeProductive(0);
        }
    }
    infoWindow.close();
});

function displayMarkers() {
    filteredArray = markers;

    if (filteredArray.length > 0) {
        if($("#colorperdaychk").is(":checked")){
            isMarkerColorsPerDay = true;
            updateMapStatus(1);
        }
    }
    filteredArray.forEach(marker => {
        if (marker.mcpDay != 0) {
            marker.setMap(map);
        }
    });
    map.setOptions({ maxZoom: parseInt(sitezoom) + 10 });
    getMiniDashboardData();
}

function ClearMarkers() {
    if (filteredArray.length > 0) {
        filteredArray.forEach(marker => {
            if (marker.mcpDay != 0) {
                marker.setMap(null);
            }
        });
    }
}

$('#showmarkerschk').change(function() {
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#heatmapchk').prop('checked', false);
    $('#slider').hide();
    clearHeatMap();
    $('#channelchk').prop('checked', false);

    if ($(this).is(':checked')) {
        isIncludeSyspro = 1;
        ClearMarkers();
        displayMarkers();
        updateMapStatus(1);
        changeProductive(0);

        $('#colorperdaychk').prop('disabled', false);
        $('.colorLegendBtn').prop('disabled', true);
        $('.dropstartColorLegendBtn').addClass('disbledBtn');
        $('#channelchk').prop('disabled', false);
    } else {
        if(isMarkerColorsPerDay){
            changeColor();
            $('#colorperdaychk').prop('checked', false);
            isMarkerColorsPerDay = 0;
        }
        $('#channelchk').prop('checked', false);
        isFilteredChannel = 0;
        isIncludeSyspro = 0;
        ClearMarkers();

        $('#colorperdaychk').prop('disabled', true);
        $('.colorLegendBtn').prop('disabled', true);
        $('.dropstartColorLegendBtn').addClass('disbledBtn');
        $('#channelchk').prop('disabled', true);
        getMiniDashboardData();
    }

    if(isIncludeSosyo){
        displaySosyoMarkers();
    }
    
});

function checkIfMarkersMapNotNull(){
    var retval = false;

    if(filteredArray.length > 0){
        filteredArray.map(marker => {
            if(marker.map != null){
                retVal = true;
            }
        })
    }

    return retval;
}

$('#colorperdaychk').change(function() {
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#heatmapchk').prop('checked', false);
    $('#slider').hide();
    clearHeatMap();
    $('#geofencechk').prop('checked', false);
    uncheckGeofence();
    $('#channelchk').prop('checked', false);

    var markerChecker = checkIfMarkersMapNotNull();

    if(!markerChecker){
        clearMarkCluster();
        clearHeatMap();

        if(isIncludeSosyo){
            displaySosyoMarkers();
        }
        if(isIncludeSyspro){
            displayMarkers();
            changeProductive(0);
        }
    }
    if(!isIncludeSyspro){
        $('#showmarkerschk').prop('checked', true);
        isIncludeSyspro = 1;
        displayMarkers();
        changeProductive(0);
    }

    if (filteredArray.length > 0) {
        if ($(this).is(':checked')) {
            $('.colorLegendBtn').prop('disabled', false);
            $('.dropstartColorLegendBtn').removeClass('disbledBtn');
            isMarkerColorsPerDay = true;
        } else{
            $('.colorLegendBtn').prop('disabled', true);
            $('.dropstartColorLegendBtn').addClass('disbledBtn');
            isMarkerColorsPerDay = false;
            $('#status_map_filtering').html('---');
        }
    }
    changeColor();
    isFilteredChannel = 0;
});

function changeColor(){
    if(filteredArray.length > 0){
        if(isIncludeSyspro){
            filteredArray = filteredArray.map(marker => {
                if (marker.mcpDay != 0) {
                    let defaultmarkerColor = marker.markerColor;
                    let currentIcon = marker.getIcon().url.split('/').pop();

                    marker.setIcon({
                        url: 'https://mybuddy-sfa.com/ideliverapi/api/index.php/getMarker/'+ (currentIcon === defaultmarkerColor ?  MCPDayMarkerColor[marker.mcpDay] :  defaultmarkerColor),
                        scaledSize: new google.maps.Size(20, 22)
                    });
                } 
                return marker;
            });
        }
    }
}

var isProdFiltered = false;
function changeProductive(status){
    isProdFiltered = status === 1 || status === 2;

    $('#showmarkerschk').prop('checked', true);
    displayMarkers();
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#heatmapchk').prop('checked', false);
    $('#slider').hide();
    clearHeatMap();

    if (isProdFiltered) {
        const isProductive = status === 1;

        filteredArray.forEach(marker => {
            if (marker.mcpDay !== 0) {
                const hasTransactions = marker.markerDataArr.transacCtr !== 0;
                if (isProductive ? !hasTransactions : hasTransactions) {
                    marker.setMap(null);
                }
            }
        });
        filteredArray = filteredArray.filter(marker => marker.map !== null);
    }

    // Update button states
    $('#prodBtn').html(status === 1 ? 'Productive <i class="fa-solid fa-check"></i>' : 'Productive');
    $('#unprodBtn').html(status === 2 ? 'Unproductive <i class="fa-solid fa-check"></i>' : 'Unproductive');
    $('#allProdBtn').html(status === 0 ? 'All <i class="fa-solid fa-check"></i>' : 'All');
}

function setMarkerDay(mcpDay){
    if(mcpDay == -1){
        $('#showmarkerschk').prop('checked', true);
        displayMarkers();
        $('#clusteringchk').prop('checked', false);
        clearMarkCluster();
        $('#heatmapchk').prop('checked', false);
        $('#slider').hide();
        clearHeatMap();
        $('#status_map_filtering').html('Filtered By MCP Day');
      return;
    }
  
    if(isMarkerColorsPerDay){
        if(isFilteredChannel){
            filteredArray = filteredChannelArr;
        } else{
            filteredArray = markers;
        }

        filteredArray = filteredArray.map(marker => {
            if (marker.mcpDay != 0) {
                if(marker.mcpDay == mcpDay){
                    marker.setMap(map);
                } else{
                    marker.setMap(null);
                }
            } else {
                if(isIncludeSosyo){
                    marker.setMap(map);
                } else{
                    marker.setMap(null);
                }
            }
            return marker;
        }).filter(marker => marker.map != null);

        getMiniDashboardData();

        var day = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
        $('#status_map_filtering').html('Filtered By MCP Day ('+day[mcpDay]+')');
    }
}

$('#showSosyochk').change(function() {
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#heatmapchk').prop('checked', false);
    $('#slider').hide();
    clearHeatMap();
    $('#channelchk').prop('checked', false);

    if (filteredArray.length > 0) {
        if ($(this).is(':checked')) {
            isIncludeSosyo = 1;
            ClearSosyoMarkers();
            displaySosyoMarkers();
        } else{
            isIncludeSosyo = 0;
            ClearSosyoMarkers();
            getMiniDashboardData();
        }
    }
    if(isIncludeSyspro){
        displayMarkers();
        changeProductive(0);
    }
    isFilteredChannel = 0;
});

function displaySosyoMarkers() {
    if(filteredArray.length != markers.length){
        filteredArray = markers;
    }
    
    filteredArray.forEach(marker => {
        if (marker.mcpDay == 0) {
            marker.setMap(map);
        }
    });
    getMiniDashboardData();
}

function ClearSosyoMarkers() {
    if (filteredArray.length > 0) {
        filteredArray.forEach(marker => {
            if (marker.mcpDay == 0) {
                marker.setMap(null);
            }
        });
    }
}

function AutocompleteDirectionsHandler(map, contID){
    this.map = map;
    var dashbaord_table = document.getElementById(contID);
    this.map.controls[google.maps.ControlPosition.LEFT].push(dashbaord_table);
}

function custSelection(map){
    this.map = map;
    var btn = document.getElementById('custSelection');
    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(btn);
}

function mapControls(map){
    this.map = map;
    var btn = document.getElementById('sideClyders');
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(btn);
}

function mapBtnsContainer(map, btnDivClass){
    this.map = map;
    var btn = document.getElementById(btnDivClass);
    this.map.controls[google.maps.ControlPosition.RIGHT].push(btn);
}   

function mapUserControlCont(map){
    this.map = map;
    var btn = document.getElementById('mapUserControlCont');
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(btn);
}

function proceedBtn(map){
    this.map = map;
    var proceedBtn = document.getElementById('saveFenceDiv');
    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(proceedBtn);
}

function digiMapDashboardCont(map){
    this.map = map;
    var digiMapDashboardCont = document.getElementById('digiMapDashboard');
    this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(digiMapDashboardCont);
}

function dataTableCont(map){
    this.map = map;
    var btn = document.getElementById('outerContainer_dataTable');
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(btn);
}

function mapStatusSection(map){
    this.map = map;
    var btn = document.getElementById('mapStatusOuterCont');
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(btn);
}


$('#fullScreen').click(function() {
    $(".fs_icon", this).toggleClass("mdi-fullscreen mdi-fullscreen-exit");
});

$('#setSatellite').click(function (){
    $(".earthtogglebtn1", this).toggleClass("mdi-earth mdi-map-outline");

    if (map.getMapTypeId() != google.maps.MapTypeId.HYBRID) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID)
        map.setTilt(0); // disable 45 degree imagery
    }else if(map.getMapTypeId() != google.maps.MapTypeId.ROADMAP){
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
        map.setTilt(0); // disable 45 degree imagery
    }
});

function restoreLoc(){
    // $('#mapUserControlCont').fadeOut();
    $('#restorBtn').fadeOut();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
    map.setCenter(myLatlng);
    map.setZoom(parseInt(sitezoom));
    pasthisLat = 0;
    pasthisLong = 0;
}

function imgError(image) {
    image.onerror = "";
    image.src = "img/salesmanPic.jpg";
    return true;
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
            fuipanay_salescolor = '#158fd1';
        }//success here;
    });
//return color;
}

function clickSalesmanList() {
    var x = document.getElementById("geofence_salesmanList").selectedIndex;
    var result = document.getElementsByTagName("option")[x].value;
    alert(result);
}

function erase(polygon){
    polygon.setMap(null);
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

function generateSalesmanPieChart(){
    const ctx = document.getElementById('salesmanChart');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Van Sales       ',
                'Booking Sales',
                'Other Sales    ',
            ],
            datasets: [{
                label: 'Contribution',
                data: [currentData_vansales_totalSales, currentData_booking_totalSales, currentData_others_totalSales],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(60, 235, 54)',
                ],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.parsed !== null) {
                                var part = context.parsed;
                                var whole = currentData_vansales_totalSales + currentData_booking_totalSales + currentData_others_totalSales;
                                var percent = ((part/whole)*100).toFixed(1);
                            }
                            return  percent+"%";
                        }
                    }
                },
                legend: {
                    labels: {
                        font: {
                        size: 10,
                        color: '#00000',
                        weight: 500,
                        }
                    },
                }
            }
        }
    });
}


// MCP CALIBRATION FUNCTIONS
function redirectFenceDetails(){
    // window.location.href = "https://mybuddy-sfa.com/SFA/v2/exportTerritory";
    window.open(GBL_DOMAIN + "/SFA/v2/exportTerritory", "_blank");
}

$('.geofenceBtns').hide();
$('#geofencechk').prop('checked', false);
$('#geofencechk').change(function() {

    if (filteredArray.length > 0) {
        isFilteredChannel = 0;
        $('#channelchk').prop('checked', false);
        filteredArray = markers;
    }
    if ($(this).is(':checked')) {
        $('#channelchk').prop('checked', false);
        $('#showSosyochk').prop('checked', true);
        isIncludeSosyo = 1;
        displaySosyoMarkers();
        $('#showmarkerschk').prop('checked', true);
        isIncludeSyspro = 1;
        displayMarkers();
        changeProductive(0);
        $('#colorperdaychk').prop('disabled', false);
        $('.dropstartColorLegendBtn').removeClass('disbledBtn');
        $('#channelchk').prop('disabled', false);

        checkGeofence();
        updateMapStatus(4);
    } else{
        uncheckGeofence();
        updateMapStatus(1);
    }
});

function checkGeofence(){
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#heatmapchk').prop('checked', false);
    $('#slider').hide();
    clearHeatMap();

    $('.geofenceBtns').show(300);
    $('#saveFenceDiv').show(300);

    for(var i = 0; i < mpa_polygon.length; i++){ 
        mpa_polygon[i].setMap(map);
    }

    $('.salesmappingOuterCont').hide();
    $('.productOuterCont').hide();
    $('.geofencingOuterCont').show();

    infoWindow.close();
    checkDataTblHiden();
}

function uncheckGeofence(){
    $('#mdi-eraser-maps-btn').click();

    $('.geofenceBtns').hide(300);
    $('#saveFenceDiv').hide(300);

    for(var i = 0; i < mpa_polygon.length; i++){ 
        mpa_polygon[i].setMap(null);
    }
    $('.salesmappingOuterCont').show();
    $('.productOuterCont').hide();
    $('.geofencingOuterCont').hide();
}

function displayGeofences(){
    var siteID = localStorage.getItem('SITEID');
    //  getfencesList();
    var infoWindow = new google.maps.InfoWindow();
    mpa_polygon = [];
    
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
                    mpa_header[ctr][10] = this.SYSPROD;
                    mpa_header[ctr][11] = this.SYSUNPROD;
                    ctr++;
                });
            
                for(var i = 0; i < mpa_header.length; i++){
                    var coord_ary=[];
        
                    for(var j = 0; j < mpa_header[i][8].length; j++){
                    coord_ary.push({lat: Number(mpa_header[i][8][j].LATITUDE), 
                                    lng: Number(mpa_header[i][8][j].LONGITUDE)});
                    }
                    var boundary = coord_ary;
                    var fenceColor = getRandomColor();

                    mpaPolygon = new google.maps.Polygon({
                        paths: boundary,
                        strokeColor: fenceColor,
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        fillColor: fenceColor,
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
                        SYSPROD: mpa_header[i][10],
                        SYSUNPROD: mpa_header[i][11],
                    });
        
                    mpa_polygon.push(mpaPolygon);
                }

                //loop for polygon vertices
                for(var i = 0; i < mpa_polygon.length; i++){ 
                    mpa_polygon[i].setMap(map);

                    google.maps.event.addListener(mpa_polygon[i],"mouseover",function(){
                        this.setOptions({fillOpacity: 0.8});
                    }); 

                    google.maps.event.addListener(mpa_polygon[i],"mouseout",function(){
                        this.setOptions({fillOpacity: 0.7});
                    }); 
                       

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
                                        <td>Total Syspro Stores</td>
                                        <td><strong>` + this.TSYSPRO + `</strong> (` + (this.SYSPROD ?? 0) + ` Productive | ` + (this.SYSUNPROD ?? 0) + ` Unproductive) </td>
                                    </tr>
                                    <tr>
                                        <td>Sosyo Stores</td>
                                        <td><strong>` + this.TSOSYO + `</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Total Sales</td>
                                        <td><strong> ₱ ` + this.TOTALSALES + `</strong></td>
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


function viewmarkers_inside_fence(){
    // deleteSoysoMarkers();
    // DeleteMarkers();
    $('#slider').hide();
    clearHeatMap();
    clearMarkCluster();
    hideFilteredArray();
    deleteInsideMarkers();
    $('#mdi-backtomarkers-maps-btn').show(300);
    $('.geofenceBtns').hide(300);

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
            console.log('INSIDE FENCE: Red=old(without status yet); Blue=(unproductive); Green=(productive)');      
            var iconselector;
            var contentstringselector;
            var imglink;
            for(var x=0; x<data.length; x++){
                var colors = { '0': '9856d6', '1': '56d683', 'null': 'd65656' };
                var color = colors[data[x].STORESTAT] || 'd65656'; // Default to red if null/undefined; Blue=(unproductive); Green=(productive)

                if(data[x].STORETYPE == 'SYSPROSTORES'){
                    iconselector ={
                        url: 'https://fastdevs-api.com/MYBUDDYGLOBALAPI/mybuddyMarkerAPI/api/index.php/getMarker/'+color,
                        scaledSize: new google.maps.Size(20, 22)
                    };

                // imglink = GLOBALLINKAPI+"/nestle/connectionString/images-stores/"+GLOBALDISTDBNAME+"/";
                    imglink = "img/store-image.png";
                }else{
                    iconselector = {
                        url: 'https://fastsosyo.com/comports/admin/v2/html/AIOSTORE_MARKER/sosyo2_marker.png',
                        scaledSize: new google.maps.Size(20, 22)
                    };
                    // imglink = "https://fastsosyo.com/comports/admin/v2/html/AIOSTORE_MARKER/sosyo2_marker.png";
                    imglink = "https://fastdevs-api.com/FASTSOSYO/download/image/v2Mybuddystores_images/"+data[x].CUSTCODE+'_1.jpg';
                }
                contentstringselector = 
                        "<div width='100%'>"+
                            "<div class='customerDetailsHeader'>"+
                                "<h6>Customer Details <span style='font-size:12px; color: #909090'>("+data[x].CUSTCODE+")</span></h6>"+
                            "</div>"+
                            "<div class='customerDetailsBody'>"+
                                "<div class='d-flex mb-3'>"+
                                    "<div style='margint:0 10px 0 5px'>"+
                                        "<img class='rounded-circle' src='"+imglink+"'/>"+
                                    "</div>"+
                                    "<div class='mx-2' style='margin-top:5px;'>"+
                                        "<p class='fw-bolder mb-1' style='font-size: 15px;'><span class='mdi mdi-store-outline' style='margin-right:8px'></span>"+data[x].STORENAME+"</p>"+
                                        "<p class='m-0 mb-1' style='font-size: 11px;'><span class='mdi mdi-map-marker' style='font-size: 13px; margin-right:12px'></span>"+data[x].ADDRESS+"</p>"+
                                        "<p class='m-0' style='font-size: 11px;'><span class='mdi mdi-badge-account-outline' style='font-size: 13px; margin-right:12px'></span>"+data[x].SALESMAN+"</p>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='d-flex justify-content-center text-center' style='background-color:#D4D4D4;color:#636363;height:30px; padding: 0 25px'>"+
                                    "<div class='d-flex justify-content-center align-items-center'>"+
                                        "<p class='m-0'><span class='mdi mdi-cart-outline mx-1'></span>"+data[x].NOORDERS+" Transactions</p>"+
                                    "</div>"+
                                    "<div class='d-flex justify-content-center align-items-center' style='margin-left:15px; border-left: 1px solid #B4B4B4'>"+
                                        "<p class='m-0'><span style='margin-left:15px; '>₱</span> "+data[x].TOTALORDERS+" Total Sales</p>"+
                                    "</div>"+
                                "</div>"+
                                "<div>"+
                                    "<div class='text-center py-1'>"+
                                        "<span id='indicatorImg' class='customerHolder' onClick='showCustImage(\""+data[x].CUSTCODE+"\")'>Click here to view store image</span> <i class='fa fa-picture-o storeIc' aria-hidden='true'></i>"+
                                    "</div>"+
                                    "<div id='customerData'>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>";

                insidemarkers = new google.maps.Marker({
                    loc: data[x].LATITUDE+' '+data[x].LONGITUDE,
                    longitude: data[x].LATITUDE,
                    latitude: data[x].LONGITUDE,
                    storename: data[x].STORENAME,
                    infoWindow: infoWindow,
                    contentString: contentstringselector,
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
}

function deleteInsideMarkers(){
    for (var i = 0; i < inside_fence_markers.length; i++) {
        inside_fence_markers[i].setMap(null);
    }
    inside_fence_markers = [];
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
  
    $("#test").html(contentString);
    // contentString="";
}

function saveMPA(){
    getpolygonpath();
  
    var userID = localStorage.getItem('user_id');
    var fullname = localStorage.getItem('fullname');
    var fenceName= $('#newFenceName').val();
  
    var prodSysprostores = $('#newFenceProdSysproStores').val();
    var unprodSysprostores = $('#newFenceUnProdSysproStores').val();
    var tsysprostores = $('#newFenceSysproStores').val();
    var tsosyostores = $('#newFenceSosyoStores').val();
    var daterange = $('#newFenceDateRange').val();
    var totalSales = $('#newFenceTotalSales').val();
    totalSales = totalSales.split(" ")[1];
    
    var storeListForInsert = sourceDataGeofence;

    if(fenceName == "" || fenceName == null){
        $('#saveModal').modal('hide');
        Swal.fire({
            text: "Please input MCP name",
            icon: "error"
        });
        return;
    }

    $('#saveModal').modal('hide');
    Swal.fire({
        text: "Are you sure you want to set this MCP calibration?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#createTerritoryBtn').html('<i class="fa fa-spin fa-spinner"></i> please wait...');
            $('#createTerritoryBtn').prop('disabled', true)
    
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/POST_applicationApi.php", 
                type: "POST",
                data: {
                    'type':'INSERT_FENCE_TERRITORY',
                    'fenceName': fenceName,
                    'userID':userID,
                    "boundary_coordinates": mpa_coords,
                    'tsysprostores':tsysprostores,
                    'tsosyostores':tsosyostores,
                    'daterange':daterange,
                    'totalSales':totalSales,
                    'sysprod':prodSysprostores,
                    'sysunprod':unprodSysprostores,
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE
                },
                dataType: "json",
                crossDomain: true,
                cache: false, 
                async: false,          
                success: function(response){     
                    tempDisplayFence(response.cIDheader, fenceName, tsysprostores, tsosyostores, totalSales, prodSysprostores, unprodSysprostores);

                    mpa_coords = [[]];      
                    var r = storeListForInsert;
                    for(var x = 0; x < r.length; x++){
                        savefenceStores(response.cIDheader,
                        r[x].storeType,
                        r[x].salesman,
                        r[x].custcode,
                        r[x].storename,
                        r[x].dateCreatedInfo,
                        r[x].address,
                        r[x].noOrders,
                        r[x].totalOrderSales,
                        r[x].longitude,
                        r[x].latitude,
                        r[x].lastOrder,
                        r[x].storeStat);
                    }
                },
                error: function (err, statusText, errorThrown){
                    alert(errorThrown);
                }
            }).done(function (){
                Swal.fire({
                    text: 'Fence named "' + fenceName + '" was successfully created.',
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#newFenceName').val('');
                        // location.reload();
                        // displayGeofences();
                        uncheckGeofence();
                        checkGeofence();
                        loadingSwal();
                    }
                });
                setTimeout(function() { 
                    
                }, 1000);
            });
        }
    });
}//saveMPA   

function tempDisplayFence(fenceCID, fenceName, tsysprostores, tsosyostores, totalSales, prodSysprostores, unprodSysprostores){
    var infoWindow = new google.maps.InfoWindow();
    var coord_ary=[];
    for (var i = 0; i < mpa_coords.length; i++) {
        let lat = Number(mpa_coords[i][1]);
        let lng = Number(mpa_coords[i][2]);
    
        // Check if conversion is successful
        if (isNaN(lat) || isNaN(lng)) {
            console.error(`Invalid coordinate at index ${i}:`, mpa_coords[i]);
            continue; // Skip this coordinate
        }
    
        coord_ary.push({ lat: lat, lng: lng });
    }
    
    var boundary = coord_ary;
    var fenceColor = getRandomColor();
    
    mpaPolygon = new google.maps.Polygon({
        paths: boundary,
        strokeColor: fenceColor,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: fenceColor,
        fillOpacity: 0.7,
        editable: false,
        draggable: false,
        cID: fenceCID,
        FENCENAME: fenceName,
        DATECREATED: getFormattedDateTime(),
        TSYSPRO: tsysprostores,
        TSOSYO: tsosyostores,
        TOTALSALES: totalSales,
        SYSPROD: prodSysprostores,
        SYSUNPROD: unprodSysprostores,
    });

    mpa_polygon.push(mpaPolygon);

    google.maps.event.addListener(mpa_polygon[mpa_polygon.length-1], 'click', function(e){
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
                        <td><strong>` + this.TSYSPRO + `</strong> (`+ (this.SYSPROD ?? 0) +` Productive | `+ (this.SYSUNPROD ?? 0) +` Unproductive) </td>
                    </tr>
                    <tr>
                        <td>Sosyo Stores</td>
                        <td><strong>` + this.TSOSYO + `</strong></td>
                    </tr>
                    <tr>
                        <td>Total Sales</td>
                        <td><strong> ₱ ` + this.TOTALSALES + `</strong></td>
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
    
    $('#createTerritoryBtn').html('Save');
    $('#createTerritoryBtn').prop('disabled', false)
}  

function getFormattedDateTime() {
    let now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
}

function loadingSwal(){
    Swal.fire({
        html: "Reloading MCP data... Please wait...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    setTimeout(function() { 
        Swal.close();
    }, 1000);
}

  
function getsosyostores(poly){
    sysproStoresArrHolder = [];
    sosyoStoresArrHolder = [];
    var tsysprostores = 0;
    var prodSysprostores = 0;
    var unprodSysprostores = 0;
    var tsosyostores = 0;
    var date = startPickDate + " to " + endPickDate;
    var tsales = 0;

    const markersInsideFence = filteredArray.filter(marker => 
        google.maps.geometry.poly.containsLocation(marker.getPosition(), poly)
    );
    
    markersInsideFence.forEach((marker, index) => {
        if(marker.storeType == 'SYSPROSTORES'){
            if(isIncludeSyspro){
                if(marker.markerDataArr.transacCtr == 0){
                    unprodSysprostores++;
                } else{
                    prodSysprostores++;
                }
                tsysprostores++;
                tsales += marker.sales;
                sysproStoresArrHolder.push(marker);
            }
        } else {
            if(isIncludeSosyo){
                tsosyostores++;
                tsales += parseFloat(String(marker.sales).replace(/,/g, ''));
                sosyoStoresArrHolder.push(marker);
            }
        }
    });
    $('#newFenceProdSysproStores').val(prodSysprostores);
    $('#newFenceUnProdSysproStores').val(unprodSysprostores);
    $('#newFenceSysproStores').val(tsysprostores);
    $('#newFenceSosyoStores').val(tsosyostores);
    $('#newFenceDateRange').val(date);
    $('#newFenceTotalSales').val("₱ " + tsales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#geofencing_overAllTotal').show();
    $('#geofencing_total').html("Sosyo Stores ("+tsosyostores+") | "+"Syspro Stores ("+tsysprostores+")");
    $('#dataTableGeoFenceTotalSales').html(" Total: "+" <span class='fw-bold'> ₱ " + tsales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+"</span>");

    var combineSourceData = [...sosyoStoresArrHolder, ...sysproStoresArrHolder];
    filterSourceData(combineSourceData);
    geofence_tableData.clear().rows.add(sourceDataGeofence).draw();
    
}

function filterSourceData(sourceArr){
    var filteredCombinedData = sourceArr.map(item => {
        if(item.storeType == 'SOSYOSTORES'){
            var sales = parseFloat((item.markerDataArr.TOTALORDERS).replace(/,/g, ''));
            return{
                storeType: item.storeType,
                salesman: '---',
                custcode: '---',
                storename: item.markerDataArr.STORENAME,
                dateCreatedInfo: item.markerDataArr.DATECREATED,
                address: item.markerDataArr.ADDRESS,
                noOrders: item.markerDataArr.NOOFORDERS,
                // totalOrderSales: item.markerDataArr.TOTALORDERS ?? 0,
                totalOrderSales: sales,
                latitude: item.markerDataArr.LATITUDE,
                longitude: item.markerDataArr.LONGITUDE,
                lastOrder:item.markerDataArr.LASTORDER,
                storeStat: -1
            }
        } else if(item.storeType == 'SYSPROSTORES'){
            var date = startPickDate + " to " + endPickDate;
            var storeStat = 0; // 0 if uproductive; 1 if productive(already have a transaction)
            if(item.markerDataArr.transacCtr != 0){
                storeStat = 1;
            }

            return{
                storeType: item.storeType,
                salesman: item.mdName,
                custcode: item.id,
                storename: item.markerDataArr.custName,
                dateCreatedInfo: date,
                address: item.markerDataArr.address,
                noOrders: item.markerDataArr.transacCtr,
                totalOrderSales: item.markerDataArr.totalSales ?? 0,
                latitude: item.markerDataArr.lat,
                longitude: item.markerDataArr.lng,
                lastOrder: '---',
                storeStat: storeStat
            }
        }
        
    });

    sourceDataGeofence = filteredCombinedData;
}

function displaysosyostores(){
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
                var contentString = 
                    "<div width='100%'>"+
                        "<div class='customerDetailsHeader'>"+
                            "<h6>Customer Details <span style='font-size:12px; color: #909090'></span></h6>"+
                        "</div>"+
                        "<div class='customerDetailsBody'>"+
                            "<div class='d-flex mb-3'>"+
                                "<div style='margint:0 10px 0 5px'>"+
                                    "<img class='rounded-circle' src='https://fastsosyo.com/comports/admin/v2/html/AIOSTORE_MARKER/sosyo2_marker.png'/>"+
                                "</div>"+
                                "<div class='mx-2' style='margin-top:5px;'>"+
                                    "<p class='fw-bolder mb-1' style='font-size: 15px;'><span class='mdi mdi-store-outline' style='margin-right:8px'></span>"+data[x].STORENAME+"</p>"+
                                    "<p class='m-0 mb-1' style='font-size: 11px;'><span class='mdi mdi-map-marker' style='font-size: 13px; margin-right:12px'></span>"+data[x].ADDRESS+"</p>"+
                                    "<p class='m-0' style='font-size: 11px;'><span class='mdi mdi-badge-account-outline' style='font-size: 13px; margin-right:12px'></span>---</p>"+
                                "</div>"+
                            "</div>"+
                            "<div class='d-flex justify-content-center text-center' style='background-color:#D4D4D4;color:#636363;height:30px; padding: 0 25px'>"+
                                "<div class='d-flex justify-content-center align-items-center'>"+
                                    "<p class='m-0'><span class='mdi mdi-cart-outline mx-1'></span>"+data[x].NOOFORDERS+" Transactions</p>"+
                                "</div>"+
                                "<div class='d-flex justify-content-center align-items-center' style='margin-left:15px; border-left: 1px solid #B4B4B4'>"+
                                    "<p class='m-0'><span style='margin-left:15px; '>₱</span> "+data[x].TOTALORDERS+" Total Sales</p>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>";

                marker = new google.maps.Marker({
                    storeType: 'SOSYOSTORES',
                    id: data[x].STOREID,
                    loc: data[x].LATITUDE+' '+data[x].LONGITUDE,
                    mdName: '---',
                    type: '---',
                    markerColor: '---',
                    sales: parseFloat((data[x].TOTALORDERS).replace(/,/g, '')),
                    // sales: data[x].TOTALORDERS,
                    mcpDay: 0,
                    channel: "",
                    infowindow: infoWindow,
                    position: new google.maps.LatLng(data[x].LATITUDE, data[x].LONGITUDE),
                    map: map,
                    content: contentString,
                    markerDataArr: data[x],
                    icon: {
                        url:'https://fastsosyo.com/comports/admin/v2/html/AIOSTORE_MARKER/sosyo2_marker.png',
                        scaledSize: new google.maps.Size(20, 22)
                    }
                });

                markers.push(marker);

                google.maps.event.addListener(marker, 'click', (function(marker, x) {
                    return function(){
                        new google.maps.InfoWindow({ maxWidth: 500});
                        infoWindow.setContent(this.content);
                        infoWindow.open(map, marker);
                        checkDataTblHiden();
                    }
                })(marker, x));

                heatmapArr.push(new google.maps.LatLng(data[x].LATITUDE, data[x].LONGITUDE));
            }//end for  
        }
    });
}

function deleteSoysoMarkers(){
    for (var i = 0; i < sosyomarkers.length; i++) {
        sosyomarkers[i].setMap(null);
    }
    sosyomarkers = [];
}


function geofenceDataTable(){
    geofence_tableData = new DataTable('#geoFencingTable',{
        dom: '<"m-1"<"d-flex justify-content-end"f>rt<"d-flex justify-content-between" ip>>',
        pageLength: 10,
        order: true,    
        responsive: false,
        source: sourceDataGeofence,
        bSort: true,
        // scrollY: '200px',
        "autoWidth": false,
        columns: [
        { data: "storeType", title:"Store Type"},
        { data: "storename", title:"Store Name"},
        { data: "totalOrderSales", title:"Sales" },
        ],
        columnDefs: [
            {
                targets: 2,
                className: 'text-end'
            },
        ],
        rowCallback: function(row, data, index){
            $(row).find('td:eq(2)').text('₱' + (data.totalOrderSales).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }  
    });

    $('.dt-search input[type="search"]').on('keyup', function() {
        var searchedData = geofence_tableData.search(this.value).draw();
    });
}

function savefenceStores(refno, storeType, salesman, custcode,
    storename, datecreated_info, address, noOfOrders, totalOrders, latitude, longitude, lastOrder, storeStat){
  
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
            storestat: storeStat,
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

function removeFence(){
    var cID = $('#fenceIDHolder').val();
    $('#updateFenceModal').modal('hide');
    Swal.fire({
        text: "Are you sure you want to remove this geofence?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
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
                        let index = mpa_polygon.findIndex(polygon => polygon.cID == cID);
                        if (index !== -1) {
                            mpa_polygon[index].setMap(null); 
                            mpa_polygon.splice(index, 1); 
                            console.log("Polygon removed.");
                        }

                        Swal.fire({
                            title: "Deleted!",
                            text: "Geofence has been deleted.",
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#newFenceName').val('');
                                // location.reload();
                                // displayGeofences();
                                uncheckGeofence();
                                checkGeofence();
                                loadingSwal();
                            }
                        });
                        setTimeout(function() { 
                            // location.reload();
                        }, 2000);
                    }
                }
            });
        }
    });

}


// FILTERING MARKER CHANNEL FUNCTIONS
$('#channelchk').change(function() {
    if (filteredArray.length > 0) {
        if(isIncludeSosyo){
            displaySosyoMarkers();
        }
        if(isIncludeSyspro){
            displayMarkers();
            changeProductive(0);
        }
    }
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#heatmapchk').prop('checked', false);
    $('#slider').hide();
    clearHeatMap();
    $('#geofencechk').prop('checked', false);
    uncheckGeofence();
    if ($(this).is(':checked')) {
        $('#customerChannelFilterModal').modal('show');
    } else{
        isFilteredChannel = 0;
        if(isIncludeSosyo){
            displaySosyoMarkers();
        }
        if(isIncludeSyspro){
            displayMarkers();
            changeProductive(0);
        }
    }
});

function getChannel(){
    $.ajax ({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php', 
        type: "POST",
        data:{
            "type": "Fetch_channels_digimap",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,      
        success: function(r){ 
            document.querySelector('#channelList').destroy();

            var myOptions = [];
            for (var x = 0; x < r.length; x++) {
                var obj = { 
                    label: (r[x].Channel).trim()+" - "+r[x].CustomerChannel, 
                    value: (r[x].Channel).trim()  
                };
                myOptions.push(obj);
            }

            VirtualSelect.init({
                ele: '#channelList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Channel'
            });
        }
    }); 
}

function filterChannel(){
    if($('#channelList').val().length == 0){
        $('#customerChannelFilterModal').modal('hide');
        $('#channelchk').prop('checked', false);

        Swal.fire({
            text: "No channel selected...",
            icon: "error"
        });
        return;
    }

    if (filteredArray.length > 0) {
        clearMarkCluster();
        $('#clusteringchk').prop('checked', false);
        clearHeatMap();
        $('#heatmapchk').prop('checked', false);
        $('#slider').hide();

        filteredArray.forEach(marker => {
            if (marker.mcpDay != 0) {
                marker.setMap(null);
            }
        });
    }

    var channelArr = $('#channelList').val();
    if(isIncludeSyspro){
        filteredArray = filteredArray.map(marker => {
            if (marker.mcpDay != 0) {
                if(channelArr.includes(marker.channel)){
                    marker.setMap(map);
                } else{
                    marker.setMap(null);
                }
            } else {
                if(isIncludeSosyo){
                    marker.setMap(map);
                } else{
                    marker.setMap(null);
                }
            }
            return marker;
        }).filter(marker => marker.map != null);

        filteredChannelArr = filteredArray;
        isFilteredChannel = 1;
        getMiniDashboardData();
        updateMapStatus(1);
    }
    
    $('#customerChannelFilterModal').modal('hide');
}

function closeChannelModal(){
    $('#channelchk').prop('checked', false);
}


// PRODUCT BRAND CATEGORY
function openModalProductHeatmapFilter(){
    if(productMarkers.length <= 0){
        Swal.fire({
            html: "Loading... Product Data is still being fetched...",
            timerProgressBar: true,
            allowOutsideClick: true,
            showCloseButton: true,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        return;
    }

    $('#productHeatmapFilterModal').modal('show');
}

function getTransacProducts(salesman, startPickDate, endPickDate) {
    productMarkers = [];
    var batchSize = 50; 
    var batches = splitArrayIntoBatches(salesman, batchSize);
    var completedBatches = 0;  
    $('#filterByProdCatBtn').prop('disabled', true);

    batches.forEach(batch => {
        $.ajax({
            url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
            type: "POST",
            data: { 
                "type": "digimap_TransacProduct", 
                "distCode": GBL_DISTCODE,
                "startdate": startPickDate,
                "enddate": endPickDate,
                "salesman": batch,
            },
            dataType: "JSON",
            crossDomain: true,
            cache: false,     
            success: function (response) {
                if (response == 0) {
                    console.log('empty dashboard!');
                } else {
                    for (var x = 0; x < response.length; x++) {
                        var qty = parseInt(response[x].quantity);
                        var price = parseFloat(response[x].piecePrice);
                        var sale = (qty*price);
                        
                        productMarker = new google.maps.Marker({
                            map: null,
                            brandColor: getRandomColor(),
                            brandName: response[x].Brand,
                            stockCode: response[x].stockCode,
                            productDes: response[x].description,
                            transacPrice: sale,
                            appIdentifier: response[x].APPIDENTIFIER,
                            municipality: response[x].MUNICIPALITY,
                            long: response[x].longitude,
                            lat: response[x].latitude,
                            position: new google.maps.LatLng(response[x].latitude, response[x].longitude),
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 7,
                                fillColor: "#fc0303",
                                fillOpacity: 0.4,
                                strokeWeight: 0
                            }
                        });
                        productMarkers.push(productMarker);
                    }
                } 
            }//success
        }).done(function(){
            completedBatches++;
    
            if (completedBatches === batches.length) {
                getProductCategories();
            }
        });
    });
}

function heatMapProductCat(){
    checkIncluded();
    ClearSosyoMarkers();
    ClearMarkers();
    $('#clusteringchk').prop('checked', false);
    clearMarkCluster();
    $('#geofencechk').prop('checked', false);
    uncheckGeofence();    
    $('#heatmapchk').prop('checked', true);   
    $('#slider').show();  

    clearHeatMap();
    var prodBrand = $('#prodCategoryList').val(); 
    var selectedproductMarkers = [];

    if(prodBrand == "All"){
        selectedproductMarkers = productMarkers;
    } else {
        selectedproductMarkers = productMarkers.filter(marker => marker.brandName == prodBrand);
    }
    productSourceData(selectedproductMarkers);

    // selectedproductMarkers.forEach(marker => {
    //     marker.setMap(map);
    // });

    var heatmapDataProduct = selectedproductMarkers.map(item => ({
        location: new google.maps.LatLng(item.lat, item.long),
    }));

    heatmap1 = new google.maps.visualization.HeatmapLayer({
        data: heatmapDataProduct,
        map: map,
        radius: heatmapRadius, 
        opacity: 0.8,
    });
    
    $('#status_map_filtering').html('Filtered By Product Brand ('+prodBrand+')');

    $('#productHeatmapFilterModal').modal('hide');

    $('.salesmappingOuterCont').hide();
    $('.geofencingOuterCont').hide();
    $('.productOuterCont').show();
    isShowingHeatmapSetting();
}

function getProductCategories(){
    var uniqueBrands = [...new Set(productMarkers.map(productMarker => productMarker.brandName))];

    document.querySelector('#prodCategoryList').destroy();
    var myOptions = [{ label: 'Select All', value: 'All' }];
    // var myOptions = [];

    for (var x = 0; x < uniqueBrands.length; x++) {
        var obj = { 
            label: (uniqueBrands[x]), 
            value: (uniqueBrands[x])  
        };
        myOptions.push(obj);
    }

    VirtualSelect.init({
        ele: '#prodCategoryList',
        options: myOptions,
        search: true,
        multiple: false,
        maxWidth: '100%', 
        placeholder: 'Select Brand',
        disableSelectAll: false,
    });

    $('#filterByProdCatBtn').prop('disabled', false);
}

function productSourceData(sourcedata){
    sourceDataSelectedProducts = sourcedata;
    let merged = [];
    let group = {}; 
    totalTransacSales = 0;

    sourceDataSelectedProducts.forEach(item => {
        let key = `${item.stockCode}-${item.municipality}`;
        if (group[key]){
            group[key].transacPrice += item.transacPrice;
        } else {
            group[key] = { ...item };
        }

        totalTransacSales += item.transacPrice;
    });

    merged = Object.values(group);

    merged.forEach(item => {
        var percentage = ((item.transacPrice/totalTransacSales)*100).toFixed(1);
        item.percent = percentage;
    })

    product_tableData.clear().rows.add(merged).draw().draw();

    $('#product_overAllTotal').show();
    $('#dataTableproductTotalSales').html(" Total: "+" <span class='fw-bold'> ₱ " + totalTransacSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+"</span>");
}

function productDataTable(){
    product_tableData = new DataTable('#productTable',{
        dom: '<"m-1"<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between" ip>>',
        pageLength: 10,
        order: true,    
        responsive: false,
        source: sourceDataSelectedProducts,
        bSort: true,
        // scrollY: '200px',
        "autoWidth": false,
        columns: [
            { data: "municipality", title:"Municipality"},
            { data: "productDes", title:"Product"},
            { data: "transacPrice", title:"₱" },
            { data: "percent", title:"%" },
        ],
        columnDefs: [
            {
                targets: 0,
                className: 'product_tableData_ellipsis'
            },
            {
                targets: [2, 3],
                className: 'text-end'
            },
        ],
        buttons: [
            {
              extend: 'excelHtml5',
              text: 'Export', 
              title: 'MyBuddy_DigitalMapping_Products', 
            },
            // {
            //     extend: 'csvHtml5',
            //     text: 'CSV',
            //     title: 'MyBuddy_DigitalMapping_Products',
            // },
            // {
            //     extend: 'print',
            //     text: 'Print',
            //     title: 'MyBuddy_DigitalMapping_Products',
            //     customize: function(win) {
            //         $(win.document.body).css('font-size', '10pt');
            //         $(win.document.body).find('table').addClass('compact').css('font-size', 'inherit');
            //     },
            // }
        ],
        rowCallback: function(row, data, index){
            $(row).find('td:eq(2)').text((data.transacPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }  
    });

    $('.dt-search input[type="search"]').on('keyup', function() {
        var searchedData = product_tableData.search(this.value).draw();
        getTblProductTotal(searchedData)
    });
}

function getTblProductTotal(dataTables){
    var filteredData = dataTables.rows({ search: 'applied' }).data();
    var tblTotal = 0;
    var dataTotalCtr = filteredData.length;

    filteredData.each(function(row) {
        var amountStr = row.transacPrice;
        tblTotal+=amountStr;
    });

    $('#dataTableproductTotalSales').html(" Total: "+" <span class='fw-bold'> ₱ " + tblTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+"</span>");

}

function checkIncluded(){
    if(!isIncludeSosyo && !isIncludeSyspro){
        isIncludeSyspro = 1;

        $('#showmarkerschk').prop('checked', true);
        $('#colorperdaychk').prop('disabled', false);
        $('.dropstartColorLegendBtn').addClass('disbledBtn');  
        $('#channelchk').prop('disabled', false);

        displayMarkers();
    }
}

initHeatmapSetting();
function initHeatmapSetting(){
    $("#range").rangeRover({
        data: {
            start: 0,
            end: 100
        },
        onChange : function(val) {
            // console.log('val', val.start.value);
            heatmapRadius = val.start.value;
            heatmap1.set('radius', heatmapRadius);
          }
    });
    var sliderItemWidth = (parseFloat($('.ds-item').css('width')))*20;
    $('.ds-skate').css('left', sliderItemWidth);
    $('.ds-skate-year-mark').html('20');
    $('.sliderDropdown').removeClass('show');
    $('#slider').hide();
}


$('.sliderDropdown').click(function (event) {
    event.stopPropagation(); // Prevent the click from bubbling up
});

function isShowingHeatmapSetting(){
    setTimeout(function () { 
        if (!$('.sliderDropdown').hasClass('show')) {
            $('#slider').dropdown('toggle');
        }
    }, 100);
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));