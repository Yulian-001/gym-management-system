//? Funcion para revertir un numero

//* invertir una cadena de texto

// function characterReverse(chain){
//     chain = chain + '';

//     //? retorno invertido
//     return chain.split('').reverse().join('');
// }

// console.log(characterReverse('elbisop se euq rorre nu ayah euq sonem a aditrevni rilas euq eneit anedac atsE'))

//* cadena invertida exictosamente 


//? funcion que verifique si una cadena es palindromo  number and string


// function checkpalindrom(str){  
    
//         const se = /[^A-Za-z0-9]/;
//         str = str.toLowerCase().replace(se,'');
//         const len = str.length;
//         for (let i = 0; i < len/2; i++){
//             if (str[i] !==str[len - 1 - i]){
//                 return `El string '${ str}', no es palindromo `;
//             }
//         }

// return `El string '${str}', si es un palindromo`;
// }

// console.log(checkpalindrom('perro'))


//? funcion que convierte en mayuscula la primera letra de una cadejna

// function mayusCase(text){
//      let palabras = text.split(' ');
//      let resultado = palabras.map(palabra =>{
//             return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();

//      })
//      return resultado.join(' ');
// } 

// let results = mayusCase('este texto volvera en mayuscula la primer letra de cada palabra');

// console.log(results)

//? funcion que solo pone mayuscal la letra de una sola palabra


// function letterMayus(letter){

//     return letter.charAt(0).toUpperCase() + letter.slice(1);
// }

// console.log(letterMayus('este texto iniciará con una mayúscula gracias a la función'))


//? Funcion para cambiar la posicion de un numero 

// function numReverse(num){
//     num = num + '';

//     return num.split('').reverse().join('');
// }

// console.log(numReverse(252689))


//? contar vocales 


// function characterCount(vocals) {

//     vocals  = vocals + '';
//     let cont = 0;

//     //? contar vocales de la cadena escrita


//     for ( let i = 0; i < vocals.length; i++) {
//         cont++;
//     }

// }

// console.log(characterCount('Este texto aparecerá con letras const', cont))
 

// //? Algoritmo para mensaje de hora


// function helloHour(currentHour){
//     currentHour = new Date().getHours();
//     let greeting;


//     if(currentHour < 12){
//         return `Buenos dias son las ${currentHour}`;
//     } else if (currentHour < 18){
//         return `Buenas tarde ya son las ${currentHour}`;
//     } else {
//         return `Buenas noches ya es hora de dormir`
//     }
// }


// console.log(helloHour())



//? funcion para invertir una cadena

// function characterReverse(numReverse){
//     numReverse = numReverse + '';

//     return numReverse.split('').reverse().join('');
// }

// console.log(characterReverse('902356'))


//? funcion para invertir una cadena de texto

// function stringReverse(cadena){
//     cadena = cadena + '';

//     return cadena.split('').reverse().join('');
// }

// console.log(stringReverse('esta cadena será invertida'))

//? validacio de edad


// function ageValid(age){
    
//     if (age >= 18){
//         return `Es mayor de edad ${age}`;
//     } else if ( age >= 65){
//         return `Es adulto mayor ${age}`;
//     } else {
//         return `Es menor de edad no puede ingresar al chongo ${age}`
//     }
// }

// console.log(ageValid('65'))


//? ejercicio de fizz buzz

// function  numRecorrido(num){

//     for (let i = 1; i <= num; i++){
//         if(i % 5 === 0  && i % 3 === 0){
//             console.log( `FizzBuzz`);
//         } else if( i % 3 === 0){
//            console.log( `Fizz`) ;
//         } else if (i % 5 === 0){
//             console.log(`Buzz`)
//         } else {
//             console.log(i);
//         }
//     }
// }
// console.log(numRecorrido(20))


//? convertir celcius a fahrenheit

// function celciussFahrenheit(celcius){
//     return`La conversión de celcius a fahrenheit es: ${(celcius * 9/5) + 32};`
// }
// console.log(celciussFahrenheit(25))


