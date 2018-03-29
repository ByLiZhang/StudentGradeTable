<?php
require("mysql_conn.php");
if(!$conn) {
	die("Couldn\'t connect to server: " . mysql_error() );
}
echo `Connected to the server successfully<br>`;

$query = "DELETE FROM `students` WHERE id = 15";
$result = mysqli_query($conn, $query);
if($result){
	echo "Record deleted";
} else {
	echo "Error deleting record: ".mysql_error($conn);
}
mysqli_close($conn);
?>