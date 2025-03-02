document.addEventListener("DOMContentLoaded", function () {
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
    const catButton = document.createElement("button");
    const resultText = document.createElement("p");
    const progressContainer = document.createElement("div");
    const progressBar = document.createElement("div");

    catButton.classList.add("cat-button");
    resultText.id = "result-text";
    resultText.style.fontWeight = "bold";

    progressContainer.classList.add("progress-container");
    progressBar.classList.add("progress-bar");
    progressContainer.appendChild(progressBar);

    document.querySelector(".location-container").appendChild(catButton);
    document.querySelector(".location-container").appendChild(progressContainer);
    document.querySelector(".location-container").appendChild(resultText);

    catButton.addEventListener("click", () => {
        const startLocation = startInput.value.trim();
        const endLocation = endInput.value.trim();

        if (!startLocation || !endLocation) {
            resultText.textContent = "Please enter both locations.";
            resultText.style.color = "red";
            return;
        }

        // change button to running state
        catButton.classList.add("cat-running");
        resultText.textContent = `Fetching best route... \n (From: ${startLocation} → To: ${endLocation})`;
        resultText.style.color = "black";

        // prog bar
        progressContainer.style.display = "block";
        progressBar.style.width = "0%";

        // fake ahh loading effect
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(progressInterval);
            } else {
                progress += 20;
                progressBar.style.width = `${progress}%`;
            }
        }, 500);

        // send loc data to mat
        fetch("http://127.0.0.1:5000/get_route", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ start: startLocation, end: endLocation }),
        })
        .then(response => response.json())
        .then(data => {
            resultText.textContent = `Route: ${data.route}`;
            resultText.style.color = "green";
        })
        .catch(error => {
            console.error("Error:", error);
            resultText.textContent = "Error fetching route.";
            resultText.style.color = "red";
        })
        .finally(() => {
            setTimeout(() => {
                progressContainer.style.display = "none"; // Hide progress bar
                catButton.classList.remove("cat-running"); // Reset to standing image
            }, 2000);
        });
    });
});