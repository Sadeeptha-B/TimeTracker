var projectName = document.getElementById("projectName");
var description = document.getElementById("description");
var editNameField = document.getElementById("name_field");
var editDescField = document.getElementById("desc_field");




//Chart
var ctx = document.getElementById('timeContChart');
var students = ["Robyn McNamara", "Campbell Wilson", "Najam Nazar", "Nathan Companez"];
var times = [4, 7, 3, 5];

//TODO : Modify for random color select
var myChart = new Chart(ctx, {
    type: 'pie',
    data:{
        labels: students,
        datasets: [{
            label: 'Numbers',
            legend: "Time contributed",
            data: times,
            backgroundColor:[ "rgba(178, 102, 255)",
                              "rgba(153, 255, 204)",
                              "rgba(204, 0, 102)"  ,
                              "rgba(204, 204, 0)"]
        }], 
    },
    options: {
        responsive:true,
    }
});


/*Click Event Listeners */
    //Edit description
    document.getElementById("edit_desc").addEventListener('click', function(){
        editNameField.value = "";
        editDescField.value = "";
        
        editNameField.setAttribute("placeholder", projectName.innerHTML);
        editDescField.setAttribute("placeholder", description.innerHTML);
        document.querySelector('.bg-modal').style.display = 'flex';
    });

    
    //Close Edit desciption modal
    document.querySelector('.close').addEventListener('click', function(){
        document.querySelector('.bg-modal').style.display = 'none';
    })

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
