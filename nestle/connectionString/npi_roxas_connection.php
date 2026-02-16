<?php
  Class Connection_roxas {
private $server = "sqlsrv:Server=45.77.251.145;Database=mybuddy_fdc_roxas";
private $user = "Impact_Services";
private $pass = "pass";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC);
protected $con;
 
            public function openConnection_roxas(){
               try{
 
                $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
                return $this->con;
 
                  }catch (PDOException $e){
 
                     echo "There is some problem in connection: " . $e->getMessage();
 
                 }
 
            }
 
public function closeConnection_roxas() {
    $this->con = null;
  }
}

  ?>