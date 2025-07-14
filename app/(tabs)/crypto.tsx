import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  Star,
  DollarSign,
  ShoppingCart,
  Banknote,
  X,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react-native';

const colors = {
  stellarPrimary: '#7D00FF',
  stellarSecondary: '#00BFFF',
  stellarDark: '#090C1C',
  stellarLight: '#1D2D50',
  success: '#00D1B2',
  danger: '#FF3860',
  warning: '#FFDD57',
  dark: '#2D3436',
  light: '#F5F6FA',
  white: '#FFFFFF',
  gray: '#636E72',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
};

// Datos de mercado simulados pero realistas
const initialMarketData = {
  BOB: {
    name: 'Boliviano Token',
    symbol: 'BOB',
    price: 1.00,
    priceUSD: 0.144,
    change24h: 0.0,
    volume24h: 125000,
    marketCap: 2500000,
    icon: '🇧🇴',
    color: colors.stellarPrimary,
    description: 'Stablecoin respaldado 1:1 por bolivianos físicos',
  },
  XLM: {
    name: 'Stellar Lumens',
    symbol: 'XLM',
    price: 0.85,
    priceUSD: 0.123,
    change24h: 2.5,
    volume24h: 45000000,
    marketCap: 3200000000,
    icon: '⭐',
    color: colors.stellarPrimary,
    description: 'Criptomoneda nativa de la red Stellar',
  },
  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    price: 6.96,
    priceUSD: 1.00,
    change24h: 0.1,
    volume24h: 28000000000,
    marketCap: 95000000000,
    icon: '💵',
    color: '#2775CA',
    description: 'Stablecoin respaldado por dólares estadounidenses',
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    price: 6.96,
    priceUSD: 1.00,
    change24h: 0.1,
    volume24h: 4500000000,
    marketCap: 32000000000,
    icon: '🪙',
    color: '#2775CA',
    description: 'Stablecoin regulado respaldado por dólares',
  },
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 301440,
    priceUSD: 43340,
    change24h: -1.2,
    volume24h: 15000000000,
    marketCap: 850000000000,
    icon: '₿',
    color: '#F7931A',
    description: 'La primera y más conocida criptomoneda',
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    price: 16356,
    priceUSD: 2351,
    change24h: 1.8,
    volume24h: 8500000000,
    marketCap: 282000000000,
    icon: '⟠',
    color: '#627EEA',
    description: 'Plataforma de contratos inteligentes',
  },
};

const userBalances = {
  BOB: 5250.80,
  XLM: 1250.45,
  USDT: 350.25,
  USDC: 125.50,
  BTC: 0.0,
  ETH: 0.0,
};

