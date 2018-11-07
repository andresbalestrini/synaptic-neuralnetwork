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