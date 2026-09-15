import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function ProductDetailScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      edges={['top', 'bottom']}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>
        Product Detail Screen
      </Text>
    </SafeAreaView>
  );
}

export default ProductDetailScreen;
