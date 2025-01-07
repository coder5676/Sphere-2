document.getElementById("close").addEventListener("click",()=>{
    window.close();
});
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
const auth=getAuth(app);
var imagearr=[];
var textarr=[];
var currentIndex =0;
// Function to fetch article by ID
let useremail = "";
document.addEventListener("DOMContentLoaded", () => {
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
  let fcol="orange";
  let col="";
    try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);
    var str="";
    if (docSnap.exists()) {
      if(docSnap.data().likes.includes(useremail)){
        col=fcol;
      }
      else{
        col="black";
      }
      console.log("Article data:", docSnap.data());
      document.getElementById("crprofile").addEventListener("click",()=>{
        opencreator(docSnap.data().crid);
      })
      document.getElementById("imgcr").style.backgroundImage=`url(${docSnap.data().profilepic})`;
      document.getElementById("crname").innerHTML=docSnap.data().user;
      document.getElementById("crid").innerHTML=docSnap.data().userid;
      document.getElementById("like").innerHTML=`<p onclick="addlikes('${id}',this)" style="color:${col}"> ${docSnap.data().likes.length} | <i class="fa-regular fa-face-smile"></i><p>`;
      imagearr=docSnap.data().imagearr;
      textarr=docSnap.data().textarr;
      document.getElementById("mainimg").style.backgroundImage=`url(${docSnap.data().imagearr[0]})`;
      document.getElementById("mainheading").innerHTML=docSnap.data().textarr[0];
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

// Example usage

window.opencreator = async function (id) {
  window.open(`creator.html?id=${id}`,'_blank');
  
}
document.addEventListener("DOMContentLoaded",()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
  // Function to fetch article by ID
  fetchArticleById(id);
  
    console.log(id);
});


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
  
  document.getElementById("scrollprev").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showinfo(currentIndex);
    }
  });
  document.getElementById("scrollnext").addEventListener("click", () => {
    if (currentIndex < textarr.length - 1) {
      currentIndex++; 
      showinfo(currentIndex);
  
    }
  });  
  function showinfo(index){
  const imagearea = document.getElementById("mainimg");
  const textarea = document.getElementById("mainheading");
  if (index >= 0 && index < imagearr.length && index < textarr.length) {
     imagearea.style.backgroundImage = `url(${imagearr[index]})`;
      textarea.innerHTML = textarr[index]; } 
      else { console.error("Index out of bounds"); }
}
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
}