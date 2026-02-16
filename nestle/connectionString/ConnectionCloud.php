<?php 

Class Connection {
 
private  $server = "sqlsrv:Server=66.42.107.79;Database=mybuddy";
private  $user = "sfauser";
private  $pass = "3Om0DNMX@xBwFcd";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
          	public function openConnection()
 
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

Class Connection_itbud {
 
private  $server = "sqlsrv:Server=43.224.33.89;Database=itbuddy";
private  $user = "sfauser";
private  $pass = "3Om0DNMX@xBwFcd";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnection_itbud()
 
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
 
public function closeConnection_itbud() {
 
    $this->con = null;
 
  }
 
}
 
?>