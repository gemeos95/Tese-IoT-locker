import React from 'react';

class xxxx extends React.Component {
  render() {
    return (
      <section id="footer" className="wrapper">
        <div className="title">Contact</div>
        <div className="container">
          <div className="row">
            <div className="col-6 col-12-medium">
              {/* Contact Form */}
              <section>
                <form method="post" action="#">
                  <div className="row gtr-50">
                    <div className="col-6 col-12-small">
                      <input type="text" name="name" id="contact-name" placeholder="Name" />
                    </div>
                    <div className="col-6 col-12-small">
                      <input type="text" name="email" id="contact-email" placeholder="Email" />
                    </div>
                    <div className="col-12">
                      <textarea name="message" id="contact-message" placeholder="Message" rows={4} defaultValue="" />
                    </div>
                    <div className="col-12">
                      <ul className="actions">
                        <li>
                          <input type="submit" className="style1" defaultValue="Send" />
                        </li>
                        <li>
                          <input type="reset" className="style2" defaultValue="Reset" />
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
              </section>
            </div>
            <div className="col-6 col-12-medium">
              {/* Contact */}
              <section className="feature-list small">
                <div className="row">
                  <div className="col-6 col-12-small">
                    <section>
                      <h3 className="icon solid fa-home">Mailing Address</h3>
                      <p>
                        Untitled Corp
                        <br />
                        1234 Somewhere Rd
                        <br />
                        Nashville, TN 00000
                      </p>
                    </section>
                  </div>
                  <div className="col-6 col-12-small">
                    <section>
                      <h3 className="icon solid fa-comment">Social</h3>
                      <p>
                        <a href="oi">@untitled-corp</a>
                        <br />
                        <a href="oi">linkedin.com/untitled</a>
                        <br />
                        <a href="oi">facebook.com/untitled</a>
                      </p>
                    </section>
                  </div>
                  <div className="col-6 col-12-small">
                    <section>
                      <h3 className="icon solid fa-envelope">Email</h3>
                      <p>
                        <a href="oi">info@untitled.tld</a>
                      </p>
                    </section>
                  </div>
                  <div className="col-6 col-12-small">
                    <section>
                      <h3 className="icon solid fa-phone">Phone</h3>
                      <p>(000) 555-0000</p>
                    </section>
                  </div>
                </div>
              </section>
            </div>
          </div>
          s
        </div>
      </section>
    );
  }
}

export default xxxx;
