document.addEventListener("DOMContentLoaded", () => {
    const username = "dayy346"; 
    const projectList = document.getElementById("project-list");

    // Typing Animation
    const textElement = document.getElementById("animated-text");
    const words = ["Dayyan Hamid", "Software Engineer", "Full-Stack Developer", "Data Engineer" , "QA Developer", "Data Analyst"];
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let currentText = "";
    let typingSpeed = 200; // Consistent typing speed

    function typeEffect() {
        if (!isDeleting) {
            if (letterIndex < words[wordIndex].length) {
                currentText += words[wordIndex][letterIndex];
                letterIndex++;
            } else {
                isDeleting = true;
                setTimeout(typeEffect, 1500); // Pause before deleting
                return;
            }
        } else {
            if (letterIndex > 0) {
                currentText = currentText.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        textElement.innerHTML = currentText + '<span class="cursor">|</span>';
        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
    // Fetch GitHub Repos
    fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
    .then(response => response.json())
    .then(data => {
        projectList.innerHTML = "";
        data.forEach(repo => {
            if (!repo.fork && repo.name !== "Dayyan-Portfolio" && repo.name !== "Dayy346") {
                const project = document.createElement("div");
                project.classList.add("project-item");
                project.innerHTML = `
                    <h3 class="project-title">${repo.name.replace(/-/g, " ")}</h3>
                    <p class="project-desc">${repo.description || "No description provided."}</p>
                    <a href="${repo.html_url}" target="_blank" class="github-link">View on GitHub</a>
                `;
                projectList.appendChild(project);
            }
        });
    })
    .catch(error => {
        console.error("Error fetching repos:", error);
        projectList.innerHTML = "<p>Failed to load projects.</p>";
    });
    async function fetchLeetCodeStats() {
        const username = "dayy345"; 
        const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
    
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            if (data.status !== "success") {
                document.getElementById("leetcode-list").innerHTML = "Failed to fetch data.";
                return;
            }
    
            document.getElementById("leetcode-list").innerHTML = `
                <p><strong>Total Solved:</strong> ${data.totalSolved} / ${data.totalQuestions}</p>
                <p><strong>Easy:</strong> ${data.easySolved} / ${data.totalEasy}</p>
                <p><strong>Medium:</strong> ${data.mediumSolved} / ${data.totalMedium}</p>
                <p><strong>Hard:</strong> ${data.hardSolved} / ${data.totalHard}</p>
                <p><strong>Ranking:</strong> #${data.ranking}</p>
                <p><strong>Acceptance Rate:</strong> ${data.acceptanceRate}%</p>
            `;
        } catch (error) {
            console.error("Error fetching LeetCode stats:", error);
            document.getElementById("leetcode-list").innerHTML = "Error fetching data.";
        }
    }
    
    fetchLeetCodeStats();
        
});
