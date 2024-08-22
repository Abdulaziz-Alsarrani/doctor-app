import { View, ScrollView } from 'react-native';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { useEffect, useState } from 'react';
import styles from '../styles/profileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../config/axios';
import { PROFILE_URL, DELETE_PROFILE_URL } from '../config/urls';
import { Button, Text, Icon } from 'react-native-elements';
import { transformName } from "../config/helpers";

const ProfileScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState();
    const [alert, setAlert] = useState({
        title: '',
        message: '',
        type: ''
    });


    useEffect(() => {
        _getProfile()
    }, []);

    const _getProfile = async () => {
        setLoading(true)

        try {
            const token = await AsyncStorage.getItem("accessToken");
            axios.defaults.headers.common.Authorization = `JWT ${token}`
            const response = await axios.get(PROFILE_URL);

            setUser(response.data)
            setLoading(false)
        } catch (e) {
            setLoading(false)
            console.log(e);
        }
    }

    const handleAction = async () => {
        try {
            if (alert.type === 'delete') {
                const token = await AsyncStorage.getItem("accessToken");
                axios.defaults.headers.common.Authorization = `JWT ${token}`
                const response = await axios.delete(DELETE_PROFILE_URL);
                console.log(response);
            }
            await AsyncStorage.clear();
            props.navigation.navigate("Home")
        } catch (e) {
            console.log(e);
        }
    }
    const showAlert = (title, message, type) => {
        setAlert({
            title: title,
            message: message,
            type: type
        })
        setVisible(true)
    }

    const confirm = (type) => {
        showAlert(
            type === 'delete' ? 'انت على وشك حذف حسابك' : 'انت على وشك تسجيل الخروج',
            type === 'delete' ? 'هل تريد بالفعل حذف الحساب' : 'هل تريد بالفعل تسجبل الخروج',
            type
        )
    }

    const handleConfirm = async () => {
        setVisible(false);
        await handleAction();
    }


    return (
        <ScrollView>
            <View style={styles.container}>
                <Loader title="جاري تسجيل الدخول" loading={loading} />
                <Alert visible={visible}
                    title={alert.title}
                    message={alert.message}
                    type={alert.type}
                    onClick={handleConfirm}
                    onClose={() => setVisible(false)}  />
                {user &&
                    <View>
                        <View style={styles.userIconContainer}>
                            <View style={styles.userMetaContainer}>
                                <View style={styles.userAvtar}>
                                    <Text style={styles.userAvtarText}>
                                        {transformName(user.name)}
                                    </Text>
                                </View>
                                <View style={styles.userMeta}>
                                    <Text>{user.name}</Text>
                                    <Text>{user.email}</Text>
                                </View>
                            </View>
                            <View style={styles.iconsConatiner}>
                                <Icon
                                    name='edit'
                                    type='font-awesome'
                                    color="#f50"
                                    style={{ marginLeft: '5px' }} 
                                    onPress={() => props.navigation.navigate("UpdateProfile")}/>
                                <Icon
                                    name='trash'
                                    type='font-awesome'
                                    color="#f50"
                                    onPress={() => confirm('delete')} />
                            </View>
                        </View>
                        {user.profile &&
                            <View style={{ marginBottom: '50px' }}>
                                <View style={styles.doctorInfo}>
                                    <View style={styles.infoCell}>
                                        <Text style={styles.infoTitle}>الاختصاص</Text>
                                        <Text style={styles.infoText}>
                                            {user.profile.specialization}
                                        </Text>
                                    </View>
                                    <View style={styles.infoCell}>
                                        <Text style={styles.infoTitle}>العنوان</Text>
                                        <Text style={styles.infoText}>{user.profile.address}</Text>
                                    </View>
                                    <View style={styles.infoCell}>
                                        <Text style={styles.infoTitle}>ساعات العمل</Text>
                                        <Text style={styles.infoText}>
                                            {user.profile.workingHours}
                                        </Text>
                                    </View>
                                    <View style={styles.lastCell}>
                                        <Text style={styles.infoTitle}>رقم الهاتف</Text>
                                        <Text style={styles.infoText}>{user.profile.phone}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                        <Button buttonStyle={styles.logoutButton} title="تسجيل الخروج" onPress={() => confirm('logout')} />
                    </View>
                }
            </View>
        </ScrollView>
    )

}

export default ProfileScreen;