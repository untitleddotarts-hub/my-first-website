// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth_link");

  if (!authLink) return; // Exit if nav doesn't have an auth link

  // Try to load the stored user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("manaUser"));

  if (storedUser && storedUser.name) {
    // Create greeting container
    const userContainer = document.createElement("span");
    userContainer.style.display = "inline-flex";
    userContainer.style.alignItems = "center";
    userContainer.style.gap = "10px";

    // Greeting text
    const greeting = document.createElement("span");
    greeting.innerHTML = `👋 Hi, <strong>${storedUser.name}</strong>`;

    // Logout button
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.style.backgroundColor = "#ff4d4d";
    logoutBtn.style.color = "white";
    logoutBtn.style.border = "none";
    logoutBtn.style.padding = "4px 10px";
    logoutBtn.style.borderRadius = "8px";
    logoutBtn.style.cursor = "pointer";
    logoutBtn.style.fontSize = "14px";

    // Handle logout click
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("manaUser");
      window.location.reload();
    });

    // Clear existing link content & add greeting + button
    authLink.textContent = "";
    authLink.href = "#";
    userContainer.appendChild(greeting);
    userContainer.appendChild(logoutBtn);
    authLink.appendChild(userContainer);

  } else {
    // Not logged in — show Sign In link
    authLink.innerHTML = "👤 Sign In";
    authLink.href = "signin.html";
  }
});
