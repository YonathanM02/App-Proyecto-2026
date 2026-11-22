import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  ArchiveBoxIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from 'react-native-heroicons/solid';
import Screen from '../../../components/screen';
import Titulo from '../../../components/titulo';
import Boton from '../../../components/boton';
import Buscador from '../../../components/buscador';
import CardConsulta from '../../../components/cardConsulta';
import Etiqueta from '../../../components/etiqueta';
import ListaVacia from '../../../components/listaVacia';
import { useTheme } from '../../../hooks/useTheme';
import { useDatosClub } from '../../../hooks/useDatosClub';

function obtenerEstatusPieza(estatus) {
  if (estatus === 1) return { texto: 'Disponible', tipo: 'verde' };
  if (estatus === 2) return { texto: 'En Uso', tipo: 'amarillo' };
  if (estatus === 3) return { texto: 'Retirado', tipo: 'rojo' };
  return { texto: 'Inactivo', tipo: 'rojo' };
}

function obtenerTipoCondicion(nivel) {
  if (nivel === 1) return 'verde';
  if (nivel === 2) return 'amarillo';
  return 'rojo';
}

export default function GestionarInventario() {
  const router = useRouter();
  const { colores } = useTheme();
  const {
    inventario,
    catalogo,
    categoriasCatalogo,
    estadosFisicos,
    cambiarEstatusArticulo,
  } = useDatosClub();

  const [busqueda, setBusqueda] = useState('');

  const grupos = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const mapa = new Map();

    inventario.forEach((pieza) => {
      const articuloCat = catalogo.find((c) => c.id_catalogo === Number(pieza.id_catalogo));
      if (!articuloCat) return;
      const categoria = categoriasCatalogo.find(
        (cc) => cc.id_categoria === Number(articuloCat.id_categoria)
      );
      const estado = estadosFisicos.find((e) => e.id_estado === Number(pieza.id_estado));

      const piezaCompleta = {
        ...pieza,
        estado_fisico: estado?.nombre || 'Excelente',
        nivel_estado: estado?.nivel_estado || 1,
      };

      if (!mapa.has(articuloCat.id_catalogo)) {
        mapa.set(articuloCat.id_catalogo, {
          id_catalogo: articuloCat.id_catalogo,
          articulo: articuloCat.nombre,
          talla: articuloCat.talla || 'N/A',
          stock_minimo: articuloCat.stock_minimo ?? 0,
          categoria: categoria?.nombre || 'General',
          piezas: [],
        });
      }
      mapa.get(articuloCat.id_catalogo).piezas.push(piezaCompleta);
    });

    return Array.from(mapa.values()).filter((grupo) => {
      if (!texto) return true;
      const coincideGrupo =
        grupo.articulo.toLowerCase().includes(texto) ||
        grupo.categoria.toLowerCase().includes(texto);
      const coincidePieza = grupo.piezas.some((p) =>
        String(p.codigo_club || '').toLowerCase().includes(texto)
      );
      return coincideGrupo || coincidePieza;
    });
  }, [inventario, catalogo, categoriasCatalogo, estadosFisicos, busqueda]);

  const confirmarRetiroPieza = (pieza) => {
    Alert.alert(
      'Retirar Artículo',
      `¿Deseas retirar la pieza ${pieza.codigo_club} del inventario activo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Retirar',
          style: 'destructive',
          onPress: () => {
            cambiarEstatusArticulo(pieza.codigo_articulo, 3);
            Toast.show({
              type: 'info',
              text1: 'Artículo retirado',
              text2: `Pieza ${pieza.codigo_club} marcada como retirada.`,
            });
          },
        },
      ]
    );
  };

  const confirmarReincorporar = (pieza) => {
    Alert.alert(
      'Reincorporar Artículo',
      `¿Deseas reincorporar la pieza ${pieza.codigo_club} como disponible?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reincorporar',
          onPress: () => {
            cambiarEstatusArticulo(pieza.codigo_articulo, 1);
            Toast.show({
              type: 'success',
              text1: 'Artículo reincorporado',
              text2: `Pieza ${pieza.codigo_club} está disponible nuevamente.`,
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
            titulo="Inventario de Artículos"
            subtitulo="Piezas agrupadas por catálogo y código del club"
            style={{ flex: 1 }}
          />
          <Boton
            titulo="Registrar"
            onPress={() => router.push('/(forms)/formInventario')}
            icono={<PlusIcon color="#ffffff" size={16} />}
            tamanoTexto={13}
          />
        </View>

        <Buscador
          placeholder="Buscar artículo, categoría o código CL-..."
          valor={busqueda}
          onChangeText={setBusqueda}
          style={{ marginTop: 10 }}
        />
      </View>

      <FlatList
        data={grupos}
        keyExtractor={(item) => String(item.id_catalogo)}
        contentContainerStyle={estilos.contenidoLista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListaVacia
            icono={<ArchiveBoxIcon color={colores.primario} size={28} />}
            titulo="No hay artículos en inventario"
            subtitulo="Registra un nuevo lote de piezas desde el botón Registrar."
          />
        }
        renderItem={({ item }) => {
          const disponibles = item.piezas.filter((p) => p.estatus === 1).length;
          const enUso = item.piezas.filter((p) => p.estatus === 2).length;
          const stockBajo = disponibles < item.stock_minimo;

          return (
            <CardConsulta
              titulo={item.articulo}
              subtitulo={`Categoría: ${item.categoria} • Talla: ${item.talla}`}
              etiqueta={`${item.piezas.length} unds.`}
              tipoEtiqueta={stockBajo ? 'amarillo' : 'verde'}
              alerta={stockBajo}
              icono={
                <ArchiveBoxIcon
                  color={stockBajo ? colores.advertencia : colores.primario}
                  size={22}
                />
              }
              datos={[
                {
                  etiqueta: 'Disponibles',
                  valor: `${disponibles} unds.`,
                  resaltado: !stockBajo,
                  advertencia: stockBajo,
                },
                { etiqueta: 'En Uso', valor: `${enUso} unds.` },
                { etiqueta: 'Stock Mín.', valor: `${item.stock_minimo} unds.` },
              ]}
            >
              <View style={estilos.subLista}>
                {item.piezas.map((pieza) => {
                  const infoEstatus = obtenerEstatusPieza(pieza.estatus);
                  const tipoCondicion = obtenerTipoCondicion(pieza.nivel_estado);
                  return (
                    <View
                      key={pieza.codigo_articulo}
                      style={[
                        estilos.filaPieza,
                        {
                          backgroundColor: colores.tarjeta,
                          borderColor: colores.bordeForm,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[estilos.codigoPieza, { color: colores.textoPrincipal }]}>
                          Código: {pieza.codigo_club}
                        </Text>
                        <View style={estilos.filaEtiquetas}>
                          <Etiqueta texto={pieza.estado_fisico} tipo={tipoCondicion} />
                          <Etiqueta texto={infoEstatus.texto} tipo={infoEstatus.tipo} />
                        </View>
                      </View>

                      <View style={estilos.accionesPieza}>
                        <Pressable
                          onPress={() =>
                            router.push({
                              pathname: '/(forms)/formInventario',
                              params: { id: String(pieza.codigo_articulo) },
                            })
                          }
                          style={[estilos.btnMini, { backgroundColor: colores.primario }]}
                        >
                          <PencilSquareIcon color="#ffffff" size={16} />
                        </Pressable>

                        {pieza.estatus === 1 ? (
                          <Pressable
                            onPress={() => confirmarRetiroPieza(pieza)}
                            style={[estilos.btnMini, { backgroundColor: colores.peligro }]}
                          >
                            <TrashIcon color="#ffffff" size={16} />
                          </Pressable>
                        ) : null}

                        {pieza.estatus === 3 ? (
                          <Pressable
                            onPress={() => confirmarReincorporar(pieza)}
                            style={[estilos.btnMini, { backgroundColor: colores.azul }]}
                          >
                            <ArrowPathIcon color="#ffffff" size={16} />
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                  );
                })}
              </View>
            </CardConsulta>
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
  contenidoLista: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  subLista: {
    gap: 8,
  },
  filaPieza: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  codigoPieza: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  filaEtiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  accionesPieza: {
    flexDirection: 'row',
    gap: 6,
  },
  btnMini: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
