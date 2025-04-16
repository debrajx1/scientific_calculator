// Handle mode toggle (indefinite vs. definite)
document.addEventListener("DOMContentLoaded", () => {
  const radios = document.querySelectorAll('input[name="integralMode"]');
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const mode = document.querySelector('input[name="integralMode"]:checked').value;
      document.getElementById("limits").style.display = (mode === "definite") ? "block" : "none";
    });
  });
});

function calculateDerivative() {
  document.getElementById("integralOptions").style.display = "none"; // Hide integral section
  const input = document.getElementById("function").value.trim();
  try {
    const derivative = math.derivative(input, 'x').toString();
    document.getElementById("result").innerHTML = `<strong>Derivative:</strong> ${derivative}`;
  } catch (error) {
    document.getElementById("result").innerHTML = "❌ Invalid function or syntax for derivative.";
  }
}

function showIntegralOptions() {
  document.getElementById("integralOptions").style.display = "block";
  document.getElementById("result").innerHTML = ""; // Clear previous result
}

function calculateIntegral() {
  const input = document.getElementById("function").value.trim();
  const mode = document.querySelector('input[name="integralMode"]:checked').value;

  if (!input) {
    document.getElementById("result").innerHTML = "❌ Please enter a function.";
    return;
  }

  try {
    if (mode === "symbolic") {
      // Fix syntax for Algebrite: ^ → **
      const fixedInput = input.replace(/\^/g, "**");
      const result = Algebrite.run(`integral(${fixedInput})`);
      document.getElementById("result").innerHTML = `<strong>Indefinite Integral:</strong> ${result} + C`;
    } else {
      // Definite Integral using math.js
      const lower = parseFloat(document.getElementById("lowerLimit").value);
      const upper = parseFloat(document.getElementById("upperLimit").value);

      if (isNaN(lower) || isNaN(upper)) {
        document.getElementById("result").innerHTML = "❌ Please enter valid limits.";
        return;
      }

      const compiled = math.compile(input);
      const steps = 1000;
      const dx = (upper - lower) / steps;
      let total = 0;

      for (let i = 0; i < steps; i++) {
        const x = lower + i * dx;
        total += compiled.evaluate({ x }) * dx;
      }

      document.getElementById("result").innerHTML =
        `<strong>Definite Integral from ${lower} to ${upper}:</strong> ${total.toFixed(6)}`;
    }
  } catch (error) {
    console.error("Integration Error:", error);
    document.getElementById("result").innerHTML = "❌ Error in integration. Check your syntax.";
  }
}
