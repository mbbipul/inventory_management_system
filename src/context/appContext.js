import React from 'react'

const AppContext = React.createContext({
    purDueNumber : 0,
    salesDueNumber : 0,
    setSalesDueNumber : () => {},
    setProNumber : () => {},
});

export const AppContextProvider = AppContext.Provider
export const AppContextConsumer = AppContext.Consumer

export default AppContext;                                                                                                                                                                                                                                                                