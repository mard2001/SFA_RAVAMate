<?php
header("Access-Control-Allow-Origin: *");
Class DBOperations {

  /*START OF ADMIN FUNCTIONS**/
  public function get_cloud_productList($db){
    $sth = $db->query("SELECT StockCode, Description from tblProductImage");
    $res = $sth->fetchALL(PDO::FETCH_OBJ);
    
    return $res;
  }

  public function get_mobileUsersList($db){
    $sth = $db->query("SELECT * from tblSFAUsers where verNumber <> ''");
    $res = $sth->fetchALL(PDO::FETCH_OBJ);
    
    return $res;
  }

  public function get_patchlist_adm($db){
    $sth = $db->query("SELECT format(lastUpdated, 'dd/MM/yyyy hh:mm tt') as lastUpdated,
    patchLevel, PLNotes, PLQuery, PLStatus from tblPatch order by lastUpdated desc");
    $res = $sth->fetchALL(PDO::FETCH_OBJ);
    
    return $res;
  }

  public function get_fakegpslisting($db){
    $sth = $db->query("SELECT * from [dbo].[tblFakeGPSLogs] order by dateDetected desc");
    $res = $sth->fetchALL(PDO::FETCH_OBJ);
    
    return $res;
  }

  public function checkUsageOtp($db, $phoneNumber, $OTP){
    $sth = $db->query("SELECT top 1 * from [TBLUSAGEREQUESTLOG] where REQUEST_PHONENO = '$phoneNumber' and OTP = '$OTP' and status = 0");
    $res = $sth->fetchALL(PDO::FETCH_OBJ);
    
    return $res;
    
  }
  

  public function max_pl_id($db){
    // $sql = $db->query("SELECT right ('000'+ltrim(str( right(max(patchLevel), 2)+1 )),3 ) as maxPL_ID from tblPatch");
    $sql = $db->query('SELECT top 1 cID as maxPL_ID from tblPatch order by cID desc');
    $res = $sql->fetch();
    return $res['maxPL_ID'];
  } 

  public function get_mybuddy_usage_data($db){
      $data = array();
      $f_Data = array();
      $sql = "SELECT * from [dbo].[vBuddyUsers]";
        foreach ($db->query($sql) as $row) {
           $data["SiteName"] = $row["SiteName"];
           $data["ImplementationDate"] = $row["Implementation Date"]; 
           $data["DayElapse"] = $row["Day Elapse"]; 
           $data["ActiveAccounts"] = $row["Active Accounts"];
           $data["DueAccounts"] = $row["Due Accounts"];
           $f_Data[] = $data;
        }
        return $f_Data;
  }

  public function total_usage($db){
    $data = array();
    $f_Data = array();
    $sql = "SELECT sum([Active Accounts]) as t_ActiveAccount,
    sum([Due Accounts]) as t_DueAccount from vBuddyUsers";
      foreach ($db->query($sql) as $row) {
         $data["t_ActiveAccount"] = $row["t_ActiveAccount"];
         $data["t_DueAccount"] = $row["t_DueAccount"]; 
         $f_Data[] = $data;
      }
      return $f_Data;
  }

  public function exec_insert_new_patch_adm($db, $notes, $query){
    date_default_timezone_set('Asia/Manila');
    $date = date_create(date('Y-m-d'));
    $maxPL_ID = $this->max_pl_id($db);
    $m = date_format($date, 'm');
    $y = date_format($date, 'y');
    $pl_num = 'PL'.$y.$m.$maxPL_ID;
    $sql = "INSERT INTO [dbo].[tblPatch]
              ([patchLevel]
              ,[PLNotes]
              ,[PLQuery]
              ,[PLStatus]
              ,[lastUpdated])
            VALUES (?, ?, ?, ?, getdate())";

    $sth = $db->prepare($sql);
    $result = $sth->execute([$pl_num, $notes, $query, '0']);
    return $result;
  }

  public function exec_insert_mybuddy_request_usage_logs($db, $REQUESTPHONENUM, $SENDPHONENUM, $OTP){
    $sql = "INSERT INTO [dbo].[TBLUSAGEREQUESTLOG]
              ([REQUEST_PHONENO]
              ,[SEND_PHONENO]
              ,[OTP]
              ,[DATEREQUESTED]
              ,[STATUS])
            VALUES (?, ?, ?, getdate(), 0)";

    $sth = $db->prepare($sql);
    $result = $sth->execute([$REQUESTPHONENUM, $SENDPHONENUM, $OTP]);
    return $result;
  }

  public function exec_update_patch_adm($db, $id, $notes, $query, $status){
    $sql = "UPDATE tblPatch set PLNotes = ?, 
                                PLQuery = ?, 
                                PLStatus = ?, 
                                lastUpdated = getDate()
                WHERE patchLevel = '$id'";

    $sth = $db->prepare($sql);
    $result = $sth->execute([$notes, $query, $status]);
    return $result;
  }

  public function update_usage_request_stat($db, $phoneNumber, $OTP){
    $sql = "UPDATE [TBLUSAGEREQUESTLOG] set status = 1, 
                WHERE REQUEST_PHONENO = ? and OTP = ?";

    $sth = $db->prepare($sql);
    $result = $sth->execute([$phoneNumber, $OTP]);
    return $result;
  }

  public function waveCellsms($phoneNumber, $message){
		$GlobHolder;
		$prefix = substr($phoneNumber, 1, 2);
		if($prefix == '63'){
			$GlobHolder =  trim('+'.$phoneNumber);
		}else{
			$phonenum = substr($phoneNumber, 1, 11);
			$cellHolder = '+63'.$phonenum;
			$GlobHolder = $cellHolder;
		}
		
	  
		$curl = curl_init();
		curl_setopt_array($curl, array(
		// ---- FAST CARGO
		// CURLOPT_URL => "https://api.wavecell.com/sms/v1/FASTGroup_FTC/single",
		// -- FAST DISTRIBUTION
		CURLOPT_URL => "https://api.wavecell.com/sms/v1/FastDis_MKT/single",
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "POST",
		// --- FASRT CARGO
		// CURLOPT_POSTFIELDS => "{\"source\":\"FASTGROUP\", \"destination\":\".$GlobHolder.\",\"text\":\"$message\"}",
		// --- FAST DISTRIBUTION
		CURLOPT_POSTFIELDS => "{\"source\":\"MYBUDDY\", \"destination\":\".$GlobHolder.\",\"text\":\"$message\"}",
		CURLOPT_HTTPHEADER => array(
		   // ---- FAST CARGO
		   //"authorization: Bearer uR9k87bK9P0VHlPqgSlAn5knrVd3TwUZA63ZaX9Gx3E",
		   // ---- FAST DISTRIBUTION
			"authorization: Bearer ms2cwKsCCc9WDQi8Bu3IEpQYObUneiom23WNkbITo",
			"content-type: application/json"
		),
		));
	  
		$response = curl_exec($curl);
		$err = curl_error($curl);
	  
		curl_close($curl);
	  
		if ($err) {
		echo "cURL Error #:" . $err;
		} else {
			return array("Result" => "Success", "Message" => "OTP was successfully sent.");
		}
	  }

  public function exec_delete_patch_adm($db, $id){
    $sql = "DELETE tblPatch WHERE patchLevel = '$id'";

    $sth = $db->prepare($sql);
    $result = $sth->execute();
    return $result;
  }

  public function salesman_ifExist($db, $mdCode){
    $sql = $db->query("SELECT count(*) as indicator from tblSFAUsers where mdCode = '$mdCode'");
    $res = $sql->fetch();
    return $res['indicator'];
  } 

  public function reset_salesman_account($db, $mdCode){
    $indicator = $this->salesman_ifExist($db, $mdCode);
    if($indicator == 1){
      $sql = "UPDATE tblSFAUsers set isActive = '0', PhoneSN = null where mdCode = '$mdCode'";
      $sth = $db->prepare($sql);
      $result = $sth->execute();
      return $indicator;
    }else{
      return 0;
    }
    
  }

  public function get_product_image($db, $stockCode){
    $sql = "SELECT thumbnail from tblProductImage where StockCode = '$stockCode'";
        $stmt= $db->query($sql);
        $data = $stmt->fetchALL(PDO::FETCH_OBJ);
        
        return $data;
  }

  public function get_bugs_report($db, $start, $end){
    $sql = "SELECT * from TBLBUGREPORT where cast(DATEINSERTED as date) between '$start' and '$end'";
        $stmt= $db->query($sql);
        $data = $stmt->fetchALL(PDO::FETCH_OBJ);
        
        return $data;
  }

  public function exec_resovled_bug($db, $bugID){
    $sql = "UPDATE TBLBUGREPORT set status = '2', DATERESOLVED = getdate() WHERE cID = '$bugID'";
    $sth = $db->prepare($sql);
    $result = $sth->execute();
        
    return $result;
  }
 
 /*END OF ADMIN FUNCTIONS**/

 /*START OF NOTIFICATION*/
 /*
  public function updateNotif_fuinegros(){
    $query = "UPDATE Encroachment_fuinegros SET STATUS=1 WHERE STATUS=0";
    $success = mysqli_query($this->con, $query) or die(mysqli_error($this->con));
    if($success){
      return "Updated";
    }
  }

  public function getNotif_icon_fuinegros (){
    date_default_timezone_set('Asia/Manila');
    $current_date = date("Y-m-d");
    $query = "SELECT * FROM Encroachment_fuinegros where status = 1 and CAST(date as date) = '$current_date' ORDER BY date desc limit 4";
    $result = mysqli_query($this->con, $query) or die(mysqli_error($this->con));
    $rows = mysqli_num_rows($result);

    if($rows > 0){
      return $result;
    }
    else return null;
  }

  public function count_unseenNotif_fuinegros(){
    $query = "SELECT * From Encroachment_fuinegros WHERE STATUS = 0";
    $result = mysqli_query($this->con, $query) or die(mysqli_error($this->con));
    $rows = mysqli_num_rows($result);

    return $rows;
  }

 /*END OF NOTIFICATION*/
  
}

?>  