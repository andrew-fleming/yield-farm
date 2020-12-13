import React, { useState } from 'react'
import styled from 'styled-components'

import { useUser } from '../context/UserContext'

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

export default function StakeBox(props) {

    //user context
    const {
        daiBalance,
        stakingBalance
    } = useUser()

    const [ stakeAmount, setStakeAmount ] = useState('');

    //reiterate stake()
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
                    <div>
                    <StakeForm onChange={handleStake}/>
                    <StakeButton onClick={stake}>
                        Stake
                    </StakeButton>
                    </div>
                    <UnstakeButton onClick={unstake}>
                        Unstake
                    </UnstakeButton>
                </Center>
            </StakeContainer>
        </div>
    )
}
