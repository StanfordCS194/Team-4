import React from 'react';
// import './LoginRegister.css';

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
      logInMessage: 'Please log in',
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
    event.preventDefault();
    // POST to /admin/login
    axios.post('/admin/login', {
      login_name: this.state.loginValue,
      password: this.state.passwordValue
    })
    .then((res) => {
      // On success, set state
      console.log('result: ', res);
      console.log(res.data.username, res.data._id)
      this.props.logIn(res.data.username);
    })
    .catch((error) => {
      // handle error
      this.setState({
        logInMessage: 'You have entered an invalid user name or password, please try again',
      });
      console.log(error);
    });
  };

  // renders two forms, one for log in and one for register
  render() {
    return (
      <div className="login">
        <h3 className="loginTitle">{this.state.logInMessage}</h3>
        <form id="loginForm" className="form" onSubmit={this.handleLogIn}>
          <input
            type="text"
            name="login_name"
            value={this.state.loginNameValue}
            placeholder="enter your login name"
            onChange={this.handleLoginValueChange}
            />
          <input
            type="password"
            name="password"
            value={this.state.passwordValue}
            placeholder="enter your password"
            onChange={this.handlePasswordValueChange}
            />
          <input type="submit" value="log in" />
        </form>
      </div>
    );
  }
}

export default Login;
