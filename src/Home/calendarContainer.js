import react from 'react';
import {
  View,Text
} from 'react-native';

class CalendarContainer extends react.Component{

  render(){
    return <View>
      <statistics />
      <Tabs />
      {this.listMode ? <Rooms /> : <List />}
    </View>

  }

}

export default CalendarContainer;
