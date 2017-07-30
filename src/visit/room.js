import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import { withRouter } from 'react-router-dom';

class RoomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  calc(room) {
    const end = Number(room.ending_hour);
    const start = Number(room.starting_hour);
    const size = end - start;
    if (!size || isNaN(size) || size < 0) return false;

    const currentWeekDay = String(moment().format('W'));
    const weekend = Array.isArray(room.weekend) ? room.weekend : room.weekend.split(',');

    if (weekend.map(String).indexOf(currentWeekDay) > -1) return false;

    let howmany = Math.floor((size * 60) / Number(room.interval));
    const blocks = [];
    while (howmany--) {
      blocks.push(start + howmany);
    }
    return blocks;
  }

  render() {
    return (null);
  }
}

RoomTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
RoomTable.displayName = 'RoomTable';
RoomTable.defaultProps = ({});

export default RoomTable;
