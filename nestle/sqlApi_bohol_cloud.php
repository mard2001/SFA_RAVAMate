<?php
include('connectionString/cloud_boholConnection.php');

try
 
{
    $database = new Connection();
    $db = $database->openConnection();


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

  }else if($_POST['type'] == "dashBoardData_bohol"){
     $current_date = date("Y-m-d");
     $sql = "SELECT [mdCode]
                  ,[Total Calls]
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

    if($number_of_rows == 0){
      echo "<tr>
              <td>NO DATA TO SHOW AS OF THIS TIME!</td>
            </tr>";
    }else{
        foreach ($db->query($sql) as $row) {
          echo "<tr class='salesmanName'>
               <td width='40%' class='showSalesman' data-toggle='tooltip' data-placement='right' title='Double click to view location!'><span class='glyphicon glyphicon-map-marker' style='color:".$row['mdColor']."'></span> ".$row['mdCode']."</td>
               <td width='15%' class='text-center'>".$row['Total Calls']."</td>
               <td width='5%' class='text-center'>".$row['Productive Calls']."</td>
               <td width='10%' class='text-center'>".$row['Unproductive Calls']."</td>
               <td width='15%' class='text-center'>".$row['sellingHours']."</td>
               <td width='9%' class='text-right'>".number_format($row['Sales'], 2)."</td>
               </tr>";

              /* $data['mdColor'] = $row['mdColor'];
                    $data['mdCode'] = $row['mdCode'];
                    $data['tcalls'] = $row['Total Calls'];
                    $data['pCalls'] = $row['Productive Calls'];
                    $data['unpCalls'] = $row['Unproductive Calls'];
                    $data['tSellHour'] = $row['sellingHours'];
                    $data['sales'] = number_format($row['Sales'], 2);
                    $output[] = $data;
               //$output[] = $row;*/
          }//foreach
          //echo json_encode($output);
    }

  }else if($_POST['type'] == "dashBoardData_bohol_filter"){
    $salesman = $_POST['resultSalesman'];
    $startDate = $_POST['start'];
    $endDate = $_POST['end'];
    $checker = false;
    $result = array();
    $data = array();
      foreach($salesman as $resultRow){
        $sql = "Select Salesman, mdColor, mdCode, sum([Total Calls]) as tcalls, sum(tblSales) as tsales,sum([Productive Calls]) as pCalls,sum([Unproductive Calls]) as unpCalls, sum(sellHours)  as tSellHour from (
                SELECT distinct vSELLOUT.Salesman
                            ,vSalesSummary.[deliveryDate]
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
                       <td width='40%' class='showSalesman' onclick='hitme()'><span class='glyphicon glyphicon-map-marker' style='color:".$row['mdColor']."'></span> ".$row['mdCode'].'_'.$row['Salesman']."</td>
                       <td width='15%' class='text-center'>".$row['tcalls']."</td>
                       <td width='5%' class='text-center'>".$row['pCalls']."</td>
                       <td width='10%' class='text-center'>".$row['unpCalls']."</td>
                       <td width='15%' class='text-center'>".$row['tSellHour']."</td>
                       <td width='9%' class='text-right' id='rowDataSd'>".number_format($row['tsales'], 2)."</td>
                       </tr>";
                
            }//foreach
            //echo json_encode($data);
    }//main for each

  }else if($_GET['type'] == 'get_all_salesman_bohol'){
       $sth = "SELECT distinct Salesman, mdColor from vSELLOUT";
       $result = array();
       $data = array();
      foreach ($db->query($sth) as $row) {
           $result["Salesman"] = $row["Salesman"];
           $result["mdColor"] = $row["mdColor"];
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
                 FROM [dbo].[vSELLOUT] WHERE CAST(deliveryDate as date) BETWEEN '$current_date' and '$current_date'";
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
           $f_Data[] = $data;
        }
        echo json_encode($f_Data);


  }else if($_POST['type'] == "dashBoard_totalSales_bohol"){
       $current_date = date("Y-m-d");
       $sth = "SELECT SUM(Sales) as total, count(mdCode) as salesman FROM vSalesSummary 
               where CAST(deliveryDate as date) BETWEEN '$current_date' and '$current_date'";
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
              FROM [dbo].[vSELLOUT] where mdCode = '$resultRow' AND CAST(deliveryDate as date) BETWEEN '$startDate' and '$endDate'";
        /*$result = $db->prepare($sql);
        $result->execute(); 
        $number_of_rows = $result->fetchColumn();*/
        
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
                 $f_Data[] = $data;
          }
       

    }//end for loop
    echo json_encode($f_Data);

    /*if($checker != true){
          echo json_encode($f_Data);
     }else{
          echo 0;
     }*/
    

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
                            ,vSalesSummary.[deliveryDate]
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
                $data['salesmanName'] = $row['mdCode'].'_'.substr($row['Salesman'], 7);
                $data['sales'] = round($row['tsales']);
                
            }//foreach
            $result[] = $data;
            
    }//main for each
    echo json_encode($result);

  }else if($_GET['type'] == 'getLate'){
     $current_date = date("Y-m-d");
     $sql = "SELECT [mdCode]
                    ,[salesmanName]
                    ,[alert]
                    ,[Description]
                    ,[refNo]
                    ,[TransTime]
                    ,[deliveryDate]
                    ,[transactionID]
                    ,[mobileNo]
                FROM [dbo].[vDeviation]
                where CAST(deliveryDate as date) BETWEEN '$current_date' and '$current_date' order by deliveryDate";

     $output = array();
       foreach ($db->query($sql) as $row) {
          $time = date("g:i:s A",strtotime($row['deliveryDate']));
          $data['mdCode'] = $row['mdCode'];
          $data['salesmanName'] = $row['salesmanName'];
          $data['alert'] = $row['alert'];
          $data['Description'] = $row['Description'];
          $data['refNo'] = $row['refNo'];
          $data['TransTime'] = $row['TransTime'];
          $data['deliveryDate'] = $time;
          $data['transactionID'] = $row['transactionID'];
          $data['mobileNo'] = $row['mobileNo'];

          $output[] = $data;
        
         
        }//foreach
          echo json_encode($output);
     
  }else{
    echo 'There was an error!';
  }
  

}
 
catch (PDOException $e)
 
{
 
    echo $e->getMessage();
 
}
 

?>