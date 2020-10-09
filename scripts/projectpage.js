/*
HTML contains modal open, close for direct button click
Modal open close, after saving, editing, is done in this script.
*/

/* DOM elements on Page */
    var projectName = document.getElementById("project_name");
    var description = document.getElementById("description");

    var taskTemplate = document.getElementById("task_template");
    var tasksCardBody = document.getElementById("task_card_body");

/* Modals elements */
    var editDescModal = document.getElementById("desc_edit_overlay");
    var updateTaskModal = document.getElementById("create_edit_task");
    var addStudentModal = document.getElementById("add_student");
    var assignTaskModal = document.getElementById("assign_task_overlay");

/* Elements contained within modals */
   // Name, Edit Description
    var editDescField = document.getElementById("desc_field");

  // New task name, description
    var newTaskName = document.getElementById("task_name_input");
    var newTaskDesc = document.getElementById("task_desc_input");
    var taskNameError = document.getElementById("task_name_error");
    var commonTaskError = document.getElementById("update_task_error");


/* Important : Do not delete. */
window.myNameSpace ={
    taskCount : 0,
    editId: 0
};


// Code for the addition of a individual task
document.getElementById("create_mode_btn").addEventListener('click',function(){
    clearErrors(taskNameError, commonTaskError);
    var taskData = getNewTaskData(localStorage.getItem("projectName"));  // Get data, validate, and store in backend
    if (taskData != undefined){
        populateTask(localStorage.getItem("projectName"), taskData.TaskName);  // Display data
        closeModal(updateTaskModal);
    }
});
//Code for editing a task
document.getElementById("edit_mode_btn").addEventListener('click', function(){
    clearErrors(taskNameError, commonTaskError);
    var taskData = getNewTaskData(localStorage.getItem("projectName"));  // Get data, validate, and store in backend
    if (taskData != undefined){
        deleteTask(myNameSpace.editId);
        populateTask(localStorage.getItem("projectName"), taskData.TaskName);  // Display data
        closeModal(updateTaskModal);
    }
})

function getNewTaskData(project){
    var newTaskName = document.getElementById("task_name_input").value,
        newTaskDesc = document.getElementById("task_desc_input").value,
        taskStartDate = document.getElementById("task_start_date_input").value,
        taskStartMonth = document.getElementById("task_start_month_input").value,
        taskStartYear = document.getElementById("task_start_year_input").value,
        taskEndDate = document.getElementById("task_end_date_input").value,
        taskEndMonth = document.getElementById("task_end_month_input").value,
        taskEndYear = document.getElementById("task_end_year_input").value

    // Validation Code
    newTaskName = newTaskName.trim();
    if (newTaskName == ""){
        displayError("Task Name cannot be empty", taskNameError);
        return;
    }

    var start = new Date(taskStartYear, taskStartMonth-1, taskStartDate);
    var startDate = taskStartDate + "/" + taskStartMonth + "/" + taskStartYear;
    var end = new Date(taskEndYear, taskEndMonth-1, taskEndDate);
    var dateValid = end.getTime() > start.getTime();

    if (!dateValid){
        displayError("Task cannot end before it starts, or end on the same day as the start date",commonTaskError);
        return;
    }

    if (newTaskDesc.trim().length == 0){
        newTaskDesc = "N/A";
    }


    var startDateString = start.toLocaleDateString('en-GB');
    var endDateString = end.toLocaleDateString('en-GB');
   
   
    var taskObject = {TaskName: newTaskName,
                      Description: newTaskDesc,
                      StartDate: startDateString,
                      EndDate: endDateString,
                      Project: project}

    // Store the task information under Tasks
    // firebaseRef.child(`Tasks/${newTaskName}`).set(taskObject)

    // Update tasks the project has
    firebaseRef.child(`Projects/${project}/Tasks/${newTaskName}`).set(taskObject)

    return taskObject;
}



/* Code to display a new task addition (Display only!) */
function populateTask(projectName, taskName){
    myNameSpace.taskCount += 1;
    var taskID = myNameSpace.taskCount;

    firebaseRef.child(`Projects/${projectName}/Tasks/${taskName}`)
    .once('value').then(function(snapshot) {
        const name = snapshot.child('TaskName').val(),
              startDate = snapshot.child('StartDate').val(),
              endDate = snapshot.child('EndDate').val(),
              assignedTo = snapshot.child('AssignedTo').val(),
              project = snapshot.child('Project').val()

        document.getElementById("task_heading").innerHTML = name;
        document.getElementById("task_start_date").innerHTML = startDate;
        document.getElementById("task_end_date").innerHTML = endDate;
        
        if (assignedTo) {
            document.getElementById("assignee").innerHTML = assignedTo;
        }
        else {
            document.getElementById("assignee").innerHTML = "No user is assigned to this task yet";
        }
        
        var deleteButton = document.getElementById("delete_task");
        var editButton = document.getElementById("edit_task");

        deleteButton.setAttribute("onclick","deleteTask("+taskID+")");
        editButton.setAttribute("onclick", "editTask("+taskID+")")

        var clone = taskTemplate.cloneNode(true);
        clone.removeAttribute("style");
        clone.id = "task_" + taskID
        clone.setAttribute("data-taskName", taskName)
        clone.setAttribute("data-projectName", project)
        tasksCardBody.append(clone);
        addTasksEventListener(projectName, clone)
    })
}

/* Delete a task */
function deleteTask(index){
    event.stopPropagation();       // Check if there is a better way to make an element clickable within a clickable div
    var task = document.getElementById("task_" + index);

    /* Delete from backend */
    firebaseRef.child(`Projects/${task.getAttribute("data-projectName")}/Tasks/${task.getAttribute("data-taskName")}`).remove()

    tasksCardBody.removeChild(task);
}


