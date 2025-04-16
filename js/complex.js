// Get DOM elements
const input1 = document.getElementById('complex-number');
const input2 = document.getElementById('second-complex');
const resultDiv = document.getElementById('result');

// Utility: Parse complex safely
function parseComplex(input) {
  try {
    return math.complex(input);
  } catch (error) {
    showResult(`❌ Invalid complex number: "${input}"`);
    throw new Error("Invalid complex number");
  }
}

// Utility: Show result
function showResult(message) {
  resultDiv.innerHTML = `<strong>Result:</strong> ${message}`;
}

// Function: Conjugate
function calculateComplexConjugate() {
  try {
    const num = parseComplex(input1.value);
    const conjugate = math.conj(num);
    showResult(conjugate.toString());
  } catch {}
}

// Function: Magnitude (Modulus)
function calculateMagnitude() {
  try {
    const num = parseComplex(input1.value);
    const magnitude = math.abs(num);
    showResult(magnitude);
  } catch {}
}

// Function: Phase (Argument in degrees)
function calculatePhase() {
  try {
    const num = parseComplex(input1.value);
    const phase = math.arg(num) * (180 / Math.PI);
    showResult(`${phase.toFixed(2)}°`);
  } catch {}
}

// Function: Add two complex numbers
function addComplex() {
  try {
    const num1 = parseComplex(input1.value);
    const num2 = parseComplex(input2.value);
    const result = math.add(num1, num2);
    showResult(result.toString());
  } catch {}
}

// Function: Subtract two complex numbers
function subtractComplex() {
  try {
    const num1 = parseComplex(input1.value);
    const num2 = parseComplex(input2.value);
    const result = math.subtract(num1, num2);
    showResult(result.toString());
  } catch {}
}

// Function: Multiply two complex numbers
function multiplyComplex() {
  try {
    const num1 = parseComplex(input1.value);
    const num2 = parseComplex(input2.value);
    const result = math.multiply(num1, num2);
    showResult(result.toString());
  } catch {}
}

// Function: Divide two complex numbers
function divideComplex() {
  try {
    const num1 = parseComplex(input1.value);
    const num2 = parseComplex(input2.value);
    const result = math.divide(num1, num2);
    showResult(result.toString());
  } catch (error) {
    showResult("❌ Cannot divide by zero or invalid input.");
  }
}
