import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  MapPinIcon,
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

export default function GestionarPosiciones() {
  const router = useRouter();
  const { colores } = useTheme();
  const { posiciones, atletas, eliminarPosicion } = useDatosClub();
  const [busqueda, setBusqueda] = useState('');

  const listaFiltrada = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return posiciones
      .map((pos) => ({
        ...pos,
        totalAtletas: atletas.filter(
          (a) => Number(a.codigo_posicion) === pos.codigo_posicion
        ).length,
      }))
      .filter((pos) => {
        if (!texto) return true;
        return (
          pos.nombre.toLowerCase().includes(texto) ||
          pos.abreviatura.toLowerCase().includes(texto) ||
          (pos.descripcion || '').toLowerCase().includes(texto)
        );
      });
  }, [posiciones, atletas, busqueda]);

  const confirmarEliminar = (pos) => {
    if (pos.totalAtletas > 0) {
      Toast.show({
        type: 'error',
        text1: 'Posición en uso',
        text2: `Hay ${pos.totalAtletas} atleta(s) asignados a ${pos.nombre}.`,
      });
      return;
    }

    Alert.alert(
      'Eliminar Posición',
      `¿Seguro que deseas eliminar la posición "${pos.nombre}" (${pos.abreviatura})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarPosicion(pos.codigo_posicion);
            Toast.show({
              type: 'success',
              text1: 'Posición eliminada',
              text2: `Se eliminó ${pos.nombre} correctamente.`,
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
            titulo="Posiciones"
            subtitulo="Roles técnicos dentro de la cancha"
            style={{ flex: 1 }}
          />
          <Boton
            titulo="Nueva"
            onPress={() => router.push('/(forms)/formPosicion')}
            icono={<PlusIcon color="#ffffff" size={16} />}
            tamanoTexto={13}
          />
        </View>

        <Buscador
          placeholder="Buscar por nombre o abreviatura..."
          valor={busqueda}
          onChangeText={setBusqueda}
          style={{ marginTop: 10 }}
        />
      </View>

      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => String(item.codigo_posicion)}
        contentContainerStyle={estilos.contenidoLista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListaVacia
            icono={<MapPinIcon color={colores.primario} size={28} />}
            titulo="No se encontraron posiciones"
            subtitulo="Agrega una nueva posición de juego para el club."
          />
        }
        renderItem={({ item }) => (
          <CardConsulta
            titulo={item.nombre}
            subtitulo={item.descripcion ? item.descripcion : 'Sin Descripción'}
            etiqueta={item.abreviatura.toUpperCase()}
            tipoEtiqueta="verde"
            icono={<MapPinIcon color={colores.primario} size={22} />}
            datos={[
              { etiqueta: 'Abreviatura', valor: item.abreviatura.toUpperCase(), resaltado: true },
              {
                etiqueta: 'Atletas Asignados',
                valor: `${item.totalAtletas} ${item.totalAtletas === 1 ? 'atleta' : 'atletas'}`,
              },
            ]}
            acciones={[
              {
                texto: 'Modificar',
                color: colores.primario,
                icono: <PencilSquareIcon color="#ffffff" size={15} />,
                onPress: () =>
                  router.push({
                    pathname: '/(forms)/formPosicion',
                    params: { id: String(item.codigo_posicion) },
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
