import React, { useState, useEffect } from 'react'
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
const hodlFarmAddress = '0xF065ad676D1867E230361561aAF0B1e6EE1d5C22'
const hodlTokenAddress = '0x9C5A3e42CFc5eB4330B78257E30987703A2f1eeb'
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
    } = useUser();

    //fetching contract context
    const {
        setNetwork,
    } = useContract();


    const loadUser = async() => {
        let accounts = await web3.eth.getAccounts()
        let account = accounts[0]
        return account
    }


    const loadNetwork = async() => {
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
    }

    const loadDaiBalance = async(usr) => {
        let bal = await dai.methods.balanceOf(usr.toString()).call()
        setDaiBalance(fromWei(bal))
    }

    const loadStakingBalance = async(usr) => {
        let bal = await hodlFarm.methods.stakingBalance(usr.toString()).call()
        setStakingBalance(fromWei(bal))
    }

    const componentDidMount = async() => {
        loadUser().then(response => {
            setUserAddress(response)
            loadDaiBalance(response)
            loadStakingBalance(response)
        })
        await loadNetwork()
    }


    useEffect(() => {
        if(userAddress === ''){
            componentDidMount()
        }
    }, [userAddress, componentDidMount])




/*
    useEffect(() => {
        if(userAddress === ''){
            loadUser().then(response => {
                setUserAddress(response)
                loadDaiBalance(response)
                loadStakingBalance(response)
            })
        loadNetwork()
        }
    }, [userAddress, network, stakingBalance])
*/

    //
    //contract functions
    //

    const stake = async(x) => {
        let utils = { from: userAddress }
        let bal = toWei(x)
        await dai.methods.approve(hodlFarmAddress, bal).send(utils)
        await hodlFarm.methods.stake(bal).send(utils)
    }




    return (
        <div>
            <NavBar/>
            <Container>
                <Boxes>
                    <StakeBox  stake={stake}/>
                    <YieldBox /> 
                </Boxes>
            </Container>
        </div>
    )
}
