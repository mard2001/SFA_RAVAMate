<?php 

Class ConnectionEFAST_bohol {
 
private  $server = "sqlsrv:Server=222.127.125.58;Database=eFastText";
private  $user = "Impact_Services";
private  $pass = "pass";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
          	public function openConnectionEFAST_bohol()
 
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
 
public function closeConnectionEFAST_bohol() {
 
   	$this->con = null;
 
	}
 
}

Class ConnectionEFAST_samar {
 
private  $server = "sqlsrv:Server=203.177.15.42;Database=eFastText";
private  $user = "Impact_Services";
private  $pass = "pass";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnectionEFAST_samar()
 
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
 
public function closeConnectionEFAST_samar() {
 
    $this->con = null;
 
  }
 
}

Class ConnectionEFAST_tacloban {
 
private  $server = "sqlsrv:Server=202.78.110.130;Database=eFastText";
private  $user = "Impact_Services";
private  $pass = "pass";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnectionEFAST_tacloban()
 
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
 
public function closeConnectionEFAST_tacloban() {
 
    $this->con = null;
 
  }
 
}

Class ConnectionEFAST_cagayan{
 
private  $server = "sqlsrv:Server=fdccdo.dynns.com,9050;Database=mybuddy";//eFastText;
private  $user = "sfa";
private  $pass = "12445678";
 
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
 
protected $con;
 
            public function openConnectionEFAST_cagayan()
 
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
 
public function closeConnectionEFAST_cagayan() {
 
    $this->con = null;
 
  }
 
}


Class ConnectionEFAST_gensan {
private  $server = "sqlsrv:Server=121.96.45.54;Database=eFastText";
private  $user = "Impact_Services";
private  $pass = "pass";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
protected $con;
 
            public function openConnectionEFAST_gensan(){
               try{
 
                $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
                return $this->con;
 
                  }catch (PDOException $e){
 
                     echo "There is some problem in connection: " . $e->getMessage();
 
                 }
 
            }
 
public function closeConnectionEFAST_gensan() {
    $this->con = null;
  }
}

Class ConnectionEFAST_roxas {
private  $server = "sqlsrv:Server=mybuddy.dynns.com;Database=mybuddy_fdc_roxas";
private  $user = "Impact_Services";
private  $pass = "pass";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
protected $con;
 
            public function openConnectionEFAST_roxas(){
               try{
 
                $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
                return $this->con;
 
                  }catch (PDOException $e){
 
                     echo "There is some problem in connection: " . $e->getMessage();
 
                 }
 
            }
 
public function closeConnectionEFAST_roxas() {
    $this->con = null;
  }
}

Class ConnectionEFAST_number1seller {
private  $server = "sqlsrv:Server=45.77.251.145;Database=mybuddy_fdc_roxas";
private  $user = "Impact_Services";
private  $pass = "pass";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
protected $con;
 
            public function openConnectionEFAST_number1seller(){
               try{
 
                $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
                return $this->con;
 
                  }catch (PDOException $e){
 
                     echo "There is some problem in connection: " . $e->getMessage();
 
                 }
 
            }
 
public function closeConnectionEFAST_number1seller() {
    $this->con = null;
  }
}

Class ConnectionEFAST_primus_ventures {
private  $server = "sqlsrv:Server=45.77.251.145;Database=mybuddy_fdc_roxas";
private  $user = "Impact_Services";
private  $pass = "pass";
private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
protected $con;
 
            public function openConnectionEFAST_primus_ventures(){
               try{
 
                $this->con = new PDO($this->server, $this->user,$this->pass,$this->options);
                return $this->con;
 
                  }catch (PDOException $e){
 
                     echo "There is some problem in connection: " . $e->getMessage();
 
                 }
 
            }
 
public function closeConnectionEFAST_primus_ventures() {
    $this->con = null;
  }
}
 
?>