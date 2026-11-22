import { Tabs } from 'expo-router';
import { UserGroupIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../../../hooks/useTheme';

export default function PestanasAdministracion() {
  const { colores } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 9,
          paddingTop: 6,
          backgroundColor: colores.barraTabsBg,
          borderTopWidth: 1,
          borderTopColor: colores.bordeForm,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoClaro,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Atletas',
          tabBarIcon: ({ color }) => <UserGroupIcon color={color} size={23} />,
        }}
      />
      <Tabs.Screen
        name="posiciones"
        options={{
          title: 'Posiciones',
          tabBarIcon: ({ color }) => <MapPinIcon color={color} size={23} />,
        }}
      />
    </Tabs>
  );
}
