document.getElementById("tools-btn").addEventListener("mouseover", () => {
    const tools_dropdown = document.getElementById("tools-dropdown");
    tools_dropdown.classList.remove('invisible');
    tools_dropdown.classList.add('visible');
})

document.getElementById("tools-container").addEventListener("mouseleave", () => {
    const tools_dropdown = document.getElementById("tools-dropdown");
    tools_dropdown.classList.remove('visible');
    tools_dropdown.classList.add('invisible');
})