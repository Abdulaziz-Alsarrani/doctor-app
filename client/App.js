import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import DoctorScreen from './screens/Doctors';
import SignUpScreen from './screens/SignUp';
import SignInScreen from './screens/Signin';
import ProfileScreen from './screens/Profile';
import UpdateProfileScreen from './screens/UpdateProfile';
import useScript from './hooks/useScript';
import {GOOGLE_API_KEY} from '@env';

const Stack = createNativeStackNavigator();

export default function App() {
  if(Platform.OS == "web") {
    useScript(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`)
  }
  return (
   <NavigationContainer>
    <Stack.Navigator 
     screenOptions={{
      headerStyle: {
        backgroundColor: '#007bff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        textAlign: 'right'
      },
     }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Doctors" component={DoctorScreen} options={{title: "صفحة الأطباء"}} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{title: "تسجيل مستخدم جديد"}} />
        <Stack.Screen name="Signin" component={SignInScreen} options={{title: "تسجيل الدخول"}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{title: "صفحة المستخدم"}} /> 
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} options={{title: "صفحة تغديل البيانات"}} /> 
      </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
