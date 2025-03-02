document.addEventListener("DOMContentLoaded", async function () {
    const resultsContainer = document.getElementById("results-container");
    const loadingBar = document.getElementById("loading-bar");

    // Make sure the results container is hidden initially
    if (resultsContainer) {
        resultsContainer.classList.add("hidden");
    }

    const houseIcon = 'resources/house.webp';
    const catIcon = 'resources/still-cat.webp';

    // Example routes
    let paths = [
        { distance: 10, efficiency: 90, cost: 5, emissions: 0.1, mcdonalds: 1, weather: "" },
        { distance: 25, efficiency: 75, cost: 10, emissions: 0.3, mcdonalds: 2, weather: "" },
        { distance: 50, efficiency: 60, cost: 20, emissions: 0.7, mcdonalds: 3, weather: "" },
    ];

    // Get Weather Data
    async function fetchWeather() {
        try {
            const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Boston&appid=YOUR_API_KEY");
            const data = await response.json();
            const condition = data.weather[0].main;
            return condition;
        } catch (error) {
            console.error("Weather API Error:", error);
            return "Unknown";
        }
    }

    // Determine weather icon based on condition
    function getWeatherIcon(condition) {
        if (condition.includes("Rain")) return "🌧️";
        if (condition.includes("Snow")) return "❄️";
        if (condition.includes("Cloud")) return "☁️";
        if (condition.includes("Clear")) return "☀️";
        return "❓";
    }

    // Wait for weather data before rendering
    try {
        const weatherCondition = await fetchWeather();
        paths.forEach(path => {
            path.weather = getWeatherIcon(weatherCondition);
        });
    } catch (error) {
        console.error("Error fetching weather:", error);
        paths.forEach(path => {
            path.weather = "☀️"; // Default to sunny if error
        });
    }

    // Read user-selected priorities
    function getSelectedMetrics() {
        try {
            return {
                sustainability: document.getElementById("sustainability").checked,
                cost: document.getElementById("cost").checked,
                time: document.getElementById("time").checked,
                mcdonalds: document.getElementById("McDonalds").checked,
            };
        } catch (error) {
            console.error("Error reading metrics, using defaults:", error);
            return {
                sustainability: true,
                cost: true,
                time: true,
                mcdonalds: true
            };
        }
    }

    // Scoring function based on priorities
    function calculateScore(path, priorities) {
        let score = 0;
        if (priorities.sustainability) score += (100 - path.emissions * 100); // Lower emissions = better
        if (priorities.cost) score += (100 - path.cost * 5); // Lower cost = better
        if (priorities.time) score += (100 - path.distance * 2); // Shorter distance = better
        if (priorities.mcdonalds) score += path.mcdonalds * 10; // More McDonald's = better
        return score;
    }

    // Sort paths based on best value
    function sortPathsByBestValue() {
        const priorities = getSelectedMetrics();
        paths.forEach(path => {
            path.score = calculateScore(path, priorities);
        });
        paths.sort((a, b) => b.score - a.score);
    }

    // Display results
    function displayResults() {
        if (!resultsContainer) {
            console.error("Results container not found!");
            return;
        }
        
        resultsContainer.innerHTML = "";
        // resultsContainer.classList.remove("hidden");
    
        paths.forEach((path, index) => {
            const entry = document.createElement("div");
            entry.classList.add("path-entry");
    
            // Progress bar based on distance (ensuring a minimum width)
            const scaledWidth = Math.max(30, 100 - path.distance);
    
            // Create HTML content with background images for icons
            entry.innerHTML = `
        <head>
            <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title> KatMaps </title>
            <link rel="stylesheet" type="text/css" href="results.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        </head>
                <div class="info-box hidden">
                    <p>🚗 Distance: ${path.distance} miles</p>
                    <p>🌱 Emissions: ${path.emissions} tons CO2</p>
                    <p>💰 Cost: $${path.cost}</p>
                    <p>🍔 McDonald's: ${path.mcdonalds}</p>
                </div>
                <div class="rbar-container" style="display: flex; align-items: center; gap: 5px;">
                    <img src="house.webp" style="height: 20px; width: auto;">
                    <div class="rba-bar" style="width: ${scaledWidth}%; height: 10px; background-color: #4CAF50;"></div>
                    <img src="still-cat.webp" style="height: 20px; width: auto;">
                </div>
                <span class="weather-icon">${path.weather || "☀️"}</span>
            `;
    
            // Add hover effect for info box
            entry.addEventListener("mouseenter", () => {
                const infoBox = entry.querySelector(".info-box");
                if (infoBox) infoBox.classList.remove("hidden");
            });
            
            entry.addEventListener("mouseleave", () => {
                const infoBox = entry.querySelector(".info-box");
                if (infoBox) infoBox.classList.add("hidden");
            });
    
            resultsContainer.appendChild(entry);
        });
    }

    // Add styles for background images
    const style = document.createElement("style");
    style.textContent = `
        .icon {
            width: 40px;
            height: 40px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        .house-icon {
            background-image: url('${houseIcon}');
        }
        .cat-icon {
            background-image: url('${catIcon}');
        }
    `;
    document.head.appendChild(style);

    // Run sorting and display results after a delay
    setTimeout(() => {
        try {
            sortPathsByBestValue();
            displayResults();
        } catch (error) {
            console.error("Error displaying results:", error);
            // Fallback display in case of error
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="path-entry error-entry">
                        <p>Unable to load routes. Please try again.</p>
                    </div>
                `;
            }
        }
    }, 1000); // Reduced delay for testing
});
