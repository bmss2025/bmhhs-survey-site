const apiURL = "https://script.google.com/macros/s/AKfycbwWPPT8X2eMZkZHUgnaiJnAjM9uIYcdMs-cFogm4hi_a2troFD_ykmVQI5P7pz-5GJS/exec";

async function loadTable() {
  const res = await fetch(apiURL + "?action=getFilteredData");
  const data = await res.json();

  const tbody = document.querySelector("#dataTable tbody");
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.Survey_Location}</td>
      <td>${row.Location_Name}</td>
      <td>${row.Name_of_Household_Owner}</td>
      <td>${row.Mobile_No}</td>
      <td>${row.Email_Id}</td>
      <td><button onclick='editRow(${JSON.stringify(row)})'>Edit</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function editRow(row) {
  // Store data locally and go to form page
  localStorage.setItem("editingRow", JSON.stringify(row));
  window.location.href = "edit-form.html";
}

async function loadForm() {
  const row = JSON.parse(localStorage.getItem("editingRow"));
  if (!row) return alert("No data found to edit");

  document.getElementById("Survey_Location").value = row.Survey_Location || "";
  document.getElementById("Location_Name").value = row.Location_Name || "";
  document.getElementById("Name_of_Household_Owner").value = row.Name_of_Household_Owner || "";
  document.getElementById("Mobile_No").value = row.Mobile_No || "";
  document.getElementById("Email_Id").value = row.Email_Id || "";
}

async function submitForm(e) {
  e.preventDefault();

  const payload = {
    action: "updateRow",
    Survey_Location: document.getElementById("Survey_Location").value,
    Location_Name: document.getElementById("Location_Name").value,
    Name_of_Household_Owner: document.getElementById("Name_of_Household_Owner").value,
    Mobile_No: document.getElementById("Mobile_No").value,
    Email_Id: document.getElementById("Email_Id").value,
  };

  try {
    const res = await fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });
    const result = await res.json();
    alert(result.message || "Update successful.");
    window.location.href = "index.html";
  } catch (err) {
    alert("Error updating.");
    console.error(err);
  }
}

// Dispatcher based on page
if (window.location.pathname.endsWith("index.html")) {
  loadTable();
} else if (window.location.pathname.endsWith("edit-form.html")) {
  window.onload = loadForm;
  document.getElementById("surveyForm").addEventListener("submit", submitForm);
}
