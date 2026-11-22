import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from '../hooks/useTheme';
import { ProveedorDatosClub } from '../hooks/useDatosClub';

export default function LayoutPrincipal() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ProveedorDatosClub>
            <Slot />
            <Toast topOffset={56} />
          </ProveedorDatosClub>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
