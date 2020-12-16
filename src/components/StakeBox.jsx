import React, { useState } from 'react'
import styled from 'styled-components'

import { useUser } from '../context/UserContext'

const StakeContainer = styled.div`
    background-color: #654321;
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

const StakeInput = styled.input`
    height: 2.6rem;
    width: 10rem;
    margin-top: .9rem;
`;

const StakeButton = styled.button`
    width: 7rem;
    height: 3rem;
    margin-top: 1rem;
    background-color: green;
    color: white;
    font-size: 1.4rem;
`;

const Center = styled.div`
    margin-top: 2rem;
`;

const Div = styled.div`
    display: flex;
    align-items: center;
`;

const UnstakeButton = styled(StakeButton)``;

export default function StakeBox(props) {

    const {
        daiBalance,
        stakingBalance,
    } = useUser()

    
    const [ stakeAmount, setStakeAmount ] = useState('');


    const stake = async() => {
        props.stake(stakeAmount)
    }

    const handleStake = (event) => {
        setStakeAmount(event.target.value)
    }

    const unstake = () => {
        props.unstake()
    }

    return (
        <div>
            <StakeContainer>
                <Center>
                    Staked Balance: {stakingBalance}
                    <div/>
                    Dai Balance: {daiBalance}
                    <Div>
                        <div>
                        <StakeInput onChange={handleStake} placeholder="Enter amount..."/>
                        </div>
                        <div>
                        <StakeButton onClick={stake}>
                            Stake
                        </StakeButton>
                        </div>
                    </Div>
                    <UnstakeButton onClick={unstake}>
                        Unstake
                    </UnstakeButton>
                </Center>
            </StakeContainer>
        </div>
    )
}
