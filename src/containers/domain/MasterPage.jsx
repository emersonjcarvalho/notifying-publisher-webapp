import React, { Component } from 'react';
import { Link } from 'react-router';

import logo from './logo.svg';
import '../App.css';
import './../css/pure-min.css';
import './../css/side-menu.css';

class MasterPage extends Component{

	render(){
		return(
			 <div id="main">
                {this.props.children}
              </div>
			);
	}
}
export default MasterPage;