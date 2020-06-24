import {combineReducers} from 'redux';
import isAppDrawerSideExtend from './appDrawer';

const reducers = combineReducers({
    isSideBarExtend : isAppDrawerSideExtend
});

export default reducers;