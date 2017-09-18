import mainApp from '../components/mainApp';
import {connect} from 'react-redux';
import {movePlayer, addRoom} from '../actions'


const mapStateToProps = (state) => {

  return {state}
}
const MainContainer = connect(mapStateToProps,{movePlayer, addRoom})(mainApp);

export default MainContainer;
