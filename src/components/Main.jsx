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


/**
 * @notice The contract variables are declared.
 */

const web3 = new Web3(Web3.givenProvider)
const hodlFarmAddress = '0xb3A7bC3fB20c289311e91dfE778d16590884e6F9'
const hodlTokenAddress = '0xec1285C81Ef9d039A46896e09f8f29dEb7d0556e'
const daiAddress = '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
const dai = new web3.eth.Contract(Dai.abi, daiAddress)
const hodlToken = new web3.eth.Contract(HodlToken.abi, hodlTokenAddress)
const hodlFarm = new web3.eth.Contract(HodlFarm.abi, hodlFarmAddress)


/**
 * @notice These functions convert to/from wei from/to eth.
 * @param {*} n This is the number to convert.
 */

const toWei = (n) => {
    return web3.utils.toWei(n, 'ether')
}

const fromWei = (n) => {
    return web3.utils.fromWei(n, 'ether')
}


export default function Main() {


    /**
     * @notice This lists the dApp's state fetched from useContext.
     *         The UserContext is declared first.
     */
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

    /**
     * @notice The following declares the ContractContext.
     */
    
    const {
        setNetwork,
        sentStake,
        setSentStake,
        sentUnstake,
        setSentUnstake,
        sentWithdrawal,
        setSentWithdrawal
    } = useContract();


    /**
     * @notice The following functions are used for fetching both user
     *         and contract data. These functions are read-only regarding 
     *         the blockchain.
     */

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
        if ( bal > 0){
            return true
        } else {
            return false
        }
    }, [setStakingBalance])

/**
 * @notice This function fetches the current yield accrued by user's stake.
 * @dev    This operates almost exactly as in the Solidity contract for 
 *         withdrawing yield. First, we fetch the number of minutes staked. Then,
 *         it saves the quotient of dividing the product (staking balance times 
 *         the number of minutes) by 100 (creating 1% of staked balance per minute).
 * 
 *          Before adding the initYield with the savedYield, they're both multiplied
 *          by one. This turns the string balances into numbers; otherwise, they concatenate.
 */
    const loadHodlYield = useCallback(async(usr) => {
        let numOfMinutes = await hodlFarm.methods.calculateYieldTime(usr).call()
        let initYield = ((stakingBalance * numOfMinutes) / 100)
        let savedYield = await hodlFarm.methods.hodlBalance(usr).call()

        let balA = (initYield)*1      //These variables convert the fetched strings into numbers
        let balB = (fromWei(savedYield))*1
        let totalYield = (balA + balB)

        return(parseFloat(totalYield).toString())
    }, [stakingBalance])


    const loadHodlBalance = useCallback(async(usr) => {
        let bal = await hodlToken.methods.balanceOf(usr).call()
        return(fromWei(bal))
    }, [])



    /**
     * @notice The componentDidMount function initializes all of the previous
     *         functions for the useEffect hook.
     */

    const componentDidMount = useCallback(async() => {
        await loadNetwork()
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

    /**
     * @notice This useEffect hook fetches the side effects of the loadHodlYield
     *         function in order to display the user's current yield.
     */

    useEffect(() => {
        if(stakingBalance > 0 || userAddress !== ''){
            loadHodlYield(userAddress).then(response => {
                setHodlYield(response)
            })
        }
    }, [userAddress, stakingBalance, hodlYield, isStaking, setHodlYield, loadHodlYield, setIsStaking])

    /**
     * @notice This useEffect creates a 60 second timer when the staking mechanism
     *          is triggered.
     */
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

   /**
    * @notice The following functions write to the smart contract.
    * 
    * 
    * @notice This function locks up ('stakes') Dai in the contract.
    * @dev    The sentStake, sentUnstake, and sentWithdrawal boolean values 
    *         are used as signals for the useEffect hook. Instead of setting
    *         their default value to false, they're triggered to false in the
    *         beginning of the function call. Upon receipt, they're switched to 
    *         'on.'
    * @param {*This is the amount of Dai to stake in the contract.} x 
    */

    const stake = async(x) => {
        setSentStake(false)
        let utils = { from: userAddress }
        let bal = toWei(x)
        await dai.methods.approve(hodlFarmAddress, bal).send(utils)
        await hodlFarm.methods.stake(bal).send(utils)
        .on('receipt', function(receipt){
            console.log(receipt)
            setSentStake(true)
        })
        setIsStaking(true)
    }

    const unstake = async() => {
        setSentUnstake(false)
        let utils = { from: userAddress }
        await hodlFarm.methods.unstake().send(utils)
        .on('receipt', function(receipt){
            console.log(receipt)
            setSentUnstake(true)
        })
        setIsStaking(false)
    }

    const withdrawYield = async() => {
        setSentWithdrawal(false)
        let utils = { from: userAddress }
        await hodlFarm.methods.withdrawYield().send(utils)
        .on('receipt', function(receipt){
            console.log(receipt)
            setSentWithdrawal(true)
        })
    }


    //
    //waiting to fetch new balance after function call
    //

    //for dai

    /**
     * @notice These useEffect hooks are triggered by the preceding functions.
     *         The former hook fetches the Dai balances (Dai balance and stakingBalance).
     *         The latter effect fetches the hodlToken balance and current yield.
     */

    useEffect(() => {
        if(sentStake || sentUnstake){
            loadDaiBalance(userAddress)
            loadStakingBalance(userAddress)
        }
    }, [sentStake, sentUnstake, userAddress, loadDaiBalance, loadStakingBalance])


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
