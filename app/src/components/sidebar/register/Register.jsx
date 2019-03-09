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
      // on success
      console.log(res);
      this.props.logIn({
        username: res.data.username,
        id: res.data._id,
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
        <h3 className="register">{this.state.registerMessage}</h3>
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
