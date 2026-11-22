import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import Screen from '../../components/screen';
import Input from '../../components/input';
import Selector from '../../components/selector';
import Boton from '../../components/boton';
import { useTheme } from '../../hooks/useTheme';
import { useDatosClub } from '../../hooks/useDatosClub';
import { TIPOS_SANGRE, TALLAS_UNIFORME } from '../../data/datosIniciales';
import { calcularEdadCalendario } from '../../utils/formatoFechas';
import { validarAtletaPaso } from '../../utils/validaciones';

const PASOS = ['Personales', 'Deportivos', 'Contacto', 'Salud'];

export default function FormularioAtleta() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colores } = useTheme();
  const { atletas, posiciones, categoriasDeportivas, guardarAtleta } = useDatosClub();

  const existente = useMemo(
    () => (id ? atletas.find((a) => a.id_atleta === Number(id)) : null),
    [id, atletas]
  );

  const [paso, setPaso] = useState(0);
  const [formulario, setFormulario] = useState({
    fecha_nac: existente?.fecha_nac || '',
    lugar_nacimiento: existente?.lugar_nacimiento || '',
    doc_identidad: existente?.doc_identidad || '',
    nombres: existente?.nombres || '',
    apellidos: existente?.apellidos || '',
    genero: existente?.genero || 'H',
    codigo_categoria: existente?.codigo_categoria ? String(existente.codigo_categoria) : '',
    codigo_posicion: existente?.codigo_posicion ? String(existente.codigo_posicion) : '',
    dorsal: existente?.dorsal || '',
    representante: existente?.representante || '',
    telefono: existente?.telefono || '',
    correo: existente?.correo || '',
    instagram: existente?.instagram || '',
    direccion: existente?.direccion || '',
    municipio: existente?.municipio || 'Iribarren',
    peso_kg: existente?.peso_kg || '',
    estatura_cm: existente?.estatura_cm || '',
    talla_pantalon: existente?.talla_pantalon || '',
    talla_franela: existente?.talla_franela || '',
    talla_calzado: existente?.talla_calzado || '',
    tipo_sangre: existente?.tipo_sangre || '',
    es_alergico: Boolean(existente?.es_alergico),
    alergias_detalle: existente?.alergias_detalle || '',
  });

  const cambiarCampo = (campo, valor) =>
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));

  const edadCalculada = calcularEdadCalendario(formulario.fecha_nac);

  const opcionesCategoria = categoriasDeportivas.map((c) => ({
    valor: String(c.codigo_categoria),
    texto: c.nombre,
    subtitulo: `Rango: ${c.edad_min} a ${c.edad_max} años`,
  }));

  const opcionesPosicion = posiciones.map((p) => ({
    valor: String(p.codigo_posicion),
    texto: p.nombre,
    subtitulo: `Abreviatura: ${p.abreviatura}`,
  }));

  const opcionesGenero = [
    { valor: 'H', texto: 'Hombre' },
    { valor: 'M', texto: 'Mujer' },
  ];

  const opcionesTallas = TALLAS_UNIFORME.map((t) => ({ valor: t, texto: t }));
  const opcionesSangre = TIPOS_SANGRE.map((t) => ({ valor: t, texto: t }));

  const avanzarPaso = () => {
    if (!validarAtletaPaso(paso, formulario)) return;
    setPaso((prev) => Math.min(PASOS.length - 1, prev + 1));
  };

  const guardarRegistro = () => {
    for (let i = 0; i < PASOS.length; i++) {
      if (!validarAtletaPaso(i, formulario)) {
        setPaso(i);
        return;
      }
    }

    guardarAtleta(
      {
        ...formulario,
        nombres: formulario.nombres.trim(),
        apellidos: formulario.apellidos.trim(),
        doc_identidad: formulario.doc_identidad.trim(),
        lugar_nacimiento: formulario.lugar_nacimiento.trim(),
        codigo_categoria: Number(formulario.codigo_categoria),
        codigo_posicion: Number(formulario.codigo_posicion),
        dorsal: formulario.dorsal.trim(),
        representante: formulario.representante.trim(),
        telefono: formulario.telefono.trim(),
        correo: formulario.correo.trim(),
        instagram: formulario.instagram.trim(),
        direccion: formulario.direccion.trim(),
        municipio: formulario.municipio.trim(),
        peso_kg: formulario.peso_kg.trim(),
        estatura_cm: formulario.estatura_cm.trim(),
        talla_calzado: formulario.talla_calzado.trim(),
        alergias_detalle: formulario.es_alergico ? formulario.alergias_detalle.trim() : '',
      },
      existente ? existente.id_atleta : null
    );

    Toast.show({
      type: 'success',
      text1: existente ? 'Atleta actualizado' : 'Atleta registrado',
      text2: `${formulario.nombres.trim()} ${formulario.apellidos.trim()} guardado correctamente.`,
    });
    router.back();
  };

  const progreso = Math.round(((paso + 1) / PASOS.length) * 100);

  return (
    <Screen>
      <Stack.Screen options={{ title: existente ? 'Modificar Atleta' : 'Nuevo Atleta' }} />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            estilos.tarjetaPasos,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordePrimario },
          ]}
        >
          <View style={estilos.cabeceraPasos}>
            <Text style={[estilos.contadorPaso, { color: colores.textoPrincipal }]}>
              Paso {paso + 1} de {PASOS.length}: {PASOS[paso]}
            </Text>
            <Text style={[estilos.porcentajePaso, { color: colores.primario }]}>
              {progreso}%
            </Text>
          </View>
          <View style={[estilos.pistaProgreso, { backgroundColor: colores.fondoContraste }]}>
            <View
              style={[
                estilos.rellenoProgreso,
                { width: `${progreso}%`, backgroundColor: colores.primario },
              ]}
            />
          </View>

          <View style={estilos.filaPestanas}>
            {PASOS.map((nombrePaso, idx) => {
              const activo = idx === paso;
              const completado = idx < paso;
              return (
                <Pressable
                  key={nombrePaso}
                  onPress={() => setPaso(idx)}
                  style={[
                    estilos.pestanaPaso,
                    {
                      backgroundColor: activo
                        ? colores.primario
                        : completado
                        ? colores.fondoTranslucido
                        : colores.fondoContraste,
                    },
                  ]}
                >
                  <Text
                    style={[
                      estilos.textoPestana,
                      {
                        color: activo
                          ? '#ffffff'
                          : completado
                          ? colores.primario
                          : colores.textoClaro,
                      },
                    ]}
                  >
                    {nombrePaso}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={[
            estilos.tarjetaForm,
            { backgroundColor: colores.tarjeta, borderColor: colores.bordeForm },
          ]}
        >
          {paso === 0 ? (
            <>
              <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
                Datos Personales
              </Text>
              <Input
                etiqueta="Fecha de Nacimiento *"
                placeholder="AAAA-MM-DD (Ej: 2011-12-07)"
                valor={formulario.fecha_nac}
                onChangeText={(v) => cambiarCampo('fecha_nac', v)}
                textoAyuda={
                  edadCalculada !== null
                    ? `Edad (Año Calendario): ${edadCalculada} años`
                    : 'Formato requerido: AAAA-MM-DD'
                }
              />
              <Input
                etiqueta="Lugar de Nacimiento *"
                placeholder="Ej: Barquisimeto"
                valor={formulario.lugar_nacimiento}
                onChangeText={(v) => cambiarCampo('lugar_nacimiento', v)}
              />
              <Input
                etiqueta="Documento de Identidad"
                placeholder="Ej: 33452109"
                valor={formulario.doc_identidad}
                onChangeText={(v) => cambiarCampo('doc_identidad', v)}
                tipoTeclado="numeric"
              />
              <Input
                etiqueta="Primer y Segundo Nombre *"
                placeholder="Ej: Diego Alexandro"
                valor={formulario.nombres}
                onChangeText={(v) => cambiarCampo('nombres', v)}
              />
              <Input
                etiqueta="Primer y Segundo Apellido *"
                placeholder="Ej: Reinoso Chirinos"
                valor={formulario.apellidos}
                onChangeText={(v) => cambiarCampo('apellidos', v)}
              />
              <Selector
                etiqueta="Género *"
                valor={formulario.genero}
                opciones={opcionesGenero}
                onChange={(v) => cambiarCampo('genero', v)}
              />
            </>
          ) : null}

          {paso === 1 ? (
            <>
              <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
                Datos Deportivos
              </Text>
              <Selector
                etiqueta="Categoría Deportiva *"
                placeholder="Seleccione categoría..."
                valor={formulario.codigo_categoria}
                opciones={opcionesCategoria}
                onChange={(v) => cambiarCampo('codigo_categoria', v)}
              />
              <Selector
                etiqueta="Posición Técnica *"
                placeholder="Seleccione posición..."
                valor={formulario.codigo_posicion}
                opciones={opcionesPosicion}
                onChange={(v) => cambiarCampo('codigo_posicion', v)}
              />
              <Input
                etiqueta="Número de Dorsal"
                placeholder="Ej: 19"
                valor={formulario.dorsal}
                onChangeText={(v) => cambiarCampo('dorsal', v)}
                tipoTeclado="numeric"
                textoAyuda="Opcional (0 al 99)"
              />
            </>
          ) : null}

          {paso === 2 ? (
            <>
              <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
                Datos de Contacto
              </Text>
              <Input
                etiqueta="Representante (Opcional)"
                placeholder="Nombre completo del representante"
                valor={formulario.representante}
                onChangeText={(v) => cambiarCampo('representante', v)}
              />
              <Input
                etiqueta="Teléfono"
                placeholder="Ej: 0414-5218934"
                valor={formulario.telefono}
                onChangeText={(v) => cambiarCampo('telefono', v)}
                tipoTeclado="phone-pad"
              />
              <Input
                etiqueta="Correo Electrónico"
                placeholder="Ej: atleta@cannibalslara.com"
                valor={formulario.correo}
                onChangeText={(v) => cambiarCampo('correo', v)}
                tipoTeclado="email-address"
              />
              <Input
                etiqueta="Instagram (Opcional)"
                placeholder="Ej: @diegoreinoso19"
                valor={formulario.instagram}
                onChangeText={(v) => cambiarCampo('instagram', v)}
              />
              <Input
                etiqueta="Dirección *"
                placeholder="Urbanización, calle y número"
                valor={formulario.direccion}
                onChangeText={(v) => cambiarCampo('direccion', v)}
                multilinea
              />
              <Input
                etiqueta="Municipio"
                placeholder="Ej: Iribarren"
                valor={formulario.municipio}
                onChangeText={(v) => cambiarCampo('municipio', v)}
              />
            </>
          ) : null}

          {paso === 3 ? (
            <>
              <Text style={[estilos.tituloSeccion, { color: colores.textoPrincipal }]}>
                Salud y Medidas
              </Text>
              <View style={estilos.dosColumnas}>
                <Input
                  etiqueta="Peso (kg)"
                  placeholder="Ej: 58.5"
                  valor={formulario.peso_kg}
                  onChangeText={(v) => cambiarCampo('peso_kg', v)}
                  tipoTeclado="numeric"
                  style={{ flex: 1 }}
                />
                <Input
                  etiqueta="Estatura (cm)"
                  placeholder="Ej: 169"
                  valor={formulario.estatura_cm}
                  onChangeText={(v) => cambiarCampo('estatura_cm', v)}
                  tipoTeclado="numeric"
                  style={{ flex: 1 }}
                />
              </View>
              <View style={estilos.dosColumnas}>
                <Selector
                  etiqueta="Talla Pantalón"
                  placeholder="Talla"
                  valor={formulario.talla_pantalon}
                  opciones={opcionesTallas}
                  onChange={(v) => cambiarCampo('talla_pantalon', v)}
                  style={{ flex: 1 }}
                />
                <Selector
                  etiqueta="Talla Franela"
                  placeholder="Talla"
                  valor={formulario.talla_franela}
                  opciones={opcionesTallas}
                  onChange={(v) => cambiarCampo('talla_franela', v)}
                  style={{ flex: 1 }}
                />
              </View>
              <View style={estilos.dosColumnas}>
                <Input
                  etiqueta="Talla Calzado"
                  placeholder="Ej: 41"
                  valor={formulario.talla_calzado}
                  onChangeText={(v) => cambiarCampo('talla_calzado', v)}
                  tipoTeclado="numeric"
                  style={{ flex: 1 }}
                />
                <Selector
                  etiqueta="Tipo de Sangre"
                  placeholder="Seleccione"
                  valor={formulario.tipo_sangre}
                  opciones={opcionesSangre}
                  onChange={(v) => cambiarCampo('tipo_sangre', v)}
                  style={{ flex: 1 }}
                />
              </View>

              <View
                style={[
                  estilos.filaInterruptor,
                  {
                    backgroundColor: colores.fondoPrincipal,
                    borderColor: colores.bordeForm,
                  },
                ]}
              >
                <Text style={[estilos.textoInterruptor, { color: colores.textoPrincipal }]}>
                  ¿Presenta alguna alergia?
                </Text>
                <Switch
                  value={formulario.es_alergico}
                  onValueChange={(v) => cambiarCampo('es_alergico', v)}
                  trackColor={{ false: colores.bordeForm, true: colores.primario }}
                  thumbColor="#ffffff"
                />
              </View>

              {formulario.es_alergico ? (
                <Input
                  etiqueta="Detalle de Alergias"
                  placeholder="Especifique medicamentos, alimentos o alergias..."
                  valor={formulario.alergias_detalle}
                  onChangeText={(v) => cambiarCampo('alergias_detalle', v)}
                  multilinea
                />
              ) : null}
            </>
          ) : null}

          <View style={estilos.filaBotones}>
            {paso > 0 ? (
              <Boton
                titulo="Anterior"
                variante="contorno"
                onPress={() => setPaso((p) => p - 1)}
                style={{ flex: 1 }}
              />
            ) : (
              <Boton
                titulo="Cancelar"
                variante="contorno"
                onPress={() => router.back()}
                style={{ flex: 1 }}
              />
            )}

            {paso < PASOS.length - 1 ? (
              <Boton titulo="Siguiente" onPress={avanzarPaso} style={{ flex: 1 }} />
            ) : (
              <Boton
                titulo={existente ? 'Guardar Cambios' : 'Registrar Atleta'}
                onPress={guardarRegistro}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 34,
  },
  tarjetaPasos: {
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 14,
    marginBottom: 14,
  },
  cabeceraPasos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contadorPaso: {
    fontSize: 13,
    fontWeight: '800',
  },
  porcentajePaso: {
    fontSize: 13,
    fontWeight: '800',
  },
  pistaProgreso: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  rellenoProgreso: {
    height: '100%',
    borderRadius: 4,
  },
  filaPestanas: {
    flexDirection: 'row',
    gap: 6,
  },
  pestanaPaso: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoPestana: {
    fontSize: 11,
    fontWeight: '800',
  },
  tarjetaForm: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  tituloSeccion: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 14,
  },
  dosColumnas: {
    flexDirection: 'row',
    gap: 10,
  },
  filaInterruptor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  textoInterruptor: {
    fontSize: 14,
    fontWeight: '700',
  },
  filaBotones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
});
