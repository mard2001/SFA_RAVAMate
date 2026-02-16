
let isShownShowlistTableBtn = false;
let isShowlistTableFenceBtn = false;

$('.reportBtn').click(function(){
    $(this).next('.sidebarDropdown').slideToggle();
})

$('#dropMenu').click(function(){
    handleTopNav();
})



function handleTopNav(){
    if($('.mapScreenDiv').hasClass('dropMenuActive')){
        $('.mapScreenDiv').removeClass('dropMenuActive');
        $(".rotate").removeClass("down"); 
        $('#dropMenu').css({"margin-top":"35px"});
    }else{
        $('.mapScreenDiv').addClass('dropMenuActive');
        $(".rotate").addClass("down"); 
        $('#dropMenu').css({"margin-top":"-50px"});
    }
}

$("#buddyIframe").attr("src", 'https://fastbi-analytics.com/public/dashboard/c49f08ac-fbc3-426d-b213-4ca5248c010c?category=&document_date=past12months~&level=&outlet_type=&period_month=&period_year=2025&salesman=&sku=&tab=50-sales-%26-bo-summary');

$('#digitalmappingMainBtn').click(function(){
    $("#geofencingBtns").attr("style", "display: none !important");
    $('#defaultmapBtns').show(500);
    $('.digiMapPopup').toggle(1000);
})

$('#gefencingMainBtn').click(function(){
    $("#defaultmapBtns").attr("style", "display: none !important");
    $('#geofencingBtns').show(500);
    $('.digiMapPopup').hide(1000);
})

$('#showlistTableBtn').click(function(){
    if(!isShownShowlistTableBtn && markers4.length > 0){
        $('#showlistTableCollapseExample1').slideDown();
        isShownShowlistTableBtn = true;
    } else if(!isShownShowlistTableBtn && markers4.length == 0){
        alert("No Markers To Show... ")
    } else{
        $('#showlistTableCollapseExample1').slideUp();
        $('#showlistTableCollapseExample1').hide(50);
        $('#showlistTableCollapseExample2').slideUp();
        $('#showlistTableCollapseExample2').hide(50);
        isShowlistTableFenceBtn = false;
        isShownShowlistTableBtn = false;
    }
})

$('#showlistTableFenceBtn').click(function(){
    if(!isShowlistTableFenceBtn){
        $('#showlistTableCollapseExample2').slideDown();
        isShowlistTableFenceBtn = true;
    } else{
        $('#showlistTableCollapseExample2').slideUp();
        $('#showlistTableCollapseExample2').hide(100);
        isShowlistTableFenceBtn = false;
    }
})

$('#mdi-earth-maps-btn').click(function(){
    var element = $('#mdi-earth-maps-btn span');
    if (element.hasClass("mdi-earth")) {
        element.removeClass("mdi-earth").addClass("mdi-map-outline");
    } else {
        element.removeClass("mdi-map-outline").addClass("mdi-earth");
    }
})
$('.mdi-earth-maps-btn').click(function(){
    var element = $('.mdi-earth-maps-btn span');
    if (element.hasClass("mdi-earth")) {
        element.removeClass("mdi-earth").addClass("mdi-map-outline");
    } else {
        element.removeClass("mdi-map-outline").addClass("mdi-earth");
    }
})

$('#mdi-fullscreen-maps-btn').click(function(){
    var element = $('#mdi-fullscreen-maps-btn span');
    if (element.hasClass("mdi-fullscreen")) {
        element.removeClass("mdi-fullscreen").addClass("mdi-fullscreen-exit");
    } else {
        element.removeClass("mdi-fullscreen-exit").addClass("mdi-fullscreen");
    }
})

$('#toggleTableListBtn').click(function(){
    var element = $('#toggleTableListBtn i');
    if($('#toggleTableListBtnIcon').hasClass('fa-caret-left')){
        $('.mainMapDiv').hide(800);
        // $('.mainMapDiv').animate({width:'toggle'},450);
        element.removeClass('fa-caret-left').addClass('fa-caret-right');
    } else {
        $('.mainMapDiv').show(800);
        element.removeClass('fa-caret-right').addClass('fa-caret-left');
    }
    
    
});



