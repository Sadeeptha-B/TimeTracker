firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const username = snapshot.child('Username').val(),
					role = snapshot.child('Role').val()

			// Update the currnent page such as removing/adding restricted buttons
			updatePage(username, role)

			try { updateProjectPage() } catch(err) { ; }

			try { updateTaskPage() } catch(err) { ; }

			// Add all the projects of the user to the home page
			populateProjects(username)
			populateTasks(localStorage.getItem("projectName"));
		})
		// Event listener is then set up to see if any projects are trying to be accessed
		// If yes, alter projectpage.html to suit the called project's information
		.then(function() {
			const projects = document.getElementsByClassName("dash_project"),
				  tasks = document.getElementById("task_card_body")
			
			// SetTimeouts are placed as need to give time to load projects/tasks
			if (projects) {
				setTimeout(function () {
					Array.from(projects).forEach(project => addProjectsEventListener(project))
				}, 1000)
			}
				
			if (tasks) {
				setTimeout(function() {
					Array.from(tasks.getElementsByClassName("task")).forEach(task => addTasksEventListener(task))
				}, 1000)
			}
		})
	}
	else {
	  // No user is signed in.
	}
  });

// FUNCTION TO ALTER THE PAGE BASED ON THE CURRENT USER LOGGED IN
// ======================================================================

function updatePage(username, role) {
	const welcomeText = document.getElementById("welcome_text"),
		  addTaskButton = document.getElementById("new_task_button"),
		  assignTaskButton = document.getElementById("assign_task_button"),
		  timeInputButton = document.getElementById("time_input_button"),
		  addMemberButton = document.getElementById("add_member"),
		  editDescriptionButton = document.getElementById("edit_desc")

	// Upadate username at the top of the screen depending on user
	if (welcomeText) {
		welcomeText.innerHTML = "Welcome, " + username
	}

	// Remove the add and assign task button for teachers but show for students
	if (addTaskButton && assignTaskButton) {
		if (role === 'Teacher') {
			addTaskButton.style.display = "none"
			assignTaskButton.style.display = "none"
		}
		else if (role === 'Student'){
			addTaskButton.style.display = "block"
			assignTaskButton.style.display = "block"
		}
	}

	// Remove time input button for teachers but show for students
	if (timeInputButton) {
		if (role === 'Teacher') {
			timeInputButton.style.display = "none"
		}
		else if (role === 'Student') {
			timeInputButton.style.display = "block"
		}
	}

	// Remove add member button for students but show for teachers
	if (addMemberButton && editDescriptionButton) {
		if (role === 'Teacher') {
			addMemberButton.style.display = "block"
			editDescriptionButton.style.display = "block"
		}
		else if (role === 'Student') {
			addMemberButton.style.display = "none"
			editDescriptionButton.style.display = "none"
		}
	}
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

function addTasksEventListener(task){
	task.addEventListener("click", function(){
		firebaseRef.child(`Tasks/${task.getAttribute("data-taskName")}`)
		.once('value').then(function(snapshot) {
			const taskName = snapshot.child('TaskName').val(),
				  taskDescription = snapshot.child('Description').val(),
				  projectName = document.getElementById("project_name").textContent,
				  projectDescription = document.getElementById("description").textContent,
				  members = document.getElementById("member_card_content").getElementsByClassName("member")
			
			// To store the names of the members in the project in the form of an objecy
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
		}).then(function() {
			// Move to the task page once data has been stored
			window.location.href = "../html/taskpage.html"
		})
	});
}


// FUNCTIONS TO UPDATE PAGES/TASKS BASED ON THE CURRENT TASK/PROJECT SELECTED
// ======================================================================

function updateProjectPage() {
	const projectField = document.getElementById("project_name"),
		  descriptionField = document.getElementById("description")

	// Update the fields with project information
	projectField.textContent = localStorage.getItem("projectName")
	descriptionField.textContent = localStorage.getItem("description")

	Object.entries(JSON.parse(localStorage.getItem("members"))).forEach(member => {addMembers(member)})
}

function addMembers(member) {
	var member_field = document.getElementById('member_card_content'),
		newDiv = document.createElement("div")

	member_field.appendChild(newDiv)
	newDiv.id = member[1].Username
	newDiv.className = "member"
	newDiv.textContent = member[1].Username
}

function updateTaskPage() {
	const taskField = document.getElementById("taskName"),
		  descriptionField = document.getElementById("description")

	// Update the fields with project information
	taskField.textContent = localStorage.getItem("taskName")
	descriptionField.textContent = localStorage.getItem("taskDescription")
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

			  dashboard = document.getElementById("dash_container"),
			  newDiv = document.createElement("div"),
			  newH2 = document.createElement("h2"),
			  newP = document.createElement("p")
			  imgEdit = document.createElement("input")
			  imgDelete = document.createElement("delete")
			  footerDiv = document.createElement("div")


		dashboard.appendChild(newDiv)
		dashboard.appendChild(footerDiv)
		newDiv.appendChild(newH2)
		newDiv.appendChild(newP)
		// footerDiv.appendChild(imgEdit)
		// footerDiv.appendChild(imgDelete)

		newDiv.className = "dash_project"
		newDiv.id = `${projectName}`
		newH2.className = "dash_project_head"
		newH2.textContent = project[0]

		newP.className = "project_summary"
		newP.textContent = `Lecturer: ${teacher} | Start: ${startDate} | End: ${endDate}`
		
		/* Not working
		footerDiv.className = "action_pane"
		imgEdit.type="image"
		imgEdit.src="../imgs/edit-16.png"
		imgEdit.id="edit_project"
		imgEdit.class="std_component"

		imgEdit.type="image"
		imgDelete.src="../imgs/delete-16.png"
		imgDelete.id="edit_project"
		imgDelete.class="std_component"
		*/
	})
}

