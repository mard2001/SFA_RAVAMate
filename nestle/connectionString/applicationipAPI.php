<?php


ob_start('ob_gzhandler');
ini_set('max_execution_time', 7000);
// header("Access-Control-Allow-Origin: *");

ob_start('ob_gzhandler');
ini_set('max_execution_time', 7000);
$http_origin = $_SERVER['HTTP_ORIGIN'];
$origin = substr($http_origin, 8);


// if($origin == "mybuddy-sfa.com"){

  header("Access-Control-Allow-Origin: $origin");

  include 'mybuddyconnection.php';
  include 'ApplicationDBOperations.php';
  include 'cloudconnection.php';
  include 'fastsosyoconnection.php';
  include 'textapiConnection.php';
  include 'ideliverConnection.php';

  try{ 

    $con = new ConfigConnection();
    $op = new DBOperations();
    $con_cloud = new CloudConfigConnection();
    $con_aio = new FastsosyoConfigConnection();
    $con_sms = new ConnectionSMSApi();
    $con_ideliver = new Connection_ideliver();

    session_write_close();

    //if(isset($_GET['SERVER'], $_GET['USER'], $_GET['PWORD'], $_GET['DB'])){
    if(isset($_GET['CONN'])){
      $gservr = $_GET['CONN'][0];
      $gusr = $_GET['CONN'][2];
      $gpwrd = $_GET['CONN'][1];
      $gdb = $_GET['CONN'][3];
      $sitename = $_GET['site'];

      $server = "sqlsrv:Server=".$gservr.";Database=".$gdb;

      $db = $con->openConnection($server, $gusr, $gpwrd);
      $db_cloud = $con_cloud->openConCloud();
      $db_aio = $con_aio->openConAIO();
      $db_sms = $con_sms->openConnection_text();
      $db_ideliver = $con_ideliver->openConnection_ideliver();

      if($_GET['type'] == "SyncCustomer"){

        $res = $op->sync_customer($db);
        echo $res;

      }else if($_GET['type'] == "SyncCustomer2"){

        $res = $op->sync_customer2($db);
        echo $res;

      }else if($_GET['type'] == "PURGEDATABASE"){

        $res = $op->purge_database($db);
        echo $res;

      }else if($_GET['type'] == "CLEAR_INVENTORY_UPLOADED"){

        $mdCode = $_GET['mdCode'];
        $transdate = $_GET['transdate'];

        $res = $op->clear_inventory_unuploaded_by_salesman($db, $mdCode, $transdate);
        echo json_encode($res);        

      }else if($_GET['type'] == "SyncInventory"){

        //$salesman = $_GET['mdCode'];

        $res = $op->sync_inventory($db);
        echo json_encode($res);        

      }
      //DISABLE SALESMAN
      else if($_GET['type'] == 'DISABLE_SALESMAN'){

        $mdCode = $_GET['mdCode'];

        $res = $op->disable_salesman($db, $mdCode);
        echo json_encode($res);
      
      }else if($_GET['type'] == "SYNC_STOCKTAKE"){

        $date = $_GET['date'];
        $salesman = $_GET['salesman'];
        
        $res = $op->sync_sfa_queues_stocktake($db, $date, $salesman);
        echo json_encode($res); 

      }else if($_GET['type'] == "SYNC_SFA_QUEUING"){
      
        $res = $op->sync_sfa_queues($db);
        echo json_encode($res); 

      }else if($_GET['type'] == "SYNC_SFA_QUEUING_BETA"){

        $date = $_GET['date'];
        $salesman = $_GET['salesman'];

        $res = $op->sync_sfa_queues_beta($db, $date, $salesman);
        echo json_encode($res); 

      }else if($_GET['type'] == "SYNC_IDELIVER_INVOICE"){
        
        $site = $_GET['site'];
        $dateselected = $_GET['dateselected'];
        
        $res = $op->sync_ideliver_invoice($db, $db_ideliver, $site, $dateselected);
        echo json_encode($res); 

      }else if($_GET['type'] == "SYNC_IDELIVER_DELIVERY_TAGGING"){
        
        $site = $_GET['site'];

        $res = $op->sync_ideliver_deltaggging($db, $db_ideliver, $site);
        echo json_encode($res); 

      }else if($_GET['type'] == "GET_DELIVERY_TAGGING"){

        $startDate = $_GET['startDate'];
        $endDate = $_GET['endDate'];

        $res = $op->get_deliverytagging($db, $startDate, $endDate);
        echo json_encode($res); 

      }else if($_GET['type'] == "SYNC_DATA_REPLACATION"){

        $salesman = $_GET['mdCode'];
        $res = $op->exec_replacation($db, $salesman);
        echo json_encode($res); 

      }else if($_GET['type'] == "CHANGE_MARKER_COLOR"){
      
        $res = $op->change_color($db);
        echo $res;

      }else if($_GET['type'] == "PRICE_CODE"){
      
        $res = $op->get_priceCode($db);
        echo json_encode($res);

      }
      
      //SENT TRANSACTION DETAILS TO SALESMAN
      else if($_GET['type'] == 'EXEC_SEND_TRANSDETAILS_TO_SALESMAN'){

          $transactionID = $_GET['transactionID'];
          $contactno = $_GET['contactno'];

          $res = $op->sent_details_tosalesman($db_aio, $contactno, $transactionID);
          echo json_encode($res);
      
      }

      //remove sosyo store tagging
      else if($_GET['type'] == 'REMOVE_SOSYO_TAGGING'){

          $storeID = $_GET['storeID'];

          $res = $op->exec_remove_sosyoStore_Tagging($db_aio, $storeID);
          echo json_encode($res);
      
      }

      else if($_GET['type'] == 'SYNC_SALESMAN_DETAILS_TO_SOSYO'){

          $res = $op->sync_salesman_Details_sosyo($db_aio, $db);
          echo json_encode($res);
      
      }else if($_GET['type'] == 'SYNC_SWEEPER_TRANSACTION'){

        $res = $op->sync_sweeper_Transaction($db_aio, $db);
        echo json_encode($res);
    
      }else if($_GET['type'] == "GET_AIO_DISTRIBUTORSCUSTOMERLIST"){
        
        $distCode = $_GET['DIST_CODE'];

        $res = $op->get_aio_distributorsaccount($db_aio, $distCode);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_SOSYO_FEEDBACK"){
        
        $distCode = $_GET['DIST_CODE'];

        $res = $op->get_sosyofeedback($db_aio, $db, $distCode);
        echo json_encode($res);

      }else if($_GET['type'] == "UPDATE_SOSYO_FEEDBACK"){
        
        $distCode = $_GET['DIST_CODE'];
        $date = $_GET['date'];
        $salesman = $_GET['salesman'];
        $custCode = $_GET['custCode'];

        $customername = $_GET['customername'];
        $activated = $_GET['activated'];
        $incomp = $_GET['incomp'];
        $nosignal = $_GET['nosignal'];
        $nointernet = $_GET['nointernet'];
        $noelectric = $_GET['noelectric'];
        $ownerout = $_GET['ownerout'];
        $nottechy = $_GET['nottechy'];
        $notinserted = $_GET['notinserted'];
        $remarks = $_GET['remarks'];

        $res = $op->update_sosyofeedback($db_aio, $date, $salesman, $custCode, $customername, $activated, $incomp, $nosignal, $nointernet, $noelectric, $ownerout, $nottechy, $notinserted, $remarks, $distCode);
        echo json_encode($res);

      }else if($_GET['type'] == "CHECK_PRESELECTEDACCTS"){
        
        $custCode = $_GET['custCode'];
        $distCode = $_GET['distCode'];
        $mdCode = $_GET['mdCode'];

        $res = $op->check_preselectedAccts($db_aio, $custCode, $mdCode, $distCode);
        echo json_encode($res);

      }else if($_GET['type'] == "UPDATE_PRESELECTEDACCTS"){
        
        $custCode = $_GET['custCode'];
        $distCode = $_GET['distCode'];
        $mdCode = $_GET['mdCode'];

        $res = $op->update_preselectedAccrts($db_aio, $custCode, $mdCode, $distCode);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_AIO_TRANSACTION"){
        
        $distCode = $_GET['DIST_CODE'];

        $res = $op->get_aio_transaction($db_aio, $distCode);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_AIO_TRANSACTION_TEMP"){
      
        $res = $op->get_aio_transaction($db_aio);
        echo json_encode($res);

      }else if($_GET['type'] == 'AIO_BROADCAST_SIRROY'){

        $message = $_GET['message'];
        $phoneNumber = $_GET['phoneNumber'];
        $smstype = $_GET['smstype'];
        
        $res = $op->exec_broadcast_sirroy($db_sms, $phoneNumber, $message, $smstype);
        $wave = $op->waveCell($phoneNumber, $message);
        echo json_encode($wave);

    }else if($_GET['type'] == "GET_PRICECODE"){
      
        $res = $op->change_color($db);
        echo $res;

      }else if($_GET['type'] == "GET_AIO_TOKEN"){
        
        $storeID = $_GET['storeID'];

        $res = $op->get_aio_token($db_aio, $storeID);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_AIO_SALESAMAN_DETAILS"){
        
        $mdCode = $_GET['mdCode'];

        $res = $op->get_all_aio_salesman($db, $db_cloud, $mdCode);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_AVAILABLE_SITESCON_FDC"){

        $res = $op->get_conn_sites($db, $db_cloud);
        echo json_encode($res);

      }else if($_GET['type'] == "UPDATE_LINKING_AIOTRANSACTION"){
      
      $mdCode = $_GET['mdCode'];
      $custCode = $_GET['custCode'];
      $storeID = $_GET['storeID'];
      $transactionID = $_GET['transactionID'];
      // $distCode = $_GET['distCode'];
        
        $res2 = $op->update_aiocustomerls_mdcode($db_aio, $mdCode, $storeID, $custCode);
        $res = $op->update_aiotransaction_mdcode($db_aio, $mdCode, $transactionID, $custCode);
        echo json_encode($res .' '. $res2);

      }else if($_GET['type'] == 'displayPreviousDash'){

        $date = $_GET['dateSelected'];

        $res = $op->previous_markers($db, $date);
      
        echo json_encode($res);
      
      }else if($_GET['type'] == 'displayPreviousDash_tableDetails'){
        
        $date = $_GET['dateSelected'];

        $res = $op->previous_table_details_local($db, $date);

        echo $res;

      }else if($_GET['type'] == "displayPreviousDash_totalSales"){
        
        $date = $_GET['dateSelected'];

        $res = $op->previous_total_sales($date, $db);
        echo json_encode($res);

      }else if($_GET['type'] == 'previous_getLate'){
        $date = $_GET['dateSelected'];

        $res = $op->previous_lates($db, $date);
        echo json_encode($res);

      }else if($_GET['type'] == "DASHBOARD_SALESMAN_DATA_TABLE"){
          
        $res = $op->live_salesman_table_data_local($db);
        echo $res;

      }else if($_GET['type'] == "displayCustImage"){

        $custID = $_GET['custID'];

        $res = $op->get_customer_image($db, $custID);
        echo json_encode($res);

      }else if($_GET['type'] == "IMAGE_DECODED_LIST"){

        $res = $op->get_images_decode($db);
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

      }else if($_GET['type'] == "PATCHLIST"){

        $res = $op->get_patchList($db_cloud, $db);
        echo json_encode($res);

      }else if($_GET['type'] == "INSTALL_PATCH"){

        $patchID = $_GET['patchID'];

        $res = $op->exec_patch_install($db_cloud, $db, $patchID);
        echo json_encode($res);

      }else if($_GET['type'] == "samplepatch"){
        
        $res = $op->exec_pl_params($db_cloud, $db);
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

      }else if($_GET['type'] == "digital_mapping_table_data"){
        
        $salesman = $_GET['resultSalesman'];
        $startDate = $_GET['start'];
        $endDate = $_GET['end'];

        $res = $op->get_digital_mapping_table_data($db, $salesman, $startDate, $endDate);
      
        echo $res;

      }else if($_GET['type'] == "salesman_list_digimap"){
        
        $startDate = $_GET['start'];
        $endDate = $_GET['end'];

        $res = $op->get_salesman_list_digimap($db, $startDate, $endDate);
      
        echo json_encode($res);

      }else if($_GET['type'] == 'get_all_salesman_bohol'){
          
        $res = $op->get_all_salesman($db);
        echo json_encode($res);

      }else if($_GET['type'] == 'get_all_salesman_sweeper'){
          
        $res = $op->get_all_salesman_avl_sweeper($db);
        echo json_encode($res);

      }else if($_GET['type'] == 'get_all_color_bohol'){
        
        $mdCode = $_GET['mdCode'];

        $res = $op->get_all_salesman_color($db, $mdCode);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_TRAVERSE_SALESMANIMG"){
        
        $res = $op->get_traverse_salesmandata_img($db);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_TRAVERSE_CUSTOMERIMG"){
        
        $res = $op->get_traverse_customerdata_img($db);
        echo json_encode($res);

      }else if($_GET['type'] == "DASHBOARD_MARKERS"){

        $res = $op->get_dashboard_markers($db);
        echo json_encode($res);


      }else if($_GET['type'] == "TOTAL_SALES_DASHBOARD_DATA_TABLE"){
        
        $res = $op->get_totalsales_dashboard($db);
        echo json_encode($res);

      }else if($_GET['type'] == "TOTAL_SALES_DASHBOARD_DATA_TABLE_LOCAL"){
        
        $res = $op->get_totalsales_dashboard_local($db);
        echo json_encode($res);

      }else if($_GET['type'] == "UPDATE_ORDERTYPE"){
        $custCode = $_GET['custCode'];
        $res = $op->update_defaultOrdType($db, $custCode);
        echo json_encode($res);

      }else if($_GET['type'] == "UPDATE_ORDERTYPE_REVERT"){
        $custCode = $_GET['custCode'];
        $res = $op->update_defaultOrdType_revert($db, $custCode);
        echo json_encode($res);

      }else if($_GET['type'] == "digitalMapping_totalsales_filter"){

        $startDate = $_GET['start'];
        $endDate = $_GET['end'];
        $salesman = $_GET['salesman'];

        $res = $op->get_totalsales_digimap($db, $startDate, $endDate, $salesman);
        echo json_encode($res);

      }else if($_GET["type"] == "get_salesmanlocation_digitalMapping"){
        
        $salesman = $_GET['resultSalesman'];
        $startDate = $_GET['start'];
        $endDate = $_GET['end'];

        $res = $op->get_salesmanlocation_digimap_local($db, $salesman, $startDate, $endDate);
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

      }else if($_GET['type'] == 'GET_SALESMAN_IMAGES'){

        $res = $op->get_salesman_images($db);
        echo json_encode($res);

      }else if($_GET['type'] == 'getLateBySalesmanCat'){

        $salesmanCat = $_GET['salesmanCat'];
        $date = $_GET['date'];

        $res = $op-> get_late_by_salesmancategory($db, $salesmanCat, $date);
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

      }else if($_GET['type'] == "INSERT_SWEEPER"){
        
        $sweeperID = $_GET['sweeperID'];
        $mdCode = $_GET['mdCode'];
        
        $res = $op->insert_sweeper($db, $sweeperID, $mdCode);
        echo $res;

      }else if($_GET['type'] == "REMOVE_SWEEPER_ACCOUNT"){
        
        $sweeperID = $_GET['sweeperID'];
        $mdCode = $_GET['mdCode'];
        
        $res = $op->remove_sweeper($db, $sweeperID, $mdCode);
        echo $res;

      }else if($_GET['type'] == "GET_SWEEPER_ACCOUNT"){
        
        $mdCode = $_GET['mdCode'];
        
        $res = $op->get_sweeper_accounts($db, $mdCode);
        echo json_encode($res);

      }else if($_GET['type'] == "geoResetCustomer"){
        
        $custCode = $_GET['custCode'];
        $res = $op->exec_georesetcustomer_data($db, $custCode);
        echo $res;

      }else if($_GET['type'] == "GET_USER_TOKEN"){
        
        $mdCode = $_GET['mdCode'];

        $res = $op->get_usr_token($db, $mdCode);
        echo json_encode($res);
        
      }else if($_GET['type'] == "GET_USER_MDCODE"){
        
        $custCode = $_GET['custCode'];

        $res = $op->get_usr_mdCode($db, $custCode);
        echo json_encode($res);
        
      }else if($_GET['type'] == "loadSalesmanCat"){
        
        $date = $_GET['date']; 
        $res = $op->get_salesmancategory_data($db, $date);
        echo json_encode($res);

      }else if($_GET['type'] == "filterSalesmanByCategory"){
        
        $brand = $_GET['brand'];
        $date = $_GET['date'];

        $res = $op->get_filterSalesmanByCategory_data($db, $brand, $date);
        echo $res;

      }else if($_GET['type'] == 'total_salesman_per_category'){
        
        $brand = $_GET['brand'];
        $date = $_GET['date'];

        $res = $op->get_total_salesmanAndsales_per_category($db, $brand, $date);
        echo json_encode($res);
    
      }else if($_GET['type'] == 'get_salesman_by_category'){
        
        $brand = $_GET['brand'];
        $date = $_GET['date'];

        $res = $op->get_salesman_marker_details_by_category($db, $brand, $date);
        echo json_encode($res);

      }else if($_GET['type'] == 'updateStockRequest'){

        $refNo = $_GET['refNo'];
        $mdCode = $_GET['mdCode'];
        $stockCode = $_GET['stockCode'];
        $res = $op->exec_update_stockrequest($db, $mdCode, $stockCode, $refNo);
        echo $res;
        
      }else if($_GET['type'] == 'getCompanyLocation'){
        
        $res = $op->get_company_location($db);
        echo json_encode($res);
        
      }else if($_GET['type'] == 'stockRequest'){

        $res = $op->get_stockrequest_data($db);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'stockRequest_appv'){

        $start = $_GET['start'];
        $end = $_GET['end'];

        $res = $op->get_stockRequest_appv_data($db, $start, $end);
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

      }else if($_GET['type'] == 'get_aio_transactionID'){
      
        $storeID = $_GET['storeID'];
        $supplierID = $_GET['supplierID'];
      
        $res = $op->getAIOTransactionID($db_aio, $storeID, $supplierID);   
        echo json_encode($res);

      }else if($_GET['type'] == 'UPDATE_DIGITALMAPPING'){

        $res = $op->exec_digitalmapping_update_local($db);
        echo $res;

      }else if($_GET['type'] == "efastText_overrides"){

        $res = $op->exec_efast_overrides($db);
        echo json_encode($res);

      }else if($_GET['type'] == "count_overrides"){
        
        $res = $op->exec_count_holdoverrides($db_efast);
        echo json_encode($res);

      }else if($_GET['type'] == "efastText_holdOverrides"){

        $res = $op->holdoverride_lists($db_efast);
        echo json_encode($res);

      }else if($_GET['type'] == "GET_MYBUDDY_STORENAME"){

        $custCode = $_GET['custCode'];

        $res = $op->getCustomerName($db, $custCode);
        echo json_encode($res);

      }else if($_GET['type'] == 'getNumber'){

        $res = $op->efast_getnumber($db);
        echo json_encode($res);
        
      }else if($_GET['type'] == 'HOverrides_inquiry'){

        $number = $_GET['originator'];
        $SOnumber = $_GET['SONumber'];
        
        $res = $op->hold_overrides_inquiry($db_efast, $number, $SOnumber);
        echo $res;

      }else if($_GET['type'] == 'HOverrides_approved'){
      
        $number = $_GET['originator'];
        $SOnumber = $_GET['SONumber'];
        
        $res = $op->hold_overrides_apporved($db_efast, $number, $SOnumber);
        echo $res;
      
      }else if($_GET['type'] == 'inquiry_approver'){
      
        $number = $_GET['originator'];
        $SOnumber = $_GET['SONumber'];

        $res = $op->inquiry_approver($db_efast, $number, $SOnumber);
        echo $res;
      
      }else if($_GET['type'] == 'approver_approved'){
        
        $number = $_GET['originator'];
        $SOnumber = $_GET['SONumber'];

        $res = $op-> approver_approved($db_efast, $number, $SOnumber);
        echo $res;
      
      }else if($_GET['type'] == 'insertOTP'){
        
        $number = $_GET['number'];
        $OTP = $_GET['OTP'];
        
        $res = $op->insert_otp($db_efast, $OTP, $number);
        echo $res;

      }else if($_GET['type'] == 'CHECK_SITE_SETUP'){
        
        $res = $op->check_site_checkup($db);
        echo $res;

      }else if($_GET['type'] == 'SETUP_SITE_LOCATION'){
        
        $siteZoom = $_GET["sitezoom"];
        $lat = $_GET['lat'];
        $lng = $_GET['lng'];
        $zipCode = $_GET['zipCode'];

        $res = $op->setup_site_location($db, $siteZoom, $lat, $lng, $zipCode);
        echo $res;

      }else if($_GET['type'] == 'forward'){
        
        $number = $_GET['originator'];
        $message = $_GET['message'];

        $res = $op->exec_forward($db_efast, $number, $message);
        echo $res;

      }else if($_GET['type'] == 'getSO'){

        $so = $_GET['SO'];
        
        $res = $op->get_so($db, $so);
        echo json_encode($res);

      }else if($_GET['type'] == 'loginViaPhone'){
      
        $phone = $_GET['phoneNumber'];

        $res = $op->loginViaPhone($db_efast, $phone);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'checkOTP'){
      
        $number = $_GET['number'];
        $OTP = $_GET['OTP'];
        
        $res = $op->check_otp($db_efast, $number, $OTP);
        echo json_encode($res);

      }else if($_GET['type'] == 'salesmanMaintenance'){
        
        $res = $op->get_salesman_maintenance_list($db, $db_cloud);
        echo json_encode($res);

      }else if($_GET['type'] == 'GET_SALESMANIMAGE'){
        
        $res = $op->get_salesman_base64Images($db);
        echo json_encode($res);

      }else if($_GET['type'] == 'getSalesmanDetails_maintenance'){
        
        $mdCode = $_GET['mdCode'];
        $res = $op->get_salesman_maintenance_details($db, $mdCode);
        echo json_encode($res);
    
      }else if($_GET['type'] == 'update_salesman_maintenance'){
    
        $geolocking = $_GET['geolocking'];
        $mdpassword = $_GET['mdPassword'];
        $password1 = $_GET['password1'];
        $mdlevel = $_GET['mdlevel'];
        $eodNumber1 = $_GET['eodNumber1'];
        $eodNumber2 = $_GET['eodNumber2'];
        $contactcell = $_GET['contactcell'];
        $color = $_GET['color'];
        $priceCode = $_GET['pricecode'];
        $thumbnail = $_GET['thumbnail'];
        $calltime = $_GET['calltime'];
        $capacity = $_GET['capacity'];
      
        $defordsel = $_GET['defordsel'];
        $stklist = $_GET['stklist'];
        $stkreq = $_GET['stkreq'];
        $ishybrid = $_GET['ishybrid'];
        $newCustomer = $_GET['newCustomer'];

        $pre = $_GET['pre'];
        $post = $_GET['post'];
        $stack =$_GET['stack'];
        $oedcl =$_GET['oedcl'];
        $mdCode = $_GET['mdCode'];

        $supervisor = $_GET['supervisor'];
        $otpdisabled = $_GET['otpdisabled'];
        $SalesmanTypeData = $_GET['SalesmanTypeData'];

        $res = $op->exec_update_salesman_maintenance($db, $geolocking, $mdpassword, $password1, $mdlevel, $eodNumber1, $eodNumber2, $contactcell, $color, $priceCode, $thumbnail, $defordsel,
        $stklist, $stkreq, $pre, $post, $stack, $oedcl, $mdCode, $calltime, $capacity, $ishybrid, $newCustomer, $supervisor, $otpdisabled, $SalesmanTypeData);
        echo $res;
        
      }else if($_GET['type'] == 'CHECK_SALESMAN_NUMBER'){

        $contact = $_GET['contact'];
        $mdCode = $_GET['mdcode'];
      
        $res = $op->check_salesman_number($db, $contact, $mdCode);
        echo json_encode($res);

      }else if($_GET['type'] == 'FASTSOSYO_SALESMAN_ACTIVACTION'){

        $mdName = $_GET['mdName'];
        $mdCode = $_GET['mdCode'];
        //$isLeadPartners = $_GET['isLeadPartners'];
        $contactCellNumber = $_GET['contactCellNumber'];
        $priceCode = $_GET['priceCode'];
      
        $res = $op->exec_insert_sfauser_mbuddy_linking($db_cloud, $mdCode, $mdName, '1', $contactCellNumber, $priceCode);
        echo json_encode($res);

      }else if($_GET['type'] == 'INSERT_SALESMAN'){

        $mdName = $_GET['mdName'];
        $mdPassword = $_GET['mdPassword'];
        $contCellNum = $_GET['contCellNum'];
        $mdColor = $_GET['mdColor'];
        $eod1 = $_GET['eod1'];
        $eod2 = $_GET['eod2'];
        $calltime = $_GET['calltimeH'];
        $capacity = $_GET['capacity'];
        $priceCode = $_GET['priceCodeH'];
        $defOrdType = $_GET['defOrdTypeH'];
        $mdSalesmanCode = $_GET['mdSalesmanCode'];
        $supervisor = $_GET['supervisor'];
        $salesmanType = $_GET['salesmanType'];

        $res = $op->exec_salesman_insert($db, $db_cloud, $mdName, $mdPassword, $contCellNum, $mdColor, $eod1, $eod2, $calltime, $priceCode, $defOrdType, $mdSalesmanCode, $capacity, $supervisor, $salesmanType);
        echo json_encode($res);

      }else if($_GET['type'] == 'SALESMAN_LIST_FOR_INSERT'){
        
        $res = $op->get_userlist_salesman($db);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'BOreports'){

        $startDate = $_GET['startDate'];
        $endDate = $_GET['endDate'];
        
        $res = $op->get_boreports_details($db, $startDate, $endDate);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_COMPANYNAME'){
        
        $endDate = $_GET['endDate'];
        
        $res = $op->get_companyname($db);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_ENDOFDAY_DETALS'){
        
        $date = $_GET['date'];

        $res = $op->get_endofday_data($db, $date);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'STOCKCARD_DATA_OPEN'){
        
        $res = $op->get_stockcard_data_open($db);
        echo json_encode($res);
      
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
      
      }else if($_GET['type'] == 'GET_STOCKCARD_DETAILS'){
        
        $refNo = $_GET['refNo'];

        $res = $op->get_stockCard_Details($db, $refNo);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'uploadSalesmanPic'){
        
        $site = $_GET['site'];
        $mdCode = $_GET['mdCode'];
        
        $res = $op->upload_salesman_image($site, $mdCode);

      }else if($_GET['type'] == 'TRN_SALESMAN_TYPE'){
      
        $res = $op->get_trn_salesman_type($db, $salesman);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'TRN_TRANSACTION_BY_TYPE'){
        
        $trnType = $_GET['trnType'];
        $start = $_GET['start'];
        $end = $_GET['end'];

        $res = $op->get_trn_transaction_by_salesman_type($db, $trnType, $start, $end);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'getSpecificSalesman'){
        
        $salesman = $_GET['mdCode'];
      
        $res = $op->get_specific_salesman($db, $salesman);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'salesReport'){
        
        $startDate = $_GET['startDate'];
        $endDate = $_GET['endDate'];
        
        $res = $op->get_salesreport_data($db, $startDate, $endDate);
        echo json_encode($res);

      }else if($_GET['type'] == 'GET_UNPROD_REPORT'){
              
        $startDate = $_GET['startDate'];
        $endDate = $_GET['endDate'];

        $res = $op->get_unproductive_report($db, $startDate, $endDate);
        echo json_encode($res);

    }else if($_GET['type'] == 'syncReportData'){
        
        $startDate = $_GET['startDate'];
        $endDate = $_GET['endDate'];
        
        $res = $op->get_sync_report_data($db, $startDate, $endDate);
        echo json_encode($res);

      }else if($_GET['type'] == 'GET_CUSTOMER_TAGGING'){
        
        $startDate = $_GET['salesman'];

        $res = $op->get_customertagging_data($db, $salesman);
        echo json_encode($res);

      }else if($_GET['type'] == 'GET_BANK_LIST'){
        
        // $startDate = $_GET['salesman'];

        $res = $op->get_bank_list($db);
        echo json_encode($res);

      }else if($_GET['type'] == 'INVENTORY_VALUATION'){
        
        $mdCode = $_GET['mdCode'];
        
        $res = $op->get_salesman_inventory_valuation($db, $mdCode);
        echo json_encode($res);

      }else if($_GET['type'] == 'GET_LASTUPDATED_INVENTORY_VALUATION'){
        
        $mdCode = $_GET['mdCode'];
        
        $res = $op->get_lastUpdated_inventory($db, $mdCode);
        echo json_encode($res);

      }else if($_GET['type'] == 'salesReport_details'){
        
        $transactionID = $_GET['transactionID'];
        
        $res = $op->get_salesreport_details($db, $transactionID);
        echo json_encode($res);

      }else if($_GET['type'] == 'INV_COMP_DETAILS'){
        
        $transactionID = $_GET['transactionID'];
        
        $res = $op->get_inv_computation_details($db, $transactionID);
        echo json_encode($res);

      }else if($_GET['type'] == 'CUSTOMER_LIST'){
        
        $res = $op->customer_list_data($db);
        echo json_encode($custList);
      
      }else if($_GET['type'] == 'dashboard_chart_data'){
        
        $res = $op->dashboard_chart_data($db);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'NEW_DSR_DATA'){
        
        $res = $op->new_dsr_data($db);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'stocktakeReportData'){

        $startDate = $_GET['startDate'];
        $endDate = $_GET['endDate'];
        $salesman = $_GET['salesman'];

        $res = $op->stock_stake_reports($db, $startDate, $endDate, $salesman);
        echo json_encode($res);

      }else if($_GET['type'] == 'stocktakeReportData_All'){

        $startDate = $_GET['startDate'];
        $endDate = $_GET['endDate'];

        $res = $op->stock_stake_reports_all($db, $startDate, $endDate);
        echo json_encode($res);

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

      }else if($_GET['type'] == 'ZIPCODE_INSERT_CHECKER'){

        $zipCode = $_GET['zipCode'];

        $res = $op->zipCodeChecker($db_cloud, $zipCode);
        echo json_encode($res);

      }else if($_GET['type'] == 'UNUPLOADED_SALES'){
        
        $start = $_GET['start'];
        $end = $_GET['end'];

        $res = $op->unuploaded_sales_data($db, $start, $end);
        echo json_encode($res);

      }else if($_GET['type'] == 'EXEC_ISEXPORT_UPDATE'){
        
        $transactionID = $_GET['transactionID'];

        $res = $op->exec_update_isExport($db, $transactionID);
        echo json_encode($res);

      }else if($_GET['type'] == 'ADMIN_TOTALSALESMAN_PER_SITE'){

        $res = $op->total_salesman_per_site($db);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_SFA_VERSION'){

        $res = $op->get_sfa_version($db);
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
      
      }else if($_GET['type'] == 'CUSTOMER_LIST_GEORESET'){

        $res = $op->get_customerList_georeset($db);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'CUSTOMER_LIST_AIO'){
        
        $mdCode = $_GET['mdCode'];

        $res = $op->get_customerList_aio($db, $mdCode);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'UPDATE_CUSTOMER_NAME_UNPROCESSED'){

        $newCustomerCode = $_GET['newCustCode'];
        $transactionID = $_GET['transactionID'];
        $salesmanType = $_GET['salesmanType'];

        $res = $op->exec_customername_update($db, $newCustomerCode, $transactionID, $salesmanType);
        echo json_encode($res);

      }else if($_GET['type'] == 'EXEC_NW_BANK_INSRT'){

        $bankcode = $_GET['bankcode'];
        $bankname = $_GET['bankname'];

        $res = $op->exec_insert_bank($db, $bankcode, $bankname);
        echo json_encode($res);

      }else if($_GET['type'] == 'CUSTOMER_TAGGING_DATA'){

        $res = $op->tagging_customer_list($db);
        echo json_encode($res);

      }else if($_GET['type'] == 'JOBBER_MAINTENANCE_CUST_DATA'){

        $res = $op->allcustomer_data($db);
        echo json_encode($res);

      }else if($_GET['type'] == 'JOBBER_PRINT_DETAILS'){
        
        $refNo = $_GET['refNo'];

        $res = $op->get_stockCard_Details_print($db, $refNo);
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

      }else if($_GET['type'] == 'DCR_MAIN_REPORT'){

        $start = $_GET['start'];
        $end = $_GET['end'];
        $mdCode = $_GET['mdCode'];
        $res = $op->dcr_data_report($db, $start, $end, $mdCode);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'DCR_SALESMAN_LIST'){

        $start = $_GET['start'];
        $end = $_GET['end'];
        $res = $op->collection_salesman_data($db, $start, $end);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'STK_SALESMAN_LIST'){

        $start = $_GET['start'];
        $end = $_GET['end'];
        $res = $op->stktake_salesman_data($db, $start, $end);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_DCR_PRINT_DATA'){

        $start = $_GET['start'];
        $end = $_GET['end'];
        $mdCode = $_GET['mdCode'];
        $res = $op->collection_print_data($db, $start, $end, $mdCode);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'DCR_CHECK_IMAGE'){

        $invoice = $_GET['invoiceNum'];
        $res = $op->get_checkImage($db, $invoice);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_CMF_DATA'){

        $start = $_GET['start'];
        $end = $_GET['end'];

        $res = $op->get_cmf_data($db, $start, $end);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_CMF_DATA_VIAID'){

        $CMFID = $_GET['CMFID'];

        $res = $op->get_cmf_data_via_id($db, $CMFID);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_MOR_SALESAUDIT'){

        $start = $_GET['start'];
        $end = $_GET['end'];

        $res = $op->get_mor_salesodit($db, $start, $end);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'INSERT_SYNC_LOGS'){
      
        $description = $_GET['description'];
        $isLock = $_GET['isLock'];
        $lockby = $_GET['lockby'];

        $res = $op->exec_sync_logs($db, $description, $isLock, $lockby);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_PENDING_REQ'){
      
        $start = $_GET['start'];
        $end = $_GET['end'];
        $appvid = $_GET['appvid'];

        $res = $op->get_pending_request($db, $start, $end, $appvid);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'EXEC_PENDING_REQ_APPV'){
      
        $cID = $_GET['cID'];
        $appvStat = $_GET['appvStat'];
        $remarks = $_GET['remarks'];

        $res = $op->exec_update_pendingReq($db, $cID, $appvStat, $remarks);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_USER_PENDING_REQ'){
      
        $phonenum = $_GET['phonenum'];

        $res = $op->get_pendingreq_user($db, $phonenum);
        echo json_encode($res);
      
      }else if($_GET['type'] == 'GET_VOUCHER_TRANSACTION'){
      
        $site_indicator = $_GET['site_indicator'];
        $start = $_GET['startDate'];
        $end = $_GET['endDate'];

        $res = $op->get_voucher_transaction($db_aio, $site_indicator, $start, $end);
        echo json_encode($res);
      
      }
      
      // else if($_POST['type'] == 'MESSAGE_API'){

      //   $phoneNumber = $_POST['phoneNumber'];
      //   $message = $_POST['message'];

      //   $res = $op->waveCell($phoneNumber, $message);
      //   echo json_encode($res);
      
      // }

      else{
        echo 'There was an error: Could not find your request !';
      }
    }else{
      echo 'Error: MISSING PARAMETER REQUEST!';
    }


  }catch (PDOException $e){
    echo $e->getMessage();
  }

// }else{
//   // echo 'There was an error: Unauthorized Use of API.';
//   echo 'sample'.$http_origin.' '.$origin;
// }



  ?>