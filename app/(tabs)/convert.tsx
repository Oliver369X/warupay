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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftRight, CheckCircle, X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

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

const exchangeRates = {
  XLM: 0.85,  // 1 XLM = 0.85 Bs.
  USDT: 6.9,  // 1 USDT = 6.9 Bs.
  USDC: 6.9,  // 1 USDC = 6.9 Bs.
};

const currencies = [
  { label: 'Bolivianos (Bs.)', value: 'BOB' },
  { label: 'Stellar Lumens (XLM)', value: 'XLM' },
  { label: 'Tether (USDT)', value: 'USDT' },
  { label: 'USD Coin (USDC)', value: 'USDC' },
];

const conversionHistory = [
  {
    id: 1,
    from: 'BOB',
    to: 'XLM',
    fromAmount: '850.00',
    toAmount: '1,000',
    date: 'Ayer, 14:30',
  },
  {
    id: 2,
    from: 'USDT',
    to: 'BOB',
    fromAmount: '100',
    toAmount: '690.00',
    date: '20/05, 10:15',
  },
  {
    id: 3,
    from: 'XLM',
    to: 'USDC',
    fromAmount: '500',
    toAmount: '50',
    date: '18/05, 16:45',
  },
];

export default function ConvertScreen() {
  const [fromCurrency, setFromCurrency] = useState('BOB');
  const [toCurrency, setToCurrency] = useState('XLM');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [conversionResult, setConversionResult] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');

  useEffect(() => {
    updateExchangeRate();
  }, [fromCurrency, toCurrency]);

  const updateExchangeRate = () => {
    if (fromCurrency === 'BOB' && toCurrency === 'XLM') {
      setExchangeRate(`1 XLM = Bs. ${exchangeRates.XLM.toFixed(2)}`);
    } else if (fromCurrency === 'XLM' && toCurrency === 'BOB') {
      setExchangeRate(`1 XLM = Bs. ${exchangeRates.XLM.toFixed(2)}`);
    } else if (fromCurrency === 'BOB' && (toCurrency === 'USDT' || toCurrency === 'USDC')) {
      setExchangeRate(`1 ${toCurrency} = Bs. ${exchangeRates[toCurrency].toFixed(2)}`);
    } else if ((fromCurrency === 'USDT' || fromCurrency === 'USDC') && toCurrency === 'BOB') {
      setExchangeRate(`1 ${fromCurrency} = Bs. ${exchangeRates[fromCurrency].toFixed(2)}`);
    } else if (fromCurrency !== toCurrency) {
      const fromRate = exchangeRates[fromCurrency] || 1;
      const toRate = exchangeRates[toCurrency] || 1;
      const rate = fromRate / toRate;
      setExchangeRate(`1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`);
    }
  };

  const getAvailableToCurrencies = () => {
    return currencies.filter(currency => currency.value !== fromCurrency);
  };

  const performConversion = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let resultAmount = 0;
      let resultText = '';

      if (fromCurrency === 'BOB') {
        if (toCurrency === 'XLM') {
          resultAmount = numAmount / exchangeRates.XLM;
          resultText = `Bs. ${numAmount.toFixed(2)} → ${resultAmount.toFixed(2)} XLM`;
        } else if (toCurrency === 'USDT' || toCurrency === 'USDC') {
          resultAmount = numAmount / exchangeRates[toCurrency];
          resultText = `Bs. ${numAmount.toFixed(2)} → ${resultAmount.toFixed(2)} ${toCurrency}`;
        }
      } else if (toCurrency === 'BOB') {
        if (fromCurrency === 'XLM') {
          resultAmount = numAmount * exchangeRates.XLM;
          resultText = `${numAmount.toFixed(2)} XLM → Bs. ${resultAmount.toFixed(2)}`;
        } else if (fromCurrency === 'USDT' || fromCurrency === 'USDC') {
          resultAmount = numAmount * exchangeRates[fromCurrency];
          resultText = `${numAmount.toFixed(2)} ${fromCurrency} → Bs. ${resultAmount.toFixed(2)}`;
        }
      } else {
        const fromRate = exchangeRates[fromCurrency] || 1;
        const toRate = exchangeRates[toCurrency] || 1;
        resultAmount = (numAmount * fromRate) / toRate;
        resultText = `${numAmount.toFixed(6)} ${fromCurrency} → ${resultAmount.toFixed(6)} ${toCurrency}`;
      }

      setLoading(false);
      setConversionResult(resultText);
      setSuccessModal(true);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversión de Moneda</Text>
        <Text style={styles.headerSubtitle}>Convierte entre Bs., USDC y XLM</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Conversion Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>De</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={fromCurrency}
                onValueChange={(value) => setFromCurrency(value)}
                style={styles.picker}
              >
                {currencies.map((currency) => (
                  <Picker.Item
                    key={currency.value}
                    label={currency.label}
                    value={currency.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <ArrowLeftRight size={24} color={colors.stellarPrimary} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>A</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={toCurrency}
                onValueChange={(value) => setToCurrency(value)}
                style={styles.picker}
              >
                {getAvailableToCurrencies().map((currency) => (
                  <Picker.Item
                    key={currency.value}
                    label={currency.label}
                    value={currency.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el monto"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.convertBtn}
            onPress={performConversion}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <ArrowLeftRight size={16} color={colors.white} />
                <Text style={styles.convertBtnText}>Convertir</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.exchangeRate}>Tasa actual: {exchangeRate}</Text>
        </View>

        {/* Conversion History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Historial de conversiones</Text>
          
          {conversionHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <View style={styles.historyIcon}>
                  <ArrowLeftRight size={18} color={colors.stellarPrimary} />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyTitle}>{item.from} a {item.to}</Text>
                  <Text style={styles.historySubtitle}>{item.date}</Text>
                </View>
              </View>
              <Text style={styles.historyAmount}>
                {item.fromAmount} {item.from} → {item.toAmount} {item.to}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Conversión Exitosa</Text>
              <TouchableOpacity onPress={() => setSuccessModal(false)}>
                <X size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.successIcon}>
                <CheckCircle size={50} color={colors.success} />
              </View>
              <Text style={styles.successText}>
                ¡Tu conversión en Stellar se ha completado con éxito!
              </Text>
              <Text style={styles.conversionResult}>{conversionResult}</Text>
              <Text style={styles.successSubtext}>
                Los fondos han sido transferidos a tu billetera.
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={() => {
                  setSuccessModal(false);
                  setAmount('');
                }}
              >
                <Text style={styles.modalBtnPrimaryText}>Aceptar</Text>
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
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: colors.light,
  },
  picker: {
    height: 50,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: colors.light,
  },
  convertBtn: {
    backgroundColor: colors.stellarPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    elevation: 4,
    shadowColor: colors.stellarPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  convertBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  exchangeRate: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    color: colors.textSecondary,
  },
  historySection: {
    backgroundColor: colors.white,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    backgroundColor: colors.light,
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
  historyAmount: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'right',
    maxWidth: 120,
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
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
  },
  conversionResult: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.stellarPrimary,
    textAlign: 'center',
    marginBottom: 15,
  },
  successSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalBtnPrimary: {
    backgroundColor: colors.stellarPrimary,
    paddingVertical: 12,
    borderRadius: 12,
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
    fontSize: 16,
  },
});