function populateTasks(projectName){
    firebaseRef.child(`Projects/${projectName}`)
    .once('value').then(function(snapshot) {
		const tasks = snapshot.child('Tasks').val();
        Object.entries(tasks).map(task => populateTask(task[1].TaskName));
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
        
        // Putting into DD/MM/YYYY format
        startDate = startDay + "/" + startMonth + "/" + startYear,

        //project end
        endDay = document.getElementById("end_day").value,
        endMonth = document.getElementById("end_month").value,
        endYear = document.getElementById("end_year").value,

        // Putting into DD/MM/YYYY format
        endDate = endDay + "/" + endMonth + "/" + endYear

	var commonProjError = document.getElementById("create_project_error");
	var dateValid = true;

    /* 
	Initially we have valid = true; we change this value according to the criteria below:
	if startYear > endYear: not valid
	else:
		if startYear == endYear:
			if startMonth > endMonth: not valid
			else: 
				if startMonth == endMonth:
					if startDay > endDay: not valid
					else: valid
				else if startMonth < endMonth: valid
		if startYear < endYear: valid
	*/
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

	/*
    if (valid = compare(startYear, endYear)){
        if (valid = compare(startMonth,endMonth))
            valid = compare(startDay, endDay);
	}
	*/

    if (!dateValid){
		displayError("Project cannot end before it starts, or end on the same day as the start date",commonProjError);
		return;
	}
	
    if (description.length == 0){
        description = "N/A";
	}

	var user = await firebase.auth().currentUser

	// Store project information under Projects
	firebaseRef.child(`Projects/${projectName}`).set({
		ProjectName: projectName,
        Description: description,
        StartDate: startDate,
        EndDate: endDate,
        TeacherInCharge: getUsername(user.email)
	})
	
	// Update projects the current user is in charge of
	firebaseRef.child(`Users/${getUsername(user.email)}/Projects/${projectName}`).update({
		ProjectName: projectName
	})
	
    window.alert("Project Created!")
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