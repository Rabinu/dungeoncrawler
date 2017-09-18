import {MOVE_PLAYER, ADD_ROOM} from '../constants'


export const movePlayer = (x, y) => {
  return {
    type: MOVE_PLAYER,
    direction: [x,y]
  }
}

export const addRoom = (x,y,room) => {

  return {
    type:ADD_ROOM,
    coordX:[x,x+room.width-1],
    coordY:[y,y+room.height-1],
    max_hall:room.max_hall
  }
}
