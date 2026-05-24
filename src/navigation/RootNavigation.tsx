import { createNativeStackNavigator } from "@react-navigation/native-stack"
import RootStackParamList from "../types/navigation.types"
import Dashboard from "../features/dashboard";
import { NavigationContainer } from "@react-navigation/native";

const NATIVESTACK = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
    return (
        <NavigationContainer>
            <NATIVESTACK.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="dashboard">
                <NATIVESTACK.Screen name="dashboard" component={Dashboard} />
            </NATIVESTACK.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigation;