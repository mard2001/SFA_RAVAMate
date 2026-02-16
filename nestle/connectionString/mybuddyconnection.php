<?php 
Class ConfigConnection {
 
 
protected $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnection($server, $user, $pass){
 
               try
 
                 {

                	$this->con = new PDO($server, $user, $pass, $this->options);
       
                	return $this->con;
                	//echo "Connection Successfull!";
 				  
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