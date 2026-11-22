import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import Screen from '../../components/screen';
import Input from '../../components/input';
import Selector from '../../components/selector';
import Boton from '../../components/boton';
import { useTheme } from '../../hooks/useTheme';
import { useDatosClub } from '../../hooks/useDatosClub';
import { TALLAS_POR_TIPO } from '../../data/datosIniciales';
import { validarCatalogo } from '../../utils/validaciones';

export default function FormularioCatalogo() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colores } = useTheme();
  const { catalogo, categoriasCatalogo, posiciones, guardarCatalogo } = useDatosClub();

  const existente = useMemo(
    () => (id ? catalogo.find((c) => c.id_catalogo === Number(id)) : null),
    [id, catalogo]
  );

  const [nombre, setNombre] = useState(existente?.nombre || '');
  const [idCategoria, setIdCategoria] = useState(
    existente?.id_categoria ? String(existente.id_categoria) : ''
  );
  const [stockMinimo, setStockMinimo] = useState(
    existente?.stock_minimo !== undefined ? String(existente.stock_minimo) : '1'
  );
  const [talla, setTalla] = useState(existente?.talla || '');
  const [codigoPosicion, setCodigoPosicion] = useState(
    existente?.codigo_posicion ? String(existente.codigo_posicion) : ''
  );

  const categoriaSeleccionada = categoriasCatalogo.find(
    (c) => String(c.id_categoria) === String(idCategoria)
  );

  const opcionesCategoria = categoriasCatalogo.map((c) => ({
    valor: String(c.id_categoria),
    texto: c.nombre,
    subtitulo: `Tallas: ${c.tipo_talla}`,
  }));

  const opcionesTalla = useMemo(() => {
    const base = [{ valor: '', texto: 'Ninguna / N/A' }];
    if (!categoriaSeleccionada) return base;
    const lista = TALLAS_POR_TIPO[categoriaSeleccionada.tipo_talla] || [];
    return [...base, ...lista.map((t) => ({ valor: t, texto: t }))];
  }, [categoriaSeleccionada]);

  const opcionesPosicion = [
    { valor: '', texto: 'Todas las posiciones' },
    ...posiciones.map((p) => ({
      valor: String(p.codigo_posicion),
      texto: p.nombre,
      subtitulo: p.abreviatura,
    })),
  ];

  const cambiarCategoria = (nuevaCat) => {
    setIdCategoria(nuevaCat);
    setTalla('');
  };

  const guardarRegistro = () => {
    const registro = {
      nombre: nombre.trim(),
      id_categoria: idCategoria ? Number(idCategoria) : null,
      stock_minimo: Number(stockMinimo),
      talla: talla || '',
      codigo_posicion: codigoPosicion ? Number(codigoPosicion) : null,
    };

    if (!validarCatalogo({ ...registro, stock_minimo: stockMinimo })) return;

    guardarCatalogo(registro, existente ? existente.id_catalogo : null);
    Toast.show({
      type: 'success',
      text1: existente ? 'Catálogo actualizado' : 'Artículo agregado al catálogo',
      text2: `${registro.nombre} guardado correctamente.`,
    });
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen
        options={{ title: existente ? 'Modificar Artículo' : 'Nuevo Artículo de Catálogo' }}
      />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordePrimario },
          ]}
        >
          <Input
            etiqueta="Nombre del Artículo *"
            placeholder="Ej: Casco Con Rejillas, Stick Fibra"
            valor={nombre}
            onChangeText={setNombre}
          />

          <Selector
            etiqueta="Categoría *"
            placeholder="Seleccione una categoría..."
            valor={idCategoria}
            opciones={opcionesCategoria}
            onChange={cambiarCategoria}
          />

          <Input
            etiqueta="Stock Mínimo *"
            placeholder="Ej: 2"
            valor={stockMinimo}
            onChangeText={setStockMinimo}
            tipoTeclado="numeric"
          />

          <Selector
            etiqueta="Talla"
            placeholder={
              categoriaSeleccionada
                ? 'Seleccione talla...'
                : 'Seleccione una categoría primero'
            }
            valor={talla}
            opciones={opcionesTalla}
            onChange={setTalla}
            deshabilitado={!categoriaSeleccionada}
          />

          <Selector
            etiqueta="Posición Recomendada"
            placeholder="Todas las posiciones"
            valor={codigoPosicion}
            opciones={opcionesPosicion}
            onChange={setCodigoPosicion}
          />

          <View style={estilos.filaBotones}>
            <Boton
              titulo="Cancelar"
              variante="contorno"
              onPress={() => router.back()}
              style={{ flex: 1 }}
            />
            <Boton
              titulo={existente ? 'Guardar Cambios' : 'Registrar Artículo'}
              onPress={guardarRegistro}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    padding: 16,
  },
  tarjeta: {
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 18,
  },
  filaBotones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
});
