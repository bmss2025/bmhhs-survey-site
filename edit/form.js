const apiURL = "https://script.google.com/macros/s/AKfycbwWPPT8X2eMZkZHUgnaiJnAjM9uIYcdMs-cFogm4hi_a2troFD_ykmVQI5P7pz-5GJS/exec";

window.onload = async () => {
  try {
    const res = await fetch(`${apiURL}?action=getFilteredData`);
    const data = await res.json();
    populateForm(data[0]); // just show the first record for now
  } catch (err) {
    alert("Failed to load data.");
    console.error(err);
  }
};

function populateForm(row) {
  document.getElementById("Survey_Location").value = row.Survey_Location || "";
  document.getElementById("Location_Name").value = row.Location_Name || "";
  document.getElementById("Name_of_Household_Owner").value = row.Name_of_Household_Owner || "";
  document.getElementById("Mobile_No").value = row.Mobile_No || "";
  document.getElementById("Email_Id").value = row.Email_Id || "";
}

document.getElementById("surveyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
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
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    alert(result.message || "Update successful.");
  } catch (err) {
    alert("Update failed.");
    console.error(err);
  }
});

