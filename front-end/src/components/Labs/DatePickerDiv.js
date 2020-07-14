import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class DatePickerDiv extends Component {
  render() {
    const { startDate, dateString, handleChange, LabId, i } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-sm-12 body1card">
            <DatePicker
              selected={typeof startDate === 'object' ? startDate : ''}
              onChange={date => {
                console.log(date, 'inside datePicker');

                handleChange(date, LabId, i);
              }}
              minDate={new Date()}
              placeholderText="Select a date"
              dateFormat="MMMM d, yyyy h:mm aa"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              showMonthDropdown
              useShortMonthInDropdown
              customInput={
                <a
                  role="button"
                  tabIndex="0"
                  className="button style1"
                  style={{ color: 'white', backgroundColor: '#272A33' }}
                >
                  {dateString || 'Chose Date'}
                </a>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DatePickerDiv;
