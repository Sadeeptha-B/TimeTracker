firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const username = snapshot.child('Username').val(),
					role = snapshot.child('Role').val()

			// Update the pages based on the user such as removing/adding restricted fucntionality
			updateHomePage(username, role)
		})
	}
	else {
	  // No user is signed in.
	}
  });

// FUNCTIONS TO UPDATE THE PAGES BASED ON THE USER
// =================================================
function updateHomePage(username, role) {
	const welcomeText = document.getElementById("welcome_text"),
		  newProjectButton = document.getElementById("new_project_button")

	if (newProjectButton) {
		if (role === 'Teacher') {
			newProjectButton.style.display = "block"
		}
		else if (role === 'Student'){
			newProjectButton.style.display = "none"
		}
	}

	// Update username at the top of the screen depending on user
	if (welcomeText) {
		welcomeText.innerHTML = "Welcome, " + username
	}

	// // Add all the projects of the user to the home page
	// if (role === 'Student') {
		populateProjects(username)
	// }
	

	
	// If project is not completed, add the project to home page regardless of teacher/student
	// If project completed, add the project to home page only for student
	// if (completed === null || (role === 'Student' && completed)) {
		
	// }
}

// FUNCTIONS TO POPULATE THE PAGE WITH PROJECTS BASED ON USER
// ======================================================================

function populateProjects(username) {
    firebaseRef.child(`Users/${username}`)
	.once('value').then(function(snapshot) {
		const projects = snapshot.child('Projects').val(),
			  role = snapshot.child('Role').val()

		Object.entries(projects).forEach(project => {addProject(project, role)})
	})
}

async function addProject(project, role) {
	firebaseRef.child(`Projects/${project[1].ProjectName}`).once("value").then(function(snapshot) {
		const projectName = snapshot.child('ProjectName').val(),
			  startDate = snapshot.child('StartDate').val(),
			  endDate = snapshot.child('EndDate').val(),
			  teacher = snapshot.child('TeacherInCharge').val(),
			  completed  = snapshot.child('Completed').val()

		if (completed === null || (role === 'Student' && completed)) {
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
			newDiv.appendChild(footerDiv)
			newDiv.appendChild(clr)
			//footerDiv.appendChild(imgEdit)
			footerDiv.appendChild(imgDelete)

			newDiv.className = "dash_project"
			newDiv.id = `${projectName}`
			newH2.className = "dash_project_head"
			newH2.textContent = project[0]

			newP.className = "project_summary"
			newP.textContent = `Lecturer: ${teacher} | Start: ${startDate} | End: ${endDate}`
			
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
			
			addProjectsEventListener(newDiv)
		
		}
	})
}

// ONCLICK FUNCTIONS
// ======================================================================

async function createProject(){
    var projectName = document.getElementById("project_name").value,
        description = document.getElementById("project_description").value,

        //project start
        startDay =  document.getElementById("start_day").value,
        startMonth = document.getElementById("start_month").value,
        startYear = document.getElementById("start_year").value,
        
        // Putting into DD/MM/YYYY format - OBSOLETE (using JS Date object now)
		// startDate = startDay + "/" + startMonth + "/" + startYear,

        //project end
        endDay = document.getElementById("end_day").value,
        endMonth = document.getElementById("end_month").value,
        endYear = document.getElementById("end_year").value

        // Putting into DD/MM/YYYY format - OBSOLETE (using JS Date object now)
		// endDate = endDay + "/" + endMonth + "/" + endYear;
		
		var start = new Date(startYear, startMonth-1, startDay);
		var end = new Date(endYear, endMonth-1, endDay);

	var commonProjError = document.getElementById("create_project_error");
    var dateValid = end.getTime() > start.getTime();

	/*
	if (startYear > endYear){
		dateValid = false;
	}
	else if (startYear == endYear){
		if (startMonth > endMonth){
			dateValid = false;
		}
		else if (startMonth == endMonth){
			if (startDay >= endDay){ 
				dateValid = false;
			}
		}
	}
	*/

    if (!dateValid){
		displayError("Project cannot end before it starts, or end on the same day as the start date",commonProjError);
		return;
	}
	
    if (description.length == 0){
        description = "N/A";
	}

	// Putting into DD/MM/YYYY format
	var startDateString = start.toLocaleDateString('en-GB');
    var endDateString = end.toLocaleDateString('en-GB');

	var user = await firebase.auth().currentUser

	// Store project information under Projects
	firebaseRef.child(`Projects/${projectName}`).set({
		ProjectName: projectName,
        Description: description,
        StartDate: startDateString,
        EndDate: endDateString,
        TeacherInCharge: getUsername(user.email)
	})
	
	// Update projects the current user is in charge of
	firebaseRef.child(`Users/${getUsername(user.email)}/Projects/${projectName}`).update({
		ProjectName: projectName
	})

	// ScriptManager.RegisterStartupScript(
	// displayConfirmAlert("Project Created!"), window.location =' "../html/home-teacherview.html",
	// true);
	


	displayConfirmAlert("Project Created!")
	setTimeout(3000);
    // window.alert("Project Created!")
    // Bring the user to the home page after successful sign up
    window.location.href = "../html/home-teacherview.html";
}

document.getElementById("search_id_button").addEventListener("click", function() {
	var username = document.getElementById("delete_username_input").value,
		confirmation_section = document.getElementById("confirm_delete_container"),
		enter_username_container = document.getElementById("enter_username_container")

	if (username.length === 0) {
		displayErrorAlert("Please enter teacher's username to be deleted")
		// window.alert("Please enter teacher's username to be deleted")
	}
	else {
		enter_username_container.style.display= 'none'
		confirmation_section.style.display = 'block'
	}
})

document.getElementById("delete_teacher_button").addEventListener("click", function() {
	var username = document.getElementById("delete_username_input").value
	
	firebaseRef.child(`Users/${username}`).remove().then(function() {
		getHomePage()
	})
})