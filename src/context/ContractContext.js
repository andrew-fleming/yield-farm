import React, { useContext } from 'react'

export const ContractContext = React.createContext({
    hodlFarmAddress: '',
    setHodlFarmAddress: () => {},
    hodlTokenAddress: '',
    setHodlTokenAddress: () => {},
    daiAddress: '',
    setDaiAddress: () => {},
    hodlFarm: '',
    setHodlFarm: () => {},
    hodlToken: '',
    setHodlToken: () => {},
    dai: '',
    setDai: () => {},
    hodlFarmBalance: '',
    setHodlFarmBalance: () => {},
    network: '',
    setNetwork: () => {},
    web3: '',
    setWeb3: () => {}
})

export const ContractProvider = ContractContext.Provider
export const useContract = () => useContext(ContractContext)