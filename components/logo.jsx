import { View, Image, StyleSheet } from 'react-native';

const logoMascota = require('../assets/logo.png');
const logoLetras = require('../assets/logo_2.png');

export default function Logo({
  tamano = 90,
  mostrarLetras = false,
  anchoLetras = 140,
  style,
}) {
  return (
    <View style={[estilos.contenedor, style]}>
      <Image
        source={logoMascota}
        style={{ width: tamano, height: tamano, resizeMode: 'contain' }}
      />
      {mostrarLetras ? (
        <Image
          source={logoLetras}
          style={{
            width: anchoLetras,
            height: anchoLetras * 0.34,
            resizeMode: 'contain',
            marginTop: 6,
          }}
        />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
