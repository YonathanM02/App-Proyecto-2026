import { View, StyleSheet } from 'react-native';

export default function DivColumn({ children, style }) {
  return <View style={[styles.div, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  div: {
    flexDirection: 'column',
    width: '100%',
    flex: 1,
  },
});
