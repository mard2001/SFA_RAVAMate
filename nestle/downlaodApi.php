<?php

	if($_POST['type'] == "downloadMD"){
		echo file_put_contents("mdbuddy.apk", fopen("https://mdbuddyonline.access.ly/fdcapp/mdbuddy", 'r'));
	}	

 ?>