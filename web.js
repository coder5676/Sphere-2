import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
const loader=document.getElementById("waiting");

/*
window.addEventListener("scroll",()=>{
    
    const y=window.scrollY;
    const width=window.innerWidth;
    if(width>1400){
      console.log(y);
    document.body.style.transitionDuration="1s";
    if(y<=600){
        document.body.style.backgroundColor="white";


    }
    else if(y>600 && y<1427){
        document.body.style.backgroundColor="black";
  

    }
    else if(y>1427&&y<2549){
        document.body.style.backgroundColor="#C7E5FF";
     

    }
    else if(y>2549 && y<3000){
        document.body.style.backgroundColor="#F8F8F9";
    }
    else if(y>3000 && y<4000){
      document.body.style.backgroundColor="#CECDFE";
  }
    else if(y>4000 && y<5300){
        document.body.style.backgroundColor="#CFFDD7";
    }
    else if(y>5300){
      document.body.style.backgroundColor="white";
  }
    }
    else{
       document.body.style. backgroundColor="white";
    }
});*/
document.getElementById("loginbut").addEventListener('click', () => {
    const form = document.getElementById("form");
    if (form.style.display === "none" || form.style.display === "") {
      form.style.display = "flex";
      form.style.transitionDuration="0.7s";
    } else {
      form.style.display = "none";
      form.style.transitionDuration="0.7s";
    }
    document.getElementById("loginform").style.display="flex";
  document.getElementById("signupform").style.display="none";
    
  });
  document.getElementById("signbut").addEventListener('click', () => {
    const form = document.getElementById("form");
    if (form.style.display === "none" || form.style.display === "") {
      form.style.display = "flex";
      form.style.transitionDuration="0.7s";
    } else {
      form.style.display = "none";
      form.style.transitionDuration="0.7s";
    }
    document.getElementById("signupform").style.display="flex";
  document.getElementById("loginform").style.display="none";
    
  });
  document.getElementById("login").addEventListener('click',()=>{
    document.getElementById("loginform").style.display="flex";
    document.getElementById("signupform").style.display="none";
  });
  document.getElementById("signup").addEventListener('click',()=>{
    document.getElementById("signupform").style.display="flex";
    document.getElementById("loginform").style.display="none";
  });
  document.getElementById("cross").addEventListener('click',()=>{
    document.getElementById("form").style.display="none";

  });
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
  document.addEventListener("DOMContentLoaded",()=>{
    loader.style.display="flex";
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user is signed in")
    userlogined();
      } else {
          console.log("user is signed out")
          usersignedout();
      }
      loader.style.display="none";
    });});
    function userlogined(){
      document.getElementById("loginbut").style.display="none";
      document.getElementById("logout").style.display="block";
      const anchor = document.querySelectorAll(".create");
      anchor.forEach((an)=>{
        an.href="upload.html";
        an.target="_blank";
        
      })
      
    
    }
    function usersignedout(){
      document.getElementById("loginbut").style.display="block";
      document.getElementById("logout").style.display="none";
      const anchor = document.querySelectorAll(".create");
      anchor.forEach((an)=>{
        an.href="";
        an.target="";
      })
    
    }
    const crbut=document.querySelectorAll(".createbut");
    crbut.forEach((but)=>{
but.addEventListener("click",()=>{
  alert("You will be redirected to page only if you are loginned");
  

})
    })
let e = 0;
const boxes = document.getElementsByClassName('j1');

function addanimation() {
  boxes[e].classList.add("showanim");
  if (e > 0) {
    boxes[e - 1].classList.remove("showanim");
  } else if (e === 0) {
    boxes[5].classList.remove("showanim");
  }
  e = (e + 1) % 6;
}

setInterval(addanimation, 2000);

var f=0;
var asrr=["Documentation","Blogs","Articles","Projects","Designs","Insights"];
function topanim(){
document.getElementById("animatedtext").innerHTML=asrr[f];

f=(f+1)%6;
}
setInterval(topanim,3000);
document.getElementById("bb1").addEventListener("click", () => {
  document.getElementById("box2").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("bb2").addEventListener("click", () => {
  document.getElementById("instructions").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("bb3").addEventListener("click", () => {
  document.getElementById("show").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("bb4").addEventListener("click", () => {
  document.getElementById("projects").scrollIntoView({
    behavior: "smooth"
  });
});
