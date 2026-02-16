<?php
	Class FastsosyoConfigConnection {
 
		private  $server = "sqlsrv:Server=107.191.61.132,8055;Database=FASTSOSYO";
		private  $user = "fastsosyo_user";
		private  $pass = "ZPkJ@D:uM#Mh'79<";
		 
		private $options  = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,);
		 
		protected $con;
		 
		            public function openConAIO()
		 
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
		 
		public function closeConCloud() {
		 
		    $this->con = null;
		 
		  }
 
}

?>