// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const scrollDownButton = document.getElementById('scrollDown');
    scrollDownButton.addEventListener('click', () => {
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    });
});
