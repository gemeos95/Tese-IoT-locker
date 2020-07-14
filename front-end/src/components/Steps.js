import React from 'react';

class Steps extends React.Component {
  render() {
    return (
      <div>
        <section id="intro" className="wrapper style1">
          <div className="title">In just 4 steps</div>
          {/* Features */}
          <section id="features">
            <div className="feature-list">
              <div className="row">
                <div className="col-6 col-12-medium">
                  <section>
                    <h3 className="icon solid fa-user-check"> 1. Sign Up</h3>
                    <p>You need to sign up in order to us know who you are.</p>
                  </section>
                </div>
                <div className="col-6 col-12-medium">
                  <section>
                    <h3 className="icon solid fa-key"> 2. Ask For Your Access</h3>
                    <p>Chose when and where you want to enter.</p>
                  </section>
                </div>
                <div className="col-6 col-12-medium">
                  <section>
                    <h3 className="icon solid fa-sync"> 3. Wait for confirmation</h3>
                    <p> A confirmation will be sent to your email when the resposable people aprove your access.</p>
                  </section>
                </div>
                <div className="col-6 col-12-medium">
                  <section>
                    <h3 className="icon solid fa-thumbs-up"> 4. Open the door with one click</h3>
                    <p>
                      That confirmation will contain a button where you can open the Lab over your Email. In your
                      smatphone or any other device.
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    );
  }
}

export default Steps;
