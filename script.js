// --- Function to handle the Basic Normal Calculator Logic ---
function calculateNormal() {
    const display = document.getElementById('normal-calc-display');
    const buttons = document.getElementById('normal-calc').querySelectorAll('.btn');
    
    if (!display || buttons.length === 0) return;

    let currentInput = '0';
    let operator = null;
    let previousValue = null;

    function updateDisplay(value) {
        display.value = value.toString().substring(0, 15);
    }

    function performCalculation() {
        let result;
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case 'x': result = prev * current; break;
            case '/': result = prev / current; break;
            default: return;
        }
        currentInput = result.toString();
        operator = null;
        previousValue = null;
        updateDisplay(currentInput);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            
            if (button.classList.contains('num')) {
                if (currentInput === '0' && value !== '.') {
                    currentInput = value;
                } else if (value === '.' && currentInput.includes('.')) {
                    // Do nothing
                } else {
                    currentInput += value;
                }
                updateDisplay(currentInput);

            } else if (button.classList.contains('op')) {
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

// --- Function to handle the Algebraic Calculator Logic (Advanced/Scientific) ---
function calculateAlgebraic() {
    const display = document.getElementById('alg-calc-input');
    const buttons = document.getElementById('alg-calc').querySelectorAll('.btn');
    
    if (!display || buttons.length === 0) return;

    let expression = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            
            if (value === 'AC') {
                // Clear All
                expression = '';
            } else if (value === 'DEL') {
                // Delete Last Character
                expression = expression.slice(0, -1);
            } else if (value === '=') {
                // Evaluate Expression
                try {
                    // Replace user-friendly symbols with JavaScript math symbols
                    let safeExpression = expression
                        .replace(/x/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/\^/g, '**'); // Handle exponentiation

                    // Evaluate using eval()
                    let result = eval(safeExpression);
                    
                    // Limit precision
                    expression = result.toFixed(10).replace(/\.0+$/, ''); // Clean up trailing zeros
                    
                } catch (e) {
                    expression = 'Error';
                }
            } else if (value === 'sin' || value === 'cos' || value === 'tan' || value === 'log') {
                // Trigonometric and Logarithmic functions
                expression += `Math.${value}(`;
            } else if (value === 'π') {
                 expression += `Math.PI`;
            } else if (value === 'e') {
                expression += `Math.E`;
            } else {
                // Append number, operator, or parenthesis
                expression += value;
            }
            
            display.value = expression || '0';
        });
    });
}


// --- Function to handle the file system folder toggling (Unchanged) ---
function initializeFileSystem() {
    // ... [File system logic remains the same] ...
    const folders = document.querySelectorAll('.folder-name');

    folders.forEach(folderNameElement => {
        const parentFolder = folderNameElement.closest('.folder');
        const childrenFolders = Array.from(parentFolder.children).filter(child => child.classList.contains('folder') || child.classList.contains('folder-content'));
        
        if (childrenFolders.length > 0) {
            
            // Initial state: hide contents (only applies to the next level of folders/content)
            childrenFolders.forEach(child => child.style.display = 'none');
            
            folderNameElement.addEventListener('click', () => {
                let isCollapsed = childrenFolders[0].style.display === 'none';
                
                childrenFolders.forEach(child => {
                    child.style.display = isCollapsed ? 'block' : 'none';
                });
                
                const icon = folderNameElement.querySelector('.icon');
                if (icon) {
                    icon.textContent = isCollapsed ? '📂' : '📁';
                }
            });
        }
    });

    document.querySelectorAll('.folder-name').forEach(el => {
        if (!el.querySelector('.icon')) {
            el.innerHTML = `<span class="icon">📁</span> ${el.textContent}`;
        }
    });
}


// --- Run functions when the page loads ---
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
