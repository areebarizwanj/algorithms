function calculateFitness(x, y) {
    let term1 = Math.pow(x - 7*y, 2);
    let term2 = 8*Math.pow(y, 2);
    let term3 = 6*x;
    let result = 100 - term1 + term2 - term3;
    return result;
}

// Define the x and y values
let xValues = [1.5, -3.7, -7.8, 3.9, 2.88, -10.2, -9.9, -11.7, 5.75, 8.92];
let yValues = [-20, -10.1, -1.75, 0.88, 1.92, 19.87, 8.88, 1.52, -11.75, 2.85];

// Calculate fitness for each combination of x and y
let fitnessSum = 0;
let fitnessValues = [];
let cumulativeFitness = 0;
let cumulativeFitnessValues = [];
xValues.forEach((x, index) => {
    let y = yValues[index];
    let fitness = calculateFitness(x, y);
    fitnessSum += fitness;
    fitnessValues.push(fitness);
});

// Find the maximum absolute fitness value
let maxAbsoluteFitness = Math.max(...fitnessValues.map(Math.abs));

// Adjust all fitness values by adding the absolute value of maxAbsoluteFitness
let adjustedFitnessValues = fitnessValues.map(value => value + Math.abs(maxAbsoluteFitness));

// Calculate proportion of each fitness value
let fitnessProportions = adjustedFitnessValues.map(fitness => fitness / adjustedFitnessValues.reduce((sum, value) => sum + value, 0));

fitnessProportions.forEach((proportion, index) => {
    cumulativeFitness += proportion;
    cumulativeFitnessValues.push(cumulativeFitness);
});
// Print the adjusted fitness values, sum, fitness proportions, and cumulative fitness
console.log("Adjusted Fitness Values:");
adjustedFitnessValues.forEach((fitness, index) => {
    console.log(`Fitness[${index}]: ${fitness}`);
});

console.log("Sum of Adjusted Fitness Values:", adjustedFitnessValues.reduce((sum, value) => sum + value, 0));

console.log("Adjusted Fitness Proportions:");
fitnessProportions.forEach((proportion, index) => {
    console.log(`Fitness[${index}]: ${proportion}`);
});

console.log("Cumulative Fitness Values:");
cumulativeFitnessValues.forEach((cumulativeFit, index) => {
    console.log(`Cumulative Fitness[${index}]: ${cumulativeFit}`);
});

function getRandomNumberInclusive(min, max) {
    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(3));
  }
  
  function fitnessfunc(x, y) {
    return parseFloat(
      (-7 * x ** 2 + 3 * x * Math.sin(y) - 786 * y + 989).toFixed(3)
    );
  }
  
  let avgarray = [];
  let random = [];
  let selectedParents = [];
  let crossoveredChildren = [];
  
  function initialization() {
    for (let i = 0; i < 10; i++) {
      let a = getRandomNumberInclusive(-15, 20);
      let b = getRandomNumberInclusive(-20, 25);
  
      random[i] = { id: i, x: a, y: b, fitness: null };
    }
  }
  function parentSelection() {
    // Find the index of the individual with the highest adjusted fitness proportion
    let highestIndex = 0;
    for (let i = 1; i < fitnessProportions.length; i++) {
        if (fitnessProportions[i] > fitnessProportions[highestIndex]) {
            highestIndex = i;
        }
    }

    // Find the index of the individual with the second-highest adjusted fitness proportion
    let secondHighestIndex = 0;
    for (let i = 1; i < fitnessProportions.length; i++) {
        if (i !== highestIndex && fitnessProportions[i] > fitnessProportions[secondHighestIndex]) {
            secondHighestIndex = i;
        }
    }

    let selectedParent1 = { ...random[highestIndex] };
    let selectedParent2 = { ...random[secondHighestIndex] };

    selectedParents.push([selectedParent1, selectedParent2]);
}

  
  function crossover() {
    crossoveredChildren = selectedParents.map((e) => {
      let temp = e[0].y;
      return [
        { x: (e[0].x + e[1].x) / 2, y: (e[0].y + e[1].y) / 2, fitness: null },
      ];
    });
  }
  
  function mutation() {
    crossoveredChildren = crossoveredChildren.flat();
    mutatedChildren = crossoveredChildren.map((child) => ({ ...child }));
    mutatedChildren.forEach((e) => {
      let random0 = getRandomNumberInclusive(0, 9).toFixed(0);
      let random1 = getRandomNumberInclusive(0, 9).toFixed(0);
      let random2 = getRandomNumberInclusive(0, 9).toFixed(0);
  
      if (random0 >= 4) {
    
        if (random1 >= 4) {
  
          if (random2 >= 4) {
            e.x = parseFloat((e.x + 0.15).toFixed(3));
          } else {
            e.x = e.x - 0.15;
          }
        } else {
          if (random2 >= 4) {
  
            e.y = e.y + 0.15;
          } else {
            e.y = e.y - 0.15;
          }
  
          e.y = parseFloat(e.y.toFixed(3));
        }
      }
    });
  }
  initialization();
  let bestfit = [];
  let stoppingcritarea = false;
  while (stoppingcritarea === false) {
    random.forEach((e) => {
      e.fitness = fitnessfunc(e.x, e.y);
    });
    for (let i = 0; i < 5; i++) {
      parentSelection();
      crossover();
      mutation();
      mutatedChildren.forEach((e) => {
        if (e.x > 20) {
          e.x = 20;
        }
        if (e.x < -15) {
          e.x = -15;
        }
        if (e.y < -20) {
          e.y = -20;
        }
        if (e.y > 25) {
          e.y = 25;
        }
        e.fitness = fitnessfunc(e.x, e.y);
      });
    }
  
    let twenty = [...random, ...mutatedChildren];
    twenty.sort((a, b) => b.fitness - a.fitness);
    let top10 = twenty.slice(0, 10);
    random = [];
    random = [...top10];
    twenty = [];
    top10 = [];
    selectedParents = [];
    crossoveredChildren = [];
    let avg = 0;
    for (let i = 0; i < 10; i++) {
      avg = avg + random[i].fitness;
    }
  
    avg = avg / 10;
  
    avgarray.push(avg);
    bestfit.push(random[0].fitness);
    if (avgarray.length > 10) {
      avgarray.shift();
      let count = 0;
      for (let i = 0; i < 10; i++) {
        if (avgarray[i + 1] - avgarray[i] <= 0.001) {
          count++;
        }
        if (count >= 9) {
          stoppingcritarea = true;
          break;
        }
      }
    }
  }
  
  console.log("---------------", bestfit, "-------------------");
  
  /*
  //----------------------------------GRAPH----------------------------------
  google.charts.load("current", { packages: ["corechart", "line"] });
  google.charts.setOnLoadCallback(drawBasic);
  
  function drawBasic() {
    var data = new google.visualization.DataTable();
    data.addColumn("number", "Iteration");
    data.addColumn("number", "Fitness");
    for (let i = 0; i < bestfit.length; i++) {
      data.addRows([[i + 1, bestfit[i]]]);
    }
    var options = {
      hAxis: { title: "Generations" },
      vAxis: {
        title: "F i t n e s s",
      },
    };
  
    var chart = new google.visualization.LineChart(
      document.getElementById("chart_div")
    );
  
    chart.draw(data, options);
  }
  */
  const ctx = document.getElementById('myChart');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: bestfit.map((datas) => 'Graph'),
      datasets: [{
        data: bestfit.map((datas) => parseFloat(datas)),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  