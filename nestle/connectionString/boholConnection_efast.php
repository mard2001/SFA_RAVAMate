<?php 

Class Connection_efast {
    private  $server = "sqlsrv:Server=fdcbohol.dynns.com,9050;Database=mybuddy";
    private  $user = "sfa";
    private  $pass = "1245678";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC);
 
protected $con_efast;
 
          	public function efastConnection_local()
 
           	{
 
               try
 
                 {
 
				        $this->con_efast = new PDO($this->server, $this->user,$this->pass,$this->options);
			 
				        return $this->con_efast;
 
                  }
 
               catch (PDOException $e)
 
                 {
 
                     echo "There is some problem in connection: " . $e->getMessage();
 
                 }
 
           	}
 
public function closeConnection() {
 
   	$this->con_efast = null;
 
	}
 
}
 
?>