export default function CryptoScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [buyModal, setBuyModal] = useState(false);
  const [sellModal, setSellModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [marketData, setMarketData] = useState(initialMarketData);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simular actualizaciones de precios en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(symbol => {
          if (symbol !== 'BOB' && symbol !== 'USDT' && symbol !== 'USDC') {
            // Simular fluctuaciones de precio pequeñas
            const fluctuation = (Math.random() - 0.5) * 0.02; // ±1%
            newData[symbol].change24h += fluctuation;
            newData[symbol].price *= (1 + fluctuation / 100);
            newData[symbol].priceUSD *= (1 + fluctuation / 100);
          }
        });
        return newData;
      });
      setLastUpdate(new Date());
    }, 10000); // Actualizar cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular actualización de datos
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBuyModal(false);
      setAmount('');
      Alert.alert('¡Éxito!', `Compra de ${selectedAsset?.symbol} realizada con éxito`);
    }, 2000);
  };

  const handleSell = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSellModal(false);
      setAmount('');
      Alert.alert('¡Éxito!', `Venta de ${selectedAsset?.symbol} realizada con éxito`);
    }, 2000);
  };

  const openBuyModal = (asset) => {
    setSelectedAsset(asset);
    setBuyModal(true);
  };

  const openSellModal = (asset) => {
    setSelectedAsset(asset);
    setSellModal(true);
  };

  const filteredAssets = Object.values(marketData).filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteAssets = ['BOB', 'XLM', 'USDT', 'USDC'].map(symbol => marketData[symbol]);

  const formatPrice = (price, symbol) => {
    if (symbol === 'BOB' || symbol === 'USDT' || symbol === 'USDC') {
      return `Bs. ${price.toFixed(2)}`;
    }
    return price > 1000 ? `Bs. ${(price / 1000).toFixed(1)}k` : `Bs. ${price.toFixed(2)}`;
  };

  const formatVolume = (volume) => {
    if (volume > 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume > 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume > 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  const getBalance = (symbol) => {
    return userBalances[symbol] || 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar criptomonedas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <RefreshCw size={20} color={colors.stellarPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* BOB Token Card Principal */}
        <LinearGradient
          colors={[colors.stellarPrimary, colors.stellarDark]}
          style={styles.bobCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.bobCardHeader}>
            <Text style={styles.bobCardTitle}>Boliviano Token (BOB)</Text>
            <Text style={styles.bobCardSubtitle}>Stablecoin 1:1 con Bs.</Text>
          </View>
          
          <View style={styles.bobCardBalance}>
            <Text style={styles.bobCardBalanceLabel}>Mi saldo</Text>
            <Text style={styles.bobCardBalanceAmount}>
              {getBalance('BOB').toFixed(2)} BOB
            </Text>
            <Text style={styles.bobCardBalanceUSD}>
              ≈ ${(getBalance('BOB') * marketData.BOB.priceUSD).toFixed(2)} USD
            </Text>
          </View>

          <View style={styles.bobCardActions}>
            <TouchableOpacity
              style={styles.bobCardBtn}
              onPress={() => openBuyModal(marketData.BOB)}
            >
              <ShoppingCart size={14} color={colors.white} />
              <Text style={styles.bobCardBtnText}>Comprar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bobCardBtn}
              onPress={() => openSellModal(marketData.BOB)}
            >
              <Banknote size={14} color={colors.white} />
              <Text style={styles.bobCardBtnText}>Vender</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Market Update Info */}
        <View style={styles.marketUpdateInfo}>
          <Text style={styles.marketUpdateText}>
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </Text>
        </View>

        {/* Favorites Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis favoritas</Text>
          <View style={styles.favoritesGrid}>
            {favoriteAssets.map((asset) => (
              <TouchableOpacity 
                key={asset.symbol} 
                style={styles.favoriteItem}
                onPress={() => openBuyModal(asset)}
              >
                <View style={[styles.favoriteIcon, { backgroundColor: asset.color + '20' }]}>
                  <Text style={styles.favoriteEmoji}>{asset.icon}</Text>
                </View>
                <Text style={styles.favoriteName}>{asset.symbol}</Text>
                <Text style={styles.favoritePrice}>
                  {formatPrice(asset.price, asset.symbol)}
                </Text>
                <View style={styles.favoriteChange}>
                  {asset.change24h >= 0 ? (
                    <TrendingUp size={12} color={colors.success} />
                  ) : (
                    <TrendingDown size={12} color={colors.danger} />
                  )}
                  <Text style={[
                    styles.favoriteChangeText,
                    { color: asset.change24h >= 0 ? colors.success : colors.danger }
                  ]}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.favoriteBalance}>
                  {getBalance(asset.symbol).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Crypto Assets List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todas las criptomonedas</Text>
          {filteredAssets.map((asset) => (
            <TouchableOpacity key={asset.symbol} style={styles.cryptoItem}>
              <View style={styles.cryptoInfo}>
                <View style={[styles.cryptoIcon, { backgroundColor: asset.color + '20' }]}>
                  <Text style={styles.cryptoEmoji}>{asset.icon}</Text>
                </View>
                <View style={styles.cryptoDetails}>
                  <Text style={styles.cryptoName}>{asset.name}</Text>
                  <Text style={styles.cryptoSymbol}>{asset.symbol}</Text>
                  <Text style={styles.cryptoVolume}>Vol: {formatVolume(asset.volume24h)}</Text>
                </View>
              </View>
              <View style={styles.cryptoPrice}>
                <Text style={styles.cryptoPriceText}>
                  {formatPrice(asset.price, asset.symbol)}
                </Text>
                <Text style={styles.cryptoPriceUSD}>
                  ${asset.priceUSD.toFixed(asset.priceUSD < 1 ? 4 : 2)}
                </Text>
                <View style={styles.cryptoChangeContainer}>
                  {asset.change24h >= 0 ? (
                    <TrendingUp size={12} color={colors.success} />
                  ) : (
                    <TrendingDown size={12} color={colors.danger} />
                  )}
                  <Text style={[
                    styles.cryptoChange,
                    { color: asset.change24h >= 0 ? colors.success : colors.danger }
                  ]}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.cryptoBalance}>
                  Tengo: {getBalance(asset.symbol).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Buy Modal */}
      <Modal visible={buyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comprar {selectedAsset?.symbol}</Text>
              <TouchableOpacity onPress={() => setBuyModal(false)}>
                <X size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.assetInfo}>
                <Text style={styles.assetInfoEmoji}>{selectedAsset?.icon}</Text>
                <View>
                  <Text style={styles.assetInfoName}>{selectedAsset?.name}</Text>
                  <Text style={styles.assetInfoPrice}>
                    {selectedAsset && formatPrice(selectedAsset.price, selectedAsset.symbol)}
                  </Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Monto a comprar (Bs.)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 1000"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              
              {amount && selectedAsset && (
                <Text style={styles.conversionText}>
                  ≈ {(parseFloat(amount) / selectedAsset.price).toFixed(4)} {selectedAsset.symbol}
                </Text>
              )}

              <Text style={styles.inputLabel}>Método de pago</Text>
              <View style={styles.paymentMethod}>
                <Text style={styles.paymentMethodText}>Saldo BOB disponible</Text>
                <Text style={styles.paymentMethodBalance}>
                  {getBalance('BOB').toFixed(2)} BOB
                </Text>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={() => setBuyModal(false)}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={handleBuy}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Comprar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sell Modal */}
      <Modal visible={sellModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vender {selectedAsset?.symbol}</Text>
              <TouchableOpacity onPress={() => setSellModal(false)}>
                <X size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.assetInfo}>
                <Text style={styles.assetInfoEmoji}>{selectedAsset?.icon}</Text>
                <View>
                  <Text style={styles.assetInfoName}>{selectedAsset?.name}</Text>
                  <Text style={styles.assetInfoPrice}>
                    {selectedAsset && formatPrice(selectedAsset.price, selectedAsset.symbol)}
                  </Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>
                Cantidad a vender ({selectedAsset?.symbol})
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`Máximo: ${selectedAsset && getBalance(selectedAsset.symbol).toFixed(4)}`}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              
              {amount && selectedAsset && (
                <Text style={styles.conversionText}>
                  ≈ Bs. {(parseFloat(amount) * selectedAsset.price).toFixed(2)}
                </Text>
              )}

              <Text style={styles.inputLabel}>Método de recepción</Text>
              <View style={styles.paymentMethod}>
                <Text style={styles.paymentMethodText}>Billetera BOB</Text>
                <Text style={styles.paymentMethodBalance}>Conversión instantánea</Text>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={() => setSellModal(false)}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={handleSell}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Vender</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  bobCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: colors.stellarPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bobCardHeader: {
    marginBottom: 15,
  },
  bobCardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  bobCardSubtitle: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  bobCardBalance: {
    marginBottom: 20,
  },
  bobCardBalanceLabel: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 5,
  },
  bobCardBalanceAmount: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
  },
  bobCardBalanceUSD: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.8,
  },
  bobCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  bobCardBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bobCardBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  marketUpdateInfo: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  marketUpdateText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  favoritesGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  favoriteItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteEmoji: {
    fontSize: 18,
  },
  favoriteName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  favoritePrice: {
    fontSize: 11,
    color: colors.textPrimary,
    marginBottom: 3,
    fontWeight: '600',
  },
  favoriteChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 3,
  },
  favoriteChangeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  favoriteBalance: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  cryptoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cryptoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cryptoEmoji: {
    fontSize: 20,
  },
  cryptoDetails: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cryptoSymbol: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 2,
  },
  cryptoVolume: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cryptoPrice: {
    alignItems: 'flex-end',
  },
  cryptoPriceText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cryptoPriceUSD: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  cryptoChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  cryptoChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  cryptoBalance: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.stellarPrimary,
  },
  modalBody: {
    padding: 20,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  assetInfoEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  assetInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  assetInfoPrice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: colors.light,
    marginBottom: 10,
  },
  conversionText: {
    fontSize: 14,
    color: colors.stellarPrimary,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  paymentMethod: {
    backgroundColor: colors.light,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  paymentMethodBalance: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalBtnSecondary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalBtnSecondaryText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  modalBtnPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.stellarPrimary,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.stellarPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalBtnPrimaryText: {
    color: colors.white,
    fontWeight: '600',
  },
});