/* DOM elements to edit Project Name, Description */
    var projectName = document.getElementById("projectName");
    var description = document.getElementById("description");
    var editNameField = document.getElementById("name_field");
    var editDescField = document.getElementById("desc_field");

/* DOM elements for new task elements */
    var newTaskName = document.getElementById("task_name_input");
    var newTaskDesc = document.getElementById("task_desc_input");


/* Modals */
   var editDescModal = document.getElementById("desc_edit_overlay");
   var newTaskModal = document.getElementById("new_task");

/* DOM elements to create new tasks*/
    var template = document.getElementById("template");
    var tasksCardBody = document.getElementById("task_card_body");


populateAll();


function populateAll(){
    // Include code for retrieval of Project Name, Description
    // Include code to retrieve and populate tasks from backend

        /* Pass an object of the form
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
        to function populateTask, to display tasks
        
        Loop:
            populate(taskObject)

        */ 
}


function getNewTaskData(){
    var newTaskName = document.getElementById("task_name_input").value;
    var newTaskDesc = document.getElementById("task_desc_input").value;
    var taskStartDate = document.getElementById("task_start_date_input").value;
    var taskStartMonth = document.getElementById("task_start_month_input").value;
    var taskStartYear = document.getElementById("task_start_year_input").value;
    var taskEndDate = document.getElementById("task_end_date_input").value;
    var taskEndMonth = document.getElementById("task_end_month_input").value;
    var taskEndYear = document.getElementById("task_end_year_input").value;

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


    //Code for storing data to database

    var taskObject = {
        name: newTaskName,
        desc: newTaskDesc,
        startDate: taskStartDate,
        startMonth: taskStartMonth,
        startYear: taskStartYear,
        endDate: taskEndDate,
        endMonth: taskEndMonth,
        endYear: taskEndYear
    }

    return taskObject;
}

function populateTask(taskData){
    document.getElementById("task_heading").innerHTML = taskData.name;
    document.getElementById("task_start_date").innerHTML = taskData.startDate;
    document.getElementById("task_start_month").innerHTML = taskData.startMonth;
    document.getElementById("task_start_year").innerHTML = taskData.startYear;
    document.getElementById("task_end_date").innerHTML = taskData.endDate;
    document.getElementById("task_end_month").innerHTML = taskData.endMonth;
    document.getElementById("task_end_year").innerHTML = taskData.endYear;

    var clone = template.cloneNode(true);
    clone.removeAttribute("style");
    clone.setAttribute("id", "taskData.name")  //TODO: Set better ID, provide for delete, modify
    tasksCardBody.append(clone);
}


/* 
Click Event Listeners 
===========================================
To do all tasks related to clicks except for the opening of modals.

*/

//Edit description
    document.getElementById("edit_desc").addEventListener('click', function(){
        editNameField.value = "";
        editDescField.value = "";
        editNameField.setAttribute("placeholder", projectName.innerHTML);
        editDescField.setAttribute("placeholder", description.innerHTML);
    });
   
 
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


// Create New Task
    document.getElementById("new_task_button").addEventListener("click", function(){
        newTaskName.value = "";
        newTaskDesc.value = "";
    })


// Save New Task
    document.getElementById("add_new_task").addEventListener('click',function(){
        var taskData = getNewTaskData();
        if (taskData != undefined){
            populateTask(taskData);
            closeModal(newTaskModal);
        }
    });




/* Chart 
=========================================== */

var ctx = document.getElementById('timeContChart');
var students = ["Robyn McNamara", "Campbell Wilson", "Najam Nazar", "Nathan Companez"];
var times = [4, 7, 3, 5];

var timeContChart = new Chart(ctx, {
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

