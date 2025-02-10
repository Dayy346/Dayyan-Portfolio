document.addEventListener("DOMContentLoaded", () => {
    const username = "dayy346"; // Your GitHub username
    const projectList = document.getElementById("project-list");

    fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("GitHub API response:", data); // Debugging
            projectList.innerHTML = "";

            if (!Array.isArray(data)) {
                throw new Error("Unexpected API response format");
            }

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
            projectList.innerHTML = `<p>Failed to load projects. ${error.message}</p>`;
        });
});
