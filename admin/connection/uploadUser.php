<?php

include 'plesk_connection.php';
// include 'databaseOperationsApi.php';
   
  $database = new Connection_plesk();
//    $op = new DBOperations();
   $db = $database->openConnection_plesk();

  $message = '';

  try{
      
    ini_set('memory_limit', '512M');
    ini_set('max_execution_time', '180');

       if($_FILES['user_file']['name'])
       {
        $filename = explode(".", $_FILES['user_file']['name']);
        if(end($filename) == "csv")
        {

            // $deleteAlrdyINSRTD_VITMNFST = $op->deleteAlreadyInsrtd_vitcompManifest($db, $companyID);
        
            $filenameDir = $_FILES['user_file']['tmp_name'];
            $file = fopen($filenameDir, 'r');

            // Iterate over it to get every line ==============
            while (($line = fgetcsv($file)) !== FALSE) {
            // Store every line in an array
            $data[] = $line;
            }
            fclose($file);

            // Remove the first element from the stored array / first line of file being read
            array_shift($data);

            // Open file for writing
            $file = fopen($filenameDir, 'w');

            // Write remaining lines to file
            foreach ($data as $fields) {
                fputcsv($file, $fields);
            }
            fclose($file);
            //END ==================================================

            //remove empty rows
            // $op->removeEmpty($file);
            
            
            $handle = fopen($_FILES['user_file']['tmp_name'], "r");
            $query = "INSERT INTO admin_db  
                   (AUSERNAME
                    ,APASSWORD
                    ,AFULLNAME
                    ,ADESIGNATION
                    ,ACONTACTNO
                    ,AEMAIL
                    ,AUSERTYPE
                    ,ADISTRIBUTOR
                    ,ADATECREATED
                    ,ASITECODE
                    ,ASITENAME
                    ,REGION
                    ,ASSIGNED_DISTRIBUTOR
                    ,AISONLINE
                    ,ASTATUS) 
                VALUES ('creatd-direct-web-adm', 'creatd-direct-web-adm', ?, ?, ?, ?, 'WEB', 'NPI', NOW(), 'NPI', 'NESTLE PHILS.', ?, ?, '0', '1')";
            
                while($data = fgetcsv($handle))
                {   

                    $fullname = iconv('','UTF-8', $data[0]);  
                    $designation = iconv('','UTF-8', $data[1]);
                    $region = iconv('','UTF-8', $data[2]);
                    $email = iconv('','UTF-8', $data[3]);  
                    $mobileno = iconv('','UTF-8', $data[4]);
                    $assignedDist = iconv('','UTF-8', $data[5]);
                    
                    $stmt = $db->prepare($query)->execute([$fullname
                                                ,$designation 
                                                ,$mobileno
                                                ,$email
                                                ,$region
                                                ,$assignedDist
                                            ]);
                 
                }// while end

                fclose($handle);
                 //  header("location: upload.php?updation=1");
                echo '1';
            }else{
                $message = '<label class="text-danger">Please Select CSV File only</label>';
            }
       }else{
        $message = '<label class="text-danger">Please Select File</label>';
       }

  }catch (PDOException $e){
        echo " " . $e->getMessage();
   }
?>
