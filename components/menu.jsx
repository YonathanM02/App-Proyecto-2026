import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../hooks/useTheme';

const logoMascota = require('../assets/logo.png');
const logoLetras = require('../assets/logo_2.png');

export default function MenuLateral(props) {
  const { esOscuro, colores, cambiarTema } = useTheme();
  const [nombreUsuario, setNombreUsuario] = useState('Administrador');
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('nombreUsuario')
      .then((nombre) => {
        if (nombre) setNombreUsuario(nombre);
      })
      .catch(() => {});
  }, []);

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/(auth)/login');
  };

  return (
    <View style={[estilos.raiz, { backgroundColor: colores.menuBg }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={estilos.contenidoScroll}
      >
        {/* Cabecera del menú lateral */}
        <View
          style={[
            estilos.cabecera,
            {
              backgroundColor: esOscuro ? '#172029' : '#1F283B',
              borderColor: colores.primario,
            },
          ]}
        >
          <View style={estilos.filaMarca}>
            <Image source={logoMascota} style={estilos.logo} />
            <View style={{ flex: 1 }}>
              <Image source={logoLetras} style={estilos.letras} />
              <Text style={estilos.subClub}>Sistema Hockey • Lara</Text>
            </View>
          </View>

          <View style={estilos.cajaUsuario}>
            <View style={[estilos.puntoActivo, { backgroundColor: colores.primarioBrillante }]} />
            <Text style={estilos.nombreUsuario} numberOfLines={1}>
              {nombreUsuario}
            </Text>
          </View>
        </View>

        <Text style={[estilos.tituloSeccion, { color: colores.textoClaro }]}>
          MÓDULOS DEL SISTEMA
        </Text>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Pie del menú: modo oscuro y salir */}
      <View
        style={[
          estilos.pie,
          {
            borderTopColor: colores.bordeForm,
            backgroundColor: colores.menuBg,
          },
        ]}
      >
        <Pressable
          onPress={cambiarTema}
          style={[estilos.btnPie, { backgroundColor: colores.fondoTranslucido }]}
        >
          {esOscuro ? (
            <SunIcon color={colores.primario} size={18} />
          ) : (
            <MoonIcon color={colores.primario} size={18} />
          )}
          <Text style={[estilos.textoPie, { color: colores.textoPrincipal }]}>
            {esOscuro ? 'Modo Claro' : 'Modo Oscuro'}
          </Text>
        </Pressable>

        <Pressable
          onPress={cerrarSesion}
          style={[estilos.btnPie, { backgroundColor: colores.peligroBg }]}
        >
          <ArrowRightOnRectangleIcon color={colores.peligro} size={18} />
          <Text style={[estilos.textoPie, { color: colores.peligro }]}>Salir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
  },
  contenidoScroll: {
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  cabecera: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  filaMarca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  letras: {
    width: 130,
    height: 40,
    resizeMode: 'contain',
  },
  subClub: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  cajaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12,
    gap: 8,
  },
  puntoActivo: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nombreUsuario: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  tituloSeccion: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 12,
    marginBottom: 6,
  },
  pie: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  btnPie: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  textoPie: {
    fontSize: 12,
    fontWeight: '700',
  },
});
