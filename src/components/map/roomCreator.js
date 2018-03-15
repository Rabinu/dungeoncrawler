import {
  generateRandom
} from '../../shortFunctions';

export default function roomCreator(state) {
  const {
    playingfield
  } = state;
  const minSize = playingfield.roomSizeMin;
  const maxSize = playingfield.roomSizeMax;
  const maxHalls = generateRandom(1, 4);
  const height = generateRandom(minSize, maxSize);
  const width = generateRandom(minSize, maxSize);

  return {
    width,
    height,
    maxHalls
  };

}
