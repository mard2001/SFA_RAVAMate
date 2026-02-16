<?php

Class Connection_local {
 
  private  $server = "sqlsrv:Server=fdccdo.dynns.com,9050;Database=mybuddy";
  private  $user = "Impact_Services";
  private  $pass = "pass";
 
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


Class Connection_cagayan {
  private  $server = "sqlsrv:Server=fdccdo.dynns.com,9050;Database=mybuddy";
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