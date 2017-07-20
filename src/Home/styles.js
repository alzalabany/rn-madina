import {
  StyleSheet,Dimensions
} from 'react-native';
const tab =  {
    flex:1,
    //minWidth:100,
    maxWidth:200,
    padding:10,
  }
export default StyleSheet.create({
  avisit:{
    borderBottomWidth:2,
    borderColor:'purple',
    marginBottom:10,
    paddingBottom:10,
  },
  timelabel:{
    backgroundColor:'purple',
    color:'white',
    padding:5,
    lineHeight:20,
    overflow:'hidden',
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
  label:{
    fontWeight:'bold',
    color:'purple',
    marginRight:20,
    flex:-1,
    minWidth:60,
    textAlign:'right'
  },
  value:{
    color:'red'
  },
  first:{
    borderTopLeftRadius:14,
  },
  tab,
  last:{
    borderTopRightRadius:14,
  },
  active:{
    backgroundColor:'purple',
    ...tab
  },
  inactive:{
    backgroundColor:'white',
    ...tab
  },
  activeText:{color:'white',fontWeight:'500'},
  inactiveText:{
    color:'purple',
    fontWeight:'500'
  },
  container:{
  flex:1,
  justifyContent:'flex-start',
  padding:20,
  backgroundColor:'transparent',

  shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 5,
      shadowOpacity: .60
  },
  minicard:{
    borderRadius:4,
    overflow:'hidden',
    flex:1,
    flexDirection:'column',
    backgroundColor:'white',
    margin:5
  },
  card:{
    elevation:10,
    borderRadius:4,
    backgroundColor:'white',
    shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 5,
      shadowOpacity: .60
  },
  row:{
    flexDirection:'row'
  }
});