function editTask(index){
    event.stopPropagation();
    openConfigurableModal(updateTaskModal, true, false, newTaskName, newTaskDesc);
    myNameSpace.editId = index;
    var task = document.getElementById("task_" + index);

    document.removeChild(task)
    getNewTaskData(task.getAttribute("data-projectName"))
    
    closeModal(updateTaskModal)
}


/*
Click Event Listeners
===========================================
To do all tasks related to clicks except for the opening and closing of modals.

*/

//Edit description
document.getElementById("edit_desc").addEventListener('click', function(){
    editDescField.setAttribute("placeholder", description.innerHTML);
});
//TODO: ZS: also please save the name and desc in the DB for retrieving later


//Save new Description
document.getElementById("save_desc").addEventListener("click", async function(){
    var newDesc = editDescField.value.trim();

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}`).update({
        // If the description field is empty, close
        Description: newDesc.length > 0 ? newDesc : localStorage.getItem("description")
    })
    .then(function() {
        // Rename the local storage values to the new values
        if (newDesc.length > 0) {
            localStorage.setItem("description", newDesc)
        }
        window.location.reload()
    })
});

// Assigning task to students
document.getElementById("assign_task_button").addEventListener('click', function() {
    const currentProject = localStorage.getItem('projectName')
    
    firebaseRef.child(`Projects/${currentProject}`)
    .once('value').then(function(snapshot) {
        const tasks = snapshot.child('Tasks').val(),
              selectField = document.getElementById('task_select')
              

        Object.entries(tasks).forEach(task => {
            const newOption = document.createElement('option')
            selectField.appendChild(newOption)

            newOption.textContent = task[1].TaskName
            newOption.value = task[1].TaskName
        })
    })
})

// Saving new students assigned to specific tasks
document.getElementById("assign_button").addEventListener('click', async function() {
    const task = document.getElementById('task_select').value
    var user = await firebase.auth().currentUser

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${task}`)
    .update({AssignedTo: getUsername(user.email)})

    closeModal(assign_task_overlay)
    window.location.reload()
})
    

/* Chart
=========================================== */

var ctxTimeContPie = document.getElementById('timeContPie');
var ctxTimeContBar = document.getElementById('timeContBar');
var students = ["Robyn McNamara", "Campbell Wilson", "Najam Nazar", "Nathan Companez"];
var times = [4, 7, 3, 5];


var timeContPie = new Chart(ctxTimeContPie, {
    type: 'pie',
    data:{
        labels: students,
        datasets: [{
            label: 'Numbers',
            legend: "Time contributed",
            data: times
        }],
    },
    options: {
        //  Code for title if needed
        /*
        title: {
            display: true,
            text: "Time Contribution By Hour",
            fontFamily: 'Poppins, Verdana, sans-serif',
            fontSize: 16,
            fontColor: "black"
        },
        */
        plugins:{
            colorschemes:{
                scheme: 'office.Slipstream6',
                custom: customColorFunction
            }
        },
        responsive:true,
        tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];  //get the concerned dataset

                var component = data.labels[tooltipItem.index];

                //calculate the total of this data set
                var total = dataset.data.reduce(function(previousValue, currentValue) {
                  return previousValue + currentValue;
                });

                //get the current items value
                var currentValue = dataset.data[tooltipItem.index];


                //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                var percentage = Math.floor(((currentValue/total) * 100)+0.5);

                return component + " : " + percentage + "%";
              }
            }
          }
    }
});

var timeContBar = new Chart(ctxTimeContBar, {
    type:'bar',
    data:{
        labels: students,
        datasets: [{
            label: 'Hours',
            legend: "Time contributed",
            backgroundColor: "rgb(75,192, 192)",
            data: times
        }],
    },
    options:{
        scales:{
            yAxes: [{
                display: true,
                ticks:{
                    beginAtZero:true
                }
            }]
        }
    }
});


var customColorFunction = function(schemeColors){
    var myColors = [ "rgba(178, 102, 255)",
                     "rgba(153, 255, 204)",
                     "rgba(204, 0, 102)"  ,
                     "rgba(204, 204, 0)"];

    Array.prototype.push.apply(schemeColors, myColors);
    return schemeColors;
}


/* Helper functions */
function compare(shouldBeSmaller, shouldBeLarger){
    var valid = true;
    if (shouldBeSmaller > shouldBeLarger){
        valid = false;
    }
    return valid;
}

function laterThan(startVal, endVal){
	return endVal > startVal;
}

function sameTimeAs(startVal, endVal){
	return endVal == startVal;
}






//Date validation code
/* REDUNDANT SOON: using JS Date objects to compare date/time and calculate time
	Initially we have valid = true; we change this value according to the criteria below:
	if taskStartYear > taskEndYear: not valid
	else:
		if taskStartYear == taskEndYear:
			if taskStartMonth > taskEndMonth: not valid
			else: 
				if taskStartMonth == taskEndMonth:
					if taskStartDate > taskEndDate: not valid
					else: valid
				else if taskStartMonth < taskEndMonth: valid
		if taskStartYear < taskEndYear: valid
    *//*
	if (taskStartYear > taskEndYear){
        dateValid = false;
	}
	else if (taskStartYear == taskEndYear){
		if (taskStartMonth > taskEndMonth){
            dateValid = false;
            
		}
		else if (taskStartMonth == taskEndMonth){
			if (taskStartDate >= taskEndDate){ 
				dateValid = false;
            }
            // replaced > with >= - maybe tasks are not allowed to have the same start and end date?
		}
    } */
    
// /* Searches */
const searchBar = document.getElementById("search_student");
searchBar.setAttribute("oninput", "searchSingle(searchBar, students)");    //Use global student list from backend

