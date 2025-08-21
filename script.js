// Enhanced Portfolio JavaScript with Smooth Animations & Better UX
async function sendMessage() {
    const inputField = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");

    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    // Add user message with typing animation
    const userMessageElement = document.createElement("p");
    userMessageElement.innerHTML = `<strong>You:</strong> ${userMessage}`;
    userMessageElement.style.opacity = "0";
    userMessageElement.style.transform = "translateY(10px)";
    chatBox.appendChild(userMessageElement);
    
    // Animate in
    setTimeout(() => {
        userMessageElement.style.transition = "all 0.3s ease";
        userMessageElement.style.opacity = "1";
        userMessageElement.style.transform = "translateY(0)";
    }, 10);

    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

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

        // Add bot reply with typing animation
        const botMessageElement = document.createElement("p");
        botMessageElement.innerHTML = `<strong>Bot:</strong> ${botReply}`;
        botMessageElement.style.opacity = "0";
        botMessageElement.style.transform = "translateY(10px)";
        chatBox.appendChild(botMessageElement);
        
        // Animate in
        setTimeout(() => {
            botMessageElement.style.transition = "all 0.3s ease";
            botMessageElement.style.opacity = "1";
            botMessageElement.style.transform = "translateY(0)";
        }, 10);

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessageElement = document.createElement("p");
        errorMessageElement.innerHTML = `<strong>Bot:</strong> Sorry, I'm still working on this feature. Please try again later!`;
        errorMessageElement.style.opacity = "0";
        errorMessageElement.style.transform = "translateY(10px)";
        chatBox.appendChild(errorMessageElement);
        
        setTimeout(() => {
            errorMessageElement.style.transition = "all 0.3s ease";
            errorMessageElement.style.opacity = "1";
            errorMessageElement.style.transform = "translateY(0)";
        }, 10);
    }
}

// Enhanced typing effect with better performance
function createTypingEffect(element, words, speed = 150) {
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let currentText = "";

    function type() {
        const currentWord = words[wordIndex];
        
        if (!isDeleting) {
            if (letterIndex < currentWord.length) {
                currentText = currentWord.substring(0, letterIndex + 1);
                letterIndex++;
            } else {
                isDeleting = true;
                setTimeout(type, 2000); // Pause at end
                return;
            }
        } else {
            if (letterIndex > 0) {
                currentText = currentWord.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }
        
        element.innerHTML = currentText + '<span class="cursor">|</span>';
        setTimeout(type, isDeleting ? speed / 2 : speed);
    }
    
    type();
}

// Smooth scroll animation
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Intersection Observer for scroll animations
function createScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Enhanced project filtering and display
function createProjectCard(repo) {
    const project = document.createElement("div");
    project.classList.add("project-item");
    project.style.opacity = "0";
    project.style.transform = "translateY(20px)";
    
    // Create project content
    project.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${repo.name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <div class="project-meta">
                <span class="project-language">${repo.language || 'Various'}</span>
                <span class="project-stars">⭐ ${repo.stargazers_count || 0}</span>
            </div>
        </div>
        <p class="project-desc">${repo.description || "A well-crafted project showcasing modern development practices and problem-solving skills."}</p>
        <div class="project-footer">
            <a href="${repo.html_url}" target="_blank" class="github-link">🔗 View on GitHub</a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="live-link">🌐 Live Demo</a>` : ''}
        </div>
    `;
    
    return project;
}

// Animate projects in sequence
function animateProjectsIn(projects) {
    projects.forEach((project, index) => {
        setTimeout(() => {
            project.style.transition = 'all 0.5s ease';
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Enhanced GitHub integration
async function fetchAndDisplayProjects() {
    const username = "dayy346";
    const projectList = document.getElementById("project-list");
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await response.json();
        
        // Filter and sort projects
        const filteredRepos = repos
            .filter(repo => !repo.fork && 
                !['Dayyan-Portfolio', 'Dayy346', 'DailyCodingDashboard'].includes(repo.name))
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 12); // Show top 12 projects
        
        projectList.innerHTML = "";
        
        const projectElements = filteredRepos.map(repo => {
            const projectElement = createProjectCard(repo);
            projectList.appendChild(projectElement);
            return projectElement;
        });
        
        // Animate projects in
        animateProjectsIn(projectElements);
        
    } catch (error) {
        console.error("Error fetching repos:", error);
        projectList.innerHTML = `
            <div class="error-message">
                <p>🚧 Unable to load projects at the moment.</p>
                <p>Please check out my <a href="https://github.com/${username}" target="_blank">GitHub profile</a> directly!</p>
            </div>
        `;
    }
}

// Enhanced LeetCode stats with loading state
async function fetchLeetCodeStats() {
    const username = "dayy345";
    const leetcodeList = document.getElementById("leetcode-list");
    
    if (!leetcodeList) return; // Element might not exist in new design
    
    try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        const data = await response.json();
        
        if (data.status !== "success") {
            throw new Error("Failed to fetch LeetCode data");
        }
        
        // Create enhanced stats display
        const statsHTML = `
            <div class="leetcode-stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${data.totalSolved}</div>
                    <div class="stat-label">Total Solved</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${data.easySolved}/${data.totalEasy}</div>
                    <div class="stat-label">Easy</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${data.mediumSolved}/${data.totalMedium}</div>
                    <div class="stat-label">Medium</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${data.hardSolved}/${data.totalHard}</div>
                    <div class="stat-label">Hard</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">#${data.ranking}</div>
                    <div class="stat-label">Ranking</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${data.acceptanceRate}%</div>
                    <div class="stat-label">Acceptance Rate</div>
                </div>
            </div>
        `;
        
        leetcodeList.innerHTML = statsHTML;
        
    } catch (error) {
        console.error("Error fetching LeetCode stats:", error);
        if (leetcodeList) {
            leetcodeList.innerHTML = `
                <div class="error-message">
                    <p>📊 Unable to load LeetCode statistics.</p>
                    <p>Check out my <a href="https://leetcode.com/${username}" target="_blank">LeetCode profile</a> directly!</p>
                </div>
            `;
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize typing effect
    const textElement = document.getElementById("animated-text");
    const words = [
        "Dayyan Hamid",
        "Software Engineer", 
        "Full-Stack Developer",
        "Data Engineer",
        "QA Developer",
        "Data Analyst"
    ];
    
    if (textElement) {
        createTypingEffect(textElement, words, 150);
    }
    
    // Initialize scroll animations
    createScrollAnimations();
    
    // Fetch and display projects
    fetchAndDisplayProjects();
    
    // Fetch LeetCode stats
    fetchLeetCodeStats();
    
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });
    
    // Add enter key support for chat
    const chatInput = document.getElementById("chat-input");
    if (chatInput) {
        chatInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
    
    // Add loading states and error handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
    });
});

// Make functions globally available
window.sendMessage = sendMessage;
window.smoothScrollTo = smoothScrollTo;
