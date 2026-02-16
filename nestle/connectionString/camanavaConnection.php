<?php

 Class Connection_local {
 
    // private  $server = "sqlsrv:Server=192.168.10.40,8066;Database=mybuddy";
    //  private  $server = "sqlsrv:Server=180.193.174.138,8066;Database=mybuddy";
    private  $server = "sqlsrv:Server=180.193.174.138,8066;Database=mybuddy";
    private  $user = "sfa";
    private  $pass = "1245678";
 
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


Class Connection_camanava {
    private  $server = "sqlsrv:Server=192.168.10.140,8066;Database=mybuddy";
    private  $user = "sfa";
    private  $pass = "1245678";
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