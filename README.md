# synaptic-neuralnetwork

## Conceptos

Las redes neuronales son modelos que intentan reproducir el comportamiento del cerebro, las cuales están formadas por, obviamente, neuronas. Se pueden encontrar 3 tipos:

* Aquellas que reciben información de entrada
* Esta información se transmite a las neuronas del segundos nivel, que son las encargadas del procesamiento de la misma, donde se genera cualquier tipo de representación interna de la información. 
* Una vez finalizado el período de procesado, la información llega las unidades de salida, cuya misión es dar la respuesta del sistema.

![neuronas](https://natureofcode.com/book/imgs/chapter10/ch10_02.png)

## Conexiones entre neuronas

Las conexiones que unen las neuronas que forman una RNA tienen asociado un peso, que es el que hace que la red adquiera conocimiento. Considérese como el valor de salida de una neurona i en un instante dado. Una neurona recibe un conjunto de señales que le dan información del estado de activación de todas las neuronas con las que se encuentra conectada. Cada conexión entre la neurona i y la j está ponderada por un peso wij. Normalmente, como simplificación, se considera que el efecto de cada señal es aditivo, de tal forma que la entrada neta que recibe una neurona Netj es la suma del producto de cada señal individual por el valor de la sinapsis que conecta ambas neuronas. 
En cuanto al peso wij, si es positivo indica que la interacción entre las neuronas i y j es excitadora; es decir, siempre que la neurona i esté activada, la neurona j recibirá una señal de i que tenderá a activarla. Si wij es negativo la conexión será inhibitoria. En este caso si i está activada, enviará una señal j que tenderá a desactivar a esta. Finalmente, is wij es 0 se supone que no hay conexión entre ambas. Así, una neurona dará más importancia a la información que le llegue por una conexión de peso mayor que no a aquella que le llegue por una conexión de menor peso.

![formula](/formula.png)
![conexiones](/conexiones.png)

## Función de transferencia o activación

Asociado al resultado de una neurona hay una función de activación o transferencia que transforma la entrada neta de la neurona en una señal de salida. Esta señal debe superar un valor llamado “umbral” para que la neurona transmita el resultado a través de sus conexiones con las neuronas de la capa siguiente. Existen 4 funciones de activación típicas que determinan distintos tipos de neuronas:

* Función escalón
* Función lineal y mixta
* Función Gaussiana
* Sigmoidal (Neurona sigmoidal)

![funcion sigmoide](/sigmoide-function.png)

Toman cualquier número dado y lo aplastan a un valor entre 0 y 1. Si el resultado de la función  es mayor que el valor umbral (U), la neurona se activa y emite una señal (1) hacia las neuronas de la capa siguiente. Pero, si por el contrario, el resultado es menor que el valor umbral, la neurona permanece inactiva (0) y no envía ninguna señal.

![sigmoide01](/sigmoide01.png)
![sigmoide02](/sigmoide02.png)

# Synaptic JS

Synaptic es una biblioteca de red neuronal de javascript para node.js y el navegador.

## Neuronas

Las neuronas son la unidad básica de la red neuronal. Una Neurona puede realizar básicamente 4 operaciones: project connections, gate connections, activate and propagate.

### __project__

Una neurona puede proyectar una conexión a otra neurona (es decir, conectar la neurona A con la neurona B).

```js
var A = new Neuron();
var B = new Neuron();
A.project(B); // A now projects a connection to B
```

El método devuelve un objeto Connection, que puede ser controlado por otra neurona.

### __activate__
Cuando una neurona se activa, calcula su estado a partir de todas sus conexiones de entrada utilizando su función de activación, y devuelve la salida (activación).

```js
var A = new Neuron();
var B = new Neuron();
A.project(B);

A.activate(0.5); // 0.5
B.activate(); // 0.3244554645
```

### __propagate__

Después de una activación, puede enseñarle a la neurona cuál debería haber sido la salida correcta. Esto se hace al volver a propagar el error. Para utilizar el método de propagación, debe proporcionar una tasa de aprendizaje y un valor objetivo (flotar entre 0 y 1). 
Por ejemplo, esta es la forma en que puede entrenar a la neurona B para activar 0 cuando la neurona A activa 1:

```js
var A = new Neuron();
var B = new Neuron();
A.project(B);

var learningRate = .3;

for(var i = 0; i < 20000; i++)
{
    // when A activates 1
    A.activate(1);
    
    // train B to activate 0
    B.activate();
    B.propagate(learningRate, 0); 
}

// test it
A.activate(1);
B.activate(); // 0.006540565760853365
```

### __Squashing function and bias__

De forma predeterminada, una neurona utiliza un sigmoide logístico como su función de aplastamiento / activación, y un sesgo aleatorio. Puedes cambiar esas propiedades de la siguiente manera:

```js
var A = new Neuron();
A.squash = Neuron.squash.TANH;
A.bias = 1;
```

### Layers

Una capa es básicamente una matriz de neuronas, pueden hacer prácticamente las mismas cosas que las neuronas, pero hacen que el proceso de programación sea más rápido.
```js
var myLayer = new Layer(5);
```

### __project__
Una capa puede proyectar una conexión a otra capa. Debe proporcionar la capa a la que desea conectarse y el tipo de conexión:
```js
var A = new Layer(5);
var B = new Layer(3);
A.project(B, Layer.connectionType.ALL_TO_ALL); // Todas las neuronas en la capa A ahora proyectan una conexión a todas las neuronas en la capa B
```
Tipos de conexion:

Layer.connectionType.ALL_TO_ALL: conecta cada neurona de la capa A, a cada neurona en la capa B. 
Layer.connectionType.ONE_TO_ONE: conecta cada neurona de la capa A, a una neurona en la capa B. Ambas capas deben ser del mismo tamaño para trabajar.
Layer.connectionType.ALL_TO_ELSE: Útil sólo en conexiones automáticas. Conecta cada neurona de una capa a todas las otras neuronas en esa misma capa, excepto con sí misma. Si este tipo de conexión se usa en una conexión entre capas diferentes, produce el mismo resultado que ALL_TO_ALL.


NOTA: Si no se especifica, el tipo de conexión siempre es Layer.connectionType.ALL_TO_ALL cuando se conectan dos capas diferentes, y es Layer.connectionType.ONE_TO_ONE cuando se conecta una capa a sí misma (es decir, myLayer.project(myLayer)). Éste devuelve un objeto LayerConnection.

### __activate__
Cuando una capa se activa, simplemente activa todas las neuronas en esa capa en orden, y devuelve una matriz con las salidas. Acepta una matriz de activaciones como parámetro (para capas de entrada):
```js
var A = new Layer(5);
var B = new Layer(3);
A.project(B);

A.activate([1,0,1,0,1]); // [1,0,1,0,1]
B.activate(); // [0.3280457, 0.83243247, 0.5320423]
```

### __propagate__

Después de una activación, puede enseñar a la capa cuál debería haber sido la salida correcta. Esto se hace al volver a propagar el error. Para utilizar el método de propagación, debe proporcionar una tasa de aprendizaje y un valor objetivo (matriz de flotantes entre 0 y 1). 

Por ejemplo, si quiero entrenar a la capa B para generar [0,0] cuando la capa A se activa [1,0,1,0,1]:
```js
var A = new Layer(5);
var B = new Layer(2);
A.project(B);

var learningRate = .3;

for (var i = 0; i < 20000; i++)
{
    // when A activates [1, 0, 1, 0, 1]
    A.activate([1,0,1,0,1]);

    // train B to activate [0,0]
    B.activate();
    B.propagate(learningRate, [0,0]);
}

// test it
A.activate([1,0,1,0,1]);
B.activate(); // [0.004606949693864496, 0.004606763721459169]
```

### __Función de aplastamiento y sesgo.__
Puede configurar la función de aplastamiento y el sesgo de todas las neuronas en una capa utilizando el conjunto de métodos:
```js
myLayer.set({
    squash: Neuron.squash.TANH,
    bias: 0
});
```

El método __neurons()__ devuelve una matriz con todas las neuronas en la capa, en orden de activación.

## Networks

Las redes son básicamente una serie de capas. Tienen una capa de entrada, varias capas ocultas y una capa de salida. Las redes pueden proyectar conexiones, activar y propagar de la misma manera que lo hacen las capas.

```js
var inputLayer = new Layer(4);
var hiddenLayer = new Layer(6);
var outputLayer = new Layer(2);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

var myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});
```

### __worker()__
### __clone()__

El método __neurons()__ devuelve una matriz con todas las neuronas en la red, en orden de activación.


## Trainer
El Trainer facilita la capacitación de cualquier conjunto en cualquier red, sin importar su arquitectura. Para crear un entrenador solo tienes que proporcionar una Red para entrenar.

### __train()__
```js
trainer.train(trainingSet, {
   rate: .2,
   iterations: 20,
   error: .1,
   shuffle: true,
   log: 1,
   cost: Trainer.cost.CROSS_ENTROPY
});
```

___cost___: Una función de costo es un valor único que califica la calidad de la red neuronal en su conjunto. Es una medida de "qué tan buena" es una red neuronal con respecto a su muestra de capacitación y un resultado esperado. 

___rate___: La velocidad de aprendizaje es la rapidez con la que una red abandona las creencias antiguas por otras nuevas. Una mayor tasa de aprendizaje significa que la red cambia de opinión más rápidamente. 

___shuffle___: puede especificar si el conjunto de entrenamiento está ordenado al azar o no.

___error___: El 'error' es el error mínimo que se puede alcanzar durante el entrenamiento, si se logra, el entrenamiento se detiene.
