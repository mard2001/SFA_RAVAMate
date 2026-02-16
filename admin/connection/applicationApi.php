<?php
header("Access-Control-Allow-Origin: *");

include 'connection.php';
include 'databaseOperationsApi.php';

try{ 

    $con = new Connection();
    $op = new DBOperations();

    $db = $con->openConnection();

    if($_GET['type'] == "PATCH_LIST"){

        $res = $op->get_patchlist_adm($db);
        echo json_encode($res);

    }else if($_GET['type'] == "GET_FAKEGPSLISTING"){

        $res = $op->get_fakegpslisting($db);
        echo json_encode($res);

    }else if($_POST['type'] == "INSERT_PATCH"){

        $notes = $_POST['notes'];
        $query = $_POST['query'];

        $res = $op->exec_insert_new_patch_adm($db, $notes, $query);
        echo json_encode($res);

    }else if($_GET['type'] == "GET_USAGE_DATA"){

		$res = $op->get_mybuddy_usage_data($db);
		echo json_encode($res); 
  
	}else if($_GET['type'] == "TOTAL_USAGE"){

		$res = $op->total_usage($db);
		echo json_encode($res); 
  
	}else if($_POST['type'] == "UPDATE_PATCH"){

        $id = $_POST['patchID'];
        $notes = $_POST['notes'];
        $query = $_POST['query'];
        $status = $_POST['status'];
        
        $res = $op->exec_update_patch_adm($db, $id, $notes, $query, $status);
        echo json_encode($res);

    }else if($_POST['type'] == 'INSERT_USAGE_LOGS'){

		$REQUESTPHONENUM = $_POST['REQUESTPHONENUM'];
        $SENDPHONENUM = $_POST['SENDPHONENUM'];
        $OTP = $_POST['OTP'];
        
        $res = $op->exec_insert_mybuddy_request_usage_logs($db, $REQUESTPHONENUM, $SENDPHONENUM, $OTP);
        echo json_encode($res);

	}else if($_POST['type'] == 'UPDATE_USAGE_REQUEST_STAT'){

		$phoneNumber = $_POST['phoneNumber'];
        $OTP = $_POST['OTP'];
        
        $res = $op->update_usage_request_stat($db, $phoneNumber, $OTP);
        echo json_encode($res);

	}else if($_GET['type'] == "CHECK_USAGE_OTP"){

		$phoneNumber = $_GET['phoneNumber'];
		$OTP = $_GET['OTP'];
        
        $res = $op->checkUsageOtp($db, $phoneNumber, $OTP);
        echo json_encode($res);

    }else if($_GET['type'] == "DELETE_PATCH"){

        $id = $_GET['patchID'];
        
        $res = $op->exec_delete_patch_adm($db, $id);
        echo json_encode($res);

    }else if($_GET['type'] == "RESET_ACCOUNT"){

        $id = $_GET['mdCode'];
        
        $res = $op->reset_salesman_account($db, $id);
        echo json_encode($res);

    }else if($_POST['type'] == "SEND_SMS"){

        $phoneNumber = $_POST['phoneNumber'];
		$message = $_POST['message'];
        
        $res = $op->waveCellsms($phoneNumber, $message);
        echo json_encode($res);

    }else if($_GET['type'] == "PRODUCT_LIST"){

        $res = $op->get_cloud_productList($db);
        echo json_encode($res);

    }else if($_GET['type'] == "GET_MOBILE_USERS"){

        $res = $op->get_mobileUsersList($db);
        echo json_encode($res);

    }else if($_GET['type'] == 'GET_PRODUCT_IMAGE'){

		$stockCode = $_GET['stockCode'];
  
		$res = $op->get_product_image($db, $stockCode);
		echo json_encode($res);
	  
	}
	
	else if($_GET['type'] == "GET_BUG_REPORTS"){
		
		$start = $_GET['start'];
		$end = $_GET['end'];

        $res = $op->get_bugs_report($db, $start, $end);
        echo json_encode($res);

    }else if($_POST['type'] == "EXEC_RESOLVED_BUG"){
		
		$bugID = $_POST['bugID'];

        $res = $op->exec_resovled_bug($db, $bugID);
        echo json_encode($res);

    }/*else if ($_GET["type"] == 'VIEW_PATCH_NOTIFCATION'){

		$gdb = new GeofencingDatabase();
		$gdb->connect();
		$view = $_GET['view'];
		$output = '';

		if($view != ''){
			$gdb->updateNotif_fuinegros();
		}

		if($gdb->getNotif_icon_fuinegros() == null)
		{
			$output .= "<table class='table table-striped table-bordered table-hover' style='width:350px;'>
					<tr>
						<th>No notifications to show as of this moment.</th>
					</tr>
				</table>";
		}

		if($gdb->getNotif_icon_fuinegros() != null)
		{
			$result = $gdb->getNotif_icon_fuinegros();

			$output .= "<table class='table table-hover' style='width: 350px;'>
					<thead>
						<tr>
							<th width=''>Notifications</th>
						</tr>
					</thead>
					<tbody>";
				
			while($row = mysqli_fetch_row($result)){
			$time = date("g:i:s A",strtotime($row[3]));
				$output .= "
				        <tr>	
							<td>
							  <img src='../img/salesman_bohol/$row[1].jpg' class='img-circle' alt='SalesmanPic' width='50' height='50' onError='imgError2(this)'/>
							</td>
							<td>
								<a href='Alert' style='text-decoration:none;'>
							     $row[1] transacted outside his territory!
							     <br/>
							     <small>Today at $time</small>
							     </a>
							     <br/>
							     <button type='button' id='locate' class='btn btn-default btn-xs' onclick='locateSalesman_enroach($row[9],$row[10])'>Locate</button>
							</td>
					  </tr>";
			}
			$output .= "</tbody></table>";

			//$gdb->update_enroachment();

		}

		  $data = array(
		  	 'notification' => $output,
		  	 'unseen_notification' => $gdb->count_unseenNotif_fuinegros()
		  );

		  echo json_encode($data);

		$gdb->disconnect();

    }*/else{
        echo 'There was an error: Could not find your request !';
    }
    
}catch (PDOException $e){
  echo $e->getMessage();
}

?>