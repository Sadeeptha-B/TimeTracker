//Edit description
document.getElementById("edit_desc").addEventListener('click', function(){
    document.querySelector('.bg-modal').style.display = 'flex';
});

//Close
document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.bg-modal').style.display = 'none';
})


//Chart
var ctx = document.getElementById('myChart');
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
    }
});


//Edit description placeholders
var name = document.getElementById("projectName").innerHTML;
document.getElementById("name_field").setAttribute("placeholder", name);

var description = document.getElementById("description").innerText;
document.getElementById("desc_field").setAttribute("placeholder", description);