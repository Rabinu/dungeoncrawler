import React from 'react';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleField: [],
      playingfieldboard: [],
      rooms: []
    }

  }

  componentDidMount() {

    this.genPlayingfield();
    document.addEventListener("keydown", this.test.bind(this));
  }

  genPlayingfield() {
    const {playerState, playingfield} = this.props.state;
    const height = playingfield.height;
    const width = playingfield.width;

    let playingfieldboard = [];

    const startroom = this.roomCreator();
    const startroomX = this.generateRandom(0, (width - startroom.width));
    const startroomY = this.generateRandom(0, (height - startroom.height));

    const coordStartroom =     {
          roomNumber:1,
          coordX:[startroomX,startroomX+startroom.width-1],
          coordY:[startroomY,startroomY+startroom.height-1],
        }





    for (let h = 0; h <= height; h++) {
      let row = [];
      for (let w = 0; w <= width; w++) {
        /*if (w >= startroomX && w < (startroomX + startroom.width) && h >= startroomY && h < (startroomY + startroom.height)) {
          row.push('room')
        } else {
          row.push('wall')
        }*/
        row.push('wall')
      }
      playingfieldboard.push(row)
    }

    //this.searchRooms(playingfieldboard)

    this.placeRooms(callback => {
      callback.map(room=>{/*
          for(let h = room.coordY[0]; h <= room.coordY[1]; h++){
            for(let w = room.coordX[0]; h <= room.coordX[1]; w++){
                playingfieldboard[h][w] = "room";
            }
          }*/
          console.log(room.coordY[0],room.coordY[1],room.coordX[0],room.coordX[1])
          for (let h = room.coordY[0]; h <= room.coordY[1]; h++){
            for(let w = room.coordX[0]; w <= room.coordX[1]; w++){
                playingfieldboard[h][w] = "room";
            }
          }


      })

      this.setState({playingfieldboard});
    });




    //generate outerwall

  }


  placeRooms(callback) {
    const {playingfield} = this.props.state;
    let currentRoomCount = 0;
    let fieldRooms = [];

    while (currentRoomCount < playingfield.max_rooms) {

      let room = this.roomCreator();
      let roomX = 0;
      let roomY = 0;

      //create the first room
      if (fieldRooms.length === 0) {
        roomX = this.generateRandom(1, (playingfield.width - room.width -1));
        roomY = this.generateRandom(1, (playingfield.height - room.height-1));
        fieldRooms.push(
          {
          coordX:[roomX,roomX+room.width-1],
          coordY:[roomY,roomY+room.height-1],
          roomNumber: 1,
          halls:this.generateRandom(1,4)
          }
        )
        currentRoomCount++
      } else {
        //create other rooms
        const roomOrder = this.shuffleArray();
        let previousRoom = fieldRooms[fieldRooms.length-1]
        let hallcount = 0

        let minX = previousRoom.coordX[0] - room.width + 1;
        minX < 0 ? minX = 0 : null;
        let maxX = previousRoom.coordX[1];
        maxX > playingfield.width ? maxX = playingfield.width : null;

        let minY = previousRoom.coordY[0] - room.height - 1;
        minY < 0 ? minY = 0 : null;
        let maxY = previousRoom.coordY[1]  + room.height;
        maxY > playingfield.height ? maxY = playingfield.height : null


        //create room around the previousroom by hallcount
        while (previousRoom.halls > hallcount){


          switch(roomOrder[hallcount]){/*
            case 1://top
              roomY = previousRoom.coordY[0]-2;
              roomX = minX//this.generateRandom(minX,maxY)

              break;
            case 2://right
              roomY = minY
              roomX = previousRoom.coordX[1]+2

              break;
            case 3://bottom
              roomY = previousRoom.coordY[0]+2;
              roomX = minX//this.generateRandom(minX,maxY)
              break;
            case 4://left
              roomY = minY;
              roomX = previousRoom.coordX[0]-2
            break;*/
            default:
              roomY = minY
              roomX = this.generateRandom(minX,maxX)

          }
          fieldRooms.push(
            {
            coordX:[roomX,roomX+room.width-1],
            coordY:[roomY,roomY+room.height-1],
            roomNumber: fieldRooms[fieldRooms.length-1].roomNumber+1,
            halls:this.generateRandom(1,4)
            }
          )

          hallcount++

          currentRoomCount++
          if (currentRoomCount === playingfield.max_rooms){
            break;
          }
        }
        hallcount = 0




        //(maxX - minX) < room.width ? console.log("to small") : console.log("okay")





      }


    }

    callback(fieldRooms)




  /*

    const startroom = this.roomCreator();
    const roomX = this.generateRandom(0, (fieldWidth - startroom.width));
    const roomY = this.generateRandom(0, (fieldHeight - startroom.height));

    this.props.addRoom(startroomX,startroomY,startroom)

    const newRoom = this.roomCreator();
    console.log(this.props.state.playingfield.rooms)
    //this.props.addRoom()
    this.props.state.playingfield.rooms.map(room => {
      console.log("test")
      console.log(room.roomNumber);
    })*/

  //const {coordX, coordY, roomNumber, max_hall} = this.props.state.playingfield.rooms
  //console.log(roomNumber, coordX, coordY, max_hall)

  }

  generateRandom(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }

  roomCreator() {
    const minSize = 5;
    const maxSize = 15;
    const max_hall = this.generateRandom(1,4);
    //console.log(max_hall)
    const height = this.generateRandom(minSize, maxSize);
    const width = this.generateRandom(minSize, maxSize);
    return {width, height, max_hall};

  }

  /*
  genField() {
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
    this.setState({visibleField})

  }*/

  renderField() {

    return this.state.playingfieldboard.map((item) => {
      return (
        <div className="row">
          {item.map((col) => {
            if (col === "room") {
              return (<div className="col room"/>)
            }
            return (<div className="col"/>)
          })}
        </div>
      )
    })
  }

  test(e) {

    /*
    let player = this.state.player;
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
        this.roomCreator();
    }
    this.genField();
*/
  }


  shuffleArray() {
    let array = [1,2,3,4]
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]]=[array[j], array[i]]
    }
    return array;
  }

  render() {

    return (
      <div>
        {this.renderField()}
      </div>
    )
  }

}

export default MainApp;
/*
const board = []

const elementsBoard = {
  cellType: ['wall,empty,item,player,enemy'],
  //
  name: '',
  stats: '',
  health: '',
  attack: ''
}*/
