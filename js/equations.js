// equations.js

// Display different solvers based on user choice
function showLinearSolver() {
  document.getElementById("linear-solver").style.display = "block";
  document.getElementById("quadratic-solver").style.display = "none";
  document.getElementById("cubic-solver").style.display = "none";
}

function showQuadraticSolver() {
  document.getElementById("linear-solver").style.display = "none";
  document.getElementById("quadratic-solver").style.display = "block";
  document.getElementById("cubic-solver").style.display = "none";
}

function showCubicSolver() {
  document.getElementById("linear-solver").style.display = "none";
  document.getElementById("quadratic-solver").style.display = "none";
  document.getElementById("cubic-solver").style.display = "block";
}

// Linear equation solver (ax + b = 0)
function solveLinear() {
  const a = parseFloat(document.getElementById("linear-a").value);
  const b = parseFloat(document.getElementById("linear-b").value);
  if (a === 0) {
    displayResult("Linear Equation Solution", "No solution, 'a' cannot be zero.");
  } else {
    const solution = -b / a;
    displayResult("Linear Equation Solution", `x = ${solution}`);
  }
}

// Quadratic equation solver (ax² + bx + c = 0)
function solveQuadratic() {
  const a = parseFloat(document.getElementById("quadratic-a").value);
  const b = parseFloat(document.getElementById("quadratic-b").value);
  const c = parseFloat(document.getElementById("quadratic-c").value);

  // Calculate discriminant
  const discriminant = b * b - 4 * a * c;

  if (a === 0) {
    displayResult("Quadratic Equation Solution", "This is not a quadratic equation.");
  } else if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    displayResult("Quadratic Equation Solutions", `x1 = ${x1}, x2 = ${x2}`);
  } else if (discriminant === 0) {
    const x = -b / (2 * a);
    displayResult("Quadratic Equation Solution", `x = ${x}`);
  } else {
    displayResult("Quadratic Equation Solution", "No real solutions.");
  }
}

// Cubic equation solver (ax³ + bx² + cx + d = 0)
function solveCubic() {
  const a = parseFloat(document.getElementById("cubic-a").value);
  const b = parseFloat(document.getElementById("cubic-b").value);
  const c = parseFloat(document.getElementById("cubic-c").value);
  const d = parseFloat(document.getElementById("cubic-d").value);

  // Check if it's a cubic equation
  if (a === 0) {
    displayResult("Cubic Equation Solution", "This is not a cubic equation.");
    return;
  }

  // Using the cubic formula to solve the equation
  const f = ((3 * c / a) - (b * b / a / a)) / 3;
  const g = ((2 * b * b * b / a / a / a) - (9 * b * c / a / a) + (27 * d / a)) / 27;
  const h = (g * g / 4) + (f * f * f / 27);

  if (f === 0 && g === 0 && h === 0) {
    const x = -(b / (3 * a));
    displayResult("Cubic Equation Solution", `x = ${x}`);
  } else if (h > 0) {
    const r = -(g / 2) + Math.sqrt(h);
    const s = Math.cbrt(r);
    const t = -(g / 2) - Math.sqrt(h);
    const u = Math.cbrt(t);
    const x1 = (s + u) - (b / (3 * a));
    displayResult("Cubic Equation Solution", `x1 = ${x1}`);
  } else {
    const i = Math.sqrt((g * g / 4) - h);
    const j = Math.cbrt(i);
    const k = Math.acos(-(g / (2 * i)));
    const l = -j;
    const m = Math.cos(k / 3);
    const n = Math.sqrt(3) * Math.sin(k / 3);
    const p = -(b / (3 * a));

    const x1 = 2 * j * Math.cos(k / 3) - (b / (3 * a));
    const x2 = l * (m + n) + p;
    const x3 = l * (m - n) + p;

    displayResult("Cubic Equation Solutions", `x1 = ${x1}, x2 = ${x2}, x3 = ${x3}`);
  }
}

// Display results in the result box
function displayResult(title, result) {
  const resultBox = document.getElementById("result");
  resultBox.style.display = "block";
  resultBox.innerHTML = `<h2>${title}</h2><p>${result}</p>`;
}
