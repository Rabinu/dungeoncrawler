export function generateRandom(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

//shuffle array for hall order 
export function shuffleArray() {
  let array = [1, 2, 3, 4]
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [
      array[i], array[j]
    ] = [
      array[j], array[i]
    ]
  }
  return array;
}

// Function to see if rooms are overlapping
export function matchingNumbers(a, b, rooms) {
  let overlap = false;
  if (rooms !== undefined) {
    rooms.map(room => {
      for (let x = a[0]; x <= a[1]; x++) {
        if (x >= room.coordX[0] - 1 && x <= room.coordX[1] + 1) {
          for (let y = b[0]; y <= b[1]; y++) {
            if (y >= room.coordY[0] - 1 && y <= room.coordY[1] + 1) {

              return overlap = true;
            }
          }
        }
      }
    })
    return overlap;
  }
}
