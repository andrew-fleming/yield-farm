import React from 'react'
import styled from 'styled-components'

const Bar = styled.nav`
    width: 100%;
    height: 8rem;
    background-color: grey;
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
    margin-left: .5rem;
`;

const Adjust = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

//const userAdd = '0x01...2345';

export default function NavBar() {

    const userAdd = '0x01...2345';


    return (
        <div>
            <Bar>
                <Title>
                    Hodl Farm
                </Title>
                <Adjust>
                    <Address>
                        User: {userAdd}
                    </Address>
                </Adjust>
            </Bar>
        </div>
    )
}
