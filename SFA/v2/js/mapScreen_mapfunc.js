var map;
var drawingManager;
// var isdefaultRightBtn = true;

mapOptions = {
  center: { lat: 11.0891, lng: 124.8923 },
  zoom: 10,
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

function createRightControl(map) {
  const controlButton = document.getElementById('defaultmapBtns');

  $('#mdi-fullscreen-maps-btn').click(function (){
    $('#map div.gm-style button[title="Toggle fullscreen view"]').trigger('click');
  });

  $('#mdi-hand-back-left-outline-maps-btn').click(function (){
    drawingManager.setMap(null);
    drawingManager.setDrawingMode(null);
  });

  $('#mdi-earth-maps-btn').click(function (){
    console.log("changed1");
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

  $('#mdi-magnify-plus-outline-btn').click(function (){
    map.setZoom(map.getZoom() + 1);
  });

  $('#mdi-magnify-minus-outline-btn').click(function (){
    map.setZoom(map.getZoom() - 1);
  });

  $('#mdi-refresh-maps-btn').click(function (){
    map.setCenter({ lat: 9.8500, lng: 124.1435 });
    map.setZoom(11);
  });

  return controlButton;
}

function createRightGeoControl(map) {
  const controlButton = document.getElementById('geofencingBtns');

    $('#mdi-hand-back-left-outline-maps-btn').click(function (){
      drawingManager.setMap(null);
      drawingManager.setDrawingMode(null);
    });
    
    $('#geo-mdi-earth-maps-btn').click(function (){
      console.log("changed2");
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
      var element = $('#geo-mdi-earth-maps-btn span');
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
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  
  // Initial set of buttons
  updateRightControls(createRightControl);
  
  // Button click event listeners
  document.getElementById('digitalmappingMainBtn').addEventListener('click', function() {
    updateRightControls(createRightControl);
  });

  document.getElementById('geofencingBtns').addEventListener('click', function() {
    updateRightControls(createRightGeoControl);
  });
}

function updateRightControls(controlCreator) {
  const rightControls = map.controls[google.maps.ControlPosition.RIGHT];
  rightControls.clear();

  const rightControlDiv = document.createElement('div');
  const rightControl = controlCreator(map);
  rightControlDiv.appendChild(rightControl);

  rightControls.push(rightControlDiv);
}

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

  $('#mdi-magnify-plus-outline-btn').click(function (){
    map.setZoom(map.getZoom() + 1);
  });

  $('#mdi-magnify-minus-outline-btn').click(function (){
    map.setZoom(map.getZoom() - 1);
  });

  $('#mdi-refresh-maps-btn').click(function (){
    map.setCenter({ lat: 9.8500, lng: 124.1435 });
    map.setZoom(11);
  });