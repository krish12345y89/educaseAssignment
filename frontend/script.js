const API_BASE = "http://localhost:5001/api" || "http://74.224.88.123:5001/api"; // Change if deploying

// Add School
document.getElementById("addSchoolForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    const response = await fetch(`${API_BASE}/addSchool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, latitude, longitude })
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message || "Error adding school!";
});

// Get Nearby Schools
document.getElementById("getSchools").addEventListener("click", async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const response = await fetch(`${API_BASE}/listSchools?latitude=${latitude}&longitude=${longitude}`);
            const schools = await response.json();
            
            const schoolList = document.getElementById("schoolList");
            schoolList.innerHTML = "";

            schools.schools.forEach(school => {
                const li = document.createElement("li");
                li.textContent = `${school.name} - ${school.address} (Distance: ${school.distance.toFixed(2)} km)`;
                schoolList.appendChild(li);
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
