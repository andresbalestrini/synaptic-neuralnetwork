const mnist = require('mnist');
const synaptic = require('synaptic');
const fs = require('fs');

const set = mnist.set(700, 20);

const trainingSet = set.training;
const testSet = set.test;

const Network = synaptic.Network;

var myNetwork;
var jsonRed;

fs.readFile('./MiRed.txt', function read(err, data) {
    if (err) throw err;    
    jsonRed = JSON.parse(data);
    activarRed();
});

function activarRed() {    
    myNetwork = Network.fromJSON(jsonRed);    
    
    console.log("------------------------------------");
    console.log("myNetwork.activate(testSet[0].input)");
    console.log("------------------------------------");
    var output = myNetwork.activate(testSet[0].input);
    console.log(output);
    console.log("------------------------------------");
    var maximum = output.reduce(function(p,c) { return p>c ? p : c; });
    var nominators = output.map(function(e) { return Math.exp(e - maximum); });
    var denominator = nominators.reduce(function (p, c) { return p + c; });
    var softmax = nominators.map(function(e) { return e / denominator; });
    var maxIndex = 0;
    softmax.reduce(function(p,c,i){if(p<c) {maxIndex=i; return c;} else return p;});
    console.log("softmax");
    console.log("------------------------------------");
    var result = [];
    for (var i=0; i<output.length; i++)
    {
        if (i==maxIndex)
            result.push(1);
        else
            result.push(0);
    }
    console.log(result);
    console.log("------------------------------------");
    console.log("testSet[0].output");
    console.log("------------------------------------");
    console.log(testSet[0].output);
    console.log("------------------------------------");
    var nnDigit = 0;
    for (var i=0; i<=9; i++)
    {
        if (result[i]==1)
        {
            nnDigit = i;
            break;
        }
    }
    var testDigit = 0;
    for (var i=0; i<=9; i++)
    {
        if (testSet[0].output[i]==1)
        {
            testDigit = i;
            break;
        }
    }
    console.log("Results:");
    console.log("------------------------------------");
    console.log("La red neuronal creía que el dígito era un " + nnDigit);
    console.log("cuando en realidad era un " + testDigit);
    console.log("------------------------------------");
}
