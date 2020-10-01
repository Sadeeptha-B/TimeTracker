/*
HTML contains modal open, close for direct button click
Modal open close, after saving, editing, is done in this script.
*/

/* DOM elements on Page */
    var projectName = document.getElementById("project_name");
    var description = document.getElementById("description");

    var template = document.getElementById("template");
    var tasksCardBody = document.getElementById("task_card_body");

/* Modals elements */
    var editDescModal = document.getElementById("desc_edit_overlay");
    var updateTaskModal = document.getElementById("create_edit_task");
    var addStudentModal = document.getElementById("add_student");
    var assignTaskModal = document.getElementById("assign_task_overlay");

/* Elements contained within modals */
   // Name, Edit Description
    var editNameField = document.getElementById("name_field");
    var editDescField = document.getElementById("desc_field");

  // New task name, description
    var newTaskName = document.getElementById("task_name_input");
    var newTaskDesc = document.getElementById("task_desc_input");


/* Important : Do not delete. */
window.myNameSpace ={
    taskCount : 0,
    editId: 0
};



/* Load all data required data from backend. Called upon page load */
populateAll();


function populateAll(){
    // firebaseRef.child(`Tasks/${getUsername(user.email)}`)
	// 			   .once('value').then(function(snapshot) {
	// 				const username = snapshot.child('Username').val()
                    

	// 			  })
    // Include code for retrieval of Project Name, Description
    // Include code to retrieve tasks from backend
    
    /*To display tasks, pass retrieved tasks into function populateTask(taskObject) where
            taskObject = {
                name:
                desc:
                startDate:
                startMonth:
                startYear:
                endDate:
                endMonth:
                endYear:
            }
        
        Loop:
            populate(taskObject)
     */ 
}


// Code for the addition of a individual task
document.getElementById("create_mode_btn").addEventListener('click',function(){
    var taskData = getNewTaskData();               // Get data, validate, and store in backend
    if (taskData != undefined){
        populateTask(taskData);                   // Display data
        closeModal(updateTaskModal);
    }
});


function getNewTaskData(){
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
        //error message
        return;
    }

    var valid = true;

    if (valid = compare(taskStartYear, taskEndYear)){
        if (valid = compare(taskStartMonth,taskEndMonth))
            valid = compare(taskStartDate, taskEndDate);
    }

    if (!valid){
        return;
    }

    // Putting task start and end date into DD/MM/YYYY format
    var startDate = taskStartDate + "/" + taskStartMonth + "/" + taskStartYear,
        endDate = taskEndDate + "/" + taskEndMonth + "/" + taskEndYear,
        taskObject = {TaskName: newTaskName,
                      Description: newTaskDesc,
                      StartDate: startDate,
                      EndDate: endDate}


    
    // Store the task information under Tasks
    firebaseRef.child(`Tasks/${newTaskName}`).set({
        TaskName: newTaskName,
        Description: newTaskDesc,
        StartDate: startDate,
        EndDate: endDate
    })

    // Update tasks the project has
    firebaseRef.child(`Projects/Tasks/${newTaskName}`).set({
        TaskName: newTaskName
    })

    return taskObject;
}



/* Code to display a new task addition (Display only!) */
function populateTask(taskData){
    myNameSpace.taskCount += 1;
    document.getElementById("task_heading").innerHTML = taskData.TaskName;
    document.getElementById("task_start_date").innerHTML = taskData.StartDate;
    document.getElementById("task_end_date").innerHTML = taskData.EndDate;
    
    var deleteButton = document.getElementById("delete_task");
    var editButton = document.getElementById("edit_task");

    deleteButton.setAttribute("onclick","deleteTask("+myNameSpace.taskCount+")");
    editButton.setAttribute("onclick", "editTask("+myNameSpace.taskCount+")")

    var clone = template.cloneNode(true);
    clone.removeAttribute("style");
    clone.setAttribute("id" , "task_" + myNameSpace.taskCount); 
    tasksCardBody.append(clone);
}



//Code for editing a task
document.getElementById("edit_mode_btn").addEventListener('click', function(){
    var taskData = getNewTaskData();               // Get data, validate, and store in backend
    if (taskData != undefined){
        deleteTask(myNameSpace.editId);
        populateTask(taskData);                   // Display data
        closeModal(updateTaskModal);
    }
})


/* Delete a task */
function deleteTask(index){
    event.stopPropagation();       // Check if there is a better way to make an element clickable within a clickable div
    var task = document.getElementById("task_" + index);
    tasksCardBody.removeChild(task);

    /* Delete from backend */
}


function editTask(index){
    event.stopPropagation();
    openConfigurableModal(updateTaskModal, true, false, newTaskName, newTaskDesc);
    myNameSpace.editId = index;
}


/* 
Click Event Listeners 
===========================================
To do all tasks related to clicks except for the opening and closing of modals.

*/

    //Edit description
    document.getElementById("edit_desc").addEventListener('click', function(){
        editNameField.setAttribute("placeholder", projectName.innerHTML);
        editDescField.setAttribute("placeholder", description.innerHTML);
    });
    //ZS: also please save the name and desc in the DB for retrieving later


    //Save new Project Name, Description
    document.getElementById("save_desc").addEventListener("click",function(){
        var newName = editNameField.value.trim();
        var newDesc = editDescField.value.trim();

    // Include code to modify project name and project description on backend

    if (newName.length != 0)
        projectName.innerText = newName;

    if (newDesc.length != 0)
        description.innerText = newDesc;

    closeModal(editDescModal);
    });


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
        //Error message
        valid = false;
    }
    return valid;
}


// /* Searches */
const searchBar = document.getElementById("search_student");
searchBar.setAttribute("oninput", "searchSingle(searchBar, students)");    //Use global student list from backend