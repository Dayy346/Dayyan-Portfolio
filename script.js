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

document.addEventListener("DOMContentLoaded", () => {
    const username = "dayy346"; 
    const projectList = document.getElementById("project-list");

    const textElement = document.getElementById("animated-text");
    const words = ["Dayyan Hamid", "Software Engineer", "Full-Stack Developer", "Data Engineer", "QA Developer", "Data Analyst"];
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let currentText = "";
    let typingSpeed = 200;

    function typeEffect() {
        if (!isDeleting) {
            if (letterIndex < words[wordIndex].length) {
                currentText += words[wordIndex][letterIndex];
                letterIndex++;
            } else {
                isDeleting = true;
                setTimeout(typeEffect, 1500);
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });//added this for smoother scrolling 
    const projectItems = document.querySelectorAll(".project-item");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    projectItems.forEach(item => observer.observe(item));

});
