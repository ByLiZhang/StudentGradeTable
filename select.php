<?php
require("mysql_conn.php");
$query = "SELECT * FROM `students`";
$result = mysqli_query($conn, $query);
if($result){
	if(mysqli_num_rows($result)>0){
		while($row = mysqli_fetch_assoc($result)){
			print_r($row);
		}
	}
}
mysqli_close($conn);
?>