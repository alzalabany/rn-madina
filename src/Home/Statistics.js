import React, { Component } from 'react';
import {View,ScrollView,Text,Dimensions} from 'react-native';
import styles from './styles';
const {width} = Dimensions.get('window');

export default ({stats, visits})=>{
  return <View style={{justifyContent:'center',alignItems:'center'}}>
  <ScrollView horizontal={true} style={{height:60, margin:8,flexDirection:'row'}}>
    <View style={[styles.minicard,{minWidth:Math.max((width/4),70)}]}>
      <Text style={{fontWeight:'bold','textAlign':'center'}}>All</Text>
      <Text style={{fontWeight:'bold','textAlign':'center',fontSize:20}}>{visits.length}</Text>
    </View>
    {Object.keys(stats.byType).map(type=>(
              <View key={type} style={[styles.minicard,{minWidth:Math.max((width/4),70)}]}>
                <Text style={{fontWeight:'bold',color:'purple','textAlign':'center'}}>{type}</Text>
                <Text style={{fontWeight:'bold','textAlign':'center',fontSize:20}}>{stats.byType[type]}</Text>
              </View>))}
    {Object.keys(stats.byStatus).map(type=>(
    <View key={type} style={[styles.minicard,{minWidth:Math.max((width/4),70)}]}>
      <Text style={{fontWeight:'bold',color:'green','textAlign':'center'}}>{type}</Text>
      <Text style={{fontWeight:'bold','textAlign':'center',fontSize:20}}>{stats.byStatus[type]}</Text>
    </View>))}
  </ScrollView>
  </View>
}
