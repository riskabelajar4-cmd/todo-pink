/* ================= DATA ================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let categories = JSON.parse(localStorage.getItem("categories")) || [
    { id: 1, name: "Umum", color: "#ff69b4", icon: "📌" }
];

let statusFilter = "all";
let categoryFilter = "all";


/* ================= SAVE ================= */

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
}


/* ================= KATEGORI ================= */

function addCategory() {

    const nameInput = document.getElementById("categoryName");
    const colorInput = document.getElementById("categoryColor");
    const iconInput = document.getElementById("categoryIcon");

    const name = nameInput.value.trim();
    const color = colorInput.value;
    const icon = iconInput.value.trim() || "📁";

    if (!name) {
        alert("Nama kategori wajib diisi!");
        return;
    }

    categories.push({
        id: Date.now(),
        name: name,
        color: color,
        icon: icon
    });

    saveData();
    renderCategories();

    nameInput.value = "";
    iconInput.value = "";
}


/* ================= TASK ================= */

function addTask() {

    const textInput = document.getElementById("taskInput");
    const categorySelect = document.getElementById("taskCategory");
    const dateInput = document.getElementById("taskDate");

    const text = textInput.value.trim();
    const categoryId = categorySelect.value;
    const date = dateInput.value;

    if (!text) {
        alert("Task tidak boleh kosong!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        categoryId: categoryId ? Number(categoryId) : null,
        date: date,
        done: false
    });

    saveData();
    renderTasks();

    textInput.value = "";
    dateInput.value = "";
}


/* ================= TOGGLE ================= */

function toggleTask(id) {

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.done = !task.done;

    saveData();
    renderTasks();
}


/* ================= DELETE ================= */

function deleteTask(id) {

    tasks = tasks.filter(t => t.id !== id);

    saveData();
    renderTasks();
}


/* ================= FILTER ================= */

function setStatusFilter(status) {
    statusFilter = status;
    renderTasks();
}

function setCategoryFilter(id) {

    if (id === "all") {
        categoryFilter = "all";
    } else {
        categoryFilter = Number(id);
    }

    renderTasks();
}


/* ================= RENDER KATEGORI ================= */

function renderCategories() {

    const select = document.getElementById("taskCategory");
    const list = document.getElementById("categoryList");
    const filter = document.getElementById("filterCategory");

    if (!select) return;

    select.innerHTML = `<option value="">Pilih kategori</option>`;
    list.innerHTML = "";
    filter.innerHTML = `<button onclick="setCategoryFilter('all')">Semua</button>`;

    categories.forEach(cat => {

        // Dropdown
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = `${cat.icon} ${cat.name}`;
        select.appendChild(option);

        // List kategori
        const div = document.createElement("div");
        div.textContent = `${cat.icon} ${cat.name}`;
        div.style.color = cat.color;
        div.style.margin = "5px 0";
        list.appendChild(div);

        // Filter kategori
        const btn = document.createElement("button");
        btn.textContent = `${cat.icon} ${cat.name}`;
        btn.style.border = `2px solid ${cat.color}`;
        btn.style.color = cat.color;
        btn.style.margin = "3px";
        btn.onclick = () => setCategoryFilter(cat.id);

        filter.appendChild(btn);
    });
}


/* ================= RENDER TASK ================= */

function renderTasks() {

    const list = document.getElementById("taskList");
    const searchInput = document.getElementById("searchInput");

    if (!list) return;

    const search = searchInput ? searchInput.value.toLowerCase() : "";

    list.innerHTML = "";

    let filtered = tasks.filter(task => {

        const matchSearch =
            task.text.toLowerCase().includes(search);

        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "done" && task.done) ||
            (statusFilter === "pending" && !task.done);

        const matchCategory =
            categoryFilter === "all" ||
            task.categoryId === categoryFilter;

        return matchSearch && matchStatus && matchCategory;
    });

    filtered.forEach(task => {

        const cat = categories.find(c => c.id === task.categoryId);

        const color = cat ? cat.color : "#ff69b4";
        const icon = cat ? cat.icon : "📌";

        const div = document.createElement("div");
        div.className = "task";
        if (task.done) div.classList.add("done");
        div.style.borderLeft = `6px solid ${color}`;

        div.innerHTML = `
            <span>
                ${icon} ${task.text}
                (${task.date || "No date"})
            </span>
            <div>
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
            </div>
        `;

        list.appendChild(div);
    });

    updateStats();
}


/* ================= STATISTIK ================= */

function updateStats() {

    document.getElementById("totalTask").innerText = tasks.length;
    document.getElementById("doneTask").innerText =
        tasks.filter(t => t.done).length;
    document.getElementById("pendingTask").innerText =
        tasks.filter(t => !t.done).length;
}


/* ================= SEARCH ================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", renderTasks);
    }

    renderCategories();
    renderTasks();
});
