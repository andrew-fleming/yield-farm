import React from 'react'
import Main from './components/Main'
import styled from 'styled-components'
import grass from './grass.jpg'

const Img = styled.div`
  border: 1px solid #000;
  background-image: url(${grass});
  width: 99/8%;
  height: 755px;
  opacity: 0.7;
`;

function App() {
  return (
    <div>
      <Img>
        <Main/>
      </Img>
    </div>
  )
}

export default App;

