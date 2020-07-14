import React from 'react';
import Modal from 'react-awesome-modal';
import { getFromStorage, setInStorage } from './utils/storage.js';

/* for (let i = 0; i < response.length; i++) {
  console.log(response.message[i].LabTitle, 'Labtitle');
  AccessesHTML.push(<li>{response.message[i].LabTitle}</li>);
}
 */
class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibleRegister: false,
      visibleAccesses: false,
      isLoading: true,
      token: '',
      userId: '',
      userName: '',
      userEmail: '',
      userNumMec: '',
      // above to store
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpNumMec: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
      children: '',
    };
  }

  // LIFECICLE METHODS-------------------------------------------------------
  componentDidMount() {
    const obj = getFromStorage('the_main_app'); // there is a token ON THE BROWSER?
    console.log(obj, 'object!');
    if (obj && obj.token) {
      const { token } = obj;
      console.log('entrou');
      // verify token
      // if we put the token in the url and it give us a possitive awanser it means that it belongs to a valid user
      fetch(`http://localhost:3000/account/verify?token=${token}`)
        .then(res => res.json()) // we will get the res.send
        .then(json => {
          if (json.success) {
            this.setState({
              token, // give the value to the state of token
              isLoading: false,
              userId: json.UserId,
              userName: json.userName,
              userEmail: json.userEmail,
              userNumMec: json.userNumMec,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
          // Call other function with filtering user by User.ID to search in access of isValid + userID
          this.ShowAccessValidated(json.UserId);
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.token !== prevState.token || this.state.UserId !== prevState.UserId) {
      this.props.UpdateStateApp(
        this.state.token,
        this.state.userId,
        this.state.userName,
        this.state.userEmail,
        this.state.userNumMec
      );
    }
  }

  ShowAccessValidated = UserId => {
    fetch(`http://localhost:3000/account/ShowInitialAccesses?UserId=${UserId}`)
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          console.log(response, 'response');
          // pop up some to open modal funtion
          this.openModalvisibleAccesses();
          // set in state HTML to push into modal
          const AccessesHTML = [];
          for (let index = 0; index < response.message.length; index++) {
            AccessesHTML.push(response.message[index]);
          }
          this.setState({
            children: AccessesHTML,
          });
        }
      });
  };

  onSignUp = () => {
    // Grab state
    const { signUpEmail, signUpPassword, signUpNumMec, signUpLastName } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('http://localhost:3000/account/signup', {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        NumMec: signUpNumMec,
        name: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json, 'json');
        if (json.success) {
          // if there is a sucess message back!
          // taking the user id and creating a token with setinstore
          setInStorage('the_main_app', { token: json.token });
          console.log(json.message);

          this.setState({
            // remember the 1º argument is a just a name the 2º is the obj value that in this case is the id
            signUpError: json.message, // print the message
            isLoading: false, // stop loading
            signUpEmail: '',
            signUpPassword: '',
            signUpNumMec: '',
            signUpLastName: '',
            token: json.token,
            userId: json.userId,
            userName: json.userName,
            userEmail: json.userEmail,
            userNumMec: json.userNumMec,
          });
          this.closeModalRegister();
        } else {
          this.setState({
            // if there is a error message back
            signUpError: json.message, // print the error
            isLoading: false, // stop loading
          });
        }
      });
  };

  onSignIn = () => {
    // grab state
    // Grab state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('http://localhost:3000/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          // if there is a sucess message back!
          // taking the user id and creating a token with setinstore
          setInStorage('the_main_app', { token: json.token });
          console.log(json.message);

          this.setState({
            // remember the 1º argument is a just a name the 2º is the obj value that in this case is the id
            isLoading: false, // stop loading
            signInEmail: '',
            signInPassword: '',
            token: json.token,
            userName: json.userName,
            userId: json.userId,
            userEmail: json.userEmail,
            userNumMec: json.userNumMec,
          });
          this.closeModal();
          this.ShowAccessValidated(json.userId);

          /* this.closeModal();
          if (this.state.children) {
            setTimeout(this.openModalvisibleAccesses, 2000);
          } */
        } else {
          this.setState({
            // if there is a error message back
            signInError: json.message, // print the error
            isLoading: false, // stop loading
          });
        }
      });
  };

  logout = () => {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app'); // there is a token ON THE BROWSER?
    if (obj && obj.token) {
      const { token } = obj;
      // verify token
      // if we put the token in the url and it give us a possitive awanser it means that it belongs to a valid user
      fetch(`http://localhost:3000/account/logout?token=${token}`)
        .then(res => res.json()) // we will get the res.send
        .then(json => {
          if (json.success) {
            this.setState({
              token: '', // reset the token
              userId: '',
              userName: '',
              userEmail: '',
              userNumMec: '',
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };

  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
  };

  openModalRegister = () => {
    this.setState({
      visibleRegister: true,
    });
  };

  closeModalRegister = () => {
    this.setState({
      visibleRegister: false,
    });
  };

  openModalvisibleAccesses = () => {
    this.setState({
      visibleAccesses: true,
    });
  };

  closeModalvisibleAccesses = () => {
    this.setState({
      visibleAccesses: false,
    });
  };

  onTextboxChangeSignInEmail = event => {
    this.setState({
      signInEmail: event.target.value,
    });
  };

  onTextboxChangeSignInPassword = event => {
    this.setState({
      signInPassword: event.target.value,
    });
  };

  onTextboxChangeSignUpEmail = event => {
    this.setState({
      signUpEmail: event.target.value,
    });
  };

  onTextboxChangeSignUpPassword = event => {
    this.setState({
      signUpPassword: event.target.value,
    });
  };

  onTextboxChangeSignUpNumMec = event => {
    this.setState({
      signUpNumMec: event.target.value,
    });
  };

  onTextboxChangeSignUpLastName = event => {
    this.setState({
      signUpLastName: event.target.value,
    });
  };

  render() {
    const {
      visible,
      visibleRegister,
      visibleAccesses,
      isLoading,
      userId,
      userName,
      token,
      userEmail,
      userNumMec,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpNumMec,
      signUpLastName,
      signUpError,
      children,
    } = this.state;
    if (token) {
      console.log(token, 'token');
      console.log(userId, 'userId');
      console.log(userName, 'userName');
      console.log(userEmail, 'userEmail');
      console.log(userNumMec, 'userNumMec');
      console.log(children, 'children');
    }

    const AccessData = [];
    if (children.length !== 0) {
      console.log(children);
      for (let i = 0; i < children.length; i++) {
        AccessData.push(
          <li key={i}>
            {children[i].LabTitle} ás {children[i].DataPedida}. Aceite Por: {children[i].Professor}
          </li>
        );
      }
    }

    return (
      <section id="header" className="wrapper">
        {/* Logo */}
        <div id="logo">
          <h1>
            <a>Opening Doors with one click</a>
          </h1>
          <p>Just Follow the instructions bellow!</p>
        </div>
        {/* Button */}
        {/** <a class="btn" href="#"><i class="ion-ios-arrow-down"></i></a> */}
        {/* Nav */}
        <nav id="nav">
          <ul>
            <li>
              <a href="#steps" role="button" tabIndex={0}>
                Instructions
              </a>
            </li>
            <li>
              <a href="#getaccess" role="button" tabIndex={0}>
                Get Access
              </a>
            </li>
            <li>
              <a href="#contact" role="button" tabIndex={0}>
                Contact
              </a>
            </li>
          </ul>
          {/* type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom" */}
          {token ? (
            <ul>
              <li className="current">
                <a
                  role="button"
                  tabIndex={0}
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title={`Welcome ${userName}`}
                  onClick={() => this.logout()}
                >
                  Logout
                </a>
              </li>
            </ul>
          ) : (
            <ul>
              <li className="current">
                <a role="button" tabIndex={0} onClick={() => this.openModal()}>
                  Sign In
                </a>
              </li>
            </ul>
          )}
        </nav>
        {/* MODAL DE REGISTER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
        <Modal visible={visibleRegister} width="800px" effect="fadeInUp" onClickAway={() => this.closeModalRegister()}>
          <section id="footer" className="wrapper">
            <div className="title">Register</div>
            <section>
              <form method="post" action="#">
                <div className="row ">
                  <div className="col-6 col-12-small">
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      placeholder="Numero Mecanográfico"
                      onChange={this.onTextboxChangeSignUpNumMec}
                      value={signUpNumMec}
                    />
                  </div>
                  <div className="col-6 col-12-small" style={{ width: '50px' }}>
                    <input
                      type="text"
                      name="email"
                      id="contact-email"
                      placeholder="Nome completo"
                      onChange={this.onTextboxChangeSignUpLastName}
                      value={signUpLastName}
                    />
                  </div>
                  <div className="col-6 col-12-small">
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      placeholder="Email"
                      onChange={this.onTextboxChangeSignUpEmail}
                      value={signUpEmail}
                    />
                  </div>
                  <div className="col-6 col-12-small" style={{ width: '50px' }}>
                    <input
                      type="text"
                      name="email"
                      id="contact-email"
                      placeholder="Password"
                      onChange={this.onTextboxChangeSignUpPassword}
                      value={signUpPassword}
                    />
                  </div>

                  <div className="col-12" style={{ textAlign: 'center' }}>
                    <ul className="actions">
                      <li>
                        <a
                          role="button"
                          tabIndex="0"
                          className="button style1"
                          style={{ color: 'white' }}
                          onClick={this.onSignUp}
                        >
                          Register
                        </a>
                      </li>
                      <li>
                        <input
                          type="reset"
                          className="style2"
                          value="Login"
                          onClick={() => {
                            this.openModal();
                            this.closeModalRegister();
                          }}
                        />
                      </li>
                    </ul>
                    {signUpError ? <div style={{ color: 'red', paddingTop: '10px' }}>{signUpError}</div> : null}
                  </div>
                </div>
              </form>
            </section>
          </section>
        </Modal>
        {/* MODAL DE LOGIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
        <Modal visible={visible} width="800px" effect="fadeInUp" onClickAway={() => this.closeModal()}>
          <section id="footer" className="wrapper">
            <div className="title">Login</div>
            <section>
              <form method="post" action="#">
                <div className="row ">
                  <div className="col-6 col-12-small">
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      placeholder="Email"
                      onChange={this.onTextboxChangeSignInEmail}
                      value={signInEmail}
                    />
                  </div>
                  <div className="col-6 col-12-small" style={{ width: '50px' }}>
                    <input
                      type="text"
                      name="email"
                      id="contact-email"
                      placeholder="Password"
                      onChange={this.onTextboxChangeSignInPassword}
                      value={signInPassword}
                    />
                  </div>

                  <div className="col-12" style={{ textAlign: 'center' }}>
                    <ul className="actions">
                      <li>
                        <a
                          role="button"
                          tabIndex="0"
                          className="button style1"
                          style={{ color: 'white' }}
                          onClick={this.onSignIn}
                        >
                          Login
                        </a>
                      </li>
                      <li>
                        <input
                          type="reset"
                          className="style2"
                          value="Register"
                          onClick={() => {
                            this.openModalRegister();
                            this.closeModal();
                          }}
                        />
                      </li>
                    </ul>
                    {signInError ? <div style={{ color: 'red', paddingTop: '10px' }}>{signInError}</div> : null}
                  </div>
                </div>
              </form>
            </section>
          </section>
        </Modal>

        <Modal
          visible={visibleAccesses}
          width="800px"
          effect="fadeInUp"
          onClickAway={() => this.closeModalvisibleAccesses()}
        >
          <section id="footer" className="wrapper">
            <div className="title">Accessos Aceites</div>
            <section style={{ Margin: '1px !important', padding: '1px !important' }}>
              <div className="col-12" style={{ textAlign: 'center' }}>
                Não se esqueça tem este(s) accessos aceites para utilizar:
                <p /> <ul>{AccessData}</ul>
                Verifique o seu email para abir os seus laboratorios
              </div>
            </section>
          </section>
        </Modal>
        {
          /* <div>
        {isLoggedIn ? (
          <LogoutButton onClick={this.handleLogoutClick} />
        ) : (
          <LoginButton onClick={this.handleLoginClick} />
        )}
      </div> */
          // RETURN A LOG OUT BUTTON AND A CSS PLATFORM TO SEE THAT IS LOGED IN.
          /* /* return<div><p>signup</p><button onClick={this.logout}></button>Logout</div>
           */
        }
      </section>
    );
  }
}

export default Banner;
