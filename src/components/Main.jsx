import React from 'react'
import styled from 'styled-components'

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

export default function Main() {
    return (
        <div>
            <NavBar/>
            <Container>
                <Boxes>
                <StakeBox/>
                <YieldBox/> 
                </Boxes>
            </Container>
        </div>
    )
}
