import React from 'react';
import {
  WALL,
  HALL,
  ROOM,
  PLAYER
} from '../constants'

class MainApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        visibleField: [],
        playingfieldboard: [],
      }
    }

    componentDidMount() {
      this.genPlayingfield();
      document.addEventListener("keydown", this.test.bind(this));
    }

    genPlayingfield() {
      const {
        playerState,
        playingfield
      } = this.props.state;
      const height = playingfield.height;
      const width = playingfield.width;
      let playingfieldboard = [];

      //**Generate empty board**
      for (let h = 0; h <= height; h++) {
        let row = [];
        for (let w = 0; w <= width; w++) {
          row.push([WALL])
        }
        playingfieldboard.push(row)
      }

      this.placeRooms(callbackRooms => {
        callbackRooms.map(room => {
          for (let h = room.coordY[0]; h <= room.coordY[1]; h++) {
            for (let w = room.coordX[0]; w <= room.coordX[1]; w++) {
              playingfieldboard[h][w] = [ROOM];
            }
          }
        })
      }, callbackHalls => {
        callbackHalls.map(hall => {
          playingfieldboard[hall[1]][hall[0]] = [HALL];
        })
      });
      playingfieldboard[playerState.location[1]][playerState.location[0]].unshift(PLAYER);
      this.setState({
        playingfieldboard
      })

    }

    placeRooms(callbackRooms, callbackHalls) {
      const {
        playingfield
      } = this.props.state;
      let currentRoomCount = 0;
      let fieldRooms = [];
      let fieldHalls = [];
      let coordXHall = [];
      let coordYHall = []
      while (currentRoomCount < playingfield.max_rooms) {

        let room = this.roomCreator();
        let roomX = 0;
        let roomY = 0;

        //create the first room
        if (fieldRooms.length === 0) {

          roomX = this.generateRandom((playingfield.width * 0.25), ((playingfield.width * 0.75) - room.width - 1));
          roomY = this.generateRandom((playingfield.height * 0.25), ((playingfield.height * 0.75) - room.height - 1));
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
          this.matchingNumbers([
            roomX, roomX + room.width - 1
          ], [
            roomY, roomY + room.height - 1
          ]);
          currentRoomCount++

        } else {
          //create other rooms
          const roomOrder = this.shuffleArray();
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
                roomX = this.generateRandom(minX, maxX);
                roomSide = 1;
                break;
              case 2: //right
                roomY = this.generateRandom(minY, maxY);
                roomX = previousRoom.coordX[1] + 2;
                roomSide = 2;
                break;
              case 3: //bottom
                roomY = previousRoom.coordY[1] + 2;
                roomX = this.generateRandom(minX, maxX);
                roomSide = 3;
                break;
              case 4: //left
                roomY = this.generateRandom(minY, maxY);
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
                if (!this.matchingNumbers(coordX, coordY, fieldRooms)) {

                  fieldRooms.push({
                    coordX,
                    coordY,
                    roomNumber: fieldRooms[fieldRooms.length - 1].roomNumber + 1,
                    halls: this.generateRandom(1, 4)
                  });

                  //Bijbehorende hall plaatsing

                  switch (roomSide) {
                    case 1: //top
                      coordXHall = this.generateHall(previousRoom.coordX, coordX);
                      coordYHall = coordY[1] + 1;
                      break;
                    case 2: //right
                      coordXHall = coordX[0] - 1;
                      coordYHall = this.generateHall(previousRoom.coordY, coordY);
                      break;
                    case 3: //bottom
                      coordXHall = this.generateHall(previousRoom.coordX, coordX);
                      coordYHall = coordY[0] - 1;
                      break;
                    case 4: //left
                      coordXHall = coordX[1] + 1;
                      coordYHall = this.generateHall(previousRoom.coordY, coordY);
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
      callbackHalls(fieldHalls)
      callbackRooms(fieldRooms)

    }

    generateRandom(min, max) {
      return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    generateHall(oldRoom, newRoom) {
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
      return this.generateRandom(minCoord, maxCoord)
    }

    roomCreator() {
      const {
        playingfield
      } = this.props.state;
      const minSize = playingfield.roomSizeMin;
      const maxSize = playingfield.roomSizeMax;
      const maxHalls = this.generateRandom(1, 4);
      const height = this.generateRandom(minSize, maxSize);
      const width = this.generateRandom(minSize, maxSize);

      return {
        width,
        height,
        maxHalls
      };

    }

    updatePlayingField() {

      const {
        playerState
      } = this.props.state;
      const playerX = playerState.location[0];
      const playerY = playerState.location[1];
      let newBoard = this.state.playingfieldboard;
      newBoard[playerY][playerX] = PLAYER
      this.setState({
        playingfieldboard: newBoard
      })
      console.log(newBoard);


    }


    genField() {
      /*
            const {playerState, playingfield} = this.props.state;
            const height = playingfield.height;
            const width = playingfield.width;
            const playerX = playerState.location[0];
            const playerY = playerState.location[1];
            let visibleField = [];
            for (let i = 1; i <= height; i++) {
              let row = []
              for (let ii = 1; ii <= width; ii++) {
                if (i === playerY && ii === playerX) {
                  row.push("player");
                } else {
                  row.push("empty");
                }
              }
              visibleField.push(row)
            }
            this.setState({visibleField})*/
      const {
        playerState
      } = this.props.state;
      const playerX = playerState.location[0];
      const playerY = playerState.location[1];
      let newBoard = this.state.playingfieldboard;
      newBoard[playerY][playerX] = PLAYER
      this.setState({
        playingfieldboard: newBoard
      })
      console.log(newBoard);

    }

    renderField() {

        return this.state.playingfieldboard.map((item) => {
            return ( < div className = "row" > {
                item.map((col) => {
                    return ( < div className = {
                        "col " + col[0]
                      }
                      / > );
                    })
                } <
                /div>
              )
            })

        }

        test(e) {
          switch (e.keyCode) {
            case 87:
            case 38:
              this.props.movePlayer(0, -1);
              break;
            case 83:
            case 40:
              this.props.movePlayer(0, 1);
              break;
            case 65:
            case 37:
              this.props.movePlayer(-1, 0);
              break;
            case 68:
            case 39:
              this.props.movePlayer(1, 0);
              break;
            default:
              //this.roomCreator();
          }
          this.updatePlayingField();

        }

        shuffleArray() {
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
        matchingNumbers(a, b, rooms) {
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



        render() {

          return ( < div > {
              this.renderField()
            } <
            /div>)
          }

        }

        export default MainApp;
