const themeButton = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('exam-theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark');
}

function updateThemeIcon() {
    if (!themeButton) return;
    themeButton.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    themeButton.setAttribute('aria-label', document.body.classList.contains('dark') ? 'Use light mode' : 'Use dark mode');
}

updateThemeIcon();

if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('exam-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        updateThemeIcon();
    });
}

const searchInput = document.getElementById('subject-search');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.trim().toLowerCase();
        document.querySelectorAll('.subject-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.classList.toggle('hidden', !text.includes(term));
        });
    });
}
