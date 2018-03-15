import {
  generateRandom,
  shuffleArray,
  matchingNumbers
} from '../../shortFunctions';
import roomCreator from './roomCreator';
import generateHall from './generateHall'

export default function placeRooms(state) {
  const {
    playingfield
  } = state;
  let currentRoomCount = 0;
  let fieldRooms = [];
  let fieldHalls = [];
  let coordXHall = [];
  let coordYHall = []
  while (currentRoomCount < playingfield.max_rooms) {

    let room = roomCreator(state);
    let roomX = 0;
    let roomY = 0;

    //create the first room
    if (fieldRooms.length === 0) {

      roomX = generateRandom((playingfield.width * 0.25), ((playingfield.width * 0.75) - room.width - 1));
      roomY = generateRandom((playingfield.height * 0.25), ((playingfield.height * 0.75) - room.height - 1));
      fieldRooms.push({
        coordX: [
          roomX, roomX + room.width - 1
        ],
        coordY: [
          roomY, roomY + room.height - 1
        ],
        roomNumber: 1,
        halls: room.maxHalls
      })

      currentRoomCount++

    } else {
      //create other rooms
      const roomOrder = shuffleArray();
      let previousRoom = fieldRooms[fieldRooms.length - 1];
      let hallcount = 0;
      let maxAttempts = 0;
      let roomSide = 0;

      let minX = previousRoom.coordX[0] - room.width + 1;
      //minX < 0 ? minX = 0 : null
      let maxX = previousRoom.coordX[1];
      let minY = previousRoom.coordY[0] - room.height + 1;
      let maxY = previousRoom.coordY[1];

      //create room around the previousroom by hallcount
      //while (previousRoom.halls > hallcount && maxAttempts < 5){
      //console.log("previous room halls " + previousRoom.halls);
      while (previousRoom.halls > hallcount) {

        switch (roomOrder[hallcount]) {
          case 1: //top
            roomY = minY - 2;
            roomX = generateRandom(minX, maxX);
            roomSide = 1;
            break;
          case 2: //right
            roomY = generateRandom(minY, maxY);
            roomX = previousRoom.coordX[1] + 2;
            roomSide = 2;
            break;
          case 3: //bottom
            roomY = previousRoom.coordY[1] + 2;
            roomX = generateRandom(minX, maxX);
            roomSide = 3;
            break;
          case 4: //left
            roomY = generateRandom(minY, maxY);
            roomX = minX - 2;
            roomSide = 4;
            break;

        }
        if (maxAttempts < 5) {
          let coordX = [
            roomX, roomX + room.width - 1
          ];
          let coordY = [
            roomY, roomY + room.height - 1
          ];

          if (coordX[0] > 0 && coordX[1] < playingfield.width && coordY[0] > 0 && coordY[1] < playingfield.height) {
            //console.log("kamer past in veld")
            if (!matchingNumbers(coordX, coordY, fieldRooms)) {

              fieldRooms.push({
                coordX,
                coordY,
                roomNumber: fieldRooms[fieldRooms.length - 1].roomNumber + 1,
                halls: generateRandom(1, 4)
              });

              //Bijbehorende hall plaatsing

              switch (roomSide) {
                case 1: //top
                  coordXHall = generateHall(previousRoom.coordX, coordX);
                  coordYHall = coordY[1] + 1;
                  break;
                case 2: //right
                  coordXHall = coordX[0] - 1;
                  coordYHall = generateHall(previousRoom.coordY, coordY);
                  break;
                case 3: //bottom
                  coordXHall = generateHall(previousRoom.coordX, coordX);
                  coordYHall = coordY[0] - 1;
                  break;
                case 4: //left
                  coordXHall = coordX[1] + 1;
                  coordYHall = generateHall(previousRoom.coordY, coordY);
                  break;

              }
              fieldHalls.push([coordXHall, coordYHall]);
              coordXHall = [];
              coordYHall = [];
              maxAttempts = 0;
              hallcount++
              currentRoomCount++
            } else {
              maxAttempts++
              //room = this.roomCreator();
            }
          } else {
            maxAttempts++
            //room = this.roomCreator();
          }
          //console.log("hall cycle");
          //console.log("max attempts ", maxAttempts, " hallcount ", hallcount);
        } //end if max attempt for single room
        else {
          //console.log("max attepts bigger");
          hallcount++
          maxAttempts = 0;
        }

        if (currentRoomCount === playingfield.max_rooms) {
          break;
        }
      } //While end hall count
      hallcount = 0

    }
  } // While end roomcount
  return {fieldRooms,fieldHalls}
}
