'use strict';

function getRandomPosition(size) {
    return Math.floor(Math.random() * size);
}

var Chromosome = function (value) {
    var chromosomeLength = galgo.options.chromosomeLength;
    var mutationProbability = galgo.mutationProbability;
    var max = galgo.options.interval.max;
    var min = galgo.options.interval.min;

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
    var chromosomeLength = galgo.options.chromosomeLength;
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

    individual.fitness = galgo.fitnessFunction(
        individual.chromosomes.x.decode(),
        individual.chromosomes.y.decode()
    );

    return individual;

    /////////////////////////////////////
    function crossover(parent1, parent2) {
        var chromosomeIds = ['x', 'y'];
        var result = {};

        chromosomeIds.forEach(function(id){
            var position = getRandomPosition(chromosomeLength);
            var value = parent1.chromosomes[id].value.slice(0, position).concat(
                parent2.chromosomes[id].value.slice(position));
            result[id] = new Chromosome(value);
        });

        return result;
    }

    function mutate(chromosomes) {
        chromosomes.x.mutate();
        chromosomes.y.mutate();
        return chromosomes;
    }
};

function selectBest(population) {
    var halfCutPosition = Math.ceil(population.length / 4) * 2;

    if (galgo.options.minimize){
        population.sort(function (curr, next) {
            return curr.fitness - next.fitness;
        });
    }
    else if (galgo.options.maximize) {
        population.sort(function (curr, next) {
            return next.fitness - curr.fitness ;
        });
    }

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

function fitnessFunction(x, y) {
//    var z = (x - y) * (-x * Math.sin(Math.sqrt(Math.abs(x))) - y * Math.sin(Math.sqrt(Math.abs(y))));
    var z = x * x + 4 * y * y + 4 * y + x; // x² + 4y² + 4y + x
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

    var population = seedPopulation(galgo.options.populationSize);
    var result = {
        solution: {},
        history: [],
        profiler: {}
    };

    for (var ngen = 0; ngen < galgo.options.generationsQty; ngen++) {
        var bestParents = selectBest(population);

        result.history.push({
            generation: ngen + 1,
            individualsQty: population.length,
            x: bestParents[0].chromosomes.x.decode().toFixed(4),
            y: bestParents[0].chromosomes.y.decode().toFixed(4),
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

    result.solution = {
        x: bestParents[0].chromosomes.x.decode().toFixed(4),
        y: bestParents[0].chromosomes.y.decode().toFixed(4),
        z: bestParents[0].fitness
    };

    result.profiler = {
        elapsedTime: parseFloat(process.hrtime(startTimer).join('.'))
    };

    return result;
}

var galgo = (function () {
    var geneticObject = {
        fitnessFunction: fitnessFunction,
        options: {
            chromosomeLength: 10,
            generationsQty: 25,
            mutationProbability: 0.02,
            populationSize: 250,
            maximize: false,
            minimize: true,

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

module.exports = galgo;