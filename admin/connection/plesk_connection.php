<?php
 
Class Connection_plesk {
 
private $server = "mysql:host=66.42.107.79;dbname=mybuddy";
private $user = "newdatabasejhun";
private $pass = "9Qx9mk^82";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
protected $con;
 
          	public function openConnection_plesk()
 
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
 
public function closeConnection_godaddy() {
 
   	$this->con = null;
 
	}
 
}
 
?>