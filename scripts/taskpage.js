
/* DOM elements on page */
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
    getDataforPopulation();
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



    var startDateFormat = new Date(startYear, startMonth-1, startDate, parseInt(startHr) + parseInt(startPeriod)  , startMin);
    var endDateFormat = new Date(endYear, endMonth-1, endDate, parseInt(endHr) + parseInt(endPeriod) , endMin );
    var dateValid = endDateFormat.getTime() > startDateFormat.getTime();

    if (!dateValid){
        displayError("Task cannot end before it starts, or end on the same day as the start date",commonTaskError);
        return;
    }

    var user = await firebase.auth().currentUser

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}`).once('value').then(function(snapshot) {
        var amount = snapshot.child(getUsername(user.email)).val()

    var startTimeObject = {     Month :  startDateFormat.getMonth() + 1 , 
                                Date : startDateFormat.getDate() , 
                                Year : startDateFormat.getFullYear() , 
                                Hour : startDateFormat.getHours(),
                                Minute : startDateFormat.getMinutes() },

        endTimeObject = {       Month :  endDateFormat.getMonth() + 1 , 
                                Date : endDateFormat.getDate() , 
                                Year : endDateFormat.getFullYear() , 
                                Hour : endDateFormat.getHours(),
                                Minute : endDateFormat.getMinutes()   }

        if (amount==null){
            firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/${getUsername(user.email)}/Time1`).set({
                StartTime : startTimeObject,
                EndTime : endTimeObject
            }).then(function(){
                window.alert("Time logged!");
                window.location.reload();
            })
        }

        else{
            amount = Object.entries(amount)
            firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/${getUsername(user.email)}/Time${amount.length + 1}`).set({
                StartTime : startTimeObject,
                EndTime : endTimeObject
            }).then(function(){
                window.alert("Time logged!");
                window.location.reload();
            })
        }



    })
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
















/*
function getDataforPopulation(){
    var startDate = document.getElementById("start_day").value;
    var startMonth = document.getElementById("start_month").value;
    var startYear = document.getElementById("start_year").value;
    var startHr = document.getElementById("start_hr").value;
    var startMin = document.getElementById("start_min").value;
    var startPeriod = document.getElementById("start_period").value;
    var start;
    if (startHr == 12) { // 12am
        start = new Date(startYear, startMonth-1, startDate, startPeriod, startMin)
    }
    else{
        start = new Date(startYear, startMonth-1, startDate, startHr+startPeriod, startMin)
    }

    var endDate = document.getElementById("end_day").value; 
    var endMonth = document.getElementById("end_month").value;
    var endYear = document.getElementById('end_year').value;
    var endHr = document.getElementById('end_hr').value;
    var endMin = document.getElementById('end_min').value;
    var endPeriod = document.getElementById('end_period').value;
    var end;
    if (endHr == 12) { // 12am
        end = new Date(endYear, endMonth-1, endDate, endPeriod, endMin)
    }
    else{
        end = new Date(endYear, endMonth-1, endDate, endHr+endPeriod, endMin)
    }
    // We need the values from these elements

    var workTime = end.getTime() - start.getTime();
    var dateValid = end.getTime() > start.getTime();
    // getTime() gives you the time elapsed after a fixed point in time in milliseconds, use this to get contribution time
    if (!dateValid){
        displayError("Task cannot end before it starts, or end on the same day as the start date",commonTaskError);
        return;
    }

    if (dateValid){
        var workHrs = ((time/1000)/60).toFixed(2);
        // toPrecision(x) rounds value to x-1 decimal places
        // can use parseInt() to get integer value;
    }

    /* REDUNDANT SOON: using JS Date objects to compare date/time and calculate time
    // date & time validation
	if (startYear > endYear){
        dateValid = false;
	}
	else if (startYear == endYear){
		if (startMonth > endMonth){
            dateValid = false;
            
		}
		else if (startMonth == endMonth){
			if (startDate > endDate){ 
				dateValid = false;
            }
            // tasks can be done within the same day
		}
    }
    // if we start at pm (12) and end at am (0), we must start and end on different days
    if (startPeriod > endPeriod){
        if (startYear == endYear && startMonth == endMonth && startDate == endDate){
            dateValid = false;
        }
    }
    if (startPeriod == endPeriod){
        if (startHr > endHr){
            dateValid = false;
        }
        else if (startMin > endMin){
            dateValid = false;
        }
    }
    
}*/