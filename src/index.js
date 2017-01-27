import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/App';
//import './index.css';

import Home from './containers/domain/Home';
import ListBox from './containers/domain/ListBox';
import SaveBox from './containers/domain/SaveBox';

import { AuthService } from "./auth/AuthService";

import LoginView from './containers/auth/LoginView';
import LogoutView from './containers/auth/LogoutView';
import SignUpView from './containers/auth/SignUpView';
import SuccessSignUpView from './containers/auth/SuccessSignUpView';
import ConfirmView from './containers/auth/ConfirmView';
import SuccessConfirmView from './containers/auth/SuccessConfirmView';

const Auth = new AuthService();

function requireAuth(nextState, replace) {
  
  Auth.userSession(function(error, session){
    if(error){      
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });      
      return;
    }
    //SESSION is Valid        
  });
}

function checkLoggedIn(nextState, replace) {   
  Auth.userSession(function(error, session){
    if(session && session.isValid()){            
      replace('/');
      return;
    }
  });
}

ReactDOM.render(
  (<Router history={browserHistory}>    
      <Route path="/" component={App} onEnter={requireAuth}>        
        <IndexRoute component={Home}/>
        <Route path="list" component={ListBox} />
        <Route path="save" component={SaveBox} />
      </Route>
      <Route path="/login" component={LoginView} onEnter={checkLoggedIn}/> 
      <Route path="/logout" component={LogoutView} />
      <Route path="/signup" component={SignUpView} onEnter={checkLoggedIn} />    
      <Route path="/success-signup" component={SuccessSignUpView} onEnter={checkLoggedIn}/>
      <Route path="/confirm" component={ConfirmView} onEnter={checkLoggedIn}/> 
      <Route path="/success-confirm" component={SuccessConfirmView} onEnter={checkLoggedIn}/>
       
    </Router>)
, document.getElementById('root')
);