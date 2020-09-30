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


function openModal(modalElem, isTextModal){
    if (isTextModal == true){
        for (i=1; i < arguments.length; i++){
            arguments[i].value = ""
        }
    }
    modalElem.style.display = "flex";
}


function closeModal(modalElem){
   setDisplayNone(modalElem);
}


function setDisplayNone(elem){
    elem.style.display = "none";
}