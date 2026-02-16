<?php
 
Class Connection_godaddy {
 
private  $server = "mysql:host=45.77.251.145;dbname=mdbuddydb";
 
private  $user = "fdcadmin";
 
private  $pass = "GodisGood321#@!";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
          	public function openConnection_godaddy()
 
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