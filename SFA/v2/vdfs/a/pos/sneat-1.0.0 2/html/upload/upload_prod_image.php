
<?php
	// include '../nestle/connectionString/mybuddyconnection.php';
	// include '../nestle/connectionString/cloudconnection.php';
	
	// $con = new ConfigConnection();
	// $con_cloud = new CloudConfigConnection();

	// $company = $_POST['company'];
	// $sitename = $_POST['site'];
	// $description = $_POST['description'];
	// $gservr = $_POST['s'];
    // $gusr = $_POST['u'];
    // $gpwrd = $_POST['p'];
    // $gdb = $_POST['d'];

    // $server = "sqlsrv:Server=".$gservr.";Database=".$gdb;
    // $db = $con->openConnection($server, $gusr, $gpwrd);
	// $db_cloud = $con_cloud->openConCloud();

	$stockCode = $_POST['stockCode'];
	$target_dir = 'product_image/';
	$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

	$temp = explode(".", $_FILES["file"]["name"]);
	$newfilename = /*round(microtime(true))*/$stockCode. '.' . end($temp);
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    // if($check !== false) {
    //    // echo "File is an image - " . $check["mime"] . ".";
    //     $uploadOk = 1;
    // } else {
    //     //echo "File is not an image.";
    //     $uploadOk = 0;
    // }

 	// Check if file already exists
	if (file_exists($target_file)) {
		unlink($target_file);
	    //echo "Salesman Image updated";
	    $uploadOk = 1;
	}
	// Check file size
	// if ($_FILES["fileToUpload"]["size"] > 50000/*10000 = 10 mb*/) {
	//     echo "Sorry, your file is too large.";
	//     $uploadOk = 0;
	// }
	// // Allow certain file formats
	// if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	// && $imageFileType != "gif" ) {
	//     echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
	//     $uploadOk = 0;
	// }
	// // Check if $uploadOk is set to 0 by an error
	// if($uploadOk == 0) {
	//     echo "Your file was not uploaded: File size was to large.";
	// // if everything is ok, try to upload file
	// }else{
	    if(move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_dir . $newfilename.'jpg')) {	     
			// echo $newfilename.'jpg';
			echo 1;
	    } else {
	        echo "Sorry, there was an error uploading your file.";
	    }
	//}
?>