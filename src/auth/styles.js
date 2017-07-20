import {StyleSheet} from 'react-native'

export default StyleSheet.create({
  container:{flex:1,position:'relative',backgroundColor:'rgba(97,43,111,1)'},
  bar:{
    backgroundColor:'blue',
    height:2,
    flex:1,
  },
  btnbox:{
    display:'flex',
    paddingLeft:15,
    backgroundColor:'white',
    height:40,
    marginTop:10,
    borderRadius:40,
    alignItems:'center',
    flexDirection:'row'
  },
  btn:{borderRadius:10,height:50,marginTop:30},
  working:{},
  titleBox:{
    flexDirection:'row',
    elevation:4,
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    margin:0,
    fontSize:36,
    color:'white',
    textAlign:'center',
    marginBottom:20
  },
  shadow:{
    elevation:4,
    backgroundColor:'white',
    shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 5,
      shadowOpacity: 1.0
  },
  btnText:{
    color:'white',
    textAlign:'center',
    lineHeight:50,
    fontSize:20,
    fontWeight:'500'
  },
  box:{
    backgroundColor:'rgba(0,0,0,0.5)',
    marginHorizontal:15,
    zIndex:9,
    padding:20,
  }
});
