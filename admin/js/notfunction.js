$('#logoutBtn_admin').click(function() {
    updateOfflineStat(user);
    localStorage.removeItem('admin_username');
    window.location = "https://mybuddy.dynns.com";

  });

  $('.listMaterialsContainer').removeClass('hidden');
  $('.addMaterialsContainer').removeClass('hidden');
  $('.viewMaterialsContainer').removeClass('hidden');
  $('.viewSiteListContainer').removeClass('hidden');

  $('.createUserContainer').hide();
  $('.createSiteContainer').hide();

  $('#uploadImg_BTN').hide();
  $('#cancelImg_BTN').hide();

  $("#btn_upload").click(function(){
    $(".hidden").click();
  });

  $("#btn_upload_update").click(function(){
    $(".hiddenUpdate").click();
  });

//show list of materials on default
  $('.onlineUserContainer').show();

  $('.listMaterialsContainer').hide();
  $('.addMaterialsContainer').hide();
  $('.viewMaterialsContainer').hide();
  $('.viewSiteListContainer').hide();
  $('#onlineListBtn').addClass('activecust');
//show list of materials
$('#onlineListBtn').click(function (){
  $('.onlineUserContainer').show();
  $('.listMaterialsContainer').hide();
  $('.addMaterialsContainer').hide();
  $('.viewMaterialsContainer').hide();
  $('.viewSiteListContainer').hide();
  
  $('#onlineListBtn').addClass('activecust');
  $('#listMatBtn').removeClass('activecust');
  $('#addMatBtn').removeClass('activecust');
  $('#viewMatBtn').removeClass('activecust');
  $('#siteListBtn').removeClass('activecust');

  tableData.columns.adjust().draw();
});

$('#listMatBtn').click(function(){
  $('.topProdCont').html('<i class="fas fa-globe"></i> WEB USERS');
  $('.listMaterialsContainer').show();
  $('.addMaterialsContainer').hide();
  $('.viewMaterialsContainer').hide();
  $('.onlineUserContainer').hide();
  $('.viewSiteListContainer').hide();

  $('#listMatBtn').addClass('activecust');
  $('#onlineListBtn').removeClass('activecust');
  $('#addMatBtn').removeClass('activecust');
  $('#viewMatBtn').removeClass('activecust');
  $('#siteListBtn').removeClass('activecust');

  tableData_All.columns.adjust().draw();
});
//show add materials
$('#addMatBtn').click(function(){
  $('.topProdCont').html('<i class="fas fa-user-plus"></i> ADD USER');
  $('.addMaterialsContainer').show();
  $('.listMaterialsContainer').hide();
  $('.viewMaterialsContainer').hide();
  $('.onlineUserContainer').hide();
  $('.viewSiteListContainer').hide();

  $('#addMatBtn').addClass('activecust');
  $('#onlineListBtn').removeClass('activecust');
  $('#listMatBtn').removeClass('activecust');
  $('#viewMatBtn').removeClass('activecust');
  $('#siteListBtn').removeClass('activecust');

  $('#overallchecker').hide();
  $('#emailchecker').hide();
  $('#contactchecker').hide();

});

$('#siteListBtn').click(function (){
  $('.viewSiteListContainer').show();
  $('.addMaterialsContainer').hide();
  $('.listMaterialsContainer').hide();
  $('.viewMaterialsContainer').hide();
  $('.onlineUserContainer').hide();

  $('#siteListBtn').addClass('activecust');
  $('#addMatBtn').removeClass('activecust');
  $('#onlineListBtn').removeClass('activecust');
  $('#listMatBtn').removeClass('activecust');
  $('#viewMatBtn').removeClass('activecust');

});


//show view order materials
$('#viewMatBtn').click(function(){
  //tableData2.columns.adjust().draw();
  $('.topProdCont').html('<i class="fas fa-mobile-alt"></i> MOBILE USERS');
  $('.viewMaterialsContainer').show();
  $('.listMaterialsContainer').hide();
  $('.addMaterialsContainer').hide();
  $('.onlineUserContainer').hide();
  $('.viewSiteListContainer').hide();
  
  $('#viewMatBtn').addClass('activecust');
  $('#onlineListBtn').removeClass('activecust');
  $('#listMatBtn').removeClass('activecust');
  $('#addMatBtn').removeClass('activecust');
});

$('.backtocreate').click(function (){
  $('.createUserContainer').hide();
  $('.createSiteContainer').hide();
  $('.selectionHolder').show();
});

function togglechevron(cont){
  $('.'+cont).toggleClass("fa-chevron-up");
}


function clearInputs(){
  $('#username').val('');
  $('#password').val('');
  $('#fullname').val('');
  $('#email').val('');
  $('#contactno').val('');
  $('#distributor').val('');
  $('#site').val('');
  $('#usertype').val('');
  $('.hidethissec').hide();
}

function updateOfflineStat(usernm){
  $.ajax({
     url: "/web/databaseApi.php",
     type: "GET",
     data: {
            "type":"updateOfflineStat",
            "username": usernm
          },
     dataType: "json",
     crossDomain: true,
     cache: false,            
     async: false,
      success: function(r){ 
        console.log(r);
      }
    });
}

