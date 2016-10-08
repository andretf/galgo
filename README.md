[![GitHub version](https://badge.fury.io/gh/andretf%2Fgalgo.svg)](https://badge.fury.io/gh/andretf%2Fgalgo)
[![Code Climate](https://codeclimate.com/github/andretf/galgo/badges/gpa.svg)](https://codeclimate.com/github/andretf/galgo)
[![Build Status](https://travis-ci.org/andretf/galgo.svg?branch=master)](https://travis-ci.org/andretf/galgo)
[![Test Coverage](https://codeclimate.com/github/andretf/galgo/badges/coverage.svg)](https://codeclimate.com/github/andretf/galgo/coverage)
# galgo
Library to calculate **minimal and maximum solutions** using Genetic Algorithm.

Current specs:
- Each solution for a population generates 2 children solutions
- Only best 50% of generate children survive to generate next solutions
- No parents surviving

## Using

    var galgo = require('galgo');
    galgo.fitnessFunction = myFitnessFunction;
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

## Fitness Function

On this initial version, *galgo* expects fitness function, or **fitness function**, only with 1 or 2 variables.

It's defined by `galgo.fitnessFunction`:

    var galgo = require('galgo');
    galgo.fitnessFunction = function myFitnessFn(x, y) {
        return x * x + 4 * y * y + 4 * y + x;
    }


## TODO

- [#1](https://github.com/andretf/galgo/issues/1): Allow **n** variables in fitness function
- [#2](https://github.com/andretf/galgo/issues/2): Choose to **min** or **max** the fitness function
- [#3](https://github.com/andretf/galgo/issues/3): Allow Elitism
- [#4](https://github.com/andretf/galgo/issues/4): Surviving parents with max-age option
