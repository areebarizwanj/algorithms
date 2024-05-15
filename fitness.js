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