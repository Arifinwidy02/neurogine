import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useProductDetail } from '../hooks/useProductDetail';
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

function ProductDetailScreen({ route }: Props) {
  const { productId } = route.params;
  const { product, loading, error, retry } = useProductDetail(productId);
  const [imgError, setImgError] = useState(false);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable onPress={retry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }
  if (!product) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageWrap}>
        {!imgError ? (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text>Image unavailable</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.rating}>★ {product.rating} / 5</Text>
      <Text style={styles.desc}>{product.description}</Text>

      {product.images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbs}
        >
          {product.images.slice(1).map(uri => (
            <Image key={uri} source={{ uri }} style={styles.thumb} />
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  imageWrap: { alignItems: 'center', marginBottom: 16 },
  image: {
    width: 280,
    height: 280,
    borderRadius: 12,
  },
  imageFallback: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  price: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  rating: { marginTop: 4, color: '#666' },
  desc: { marginTop: 12, lineHeight: 20, color: 'grey' },
  thumbs: { marginTop: 16 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 8,
  },
  error: { color: 'red', textAlign: 'center' },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  retryText: { color: 'white', fontWeight: '600' },
});

export default ProductDetailScreen;
