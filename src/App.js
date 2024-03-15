import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';


function App() {
  return (
    <div className="App">
      <ParticlesBg className='particles' type="cobweb" bg={true} num={350} color="#ffffff"/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
{/* {      
      <FaceRecognition />} */}
    </div>
  );
}

export default App;
