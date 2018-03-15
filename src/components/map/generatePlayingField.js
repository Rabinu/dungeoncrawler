import placeRooms from './placeRooms'

export default function genPlayingfield(state) {

  const {
    playerState,
    playingfield
  } = state;
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
  const generatedRooms = placeRooms(state);

generatedRooms.fieldRooms.map(room => {
for (let h = room.coordY[0]; h <= room.coordY[1]; h++) {
  for (let w = room.coordX[0]; w <= room.coordX[1]; w++) {
    playingfieldboard[h][w] = [ROOM];
  }
}
})

generatedRooms.fieldHalls.map(hall => {
playingfieldboard[hall[1]][hall[0]] = [HALL];
})

  playingfieldboard[playerState.location[1]][playerState.location[0]].unshift(PLAYER);
  this.setState({
    playingfieldboard
  })

}
