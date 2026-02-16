
<?php
ini_set('max_execution_time', 700);
header("Access-Control-Allow-Origin: *");
Class DBOperations {

  public function sync_customer($db){

      $sth = $db->prepare("[dbo].[sp1_mcp_allignment]");
      $result = $sth->execute();
      return $result;
  } 

  public function sync_inventory($db){

      $sth = $db->prepare("[dbo].[sp1_itemdetails_sync]");
      $result = $sth->execute();
      return $result;
  }

  public function exec_replacation($db, $salesman){

      $sth = $db->prepare("sp_dummy_account @mdCode = '$salesman'");
      $result = $sth->execute();

      return $result;
  }

  public function exec_register_salesman($db, $mdSalesmanCode, $mdCode){

      $sth = $db->prepare("EXEC [sp_npisalesperson_register] @salesperson = '''$mdSalesmanCode''', @mdCode = '$mdCode'");
      $result = $sth->execute();

      return $result;
  }

  public function sync_sfa_queues($db){

      $sth = $db->prepare("[dbo].[sp_trnverifier]");
      $result = $sth->execute();
      return $result;
  }

  public function sync_sfa_queues_beta($db, $date, $salesman){
    $delimeter = $this->salesmanCounter($db);
    $paramCounter = count($salesman);
    if($paramCounter == $delimeter){
      $sth = $db->prepare("[dbo].[sp_trnverifier1] @deliveryDate = '$date', @mdCode = 'ALL'");
      $result = $sth->execute();
    }else{
      foreach($salesman as $resultRow){
        $sth = $db->prepare("[dbo].[sp_trnverifier1] @deliveryDate = '$date', @mdCode = '$resultRow'");
        $result = $sth->execute();
      }
    }

    return $result;
  }

  public function salesmanCounter($db){
    $sth = $db->query("SELECT count(*) as sCounter from tblUser where mdName <> '' and mdName <> 'IN-ACTIVE' and mdCode <> '9999'");
    $row = $sth->fetch();

    return $row['sCounter'];
    
  }

  public function get_mobile_users($db){
      $sql = "SELECT * FROM [tblSFAUsers] where DistributorCode = 'NPI'";
      $stmt= $db->query($sql);
      $data= $stmt->fetchALL(PDO::FETCH_OBJ);

      return $data;
  }

  public function change_color($db){

    $sth = $db->prepare("[dbo].[sp_ChangeMDColor]");
      $result = $sth->execute();
      return $result;
  }

  public function previous_markers($db, $date){

      $data = array();
      $f_Data = array();
      $sql = "EXEC [sp_SellOutCur] @startDate = '$date', @endDate = '$date'";
        foreach ($db->query($sql) as $row) {
           $data["mdCode"] = $row["mdCode"];
           $data["Salesman"] = $row["Salesman"]; 
           $data["Customer"] = $row["Customer"]; 
           $data["longitude"] = $row["longitude"];
           $data["latitude"] = $row["latitude"];
           $data["Sales"] = $row["Sales"];
           $data["deliveryDate"] = $row["deliveryDate"];
           $data["mdColor"] = $row["mdColor"];
           $data["DocumentNo"] = $row["Document #"];
           $data["transCount"] = $row["transCount"];
           $data["time"] = $row["TIME BOUND Min."];
           $data["timeSpent"] = $row["upTime"];
           $data["noSku"] = $row["#SKU"];
           $data["transactionID"] = $row["transactionID"];
           $data["customerID"] = $row["CustomerID"];
           $data["daysToText"] = $row["nameofdate"];
           $data["address"] = $row["address"];
           $f_Data[] = $data;
        }
        return $f_Data;
  }

  public function previous_markers_local($db, $date){

      $data = array();
      $f_Data = array();
      $sql = "SELECT upper(format(cast(deliverydate as date), 'ddd')) as nameofdate,
                substring(Customer, 1, CHARINDEX(' ', Customer)) as CustomerID,
                mdCode,
                Salesman,
                Customer,
                longitude,
                latitude,
                transactionID,
                address,
                Sales,
                deliveryDate,
                mdColor,
                [Document #],
                transCount,
                [TIME BOUND Min.],
                [upTime],
                [#SKU]
              from tblSellOutCur
              where cast(deliverydate as date) = '$date'";
        foreach ($db->query($sql) as $row) {
           $data["mdCode"] = $row["mdCode"];
           $data["Salesman"] = $row["Salesman"]; 
           $data["Customer"] = $row["Customer"]; 
           $data["longitude"] = $row["longitude"];
           $data["latitude"] = $row["latitude"];
           $data["Sales"] = $row["Sales"];
           $data["deliveryDate"] = $row["deliveryDate"];
           $data["mdColor"] = $row["mdColor"];
           $data["DocumentNo"] = $row["Document #"];
           $data["transCount"] = $row["transCount"];
           $data["time"] = $row["TIME BOUND Min."];
           $data["timeSpent"] = $row["upTime"];
           $data["noSku"] = $row["#SKU"];
           $data["transactionID"] = $row["transactionID"];
           $data["customerID"] = $row["CustomerID"];
           $data["daysToText"] = $row["nameofdate"];
           $data["address"] = $row["address"];
           $f_Data[] = $data;
        }
        return $f_Data;
  }

  public function get_endofday_data($db, $date){

    $sql = "EXEC sp_SalesSummary @deliverydate = '$date', @salesmantype = 'ALL'";
    $transaction = array();
    //$totalSales = 0;
     foreach ($db->query($sql) as $row) {
           //$totalSales += number_format($row['Sales'], 2);
           $data["mdCode"] = $row["mdCode"];
           $data["mdName"] = $row["mdName"]; 
           $data["tcalls"] = $row["Total Calls"]; 
           $data["pCalls"] = $row["Productive Calls"];
           $data["unpCalls"] = $row["Unproductive Calls"];
           $data["fcall"] = $row["FirstCall"];
           $data["lcall"] = $row["LastCall"];
           $data["tSellHour"] = $row["sellingHours"];
           $data["amount"] = number_format($row["Sales"], 2);
           $data["missCall"] = $row["MissCall"];
           $transaction[] = $data;
      }
      
      $totalSales = $this->get_totalsales($db, $date);
      $result = array("transactions" => $transaction,
                      "totalsales" => $totalSales);
      return $result;
  }

  public function get_salesreport_details($db, $transactionID){

    $sql = "exec sp_itemdetails @transactionID = '$transactionID'";
    $transaction = array();
     foreach ($db->query($sql) as $row) {
           $data["refno"] = $row["refno"];
           $data["stockCode"] = $row["stockCode"];
           $data["description"] = $row["Description"];
           $data["amount"] = number_format($row["Amount"], 2);
           $data["unitPrice"] = number_format($row["Unit Price"], 2);
           $data["quantity"] = $row["quantity"];
           $transaction[] = $data;
         }
      return $transaction;
  }

  public function get_inv_computation_details($db, $transactionID){

    $sql = "exec sp_itemHeader @transactionID = '$transactionID'";
    $transaction = array();
     foreach ($db->query($sql) as $row) {
           $data["transactionID"] = $row["transactionID"];
           $data["SOReference"] = $row["SOReference"];
           $data["TotalVatSales"] =  number_format($row["Total VAT Sales"], 2);
           $data["LessVat"] =  number_format($row["Less VAT"], 2);
           $data["AmountNetofVAT"] =  number_format($row["Amount Net of VAT"], 2);
           $data["AmountDue"] =  number_format($row["Amount Due"], 2);
           $data["AddVAT"] =  number_format($row["Add VAT"], 2);
           $data["totalAmount"] =  number_format($row["totalAmount"], 2);
           $data["VatableSales"] =  number_format($row["Vatable Sales"], 2);
           $data["VATAmount"] =  number_format($row["VAT Amount"], 2);
           $transaction[] = $data;
         }
      return $transaction;
  }

  public function get_totalsales($db, $date){

    $sth = "SELECT SUM(totalAmount) as total FROM tblTransaction 
             where CAST(deliveryDate as date) = '$date'
              and isVerified = 1 and transstat = 0 and mdCode <> '9999'";
    $result = array();
    $data = array();
    foreach ($db->query($sth) as $row) {
         $result["total"] = $row["total"]; 
         $data[] = $result;
      }
    return $data;
  }

  public function previous_table_details_local($db, $date){
        $sql = "EXEC sp_SalesSummary @deliverydate = '$date', @salesmantype = 'ALL'";
      
        $data = '';
        foreach ($db->query($sql) as $row) {
          $data .= "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["mdCode"]."\")'>
                   <td width='40%' class='showSalesman'><span class='fas fa-map-marker' style='color:".$row['mdColor']."'></span> <span class='ellipsisSalesmanName'>".$row['mdName']."</span></td>
                   <td width='15%' class='text-center'>".$row['Productive Calls'].'/'.$row['Total Calls']."</td>
                   <td width='10%' class='text-center'>".$row['Unproductive Calls']."</td>
                   <td width='15%' class='text-center'>".$row['sellingHours']."</td>
                   <td width='9%' class='text-right' id='rowDataSd'>".number_format($row['Sales'], 2)."</td>
                   </tr>";
          }

        return $data;
  }

  public function previous_total_sales($date, $db){
    $sales = 0;
    $Countsalesman = 0;
    $sql = $db->query("SELECT sum(Sales) as sales, count(mdCode) as salesman FROM vSalesSummary 
             where CAST(deliveryDate as date) = '$date'");
    $res = $sql->fetch();

    $result = array("sales" => number_format($res['sales'], 2),
                    "salesmanCount" => $res['salesman']);
    return $result;
  }

  public function get_usr_token($db, $mdCode){
    
    $sth = $db->query("SELECT token from tblUser where mdCode = '$mdCode'");
    $row = $sth->fetch();

    return $row['token'];
  }

  public function get_usr_mdCode($db, $custCode){
    
    $sth = $db->query("SELECT mdCode from tblCustomer where custCode = '$custCode'");
    $row = $sth->fetch();

    return $row['mdCode'];
  }

  public function get_companyname($db){

    $sql = "SELECT company from tblCompany";
    $sth = $db->query($sql);
    $data = $sth->fetchALL(PDO::FETCH_OBJ);
    return $data;
  }

  public function get_images_decode($db){

    $sql = "SELECT stockCode, thumbnail from tblProductImage";
      $output = array();
       foreach ($db->query($sql) as $row) {
          //$decoded = base64_decode($row['thumbnail']);
          $data['stockCode'] = $row['stockCode'];
          $data['image'] = $row['thumbnail'];
          $output[] = $data;
        }//foreach

      return $output;
  }

  public function get_company_location($db){

    $sql = "SELECT longitude, latitude, center from tblCompany";
    $sth = $db->query($sql);
    $data = $sth->fetchALL(PDO::FETCH_OBJ);
    return $data;
  }

  public function previous_lates($db, $date){
      $sql = "EXEC sp_deviation @deliverydate = '$date', @salesmantype = 'ALL'";
      $output = array();
       foreach ($db->query($sql) as $row) {
          $time = date("g:i:s A",strtotime($row['deliveryDate']));
          $data['mdCode'] = $row['mdCode'];
          $data['salesmanName'] = $row['salesmanName'];
          $data['alert'] = $row['alert'];
          $data['Description'] = $row['Description'];
          $data['refNo'] = $row['refno'];
          $data['TransTime'] = $row['transTime'];
          $data['deliveryDate'] = $time;
          $data['transactionID'] = $row['transactionID'];
          $data['mobileNo'] = $row['mobileNo'];
		      $data['calltime'] = $row['calltime'];
          $data['thumbnail'] = $row['thumbnail'];
          $data['customerLoc'] = $row['CustomerName'];
          $data['latLng'] = $row['Latitude'].' '.$row['Longitude'];
          $output[] = $data;
        }//foreach

      return $output;
  }

  public function live_salesman_table_data($db){
    date_default_timezone_set('Asia/Manila');
      $date = date('Y-m-d');
      $sql = "EXEC sp_SalesSummary @deliverydate = '$date', @salesmantype = 'ALL'";
        
      $output = array();
      $result = $db->prepare($sql);
      $result->execute(); 
      $number_of_rows = $result->fetchColumn();

      $data = '';
      if($number_of_rows == 0){
        echo "<tr>
                <td>NO DATA TO SHOW AS OF THIS TIME!</td>
              </tr>";
      }else{
          foreach ($db->query($sql) as $row) {
            $data .= "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["mdCode"]."\")'>
                 <td width='45%' class='showSalesman' data-toggle='tooltip' data-placement='right' title='Double click to view location!'><span class='fas fa-map-marker' style='color:".$row['mdColor']."'></span> <span class='ellipsisSalesmanName'>".$row['mdName']."</span></td>
                 <td width='20%' class='text-center'>".$row['Productive Calls'].'/'.$row['Total Calls']."</td>
                 <td width='10%' class='text-left'>".$row['Unproductive Calls']."</td>
                 <td width='13%' class='text-center'>".$row['sellingHours']."</td>
                 <td width='9%' class='text-right'>".number_format($row['Sales'], 2)."</td>
                 </tr>";
            }//foreach
      }

      return $data;
  }

  public function live_salesman_table_data_local($db){
      date_default_timezone_set('Asia/Manila');
      $date = date('Y-m-d');
      $sql = "EXEC sp_SalesSummary @deliverydate = '$date', @salesmantype = 'ALL'";
      $output = array();
      $result = $db->prepare($sql);
      $result->execute(); 
      $number_of_rows = $result->fetchColumn();

      $data = '';
      if($number_of_rows == 0){
        echo "<tr>
                <td>NO DATA TO SHOW AS OF THIS TIME!</td>
              </tr>";
      }else{
          foreach ($db->query($sql) as $row) {
            $data .= "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["mdCode"]."\")'>
                 <td width='45%' class='showSalesman' data-toggle='tooltip' data-placement='right' title='Double click to view location!'><span class='fas fa-map-marker' style='color:".$row['mdColor']."'></span> <span class='ellipsisSalesmanName'>".$row['mdName']."</span></td>
                 <td width='20%' class='text-center'>".$row['Productive Calls'].'/'.$row['Total Calls']."</td>
                 <td width='10%' class='text-left'>".$row['Unproductive Calls']."</td>
                 <td width='13%' class='text-center'>".$row['sellingHours']."</td>
                 <td width='9%' class='text-right'>".number_format($row['Sales'], 2)."</td>
                 </tr>";
            }//foreach
      }

      return $data;
  }


  public function get_customer_image($db, $custID){
    $sql = $db->query("SELECT storeImage, storeImage2 from tblCustomerImage where custCode = '$custID'");
    $res = $sql->fetch();
    $image = $res['storeImage'];

      $result = array("storeImage" => $res['storeImage'],
                      "storeImage2" => $res['storeImage2']);

      return $result;
  }

  public function sampleexec($string){
    $sql = "EXEC [sp_ItemDetails] @transactionID = '$string'";
    return $sql.' '.$string;   
  }

  public function customer_mapping_tabledata($db, $salesman, $mcp){
    foreach($salesman as $resultRow){
          if($mcp != 7){
            $sql = "SELECT b.custCode, a.latitude, a.longitude, b.custName, b.address, c.mdSalesmancode, c.mdName from [tblCustomerImage] a, tblCustomer b, tblUser c 
            where a.latitude <> '0.0' and a.custCode = b.custCode and b.mdCode = '$resultRow' and b.mcpDay = '$mcp' and b.mdCode = c.mdCode";
          }else{
            $sql = "SELECT b.custCode, a.latitude, a.longitude, b.custName, b.address, c.mdSalesmancode, c.mdName from [tblCustomerImage] a, tblCustomer b, tblUser c 
            where a.latitude <> '0.0' and a.custCode = b.custCode and b.mdCode = '$resultRow' and b.mdCode = c.mdCode";
          }

          foreach ($db->query($sql) as $row) {
             $data .= '<tr class="salesmanName" onclick="showCustomer(\''.$row["custCode"].'\')">
                 <td class="showSalesman" data-toggle="tooltip" class="class="img-thumbnail" customerImage" data-placement="right" title="Double click to view location!"><img src="data:image/jpeg;base64,'.$row["storeImage"].'" onError="defaultStore(this)"/></td>
                  <td class="ellipsisCustAddress"><span class="details ellipsisCustName">Store: '.$row["custCode"].' '.$row["custName"].'</span><br/><span class="details2 ellipsisCustAddress">Address: '.$row["address"].'</span><br/><span>Contact #: '.$row["contactCellNumber"].'</span><br/><span>Salesman: '.$row['mdSalesmancode'].'_'.$row['mdName'].'</span></td>
                 </tr>';
            }//foreach
        }

           return $data;
  }

  public function customer_mapping_markerdata($db, $salesman, $mcp){
     $resultData = [];
       foreach($salesman as $resultRow){
        if($mcp != 7){
            $sql = "SELECT custCode, custName, a.latitude, a.longitude,  a.latitude as lat,  a.longitude as lng, b.mdColor, b.mdSalesmancode, b.mdName from tblCustomer a, tblUser b where a.mdCode = '$resultRow' and b.mdCode = a.mdCode and  a.latitude <> '0.0' and mcpDay = '$mcp'";
          }else{
            $sql = "SELECT custCode, custName,  a.latitude,  a.longitude,  a.latitude as lat,  a.longitude as lng, b.mdColor, b.mdSalesmancode, b.mdName from tblCustomer a, tblUser b where  a.latitude <> '0.0' and b.mdCode = a.mdCode and a.mdCode = '$resultRow'";
          }
         $result = array();
         $data = array();
          foreach ($db->query($sql) as $row) {
             $result["storeImage1"] = $row["storeImage"];
             $result["storeImage2"] = $row["storeImage2"];
             $result["longitude"] = $row["longitude"];
             $result["latitude"] = $row["latitude"];
             $result["custCode"] = $row["custCode"];
             $result["custName"] = $row["custName"];
             $result["mdColor"] = $row["mdColor"];
             $result["salesmanCode"] = $row["mdSalesmancode"];
             $result["salesmanName"] = $row["mdName"];
             $resultData[] = $result;
          }
        }
        return $resultData;
  }

  public function transaction_details($db, $transactionID){
    //$sql = "SELECT stockCode, Description, quantity, amount, thumbnail from vItemDetails where transactionID = '$transactionID'";
    $sql = "EXEC sp_itemdetails @transactionID = '$transactionID'";    
        $tableOutput .= "<table>
                            <thead>
                              <tr>
                                  <td>StockCode</td>
                                  <td>Description</td>
                                  <td>Quantity</td>
                                  <td>Amount</td>
                              </tr>
                            </thead>
                            <tbody>";
        foreach ($db->query($sql) as $row) {
          $tableOutput .= "<tr>
                              <td>".$row['stockCode']."</td>
                              <td>".$row['Description']."</td>
                              <td class='text-center'>".$row['quantity']."</td>
                              <td class='text-right'>".number_format($row['Amount'],2)."</td>
                          </tr>";
              } 

          $tableOutput .= "</tbody></table>";
          return $tableOutput;
  }

  public function dashboard_data_product($db){
    $sql = "SELECT BrandColor, brand, sum(totalAmount) as tAmount from [vCategorySales] group by Brand, BrandColor order by tAmount";
        $sth = $db->query("SELECT top 1 sum(totalAmount) as grandT from [vCategorySales]");
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        $grandTotal = $row['grandT'];
        $percentage = 0;
        $data = array();
        foreach ($db->query($sql) as $row) {
          $contribution = ($row['tAmount'] / $grandTotal) * 100;
          $contFormt = number_format($contribution, 2);
          $tAmountFormt = number_format($row['tAmount'], 2);
          $content .= "<tr onclick='brand(\"".$row["brand"]."\", \"".$contFormt."\", \"".$tAmountFormt."\", \"".$row['BrandColor']."\")' class='productTr'>
               <td class='brandName'><i class='fa fa-shopping-cart' style='color: ".$row['BrandColor']."' aria-hidden='true'></i> ".$row['brand']."</td>
               <td class='text-right tAmount'>".$tAmountFormt."</td>
               <td class='text-right contriPer'>".$contFormt."%</td>
               </tr>";

            $percentage += (float) $contribution;
        }

        $footer = '<div>TOTAL<span class="grandTotal">'.number_format($grandTotal, 2).'</span><span class="pull-right">'.number_format($percentage, 2).'%</span></div>';   
        $data = array('tableDetails' => $content, 'footerDetails' => $footer);
        return $data;
  }

  public function get_product($db, $productName){
    
    $sql = "SELECT * from vCategorySales where Brand = '$productName'";
        $result = array();
        $data = array();
          foreach ($db->query($sql) as $row) {
             $result["deliveryDate"] = $row["deliveryDate"];
             $result["Brand"] = $row["Brand"];
             $result["BrandColor"] = $row["BrandColor"];
             $result["longitude"] = $row["longitude"];
             $result["latitude"] = $row["latitude"];
             $data[] = $result;
        
          }

        return $data;
  }

  public function get_all_product($db){

    $sql = "SELECT distinct brand, BrandColor, longitude, latitude from vCategorySales";
        $result = array();
        $data = array();
          foreach ($db->query($sql) as $row) {
             $result["deliveryDate"] = $row["deliveryDate"];
             $result["Brand"] = $row["Brand"];
             $result["BrandColor"] = $row["BrandColor"];
             $result["longitude"] = $row["longitude"];
             $result["latitude"] = $row["latitude"];
             $data[] = $result;
        
          }

        return $data;
  }


  public function get_all_product_digitalmapping($db_cloud, $from, $to, $site_id){
    $sql = "SELECT distinct brand, BrandColor, longitude, latitude from vCategorySalesCur where cast(deliveryDate as date) between '$from' and '$to' and Site = '$site_id'";
         $result = array();
         $data = array();
          foreach ($db_cloud->query($sql) as $row) {
             $result["deliveryDate"] = $row["deliveryDate"];
             $result["Brand"] = $row["Brand"];
             $result["BrandColor"] = $row["BrandColor"];
             $result["longitude"] = $row["longitude"];
             $result["latitude"] = $row["latitude"];
             $data[] = $result;
        
          }
         return $data;
  }

  public function zipCodeChecker($db_cloud, $zipCode){
    $sth = $db_cloud->query("SELECT distinct count(mdCode) as zipCount from [dbo].[tblSFAUsers]
    where left(mdCode, 4) = '$zipCode'");
    $row = $sth->fetch();
    return $row['zipCount'];
  }

  public function getPatch($db_cloud, $patchID){
    $sth = $db_cloud->query("SELECT PLQuery from [dbo].[tblPatch] where patchLevel = '$patchID'");
    $row = $sth->fetch();
    return $row['PLQuery'];
  }

  public function exec_pl_params($db_cloud, $db, $patchID){
    $query = $this->getPatch($db_cloud, $patchID);
    $sth = $db->prepare($query);
    $result = $sth->execute();
    return $result;
  }

  public function new_dsr_data($db){

    $sql = "DECLARE @mdCode as nvarchar(10), @deliveryDate as date

    set @mdCode = '650005'
    set @deliveryDate = '2020-01-21'
    
    SELECT [CUST #],[CHANNEL],[FREQ],[TIER],[CUSTOMER NAME],[MTD SALES],[TARGET],[ACTUAL SALES],[DSI Number],[Actual Range], [MTD Ave. Range],core1,core2,core3,dp1,dp2,dp3,dp4,dp5,dp6,dp7,dp8,dp9,dp10,dp11,dp12,cp1,cp2,cp3,cp4,cp5,
    (case when sr_w1 is null then '' else 'Y' end) sr_w1,
    (case when sr_w2 is null then '' else 'Y' end) sr_w2,
    (case when sr_w3 is null then '' else 'Y' end) sr_w3,
    (case when sr_w4 is null then '' else 'Y' end) sr_w4
    ,notation
    from (
    
      select t1.mdCode,t1.custCode [CUST #],custType [CHANNEL],frequencyCategory  [FREQ],t2.defaultOrdType [TIER],t2.custName as [CUSTOMER NAME],
        (select sum(offTakeVal)/t2.frequencyCategory from tblOfftake s1 where s1.mdCode = @mdCode and s1.custCode = t1.custCode) [P3 Ave. Per Month], 
        (select sum(totalAmount) from tblTransaction s1 with (nolock) Where DATEPART(yy,@deliveryDate) = datepart(yy,getdate()) and DATEPART(MM,@deliveryDate) = datepart(MM,getdate()) and s1.mdCode = @mdCode and transstat = 0 and isVerified = 1 and s1.custCode = t1.custCode) [MTD SALES],
        (select sum(offTakeVal) from tblOfftake s1 where s1.mdCode = @mdCode and s1.custCode = t1.custCode) [TARGET], 
        totalAmount [ACTUAL SALES],refNo [DSI Number], 
    
        '' [MTD Ave. Range],
        (select count(s2.stockCode) from tblTransaction s1, tblTransactionItems s2 where s1.transactionID = s2.transactionID and convert(date,s1.deliveryDate) = @deliveryDate 
          and s1.custCode = t1.custCode) [Actual Range],
    
        
        0 core1,0 core2,0 core3, 0 dp1, 0 dp2, 0 dp3, 0 dp4, 0 dp5, 0 dp6, 0 dp7, 0 dp8, 0 dp9, 0 dp10, 0 dp11, 0 dp12,0 cp1,0 cp2,0 cp3,0 cp4,0 cp5,
    
        (select sum(totalAmount) from tblTransaction s1 with (nolock)
          where s1.mdCode = t1.mdCode and s1.custCode = t1.custCode
            and convert(date,deliveryDate) between (select DateFrom from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 1 ) 
              and (select DateTo from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 1 ) )	sr_w1,
    
        (select sum(totalAmount) from tblTransaction s1 with (nolock)
        where s1.mdCode = t1.mdCode and s1.custCode = t1.custCode
          and convert(date,deliveryDate) between (select DateFrom from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 1 ) 
            and (select DateTo from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 2 ) )	 sr_w2,
      
        (select sum(totalAmount) from tblTransaction s1 with (nolock)
        where s1.mdCode = t1.mdCode and s1.custCode = t1.custCode
          and convert(date,deliveryDate) between (select DateFrom from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 1 ) 
            and (select DateTo from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 3 ) )	 sr_w3,
          (select sum(totalAmount) from tblTransaction s1 with (nolock)
        where s1.mdCode = t1.mdCode and s1.custCode = t1.custCode
          and convert(date,deliveryDate) between (select DateFrom from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 1 ) 
            and (select DateTo from NPICalendar where [Year] = datepart(yy,@deliveryDate) and [Month] = datepart(mm,@deliveryDate) and Week = 4 ) )	 sr_w4,notation,deliveryDate
    
      from tblTransaction t1 with (nolock), tblCustomer t2 
      Where t1.custCode = t2.custCode and convert(date,deliveryDate) = @deliveryDate and t1.mdCode = @mdCode and transstat = 0 and isVerified = 1
    
    ) x1
    Order By deliveryDate";
    $result = array();
    $data = array();
        
        foreach ($db->query($sql) as $row) {
             $result["custno"] = $row["CUST #"];
             $result["channel"] = $row["CHANNEL"];
             $result["freq"] = $row["FREQ"];
             $result["tier"] = $row["TIER"];
             $result["customername"] = $row["CUSTOMER NAME"];
             $result["mtdsales"] = $row["MTD SALES"];
             $result["target"] = $row["TARGET"];
             $result["actualsales"] = $row["ACTUAL SALES"];
             $result["dsino"] = $row["DSI Number"];
             $result["actualrange"] = $row["Actual Range"];
             $result["mdtave"] = $row["MTD Ave. Range"];
             $result["core1"] = $row["core1"];
             $result["core2"] = $row["core2"];
             $result["core3"] = $row["core3"];
             $result["dp1"] = $row["dp1"];
             $result["dp2"] = $row["dp2"];
             $result["dp3"] = $row["dp3"];
             $result["dp4"] = $row["dp4"];
             $result["dp5"] = $row["dp5"];
             $result["dp6"] = $row["dp6"];
             $result["dp7"] = $row["dp7"];
             $result["dp8"] = $row["dp8"];
             $result["dp9"] = $row["dp9"];
             $result["dp10"] = $row["dp10"];
             $result["dp11"] = $row["dp11"];
             $result["dp12"] = $row["dp12"];
             $result["cp1"] = $row["cp1"];
             $result["cp2"] = $row["cp2"];
             $result["cp3"] = $row["cp3"];
             $result["cp4"] = $row["cp4"];
             $result["cp5"] = $row["cp5"];
             $result["sr_w1"] = $row["sr_w1"];
             $result["sr_w2"] = $row["sr_w2"];
             $result["sr_w3"] = $row["sr_w3"];
             $result["sr_w4"] = $row["sr_w4"];
             $result["notation"] = $row["notation"];
             $data[] = $result;
        
        }
        
    return $data;
  }

  public function exec_patch_install($db_cloud, $db, $patchID){
    $date = date('Y-m-d');
    $this->exec_pl_params($db_cloud, $db, $patchID);
    $sql = $db->prepare("INSERT into [PLHistory] ([patchLevel], [dateUpdated], 
      [status]) Values ('$patchID',getDate(),'0')");
    $result = $sql->execute();
    $res = '';
    if($result){
      $res = 1;
    }else{
      $res = 'error';
    }

    return $res;
  }

  public function get_patchList($db_cloud, $db){

    $inserted_PL = $this->get_patch_inserted_local($db);
    $keys = array_keys($inserted_PL);
    $fdata = array();
    if(count($inserted_PL) == 0){
       $sth = $db_cloud->query("SELECT format(lastUpdated, 'dd/MM/yyyy hh:mm tt') as PLDate,
       patchLevel, PLNotes, PLQuery, PLStatus from tblPatch where PLStatus = 0 order by patchlevel asc");
       $fdata = $sth->fetchALL(PDO::FETCH_OBJ);
    }else{
      $sampledat = '';
      foreach($inserted_PL as $value){
        $delimeter .= "and patchLevel <> '".$value->patchLevel."' ";
      }

      $sql = "SELECT format(lastUpdated, 'dd/MM/yyyy hh:mm tt') as lastUpdated,
              patchLevel, PLNotes, PLQuery, PLStatus from tblPatch where PLStatus = 0 ".$delimeter."order by patchlevel asc";
        $sampledat .= $sql;
        foreach ($db_cloud->query($sql) as $row) {
              $result["patchLevel"] = $row["patchLevel"];
              $result["PLNotes"] = $row["PLNotes"];
              $result["PLStatus"] = $row["PLStatus"];
              $result["PLDate"] = $row["lastUpdated"];
              $fdata[] = $result;
        }
    }
    return $fdata;
  }
  
  public function get_patch_inserted_local($db){

    $sth = $db->query("SELECT patchLevel from [dbo].[PLHistory] where status = 0");
    $data = $sth->fetchALL(PDO::FETCH_OBJ);
    return $data;
  }

  public function get_product_digitalmapping_by_date($db_cloud, $from, $to, $site_id){
    $sql = "SELECT BrandColor, brand, sum(totalAmount) as tAmount
         from vCategorySalesCur where cast(deliveryDate as date) between '$from' and '$to' and Site='$site_id'
          group by Brand, BrandColor order by tAmount";
        $sth = $db_cloud->query("SELECT top 1 sum(totalAmount) as grandT from vCategorySalesCur where cast(deliveryDate as date) between '$from' and '$to' and Site = '$site_id'");
        $row = $sth->fetch(PDO::FETCH_ASSOC);
        $grandTotal = $row['grandT'];
        $percentage = 0;
        $data = array();
      foreach ($db_cloud->query($sql) as $row) {
        $contribution = ($row['tAmount'] / $grandTotal) * 100;
        $content .= "<tr>
             <td class='brandName' onclick='brand()'><i class='fa fa-shopping-cart' style='color: ".$row['BrandColor']."' aria-hidden='true'></i> ".$row['brand']."</td>
             <td class='text-right tAmount'>".number_format($row['tAmount'], 2)."</td>
             <td class='text-right contriPer'>".number_format($contribution, 2)."%</td>
             </tr>";

          $percentage += (float) $contribution;
        }//foreach

          $footer = '<div>TOTAL<span class="grandTotal">'.number_format($grandTotal, 2).'</span><span class="pull-right">'.number_format($percentage, 2).'%</span></div>';

          $data = array( 'tableDetails' => $content, 
                       'footerDetails' => $footer);
      return $data;
  }

  public function get_product_digimap_filter($db_cloud, $from, $to, $site_id){
    $sql = "SELECT * from vCategorySalesCur where cast(deliveryDate as date) between '$from' and '$to' and Brand = '$productName' and Site='$site_id'";
        $result = array();
        $data = array();
        
        foreach ($db_cloud->query($sql) as $row) {
             $result["deliveryDate"] = $row["deliveryDate"];
             $result["Brand"] = $row["Brand"];
             $result["BrandColor"] = $row["BrandColor"];
             $result["longitude"] = $row["longitude"];
             $result["latitude"] = $row["latitude"];
             $data[] = $result;
        
        }
        
        echo json_encode($data);
  }

  public function get_digital_mapping_table_data($db, $salesman, $startDate, $endDate){
    $checker = false;
      $result = array();
      $data = array();

      $datastring = '';
        foreach($salesman as $resultRow){
          $sql = "SELECT mdCode,mdName, (select Type from tblSalesperson s1 where s1.mdCode = x1.mdCode) as Type,
          tcalls,pCalls,unpCalls,tsales,tSellHour,(select distinct mdColor from tmpsalessummarydigimap t1 where t1.mdCode= x1.mdCode) as mdColor
          from (select mdCode as mdCode,mdName as mdName,sum([Total Calls]) as tcalls,sum([Productive Calls]) as pCalls,
              sum([Unproductive Calls]) as unpCalls,sum(Sales) as tsales,sum(sellingHours) as tSellHour
              from tmpsalessummarydigimap where mdCode <> '9999'
              group by mdCode, mdName
          ) x1 where mdCode = '$resultRow'";
        
          foreach ($db->query($sql) as $row) {
             $datastring .= "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["mdCode"]."\")'>
                   <td width='40%' class='showSalesman'><i class='fas fa-map-marker' style='color:".$row['mdColor']."; font-size:13px'></i> <span class='ellipsisSalesmanName'>".$row['mdName']."</span></td>
                   <td width='15%' class='text-center'>".$row['pCalls'].'/'.$row['tcalls']."</td>
                   <td width='10%' class='text-center'>".$row['unpCalls']."</td>
                   <td width='15%' class='text-center'>".$row['tSellHour']."</td>
                   <td width='9%' class='text-right' id='rowDataSd'>".number_format($row['tsales'], 2)."</td>
                   </tr>";
          }
      }

    return $datastring;
  }

  public function get_all_salesman($db){
    $sth = "SELECT mdCode, concat(mdSalesmancode, '_', mdName) as salesman from tblUser";
      $result = array();
      $data = array();
        foreach ($db->query($sth) as $row) {
           $result["Salesman"] = $row["salesman"];
           $result["mdCode"] = $row["mdCode"];
           $data[] = $result;
        }

      return $data;
  }

  public function get_salesman_list_digimap($db, $start, $end){
    $this->exec_salesman_digimap($db, $start, $end);
    $sth = "SELECT distinct mdCode, mdName from tmpsalessummarydigimap";
      $result = array();
      $data = array();
        foreach ($db->query($sth) as $row) {
           $result["Salesman"] = $row["mdName"];
           $result["mdCode"] = $row["mdCode"];
           $data[] = $result;
        }

      return $data;
  }

  public function exec_salesman_digimap($db, $start, $end){

    $sth = $db->prepare("[sp_SalesSummaryDigiMap] @startDate = '$start', @endDate = '$end'");
    $result = $sth->execute();
    return $result;
  }


  public function get_all_salesman_color($db, $mdCode){
    $sql = $db->query("SELECT distinct mdColor from vSELLOUT WHERE mdCode = '$mdCode'");
    $result = $sql->fetch();
    return $result;
  }

  public function get_dashboard_markers($db){
     $date = date('Y-m-d');
         $sql = "SELECT [Salesman]
                     ,[Customer]
                     ,[longitude]
                     ,[latitude]
                     ,[Sales]
                     ,[deliveryDate]
                     ,[mdColor]
                     ,[Document #]
                     ,[transCount]
                     ,[mdCode]
                     ,[TIME BOUND Min.]
                     ,[upTime]
                     ,[#SKU]
                     ,[transactionID]
                     ,[CustomerID]
                     ,[address]
                   FROM [dbo].[vSELLOUT] WHERE CAST(deliveryDate as date) = cast(getdate() as date)
                   ORDER BY Salesman";
        // $sql = "SELECT [Salesman]
        //              ,[Customer]
        //              ,a.[longitude]
        //              ,a.[latitude]
        //              ,[Sales]
        //              ,[deliveryDate]
        //              ,a.[mdColor]
        //              ,[Document #]
        //              ,[transCount]
        //              ,a.[mdCode]
        //              ,[TIME BOUND Min.]
        //              ,[upTime]
        //              ,[#SKU]
        //              ,[transactionID]
        //              ,[CustomerID]
        //              ,[address]
				// 	           ,[thumbnail]
        //            FROM [dbo].[vSELLOUT] a, tblUser b 
        //             WHERE a.mdCode = b.mdCode and
        //             CAST(a.deliveryDate as date) = cast(getdate() as date)
        //                     ORDER BY Salesman";
        //           $f_Data = array();
        //           $data = array();
       
          foreach ($db->query($sql) as $row) {
             $data["mdCode"] = $row["mdCode"];
             $data["Salesman"] = $row["Salesman"]; 
             $data["Customer"] = $row["Customer"]; 
             $data["longitude"] = $row["longitude"];
             $data["latitude"] = $row["latitude"];
             $data["Sales"] = $row["Sales"];
             $data["deliveryDate"] = $row["deliveryDate"];
             $data["mdColor"] = $row["mdColor"];
             $data["DocumentNo"] = $row["Document #"];
             $data["transCount"] = $row["transCount"];
             $data["time"] = $row["TIME BOUND Min."];
             $data["timeSpent"] = $row["upTime"];
             $data["noSku"] = $row["#SKU"];
             $data["transactionID"] = $row["transactionID"];
             $data["customerID"] = $row["CustomerID"];
             //$data["thumbnail"] = $row["thumbnail"];
             $data["address"] = $row["address"];
             $f_Data[] = $data;
          }

          return $f_Data;
  }

  public function get_totalsales_dashboard($db){
    date_default_timezone_set('Asia/Manila');
        $newdate = date('Y-m-d');
        $sth = "SELECT SUM(Sales) as total, count(mdCode) as salesman,
        sum([Unproductive Calls] + [Productive Calls]) as indicator FROM vSalesSummary 
                 where CAST(deliveryDate as date) = '$newdate'";
        $result = array();
        $data = array();
        foreach ($db->query($sth) as $row) {
             $result["indicator"] = $row["indicator"];
             $result["total"] = $row["total"]; 
             $result["salesman"] = $row["salesman"];
             $data[] = $result;
          }
        return $data;
  }

  public function get_totalsales_dashboard_local($db){
    date_default_timezone_set('Asia/Manila');
        $newdate = date('Y-m-d');
        //$newdate = date('2019-10-21');
        $sth = "SELECT sum(totalAmount) as total, count(distinct mdCode) as salesman, count(*) as indicator from tblTransaction where CAST(deliveryDate as date) = '$newdate' and isVerified = 1 and transstat = 0 and mdCode <> '9999'";
        $result = array();
        $data = array();
        foreach ($db->query($sth) as $row) {
             $result["indicator"] = $row["indicator"];
             $result["total"] = $row["total"]; 
             $result["salesman"] = $row["salesman"];
             $data[] = $result;
          }
        return $data;
  }

  public function update_defaultOrdType($db, $custCode){
    $sth = $db->prepare("UPDATE tblCustomerImage set DefaultOrdType = 'B' where custCode = '$custCode'");
    $res = $sth->execute();
    return $res;
  }

  public function update_defaultOrdType_revert($db, $custCode){
    $sth = $db->prepare("UPDATE tblCustomerImage set DefaultOrdType = '' where custCode = '$custCode'");
    $res = $sth->execute();
    return $res;
  }

  public function get_totalsales_digitalMapping_filter($db, $startDate, $endDate, $sitename, $salesman){
    $sales = 0;
        $Countsalesman = 0;
          foreach($salesman as $resultRow){
              $sth = "SELECT Sales FROM vSalesSummary  WITH (NOLOCK)
                 where  left(mdCode, 4) = '$resultRow' and CAST(deliveryDate as date) BETWEEN '$startDate' and '$endDate'";
           
             $result = array();
             $data = array();
             $Countsalesman++;
            foreach ($db->query($sth) as $row) {

                 $sales += $row['Sales'];
              }
          }
         
        $variable = array( 'sales' => number_format($sales,2), 'salesmanCount' => "$Countsalesman" );
        return $variable;
  }

  public function get_totalsales_digimap($db, $startDate, $endDate, $salesman){
    $sales = 0;
    foreach($salesman as $resultRow){
      $sth = "SELECT SUM(totalAmount) as total FROM tblTransaction 
              WHERE CAST(deliveryDate as date) between '$startDate' and '$endDate'
              and isVerified = 1 and transstat = 0 and mdCode = '$resultRow'";
      foreach ($db->query($sth) as $row) {
        $sales += $row['total'];
      }
    }

    $res = array( 'sales' => number_format($sales,2));
    return $res;
  }

  public function get_salesmanlocation_digimap($db_cloud, $salesman, $site_id, $startDate, $endDate){
    	$checker = false;
        $data = array();
        $f_Data = array();

        foreach($salesman as $resultRow){
          $sql = "SELECT *
                  FROM tblSellOutCur where mdCode = '$resultRow' AND CAST(deliveryDate as date) BETWEEN '$startDate' and '$endDate' and site = '$site_id'";
            
                 foreach ($db_cloud->query($sql) as $row) {
                     $data["mdCode"] = $row["mdCode"];
                     $data["Salesman"] = $row["Salesman"]; 
                     $data["Customer"] = $row["Customer"]; 
                     $data["longitude"] = $row["longitude"];
                     $data["latitude"] = $row["latitude"];
                     $data["Sales"] = $row["Sales"];
                     $data["deliveryDate"] = $row["deliveryDate"];
                     $data["mdColor"] = $row["mdColor"];
                     $data["DocumentNo"] = $row["Document #"];
                     $data["transCount"] = $row["transCount"];
                     $data["time"] = $row["TIME BOUND Min."];
                     $data["timeSpent"] = $row["upTime"];
                     $data["noSku"] = $row["#SKU"];
                     $data["transactionID"] = $row["transactionID"];
                     $data["customerID"] = $row["CustomerID"];
                     $data["address"] = $row["address"];
                     $f_Data[] = $data;
              }
           

        }//end for loop
        return $f_Data;
  }
  public function get_salesmanlocation_digimap_local($db, $salesman, $startDate, $endDate){
        $checker = false;
        $data = array();
        $f_Data = array();

        foreach($salesman as $resultRow){
          //$sql = "SELECT * FROM tblSellOutCur where mdCode = '$resultRow' AND CAST(deliveryDate as date) BETWEEN '$startDate' and '$endDate'";
          $sql = "EXEC [dbo].[sp_SellOutDigimap] 
          @startDate = '$startDate', @endDate = '$endDate', @mdCode = '$resultRow'"; 
          foreach ($db->query($sql) as $row) {
                 $data["mdCode"] = $row["mdCode"];
                 $data["Salesman"] = $row["Salesman"]; 
                 $data["Customer"] = $row["Customer"]; 
                 $data["longitude"] = $row["longitude"];
                 $data["latitude"] = $row["latitude"];
                 $data["Sales"] = $row["Sales"];
                 $data["deliveryDate"] = $row["deliveryDate"];
                 $data["mdColor"] = $row["mdColor"];
                 $data["DocumentNo"] = $row["Document #"];
                 $data["transCount"] = $row["transCount"];
                 $data["time"] = $row["TIME BOUND Min."];
                 $data["timeSpent"] = $row["upTime"];
                 $data["noSku"] = $row["#SKU"];
                 $data["transactionID"] = $row["transactionID"];
                 $data["customerID"] = $row["CustomerID"];
                 $data["address"] = $row["address"];
                 $f_Data[] = $data;
              }
        }//end for loop
        return $f_Data;
  }

  public function get_sales_report_data($db, $start, $end){
     $f_Data = array();
     $sql = "SELECT [Salesman]
                    ,[Customer]
                    ,[Document #]
                    ,[Sales]
                    ,[deliveryDate]
                    ,[GEO Difference]
                    ,[latitude]
                    ,[longitude]
                    ,[#SKU]
                    ,[TIME BOUND Min.]
                    ,[Notation]
                    ,[upTime]
                FROM [dbo].[vSELLOUT] where CAST(deliveryDate as date) BETWEEN '$start' and '$end'";
            
             foreach ($db->query($sql) as $row) {
                     $data["Salesman"] = $row["Salesman"];
                     $data["Customer"] = $row["Customer"]; 
                     $data["Documentno"] = $row["Document #"];
                     $data["Sales"] = $row["Sales"];
                     //$data["geoLocation"] = $row["geoLocation"];
                     $data["geodifference"] = $row["GEO Difference"];
                     //$data["CustLocation"] = $row["CustLocation"];
                     $data["latitude"] = $row["latitude"];
                     $data["longitude"] = $row["longitude"];
                     $data["deliveryDate"] = $row["deliveryDate"];
                     $data["SKU"] = $row["#SKU"];
                     $data["timetravel"] = $row["TIME BOUND Min."];
                     $data["remarks"] = $row["Notation"];
                     $data["timespent"] = $row["upTime"];
                     $f_Data[] = $data;
              }
          return $f_Data;
  }

  public function generate_graphicalreport_reportpage($db, $startDate, $endDate){
    $sql = "SELECT [mdCode]
                       ,sum([Sales]) as sales
                       ,[mdColor]
                 FROM [dbo].[vSELLOUT]
               where CAST(deliveryDate as date) BETWEEN '$startDate' and '$endDate'";

        $output = array();
        $result = $db->prepare($sql);
        $result->execute(); 
        $number_of_rows = $result->fetchColumn();
         foreach ($db->query($sql) as $row) {
            $data['mdCode'] = substr($row['mdCode'], 0, 4);
            $data['sales'] = round($row['sales']);
            $data['mdColor'] = $row['mdColor'];
            //$data['salesmanName'] = substr($row['mdCode'], 5);
            $data['salesmanName'] = $row['mdCode'];
            $output[] = $data;
          }//foreach
        return $output;
  }

  public function get_digitalmapping_graph_report($db, $startDate, $endDate){
    $checker = false;
        $result = array();
        $data = array();
        $datastring = '';
        foreach($salesman as $resultRow){
          $sql = "Select Salesman, mdColor, mdCode, sum([Total Calls]) as tcalls, sum(tblSales) as tsales,sum([Productive Calls]) as pCalls,sum([Unproductive Calls]) as unpCalls, sum(sellHours)  as tSellHour from (
            SELECT distinct vSELLOUT.Salesman
                        ,vSalesSummary.deliveryDate
                        ,vSalesSummary.[Total Calls]
                        ,vSalesSummary.[Productive Calls]
                        ,[Unproductive Calls]
                        ,vSELLOUT.mdColor
                        ,vSELLOUT.mdCode
                        ,vSalesSummary.Sales as tblSales
                        ,vSalesSummary.sel lingHours as sellHours
                     FROM vSELLOUT join vSalesSummary 
                     on left(vSalesSummary.mdCode, 4) = vSELLOUT.mdCode
                     WHERE vSELLOUT.mdCode = '$resultRow'
                     AND CAST(vSalesSummary.deliveryDate as date) BETWEEN '$startDate' and '$endDate'
                ) x1 Group by Salesman, mdColor, mdCode";

            foreach ($db->query($sql) as $row) {
                $datastring .= "<tr class='salesmanName'>
                     <td width='40%' class='showSalesman'><span class='fas fa-map-marker' style='color:".$row['mdColor']."'></span> ".$row['mdCode'].'_'.$row['Salesman']."</td>
                     <td width='15%' class='text-center'>".$row['tcalls']."</td>
                     <td width='5%' class='text-center'>".$row['pCalls']."</td>
                     <td width='10%' class='text-center'>".$row['unpCalls']."</td>
                     <td width='15%' class='text-center'>".$row['tSellHour']."</td>
                     <td width='9%' class='text-right' id='rowDataSd'>".number_format($row['tsales'], 2)."</td>
                     </tr>";
                  
              }//foreach
          }

          return $datastring;
  }

  public function get_late($db){
    date_default_timezone_set('Asia/Manila');
    $date = date('Y-m-d');
    $sql = "EXEC sp_deviation @deliverydate = '$date', @salesmantype = 'ALL'";
    $output = array();
     foreach ($db->query($sql) as $row) {
        $time = date("g:i:s A",strtotime($row['deliveryDate']));
        $data['mdCode'] = $row['mdCode'];
        $data['salesmanName'] = $row['salesmanName'];
        $data['alert'] = $row['alert'];
        $data['Description'] = $row['Description'];
        $data['refNo'] = $row['refno'];
        $data['TransTime'] = $row['transTime'];
        $data['deliveryDate'] = $time;
        $data['transactionID'] = $row['transactionID'];
        $data['mobileNo'] = $row['mobileNo'];
		    $data['calltime'] = $row['calltime'];
        $data['thumbnail'] = $row['thumbnail'];
        $data['customerLoc'] = str_replace("'", "", $row['CustomerName']);
        $data['latLng'] = $row['Latitude'].' '.$row['Longitude'];
        $output[] = $data;
      }//foreach

    return $output;
}

  public function get_late_by_salesmancategory($db, $salesmanCat, $date){
  	date_default_timezone_set('Asia/Manila');
    
      if($salesmanCat == 'All'){
       $sql = "EXEC sp_deviation @deliverydate = '$date', @salesmantype = 'ALL'";
      }else{
        $sql = "EXEC sp_deviation @deliverydate = '$date', @salesmantype = '$salesmanCat'";
      }
       $output = array();
       foreach ($db->query($sql) as $row) {
          	$time = date("g:i:s A",strtotime($row['deliveryDate']));
	        $data['mdCode'] = $row['mdCode'];
	        $data['salesmanName'] = $row['salesmanName'];
	        $data['alert'] = $row['alert'];
	        $data['Description'] = $row['Description'];
	        $data['refNo'] = $row['refno'];
	        $data['TransTime'] = $row['transTime'];
	        $data['deliveryDate'] = $time;
	        $data['transactionID'] = $row['transactionID'];
	        $data['mobileNo'] = $row['mobileNo'];
			    $data['calltime'] = $row['calltime'];
	        $data['thumbnail'] = $row['thumbnail'];
	        $data['customerLoc'] = $row['CustomerName'];
        	$data['latLng'] = $row['Latitude'].' '.$row['Longitude'];
          	$output[] = $data;
        }//foreach

        return $output;
  }

  public function get_dsr_loadsalesman($db){
    $sth = "SELECT concat(mdSalesmancode,' ',mdName) as Salesman, mdCode from tblUser where mdName <> '' and mdName <> 'IN-ACTIVE' and mdCode <> '9999' order by mdSalesmancode ASC";
    $result = array();
    $data = array();
        foreach ($db->query($sth) as $row) {
            $result["Salesman"] = $row["Salesman"];
            $result["mdCode"] = $row["mdCode"];
            $data[] = $result;
        }
    return $data;
  }

  public function get_dsr_data($db, $salesman, $date){
      $data = '';
      $result = array();
      $count = 0;
      $btsTotal = 0;
      $targetTotal = 0;

      $sqlMustHave = $db->query("SELECT count(*) as totalMustHave from tblProduct where mustHave = 1");
      $resMustHave = $sqlMustHave->fetch();
      $totalMustHave = $resMustHave['totalMustHave'];

      $sql = "SELECT Sales, Customer, refno, #SKU, vSellout.Notation, refNo, tbltransaction.custCode as custCodeParams, vSELLOUT.mdCode as mdCode, tbltransaction.upTime as upTime, vSellout.transactionID as transID from vSELLOUT inner join tblTransaction on vSELLOUT.mdCode = tblTransaction.mdCode
           and vSELLout.deliveryDate = tblTransaction.deliveryDate
           where vSELLOUT.mdCode = '$salesman' and CAST(vSELLOUT.deliveryDate as date) = '$date'
           order by vSELLOUT.deliveryDate";

    foreach ($db->query($sql) as $row) {
            $count++;

            $custCode = $row['custCodeParams'];
            $mdCode = $row['mdCode'];
            $transID = $row['transID'];
            $refNoHeader = $row['refNo'];

            $sqlSalesTarget = $db->query("SELECT sum(totalAmount / 4) as totalAmt from (
              select top 4 totalAmount from tblTransaction
              where cast(deliveryDate as date) < '$date' and custCode = '$custCode'
              ) as t");
            $res1 = $sqlSalesTarget->fetch();
            $resTotal = $res1['totalAmt'];

            $sqlMHAcquired = $db->query("SELECT count(*) as mustHaveCount from tblStocktake as a, tblTransaction as b 
            where a.transactionID = b.transactionID 
            and cast(b.deliveryDate as date) = '$date' 
            and b.custCode = '$custCode' and b.mdCode = '$mdCode'");
            $res2 = $sqlMHAcquired->fetch();
            $MHAquired = $res2['mustHaveCount'];

            $sqlBOItems = $db->query("SELECT a.remarks as re, sum(a.qtyRefund) as ref, sum(a.qtyReplace) as rep from tblTransactionBOItems a, tblTransaction b
              where a.transactionID = b.transactionID and b.refno = '$refNoHeader' and
              salesmanCode = '$mdCode' group by remarks");
            $resBo = $sqlBOItems->fetch();
            $re = $resBo['re'];
            $repAndref = $resBo['rep']+$resBo['ref'];

            $bts = (float)$resTotal - (float)$row['Sales'];
            $btsTotal += (float)$bts;
            $targetTotal += (float)$resTotal;

            $btsHolder = number_format($bts, 2);
            
            if($bts < 1){
              $btsHolder = "<i style='color:red;'>(".abs($btsHolder).")</i>";
            }

            $expChecker = '';
            $damChecker = '';

            if($re == ''){
               $damChecker = ' ';
               $expChecker = ' ';
               $repAndref = ' ';
            }else{
              if($re == 'Infested'){
                 $damChecker = '<i class="fa fa-check"></i>';
              }else/*($res != 'Expired')*/{
                  $expChecker = '<i class="fa fa-check"></i>';
              }
            }

            $data.= "<tr>
                       <td>".$count."</td>
                       <td>".$row['refno']."</td>
                       <td>".$row['#SKU']."</td>
                       <td class=''>".$row['Sales']."</td>
                       <td class='text-left ellipsis'>".$row['Customer']." / (".$row['upTime'].")</td>
                       <td>".number_format($resTotal, 2)."</td>
                       <td>".$btsHolder."</td>
                       <td>".$MHAquired."/".$totalMustHave."</td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td></td>
                       <td>".$damChecker."</td>
                       <td>".$expChecker."</td>
                       <td>".$repAndref."</td>
                       <td class='text-left ellipsis'>".$row['Notation']."</td>
                    </tr>";

        }//foreach
         $max = 35;
         $counter = $max - $count;
         for($x = 0; $x < $counter; $x++){
          $newCount = ($count + 1) + $x;
            $data.="<tr>
                     <td>".$newCount."</td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                </tr>";
         }
        $result = array("content" => $data,
                      "delimeter" => $count,
                      "btsTotal" => number_format($btsTotal, 2),
                      "targetTotal" => number_format($targetTotal, 2),
                      "resTotal" => $resTotal);
        return $result;
  }

  public function get_dsr_average_data($db, $salesman, $date){
    $sql = $db->query("SELECT sum(cast(totalAmount as float)) as average from tblTransaction where mdCode = '$salesman' and cast(deliveryDate as date) = '$date'");
        $result = $sql->fetch();
        return $result;
  }

  public function get_todays_productive_data($db, $salesman, $actualDate){
    $todayProductiveCall = array();
        $date =  date('N', strtotime($_GET['date']));
      $sqlMcpDay = $db->query("SELECT count(custCode) as target from [dbo].[tblCustomer] 
              where mcpday = '$date' and mdcode = '$salesman' and custCode NOT LIKE 'TMP%'");
        $resultTarget = $sqlMcpDay->fetch();

        $sqlActual = $db->query("SELECT count(sales) as actual from vSELLOUT
                   WHERE cast(deliveryDate as date) = '$actualDate' and mdCode = '$salesman'");
        $resultActual = $sqlActual->fetch();

        $todayProductiveCall = array($resultTarget, $resultActual );
        
        return $todayProductiveCall;
  }

  public function get_sellingdays_data($db, $salesman, $date, $numericMonth){
    $actualDate = $date->format('d');
        $firstday = $date->modify('first day of this month');
        $getMonth = $firstday->format('Y-m-d');

        $result = array();
        
         $start = new DateTime($getMonth);
         $end = new DateTime($_GET['date']);
         $days = $start->diff($end, true)->days;

         $sundays = intval($days / 7) + ($start->format('N') + $days % 7 >= 7);
         $actualDays = (int)$actualDate - (int)$sundays;


         $mtdDate = $_GET['date'];
         $sqlMTDAtualSales = $db->query("SELECT sum([totalAmount]) as sales from tblTransaction where cast(deliveryDate as date) between '$getMonth' and '$mtdDate' and mdcode = '$salesman'");
         $resultMTDsales = $sqlMTDAtualSales->fetch();
         
         $sql = "SELECT trnDay, tAmount from tblTarget WHERE trnMonth = '$numericMonth' and mdCode = '$salesman'";
          foreach ($db->query($sql) as $row) {
            $result['day'] = $row['trnDay'];
            $result['amount'] = $row['tAmount'];
            $result['actualDays'] = $actualDays;
            $result['mtdSales'] = $resultMTDsales;
          }

        return $result;
  }

  public function get_monthtodate_data($db, $salesman, $date){
    $actualDate = $date->format('d');
        $firstday = $date->modify('first day of this month');
        $getMonth = $firstday->format('Y-m-d');

        $result = array();

        $mtdDate = $_GET['date'];
        $targetSql = $db->query("SELECT count(customerID) as target 
              from tblCustomer where mdCode = '$salesman' and custCode NOT LIKE 'TMP%'");
        $resultTarget = $targetSql->fetch();

        $activetSql = $db->query("SELECT distinct count(transactionID) as active from tblTransaction 
              where mdCode = '$salesman' and cast([deliveryDate] as date) between '$getMonth' and '$mtdDate'");
        $resultActive = $activetSql->fetch();

        $result = array("target" => $resultTarget, "active" => $resultActive);

        return $result;
  }

  public function exec_georesetsalesman_data($db, $mcpDay, $mdCode){
    $datastring = '';
    if($mcpDay == '0'){
         $sth = $db->prepare("Update tblCustomer set longitude= '0.0',latitude = '0.0', storeImage = '', storeImage2 = '' where mdCode = '$mdCode'");
         $tblCustomerImageSql = $db->prepare("Update t1 set t1.storeImage = 'NULL', t1.storeimage2 = 'NULL', t1.longitude = '0.0', t1.latitude = '0.0', t1.isLockOn = '0' from tblCustomerImage t1, tblCustomer t2 WHERE '$mdCode' = t1.mdCode and t1.custCode = t2.custCode");
        }else{
         $sth = $db->prepare("Update tblCustomer set longitude = '0.0',latitude = '0.0', storeImage = '', storeImage2 = '' where mdCode = '$mdCode' and mcpday = '$mcpDay'");
         $tblCustomerImageSql = $db->prepare("Update t1 set t1.storeImage = 'NULL', t1.storeimage2 = 'NULL', t1.longitude = '0.0', t1.latitude = '0.0', t1.isLockOn = '0' from tblCustomerImage t1, tblCustomer t2 WHERE '$mdCode' = t1.mdCode and t1.custCode = t2.custCode and t2.mcpDay = '$mcpDay'");
      }
        
      $resulttblCustomerImage = $tblCustomerImageSql->execute(); 
      $result = $sth->execute();
      
      if($result && $tblCustomerImageSql){
          $datastring = 1;
      }else{
          $datastring = 'ERROR';
      }

      return $datastring;
  }

  public function exec_georesetcustomer_data($db, $custCode){
    $datastring = '';
    $checkCustomerSql = $db->query("SELECT count(*) as valiCustomer from tblCustomer where custCode = '$custCode'");
        $CustomerRes = $checkCustomerSql->fetch();
        $valiDateCust = $CustomerRes['valiCustomer'];

       if((int)$valiDateCust != 0){
        $sth = $db->prepare("UPDATE tblCustomer set longitude = '0.0', latitude = '0.0', storeImage = '', storeImage2 = '' where custCode = '$custCode'");
        $res1 = $sth->execute();

        $sthTBLCust = $db->prepare("UPDATE t1 set t1.storeImage = 'NULL', t1.storeimage2 = 'NULL', t1.longitude = '0.0', t1.latitude = '0.0', t1.isLockOn = '0' from tblCustomerImage t1, tblCustomer t2 WHERE t2.mdCode = t1.mdCode and '$custCode' = t1.custCode");
        $res2 = $sthTBLCust->execute();
        if($res1 && $res2){
          $datastring = 0;
        }else{
          $datastring = 'ERROR';
        }
       }else{
        $datastring = 1;
       }

       return $datastring;
  }

  public function get_salesmancategory_data($db, $date){
        //date_default_timezone_set('Asia/Manila');
        //$date = date('Y-m-d');
        $sql = "SELECT distinct a.Type
              from vSalesman a, vSalesSummary b
              where a.mdCode = b.mdCode and cast(deliveryDate as date) = '$date'";
        $stmt= $db->query($sql);
        $data= $stmt->fetchALL(PDO::FETCH_OBJ);

        return $data;
  }

  public function get_filterSalesmanByCategory_data($db, $brand, $date){
      if($brand == 'All'){
        $sql = "EXEC sp_SalesSummary @deliverydate = '$date', @salesmantype = 'ALL'";
      }else{
        $sql = "EXEC sp_SalesSummary @deliverydate = '$date', @salesmantype = '$brand'";  
      }
        
      $output = array();
      $result = $db->prepare($sql);
      $result->execute(); 
      $number_of_rows = $result->fetchColumn();

      $data = '';
      if($number_of_rows == 0){
        echo "<tr>
                <td>NO DATA TO SHOW AS OF THIS TIME!</td>
              </tr>";
      }else{
          foreach ($db->query($sql) as $row) {
            $data .= "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["mdCode"]."\")'>
                 <td width='45%' class='showSalesman' data-toggle='tooltip' data-placement='right' title='Double click to view location!'><span class='fas fa-map-marker' style='color:".$row['mdColor']."'></span> <span class='ellipsisSalesmanName'>".$row['mdName']."</span></td>
                 <td width='20%' class='text-center'>".$row['Productive Calls'].'/'.$row['Total Calls']."</td>
                 <td width='10%' class='text-left'>".$row['Unproductive Calls']."</td>
                 <td width='13%' class='text-center'>".$row['sellingHours']."</td>
                 <td width='9%' class='text-right'>".number_format($row['Sales'], 2)."</td>
                 </tr>";
            }//foreach
      }
      return $data;
  }

  public function get_total_salesmanAndsales_per_category($db, $brand, $date){
        date_default_timezone_set('Asia/Manila');
         $newdate = date('Y-m-d');
         if($brand == 'All'){
           $sth = "SELECT sum(b.Sales) as total, count(b.mdCode) as salesman
                 from vSalesman a, vSalesSummary b
                 where a.mdCode = b.mdCode and cast(deliveryDate as date) = '$date'";
         }else{
           $sth = "SELECT sum(b.Sales) as total, count(b.mdCode) as salesman
                 from vSalesman a, vSalesSummary b
                 where a.mdCode = b.mdCode and cast(deliveryDate as date) = '$date' 
                 and type = '$brand'";
         }
         
         $result = array();
         $data = array();
        foreach ($db->query($sth) as $row) {
             $result["total"] = number_format($row["total"], 2); 
             $result["salesman"] = $row["salesman"];
             $data[] = $result;
          }

        return $data;
  }

  public function get_salesman_marker_details_by_category($db, $brand, $date){
    date_default_timezone_set('Asia/Manila');
    //$newdate = date('Y-m-d');
    $f_Data = array();
    $data = array();
    if($brand == 'All'){
        $sql = "SELECT [Salesman]
                    ,[Customer]
                    ,[longitude]
                    ,[latitude]
                    ,[Sales]
                    ,[deliveryDate]
                    ,[mdColor]
                    ,[Document #]
                    ,[transCount]
                    ,[mdCode]
                    ,[TIME BOUND Min.]
                    ,[upTime]
                    ,[#SKU]
                    ,[transactionID]
                    ,[CustomerID]
                    ,[address]
              FROM [dbo].[vSELLOUT] WHERE CAST(deliveryDate as date) = '$date'
              ORDER BY Salesman";
    }else{
      $sql = "SELECT [Salesman]
                    ,[Customer]
                    ,[longitude]
                    ,[latitude]
                    ,[Sales]
                    ,[deliveryDate]
                    ,[mdColor]
                    ,[Document #]
                    ,[transCount]
                    ,[mdCode]
                    ,[TIME BOUND Min.]
                    ,[upTime]
                    ,[#SKU]
                    ,[transactionID]
                    ,[CustomerID]
                    ,[address]
              FROM [dbo].[vSELLOUT] WHERE CAST(deliveryDate as date) = '$date' and type = '$brand'
              ORDER BY Salesman";
    }
    
    foreach ($db->query($sql) as $row) {
        $data["mdCode"] = $row["mdCode"];
        $data["Salesman"] = $row["Salesman"]; 
        $data["Customer"] = $row["Customer"]; 
        $data["longitude"] = $row["longitude"];
        $data["latitude"] = $row["latitude"];
        $data["Sales"] = $row["Sales"];
        $data["deliveryDate"] = $row["deliveryDate"];
        $data["mdColor"] = $row["mdColor"];
        $data["DocumentNo"] = $row["Document #"];
        $data["transCount"] = $row["transCount"];
        $data["time"] = $row["TIME BOUND Min."];
        $data["timeSpent"] = $row["upTime"];
        $data["noSku"] = $row["#SKU"];
        $data["transactionID"] = $row["transactionID"];
        $data["customerID"] = $row["CustomerID"];
        $data["address"] = $row["address"];
        $f_Data[] = $data;
    }
    return $f_Data;
  }

  public function exec_update_stockrequest($db, $mdCode, $stockCode, $refNo){
      
      $appv_stat = $this->update_approveStat($db, $mdCode, $stockCode, $refNo);
      $stockRequest_stat = $this->update_tblStockrequest($db, $mdCode, $stockCode, $refNo);
      
      $datastring = '';
      if($appv_stat && $stockRequest_stat){
        $datastring = 0;  
      }else{
        $datastring = 'notupdated';
      }

      return $datastring;
  }

  public function update_tblStockrequest($db, $mdCode, $stockCode, $refNo){
      $newrefno = 'SR'.rand(10,100000000);
      $sth2 = $db->prepare("UPDATE tblStockrequest set refNo = '$newrefno' where mdCode = '$mdCode'
          and StockCode = '$stockCode' and refNo = '$refNo'");
      $res2 = $sth2->execute();
      return $res;
  }

  public function update_approveStat($db, $mdCode, $stockCode, $refNo){
      $sth = $db->prepare("UPDATE tblStockrequest set approveStat = 1 where mdCode = '$mdCode'
      and StockCode = '$stockCode' and refNo = '$refNo'");
      $res = $sth->execute();
      return $res;
  }

  public function get_stockrequest_data($db){
      $sql = "SELECT * from vStockRequest";
      $stmt = $db->query($sql);
      $res = $stmt->fetchALL(PDO::FETCH_OBJ);

      return $res;
  }

  public function get_traverse_salesmandata_img($db){
    $sql = "SELECT mdCode, mdLevel, thumbnail from tblUser where thumbnail is not null";
    $stmt = $db->query($sql);
    $res = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $res;
  }

  public function get_traverse_customerdata_img($db){
    $sql = "SELECT mdCode, custCode, storeImage from tblCustomerImage where storeImage is not null";
    $stmt = $db->query($sql);
    $res = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $res;
  }

  public function get_stockRequest_appv_data($db, $start, $end){
      $sql = "SELECT [cID], [transDate], [mdCode], [mdName], [contactCellNumber], 
        [refNo], [stockCode], [Description], [Cases], [IB], cast([PCS] as int) as PCS, [approveStat], 
        [remarks], [STATUS], [source], [Amount]
        FROM vStockRequest WHERE STATUS = 'VERIFIED' and cast(transDate as date) between '$start' and '$end' ORDER BY refNo";
      $stmt = $db->query($sql);
      $res = $stmt->fetchALL(PDO::FETCH_OBJ);

      return $res;
  }

   public function get_stockRequest_pend_data($db){
      // $sql = "SELECT [cID], [transDate], [mdCode], [mdName], [contactCellNumber], 
      //   [refNo], [stockCode], [Description], [Cases], [IB], cast([PCS] as int) as PCS, [approveStat], 
      //   [remarks], [STATUS], [source], [Amount]
      //   FROM vStockRequest WHERE STATUS = 'PENDING' ORDER BY refNo";

      // $sql = "SELECT cID,convert(date,transDate) transDate, t1.mdCode,mdName,contactCellNumber,refNo,t1.StockCode,Description,
      // FLOOR(t1.quantity/cast(ConvFactAltUom as dec(15,2))) as Cases,
      // CASE WHEN OtherUom = 'IB' THEN floor(round((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2)), 0) / (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom)) ELSE '0' END IB,
      // CASE WHEN OtherUom = 'IB' THEN round((((round((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2)), 0) / (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom)) - CAST((floor(round((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2)), 0) / (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom))) AS decimal(10, 2))) * (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom)), 0) ELSE round(((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2))), 0) END PCS
      // ,approveStat,remarks,'PENDING' status,'' source,t1.quantity * (select unitPrice from tblPrice s1 where s1.priceCode = t3.priceCode and s1.stockCode = t1.stockCode) Amount
      // from tblStockRequest t1 , tblUser t3, tblProduct t4
      // where approveStat = 0 and t1.mdCode = t3.mdCode and t1.StockCode = t4.StockCode";

      $sql = "SELECT cID,convert(date,transDate) transDate, t1.mdCode,mdName,contactCellNumber,refNo,t1.StockCode,Description,
      FLOOR(t1.quantity/cast(ConvFactAltUom as dec(15,2))) as Cases,
      CASE WHEN OtherUom = 'IB' THEN floor(round((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2)), 0) / (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom)) ELSE '0' END IB,
      CASE WHEN OtherUom = 'IB' THEN round((((round((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2)), 0) / (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom)) - CAST((floor(round((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2)), 0) / (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom))) AS decimal(10, 2))) * (cast(ConvFactAltUom as dec(15,2)) / ConvFactOthUom)), 0) ELSE round(((t1.quantity/cast(ConvFactAltUom as dec(15,2)) - CAST(floor(t1.quantity/cast(ConvFactAltUom as dec(15,2))) AS decimal(15, 2))) * CAST(cast(ConvFactAltUom as dec(15,2)) AS decimal(10, 2))), 0) END PCS
      ,approveStat,remarks,'PENDING' status,'' source,t1.quantity * (select unitPrice from tblPrice s1 where s1.priceCode = t3.priceCode and s1.stockCode = t1.stockCode) Amount
      from tblStockRequest t1 , tblUser t3, tblProduct t4
      where approveStat = 0 and t1.mdCode = t3.mdCode and t1.StockCode = t4.StockCode";
      $stmt = $db->query($sql);
      $res = $stmt->fetchALL(PDO::FETCH_OBJ);

      return $res;
  }


  public function get_stockrequest_filter_header_data($db, $mdCode, $refNo){
        $sql = "SELECT distinct mdSalesmancode, a.mdName, cast(transDate as date) as requestedDate, refNo from tblUser a, vStockRequest b WHERE a.mdCode = '$mdCode' and refNo = '$refNo'";
        $stmt = $db->query($sql);
        $res = $stmt->fetchALL(PDO::FETCH_OBJ);

        return $res;
  }

  public function get_stockrequest_filter_data($db, $mdCode, $refNo){
        $sql = "SELECT * from vStockRequest where mdCode = '$mdCode' and refNo = '$refNo' and status = 'VERIFIED' and amount <> ''";
        //$stmt1 = $db->query($sql);
        //$res_tbody = $stmt1->fetchALL(PDO::FETCH_OBJ);
        $res_tbody = array();
        foreach ($db->query($sql) as $row) {
          $data["stockCode"] = $row["stockCode"];
          $data["Description"] = $row["Description"]; 
          $data["Cases"] = $row["Cases"]; 
          $data["IB"] = $row["IB"];
          $data["PCS"] = $row["PCS"];
          $data["Amount"] = $row['Amount'];//number_format($row['mAmount'], 2);
          $data["remarks"] = $row["remarks"];
          $res_tbody[] = $data;
      }

        $sqltotal = "SELECT count(stockCode) as tstockcode, count(Description) as tdesc, sum(cases) as tcases, sum(IB) as tib, sum(PCS) as tpcs, sum(Amount) as tamount from vStockRequest where status = 'VERIFIED' and amount <> '' and mdCode = '$mdCode' and refNo = '$refNo'";
        $stmt2 = $db->query($sqltotal);
        $res_fotter = $stmt2->fetchALL(PDO::FETCH_OBJ);
        
        $resultData = array("tbody" => $res_tbody,
                      "footer" => $res_fotter);
        return $resultData;
  }

  public function get_salesman_stockrequest_selection_data($db){
        $sql = "SELECT distinct mdCode, mdName from vStockRequest where STATUS = 'VERIFIED'";
        $stmt1 = $db->query($sql);
        $res = $stmt1->fetchALL(PDO::FETCH_OBJ);

        return $res;
  }

  public function get_refno_stockrequest($db, $mdCode){
        $sql = "SELECT distinct refNo from vStockRequest where mdCode = '$mdCode' and STATUS = 'VERIFIED'";
        $stmt1 = $db->query($sql);
        $res = $stmt1->fetchALL(PDO::FETCH_OBJ);

        return $res;
  }

  public function exec_digitalmapping_update_local($db){
      $sth1 = $db->prepare("[dbo].[sp_datasync]");
      $result1 = $sth1->execute();

      $sth2 = $db->prepare("[dbo].[sp_datasync1]");
      $result2 = $sth2->execute();

      if(!$result1 || !$result2){
         $datastring = 'ERROR';
      }else{
         $datastring = 0;
      }

      return $datastring;
  }

  public function exec_efast_overrides($db){
    $f_Data = array();
      $data = array();
      $sql = "SELECT * from tblOverrides order by trnDate desc";

      foreach ($db->query($sql) as $row) {
             $data["trnDate"] = $row["trnDate"];
             $data["oMobileNo"] = $row["oMobileNo"]; 
             $data["remarks"] = $row["remarks"]; 
             $data["SYNTAX"] = $row["SYNTAX"];
             $data["repliedMSG"] = $row["repliedMSG"];
             $data["status"] = $row["status"];
             $data["time"] = date("h:i", strtotime($row["trnDate"]));
             $f_Data[] = $data;
        }

        return $f_Data;
  }

  public function exec_count_holdoverrides($db_efast){
    $sql = "SELECT count(*) from tblOverrides";
        $result = $db->prepare($sql); 
        $result->execute();
        $override_rows = $result->fetchColumn(); 

        $sql2 = "SELECT count(*) from vHoldOrders";
        $result2 = $db_efast->prepare($sql2); 
        $result2->execute();
        $holdOverride_rows = $result2->fetchColumn();
      
        $resultData = array("overData" => $override_rows,
                      "holdOverData" => $holdOverride_rows);

        return $resultData;

  }

  public function holdoverride_lists($db_efast){
      $f_Data = array();
        $data = array();
        $sql = "SELECT * from vHoldOrders order by OrderDate desc";

        foreach ($db_efast->query($sql) as $row) {
             $data["Salesperson"] = $row["Salesperson"];
             $data["Customer"] = $row["Customer"]; 
             $data["CustomerName"] = $row["Customer"].' '.$row["CustomerName"]; 
             $data["SalesOrder"] = $row["SalesOrder"];
             $data["CustomerPoNumber"] = $row["CustomerPoNumber"];
             $data["OrderDate"] = date("Y-m-d", strtotime($row["OrderDate"]));
             $data["DaysLaps"] = $row["DaysLaps"];
             $data["LastOperator"] = strtoupper($row["LastOperator"]);
             $data["OrderValue"] = number_format($row["OrderValue"], 2);
             $f_Data[] = $data;
          }

         return $f_Data;
  }

  public function efast_getnumber($db){
    $sql = "SELECT distinct oMobileNo, remarks from tblOverrides";
        $stmt= $db->query($sql);
        $routeList= $stmt->fetchALL(PDO::FETCH_OBJ);

        return $routeList;
  }

  public function hold_overrides_inquiry($db_efast, $number, $SOnumber){
    $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
      [message], [timestamp]) Values (?, ?, ?, ?)");
      //(1,'$number','$SOnumber',getdate()
    $result = $sql->execute(1, $number, $SOnumber, getDate());
    //$result = $sql->execute();
        $datastring = '';
        if($result){
          $datastring = 1;
        }else{
          $datastring = 'error';
        }

        return $datastring;
  }

  public function hold_overrides_apporved($db_efast, $number, $SOnumber){
    $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
    [message], [timestamp]) Values (?, ?, ?, ?)");
    $result = $sql->execute(1, $number, $SOnumber, getDate());
        $datastring = '';
        if($result){
          $datastring = 1;
        }else{
          $datastring = 'error';
        }

        return $datastring;
  }

  public function inquiry_approver($db_efast, $number, $SOnumber){
    $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
      [message], [timestamp]) Values (?, ?, ?, ?)");
    $result = $sql->execute(1, $number, $SOnumber, getDate());
        
        $datastring = '';
        if($result){
          $datastring = 1;
        }else{
          $datastring = 'error';
        }

        return $datastring;
  }

  public function approver_approved($db_efast, $number, $SOnumber){
    $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
       [message], [timestamp]) Values (?, ?, ?, ?)");
    $result = $sql->execute([1, $number, $SOnumber, getDate()]);
        
        $datastring = '';
        if($result){
          $datastring = 1;
        }else{
          $datastring = 'error';
        }

        return $datastring;
  }

  public function insert_otp($db_efast, $OTP, $number){
    $sql = $db_efast->prepare("UPDATE tblClients set OTP='$OTP' WHERE cMobile='$number'");
        $result = $sql->execute();

        $datastring = '';
        if($result){
          $datastring = 1;
        }else{
          $datastring = 'error';
        }

        return $datastring;
  }

  public function setup_site_location($db, $siteZoom, $lat, $lng, $zipCode){
    $sql = $db->prepare("UPDATE [tblCompany] set [center] = ?, [latitude] = ?, [longitude] = ?, [ZIPCODE] = ?");
    $result = $sql->execute([$siteZoom, $lat, $lng, $zipCode]);

    $datastring = '';

    if($result){
        $datastring = 1;
    }else{
        $datastring = 'error';
    }

    return $datastring;
  }

  public function check_site_checkup($db){
    $sql = "SELECT count(longitude) as checker from tblCompany";
    $result= $db->query($sql);
    $res = $result->fetchColumn();
    return $res;
  }

  public function all_salesman_georeset($db){
    $sth = "SELECT mdName, mdCode, mdSalesmancode from tblUser order by mdCode";
        $result = array();
        $data = array();
        foreach ($db->query($sth) as $row) {
             $result["Salesman"] = $row["mdName"];
             $result["mdCode"] = $row["mdCode"];
             $result["mdSalesmancode"] = $row["mdSalesmancode"];
             $data[] = $result;
          }

        return $data;
  }

  public function exec_forward($db_efast, $number, $message){
    $sql = $db_efast->prepare("INSERT into [tblsmsOUTsmart_ONE] ([oDateTimeIn], [oMobileNo], 
      [oRepliedMSG]) Values (?, ?, ?)");
      $result = $sql->execute(getDate(),'$number', '$message');

      $datastring = '';

      if($result){
          $datastring = 1;
      }else{
          $datastring = 'error';
      }

      return $datastring;
  }

  public function get_so($db, $so){
    $left = 'left(right('.$so.',len('.$so.')';
    $charindex1 = '(charindex(" SO:",'.$so.') + 4))';
    $charindex2 = 'charindex(" ",right('.$so.',len('.$so.')';
    $charindex3 = '(charindex(" SO:",'.$so.') + 4)))-1)';

    $sql = $db->prepare("SELECT $left - $charindex1, $charindex2 - $charindex3");
    $result = $sql->execute();

    return $result;
  }

  public function loginViaPhone($db_efast, $phone){
     $sql = "SELECT * from tblClients 
              WHERE cMobile = '$phone' and cActive = 1"; 
        $result = $db_efast->prepare($sql); 
        $result2 = $db_efast->prepare($sql); 
        $result->execute(); 
        $result2->execute(); 
        $CustomerRes = $result2->fetch();
        $numRows = $result->fetchColumn(); 
        $AChecker = $CustomerRes['cApprover'];
        
       $datastring = '';
        if(!$numRows){
          $datastring = 0;
        }else{
           if($AChecker == '1' || $AChecker == '2' ||
               $AChecker == '3' || $AChecker == '4' ||
               $AChecker == '5'){
              $datastring = 'APPROVER';
            }else{
              $datastring = 'NOTAPPROVER';
            }
        }

        return $datastring;
  }

  public function check_otp($db_efast, $number, $OTP){
      $sql = "SELECT * from tblClients where cMobile = '$number' and OTP = '$OTP'";
        $result = $db_efast->prepare($sql); 
        $result2 = $db_efast->prepare($sql); 
        $result->execute(); 
        $result2->execute(); 
        $CustomerRes = $result2->fetch();
        $numRows = $result->fetchColumn(); 
        $AChecker = $CustomerRes['cApprover'];
        
        $datastring = '';
        if(!$numRows){
          $datastring = 0;
        }else{
           if($AChecker == '1' || $AChecker == '2' ||
               $AChecker == '3' || $AChecker == '4' ||
               $AChecker == '5'){
              $datastring = 'APPROVER';
            }else{
              $datastring = 'NOTAPPROVER';
            }
        }

        return $datastring;
  }

  public function get_salesman_maintenance_list($db){
    $sql = "SELECT CONCAT(mdSalesmancode, '_', mdName) AS sname,
      mdCode, contactCellNumber, mdUserCreated, eodNumber1, eodNumber2, mdPassword, mdLevel,
      customerLastDateReset, priceCode, mdColor, geoLocking, isGEOReset, siteCode, Password1, PreRouteCL, PostRouteCL, StockTakeCL, EOD, DefaultOrdType, stkRequired, stkList, calltime,
      loadingCap from tblUser order by mdCode";
      $stmt= $db->query($sql);
      $salemanList = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $salemanList;
  }

  public function get_salesman_maintenance_details($db, $mdCode){
     $sql = "SELECT CONCAT(mdSalesmancode, '_', mdName) AS sname,
      mdCode, contactCellNumber, mdUserCreated, eodNumber1, eodNumber2, mdPassword, mdLevel,
      customerLastDateReset, token, priceCode, mdColor, geoLocking, isGEOReset, siteCode, PreRouteCL, PostRouteCL, StockTakeCL, EOD, DefaultOrdType, stkRequired, stkList, calltime from tblUser where mdCode = '$mdCode'";
      $stmt= $db->query($sql);
      $salemanList = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $salemanList;
  }

  public function exec_update_salesman_maintenance($db, $geolocking, $mdpassword, $password1, $mdlevel, $eodNumber1, $eodNumber2, $contactcell, $color, $priceCode, $thumbnail, $defordsel, $stklist, $stkreq, $pre, $post, $stack, $oedcl, $mdCode, $calltime, $capacity, $otpdisabled){
    $sql = "UPDATE tblUser 
              SET stocktakecl = '$stack',
                   EOD = '$oedcl',
                   PreRouteCL = '$pre',
                   PostRouteCL = '$post',
                   geolocking = '$geolocking',
                   mdPassword = '$mdpassword',
                   mdLevel = '$mdlevel',
                   Password1 = '$password1',
                   eodNumber1 = '$eodNumber1',
                   eodNumber2 = '$eodNumber2',
                   contactCellNumber = '$contactcell',
                   mdColor = '$color',
                   priceCode = '$priceCode',
                   DefaultOrdType = '$defordsel',
                   stkRequired = '$stkreq',
                   stkList = '$stklist',
                   loadingCap = '$capacity',
				           calltime = '$calltime',
                   DisableOTP = '$otpdisabled'
              WHERE mdCode = '$mdCode'";
      $res = $db->prepare($sql); 
      $res->execute();  
      
      $datastring = '';

      if($res){
        $datastring = 1;
      }else{
        $datastring = 'ERROR';
      }

      return $datastring;
  }

  public function get_trn_salesman_type($db){

    $sql = "SELECT distinct trn_type from vTRNSummary";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $data;
  }

  public function get_trn_transaction_by_salesman_type($db, $trnType, $start, $end){

    $sql = "SELECT * from vtrnSummary where trn_type = '$trnType' and cast(txn_dt as date) between '$start'
    and '$end'";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $data;
  }

  public function get_salesman_inventory_valuation($db, $mdCode){

    $sql = "EXEC [sp_inventory_valuation] @mdCode='$mdCode'";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $data;
  }

  public function get_lastUpdated_inventory($db, $mdCode){

    $sql = "SELECT top 1 * from tblInventory where mdCode = '$mdCode'";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $data;
  }

  public function get_boreports_details($db, $startDate, $endDate){

       $sql = "EXEC [sp_tradereturns] @startDate = '$startDate', @endDate = '$endDate'";
       $stmt= $db->query($sql);
       $data = $stmt->fetchALL(PDO::FETCH_OBJ);

       return $data;
  }

  public function upload_salesman_image($site, $mdCode){
    $datastring = ''; 

    $target_dir = "img/salesman_".$site."/";
      $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
      $uploadOk = 1;
      $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

      $temp = explode(".", $_FILES["file"]["name"]);
      $newfilename = /*round(microtime(true))*/$mdCode. '.' . end($temp);
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            $datastring = "File is an image - " . $check["mime"] . ".";
            $uploadOk = 1;
        } else {
            $datastring = "File is not an image.";
            $uploadOk = 0;
        }

       // Check if file already exists
        if (file_exists($target_file)) {
          unlink($target_file);
            $datastring = "Image already Exists but updated.";
            $uploadOk = 1;
        }
        // Check file size
        if ($_FILES["fileToUpload"]["size"] > 500000) {
            $datastring = "Sorry, your file is too large.";
            $uploadOk = 0;
        }
        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif" ) {
            $datastring = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            $datastring = "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
        } else {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_dir . $newfilename.'jpg')) {
                $datastring = "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
            } else {
                $datastring = "Sorry, there was an error uploading your file.";
            }
        }

        return $datastring;
  }

  public function get_specific_salesman($db, $salesman){
    
    $sql = "SELECT * from vsellout where cast(deliverydate as date) = cast(getdate() as date) and mdCode = '$salesman'";
    $stmt= $db->query($sql);
    $transaction = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $transaction;
  }

  public function get_stockcard_data_open($db){
        $sql = "SELECT distinct
           a.mdCode, transDate, b.mdSalesmancode +' - '+b.mdName as salesmanrep, refNo, custCode, cast(datesend as date) as datesend, remarks,
           (select count(refNo) from tblStockCard WHERE refNo = a.refNo and transtype = 'ST' and rStat = 0 and isVerified = 0) as tQuantity,
           (select cast(sum(amount) as decimal(18, 2)) from tblStockCard WHERE refNo = a.refNo and transtype = 'ST' and rStat = 0 and isVerified = 0) as tamount
           from 
          tblStockCard a, tblUser b
         where
          transtype = 'ST' and rStat = 0 and isVerified != 1
          and a.mdCode = b.mdCode
          GROUP by 
          a.mdCode, refNo, custCode, datesend, remarks, mdSalesmancode, mdName, transDate
          ORDER BY
           datesend desc";
      //$stmt= $db->query($sql);
      //$transaction = $stmt->fetchALL(PDO::FETCH_OBJ);
       $transaction = array();
       foreach ($db->query($sql) as $row) {
              $data["mdCode"] = $row["mdCode"];
              $data["transDate"] = $row["transDate"]; 
              $data["salesmanrep"] = $row["salesmanrep"]; 
              $data["refNo"] = $row['refNo'];
              $data["custCode"] = $row['custCode'];
              $data["remarks"] = $row['remarks'];
              $data["tamount"] = number_format($row['tamount'], 2);
              $data["tQuantity"] = $row['tQuantity'];
             $transaction[] = $data;
          }
      return $transaction;
  }

  public function get_stockcard_data_verified($db){
      $sql = "SELECT distinct
           a.mdCode, transDate, b.mdSalesmancode +' - '+b.mdName as salesmanrep, refNo, custCode, cast(datesend as date) as datesend, remarks,
           (select count(refNo) from tblStockCard WHERE refNo = a.refNo and transtype = 'ST' and rStat = 0 and isVerified = 1) as tQuantity,
           (select cast(sum(amount) as decimal(18, 2)) from tblStockCard WHERE refNo = a.refNo and transtype = 'ST' and rStat = 0 and isVerified = 1) as tamount
           from 
          tblStockCard a, tblUser b
         where
          transtype = 'ST' and rStat = 0 and isVerified = 1
          and a.mdCode = b.mdCode
          GROUP by 
          a.mdCode, refNo, custCode, datesend, remarks, mdSalesmancode, mdName, transDate
          ORDER BY
           datesend desc";

      $transaction = array();
       foreach ($db->query($sql) as $row) {
              $data["mdCode"] = $row["mdCode"];
              $data["transDate"] = $row["transDate"]; 
              $data["salesmanrep"] = $row["salesmanrep"]; 
              $data["refNo"] = $row['refNo'];
              $data["custCode"] = $row['custCode'];
              $data["remarks"] = $row['remarks'];
              $data["tamount"] = number_format($row['tamount'], 2);
              $data["tQuantity"] = $row['tQuantity'];
             $transaction[] = $data;
          }

      return $transaction;
  }

  public function exec_stockcard_update_open($db, $mdCode, $stockCode, $refNo, $transDate){
      $sql = $db->prepare("UPDATE tblStockcard set isVerified = '1' WHERE refNo = '$refNo'
        and mdCode = '$mdCode'");//" and cast(transDate as date) = cast('$transDate' as date)");
      $result = $sql->execute();
      
      $datastring = '';
      if($result){
        $datastring = 1;
      }else{
        $datastring = 'error';
      }

      return $datastring;
  }

  public function exec_stockcard_update_verified($db, $mdCode, $stockCode, $refNo, $transDate){
      $sql = $db->prepare("UPDATE tblStockcard set rStat = '1' WHERE refNo = '$refNo'
        and mdCode = '$mdCode'"); //and cast(transDate sa date) = cast('$date' as date)");
      $result = $sql->execute();
      
      $datastring = '';
      if($result){
        $datastring = 1;
      }else{
        $datastring = 'error';
      }

      return $datastring;
  }

  public function get_stockCard_Details($db, $refNo){
    $sql = "SELECT [StockCode],
             [Description],
             [QTY(StockUOM)],
             [StockUOM],
             [QTY(OtherUom)],
             [OtherUom],
             [QTY(PCS)],
             [PC_Uom],
             [amount],
             custCode +' '+custName customer
        FROM vStockCard
        WHERE refNo = '$refNo'";

        $transaction = array();
       foreach ($db->query($sql) as $row) {
              $data["StockCode"] = $row["StockCode"];
              $data["Description"] = $row["Description"]; 
              $data["QTYStockUOM"] = $row["QTY(StockUOM)"]; 
              $data["StockUOM"] = $row['StockUOM'];
              $data["QTYOtherUom"] = $row['QTY(OtherUom)'];
              $data["OtherUom"] = $row['OtherUom'];
              $data["QTYPCS"] = $row['QTY(PCS)'];
              $data["PC_Uom"] = $row['PC_Uom'];
              $data["customer"] = $row['customer'];
              $data["amount"] = number_format($row['amount'], 2);
             $transaction[] = $data;
          }

      return $transaction;
  }

  public function get_stockCard_Details_print($db, $refNo){
    $sql = "  SELECT [StockCode],
             [Description],
             [QTY(StockUOM)],
             [StockUOM],
             [QTY(OtherUom)],
             [OtherUom],
             [QTY(PCS)],
             [PC_Uom],
             [amount],
             custCode,
             custName,
             mdName,
             transDate,
             refNo,
             mdSalesmancode
              FROM vStockCard a, tblUser b
              WHERE refNo = '$refNo'
          and a.mdCode = b.mdCode";

        $transaction = array();
        $tcs = 0;
        $tib = 0;
        $tpc = 0;
        $tamount = 0;
       foreach ($db->query($sql) as $row) {
              $tcs += (float)$row['QTY(StockUOM)'];
              $tib += (float)$row['QTY(OtherUom)'];
              $tpc += (float)$row['QTY(PCS)'];
              $tamount += (float)$row['amount'];

              $data["StockCode"] = $row["StockCode"];
              $data["Description"] = $row["Description"]; 
              $data["QTYStockUOM"] = $row["QTY(StockUOM)"]; 
              $data["StockUOM"] = $row['StockUOM'];
              $data["QTYOtherUom"] = $row['QTY(OtherUom)'];
              $data["OtherUom"] = $row['OtherUom'];
              $data["QTYPCS"] = $row['QTY(PCS)'];
              $data["PC_Uom"] = $row['PC_Uom'];
              $data["custName"] = $row['custName'];
              $data["custCode"] = $row['custCode'];
              $data["salesman"] = $row['mdName'];
              $data["transDate"] = $row['transDate'];
              $data["refNo"] = $row['refNo'];
              $data["mdSalesmancode"] = $row['mdSalesmancode'];
              $data["amount"] = number_format($row['amount'], 2);
              $transaction[] = $data;
          }

        $result = array("body" => $transaction, 
                        "tcs" => $tcs,
                        "tib" => $tib, 
                        "tpc" => $tpc, 
                        "tamount" => $tamount);
      return $result;
  }

  public function get_salesreport_data($db, $start, $end){
    /*$sql = "SELECT [Salesman]
                    ,[Customer]
                    ,[Document #]
                    ,[Sales]
                    ,[geoLocation]
                    ,[deliveryDate]
                    ,[GEO Difference]
                    ,[CustLocation]
                    ,[latitude]
                    ,[longitude]
                    ,[deliveryDate]
                    ,[transactionID]
                    ,[#SKU]
                    ,[TIME BOUND Min.]
                    ,[Notation]
                    ,[upTime]
                FROM [dbo].[vSELLOUT] where CAST(deliveryDate as date) BETWEEN '$start' and '$end'";*/
        $sql = "EXEC [sp_salesreport] @startDate = '$start', @endDate='$end'";
        $f_Data = array();
        foreach ($db->query($sql, MYSQLI_USE_RESULT) as $row) {
              $data["Salesman"] = $row["Salesman"];
              $data["deliveryDate"] = $row["deliveryDate"];
              $data["Customer"] = $row["Customer"]; 
              $data["CustomerID"] = $row["CustomerID"];
              $data["DocumentNo"] = $row['Document #'];
              $data["SKU"] = $row['#SKU'];
              $data["TIMEBOUND"] = $row["TIME BOUND Min."];
              $data["upTime"] = $row["upTime"]; 
              $data["transactionID"] = $row["transactionID"];
              $data["GEODIfference"] = $row["GEO Difference"]; 
              $data["longitude"] = $row['longitude'];
              $data["latitude"] = $row['latitude'];
              $data["Notation"] = $row['Notation'];
              $data["salesmanCode"] = $row['mdSalesmanCode'];
              $data["Sales"] = $row['Sales'];
              $data["Status"] = $row['Status'];
              $data["Address"] = $row['address'];
              $data["ContactPerson"] = $row['Contact Person'];
             $f_Data[] = $data;
          }
          
        return $f_Data;
  }

  public function get_customertagging_data($db, $salesman){
    $sql = "SELECT concat(t3.mdSalesmanCode,' ',t3.mdName) Salesperson,t1.custCode,t1.custName,t3.contactCellNumber,t2.longitude, t2.latitude,(case when t2.longitude is null or t2.longitude = '0.000000' then 'N' else 'Y' end) [Tagging Completed],
    (case when t2.longitude is null or t2.longitude = '0.000000' then ' ' else concat('http://www.google.com/maps/place/',t2.latitude,',',t2.longitude) end) [Link]
    from tblCustomer t1, tblCustomerImage t2, tblUser t3
    where t1.custCode = t2.custCode and t1.mdCode = t3.mdCode
    order by t1.mdCode";
    $stmt= $db->query($sql);
    $chardata = $stmt->fetchALL(PDO::FETCH_OBJ);

    return $chardata;
  }

  public function customer_list_data($db){
    $sql = "SELECT concat(b.mdCode,'_',b.mdsalesmancode,'_',b.mdname) as salesman,
                   a.custcode,
                   a.custname,
                   a.address,
                   a.longitude,
                   a.latitude,
                   a.isLockOn,
                   a.lastPurchase,
                   a.mcpSchedule,
                   a.frequencyCategory,
                   a.contactCellNumber
               from tblCustomer a, tblUser b where a.mdCode = b.mdCode";
        $stmt= $db->query($sql);
        $custList = $stmt->fetchALL(PDO::FETCH_OBJ);

        return $custList;
  }

  public function dashboard_chart_data($db){
     $sql = "SELECT a.mdCode, b.mdCode as bmdcode, a.Type,
                   b.[Total Calls] as tcalls, b.[Productive Calls] as prod,
                   b.[Unproductive Calls] as unprod, cast(round(b.Sales, 2) as numeric(36,2)) as bsales, b.mdColor as mdColor,
                   b.sellingHours as sellH
                  from vSalesman a, vSalesSummary b
              where a.mdCode = left(b.mdCode, 4) and cast(deliveryDate as date) = cast(getdate() as date) ORDER BY a.type";
      $stmt= $db->query($sql);
      $chardata = $stmt->fetchALL(PDO::FETCH_OBJ);

      return $chardata;
  }

  public function stock_stake_reports($db, $startDate, $endDate, $salesman){
      //$sql = "exec sp_stocktake @startDate = '$startDate', @endDate = '$endDate'";
      $sql = "SELECT distinct cast(d.[TXN_DT] as date) as STKDATE,
          a.SLSMAN_CD+'_'+b.mdName as SALESMAN,
          c.custCode+'_'+c.custName as CUSTOMER,
          c.custType as CUSTOMERCHANNEL,
          a.TXN_NO as STAKENO,
          (select count(transactionID) FROM [O_TXN_STKPRD] as b where a.transactionID = b.transactionID ) as STKREQUIRED,
          (select count(PRD_QTY1) from [O_TXN_STKPRD] as b where a.transactionID = b.transactionID and PRD_QTY1 > 0) as STKAVAILABLE,
          (select count(PRD_QTY1) from [O_TXN_STKPRD] as b where a.transactionID = b.transactionID and PRD_QTY1 < 1) as STKOUTOFSTOCK
      from [dbo].[O_TXN_STKPRD] a, tblUser b, tblCustomer c, [O_TXN_STKHDR] d
      where a.SLSMAN_cD = b.mdSalesmancode and
      a.transactionID = d.transactionID and
      d.[CUST_CD] = c.custCode and 
      cast(d.[TXN_DT] as date) BETWEEN '$startDate' and '$endDate' and
      a.SLSMAN_CD = '$salesman'
      group by a.SLSMAN_CD, mdName, c.custCode, custName, a.TXN_NO, a.transactionID, d.[TXN_DT], c.custType";
      $res = array();
       foreach ($db->query($sql) as $row) {
             $data["STKDATE"] = $row["STKDATE"];
             $data["SALESMAN"] = $row["SALESMAN"];
             $data["CUSTOMER"] = $row["CUSTOMER"];
             $data["CUSTOMERCHANNEL"] = $row["CUSTOMERCHANNEL"];  
             $data["STAKENO"] = $row["STAKENO"]; 
             $data["STKREQUIRED"] = $row["STKREQUIRED"];
             $data["STKAVAILABLE"] = $row["STKAVAILABLE"];
             $data["STKOUTOFSTOCK"] = $row["STKOUTOFSTOCK"];
             $res[] = $data;
           }
        return $res;
  }

  public function stock_stake_reports_all($db, $startDate, $endDate){
    //$sql = "exec sp_stocktake @startDate = '$startDate', @endDate = '$endDate'";
    $sql = "SELECT distinct cast(d.[TXN_DT] as date) as STKDATE,
        a.SLSMAN_CD+'_'+b.mdName as SALESMAN,
        c.custCode+'_'+c.custName as CUSTOMER,
        c.custType as CUSTOMERCHANNEL,
        a.TXN_NO as STAKENO,
        (select count(transactionID) FROM [O_TXN_STKPRD] as b where a.transactionID = b.transactionID ) as STKREQUIRED,
        (select count(PRD_QTY1) from [O_TXN_STKPRD] as b where a.transactionID = b.transactionID and PRD_QTY1 > 0) as STKAVAILABLE,
        (select count(PRD_QTY1) from [O_TXN_STKPRD] as b where a.transactionID = b.transactionID and PRD_QTY1 < 1) as STKOUTOFSTOCK
    from [dbo].[O_TXN_STKPRD] a, tblUser b, tblCustomer c, [O_TXN_STKHDR] d
    where a.SLSMAN_cD = b.mdSalesmancode and
    a.transactionID = d.transactionID and
    d.[CUST_CD] = c.custCode and 
    cast(d.[TXN_DT] as date) BETWEEN '$startDate' and '$endDate'
    group by a.SLSMAN_CD, mdName, c.custCode, custName, a.TXN_NO, a.transactionID, d.[TXN_DT], c.custType";
    $res = array();
     foreach ($db->query($sql) as $row) {
           $data["STKDATE"] = $row["STKDATE"];
           $data["SALESMAN"] = $row["SALESMAN"];
           $data["CUSTOMER"] = $row["CUSTOMER"]; 
           $data["CUSTOMERCHANNEL"] = $row["CUSTOMERCHANNEL"]; 
           $data["STAKENO"] = $row["STAKENO"]; 
           $data["STKREQUIRED"] = $row["STKREQUIRED"];
           $data["STKAVAILABLE"] = $row["STKAVAILABLE"];
           $data["STKOUTOFSTOCK"] = $row["STKOUTOFSTOCK"];
           $res[] = $data;
         }
      return $res;
}

  public function prompt_list_data($db){
    $sql = "SELECT * from tblPrompt";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);

      return $data;
  }

  public function exec_prompt_delete($db, $promptID){
      $statement = "DELETE from [dbo].[tblPrompt] where cID = '$promptID'";
      $sql = $db->prepare($statement);
      
      $datastring = '';
      if($result){
        $datastring = 1;
      }else{
        $datastring = 'error';
      }

      return $datastring;
  }

  public function exec_prompt_insert($db, $alertType, $pType, $desc, $seq, $remarks){
      $status = 1;
      $statement = "INSERT INTO [tblPrompt] ([AlertType], [pType], [Description], [seq], [Remarks], [status], [lastUpdated]) Values ('$alertType', '$pType', '$desc', '$seq', '$remarks', '$status', cast(getdate() as date))";
      $sql = $db->prepare($statement);
      $result = $sql->execute();
      
      $datastring = '';
      if($result){
        $datastring = 1;
      }else{
        $datastring = 'error';
      }

      return $datastring;
  } 

  public function exec_update_checlist_status($db, $status, $cID){
    $sql = $db->prepare("UPDATE tblPrompt set status = '$status', lastUpdated = getDate() where cID = '$cID'");
      $result = $sql->execute();
      
      $datastring = '';
      if($result){
        $datastring = 1;
      }else{
        $datastring = 'error';
      }

      return $datastring;
  }

  public function exec_update_checlist($db, $ptype, $seq, $remarks, $cID){

      $sql = $db->prepare("UPDATE tblPrompt set ptype = '$ptype', seq = '$seq', Remarks = '$remarks', lastUpdated = getDate() where cID = '$cID'");
      $result = $sql->execute();
      
      $datastring = '';
      if($result){
        $datastring = 1;
      }else{
        $datastring = 'error';
      }

      return $datastring;
  }

  public function product_list_data($db){

      $sql = "SELECT [productID],
                      [Supplier],
                      [StockCode],
                      [Description],
                      [Brand],
                      [StockUom],
                      [AlternateUom],
                      [ConvFactAltUom],
                      [OtherUom],
                      [ConvFactOthUom],
                      [priceWithVat],
                      [priceWithVatM],
                      [lastUpdated], [shortName],
                      [templateCode],
                      [mustHave],
                      [syncstat],
                      [templateName],
                      [dates_tamp],
                      [time_stamp],
                      [buyingAccounts],
                      [barcodePC],
                      [barcodeCS],
                      [PrioSKU]
            ".//(select thumbnail from tblProductImage where StockCode = a.StockCode) as thumbnail
            "from tblProduct";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);

      return $data;
  }

   public function product_list_data_ajax($db, $sitename){
       $sql = "SELECT [productID],
                      [Supplier],
                      [StockCode],
                      [Description],
                      [Brand],
                      [StockUom],
                      [AlternateUom],
                      [ConvFactAltUom],
                      [OtherUom],
                      [ConvFactOthUom],
                      [priceWithVat],
                      [priceWithVatM],
                      [lastUpdated],
                      [shortName],
                      [templateCode],
                      [mustHave],
                      [syncstat],
                      [templateName],
                      [dates_tamp],
                      [time_stamp],
                      [buyingAccounts],
                      [barcodePC],
                      [barcodeCS],
                      [PrioSKU]
                  from tblproduct";
        $f_Data = array();
        foreach ($db->query($sql) as $row) {
              $data["stockWithImg"] = "<img src='upload/store-image/".$sitename."/".$row['StockCode'].".jpg' style='width: 40px; height:40px;' onerror='imgError(this)'>";
              $data["stockCode"] = $row["productID"];
              $data["supplier"] = $row["Supplier"]; 
              $data["StockCode"] = $row["StockCode"]; 
              $data["Description"] = $row['Description'];
              $data["brand"] = $row['Brand'];
              $data["stockuom"] = $row['Stock Uom'];
              $data["alternateuom"] = $row['Alternate Uom'];
              $data["confactaltuom"] = $row['ConvFactaAltUom'];
              $data["pricewithvat"] = number_format($row['priceWithVat'], 2);
              $data["pricewithvatm"] = number_format($row['priceWithVatM'], 2);
              $data["lastupdated"] = $row['lastUpdated'];
              $data["shortname"] = $row['shortName'];
              $data["templatecode"] = $row['templateCode'];
              $data["musthave"] = $row['mustHave'];
              $data["syncstat"] = $row['syncstat'];
              $data["templatename"] = $row['templateName'];
              $data["datetemp"] = $row['dates_tamp'];
              $data["timestamp"] = $row['time_stamp'];
              $data["buyingaccounts"] = $row['buyingAccounts'];
              $data["barcodepc"] = $row['barcodePC'];
              $data["barcodecs"] = $row['barcodeCS'];
              $data["priosku"] = $row['PrioSKU'];
             $f_Data[] = $data;
          }

      //$datatables = array('data' => $f_Data);
      return $f_Data;
  }
  public function get_product_image($db, $stockCode){
    $sql = "SELECT thumbnail from tblProductImage where StockCode = '$stockCode'";
        $stmt= $db->query($sql);
        $data = $stmt->fetchALL(PDO::FETCH_OBJ);
        
        return $data;
  }

  public function exec_update_product_priosku($db, $priosku, $stockCode){
    $sql = $db->prepare("UPDATE tblProduct set PrioSKU = '$priosku' where StockCode = '$stockCode'");
        $result = $sql->execute();

        $datastring = '';
        if($result){
          $datastring = 1;
        }else{
          $datastring = 'error';
        }

        return $datastring;
  }

  public function exec_update__product($db, $base64, $stockCode){
    $sql = $db->prepare("UPDATE tblProduct set thumbnail = '$base64' where StockCode = '$stockCode'");
        $result = $sql->execute();

        $datastring = '';
        if($result){
          $datastring = 1;
        }else{
          $datastring = 'error';
        }

        return $datastring;
  }

  public function unuploaded_sales_data($db, $start, $end){
    $sql = "EXEC sp_NeosExportUnUploaded @startDate = '$start', @endDate = '$end'";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);
    return $data;
  }

  public function allcustomer_data($db){
      $sql = "EXEC sp_JobberAccounts";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $data;
  }

  public function tagging_customer_list($db){
    $sql = "SELECT t1.custCode [Customer],t1.custName [Name],custName [ShortName],t3.mdName [Salesperson],contactPerson [Contact],t2.contactCellNumber [Telephone],address [SoldToAddr1], t2.[Latitude],t2.[Longitude],t1.[custType] [CustType],t2.[isLockOn]
    ,t1.custCode + ' ' + custName CustomerName
    ,t3.mdSalesmancode + '_' + t3.mdName salesmanAssign, t2.DefaultOrdType
    from tblCustomer t1, tblCustomerImage t2, tblUser t3
    where t1.custCode = t2.custCode and t1.mdCode = t3.mdCode and t3.DefaultOrdType = 'T'";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);
    return $data;
}

  public function insert_customer_jobber($db, $custCode, $custName, $contCell, $contPerson, $address, $lat, $long, $isLockOn, $custType){
       
    if($this->check_customer_inserted_jobber($db, $custCode) == 0){
      $sql = "INSERT into [tblCustomerJobber] ([custCode], [custName], [contactCellNumber], [contactPerson], [address], [latitude], [longitude], [isLockOn], [custType], [dateRegistered]) Values (?,?,?,?,?,?,?,?,?, getDate())";
      $result = $db->prepare($sql)->execute([$custCode, $custName, $contCell, $contPerson, $address, $lat, $long, $isLockOn, $custType]);
      $datastring = '';
      if($result){
         $datastring = 1;
      }else{
        $datastring = 'error';
      }

      return $datastring;
    }else{
      return 'jobready';
    }
  }

  public function check_customer_inserted_jobber($db, $custCode){
    $sql = "SELECT count(*) from tblCustomerJobber where custCode = '$custCode'";
    //$result = $sql->execute();
    $result= $db->query($sql);
    $res = $result->fetchColumn();
    return $res;
  }

  public function total_salesman_per_site($db){
    $stmt = $db->query("SELECT count(distinct mdCode) as salesmanpersite from vSELLOUT where [deliveryDate] >= DATEADD(day,-30,GETDATE())");
      $totalsalesmanpersite = $stmt->fetch();

      $sqlsales = $db->query("SELECT sum(Sales) as sales, count(mdCode) as salesman FROM vSalesSummary 
                 where CAST(deliveryDate as date) = cast(getdate() as date)");
      $res = $sqlsales->fetch();

      $result = array("sales" => number_format($res['sales'], 2),
                      "livesalesman" => $res['salesman'],
                      "totalsalesman" => $totalsalesmanpersite);
      return $result;
  }

  public function get_unprocessed_booking_data($db, $start, $end){
      $sql = "SELECT t1.transactionID, cast(TXN_DT as date) as TXN_DT, t1.SLSMAN_CD,t3.mdName, concat(t1.SLSMAN_CD,'_',t3.mdName) as salesman, t1.TXN_NO,CUST_CD,PRODUCT_CD,t4.Description,t2.TTL_AMT,REMARKS 
      from [dbo].[O_TXN_ORDHDR] t1,  [dbo].[O_TXN_ORDPRD] t2, tblUser t3,tblProduct t4 
      Where CUST_CD like 'TMP%' and t1.transactionID = t2.transactionID and t1.SLSMAN_CD = t3.mdSalesmancode and t2.PRODUCT_CD = t4.StockCode and  cast(TXN_DT as date) between '$start' and '$end' ORDER by t1.transactionID desc";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $data;
  }

  public function get_unprocessed_extruct_data($db, $start, $end){
      $sql = "SELECT 'T' OrderType,t1.transactionID, cast(TXN_DT as date) as TXN_DT, t1.SLSMAN_CD,t3.mdName, concat(t1.SLSMAN_CD,'_',t3.mdName) as salesman, t1.TXN_NO,CUST_CD,PRODUCT_CD,t4.Description,t2.TTL_AMT,REMARKS from [dbo].[O_TXN_VSLHDR] t1, [dbo].[O_TXN_VSLPRD] t2, tblUser t3,tblProduct t4 Where CUST_CD like 'TMP%' and t1.transactionID = t2.transactionID and t1.SLSMAN_CD = t3.mdSalesmancode and t2.PRODUCT_CD = t4.StockCode and  cast(TXN_DT as date) between '$start' and '$end' ORDER BY t1.transactionID desc";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $data;
  }

  public function get_all_customerlist_data($db, $mdCode){
      $getMdCode = $db->query("SELECT mdCode from tblUser where mdSalesmancode = '$mdCode'");
      $conv_mdCode = $getMdCode->fetchColumn();

      $sql = "SELECT custCode, custName from tblCustomer where custcode NOT LIKE 'TMP%' and mdCode = '$conv_mdCode'";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $data;
  }

  public function get_customerList_georeset($db){
      $sql = "SELECT custCode, custName from tblCustomer";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $data;
  }

  public function get_sfa_version($db){
      $sql = "SELECT custCode, custName from tblUser";
      $stmt= $db->query($sql);
      $data = $stmt->fetchALL(PDO::FETCH_OBJ);
      return $data;
  }

  public function exec_update_isExport($db, $transactionID){
    $sth1 = $db->prepare("UPDATE tblTransaction set isExport = '1' where transactionID = '$transactionID'");
    $res = $sth1->execute();
    return $res;
  }

  public function exec_customername_update($db, $newCustomerCode, $transactionID, $salesmanType){

    if($salesmanType == 'booking'){
      $sth1 = $db->prepare("UPDATE [O_TXN_ORDHDR] set CUST_CD = '$newCustomerCode' where transactionID = '$transactionID'");
      $result1 = $sth1->execute();
      return $result1;


      $sth3 = $db->prepare("UPDATE [O_TXN_VSLHDR] set CUST_CD = '$newCustomerCode' where transactionID = '$transactionID'");
      $result3 = $sth3->execute();
      return $result3;


      $sth5 = $db->prepare("UPDATE [O_TXN_RETHDR] set CUST_CD = '$newCustomerCode' where transactionID = '$transactionID'");
      $result5 = $sth5->execute();
      return $result5;


      $sth7 = $db->prepare("UPDATE [O_TXN_STKHDR] set CUST_CD = '$newCustomerCode' where transactionID = '$transactionID'");
      $result7 = $sth7->execute();
      return $result7;
    }else{

        $sth3 = $db->prepare("UPDATE [O_TXN_VSLHDR] set CUST_CD = '$newCustomerCode' where transactionID = '$transactionID'");
        $result3 = $sth3->execute();
        return $result3;


        $sth5 = $db->prepare("UPDATE [O_TXN_RETHDR] set CUST_CD = '$newCustomerCode' where transactionID = '$transactionID'");
        $result5 = $sth5->execute();
        return $result5;


        $sth7 = $db->prepare("UPDATE [O_TXN_STKHDR] set CUST_CD = '$newCustomerCode' where transactionID = '$transactionID'");
        $result7 = $sth7->execute();
        return $result7;
    }
   

    $datastring = '';
    if($result1 || $result3  || $result5 || $result7){
      $datastring = 1;
    }else{
      $datastring = 0;
    }

    return $datastring;
  }
  
  public function check_dupblicate_salesman($db_cloud, $mdCode){
    $sth = $db_cloud->query("SELECT count(*) as existing from tblSFAUsers where mdCode = '$mdCode'");
    $res = $sth->fetch();
    return $res['existing'];
  }

  public function get_comp_details($db){

    $sth = $db->query("SELECT Company, DIST_CD from tblCompany");
    $row = $sth->fetch();

    $res = array('company' => $row['Company'], 
            'distributorCode' => $row['DIST_CD']);
    return $res;
  }

  public function exec_insert_sfauser($db, $db_cloud, $mdCode){

    $copmDetails = $this->get_comp_details($db);
    $comp = $copmDetails['company'];
    $distcode = $copmDetails['distributorCode'];

    $sql = $db_cloud->prepare("INSERT into [tblSFAUsers]
                        (
                          mdCode,
                          DistributorCode,
                          DistributorName,
                          SiteCode,
                          SiteName,
                          AccountType,
                          isActive,
                          isHold
                        )
                        VALUES (
                          '$mdCode',
                          'NPI',
                          'Nestle Philippines',
                          '$distcode',
                          '$comp',
                          'MOBILE',
                          '0',
                          '1'
                        )");
    $result = $sql->execute();
    $datastring = '';
    if($result){
      $datastring = 1;
    }else{
      $datastring = 'error';
    }
  }

  public function exec_salesman_insert($db, $db_cloud, $mdName, $mdPassword, $contCellNum, $mdColor, $eod1, $eod2,$calltime, $priceCode, $defOrdType, $mdsalesmancode, $capacity){

    $convTime = $this->conv_time($db, $calltime);
    $userIndicator = $this->count_md_user($db);

    $mdCode = 0;
    if($userIndicator == 1){
      $mdCode = (int)$this->get_mdcode_series($db).'01';
    }else{
      $mdCode = (int)$this->get_mdCode_max($db);
    }

    $datastring = '';
    $checker = $this->check_dupblicate_salesman($db_cloud, $mdCode);
    if($checker == 1){
      $datastring = 'DUPLICATED';
    }else{
      $sql = $db->prepare("INSERT into [tblUser] 
                      ([mdCode],
                       [mdPassword],
                       [mdLevel], 
                       [mdUserCreated], 
                       [mdSalesmanCode], 
                       [mdName], 
                       [siteCode], 
                       [eodNumber1], 
                       [eodNumber2], 
                       [contactCellNumber], 
                       [mdColor], 
                       [baseGPSLong], 
                       [baseGPSLat],
                       [Password1], 
                       [EOD], 
                       [calltime], 
                       [priceCode], 
                       [DefaultOrdType],
                       [geolocking],
                       [loadingCap]) 
                Values ('$mdCode', 
                        '$mdPassword', 
                        '1', 
                        getDate(), 
                        '$mdsalesmancode', 
                        '$mdName', 'Y', '$eod1', '$eod2', '$contCellNum', '$mdColor', '123.850508', '9.671053', '1234', '1', '$convTime', '$priceCode', '$defOrdType', '100', '$capacity')");
        $result = $sql->execute();
        if($result){
          $datastring = 1;
          $this->exec_register_salesman($db, $mdsalesmancode, $mdCode);
          $this->exec_insert_sfauser($db, $db_cloud, $mdCode);
        }else{
          $datastring = 'error';
        }
    }

    return $datastring;
    //return $checker;
  }

  public function count_md_user($db){
    $sql = "SELECT count(*) as users from tblUser";
    $result = $db->query($sql);
    $res = $result->fetchColumn();
    return $res;
  }

  public function get_mdcode_series($db){
    $sql = "SELECT ZIPCODE from tblCompany";
    $result = $db->query($sql);
    $res = $result->fetchColumn();
    return $res;
  }

  public function get_priceCode($db){
    //$sql = "SELECT distinct priceCode from tblPrice";
    $sql = "EXEC sp_npipricecode";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);
    return $data;
  }

  public function conv_time($db, $timeString){
    $sql = "SELECT cast('$timeString' as time) as retime";
    $result= $db->query($sql);
    $res = $result->fetchColumn();
    return $res;
  }

  public function get_mdCode_max($db){
    $sql = "SELECT max(mdCode)+1 as maxMdCOde from tblUser where mdCode != '9999'";
    $result= $db->query($sql);
    $res = $result->fetchColumn();
    return $res;
  }

   public function get_mdSalesmsanCode_max($db){
    $sql = "SELECT max(RIGHT(mdSalesmanCode, LEN(mdSalesmanCode) - 1))+1 AS maxMdCOde from tblUser where mdSalesmancode != 'S02' and mdCode != '9999'";
    $result= $db->query($sql);
    $res = $result->fetchColumn();
    return $res;
  }

  public function get_userlist_salesman($db){
    $sql = "EXEC [sp_npisalesperson_list]";
    $res = array();
     foreach ($db->query($sql) as $row) {
           $data["mdsalesmancode"] = $row["Salesperson"];
           $data["name"] = $row["Name"];
           $data["type"] = $row["Type"];
           $data["warehouse"] =$row["Warehouse"];
           $data["group"] = $row["Group3"];
           $res[] = $data;
         }
      return $res;
  }

  public function dcr_data_report($db, $start, $end, $mdCode){
    $sql = "SELECT a.*, b.mdName, b.mdSalesmancode from tblCollection a, tblUser b
           WHERE a.mdCode = b.mdCode and cast(trnDate as date) between '$start' and '$end' and a.mdCode = '$mdCode'
           and a.transstat = 0";// and a.custCode = c.custCode";
    $res = array();
    foreach ($db->query($sql) as $row) {
          $data["salesman"] = $row["mdSalesmancode"].'_'.$row['mdName'];
          $data["ORNumber"] = $row["ORNumber"];
          $data["custCode"] = $row["custCode"];//.'_'.$row['custName'];
          $data["InvoiceNumber"] = $row["InvoiceNumber"];
          $data["InvoiceAmount"] =$row["InvoiceAmount"];
          $data["CheckDate"] = $row["CheckDate"];
          $data["BankCode"] =$row["BankCode"];
          $data["CheckNo"] = $row["CheckNo"];
          $data["Amount"] = $row["Amount"];
        
          if(strlen($row['CheckDate']) == 0){
            $data["CheckDate"] = '---';
          }
          
          if(strlen($row['BankCode']) == 0){
            $data["BankCode"] = '---';
          }
          
          if(strlen($row['CheckNo']) == 0 || $row['CheckNo'] == 0){
            $data["CheckNo"] = '---';
          }

          $res[] = $data;
        }
    return $res;
  }

  public function collection_salesman_data($db, $start, $end){
    $sql = "SELECT distinct b.mdName, b.mdSalesmancode, a.mdCode from tblCollection a WITH (NOLOCK), tblUser b WITH (NOLOCK)
    WHERE a.mdCode = b.mdCode and cast(trnDate as date) between '$start' and '$end'
    and a.transstat = 0";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);
    return $data;
  }

  public function stktake_salesman_data($db, $start, $end){
    $sql = "SELECT distinct a.SLSMAN_CD+'_'+b.mdName as SALESMAN,
          a.SLSMAN_CD as SALESMANCODE
          FROM [dbo].[O_TXN_STKPRD] a, tblUser b, [dbo].[O_TXN_STKHDR] c
          WHERE a.SLSMAN_cD = b.mdSalesmancode and a.transactionID = c.transactionID
          and cast(c.[TXN_DT] as date) between '$start' and '$end';";
    $stmt= $db->query($sql);
    $data = $stmt->fetchALL(PDO::FETCH_OBJ);
    return $data;
  }

  public function get_checkImage($db, $invoiceNo){
    $sql = "SELECT checkImg from tblCollection where InvoiceNumber = '$invoiceNo'";
    $stmt= $db->query($sql);
    $res = $stmt->fetchColumn();
    return $res;
  }
  
  public function collection_print_data($db, $start, $end, $mdCode){
    // $sql = "SELECT a.*, b.mdName, b.mdSalesmancode from tblCollection a, tblUser b
    // WHERE a.mdCode = b.mdCode and cast(trnDate as date) between '$start' and '$end' and a.mdCode = '$mdCode'";
    // $stmt= $db->query($sql);
    // $data = $stmt->fetchALL(PDO::FETCH_OBJ);
    // return $data;
    $sql = "SELECT a.*, b.mdName, b.mdSalesmancode from tblCollection a, tblUser b
    WHERE a.mdCode = b.mdCode and cast(trnDate as date) between '$start' and '$end' and a.mdCode = '$mdCode'
    and a.transstat = 0
    ORDER BY InvoiceNumber";// and a.custCode = c.custCode";
    $res = array();
    foreach ($db->query($sql) as $row) {
      $data["transactionID"] = $row["transactionID"];
      $data["trnDate"] = $row["trnDate"];
      $data["sendDate"] = $row["sendDate"];
      $data["mdCode"] = $row["mdCode"];
      $data["custCode"] = $row["custCode"];
      $data["pType"] = $row["pType"];
      $data["ORNumber"] = $row["ORNumber"];
      $data["InvoiceNumber"] = $row["InvoiceNumber"];
      $data["Amount"] = round($row["Amount"], 2);
      $data["BankCode"] =$row["BankCode"];
      $data["CheckNo"] = $row["CheckNo"];
      $data["CheckDate"] = $row["CheckDate"];
      $data["CNDNRef"] = $row["CNDNRef"];
      $data["CNDNAmount"] = round($row["CNDNAmount"], 2);
      $data["DocumentType"] = $row["DocumentType"];
      $data["InvoiceAmount"] = round($row["InvoiceAmount"], 2);
      $data["mdName"] = $row["mdName"];
      $data["mdSalesmancode"] = $row["mdSalesmancode"];
      
      if(strlen($row['CNDNRef']) == 0){
        $data["CNDNRef"] = '-';
      }

      if(strlen($row['CNDNAmount']) == 0){
        $data["CNDNAmount"] = '-';
      }

      if(strlen($row['CheckDate']) == 0){
        $data["CheckDate"] = '-';
      }

      if(strlen($row['CheckDate']) == 0){
        $data["CheckDate"] = '-';
      }
      
      if(strlen($row['BankCode']) == 0){
        $data["BankCode"] = '-';
      }
      
      if(strlen($row['CheckNo']) == 0 || $row['CheckNo'] == 0){
        $data["CheckNo"] = '-';
      }

      $res[] = $data;
    }
    return $res;
  }
  
}

?>  