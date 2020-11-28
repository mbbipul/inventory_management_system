const extendAppDrawerSideBar = () => {
    return {
        type : 'OPEN'
    };
};
const collapseAppDrawerSideBar = () => {
    return {
        type : 'CLOSE'
    };
};
export  {extendAppDrawerSideBar,collapseAppDrawerSideBar};