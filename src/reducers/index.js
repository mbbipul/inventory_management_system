import isAppDrawerSideExtend from './appDrawer';
import {combineReducers} from 'redux';

const reducers = combineReducers({
    isSideBarExtend : isAppDrawerSideExtend
});

export default reducers;