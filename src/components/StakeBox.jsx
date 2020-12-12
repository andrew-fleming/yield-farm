import React from 'react'
import styled from 'styled-components'

const StakeContainer = styled.div`
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

const StakeForm = styled.input`
    height: 2rem;
`;

const StakeButton = styled.button`
    width: 5rem;
    height: 2.5rem;
    margin-top: 1rem;
`;

const Center = styled.div`
    margin-top: 2rem;
`;

const UnstakeButton = styled(StakeButton)``;

export default function StakeBox() {

    const stakedBalance = '0.00'


    return (
        <div>
            <StakeContainer>
                <Center>
                    Staked Balance: {stakedBalance}
                    <div/>
                    Dai Balance: 0.00
                    <div>
                    <StakeForm/>
                    <StakeButton>
                        Stake
                    </StakeButton>
                    </div>
                    <UnstakeButton>
                        Unstake
                    </UnstakeButton>
                </Center>
            </StakeContainer>
        </div>
    )
}
