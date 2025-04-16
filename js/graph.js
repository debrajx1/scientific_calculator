function plotGraph() {
  const functionInput = document.getElementById('graph-function').value.trim();
  if (!functionInput) {
    alert("Please enter a function.");
    return;
  }

  // Validate and parse the function
  try {
    const parsedFunction = math.parse(functionInput);
    
    // Generate X values
    let xValues = [];
    for (let x = -10; x <= 10; x += 0.1) {
      xValues.push(x);
    }

    // Generate Y values for the function
    let yValues = xValues.map(x => parsedFunction.evaluate({x: x}));

    // Plot the graph using Plotly
    const trace = {
      x: xValues,
      y: yValues,
      mode: 'lines',
      type: 'scatter',
      name: functionInput
    };

    const layout = {
      title: `Graph of ${functionInput}`,
      xaxis: {
        title: 'x'
      },
      yaxis: {
        title: 'y'
      }
    };

    Plotly.newPlot('graph-container', [trace], layout);
  } catch (error) {
    alert("Invalid function. Please enter a valid mathematical function.");
  }
}
