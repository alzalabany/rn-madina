import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { timeToHuman } from '../tools';
import { card } from '../styles';


const tab = {
  flex: 1,
  // minWidth:100,
  maxWidth: 200,
  padding: 10,
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    flex: 1,
  },
  first: {
    borderTopLeftRadius: 14,
  },
  tab,
  last: {
    borderTopRightRadius: 14,
  },
  active: {
    backgroundColor: 'purple',
    ...tab,
  },
  inactive: {
    backgroundColor: 'white',
    ...tab,
  },
  activeText: { color: 'white', fontWeight: '500' },
  inactiveText: {
    color: 'purple',
    fontWeight: '500',
  },
  card,
  avisit: {
    borderBottomWidth: 2,
    borderColor: 'purple',
    marginBottom: 10,
    paddingBottom: 10,
  },
  timelabel: {
    backgroundColor: 'purple',
    color: 'white',
    paddingHorizontal: 5,
    lineHeight: 10,
    height: 20,
    paddingTop: 6,
    overflow: 'hidden',
  },
  dot: {
    width: 10, height: 10, borderRadius: 10,
  },
  green: {
    backgroundColor: 'green',
  },
  small: {
    color: 'grey',
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
    color: 'purple',
    paddingRight: 10,
    textAlign: 'right',
    minWidth: 80,
    minHeight: 20,
  },
  value: {
    color: 'red',
  },
  row: {
    flexDirection: 'row',
    minHeight: 20,
  },
});

const VisitList = ({ data, keys, openVisit, dispatch }) => {
  const visits = (data && data.get) ? keys.map(id => data.get(String(id))) : [];

  return (<ScrollView style={[styles.card, { padding: 10, flex: 1 }]}>
    {Boolean(keys.length === 0) &&
    <TouchableOpacity onPress={() => openVisit()}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
        <Text style={{ color: 'grey' }}>You didn't Book any Appointements yet</Text>
        <Text style={{ color: 'grey' }}>Create one now !</Text>
        <Icon name="arrow-down" size={24} color="grey" style={{ marginTop: 30 }} />
      </View>
    </TouchableOpacity>
    }
    {visits.map(visit => (
      <TouchableOpacity key={`row_${visit.id}`} onPress={() => openVisit(visit)}>
        <View style={styles.avisit}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.label}>Date:</Text>
            <View style={[{ flex: 1 }, styles.row]}>
              <Text style={[styles.value, { flex: 1 }]}>{moment(visit.day).format('DD-MMM-YYYY')}</Text>
              <Text style={styles.timelabel}>{timeToHuman(visit.slot)}</Text>
            </View>

            <View style={{ flexDirection: 'column', height: 20, overflow: 'visible', marginLeft: 4, alignItems: 'flex-end' }}>
              <Text style={[styles.row, { color: 'green' }]}>{visit.status || 'booked'}:<View style={[styles.dot, { backgroundColor: 'green' }]} /></Text>
              {!!visit.has_new && <Text style={[styles.row, { color: 'orange' }]}>New Details<View style={[styles.dot, { backgroundColor: 'orange' }]} /></Text>}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Patient:</Text>
            <Text style={styles.value}>{visit.patient}</Text>
          </View>
          {visit.getDr && <View style={styles.row}>
            <Text style={styles.label}>doctor:</Text>
            <Text style={styles.value}>{visit.getDr(dispatch)}</Text>
          </View>}

          <View style={styles.row}>
            <Text style={styles.label}>Service:</Text>
            <Text style={styles.value}>{visit.type} <Text style={styles.small}>{visit.services}</Text></Text>
          </View>

        </View></TouchableOpacity>))}


  </ScrollView>
  );
};


VisitList.displayName = 'Visit List';
VisitList.propTypes = {
  data: PropTypes.instanceOf(Map).isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  openVisit: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
VisitList.defaultProps = ({
  data: Map({}),
  keys: [],
});
export default VisitList;
