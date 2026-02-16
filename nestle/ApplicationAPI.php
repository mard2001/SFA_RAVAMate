  <?php
include 'connectionString/mdbuddyconnection_static.php';
// include 'connectionString/mdbuddyconnection_efast.php';
//include 'connectionString/ConnectionCloud.php';
include 'ApplicationDBOperations.php';

try{ 

  $op = new DBOperations();

  if(isset($_GET['site'])){

      $sitename = $_GET['site'];
      $con_localDB = 'Connection_'.$sitename;
      $dbLOCAL = 'openConnection_'.$sitename;

      // $con_efastDB = 'ConnectionEFAST_'.$sitename;
      // $dbEFAST = 'openConnectionEFAST_'.$sitename;

      // $con_itbud = new Connection_itbud();
      // $db_itbud = $con_itbud->openConnection_itbud();

      $localDB = new $con_localDB();
      $db = $localDB->$dbLOCAL();

      // $efastDB= new $con_efastDB();
      // $db_efast = $efastDB->$dbEFAST();

      // $databaseCloud = new Connection();
      // $db_cloud = $databaseCloud->openConnection();

      $site_id = '';
      if($sitename == 'bohol'){
        $site_id = 'boh';
      }else if($sitename == 'cagayan'){
        $site_id = 'cdo';
      }else if($sitename == 'gensan'){
        $site_id = 'gen';
      }else if($sitename == 'samar'){
        $site_id = 'sam';
      }else if($sitename == 'tacloban'){
        $site_id = 'tac';
      }else if($sitename == 'roxas'){
        $site_id = 'rox';
      }

    if($_GET['type'] == "SyncCustomer"){

      $res = $op->sync_customer($db);
      echo $res;

    }else if($_GET['type'] == "SyncInventory"){

      $salesman = $_GET['mdCode'];

      $res = $op->sync_inventory($db, $sitename, $salesman);
      echo json_encode($res);        

    }else if($_GET['type'] == "SYNC_SFA_QUEUING"){

      $res = $op->sync_sfa_queues($db);
      echo json_encode($res); 

    }else if($_GET['type'] == "CHANGE_MARKER_COLOR"){
     
      $res = $op->change_color($db);
      echo $res;

    }else if($_GET['type'] == "GET_USER_TOKEN"){
      
      $mdCode = $_GET['mdCode'];

      $res = $op->get_usr_token($db, $mdCode);
      echo json_encode($res);
      
    }
    
    // else if($_GET['type'] == 'displayPreviousDash'){

    //   $date = $_GET['dateSelected'];

    //   if($sitename != 'number1seller' && $sitename != 'primus_ventures'){
    //     $res = $op->previous_markers($db_cloud, $date, $site_id);
    //   }else{
    //     $res = $op->previous_markers_local($db, $date);
    //   }
    //   echo json_encode($res);
     
    // }else if($_GET['type'] == 'displayPreviousDash_tableDetails'){
      
    //   $date = $_GET['dateSelected'];

    //   if($sitename != 'number1seller' && $sitename != 'primus_ventures'){
    //     $res = $op->previous_table_details($db_cloud, $date, $sitename, $site_id);
    //   }else{
    //     $res = $op->previous_table_details_local($db, $date);
    //   }
    //   echo $res;

    // }
    
    else if($_GET['type'] == "displayPreviousDash_totalSales"){
      
      $date = $_GET['dateSelected'];

      $res = $op->previous_total_sales($date, $db);
      echo json_encode($res);

    }else if($_GET['type'] == "GET_MOBILE_USERS"){
  
      $res = $op->get_mobile_users($db_itbud);
      echo json_encode($res);

    }else if($_GET['type'] == 'previous_getLate'){
      $date = $_GET['dateSelected'];

      $res = $op->previous_lates($db, $date);
      echo json_encode($res);

    }else if($_GET['type'] == "DASHBOARD_SALESMAN_DATA_TABLE"){
        
      $res = $op->live_salesman_table_data($db, $sitename);
      echo $res;

    }else if($_GET['type'] == "displayCustImage"){

      $custID = $_GET['custID'];

      $res = $op->get_customer_image($db, $custID);
      echo json_encode($res);

    }else if($_GET['type'] == "customerMappingTableData"){
      
      $salesman = $_GET['salesman'];
      $mcp = $_GET['mcp'];

      $res = $op->customer_mapping_tabledata($db, $salesman, $mcp);
      echo $res;  

    }else if($_GET['type'] == "customerMappingData"){
      
      $salesman = $_GET['salesman'];
      $mcp = $_GET['mcp'];

      $res = $op->customer_mapping_markerdata($db, $salesman, $mcp);
      echo json_encode($res);

    }else if($_GET['type'] == 'getTransactionDetails'){

      $transactionID = $_GET['transactionID'];

      $res = $op->transaction_details($db, $transactionID);
      echo $res;

    }else if($_GET['type'] == "dashBoardData_product"){
      
      $res = $op->dashboard_data_product($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == "getProduct"){
      
      $productName = ltrim($_GET['productName']);

      $res = $op->get_product($db, $productName);
      echo json_encode($res);

    }else if($_GET['type'] == "getAllProduct"){
         
      $res = $op->get_all_product($db);
      echo json_encode($res);

    }else if($_GET['type'] == "getAllProduct_digiMapFilter"){
      
      $from = $_GET['start'];
      $to = $_GET['end'];

      $res = $op->get_all_product_digitalmapping($db_cloud, $from, $to, $site_id);
      echo json_encode($res);

    }else if($_GET['type'] == "dashBoardData_product_digiMapFilter"){
      
      $from = $_GET['start'];
      $to = $_GET['end'];

      $res = $op->get_product_digitalmapping_by_date($db_cloud, $from, $to, $site_id);
      echo json_encode($res);
    
    }else if($_GET['type'] == "getProduct_digiMapFilter"){
      
      $from = $_GET['start'];
      $to = $_GET['end'];
      $productName = ltrim($_GET['productName']);

      $res = $op->get_product_digimap_filter($db_cloud, $from, $to, $site_id);
      echo json_encode($res);   

    }else if($_GET['type'] == "digital_mapping_data_filter"){
      
      $salesman = $_GET['resultSalesman'];
      $startDate = $_GET['start'];
      $endDate = $_GET['end'];

      if($sitename != 'number1seller' && $sitename != 'primus_ventures'){
        $res = $op->get_digital_mapping_table_data($db_cloud, $site_id, $salesman, $startDate, $endDate, $sitename);
      }else{
        $res = $op->get_digital_mapping_table_data_number1($db, $salesman, $startDate, $endDate);
      }
      
      echo $res;

    }else if($_GET['type'] == 'get_all_salesman_bohol'){
         
      $res = $op->get_all_salesman($db);
      echo json_encode($res);

    }else if($_GET['type'] == 'get_all_color_bohol'){
      
      $mdCode = $_GET['mdCode'];

      $res = $op->get_all_salesman_color($db, $mdCode);
      echo json_encode($res);

    }else if($_GET['type'] == "DASHBOARD_MARKERS"){
      
      $res = $op->get_dashboard_markers($db);
      echo json_encode($res);

    }else if($_GET['type'] == "TOTAL_SALES_DASHBOARD_DATA_TABLE"){
      
      $res = $op->get_totalsales_dashboard_local($db);
      echo json_encode($res);

    }else if($_GET['type'] == "digitalMapping_totalsales_filter"){

      $startDate = $_GET['start'];
      $endDate = $_GET['end'];
      $salesman = $_GET['salesman'];

      $res = $op->get_totalsales_digitalMapping_filter($db, $startDate, $endDate, $sitename, $salesman);
      echo json_encode($res);

    }else if($_GET["type"] == "get_salesmanlocation_digitalMapping"){
      
      $salesman = $_GET['resultSalesman'];
      $startDate = $_GET['start'];
      $endDate = $_GET['end'];
      
      if($sitename != 'number1seller' && $sitename != 'primus_ventures'){
        $res = $op->get_salesmanlocation_digimap($db_cloud, $salesman, $site_id, $startDate, $endDate);
      }else{
        $res = $op->get_salesmanlocation_digimap_local($db, $salesman, $startDate, $endDate);
      }
      echo json_encode($res);

    }else if($_GET['type'] == 'generate_graphical_report_page'){
      
      $startDate = $_GET['startDate'];
      $endDate = $_GET['endDate'];

      $res = $op->generate_graphicalreport_reportpage($db, $startDate, $endDate);
      echo json_encode($res);

    }else if($_GET['type'] == "digitalmapping_graph_report"){
      
      $salesman = $_GET['resultSalesman'];
      $startDate = $_GET['start'];
      $endDate = $_GET['end'];

      $res = $op->get_digitalmapping_graph_report($db, $startDate, $endDate);
      echo $res;

    }else if($_GET['type'] == 'GET_LATE'){
       
      $res = $op->get_late($db);
      echo json_encode($res);

    }else if($_GET['type'] == 'getLateBySalesmanCat'){

      $salesmanCat = $_GET['salesmanCat'];

      $res = $op-> get_late_by_salesmancategory($db, $salesmanCat);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'dsr_salesmanLoad'){
        
      $res = $op->get_dsr_loadsalesman($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'dsr_data'){
      
      $salesman = $_GET['dsrSalesman'];
      $date = $_GET['dsrDate'];

      $res = $op->get_dsr_data($db, $salesman, $date);
      echo json_encode($res);

    }else if($_GET['type'] == 'dsr_average'){

      $salesman = $_GET['salesman'];
      $date = $_GET['date'];

      $res = $op->get_dsr_average_data($db, $salesman, $date);
      echo json_encode($res);

    }else if($_GET['type'] == 'todayProductive'){

      $salesman = $_GET['salesman'];
      $actualDate = $_GET['date'];

      $res = $op->get_todays_productive_data($db, $salesman, $actualDate);
      echo json_encode($res);
      
    }else if($_GET['type'] == 'SALES_REPORT'){

      $start = $_GET['start'];
      $end = $_GET['end'];

      $res = $op->get_sales_report_data($db, $start, $end);
      echo json_encode($res);
      
    }else if($_GET['type'] == 'sellingDays'){

      $salesman = $_GET['salesman'];
      $date = new DateTime($_GET['date']);
      $numericMonth = $_GET['numericMonth'];

      $res = $op->get_sellingdays_data($db, $salesman, $date, $numericMonth);  
      echo json_encode($res);

    }else if($_GET['type'] == 'monthToDatePRD'){
      
      $salesman = $_GET['salesman'];
      $date = new DateTime($_GET['date']);
      $res = $op->get_monthtodate_data($db, $salesman, $date);
      echo json_encode($res);

    }else if($_GET['type'] == "geoResetSalesman"){
      
      $mdCode = $_GET['mdCode'];
      $mcpDay = $_GET['mcpDay'];
      
      $res = $op->exec_georesetsalesman_data($db, $mcpDay, $mdCode);
      echo $res;

    }else if($_GET['type'] == "geoResetCustomer"){
      
      $custCode = $_GET['custCode'];
      $res = $op->exec_georesetcustomer_data($db, $custCode);
      echo $res;

    }else if($_GET['type'] == "loadSalesmanCat"){
      
      $res = $op->get_salesmancategory_data($db);
      echo json_encode($res);

    }else if($_GET['type'] == "filterSalesmanByCategory"){
      
      $brand = $_GET['brand'];
      $res = $op->get_filterSalesmanByCategory_data($db, $brand);
      echo $res;

    }else if($_GET['type'] == 'total_salesman_per_category'){
      
      $brand = $_GET['brand'];
      $res = $op->get_total_salesmanAndsales_per_category($db, $brand);
      echo json_encode($res);
   
    }else if($_GET['type'] == 'get_salesman_by_category'){
      
      $brand = $_GET['brand'];
      $res = $op->get_salesman_marker_details_by_category($db, $brand);
      echo json_encode($res);

    }else if($_GET['type'] == 'updateStockRequest'){

      $refNo = $_GET['refNo'];
      $mdCode = $_GET['mdCode'];
      $stockCode = $_GET['stockCode'];
      $res = $op->exec_update_stockrequest($db, $mdCode, $stockCode, $refNo);
      echo $res;
      
    }else if($_GET['type'] == 'stockRequest'){

      $res = $op->get_stockrequest_data($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'stockRequest_appv'){

      $res = $op->get_stockRequest_appv_data($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'stockRequest_pend'){

      $res = $op->get_stockRequest_pend_data($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'stockRequest_filter'){

      $mdCode = $_GET['mdCode'];
      $refNo = $_GET['refNo'];

      $res = $op->get_stockrequest_filter_data($db, $mdCode, $refNo);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'stockRequest_filter_header'){

      $mdCode = $_GET['mdCode'];
      $refNo = $_GET['refNo'];

      $res = $op->get_stockrequest_filter_header_data($db, $mdCode, $refNo);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'stockRequest_salesman_selection'){

      $res = $op->get_salesman_stockrequest_selection_data($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'get_stockRequest_refNo'){

      $mdCode = $_GET['mdCode'];

      $res = $op->get_refno_stockrequest($db, $mdCode);
      echo json_encode($res);

    }else if($_GET['type'] == 'get_all_salesman_georeset'){
      
      $res = $op->all_salesman_georeset($db);   
      echo json_encode($res);

    }else if($_GET['type'] == 'UPDATE_DIGITALMAPPING'){

      $res = $op->exec_digitalmapping_update($db, $db_cloud, $site_id, $sitename);
      echo $res;

    // }else if($_GET['type'] == "efastText_overrides"){

    //   $res = $op->exec_efast_overrides($db);
    //   echo json_encode($res);

    // }
    // else if($_GET['type'] == "count_overrides"){
      
    //   $res = $op->exec_count_holdoverrides($db_efast);
    //   echo json_encode($res);

    // }else if($_GET['type'] == "efastText_holdOverrides"){

    //   $res = $op->holdoverride_lists($db_efast);
    //   echo json_encode($res);

    // }else if($_GET['type'] == 'getNumber'){

    //   $res = $op->efast_getnumber($db);
    //   echo json_encode($res);
      
    // }else if($_GET['type'] == 'HOverrides_inquiry'){

    //   $number = $_GET['originator'];
    //   $SOnumber = $_GET['SONumber'];
      
    //   $res = $op->hold_overrides_inquiry($db_efast, $number, $SOnumber);
    //   echo $res;

    // }else if($_GET['type'] == 'HOverrides_approved'){
    
    //   $number = $_GET['originator'];
    //   $SOnumber = $_GET['SONumber'];
      
    //   $res = $op->hold_overrides_apporved($db_efast, $number, $SOnumber);
    //   echo $res;
    
    // }else if($_GET['type'] == 'inquiry_approver'){
     
    //   $number = $_GET['originator'];
    //   $SOnumber = $_GET['SONumber'];

    //   $res = $op->inquiry_approver($db_efast, $number, $SOnumber);
    //   echo $res;
     
    // }else if($_GET['type'] == 'approver_approved'){
      
    //   $number = $_GET['originator'];
    //   $SOnumber = $_GET['SONumber'];

    //   $res = $op-> approver_approved($db_efast, $number, $SOnumber);
    //   echo $res;
     
    // }
    
    // else if($_GET['type'] == 'insertOTP'){
      
    //   $number = $_GET['number'];
    //   $OTP = $_GET['OTP'];
      
    //   $res = $op->insert_otp($db_efast, $OTP, $number);
    //   echo $res;

    // }else if($_GET['type'] == 'forward'){
      
    //   $number = $_GET['originator'];
    //   $message = $_GET['message'];

    //   $res = $op->exec_forward($db_efast, $number, $message);
    //   echo $res;

    // }else if($_GET['type'] == 'getSO'){

    //   $so = $_GET['SO'];
      
    //   $res = $op->get_so($db, $so);
    //   echo json_encode($res);

    // }else if($_GET['type'] == 'loginViaPhone'){
     
    //   $phone = $_GET['phoneNumber'];

    //   $res = $op->loginViaPhone($db_efast, $phone);
    //   echo json_encode($res);
     
    // }else if($_GET['type'] == 'checkOTP'){
     
    //   $number = $_GET['number'];
    //   $OTP = $_GET['OTP'];
      
    //   $res = $op->check_otp($db_efast, $number, $OTP);
    //   echo json_encode($res);

    // }else if($_GET['type'] == 'salesmanMaintenance'){
      
    //   $res = $op->get_salesman_maintenance_list($db);
    //   echo json_encode($res);

    // }else if($_GET['type'] == 'getSalesmanDetails_maintenance'){
      
    //   $mdCode = $_GET['mdCode'];
    //   $res = $op->get_salesman_maintenance_details($db, $mdCode);
    //   echo json_encode($res);
   
    // }
    }
    else if($_GET['type'] == 'update_salesman_maintenance'){
   
      $geolocking = $_GET['geolocking'];
      $mdpassword = $_GET['mdPassword'];
      $password1 = $_GET['password1'];
      $mdlevel = $_GET['mdlevel'];
      $eodNumber1 = $_GET['eodNumber1'];
      $eodNumber2 = $_GET['eodNumber2'];
      $concatcell = $_GET['contactcell'];
      $color = $_GET['color'];
      $priceCode = $_GET['pricecode'];
      $thumbnail = $_GET['thumbnail'];

      $defordsel = $_GET['defordsel'];
      $stklist = $_GET['stklist'];
      $stkreq = $_GET['stkreq'];

      $pre = $_GET['pre'];
      $post = $_GET['post'];
      $stack =$_GET['stack'];
      $oedcl =$_GET['oedcl'];
      $mdCode = $_GET['mdCode'];

      $otpdisabled = $_GET['otpdisabled'];

      $res = $op->exec_update_salesman_maintenance($db, $geolocking, $mdpassword, $password1, $mdlevel, $eodNumber1, $eodNumber2, $concatcell, $color, $priceCode, $thumbnail, $defordsel, $stklist, $stkreq, $pre, $post, $stack, $oedcl, $mdCode, $otpdisabled);
      echo $res;
      
    }else if($_GET['type'] == 'INSERT_SALESMAN'){

      $mdName = $_GET['mdName'];
      $mdPassword = $_GET['mdPassword'];
      $contCellNum = $_GET['contCellNum'];
      $mdColor = $_GET['mdColor'];
      $eod1 = $_GET['eod1'];
      $eod2 = $_GET['eod2'];

      $res = $op->exec_salesman_insert($db, $mdName, $mdPassword, $contCellNum, $mdColor, $eod1, $eod2);
      echo json_encode($res);

    }else if($_GET['type'] == 'BOreports'){

      $startDate = $_GET['startDate'];
      $endDate = $_GET['endDate'];
      
      $res = $op->get_boreports_details($db, $startDate, $endDate);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'GET_STOCKCARD_DETAILS'){
      
      $refNo = $_GET['refNo'];

      $res = $op->get_stockCard_Details($db, $refNo);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'JOBBER_PRINT_DETAILS'){
      
      $refNo = $_GET['refNo'];

      $res = $op->get_stockCard_Details_print($db, $refNo);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'GET_ENDOFDAY_DETALS'){
      
      $date = $_GET['date'];

      $res = $op->get_endofday_data($db, $date);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'STOCKCARD_DATA_OPEN'){
      
      $res = $op->get_stockcard_data_open($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'GET_COMPANYNAME'){
      
      $res = $op->get_companyname($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'GET_SAMPLE'){

      $sample = $_GET['SAMPSTRING'];
      $res = $op->sampleexec($sample);

      echo $res;

    }else if($_GET['type'] == 'UPDATE_STOCKCARD_OPEN'){

      $mdCode = $_GET['mdCode'];
      $stockCode = $_GET['stockCode'];
      $refNo = $_GET['refNo'];
      $tranDate = $_GET['transDate'];

      $res = $op->exec_stockcard_update_open($db, $mdCode, $stockCode, $refNo, $transDate);
      echo json_encode($res);
      
    }else if($_GET['type'] == 'STOCKCARD_DATA_VERIFIED'){
      
      $res = $op->get_stockcard_data_verified($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'UPDATE_STOCKARD_VERIFIED'){
      
      $mdCode = $_GET['mdCode'];
      $stockCode = $_GET['stockCode'];
      $refNo = $_GET['refNo'];
      $tranDate = $_GET['transDate'];

      $res = $op->exec_stockcard_update_verified($db, $mdCode, $stockCode, $refNo, $transDate);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'uploadSalesmanPic'){
      
      $site = $_GET['site'];
      $mdCode = $_GET['mdCode'];
      
      $res = $op->upload_salesman_image($site, $mdCode);

    }else if($_GET['type'] == 'getSpecificSalesman'){
      
      $salesman = $_GET['mdCode'];
    
      $res = $op->get_specific_salesman($db, $salesman);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'salesReport'){
      
      $startDate = $_GET['startDate'];
      $endDate = $_GET['endDate'];
      
      $res = $op->get_salesreport_data($db, $startDate, $endDate);
      echo json_encode($res);

    }else if($_GET['type'] == 'CUSTOMER_LIST'){
      
      $res = $op->customer_list_data($db);
      echo json_encode($custList);
    
    }else if($_GET['type'] == 'dashboard_chart_data'){
      
      $res = $op->dashboard_chart_data($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'stocktakeReportData'){

      $startDate = $_GET['startDate'];
      $endDate = $_GET['endDate'];
      
      $res = $op->stock_stake_reports($db, $sitename, $startDate, $endDate);
      echo json_encode($stocktakeData);

    }

    /*** TBLPROPT CHECKLIST C.R.U.D. STARTS HEREEEEE****/
    else if($_GET['type'] == 'PROMPT_LIST'){
      
      $res = $op->prompt_list_data($db);
      echo json_encode($data);

    }else if($_GET['type'] == 'PROMPT_DELETE'){

      $promptID = $_GET['cID'];

      $res = $op->exec_prompt_delete($db, $promptID);
      echo $res;  

    }else if($_GET['type'] == 'PROMPT_INSERT'){
      
      $alertType = $_GET['alertType'];
      $pType = $_GET['pType'];
      $desc = $_GET['Description'];
      $seq = $_GET['seq'];
      $remarks = $_GET['remarks'];

      $res = $op->exec_prompt_insert($db, $alertType, $pType, $desc, $seq, $remarks);
      echo $res;

    }else if($_GET['type'] == 'UPDATE_CHECKLIST_STATUS'){
     
      $status = $_GET['status'];
      $cID = $_GET['cID'];
      
      $res = $op->exec_update_checlist_status($db, $status, $cID);
      echo $res;

    }else if($_GET['type'] == 'UPDATE_CHECKLIST'){
      
      $cID = $_GET['cID'];
      $ptype = $_GET['ptype'];
      $seq = $_GET['seq'];
      $remarks = $_GET['remarks'];

      $res = $op->exec_update_checlist($db, $ptype, $seq, $remarks, $cID);
      echo $res;

    }

    /** PRODUCT MAINTENANCE STARTS HERE ***/

    else if($_GET['type'] == 'PRODUCT_LIST'){

      $res = $op->product_list_data($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'PRODUCT_LIST_AJAX'){

      $res = $op->product_list_data_ajax($db, $sitename);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'GET_PRODUCT_IMAGE'){

      $stockCode = $_GET['stockCode'];

      $res = $op->get_product_image($db, $stockCode);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'UPDATE_PRODUCT_PRIOSKU'){
      
      $priosku = $_GET['priosku'];
      $stockCode = $_GET['stockCode'];
      
      $res = $op->exec_update_product_priosku($db, $priosku, $stockCode);
      echo $res;  
    
    }else if($_GET['type'] == 'INSERT_NEW_PRODUCT_IMAGE'){

     echo 'bawlang';

    }else if($_GET['type'] == 'UNUPLOADED_SALES'){

      $start = $_GET['start'];
      $end = $_GET['end'];

      $res = $op->unuploaded_sales_data($db, $start, $end);
      echo json_encode($res);

    }else if($_GET['type'] == 'ADMIN_TOTALSALESMAN_PER_SITE'){

      $res = $op->total_salesman_per_site($db);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'UNPROCESSED_ORDERS_BOOKING'){

      $start = $_GET['start'];
      $end = $_GET['end'];

      $res = $op->get_unprocessed_booking_data($db, $start, $end);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'UNPROCESSED_ORDERS_EXTRUCT'){

      $start = $_GET['start'];
      $end = $_GET['end'];

      $res = $op->get_unprocessed_extruct_data($db, $start, $end);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'CUSTOMER_LIST_UNPROCESSED'){

      $mdCode = $_GET['mdCode'];

      $res = $op->get_all_customerlist_data($db, $mdCode);
      echo json_encode($res);
    
    }else if($_GET['type'] == 'UPDATE_CUSTOMER_NAME_UNPROCESSED'){

      $newCustomerCode = $_GET['newCustCode'];
      $transactionID = $_GET['transactionID'];
      $salesmanType = $_GET['salesmanType'];

      $res = $op->exec_customername_update($db, $newCustomerCode, $transactionID, $salesmanType);
      echo json_encode($res);

    }else if($_GET['type'] == 'JOBBER_MAINTENANCE_CUST_DATA'){

      $res = $op->allcustomer_data($db);
      echo json_encode($res);

    }else if($_GET['type'] == 'EXEC_INSERT_JOBBER_CUSTOMER'){

      $custCode = $_GET['custCode']; 
      $custName = $_GET['custName']; 
      $contCell = $_GET['contCell']; 
      $contPerson = $_GET['contPerson']; 
      $address = $_GET['address']; 
      $lat = $_GET['lat']; 
      $long = $_GET['long']; 
      $isLockOn = $_GET['isLockOn']; 
      $custType = $_GET['custType'];
      $res = $op->insert_customer_jobber($db, $custCode, $custName, $contCell, $contPerson, $address, $lat, $long, $isLockOn, $custType);
      echo json_encode($res);

    }else{
      echo 'There was an error!';
    }
  }//isset if closing 
}catch (PDOException $e){
  echo $e->getMessage();
}
 

?>