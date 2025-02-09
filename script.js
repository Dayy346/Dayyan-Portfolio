document.addEventListener("DOMContentLoaded", () => {
    const username = "YOUR_GITHUB_USERNAME"; // Replace with your GitHub username
    const projectList = document.getElementById("project-list");

    fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
        .then(response => response.json())
        .then(data => {
            projectList.innerHTML = ""; // Clear the list first

            data.forEach(repo => {
                // Only show repositories that are not forks
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
