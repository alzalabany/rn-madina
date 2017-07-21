import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  card:{
    margin:10,
    padding:0,
    borderRadius:4,
    backgroundColor:'white',
    shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 5,
      shadowOpacity: .60,
      elevation:5
  },
  unread:{
    shadowColor: 'green',
  },

  btnText:{
    color:'purple'
  },
  input:{
    height:40,
    borderColor:'purple',
    borderWidth:1,
    marginVertical:5,
    borderRadius:5,
    paddingLeft:15,
    backgroundColor:'rgba(237,237,237,1)'
  },
  multi:{
    height:100,
  },
  label:{
    color:'purple',
    fontWeight:'500',
    fontSize:33,
    borderBottomWidth:1,
    borderBottomColor:'white',
    marginBottom:20,
    textAlign:'center'
  },
  btn:{
    margin:10,
    justifyContent:'center',
    alignItems:'center',
    height:50,
    borderWidth:1,
    borderColor:'purple',
    borderRadius:1,
    borderRadius:4,
    backgroundColor:'white'
  }
});
export default styles;