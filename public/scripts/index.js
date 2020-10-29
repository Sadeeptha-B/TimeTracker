firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const username = snapshot.child('Username').val(),
					role = snapshot.child('Role').val()

			updateHomePage(username, role)
		})
	}
	else {
	  // No user is signed in.
	}
  });


// FUNCTIONS TO UPDATE HOME PAGE
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
	populateProjectsToHome(username)
}

function populateProjectsToHome(username) {
    firebaseRef.child(`Users/${username}`)
	.once('value').then(function(snapshot) {
		const projects = snapshot.child('Projects').val(),
			  role = snapshot.child('Role').val()

		Object.entries(projects).forEach(project => {
			firebaseRef.child(`Projects/${project[1].ProjectName}`).once("value").then(function(snapshot) {
				var projectData = snapshot.val()

				if (!projectData.Completed && !projectData.Deleted) {
					addProject(project, projectData, role)
				}
			})
		})
	})
}

// FUNCTIONALITY FUNCTIONS
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

    // window.alert("Project Created!")
    // Bring the user to the home page after successful sign up
	displayConfirmAlert("Project Created!")
	setTimeout(function() {
			getHomePage()
	},5000);
}


// ONCLICK BUTTONS
try {
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
}
catch {;}

try {
	document.getElementById("search_edit_id_button").addEventListener("click", function() {
		var username = document.getElementById("Username").value,
			edit_section = document.getElementById("edit_container"),
			enter_email_container = document.getElementById("enter_email_container")

		if (username.length === 0) {
			displayErrorAlert("Please enter teacher's username to be edited")
			// window.alert("Please enter teacher's username to be deleted")
		}
		else {
			enter_email_container.style.display= 'none'
			edit_section.style.display = 'block'
		}
	})
}
catch {;}

try {
	document.getElementById("delete_teacher_button").addEventListener("click", async function() {
		var username = document.getElementById("delete_username_input").value

		deleteTeacher()
	})
}
catch {;}

function markProjectAsComplete(projectName) {
    var project = document.getElementById(projectName);
	
	
	firebaseRef.child(`Projects/${ProjectName}`).update({Completed: 1});
	//appends a "completed" object with value 1 into database
	displayConfirmAlert("Project completed and archived!");
	//alert user that the project was completed
	location.reload()
	//reloads the current page
}