// COMMANDER es una de las librerías más utilizadas a la fecha para el manejo de argumentos...

//Entre las CARACTERISTICAS PRINCIPALES permite:

//Convertir flags directamente en booleanos
//Limitar sólo las flags configuradas (cualquier otra impide el procesamiento del programa)
//Colocar argumentos predeterminados
//etc

import { Command } from "commander";
const program = new Command();



// 1 - se le pasa el Comando // 2 - la descripción // 3- un valor default.
program
    .option("-p <port>", "puerto donde incia el servidor", 8080) //port es el puerto a colocar
    .option("--mode <mode>", "modo de trabajo", "desarrollo")//mode es el argumento a colocar

program.parse(); //parse se utiliza para cerrar la configuracion de comandos.

//acá finaliza la configuración.


//verificar que funciona lo creado:

console.log("opciones: ", program.opts());


export default program;