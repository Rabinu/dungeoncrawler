import {playerStateInit} from '../initialState';
import {MOVE_PLAYER} from '../constants';


const playerState = (state = playerStateInit, action) => {
  switch (action.type){
    case MOVE_PLAYER:

      const directionX = action.direction[0];
      const directionY = action.direction[1];
      const newPostion = [state.location[0]+directionX,state.location[1]+directionY]
      return {
        ...state, location:newPostion
      }
      default:
        return state
  }
}


export default playerState;
