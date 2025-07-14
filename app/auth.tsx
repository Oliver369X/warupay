import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Hand, Wallet } from 'lucide-react-native';
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

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Esperando escaneo de mano...');
  const [buttonText, setButtonText] = useState('Iniciar Escaneo');

  const handleKYC = async () => {
    setLoading(true);
    setStatus('Escaneando mano...');
    
    // Simular tiempo de escaneo
    setTimeout(() => {
      setStatus('Verificando identidad...');
      
      setTimeout(() => {
        setLoading(false);
        setStatus('Autenticación exitosa!');
        setButtonText('Acceder a mi billetera');
        
        // Cambiar el comportamiento del botón
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      }, 1500);
    }, 2000);
  };

  const handleAlternativeAuth = () => {
    Alert.alert(
      'Método alternativo',
      'Por favor, contacta con soporte para configurar otro método de autenticación.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  return (
    <LinearGradient
      colors={[colors.stellarDark, colors.stellarPrimary]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Wallet size={32} color={colors.stellarSecondary} />
          <Text style={styles.logoText}>StellarPay</Text>
        </View>
        
        {/* KYC Container */}
        <View style={styles.kycContainer}>
          <Text style={styles.kycTitle}>Autenticación Biométrica</Text>
          <Text style={styles.kycSubtitle}>
            Coloca tu mano sobre el área de escaneo para verificar tu identidad
          </Text>
          
          {/* Hand Scan Area */}
          <View style={styles.handScanContainer}>
            <Hand size={60} color={colors.stellarPrimary} />
            <View style={styles.scanAnimation} />
          </View>
          
          <Text style={styles.kycStatus}>{status}</Text>
          
          <TouchableOpacity
            style={styles.kycButton}
            onPress={handleKYC}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.kycButtonText}>{buttonText}</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.alternativeContainer}>
            <Text style={styles.alternativeText}>
              ¿Problemas con el escaneo?{' '}
              <Text style={styles.alternativeLink} onPress={handleAlternativeAuth}>
                Usar otro método
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 10,
  },
  kycContainer: {
    width: '100%',
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  kycTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  kycSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 20,
  },
  handScanContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: colors.stellarPrimary,
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
  },
  scanAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.stellarPrimary,
    opacity: 0.6,
  },
  kycStatus: {
    fontSize: 14,
    color: colors.stellarPrimary,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  kycButton: {
    width: '100%',
    backgroundColor: colors.stellarPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: colors.stellarPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  kycButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  alternativeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  alternativeText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  alternativeLink: {
    color: colors.stellarPrimary,
    fontWeight: '600',
  },
});