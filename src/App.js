import React, { useState } from 'react'
import Main from './components/Main'
import styled from 'styled-components'
import grass from './grass.jpg'

import { UserProvider } from './context/UserContext'
import { ContractProvider } from './context/ContractContext'

const Img = styled.div`
  border: 1px solid #000;
  background-image: url(${grass});
  width: 99/8%;
  height: 755px;
  opacity: 0.7;
`;

function App() {

  //user state
  const [ userAddress, setUserAddress ] = useState('');
  const [ daiBalance, setDaiBalance ] = useState('');
  const [ stakingBalance, setStakingBalance ] = useState('');
  const [ isStaking, setIsStaking ] = useState('');
  const [ hodlBalance, setHodlBalance ] = useState('');
  const [ hodlYield, setHodlYield ] = useState('');


  const userState = {
    userAddress,
    setUserAddress,
    daiBalance,
    setDaiBalance,
    stakingBalance,
    setStakingBalance,
    isStaking,
    setIsStaking,
    hodlBalance,
    setHodlBalance,
    hodlYield,
    setHodlYield,
  }


  //contract state
  const [ hodlFarmAddress, setHodlFarmAddress ] = useState('');
  const [ hodlTokenAddress, setHodlTokenAddress ] = useState('');
  const [ daiAddress, setDaiAddress ] = useState('');
  const [ hodlFarm, setHodlFarm ] = useState('');
  const [ hodlToken, setHodlToken ] = useState('');
  const [ dai, setDai ] = useState('');
  const [ hodlFarmBalance, setHodlFarmBalance ] = useState('');
  const [ network, setNetwork ] = useState('');
  const [ web3, setWeb3 ] = useState('');
  //calls to update balances
  const [ sentStake, setSentStake ] = useState('');
  const [ sentUnstake, setSentUnstake ] = useState('');
  const [ sentWithdrawal, setSentWithdrawal ] = useState('');


  const contractState = {
    hodlFarmAddress,
    setHodlFarmAddress,
    hodlTokenAddress,
    setHodlTokenAddress,
    daiAddress,
    setDaiAddress,
    hodlFarm,
    setHodlFarm,
    hodlToken,
    setHodlToken,
    dai,
    setDai,
    hodlFarmBalance,
    setHodlFarmBalance,
    network,
    setNetwork,
    web3,
    setWeb3,
    //calls to update balances
    sentStake,
    setSentStake,
    sentUnstake,
    setSentUnstake,
    sentWithdrawal,
    setSentWithdrawal
  }




  return (
    <Img>
      <UserProvider value={userState}>
        <ContractProvider value={contractState}>
          <Main/>
        </ContractProvider>
      </UserProvider>
    </Img>
  )
}

export default App;

