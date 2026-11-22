import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from 'react-native-heroicons/solid';
import Screen from '../../../components/screen';
import Titulo from '../../../components/titulo';
import Boton from '../../../components/boton';
import Buscador from '../../../components/buscador';
import CardConsulta from '../../../components/cardConsulta';
import ListaVacia from '../../../components/listaVacia';
import { useTheme } from '../../../hooks/useTheme';
import { useDatosClub } from '../../../hooks/useDatosClub';

export default function GestionarCatalogo() {
  const router = useRouter();
  const { colores } = useTheme();
  const {
    catalogo,
    categoriasCatalogo,
    posiciones,
    inventario,
    eliminarCatalogo,
  } = useDatosClub();
  const [busqueda, setBusqueda] = useState('');

  const articulos = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return catalogo
      .map((item) => {
        const cat = categoriasCatalogo.find(
          (c) => c.id_categoria === Number(item.id_categoria)
        );
        const pos = posiciones.find(
          (p) => p.codigo_posicion === Number(item.codigo_posicion)
        );
        const piezasActuales = inventario.filter(
          (inv) => inv.id_catalogo === item.id_catalogo && inv.estatus !== 3
        ).length;
        return {
          ...item,
          categoria_nombre: cat?.nombre || 'Sin Categoría',
          posicion_nombre: pos?.nombre || 'Todas',
          piezasActuales,
        };
      })
      .filter((item) => {
        if (!texto) return true;
        return (
          item.nombre.toLowerCase().includes(texto) ||
          item.categoria_nombre.toLowerCase().includes(texto) ||
          String(item.talla || '').toLowerCase().includes(texto) ||
          item.posicion_nombre.toLowerCase().includes(texto)
        );
      });
  }, [catalogo, categoriasCatalogo, posiciones, inventario, busqueda]);

  const confirmarEliminar = (item) => {
    Alert.alert(
      'Eliminar del Catálogo',
      `¿Deseas eliminar "${item.nombre}" del catálogo?${
        item.piezasActuales > 0
          ? ` Esto también eliminará ${item.piezasActuales} pieza(s) vinculadas en inventario.`
          : ''
      }`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarCatalogo(item.id_catalogo);
            Toast.show({
              type: 'success',
              text1: 'Artículo eliminado',
              text2: `${item.nombre} fue retirado del catálogo.`,
            });
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={estilos.controlesSuperiores}>
        <View style={estilos.filaCabecera}>
          <Titulo
            titulo="Catálogo"
            subtitulo="Definición de equipamiento y tallas"
            style={{ flex: 1 }}
          />
          <Boton
            titulo="Nuevo"
            onPress={() => router.push('/(forms)/formCatalogo')}
            icono={<PlusIcon color="#ffffff" size={16} />}
            tamanoTexto={13}
          />
        </View>

        <Buscador
          placeholder="Buscar artículo, categoría o talla..."
          valor={busqueda}
          onChangeText={setBusqueda}
          style={{ marginTop: 10 }}
        />
      </View>

      <FlatList
        data={articulos}
        keyExtractor={(item) => String(item.id_catalogo)}
        contentContainerStyle={estilos.contenidoLista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListaVacia
            icono={<ClipboardDocumentListIcon color={colores.primario} size={28} />}
            titulo="No se encontraron artículos"
            subtitulo="Agrega un nuevo artículo al catálogo del club."
          />
        }
        renderItem={({ item }) => (
          <CardConsulta
            titulo={item.nombre}
            subtitulo={item.categoria_nombre}
            etiqueta={`${item.piezasActuales} en stock`}
            tipoEtiqueta={item.piezasActuales < item.stock_minimo ? 'amarillo' : 'verde'}
            icono={<ClipboardDocumentListIcon color={colores.primario} size={22} />}
            datos={[
              { etiqueta: 'Talla', valor: item.talla || 'N/A' },
              { etiqueta: 'Stock Mín.', valor: `${item.stock_minimo} unds.`, resaltado: true },
              { etiqueta: 'Posición', valor: item.posicion_nombre },
            ]}
            acciones={[
              {
                texto: 'Modificar',
                color: colores.primario,
                icono: <PencilSquareIcon color="#ffffff" size={15} />,
                onPress: () =>
                  router.push({
                    pathname: '/(forms)/formCatalogo',
                    params: { id: String(item.id_catalogo) },
                  }),
              },
              {
                texto: 'Eliminar',
                color: colores.peligro,
                icono: <TrashIcon color="#ffffff" size={15} />,
                onPress: () => confirmarEliminar(item),
              },
            ]}
          />
        )}
      />
    </Screen>
  );
}

const estilos = StyleSheet.create({
  controlesSuperiores: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  filaCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  contenidoLista: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
});
