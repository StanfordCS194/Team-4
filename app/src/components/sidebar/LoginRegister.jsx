import React from 'react';
import './LoginRegister.css';
import Login from './login/Login';
import Register from './register/register';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
    };
  }

  // renders two forms, one for log in and one for register
  render() {
    return (
      <div className="login-register">
        {
          this.state.login?
          <div>
            <Login logIn={(username, id) => this.props.logIn(username, id)} />
            <br />
            <button
              className="switchLogin"
              onClick={() => this.setState({login: false})}
              >
              Actually, I need to register
            </button>
          </div>
          :
          <div>
            <Register logIn={(username, id) => this.props.logIn(username, id)} />
            <br />
            <button
              className="switchLogin"
              onClick={() => this.setState({login: true})}
              >
              Actually, let me login
            </button>
          </div>
        }
      </div>
    );
  }
}

export default LoginRegister;
