import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
const firebaseConfig = {
  apiKey: "AIzaSyBu5-fE69WdhHWBR7-2U3NGMm2YgGb6fgo",
  authDomain: "sphere-858fc.firebaseapp.com",
  projectId: "sphere-858fc",
  storageBucket: "sphere-858fc.appspot.com",
  messagingSenderId: "683722942494",
  appId: "1:683722942494:web:61517cb2450ef4284b260f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

var idd = "";
let useremail = "";
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("waiting").style.display = "flex";
  onAuthStateChanged(auth, (user) => {
    if (user) {
      useremail = String(user.providerData[0].uid).slice(0, 6) + "@" + String(user.uid).slice(-4);
      console.log("user is signed in", user);
    } else {
      console.log("user is signed out");
    }
  });
});

const fetchArticleById = async (id) => {
  let fcol = "orange";
  let col = "";
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);
    var str = "";
    if (docSnap.exists()) {
      idd = docSnap.data().crid;
      console.log("Article data:", docSnap.data());
      if (docSnap.data().likes.includes(useremail)) {
        col = fcol;
      }
      else {
        col = "black";
      }
      str = `
     
       <div id="bloginfo">
  
     <div id="s1" onclick="opencreator('${docSnap.data().crid}')"><div id="crimg" style="background-image:url(${docSnap.data().profilepic})"></div><h3 id="crname">${docSnap.data().user}</h3><i class="fa-regular fa-share-from-square" style="margin-left:20px"></i></div>
        <div id="s2"><button id="likes" style="color:${col}" onclick="addlikes('${id}',this)"> <i class="fa-regular fa-face-smile"></i> ${countlikes(docSnap.data().likes.length)}</button></div></div>
        <h3 id="timepast" >Uploaded ${gettimepassed(docSnap.data().timestamp)} . ${docSnap.data().readtime} minutes read</h3>
        <h1 id="mainhead">${docSnap.data().heading}</h1>
         
      <img src="${docSnap.data().imageurl}" id="topimage2"> 
        <div id="container">${docSnap.data().content}</div>`
      document.querySelector("#maincontainer").innerHTML = str;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
  document.getElementById("waiting").style.display = "none";

};

// Example usage

window.opencreator = async function (id) {
  window.open(`creator.html?id=${id}`, '_blank');
}
function countlikes(likes) {
  let a = "";
  if (likes > 999) {
    a = String(likes).slice("-3") + "k";
  }
  else {
    a = String(likes);
  }
  return a;

}
function gettimepassed(timestamp) {
  const firestoreTimestamp = timestamp; // Firestore.Timestamp object
  const savedDate = firestoreTimestamp.toDate(); // Convert to JavaScript Date object
  const currentDate = new Date();
  console.log(savedDate);
  const differenceInMilliseconds = currentDate - savedDate;
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  let timePassed;
  if (differenceInSeconds < 60) {
    timePassed = `${differenceInSeconds} seconds ago`;
  } else if (differenceInMinutes < 60) {
    timePassed = `${differenceInMinutes} minutes ago`;
  } else if (differenceInHours < 24) {
    timePassed = `${differenceInHours} hours ago`;
  } else {
    timePassed = `${differenceInDays} days ago`;
  }

  return timePassed;

}
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  // Function to fetch article by ID
  fetchArticleById(id);
});



//
document.getElementById("closewindow").addEventListener("click", () => {
  window.close();
})
// script.js
document.getElementById('copyButton').addEventListener('click', () => {
  // Create a temporary input element
  const tempInput = document.createElement('input');

  // Set its value to the current page URL
  tempInput.value = window.location.href;

  // Append it to the body
  document.body.appendChild(tempInput);

  // Select the input element's content
  tempInput.select();

  // Execute the "copy" command to copy the content to the clipboard
  document.execCommand('copy');

  // Remove the temporary input element from the DOM
  document.body.removeChild(tempInput);

  // Provide feedback to the user
  alert('URL copied to clipboard!');
});

window.addlikes = async function (articleid, button) {
  if (useremail != "") {
    const docRef3 = doc(db, "articles", articleid);
    // Fetch the document data
    const docSnap = await getDoc(docRef3);
    if (docSnap.exists) {
      const likes = docSnap.data().likes;
      if (!likes.includes(useremail)) {
        await updateDoc(docRef3,
          { likes: arrayUnion(useremail) });
        console.log(`${useremail} added to likes.`);
        button.style.color = "orange";
      }
    }
    else { console.log("No such document!"); }

  }
  else {
    alert("You must login to continue")
  }
};
document.getElementById("more").addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("opensidebar");
  if (typeof idd !== 'undefined' && idd !== null) {
    console.log(idd); document.querySelector("#sidebar").innerHTML = `
  <h1>More from this creator <button onclick="closesidebar()"> | <i class="fa-solid fa-xmark"></i></button></h1>
  <iframe src="creator.html?id=${idd}" width="100%" height="100%" frameborder="0" border-radius="30px"></iframe>`;
  } else { console.error("idd is not defined or is null."); }
});
window.closesidebar=async function(){
  document.getElementById("sidebar").classList.remove("opensidebar");

}
document.getElementById("maincontainer").addEventListener("scroll", () => {
  const mainContainer = document.getElementById("maincontainer");
  const computedStyle = window.getComputedStyle(mainContainer);
  console.log(computedStyle.marginTop);})
  
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(y>0){
      document.getElementById("topshow").classList.add("slidetopshow");
    }
    else{
      document.getElementById("topshow").classList.remove("slidetopshow");

    }
  });
document.getElementById('darkmode').addEventListener('click', function() {
      const currentColor = document.body.style.backgroundColor;
      if (currentColor === 'antiquewhite') {
          document.body.style.backgroundColor = 'white';
      } else {
          document.body.style.backgroundColor = 'antiquewhite';
      }
  });
