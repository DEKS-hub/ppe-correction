import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  loginContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  text_header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#420475',
    marginBottom: 20,
  },
  action: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a',
  },
  smallIcon: {
    fontSize: 20,
    marginTop: 5,
  },
  button: {
    alignItems: 'center',
    marginTop: 20,
  },
  inBut: {
    width: 200,
    backgroundColor: '#420475',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  inBut2: {
    backgroundColor: '#420475',
    borderRadius: 50,
    padding: 15,
  },
  smallIcon2: {
    fontSize: 25,
  },
  bottomText: {
    marginTop: 5,
    fontWeight: '600',
    color: '#420475',
  },
});

export default styles;
