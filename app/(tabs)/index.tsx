import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, ArrowLeftRight, QrCode, Map, ShoppingBag, Banknote, X, MapPin, Clock, CreditCard, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react-native';
import { router } from 'expo-router';

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

// Estado global simulado del usuario
const initialUserState = {
  balances: {
    BOB: 5250.80,      // Boliviano cripto (token)
    XLM: 1250.45,      // Stellar Lumens
    USDT: 350.25,      // Tether
    USDC: 125.50,      // USD Coin
  },
  bankAccounts: {
    bbva: 12500.00,
    bcp: 8300.50,
  },
  profile: {
    name: 'Juan Pérez',
    phone: '+591 70123456',
    stellarAddress: 'GCKFBEIYTKP6RJGWLOUQY6ANPN7CEENA5WM5QJFHVQBWXV2SQFQGQXFL',
  }
};

const exchangeRates = {
  XLM: { bob: 0.85, usd: 0.123 },
  USDT: { bob: 6.96, usd: 1.00 },
  USDC: { bob: 6.96, usd: 1.00 },
  BOB: { usd: 0.144 },
};

const placesData = [
  {
    id: 'cafe-stellar',
    name: 'Café Stellar',
    type: 'Cafetería',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Av. Arce #1234, La Paz',
    hours: 'Lun-Vie: 8:00 - 22:00 | Sáb-Dom: 9:00 - 23:00',
    payment: 'Acepta: BOB, XLM, USDT, USDC',
    description: 'Café Stellar es un lugar acogedor en el corazón de la ciudad que ofrece café de especialidad y deliciosos postres.',
    rating: 4.8,
    distance: '0.5 km',
  },
  {
    id: 'hotel-lumens',
    name: 'Hotel Lumens',
    type: 'Hotel',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Calle Comercio #567, La Paz',
    hours: 'Abierto 24/7',
    payment: 'Acepta: BOB, XLM, USDT, USDC, USD',
    description: 'Hotel de 4 estrellas ubicado en el centro de la ciudad. Ofrece habitaciones cómodas, servicio de spa y restaurante.',
    rating: 4.6,
    distance: '1.2 km',
  },
  {
    id: 'restaurante-xlm',
    name: 'Restaurante XLM',
    type: 'Restaurante',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Av. 16 de Julio #789, La Paz',
    hours: 'Lun-Sáb: 12:00 - 23:00 | Dom: 12:00 - 17:00',
    payment: 'Acepta: BOB, XLM',
    description: 'Restaurante gourmet especializado en cocina fusión. Menú variado con opciones vegetarianas y veganas.',
    rating: 4.9,
    distance: '0.8 km',
  },
];

