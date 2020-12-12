import React from 'react'
import styled from 'styled-components'

const YieldContainer = styled.div`
    background-color: green;
    width: 30rem;
    height: 20rem;
    margin-top: 2rem;
    opacity: 0.9;
    color: white;
    font-size: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const WithdrawButton = styled.button`
    width: 15rem;
    height: 5rem;
    margin-top: 1rem;
    font-size: 2rem;
`;

const Center = styled.div`
    margin-top: 2rem;
`;

export default function YieldBox() {
    return (
        <div>
            <YieldContainer>
                <Center>
                    Hodl Balance: 0.00
                    <div/>
                    Hodl Yield: 0.00
                    <div/>
                    <WithdrawButton>
                        Withdraw
                    </WithdrawButton>
                </Center>
            </YieldContainer>
        </div>
    )
}
