import React from 'react';
// import './LoginRegister.css';

import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerMessage: 'Register to make an account',
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
    if (args.username.length === 0) {
      this.setState({registerMessage: 'please fill our your first name'});
      return;
    }
    if (args.password1.length === 0) {
      this.setState({registerMessage: 'please fill our your password'});
      return;
    }

    // make a user with arguments args
    axios.post('/user', args)
    .then((res) => {
      // on success, res.data is the newly created user obj
      console.log('result: ', res);
      console.log(res.username, res.data._id);
      this.props.logIn(res.username, res.data._id);
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
      <div className="register">
        <h3 className="registerTitle">{this.state.registerMessage}</h3>
        <form id="registerForm" className="form" name="registerForm" onSubmit={this.handleRegister}>
          <div>
            <label htmlFor="username">Enter login name:</label>
            <input type="text" id="username" name="username" />
          </div>
          <div>
            <label htmlFor="password1">Enter a password:</label>
            <input type="password" id="password1" name="password1" />
          </div>
          <div>
            <label htmlFor="password2">Enter your password again:</label>
            <input type="password" id="password2" name="password2" />
          </div>
          <input type="submit" value="register" />
        </form>
      </div>
    );
  }
}

export default Register;
