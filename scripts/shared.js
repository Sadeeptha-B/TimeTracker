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


//Close popups
var closeButtons = document.querySelectorAll('.close');
console.log(closeButtons);
for (var i= 0; i < closeButtons.length; i++) {
    var elem = closeButtons[i];
    elem.addEventListener('click', function(){
        makeModalsInvisible();
    })
}


function makeModalsInvisible(){
    var modals = document.querySelectorAll(".bg-modal");
    for (var i= 0; i < modals.length; i++){
        var modal = modals[i];
        modal.style.display="none";
    }
}