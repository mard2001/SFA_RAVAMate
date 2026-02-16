<?php
ini_set('max_execution_time', 0);
Class ConnectionSMSApi {
 
    private  $server = "sqlsrv:Server=107.191.61.132,8055;Database=VITAL_PBB_FINAL";
    private  $user = "vitalpbb";
		private  $pass = "fq9YReFTUTV#?g1";
     
    private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
     
    protected $con;
     
                public function openConnection_text()
     
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