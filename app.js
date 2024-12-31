// Fetching data from JSON file based on type (category)
function fetchData(type) {
    return fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
            switch (type) {
                case "users":
                    return data.users;
                case "admin":
                    return data.admins;
                case "manager":
                    return data.managers;
                case "employee":
                    return data.employees;
                case "client":
                    return data.clients;
                default:
                    return [];';'
            }
        });
}

// Function to render the content dynamically
function renderContent(type, filters = {}) {
    if (type === "index") {
        renderHomePage();
        return;
    }

    if (type === "todo") {
        renderTodoPage();
        return;
    }

    fetchData(type).then((data) => {
        const content = document.querySelector(".maincontent");
        content.innerHTML = ""; // Clear previous content

        // Add controls (search, filter, add button)
        const controls = document.createElement("div");
        controls.classList.add("controls");
        controls.innerHTML = `
            <input type="text" id="searchBar" placeholder="Search by name or email..." value="${filters.search || ""}" />
            <select id="filterGender">
                <option value="">Filter by Gender</option>
                <option value="Male" ${filters.gender === "Male" ? "selected" : ""}>Male</option>
                <option value="Female" ${filters.gender === "Female" ? "selected" : ""}>Female</option>
            </select>
            ${
                type === "users"
                    ? `
            <select id="filterRole">
                <option value="">Filter by Role</option>
                <option value="User" ${filters.role === "User" ? "selected" : ""}>User</option>
                <option value="Admin" ${filters.role === "Admin" ? "selected" : ""}>Admin</option>
                <option value="Manager" ${filters.role === "Manager" ? "selected" : ""}>Manager</option>
                <option value="Employee" ${filters.role === "Employee" ? "selected" : ""}>Employee</option>
                <option value="Client" ${filters.role === "Client" ? "selected" : ""}>Client</option>
            </select>`
                    : ""
            }
            <button id="addButton">Add New</button>
        `;
        content.appendChild(controls);

        // Apply filters to the data
        let filteredData = data;
        if (filters.search) {
            filteredData = filteredData.filter(
                (item) =>
                    item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    item.email.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.gender) {
            filteredData = filteredData.filter((item) => item.gender === filters.gender);
        }
        if (filters.role && type === "users") {
            filteredData = filteredData.filter((item) => item.role === filters.role);
        }

        // Add table
        const table = document.createElement("table");
        table.classList.add("data-table");
        let rows = `
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
        `;
        filteredData.forEach((item, index) => {
            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.gender}</td>
                    <td>${item.role}</td>
                    <td>
                        <button class="edit-button" onclick="editData(${item.id}, '${type}')">Edit</button>
                        <button class="delete-button" onclick="deleteData(${item.id}, '${type}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        rows += "</tbody>";
        table.innerHTML = rows;
        content.appendChild(table);

        // Event listeners for search, filter, and add button
        document.getElementById("searchBar").addEventListener("input", () => updateFilters(type));
        document.getElementById("filterGender").addEventListener("change", () => updateFilters(type));
        if (type === "users") {
            document.getElementById("filterRole").addEventListener("change", () => updateFilters(type));
        }
        document.getElementById("addButton").addEventListener("click", () => addNewData(type, data));
    });
}

// Rendering the Home Page (Dashboard or Welcome Page)
function renderHomePage() {
    const content = document.querySelector(".maincontent");
    content.innerHTML = `
        <div class="home-page">
            <div class="hero-section">
                <h1>Welcome to <span class="brand-name">Your Dashboard</span></h1>
                <p>Manage your projects, teams, and clients effortlessly. Everything you need in one place.</p>
                <button class="cta-btn">Explore Now</button>
            </div>

            <div class="features-section">
                <div class="feature" id="manageUsers">
                    <i class="bx bx-user-circle"></i>
                    <h2>Manage Users</h2>
                    <p>Efficiently handle all user-related tasks and permissions with ease.</p>
                </div>
                <div class="feature" id="openTodo">
                    <i class="fas fa-check-circle"></i>
                    <h2>To-Do List</h2>
                    <p>Click here to manage your tasks efficiently.</p>
                </div>
                <div class="feature">
                    <i class="bx bx-bar-chart-alt-2"></i>
                    <h2>Analytics</h2>
                    <p>Get powerful insights to make data-driven decisions.</p>
                </div>
            </div>
        </div>
    `;

    // Event listener for "Manage Users"
    document.getElementById("manageUsers").addEventListener("click", () => {
        window.location.hash = "#/users"; // Update the hash in the URL
    });

    // Event listener for "To-Do List"
    document.getElementById("openTodo").addEventListener("click", () => {
        window.location.hash = "#/todo"; // Update the hash in the URL
    });
}



// Render To-Do List Page
function renderTodoPage() {
    const content = document.querySelector(".maincontent");
    content.innerHTML = `
        <div>
            <h2>To-do list</h2>
            <div class="parent">
                <input type="text" id="taskInput" placeholder="Enter task">
                <button id="addbtn"><i class='bx bx-plus'></i></button>
            </div>
            <ul id="listItems"></ul>
        </div>
    `;

    initTodoList(); // Ensure this function initializes your To-Do list functionality
}


// Initialize To-Do List
function initTodoList() {
    const taskInput = document.getElementById("taskInput");
    const addbtn = document.getElementById("addbtn");
    const listItems = document.getElementById("listItems");

    // Load tasks from localStorage when the page is loaded
    loadTasks();

    addbtn.addEventListener("click", () => {
        const enteredTask = taskInput.value.trim();
        if (!enteredTask) {
            alert("Enter a task");
            return;
        }

        const list = document.createElement("li");
        list.textContent = enteredTask;
        list.style = "margin-bottom: 10px; background-color: antiquewhite; padding: 10px; border-radius: 5px; display: flex; align-items: center; justify-content: space-between;";

        const tick = document.createElement("button");
        const tickIcon = document.createElement("i");
        tickIcon.className = "bx bx-check";
        tick.appendChild(tickIcon);
        tick.style = "background-color: rgb(33, 131, 33); border: none; color: white; border-radius: 5px; margin-left: 10px; padding: 5px;";
        tick.addEventListener("click", () => {
            list.style.textDecoration = "line-through";
            tick.disabled = true;
            saveTasks(); // Save tasks after checking
        });

        const dltbtn = document.createElement("button");
        const dltIcon = document.createElement("i");
        dltIcon.className = "bx bx-trash";
        dltbtn.appendChild(dltIcon);
        dltbtn.style = "background-color: red; border: none; color: white; border-radius: 5px; margin-left: 10px; padding: 5px;";
        dltbtn.addEventListener("click", () => {
            listItems.removeChild(list);
            saveTasks(); // Save tasks after deleting
        });

        list.appendChild(tick);
        list.appendChild(dltbtn);
        listItems.appendChild(list);

        taskInput.value = "";
        saveTasks(); // Save tasks after adding
    });
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const listItems = document.getElementById("listItems");

    tasks.forEach((task) => {
        const list = document.createElement("li");
        list.textContent = task.name;
        list.style = "margin-bottom: 10px; background-color: antiquewhite; padding: 10px; border-radius: 5px; display: flex; align-items: center; justify-content: space-between;";

        if (task.completed) {
            list.style.textDecoration = "line-through";
        }

        const tick = document.createElement("button");
        const tickIcon = document.createElement("i");
        tickIcon.className = "bx bx-check";
        tick.appendChild(tickIcon);
        tick.style = "background-color: rgb(33, 131, 33); border: none; color: white; border-radius: 5px; margin-left: 10px; padding: 5px;";
        tick.disabled = task.completed; // Disable tick button if task is completed
        tick.addEventListener("click", () => {
            list.style.textDecoration = "line-through";
            task.completed = true;
            tick.disabled = true;
            saveTasks(); // Save tasks after checking
        });

        const dltbtn = document.createElement("button");
        const dltIcon = document.createElement("i");
        dltIcon.className = "bx bx-trash";
        dltbtn.appendChild(dltIcon);
        dltbtn.style = "background-color: red; border: none; color: white; border-radius: 5px; margin-left: 10px; padding: 5px;";
        dltbtn.addEventListener("click", () => {
            listItems.removeChild(list);
            saveTasks(); // Save tasks after deleting
        });

        list.appendChild(tick);
        list.appendChild(dltbtn);
        listItems.appendChild(list);
    });
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    const listItems = document.getElementById("listItems").children;

    for (let i = 0; i < listItems.length; i++) {
        const task = listItems[i];
        const taskName = task.firstChild.textContent; // Get the task name
        const completed = task.style.textDecoration === "line-through"; // Check if the task is completed
        tasks.push({ name: taskName, completed });
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Update filters and URL
function updateFilters(type) {
    const searchValue = document.getElementById("searchBar").value.trim();
    const genderValue = document.getElementById("filterGender").value;
    const roleValue = type === "users" ? document.getElementById("filterRole").value : "";

    // Create filters object
    const filters = {};
    if (searchValue) filters.search = searchValue;
    if (genderValue) filters.gender = genderValue;
    if (roleValue) filters.role = roleValue;

    // Generate query parameters string
    const queryParams = new URLSearchParams(filters).toString();
    const newUrl = `#/${type}${queryParams ? `?${queryParams}` : ""}`; // Corrected string interpolation

    // Update the URL hash
    window.location.hash = newUrl;

    // Render content with the updated filters
    renderContent(type, filters);
}

// Handle navigation
function handleNavigation() {
    const hash = window.location.hash.replace("#/", "");
    const [type, queryParams] = hash.split("?");
    const filters = Object.fromEntries(new URLSearchParams(queryParams));

    renderContent(type || "index", filters);
}

// Adding new data
function fetchData(type) {
    return new Promise((resolve) => {
        // Check if data is already in localStorage
        const storedData = localStorage.getItem(type);
        if (storedData) {
            resolve(JSON.parse(storedData)); // Return stored data if available
        } else {
            // Fetch data from JSON file and store in localStorage
            fetch("data.json")
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem(type, JSON.stringify(data[type])); // Store fetched data in localStorage
                    resolve(data[type]);
                });
        }
    });
}
function saveUpdatedData(type, data) {
    localStorage.setItem(type, JSON.stringify(data)); // Save updated data to localStorage
}
function addNewData(type, data) {
    const name = prompt("Enter name:");
    const email = prompt("Enter email:");
    const gender = prompt("Enter gender (Male/Female):");
    const role = prompt("Enter role (User/Admin/Manager/Employee/Client):");

    if (!name || !email || !gender || !role) {
        alert("All fields are required!");
        return;
    }

    const newId = data.length ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newItem = { id: newId, name, email, gender, role };

    data.push(newItem);
    saveUpdatedData(type, data); // Save updated data to localStorage
    renderContent(type);
}
function editData(id, type) {
    fetchData(type).then((data) => {
        const itemToEdit = data.find((item) => item.id === id);
        if (!itemToEdit) {
            alert("Item not found!");
            return;
        }

        const newName = prompt("Enter new name:", itemToEdit.name) || itemToEdit.name;
        const newEmail = prompt("Enter new email:", itemToEdit.email) || itemToEdit.email;
        const newGender = prompt("Enter new gender (Male/Female):", itemToEdit.gender) || itemToEdit.gender;
        const newRole = prompt("Enter new role:", itemToEdit.role) || itemToEdit.role;

        itemToEdit.name = newName;
        itemToEdit.email = newEmail;
        itemToEdit.gender = newGender;
        itemToEdit.role = newRole;

        saveUpdatedData(type, data); // Save updated data to localStorage
        renderContent(type);
    });
}
function deleteData(id, type) {
    fetchData(type).then((data) => {
        const updatedData = data.filter((item) => item.id !== id);
        saveUpdatedData(type, updatedData); // Save updated data to localStorage
        renderContent(type);
    });
}
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');

// Add an event listener to the hamburger menu
hamburger.addEventListener('click', function() {
  // Toggle the 'show' class to show or hide the sidebar
  sidebar.classList.toggle('show');
});
document.addEventListener("DOMContentLoaded", function () {
    // Button click event listeners for each role
    document.getElementById("adminLink").addEventListener("click", function() {
        renderContent('admins');  // Load admin data
    });

    document.getElementById("managerLink").addEventListener("click", function() {
        renderContent('managers');  // Load manager data
    });

    document.getElementById("clientLink").addEventListener("click", function() {
        renderContent('clients');  // Load client data
    });

    document.getElementById("employeeLink").addEventListener("click", function() {
        renderContent('employees');  // Load employee data
    });

    // Optional: Handle clicking the 'Users' link
    document.getElementById("usersLink").addEventListener("click", function() {
        renderContent('users');  // Load all users data or a general view
    });
});
// Initial setup
window.addEventListener("DOMContentLoaded", handleNavigation);
window.addEventListener("hashchange", handleNavigation);  