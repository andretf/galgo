# galgo
Library to calculate **minimal solutions** using Genetic Algorithm.

Current specs:
- Each solution for a population generates 2 children solutions
- Only best 50% of generate children survive to generate next solutions
- No parents surviving

## Using

    var galgo = require('galgo');
    galgo.objectiveFunction = myFitnessFunction;
    galgo.options = myOptions;    // optionally set 1 or more options (or replace by its own)
    var result = galgo.run();

## Options

Options with default values, that can be changed through `galgo.options`:

    options: {
        chromosomeLength: 10,       // length of encoding array of bits
        generationsQty: 5,          // quantity of generations to run (#iterations)
        mutationProbability: 0.02,  // probability of mutation occur on next generation of a solution: [0, 1]
        populationSize: 10000       // size of solutions per generation,
        interval: {                 // interval of accepted solution
            min: -2,
            max: 2
        }
    }

## Objective Function

On this initial version, *galgo* expects objective function, or **fitness function**, only with 1 or 2 variables.

It's defined by `galgo.objectiveFunction`:

    function myFitnessFn(x, y) {
        return x * x + 4 * y * y + 4 * y + x;
    }


## TODO

- Allow **n** variables in objective function
- Choose to **min** or **max** the objective function
- Allow Elitism
- Surviving parents with max-age option
