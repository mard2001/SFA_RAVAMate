  <?php
include 'connectionString/taclobanConnection.php';
include 'connectionString/taclobanConnection_efast.php';
// include 'connectionString/ConnectionCloud.php';
try
 
{
    $database = new Connection_local();
    $db = $database->openConnection_local();

    // $databaseCloud = new Connection();
    // $db_cloud = $databaseCloud->openConnection();

    $efast_database= new Connection_efast();
    $db_efast = $efast_database->efastConnection_local();

  if($_POST['type'] == "SyncCustomer_bohol"){
   
    $sth = $db->prepare("[dbo].[sp_customer_insert]");
    $result = $sth->execute();
     echo $result;

  }else if($_POST['type'] == "SyncInventory_bohol"){
   
    $sth = $db->prepare("[dbo].[sp_inventory_insert] @mdCode='ALL'");
   // $mdCode = 'All';
    //$sth->bindParam(1 , $mdCode;
    $result = $sth->execute();
    echo $result;

  }else if($_POST['type'] == "changeMarkerColor_bohol"){
   
    $sth = $db->prepare("[dbo].[sp_ChangeMDColor]");
    $result = $sth->execute();
    echo $result;

  }else if($_GET['type'] == 'displayPreviousDash'){
    $date = $_GET['dateSelected'];
    $data = array();
    $f_Data = array();
    $sql = "SELECT upper(format(cast(deliverydate as date), 'ddd')) as nameofdate,
              substring(Customer, 1, CHARINDEX(' ', Customer)) as CustomerID,
              mdCode,
              Salesman,
              Customer,
              longitude,
              latitude,
              Sales,
              deliveryDate,
              mdColor,
              [Document #],
              transCount,
              [TIME BOUND Min.],
              [upTime],
              [#SKU]
            from tblSellOutCur
            where cast(deliverydate as date) = '$date' and site = 'TAC'";
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
         $data["daysToText"] = $row["nameofdate"];
         //$data["address"] = $row["address"];
         $f_Data[] = $data;
      }
      echo json_encode($f_Data);
  }else if($_GET['type'] == 'displayPreviousDash_tableDetails'){
    $date = $_GET['dateSelected'];
    $sql = "SELECT Site,mdCode,Salesman,tcalls,pCalls,unpCalls,tsales,tSellHour,
                (select distinct mdColor from tblSalesSummary t1 where t1.Site = x1.Site and left(t1.mdCode,4) = x1.mdCode) as mdColor
              from (
                select Site,left(mdCode,4) as mdCode,right(mdCode,len(mdCode) - 5) as Salesman,sum([Total Calls]) as tcalls,sum([Productive Calls]) as pCalls,
                sum([Unproductive Calls]) as unpCalls,
                sum(Sales) as tsales,sum(sellingHours) as tSellHour
                from tblSalesSummary where cast(deliveryDate as date) = '$date'
                group by Site,mdCode
              ) x1 where site = 'TAC'";
      foreach ($db_cloud->query($sql) as $row) {
           echo "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["mdCode"]."\")'>
                 <td width='40%' class='showSalesman'><span class='glyphicon glyphicon-map-marker' style='color:".$row['mdColor']."'></span> ".$row['mdCode'].'_'.$row['Salesman']."</td>
                 <td width='15%' class='text-center'>".$row['pCalls'].'/'.$row['tcalls']."</td>
                 <td width='10%' class='text-center'>".$row['unpCalls']."</td>
                 <td width='15%' class='text-center'>".$row['tSellHour']."</td>
                 <td width='9%' class='text-right' id='rowDataSd'>".number_format($row['tsales'], 2)."</td>
                 </tr>";
            }//foreach
  }else if($_GET['type'] == "displayPreviousDash_totalSales"){
      $date = $_GET['dateSelected'];
      $sales = 0;
      $Countsalesman = 0;
      $sql = $db->query("SELECT sum(Sales) as sales, count(mdCode) as salesman FROM vSalesSummary 
               where CAST(deliveryDate as date) = '$date'");
      $res = $sql->fetch();

      $result = array("sales" => number_format($res['sales'], 2),
                      "salesmanCount" => $res['salesman']);
      echo json_encode($result);

  }else if($_POST['type'] == "dashBoardData_bohol"){
      date_default_timezone_set('Asia/Manila');
      $date = date('Y-m-d');
      $sql = "SELECT a.mdCode, b.mdCode as bmdcode, a.Type,
                 b.[Total Calls] as tcalls, b.[Productive Calls] as prod,
                 b.[Unproductive Calls] as unprod, b.Sales as bsales, b.mdColor as mdColor,
                 b.sellingHours as sellH
                from vSalesman a, vSalesSummary b
            where a.mdCode = left(b.mdCode, 4) and cast(deliveryDate as date) = '$date' ORDER BY a.type";

    $output = array();
    $result = $db->prepare($sql);
    $result->execute(); 
    $number_of_rows = $result->fetchColumn();

    if($number_of_rows == 0){
      echo "<tr>
              <td>NO DATA TO SHOW AS OF THIS TIME!</td>
            </tr>";
    }else{
        foreach ($db->query($sql) as $row) {
          echo "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["bmdcode"]."\")'>
               <td width='45%' class='showSalesman' data-toggle='tooltip' data-placement='right' title='Double click to view location!'><span class='fas fa-map-marker' style='color:".$row['mdColor']."'></span> ".$row['bmdcode']."</td>
               <td width='20%' class='text-center'>".$row['prod'].'/'.$row['tcalls']."</td>
               <td width='10%' class='text-left'>".$row['unprod']."</td>
               <td width='13%' class='text-center'>".$row['sellH']."</td>
               <td width='9%' class='text-right'>".number_format($row['bsales'], 2)."</td>
               </tr>";
          }//foreach
          //echo json_encode($output);
    }

  }else if($_GET['type'] == 'previous_getLate'){
    $date = $_GET['dateSelected'];
    $sql = "SELECT a.mdCode, b.mdName, concat(c.custCode,' ',c.custName) as custName, b.mdColor, b.contactCellNumber, concat(a.latitude, ' ', a.longitude) as customerLatLng, a.deliveryDate, convert(varchar(15), cast(deliveryDate as time), 100) as deviation,
      datepart(hour, deliveryDate) as indiHour, datepart(Minute, deliveryDate) as indiMinute, cast(deliveryDate as date) as date
      from tblTransaction as a, tblUser as b, tblCustomer as c where a.mdCode = b.mdCode and 
      cast(deliveryDate as date) = '$date' and SUBSTRING(refno, 1, 2) = 1 
      and transstat = 0 and c.custCode = a.custCode order by deliveryDate";
     $output = array();
       foreach ($db->query($sql) as $row) {
          $time = date("g:i:s A",strtotime($row['deliveryDate']));
          $data['mdCode'] = $row['mdCode'];
          $data['salesmanName'] = $row['mdCode'].'_'.$row['mdName'];
          $data['alert'] = '';
          $data['Description'] = '';
          $data['refNo'] = '';
          $data['TransTime'] = '';
          $data['deliveryDate'] = $time;
          $data['transactionID'] = '';
          $data['mobileNo'] = $row['contactCellNumber'];
          $data['dateTime'] = $row['deliveryDate'];
          $data['deviation'] = $row['deviation'];
          $data['customerLoc'] = $row['custName'];
          $data['latLng'] = $row['customerLatLng'];
          $data['indiMinute'] = $row['indiMinute'];
          $data['indiHour'] = $row['indiHour'];
          $output[] = $data;
        }//foreach
      echo json_encode($output);
  }else if($_GET['type'] == "displayCustImage"){
    $custID = $_GET['custID'];
    $sql = $db->query("SELECT storeImage, storeImage2 from tblCustomerImage where custCode = '$custID'");
    $res = $sql->fetch();
    $image = $res['storeImage'];

    $result = array("storeImage" => $res['storeImage'],
                    "storeImage2" => $res['storeImage2']);
    echo json_encode($result);

  }else if($_POST['type'] == "customerMappingTableData"){
      $current_date = date("Y-m-d");
      date_default_timezone_set('Asia/Manila');
      $newdate = date('Y-m-d');
      $salesman = $_POST['salesman'];
      $mcp = $_POST['mcp'];
      foreach($salesman as $resultRow){
        $sql = "SELECT custCode, custName, address, contactCellNumber from tblCustomer where mdCode = '$resultRow' and mcpDay = '$mcp' and contactPerson != 'na'";
        foreach ($db->query($sql) as $row) {
           echo '<tr class="salesmanName" onclick="showCustomer(\''.$row["custCode"].'\')">
               <td class="showSalesman" data-toggle="tooltip" class="class="img-thumbnail" customerImage" data-placement="right" title="Double click to view location!"><img src="data:image/jpeg;base64,'.$row["storeImage"].'" onError="defaultStore(this)"/></td>
                <td class="ellipsisCustAddress"><span class="details ellipsisCustName">Store: '.$row["custCode"].' '.$row["custName"].'</span><br/><span class="details2 ellipsisCustAddress">Address: '.$row["address"].'</span><br/><span>Contact #: '.$row["contactCellNumber"].'</span></td>
               </tr>';
          }//foreach
      }

  }else if($_GET['type'] == "customerMappingData"){
    $salesman = $_GET['salesman'];
    $mcp = $_GET['mcp'];
    $resultData = [];
     foreach($salesman as $resultRow){
     $sql = "SELECT custCode, custName, latitude, longitude from tblCustomer where mdCode = '$resultRow' and mcpDay = '$mcp' and contactPerson != 'na' and latitude != '0.0' and longitude != '0.0'";
       $result = array();
       $data = array();
        foreach ($db->query($sql) as $row) {
           $result["storeImage1"] = $row["storeImage"];
           $result["storeImage2"] = $row["storeImage2"];
           $result["longitude"] = $row["longitude"];
           $result["latitude"] = $row["latitude"];
           $result["custCode"] = $row["custCode"];
           $result["custName"] = $row["custName"];
           $resultData[] = $result;
      
        }
      }
       echo json_encode($resultData);

  }else if($_GET['type'] == 'getTransactionDetails'){
    $transactionID = $_GET['transactionID'];
    $sql = "SELECT stockCode, Description, quantity, amount, thumbnail from vItemDetails where transactionID = '$transactionID'";

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
                          <td class='text-right'>".number_format($row['amount'],2)."</td>
                      </tr>";
          } 

      $tableOutput .= "</tbody></table>";
      echo $tableOutput;

  }else if($_GET['type'] == "dashBoardData_product"){
      $current_date = date("Y-m-d");
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
            }//foreach

            /*$footer = "<tr class='footer'>
                            <td><strong>TOTAL</strong></td>
                            <td class='text-right'>".number_format($grandTotal, 2)."</td>
                            <td class='text-right'>".number_format($percentage, 2)."%</td>
                        </tr>";*/
              $footer = '<div>TOTAL<span class="grandTotal">'.number_format($grandTotal, 2).'</span><span class="pull-right">'.number_format($percentage, 2).'%</span></div>';
            //echo $content;
              $data = array('tableDetails' => $content, 
                           'footerDetails' => $footer);
             echo json_encode($data);
  }else if($_POST['type'] == "getProduct"){
       $productName = ltrim($_POST['productName']);
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
       echo json_encode($data);

  }else if($_GET['type'] == "getAllProduct"){
       $from = $_GET['start'];
       $to = $_GET['end'];
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
       echo json_encode($data);

  }else if($_GET['type'] == "getAllProduct_digiMapFilter"){
       $from = $_GET['start'];
       $to = $_GET['end'];
       $sql = "SELECT distinct brand, BrandColor, longitude, latitude from vCategorySalesCur";//where cast(deliveryDate as date) between '$from' and '$to' and Site='BOH'";
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

  }else if($_GET['type'] == "dashBoardData_product_digiMapFilter"){
       $from = $_GET['start'];
       $to = $_GET['end'];
       $sql = "SELECT BrandColor, brand, sum(totalAmount) as tAmount
       from vCategorySalesCur where cast(deliveryDate as date) between '$from' and '$to' and Site='TAC'
        group by Brand, BrandColor order by tAmount";
       $sth = $db_cloud->query("SELECT top 1 sum(totalAmount) as grandT from vCategorySalesCur where cast(deliveryDate as date) between '$from' and '$to' and Site='TAC'");
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

            /*$footer = "<tr class='footer'>
                            <td><strong>TOTAL</strong></td>
                            <td class='text-right'>".number_format($grandTotal, 2)."</td>
                            <td class='text-right'>".number_format($percentage, 2)."%</td>
                        </tr>";*/
              $footer = '<div>TOTAL<span class="grandTotal">'.number_format($grandTotal, 2).'</span><span class="pull-right">'.number_format($percentage, 2).'%</span></div>';
            //echo $content;
              $data = array( 'tableDetails' => $content, 
                           'footerDetails' => $footer);
             echo json_encode($data);
  }else if($_POST['type'] == "getProduct_digiMapFilter"){
       $from = $_POST['start'];
       $to = $_POST['end'];
       $productName = ltrim($_POST['productName']);
       $sql = "SELECT * from vCategorySalesCur where cast(deliveryDate as date) between '$from' and '$to' and
       Brand = '$productName' and Site='TAC'";
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

  }else if($_POST['type'] == "dashBoardData_bohol_filter"){
    $salesman = $_POST['resultSalesman'];
    $startDate = $_POST['start'];
    $endDate = $_POST['end'];
    $checker = false;
    $result = array();
    $data = array();
      foreach($salesman as $resultRow){
        $sql = "Select Site,mdCode,Salesman,tcalls,pCalls,unpCalls,tsales,tSellHour,
                (select distinct mdColor from tblSalesSummary t1 where t1.Site = x1.Site and left(t1.mdCode,4) = x1.mdCode) as mdColor
              from (
                select Site,left(mdCode,4) as mdCode,right(mdCode,len(mdCode) - 5) as Salesman,sum([Total Calls]) as tcalls,sum([Productive Calls]) as pCalls,
                sum([Unproductive Calls]) as unpCalls,
                sum(Sales) as tsales,sum(sellingHours) as tSellHour
                from tblSalesSummary where deliveryDate between '$startDate' and '$endDate'
                group by Site,mdCode
              ) x1 where mdCode = '$resultRow' and site = 'TAC'";

          foreach ($db_cloud->query($sql) as $row) {
                 echo "<tr class='salesmanName'>
                       <td width='40%' class='showSalesman' onclick='hitme()'><span class='glyphicon glyphicon-map-marker' style='color:".$row['mdColor']."'></span> ".$row['mdCode'].'_'.$row['Salesman']."</td>
                       <td width='15%' class='text-center'>".$row['pCalls'].'/'.$row['tcalls']."</td>
                       <td width='10%' class='text-center'>".$row['unpCalls']."</td>
                       <td width='15%' class='text-center'>".$row['tSellHour']."</td>
                       <td width='9%' class='text-right' id='rowDataSd'>".number_format($row['tsales'], 2)."</td>
                       </tr>";
            }//foreach
            //echo json_encode($data);
    }//main for each

  }else if($_GET['type'] == 'get_all_salesman_bohol'){
       $sth = "SELECT mdCode, concat(mdCode, '_', mdName) as salesman from tblUser";
       $result = array();
       $data = array();
      /*foreach ($db_cloud->query($sth) as $row) {
           $result["Salesman"] = $row["Salesman"];
           $result["mdCode"] = $row["mdCode"];
           $data[] = $result;
        }*/
        foreach ($db->query($sth) as $row) {
           $result["Salesman"] = $row["salesman"];
           $result["mdCode"] = $row["mdCode"];
           $data[] = $result;
        }

       echo json_encode($data);

  }else if($_GET['type'] == 'get_salesman_distance_bohol'){
       $sth = "SELECT distinct Salesman, longitude, latitude from vSELLOUT";
       $result = array();
       $data = array();
      foreach ($db->query($sth) as $row) {
           $result["Salesman"] = $row["Salesman"];
           $result["longitude"] = $row["longitude"];
           $result["latitude"] = $row["latitude"];
           $data[] = $result;
        }
       echo json_encode($data);

  }else if($_GET['type'] == 'get_all_color_bohol'){
       $sth = "SELECT distinct Salesman, mdColor from vSELLOUT";
       $result = array();
       $data = array();
      foreach ($db->query($sth) as $row) {
           $result["Salesman"] = $row["Salesman"];
           $result["mdColor"] = $row["mdColor"];
           $data[] = $result;
        }
       echo json_encode($data);

  }else if($_POST['type'] == "dashBoard_marker_bohol"){
       $current_date = date("Y-m-d");
       date_default_timezone_set('Asia/Manila');
       $newdate = date('Y-m-d');
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
                 FROM [dbo].[vSELLOUT] WHERE CAST(deliveryDate as date) = '$newdate'
                 ORDER BY Salesman";
       $f_Data = array();
       $data = array();

     
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
        echo json_encode($f_Data);


  }else if($_POST['type'] == "dashBoard_totalSales_bohol"){
       $current_date = date("Y-m-d");
       date_default_timezone_set('Asia/Manila');
       $newdate = date('Y-m-d');
       $sth = "SELECT SUM(Sales) as total, count(mdCode) as salesman FROM vSalesSummary 
               where CAST(deliveryDate as date) = '$newdate'";
       $result = array();
       $data = array();
      foreach ($db->query($sth) as $row) {
           $result["total"] = $row["total"]; 
           $result["salesman"] = $row["salesman"];
           $data[] = $result;
        }
       echo json_encode($data);

  }else if($_POST['type'] == "dashBoard_totalSales_bohol_filter"){
       $startDate = $_POST['start'];
       $endDate = $_POST['end'];
       $salesman = $_POST['salesman'];
       $sales = 0;
       $Countsalesman = 0;
        foreach($salesman as $resultRow){
           
           $sth = "SELECT Sales FROM vSalesSummary 
               where  left(mdCode, 4) = '$resultRow' and CAST(deliveryDate as date) BETWEEN '$startDate' and '$endDate'";
           $result = array();
           $data = array();
           $Countsalesman++;
          foreach ($db->query($sth) as $row) {

               $sales += $row['Sales'];
            }
        }
       
         $variable = array( 'sales' => number_format($sales,2), 
                           'salesmanCount' => "$Countsalesman" );
       echo json_encode($variable);

  }else if($_GET["type"] == "view_salesmanLocation_bohol"){
     $salesman = $_GET['resultSalesman'];
      //$salesman = str_replace('+', ' ', $_GET['resultSalesman']);
      $startDate = $_GET['start'];
      $endDate = $_GET['end'];
      $checker = false;
      $data = array();
      $f_Data = array();

      foreach($salesman as $resultRow){
        $sql = "SELECT *
                FROM tblSellOutCur where mdCode = '$resultRow' AND CAST(deliveryDate as date) BETWEEN '$startDate' and '$endDate' and site = 'TAC'";
          /*$result = $db->prepare($sql);
          $result->execute(); 
          $number_of_rows = $result->fetchColumn();*/
          
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
      echo json_encode($f_Data);

  }else if($_GET['type'] == 'generate_graphical_report'){
     $current_date = date("Y-m-d");
     $sql = "SELECT  [mdCode]
                    ,[Total Calls]
                    ,mdCode
                    ,[Productive Calls]
                    ,[Unproductive Calls]
                    ,[Sales]
                    ,[mdColor]
                    ,[sellingHours]
               FROM [dbo].[vSalesSummary]
             where CAST(deliveryDate as date) BETWEEN '$current_date' and '$current_date'";

    $output = array();
    $result = $db->prepare($sql);
    $result->execute(); 
    $number_of_rows = $result->fetchColumn();
       foreach ($db->query($sql) as $row) {
          $data['mdCode'] = substr($row['mdCode'], 0, 4);
          $data['sales'] = round($row['Sales']);
          $data['mdColor'] = $row['mdColor'];
          //$data['salesmanName'] = substr($row['mdCode'], 5);
          $data['salesmanName'] = $row['mdCode'];
          $output[] = $data;
        }//foreach
          echo json_encode($output);
  }else if($_GET['type'] == 'generate_graphical_report_page'){
     //$current_date = date("Y-m-d");
     $startDate = $_GET['startDate'];
     $endDate = $_GET['endDate'];
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
          echo json_encode($output);
  }else if($_POST['type'] == "dashBoardData_bohol_filter_graph"){
   $salesman = $_POST['resultSalesman'];
    $startDate = $_POST['start'];
    $endDate = $_POST['end'];
    $checker = false;
    $result = array();
    $data = array();
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
                            ,vSalesSummary.sellingHours as sellHours
                         FROM vSELLOUT join vSalesSummary 
                         on left(vSalesSummary.mdCode, 4) = vSELLOUT.mdCode
                         WHERE vSELLOUT.mdCode = '$resultRow'
                         AND CAST(vSalesSummary.deliveryDate as date) BETWEEN '$startDate' and '$endDate'
                    ) x1 Group by Salesman, mdColor, mdCode";

          foreach ($db->query($sql) as $row) {
                  echo "<tr class='salesmanName'>
                       <td width='40%' class='showSalesman'><span class='glyphicon glyphicon-map-marker' style='color:".$row['mdColor']."'></span> ".$row['mdCode'].'_'.$row['Salesman']."</td>
                       <td width='15%' class='text-center'>".$row['tcalls']."</td>
                       <td width='5%' class='text-center'>".$row['pCalls']."</td>
                       <td width='10%' class='text-center'>".$row['unpCalls']."</td>
                       <td width='15%' class='text-center'>".$row['tSellHour']."</td>
                       <td width='9%' class='text-right' id='rowDataSd'>".number_format($row['tsales'], 2)."</td>
                       </tr>";
                
            }//foreach
            //echo json_encode($data);
    }//main for each

  }else if($_GET['type'] == 'getLate'){
      date_default_timezone_set('Asia/Manila');
      $newdate = date('Y-m-d');
     $current_date = date("Y-m-d");
     $sql = "SELECT * from vDeviation order by deliveryDate";
     $output = array();
       foreach ($db->query($sql) as $row) {
          $time = date("g:i:s A",strtotime($row['deliveryDate']));
          $data['mdCode'] = $row['mdCode'];
          $data['salesmanName'] = $row['mdCode'].'_'.$row['salesmanName'];
          $data['alert'] = $row['alert'];
          $data['Description'] = $row['Description'];
          $data['refNo'] = $row['refNo'];
          $data['TransTime'] = $row['TransTime'];
          $data['deliveryDate'] = $time;
          $data['transactionID'] = $row['transactionID'];
          $data['mobileNo'] = $row['mobileNo'];
          //$data['mdColor'] = $row['mdColor'];
          $data['customerLoc'] = $row['CustomerName'];
          $data['latLng'] = $row['Latitude'].' '.$row['Longitude'];
          $output[] = $data;
        }//foreach
      echo json_encode($output);
  }else if($_GET['type'] == 'getLateBySalesmanCat'){
    date_default_timezone_set('Asia/Manila');
    $newdate = date('Y-m-d');
    $salesmanCat = $_GET['salesmanCat'];
    
    if($salesmanCat == 'All'){
     $sql = "SELECT * from vSalesman a, vDeviation b
          where b.mdCode = a.mdCode
          ORDER BY b.deliveryDate";
    }else{
      $sql = "SELECT * from vSalesman a, vDeviation b
            where a.type = '$salesmanCat'
            and b.mdCode = a.mdCode
            ORDER BY b.deliveryDate";
    }
     $output = array();
     foreach ($db->query($sql) as $row) {
        $time = date("g:i:s A",strtotime($row['deliveryDate']));
        $data['mdCode'] = $row['mdCode'];
        $data['salesmanName'] = $row['mdCode'].'_'.$row['salesmanName'];
        $data['alert'] = $row['alert'];
        $data['Description'] = $row['Description'];
        $data['refNo'] = $row['refNo'];
        $data['TransTime'] = $row['TransTime'];
        $data['deliveryDate'] = $time;
        $data['transactionID'] = $row['transactionID'];
        $data['mobileNo'] = $row['mobileNo'];
        //$data['mdColor'] = $row['mdColor'];
        $data['customerLoc'] = $row['CustomerName'];
        $data['latLng'] = $row['Latitude'].' '.$row['Longitude'];
        $output[] = $data;
      
      }//foreach
      echo json_encode($output);
  }else if($_POST['type'] == 'dsr_salesmanLoad'){
       $sth = "SELECT distinct Salesman, mdCode from vSELLOUT";
       $result = array();
       $data = array();
          foreach ($db->query($sth) as $row) {
               $result["Salesman"] = $row["Salesman"];
               $result["mdCode"] = $row["mdCode"];
               $data[] = $result;
            }
       echo json_encode($data);
  }else if($_GET['type'] == 'dsr_data'){
    $salesman = $_GET['dsrSalesman'];
    $date = $_GET['dsrDate'];

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
             where vSELLOUT.mdCode = '1008' and CAST(vSELLOUT.deliveryDate as date) = '2019-06-05'
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
                           <td class='sales'>".number_format($row['Sales'], 2)."</td>
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
    echo json_encode($result);

  }else if($_GET['type'] == 'dsr_average'){
    $salesman = $_GET['salesman'];
    $date = $_GET['date'];
    $sql = $db->query("SELECT sum(cast(totalAmount as float)) as average from tblTransaction where mdCode = '$salesman' and cast(deliveryDate as date) = '$date'");
    $result = $sql->fetch();
    echo json_encode($result);

  }else if($_GET['type'] == 'todayProductive'){
    $todayProductiveCall =  array();
    $salesman = $_GET['salesman'];
    $date =  date('N', strtotime($_GET['date']));

    $actualDate = $_GET['date'];

    $sqlMcpDay = $db->query("SELECT count(custCode) as target from [dbo].[tblCustomer] 
            where mcpday = '$date' and mdcode = '$salesman' and custCode NOT LIKE 'TMP%'");
    $resultTarget = $sqlMcpDay->fetch();

    $sqlActual = $db->query("SELECT count(sales) as actual from vSELLOUT
                 WHERE cast(deliveryDate as date) = '$actualDate' and mdCode = '$salesman'");
    $resultActual = $sqlActual->fetch();

    $todayProductiveCall = array($resultTarget, $resultActual );
    echo json_encode($todayProductiveCall);

  }else if($_GET['type'] == 'sellingDays'){

      $salesman = $_GET['salesman'];
      $date = new DateTime($_GET['date']);
      $actualDate = $date->format('d');
      $firstday = $date->modify('first day of this month');
      $getMonth = $firstday->format('Y-m-d');

      $result = array();
      
       $start = new DateTime($getMonth);
       $end = new DateTime($_GET['date']);
       $days = $start->diff($end, true)->days;

       $sundays = intval($days / 7) + ($start->format('N') + $days % 7 >= 7);
       $actualDays = (int)$actualDate - (int)$sundays;

       $numericMonth = $_GET['numericMonth'];

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


      echo json_encode($result);

  }else if($_GET['type'] == 'monthToDatePRD'){
      $salesman = $_GET['salesman'];
      $date = new DateTime($_GET['date']);
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
       echo json_encode($result);


  }else if($_GET['type'] == 'jobberRequest'){
    $salesman = $_GET['salesman'];
    $date = $_GET['date'];

    $sql = "SELECT * from [vStockCard] where cast(transDate as date) = '2018-08-07' and mdCode = '5020'";

      foreach ($db->query($sql) as $row) {
                echo "<tr>
                            <td class='text-left'>".$row['StockCode'].' - '.$row['Description']."</td>
                            <td>".$row['QTY(StockUOM)']."</td>
                            <td>".$row['QTY(PCS)']."</td>
                            <td></td>
                     </tr>";
          }//foreach


  }else if($_POST['type'] == "dashBoard_territoryGeo"){
       $current_date = date("Y-m-d");
       date_default_timezone_set('Asia/Manila');
       $newdate = date('Y-m-d');
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
                 FROM [dbo].[tblSellOutCur] WHERE CAST(deliveryDate as date) between '2018-08-01' and '2018-08-31' and site = 'TAC'";
       $f_Data = array();
       $data = array();
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
           $f_Data[] = $data;
        }
        echo json_encode($f_Data);
  }else if($_POST['type'] == "geoResetSalesman"){
    $mdCode = $_POST['mdCode'];
    $mcpDay = $_POST['mcpDay'];
    if($mcpDay == '0'){
       $sth = $db->prepare("Update tblCustomer set longitude= '0.0',latitude = '0.0', storeImage = '', storeImage2 = '' where mdCode = '$mdCode'");
       $tblCustomerImageSql = $db->prepare("Update t1 set t1.storeImage = 'NULL', t1.storeimage2 = 'NULL' from tblCustomerImage t1, tblCustomer t2 WHERE '$mdCode' = t1.mdCode and t1.custCode = t2.custCode");
    }else{
       $sth = $db->prepare("Update tblCustomer set longitude = '0.0',latitude = '0.0', storeImage = '', storeImage2 = '' where mdCode = '$mdCode' and mcpday = '$mcpDay'");
       $tblCustomerImageSql = $db->prepare("Update t1 set t1.storeImage = 'NULL', t1.storeimage2 = 'NULL' from tblCustomerImage t1, tblCustomer t2 WHERE '$mdCode' = t1.mdCode and t1.custCode = t2.custCode and t2.mcpDay = '$mcpDay'");
    }
    $resulttblCustomerImage = $tblCustomerImageSql->execute(); 
    $result = $sth->execute();
    if($result && $tblCustomerImageSql){
      echo 1;
    }else{
      echo 'ERROR';
    }

  }else if($_POST['type'] == "geoResetCustomer"){
    $custCode = $_POST['custCode'];

     $checkCustomerSql = $db->query("SELECT count(*) as valiCustomer from tblCustomer where custCode = '$custCode'");
     $CustomerRes = $checkCustomerSql->fetch();
     $valiDateCust = $CustomerRes['valiCustomer'];

     if((int)$valiDateCust != 0){
      $sth = $db->prepare("Update tblCustomer set longitude = '0.0', latitude = '0.0', storeImage = '', storeImage2 = '' where custCode = '$custCode'");
      $res1 = $sth->execute();

      $sthTBLCust = $db->prepare(" update t1 set t1.storeImage = 'NULL', t1.storeimage2 = 'NULL' from tblCustomerImage t1, tblCustomer t2 WHERE t2.mdCode = t1.mdCode and '$custCode' = t1.custCode");
      $res2 = $sthTBLCust->execute();
      if($res1 && $res2){
        echo 0;
      }else{
        echo 'ERROR';
      }
     }else{
      echo 1;
     }
   
  }else if($_GET['type'] == "loadSalesmanCat"){
    date_default_timezone_set('Asia/Manila');
    $date = date('Y-m-d');
    $sql = "SELECT distinct a.Type
            from vSalesman a, vSalesSummary b
            where a.mdColor = b.mdColor and cast(deliveryDate as date) = '$date'";
    $stmt= $db->query($sql);
    $routeList= $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($routeList);
  }else if($_GET['type'] == "filterSalesmanByCategory"){
    date_default_timezone_set('Asia/Manila');
    $date = date('Y-m-d');
    $brand = $_GET['brand'];

    if($brand == 'All'){
      $sql = "SELECT a.mdCode, b.mdCode as bmdcode, a.Type,
                 b.[Total Calls] as tcalls, b.[Productive Calls] as prod,
                 b.[Unproductive Calls] as unprod, b.Sales as bsales, b.mdColor as mdColor,
                 b.sellingHours as sellH
                from vSalesman a, vSalesSummary b
            where a.mdColor = b.mdColor and cast(deliveryDate as date) = '$date' ORDER BY a.type";
    }else{
      $sql = "SELECT a.mdCode,  b.mdCode as bmdcode, a.Type,
                 b.[Total Calls] as tcalls, b.[Productive Calls] as prod,
                 b.[Unproductive Calls] as unprod, b.Sales as bsales, b.mdColor as mdColor,
                 b.sellingHours as sellH
                from vSalesman a, vSalesSummary b
            where a.mdColor = b.mdColor and cast(deliveryDate as date) = '$date' and type = '$brand'";
    }
    
    
    foreach ($db->query($sql) as $row) {
          echo "<tr class='salesmanName' onclick='showSalesmanOnMap(\"".$row["bmdcode"]."\")'>
               <td width='45%' class='showSalesman' data-toggle='tooltip' data-placement='right' title='Double click to view location!'><span class='fas fa-map-marker' style='color:".$row['mdColor']."'></span> ".$row['bmdcode']."</td>
               <td width='20%' class='text-center'>".$row['prod'].'/'.$row['tcalls']."</td>
               <td width='10%' class='text-left'>".$row['unprod']."</td>
               <td width='13%' class='text-center'>".$row['sellH']."</td>
               <td width='9%' class='text-right'>".number_format($row['bsales'], 2)."</td>
               </tr>";
          }//foreach
    //echo json_encode($routeList);
  }else if($_GET['type'] == 'getTotalSalesmanByBrand'){
       date_default_timezone_set('Asia/Manila');
       $newdate = date('Y-m-d');
       $brand = $_GET['brand'];

       if($brand == 'All'){
         $sth = "SELECT sum(b.Sales) as total, count(b.mdCode) as salesman
               from vSalesman a, vSalesSummary b
               where a.mdColor = b.mdColor and cast(deliveryDate as date) = '$newdate'";
       }else{
         $sth = "SELECT sum(b.Sales) as total, count(b.mdCode) as salesman
               from vSalesman a, vSalesSummary b
               where a.mdColor = b.mdColor and cast(deliveryDate as date) = '$newdate' 
               and type = '$brand'";
       }
       
       $result = array();
       $data = array();
      foreach ($db->query($sth) as $row) {
           $result["total"] = number_format($row["total"], 2); 
           $result["salesman"] = $row["salesman"];
           $data[] = $result;
        }
       echo json_encode($data);
  }else if($_GET['type'] == 'getSalesmanByBrand'){
    date_default_timezone_set('Asia/Manila');
    $newdate = date('Y-m-d');
    $brand = $_GET['brand'];
    $f_Data = array();
    $data = array();
    if($brand == 'All'){
      /*$sql = "SELECT * from vSELLOUT 
            where cast(deliveryDate as date) = '$newdate'";*/
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
             FROM [dbo].[vSELLOUT] WHERE CAST(deliveryDate as date) = '$newdate'
             ORDER BY Salesman";
    }else{
      /*$sql = "SELECT * from vSELLOUT 
            where cast(deliveryDate as date) = '$newdate' and type = '$brand'";*/
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
                 FROM [dbo].[vSELLOUT] WHERE CAST(deliveryDate as date) = '$newdate' and type = '$brand'
                 ORDER BY Salesman";
    }
    
    /*$stmt= $db->query($sql);
    $routeList= $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($routeList);*/
     
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
        echo json_encode($f_Data);

  }else if($_POST['type'] == 'updateStockRequest'){
    //$arrySource = $_POST['paramData'];
    $refNo = $_POST['refNo'];
    $mdCode = $_POST['mdCode'];
    $stockCode = $_POST['stockCode'];
    $sth = $db->prepare("UPDATE tblStockrequest set approveStat = 1 where mdCode = '$mdCode'
           and StockCode = '$stockCode' and refNo = '$refNo'");
    $res = $sth->execute();

    if($res){
      echo 0;  
    }else{
      echo 'notupdated';
    }
    
  }else if($_GET['type'] == 'stockRequest'){
    $sql = "SELECT * from vStockRequest";
    $stmt = $db->query($sql);
    $res = $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($res);
  }else if($_GET['type'] == 'get_all_salesman_georeset'){
       $sth = "SELECT mdName, mdCode from tblUser order by mdCode";
       $result = array();
       $data = array();
      foreach ($db->query($sth) as $row) {
           $result["Salesman"] = $row["mdName"];
           $result["mdCode"] = $row["mdCode"];
           $data[] = $result;
        }
       echo json_encode($data);

  }else if($_GET['type'] == 'update_digitalMap'){
       $sth1 = $db_cloud->prepare("[dbo].[sp_datasync_leyte] @site = 'TAC'");
       $result1 = $sth1->execute();

       $sth2 = $db_cloud->prepare("[dbo].[sp_datasync1_leyte] @site = 'TAC'");
       $result2 = $sth2->execute();
      
       //echo 'result1: '+ $result1 +' result2: '+ $result2 +'result3: '+ $result3;
       if($result1 && $result2){
         echo 0;
       }else{
         echo 'ERROR';
       }
  }else if($_GET['type'] == "efastText_overrides"){
    $start = $_GET['startDate'];
    $end = $_GET['endDate'];

    $f_Data = array();
    $data = array();
    $sql = "SELECT * from vtblOverrides WHERE cast(trnDate as date) 
    BETWEEN '$start' and '$end' order by trnDate desc";

    // $stmt= $db->query($sql);
    // $res= $stmt->fetchALL(PDO::FETCH_OBJ);
    // echo json_encode($res);

     foreach ($db->query($sql) as $row) {
           $data["trnDate"] = $row["trnDate"];
           $data["oMobileNo"] = $row["oMobile"]; 
           $data["remarks"] = $row["Remarks"]; 
           $data["SYNTAX"] = $row["SYNTAX"];
           $data["repliedMSG"] = $row["repliedMSG"];
           $data["status"] = $row["status"];
           $data["time"] = date("h:i", strtotime($row["trnDate"]));
           $f_Data[] = $data;
        }
    //$dataArry = array("data" => $f_Data);
    echo json_encode($f_Data);

  }else if($_GET['type'] == "count_overrides"){
    $sql = "SELECT count(*) from vtblOverrides";
    $result = $db->prepare($sql); 
    $result->execute();
    $override_rows = $result->fetchColumn(); 

    $sql2 = "SELECT count(*) from vHoldOrders";
    $result2 = $db_efast->prepare($sql2); 
    $result2->execute();
    $holdOverride_rows = $result2->fetchColumn();
    
    $resultData = array("overData" => $override_rows,
                    "holdOverData" => $holdOverride_rows);
    echo json_encode($resultData);
  }else if($_GET['type'] == "efastText_holdOverrides"){
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
    echo json_encode($f_Data);

  }else if($_GET['type'] == 'getNumber'){

    $sql = "SELECT * from vtblClients where cApprover between 0 and 7";
    $stmt= $db->query($sql);
    $routeList= $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($routeList);

  }else if($_GET['type'] == 'HOverrides_inquiry'){
    $number = $_GET['originator'];
    $SOnumber = $_GET['SONumber'];
    // $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
    // [message], [timestamp]) Values (1,'$number','$SOnumber',getdate())");
    // $result = $sql->execute();

    $sth = $db->prepare("[dbo].[sp_smsinbox] @number='$number', @soNumber='$SOnumber', @type='INQ'");
    $result = $sth->execute();

    if($result){
      echo 1;
    }else{
      echo 'error';
    }
  }else if($_GET['type'] == 'HOverrides_approved'){
    $number = $_GET['originator'];
    $SOnumber = $_GET['SONumber'];
    // $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
    // [message], [timestamp]) Values (1,'$number','$SOnumber',getdate())");
    // $result = $sql->execute();
    $sth = $db->prepare("[dbo].[sp_smsinbox] @number='$number', @soNumber='$SOnumber', @type='APRV'");
    $result = $sth->execute();

    if($result){
      echo 1;
    }else{
      echo 'error';
    }
  }else if($_GET['type'] == 'inquiry_approver'){
    $number = $_GET['originator'];
    $SOnumber = $_GET['SONumber'];
    //$SOnumber = 'cdo inq '.$_GET['SONumber'];
    // $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
    // [message], [timestamp]) Values (1,'$number','$SOnumber',getdate())");
    // $result = $sql->execute();
    $sth = $db->prepare("[dbo].[sp_smsinbox] @number='$number', @soNumber='$SOnumber', @type='INQ'");
    $result = $sth->execute();

    if($result){
      echo 1;
    }else{
      echo 'error';
    }
  }else if($_GET['type'] == 'approver_approved'){
    $number = $_GET['originator'];
    $SOnumber = $_GET['SONumber'];
    //$SOnumber = 'cdo inq '.$_GET['SONumber'];
    // $sql = $db_efast->prepare("INSERT into [tblSMSInbox] ([message_id], [originator], 
    // [message], [timestamp]) Values (1,'$number','$SOnumber',getdate())");
    // $result = $sql->execute();

    $sth = $db->prepare("[dbo].[sp_smsinbox] @number='$number', @soNumber='$SOnumber', @type='APRV'");
    $result = $sth->execute();

    if($result){
      echo 1;
    }else{
      echo 'error';
    }
  }else if($_POST['type'] == 'insertOTP'){
    $number = $_POST['number'];
    $OTP = $_POST['OTP'];
    $sql = $db_efast->prepare("UPDATE vtblClients set OTP='$OTP' WHERE cMobile='$number'");
    $result = $sql->execute();
    if($result){
      echo 1;
    }else{
      echo 'error';
    }
  }else if($_GET['type'] == 'forward'){
    $number = $_GET['originator'];
    $message = $_GET['message'];
    // $sql = "INSERT into [tblsmsOUTsmart_ONE] ([oMobileNo], 
    // [oRepliedMSG], [oDateTimeIn]) Values (?, ?, getDate())";
    // $result = $db_efast->prepare($sql)->execute([$number, $message]);
    $sth = $db->prepare("[dbo].[sp_smsinsert] @mobileno='$number', @message='$message'");
    $result = $sth->execute();

    $datastring = '';
    if($result){
      echo 1;
    }else{
      echo 'error';
    }
  }else if($_GET['type'] == 'getSO'){
    $so = $_GET['SO'];
    $left = 'left(right('.$so.',len('.$so.')';
    $charindex1 = '(charindex(" SO:",'.$so.') + 4))';
    $charindex2 = 'charindex(" ",right('.$so.',len('.$so.')';
    $charindex3 = '(charindex(" SO:",'.$so.') + 4)))-1)';

    $sql = $db->prepare("SELECT $left - $charindex1, $charindex2 - $charindex3");
    $result = $sql->execute();
     echo json_encode($result);

  }else if($_GET['type'] == 'loginViaPhone'){
    $phone = $_GET['phoneNumber'];

    $sql = "SELECT * from vtblClients 
            WHERE cMobile = '$phone' and cActive = 1"; 
    $result = $db_efast->prepare($sql); 
    $result2 = $db_efast->prepare($sql); 
    $result->execute(); 
    $result2->execute(); 
    $CustomerRes = $result2->fetch();
    $numRows = $result->fetchColumn(); 
    $AChecker = $CustomerRes['cApprover'];
    
    if(!$numRows){
      echo json_encode(0);
    }else{
       if($AChecker == '1' || $AChecker == '2' ||
           $AChecker == '3' || $AChecker == '4' ||
           $AChecker == '5'){
          echo json_encode('APPROVER');
        }else{
          echo json_encode('NOTAPPROVER');
        }
    }

  }else if($_GET['type'] == 'checkOTP'){
    $number = $_GET['number'];
    $OTP = $_GET['OTP'];
    $sql = "SELECT * from vtblClients where cMobile = '$number' and OTP = '$OTP'";
    $result = $db_efast->prepare($sql); 
    $result2 = $db_efast->prepare($sql); 
    $result->execute(); 
    $result2->execute(); 
    $CustomerRes = $result2->fetch();
    $numRows = $result->fetchColumn(); 
    $AChecker = $CustomerRes['cApprover'];
    
    if(!$numRows){
      echo json_encode(0);
    }else{
       if($AChecker == '1' || $AChecker == '2' ||
           $AChecker == '3' || $AChecker == '4' ||
           $AChecker == '5'){
          echo json_encode('APPROVER');
        }else{
          echo json_encode('NOTAPPROVER');
        }
    }

  }else if($_GET['type'] == 'transfercheck'){
    $number = $_GET['number'];

    $sql = "SELECT * from vtblClients where cMobile = '$number'";
    $result = $db_efast->prepare($sql); 
    $result2 = $db_efast->prepare($sql); 
    $result->execute(); 
    $result2->execute(); 
    $CustomerRes = $result2->fetch();
    $numRows = $result->fetchColumn(); 
    $AChecker = $CustomerRes['cApprover'];

    if(!$numRows){
      echo json_encode(0);
    }else{
       if($AChecker == '1' || $AChecker == '2' ||
           $AChecker == '3' || $AChecker == '4' ||
           $AChecker == '5'){
          echo json_encode('APPROVER');
        }else{
          echo json_encode('NOTAPPROVER');
        }
    }

  }else if($_GET['type'] == 'salesmanMaintenance'){
    $sql = "SELECT CONCAT(mdSalesmancode, '_', mdName) AS sname,
    mdCode, contactCellNumber, mdUserCreated, eodNumber1, eodNumber2, mdPassword, mdLevel,
    customerLastDateReset, token, priceCode, mdColor, geoLocking, isGEOReset, siteCode, PreRouteCL, PostRouteCL, StockTakeCL, EOD from tblUser";
    $stmt= $db->query($sql);
    $salemanList = $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($salemanList);
  }else if($_GET['type'] == 'getSalesmanDetails_maintenance'){
    $mdCode = $_GET['mdCode'];
    $sql = "SELECT CONCAT(mdSalesmancode, '_', mdName) AS sname,
    mdCode, contactCellNumber, mdUserCreated, eodNumber1, eodNumber2, mdPassword, mdLevel,
    customerLastDateReset, token, priceCode, mdColor, geoLocking, isGEOReset, siteCode, PreRouteCL, PostRouteCL, StockTakeCL, EOD from tblUser where mdCode = '$mdCode'";
    $stmt= $db->query($sql);
    $salemanList = $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($salemanList);
  }else if($_POST['type'] == 'update_salesman_maintenance'){
    $pre = $_POST['pre'];
    $post = $_POST['post'];
    $stack =$_POST['stack'];
    $oedcl =$_POST['oedcl'];
    $mdCode = $_POST['mdCode'];
    $sql = "UPDATE tblUser set stocktakecl = '$stack', eod = '$oedcl', preroutecl = '$pre', PostRouteCL = '$post' where mdCode = '$mdCode'";
    $res = $db->prepare($sql); 
    $res->execute();  
    
    if($res){
      echo 1;
    }else{
      echo 'ERROR';
    }
  }else if($_GET['type'] == 'BOreports'){
    $startDate = $_GET['startDate'];
    $endDate = $_GET['endDate'];
    /*$sql = "SELECT mdCode,t1.transactionID,t1.refno,custCode,deliveryDate,stockCode,quantity,quantity * piecePrice as amount, remarks
      from tblTransaction t1,tblTransactionBOItems t2
      Where t1.transactionID = T2.transactionID and transstat <> 1 and 
      cast(deliveryDate as date) between '$startDate' and '$endDate'";*/
     $sql = "SELECT mdCode,transactionID,refno,custCode,deliveryDate,stockCode,
    FLOOR(quantity/ConvFactAltUom) as Cases
    ,CASE WHEN OtherUom = 'IB' THEN floor(round((quantity/ConvFactAltUom - CAST(floor(quantity/ConvFactAltUom) AS decimal(15, 2))) * CAST(ConvFactAltUom AS decimal(10, 2)), 0) / (ConvFactAltUom / ConvFactOthUom)) ELSE '0' END IB
    ,CASE WHEN OtherUom = 'IB' THEN round((((round((quantity/ConvFactAltUom - CAST(floor(quantity/ConvFactAltUom) AS decimal(15, 2))) * CAST(ConvFactAltUom AS decimal(10, 2)), 0) / (ConvFactAltUom / ConvFactOthUom)) - CAST((floor(round((quantity/ConvFactAltUom - CAST(floor(quantity/ConvFactAltUom) AS decimal(15, 2))) * CAST(ConvFactAltUom AS decimal(10, 2)), 0) / (ConvFactAltUom / ConvFactOthUom))) AS decimal(10, 2))) * (ConvFactAltUom / ConvFactOthUom)), 0) ELSE round(((quantity/ConvFactAltUom - CAST(floor(quantity/ConvFactAltUom) AS decimal(15, 2))) * CAST(ConvFactAltUom AS decimal(10, 2))), 0) END PCS,
    amount,remarks from (
    select mdCode,t1.transactionID,t1.refno,custCode,deliveryDate,stockCode,quantity,quantity * piecePrice as amount, remarks
    from tblTransaction t1,tblTransactionBOItems t2  
    Where t1.transactionID = T2.transactionID and transstat <> 1 
    ) x1, [Enc_FDCBohol_N].dbo.InvMaster t3
    where x1.StockCode = t3.StockCode collate SQL_Latin1_General_CP1_CS_AS  and 
      cast(deliveryDate as date) between '$startDate' and '$endDate'";
     $stmt= $db->query($sql);
     $salemanList = $stmt->fetchALL(PDO::FETCH_OBJ);
     echo json_encode($salemanList);
  }else if($_POST['type'] == 'uploadSalesmanPic'){
    $site = $_POST['site'];
    $mdCode = $_POST['mdCode'];
    $target_dir = "img/salesman_".$site."/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    $temp = explode(".", $_FILES["file"]["name"]);
    $newfilename = /*round(microtime(true))*/$mdCode. '.' . end($temp);
      $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
      if($check !== false) {
          echo "File is an image - " . $check["mime"] . ".";
          $uploadOk = 1;
      } else {
          echo "File is not an image.";
          $uploadOk = 0;
      }

     // Check if file already exists
      if (file_exists($target_file)) {
        unlink($target_file);
          echo "Image already Exists but updated.";
          $uploadOk = 1;
      }
      // Check file size
      if ($_FILES["fileToUpload"]["size"] > 500000) {
          echo "Sorry, your file is too large.";
          $uploadOk = 0;
      }
      // Allow certain file formats
      if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
      && $imageFileType != "gif" ) {
          echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
          $uploadOk = 0;
      }
      // Check if $uploadOk is set to 0 by an error
      if ($uploadOk == 0) {
          echo "Sorry, your file was not uploaded.";
      // if everything is ok, try to upload file
      } else {
          if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_dir . $newfilename.'jpg')) {
              echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
          } else {
              echo "Sorry, there was an error uploading your file.";
          }
      }
  }else if($_GET['type'] == 'getSpecificSalesman'){
    $salesman = $_GET['mdCode'];
    $sql = "SELECT * from vsellout where cast(deliverydate as date) = cast(getdate() as date) and mdCode = '$salesman'";
    $stmt= $db->query($sql);
    $transaction = $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($transaction);
  }else if($_GET['type'] == 'salesReport'){
    $startDate = $_GET['startDate'];
    $endDate = $_GET['endDate'];
    $sql = "SELECT [Salesman]
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
                  ,[#SKU]
                  ,[TIME BOUND Min.]
                  ,[Notation]
                  ,[upTime]
              FROM [dbo].[vSELLOUT] where CAST(deliveryDate as date) BETWEEN '$start' and '$end'";
    $stmt= $db->query($sql);
    $salesreport = $stmt->fetchALL(PDO::FETCH_OBJ);
    echo json_encode($salesreport);
  }else{
    echo 'There was an error!';
  }
  

}
 
catch (PDOException $e)
 
{
 
    echo $e->getMessage();
 
}
 

?>