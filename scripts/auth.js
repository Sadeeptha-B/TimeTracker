const firebaseRef = firebase.database().ref()

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		const username = getUsername(user.email),
			  userRole = getUserRole(username)
		console.log(username)
		console.log(userRole)

		// if (getUserRole(getUsername(user.email)) === "Student") {
		// 	window.location.href = "../html/home.html";
		// }
		// else if (getUserRole(getUsername(user.email)) === "Teacher") {
		// 	window.location.href = "../html/home-teacherview.html";
		// }
		// else {
		// 	window.location.href = "../html/home-adminview.html";
		// }
	} else {
	  // No user is signed in.
	}
  });

function signup(userRole) {
	var	userEmail = String(document.getElementById("Email").value),
        userPass = String(document.getElementById("Password").value),
		userConfirmPass = String(document.getElementById("ConfirmPassword").value)

	// sign up the user
	if (userPass === userConfirmPass && userPass.length >= 6) {
		firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
		.then(function() {
			writeUserData(userEmail, userRole)

			window.alert("Sign Up successful!")
			// Bring the user to the home page after successful sign up
			window.location.href = "../html/home.html";
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

function writeUserData(email, userRole) {
	var username = getUsername(email)
	
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

function getUserRole(username) {
	firebaseRef.child(`Users/${username}`)
	.once("value")
	.then(function(snapshot) {
		return String(snapshot.child("Role").val())
	})
	console.log(role)
}

function login() {
	var userEmail = String(document.getElementById("userEmail").value);
	var userPass = String(document.getElementById("userPass").value);

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
	.then(function() {
		// User is signed in.
		window.alert("User signed in.");
		
		window.location.href = "../html/home.html";
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
