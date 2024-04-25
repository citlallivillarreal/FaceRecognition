import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '', 
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    enteries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '', 
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        enteries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      enteries: data.enteries,
      joined: data.joined
    }})
  }
  calculateFaceLocation = (data) => {
    const regions = data.outputs[0].data.regions[0];
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const boundingBox = regions.region_info.bounding_box;
    return {
      leftCol: boundingBox.left_col.toFixed(3) * width,
      topRow: boundingBox.top_row.toFixed(3) * height, 
      rightCol: width - (boundingBox.right_col.toFixed(3) * width),
      bottomRow: height - (boundingBox.bottom_row.toFixed(3) * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
        fetch('http://localhost:3000/imageurl', {
          method: 'post',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            this.displayFaceBox(this.calculateFaceLocation(result));
            if (result) {
              fetch('http://localhost:3000/image', {
                method: 'put',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                  id: this.state.user.id
                })
              }).then(response => response.json())
                .then(count => {
                  this.setState(Object.assign(this.state.user, {enteries:count}))
                })
                .catch(console.log)
            }
        })
        .catch(error => console.log('error', error));
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route })
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state; 
    return (
      <div className="App">
        <ParticlesBg className='particles' type="cobweb" bg={true} num={350} color="#ffffff"/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div> 
              <Logo />
              <Rank name={this.state.user.name} enteries={this.state.user.enteries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />    
              <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          : (     
            route === 'signin'     
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />


          )
      }
      </div>
    );
  }
}

export default App;
