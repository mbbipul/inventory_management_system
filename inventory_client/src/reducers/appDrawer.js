const isAppDrawerSideExtend = (state = true , action ) => {
    switch(action.type) {
        case 'OPEN' :
            return !state;
        case 'CLOSE' :
            return !state;
        default :
            return state;

    }
}

export default isAppDrawerSideExtend;