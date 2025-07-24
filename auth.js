const firebaseConfig = {
  apiKey: "AIzaSyCK48gnZT2j9h5uwQ3SRk8qYPe0lmHs-jo",
  authDomain: "bmhhs-survey-site.firebaseapp.com",
  projectId: "bmhhs-survey-site",
  appId: "1:177160691791:web:d7db5a121957acec4eca3a"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

function signOut() {
  auth.signOut();
}

// Attach this in every protected page:
function protectPage(whitelist = []) {
  auth.onAuthStateChanged(user => {
    const loginSection = document.getElementById("login-section");
    const mainContent = document.getElementById("main-content");

    if (user) {
      if (whitelist.length && !whitelist.includes(user.email)) {
        alert("Access denied for: " + user.email);
        signOut();
        return;
      }
      mainContent.style.display = "block";
      loginSection.style.display = "none";
    } else {
      mainContent.style.display = "none";
      loginSection.style.display = "block";
    }
  });
}

