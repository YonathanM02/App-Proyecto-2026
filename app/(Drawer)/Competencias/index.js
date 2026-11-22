import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  TrophyIcon,
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
import { formatearFechaLarga } from '../../../utils/formatoFechas';

function obtenerEtiquetaTorneo(estatus) {
  if (Number(estatus) === 1) return { texto: 'Por Disputarse', tipo: 'gris' };
  if (Number(estatus) === 2) return { texto: 'En Curso', tipo: 'verde' };
  return { texto: 'Finalizado', tipo: 'rojo' };
}

export default function GestionarTorneos() {
  const router = useRouter();
  const { colores } = useTheme();
  const { torneos, eliminarTorneo } = useDatosClub();

  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const torneosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return torneos.filter((t) => {
      if (filtro !== 'todos' && String(t.estatus) !== filtro) return false;
      if (!texto) return true;
      return (
        t.nombre.toLowerCase().includes(texto) ||
        t.ubicacion.toLowerCase().includes(texto)
      );
    });
  }, [torneos, busqueda, filtro]);

  const confirmarEliminar = (torneo) => {
    Alert.alert(
      'Eliminar Torneo',
      `¿Seguro que deseas eliminar el torneo "${torneo.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarTorneo(torneo.codigo_torneo);
            Toast.show({
              type: 'success',
              text1: 'Torneo eliminado',
              text2: `${torneo.nombre} fue eliminado correctamente.`,
            });
          },
        },
      ]
    );
  };

  const filtros = [
    { clave: 'todos', texto: 'Todos' },
    { clave: '1', texto: 'Por Disputarse' },
    { clave: '2', texto: 'En Curso' },
    { clave: '3', texto: 'Finalizados' },
  ];

  return (
    <Screen>
      <View style={estilos.controlesSuperiores}>
        <View style={estilos.filaCabecera}>
          <Titulo
            titulo="Torneos"
            subtitulo="Competencias y calendario deportivo"
            style={{ flex: 1 }}
          />
          <Boton
            titulo="Nuevo"
            onPress={() => router.push('/(forms)/formTorneo')}
            icono={<PlusIcon color="#ffffff" size={16} />}
            tamanoTexto={13}
          />
        </View>

        <Buscador
          placeholder="Buscar torneo por nombre o ubicación..."
          valor={busqueda}
          onChangeText={setBusqueda}
          style={{ marginTop: 10 }}
        />

        <View style={estilos.filaFiltros}>
          {filtros.map((f) => {
            const activo = filtro === f.clave;
            return (
              <Pressable
                key={f.clave}
                onPress={() => setFiltro(f.clave)}
                style={[
                  estilos.filtroBoton,
                  {
                    backgroundColor: activo ? colores.primario : colores.tarjeta,
                    borderColor: activo ? colores.primario : colores.bordeForm,
                  },
                ]}
              >
                <Text
                  style={[
                    estilos.filtroTexto,
                    { color: activo ? '#ffffff' : colores.textoPrincipal },
                  ]}
                >
                  {f.texto}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={torneosFiltrados}
        keyExtractor={(item) => String(item.codigo_torneo)}
        contentContainerStyle={estilos.contenidoLista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListaVacia
            icono={<TrophyIcon color={colores.primario} size={28} />}
            titulo="No se encontraron torneos"
            subtitulo="Registra un nuevo torneo para el calendario de Cannibals Lara."
          />
        }
        renderItem={({ item }) => {
          const infoEstatus = obtenerEtiquetaTorneo(item.estatus);
          const puedeEditar = Number(item.estatus) === 1 || Number(item.estatus) === 2;
          const acciones = puedeEditar
            ? [
                {
                  texto: 'Modificar',
                  color: colores.primario,
                  icono: <PencilSquareIcon color="#ffffff" size={15} />,
                  onPress: () =>
                    router.push({
                      pathname: '/(forms)/formTorneo',
                      params: { id: String(item.codigo_torneo) },
                    }),
                },
                ...(Number(item.estatus) === 1
                  ? [
                      {
                        texto: 'Eliminar',
                        color: colores.peligro,
                        icono: <TrashIcon color="#ffffff" size={15} />,
                        onPress: () => confirmarEliminar(item),
                      },
                    ]
                  : []),
              ]
            : [];

          return (
            <CardConsulta
              titulo={item.nombre}
              subtitulo={item.ubicacion}
              etiqueta={infoEstatus.texto}
              tipoEtiqueta={infoEstatus.tipo}
              icono={<TrophyIcon color={colores.primario} size={22} />}
              datos={[
                { etiqueta: 'Fecha Inicio', valor: formatearFechaLarga(item.fecha_inicio) },
                { etiqueta: 'Fecha Fin', valor: formatearFechaLarga(item.fecha_fin) },
              ]}
              acciones={acciones}
            />
          );
        }}
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
  filaFiltros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  filtroBoton: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filtroTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  contenidoLista: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
});
