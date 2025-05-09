let array = ['Opción 1.', 'Opción 2.'];

array = array.map(element => {
  if (element.includes('.')) {
    return (element = parseInt(element[element.length - 2]));
  }
});

console.log(array);
