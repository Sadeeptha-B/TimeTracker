
/* DOM elements on page */
var timeLogCardTemplate = document.getElementById("timelog_card_template");
var logCardContent = document.getElementById("logs_card_body");
var logContent = document.getElementById("log_content");

var timeLogTableRow = document.getElementById("template_table_row");
var timeLogTableBody = document.getElementById("timelog_table_body");


var statusColumn = document.getElementById("log_time_status")
var commonTaskError = document.getElementById("timelog_error")





document.getElementById("save_time_log").addEventListener('click', function(){
    clearErrors(commonTaskError);
    getDataforPopulation();
    setDisplayNone(statusColumn);
    setDisplayFlex(logContent);
});


async function getDataforPopulation(){
    var startDate = document.getElementById("start_day").value,
        startMonth = document.getElementById("start_month").value,
        startYear = document.getElementById("start_year").value,
        startHr = document.getElementById("start_hr").value,
        startMin = document.getElementById("start_min").value,
        startPeriod = document.getElementById("start_period").value;


    var endDate = document.getElementById("end_day").value,
        endMonth = document.getElementById("end_month").value,
        endYear = document.getElementById('end_year').value,
        endHr = document.getElementById('end_hr').value,
        endMin = document.getElementById('end_min').value,
        endPeriod = document.getElementById('end_period').value;

    function timeCheck(hour, period){
        if (hour == 12){
            if (period == 0){
                return 0;   // 12am = 0000hrs
            }
            else if (period == 12){
                return 12;  // 12pm = 1200hrs;
            }
        }
        else {
            return hour + period;
        }
    }

    var startHrParsed = timeCheck(parseInt(startHr), parseInt(startPeriod));
    var endHrParsed = timeCheck(parseInt(endHr), parseInt(endPeriod));

    var startDateFormat = new Date(startYear, startMonth-1, startDate, startHrParsed, startMin),
        endDateFormat = new Date(endYear, endMonth-1, endDate, endHrParsed, endMin ),
        dateValid = endDateFormat.getTime() > startDateFormat.getTime()

    console.log(startDateFormat.getDate());
        

    if (!dateValid){
        displayError("Start time should be before end time",commonTaskError);
        return;
    }

    // the work time, in hours, mins and secs:
    var timeInSecs = (endDateFormat.getTime() - startDateFormat.getTime())/1000,
        timeInMins = timeInSecs / 60,
        timeInHrs = timeInMins / 60,
        timeFormatHrs = Math.floor(timeInHrs),
        timeFormatMins = timeInMins % 60

        startTimeObject = { Date : startDateFormat.getDate().toString().padStart(2,"0"), 
                            Month : (startDateFormat.getMonth() + 1).toString().padStart(2,"0"), 
                            Year : startDateFormat.getFullYear(), 
                            Hour : startDateFormat.getHours(),
                            Minute : startDateFormat.getMinutes() },

        endTimeObject = {   Date : endDateFormat.getDate().toString().padStart(2,"0"), 
                            Month : (endDateFormat.getMonth() + 1).toString().padStart(2,"0"), 
                            Year : endDateFormat.getFullYear(), 
                            Hour : endDateFormat.getHours(),
                            Minute : endDateFormat.getMinutes() }

    populateTable(startTimeObject, endTimeObject);
    // populateRecentTimeLogs();

    var user = await firebase.auth().currentUser

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/Times`).once('value').then(function(snapshot) {
        var amount = snapshot.child(getUsername(user.email)).val(),
            noOfTasks = 1

        if (amount !== null) {
            amount = Object.entries(amount)
            noOfTasks = amount.length + 1
        }
        
        firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/Times/${getUsername(user.email)}/Time${noOfTasks}`).set({
            StartTime : startTimeObject,
            EndTime : endTimeObject,
            Duration: `${timeFormatHrs} hour(s) ${timeFormatMins} min(s)`
        })
        .then(function(){
            window.alert("Time logged!");
            // window.location.reload();
        })
    })
}

function populateTable(startTimeObject, endTimeObject){
    var startDateString = startTimeObject.Date + "/" + startTimeObject.Month + "/" + startTimeObject.Year;
    var endDateString = endTimeObject.Date + "/" + endTimeObject.Month + "/" + endTimeObject.Year;

    document.getElementById("table_start_date").innerText = startDateString;
    document.getElementById("table_end_date").innerText = endDateString;
    document.getElementById("table_start").innerText = startTimeObject.Hour +":" + startTimeObject.Minute;
    document.getElementById("table_end").innerText = endTimeObject.Hour +":" + endTimeObject.Minute;

    var clone = cloneElement(timeLogTableRow, timeLogTableBody);
    clone.removeAttribute("style");
}


