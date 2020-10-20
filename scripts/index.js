firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const username = snapshot.child('Username').val(),
					role = snapshot.child('Role').val()

			// Update the pages based on the user such as removing/adding restricted fucntionality
			try { updateHomePage(username, role) } catch(err) { ; }

			try { updateProjectPage(role) } catch(err) { ; }

			try { updateTaskPage(username, role) } catch(err) { ; }

			// Add all the projects of the user to the home page
			populateProjects(username)

			// Add all the tasks of the project to the project page
			populateTasks(localStorage.getItem("projectName"));
		})
	}
	else {
	  // No user is signed in.
	}
  });

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


// FUNCTIONS TO UPDATE THE PAGES BASED ON THE USER
// ======================================================================
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

	
}

function updateProjectPage(role) {
	const projectField = document.getElementById("project_name"),
		  descriptionField = document.getElementById("description"),
		  addMemberButton = document.getElementById("add_member"),
		  editDescriptionButton = document.getElementById("edit_desc"),
		  addTaskButton = document.getElementById("new_task_button"),
		  assignTaskButton = document.getElementById("assign_task_button")

	// Update the fields with project information
	projectField.textContent = localStorage.getItem("projectName")
	descriptionField.textContent = localStorage.getItem("description")

	// Remove add member button for students but show for teachers
	// Remove the add and assign task button for teachers but show for students
	if (addMemberButton && editDescriptionButton) {
		if (role === 'Teacher') {
			addMemberButton.style.display = "block";
			editDescriptionButton.style.display = "block";

			addTaskButton.style.display = "none";
			assignTaskButton.style.display = "none";
		}
		else if (role === 'Student') {
			addMemberButton.style.display = "none";
			editDescriptionButton.style.display = "none";

			addTaskButton.style.display = "block";
			assignTaskButton.style.display = "block";
		}
	}

	Object.entries(JSON.parse(localStorage.getItem("members"))).forEach(member => {addMembers(member)})
	
	updateChartsInProjectPage()

}

function updateTaskPage(username, role) {
	const taskField = document.getElementById("taskName"),
		  descriptionField = document.getElementById("description"),
		  editTaskDescriptionButton = document.getElementById("edit_task_desc"),
		  submitTimeButton = document.getElementById("save_time_log"),
		  planContBtn = document.getElementById("plan_cont_btn"),
		  newLogBtn   = document.getElementById("new_log_btn"),
		  markCompltBtn = document.getElementById("mark_complt_btn")

	// Update the fields with project information
	taskField.textContent = localStorage.getItem("taskName")
	descriptionField.textContent = localStorage.getItem("taskDescription")
	Object.entries(JSON.parse(localStorage.getItem("assignedTo"))).forEach(member => {addMembers(member)})

	// Remove task description button for teachers but show for students
	// Remove time input button for teachers but show for students
	if (editTaskDescriptionButton && submitTimeButton) {
		if (role === 'Teacher') {
			markCompltBtn.style.display="inline-block";
			planContBtn.style.display = "none"
			newLogBtn.style.display = "none"
			editTaskDescriptionButton.style.display = "none"
			submitTimeButton.style.display = "none"
			
		}
		else if (role === 'Student') {
			firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/AssignedTo/${username}`)
			.once('value').then(function(snapshot) {
				if (snapshot.val()) {
					markCompltBtn.style.display="inline-block";
					newLogBtn.style.display = "inline-block"
					planContBtn.style.display="inline-block"
					editTaskDescriptionButton.style.display = "inline-block"
					submitTimeButton.style.display = "inline-block"
				}
				else {
					markCompltBtn.style.display="none";
					newLogBtn.style.display = "none"
					planContBtn.style.display="none"
					editTaskDescriptionButton.style.display = "none"
					submitTimeButton.style.display = "none"
				}
			})
		}
	}

}

function addMembers(member) {
	var member_field = document.getElementById('member_card_content'),
		newDiv = document.createElement("div")

	member_field.appendChild(newDiv)
	newDiv.id = member[1].Username
	newDiv.className = "member"
	newDiv.textContent = member[1].Username
	
}

// FUNCTIONS TO POPULATE THE PAGE WITH PROJECTS/TASKS BASED ON USER/PROJECT RESPECTIVELY
// ======================================================================

function populateProjects(username) {
    firebaseRef.child(`Users/${username}`)
	.once('value').then(function(snapshot) {
		const projects = snapshot.child('Projects').val()
		Object.entries(projects).forEach(project => {addProject(project)})
	})
}

function addProject(project) {
	firebaseRef.child(`Projects/${project[1].ProjectName}`).once("value").then(function(snapshot) {
		const projectName = snapshot.child('ProjectName').val(),
			  startDate = snapshot.child('StartDate').val(),
			  endDate = snapshot.child('EndDate').val(),
			  teacher = snapshot.child('TeacherInCharge').val(),
			  completed  = snapshot.child('Completed').val()

		// Only add project to home page if it is not completed
		if (completed === null) {
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

function populateTasks(projectName){
    firebaseRef.child(`Projects/${projectName}/Tasks`)
    .once('value').then(function(snapshot) {
		const tasks = snapshot.val();
        Object.entries(tasks).forEach(task => populateTask(projectName, task[1].TaskName));
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

function addStudentToProject() {
	var projectName = document.getElementById("project_name").textContent,
		newMember = document.getElementById("search_student").value;

	firebaseRef.child(`Projects/${projectName}/Members/${newMember}`).set({
			Username: newMember
	})

	// Add the projects to the student
	firebaseRef.child(`Users/${newMember}/Projects/${projectName}`).set({
		ProjectName: projectName
	})
	
	// This part of the code tries to dynamically place the names of the students as it is added
	firebaseRef.child(`Projects/${projectName}`)
	.once('value').then(function(snapshot) {
		const members = snapshot.child('Members').val()

		var membersObject = {}
		
		Object.entries(members).forEach(member => {
			const name = member[1].Username

			membersObject[name] = {"Username": name}
		})
		
		localStorage.setItem("members", JSON.stringify(membersObject))
	}).then(function() {
		closeModal(add_student)

		window.location.reload()
	})
}

function displayStudentList() {
  let studentList = document.getElementById("search_student");
  let output = "";
  firebaseRef.child(`Students`)
  .once('value').then(function(snapshot){
    const students = snapshot.val()
		for (let i = 0; i < Object.entries(students).length; i++){
			output += `<option value = "${Object.entries(students)[i][0]}" style = "font-color:black">${Object.entries(students)[i][0]}</option>`
		}
		studentList.innerHTML = output;
  })
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