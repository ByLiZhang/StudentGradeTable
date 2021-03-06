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
	var $body = $('body');
	$(document).on({
		ajaxStart: function(){
			$body.addClass('loading');
			$('#modal p').text('Waiting for response from server...');
		},
		ajaxComplete: function(){
			$body.removeClass('loading');
		}
	});
	getData().then(ok, failed);
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
	var retrieveBtn = $('.btn-info'); 
	addBtn.on('click', handleAddClicked);
	cancelBtn.on('click', handleCancelClick);
	retrieveBtn.on('click', handleDataRetrieve);
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
		addData(studentData).then(addOk, failed);
	}
	clearAddStudentFormInputs();
	getData().then(ok, failed);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
	var name = $('#studentName');
	var course = $('#course');
	var grade = $('#studentGrade');
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

	// deletBtn.on('click', async function(){
	// 	try {
	// 		const deletionSuccessful = await Promise.resolve(deleteData(studentObj).then(deletionSuccess, deletionFailure));
	// 		console.log('deletionSuccessful =', deletionSuccessful);
	// 		if (deletionSuccessful === true) {
	// 			removeStudent(studentObj);
	// 			tableRow.remove(); // equivalent to $(this).parent().parent().remove(), but uses lexical scope;
	// 		} else {
	// 			$('#modal>p').text('Please note: you can only delete the entries that you authored.');
	// 			$('#modal').addClass('show');
	// 			setTimeout(function(){
	// 				$('#modal').removeClass('show');
	// 			}, 3000);
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 	}

	deletBtn.on('click', function(){
		removeStudent(studentObj);
		deleteData(studentObj);
		tableRow.remove(); // equivalent to $(this).parent().parent().remove(), but uses lexical scope;

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
function calculateGradeAverage(studentArray){
	var runningTotal = 0;
	for(var i = 0; i < studentArray.length; i++){
		runningTotal += parseFloat(studentArray[i].grade);
	}
	var result = parseFloat((runningTotal/studentArray.length).toFixed(2)).toString();
	if (result === 'NaN') {
		return 0;
	} else {
		return result;
	}
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
	$('.avgGrade').text(average);
}

/**
 * removeStudent - removes the student object from the student array
 * @param  {object}
 * @return {undefined}
 */
function removeStudent(studentObj) {
	var indexToDelete = student_array.indexOf(studentObj);
	student_array.splice(indexToDelete,1);
	var average = calculateGradeAverage(student_array);
	renderGradeAverage(average);
}

function handleDataRetrieve(){
	getData().then(ok, failed);
}

function getData() {
	var promise = {
		then: function(resolve, reject){
			this.reject = reject;
			this.resolve = resolve;
		}
	}
	$.ajax({
		url: './select.php',
		data: {},
		//url: 'http://s-apis.learningfuze.com/sgt/get',
		//data: {'api_key': '2tomJplkJs',
			// 'force-failure': 'server',
			// 'force-failure': 'request',
			// 'force-failure': 'timeout'
		//},
		method: 'POST',
		dataType: 'json',
		success: function(data){
			promise.resolve(data);
		},
		error: function(){
			promise.reject('Failed to retrieve data.');
		}
	});
	return promise;	
}

function ok(receivedData){
	console.log('Data received successfully', receivedData);
	student_array = receivedData;
	updateStudentList(student_array);
}

function failed(message) {
	console.log(message);
}

function addData(studentObj) {
	var promise = {
		then: function(resolve, reject){
			this.reject = reject;
			this.resolve = resolve;
		}
	}
	$.ajax({
		url: 'insert.php',
		data: {
				'name': studentObj.name,
				'course': studentObj.course,
				'force-failure': 'timeout',
				'grade': studentObj.grade
		},
		method: 'POST',
		dataType: 'json',
		success: function(response){
			promise.resolve(response);
		},
		error: function(err){
			console.log(err);
			promise.reject('data upload failed');
		}
	});
	return promise;
}

function addOk(data) {
	console.log('Adding data into server database: ', data);
	updateStudentList(student_array);
}

function deleteData(studentObj) {
	var promise = {
		then: function(resolve, reject){
			this.reject = reject;
			this.resolve = resolve;
		}
	}
	$.ajax({
		url: './delete.php',
		data: {
				student_id: studentObj.id
		},
		method: 'POST',
		dataType: 'json',
		success: function(response){
			console.log('Deleting data from server database: ', response);
		},
		error: function(err) {
			promise.reject(err);
		}
	});
	return promise;
}

function deletionSuccess(response) {
	console.log('deleting data from server', response.success);
	return new Promise((resolve, reject) => {
		console.log('new promise triggered', response.success);
		resolve(response);
	});
}

function deletionFailure(err) {
	return err;
}