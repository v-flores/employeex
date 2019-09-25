// Userlist data array for filling in info box
var employeeListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

// Employee Name link click
$('#employeeList table tbody').on('click', 'td a.linkshowemployee', showEmployeeInfo);

// Add Employee button click
$('#btnAddEmployee').on('click', addEmployee);

// Delete Employee link click
$('#employeeList table tbody').on('click', 'td a.linkdeleteemployee', deleteEmployee);

});


// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users/employeelist', function( data ) {

  // Stick our user data array into a userlist variable in the global object
  employeeListData = data;


    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowemployee" rel="' + this.name + '">' + this.name + '</a></td>';
      tableContent += '<td>' + this.position + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteemployee" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#employeeList table tbody').html(tableContent);    
  });  
};

// Show User Info
function showEmployeeInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();
  
    // Retrieve username from link rel attribute
    var thisEmployeeName = $(this).attr('rel');
  
    // Get Index of object based on id value
    var arrayPosition = employeeListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisEmployeeName);
    // Get our User Object
    var thisEmployeeObject = employeeListData[arrayPosition];

    //Populate Info Box
    $('#employeeInfoName').text(thisEmployeeObject.name);
    $('#employeeInfoAge').text(thisEmployeeObject.age);
    $('#employeeInfoGender').text(thisEmployeeObject.gender);
    $('#employeeInfoOffice').text(thisEmployeeObject.office);
    $('#employeeInfoPosition').text(thisEmployeeObject.position);
    $('#employeeInfoSalary').text(thisEmployeeObject.salary);
    
};

// Add Employee
function addEmployee(event) {
    event.preventDefault();
  
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addEmployee input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
  
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
  
      // If it is, compile all user info into one object
      var newEmployee = {
        'name': $('#addEmployee fieldset input#inputEmployeeName').val(),
        'position': $('#addEmployee fieldset input#inputEmployeePosition').val(),
        'salary': $('#addEmployee fieldset input#inputEmployeeSalary').val(),
        'age': $('#addEmployee fieldset input#inputEmployeeAge').val(),
        'office': $('#addEmployee fieldset input#inputEmployeeOffice').val(),
        'gender': $('#addEmployee fieldset input#inputEmployeeGender').val()
      }
  
      // Use AJAX to post the object to our adduser service
      $.ajax({
        type: 'POST',
        data: newEmployee,
        url: '/users/addemployee',
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addEmployee fieldset input').val('');
  
          // Update the table
          populateTable();
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
  
        }
      });
    }
    else {
      // If errorCount is more than 0, error out
      alert('Please fill in all fields');
      return false;
    }
  };
// Delete Employee
function deleteEmployee(event) {

    event.preventDefault();
  
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this employee?');
  
    // Check and make sure the employee confirmed
    if (confirmation === true) {
  
      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/users/deleteemployee/' + $(this).attr('rel')
      }).done(function( response ) {
  
        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
          alert('Error: ' + response.msg);
        }
  
        // Update the table
        populateTable();
  
      });
  
    }
    else {
  
      // If they said no to the confirm, do nothing
      return false;
  
    }
  
  };