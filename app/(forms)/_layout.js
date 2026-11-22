import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

export default function LayoutFormularios() {
  const { colores } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.encabezadoBg },
        headerTintColor: colores.textoPrincipal,
        headerTitleStyle: { fontWeight: '800', fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="formAtleta" options={{ title: 'Atleta' }} />
      <Stack.Screen name="formPosicion" options={{ title: 'Posición' }} />
      <Stack.Screen name="formCatalogo" options={{ title: 'Artículo de Catálogo' }} />
      <Stack.Screen name="formInventario" options={{ title: 'Inventario de Artículos' }} />
      <Stack.Screen name="formTorneo" options={{ title: 'Torneo' }} />
    </Stack>
  );
}
