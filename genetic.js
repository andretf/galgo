'use strict';

function getRandomPosition(size) {
    return Math.floor(Math.random() * size);
}

var Chromosome = function (value) {
    var chromosomeLength = genetic.options.chromosomeLength;
    var mutationProbability = genetic.mutationProbability;
    var max = genetic.options.interval.max;
    var min = genetic.options.interval.min;

    var chromosome = {
        decode: decode,
        mutate: mutate,
        value: value
    };

    if (chromosome.value === undefined) {
        chromosome.value = generate(chromosomeLength);
    }

    return chromosome;

    function decode() {
        var decimalValue = parseInt(chromosome.value.toString().replace(/,/g, ''), 2);
        return min + (max - min) * (decimalValue / (Math.pow(2, chromosomeLength) - 1));
    }

    function mutate() {
        if (Math.random() > mutationProbability) {
            return;
        }

        // limit mutate to only one gene in chromosome: change bit
        var position = getRandomPosition(chromosomeLength);
        value[position] = ~~!value[position];
    }

    function generate(chromosomeLength) {
        var chromosomeValue = [];

        for (var i = 0; i < chromosomeLength; i++) {
            chromosomeValue.push(Math.round(Math.random()));
        }

        return chromosomeValue;
    }
};

var Individual = function (parent1, parent2) {
    var chromosomeLength = genetic.options.chromosomeLength;
    var individual = {};

    if (!parent1 && !parent2) {
        var newChromosome = new Chromosome();
        individual.chromosomes = {
            x: newChromosome,
            y: newChromosome
        };
    }
    else {
        parent1 = parent1 || parent2;
        parent2 = parent2 || parent1;

        individual.chromosomes = crossover(parent1, parent2);
        individual.chromosomes = mutate(individual.chromosomes);
    }

    individual.fitness = genetic.objectiveFunction(
        individual.chromosomes.x.decode(),
        individual.chromosomes.y.decode()
    );

    return individual;

    /////////////////////////////////////
    function crossover(parent1, parent2) {
        var position = getRandomPosition(chromosomeLength);

        var chromosomeXValue = parent1.chromosomes.x.value.slice(0, position).concat(
            parent2.chromosomes.x.value.slice(position));
        var chromosomeYValue = parent1.chromosomes.y.value.slice(0, position).concat(
            parent2.chromosomes.y.value.slice(position));

        return {
            x: new Chromosome(chromosomeXValue),
            y: new Chromosome(chromosomeYValue)
        };
    }

    function mutate(chromosomes) {
        chromosomes.x.mutate();
        chromosomes.y.mutate();
        return chromosomes;
    }
};

function selectBest(population) {
    var halfCutPosition = Math.ceil(population.length / 4) * 2;

    population.sort(function (curr, next) {
        return curr.fitness - next.fitness;
    });

    var halfBest = population.slice(0, halfCutPosition);

    return halfBest;
}

function seedPopulation(populationSize) {
    var population = [];

    for (var i = 0; i < populationSize; i++) {
        population.push(new Individual());
    }

    return population;
}

function objectiveFunction(x, y) {
    var z = (x - y) * (-x * Math.sin(Math.sqrt(Math.abs(x))) - y * Math.sin(Math.sqrt(Math.abs(y))));
    return z;
}

function createOffspring(parent1, parent2) {
    var offspring = [];

    offspring.push(new Individual(parent1, parent2));
    offspring.push(new Individual(parent1, parent2));
    offspring.push(new Individual(parent1, parent2));
    offspring.push(new Individual(parent1, parent2));

    return offspring;
}

function run() {
    var startTimer = process.hrtime();

    var population = seedPopulation(genetic.options.populationSize);
    var result = {
        solution: {},
        history: [],
        profiler: {}
    };

    for (var ngen = 0; ngen < genetic.options.generationsQty; ngen++) {
        var bestParents = selectBest(population);

        result.history.push({
            generation: ngen + 1,
            individualsQty: population.length,
            x: bestParents[0].chromosomes.x.decode().toFixed(4),
            y: bestParents[0].chromosomes.x.decode().toFixed(4),
            z: bestParents[0].fitness
        });

        // Offspring generation
        var newPopulation = [];
        for (var i = 0; i < bestParents.length - 1; i += 2) {
            var offspring = createOffspring(bestParents[i], bestParents[i + 1]);
            newPopulation = newPopulation.concat(offspring);
        }
        population = newPopulation;
    }

    result.profiler = {
        elapsedTime: parseFloat(process.hrtime(startTimer).join('.'))
    };

    result.solution = {
        x: bestParents[0].chromosomes.x.decode().toFixed(4),
        y: bestParents[0].chromosomes.x.decode().toFixed(4),
        z: bestParents[0].fitness
    };

    return result;
}

var genetic = (function () {
    var geneticObject = {
        objectiveFunction: objectiveFunction,
        options: {
            chromosomeLength: 4,
            generationsQty: 25,
            mutationProbability: 0.02,
            populationSize: 100,

            // [min, max] objective function x, y variable
            interval: {
                min: -2,
                max: 2
            }
        },
        run: run
    };

    return geneticObject;
})();

module.exports = genetic;