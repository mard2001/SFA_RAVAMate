
function connect(){
      var server = $('#servername').val();
      var password = $('#serverpassword').val();
      var username = $('#serverusername').val();
      var db = $('#serverdb').val();
      $('#serverBtn').html('Please wait....');
      $('#serverBtn').html("<i class='fa fa-spin fa-spinner'></i> Please wait..");
      $('#serverBtn').prop('disabled', true);
      $.ajax ({
          url: GLOBALLINKAPI+"nestle/testconnection.php",
          type: "GET",
          data: {
                  "server":server,
                  "username": username,
                  "password": password,
                  "database": db
                },
          dataType: "json",
          crossDomain: true,
          cache: false,            
            success: function(r){
              if(r.outcome){

                localStorage.setItem('srvr', server);
                localStorage.setItem('usrnm', username);
                localStorage.setItem('psswrd', password);
                localStorage.setItem('dtbse', db);

                var s = localStorage.getItem("srvr");
                var u = localStorage.getItem("usrnm");
                var p = localStorage.getItem("psswrd");
                var d = localStorage.getItem("dtbse");

                console.log(s +' '+ u +' '+ p +' '+ d);
               	alert('CONNECTION SUCCESSFULL!');
                window.location.href= "https://mybuddy-sfa.com/SFA/Dashboard";
              }else{
              	alert('DID NOT CONNECT TO SERVER!');
              }

               $('#serverBtn').html('Connect');
			         $('#serverBtn').prop('disabled', false);
            }
        });
    }

    function textCon(){
      var s = $('#stobeupdt').val();
      var d = $('#dtobeupdt').val();
      var u = $('#utobeupdt').val();
      var p = $('#ptobeupdt').val();
      $('#testBtn').html('Please wait....');
      $('#testBtn').html("<i class='fa fa-spin fa-spinner'></i> Connecting to " + s + "...");
      $('#testBtn').prop('disabled', true);
      $.ajax ({
          url: GLOBALLINKAPI+"/nestle/testconnection.php",
          type: "GET",
          data: {
                  "server":s,
                  "username": u,
                  "password": p,
                  "database": d
                },
          dataType: "json",
          crossDomain: true,
          cache: false,            
            success: function(r){
              if(r.outcome){
                 $.alert({
                      title: 'SUCCESS!',
                      theme: 'material',
                      content: 'Connected Successfully!',
                      icon: 'fas fa-thumbs-up',
                  type: 'green'
                  });
              }else{
                $.alert({
                      title: 'CONNECTION FAILED!',
                      theme: 'material',
                      content: 'Unable to establish a connection to server.',
                      icon: 'fas fa-thumbs-down',
                  type: 'red'
                  });
              }

               $('#testBtn').html('Test Connection');
               $('#testBtn').prop('disabled', false);
            }
        });
    }

    
             