// //? funcion de contar vocales

// function vocalcont(texto){

//     let vocales = 'aeiouAEIOU';
//     let contador = 0;

//     for ( let i of  texto ){
//         if( vocales.includes(i)){
//             contador++;
//         }
//     }
//     return contador;
// }

// console.log(vocalcont('sin comentarios'))


//? funcion que cuente hasta el numero 20 y los sume todos

// function sumNum(num){

//     let sum = 0;
    
//     for ( let i = 0; i < num; i++){
//          sum += i;
//         }
//         return  `La suma de los numeros del 1 al ${num} es: ${sum}`;
//     } console.log(sumNum(5))


//? funcion de listar numeros y sumarlos pares 
//? para esto se debe hacer dos listas una que muestre los numeros y otra que sume los pares
//* forma correcta lograda segun lo que yo esperaba
// function listNum(num){
//    let sum = 0;

//     for(let i = 1; i <= num; i++){
//        if( i % 2 === 0) {
//         sum += i;
// console.log( ` ${sum} `)
//        }console.log(i)
//     }  
    
// } listNum(10);



//* funcion forma lo que la IA esperaba (sin usar IA)
//* resultado esperado = 1,2,3,4,5,6,7...10
//* suma total de los pares 30;
// function sumListNum(num){
//     let sum = 0;
//     let total = [];

//     for (let i = 1; i <= num; i++){
//       total.push(i);
//       if( i % 2 === 0){
//         sum+= i;
//     } 
//     }
//     return{
//         numeros: total,
//         sumaTotalPares: sum
//     };
// }

// const result = sumListNum(10);

// console.log(`Lista completa ${result.numeros.join(', ')}`);
// console.log(`Suma de pares ${result.sumaTotalPares}`);

// //? funcion que imprima lista de numeros

// function listNum(num){

   
//     for(let i = 1; i <= num; i++){
//        console.log(i);
//     }
    
// } listNum(10);



//? contador de impares

// function analizarRango(num){
//     let cont = 0;
//     let rango = [];

//  for (let i = 1; i <= num; i++){
//      rango.push(i);
//          if(i % 2 !== 0){
//              cont = cont + 1;
//             };
//         }
//          return {
//            contador: cont,
//                rangoNumeros:rango
//         }
//     }

// const result = analizarRango(10);

// console.log(`El rango de numeros es: ${result.rangoNumeros.join(', ')}`);
// console.log(`El total de numero impares es: ${result.contador}`);


// //? FUNCION fizz buzz con contador de cada uno

// function contFizzB(num){
//     let fizzbuzz = 0;
//     let fizz = 0;
//     let buzz = 0;
//     let range = [];

//     for (let i = 1; i <= num; i++){
//         //* === FIZZBUZZ ===
//      if(i % 3 === 0 && i % 5 === 0){
//               fizzbuzz++;
//                 range.push('FizzBuzz');            
//               //* === FIZZ ===
//          } else if (i % 3 ===0){
//             fizz++;
//             range.push('Fizz');
//             //* === BUZZ ===
//           }else if(i % 5 === 0){
//            buzz++;
//           range.push('Buzz');
//         }else {
//            range.push(i);
//         }
//     }
//     return{
//         list: range,
//         contFizzBuzz:fizzbuzz,
//         contFizz: fizz,
//         contBuzz: buzz,
//     }
// } 

// const result = contFizzB(15);
// console.log(`El contador de FizzBuzz es: ${result.list.join(', ')}`);
// console.log(`El contador de Fizz es: ${result.contFizz}`);
// console.log(`El contador de Buzz es: ${result.contBuzz}`);

//*  funcion que convierte numeros arabes en romanos


// function romanoNum(num){
//     let range = [];
//     let romanoRange = [];
//     const symbolNum = [ 
//         { value: 10, symbol: 'X' },
//         { value: 9, symbol: 'IX' },
//         { value: 5, symbol: 'V' },
//         { value: 4, symbol: 'IV' },
//         { value: 1, symbol: 'I' }
//     ];

