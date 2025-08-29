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

    // Show typing indicator
    const typingElement = document.createElement("p");
    typingElement.innerHTML = `<strong>Bot:</strong> <em>Typing...</em>`;
    typingElement.style.opacity = "0.7";
    typingElement.style.fontStyle = "italic";
    chatBox.appendChild(typingElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate typing delay for better UX
    setTimeout(() => {
        // Remove typing indicator
        chatBox.removeChild(typingElement);
        
        // Generate response
        const botReply = generateChatbotResponse(userMessage);
        
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
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Simple chatbot response generator
function generateChatbotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Project-related queries
    if (message.includes("project") || message.includes("work")) {
        if (message.includes("list") || message.includes("all")) {
            return "Here are some of my main projects:\n• LeNet5Tool - Built ML models for labeled datasets\n• AI_final - Compared Perceptron vs Naïve Bayes algorithms\n• Price Tracker Extension - Chrome extension for tracking prices\n• NFC Attendance System - Java app for attendance tracking\n• EmailSpamChecker - ML-based email classification\n• DiscordMusicBot - Python bot for music streaming\n• This portfolio site - Built with modern web tech";
        }
        
        if (message.includes("lenet") || message.includes("ml") || message.includes("machine learning")) {
            return "LeNet5Tool was a cool project where I modified the LeNet-5 architecture to build ML models for different datasets. Really got into neural networks and computer vision with that one.";
        }
        
        if (message.includes("ai") || message.includes("perceptron") || message.includes("naive bayes")) {
            return "AI_final was interesting - I compared Perceptron and Naïve Bayes algorithms for classification. Built both from scratch and analyzed their performance differences.";
        }
        
        if (message.includes("price") || message.includes("tracker") || message.includes("chrome")) {
            return "The Price Tracker Extension was fun to build. It's a Chrome extension that monitors product prices and alerts users when prices drop. Used React, Puppeteer for scraping, and Node.js backend.";
        }
        
        if (message.includes("nfc") || message.includes("attendance")) {
            return "Built an NFC Attendance System in Java that reads NFC tags via USB to track attendance. When you scan a tag, it logs the data to a spreadsheet. Pretty straightforward but effective.";
        }
        
        if (message.includes("spam") || message.includes("email")) {
            return "EmailSpamChecker uses ML to classify emails as spam or legitimate. It's a practical solution for automated spam detection.";
        }
        
        if (message.includes("discord") || message.includes("music") || message.includes("bot")) {
            return "The DiscordMusicBot joins voice channels and plays music from YouTube URLs. Built with discord.py and yt-dlp for streaming. Great for hanging out with friends online.";
        }
        
        if (message.includes("portfolio") || message.includes("website")) {
            return "This portfolio site shows off my projects, GitHub activity, and problem-solving skills. Has an interactive chat, GitHub stats, LeetCode profile, and even my powerlifting stuff!";
        }
    }
    
    // Skills queries
    if (message.includes("skill") || message.includes("technology") || message.includes("tech")) {
        if (message.includes("frontend") || message.includes("react") || message.includes("javascript")) {
            return "For frontend work, I use React, JavaScript, HTML5, CSS3, and TypeScript. Love building responsive interfaces that users actually enjoy using.";
        }
        
        if (message.includes("backend") || message.includes("node") || message.includes("python")) {
            return "Backend-wise, I work with Node.js, Express.js, Python, Java, and build REST APIs. Focus on creating solid, scalable server-side solutions.";
        }
        
        if (message.includes("data") || message.includes("power bi") || message.includes("sharepoint")) {
            return "My data skills include Power BI, SharePoint, Power Platform, SQL, and data analysis. Used these a lot at Regeneron for pharmaceutical documentation and reporting.";
        }
        
        return "My tech stack covers frontend (React, JavaScript), backend (Node.js, Python, Java), data tools (Power BI, SharePoint), and dev tools (Git, Docker, VS Code). Pretty versatile.";
    }
    
    // Experience queries
    if (message.includes("experience") || message.includes("job") || message.includes("work")) {
        if (message.includes("collablab") || message.includes("software engineer")) {
            return "Currently working as a Software Engineer at CollabLab. I build scalable backend and frontend systems, own key features, and work with modern tech. Recently worked on our secrets management system and fixed some security vulnerabilities - that was a good challenge.";
        }
        
        if (message.includes("regeneron") || message.includes("document control")) {
            return "At Regeneron, I'm a QA Junior Document Control Analyst. I manage GxP compliant documentation using OpenText, myQumas, and TrackWise. Also work on improving SharePoint workflows and site features.";
        }
        
        if (message.includes("intern") || message.includes("qa irm")) {
            return "I was a QA IRM Developer Intern at Regeneron where I built tools using Power Platform, SharePoint, and PowerBI. Got a program extension and some internal recognition for my work.";
        }
        
        return "I've got experience as a Software Engineer at CollabLab, QA Junior Document Control Analyst at Regeneron, and was a QA IRM Developer Intern at Regeneron before that. Worked with various technologies and got some recognition for my contributions.";
    }
    
    // Personal queries
    if (message.includes("powerlifting") || message.includes("fitness") || message.includes("competition")) {
        return "I'm into competitive powerlifting! Competed at the Collegiate Powerlifting Championships in December 2024 and got 6th place. Shows discipline and ability to perform under pressure - skills that definitely help in software engineering.";
    }
    
    if (message.includes("fishing") || message.includes("hobby")) {
        return "When I'm not coding or lifting, I'm fishing. Love the patience and strategy it requires - actually translates pretty well to problem-solving in software development.";
    }
    
    if (message.includes("rutgers") || message.includes("university") || message.includes("education")) {
        return "Graduated from Rutgers University with a Computer Science degree in May 2025. Got a solid foundation in algorithms, data structures, and software engineering principles.";
    }
    
    // Greetings
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
        return "Hey! I can tell you about my projects, skills, experience, or personal interests. What would you like to know?";
    }
    
    if (message.includes("help") || message.includes("what can you do")) {
        return "I can help you learn about:\n• My projects and technical work\n• My skills and technologies\n• My professional experience\n• My personal interests (powerlifting, fishing)\n• My education at Rutgers\n\nJust ask me anything!";
    }
    
    // Default response
    return "Not sure about that specific question, but I can tell you about my projects, skills, experience, or personal interests. Try asking about something specific or say 'help' to see what I can do!";
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
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
    
    // Initialize chatbot with welcome message
    initializeChatbot();
    
    // Add loading states and error handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
    });
});

// Initialize chatbot with welcome message
function initializeChatbot() {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
        // Add welcome message
        const welcomeElement = document.createElement("p");
        welcomeElement.innerHTML = `<strong>Bot:</strong> 👋 Hey! I can tell you about Dayyan's projects, skills, experience, or personal interests. Try asking me something like "Tell me about your projects" or "What are your skills?"`;
        welcomeElement.style.opacity = "0";
        welcomeElement.style.transform = "translateY(10px)";
        chatBox.appendChild(welcomeElement);
        
        // Animate in
        setTimeout(() => {
            welcomeElement.style.transition = "all 0.5s ease";
            welcomeElement.style.opacity = "1";
            welcomeElement.style.transform = "translateY(0)";
        }, 100);
    }
}

// Make functions globally available
window.sendMessage = sendMessage;
window.smoothScrollTo = smoothScrollTo;
