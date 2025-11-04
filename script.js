// Function to handle the basic calculator logic (for Normal Calc)
function calculate() {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.calculator-ui .btn');
    
    // Check if the calculator is present on the page
    if (!display || buttons.length === 0) return;

    let currentInput = '0';
    let operator = null;
    let previousValue = null;

    // Helper to update the display
    function updateDisplay(value) {
        display.value = value.toString().substring(0, 15); // Limit length
    }

    // Function to perform the arithmetic
    function performCalculation() {
        let result;
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case 'x':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }
        currentInput = result;
        operator = null;
        previousValue = null;
        updateDisplay(currentInput);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            
            if (button.classList.contains('num')) {
                // Number or Decimal
                if (currentInput === '0' && value !== '.') {
                    currentInput = value;
                } else if (value === '.' && currentInput.includes('.')) {
                    // Do nothing if decimal already exists
                } else {
                    currentInput += value;
                }
                updateDisplay(currentInput);

            } else if (button.classList.contains('op')) {
                // Operator (+, -, x, /) or Equals (=)
                if (value === '=') {
                    performCalculation();
                } else {
                    if (previousValue !== null && operator !== null) {
                        performCalculation();
                        previousValue = currentInput;
                    } else if (currentInput !== '0') {
                        previousValue = currentInput;
                    }
                    operator = value;
                    currentInput = '0';
                }

            } else if (button.classList.contains('fn')) {
                // Function Buttons (AC, ±, %)
                if (value === 'AC') {
                    currentInput = '0';
                    operator = null;
                    previousValue = null;
                } else if (value === '±') {
                    currentInput = (parseFloat(currentInput) * -1).toString();
                } else if (value === '%') {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                }
                updateDisplay(currentInput);
            }
        });
    });
}

// Function to handle the file system folder toggling
function initializeFileSystem() {
    const folders = document.querySelectorAll('.folder-name');

    folders.forEach(folderNameElement => {
        // Find the parent folder div
        const parentFolder = folderNameElement.closest('.folder');
        
        // Find the content immediately following the folder name (subfolders/files)
        let content = parentFolder.nextElementSibling;
        
        // In the HTML structure, the content is nested *inside* the parent folder for deep nesting.
        // We need to target the *next* elements (the children folders)
        
        // Find the direct children folders of this folder (if they exist)
        const childrenFolders = parentFolder.querySelectorAll('.folder:not(:first-child)');
        
        if (childrenFolders.length > 0) {
            // Initially collapse them
            childrenFolders.forEach(child => child.style.display = 'none');
            
            folderNameElement.addEventListener('click', () => {
                // Toggle the display of the next level of folders
                let isCollapsed = childrenFolders[0].style.display === 'none';
                
                childrenFolders.forEach(child => {
                    child.style.display = isCollapsed ? 'block' : 'none';
                });
                
                // Update the icon
                const icon = folderNameElement.querySelector('.icon');
                if (icon) {
                    icon.textContent = isCollapsed ? '📂' : '📁';
                }
            });
        }
    });

    // Re-select all folder names to apply the initial state and icons
    document.querySelectorAll('.folder-name').forEach(el => {
        if (!el.querySelector('.icon')) {
            el.innerHTML = `<span class="icon">📁</span> ${el.textContent}`;
        }
    });

    // Handle initial collapse (for the structure in file_explorer.html)
    document.querySelectorAll('.grade-folder').forEach(el => {
        const gradeContent = el.querySelector('.subject-folder');
        if (gradeContent) gradeContent.style.display = 'none';
    });
}

// Run functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only run calculator logic on the calculator page
    if (document.getElementById('calculator-page')) {
        calculate();
    }
    // Only run file system logic on the file explorer page
    if (document.getElementById('file-explorer-page')) {
        initializeFileSystem();
    }
});
