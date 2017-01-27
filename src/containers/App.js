import React, { Component } from 'react';
import { Link } from 'react-router';

//import logo from './logo.svg';
import './App.css';
import '../css/pure-min.css';
import '../css/side-menu.css';

import PubSub from 'pubsub-js';
import AppConfig from '../config/app-config';

class App extends Component {
  constructor(){  
    super();
    this.state = { username: 'userX' };
  }

  componentDidMount(){
    PubSub.subscribe(AppConfig.TOPIC_INVALID_SESSION, function(topic, reason){      
      //this.invalidateSession(reason);
      this.props.router.replace('/logout');
    });  
  }

  render() {  
    return (
      <div id="layout">
          <a href="#menu" id="menuLink" className="menu-link">
              <span></span>
          </a>

          <div id="menu">
              <div className="pure-menu">
                  <a className="pure-menu-heading" href="#">[ {this.state.username} ]</a>
                  <ul className="pure-menu-list">
                      <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Home</Link></li>
                      <li className="pure-menu-item"><Link to="/list" className="pure-menu-link">List</Link></li>
                      <li className="pure-menu-item"><Link to="/save" className="pure-menu-link">Save</Link></li>
                      <li className="pure-menu-item"><Link to="/logout" className="pure-menu-link"><strong>[Sign Out]</strong></Link></li>
                  </ul>
              </div>
          </div>
              <div id="main">
                {this.props.children}
              </div>            
      </div>  
    );
  }
}

export default App;
