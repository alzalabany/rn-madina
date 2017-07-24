import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    maxHeight: 90,
  },
  card: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    minWidth: 50,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  data: {
    marginTop: 5,
    fontWeight: '200',
    fontSize: 26,
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
  },
});

const VisitRow = ({ data, total }) => {
  let cards = Array.isArray(data) ? data.concat() : [];
  if (total) {
    cards = [cards[0], { color: 'purple', title: 'Perc', data: `${Math.floor((data.length / total) * 100)}%` }].concat(cards.slice(1, cards.length)).filter(Boolean);
  }
  return (
    <ScrollView horizontal style={styles.container}>
      {cards.map(item => (<View style={styles.card} key={item.color + item.title}>
        <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.data}>{item.data}</Text>
      </View>))}
    </ScrollView>
  );
};


VisitRow.displayName = 'Visit Statistics';
VisitRow.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired })).isRequired,
  total: PropTypes.number, // if given, will show total %
};
VisitRow.defaultProps = ({
  data: Map({}),
  total: 0,
});
export default VisitRow;
