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

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const role = snapshot.child('Role').val()

			updateProjectPage(role)
		})
	}
	else {
        window.location.href="index.html"
    }
});

// FUNCTION TO UPDATE PROJECT PAGE
function updateProjectPage(role) {
	const projectField = document.getElementById("project_name"),
		  descriptionField = document.getElementById("description"),
		  addMemberButton = document.getElementById("add_member"),
		  editDescriptionButton = document.getElementById("edit_desc"),
		  addTaskButton = document.getElementById("new_task_button"),
		  assignTaskButton = document.getElementById("assign_task_button")

	// Update the fields with project information
	projectField.textContent = localStorage.getItem("projectName")
	descriptionField.textContent = localStorage.getItem("description")

    const makeElementsVisible = () => {

    }

	// Remove add member button for students but show for teachers
    // Remove the add and assign task button for teachers but show for students
    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}`).once('value').then(function(snapshot) {
        var deleted = snapshot.child('Deleted').val()
        var completed = snapshot.child('Completed').val()
        //UNSURE

        if (!deleted && !completed) {
            if (addMemberButton && editDescriptionButton) {
                if (role === 'Teacher') {
                    addMemberButton.style.display = "block";
                    editDescriptionButton.style.display = "block";
        
                    addTaskButton.style.display = "none";
                    assignTaskButton.style.display = "none";
                }
                else if (role === 'Student') {
                    addMemberButton.style.display = "none";
                    editDescriptionButton.style.display = "none";
        
                    addTaskButton.style.display = "block";
                    assignTaskButton.style.display = "block";
                }
            }
        }
        else {
            addMemberButton.style.display = "none";
            editDescriptionButton.style.display = "none";

            addTaskButton.style.display = "none";
            assignTaskButton.style.display = "none";
        }
    }).then(function() {
        Object.entries(JSON.parse(localStorage.getItem("members"))).forEach(member => {addMembers(member)})
    
    
        // Add all the tasks of the project to the project page
        populateTasks(localStorage.getItem("projectName"));
    
        // Update the charts of contribution
        updateChartsInProjectPage()
    })
}

function populateTasks(projectName){
    firebaseRef.child(`Projects/${projectName}/Tasks`)
    .once('value').then(function(snapshot) {
        const tasks = snapshot.val();
        if (tasks) {
            Object.entries(tasks).forEach(task => populateTask(projectName, task[1].TaskName));
        } else{
            document.getElementById("no_tasks").setAttribute("style", "display:flex");
            document.getElementById("assign_task_button").setAttribute("style", "display:none");
        }
    })
}

/* Code to display a new task addition (Display only!) */
function populateTask(projectName, taskName){
    document.getElementById("no_tasks").setAttribute("style", "display:none");
    document.getElementById("assign_task_button").setAttribute("style", "display:inline-block");

    myNameSpace.taskCount += 1;
    var taskID = myNameSpace.taskCount;

    firebaseRef.child(`Projects/${projectName}`)
    .once('value').then(function(snapshot) {
        const name = snapshot.child(`Tasks/${taskName}/TaskName`).val(),
              startDate = snapshot.child(`Tasks/${taskName}/StartDate`).val(),
              endDate = snapshot.child(`Tasks/${taskName}/EndDate`).val(),
              assignedTo = snapshot.child(`Tasks/${taskName}/AssignedTo`).val(),
              project = snapshot.child(`Tasks/${taskName}/Project`).val(),
              deleted = snapshot.child(`Deleted`).val(),
              completed = snapshot.child('Completed').val()

        var taskHeading = document.getElementById("task_heading"),
            taskStartDate = document.getElementById("task_start_date"),
            taskEndDate = document.getElementById("task_end_date")
        
        if (completed)      {taskHeading.innerHTML = name + " - Completed";}
        else                {taskHeading.innerHTML = name;}

        taskStartDate.innerHTML = startDate;
        taskEndDate.innerHTML = endDate;
        
        

        if (assignedTo) {
            document.getElementById("assignee").innerHTML = ""
            Object.entries(assignedTo).forEach(member => {
                document.getElementById("assignee").innerHTML = member[1].Username + " " + document.getElementById("assignee").innerHTML
            })
        }
        else {
            document.getElementById("assignee").innerHTML = "No user is assigned to this task yet";
        }
        
        var deleteButton = document.getElementById("delete_task");
        var editButton = document.getElementById("edit_task");
        var markAsCmpltBtn = document.getElementById("mark_cmplt_task");

        if (deleted) {
            document.getElementById("action_pane").style.display = 'none'
        }
        else {
            deleteButton.setAttribute("onclick","deleteTask("+taskID+")");
            editButton.setAttribute("onclick", "editTask("+taskID+")")
            markAsCmpltBtn.setAttribute("onclick", "markTaskAsComplete("+taskID+")")
        }

        var clone = cloneElement(taskTemplate, tasksCardBody);
        clone.removeAttribute("style");
        clone.id = "task_" + taskID
        clone.setAttribute("data-taskname", taskName)
        clone.setAttribute("data-projectname", project)
        addTasksEventListener(projectName, clone)
    })
}

// FUNCTIONALITY FUNCTIONS
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

function addStudentToProject() {
	var projectName = document.getElementById("project_name").textContent,
		newMember = document.getElementById("search_student").value;

	firebaseRef.child(`Projects/${projectName}/Members/${newMember}`).set({
			Username: newMember
	})

	// Add the projects to the student
	firebaseRef.child(`Users/${newMember}/Projects/${projectName}`).set({
		ProjectName: projectName
	})
	
	// This part of the code tries to dynamically place the names of the students as it is added
	firebaseRef.child(`Projects/${projectName}`)
	.once('value').then(function(snapshot) {
		const members = snapshot.child('Members').val()

		var membersObject = {}
		
		Object.entries(members).forEach(member => {
			const name = member[1].Username
			membersObject[name] = {"Username": name}
		})
		
		localStorage.setItem("members", JSON.stringify(membersObject))
	}).then(function() {
		closeModal(add_student)

		window.location.reload()
	})
}

function displayStudentList() {
  let studentList = document.getElementById("search_student");
  let output = "";
  firebaseRef.child(`Students`)
  .once('value').then(function(snapshot){
    const students = snapshot.val()
		for (let i = 0; i < Object.entries(students).length; i++){
			output += `<option value = "${Object.entries(students)[i][0]}" style = "font-color:black">${Object.entries(students)[i][0]}</option>`
		}
		studentList.innerHTML = output;
  })
}

/* Delete a task */
function deleteTask(index){
    event.stopPropagation();       // Check if there is a better way to make an element clickable within a clickable div
    var task = document.getElementById("task_" + index);
    window.myNameSpace.taskCount -= 1


    /* Delete from backend */
    firebaseRef.child(`Projects/${task.getAttribute("data-projectname")}/Tasks/${task.getAttribute("data-taskname")}`).remove()
    tasksCardBody.removeChild(task);
    if(window.myNameSpace.taskCount == 0){
        document.getElementById("no_tasks").setAttribute("style", "display:flex");
        document.getElementById("assign_task_button").setAttribute("style", "display:none");
    }
}


function editTask(index){
    event.stopPropagation();
    myNameSpace.editId = index;
    var task = document.getElementById("task_" + index);
    openConfigurableModal(updateTaskModal, true, false, newTaskName, newTaskDesc);
    

    //document.removeChild(task)
    //closeModal(updateTaskModal)
}

function markTaskAsComplete(index){
    event.stopPropagation();
    var task = document.getElementById("task_" + index);
    var taskName = task.getAttribute("data-taskname");
    //tasksCardBody.removeChild(task);

    //marks task as complete and refreshes page
    firebaseRef.child(`Projects/${task.getAttribute("data-projectname")}/Tasks/${taskName}`).update({Completed: 1});
    displayConfirmAlert("Task completed and archived!");
    location.reload()
}


/*
Click Event Listeners
===========================================
To do all tasks related to clicks except for the opening and closing of modals.

*/
// Code for the addition of a individual task
document.getElementById("create_mode_btn").addEventListener('click',function(){
    clearErrors(taskNameError, commonTaskError);
    var taskData = getNewTaskData(localStorage.getItem("projectName"));  // Get data, validate, and store in backend
    if (taskData != undefined){
        console.log("I run");
        populateTask(localStorage.getItem("projectName"), taskData.TaskName);  // Display data
        closeModal(updateTaskModal);
    }
});
//Code for editing a task
document.getElementById("edit_mode_btn").addEventListener('click', function(){
    clearErrors(taskNameError, commonTaskError);
    var taskData = getNewTaskData(localStorage.getItem("projectName"));  // Get data, validate, and store in backend
    if (taskData != undefined){
        var task = document.getElementById("task_" + myNameSpace.editId),
            projectName = task.getAttribute("data-projectname"),
            taskName = task.getAttribute("data-taskname")

        firebaseRef.child(`Projects/${projectName}/Tasks/${taskName}`).once("value").then(function(snapshot) {
            const assignedTo = snapshot.child("AssignedTo").val(),
                times = snapshot.child("Times").val()
            firebaseRef.child(`Projects/${projectName}/Tasks/${newTaskName.value}`).update({
                AssignedTo: assignedTo,
                Times: times
            })
        }).then(function() {
            deleteTask(myNameSpace.editId);
            populateTask(localStorage.getItem("projectName"), taskData.TaskName);  // Display data
            closeModal(updateTaskModal);
        })
    }
})

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

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${task}/AssignedTo/${getUsername(user.email)}`)
    .set({
        Username: getUsername(user.email)
    })
    .then(function() {
        closeModal(assign_task_overlay)
        window.location.reload()
    })
})
    

/* Chart
=========================================== */
function updateChartsInProjectPage() {
    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/TotalTimeSpent`).once("value").then(function(snapshot) {
        const timeSpentArray = snapshot.val(),
              students = Object.keys(timeSpentArray),
              timesObject = Object.values(timeSpentArray)
        var times = []
        timesObject.forEach(time => {times.push(time.Duration)})
        var ctxTimeContPie = document.getElementById('timeContPie');
        var ctxTimeContBar = document.getElementById('timeContBar');

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
    })
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

