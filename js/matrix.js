let currentRows = 0, currentCols = 0;

function generateMatrices() {
  const sizeInput = document.getElementById("matrix-size").value.trim();
  const matrixA = document.getElementById("matrix-a");
  const matrixB = document.getElementById("matrix-b");
  const matrixBLabel = document.getElementById("matrix-b-label");
  const operations = document.getElementById("matrix-operations");
  const resultBox = document.getElementById("result");

  matrixA.innerHTML = "";
  matrixB.innerHTML = "";
  matrixB.style.display = "none";
  matrixBLabel.style.display = "none";
  resultBox.innerHTML = "";

  if (!/^\d+x\d+$/i.test(sizeInput)) {
    alert("Please enter size in format rows x columns (e.g., 3x3)");
    return;
  }

  [currentRows, currentCols] = sizeInput.toLowerCase().split("x").map(Number);
  if (currentRows < 1 || currentCols < 1 || currentRows > 10 || currentCols > 10) {
    alert("Matrix size must be between 1x1 and 10x10");
    return;
  }

  createMatrixInputs(matrixA, "a");
  operations.style.display = "flex";
}

function createMatrixInputs(container, prefix) {
  container.innerHTML = "";
  const rows = currentRows;
  const cols = currentCols;

  for (let i = 0; i < rows; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "matrix-row";
    for (let j = 0; j < cols; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.className = "matrix-cell";
      input.id = `${prefix}-${i}-${j}`;
      rowDiv.appendChild(input);
    }
    container.appendChild(rowDiv);
  }
}

function showMatrixB(operation) {
  const matrixB = document.getElementById("matrix-b");
  const matrixBLabel = document.getElementById("matrix-b-label");

  if (matrixB.style.display === "none") {
    matrixB.style.display = "block";
    matrixBLabel.style.display = "block";
    createMatrixInputs(matrixB, "b");
  }

  if (operation === "add") {
    calculateAddition();
  } else if (operation === "multiply") {
    calculateMultiplication();
  }
}
 
function getMatrix(prefix) {
  const rows = currentRows;
  const cols = currentCols;
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const value = parseFloat(document.getElementById(`${prefix}-${i}-${j}`).value) || 0;
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}

function displayResult(title, data) {
  const resultBox = document.getElementById("result");
  resultBox.innerHTML = `<strong>${title}:</strong><br>`;
  if (Array.isArray(data)) {
    resultBox.innerHTML += data.map(row => row.map(formatNumber).join(" ")).join("<br>");
  } else {
    resultBox.innerHTML += formatNumber(data);
  }
}

function formatNumber(n) {
  return Math.abs(n % 1) < 0.00001 ? Math.round(n) : parseFloat(n.toFixed(4));
}

function calculateAddition() {
  const A = getMatrix("a");
  const B = getMatrix("b");
  if (A.length !== B.length || A[0].length !== B[0].length) {
    alert("Matrix dimensions must match for addition.");
    return;
  }
  try {
    const result = math.add(A, B);
    displayResult("Addition Result", result);
  } catch {
    alert("Error in addition.");
  }
}

function calculateMultiplication() {
  const A = getMatrix("a");
  const B = getMatrix("b");
  if (A[0].length !== B.length) {
    alert("Matrix A columns must match Matrix B rows for multiplication.");
    return;
  }
  try {
    const result = math.multiply(A, B);
    displayResult("Multiplication Result", result);
  } catch {
    alert("Error in multiplication.");
  }
}

function calculateDeterminant() {
  const A = getMatrix("a");
  if (A.length !== A[0].length) {
    alert("Determinant only works on square matrices");
    return;
  }
  try {
    const det = math.det(A);
    displayResult("Determinant", det);
  } catch {
    alert("Error calculating determinant.");
  }
}

function calculateTranspose() {
  try {
    const A = getMatrix("a");
    const result = math.transpose(A);
    displayResult("Transpose", result);
  } catch {
    alert("Error calculating transpose.");
  }
}

function calculateInverse() {
  const A = getMatrix("a");
  if (A.length !== A[0].length) {
    alert("Inverse only works on square matrices");
    return;
  }
  try {
    const result = math.inv(A);
    displayResult("Inverse", result);
  } catch {
    alert("Matrix is not invertible.");
  }
}

function clearMatrix() {
  document.getElementById("matrix-a").innerHTML = "";
  document.getElementById("matrix-b").innerHTML = "";
  document.getElementById("matrix-b").style.display = "none";
  document.getElementById("matrix-b-label").style.display = "none";
  document.getElementById("result").innerHTML = "";
  document.getElementById("matrix-operations").style.display = "none";
  document.getElementById("matrix-size").value = "";
}


function calculateRank() {
  const A = getMatrix("a");

  function gaussianElimination(matrix) {
    const m = JSON.parse(JSON.stringify(matrix)); // deep clone
    const rows = m.length;
    const cols = m[0].length;
    let rank = 0;

    for (let row = 0; row < rows; row++) {
      if (rank >= cols) break;

      if (m[row][rank] !== 0) {
        for (let i = 0; i < rows; i++) {
          if (i !== row) {
            const ratio = m[i][rank] / m[row][rank];
            for (let j = 0; j < cols; j++) {
              m[i][j] -= ratio * m[row][j];
            }
          }
        }
        rank++;
      } else {
        let reduce = true;
        for (let i = row + 1; i < rows; i++) {
          if (m[i][rank] !== 0) {
            [m[row], m[i]] = [m[i], m[row]];
            reduce = false;
            break;
          }
        }
        if (reduce) rank++;
        row--;
      }
    }

    let nonZeroRows = 0;
    for (let i = 0; i < rows; i++) {
      if (m[i].some(val => Math.abs(val) > 1e-10)) nonZeroRows++;
    }

    return nonZeroRows;
  }

  try {
    const rank = gaussianElimination(A);
    displayResult("Rank", rank);
  } catch (err) {
    alert("Error calculating rank.");
  }
}



function calculateEigenvalues() {
  const A = getMatrix("a");
  if (A.length !== A[0].length) {
    alert("Eigenvalues require a square matrix.");
    return;
  }

  const n = A.length;

  if (n === 2) {
    const a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];
    const trace = a + d;
    const det = a * d - b * c;
    const discriminant = trace * trace - 4 * det;

    if (discriminant >= 0) {
      const root1 = (trace + Math.sqrt(discriminant)) / 2;
      const root2 = (trace - Math.sqrt(discriminant)) / 2;
      displayResult("Eigenvalues", [root1, root2].map(formatNumber));
    } else {
      const realPart = trace / 2;
      const imagPart = Math.sqrt(-discriminant) / 2;
      const eigs = [`${formatNumber(realPart)} + ${formatNumber(imagPart)}i`, `${formatNumber(realPart)} - ${formatNumber(imagPart)}i`];
      displayResult("Eigenvalues", eigs);
    }
  } else {
    alert("Only 2x2 matrices are currently supported for eigenvalue calculation.");
  }
}
