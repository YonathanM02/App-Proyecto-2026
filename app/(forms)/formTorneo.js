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
import { validarTorneo } from '../../utils/validaciones';

const OPCIONES_ESTATUS = [
  { valor: '1', texto: 'Por Disputarse' },
  { valor: '2', texto: 'En Curso' },
  { valor: '3', texto: 'Finalizado' },
];

export default function FormularioTorneo() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colores } = useTheme();
  const { torneos, guardarTorneo } = useDatosClub();

  const existente = useMemo(
    () => (id ? torneos.find((t) => t.codigo_torneo === Number(id)) : null),
    [id, torneos]
  );

  const [nombre, setNombre] = useState(existente?.nombre || '');
  const [estatus, setEstatus] = useState(
    existente?.estatus ? String(existente.estatus) : '1'
  );
  const [fechaInicio, setFechaInicio] = useState(existente?.fecha_inicio || '');
  const [fechaFin, setFechaFin] = useState(existente?.fecha_fin || '');
  const [ubicacion, setUbicacion] = useState(existente?.ubicacion || '');

  const guardarRegistro = () => {
    const registro = {
      nombre: nombre.trim().toUpperCase(),
      estatus: Number(estatus),
      fecha_inicio: fechaInicio.trim(),
      fecha_fin: fechaFin.trim(),
      ubicacion: ubicacion.trim(),
    };

    if (!validarTorneo(registro)) return;

    guardarTorneo(registro, existente ? existente.codigo_torneo : null);
    Toast.show({
      type: 'success',
      text1: existente ? 'Torneo actualizado' : 'Torneo registrado',
      text2: `${registro.nombre} guardado correctamente.`,
    });
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen
        options={{ title: existente ? 'Modificar Torneo' : 'Nuevo Torneo' }}
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
            etiqueta="Nombre del Torneo *"
            placeholder="Ej: MARACAIBO 2026"
            valor={nombre}
            onChangeText={setNombre}
          />

          <Selector
            etiqueta="Estatus *"
            valor={estatus}
            opciones={OPCIONES_ESTATUS}
            onChange={setEstatus}
          />

          <Input
            etiqueta="Fecha de Inicio *"
            placeholder="AAAA-MM-DD (Ej: 2026-10-24)"
            valor={fechaInicio}
            onChangeText={setFechaInicio}
            textoAyuda="Formato: AAAA-MM-DD"
          />

          <Input
            etiqueta="Fecha de Fin *"
            placeholder="AAAA-MM-DD (Ej: 2026-10-25)"
            valor={fechaFin}
            onChangeText={setFechaFin}
            textoAyuda="Debe ser igual o posterior a la fecha de inicio"
          />

          <Input
            etiqueta="Ubicación *"
            placeholder="Ej: Barquisimeto, Estado Lara"
            valor={ubicacion}
            onChangeText={setUbicacion}
          />

          <View style={estilos.filaBotones}>
            <Boton
              titulo="Cancelar"
              variante="contorno"
              onPress={() => router.back()}
              style={{ flex: 1 }}
            />
            <Boton
              titulo={existente ? 'Guardar Cambios' : 'Registrar Torneo'}
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
