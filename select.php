<?php
require("mysql_conn.php");
$query = "SELECT * FROM `students`";
$result = mysqli_query($conn, $query);
$data = [];
if($result){
	if(mysqli_num_rows($result)>0){
		while($row = mysqli_fetch_assoc($result)){
			$data[]=$row;
		}
	}
	echo json_encode($data);
}
mysqli_close($conn);
?>