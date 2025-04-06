

// function loadAmenities(tabId, data) {
//     const container = document.getElementById(tabId + "Amenities");
//     container.innerHTML = "";

//     let rows = "<table class='table table-bordered text-center w-100'><tbody>";

//     for (let i = 0; i < 2; i++) {
//         rows += "<tr>";
//         for (let j = 0; j < 4; j++) {
//             let amenity = data.amenitie[i * 4 + j];
//             if (amenity) {
//                 rows += `
//                     <td class="amenity-cell">
//                         <img src="${amenity.image}" alt="${amenity.name}" class="amenity-img mb-2">
//                         <p class="amenity-text">${amenity.name}</p>
//                     </td>
//                 `;
//             } else {
//                 rows += `<td class="amenity-cell"></td>`;
//             }
//         }
//         rows += "</tr>";
//     }

//     rows += "</tbody></table>";
//     container.innerHTML = rows;
// }



// // document.addEventListener("DOMContentLoaded", ()=>{
// //     fetch("http://127.0.1.2:6006/api/tabsdata")
// //         .then(res => res.json())
// //         .then(data =>{
// //             console.log(data);

// //         })
// //         .then(data => {
// //             for (let tabKey in data) {
// //                 loadAmenities(tabKey, data[tabKey]);
// //             }
// //         })
// //         .catch(err => console.error("Error fetching amenities:", err));
// // })

// document.addEventListener("DOMContentLoaded", () => {
//     loadAmenities("patio", tabsData.Patio);
//     loadAmenities("azura", tabsData.Azura);
//     loadAmenities("panorama", tabsData.Panorama);
// });

// -------------------------------------------------------------------dynamic--------------------------------------

document.addEventListener("DOMContentLoaded", async() => {
    await fetch("https://amenities-backend-production.up.railway.app/api/tabsData")
        .then(res => res.json())
        // .then(data => console.log(data.Panorama.image))
        .then(data =>{
            Tabs(data);
            // console.log(data[azura].description);        
            console.log("data fetched successfully");
            
        })
        .catch(err => console.error("Error fetching tabs data:", err))
});


function Tabs(data) {
    const tabManu = document.getElementById("tabMenu");
    const tabContent = document.querySelector(".tab-content");

    tabManu.innerHTML = "";
    tabContent.innerHTML = "";

    const tabName = Object.keys(data);
    tabName.forEach((tabName, index) => {
        const lowerTabName = tabName.toLowerCase();
        const activeClass = index === 0 ? "active" : "";
        const showClass = index === 0 ? "show active" : "";


        const tabBtn = document.createElement("li");
        tabBtn.className = "nav-item";
        tabBtn.innerHTML = `
            <a class="nav-link ${activeClass}" data-bs-toggle="tab" href="#${lowerTabName}">
                <img style="width: 7rem;" src="${data[tabName].tabIcon}" alt="${tabName} icon">
            </a>
        `;
        tabManu.appendChild(tabBtn);

        const tabPane = document.createElement("div");
        tabPane.className = `tab-pane fade ${showClass}`;
        tabPane.id = lowerTabName;

        tabPane.innerHTML = `
            <div class="d-flex flex-column flex-md-row align-items-center">
                <div class="imageSection">
                    <img class="tab-image me-5" src="${data[tabName].image}" alt="${tabName}" style="width: 70vh;">
                </div>
                <div class="textSection ms-md-4 mt-3 mt-md-0">
                    <h3>${tabName.toUpperCase()}</h3>
                    <p>${getTabDescription(tabName,data)}</p>
                    <div class="row" id="${lowerTabName}Amenities"></div>
                </div>
            </div>
        `;
        tabContent.appendChild(tabPane);

        loadAmenities(lowerTabName, data[tabName].amenities);
        
    })
}

function getTabDescription(name,data){
    return data[name].description;
}


// loadAmenities(lowerTabName, data[tabName]);


function loadAmenities(tabId, amenitiesArray) {
    const container = document.getElementById(tabId + "Amenities");

    if (!container) {
        console.error(`Container not found: ${tabId + "Amenities"}`);
        return;
    }

    if (!Array.isArray(amenitiesArray)) {
        console.error("Amenities data is not an array:", amenitiesArray);
        return;
    }

    let rows = "<table class='table table-bordered text-center w-100'><tbody>";

    for (let i = 0; i < 2; i++) {
        let rowContent = "";
        let hasAmenity = false;

        for (let j = 0; j < 4; j++) {
            let amenity = amenitiesArray[i * 4 + j];
            if (amenity) {
                hasAmenity = true;
                rowContent += `
                    <td class="amenity-cell">
                        <img src="${amenity.image}" alt="${amenity.name}" class="amenity-img mb-2">
                        <p class="amenity-text">${amenity.name}</p>
                    </td>
                `;
            } else {
                rowContent += `<td class="amenity-cell"></td>`;
            }
        }

        if (hasAmenity) {
            rows += `<tr>${rowContent}</tr>`;
        }
    }

    rows += "</tbody></table>";
    container.innerHTML = rows;
}