//     for ( let i = 1; i <= num; i++){
//         range.push(i);
//         let container = i;
//         let convertidor = '';

//         for(let j = 0; j < symbolNum.length;j++ ){
//             while(container >= symbolNum[j].value){
//                 convertidor += symbolNum[j].symbol;
//                 container -= symbolNum[j].value;
//             }
//         } romanoRange.push(convertidor);
//     }
//     return {
//         contRange: range,
//         contRomanoRange: romanoRange
//     };
// }

// const result = romanoNum(10);

// console.log(`Rango árabe: ${result.contRange.join(', ')}`);
// console.log(`Rango romano: ${result.contRomanoRange.join(', ')}`);

//* identificador de palindromos

// function identPalinder(text){
   
//     const clean = text.toLowerCase().replace(/\s/g,'');
//     const reverse = clean.split('').reverse().join('');
//     return clean === reverse;
    
// }console.log(identPalinder('Anita lava la tina'))

//* con ciclo for

// function identPalinde(text){
//     const clean = text.toLowerCase().replace(/\s/g,'');
//     let reverse = '';
//     for(let i = clean.length -1; i >= 0; i--){
//          reverse += clean[i];   
//     }
//     return clean === reverse;
// }

// const myText = 'somos';
// console.log(`Es palindroma: ${myText}: ${identPalinde(myText)}`)


//* saber que numero en un array es mayor

// function numMayor(){
//     let numArray = [2,234,1,2,3,42,54];
//     let mayor  = 1 ;

//     for ( const num of numArray){
//         if(num < mayor ){
//             mayor = num;
//         }
//     }
//     console.log(`El numero mayor es: ${mayor}`)
// }
// numMayor()

//* Funcion de separador de pares


// function paresNum(){
//     let rangeNum = [12,2, 4,32,43,45,99,6,2,5,7,8];
//     let rangeNumPar = [];
//     let mayor = 0;

//     for (const numPar of rangeNum){
//         if(numPar % 2 === 0 && numPar > mayor){
//            mayor = numPar;
//             rangeNumPar.push(mayor);
//         } 
//     }
//      console.log(`El mayor de los pares es: ${mayor}`);
//         console.log(`Rango de numeros: ${rangeNum}`);
    
// }paresNum()


//* funcion que suma los numeros de un array menos los repetidos

// function sumNum(){
//     let numArray = [1,1,2,3];
//     let result = 0;
//     const duplicateNull = numArray.filter(num => {
//         return numArray.indexOf(num) === numArray.lastIndexOf(num);
//     });


//     for (let i = 0; i < duplicateNull.length;i++){
//         result += duplicateNull[i];
//     }
//     console.log(`La suma de los numeros es: ${result}`)
// }sumNum()

//* lee un array de devuel el objeto del conteo de cada que se repite

// function conteoVotos(){
//     let votos = ['lucia', 'carlos', 'lucia', 'carlos','luis'];
//     let contVotos = {};

//     for(const nombre of votos){
//         if(contVotos[nombre]){
//             contVotos[nombre]++;
//         }else{ contVotos[nombre] = 1;
//         }
//     }
//     console.log(contVotos)
// }conteoVotos()



//* leer un array y solo sume los pares


// function sumNUmPar(){
//     let range = [1,2,4,3,5,22,55,23,65];
//     let rangePar = [];

//     for(const num of range){
//         if(num % 2 === 0){
            
//             rangePar.push(num);
//         }
//     } console.log(`Los numeros pares son: ${rangePar}`)

// }sumNUmPar()

// function sumNumPar(num){
//     let range = [1,2,4,3,5,22,55,23,65];
//     let rangePar = [];

//     for( num = 1; num < range.length; num++){
//         if(num % 2 === 0){
//             rangePar.push(num);
//         }
//     }console.log(rangePar)
// }sumNumPar()