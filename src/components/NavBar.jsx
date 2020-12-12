import React from 'react'
import styled from 'styled-components'

const Bar = styled.nav`
    width: 100%;
    height: 8rem;
    background-color: grey;
    opacity: 0.75;
`;

const Title = styled.span`
    color: black;
    display: flex;
    justify-content: center;
    font-size: 3rem;
`;

const Address = styled.span`
    color: white;
    font-size: 1.2rem;
    display: flex;
    justify-content: flex-start;
    margin-left: 1rem;
    background-color: black;
`;

const Network = styled(Address)`
    margin-left: 0;
    margin-right: 1rem;
`;

const Adjust = styled.div`
    display: flex;
    justify-content: space-between;;
`;


export default function NavBar(props) {

    
    const userAdd = props.userAddress;
    const networkId = props.network;


    return (
        <div>
            <Bar>
                <Title>
                    Hodl Farm
                </Title>
                <Adjust>
                    <Address>
                        Farmer: {userAdd}
                    </Address>
                    <Network>
                        Network: {networkId}
                    </Network>
                </Adjust>
            </Bar>
        </div>
    )
}
