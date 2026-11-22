import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../hooks/useTheme';
import Boton from './boton';

export default function ModalPersonalizado({
  children,
  titulo,
  alCerrar,
  visible,
  alConfirmar,
  textoConfirmar = 'Guardar',
  varianteConfirmar = 'primario',
}) {
  const { colores } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={alCerrar}
    >
      <View style={estilos.fondo}>
        <View
          style={[
            estilos.modal,
            {
              backgroundColor: colores.tarjeta,
              borderColor: colores.bordePrimario,
            },
          ]}
        >
          <View style={[estilos.cabecera, { borderBottomColor: colores.bordeForm }]}>
            <Text style={[estilos.titulo, { color: colores.textoPrincipal }]}>{titulo}</Text>
            <Pressable
              onPress={alCerrar}
              style={[estilos.btnCerrar, { backgroundColor: colores.fondoTranslucido }]}
            >
              <XMarkIcon color={colores.primario} size={18} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.cuerpo}
          >
            {children}
          </ScrollView>

          {alConfirmar ? (
            <View style={[estilos.pie, { borderTopColor: colores.bordeForm }]}>
              <Boton
                titulo="Cancelar"
                variante="contorno"
                onPress={alCerrar}
                style={{ flex: 1 }}
              />
              <Boton
                titulo={textoConfirmar}
                variante={varianteConfirmar}
                onPress={alConfirmar}
                style={{ flex: 1 }}
              />
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modal: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '85%',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
  },
  btnCerrar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuerpo: {
    padding: 16,
  },
  pie: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
  },
});
