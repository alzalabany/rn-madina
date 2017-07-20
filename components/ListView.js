import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
  TextInput,
  ListView,
  RefreshControl,
  View
} from 'react-native';
import Placeholder from './placeholder';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId][rowId],
  getSectionData: (dataBlob, sectionId) => dataBlob[sectionId],
});

const newDs = () => new ListView.DataSource({
  sectionHeaderHasChanged: (r1, r2) => r1 !== r2 || r1[0] !== r2[0],
  rowHasChanged: (r1, r2) => r1 !== r2,
  getRowData: (dataBlob, sectionId, rowId) => dataBlob[sectionId][rowId],
  getSectionData: (dataBlob, sectionId) => dataBlob[sectionId],
});

class DeferredListView extends Component {
  constructor(props) {
    super(props);
    this.state = {renderPlaceholder:true,loaded:false};
    this.loadMore = this.loadMore.bind(this);
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
    // ...long-running synchronous task...
      requestAnimationFrame(()=>{
        this.setState({renderPlaceholder:false});
      })
    });
  }
  loadMore(){
    if(this.state.loaded)return console.debug('skipping');
    if(typeof this.props.loadMore === 'function'){
      return this.props.loadMore();
    }
  }
  render(){
    if(this.state.renderPlaceholder)return <Placeholder />
      const {getRef,style,renderSeparator,onRefresh,renderFooter,refreshing,dataSource,loadMore,...rest} = this.props;
    const renderSeparators = renderSeparator === false ? ()=>null :
        typeof renderSeparator === 'function'  ? renderSeparator : (sectionId, rowId) => <View key={rowId} style={styles.separator} />;

    const dataStores = Array.isArray(dataSource) || !dataSource ? ds.cloneWithRows(dataSource) : typeof dataSource==='function' ? dataSource(newDs()) : dataSource;


    let renderFooters=()=>null;
    if(renderFooter){
      renderFooters = renderFooter;
    } else if(typeof loadMore==='function'){
      renderFooters = ()=>(
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={loadMore}>
          <Text style={styles.text}>Load More</Text>
        </TouchableOpacity>
      </View>);
    }
    const refresh = typeof onRefresh === 'function' ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : null;
    return (
      <ListView style={[{flex:1},style]}
              {...rest}
              ref={el=>typeof getRef === 'function' ? getRef(el) : null}
              pageSize={1}
              initialListSize={1}
              enableEmptySections={true}
              onEndReached={this.loadMore}
              renderFooter={renderFooters}
              renderSeparator={renderSeparators}
              refreshControl={refresh}
              dataSource={dataStores}
              renderRow={this.props.renderRow} />
    );
  }
}

/*
DeferredListView.propTypes = {
    refreshing: React.PropTypes.bool,
    renderRow: React.PropTypes.fun,
    onRefresh: React.PropTypes.fun,
    renderSeparator: React.PropTypes.fun,
    renderHeader: React.PropTypes.fun,
    loadMore: React.PropTypes.fun,
    dataSource: React.PropTypes.any
};*/


export default DeferredListView;



const styles = StyleSheet.create({
  separator:{
    height: 5,
    backgroundColor: '#222',
  },
  row:{
    flexDirection:'row',
    paddingHorizontal:10,
    paddingVertical:5,
  },
  username:{
    color:'purple',
    fontWeight:'bold',
    fontSize:18,
    marginHorizontal:10,
  },
  button: {
    borderColor: '#8E8E8E',
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    color: '#8E8E8E',
  },
});
