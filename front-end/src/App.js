import React, { Component } from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { configureAnchors } from 'react-scrollable-anchor';

import Banner from './components/Banner.js';
import Steps from './components/Steps.js';
import Labs from './components/Labs/Labs.js';
import Contact from './components/Contact';

configureAnchors({ offset: -55, scrollDuration: 400 });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userId: '',
      userName: '',
      userEmail: '',
      userNumMec: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.token !== prevState.token || this.state.userName !== prevState.userName) {
      this.forceUpdate();
    }
  }

  UpdateStateApp = (token, userId, userName, userEmail, userNumMec) => {
    this.setState({
      token,
      userId,
      userName,
      userEmail,
      userNumMec,
    });
  };

  render() {
    const { token, userId, userName, userNumMec, userEmail } = this.state;
    console.log(token, 'token App ==============');
    console.log(userId, 'userId App ==============');
    console.log(userName, 'userName App ==============');
    console.log(userEmail, 'userEmail App ==============');
    console.log(userNumMec, 'userNumMec App ==============');

    return (
      <div id="page-wrapper">
        {/* Header */}
        <Banner UpdateStateApp={this.UpdateStateApp} />
        {/* Intro */}
        <ScrollableAnchor id="steps">
          <Steps />
        </ScrollableAnchor>
        {/* Labs */}
        <ScrollableAnchor id="getaccess">
          <Labs token={token} userId={userId} userName={userName} userEmail={userEmail} userNumMec={userNumMec} />
        </ScrollableAnchor>
        {/* Footer */}
        <ScrollableAnchor id="contact">
          <Contact />
        </ScrollableAnchor>
      </div>
    );
  }
}

export default App;
