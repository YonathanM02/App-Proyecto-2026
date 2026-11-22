import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../hooks/useTheme';

export default function InicioRedireccion() {
  const { colores } = useTheme();
  const [destino, setDestino] = useState(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setDestino(token ? '/(Drawer)/(tabs)' : '/(auth)/login');
      } catch (_err) {
        setDestino('/(auth)/login');
      }
    };
    verificarSesion();
  }, []);

  if (!destino) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colores.fondoPrincipal,
        }}
      >
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return <Redirect href={destino} />;
}
