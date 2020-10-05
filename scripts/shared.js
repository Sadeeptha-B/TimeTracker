// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
    apiKey: "AIzaSyAFzBnMY1ouf3kKCBzMWsOIb8DUJl-ur6o",
    authDomain: "time-tracker-web-applica-52250.firebaseapp.com",
    databaseURL: "https://time-tracker-web-applica-52250.firebaseio.com",
    projectId: "time-tracker-web-applica-52250",
    storageBucket: "time-tracker-web-applica-52250.appspot.com",
    messagingSenderId: "469326104071",
    appId: "1:469326104071:web:d7e6193b4efe7152828ca2",
    measurementId: "G-B4244K0E5J"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


/* Search functionality */

/* Provide Searchbar and Array of data to search from */
function searchSingle(searchBar, searchSpace){
    var searchValue = searchBar.value.toLowerCase();
    var foundArray = [];

    for (i=0; i < searchSpace.length; i++){
        var item = searchSpace[i].toLowerCase();
        var itemCheck = item.indexOf(searchValue);
        var found = indexToBoolean(itemCheck);

        if(found){
            foundArray.push(item);
        }
    }
    return foundArray;
}

/* Provide searchbar and pass in an array of objects of which keys need to be 
searched.
*/
function searchMultiple(searchBar, objArray){
    var searchValue = searchBar.value.toLowerCase();
    var foundArray=[];

    for (i= 0; i< objArray.length; i++){
        var obj = objArray[i];
        var criteria = Object.keys(obj);
        var found = false;

        for (j=0; j < criteria.length; j++){
            var item = obj[criteria[j]].toLowerCase();
            var itemCheck = item.indexOf(searchValue);
            found = found || indexToBoolean(itemCheck)
        }

        if (found){
            foundArray.push(objArray[i]);
        }
    }   

    return foundArray;
}


/* Populate Element */





/* Modal Controls */
function openModal(modalElem, isTextModal, ...editableElems){
    if (isTextModal == true){
        for (i= 0; i < editableElems.length; i++){
            editableElems[i].value = "";
        }
    } 
    modalElem.style.display = "flex";
}


function openConfigurableModal(modalElem, isTextModal, isCreateMode, ...editableElems){
    var createModeElems = document.querySelectorAll('[id^=create_mode]');
    var editModeElems = document.querySelectorAll('[id^=edit_mode]');


    for (i =0; i< createModeElems.length;i++){
        createModeElems[i].classList.toggle('visible', isCreateMode);
        createModeElems[i].classList.toggle('hidden', !isCreateMode);
    }

    for (i =0; i<  editModeElems.length;i++){
        editModeElems[i].classList.toggle('visible', !isCreateMode);
        editModeElems[i].classList.toggle('hidden', isCreateMode);
    }  
    openModal(modalElem, isTextModal, ...editableElems);
}


function closeModal(modalElem){
   setDisplayNone(modalElem);
}


function setDisplayNone(elem){
    elem.style.display = "none";
}

function displayError(errorMsg, errorElement){
    errorElement.innerText = errorMsg;
    errorElement.style.display="block";
}


function clearErrors(...errorDivs){
    for (i=0; i< errorDivs.length; i++){
        setDisplayNone(errorDivs[i]);
    }
}

/* Helper function */
function indexToBoolean(index){
    var value; 
     if (index === -1) {
         value = false;
     } else {
         value = true;
     }
     return value;
 };

















 function dateValidation(startDateObject, endDateObject){
    /* 
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
        
        /**
        if (valid = compare(startYear, endYear)){
            if (valid = compare(startMonth,endMonth))
                valid = compare(startDay, endDay);
        }
    */

   /* TODO: Validation for hours minutes */

   var startDay = startDateObject.startDay,
       startMonth = startDateObject.startMonth,
       startYear = startDateObject.startYear,
       endDay = endDateObject.endDay,
       endMonth = endDateObject.endMonth,
       endYear = endDateObject.endYear;

    // console.log(startDate, startMonth, startYear, endDate, endMonth, endYear);

    var startDate = new Date(startYear, startMonth, startDay);
    var endDate = new Date(endYear, endMonth, endDay);


    console.log(startDate > endDate);

    console.log(startDate.toString());
    console.log(endDate.toString());


   var dateValid = true;
   if (startYear > endYear){
      dateValid = false;
   }
    else if (startYear == endYear){
        if (startMonth > endMonth){
            dateValid = false;
            
        }
        else if (startMonth == endMonth){
             // replaced > with >= - maybe tasks are not allowed to have the same start and end date?
            if (startDate >= endDate){ 
                dateValid = false;
            }
        }
    }

    return dateValid;
}

// Putting task start and end date into DD/MM/YYYY format
function dateMonthYearFormat(startDateObject, endDateObject){
    var startDate = startDateObject.startDay,
        startMonth = startDateObject.startMonth,
        startYear = startDateObject.startYear,
        endDate = endDateObject.endDay,
        endMonth = endDateObject.endMonth,
        endYear = endDateObject.endYear;

    var startDate = startDate + "/" + startMonth + "/" + startYear,
        endDate = endDate + "/" + endMonth + "/" + endYear;

    return [startDate, endDate];
}