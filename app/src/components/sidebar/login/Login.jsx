import React from 'react';
// import './LoginRegister.css';
import AccountIcon from '@material-ui/icons/AccountCircle';

import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginValue: '',
      passwordValue: '',
      logInMessage: '',
    };
  }

  // handlers to watch for changes in the username and password field
  handleLoginValueChange = (event) => {
    this.setState({loginValue: event.target.value});
  }
  handlePasswordValueChange = (event) => {
    this.setState({passwordValue: event.target.value});
  }

  // login by using the username and password filled in
  handleLogIn = () => {
    event.preventDefault(); // prevent reload of page
    let args = {};
    let formData = new FormData(document.getElementById('loginForm'));
    for (var pair of formData.entries()) {
      args[pair[0]] = pair[1];
    }
    // POST to /admin/login
    axios.post('/admin/login', args)
    .then((res) => {
      // On success, set state
      this.props.logIn(res.data.username, res.data._id);
    })
    .catch((error) => {
      // handle error
      this.setState({
        logInMessage: 'Invalid username or password',
      });
      console.log(error);
    });
  };

  // renders two forms, one for log in and one for register
  render() {
    return (
      <div className="login">
        <div className="titleContainer">
          <h3 className="loginTitle"><AccountIcon id="accountIcon"/> Log In</h3>
          <div
              className="login-register-message"
              style={{display: this.state.logInMessage ? 'block' : 'none'}}
          >
              {this.state.logInMessage}
          </div>
        </div>
        <form id="loginForm" className="form" onSubmit={this.handleLogIn}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" maxLength="20" name="username" />
          <label htmlFor="password1">Password</label>
          <input type="password" id="password" name="password" />
          <input id="submit" type="submit" value="Log In" />
        </form>
      </div>
    );
  }
}

export default Login;
