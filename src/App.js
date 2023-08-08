import React,{Component} from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';



const initialState={
  input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn:false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joindate:''

}
}
class App extends Component{
  constructor(){
    super();
    this.state=initialState;
    
  }

loadUser = (data) => {
  this.setState({user:{
       id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joindate:data.joindate

  }})


}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image=document.getElementById('inputimage');
  const width=Number(image.width);
  const height=Number(image.height);
  return{
     leftCol: clarifaiFace.left_col*width,
     topRow: clarifaiFace.top_row*height,
     rightCol: width - (clarifaiFace.right_col*width),
     bottomRow: height - (clarifaiFace.bottom_row*height)
    
  }
}
displayFaceBox =(box) =>{
 
   this.setState({box:box});


}
  onInputChange=(event) => {
  this.setState({input:event.target.value});
  }
  onButtonSubmit=() => {
  this.setState({imageUrl: this.state.input});
    fetch('https://smartbrainbackend-viuj.onrender.com/imageurl',{
      method: 'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
      input:this.state.input
      })

     })
      .then(response => response.json())
      .then (response => {
      if (response) {
        fetch('https://smartbrainbackend-viuj.onrender.com/image',{
          method: 'put',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
          id:this.state.user.id

        })
      })
      .then (response => response.json())
      .then (count => {
        this.setState(Object.assign(this.state.user, {entries:count}))
      })
      .catch(console.log)
        
      }
    this.displayFaceBox(this.calculateFaceLocation(response))
     })

    
     .catch(error => console.log('error', error));

    
   
}
onRouteChange = (route) => { 
  if (route === 'signout'){
    this.setState(initialState)
  }else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
this.setState({route: route});

}

render(){
  const {route,box,imageUrl,isSignedIn}=this.state;
  return(
     <div className="App">
      <ParticlesBg className='particles' num={50} type="cobweb" bg={true} />
       <Navigation  isSignnedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
       {route==='home'
          ?<div>
          <Logo />
          <Rank
          name ={this.state.user.name}
          entries={this.state.user.entries}
          />
          <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition box= {box} imageUrl={imageUrl}/>
      </div>
          :(
           route ==='signin'
             ?<SignIn  loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            
          )
      }
      </div>
  );
}
}

export default App;