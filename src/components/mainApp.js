import React from 'react';
import {WALL, HALL, ROOM, PLAYER} from '../constants'
import placeRooms from './map/placeRooms'

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleField: [],
      playingfieldboard: []
    }
  }

  componentDidMount() {
    this.genPlayingfield();
    document.addEventListener("keydown", this.movePlayerBoard.bind(this));
  }

  genPlayingfield() {
    const {playerState, playingfield} = this.props.state;
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
    const generatedRooms = placeRooms(this.props.state);
    console.log(generatedRooms)
    generatedRooms.fieldRooms.map(room => {
      for (let h = room.coordY[0]; h <= room.coordY[1]; h++) {
        for (let w = room.coordX[0]; w <= room.coordX[1]; w++) {
          playingfieldboard[h][w] = [ROOM, room.roomNumber];
        }
      }
    })

    generatedRooms.fieldHalls.map(hall => {
      playingfieldboard[hall[1]][hall[0]] = [HALL];
    })

    playingfieldboard[playerState.location[1]][playerState.location[0]].unshift(PLAYER);
    this.setState({playingfieldboard})

  }

  updatePlayingField(oldLocation) {

    const {playerState} = this.props.state;
    const playerX = playerState.location[0];
    const playerY = playerState.location[1];
    let newBoard = this.state.playingfieldboard;
    newBoard[playerY][playerX].unshift(PLAYER);
    newBoard[oldLocation[1]][oldLocation[0]].shift();
    this.setState({playingfieldboard: newBoard})
  }

  renderField() {
    return this.state.playingfieldboard.map((item) => {
      return (<div className="row">
        {
          item.map((col) => {
            return (
              <div className={"col " + col[0]}>  {Number.isInteger(col[col.length-1])?col[col.length-1]:null}</div>
            );
          })
        }
    </div>)
    })
  }

  movePlayerBoard(e) {
    let oldLocation = this.props.state.playerState.location;
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
    this.updatePlayingField(oldLocation);
  }

  render() {

    return (< div > {
      this.renderField()
    } < /div>)
          }

        }

        export default MainApp;