export default function HomeScreen() {
  const [userState, setUserState] = useState(initialUserState);
  const [rechargeModal, setRechargeModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [placeModal, setPlaceModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successDetails, setSuccessDetails] = useState('');

  const [rechargeAmount, setRechargeAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDestination, setTransferDestination] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('BOB');
  const [payAmount, setPayAmount] = useState('');
  const [payCurrency, setPayCurrency] = useState('BOB');

  // Animación para el saldo
  const balanceAnimation = new Animated.Value(1);

  const animateBalance = () => {
    Animated.sequence([
      Animated.timing(balanceAnimation, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(balanceAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Generar historial de transacciones dinámico
  const [transactionHistory, setTransactionHistory] = useState([
    {
      id: 1,
      title: 'Supermercado Ketal',
      subtitle: 'Hoy, 15:30',
      amount: -120.50,
      currency: 'BOB',
      type: 'expense',
      icon: ShoppingBag,
      status: 'completed',
    },
    {
      id: 2,
      title: 'Recarga desde BBVA',
      subtitle: 'Hoy, 10:15',
      amount: 1000.00,
      currency: 'BOB',
      type: 'income',
      icon: Banknote,
      status: 'completed',
    },
    {
      id: 3,
      title: 'Conversión XLM → BOB',
      subtitle: 'Ayer, 19:45',
      amount: 850.00,
      currency: 'BOB',
      type: 'conversion',
      icon: ArrowLeftRight,
      status: 'completed',
    },
  ]);

  const updateBalance = (currency, amount, operation = 'subtract') => {
    setUserState(prevState => {
      const newBalances = { ...prevState.balances };
      if (operation === 'subtract') {
        newBalances[currency] = Math.max(0, newBalances[currency] - Math.abs(amount));
      } else {
        newBalances[currency] += Math.abs(amount);
      }
      return {
        ...prevState,
        balances: newBalances,
      };
    });
    animateBalance();
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      subtitle: 'Ahora',
      status: 'completed',
    };
    setTransactionHistory(prev => [newTransaction, ...prev]);
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    const amount = parseFloat(rechargeAmount);
    setLoading(true);

    // Simular procesamiento
    setTimeout(() => {
      updateBalance('BOB', amount, 'add');
      addTransaction({
        title: 'Recarga exitosa',
        amount: amount,
        currency: 'BOB',
        type: 'income',
        icon: Plus,
      });

      setLoading(false);
      setRechargeModal(false);
      setRechargeAmount('');
      
      setSuccessMessage('¡Recarga exitosa!');
      setSuccessDetails(`Se han agregado Bs. ${amount.toFixed(2)} a tu billetera BOB`);
      setSuccessModal(true);
    }, 2000);
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferDestination || parseFloat(transferAmount) <= 0) {
      Alert.alert('Error', 'Completa todos los campos correctamente');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (userState.balances[transferCurrency] < amount) {
      Alert.alert('Error', 'Saldo insuficiente');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      updateBalance(transferCurrency, amount, 'subtract');
      addTransaction({
        title: `Transferencia ${transferCurrency}`,
        amount: -amount,
        currency: transferCurrency,
        type: 'expense',
        icon: ArrowLeftRight,
      });

      setLoading(false);
      setTransferModal(false);
      setTransferAmount('');
      setTransferDestination('');
      
      setSuccessMessage('¡Transferencia exitosa!');
      setSuccessDetails(`Se enviaron ${amount.toFixed(2)} ${transferCurrency} a ${transferDestination.substring(0, 20)}...`);
      setSuccessModal(true);
    }, 2500);
  };

  const handlePay = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    const amount = parseFloat(payAmount);
    if (userState.balances[payCurrency] < amount) {
      Alert.alert('Error', 'Saldo insuficiente');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      updateBalance(payCurrency, amount, 'subtract');
      addTransaction({
        title: selectedPlace ? selectedPlace.name : 'Pago QR',
        amount: -amount,
        currency: payCurrency,
        type: 'expense',
        icon: QrCode,
      });

      setLoading(false);
      setPayModal(false);
      setPayAmount('');
      if (placeModal) setPlaceModal(false);
      
      setSuccessMessage('¡Pago exitoso!');
      setSuccessDetails(`Se pagaron ${amount.toFixed(2)} ${payCurrency}${selectedPlace ? ` en ${selectedPlace.name}` : ''}`);
      setSuccessModal(true);
    }, 2000);
  };

  const openPlaceDetails = (place) => {
    setSelectedPlace(place);
    setPlaceModal(true);
  };

  const getTotalBalanceInBOB = () => {
    const { BOB, XLM, USDT, USDC } = userState.balances;
    const xlmInBOB = XLM * exchangeRates.XLM.bob;
    const usdtInBOB = USDT * exchangeRates.USDT.bob;
    const usdcInBOB = USDC * exchangeRates.USDC.bob;
    return BOB + xlmInBOB + usdtInBOB + usdcInBOB;
  };

  const formatCurrency = (amount, currency) => {
    switch (currency) {
      case 'BOB':
        return `Bs. ${amount.toFixed(2)}`;
      case 'XLM':
        return `${amount.toFixed(2)} XLM`;
      case 'USDT':
        return `${amount.toFixed(2)} USDT`;
      case 'USDC':
        return `${amount.toFixed(2)} USDC`;
      default:
        return `${amount.toFixed(2)} ${currency}`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.stellarDark, colors.stellarPrimary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Warupay</Text>
        <View style={styles.profile}>
          <Text style={styles.profileText}>JP</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card Mejorado */}
        <LinearGradient
          colors={[colors.stellarDark, colors.stellarPrimary]}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.balanceTitle}>Saldo BOB (Token)</Text>
          <Animated.View style={{ transform: [{ scale: balanceAnimation }] }}>
            <Text style={styles.balanceAmount}>
              {formatCurrency(userState.balances.BOB, 'BOB')}
            </Text>
          </Animated.View>
          
          <View style={styles.balanceSecondary}>
            <Text style={styles.balanceSecondaryText}>
              Total en cripto: {formatCurrency(getTotalBalanceInBOB() - userState.balances.BOB, 'BOB')}
            </Text>
            <Text style={styles.balanceSecondaryText}>
              Total general: {formatCurrency(getTotalBalanceInBOB(), 'BOB')}
            </Text>
          </View>
          
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.balanceBtn}
              onPress={() => setRechargeModal(true)}
            >
              <Plus size={16} color={colors.white} />
              <Text style={styles.balanceBtnText}>Recargar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.balanceBtn}
              onPress={() => setTransferModal(true)}
            >
              <ArrowLeftRight size={16} color={colors.white} />
              <Text style={styles.balanceBtnText}>Transferir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.balanceBtn}
              onPress={() => setPayModal(true)}
            >
              <QrCode size={16} color={colors.white} />
              <Text style={styles.balanceBtnText}>Pagar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.balanceBtn}
              onPress={() => router.push('/maps')}
            >
              <Map size={16} color={colors.white} />
              <Text style={styles.balanceBtnText}>Mapas</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Resumen de Criptomonedas */}
        <View style={styles.cryptoSummary}>
          <Text style={styles.sectionTitle}>Mis Activos Digitales</Text>
          <View style={styles.cryptoGrid}>
            <View style={styles.cryptoSummaryItem}>
              <Text style={styles.cryptoSymbol}>XLM</Text>
              <Text style={styles.cryptoAmount}>{userState.balances.XLM.toFixed(2)}</Text>
              <Text style={styles.cryptoValue}>≈ {formatCurrency(userState.balances.XLM * exchangeRates.XLM.bob, 'BOB')}</Text>
              <View style={styles.cryptoChange}>
                <TrendingUp size={12} color={colors.success} />
                <Text style={[styles.cryptoChangeText, { color: colors.success }]}>+2.5%</Text>
              </View>
            </View>
            
            <View style={styles.cryptoSummaryItem}>
              <Text style={styles.cryptoSymbol}>USDT</Text>
              <Text style={styles.cryptoAmount}>{userState.balances.USDT.toFixed(2)}</Text>
              <Text style={styles.cryptoValue}>≈ {formatCurrency(userState.balances.USDT * exchangeRates.USDT.bob, 'BOB')}</Text>
              <View style={styles.cryptoChange}>
                <TrendingUp size={12} color={colors.success} />
                <Text style={[styles.cryptoChangeText, { color: colors.success }]}>+0.1%</Text>
              </View>
            </View>
            
            <View style={styles.cryptoSummaryItem}>
              <Text style={styles.cryptoSymbol}>USDC</Text>
              <Text style={styles.cryptoAmount}>{userState.balances.USDC.toFixed(2)}</Text>
              <Text style={styles.cryptoValue}>≈ {formatCurrency(userState.balances.USDC * exchangeRates.USDC.bob, 'BOB')}</Text>
              <View style={styles.cryptoChange}>
                <TrendingUp size={12} color={colors.success} />
                <Text style={[styles.cryptoChangeText, { color: colors.success }]}>+0.1%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Places Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lugares que aceptan Stellar</Text>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.placesContainer}>
            {placesData.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeCard}
                onPress={() => openPlaceDetails(place)}
              >
                <Image source={{ uri: place.image }} style={styles.placeImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.placeOverlay}
                >
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeType}>{place.type}</Text>
                    <View style={styles.placeStats}>
                      <Text style={styles.placeRating}>⭐ {place.rating}</Text>
                      <Text style={styles.placeDistance}>{place.distance}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
          
          {transactionHistory.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <View style={[styles.historyIcon, { 
                  backgroundColor: item.type === 'income' ? colors.success + '20' : 
                                 item.type === 'expense' ? colors.danger + '20' : colors.warning + '20' 
                }]}>
                  <item.icon size={18} color={
                    item.type === 'income' ? colors.success : 
                    item.type === 'expense' ? colors.danger : colors.warning
                  } />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historySubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={styles.historyAmountContainer}>
                <Text style={[
                  styles.historyAmount,
                  item.type === 'income' ? styles.historyAmountPositive : styles.historyAmountNegative
                ]}>
                  {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount, item.currency)}
                </Text>
                <Text style={styles.historyStatus}>✓ Completado</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal de Éxito Mejorado */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIcon}>
              <CheckCircle size={60} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>{successMessage}</Text>
            <Text style={styles.successDetails}>{successDetails}</Text>
            <Text style={styles.successBalance}>
              Nuevo saldo BOB: {formatCurrency(userState.balances.BOB, 'BOB')}
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setSuccessModal(false)}
            >
              <Text style={styles.successButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recharge Modal */}
      <Modal visible={rechargeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recargar BOB Token</Text>
              <TouchableOpacity onPress={() => setRechargeModal(false)}>
                <X size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Monto a recargar (Bs.)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el monto"
                value={rechargeAmount}
                onChangeText={setRechargeAmount}
                keyboardType="numeric"
              />
              <Text style={styles.helperText}>
                Saldo actual: {formatCurrency(userState.balances.BOB, 'BOB')}
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={() => setRechargeModal(false)}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={handleRecharge}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Recargar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transfer Modal */}
      <Modal visible={transferModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Realizar Transferencia</Text>
              <TouchableOpacity onPress={() => setTransferModal(false)}>
                <X size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Moneda</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity 
                  style={[styles.pickerOption, transferCurrency === 'BOB' && styles.pickerOptionSelected]}
                  onPress={() => setTransferCurrency('BOB')}
                >
                  <Text style={[styles.pickerText, transferCurrency === 'BOB' && styles.pickerTextSelected]}>
                    BOB ({formatCurrency(userState.balances.BOB, 'BOB')})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.pickerOption, transferCurrency === 'XLM' && styles.pickerOptionSelected]}
                  onPress={() => setTransferCurrency('XLM')}
                >
                  <Text style={[styles.pickerText, transferCurrency === 'XLM' && styles.pickerTextSelected]}>
                    XLM ({formatCurrency(userState.balances.XLM, 'XLM')})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.pickerOption, transferCurrency === 'USDT' && styles.pickerOptionSelected]}
                  onPress={() => setTransferCurrency('USDT')}
                >
                  <Text style={[styles.pickerText, transferCurrency === 'USDT' && styles.pickerTextSelected]}>
                    USDT ({formatCurrency(userState.balances.USDT, 'USDT')})
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>Monto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el monto"
                value={transferAmount}
                onChangeText={setTransferAmount}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Destino</Text>
              <TextInput
                style={styles.input}
                placeholder="Dirección Stellar, teléfono o email"
                value={transferDestination}
                onChangeText={setTransferDestination}
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={() => setTransferModal(false)}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={handleTransfer}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Transferir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pay Modal */}
      <Modal visible={payModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Realizar Pago</Text>
              <TouchableOpacity onPress={() => setPayModal(false)}>
                <X size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Moneda</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity 
                  style={[styles.pickerOption, payCurrency === 'BOB' && styles.pickerOptionSelected]}
                  onPress={() => setPayCurrency('BOB')}
                >
                  <Text style={[styles.pickerText, payCurrency === 'BOB' && styles.pickerTextSelected]}>
                    BOB ({formatCurrency(userState.balances.BOB, 'BOB')})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.pickerOption, payCurrency === 'XLM' && styles.pickerOptionSelected]}
                  onPress={() => setPayCurrency('XLM')}
                >
                  <Text style={[styles.pickerText, payCurrency === 'XLM' && styles.pickerTextSelected]}>
                    XLM ({formatCurrency(userState.balances.XLM, 'XLM')})
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>Monto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el monto"
                value={payAmount}
                onChangeText={setPayAmount}
                keyboardType="numeric"
              />
              
              <TouchableOpacity style={styles.scanButton}>
                <QrCode size={20} color={colors.stellarPrimary} />
                <Text style={styles.scanButtonText}>Escanear código QR</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={() => setPayModal(false)}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={handlePay}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Pagar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Place Details Modal */}
      <Modal visible={placeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedPlace?.name}</Text>
              <TouchableOpacity onPress={() => setPlaceModal(false)}>
                <X size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            {selectedPlace && (
              <>
                <Image source={{ uri: selectedPlace.image }} style={styles.placeModalImage} />
                
                <View style={styles.modalBody}>
                  <View style={styles.placeInfoItem}>
                    <MapPin size={16} color={colors.stellarPrimary} />
                    <Text style={styles.placeInfoText}>{selectedPlace.address}</Text>
                  </View>
                  
                  <View style={styles.placeInfoItem}>
                    <Clock size={16} color={colors.stellarPrimary} />
                    <Text style={styles.placeInfoText}>{selectedPlace.hours}</Text>
                  </View>
                  
                  <View style={styles.placeInfoItem}>
                    <CreditCard size={16} color={colors.stellarPrimary} />
                    <Text style={styles.placeInfoText}>{selectedPlace.payment}</Text>
                  </View>
                  
                  <Text style={styles.placeDescription}>{selectedPlace.description}</Text>
                </View>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.modalBtnSecondary}>
                    <Text style={styles.modalBtnSecondaryText}>Cómo llegar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalBtnPrimary}
                    onPress={() => {
                      setPlaceModal(false);
                      setPayModal(true);
                    }}
                  >
                    <Text style={styles.modalBtnPrimaryText}>Pagar ahora</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    paddingBottom: 90, // Evitar superposición con la barra de navegación
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: colors.stellarPrimary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  balanceCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: colors.stellarPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  balanceTitle: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 5,
  },
  balanceAmount: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  balanceSecondary: {
    marginBottom: 20,
  },
  balanceSecondaryText: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  balanceActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  balanceBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 110,
    justifyContent: 'center',
    marginBottom: 8,
  },
  balanceBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  cryptoSummary: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cryptoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  cryptoSummaryItem: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.stellarPrimary,
    marginBottom: 5,
  },
  cryptoAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  cryptoValue: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  cryptoChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cryptoChangeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  sectionLink: {
    fontSize: 12,
    color: colors.stellarPrimary,
    fontWeight: '500',
  },
  placesContainer: {
    marginBottom: 10,
  },
  placeCard: {
    width: 200,
    height: 140,
    borderRadius: 14,
    marginRight: 15,
    overflow: 'hidden',
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  placeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    justifyContent: 'flex-end',
  },
  placeInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  placeName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  placeType: {
    color: colors.white,
    fontSize: 11,
    opacity: 0.9,
    marginBottom: 5,
  },
  placeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeRating: {
    color: colors.white,
    fontSize: 10,
    opacity: 0.9,
  },
  placeDistance: {
    color: colors.white,
    fontSize: 10,
    opacity: 0.9,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  historySubtitle: {
    fontSize: 13,
    color: colors.gray,
  },
  historyAmountContainer: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  historyAmountPositive: {
    color: colors.success,
  },
  historyAmountNegative: {
    color: colors.danger,
  },
  historyStatus: {
    fontSize: 10,
    color: colors.success,
    marginTop: 2,
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
  successModalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '85%',
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 10,
    textAlign: 'center',
  },
  successDetails: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  successBalance: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.stellarPrimary,
    marginBottom: 25,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: colors.stellarPrimary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: colors.stellarPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 15,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.light,
  },
  pickerOptionSelected: {
    borderColor: colors.stellarPrimary,
    backgroundColor: colors.stellarPrimary + '10',
  },
  pickerText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  pickerTextSelected: {
    color: colors.stellarPrimary,
    fontWeight: '600',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.light,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scanButtonText: {
    color: colors.stellarPrimary,
    fontWeight: '500',
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
  placeModalImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  placeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  placeInfoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  placeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 10,
  },
});