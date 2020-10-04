var template = document.getElementById("timelog_template");
var content = document.getElementById("logs_card_body");



document.getElementById("save_time_log").addEventListener('click', function(){
    getDataforPopulation();
});



function getDataforPopulation(){
    var startDate = document.getElementById("start_day");
    var startMonth = document.getElementById("start_month");
    var startYear = document.getElementById("start_year");
    var startHr  = document.getElementById("start_hr");
    var startMin = document.getElementById("start_min");
    var startPeriod = document.getElementById("start_period")

    var endDate  = document.getElementById("end_day"); 
    var endMonth = document.getElementById("end_month");
    var endYear  = document.getElementById('end_year');
    var endHr  = document.getElementById('end_hr');
    var endMin = document.getElementById('end_min');
    var endPeriod = document.getElementById('end_period');

    var dateValid = true;

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
    // if we start at pm and end at am, we must start and end on different days, but endDate >= startDate
    if (startPeriod < endPeriod){
        if (startYear == endYear && startMonth == endMonth && startDate == endDate){
            dateValid = false;
        }
    }


}
