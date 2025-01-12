import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
const firebaseConfig = {
    apiKey: "AIzaSyBu5-fE69WdhHWBR7-2U3NGMm2YgGb6fgo",
    authDomain: "sphere-858fc.firebaseapp.com",
    projectId: "sphere-858fc",
    storageBucket: "sphere-858fc.appspot.com",
    messagingSenderId: "683722942494",
    appId: "1:683722942494:web:61517cb2450ef4284b260f"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  // Signup function
    const loginForm = document.getElementById('loginform');
    const signupform = document.getElementById('signupform');
   document.getElementById("submit1").addEventListener("click",()=>{
    const username=document.getElementById("username2").value;
    const password=document.getElementById("password2").value;
    signInWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    console.log(user);
    document.getElementById("errormsg").innerHTML="Login successful";
    document.getElementById("form").style.display="none";
    document.getElementById("errormsg").style.color="green";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    errorm("Something went wrong..");

  });
  document.getElementById("username2").value="";
  document.getElementById("password2").value="";
 

   })
   document.getElementById("submit2").addEventListener("click",()=>{
    const username=document.getElementById("username1").value;
    const password=document.getElementById("password1").value;
    const cnfpassword=document.getElementById("passwordconf1").value;
if(password==cnfpassword){
    createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      // ...
      console.log(user);
    document.getElementById("errormsg").innerHTML="You are registered";
    document.getElementById("errormsg").style.color="green";


    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    errorm("Something went wrong..");
    });}
    

    document.getElementById("username1").value="";
    document.getElementById("password1").value="";
    document.getElementById("passwordconf1").value="";

})
function signout(){
  const auth = getAuth();
  signOut(auth).then(() => {
  console.log("signedout")
  errorm("");

}).catch((error) => {
  // An error happened.
  console.log("error happened");
  const errorMessage="Something went wrong try again";
  errorm(errorMessage);

});
}
document.getElementById("logout").addEventListener("click",()=>{
    signout();
    
var elements = document.getElementsByClassName("logout");
 // Loop through the elements and set the property 
  for (var i = 0; i < elements.length; i++) { 
    elements[i].style.display="none"; 
}
});
function errorm(msg){
    document.getElementById("errormsg").innerHTML=msg;
    document.getElementById("errormsg").style.color="red";

}
