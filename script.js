let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
    { id: 1, name: "Umum", color: "#ff69b4", icon: "📌" }
];

let statusFilter = "all";
let categoryFilter = "all";

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
}

function addCategory() {
    const name = document.getElementById("categoryName").value;
    const color = document.getElementById("categoryColor").value;
    const icon = document.getElementById("categoryIcon").value || "📁";

    if (!name) return;

    categories.push({
        id: Date.now(),
        name,
        color,
        icon
    });

    saveData();
    renderCategories();
}

function addTask() {
    const text = document.getElementById("taskInput").value;
    const categoryId = document.getElementById("taskCategory").value;
    const date = document.getElementById("taskDate").value;

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        categoryId: Number(categoryId),
        date,
        done: false
    });

    saveData();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id == id);
    task.done = !task.done;
    saveData();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id != id);
    saveData();
    renderTasks();
}

function setStatusFilter(status) {
    statusFilter = status;
    renderTasks();
}

function setCategoryFilter(id) {
    categoryFilter = id;
    renderTasks();
}

function renderCategories() {
    const select = document.getElementById("taskCategory");
    const list = document.getElementById("categoryList");
    const filter = document.getElementById("filterCategory");

    select.innerHTML = "";
    list.innerHTML = "";
    filter.innerHTML = `<button onclick="setCategoryFilter('all')">Semua</button>`;

    categories.forEach(cat => {
        select.innerHTML += `
            <option value="${cat.id}">
                ${cat.icon} ${cat.name}
            </option>
        `;

        list.innerHTML += `
            <div style="color:${cat.color}; margin:5px 0;">
                ${cat.icon} ${cat.name}
            </div>
        `;

        filter.innerHTML += `
            <button onclick="setCategoryFilter('${cat.id}')"
                style="border:2px solid ${cat.color}; color:${cat.color}; margin:3px;">
                ${cat.icon} ${cat.name}
            </button>
        `;
    });
}

function renderTasks() {
    const list = document.getElementById("taskList");
    const search = document.getElementById("searchInput").value.toLowerCase();

    list.innerHTML = "";

    let filtered = tasks.filter(task => {

        const matchSearch = task.text.toLowerCase().includes(search);

        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "done" && task.done) ||
            (statusFilter === "pending" && !task.done);

        const matchCategory =
            categoryFilter === "all" ||
            task.categoryId == categoryFilter;

        return matchSearch && matchStatus && matchCategory;
    });

    filtered.forEach(task => {
        const cat = categories.find(c => c.id == task.categoryId);

        list.innerHTML += `
            <div class="task ${task.done ? 'done' : ''}"
                style="border-left:6px solid ${cat ? cat.color : '#ff69b4'}">
                <span>
                    ${cat ? cat.icon : "📌"} 
                    ${task.text} 
                    (${task.date || "No date"})
                </span>
                <div>
                    <button onclick="toggleTask(${task.id})">✔</button>
                    <button onclick="deleteTask(${task.id})">✖</button>
                </div>
            </div>
        `;
    });

    updateStats();
}

function updateStats() {
    document.getElementById("totalTask").innerText = tasks.length;
    document.getElementById("doneTask").innerText = tasks.filter(t => t.done).length;
    document.getElementById("pendingTask").innerText = tasks.filter(t => !t.done).length;
}

document.getElementById("searchInput")
    .addEventListener("input", renderTasks);

renderCategories();
renderTasks();
