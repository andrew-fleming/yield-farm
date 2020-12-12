import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'

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
const hodlFarmAddress = '0xB0eDd09F92a1F2410e9e03631Aa318eD99f8eEDf'
const hodlTokenAddress = '0x840A645a86ad7Ec5d782895b5064868Fb4f92B4e'
const daiAddress = '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
const dai = new web3.eth.Contract(Dai.abi, daiAddress)
const hodlToken = new web3.eth.Contract(HodlToken.abi, hodlTokenAddress)
const hodlFarm = new web3.eth.Contract(HodlFarm.abi, hodlFarmAddress)

//
//token function to convert wei to eth
//

const tokens = (n) => {
    return web3.utils.toWei(n, 'ether')
}


export default function Main() {

    const [ userAddress, setUserAddress ] = useState('');
    const [ network, setNetwork ] = useState('');
    const [ daiBalance, setDaiBalance ] = useState('');




    const loadUser = async() => {
        let user = await web3.eth.getAccounts()
        return user
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

    const loadDaiBalance = async(user) => {
        let bal = await dai.methods.balanceOf(user).call()
        console.log(bal)
    }


    useEffect(() => {
        if(userAddress === ''){
            loadUser().then(response => {
                setUserAddress(response)
                loadDaiBalance(response)
            })
        loadNetwork()
        }
    }, [userAddress, network])


    return (
        <div>
            <NavBar userAddress={userAddress} network={network}/>
            <Container>
                <Boxes>
                    <StakeBox/>
                    <YieldBox/> 
                </Boxes>
            </Container>
        </div>
    )
}
