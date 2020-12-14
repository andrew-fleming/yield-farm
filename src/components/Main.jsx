import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'

import { useUser } from '../context/UserContext'
import { useContract } from '../context/ContractContext'

import Dai from '../abi/Dai.json'
import HodlToken from '../abi/HodlToken.json'
import HodlFarm from '../abi/HodlFarm.json'

import NavBar from './NavBar'
import StakeBox from './StakeBox'
import YieldBox from './YieldBox'


const Container = styled.div`
    margin-top: 2rem;
    width: 100%;
    height 25rem;
`;

const Boxes = styled.div`
    display: flex;
    justify-content: space-around;
`;

//
//blockchain info
//

const web3 = new Web3(Web3.givenProvider)
const hodlFarmAddress = '0x14FFB3046B74d6A2ff859F2515619F405b007F6F'
const hodlTokenAddress = '0xb72398B01cA34589C20122807899e9621723dF6a'
const daiAddress = '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
const dai = new web3.eth.Contract(Dai.abi, daiAddress)
const hodlToken = new web3.eth.Contract(HodlToken.abi, hodlTokenAddress)
const hodlFarm = new web3.eth.Contract(HodlFarm.abi, hodlFarmAddress)




//
//token function to convert wei to eth
//

const toWei = (n) => {
    return web3.utils.toWei(n, 'ether')
}

const fromWei = (n) => {
    return web3.utils.fromWei(n, 'ether')
}


export default function Main() {


    //fetching user content
    const {
        userAddress,
        setUserAddress,
        setDaiBalance,
        stakingBalance,
        setStakingBalance,
        isStaking,
        setIsStaking,
        setHodlBalance,
        setHodlYield,
        hodlYield
    } = useUser();

    //fetching contract context
    const {
        setNetwork,
        sentStake,
        setSentStake,
        sentUnstake,
        setSentUnstake,
        sentWithdrawal,
        setSentWithdrawal
    } = useContract();



    const loadUser = async() => {
        let accounts = await web3.eth.getAccounts()
        let account = accounts[0]
        return account
    }


    const loadNetwork = useCallback(async() => {
        let num = await web3.currentProvider.chainId;
        if(num === '0x1'){
            setNetwork('Mainnet')
        } else if(num === '0x3'){
            setNetwork('Ropsten')
        } else if(num === '0x4'){
            setNetwork('Rinkeby')
        } else if(num === '0x5'){
            setNetwork('Goerli')
        } else if(num === '0x2a'){
            setNetwork('Kovan')
        } else {
            setNetwork('N/A')
        }
    }, [setNetwork])


    const loadDaiBalance = useCallback(async(usr) => {
        let bal = await dai.methods.balanceOf(usr.toString()).call()
        setDaiBalance(fromWei(bal))
    }, [setDaiBalance])


    const loadStakingBalance = useCallback(async(usr) => {
        let bal = await hodlFarm.methods.stakingBalance(usr.toString()).call()
        setStakingBalance(fromWei(bal))

        //if balance greater than 0, return true
        if ( bal > 0){
            return true
        } else {
            return false
        }
    }, [setStakingBalance])


    const loadHodlYield = useCallback(async(usr) => {
        //calculate number of minutes since stake
        let num = await hodlFarm.methods.calculateYield(usr).call()
        
        //multiply minutes by balance and divide by 100 => 1% every minute
        let bal = ((stakingBalance * num) / 100)

        //fetch saved balance (if any) mapped from older staking
        let mapNum = await hodlFarm.methods.hodlBalance(usr).call()

        //convert strings into numbers so compiler does not concatenate
        let numA = (bal)*1
        let numB = (fromWei(mapNum))*1
        let totalYield = (numA + numB)

        //convert to readable/shortened form
        return(parseFloat(totalYield).toString())
    }, [stakingBalance])


    const loadHodlBalance = useCallback(async(usr) => {
        let bal = await hodlToken.methods.balanceOf(usr).call()
        return(fromWei(bal))
    }, [])



    //
    //init
    //

    const componentDidMount = useCallback(async() => {
        await loadUser().then(response => {
            setUserAddress(response)
            loadDaiBalance(response)
            loadHodlYield(response)
            loadHodlBalance(response).then(response => {
                setHodlBalance(response)
            })
            loadStakingBalance(response).then(response => {
                setIsStaking(response)
            })
        })
        await loadNetwork()
    }, [ 
        loadDaiBalance, 
        loadStakingBalance, 
        loadNetwork,
        loadHodlYield,
        loadHodlBalance,
        setUserAddress,
        setHodlBalance,
        setIsStaking,
    ])


    useEffect(() => {
        if(userAddress === ''){
            componentDidMount()
        }
    }, [userAddress, componentDidMount])





    //
    //for calculating accruing yield
    //

    useEffect(() => {
        if(stakingBalance > 0 || userAddress !== ''){
            loadHodlYield(userAddress).then(response => {
                setHodlYield(response)
            })
        }
    }, [userAddress, stakingBalance, hodlYield, isStaking, setHodlYield, loadHodlYield, setIsStaking])


    useEffect(() => {
        let interval = null
        if(isStaking){
            interval = setInterval(() => {
                loadHodlYield(userAddress).then(response => {
                    setHodlYield(response)
                })
            }, 60000)
        }
        return () => clearInterval(interval)
    }, [isStaking, userAddress, loadHodlYield, setHodlYield])







    //
    //contract functions
    //

    const stake = async(x) => {
        setSentStake(false)
        let utils = { from: userAddress }
        let bal = toWei(x)
        await dai.methods.approve(hodlFarmAddress, bal).send(utils)
        await hodlFarm.methods.stake(bal).send(utils)
        .on('receipt', function(receipt){
            console.log(receipt)

            //looks for balance change
            setSentStake(true)
        })
        //turns on the update yield timer
        setIsStaking(true)
    }

    const unstake = async() => {
        setSentUnstake(false)
        let utils = { from: userAddress }
        await hodlFarm.methods.unstake().send(utils)
        .on('receipt', function(receipt){
            console.log(receipt)

            //looks for balance change
            setSentUnstake(true)
        })
        //turns off update yield timer
        setIsStaking(false)
    }

    const withdrawYield = async() => {
        setSentWithdrawal(false)
        let utils = { from: userAddress }
        await hodlFarm.methods.withdrawYield().send(utils)
        .on('receipt', function(receipt){
            console.log(receipt)

            //looks for balance change
            setSentWithdrawal(true)
        })
    }


    //
    //waiting to fetch new balance after function call
    //

    //for dai

    useEffect(() => {
        if(sentStake || sentUnstake){
            loadDaiBalance(userAddress)
            loadStakingBalance(userAddress)
        }
    }, [sentStake, sentUnstake, userAddress, loadDaiBalance, loadStakingBalance])

    
    //for hodlToken
    useEffect(() => {
        if(sentWithdrawal){
            loadHodlBalance(userAddress)
            setHodlYield(0)
        }
    }, [sentWithdrawal, userAddress, loadHodlBalance, setHodlYield])





    return (
        <div>
            <NavBar/>
            <Container>
                <Boxes>
                    <StakeBox  
                        stake={stake} 
                        unstake={unstake}
                    />
                    <YieldBox withdrawYield={withdrawYield}/> 
                </Boxes>
            </Container>
        </div>
    )
}
