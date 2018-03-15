import {
  generateRandom
} from '../../shortFunctions';

export default function generateHall(oldRoom, newRoom) {
      let minCoord = 0;
      let maxCoord = 0;
      if (oldRoom[0] < newRoom[0]) {
        minCoord = newRoom[0]
      } else {
        minCoord = oldRoom[0]
      }
      if (oldRoom[1] > newRoom[1]) {
        maxCoord = newRoom[1];
      } else {
        maxCoord = oldRoom[1];
      }
      return generateRandom(minCoord, maxCoord)
    }
