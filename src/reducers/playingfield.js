import { playingfieldInit } from '../initialState';
import {ADD_ROOM} from '../constants';

const playingfield = (state = playingfieldInit, action) => {
  switch (action.type) {
    case ADD_ROOM:
      const {rooms} = state;
      const {coordX,coordY,max_hall} = action;
      let roomNumber = 0;
      rooms.length === 0 ? roomNumber = 1 : roomNumber = rooms[rooms.length - 1].roomNumber + 1;
      return {
        ...state,
         rooms:[
           ...state.rooms,
           {
             roomNumber,
             coordX,
             coordY,
             max_hall
           }
         ]
      }
      //return {...state, state.room.push}
    default:
      return state
  }
}

export default playingfield;
