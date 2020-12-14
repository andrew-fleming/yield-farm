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
    setWeb3: () => {},
    //calls to update balances
    sentStake: '',
    setSentStake: () => {},
    sentUnstake: '',
    setSentUnstake: () => {},
    sentWithdrawal: '',
    setSentWithdrawal: () => {}
})

export const ContractProvider = ContractContext.Provider
export const useContract = () => useContext(ContractContext)