import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDownIcon, CheckIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../hooks/useTheme';

export default function Selector({
  etiqueta,
  placeholder = 'Seleccione...',
  valor,
  opciones = [],
  onChange,
  deshabilitado = false,
  style,
}) {
  const { colores } = useTheme();
  const [abierto, setAbierto] = useState(false);

  const opcionSeleccionada = opciones.find((op) => String(op.valor) === String(valor));

  return (
    <View style={[estilos.envoltura, style]}>
      {etiqueta ? (
        <Text style={[estilos.etiqueta, { color: colores.textoPrincipal }]}>{etiqueta}</Text>
      ) : null}

      <Pressable
        disabled={deshabilitado}
        onPress={() => setAbierto(true)}
        style={[
          estilos.disparador,
          {
            backgroundColor: deshabilitado ? colores.fondoContraste : colores.fondoForm,
            borderColor: colores.bordeForm,
            opacity: deshabilitado ? 0.6 : 1,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            estilos.textoDisparador,
            {
              color: opcionSeleccionada ? colores.textoPrincipal : colores.textoClaro,
            },
          ]}
        >
          {opcionSeleccionada ? opcionSeleccionada.texto : placeholder}
        </Text>
        <ChevronDownIcon color={colores.primario} size={18} />
      </Pressable>

      <Modal
        visible={abierto}
        transparent
        animationType="fade"
        onRequestClose={() => setAbierto(false)}
      >
        <Pressable style={estilos.fondoModal} onPress={() => setAbierto(false)}>
          <Pressable
            style={[
              estilos.ventana,
              {
                backgroundColor: colores.tarjeta,
                borderColor: colores.bordePrimario,
              },
            ]}
            onPress={() => {}}
          >
            <View style={[estilos.cabecera, { borderBottomColor: colores.bordeForm }]}>
              <Text style={[estilos.tituloVentana, { color: colores.textoPrincipal }]}>
                {etiqueta || 'Seleccionar opción'}
              </Text>
              <Pressable onPress={() => setAbierto(false)} hitSlop={8}>
                <XMarkIcon color={colores.textoClaro} size={22} />
              </Pressable>
            </View>

            <FlatList
              data={opciones}
              keyExtractor={(item, idx) => `${String(item.valor)}_${idx}`}
              style={estilos.lista}
              renderItem={({ item }) => {
                const seleccionado = String(item.valor) === String(valor);
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.valor);
                      setAbierto(false);
                    }}
                    style={[
                      estilos.opcionFila,
                      {
                        backgroundColor: seleccionado ? colores.fondoTranslucido : 'transparent',
                        borderBottomColor: colores.bordeForm,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          estilos.opcionTexto,
                          {
                            color: seleccionado ? colores.primario : colores.textoPrincipal,
                            fontWeight: seleccionado ? '700' : '500',
                          },
                        ]}
                      >
                        {item.texto}
                      </Text>
                      {item.subtitulo ? (
                        <Text style={[estilos.opcionSub, { color: colores.textoClaro }]}>
                          {item.subtitulo}
                        </Text>
                      ) : null}
                    </View>
                    {seleccionado ? <CheckIcon color={colores.primario} size={18} /> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  envoltura: {
    width: '100%',
    marginBottom: 12,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginLeft: 2,
  },
  disparador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  textoDisparador: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    marginRight: 8,
  },
  fondoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  ventana: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '70%',
    borderRadius: 14,
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
  tituloVentana: {
    fontSize: 16,
    fontWeight: '800',
  },
  lista: {
    flexGrow: 0,
  },
  opcionFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
  },
  opcionTexto: {
    fontSize: 15,
  },
  opcionSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
