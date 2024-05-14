const { JSDOM } = require('jsdom');
const { document } = new JSDOM().window;
global.document = document;

const Chart = require('chart.js');

const POPULATION_SIZE = 10;
const MAX_GENERATIONS = 100;
const MUTATION_RATE = 0.01;
const ELITISM_PERCENTAGE = 0.1;
const STOPPING_THRESHOLD = 0.001;

// Knapsack parameters
let numItems;
let population;
let fitness;
let weights;
let values;
let knapsackCapacity;

// Function prototypes
function initializePopulation() {
    population = new Array(POPULATION_SIZE);
    fitness = new Array(POPULATION_SIZE);
    for (let i = 0; i < POPULATION_SIZE; i++) {
        population[i] = new Array(numItems);
        for (let j = 0; j < numItems; j++) {
            population[i][j] = Math.round(Math.random());
        }
    }
}

function evaluatePopulation() {
    for (let i = 0; i < POPULATION_SIZE; i++) {
        fitness[i] = calculateFitness(population[i]);
    }
}

function evaluatePopulationWithFitness() {
    const fitnessArray = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        fitness[i] = calculateFitness(population[i]);
        fitnessArray.push(fitness[i]);
    }
    return fitnessArray;
}

function selectParents(parents) {
    const tournamentSize = 3;
    for (let i = 0; i < POPULATION_SIZE; i++) {
        let bestIndex = Math.floor(Math.random() * POPULATION_SIZE);
        for (let j = 1; j < tournamentSize; j++) {
            const index = Math.floor(Math.random() * POPULATION_SIZE);
            if (fitness[index] > fitness[bestIndex]) {
                bestIndex = index;
            }
        }
        parents[i][0] = bestIndex;

        bestIndex = Math.floor(Math.random() * POPULATION_SIZE);
        for (let j = 1; j < tournamentSize; j++) {
            const index = Math.floor(Math.random() * POPULATION_SIZE);
            if (fitness[index] > fitness[bestIndex]) {
                bestIndex = index;
            }
        }
        parents[i][1] = bestIndex;
    }
}

function crossover(parents, offspring) {
    const crossoverPoints = 2;
    for (let i = 0; i < POPULATION_SIZE; i += 2) {
        for (let j = 0; j < numItems; j++) {
            offspring[i][j] = population[parents[i][0]][j];
            offspring[i + 1][j] = population[parents[i + 1][0]][j];
        }
        for (let j = 0; j < crossoverPoints; j++) {
            const point = Math.floor(Math.random() * numItems);
            const temp = offspring[i][point];
            offspring[i][point] = offspring[i + 1][point];
            offspring[i + 1][point] = temp;
        }
    }
}

function mutate(offspring) {
    for (let i = 0; i < POPULATION_SIZE; i++) {
        for (let j = 0; j < numItems; j++) {
            if (Math.random() < MUTATION_RATE) {
                offspring[i][j] = 1 - offspring[i][j];
            }
        }
    }
}

function replacePopulation(offspring) {
    const tempPopulation = new Array(2 * POPULATION_SIZE);
    const tempFitness = new Array(2 * POPULATION_SIZE);
    for (let i = 0; i < POPULATION_SIZE; i++) {
        tempPopulation[i] = population[i].slice();
        tempFitness[i] = fitness[i];
        tempPopulation[POPULATION_SIZE + i] = offspring[i].slice();
        tempFitness[POPULATION_SIZE + i] = calculateFitness(offspring[i]);
    }

    tempFitness.sort((a, b) => b - a);

    for (let i = 0; i < POPULATION_SIZE; i++) {
        for (let j = 0; j < numItems; j++) {
            population[i][j] = tempPopulation[i][j];
        }
        fitness[i] = tempFitness[i];
    }
}

function calculateFitness(chromosome) {
    let totalWeight = 0,
        totalValue = 0;
    for (let i = 0; i < numItems; i++) {
        if (chromosome[i] === 1) {
            totalWeight += weights[i];
            totalValue += values[i];
        }
    }
    if (totalWeight > knapsackCapacity) {
        return 0;
    } else {
        return totalValue;
    }
}

function printSolution(solution) {
    console.log("Knapsack Solution:", solution.join(" "));
}

// Main function
async function main() {
    // Read data from file
    const data = fs.readFileSync("knapsackProblem.txt", "utf8").split("\n");
    numItems = parseInt(data[0]);
    weights = data[1].split(" ").map(Number);
    values = data[2].split(" ").map(Number);
    knapsackCapacity = parseInt(data[3]);

    // Print the knapsack parameters
    console.log("Number of items:", numItems);
    console.log("Weights of items:", weights.join(" "));
    console.log("Values of items:", values.join(" "));
    console.log("Knapsack capacity:", knapsackCapacity);

    // Initialize population
    initializePopulation();

    // Evolution loop
    const fitnessProgress = [];
    for (let generation = 1; generation <= MAX_GENERATIONS; generation++) {
        // Evaluate population
        evaluatePopulationWithFitness();
        
        // Store fitness values for the current generation
        const currentFitness = [...fitness]; // Create a copy of fitness array
        fitnessProgress.push(currentFitness);
        
        // Rest of your code remains unchanged...
    }

    // Now, let's create a line chart using Chart.js
    const chartData = {
        labels: Array.from({ length: MAX_GENERATIONS }, (_, i) => i + 1),
        datasets: fitnessProgress.map((fitness, index) => ({
            label: `Individual ${index + 1}`,
            data: fitness,
            borderColor: `hsl(${(index * 360 / POPULATION_SIZE)}, 100%, 50%)`,
            fill: false,
        })),
    };

    const chartOptions = {
        responsive: false,
        title: {
            display: true,
            text: 'Fitness Progress over Generations',
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Generation',
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Fitness',
                },
            }],
        },
    };

    const chartConfig = {
        type: 'line',
        data: chartData,
        options: chartOptions,
    };

    // Generate the chart
    const chart = new Chart('chart', chartConfig);

    // Print best solution
    console.log("Best solution found:");
    printSolution(population[0]);
}

main();
