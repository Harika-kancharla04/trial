
// Fetch the logged-in user's name from localStorage
const loggedInUser = localStorage.getItem("loggedInUser");

// Check if user is logged in
if (loggedInUser) {
    // If logged in, update the profile name to the logged-in user's name
    const profileNameElement = document.getElementById("profileName");
    profileNameElement.textContent = loggedInUser; // Set the name in the profile span
} else {
    // If not logged in, redirect to the login page
    window.location.href = "sign.html";
}

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", function () {
    // Remove user from localStorage on logout
    localStorage.removeItem("loggedInUser");
    window.location.href = "sign.html"; // Redirect to login page
});
