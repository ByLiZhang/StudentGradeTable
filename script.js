/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var student_array = [];

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
	addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
	var addBtn = $('.btn-success');
	var cancelBtn = $('.btn-default'); 
	var studentList = $('.student-list');
	addBtn.on('click', handleAddClicked);
	cancelBtn.on('click', handleCancelClick);
	// studentList.on('click', '.btn-danger', function(event) {
	// 	removeStudent(this);
	// })

}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(event){
	addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
	clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
	var studentData = {};
	var name = $('input[name="studentName"]');
	var course = $('#course');
	var grade = $('input[name="studentGrade"]');
	if ( name.val() && course.val() && grade.val()) {
		studentData.name = name.val();
		studentData.course = course.val();
		studentData.grade = grade.val();
		student_array.push(studentData);
	}
	clearAddStudentFormInputs();
	updateStudentList(student_array);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
	var name = $('input[name="studentName"]');
	var course = $('#course');
	var grade = $('input[name="studentGrade"]');
	name.val('');
	course.val('');
	grade.val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
	var tableBody = $('tbody');
	
	var tableRow = $('<tr>').addClass('form-group');
	var tableData1 = $('<td>').text(studentObj.name);
	var tableData2 = $('<td>').text(studentObj.course);
	var tableData3 = $('<td>').text(studentObj.grade);
	var tableBtn = $('<td>');
	var deletBtn = $('<button>').addClass('btn btn-danger btn-sm').text('Delete');
	deletBtn.on('click', function(){
		removeStudent(studentObj);
		$(this).parent().parent().remove();
	})
	tableBtn.append(deletBtn);
	tableRow.append(tableData1, tableData2, tableData3, tableBtn);
	tableBody.append(tableRow);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(studentArray){
	var tableBody = $('tbody');
	tableBody.html('');
	for (var i = 0; i < studentArray.length; i++) {
		renderStudentOnDom(studentArray[i]);
	}
	var average = calculateGradeAverage(studentArray);
	renderGradeAverage(average);  
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(inputData){
	var runningTotal = 0;
	for(var i = 0; i < inputData.length; i++){
		runningTotal += parseFloat(inputData[i].grade);
	}
	return runningTotal/inputData.length;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
	$('.avgGrade').text(average);
}

/***************************************************************************************************
*/

/**
 * @param  {object}
 * @return {undefined}
 */
function removeStudent(input) {
	var indexToDelete = student_array.indexOf(input);
	student_array.splice(indexToDelete,1);
	var average = calculateGradeAverage(student_array);
	renderGradeAverage(average);
}


