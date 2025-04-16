const display = document.getElementById('display');

function appendToDisplay(value) {
  if (value === '√') {
    display.value += '√';
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  display.value = '';
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    let expression = display.value;

    // Handle exponentiation: a^b -> Math.pow(a, b)
    expression = expression.replace(/(\d+(\.\d+)?|\w+)\^(\d+(\.\d+)?|\w+)/g, 'Math.pow($1,$3)');

    // Handle square root: √9 -> Math.sqrt(9)
    expression = expression.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

    // Handle percentage: 50% -> 50/100
    expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    const result = eval(expression);
    display.value = result;
  } catch (error) {
    display.value = 'Error';
  }
}
