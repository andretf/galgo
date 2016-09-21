var ga = require('../genetic');

describe('options', function() {
    it('should has options attribute', function(){
        expect(ga.options).toBeDefined();
    });

    it('should has options.chromosomeLength', function(){
        expect(ga.options.chromosomeLength).toBeDefined();
    });
    it('should has options.generationsQty', function(){
        expect(ga.options.generationsQty).toBeDefined();
    });
    it('should has options.mutationProbability', function(){
        expect(ga.options.mutationProbability).toBeDefined();
    });
    it('should has options.populationSize', function(){
        expect(ga.options.populationSize).toBeDefined();
    });
});

describe('options.populationSize', function(){
    var defaultValue = 10;

    it('should defaults to ' + defaultValue, function(){
        expect(ga.options.populationSize).toBe(defaultValue);
    });

    it('should generate initial population of specified size', function(){
        ga.options.populationSize = 20;
        var result = ga.run();
        expect(result.history[0].individualsQty).toBe(20);
    });
});

describe('options.generationsQty', function(){
    var defaultValue = 25;

    it('should defaults to ' + defaultValue, function(){
        expect(ga.options.generationsQty).toBe(defaultValue);
    });

    it('should generate initial population of specified size', function(){
        ga.options.generationsQty = 20;
        var result = ga.run();
        expect(result.history.length).toBe(20);
    });
});
