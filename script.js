/* ================= GLOBAL STATE ================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];

let statusFilter = "all";
let categoryFilter = "all";
let editingTaskId = null;

/* ================= SAVE ================= */

function saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
}

/* ================= CATEGORY ================= */

function addCategory() {
    const nameInput = document.getElementById("categoryName");
    const colorInput = document.getElementById("categoryColor");
    const iconInput = document.getElementById("categoryIcon");

    const name = nameInput.value.trim();
    const color = colorInput.value;
    const icon = iconInput.value.trim() || "📁";

    if (!name) {
        alert("Nama kategori tidak boleh kosong!");
        return;
    }

    const newCategory = {
        id: Date.now().toString(),
        name,
        color,
        icon
    };

    categories.push(newCategory);
    saveToStorage();

    nameInput.value = "";
    iconInput.value = "";

    renderCategories();
}

function deleteCategory(id) {
    categories = categories.filter(cat => cat.id !== id);
    tasks = tasks.filter(task => task.categoryId !== id);

    saveToStorage();
    renderCategories();
    renderTasks();
}

function renderCategories() {

    const list = document.getElementById("categoryList");
    const select = document.getElementById("taskCategory");
    const filterDiv = document.getElementById("filterCategory");

    list.innerHTML = "";
    select.innerHTML = '<option value="">Pilih kategori</option>';
    filterDiv.innerHTML = "";

    categories.forEach(cat => {

        // tampil list kategori
        const div = document.createElement("div");
        div.innerHTML = `
            <span>${cat.icon} ${cat.name}</span>
            <button onclick="deleteCategory('${cat.id}')">✖</button>
        `;
        list.appendChild(div);

        // dropdown tambah task
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = `${cat.icon} ${cat.name}`;
        select.appendChild(option);

        // filter kategori
        const filterBtn = document.createElement("button");
        filterBtn.textContent = `${cat.icon} ${cat.name}`;
        filterBtn.onclick = () => {
            categoryFilter = cat.id;
            renderTasks();
        };
        filterDiv.appendChild(filterBtn);
    });

    // tombol semua
    const allBtn = document.createElement("button");
    allBtn.textContent = "Semua";
    allBtn.onclick = () => {
        categoryFilter = "all";
        renderTasks();
    };
    filterDiv.prepend(allBtn);
}

/* ================= TASK ================= */

function addTask() {

    const textInput = document.getElementById("taskInput");
    const categorySelect = document.getElementById("taskCategory");
    const dateInput = document.getElementById("taskDate");

    const text = textInput.value.trim();
    const categoryId = categorySelect.value;
    const date = dateInput.value;

    if (!text || !categoryId) {
        alert("Task dan kategori wajib diisi!");
        return;
    }

    if (editingTaskId) {
        updateTask();
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text,
        categoryId,
        date,
        done: false
    };

    tasks.push(newTask);
    saveToStorage();

    textInput.value = "";
    dateInput.value = "";

    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
    );

    saveToStorage();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToStorage();
    renderTasks();
}

function startEditTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById("taskInput").value = task.text;
    document.getElementById("taskCategory").value = task.categoryId;
    document.getElementById("taskDate").value = task.date;

    editingTaskId = id;
}

function updateTask() {

    const text = document.getElementById("taskInput").value.trim();
    const categoryId = document.getElementById("taskCategory").value;
    const date = document.getElementById("taskDate").value;

    tasks = tasks.map(task =>
        task.id === editingTaskId
            ? { ...task, text, categoryId, date }
            : task
    );

    editingTaskId = null;
    saveToStorage();

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";

    renderTasks();
}

/* ================= RENDER TASK ================= */

function renderTasks() {

    const list = document.getElementById("taskList");
    const searchInput = document.getElementById("searchInput");

    const searchValue = searchInput.value.toLowerCase();

    list.innerHTML = "";

    let filtered = tasks.filter(task => {

        const matchSearch =
            task.text.toLowerCase().includes(searchValue);

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
                <button onclick="toggleTask('${task.id}')">✔</button>
                <button onclick="startEditTask('${task.id}')">✏</button>
                <button onclick="deleteTask('${task.id}')">✖</button>
            </div>
        `;

        list.appendChild(div);
    });

    updateStats();
}

/* ================= FILTER ================= */

function setStatusFilter(status) {
    statusFilter = status;
    renderTasks();
}

/* ================= SEARCH ================= */

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("searchInput")
        .addEventListener("input", renderTasks);

    renderCategories();
    renderTasks();
});

/* ================= STATISTIK ================= */

function updateStats() {
    document.getElementById("totalTask").textContent = tasks.length;
    document.getElementById("doneTask").textContent =
        tasks.filter(t => t.done).length;
    document.getElementById("pendingTask").textContent =
        tasks.filter(t => !t.done).length;
}
