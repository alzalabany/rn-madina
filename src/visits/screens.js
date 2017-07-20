import React, { Component } from 'react';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
const Visits = {}



Visits.List = props => null

Visits.Stats = props => null


Visits.Row =  props =>{
    const data = props.data || {};
    return (
      <TouchableOpacity style={styles.container} onPress={()=>props.navigate('visit','Visit Card',{id:1})}>
        <View style={styles.row}>
          <Text style={styles.label}>Date :</Text>
          <Text style={[styles.value,{flex:1}]}>{moment(data.day).calendar()}</Text>
          <Text style={[styles.row,{color:'green'}]}>{data.status||'booked'}:<View style={[styles.dot,{backgroundColor:'green'}]}/></Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient :</Text>
          <Text style={styles.value}>{data.patient}</Text>
        </View>
        {!!this.props.nodr ? null :
        <View style={styles.row}>
          <Text style={styles.label}>doctor :</Text>
          <User id={data.ref_id} render={u=><Text style={styles.value}>{u.fullname||'N/A'}</Text>} />
        </View>}

        <View style={styles.row}>
          <Text style={styles.label}>Service :</Text>
          <Text style={styles.value}>{data.type} <Text style={styles.small}>{data.services}</Text></Text>
        </View>

      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container:{
    borderBottomWidth:2,
    borderColor:'purple',
    marginBottom:10,
    paddingBottom:10,
  },
  dot:{
    width:10,height:10,borderRadius:10,
  },
  green:{
    backgroundColor:'green',
  },
  small:{
    color:'grey',
    fontSize:12,
  },
  row:{
    flexDirection:'row',
  },
  label:{
    fontWeight:'bold',
    color:'purple',
    marginRight:20,
  },
  value:{
    color:'red'
  }
});

export default Visits;