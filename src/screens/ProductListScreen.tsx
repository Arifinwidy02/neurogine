import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ProductCard from '../components/ProductCard';
import { RootStackParamList } from '../navigation/types';
import { ListFooterProps } from '../types/footerFlatList';
import { useProductList } from '../hooks/useProductList';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

function ProductListScreen({ navigation }: Props) {
  const {
    products,
    initialLoading,
    isLoadingMore,
    refreshing,
    error,
    loadMoreError,
    loadMore,
    retry,
    refresh,
    search,
    setSearch,
    isSearching,
  } = useProductList();

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" />
        <Text style={styles.subtle}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error && products.length === 0) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products.."
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {isSearching && <ActivityIndicator style={styles.searchSpinner} />}
      </View>
      {error && products.length > 0 && (
        <View style={styles.inlineError}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={retry} style={styles.retryButtonSmall}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      )}

      {products.length === 0 ? (
        <View style={styles.center}>
          <Text>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              thumbnail={item.thumbnail}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: item.id })
              }
            />
          )}
          ItemSeparatorComponent={renderSeparator}
          refreshing={refreshing}
          onRefresh={refresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <ListFooter
              isLoading={isLoadingMore}
              error={loadMoreError}
              onRetry={loadMore}
            />
          }
          contentContainerStyle={
            products.length === 0 ? styles.emptyList : undefined
          }
        />
      )}
    </SafeAreaView>
  );
}

function renderSeparator() {
  return <View style={styles.separator} />;
}

function ListFooter({ isLoading, error, onRetry }: ListFooterProps) {
  if (isLoading) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator />
        <Text style={styles.subtle}> Loading more...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.footerColumn}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={onRetry} style={styles.retryButtonSmall}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }
  return <View style={styles.footer} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  separator: { height: 1, backgroundColor: 'white', marginLeft: 116 },
  footer: {
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  footerColumn: {
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'column',
    gap: 8,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  retryButtonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  retryText: { fontWeight: '600', color: '#fff' },
  errorText: { color: 'red', textAlign: 'center' },
  subtle: { color: 'grey', fontSize: 12, marginTop: 4 },
  emptyList: { flexGrow: 1 },
  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 4,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchSpinner: { marginLeft: 8 },
});

export default ProductListScreen;
