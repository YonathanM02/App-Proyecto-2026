import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { PlusIcon, TrashIcon, ArchiveBoxIcon } from 'react-native-heroicons/solid';
import Screen from '../../components/screen';
import Input from '../../components/input';
import Selector from '../../components/selector';
import Boton from '../../components/boton';
import Etiqueta from '../../components/etiqueta';
import { useTheme } from '../../hooks/useTheme';
import { useDatosClub } from '../../hooks/useDatosClub';

export default function FormularioInventario() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colores } = useTheme();
  const {
    inventario,
    catalogo,
    estadosFisicos,
    registrarLoteInventario,
    actualizarEstadoArticulo,
  } = useDatosClub();

  const piezaEditar = useMemo(
    () => (id ? inventario.find((item) => item.codigo_articulo === Number(id)) : null),
    [id, inventario]
  );

  const [estadoEditar, setEstadoEditar] = useState(
    piezaEditar?.id_estado ? String(piezaEditar.id_estado) : '1'
  );

  const [loteCatalogo, setLoteCatalogo] = useState('');
  const [loteCantidad, setLoteCantidad] = useState('1');
  const [loteEstado, setLoteEstado] = useState('1');
  const [colaLote, setColaLote] = useState([]);

  const opcionesCatalogo = catalogo.map((c) => ({
    valor: String(c.id_catalogo),
    texto: c.nombre,
    subtitulo: `Talla: ${c.talla || 'N/A'}`,
  }));

  const opcionesEstado = estadosFisicos.map((e) => ({
    valor: String(e.id_estado),
    texto: e.nombre,
  }));

  const agregarAlLote = () => {
    if (!loteCatalogo) {
      Toast.show({
        type: 'error',
        text1: 'Artículo requerido',
        text2: 'Selecciona un artículo del catálogo.',
      });
      return;
    }
    const cantidad = parseInt(loteCantidad, 10);
    if (Number.isNaN(cantidad) || cantidad < 1 || cantidad > 50) {
      Toast.show({
        type: 'error',
        text1: 'Cantidad inválida',
        text2: 'Ingresa una cantidad entre 1 y 50 unidades.',
      });
      return;
    }
    if (!loteEstado) {
      Toast.show({
        type: 'error',
        text1: 'Estado requerido',
        text2: 'Selecciona la condición inicial de las piezas.',
      });
      return;
    }

    const articulo = catalogo.find((c) => String(c.id_catalogo) === String(loteCatalogo));
    const estado = estadosFisicos.find((e) => String(e.id_estado) === String(loteEstado));

    setColaLote((prev) => [
      ...prev,
      {
        clave: `${Date.now()}_${Math.random()}`,
        id_catalogo: Number(loteCatalogo),
        nombre_articulo: articulo?.nombre || 'Artículo',
        cantidad,
        id_estado: Number(loteEstado),
        nombre_estado: estado?.nombre || 'Excelente',
      },
    ]);

    setLoteCantidad('1');
  };

  const quitarDeCola = (clave) => {
    setColaLote((prev) => prev.filter((item) => item.clave !== clave));
  };

  const guardarLote = () => {
    let lotesEnviar = colaLote;
    if (lotesEnviar.length === 0 && loteCatalogo) {
      const cantidad = parseInt(loteCantidad, 10);
      if (Number.isNaN(cantidad) || cantidad < 1 || cantidad > 50) {
        Toast.show({
          type: 'error',
          text1: 'Cantidad inválida',
          text2: 'Ingresa una cantidad entre 1 y 50 unidades.',
        });
        return;
      }
      lotesEnviar = [
        {
          id_catalogo: Number(loteCatalogo),
          cantidad,
          id_estado: Number(loteEstado || 1),
        },
      ];
    }

    if (lotesEnviar.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Lista vacía',
        text2: 'Agrega al menos un artículo para registrar en inventario.',
      });
      return;
    }

    const totalPiezas = lotesEnviar.reduce((acc, item) => acc + item.cantidad, 0);
    registrarLoteInventario(lotesEnviar);
    Toast.show({
      type: 'success',
      text1: 'Inventario actualizado',
      text2: `Se registraron ${totalPiezas} pieza(s) con códigos CL automáticos.`,
    });
    router.back();
  };

  const guardarEdicion = () => {
    actualizarEstadoArticulo(piezaEditar.codigo_articulo, Number(estadoEditar));
    Toast.show({
      type: 'success',
      text1: 'Condición actualizada',
      text2: `Se actualizó el estado físico de ${piezaEditar.codigo_club}.`,
    });
    router.back();
  };

  const totalUnidades = colaLote.reduce((acc, item) => acc + item.cantidad, 0);

  if (piezaEditar) {
    const articulo = catalogo.find((c) => c.id_catalogo === Number(piezaEditar.id_catalogo));
    return (
      <Screen>
        <Stack.Screen options={{ title: `Editar ${piezaEditar.codigo_club}` }} />
        <ScrollView contentContainerStyle={estilos.scroll}>
          <View
            style={[
              estilos.tarjeta,
              { backgroundColor: colores.tarjeta, borderColor: colores.bordePrimario },
            ]}
          >
            <Text style={[estilos.tituloEditar, { color: colores.textoPrincipal }]}>
              {articulo?.nombre || 'Artículo de Inventario'}
            </Text>
            <Text style={[estilos.subEditar, { color: colores.textoClaro }]}>
              Código del Club: {piezaEditar.codigo_club}
            </Text>

            <Selector
              etiqueta="Condición / Estado Físico *"
              valor={estadoEditar}
              opciones={opcionesEstado}
              onChange={setEstadoEditar}
              style={{ marginTop: 14 }}
            />

            <View style={estilos.filaBotones}>
              <Boton
                titulo="Cancelar"
                variante="contorno"
                onPress={() => router.back()}
                style={{ flex: 1 }}
              />
              <Boton titulo="Guardar Estado" onPress={guardarEdicion} style={{ flex: 1 }} />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Registrar Artículos (Lote)' }} />
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
          <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
            Agregar Piezas al Lote
          </Text>

          <Selector
            etiqueta="Artículo del Catálogo *"
            placeholder="Seleccione un artículo..."
            valor={loteCatalogo}
            opciones={opcionesCatalogo}
            onChange={setLoteCatalogo}
          />

          <View style={estilos.dosColumnas}>
            <Input
              etiqueta="Cantidad *"
              placeholder="1 - 50"
              valor={loteCantidad}
              onChangeText={setLoteCantidad}
              tipoTeclado="numeric"
              style={{ flex: 0.45 }}
            />
            <Selector
              etiqueta="Estado Inicial *"
              valor={loteEstado}
              opciones={opcionesEstado}
              onChange={setLoteEstado}
              style={{ flex: 0.55 }}
            />
          </View>

          <Boton
            titulo="Agregar a la Lista del Lote"
            variante="contorno"
            onPress={agregarAlLote}
            icono={<PlusIcon color={colores.primario} size={17} />}
          />
        </View>

        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordeForm, marginTop: 14 },
          ]}
        >
          <View style={estilos.cabeceraLote}>
            <View style={estilos.cabeceraLoteIzq}>
              <ArchiveBoxIcon color={colores.primario} size={18} />
              <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal, marginBottom: 0 }]}>
                Artículos a registrar
              </Text>
              <Etiqueta texto={`${totalUnidades} unds.`} tipo="verde" />
            </View>
            {colaLote.length > 0 ? (
              <Pressable onPress={() => setColaLote([])}>
                <Text style={[estilos.textoVaciar, { color: colores.peligro }]}>Vaciar</Text>
              </Pressable>
            ) : null}
          </View>

          {colaLote.length === 0 ? (
            <Text style={[estilos.textoVacio, { color: colores.textoClaro }]}>
              Agrega artículos arriba o selecciona uno y presiona "Guardar Inventario" directamente.
            </Text>
          ) : (
            colaLote.map((item) => (
              <View
                key={item.clave}
                style={[
                  estilos.filaLote,
                  {
                    backgroundColor: colores.fondoPrincipal,
                    borderColor: colores.bordeForm,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[estilos.nombreLote, { color: colores.textoPrincipal }]}>
                    {item.nombre_articulo}
                  </Text>
                  <Text style={[estilos.metaLote, { color: colores.textoClaro }]}>
                    {item.cantidad} unds. • Condición: {item.nombre_estado}
                  </Text>
                </View>
                <Pressable
                  onPress={() => quitarDeCola(item.clave)}
                  style={[estilos.btnQuitar, { backgroundColor: colores.peligroBg }]}
                >
                  <TrashIcon color={colores.peligro} size={16} />
                </Pressable>
              </View>
            ))
          )}

          <View style={estilos.filaBotones}>
            <Boton
              titulo="Cancelar"
              variante="contorno"
              onPress={() => router.back()}
              style={{ flex: 1 }}
            />
            <Boton titulo="Guardar Inventario" onPress={guardarLote} style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  tarjeta: {
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 16,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  tituloEditar: {
    fontSize: 18,
    fontWeight: '800',
  },
  subEditar: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  dosColumnas: {
    flexDirection: 'row',
    gap: 10,
  },
  cabeceraLote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cabeceraLoteIzq: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoVaciar: {
    fontSize: 12,
    fontWeight: '800',
  },
  textoVacio: {
    fontSize: 13,
    marginBottom: 14,
  },
  filaLote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  nombreLote: {
    fontSize: 14,
    fontWeight: '800',
  },
  metaLote: {
    fontSize: 12,
    marginTop: 2,
  },
  btnQuitar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filaBotones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
});
