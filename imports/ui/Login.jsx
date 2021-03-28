
import React          from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {PasswordInput, FormError, FormPassword, Button, UsernameInput }
from '/imports/ui/components.jsx';

export default class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username:'',
      password:'',
      message: '',
    };
  }
  handleKeyDown(event) {
    if(event.keyCode === 13){
      event.preventDefault();
      this.login();
    }
  }

  onChangeUser(e){
    this.setState({username: e.target.value});
  }
  onChangePassword(e){
    this.setState({password: e.target.value});
  }

  render(){
    const { message, username, password } = this.state;
    const keyProps =  {onKeyDown: (event) => { this.handleKeyDown(event) } }
    return(
      <center>
        <div style={{paddingTop:'15px',width:'500px'}}>
            <fieldset>
              <legend>Login</legend>
    
              <UsernameInput {...keyProps} placeholder="Username"
              onChange={this.onChangeUser.bind(this)}
              />
              <PasswordInput {...keyProps} placeholder="Password"
              onChange={this.onChangePassword.bind(this)}/>
    
              <FormError message={message} /><br />
              <Button text='Login' onClick={this.login.bind(this)} />
            </fieldset>
        </div>
      </center>
    );
  }

  login(){
    const {username, password} = this.state;
    if(username && password){
      Meteor.loginWithPassword(username, password, (err, res) => {
        if(err){
          this.setState({username, message:err.reason});
        }else{
          FlowRouter.go('/');
        }
      }); 
    }else{
      this.setState({message:'No User Information'});
    }
  }
};