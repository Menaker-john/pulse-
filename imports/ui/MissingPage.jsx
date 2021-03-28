import React      from 'react';
import { Button } from './components.jsx';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

export const MissingPage = () => {
  const goHome = () => {
    FlowRouter.go('/graphs');
  }
  return(
    <div style={{marginTop:'15%', marginBottom:'15%'}}>
      <center>
          <h1>404</h1> <br/>
          <p>Page Not Found</p> 
          <Button text='Home' onClick={goHome} />
      </center>
    </div>
  );
}