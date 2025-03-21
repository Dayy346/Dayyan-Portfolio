async function sendMessage() {
    const inputField = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");

    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    inputField.value = "";

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistral-7b-instruct",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

        chatBox.innerHTML += `<p><strong>Bot:</strong> ${botReply}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Chatbot error:", error);
        chatBox.innerHTML += `<p><strong>Bot:</strong> Sorry, I'm still working on this feature.</p>`;
    }
}
window.sendMessage = sendMessage;
document.addEventListener("DOMContentLoaded", async () => {
    const username = "dayy346"; 
    const projectList = document.getElementById("project-list");

    if (!projectList) {
        console.error("Project list container not found.");
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        projectList.innerHTML = "";  // Clear previous content

        if (data.length === 0) {
            projectList.innerHTML = "<p>No projects found.</p>";
            return;
        }

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

    } catch (error) {
        console.error("Error fetching GitHub repos:", error);
        projectList.innerHTML = "<p>Failed to load projects.</p>";
    }
});

