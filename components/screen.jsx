import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function Screen({ children, style, conMargenSuperior = false }) {
  const insets = useSafeAreaInsets();
  const { colores } = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: conMargenSuperior ? insets.top : 0,
          backgroundColor: colores.fondoContraste,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
