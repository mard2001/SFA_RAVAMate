<?php 

$servername = $_GET['server'];
$port = $_GET['port'];
$username = $_GET['username'];
$password = $_GET['password'];
$database = $_GET['database'];

$server = "sqlsrv:Server=".$servername.";Database=".$database;

//mysql:host=127.0.0.1:3308;dbname=axpdb
try{
    $dbh = new pdo( $server,
        			$username,
                    $password,
                    array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::SQLSRV_TXN_SERIALIZABLE => '1')
                );
    die(json_encode(array('outcome' => true, 'message' => 'Connection successfully establish!')));
    
}
catch(PDOException $ex){
    die(json_encode(array('outcome' => false, 'message' => $ex)));
    // json_encode(print_r( sqlsrv_errors(), true));
}

?>