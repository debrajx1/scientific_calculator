function appendToDisplay(value) {
    let display = document.getElementById("display");
    let mathDisplay = document.getElementById("math-display");

    console.log("Button clicked:", value); // Debugging output

    // Prevent multiple commas in a row
    if (value === ',' && display.value.slice(-1) === ',') return;

    // Fix: Ensure "i" is displayed correctly in Complex mode without duplication
    if (value === 'i') {
        if (!display.value.endsWith('i')) {  
            display.value += "i";
        }
        return;
    }

    // Fix: Prevent "Misplaced &" and XOR issues
    if (["AND", "OR", "XOR"].includes(value)) {
        let lastEntry = display.value.trim().split(" ").pop();

        // Ensure operator isn't placed first or repeated
        if (display.value === "" || ["AND", "OR", "XOR"].includes(lastEntry)) {
            return;
        }
        display.value += ` ${value} `;  // Proper spacing
    }
    
    if (value === "matrix") {
        if (!display.value.includes("matrix([[")) {
            display.value += "matrix([["; 
            mathDisplay.innerHTML += "\\begin{bmatrix}"; // Fix: Use += to allow multiple matrices
        }
    } else if (value === "]") {
        if (display.value.includes("matrix([[")) {
            display.value += "]]"; 
    
            // Fix: Ensure closing \end{bmatrix} is only added if \begin{bmatrix} exists
            if (mathDisplay.innerHTML.includes("\\begin{bmatrix}")) {
                mathDisplay.innerHTML += "\\end{bmatrix}";
            }
        }
    }else {
        display.value += value;
    }

    // Convert input for MathJax but avoid breaking bitwise operations
    let formattedExpression = display.value
        .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
        .replace(/pow\((.*?),\s*(.*?)\)/g, '{$1}^{ $2 }')
        .replace(/log10\((.*?)\)/g, '\\log_{10}{$1}')
        .replace(/ln\((.*?)\)/g, '\\ln{$1}')
        .replace(/\bsin\(/g, '\\text{sin}(')
        .replace(/\bcos\(/g, '\\text{cos}(')
        .replace(/\btan\(/g, '\\text{tan}(')
        .replace(/\b(AND|OR|XOR)\b/g, '\\text{$1}') // Prevent MathJax errors
        .replace(/matrix\(\[\[/g, '\\begin{bmatrix}')
        .replace(/\]\]\)/g, '\\end{bmatrix}');

    mathDisplay.innerHTML = `\\(${formattedExpression}\\)`;

    // Render MathJax
    MathJax.typesetPromise();
    mathDisplay.innerHTML = display.value;  // Show plain numbers without MathJax formatting
}


// Function to clear the display
function clearDisplay() {
    document.getElementById("display").value = "";
    document.getElementById("math-display").innerHTML = "";
}

// Function to delete the last character
function deleteLast() {
    let display = document.getElementById("display");
    let mathDisplay = document.getElementById("math-display");

    display.value = display.value.slice(0, -1);

    let formattedExpression = display.value
        .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
        .replace(/pow\((.*?),\s*(.*?)\)/g, '{$1}^{ $2 }')
        .replace(/log10\((.*?)\)/g, '\\log_{10}{$1}')
        .replace(/ln\((.*?)\)/g, '\\ln{$1}')
        .replace(/\bsin\(/g, '\\sin(')
        .replace(/\bcos\(/g, '\\cos(')
        .replace(/\btan\(/g, '\\tan(');

    mathDisplay.innerHTML = `\\(${formattedExpression}\\)`;
    MathJax.typesetPromise();
}

// Function to send expression to Flask
function calculate() {
    let expression = document.getElementById("display").value;

    // Convert `^` to `pow()`
    expression = expression.replace(/\^/g, "pow");

    // Fix: Convert "i" to "j" correctly for Python complex numbers
    expression = expression.replace(/(\d*)i\b/g, '$1j').replace(/j+/g, 'j');

    // Fix: Ensure trigonometric functions are correctly formatted
    expression = expression.replace(/\b(sin|cos|tan)\(([^)]+)\)/g, function(match, func, num) {
        if (!isNaN(num)) {
            return `${func}(radians(${num}))`; // Convert numeric values to radians
        }
        return `${func}(${num})`; // Keep variables as is
    });

    // Fix: Ensure real, imag, conj, and arg are correctly formatted for Python evaluation
    expression = expression.replace(/\b(real|imag|conj|arg)\(([^)]+)\)/g, function(match, func, num) {
        return `${func}("${num}")`;  // Ensures the argument is correctly passed as a string for Flask evaluation
    });

    expression = expression.replace(/\b(Bin|Hex|Oct)\(([^)]+)\)/gi, function(match, func, num) {
        return `${func.toLowerCase()}(${parseInt(num, 10)})`; // Ensure proper integer format
    });
    
    // Fix: Ensure bitwise operators (AND, OR, XOR) are correctly formatted before sending to Flask
    expression = expression.replace(/\b(\d+)\s*(AND|OR|XOR)\s*(\d*)\b/gi, function(match, num1, op, num2) {
        if (num2.trim() === "") {
            return `${num1} ${op} `;  // Allowing user to enter second number
        }
        return `${op.toUpperCase()}(${parseInt(num1, 10)}, ${parseInt(num2, 10)})`; 
    });

    console.log("Sending expression:", expression);

    fetch('/calculate', {
        method: 'POST',
        body: JSON.stringify({ expression: expression }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => { 
        console.log("Response from Flask:", data);
        if (data.result) {
            document.getElementById("display").value = data.result;
            document.getElementById("math-display").innerHTML = `\\(${data.result}\\)`;
            MathJax.typesetPromise();
        } else {
            document.getElementById("display").value = "Error";
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        document.getElementById("display").value = "Error";
    });
}

// Function to toggle light/dark theme
function toggleTheme() {
    let themeToggle = document.getElementById("theme-toggle");

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.innerHTML = "🌞";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.innerHTML = "🌙";
        localStorage.setItem("theme", "light");
    }
}

// Set theme on page load
document.addEventListener("DOMContentLoaded", function() {
    let themeToggle = document.getElementById("theme-toggle");

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = "🌞";
    } else {
        themeToggle.innerHTML = "🌙";
    }
});

// Toggle mode selection menu
function toggleModeMenu() {
    let menu = document.getElementById("mode-menu");
    menu.style.display = "block";
    setTimeout(() => menu.classList.remove("hidden"), 50);
}

// Close mode menu
function closeModeMenu() {
    let menu = document.getElementById("mode-menu");
    menu.classList.add("hidden");
    setTimeout(() => menu.style.display = "none", 300);
}

// Function to change calculator mode
function changeMode(mode) {
    closeModeMenu();
    localStorage.setItem("calculatorMode", mode);

    let modeDisplay = document.getElementById("current-mode");
    modeDisplay.innerText = "Mode: " + mode.charAt(0).toUpperCase() + mode.slice(1);

    // Show only relevant buttons for the selected mode
    document.querySelectorAll(".scientific-mode, .complex-mode, .programming-mode, .statistics-mode, .matrix-mode")
        .forEach(btn => btn.style.display = "none");

    function showButtons(className) {
        document.querySelectorAll(className).forEach(btn => btn.style.display = "inline-block");
    }

    if (mode === "scientific") showButtons(".scientific-mode");
    if (mode === "complex") showButtons(".complex-mode");
    if (mode === "programming") showButtons(".programming-mode");
    if (mode === "statistics") showButtons(".statistics-mode");
    if (mode === "matrix") showButtons(".matrix-mode");
}

// Apply saved mode on page load
document.addEventListener("DOMContentLoaded", function () {
    let savedMode = localStorage.getItem("calculatorMode") || "standard";
    document.querySelector(`input[name="mode"][value="${savedMode}"]`).checked = true;
    changeMode(savedMode);
});
