var GLOBALURL = "https://asissfa.com/shpos";

function imgError(image) {
    image.onerror = "";
    image.src = "../img/no-product-image.png";
    return true;
  }  


  function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
    
}

function checkUserAccount(){
    var suppID = localStorage.getItem('PRTID');
    if(suppID == 'NAI' || suppID == 'MNC'){
        $('.nmusers').hide();
    }else{
        $('.nmusers').show();
    }
}


function hideModal(modalName){
    $("#"+modalName).removeClass("in");
    $(".modal-backdrop").remove();
    $("#"+modalName).hide();
}

getAdminName();
function getAdminName(){
    var adminName = localStorage.getItem('S_ADMNAME');
    var path = $(location).attr('pathname');
    var distCode = localStorage.getItem('S_DISTCODE');

    $('.HIDETHISGLOBAL').show();
    if(distCode == null || distCode == '' || distCode == undefined){
        $('.HIDETHISGLOBAL').show();
    }else{
        $('.HIDETHISGLOBAL').hide();
    }

    if(path != '/vdfs/a/pos/sneat-1.0.0 2/html/index.html'){

        if(adminName == null ||
           adminName == 'null' ||
           adminName == undefined ||
           adminName == '' ||
           adminName == 'undefined'){

            alert('Unauthorized login.');
            // alert(path);
            window.location.href = 'index.html';

        }else{

            // alert('sulod: ' +adminName);
            $('#admNameHolder').html(adminName);
            $('#admNameHolder2').html(adminName);
        }
        
    }

}

function logoutsosyoadm(){
    localStorage.removeItem('S_ADMNAME');
    localStorage.removeItem('S_ADMID');

    window.location.href = 'index';

}
