<?php
require("mysql_conn.php");
print_r($_POST);
$name = $_POST['name'];
$course = $_POST['course'];
$grade = $_POST['grade'];
$query = "INSERT INTO `students` SET `name` = '$name', `course` = '$course', `grade` = '$grade'";
$result = mysqli_query($conn, $query);
$rows_affected = mysqli_affected_rows($conn);
if($result){
	echo "New record created successfully";
} else {
	echo "Error: " . mysqli_error($conn);
}
mysqli_close($conn);
?>