---
title: "Ajuste de hiperparámetros y Optuna"
description: "Una pequeña guía para conocer qué es un hiperparámetro y cómo optimizarlo con el framework Optuna"
pubDate: 2026-08-15
heroImage: "/images/blog/hyperparameter-optimization-optuna/cover.png"
readingTime: "15 minutos de lectura"
tags: ["python", "optuna", "machine learning", "computacion"]
draft: false
---
# ¿Qué es eso de un hiperparámetro?
Uno cuando empieza a sumergirse en el mundo del aprendizaje automático (*machine learning*), se cansará de escuchar la palabra hiperparámetro por aquí y por allá. Sin embargo, me he encontrado con que no se suele explicar muy bien lo que es o en su defecto, si se hace, consiste en una explicación tan críptica que se pierde el hilo del tema principal de estudio. Voy a intentar paliar un poco esta situación, aportando el mayor rigor posible sin que entremos en perjuicio de que el entendimiento solo sea posible por unos pocos. 

Antes de ponerme a desgranar el concepto, conviene tener en cuenta el origen etimológico del prefijo hiper-. Según la Real Academia Española (s.f.), el prefijo **hiper-** (proveniente del griego _ὑπερ-_) se define como elemento compositivo prefijo que denota «superioridad», «exceso» o «lugar situado por encima». Debemos quedarnos con esta última acepción, por lo que estaríamos hablando de lo que está por encima del parámetro. Pero con una puntualización, lo que está por encima del parámetro, hiperparámetro, es en sí un parámetro.

Y, ¿qué importancia tiene dentro del aprendizaje automático? No nos olvidemos, que en el aprendizaje automático lo que se hace fundamentalmente es aprender patrones en base a unos datos. Es decir, tenemos un modelo con base matemática en el que a partir de unos datos históricos, se van configurando una serie de parámetros internos. Imagina que quieres aprender sobre la Guerra de Independencia Española, entonces seleccionas un libro de historia de España y conforme vayas leyendo/estudiando, vas adquiriendo o fortaleciendo distintas conexiones sinápticas (configuración de parámetros internos). Pero claro, ¿acaso si seleccionas otro libro, no puede ser que tu aprendizaje sea diferente y se adecúe más a tu objetivo? Pues un hiperparámetro no consiste en más que eso, en un parámetro (libro) que va a delimitar la configuración de los parámetros internos (conexiones sinápticas) en un aprendizaje. 

Si esta definición no te satisface, puedes encontrar la matemática en la siguiente sección. En caso contrario, te la puedes saltar.
## Definición matemática de hiperparámetro óptimo
Antes de proceder con la definición matemática del hiperparámetro, hay que tener dos conceptos claros:

- **Error de generalización:** Es el error real que cometerá el modelo al enfrentarse a datos nuevos y desconocidos que provienen de la misma distribución real de entrenamiento, pero que no formaron parte de su entrenamiento.
- **Error empírico:** Es la medida del error o la pérdida que comete el modelo exclusivamente sobre los datos de entrenamiento.

Ahora, un modelo de aprendizaje automático puede formalizarse por la aplicación:
$$
\begin{aligned} M \colon \mathcal{X} \times \Theta &\longrightarrow \mathcal{Y} \\ (x, \theta) &\longmapsto y = M(x; \theta) \end{aligned}
$$
donde:

- $\mathcal{X}$ es el espacio de características (*inputs*), el cual puede ser continuo ($\mathcal{X} \subseteq \mathbb{R}^n$), discreto ($\mathcal{X} \subseteq \mathbb{N}^n$ o conjuntos finitos), o un espacio producto mixto $\mathcal{X} = \prod_{i=1}^n \mathcal{X}_i$
-  $\mathcal{Y}$ es el espacio de salida (*outputs*), siendo $\mathcal{Y} \subseteq \mathbb{R}^m$ en problemas de regresión y un conjunto discreto $\mathcal{Y} \subseteq \{1, \dots, C\}^m$ en clasificación. 
-  $\Theta \subseteq \mathbb{R}^d$ ($d \in \mathbb{N}$) es el espacio de parámetros internos del modelo (pesos, coeficientes, sesgos). 

