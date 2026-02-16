<?php
header("Access-Control-Allow-Origin: *");
Class Connection_ideliver {
 
  // private  $server = "sqlsrv:Server=fastdevs-api.com;Database=FASTSOSYO";
  // private  $user = "fastsosyo_user";
  // private  $pass = "ZPkJ@D:uM#Mh'79<";
  
  
  private  $server = "sqlsrv:Server=202.182.110.94,8055;Database=iDeliver_E";
  // private  $server = "sqlsrv:Server=158.247.235.203,8055;Database=iDeliver_E";
  private  $user = "ideliver_user";
  private  $pass = "1245678!";

  private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC);
     
    protected $con;
     
                public function openConnection_ideliver()
     
                {
     
                   try
     
                     {
     
                    $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
           
                    return $this->con;
     
                      }
     
                   catch (PDOException $e)
     
                     {
     
                         echo "There is some problem in connection: " . $e->getMessage();
     
                     }
     
                }
     
    public function closeConnection() {
     
        $this->con = null;
     
      }
     
    }


    

?>