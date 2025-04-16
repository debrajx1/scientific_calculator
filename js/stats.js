// stats.js

// Utility function to parse input
function parseData() {
  const input = document.getElementById('data').value;
  const data = input.split(',').map(item => parseFloat(item.trim())).filter(item => !isNaN(item));
  return data;
}

// Mean Calculation
function calculateMean() {
  const data = parseData();
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  displayResult(`Mean: ${mean.toFixed(2)}`);
}

// Median Calculation
function calculateMedian() {
  const data = parseData().sort((a, b) => a - b);
  const mid = Math.floor(data.length / 2);
  const median = data.length % 2 === 0 ? (data[mid - 1] + data[mid]) / 2 : data[mid];
  displayResult(`Median: ${median}`);
}

// Mode Calculation
function calculateMode() {
  const data = parseData();
  const frequency = {};
  let maxFreq = 0;
  let mode = [];
  
  data.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
      mode = [num];
    } else if (frequency[num] === maxFreq) {
      mode.push(num);
    }
  });

  displayResult(`Mode: ${mode.join(', ')}`);
}

// Variance Calculation
function calculateVariance() {
  const data = parseData();
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  displayResult(`Variance: ${variance.toFixed(2)}`);
}

// Standard Deviation Calculation
function calculateStdDev() {
  const data = parseData();
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  displayResult(`Standard Deviation: ${stdDev.toFixed(2)}`);
}

// Sum Calculation
function calculateSum() {
  const data = parseData();
  const sum = data.reduce((acc, val) => acc + val, 0);
  displayResult(`Sum: ${sum}`);
}

// Range Calculation
function calculateRange() {
  const data = parseData();
  const range = Math.max(...data) - Math.min(...data);
  displayResult(`Range: ${range}`);
}

// Display Result
function displayResult(result) {
  document.getElementById('result').innerText = result;
}
