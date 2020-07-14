import React from 'react';
import { Gallery, GalleryImage } from 'react-gesture-gallery';
import ItemsCarousel from 'react-items-carousel';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-awesome-modal';
import DatePickerDiv from './DatePickerDiv';

class Labs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItemIndex: 0,
      children: [],
      Department: '',
      Professor: '',
      startDate: '',
      UserLabId: '',
      opacity: 1,
      scale: 1,
      ColorAcessMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { token, userId, userName, userNumMec, userEmail } = this.props;
    console.log(token, 'token Lab');
    console.log(userId, 'userId Lab');
    console.log(userName, 'userName Lab');
    console.log(userNumMec, 'userName Lab');
    console.log(userEmail, 'userName Lab');

    fetch('http://localhost:3000/getlabs')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const DataLabs = [];
          for (let index = 0; index < data.message.length; index++) {
            data.message[index].index = 0;
            data.message[index].dateString = '';
            data.message[index].AccessMesage = '';
            DataLabs.push(data.message[index]);
          }
          this.setState({
            children: DataLabs,
          });
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.Professor !== prevState.Professor || this.state.Department !== prevState.Department) {
      this.UpdateLabs(this.state.Professor, this.state.Department);
    }
  }

  openModal() {
    this.setState({
      visible: true,
    });
  }

  closeModal() {
    this.setState({
      visible: false,
    });
  }

  UpdateLabs = () => {
    const { Department, Professor } = this.state;
    // objetivo mudar children para o filtro com ambos os estados.

    fetch(`http://localhost:3000/updatelabs?StateDep=${Department}&StateProf=${Professor}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const DataLabs = [];
          for (let index = 0; index < data.message.length; index++) {
            data.message[index].index = 0;
            DataLabs.push(data.message[index]);
          }
          this.setState({
            children: DataLabs,
          });
        }
      });
  };

  CreateAccess = (
    DataPedida,
    DataActual,
    LabTitle,
    LabID,
    Username,
    UserId,
    userNumMec,
    userEmail,
    Professor,
    ProfessorEmail,
    i
  ) => {
    const { children, ColorAcessMessage } = this.state;

    // Post request to backend
    console.log(userNumMec, 'userNumMec');
    console.log(userEmail, 'userEmail');
    console.log(ProfessorEmail, 'ProfessorEmail');

    this.openModal();

    fetch('http://localhost:3000/GetAccess', {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        DataPedida,
        DataActual,
        LabTitle,
        LabID,
        Username,
        UserId,
        userNumMec,
        userEmail,
        Professor,
        ProfessorEmail,
      }),
    })
      .then(res => res.json())
      .then(json => {
        const DataCopy = JSON.parse(JSON.stringify(children)); // Make a copy of the all state
        DataCopy[i].AccessMesage = json.message; /* this.StringDate(date); */ // Make the changes as it is a normal thing
        this.setState({ children: DataCopy });

        if (json.success) {
          this.setState({ ColorAcessMessage: 'green' });
        } else {
          this.setState({ ColorAcessMessage: 'red' });
        }
      });
  };

  /*= =================================================  HANDLE DATE  ================================================== */
  // we need to handle the date change the new parameter in the state (like the index)
  // then we need to take this value and pass it into the component

  addZero = i => {
    if (i < 10) {
      i = `0${i}`;
    }
    return i;
  };

  StringDate = date => {
    if (date) {
      const startDateAtualizado = new Date(date.getTime() + 3600000);
      const y = this.addZero(startDateAtualizado.getFullYear());
      const month = this.addZero(startDateAtualizado.getUTCMonth() + 1);
      const day = this.addZero(startDateAtualizado.getUTCDate());
      const hour = this.addZero(startDateAtualizado.getUTCHours());
      const minutes = this.addZero(startDateAtualizado.getUTCMinutes());
      return `${y}-${month}-${day} ${hour}:${minutes}`;
    }
  };

  handleChange(date, LabId, i) {
    const { children } = this.state;

    const DataCopy = JSON.parse(JSON.stringify(children)); // Make a copy of the all state
    DataCopy[i].date = date; /* this.StringDate(date); */ // Make the changes as it is a normal thing
    DataCopy[i].dateString = this.StringDate(date); /* this.StringDate(date); */ // Make the changes as it is a normal thing
    this.setState({ children: DataCopy });
  }

  render() {
    const { token, userId, userName, userNumMec, userEmail } = this.props;
    const {
      visible,
      startDate,
      activeItemIndex,
      children,
      Department,
      Professor,
      opacity,
      ColorAcessMessage,
    } = this.state;
    const Lab = [];
    if (children.length !== 0) {
      console.log(children);
      for (let i = 0; i < children.length; i++) {
        Lab.push(
          <div key={i} className="container">
            <div className="row aln-center">
              <div className="col-4 col-12-medium" />

              <section className="highlight">
                <a className="image featured">
                  <Gallery
                    className="Gallery__Indicators"
                    enableControls={false}
                    index={children[i].index}
                    onRequestChange={value => {
                      const DataCopy = JSON.parse(JSON.stringify(children)); // Make a copy of the all state
                      DataCopy[i].index = value; // Make the changes as it is a normal thing
                      this.setState({ children: DataCopy });
                    }}
                  >
                    {children[i].Images.map(image => (
                      <GalleryImage objectFit="cover" src={image} />
                    ))}
                  </Gallery>
                </a>
                <h3>
                  <a href="oi">{children[i].Title}</a>
                </h3>
                <p>{children[i].Description}</p>
                <ul className="actions">
                  <li>
                    <DatePickerDiv
                      startDate={children[i].date}
                      dateString={children[i].dateString}
                      Date={children[i].dateString}
                      opacity={opacity}
                      i={i}
                      /* stringDate={children[i].startDate} */
                      LabId={children[i]._id}
                      onScale={this.onScale}
                      handleChange={this.handleChange}
                      onSaveDate={this.onSaveDate}
                    />
                    <a
                      role="button"
                      tabIndex="0"
                      className="button style1"
                      style={{ backgroundColor: '#E6756F' }}
                      onClick={() => {
                        this.CreateAccess(
                          children[i].dateString,
                          new Date(),
                          children[i].Title,
                          children[i]._id,
                          userName,
                          userId,
                          userNumMec,
                          userEmail,
                          children[i].Professor,
                          children[i].ProfessorEmail,
                          i
                        );
                      }}
                    >
                      Ask Access
                      {children[i].AccessMesage ? (
                        <div
                          style={{
                            color: ColorAcessMessage,
                            paddingTop: '10px',
                            fontSize: '12px',
                            fontStyle: 'arial',
                            lineHeight: 'normal',
                          }}
                        >
                          {children[i].AccessMesage}
                        </div>
                      ) : null}
                    </a>
                    <br />
                  </li>
                </ul>
              </section>
            </div>
          </div>
        );
      }
    }

    return (
      <section id="highlights" className="wrapper style3">
        <div className="title">Get access</div>
        <ul className="actions special">
          <li>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-danger dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Department
              </button>
              <div className="dropdown-menu">
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  style={{ backgroundColor: Department === 'Eng.Mechanics' ? '#ecf0f1' : null }}
                  onClick={() => {
                    if (Department === 'Eng.Mechanics') {
                      this.setState({ Department: '' });
                    } else {
                      this.setState({ Department: 'Eng.Mechanics' });
                    }
                  }}
                >
                  Eng.Mechanics
                </a>
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  style={{ backgroundColor: Department === 'Eng.Physics' ? '#ecf0f1' : null }}
                  onClick={() => {
                    if (Department === 'Eng.Physics') {
                      this.setState({ Department: '' });
                    } else {
                      this.setState({ Department: 'Eng.Physics' });
                    }
                  }}
                >
                  Eng.Physics
                </a>
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  style={{ backgroundColor: Department === 'Eng.Civil' ? '#ecf0f1' : null }}
                  onClick={() => {
                    if (Department === 'Eng.Civil') {
                      this.setState({ Department: '' });
                    } else {
                      this.setState({ Department: 'Eng.Civil' });
                    }
                  }}
                >
                  Eng.Civil
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-danger dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Professor
              </button>
              <div className="dropdown-menu">
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  style={{ backgroundColor: Professor === 'Professor1' ? '#ecf0f1' : null }}
                  onClick={() => {
                    if (Professor === 'Professor1') {
                      this.setState({ Professor: '' });
                    } else {
                      this.setState({ Professor: 'Professor1' });
                    }
                  }}
                >
                  Professor1
                </a>
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  style={{ backgroundColor: Professor === 'Professor2' ? '#ecf0f1' : null }}
                  onClick={() => {
                    if (Professor === 'Professor2') {
                      this.setState({ Professor: '' });
                    } else {
                      this.setState({ Professor: 'Professor2' });
                    }
                  }}
                >
                  Professor2
                </a>
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  style={{ backgroundColor: Professor === 'Professor3' ? '#ecf0f1' : null }}
                  onClick={() => {
                    if (Professor === 'Professor3') {
                      this.setState({ Professor: '' });
                    } else {
                      this.setState({ Professor: 'Professor3' });
                    }
                  }}
                >
                  Professor3
                </a>
              </div>
            </div>
          </li>
        </ul>

        <ItemsCarousel
          // Placeholder configurations
          enablePlaceholder
          numberOfPlaceholderItems={5}
          minimumPlaceholderTime={1000}
          placeholderItem={<div style={{ height: 200, background: '#900' }}>Placeholder</div>}
          // Carousel configurations
          numberOfCards={3}
          gutter={12}
          showSlither
          firstAndLastGutter
          freeScrolling={false}
          // Active item configurations
          requestToChangeActive={event => {
            this.setState({ activeItemIndex: event });
          }}
          activeItemIndex={activeItemIndex}
          activePosition="center"
          chevronWidth={24}
          rightChevron={
            <img
              alt="placeholder"
              src="https://www.clipartmax.com/png/middle/246-2464021_right-arrow-comments-navigation-arrow-icon-png.png"
              style={{ height: 40, width: 40 }}
            />
          }
          leftChevron={
            <img
              alt="placeholder"
              src="https://cdn1.iconfinder.com/data/icons/mini-solid-icons-vol-1/16/26-512.png"
              style={{ height: 40, width: 40 }}
            />
          }
          outsideChevron={false}
        >
          {Lab}
        </ItemsCarousel>

        <Modal visible={visible} width="500px" effect="fadeInUp" onClickAway={() => this.closeModal()}>
          <section id="footer" className="wrapper">
            <div className="title">Request Sent!</div>
            <section>
              <div className="col-12" style={{ textAlign: 'center' }}>
                A request via email was sent to the professor, check your email. In his confirmation you will recieve an
                email, that alow you open the door.
              </div>
            </section>
          </section>
        </Modal>
      </section>
    );
  }
}

export default Labs;
