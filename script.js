// ... (calculateNormal and calculateAlgebraic functions remain the same) ...

// --- Function to handle the file system folder toggling (MODIFIED) ---
function initializeFileSystem() {
    // Select all elements that can be clicked to toggle content (folders)
    const folderNames = document.querySelectorAll('.folder-name');

    folderNames.forEach(folderNameElement => {
        const parentFolder = folderNameElement.closest('.folder');
        
        // Find the IMMEDIATE sibling that holds the content (the actual folder content)
        const content = folderNameElement.nextElementSibling;
        
        if (content && content.classList.contains('folder-content')) {
            // Initially collapse the content
            content.style.display = 'none';
            
            folderNameElement.addEventListener('click', (event) => {
                event.preventDefault(); 
                
                let isCollapsed = content.style.display === 'none';
                
                content.style.display = isCollapsed ? 'block' : 'none';
                
                // Update the icon
                const icon = folderNameElement.querySelector('.icon');
                if (icon) {
                    icon.textContent = isCollapsed ? '📂' : '📁';
                }
            });
        }
    });

    // Initial icon setup (if they don't already have one)
    document.querySelectorAll('.folder-name').forEach(el => {
        if (!el.querySelector('.icon')) {
            el.innerHTML = `<span class="icon">📁</span> ${el.textContent}`;
        }
    });
}


// --- Run functions when the page loads (Unchanged) ---
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('calculator-page')) {
        // Initialize both calculator modes, hidden/shown via tabs
        calculateNormal();
        calculateAlgebraic();

        // Initial tab setup
        document.getElementById('normal-calc').style.display = 'block';
        document.getElementById('alg-calc').style.display = 'none';

        // Add event listeners for tab switching
        document.querySelectorAll('.calc-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                if (this.textContent === 'Normal Calc') {
                    document.getElementById('normal-calc').style.display = 'block';
                    document.getElementById('alg-calc').style.display = 'none';
                } else if (this.textContent === 'Alg Calc') {
                    document.getElementById('normal-calc').style.display = 'none';
                    document.getElementById('alg-calc').style.display = 'block';
                }
            });
        });
    }
    if (document.getElementById('file-explorer-page')) {
        initializeFileSystem();
    }
});