El vector de parámetros óptimo $\theta^* \in \Theta$ es el resultado de un proceso de entrenamiento $\mathcal{A}$, modelado como:
$$
\begin{aligned} \mathcal{A} \colon \Lambda \times \mathcal{D} &\longrightarrow \Theta \\ (\lambda, D) &\longmapsto \theta^* = \mathcal{A}(\lambda, D) \end{aligned}
$$
donde: 
- $\mathcal{D} = \bigcup_{N=1}^\infty (\mathcal{X} \times \mathcal{Y})^N$ representa el espacio de posibles conjuntos de datos de entrenamiento $D = \{(x_i, y_i)\}_{i=1}^N$ 
- $\Lambda$ es el espacio de hiperparámetros, que puede contener componentes continuas (e.g., tasa de aprendizaje $\alpha \in \mathbb{R}^+$), discretas (e.g., profundidad máxima $k \in \mathbb{N}$) o categóricas (e.g., tipo de regularización $\in \{\ell_1, \ell_2\}$). 

 Generalmente, $\theta^*$ se define mediante la optimización de una función de coste o riesgo empírico regularizado:
$$
\theta^* = \arg\min_{\theta \in \Theta} \mathcal{L}(\theta; D, \lambda).
$$
 Por último, el **hiperparámetro óptimo** $\lambda^* \in \Lambda$ es aquel que minimiza el **error de generalización** (riesgo real) sobre la distribución subyacente $\mathcal{P}_{(\mathcal{X},\mathcal{Y})}$, comúnmente aproximado mediante el error en un conjunto de validación independiente $D_{\text{val}}$ o mediante validación cruzada:
$$
\lambda^* = \arg\min_{\lambda \in \Lambda} \mathcal{E}_{\text{gen}}\big(M(\cdot\,; \theta^*(\lambda))\big) \approx \arg\min_{\lambda \in \Lambda} \mathcal{L}_{\text{val}}\big(\theta^*(\lambda); D_{\text{val}}\big).
$$
## Optimización de hiperparámetros en Python
La búsqueda del hiperparámetro óptimo podemos hacerla a fuerza bruta o por muestreo. Es decir, definiendo un mallado, ir explorando los posibles valores y eligiendo las cantidades que menor error generen sobre el conjunto de validación. Sin embargo, como intuirás, esto no es un proceso muy óptimo y que en proyectos de gran magnitud, el coste temporal y computacional que supone, puede no ser abarcable. Pero tranquilidad, que ya hay gente que ha pensado en esto y ha desarrollado ciertas librerías que vienen a paliar este problema. Hoy hemos seleccionado la librería Optuna, casi como el cantante de reggaeton,  que  usa la optimización bayesiana (principalmente) para obtener la mejor combinación de hiperparámetros posible en un problema de machine learning. No obstante, sus aplicaciones son diversas, pues puede usarse, por ejemplo, en PostgreSQL para encontrar la combinación de memoria y concurrencia que maximice el rendimiento y minimice la latencia para una carga de trabajo específica.

### Componentes y herramientas principales de Optuna

Esta librería consta de tres componentes principales: 

- **Study (el estudio):** Es la sesión global, en la que se define si quieres minimizar o maximizar una función objetivo y coordina todo el proceso.
- **Trial (la prueba):** Es cada intento individual. Se encarga de ejecutar el modelo con una combinación concreta de parámetros sugeridos.
- **Objective (la función objetivo):** Es la función que recibe el `trial`, entrena el modelo y devuelve la puntuación obtenida.

Además, posee dos herramientas fundamentales:

- **Sampler:** Es el cerebro estadístico que decide qué combinación de parámetros probar en el siguiente _trial_ aprendiendo del historial.
- **Pruner:** El vigilante que cancela a mitad de camino un _trial_ si ve que no va a superar a los anteriores.

### Estructura básica de una optimización con optuna

La estructura básica de un script de optimización con Optuna es la siguiente.

``` python
import optuna

def objective(trial):
	{{LÓGICA DE APRENDIZAJE AUTOMÁTICO}}
	return evaluation_score
	
study = optuna.create_study()
study.optimize(objective, n_trials={{numero de intentos}})
```

