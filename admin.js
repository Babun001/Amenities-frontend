
const token = localStorage.getItem("authToken");
if (!token || !token.startsWith("BabunRoy")) {
    window.location.href = "login.html";
}


document.querySelectorAll('#adminTabNav .nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('data-tab');

        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        document.getElementById(target).classList.add('active');
        link.classList.add('active');

        if (target === "deleteTab") loadTabs();
    });
});

const amenitiesSelect = document.getElementById("AmenitiesSelection");
const inputsContainer = document.getElementById("amenitiesInputsContainer");

amenitiesSelect.addEventListener("change", () => {
    const count = parseInt(amenitiesSelect.value);
    inputsContainer.innerHTML = "";
    if (isNaN(count)) return;
    for (let i = 1; i <= count; i++) {
        const el = document.createElement("div");
        el.className = "col-md-6";
        el.innerHTML = `
          <label>Amenity ${i} Name</label>
          <input type="text" class="form-control mb-2" name="amenityName${i}" required>
          <label>Amenity ${i} Icon URL</label>
          <input type="text" class="form-control mb-3" name="amenityImage${i}" required>
        `;
        inputsContainer.appendChild(el);
    }
});

document.getElementById("addTabForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const tabName = document.getElementById("inputTabName").value.trim();
    const iconURL = document.getElementById("inputTabIconURL").value.trim();
    const description = document.getElementById("inputDescription").value.trim() || "Null";
    const imageURL = document.getElementById("inputTabImageURL").value.trim() || "";
    const count = parseInt(amenitiesSelect.value);

    const amenities = [];
    for (let i = 1; i <= count; i++) {
        const name = document.querySelector(`input[name="amenityName${i}"]`).value.trim();
        const image = document.querySelector(`input[name="amenityImage${i}"]`).value.trim();
        amenities.push({ name, image });
    }

    const payload = {
        name: tabName,
        icon: iconURL,
        description,
        image: imageURL,
        amenities
    };

    try {
        const res = await fetch("amenities-backend-production.up.railway.app/api/add-tab", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `BabunRoy ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (res.ok) {
            alert("Tab added successfully!");
            document.getElementById("addTabForm").reset();
            inputsContainer.innerHTML = "";
        } else {
            alert(result.message || "Failed to add tab");
        }
    } catch (err) {
        console.error(err);
        alert("Server error while adding tab");
    }
});



const selectedTabs = new Set();

async function loadTabs() {
    try {
        const res = await fetch("amenities-backend-production.up.railway.app/api/tabsData");
        const data = await res.json();

        const tabButtonsContainer = document.getElementById("tabButtons");
        tabButtonsContainer.innerHTML = "";

        const tabs = Array.isArray(data) ? data : data.data || [];

        Object.entries(data).forEach(([key]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = key;
            button.className = "btn btn-outline-success";

            button.addEventListener("click", () => {
                if (selectedTabs.has(key)) {
                    selectedTabs.delete(key);
                    button.classList.remove("btn-danger");
                    button.classList.add("btn-outline-success");
                } else {
                    selectedTabs.add(key);
                    button.classList.remove("btn-outline-success");
                    button.classList.add("btn-danger");
                }
            });

            tabButtonsContainer.appendChild(button);
        });

    } catch (err) {
        console.error("Failed to fetch tabs", err);
        alert("Failed to load tabs");
    }
}

document.getElementById("deleteTabForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (selectedTabs.size === 0) {
        alert("Please select at least one tab to delete.");
        return;
    }

    const tabsToDelete = Array.from(selectedTabs);

    if (!confirm(`Are you sure you want to delete these tab(s)?\n${tabsToDelete.join(", ")}`)) return;

    const token = localStorage.getItem("authToken"); // adjust this line if you store the token differently

    try {
        const res = await fetch("amenities-backend-production.up.railway.app/api/delete-tabs", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `BabunRoy ${token}`
            },
            body: JSON.stringify({ tabs: tabsToDelete })
        });

        const result = await res.json();

        if (res.status === 200) {
            alert("Selected tabs deleted successfully.");
            selectedTabs.clear();
            loadTabs();
        } else {
            alert(result.message || "Failed to delete tabs.");
        }

    } catch (error) {
        console.error("Error deleting tabs:", error);
        alert("Error occurred while deleting tabs.");
    }
});


document.getElementById("logout").addEventListener("click",() =>{
    // alert("clicled on logout btn")
    localStorage.removeItem("authToken");//// will remove the authtoken from localstoreage
    alert("You have been logged out.");
    window.location.href = "index.html"
})

