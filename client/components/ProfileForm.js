import { Formik } from "formik";
import * as yup from 'yup';
import styles from "../styles/authStyles";
import { Text, Input, CheckBox, Button } from "react-native-elements";
import MapViewContainer from "./MapViewComponent";


export default function ProfileForm(props) {

    const validationSchema = yup.object().shape({
        name: yup.string().required('اسم المستخدم مطلوب'),
        email: yup.string().email('يجب ادخال البريد الاكتروني صحيح').required('االبريد الاكتروني مطلوب'),
        password: yup.string().required('كلمة المرور مطلوبة').min(5, "يجب ان تكون كلمة المرور اكثر من 5 احرف"),
        userType: yup.boolean(),
        specialization: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required('التخصص مطلوب')
        }),
        workingHours: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required('ساعات العمل مطلوبة')
        }),
        address: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required('العنوان مطلوب')
        }),
        phone: yup.string().when('userType', {
            is: true,
            then: (schema) => schema.required('رقم الهاتف مطلوب')
        })

    })

    return (
        <Formik
            initialValues={{
                name: props.user?.name || '',
                email: props.user?.email || '',
                password: '',
                userType: props.user?.userType == 'doctor',
                specialization: props.user?.profile?.specialization || '',
                workingHours: props.user?.profile?.workingHours || '',
                address: props.user?.profile?.address || '',
                phone: props.user?.profile?.phone || '',
                latitude: props.user?.latitude || null,
                longitude: props.user?.longitude || null
            }}
            validationSchema={validationSchema}
            onSubmit={values => props.submit(values)}
        >
            {
                ({ handleChange, handleBlur, handleSubmit, errors, values, setFieldValue, isValid }) => (
                    <>
                        <Input
                            name="name"
                            placeholder='الاسم'
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            style={[styles.textInput, errors.name && styles.errorInput]}
                        />
                        {errors.name && <Text style={styles.textError}>{errors.name}</Text>}
                        <Input
                            name="email"
                            placeholder='البريد الاكتروني'
                            disabled={props.disabled}
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
                        {
                            props.checkBox &&
                            <CheckBox
                            checked={values.userType}
                            title="أنا طبيب"
                            name="userType"
                            onPress={() => setFieldValue('userType', !values.userType)}
                            />
                        }
                        {values.userType && (
                            <>
                                <Input
                                    name="specialization"
                                    placeholder='التخصص'
                                    value={values.specialization}
                                    onChangeText={handleChange('specialization')}
                                    onBlur={handleBlur('specialization')}
                                    style={[styles.textInput, errors.specialization && styles.errorInput]}
                                />
                                {errors.specialization && <Text style={styles.textError}>{errors.specialization}</Text>}
                                <Input
                                    name="workingHours"
                                    placeholder='ساعات العمل'
                                    value={values.workingHours}
                                    onChangeText={handleChange('workingHours')}
                                    onBlur={handleBlur('workingHours')}
                                    style={[styles.textInput, errors.workingHours && styles.errorInput]}
                                />
                                {errors.workingHours && <Text style={styles.textError}>{errors.workingHours}</Text>}
                                <Input
                                    name="address"
                                    placeholder='العنوان'
                                    value={values.address}
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    style={[styles.textInput, errors.address && styles.errorInput]}
                                />
                                {errors.address && <Text style={styles.textError}>{errors.address}</Text>}
                                <Input
                                    name="phone"
                                    placeholder=' رقم الهاتف'
                                    value={values.phone}
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    style={[styles.textInput, errors.phone && styles.errorInput]}
                                />
                                {errors.phone && <Text style={styles.textError}>{errors.phone}</Text>}
                                {values.latitude &&
                                <MapViewContainer 
                                location={{latitude: values.latitude, longitude: values.longitude}}
                                lat={value => setFieldValue('latitude', value)}
                                lng={value => setFieldValue('longitude', value)}
                                 />
                                }
                            </>
                        )}
                       <Button title={props.buttonTittle} style={{ marginTop: '20px'}} onPress={handleSubmit} disabled={!isValid} />

                    </>
                )
            }

        </Formik>
    )
}