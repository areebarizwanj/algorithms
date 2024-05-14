const fs = require('fs');

const POPULATION_SIZE = 10;
const MAX_GENERATIONS = 10;
const MUTATION_RATE = 0.01;
const ELITISM_PERCENTAGE = 0.1;
const STOPPING_THRESHOLD = 0.001;

let numItems;
let population;
let fitness;
let weights;
let values;
let knapsackCapacity;

function initializePopulation() {
    population = [];
    fitness = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        population[i] = [];
        for (let j = 0; j < numItems; j++) {
            population[i][j] = Math.round(Math.random()); // Random binary initialization
        }
    }
}

function evaluatePopulation() {
    for (let i = 0; i < POPULATION_SIZE; i++) {
        fitness[i] = calculateFitness(population[i]);
    }
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
    const crossoverPoints = 2; // 2-point crossover
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
                offspring[i][j] = 1 - offspring[i][j]; // Flip the bit
            }
        }
    }
}

function replacePopulation(offspring) {
    const tempPopulation = [];
    const tempFitness = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        tempPopulation[i] = population[i];
        tempFitness[i] = fitness[i];
        tempPopulation[POPULATION_SIZE + i] = offspring[i];
        tempFitness[POPULATION_SIZE + i] = calculateFitness(offspring[i]);
    }

    for (let i = 0; i < 2 * POPULATION_SIZE - 1; i++) {
        for (let j = 0; j < 2 * POPULATION_SIZE - i - 1; j++) {
            if (tempFitness[j] < tempFitness[j + 1]) {
                // Swap fitness
                const tempFit = tempFitness[j];
                tempFitness[j] = tempFitness[j + 1];
                tempFitness[j + 1] = tempFit;

                // Swap population
                const temp = tempPopulation[j];
                tempPopulation[j] = tempPopulation[j + 1];
                tempPopulation[j + 1] = temp;
            }
        }
    }

    for (let i = 0; i < POPULATION_SIZE; i++) {
        for (let j = 0; j < numItems; j++) {
            population[i][j] = tempPopulation[i][j];
        }
        fitness[i] = tempFitness[i];
    }
}

function calculateFitness(chromosome) {
    let totalWeight = 0, totalValue = 0;
    for (let i = 0; i < numItems; i++) {
        if (chromosome[i] === 1) {
            totalWeight += weights[i];
            totalValue += values[i];
        }
    }
    if (totalWeight > knapsackCapacity) {
        return 0; // Invalid solution, fitness = 0
    } else {
        return totalValue; // Fitness is total value of items
    }
}

function printSolution(solution) {
    console.log("Knapsack Solution:", solution.join(' '));
}

// Main function
function main() {
    // Read data from file
    const data = fs.readFileSync("knapsackProblem.txt", "utf8").split('\n');
    numItems = parseInt(data[0]);
    weights = data[1].split(' ').map(Number);
    values = data[2].split(' ').map(Number);
    knapsackCapacity = parseInt(data[3]);

    // Print the knapsack parameters
    console.log("Number of items:", numItems);
    console.log("Weights of items:", weights.join(' '));
    console.log("Values of items:", values.join(' '));
    console.log("Knapsack capacity:", knapsackCapacity);

    // Initialize population
    initializePopulation();

    // Evolution loop
    for (let generation = 1; generation <= MAX_GENERATIONS; generation++) {
        // Evaluate population
        evaluatePopulation();

        // Print solutions for the current generation
        console.log("Generation", generation, ":");
        for (let i = 0; i < POPULATION_SIZE; i++) {
            console.log("Individual", i + 1 + ":", population[i].join(' '));
        }
        console.log();

        // Select parents
        const parents = Array.from({ length: POPULATION_SIZE }, () => Array(2));
        selectParents(parents);

        // Perform crossover
        const offspring = Array.from({ length: POPULATION_SIZE }, () => Array(numItems));
        crossover(parents, offspring);

        // Perform mutation
        mutate(offspring);

        // Replace population
        replacePopulation(offspring);
    }

    // Print best solution
    console.log("Best solution found:");
    printSolution(population[0]);
}

// Execute main function
main();
