import { Drawer } from 'expo-router/drawer';
import { Image, View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  HomeIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
  TrophyIcon,
} from 'react-native-heroicons/solid';
import MenuLateral from '../../components/menu';
import { useTheme } from '../../hooks/useTheme';

const logoMascota = require('../../assets/logo.png');

export default function LayoutMenu() {
  const { esOscuro, colores } = useTheme();

  return (
    <>
      <StatusBar style={esOscuro ? 'light' : 'dark'} backgroundColor={colores.encabezadoBg} />

      <Drawer
        drawerContent={(props) => <MenuLateral {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: colores.encabezadoBg,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colores.bordeForm,
          },
          headerTintColor: colores.textoPrincipal,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 17,
          },
          headerRight: () => (
            <View style={estilos.insigniaHeader}>
              <Image source={logoMascota} style={estilos.logoHeader} />
              <Text style={[estilos.siglasClub, { color: colores.primario }]}>CL</Text>
            </View>
          ),
          drawerStyle: {
            backgroundColor: colores.menuBg,
            width: 285,
          },
          drawerActiveTintColor: '#ffffff',
          drawerInactiveTintColor: colores.textoPrincipal,
          drawerActiveBackgroundColor: colores.primario,
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: '700',
            marginLeft: -4,
          },
          drawerItemStyle: {
            borderRadius: 10,
            marginVertical: 3,
            paddingHorizontal: 4,
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'Panel de Control',
            drawerLabel: 'Panel de Control',
            drawerIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="Administracion"
          options={{
            title: 'Administración',
            drawerLabel: 'Administración (Atletas / Posiciones)',
            drawerIcon: ({ color, size }) => <UserGroupIcon color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="Inventario"
          options={{
            title: 'Inventario',
            drawerLabel: 'Inventario (Artículos / Catálogo)',
            drawerIcon: ({ color, size }) => <ArchiveBoxIcon color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="Competencias"
          options={{
            title: 'Competencias',
            drawerLabel: 'Competencias (Torneos)',
            drawerIcon: ({ color, size }) => <TrophyIcon color={color} size={size} />,
          }}
        />
      </Drawer>
    </>
  );
}

const estilos = StyleSheet.create({
  insigniaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    gap: 4,
  },
  logoHeader: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  siglasClub: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
