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
  provider.setCustomParameters({
    prompt: 'select_account'  // 👈 forces account chooser
  });

  auth.signInWithPopup(provider)
    .catch(error => console.error("Sign-in error:", error));
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
      // === Inject buttons if not already present ===
      if (!document.getElementById("edit-button")) {
      const editBtn = document.createElement("a");
      editBtn.href = "./edit/edit-form.html";
      editBtn.id = "edit-button";
      editBtn.className = "form-button";
      editBtn.innerText = "Edit Data";

      const addBtn = document.createElement("a");
      addBtn.href = "./add/consent.html";
      addBtn.id = "add-button";
      addBtn.className = "form-button";
      addBtn.innerText = "Add Data";

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";
      buttonContainer.appendChild(editBtn);
      buttonContainer.appendChild(addBtn);

      mainContent.appendChild(buttonContainer);
    }

    } else {
      mainContent.style.display = "none";
      loginSection.style.display = "block";
    }
  });
}

// === Inactivity Auto-Logout (5 minutes) ===
let inactivityTimer;
const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

function startInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    alert("You have been logged out due to inactivity.");
    firebase.auth().signOut();
  }, INACTIVITY_LIMIT);
}

// Reset timer on any user activity
['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, startInactivityTimer);
});

// Start timer on page load
window.addEventListener('load', startInactivityTimer);

