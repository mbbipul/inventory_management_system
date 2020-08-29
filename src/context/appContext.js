import React from 'react'

const PurcDueProContext = React.createContext({
    proNumber : 0,
    setProNumber : () => {},
});

export const PurcDueProProvider = PurcDueProContext.Provider
export const PurcDueProConsumer = PurcDueProContext.Consumer

export default PurcDueProContext;                                                                                                                                                                                                                                                                