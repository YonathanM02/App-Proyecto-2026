import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  UserGroupIcon,
  MapPinIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/solid';
import Screen from '../../../components/screen';
import Titulo from '../../../components/titulo';
import Etiqueta from '../../../components/etiqueta';
import { useTheme } from '../../../hooks/useTheme';
import { useDatosClub } from '../../../hooks/useDatosClub';
import { formatearFechaCorta } from '../../../utils/formatoFechas';

export default function PanelControl() {
  const router = useRouter();
  const { colores } = useTheme();
  const { atletas, posiciones, catalogo, inventario, torneos, categoriasDeportivas } =
    useDatosClub();

  const atletasActivos = atletas.filter((a) => a.estatus === 1).length;
  const piezasDisponibles = inventario.filter((i) => i.estatus === 1).length;
  const piezasEnUso = inventario.filter((i) => i.estatus === 2).length;
  const torneosProximos = torneos.filter((t) => t.estatus === 1 || t.estatus === 2);

  const distribucionCategorias = categoriasDeportivas
    .map((cat) => ({
      nombre: cat.nombre,
      cantidad: atletas.filter(
        (a) => a.estatus === 1 && Number(a.codigo_categoria) === cat.codigo_categoria
      ).length,
    }))
    .filter((c) => c.cantidad > 0);

  const maximoCat = Math.max(1, ...distribucionCategorias.map((c) => c.cantidad));

  const tarjetasResumen = [
    {
      etiqueta: 'ATLETAS ACTIVOS',
      valor: atletasActivos,
      color: '#007bff',
      fondo: 'rgba(0, 123, 255, 0.14)',
      icono: <UserGroupIcon color="#007bff" size={22} />,
      ruta: '/(Drawer)/Administracion',
    },
    {
      etiqueta: 'POSICIONES',
      valor: posiciones.length,
      color: '#f59e0b',
      fondo: 'rgba(245, 158, 11, 0.16)',
      icono: <MapPinIcon color="#f59e0b" size={22} />,
      ruta: '/(Drawer)/Administracion/posiciones',
    },
    {
      etiqueta: 'INVENTARIO DISP.',
      valor: piezasDisponibles,
      color: '#32AF0A',
      fondo: 'rgba(50, 175, 10, 0.16)',
      icono: <ArchiveBoxIcon color="#32AF0A" size={22} />,
      ruta: '/(Drawer)/Inventario',
    },
    {
      etiqueta: 'TORNEOS',
      valor: torneos.length,
      color: '#ef4444',
      fondo: 'rgba(239, 68, 68, 0.14)',
      icono: <TrophyIcon color="#ef4444" size={22} />,
      ruta: '/(Drawer)/Competencias',
    },
  ];

  const accesos = [
    {
      titulo: 'Atletas',
      descripcion: `${atletas.length} registrados • ${atletasActivos} activos`,
      grupo: 'Administración',
      ruta: '/(Drawer)/Administracion',
      icono: <UserGroupIcon color={colores.primario} size={22} />,
    },
    {
      titulo: 'Posiciones',
      descripcion: `${posiciones.length} posiciones tácticas`,
      grupo: 'Administración',
      ruta: '/(Drawer)/Administracion/posiciones',
      icono: <MapPinIcon color={colores.primario} size={22} />,
    },
    {
      titulo: 'Inventario de Artículos',
      descripcion: `${inventario.length} piezas • ${piezasEnUso} en uso`,
      grupo: 'Inventario',
      ruta: '/(Drawer)/Inventario',
      icono: <ArchiveBoxIcon color={colores.primario} size={22} />,
    },
    {
      titulo: 'Catálogo',
      descripcion: `${catalogo.length} artículos configurados`,
      grupo: 'Inventario',
      ruta: '/(Drawer)/Inventario/catalogo',
      icono: <ClipboardDocumentListIcon color={colores.primario} size={22} />,
    },
    {
      titulo: 'Torneos',
      descripcion: `${torneosProximos.length} por disputar o en curso`,
      grupo: 'Competencias',
      ruta: '/(Drawer)/Competencias',
      icono: <TrophyIcon color={colores.primario} size={22} />,
    },
  ];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Titulo
          titulo="Panel de Control"
          subtitulo="Sistema de Gestión Hockey • Cannibals Lara"
        />

        <View style={estilos.grillaResumen}>
          {tarjetasResumen.map((item, idx) => (
            <Pressable
              key={idx}
              onPress={() => router.push(item.ruta)}
              style={[
                estilos.tarjetaResumen,
                {
                  backgroundColor: colores.tarjeta,
                  borderBottomColor: item.color,
                },
              ]}
            >
              <Text style={[estilos.resumenEtiqueta, { color: colores.textoClaro }]} numberOfLines={1}>
                {item.etiqueta}
              </Text>
              <View style={estilos.resumenCuerpo}>
                <View style={[estilos.resumenIcono, { backgroundColor: item.fondo }]}>
                  {item.icono}
                </View>
                <Text style={[estilos.resumenValor, { color: colores.textoPrincipal }]}>
                  {item.valor}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            estilos.tarjetaSeccion,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordeForm },
          ]}
        >
          <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
            Módulos Activos
          </Text>
          {accesos.map((mod, idx) => (
            <Pressable
              key={idx}
              onPress={() => router.push(mod.ruta)}
              style={[
                estilos.filaModulo,
                {
                  borderBottomColor: colores.bordeForm,
                  borderBottomWidth: idx === accesos.length - 1 ? 0 : 1,
                },
              ]}
            >
              <View style={[estilos.iconoModulo, { backgroundColor: colores.fondoTranslucido }]}>
                {mod.icono}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[estilos.tituloModulo, { color: colores.textoPrincipal }]}>
                  {mod.titulo}
                </Text>
                <Text style={[estilos.descModulo, { color: colores.textoClaro }]}>
                  {mod.descripcion}
                </Text>
              </View>
              <Etiqueta texto={mod.grupo} tipo="verde" style={{ marginRight: 6 }} />
              <ChevronRightIcon color={colores.textoClaro} size={18} />
            </Pressable>
          ))}
        </View>

        <View
          style={[
            estilos.tarjetaSeccion,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordeForm },
          ]}
        >
          <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
            Torneos Activos y Próximos
          </Text>
          {torneosProximos.length === 0 ? (
            <Text style={[estilos.vacioMini, { color: colores.textoClaro }]}>
              No hay torneos activos o próximos registrados.
            </Text>
          ) : (
            torneosProximos.map((t) => (
              <View
                key={t.codigo_torneo}
                style={[
                  estilos.itemTorneo,
                  {
                    backgroundColor: colores.fondoPrincipal,
                    borderColor: colores.bordePrimario,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[estilos.nombreTorneo, { color: colores.textoPrincipal }]}>
                    {t.nombre}
                  </Text>
                  <Text style={[estilos.metaTorneo, { color: colores.textoClaro }]}>
                    {formatearFechaCorta(t.fecha_inicio)} - {formatearFechaCorta(t.fecha_fin)} •{' '}
                    {t.ubicacion}
                  </Text>
                </View>
                <Etiqueta
                  texto={t.estatus === 2 ? 'En Curso' : 'Por Disputarse'}
                  tipo={t.estatus === 2 ? 'verde' : 'gris'}
                />
              </View>
            ))
          )}
        </View>

        <View
          style={[
            estilos.tarjetaSeccion,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordeForm },
          ]}
        >
          <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
            Atletas Activos por Categoría
          </Text>
          {distribucionCategorias.length === 0 ? (
            <Text style={[estilos.vacioMini, { color: colores.textoClaro }]}>
              Sin atletas activos registrados.
            </Text>
          ) : (
            distribucionCategorias.map((cat) => {
              const porcentaje = Math.round((cat.cantidad / maximoCat) * 100);
              return (
                <View key={cat.nombre} style={estilos.filaBarra}>
                  <View style={estilos.etiquetaBarra}>
                    <Text style={[estilos.nombreCat, { color: colores.textoPrincipal }]}>
                      {cat.nombre}
                    </Text>
                    <Text style={[estilos.conteoCat, { color: colores.primario }]}>
                      {cat.cantidad} {cat.cantidad === 1 ? 'atleta' : 'atletas'}
                    </Text>
                  </View>
                  <View style={[estilos.pistaBarra, { backgroundColor: colores.fondoContraste }]}>
                    <View
                      style={[
                        estilos.rellenoBarra,
                        { width: `${porcentaje}%`, backgroundColor: colores.primario },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 28,
  },
  grillaResumen: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  tarjetaResumen: {
    width: '48.2%',
    borderRadius: 12,
    padding: 14,
    borderBottomWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  resumenEtiqueta: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  resumenCuerpo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resumenIcono: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumenValor: {
    fontSize: 26,
    fontWeight: '900',
  },
  tarjetaSeccion: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  filaModulo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 10,
  },
  iconoModulo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloModulo: {
    fontSize: 14,
    fontWeight: '800',
  },
  descModulo: {
    fontSize: 12,
    marginTop: 1,
  },
  itemTorneo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  nombreTorneo: {
    fontSize: 14,
    fontWeight: '800',
  },
  metaTorneo: {
    fontSize: 12,
    marginTop: 2,
  },
  vacioMini: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  filaBarra: {
    marginBottom: 12,
  },
  etiquetaBarra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  nombreCat: {
    fontSize: 13,
    fontWeight: '700',
  },
  conteoCat: {
    fontSize: 12,
    fontWeight: '800',
  },
  pistaBarra: {
    height: 9,
    borderRadius: 6,
    overflow: 'hidden',
  },
  rellenoBarra: {
    height: '100%',
    borderRadius: 6,
  },
});
