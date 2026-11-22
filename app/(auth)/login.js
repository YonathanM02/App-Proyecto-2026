import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { EyeIcon, EyeSlashIcon, SunIcon, MoonIcon } from 'react-native-heroicons/solid';
import Input from '../../components/input';
import Boton from '../../components/boton';
import Screen from '../../components/screen';
import Logo from '../../components/logo';
import useLogin from '../../hooks/useLogin';
import { useTheme } from '../../hooks/useTheme';

export default function IniciarSesion() {
  const {
    usuario,
    setUsuario,
    clave,
    setClave,
    mostrarClave,
    setMostrarClave,
    iniciarSesion,
    solicitarRecuperacion,
  } = useLogin();
  const { esOscuro, colores, cambiarTema } = useTheme();

  return (
    <Screen conMargenSuperior style={{ backgroundColor: colores.fondoPrincipal }}>
      <StatusBar style={esOscuro ? 'light' : 'dark'} backgroundColor={colores.fondoPrincipal} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={estilos.barraSuperior}>
            <Pressable
              onPress={cambiarTema}
              style={[
                estilos.botonTema,
                {
                  backgroundColor: colores.tarjeta,
                  borderColor: colores.bordeForm,
                },
              ]}
            >
              {esOscuro ? (
                <SunIcon color={colores.primario} size={18} />
              ) : (
                <MoonIcon color={colores.primario} size={18} />
              )}
              <Text style={[estilos.textoTema, { color: colores.textoPrincipal }]}>
                {esOscuro ? 'Claro' : 'Oscuro'}
              </Text>
            </Pressable>
          </View>

          <View style={estilos.bloqueMarca}>
            <Logo tamano={108} mostrarLetras anchoLetras={185} />
            <Text style={[estilos.tituloBienvenida, { color: colores.textoPrincipal }]}>
              ¡Hola De Nuevo!
            </Text>
            <Text style={[estilos.subBienvenida, { color: colores.textoClaro }]}>
              Listos Para Trabajar
            </Text>
          </View>

          <View
            style={[
              estilos.tarjeta,
              {
                backgroundColor: colores.tarjeta,
                borderColor: colores.bordePrimario,
              },
            ]}
          >
            <View style={estilos.filaSeparador}>
              <View style={[estilos.linea, { backgroundColor: colores.bordeForm }]} />
              <Text style={[estilos.textoSeparador, { color: colores.textoClaro }]}>
                INICIO DE SESIÓN
              </Text>
              <View style={[estilos.linea, { backgroundColor: colores.bordeForm }]} />
            </View>

            <Input
              etiqueta="Cédula o Usuario"
              placeholder="Ingresa tu cédula o usuario"
              valor={usuario}
              onChangeText={setUsuario}
            />

            <Input
              etiqueta="Contraseña"
              placeholder="Ingresa tu contraseña"
              valor={clave}
              onChangeText={setClave}
              esClave={!mostrarClave}
              iconoDerecho={
                mostrarClave ? (
                  <EyeSlashIcon color={colores.textoClaro} size={20} />
                ) : (
                  <EyeIcon color={colores.textoClaro} size={20} />
                )
              }
              onPressIconoDerecho={() => setMostrarClave((prev) => !prev)}
            />

            <Boton
              titulo="Iniciar Sesión"
              onPress={iniciarSesion}
              ancho="100%"
              tamanoTexto={16}
              style={{ marginTop: 8 }}
            />

            <Pressable
              onPress={solicitarRecuperacion}
              style={estilos.enlaceRecuperacion}
            >
              <Text style={[estilos.textoRecuperacion, { color: colores.textoClaro }]}>
                ¿Has olvidado tu contraseña?
              </Text>
            </Pressable>
          </View>

          <Text style={[estilos.pieTexto, { color: colores.textoClaro }]}>
            Club de Hockey en Línea • Cannibals Lara
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 28,
    justifyContent: 'center',
  },
  barraSuperior: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  botonTema: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  textoTema: {
    fontSize: 12,
    fontWeight: '700',
  },
  bloqueMarca: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloBienvenida: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 12,
  },
  subBienvenida: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  filaSeparador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  linea: {
    flex: 1,
    height: 1,
  },
  textoSeparador: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginHorizontal: 12,
  },
  enlaceRecuperacion: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 4,
  },
  textoRecuperacion: {
    fontSize: 13,
    fontWeight: '700',
  },
  pieTexto: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 22,
  },
});
