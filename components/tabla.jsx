import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { useTheme } from '../hooks/useTheme';

export default function Tabla({ encabezados = [], datos = [], anchoColumnas = [] }) {
  const { colores } = useTheme();

  return (
    <View style={estilos.contenedor}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Table borderStyle={{ borderWidth: 1, borderColor: colores.bordeForm }}>
          <Row
            data={encabezados}
            widthArr={anchoColumnas}
            style={[estilos.encabezado, { backgroundColor: colores.primario }]}
            textStyle={estilos.textoEncabezado}
          />
          <Rows
            data={datos}
            widthArr={anchoColumnas}
            style={[estilos.fila, { backgroundColor: colores.tarjeta }]}
            textStyle={[estilos.texto, { color: colores.textoPrincipal }]}
          />
        </Table>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingVertical: 8,
    width: '100%',
  },
  encabezado: {
    height: 42,
  },
  textoEncabezado: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 13,
  },
  fila: {
    height: 44,
  },
  texto: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});
