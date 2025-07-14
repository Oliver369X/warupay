import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, Download, Share as ShareIcon, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import QRCodeSVG from 'react-native-qrcode-svg';

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

const { width } = Dimensions.get('window');

export default function QRScreen() {
  const [userProfile] = useState({
    name: 'Juan Pérez',
    phone: '+591 70123456',
    stellarAddress: 'GCKFBEIYTKP6RJGWLOUQY6ANPN7CEENA5WM5QJFHVQBWXV2SQFQGQXFL',
    bobAddress: 'stellarpay:juan.perez@stellarpay.bo',
  });

  const [qrType, setQrType] = useState('stellarpay'); // 'stellarpay' o 'stellar'
  
  const getQRData = () => {
    if (qrType === 'stellarpay') {
      return JSON.stringify({
        type: 'stellarpay_payment',
        address: userProfile.bobAddress,
        name: userProfile.name,
        phone: userProfile.phone,
        currencies: ['BOB', 'XLM', 'USDT', 'USDC'],
        version: '1.0'
      });
    } else {
      return userProfile.stellarAddress;
    }
  };

  const getDisplayAddress = () => {
    if (qrType === 'stellarpay') {
      return userProfile.bobAddress;
    } else {
      return userProfile.stellarAddress;
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(getDisplayAddress());
    Alert.alert('¡Copiado!', 'Dirección copiada al portapapeles');
  };

  const shareQR = async () => {
    try {
      const message = qrType === 'stellarpay' 
        ? `¡Págame fácil con StellarPay! 💫\n\nMi dirección: ${userProfile.bobAddress}\n\nAcepto: BOB, XLM, USDT, USDC\n\nDescarga StellarPay: https://stellarpay.bo`
        : `Mi dirección Stellar: ${userProfile.stellarAddress}`;
        
      await Share.share({
        message,
        title: 'StellarPay - Mi código QR',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el código QR');
    }
  };

  const saveQR = () => {
    Alert.alert('¡Guardado!', 'Código QR guardado en la galería');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Código QR de Pago</Text>
        <Text style={styles.subtitle}>Comparte para recibir pagos instantáneos</Text>
        
        {/* Selector de tipo de QR */}
        <View style={styles.qrTypeSelector}>
          <TouchableOpacity
            style={[styles.qrTypeButton, qrType === 'stellarpay' && styles.qrTypeButtonActive]}
            onPress={() => setQrType('stellarpay')}
          >
            <Text style={[styles.qrTypeText, qrType === 'stellarpay' && styles.qrTypeTextActive]}>
              StellarPay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.qrTypeButton, qrType === 'stellar' && styles.qrTypeButtonActive]}
            onPress={() => setQrType('stellar')}
          >
            <Text style={[styles.qrTypeText, qrType === 'stellar' && styles.qrTypeTextActive]}>
              Stellar Network
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* QR Code Container */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeWrapper}>
            <QRCodeSVG
              value={getQRData()}
              size={200}
              color={colors.stellarDark}
              backgroundColor={colors.white}
              logo={{
                uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDdIMTdWM0g3VjdIM1YxN0g3VjIxSDE3VjE3SDIxVjdaIiBzdHJva2U9IiM3RDAwRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
              }}
              logoSize={30}
              logoBackgroundColor={colors.white}
              logoMargin={2}
              logoBorderRadius={15}
            />
          </View>
          
          {/* Información del usuario */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userPhone}>{userProfile.phone}</Text>
          </View>
        </View>
        
        {/* Address Display */}
        <TouchableOpacity style={styles.addressContainer} onPress={copyToClipboard}>
          <Text style={styles.addressLabel}>
            {qrType === 'stellarpay' ? 'Dirección StellarPay:' : 'Dirección Stellar:'}
          </Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {getDisplayAddress()}
          </Text>
          <Copy size={16} color={colors.stellarPrimary} style={styles.copyIcon} />
        </TouchableOpacity>
        
        {/* Información de monedas aceptadas */}
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyTitle}>Monedas que acepto:</Text>
          <View style={styles.currencyList}>
            <View style={styles.currencyItem}>
              <Text style={styles.currencySymbol}>BOB</Text>
              <Text style={styles.currencyName}>Boliviano Token</Text>
            </View>
            <View style={styles.currencyItem}>
              <Text style={styles.currencySymbol}>XLM</Text>
              <Text style={styles.currencyName}>Stellar Lumens</Text>
            </View>
            <View style={styles.currencyItem}>
              <Text style={styles.currencySymbol}>USDT</Text>
              <Text style={styles.currencyName}>Tether</Text>
            </View>
            <View style={styles.currencyItem}>
              <Text style={styles.currencySymbol}>USDC</Text>
              <Text style={styles.currencyName}>USD Coin</Text>
            </View>
          </View>
        </View>
        
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Cómo usar:</Text>
          <Text style={styles.instructionText}>
            • Comparte este código para recibir pagos
          </Text>
          <Text style={styles.instructionText}>
            • Otros usuarios pueden escanearlo para enviarte dinero
          </Text>
          <Text style={styles.instructionText}>
            • Compatible con cualquier billetera Stellar
          </Text>
          <Text style={styles.instructionText}>
            • Recibe notificaciones instantáneas de pagos
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={saveQR}>
            <Download size={20} color={colors.white} />
            <Text style={styles.primaryButtonText}>Guardar QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={shareQR}>
            <ShareIcon size={20} color={colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>Compartir</Text>
          </TouchableOpacity>
        </View>
        
        {/* Balance Info */}
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Límites de recepción:</Text>
          <Text style={styles.balanceAmount}>Sin límites</Text>
          <Text style={styles.balanceNote}>
            Recibe pagos ilimitados en tu billetera Warupay
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 25,
    textAlign: 'center',
  },
  qrTypeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  qrTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrTypeButtonActive: {
    backgroundColor: colors.stellarPrimary,
  },
  qrTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  qrTypeTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  qrContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 25,
    marginBottom: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  qrCodeWrapper: {
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addressContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
    position: 'relative',
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.stellarPrimary,
    marginBottom: 5,
  },
  addressText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    paddingRight: 30,
  },
  copyIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -8,
  },
  currencyInfo: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  currencyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  currencySymbol: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.stellarPrimary,
    marginRight: 6,
  },
  currencyName: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  instructionsContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    marginBottom: 25,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.stellarPrimary,
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: colors.stellarPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  balanceInfo: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.stellarPrimary,
    marginBottom: 10,
  },
  balanceNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});