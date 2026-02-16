<?php

Class Connection_local {

    private  $server = "sqlsrv:Server=124.107.230.238,9050;Database=mybuddy";
    private  $user = "sfa";
    private  $pass = "1245678";

    // private  $server = "sqlsrv:Server=192.168.10.36;Database=mybuddy";
    // private  $user = "Impact_Services";
    // private  $pass = "pass";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
          	public function openConnection_local()
 
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

Class Connection_gensan{
    private  $server = "sqlsrv:Server=124.107.230.238,9050;Database=mybuddy";
    private  $user = "Impact_Services";
    private  $pass = "pass";
  private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
  protected $con;
   
              public function openConnection_local(){
                 try{
   
                  $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
                  return $this->con;
   
                    }catch (PDOException $e){
   
                       echo "There is some problem in connection: " . $e->getMessage();
   
                   }
   
              }
   
  public function closeConnection() {
      $this->con = null;
    }
  }
 
?>