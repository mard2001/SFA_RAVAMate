<?php
	Class Connection_number1seller {
 
private  $server = "sqlsrv:Server=122.55.250.34,9050;Database=mybuddy";
private  $user = "Impact_Services";
private  $pass = "pass";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnection_number1seller()
 
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
 
public function closeConnection_number1seller() {
 
    $this->con = null;
 
  }
 
}
 ?>