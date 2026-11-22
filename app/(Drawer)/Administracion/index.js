import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  UserCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilSquareIcon,
  XCircleIcon,
  ArrowPathIcon,
} from 'react-native-heroicons/solid';
import Screen from '../../../components/screen';
import Titulo from '../../../components/titulo';
import Boton from '../../../components/boton';
import Buscador from '../../../components/buscador';
import CardConsulta from '../../../components/cardConsulta';
import ListaVacia from '../../../components/listaVacia';
import { useTheme } from '../../../hooks/useTheme';
import { useDatosClub } from '../../../hooks/useDatosClub';
import { calcularEdadCalendario, formatearFechaLarga } from '../../../utils/formatoFechas';

function TarjetaDetalle({ etiqueta, valor, detalle, peligro, advertencia, colores }) {
  return (
    <View
      style={[
        estilos.tarjetaDetalle,
        { backgroundColor: colores.fondoContraste, borderColor: colores.bordeForm },
      ]}
    >
      <Text style={[estilos.detalleEtiqueta, { color: colores.textoClaro }]}>{etiqueta}</Text>
      <Text style={[estilos.detalleValor, { color: colores.textoPrincipal }]}>{valor}</Text>
      {detalle ? (
        <Text
          style={[
            estilos.detalleSub,
            {
              color: peligro
                ? colores.peligro
                : advertencia
                ? colores.advertencia
                : colores.textoClaro,
            },
          ]}
        >
          {detalle}
        </Text>
      ) : null}
    </View>
  );
}

