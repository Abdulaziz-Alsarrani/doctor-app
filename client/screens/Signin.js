import { Formik } from "formik";
import * as yup from 'yup';
import styles from "../styles/authStyles";
import { Text, Input, Button } from "react-native-elements";
import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from '../config/axios';
import { SINGIN_URL } from '../config/urls';
import { useState } from 'react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen(props) {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(null);
    const [alert, setAlert] = useState({
        title: '',
        message: '',
        type: ''
    });

    const signInValidationSchema = yup.object().shape({
        email: yup.string().email('يجب ادخال البريد الاكتروني صحيح').required('االبريد الاكتروني مطلوب'),
        password: yup.string().required('كلمة المرور مطلوبة').min(5, "يجب ان تكون كلمة المرور اكثر من 5 احرف"),
    })

    const _signUp = async (values) => {
        setLoading(true)
        const body = {
            email: values.email,
            password: values.password
        }
        try {
            const response = await axios.post(SINGIN_URL, body);
            AsyncStorage.setItem("accessToken", response.data.accessToken);
            setLoading(false)
            props.navigation.navigate("Home")
        } catch (e) {
            setLoading(false)
            setAlert({ title: 'تنبية', message: e.response.data.message, type: 'alert' })
            setVisible(true)
        }
    }

    return (
        <ScrollView>
            <Loader title="جاري تسجيل الدخول" loading={loading} />
            <Alert visible={visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                onClose={() => setVisible(false)} />
            <View style={styles.container}>
                <Icon
                    raised
                    name='user'
                    type='font-awesome'
                    color="#f50"
                    size={50} />
                <Text h4>تسجيل ادخول</Text>
            </View>

            <KeyboardAvoidingView
                behavior='padding' enabled>
                <View style={styles.container}>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={signInValidationSchema}
                        onSubmit={values => { _signUp(values) }}
                    >

                        {
                            ({ handleChange, handleBlur, handleSubmit, errors, values, isValid }) => (
                                <>
                                    <Input
                                        name="email"
                                        placeholder='البريد الاكتروني'
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        keyboardType="email-address"
                                        style={[styles.textInput, errors.email && styles.errorInput]}
                                    />
                                    {errors.email && <Text style={styles.textError}>{errors.email}</Text>}
                                    <Input
                                        name="password"
                                        placeholder='كلمة المرور'
                                        secureTextEntry
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        style={[styles.textInput, errors.password && styles.errorInput]}
                                    />
                                    <Button title={'دخول'} style={{ marginTop: '20px' }} onPress={handleSubmit} disabled={!isValid} />

                                </>
                            )
                        }

                    </Formik>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}