/* DOM elements to edit Project Name, Description */
var projectName = document.getElementById("projectName");
var description = document.getElementById("description");
var editNameField = document.getElementById("name_field");
var editDescField = document.getElementById("desc_field");

/* DOM elements to create new tasks*/
var template = document.getElementById("template");
var tasksCard = document.getElementById("task_card_body");


// Set placeholder values before first click of Edit Description: Not essential
editNameField.setAttribute("placeholder", projectName.innerHTML);
editDescField.setAttribute("placeholder", description.innerHTML);



/* Click Event Listeners */
/*=========================================*/
//Edit description
    document.getElementById("edit_desc").addEventListener('click', function(){
        editNameField.value = "";
        editDescField.value = "";
        
        editNameField.setAttribute("placeholder", projectName.innerHTML);
        editDescField.setAttribute("placeholder", description.innerHTML);
        document.getElementById('desc_edit_overlay').style.display = 'flex';
    });
   
 
//Modify Project Name, Description
    document.getElementById("save_desc").addEventListener("click",function(){
        newName = editNameField.value;
        newDesc = editDescField.value;

        if (newName.length != 0)
            projectName.innerText = newName;

        if (newDesc.length != 0)
            description.innerText = newDesc;

        document.querySelector('.bg-modal').style.display = 'none';
    });


 // Save New Task
    document.getElementById("add_new_task").addEventListener('click',function(){

    });


/* Chart */
/*=========================================*/
var ctx = document.getElementById('timeContChart');
var students = ["Robyn McNamara", "Campbell Wilson", "Najam Nazar", "Nathan Companez"];
var times = [4, 7, 3, 5];

// Chart.defaults.global.maintainAspectRatio = false;
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


