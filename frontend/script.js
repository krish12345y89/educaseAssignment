const API_BASE = "https://74.224.88.123/api"; // Corrected API base URL

// Add School
document
  .getElementById("addSchoolForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const latitude = document.getElementById("latitude").value.trim();
    const longitude = document.getElementById("longitude").value.trim();

    if (!name || !address || !latitude || !longitude) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/addSchool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, latitude, longitude }),
      });

      const data = await response.json();
      if (response.ok) {
        document.getElementById("message").textContent =
          data.message || "School added successfully!";
      } else {
        throw new Error(data.message || "Error adding school!");
      }
    } catch (error) {
      console.error("Error adding school:", error);
      document.getElementById("message").textContent =
        "Failed to add school. Please try again.";
    }
  });

// Get Nearby Schools
document.getElementById("getSchools").addEventListener("click", async () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude; // Fixed typo

        const response = await fetch(
          `${API_BASE}/listSchools?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const schoolList = document.getElementById("schoolList");
        schoolList.innerHTML = "";

        if (data.schools && data.schools.length > 0) {
          data.schools.forEach((school) => {
            const li = document.createElement("li");
            li.textContent = `${school.name} - ${
              school.address
            } (Distance: ${school.distance.toFixed(2)} km)`;
            schoolList.appendChild(li);
          });
        } else {
          schoolList.innerHTML = "<li>No nearby schools found.</li>";
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        alert("Failed to fetch school data. Please try again.");
      }
    },
    (error) => {
      console.error("Geolocation error:", error.message);
      alert("Failed to retrieve location. Please allow location access.");
    }
  );
});
