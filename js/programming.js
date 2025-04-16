// Base Converter Function (Decimal to Selected Base)
function convertBase() {
  const input = document.getElementById("baseInput").value.trim();
  const targetBase = document.getElementById("baseSelect").value;
  const number = parseInt(input, 10); // Always from decimal

  // Check for NaN (invalid input)
  if (isNaN(number)) {
    document.getElementById("baseResult").innerHTML =
      `<span style="color: red;">Please enter a valid number.</span>`;
    return;
  }

  let converted = "";

  // Handle conversion based on selected base
  switch (targetBase) {
    case "bin":
      converted = number.toString(2);
      document.getElementById("baseResult").innerHTML = `Binary: ${converted}`;
      break;
    case "oct":
      if (number < 0) {
        // For negative numbers, octal conversion with negative sign
        converted = "-" + Math.abs(number).toString(8);
      } else {
        converted = number.toString(8);
      }
      document.getElementById("baseResult").innerHTML = `Octal: ${converted}`;
      break;
    case "dec":
      document.getElementById("baseResult").innerHTML = `Decimal: ${number}`;
      break;
    case "hex":
      if (number < 0) {
        // For negative numbers, hexadecimal conversion with negative sign
        converted = "-" + Math.abs(number).toString(16).toUpperCase();
      } else {
        converted = number.toString(16).toUpperCase();
      }
      document.getElementById("baseResult").innerHTML = `Hexadecimal: ${converted}`;
      break;
    default:
      document.getElementById("baseResult").innerHTML =
        `<span style="color: red;">Invalid base selected.</span>`;
  }
}


// Logic Gate Calculator Function
function calculateLogic() {
  const a = document.getElementById("inputA").value.trim();
  const b = document.getElementById("inputB").value.trim();
  const gate = document.getElementById("gateType").value;
  const logicResult = document.getElementById("logicResult");

  // Validate inputs for binary values (0 or 1)
  const validInputs = ["0", "1"];
  if (!validInputs.includes(a) || (!validInputs.includes(b) && gate !== "NOT")) {
    logicResult.innerHTML = `<span style="color: red;">Inputs must be 0 or 1.</span>`;
    return;
  }

  const A = parseInt(a);
  const B = parseInt(b);
  let result;

  // Perform the logic gate operation based on selected gate type
  switch (gate) {
    case "AND":
      result = A & B;
      break;
    case "OR":
      result = A | B;
      break;
    case "XOR":
      result = A ^ B;
      break;
    case "NAND":
      result = !(A & B) ? 1 : 0;
      break;
    case "NOR":
      result = !(A | B) ? 1 : 0;
      break;
    case "XNOR":
      result = A === B ? 1 : 0;
      break;
    case "NOT":
      result = A ? 0 : 1;
      break;
    default:
      result = "Invalid gate";
  }

  // Display the result of the logic gate operation
  logicResult.innerHTML = `Result: ${result}`;
}
