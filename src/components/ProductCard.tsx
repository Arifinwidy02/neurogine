import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ProductCardProps } from '../types/ProductCard';

function ProductCard({ title, price, thumbnail, onPress }: ProductCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Image source={{ uri: thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  pressed: { opacity: 0.6 },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  title: { fontSize: 15, fontWeight: '600', color: '#111' },
  price: { fontSize: 14, fontWeight: '700', color: '#0a7' },
});

export default ProductCard;
