import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, Text, Input, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/authStyles';
import ProfileForm from '../components/ProfileForm';
import axios from '../config/axios';
import { SINGUP_URL } from '../config/urls';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

export default function SignUpScreen(props) {
  const { navigation } = props;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(null);
  const [visible, setVisible] = useState(null);
  const [alert, setAlert] = useState({
    title: '',
    message: '',
    type: ''
  });

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);


  const _signUp = async (values) => {
    setLoading(true)
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType ? 'doctor' : 'normal',
      specialization: values.specialization,
      workingHours: values.workingHours,
      address: values.address,
      phone: values.phone,
      location: {
        latitude: location ? location.latitude : null,
        longitude: location ? location.longitude : null,
      }
    }
    try {
      const response = await axios.post(SINGUP_URL, body);
      setLoading(false)
      setAlert({ title: 'تسجيل ناجح', message: "لقد قمت بتسجيل حساب جديد, هل تريد المتابعة", type: 'question' })
      setVisible(true)
    } catch (e) {
      console.log(e.response);
      setLoading(false)
      setAlert({ title: 'تنبية', message: e.response.data.errors[0].message, type: 'alert' })
      setVisible(true)
    }
  }
  return (
    <ScrollView>
      <Loader title="جاري انشاء حساب جديد" loading={loading} />
      <Alert visible={visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setVisible(false)}
        onClick={() => {
          setVisible(false)
          navigation.navigate("Signin")
        }} />
      <View style={styles.container}>
        <Icon
          raised
          name='user'
          type='font-awesome'
          color="#f50"
          size={50} />
        <Text h4>تسجيل مستخدم جديد</Text>
      </View>

      <KeyboardAvoidingView
        behavior='padding' enabled>
        <View style={styles.container}>
          <ProfileForm 
          submit={(values) => _signUp(values)}
          user={null}
          disabled={false}
          checkBox={true}
          buttonTittle='تسجيل' />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>

  );
}


