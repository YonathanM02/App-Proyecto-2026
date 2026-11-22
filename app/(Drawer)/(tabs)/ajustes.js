import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  SunIcon,
  MoonIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
} from 'react-native-heroicons/solid';
import Screen from '../../../components/screen';
import Titulo from '../../../components/titulo';
import Boton from '../../../components/boton';
import Logo from '../../../components/logo';
import { useTheme } from '../../../hooks/useTheme';
import { useDatosClub } from '../../../hooks/useDatosClub';

export default function Ajustes() {
  const router = useRouter();
  const { esOscuro, colores, cambiarTema } = useTheme();
  const { restaurarDatosPrueba } = useDatosClub();

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/(auth)/login');
  };

  const confirmarRestaurar = () => {
    Alert.alert(
      'Restaurar datos de prueba',
      '¿Deseas restablecer los registros iniciales de Cannibals Lara?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          onPress: () => {
            restaurarDatosPrueba();
            Toast.show({
              type: 'success',
              text1: 'Datos restaurados',
              text2: 'Se cargaron los registros iniciales del club.',
            });
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        <Titulo titulo="Ajustes" subtitulo="Preferencias visuales y sesión de usuario" />

        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordePrimario },
          ]}
        >
          <Logo tamano={78} mostrarLetras anchoLetras={145} />
          <Text style={[estilos.infoClub, { color: colores.textoClaro }]}>
            App-Proyecto-2026 • Sistema Hockey Cannibals Lara
          </Text>
          <Text style={[estilos.subClub, { color: colores.textoClaro }]}>
            Módulos: Atletas, Posiciones, Inventario de Artículos, Catálogo y Torneos
          </Text>
        </View>

        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordeForm },
          ]}
        >
          <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
            Apariencia
          </Text>
          <Text style={[estilos.descSeccion, { color: colores.textoClaro }]}>
            Alterna entre el tema claro y oscuro igual al sistema web de Cannibals Lara.
          </Text>
          <Boton
            titulo={esOscuro ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            onPress={cambiarTema}
            icono={
              esOscuro ? (
                <SunIcon color="#ffffff" size={18} />
              ) : (
                <MoonIcon color="#ffffff" size={18} />
              )
            }
          />
        </View>

        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordeForm },
          ]}
        >
          <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
            Datos y Sesión
          </Text>

          <Boton
            titulo="Restaurar Datos de Prueba"
            variante="contorno"
            onPress={confirmarRestaurar}
            icono={<ArrowPathIcon color={colores.primario} size={18} />}
            style={{ marginBottom: 12 }}
          />

          <Boton
            titulo="Cerrar Sesión"
            variante="peligro"
            onPress={cerrarSesion}
            icono={<ArrowRightOnRectangleIcon color="#ffffff" size={18} />}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 28,
  },
  tarjeta: {
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 18,
    marginTop: 14,
  },
  infoClub: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  subClub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  descSeccion: {
    fontSize: 13,
    marginBottom: 14,
  },
});
