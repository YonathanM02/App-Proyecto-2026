import { View, StyleSheet } from 'react-native';

export default function DivRow({ children, style }) {
  return <View style={[styles.div, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  div: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