export default function GestionarAtletas() {
  const router = useRouter();
  const { colores } = useTheme();
  const {
    atletas,
    posiciones,
    categoriasDeportivas,
    retirarAtleta,
    reinscribirAtleta,
  } = useDatosClub();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');

  const atletasFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return atletas
      .map((a) => {
        const cat = categoriasDeportivas.find(
          (c) => c.codigo_categoria === Number(a.codigo_categoria)
        );
        const pos = posiciones.find(
          (p) => p.codigo_posicion === Number(a.codigo_posicion)
        );
        const edad = calcularEdadCalendario(a.fecha_nac);
        const edadMin = cat?.edad_min ?? 0;
        const edadMax = cat?.edad_max ?? 99;
        const fueraDeRango = edad !== null && (edad < edadMin || edad > edadMax);
        return {
          ...a,
          nombre_categoria: cat?.nombre || 'Sin Categoría',
          edad_min: edadMin,
          edad_max: edadMax,
          nombre_posicion: pos?.nombre || 'Sin Posición',
          edad_calendario: edad,
          fueraDeRango,
        };
      })
      .filter((a) => {
        if (filtroEstatus !== 'todos' && String(a.estatus) !== filtroEstatus) {
          return false;
        }
        if (!texto) return true;
        return (
          `${a.nombres} ${a.apellidos}`.toLowerCase().includes(texto) ||
          String(a.doc_identidad || '').toLowerCase().includes(texto) ||
          a.nombre_categoria.toLowerCase().includes(texto) ||
          a.nombre_posicion.toLowerCase().includes(texto)
        );
      });
  }, [atletas, categoriasDeportivas, posiciones, busqueda, filtroEstatus]);

  const confirmarRetiro = (atleta) => {
    Alert.alert(
      'Retirar Atleta',
      `¿Deseas marcar como retirado a ${atleta.nombres} ${atleta.apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Retirar',
          style: 'destructive',
          onPress: () => {
            retirarAtleta(atleta.id_atleta, 'Retiro registrado desde la app móvil');
            Toast.show({
              type: 'info',
              text1: 'Atleta retirado',
              text2: `${atleta.nombres} ${atleta.apellidos} fue marcado como retirado.`,
            });
          },
        },
      ]
    );
  };

  const confirmarReinscribir = (atleta) => {
    Alert.alert(
      'Re-inscribir Atleta',
      `¿Deseas activar nuevamente a ${atleta.nombres} ${atleta.apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Re-inscribir',
          onPress: () => {
            reinscribirAtleta(atleta.id_atleta);
            Toast.show({
              type: 'success',
              text1: 'Atleta re-inscrito',
              text2: `${atleta.nombres} ${atleta.apellidos} se encuentra activo.`,
            });
          },
        },
      ]
    );
  };

  const filtros = [
    { clave: 'todos', texto: `Todos (${atletas.length})` },
    { clave: '1', texto: `Activos (${atletas.filter((a) => a.estatus === 1).length})` },
    { clave: '2', texto: `Retirados (${atletas.filter((a) => a.estatus === 2).length})` },
  ];

  return (
    <Screen>
      <View style={estilos.controlesSuperiores}>
        <View style={estilos.filaCabecera}>
          <Titulo titulo="Atletas" subtitulo="Administración deportiva del club" style={{ flex: 1 }} />
          <Boton
            titulo="Nuevo"
            onPress={() => router.push('/(forms)/formAtleta')}
            icono={<PlusIcon color="#ffffff" size={16} />}
            tamanoTexto={13}
          />
        </View>

        <Buscador
          placeholder="Buscar por nombre, cédula, categoría..."
          valor={busqueda}
          onChangeText={setBusqueda}
          style={{ marginTop: 10 }}
        />

        <View style={estilos.filaFiltros}>
          {filtros.map((f) => {
            const activo = filtroEstatus === f.clave;
            return (
              <Pressable
                key={f.clave}
                onPress={() => setFiltroEstatus(f.clave)}
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
        data={atletasFiltrados}
        keyExtractor={(item) => String(item.id_atleta)}
        contentContainerStyle={estilos.contenidoLista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListaVacia
            icono={<UserCircleIcon color={colores.primario} size={28} />}
            titulo="No se encontraron atletas"
            subtitulo="Registra un nuevo atleta o ajusta tu búsqueda."
          />
        }
        renderItem={({ item }) => {
          const esActivo = item.estatus === 1;
          const acciones = [
            {
              texto: 'Editar',
              color: colores.primario,
              icono: <PencilSquareIcon color="#ffffff" size={15} />,
              onPress: () =>
                router.push({
                  pathname: '/(forms)/formAtleta',
                  params: { id: String(item.id_atleta) },
                }),
            },
            esActivo
              ? {
                  texto: 'Retirar',
                  color: colores.peligro,
                  icono: <XCircleIcon color="#ffffff" size={15} />,
                  onPress: () => confirmarRetiro(item),
                }
              : {
                  texto: 'Re-inscribir',
                  color: colores.morado,
                  icono: <ArrowPathIcon color="#ffffff" size={15} />,
                  onPress: () => confirmarReinscribir(item),
                },
          ];

          return (
            <CardConsulta
              titulo={`${item.nombres} ${item.apellidos}`}
              subtitulo={`${item.nombre_categoria} • ${item.nombre_posicion}${item.dorsal ? ` • #${item.dorsal}` : ''}`}
              etiqueta={esActivo ? 'Activo' : 'Retirado'}
              tipoEtiqueta={esActivo ? 'verde' : 'rojo'}
              alerta={item.fueraDeRango}
              icono={
                item.fueraDeRango ? (
                  <ExclamationTriangleIcon color={colores.advertencia} size={24} />
                ) : (
                  <UserCircleIcon color={colores.primario} size={26} />
                )
              }
              datos={[
                { etiqueta: 'Documento', valor: item.doc_identidad || 'Sin Doc.' },
                {
                  etiqueta: 'Edad Cal.',
                  valor: item.edad_calendario !== null ? `${item.edad_calendario} años` : 'N/A',
                  resaltado: !item.fueraDeRango,
                  advertencia: item.fueraDeRango,
                },
                { etiqueta: 'Género', valor: item.genero === 'H' ? 'Hombre' : 'Mujer' },
              ]}
              acciones={acciones}
            >
              <View style={estilos.listaDetalles}>
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Categoría Deportiva"
                  valor={item.nombre_categoria}
                  detalle={
                    item.fueraDeRango
                      ? `Fuera de rango (${item.edad_min}-${item.edad_max} años)`
                      : `Rango: ${item.edad_min}-${item.edad_max} años`
                  }
                  advertencia={item.fueraDeRango}
                />
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Posición Técnica"
                  valor={item.nombre_posicion}
                  detalle={`Dorsal: ${item.dorsal || 'No Aplica'}`}
                />
                {item.representante ? (
                  <TarjetaDetalle
                    colores={colores}
                    etiqueta="Representante"
                    valor={item.representante}
                  />
                ) : null}
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Teléfono"
                  valor={item.telefono || 'No Aplica'}
                />
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Fecha de Nacimiento"
                  valor={formatearFechaLarga(item.fecha_nac)}
                  detalle={item.lugar_nacimiento || ''}
                />
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Físico"
                  valor={`${item.peso_kg || '0'} kg / ${item.estatura_cm || '0'} cm`}
                  detalle={`Tallas: P ${item.talla_pantalon || '-'} / F ${item.talla_franela || '-'} / C ${item.talla_calzado || '-'}`}
                />
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Dirección"
                  valor={item.direccion || 'No Aplica'}
                  detalle={item.municipio ? `Municipio ${item.municipio}` : ''}
                />
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Datos Médicos"
                  valor={`Sangre: ${item.tipo_sangre || 'No Aplica'}`}
                  detalle={
                    item.es_alergico
                      ? `Alergias: ${item.alergias_detalle || 'Sí'}`
                      : 'Alergias: Ninguna'
                  }
                  peligro={item.es_alergico}
                />
                <TarjetaDetalle
                  colores={colores}
                  etiqueta="Contacto Digital"
                  valor={item.correo || 'No Aplica'}
                  detalle={item.instagram ? `IG: ${item.instagram}` : ''}
                />
                {item.fecha_retiro && !esActivo ? (
                  <TarjetaDetalle
                    colores={colores}
                    etiqueta="Fecha de Retiro"
                    valor={formatearFechaLarga(item.fecha_retiro)}
                    detalle={`Motivo: ${item.motivo_retiro || 'No especificado'}`}
                    peligro
                  />
                ) : null}
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
  filaFiltros: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  filtroBoton: {
    paddingHorizontal: 12,
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
  listaDetalles: {
    gap: 8,
  },
  tarjetaDetalle: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  detalleEtiqueta: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  detalleValor: {
    fontSize: 13,
    fontWeight: '700',
  },
  detalleSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
