(function() {
    const toggle = document.getElementById('subpageThemeToggle');
    const body = document.body;

    function setTheme(dark) {
        if (dark) {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        updateIcon(dark);
    }

    function updateIcon(dark) {
        if (!toggle) return;
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    function initTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            setTheme(true);
        } else if (saved === 'light') {
            setTheme(false);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark);
        }
    }

    if (toggle) {
        toggle.addEventListener('click', function() {
            setTheme(!body.classList.contains('dark'));
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    initTheme();
})();
