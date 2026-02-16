
function databasepurge(){
    alert('Attention:\n\nYou are about to delete older data below one year; please ensure that you have already backup your database in case you need the previous records for future use.\n\n'+ 
    'If you already create a backup, please click on the proceed button and wait while we process your request, as this may take time.\n\n'+
    'Note: Please ensure that nobody is using MyBuddy Sync before you you proceed.');
    $('#purgeModal').modal('show');
   }

  function checkpurgepass(){
    var pass = $('#purgePass').val();
    console.log(pass);
    if(pass == '1245678'){
        $('#purgeModal').modal('hide');
        executepurge();
    }else{
        alert('Invalid Password please try again.');
    }
  }

  function executepurge(){
    var r = confirm('This could take time, please wait while we process your request and ensure database is not in a busy state.');
    if(r){

      var mdCode = $('#salesmanList').val();
      var dialog = bootbox.dialog({
            message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> Purging database please wait...</p>',
            backdrop: true
           // closeButton: false
          });
      var message = 'Successfully Saved!';
      var botboxMsg = '';
      var ajaxTime= new Date().getTime();
      $.ajax ({
          url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
          type: "POST",
          data: {
                    "type":"PURGEDATABASE",
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE
                }, 
          dataType: 'json',     
          crossDomain: true,
          cache: false,   
          success: function(response){   
           if(response){
              botboxMsg = '<b style="color: green;">Success!</b><p>Buddy purging Successfully updated. Thank You!</p>';
            }else{
              botboxMsg = '<b style="color: red;">Ops! Unable to Purge Database!</b>' + response;
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b style="color: red;">Ops! Unable to Purge Database!</b>' + XMLHttpRequest.responseText;
            var totalTime = new Date().getTime()-ajaxTime;
            dialog.init(function(){
                  setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
           }
          }).done(function () {
                  dialog.init(function(){
                        setTimeout(function(){
                          dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                      }, 1000);
                });
           });
    }
  }