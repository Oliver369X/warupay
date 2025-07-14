import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Switch } from 'react-native';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Edit3,
  Smartphone,
  Globe,
  Star,
  ChevronRight,
  Mail,
  Phone,
  CreditCard,
  Eye,
  EyeOff
} from 'lucide-react-native';

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, title, subtitle, onPress, showChevron = true }) => (
  <TouchableOpacity style={styles.profileItem} onPress={onPress}>
    <View style={styles.profileItemLeft}>
      {icon}
      <View style={styles.profileItemText}>
        <Text style={styles.profileItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {showChevron && <ChevronRight size={20} color="#B0B0B0" />}
  </TouchableOpacity>
);

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const userInfo = {
    name: "Carlos Mendoza",
    email: "carlos.mendoza@example.com",
    phone: "+591 7000 0000",
    verified: true,
    balance: "1,250.00",
    currency: "BOB"
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={20} color="#7D00FF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/80x80.png?text=CM' }}
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <Shield size={16} color="#00A876" />
            </View>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
            <View style={styles.verifiedContainer}>
              <Shield size={14} color="#00A876" />
              <Text style={styles.verifiedText}>Cuenta verificada</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={16} color="#666" /> : <EyeOff size={16} color="#666" />}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? `${userInfo.balance} ${userInfo.currency}` : '••••••'}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración de cuenta</Text>
        <View style={styles.sectionContent}>
          <ProfileItem
            icon={<User size={20} color="#7D00FF" />}
            title="Información personal"
            subtitle="Editar datos personales"
            onPress={() => console.log('Personal info')}
          />
          <ProfileItem
            icon={<CreditCard size={20} color="#7D00FF" />}
            title="Métodos de pago"
            subtitle="Gestionar tarjetas y cuentas"
            onPress={() => console.log('Payment methods')}
          />
          <ProfileItem
            icon={<Shield size={20} color="#7D00FF" />}
            title="Seguridad"
            subtitle="PIN, biometría y verificación"
            onPress={() => console.log('Security')}
          />
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        <View style={styles.sectionContent}>
          <View style={styles.profileItem}>
            <View style={styles.profileItemLeft}>
              <Bell size={20} color="#7D00FF" />
              <View style={styles.profileItemText}>
                <Text style={styles.profileItemTitle}>Notificaciones</Text>
                <Text style={styles.profileItemSubtitle}>Alertas y recordatorios</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E0E0E0', true: '#7D00FF' }}
              thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.profileItem}>
            <View style={styles.profileItemLeft}>
              <Smartphone size={20} color="#7D00FF" />
              <View style={styles.profileItemText}>
                <Text style={styles.profileItemTitle}>Biometría</Text>
                <Text style={styles.profileItemSubtitle}>Huella dactilar y Face ID</Text>
              </View>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: '#E0E0E0', true: '#7D00FF' }}
              thumbColor={biometrics ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <ProfileItem
            icon={<Globe size={20} color="#7D00FF" />}
            title="Idioma"
            subtitle="Español"
            onPress={() => console.log('Language')}
          />
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.sectionContent}>
          <ProfileItem
            icon={<HelpCircle size={20} color="#7D00FF" />}
            title="Centro de ayuda"
            subtitle="Preguntas frecuentes y tutoriales"
            onPress={() => console.log('Help center')}
          />
          <ProfileItem
            icon={<Mail size={20} color="#7D00FF" />}
            title="Contactar soporte"
            subtitle="Envianos un mensaje"
            onPress={() => console.log('Contact support')}
          />
          <ProfileItem
            icon={<Star size={20} color="#7D00FF" />}
            title="Calificar app"
            subtitle="¿Qué te parece Warupay?"
            onPress={() => console.log('Rate app')}
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.sectionContent}>
          <ProfileItem
            icon={<Settings size={20} color="#7D00FF" />}
            title="Acerca de Warupay"
            subtitle="Versión 1.0.0"
            onPress={() => console.log('About')}
          />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#FF4757" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Warupay v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 Warupay. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  editButton: {
    padding: 8,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E6ED',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 8,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#00A876',
    marginLeft: 4,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 12,
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 14,
    color: '#636E72',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4757',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 90,
  },
  footerText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 4,
  },
}); 