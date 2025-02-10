document.addEventListener("DOMContentLoaded", () => {
    const username = "dayy346"; // Your GitHub username
    const projectList = document.getElementById("project-list");

    // Typing Animation
    const textElement = document.getElementById("animated-text");
    const words = ["Dayyan Hamid", "Software Engineer", "Full-Stack Developer", "QA Developer"];
    let wordIndex = 0;
    let letterIndex = 0;
    let currentText = "";
    let isDeleting = false;

    function typeEffect() {
        if (!isDeleting && letterIndex < words[wordIndex].length) {
            currentText += words[wordIndex][letterIndex];
            letterIndex++;
        } else if (isDeleting && letterIndex > 0) {
            currentText = currentText.substring(0, letterIndex - 1);
            letterIndex--;
        }

        textElement.innerHTML = currentText + '<span class="cursor">|</span>';

        if (!isDeleting && letterIndex === words[wordIndex].length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500); // Pause before deleting
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(typeEffect, isDeleting ? 100 : 200);
    }

    typeEffect(); // Start the typing effect

    // Fetch GitHub Repos
    fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
        .then(response => response.json())
        .then(data => {
            projectList.innerHTML = "";
            data.forEach(repo => {
                if (!repo.fork) {
                    const project = document.createElement("div");
                    project.classList.add("project-item");
                    project.innerHTML = `
                        <h3>${repo.name.replace(/-/g, " ")}</h3>
                        <p>${repo.description || "No description provided."}</p>
                        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                    `;
                    projectList.appendChild(project);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching repos:", error);
            projectList.innerHTML = "<p>Failed to load projects.</p>";
        });
});
