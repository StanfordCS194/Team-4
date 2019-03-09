import React from 'react';
import './LoginRegister.css';

import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginValue: '',
      passwordValue: '',
      logInMessage: 'Before you can enjoy the app, please log in',
      registerMessage: 'Or Register to make an account',
      login_name: null,
      first_name: null,
      last_name: null,
      id: null,

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
      this.setState({
        login_name: res.data.login_name,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        id: res.data._id,

      });
    })
    .catch((error) => {
      // handle error
      this.setState({
        logInMessage: 'You have entered an invalid user name or password, please try again',
      });
      console.log(error);
    });
  };

    // handle register creates a formData from registerForm
    // then it parses the entries in the dormData into args, which
    // acts as the args to a POST reqest to /user
    handleRegister = () => {
        event.preventDefault(); // prevent reload of page
        let args = {};
        let formData = new FormData(document.getElementById('registerForm'));
        for (var pair of formData.entries()) {
            args[pair[0]] = pair[1];
        }
        // check that form entries are valid and filled in
        if (args.password1 !== args.password2) {
            this.setState({registerMessage: 'entered passwords do not match, please try again'});
            return;
        }
        if (args.firstName.length === 0) {
            this.setState({registerMessage: 'please fill our your first name'});
            return;
        }
        if (args.lastName.length === 0) {
            this.setState({registerMessage: 'please fill our your last name'});
            return;
        }
        if (args.lastName.password1 === 0) {
            this.setState({registerMessage: 'please fill our your password'});
            return;
        }

        // make a user with arguments args
        axios.post('/user', args)
            .then((res) => {
                // on success
                console.log(res);
                this.setState({
                    logInMessage: 'Your account has been made! please log in',
                });
            })
            .catch((error) => {
                // handle error
                this.setState({
                    registerMessage: 'You have entered an invalid user name or password, please try again',
                });
                console.log(error);
            });
    };

    // renders two forms, one for log in and one for register
    render() {
        return (
            <div className="center-align col s7 details-container">
                <h3 className="pleaseLogIn">{this.state.logInMessage}</h3>
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
                    <input type="submit" value="log in"/>
                </form>
                <h3 className="register">{this.state.registerMessage}</h3>
                <form id="registerForm" className="form" name="registerForm" onSubmit={this.handleRegister}>
                    <div>
                        <label htmlFor="loginName">Enter login name:</label>
                        <input type="text" id="loginName" name="loginName"/>
                    </div>
                    <div>
                        <label htmlFor="password1">Enter a password:</label>
                        <input type="password" id="password1" name="password1"/>
                    </div>
                    <div>
                        <label htmlFor="password2">Enter your password again:</label>
                        <input type="password" id="password2" name="password2"/>
                    </div>
                    <div>
                        <label htmlFor="firstName">Enter your first name:</label>
                        <input type="text" id="firstName" name="firstName"/>
                    </div>
                    <div>
                        <label htmlFor="lastName">Enter your last name:</label>
                        <input type="text" id="lastName" name="lastName"/>
                    </div>
                    <div>
                        <label htmlFor="location">Enter your location:</label>
                        <input type="text" id="location" name="location"/>
                    </div>
                    <div>
                        <label htmlFor="description">Enter a description:</label>
                        <input type="text" id="description" name="description"/>
                    </div>
                    <div>
                        <label htmlFor="occupation">Enter your occupation:</label>
                        <input type="text" id="occupation" name="occupation"/>
                    </div>
                    <input type="submit" value="Register Me"/>
                </form>
            </div>
        );
    }
}

export default LoginRegister;
