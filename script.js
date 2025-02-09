document.addEventListener("DOMContentLoaded", () => {
    fetch("https://api.github.com/users/YOUR_GITHUB_USERNAME/repos")
        .then(response => response.json())
        .then(data => {
            const projectList = document.getElementById("project-list");
            data.forEach(repo => {
                const project = document.createElement("div");
                project.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || "No description available"}</p>
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                    <hr>
                `;
                projectList.appendChild(project);
            });
        })
        .catch(error => console.error("Error fetching repos:", error));
});
