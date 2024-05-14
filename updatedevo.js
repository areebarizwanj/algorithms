const lowest_x = -15, highest_x = 20, lowest_y = -20, highest_y = 25;
const population_size = 10, stopcriteria = 0.001;
let itrfitness=[], itr =1
const objfunc = (obj) => {
    return (-7 * Math.pow(obj.x, 2)) + (3 * obj.x * Math.sin(obj.y)) - (786 * obj.y) + 989;
};


const EachIterationfitness=(bestfitness,avgfitness,itr)=>{
    itrfitness.push({itr:itr,avgfitness:avgfitness,bestfitness:bestfitness})
}

const mutatedY = (value) => {
    if (value > highest_y) {
        return highest_y;
    } else if (value < lowest_y) {
        return lowest_y;
    } else {
        return value;
    }
}

const mutatedX = (value) => {
    if (value > highest_x) {
        return highest_x;
    } else if (value < lowest_x) {
        return lowest_x;
    } else {
        return value;
    }
}

const crossovering = (p1, p2) => {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    };
};

const random0_100 = () => {
    return Math.floor(Math.random() * 100) + 1;
};

const bestTenNew = (newmerge) => {
    newmerge.sort((a, b) => { return b.fitness - a.fitness; });
    newmerge.splice(10);
    return newmerge;
};

let initialrandom_10 = [];
for (let p = 0; p < population_size; p++) {
    let coordinates = { x: Math.random() * (highest_x - lowest_x) + lowest_x, y: Math.random() * (highest_y - lowest_y) + lowest_y };
    coordinates.fitness = objfunc(coordinates);
    initialrandom_10.push(coordinates);
} 

let fitnessdiff = Math.max(...initialrandom_10.map(item => item.fitness));
let  mergedindividuals = [],newavgfitness = 0;
let prevavgfitness = initialrandom_10.reduce((total, fitobj) => { return total + fitobj.fitness; }, 0) / population_size

const firstbestObj=initialrandom_10.sort((a, b) => { return b.fitness - a.fitness; })
EachIterationfitness(firstbestObj[0].fitness,prevavgfitness,0)

while (stopcriteria < fitnessdiff) {
   let newindividuals = [];
    for (let gen = 0; gen < population_size; gen++) {
        let parent1 = initialrandom_10[Math.floor(Math.random() * initialrandom_10.length)];
        let parent2 = initialrandom_10[Math.floor(Math.random() * initialrandom_10.length)];

        let crossovers = crossovering(parent1, parent2);

        const pos_mutation = 0.15, neg_mutation = -0.15;
        const mutateIf = random0_100();

        if (mutateIf > 50) { // Mutation Possible
            let mutatePosNeg = random0_100();

            if (mutatePosNeg > 50) { // Positive Mutation
                let mutateXY = random0_100();

                if (mutateXY > 50) { // y mutate
                    crossovers.y = mutatedY(crossovers.y + pos_mutation);
                } else { // x Mutate
                    crossovers.x = mutatedX(crossovers.x + pos_mutation);
                }
            } else { // Negative mutate
                let mutateXY = random0_100();
                if (mutateXY > 50) { // y mutate
                    crossovers.y = mutatedY(crossovers.y + neg_mutation);
                } else { // x Mutate
                    crossovers.x = mutatedX(crossovers.x + neg_mutation);
                }
            }
        }

        crossovers.fitness = objfunc(crossovers);
        newindividuals.push(crossovers);
    }

    mergedindividuals = [...initialrandom_10, ...newindividuals];
    mergedindividuals = bestTenNew(mergedindividuals);

    newavgfitness = mergedindividuals.reduce((total, fitobj) => { return total + fitobj.fitness; }, 0) / newindividuals.length;
 
    fitnessdiff = Math.abs(newavgfitness - prevavgfitness);
    initialrandom_10 = mergedindividuals;
    prevavgfitness=newavgfitness 
    EachIterationfitness(mergedindividuals[0].fitness,prevavgfitness,itr)
    itr++;
}


console.log(itrfitness)
console.log("Best solution : ", mergedindividuals[0])

const ctx = document.getElementById('myChart');


new Chart(ctx, {
  type: 'line',
  data: {
    labels: itrfitness.map((datas) => 'Graph'),
    
    datasets: [{
      data: itrfitness.map((datas) => parseFloat(datas.bestfitness)),
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

