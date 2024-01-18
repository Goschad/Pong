import React,{useRef, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import pong from './Components/pong';

function App() {

  const canvaRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    pong(canvaRef.current);
  },[]);


  
  return (
    <div className="App">
      <canvas ref={canvaRef} id="canva" height={650} width={720}></canvas>
    </div>
  );
}

export default App;
