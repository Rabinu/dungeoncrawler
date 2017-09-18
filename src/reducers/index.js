import {combineReducers} from 'redux'
import playerState from './playerState';
import playingfield from './playingfield';

const rootReducer = combineReducers({
  playingfield,
  playerState
});

export default rootReducer;
