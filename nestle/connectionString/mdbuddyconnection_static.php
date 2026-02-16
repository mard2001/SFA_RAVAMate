<?php 


Class Connection_bohol {
 
  private  $server = "sqlsrv:Server=fdcbohol.dynns.com,9050;Database=mybuddy";
  private  $user = "sfa";
  private  $pass = "1245678";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
          	public function openConnection_bohol()
 
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
 
public function closeConnection_bohol() {
 
   	$this->con = null;
 
	}
 
}

Class Connection_samar {
 
private  $server = "sqlsrv:Server=fdcsamar.dynns.com,9050;Database=mybuddy";
private  $user = "sfa";
private  $pass = "1245678";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnection_samar()
 
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
 
public function closeConnection_samar() {
 
    $this->con = null;
 
  }
 
}

Class Connection_tacloban {
 
  private  $server = "sqlsrv:Server=fdcleyte.dynns.com,9050;Database=mybuddy";
  private  $user = "sfa";
  private  $pass = "1245678";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnection_tacloban()
 
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
 
public function closeConnection_tacloban() {
 
    $this->con = null;
 
  }
 
}

Class Connection_cagayan {
 
  private  $server = "sqlsrv:Server=fdccdo.dynns.com,9050;Database=mybuddy";
  private  $user = "sfa";
  private  $pass = "1245678";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnection_cagayan()
 
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
 
public function closeConnection_cagayan() {
 
    $this->con = null;
 
  }
 
}


Class Connection_gensan {
  private  $server = "sqlsrv:Server=fdcgensan.dynns.com,9050;Database=mybuddy";
  private  $user = "sfa";
  private  $pass = "1245678";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
protected $con;
 
            public function openConnection_gensan(){
               try{
 
                $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
                return $this->con;
 
                  }catch (PDOException $e){
 
                     echo "There is some problem in connection: " . $e->getMessage();
 
                 }
 
            }
 
public function closeConnection_gensan() {
    $this->con = null;
  }
}



Class Connection_roxas {
  private  $server = "sqlsrv:Server=fdcroxas.dynns.com;Database=mybuddy_fdc_roxas";
  private  $user = "Impact_Services";
  private  $pass = "pass";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
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