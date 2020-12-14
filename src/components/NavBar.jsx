import React from 'react'
import styled from 'styled-components'
import Farmer from '../Farmer.png'

import { useUser } from '../context/UserContext'
import { useContract } from '../context/ContractContext'

const Bar = styled.nav`
    width: 100%;
    height: 8rem;
    background-color: grey;
    opacity: 0.75;
`;

const Title = styled.span`
    color: black;
    font-size: 4rem;
    text-shadow: 2px 2px #999999;
    margin-top: 1rem;
`;

const Address = styled.span`
    color: white;
    font-size: 1.4rem;

    display: flex;
    justify-content: center;
    align-self: flex-end;
`;

const Network = styled(Address)`
    margin-left: 0;
    margin-right: 2rem;
`;

const Adjust = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

const Img = styled.img`
    position: relative;
    width: 2.3rem;
    height: 2.1rem;
    margin-right: .8rem;
`;


export default function NavBar() {

    //user context
    const {
        userAddress
    } = useUser()

    //contract context
    const {
        network
    } = useContract()

    //cut out middle of address
    const addr = userAddress.slice(0, 5) + '...' + userAddress.slice(38, 42)


    return (
        <div>
            <Bar>
                <Adjust>
                    <Address>
                        <Img src={Farmer} />
                        Farmer: {addr}
                    </Address>
                    <Title>
                        Hodl Farm
                    </Title>
                    <Network>
                        Network: {network}
                    </Network>
                </Adjust>
            </Bar>
        </div>
    )
}