Para ejemplificar una optimización, vamos a encontrar el máximo de la función $f(x)=-x^2+2$. A continuación, se encuentra su representación gráfica entre $-100$ y $100$.

![Función objetivo](/images/blog/hyperparameter-optimization-optuna/objective_function.png)

Si recuerdas de las clases de secundaria, esta es una función cuyo máximo se encuentra precisamente en $x=0$ con valor $f(0)=2$.  En Optuna, podemos codificar la obtención de este valor máximo, tomando como función objetivo a $f$ con optimización dirigida a maximizar, tomando valores de $x$ reales comprendidos entre $-100$ y $100$:

```python
import optuna

def objective(trial):
	x = trial.suggest_float("x", -100, 100)
	return -x**2+2

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=1000)
```

Obteniendo en esos $1000$ intentos el siguiente valor de $x$ que ha maximizado el valor de la función objetivo en el estudio.
```plaintext
{'x': -0.003033290989069508, 'maximum_value:' 1.9999907991457757}
```

Es decir, se ha obtenido el valor máximo con un error del orden de $10^{-3}$.

Incidiendo aún más en este estudio, podemos representar el número de intentos frente al valor de la función objetivo que se ha obtenido y percatarnos de que en pocos intentos, converge a su valor máximo.

![Historial de optimización](/images/blog/hyperparameter-optimization-optuna/optimization_history.png)


### Optimización enfocada a un problema de aprendizaje automático
Vamos a enfrentarnos al problema canónico de clasificación que se suele encontrar por internet, el de predecir a cuál de las 3 especies de flor del género _Iris_ pertenece un ejemplar a partir de las dimensiones morfológicas de sus pétalos y sépalos. Para ello, vamos a usar un clasificador de bosque aleatorio, o si quieres en inglés, *Random Forest Classifier*. De los múltiples hiperparámetros que posee, podemos óptimizar *n_estimators*  y *max_depth* , que son el número máximo de árboles y la profundidad máxima que pueden alcanzar. Además, los vamos a  seleccionar queriendo maximizar la precisión esperada haciendo validación cruzada con 3 capas. En código esto se visualiza de la siguiente forma:

```python
import optuna
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# 1. Cargar los datos
X, y = load_iris(return_X_y=True)

# 2. Definir qué quieres probar y evaluar
def objective(trial):
    # Parámetros a probar
    n_estimators = trial.suggest_int("n_estimators", 10, 100)
    max_depth = trial.suggest_int("max_depth", 2, 10)

    # Entrenar modelo
    clf = RandomForestClassifier(
        n_estimators=n_estimators, 
        max_depth=max_depth, 
        random_state=42
    )
    
    # Calcular precisión media con validación cruzada
    accuracy = cross_val_score(clf, X, y, cv=3).mean()
    return accuracy

# 3. Crear el estudio y buscar la mejor combinación
study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=20)

# 4. Ver los resultados
print("Mejor precisión:", study.best_value)
print("Mejores parámetros:", study.best_params)
```

En esos $20$ intentos, se ha conseguido seleccionar dos hiperparámetros que consiguen una precisión esperada del $96\%$.

```plaintext
Mejor precisión: 0.9666666666666667
Mejores parámetros: {'n_estimators': 33, 'max_depth': 10}
```

# Conclusión
Llegados a este punto, ya tienes un buen marco de trabajo para que siempre que quieras optimizar algo en base a unos parámetros, puedas hacerlo de forma rigurosa y con sentido matemático.

# Bibliografía
- Enthought. (2019, 12 de julio). _Optuna: A Define by Run Hyperparameter Optimization Framework | SciPy 2019 |_ [Video]. YouTube. [http://www.youtube.com/watch?v=J_aymk4YXhg](http://www.youtube.com/watch?v=J_aymk4YXhg)
- Feurer, M., & Hutter, F. (2019). Hyperparameter Optimization. En F. Hutter, L. Kotthoff, & J. Vanschoren (Eds.), _Automated Machine Learning: Methods, Systems, Challenges_ (pp. 3–33). Springer.
- Real Academia Española. (s. f.). _Hiper-_. En _Diccionario de la lengua española_. Recuperado el 27 de agosto de 2026, de [https://dle.rae.es/hiper-](https://dle.rae.es/hiper-)