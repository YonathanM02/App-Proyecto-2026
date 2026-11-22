import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function useLogin() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const router = useRouter();

  const iniciarSesion = async () => {
    const usuarioLimpio = usuario.trim().toLowerCase();
    const claveLimpia = clave.trim();

    if (!usuarioLimpio || !claveLimpia) {
      Toast.show({
        type: 'error',
        text1: 'Campos requeridos',
        text2: 'Ingresa tu usuario o cédula y tu contraseña.',
      });
      return;
    }

    const usuariosValidos = ['admin', 'cannibals', '12345678'];
    if (usuariosValidos.includes(usuarioLimpio) && claveLimpia === '1234') {
      await AsyncStorage.setItem('userToken', 'sesion_activa');
      await AsyncStorage.setItem(
        'nombreUsuario',
        usuarioLimpio === '12345678' ? 'Administrador (12345678)' : 'Administrador Cannibals'
      );
      Toast.show({
        type: 'success',
        text1: '¡Bienvenido a Cannibals Lara!',
        text2: 'Sesión iniciada correctamente.',
      });
      router.replace('/(Drawer)/(tabs)');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Credenciales incorrectas',
        text2: 'El usuario o la contraseña son incorrectos. Verifica tus datos.',
      });
    }
  };

  const solicitarRecuperacion = () => {
    Toast.show({
      type: 'info',
      text1: 'Recuperación de acceso',
      text2: 'Comunícate con el administrador del club para restablecer tu contraseña.',
    });
  };

  return {
    usuario,
    setUsuario,
    clave,
    setClave,
    mostrarClave,
    setMostrarClave,
    iniciarSesion,
    solicitarRecuperacion,
  };
}
