document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Activate the clicked tab and its content
            tab.classList.add('active');
            const tabId = tab.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
});
