function calculateFitness(x, y) {
    let term1 = Math.pow(x - 7*y, 2);
    let term2 = 8*Math.pow(y, 2);
    let term3 = 6*x;
    let result = 100 - term1 + term2 - term3;
    return result;
}
// Define the x and y values
// Define the x and y values
let xValues = [1.5, -3.7, -7.8, 3.9, 2.88, -10.2, -9.9, -11.7, 5.75, 8.92];
let yValues = [-20, -10.1, -1.75, 0.88, 1.92, 19.87, 8.88, 1.52, -11.75, 2.85];

// Calculate fitness for each combination of x and y
let fitnessValues = xValues.map((x, index) => calculateFitness(x, yValues[index]));

// Sort fitness values and create a rank array
let sortedIndexes = fitnessValues.map((_, index) => index).sort((a, b) => fitnessValues[a] - fitnessValues[b]);
let ranks = new Array(xValues.length);
sortedIndexes.forEach((value, index) => {
    ranks[value] = index + 1;
});
// Define a function to calculate the sum of ranks
function sumOfRanks(ranks) {
    return ranks.reduce((sum, rank) => sum + rank, 0);
}
// Define a function to calculate rank proportions
function calculateRankProportions(fitnessValues, sumRanks) {
    return fitnessValues.map(fitness => Math.abs(sumRanks / fitness));
}
function calculateCumulativeRanks(rankProportions) {
    let cumulativeRanks = [];
    let cumulativeRank = 0;
    rankProportions.forEach((proportion, index) => {
        cumulativeRank += proportion;
        cumulativeRanks.push(cumulativeRank);
    });
    return cumulativeRanks;
}

// Usage example:
let sumRanks = sumOfRanks(ranks);
console.log("Sum of Ranks:", sumRanks);
// Output fitness values and ranks
console.log("Fitness Values:");
fitnessValues.forEach((fitness, index) => {
    console.log(`Fitness[${index}]: ${fitness}, Rank[${index}]: ${ranks[index]}`);
});
let rankProportions = calculateRankProportions(fitnessValues, sumRanks);
console.log("Rank Proportions:");
rankProportions.forEach((proportion, index) => {
    console.log(`Rank[${index}]: ${proportion}`);
});
let cumulativeRanks = calculateCumulativeRanks(rankProportions);
console.log("Cumulative Ranks:");
cumulativeRanks.forEach((cumulativeRank, index) => {
    console.log(`Cumulative Rank[${index}]: ${cumulativeRank}`);
});
let selectedFitnessValues = [];
let selectedRanks = [];

for (let i = 0; i < ranks.length; i++) {
    if (ranks[i] === 9 || ranks[i] === 10) {
        selectedFitnessValues.push(fitnessValues[i]);
        selectedRanks.push(ranks[i]);
    }
}

// Output selected fitness values and ranks
console.log("Selected Fitness Values:");
selectedFitnessValues.forEach((fitness, index) => {
    console.log(`Fitness[${index}]: ${fitness}, Rank[${index}]: ${selectedRanks[index]}`);
});


