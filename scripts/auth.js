const firebaseRef = firebase.database().ref(),
	  teacherOnly = document.querySelectorAll('.teacherOnly')

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		
	} else {
	  // No user is signed in.
	}
  });  

function signup() {
	var	userEmail = String(document.getElementById("Email").value),
        userPass = String(document.getElementById("Password").value),
		userConfirmPass = String(document.getElementById("ConfirmPassword").value)

	// sign up the user
	if (userPass === userConfirmPass && userPass.length >= 6) {
		firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
		.then(function() {
			writeUserData(userEmail)

			window.alert("Sign Up successful!")
			// Bring the user to the home page after successful sign up
			if (teacherOrStudent(userEmail) === 'Teacher') {
				window.location.href = "../html/home-adminview.html";
			}
			else {
				window.location.href = "../html/login.html";
			}
		})
		.catch(function(error) {
			var errorCode = error.code
			var errorMessage = error.message

			console.log(errorCode)
			window.alert(errorMessage)
		})
	}
	else if (userPass.length < 6) {
		window.alert("Password needs to be at least 6 characters long")
	}
	else if (userPass !== userConfirmPass) {
		window.alert("Password does not match Confirm Password")
	}
}

function writeUserData(email) {
	var username = getUsername(email),
		userRole = teacherOrStudent(email)
	
	firebaseRef.child(`Users/${username}`).set({
		Username: username,
		Email: email,
		Role: userRole
	})
}

function getUsername(email) {
	for (i = 0; i < email.length; i++) {
		if (email[i] === "@") {
			return email.slice(0, i)
		}
	}
}

function teacherOrStudent(email) {
	if (email.indexOf('student') !== -1) {
		return 'Student'
	}
	return 'Teacher'
}

function getHomePage(username) {
	firebaseRef.child(`Users/${username}`)
	.once("value")
	.then(function(snapshot) {
		const role = snapshot.child("Role").val()
		if (role === "Student") {
			window.location.href = "../html/home.html";
			
		}
		else if (role === "Teacher") {
			window.location.href = "../html/home-teacherview.html";
			
		}
		else {
			window.location.href = "../html/home-adminview.html";
		}
	})
}

function login() {
	var userEmail = String(document.getElementById("userEmail").value);
	var userPass = String(document.getElementById("userPass").value);

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
	.then(function() {
		// User is signed in.
		window.alert("User signed in.");
		getHomePage(getUsername(userEmail))
		
		// window.location.href = "../html/home.html";
	})
	.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
		console.log(errorCode)
		window.alert("Error :" + errorMessage);
	});
}

function logout(){
	firebase.auth().signOut().then(function() {
		window.alert('Signed Out')
		window.location.href = "../html/login.html";
	}, function(error) {
		window.alert('Sign Out Error', error)
	});
}
