import React, { useContext } from 'react'

export const UserContext = React.createContext({
    userAddress: '', 
    setUserAddress: () => [],
    daiBalance: '', 
    setDaiBalance: () => {},
    stakingBalance: '',
    setStakingBalance: () => {},
    isStaking: '',
    setIsStaking: () => {},
    hodlBalance: '',
    setHodlBalance: () => {},
    hodlYield: '',
    setHodlYield: () => {}
})

export const UserProvider = UserContext.Provider
export const useUser = () => useContext(UserContext)