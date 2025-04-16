function appendToDisplay(value) { 
  const display = document.getElementById("display");

  const functionsWithParentheses = [
    "sin", "cos", "tan", 
    "asin", "acos", "atan", 
    "log", "ln", "sqrt"
  ];

  if (value === '=') {
    calculateTrigonometricValues();
    return;
  }

  // Automatically add parentheses after specific functions
  if (functionsWithParentheses.includes(value)) {
    display.value += `${value}(`;
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function deleteLast() {
  const display = document.getElementById("display");
  display.value = display.value.slice(0, -1);
}

function calculateTrigonometricValues() {
  let input = document.getElementById("display").value;

  try {
    // Handle trigonometric functions (sin, cos, tan) with degrees
    input = input
      .replace(/sin\(([^)]+)\)/g, (match, p1) => `Math.sin(toRadians(${p1}))`)
      .replace(/cos\(([^)]+)\)/g, (match, p1) => `Math.cos(toRadians(${p1}))`)
      .replace(/tan\(([^)]+)\)/g, (match, p1) => `Math.tan(toRadians(${p1}))`)

      // Handle inverse trig functions (asin, acos, atan) with degrees (return degrees)
      .replace(/asin\(([^)]+)\)/g, (match, p1) => `toDegrees(Math.asin(${p1}))`)
      .replace(/acos\(([^)]+)\)/g, (match, p1) => `toDegrees(Math.acos(${p1}))`)
      .replace(/atan\(([^)]+)\)/g, (match, p1) => `toDegrees(Math.atan(${p1}))`)

      // Handle sqrt, log, and ln functions
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(");

    // Log the input being evaluated to the console for debugging
    console.log("Evaluating: ", input); // Debugging statement to check what is being evaluated
    
    // Use eval safely (for now we assume input is correctly sanitized)
    const result = eval(input);
    document.getElementById("display").value = result;
  } catch (error) {
    document.getElementById("display").value = "Error";
  }
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
}