/* Chart */
var ctxMyCont = document.getElementById("myContChart").getContext('2d');
var time_Array = ["2018-12-07 15:45:17", "2018-12-07 15:30:17", "2018-12-07 15:15:16", "2018-12-07 15:00:17", "2018-12-07 14:45:16", "2018-12-07 14:30:17", "2018-12-07 14:15:17", "2018-12-07 14:00:17", "2018-12-07 13:45:17", "2018-12-07 13:30:16", "2018-12-07 13:15:17", "2018-12-07 16:00:17"];
var hoursContributed = [3, 1, 0.5, 2, 5, 3, 1, 1.5, 1, 2, 4, 3];

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


// Edit task description
document.getElementById("edit_task_desc").addEventListener('click', function(){
    document.getElementById("desc_field").setAttribute("placeholder", document.getElementById("description").innerHTML);
});

// Save new task description
document.getElementById("save_desc").addEventListener("click", async function(){
    var newDesc = document.getElementById("desc_field").value.trim();

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}`).update({
        // If the description field is empty, close
        Description: newDesc.length > 0 ? newDesc : localStorage.getItem("taskDescription")
    })
    .then(function() {
        // Rename the local storage values to the new values
        if (newDesc.length > 0) {
            localStorage.setItem("taskDescription", newDesc)
        }
        window.location.reload()
    })
});


















// //JX
// function inputTimeForTask(){
// 	//task start time
// 	var startDay =  document.getElementById("start_day").value,
// 		startMonth = document.getElementById("start_month").value,
// 		startYear = document.getElementById("start_year").value,
// 		startHour = document.getElementById("start_hr").value,
// 		startMinute = document.getElementById("start_min").value,
// 		startPeriod = document.getElementById("start_period").value,
// 		militaryStartHour = startPeriod+startHour,

// 		// Putting into DD/MM/YYYY,HH:MM format
// 		startTimeFormat = startDay + "/" + startMonth + "/" + startYear + "," + militaryStartHour + ":" + startMinute,

// 	//task end time
// 		endDay = document.getElementById("end_day").value,
// 		endMonth = document.getElementById("end_month").value,
// 		endYear = document.getElementById("end_year").value,
// 		endHour = document.getElementById("end_hr").value,
// 		endMinute = document.getElementById("end_min").value,
// 		endPeriod = document.getElementById("end_period").value,
// 		militaryEndHour = endPeriod+endHour,

// 		// Putting into DD/MM/YYYY,HH:MM format
// 		endTimeFormat = endDay + "/" + endMonth + "/" + endYear + "," + militaryEndHour + ":" + endMinute,

// 	var commonProjError = document.getElementById("create_project_error");
// 	var dateValid = true;
//     var oneDayGap = false;
//     /* 
//     oneDayGap is only changed if there is a minimum of 1 day gap between inputs, if not, compare times.
// 	Initially we have valid = true; we change this value according to the criteria below:
// 	if startYear > endYear: not valid
// 	else:
// 		if startYear == endYear:
// 			if startMonth > endMonth: not valid
// 			else: 
// 				if startMonth == endMonth:
// 					if startDay > endDay: not valid
// 					else: valid
// 				else if startMonth < endMonth: valid
// 		if startYear < endYear: valid
// 	*/
// 	if (startYear > endYear){
//         dateValid = false;
// 	}
// 	else if (startYear == endYear){
// 		if (startMonth > endMonth){
//             dateValid = false;
// 		}
// 		else if (startMonth == endMonth){
// 			if (startDay > endDay){ 
//                 dateValid = false;
//             }
//             else if (startDay < endDay){
//                 oneDayGap = true;
//             }
//             else if (startDay == endDay){
//                 if (militaryStartHour > militaryEndHour || !oneDayGap){
//                     dateValid = false;
//                 }
//                 else if (militaryStartHour == militaryEndHour){
//                     if (startMinute > endMinute || !oneDayGap){
//                         dateValid =false;
//                     }
//                 }
//             }
//         }
// 	}

// 	/*
// 	if (valid = compare(startYear, endYear)){
// 		if (valid = compare(startMonth,endMonth))
// 			valid = compare(startDay, endDay);
// 	}
// 	*/

// 	if (!dateValid){
// 		window.alert("Task cannot end before it starts, or end at the same time as the start time");
// 		return;
// 	}

// 	var user = await firebase.auth().currentUser

// 	firebaseRef.child(`Projects/${localStorage.getItem(projectName)}/Tasks/${localStorage.getItem(taskName)}`).update({
// 		StartTime : startTimeFormat,
// 		EndTime : endTimeFormat
//     })
    
//     window.alert("Time logged!")
// }