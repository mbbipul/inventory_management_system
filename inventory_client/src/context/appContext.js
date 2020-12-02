import React from 'react'

const AppContext = React.createContext({
    purDueNumber : 0,
    salesDueNumber : 0,
    purPaymentDue : 0,
    salesPaymentDue : 0,
    isUserLoggedIn : false,
    user : {},
    appInfo : {},

    setSalesDueNumber : () => {},
    setProNumber : () => {},
    setPurPaymentDue : () => {},
    setSalesPaymentDue : () => {},
    setUserLoginStatus : () => {},
    setUser : () => {},
    setAppInfo : () => {}
});

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;

export default AppContext;                                                                                                                                                                                                                                                                