var template = document.getElementById("timelog_template");
var content = document.getElementById("logs_card_body");

var commonTaskError = document.getElementById("timelog_error")

experiment();
function experiment(){
    for (i=0; i< 10; i++){
        var clone = template.cloneNode(true);
        content.appendChild(clone);
    }
}




document.getElementById("save_time_log").addEventListener('click', function(){
});


var ctxMyCont = document.getElementById("myContChart").getContext('2d');
console.log(ctxMyCont);
var time_Array = ["2018-12-07 15:45:17", "2018-12-07 15:30:17", "2018-12-07 15:15:16", "2018-12-07 15:00:17", "2018-12-07 14:45:16", "2018-12-07 14:30:17", "2018-12-07 14:15:17", "2018-12-07 14:00:17", "2018-12-07 13:45:17", "2018-12-07 13:30:16", "2018-12-07 13:15:17", "2018-12-07 16:00:17"];
var hoursContributed = [3, 1, 0.5, 2, 5, 3, 1, 1.5, 1, 2, 4, 3];


    //console.log(time_Array);
    //console.log(hoursContributed);


    var myChart = new Chart(ctxMyCont, {
        type: 'bar',
        data: {
            labels: time_Array,
            datasets: [{
                label: 'Hours',
                data: hoursContributed,
                backgroundColor: "rgb(75,192, 192)"
             }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            // second: 'h:MM:SS',
                            // minute: 'h:MM',
                            // hour: 'hA',
                            day: 'MMM D',
                            month: 'YYYY MMM',
                            year: 'YYYY'
                        },                            
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'value'
                    }                        
                }]                    
            }
        }
    });























/*
function getDataforPopulation(){
    var startDate = document.getElementById("start_day").value,
        startMonth = document.getElementById("start_month").value,
        startYear = document.getElementById("start_year").value,
        startHr  = document.getElementById("start_hr").value,
        startMin = document.getElementById("start_min").value,
        startPeriod = document.getElementById("start_period").value;

    var endDate  = document.getElementById("end_day").value,
        endMonth = document.getElementById("end_month").value,
        endYear  = document.getElementById('end_year').value,
        endHr  = document.getElementById('end_hr').value,
        endMin = document.getElementById('end_min').value,
        endPeriod = document.getElementById('end_period').value;


    // TODO: Validation for Hour and Minute Inputs 

    var startDateObject ={
        startDay: startDate,
        startMonth: startMonth,
        startYear: startYear
    }

    var endDateObject ={
        endDay: endDate,
        endMonth: endMonth,
        endYear: endYear
    }

    if (!dateValidation(startDateObject, endDateObject)){
        displayError("Task cannot end before it starts, or end on the same day as the start date",commonTaskError);
        return;
    }

    //Whatever backend
    var startEndDate = dateMonthYearFormat(startDateObject, endDateObject);
} */