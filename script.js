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
    async function fetchLeetCodeSubmissions() {
        const usernamel = "dayy345"; 
        const query = `
            {
                recentAcSubmissionList(username: "${usernamel}") {
                    title
                    titleSlug
                    timestamp
                }
            }
        `;
    
        const response = await fetch("https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });
    
        const data = await response.json();
        const problems = data.data.recentAcSubmissionList;
        
        const leetCodeList = document.getElementById("leetcode-list");
        leetCodeList.innerHTML = "";
    
        problems.slice(0, 5).forEach(problem => {
            const problemElement = document.createElement("div");
            problemElement.classList.add("leetcode-item");
            problemElement.innerHTML = `
                <p><strong>${problem.title}</strong> - Solved on ${new Date(problem.timestamp * 1000).toLocaleDateString()}</p>
                <a href="https://leetcode.com/problems/${problem.titleSlug}" target="_blank">View Problem</a>
            `;
            leetCodeList.appendChild(problemElement);
        });
    }
    
    fetchLeetCodeSubmissions();
    
});
