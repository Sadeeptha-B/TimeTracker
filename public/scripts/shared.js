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

const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

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


/* Alerts */
    function displayConfirmAlert(msg){
        var elem = document.querySelector("div[class^='alert confirmation_alert']")
        document.getElementById("confirm_msg").innerText = msg;

        elem.setAttribute("class", "alert confirmation_alert show")
        setTimeout(function(){
            elem.setAttribute("class", "alert confirmation_alert hide")
        }, 5000);
    }

    function displayErrorAlert(msg){
        var elem = document.querySelector("div[class^='alert error_alert']")
        document.getElementById("error_msg").innerText = msg;

        elem.setAttribute("class", "alert error_alert show")

        //Will be removed once close is clickable
        setTimeout(function(){
            elem.setAttribute("class", "alert error_alert hide")
        }, 10000);
    }

    function closeAlert(){
        var elems = document.querySelectorAll("div[class^='alert']")

        for (i=0; i < elems.length; i++){
            elems[i].classList.toggle("hide")
        }
    }


function cloneElement(elem, parent){
    var clone = elem.cloneNode(true);
    parent.appendChild(clone);
    return clone;
}

var customColorFunction = function(schemeColors){
    var myColors = [ "rgba(178, 102, 255)",
                     "rgba(153, 255, 204)",
                     "rgba(204, 0, 102)"  ,
                     "rgba(204, 204, 0)"];

    Array.prototype.push.apply(schemeColors, myColors);
    return schemeColors;
}


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


/* Display Controls */
function setDisplayNone(elem){
    elem.style.display = "none";
}

function setDisplayFlex(elem){
    elem.style.display="flex";
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


Date.prototype.onlyDate = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
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

 function getUsername(email) {
	for (i = 0; i < email.length; i++) {
		if (email[i] === "@") {
			return email.slice(0, i)
		}
	}
}

function isSchoolAccount(email) {
	if (email.indexOf('monash') !== -1) {
		return true
	}
	else {
		return false
	}
}

function getRole(email) {
	if (email.indexOf('student') !== -1) {
		return 'Student'
	}
	return 'Teacher'

}

// FUNCTIONS TO ADD EVENT LISTENERS TO ALL THE PROJECT/TASK ELEMENTS
// ======================================================================
function addProjectsEventListener(project){
	project.addEventListener("click", function(){
		firebaseRef.child(`Projects/${project.id}`)
		.once('value').then(function(snapshot) {
			const projectName = snapshot.child('ProjectName').val(),
				  description = snapshot.child('Description').val(),
				  members = snapshot.child('Members').val()  // Object containing all the students

			localStorage.setItem("projectName", projectName)
			localStorage.setItem("description", description)
			localStorage.setItem("members", JSON.stringify(members))
			window.location.href = "../html/projectpage.html"
		})
	});
}

function addTasksEventListener(project, task){
	task.addEventListener("click", function(){
		firebaseRef.child(`Projects/${project}/Tasks/${task.getAttribute("data-taskName")}`)
		.once('value').then(function(snapshot) {
			const taskName = snapshot.child('TaskName').val(),
				  taskDescription = snapshot.child('Description').val(),
				  assignedTo = snapshot.child('AssignedTo').val(),
				  projectName = document.getElementById("project_name").textContent,
				  projectDescription = document.getElementById("description").textContent,
				  members = document.getElementById("member_card_content").getElementsByClassName("member")

			// To store the names of the members in the project in the form of an object
			var membersObject = {}

			localStorage.setItem("projectName", projectName)
			localStorage.setItem("description", projectDescription)
			localStorage.setItem("taskName", taskName)
			localStorage.setItem("taskDescription", taskDescription)

			// Get the name of each member and store in the object
			Array.from(members).forEach(member => {
				const name = member.textContent
				membersObject[name] = {"Username": name}
			})
			localStorage.setItem("members", JSON.stringify(membersObject))

			// Get the name of each member that is assigned to the task and store in the object
			// if (assignedTo) {
			// 	Array.from(assignedTo).forEach(member => {
			// 		const name = member.textContent
			// 		assignedToObject[name] = {"Username": name}
			// 	})
			localStorage.setItem("assignedTo", JSON.stringify(assignedTo))
			// }
		})
		.then(function() {
			// Move to the task page once data has been stored
			window.location.href = "../html/taskpage.html"
		})
	});
}

function addMembers(member) {
	var member_field = document.getElementById('member_card_content'),
		newDiv = document.createElement("div")

	member_field.appendChild(newDiv)
	newDiv.id = member[1].Username
	newDiv.className = "member"
	newDiv.textContent = member[1].Username

}

// Function used by archives and index to populate projects
function addProject(project, projectData, role) {
	const projectName = projectData.ProjectName,
			startDate = projectData.StartDate,
			endDate = projectData.EndDate,
			teacher = projectData.TeacherInCharge,
			completed  = projectData.Completed

	var	dashboard = document.getElementById("dash_container"),
		newDiv = document.createElement("div"),
		newH2 = document.createElement("h2"),
		newP = document.createElement("p"),
		//imgEdit = document.createElement("input"),
		imgDelete = document.createElement("input"),
		footerDiv = document.createElement("div"),
		clr = document.createElement("div")

	dashboard.appendChild(newDiv)
	newDiv.appendChild(newH2)
	newDiv.appendChild(newP)

	newDiv.className = "dash_project"
	newDiv.id = `${projectName}`
	newH2.className = "dash_project_head"

	if (completed) {
		newH2.innerHTML = project[0] + " - Completed "
	}
	else {
		newH2.innerHTML = project[0]
	}

	newP.className = "project_summary"
	newP.textContent = `Lecturer: ${teacher} | Start: ${startDate} | End: ${endDate}`

	// Only teachers has acccess to delete project button
	if (role === 'Teacher') {
		newDiv.appendChild(footerDiv)
		newDiv.appendChild(clr)
		//footerDiv.appendChild(imgEdit)
		footerDiv.appendChild(imgDelete)

		footerDiv.className = "action_pane"
		/*
		imgEdit.type="image"
		imgEdit.src="../imgs/edit-16.png"
		imgEdit.id="edit_project"
		imgEdit.className="std_component"
		*/

		imgDelete.type="image"
		imgDelete.src="../imgs/delete-16.png"
		imgDelete.id="delete_task"
		imgDelete.className="std_component"

		clr.className = "clr"
	}

	addProjectsEventListener(newDiv)
}
