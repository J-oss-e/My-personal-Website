/*
    Prime Factorization - Have the user enter a number and find
    all Prime Factors (if there are any) and display them.
*/

var getPrimeFactors = function (n) {
  "use strict";

  function isPrime(n) {
    var i;

    for (i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }

  var i,
    sequence = [];

  //TODO: Check which numbers are factors of n and also check if
  // that number also happens to be a prime

  // Si se llamó desde el botón sin argumento, leer el input
  if (typeof n === "undefined") {
    var input = (typeof document !== "undefined") ? document.getElementById("num") : null;
    if (input) {
      n = parseInt(input.value, 10);
    }
  }

  n = parseInt(n, 10);

  if (!isNaN(n) && n >= 2) {

    if (n % 2 === 0 && isPrime(2)) {
      sequence.push(2);
      while (n % 2 === 0) {
        n = n / 2;
      }
    }

    for (i = 3; i <= Math.floor(Math.sqrt(n)); i += 2) {
      if (n % i === 0 && isPrime(i)) {
        sequence.push(i);
        while (n % i === 0) {
          n = n / i;
        }
      }
    }

    if (n > 1 && isPrime(n)) {
      sequence.push(n);
    }
  }

  if (typeof document !== "undefined" && arguments.length === 0) {
    var out = document.getElementById("pf");
    if (out) {
      out.innerText = sequence.length ? "[ " + sequence.join(", ") + " ]" : "No prime factors";
    }
  }

  return sequence;
};

// the prime factors for this number are: [ 2, 3, 5, 7, 11, 13 ]
console.log(getPrimeFactors(30030));
