let tasks = [];
let categories = [];

// LOAD DATA SAAT HALAMAN DIBUKA
window.onload = function () {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    categories = JSON.parse(localStorage.getItem("categories")) || [];
    renderCategories();
    renderTasks();
};

// SIMPAN DATA
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
}

// TAMBAH KATEGORI
document.getElementById("addCategoryBtn").addEventListener("click", function () {
    const name = document.getElementById("categoryName").value;
    const color = document.getElementById("categoryColor").value;

    if (name === "") return;

    const newCategory = {
        id: Date.now(),
        name: name,
        color: color
    };

    categories.push(newCategory);
    saveData();
    renderCategories();

    document.getElementById("categoryName").value = "";
});

// RENDER KATEGORI
function renderCategories() {
    const categoryList = document.getElementById("categoryList");
    const categorySelect = document.getElementById("categorySelect");
    const filterCategory = document.getElementById("filterCategory");

    categoryList.innerHTML = "";
    categorySelect.innerHTML = "";
    filterCategory.innerHTML = '<option value="all">Semua Kategori</option>';

    categories.forEach(cat => {
        // tampil list kategori
        const div = document.createElement("div");
        div.textContent = cat.name;
        div.style.backgroundColor = cat.color;
        div.style.padding = "5px";
        div.style.marginBottom = "5px";
        div.style.borderRadius = "5px";

        // tombol hapus kategori
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Hapus";
        deleteBtn.onclick = function () {
            categories = categories.filter(c => c.id !== cat.id);
            tasks = tasks.filter(t => t.categoryId !== cat.id);
            saveData();
            renderCategories();
            renderTasks();
        };

        div.appendChild(deleteBtn);
        categoryList.appendChild(div);

        // dropdown untuk task
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);

        // dropdown filter
        const filterOption = document.createElement("option");
        filterOption.value = cat.id;
        filterOption.textContent = cat.name;
        filterCategory.appendChild(filterOption);
    });
}

// TAMBAH TASK
document.getElementById("addTaskBtn").addEventListener("click", function () {
    const text = document.getElementById("taskInput").value;
    const categoryId = document.getElementById("categorySelect").value;

    if (text === "" || categoryId === "") return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        categoryId: Number(categoryId)
    };

    tasks.push(newTask);
    saveData();
    renderTasks();

    document.getElementById("taskInput").value = "";
});

// RENDER TASK
function renderTasks(filteredTasks = null) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const list = filteredTasks || tasks;

    list.forEach(task => {
        const category = categories.find(c => c.id === task.categoryId);

        const div = document.createElement("div");
        div.className = "task";
        div.style.backgroundColor = category ? category.color : "#ddd";

        if (task.completed) {
            div.classList.add("completed");
        }

        div.textContent = task.text;

        // toggle selesai
        div.onclick = function () {
            task.completed = !task.completed;
            saveData();
            renderTasks();
        };

        taskList.appendChild(div);
    });
}

// FILTER
document.getElementById("filterCategory").addEventListener("change", function () {
    const value = this.value;

    if (value === "all") {
        renderTasks();
    } else {
        const filtered = tasks.filter(t => t.categoryId == value);
        renderTasks(filtered);
    }
});
