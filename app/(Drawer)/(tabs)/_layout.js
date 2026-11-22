import { Tabs } from 'expo-router';
import { ChartBarSquareIcon, Cog6ToothIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../../../hooks/useTheme';

export default function PestanasInicio() {
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
          title: 'Panel',
          tabBarIcon: ({ color }) => <ChartBarSquareIcon color={color} size={23} />,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <Cog6ToothIcon color={color} size={23} />,
        }}
      />
    </Tabs>
  );
}
