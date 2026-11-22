import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import Screen from '../../components/screen';
import Input from '../../components/input';
import Boton from '../../components/boton';
import { useTheme } from '../../hooks/useTheme';
import { useDatosClub } from '../../hooks/useDatosClub';
import { validarPosicion } from '../../utils/validaciones';

export default function FormularioPosicion() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colores } = useTheme();
  const { posiciones, guardarPosicion } = useDatosClub();

  const existente = useMemo(
    () => (id ? posiciones.find((p) => p.codigo_posicion === Number(id)) : null),
    [id, posiciones]
  );

  const [nombre, setNombre] = useState(existente?.nombre || '');
  const [abreviatura, setAbreviatura] = useState(existente?.abreviatura || '');
  const [descripcion, setDescripcion] = useState(existente?.descripcion || '');

  const guardarRegistro = () => {
    const registro = {
      nombre: nombre.trim(),
      abreviatura: abreviatura.trim().toUpperCase(),
      descripcion: descripcion.trim(),
    };

    if (!validarPosicion(registro)) return;

    guardarPosicion(registro, existente ? existente.codigo_posicion : null);
    Toast.show({
      type: 'success',
      text1: existente ? 'Posición actualizada' : 'Posición registrada',
      text2: `${registro.nombre} (${registro.abreviatura}) guardada correctamente.`,
    });
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen
        options={{ title: existente ? 'Modificar Posición' : 'Nueva Posición' }}
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
            etiqueta="Nombre *"
            placeholder="Ej: Delantero, Defensa, Portero"
            valor={nombre}
            onChangeText={setNombre}
            textoAyuda="Solo letras (entre 3 y 30 caracteres)"
          />

          <Input
            etiqueta="Abreviatura *"
            placeholder="Ej: DC, DF, PR"
            valor={abreviatura}
            onChangeText={setAbreviatura}
            textoAyuda="Entre 2 y 4 letras"
          />

          <Input
            etiqueta="Descripción (Opcional)"
            placeholder="Rol táctico de la posición en pista..."
            valor={descripcion}
            onChangeText={setDescripcion}
            multilinea
          />

          <View style={estilos.filaBotones}>
            <Boton
              titulo="Cancelar"
              variante="contorno"
              onPress={() => router.back()}
              style={{ flex: 1 }}
            />
            <Boton
              titulo={existente ? 'Guardar Cambios' : 'Registrar Posición'}
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
