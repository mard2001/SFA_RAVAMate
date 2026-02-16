<?php

	//if($_POST['type'] == "downloadMD"){
	    
	    //$file = 'mdbuddyonline.access.ly/fdcapp/mdbuddy/mdbuddy.zip';
		/*$file = 'https://mdbuddyonline.access.ly/img/fui.png';
	    $type = 'application/octet-stream';
	    $description = 'File Transfer';
	    $disposition = 'attachment';
	    $expires = 0;
	    $cache = 'must-revalidate';
	    $pragma = 'public';

		header('Content-Description: '. $description);
		header('Content-Type: '. $type);
		header('Content-Disposition: '. $disposition.'; filename="'.basename($file).'"');
		header('Expires: '.$expires);
		header('Cache-Control: '.$cache);
		header('Pragma: ' .$pragma);
		header('Content-Length: '.filesize($file));
		readfile($file);
		exit;*/
		if(isset($_GET['id'])){
			$passcode = $_GET['id'];
			 header("Location: ../fdcapp/".$passcode."/".$passcode.".apk");

		}
	

	    
	//}	

 ?>