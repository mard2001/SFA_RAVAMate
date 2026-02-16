var usertype = localStorage.getItem("usertype");

determineUserType(usertype); 
// getcompname();
getcompname_dynamic("Customer Tagging", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Customer Tagging');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('#titleHeading').html('<i class="fa fa-circle blinking"></i> <b style="color:red;">ERROR:</b> Unable to establish a connection from your server. Please check your server settings.');
        }
    });
} 
      
var sourceDat;
$('.loading-table').hide();
function customerTaggingData(){
    $('#stockRequest_TAB').hide();
    $('.loading-table').show();
    // var dialog = bootbox.dialog({
    //     message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
    //     backdrop: true
    // });
    // var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_CUSTOMER_TAGGING", "salesman":'SALESMANHERE', "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                sourceDat = r;
                $('#stockRequest_TAB').show();
                $('.loading-table').hide();
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED DATE: ' + start +' to '+ end);
            }

            // dialog.modal('hide');
        },
        // error: function(XMLHttpRequest, textStatus, errorThrown) {
        //     botboxMsg = '<b class="text-danger">Ops! Something went wrong!</b><br/>' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!';
        //     dialog.init(function(){
        //         setTimeout(function(){
        //             dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
        //         }, 1000);
        //     });
        // }
    }).done(function () {
        // dialog.init(function(){
        //     setTimeout(function(){
        //         dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
        //     }, 1000);
        // });
    });
}

      
datatableApp();
customerTaggingData();
tableData.clear().rows.add(sourceDat).draw();

var tableData;
function datatableApp(){
    // $('[data-bs-toggle="tooltip"]').tooltip();
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "language": {
            "emptyTable": "No available salesman records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "Salesperson", title: "Salesperson" },
            { data: "custCode", title: "CustCode" },
            { data: "custName", title: "CustName" },
            { data: "contactCellNumber", title: "Contact CellNumber"},
            { data: "longitude", title: "Longitude" },
            { data: "latitude", title: "Latitude" },
            { data: "Tagging Completed", title: "Tagging Completed" },
        ],
        columnDefs: [
            {
                targets: 6,
                className : "text-center",
            },
            {
                targets: 7,
                data : null,
                className : "text-right",
                defaultContent : '<button class="updateBtnTable"><span class="mdi mdi-update"></span> UPDATE</button>',
            }
        ],
        drawCallback: function (settings) {
            // $('[data-bs-toggle="tooltip"]').tooltip();
        },
        rowCallback: function(row, data, index){
            var link = data.Link.toString();
            var isTag = $(row).find('td:eq(6)').text().toString();
            var custCode = data.custCode.toString();
            if(isTag == 'N'){
                $(row).find('td:eq(4)').html('<span style="color: red;"> --- </span>');
                $(row).find('td:eq(5)').html('<span style="color: red;"> --- </span>');
                // $(row).find('td:eq(6)').css({'color':'red', 'font-weight':'bold', 'border-bottom': '0.5px solid black'});
                $(row).find('td:eq(7)').html('');
            }else{
                // $(row).find('td:eq(6)').css({'color':'green', 'font-weight':'900', 'border-bottom': '0.5px solid black'});
                $(row).find('td:eq(7)').html('<button class="updateBtnTable" onclick="locationModal(\''+custCode+'\', \''+data.latitude.toString()+'\', \''+data.longitude.toString()+'\')"><span class="mdi mdi-update"></span> UPDATE</button>');
                $(row).find('td:eq(2)').html('<a href="'+link+'" target="_blank" data-bs-toggle="tooltip"  data-bs-placement="right" data-bs-title="Click to view location on map!">'+data.custName.toString()+'</a>');
            }               
        },
        buttons: [ 
            {
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6]
                }
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6]
                }
            }
        ]
    });

    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-print').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-copy').trigger('click');
    });
    $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
        var searchTerm = $(this).val();
        tableData.search(searchTerm).draw();
    });
}

tableData.on( 'draw', function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
});

var markers = [];
function removeMarker(){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

//var marker;
function locationModal(custCode, lat, lng){
    $('#updateLocationModal').modal('show');
    removeMarker();
    var myLatlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true,
        title: 'Hello World!' + custCode
    });

    map.addListener(marker, 'dragend', function() {
        console.log('You move me' + this.position);
    });

    map.setCenter(myLatlng);
    map.setZoom(16);
    markers.push(marker);
}

var map, destmarker = [];
function initMap() {
    var directionsService = new google.maps.DirectionsService; 
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var zm = 9; // zm = sitezoom;
    var lt = '-25.363'; // lt = sitelat;
    var lg = '131.044'; // lg = sitelng;

    mapOptions = {
        zoom: parseInt(zm), 
        center: {lat: parseFloat(lt), lng: parseFloat(lg)},
        mapTypeId: 'roadmap',
        controlSize: 25,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: false
    }
      
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

  
    function getZoomLevel(){
        var zoomInDelimeter = map.getZoom();
        $('#zoomLevel').val('Zoom Level: '+ zoomInDelimeter);
        $('.zoom-value').html( zoomInDelimeter);
        globalZoom = zoomInDelimeter;
    }

    function sitelocation(){
        var options = {componentRestrictions: {country: "ph"}};
        var originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('sitepinpoint'), options);
        google.maps.event.addListener(originAutocomplete, 'place_changed', function () {
            var place = originAutocomplete.getPlace();
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();

            remvmarker();
            destmarker = new google.maps.Marker({
                position: {lat: lat, lng: lng},
                draggable:true,
                map: map,
                title: 'Map Center POV!'
	        });

            collectormarkers.push(destmarker);
	        map.setCenter(destmarker.getPosition());
	        map.setZoom(10);
        });
    }
}

function formcreation(map){
    this.map = map;
    var dispDeviation = document.getElementById("site_creation_form");
    this.map.controls[google.maps.ControlPosition.LEFT].push(dispDeviation);
}