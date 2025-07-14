import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Clock, CreditCard, Banknote, Search, Filter, User, Shield, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

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

// Datos de lugares que aceptan Stellar - con coordenadas reales de La Paz
const stellarPlaces = [
  {
    id: 'cafe-stellar',
    name: 'Café Stellar',
    type: 'restaurant',
    category: 'Cafetería',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Av. Arce #1234, La Paz',
    distance: '0.5 km',
    hours: 'Lun-Vie: 8:00 - 22:00',
    currencies: ['BOB', 'XLM', 'USDT', 'USDC'],
    rating: 4.8,
    verified: true,
    coordinates: {
      latitude: -16.495478,
      longitude: -68.133448,
    },
  },
  {
    id: 'hotel-lumens',
    name: 'Hotel Lumens',
    type: 'hotel',
    category: 'Hospedaje',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Rosario #567, La Paz',
    distance: '1.2 km',
    hours: '24 horas',
    currencies: ['BOB', 'XLM', 'USDT'],
    rating: 4.6,
    verified: true,
    coordinates: {
      latitude: -16.498956,
      longitude: -68.125234,
    },
  },
  {
    id: 'farmacia-crypto',
    name: 'Farmacia CryptoCare',
    type: 'pharmacy',
    category: 'Farmacia',
    image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Sagárnaga #890, La Paz',
    distance: '0.8 km',
    hours: 'Lun-Sab: 8:00 - 20:00',
    currencies: ['BOB', 'USDT', 'USDC'],
    rating: 4.4,
    verified: true,
    coordinates: {
      latitude: -16.492134,
      longitude: -68.128567,
    },
  },
  {
    id: 'restaurant-stellar',
    name: 'Restaurante Stellar Grill',
    type: 'restaurant',
    category: 'Restaurante',
    image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Av. 16 de Julio #1456, La Paz',
    distance: '1.8 km',
    hours: 'Lun-Dom: 12:00 - 23:00',
    currencies: ['BOB', 'XLM', 'USDT', 'USDC'],
    rating: 4.7,
    verified: true,
    coordinates: {
      latitude: -16.501234,
      longitude: -68.135678,
    },
  },
];

// Datos de cajeros P2P
const p2pCashiers = [
  {
    id: 'cajero-maria',
    name: 'María González',
    type: 'p2p',
    category: 'Cajero P2P',
    image: 'https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Plaza Murillo, La Paz',
    distance: '0.3 km',
    hours: 'Lun-Vie: 9:00 - 18:00',
    currencies: ['BOB', 'XLM', 'USDT'],
    rating: 4.9,
    verified: true,
    transactions: 456,
    limits: 'Bs. 50 - 5,000',
    commission: '1.5%',
    coordinates: {
      latitude: -16.496789,
      longitude: -68.130234,
    },
  },
  {
    id: 'cajero-carlos',
    name: 'Carlos Mendoza',
    type: 'p2p',
    category: 'Cajero P2P',
    image: 'https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Av. Camacho #789, La Paz',
    distance: '0.9 km',
    hours: 'Lun-Sab: 10:00 - 19:00',
    currencies: ['BOB', 'XLM', 'USDT', 'USDC'],
    rating: 4.8,
    verified: true,
    transactions: 234,
    limits: 'Bs. 100 - 3,000',
    commission: '2%',
    coordinates: {
      latitude: -16.503456,
      longitude: -68.132567,
    },
  },
  {
    id: 'cajero-ana',
    name: 'Ana Rodríguez',
    type: 'p2p',
    category: 'Cajero P2P',
    image: 'https://images.pexels.com/photos/4050297/pexels-photo-4050297.jpeg?auto=compress&cs=tinysrgb&w=500',
    address: 'Mercado Lanza, La Paz',
    distance: '1.1 km',
    hours: 'Lun-Dom: 8:00 - 20:00',
    currencies: ['BOB', 'XLM', 'USDT'],
    rating: 4.6,
    verified: true,
    transactions: 678,
    limits: 'Bs. 50 - 2,500',
    commission: '1.8%',
    coordinates: {
      latitude: -16.491234,
      longitude: -68.136789,
    },
  },
];

export default function MapsScreen() {
  const [activeTab, setActiveTab] = useState('stellar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getCurrentData = () => {
    if (activeTab === 'stellar') {
      return stellarPlaces.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return p2pCashiers.filter(cashier => 
        cashier.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  const onPlacePress = (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const renderPlaceCard = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.placeCard}
      onPress={() => onPlacePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.placeImage} />
      
      <View style={styles.placeInfo}>
        <View style={styles.placeHeader}>
          <View style={styles.placeTitle}>
            <Text style={styles.placeName}>{item.name}</Text>
            {item.verified && (
              <Shield size={14} color={colors.success} style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={styles.placeCategory}>{item.category}</Text>
        </View>
        
        <View style={styles.placeDetail}>
          <MapPin size={12} color={colors.gray} />
          <Text style={styles.placeAddress}>{item.address}</Text>
        </View>
        
        <View style={styles.placeDetail}>
          <Navigation size={12} color={colors.stellarPrimary} />
          <Text style={styles.placeDistance}>{item.distance}</Text>
        </View>
        
        <View style={styles.placeDetail}>
          <Clock size={12} color={colors.gray} />
          <Text style={styles.placeHours}>{item.hours}</Text>
        </View>
        
        {item.type === 'p2p' ? (
          <View style={styles.p2pInfo}>
            <View style={styles.p2pDetail}>
              <User size={12} color={colors.stellarPrimary} />
              <Text style={styles.p2pText}>{item.transactions} transacciones</Text>
            </View>
            <View style={styles.p2pDetail}>
              <Banknote size={12} color={colors.success} />
              <Text style={styles.p2pText}>{item.limits}</Text>
            </View>
            <View style={styles.p2pDetail}>
              <Text style={styles.p2pCommission}>Comisión: {item.commission}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.currencyInfo}>
            <CreditCard size={12} color={colors.stellarPrimary} />
            <Text style={styles.currencyText}>
              Acepta: {item.currencies.join(', ')}
            </Text>
          </View>
        )}
        
        <View style={styles.placeFooter}>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {item.type === 'p2p' ? 'Contactar' : 'Ver detalles'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedPlace && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={24} color={colors.gray} />
                </TouchableOpacity>
              </View>
              
              <Image source={{ uri: selectedPlace.image }} style={styles.modalImage} />
              
              <View style={styles.modalInfo}>
                <View style={styles.infoRow}>
                  <MapPin size={16} color={colors.gray} />
                  <Text style={styles.infoText}>{selectedPlace.address}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Clock size={16} color={colors.gray} />
                  <Text style={styles.infoText}>{selectedPlace.hours}</Text>
                </View>
                
                {selectedPlace.type === 'p2p' ? (
                  <>
                    <View style={styles.infoRow}>
                      <User size={16} color={colors.gray} />
                      <Text style={styles.infoText}>Transacciones: {selectedPlace.transactions}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Banknote size={16} color={colors.gray} />
                      <Text style={styles.infoText}>Límites: {selectedPlace.limits}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <CreditCard size={16} color={colors.gray} />
                      <Text style={styles.infoText}>Comisión: {selectedPlace.commission}</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.currencyContainer}>
                    <Text style={styles.currencyLabel}>Acepta:</Text>
                    <View style={styles.currencies}>
                      {selectedPlace.currencies.map((currency, index) => (
                        <View key={index} style={styles.currencyChip}>
                          <Text style={styles.currencyTextWhite}>{currency}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingTextModal}>★ {selectedPlace.rating}</Text>
                  {selectedPlace.verified && (
                    <View style={styles.verifiedBadge}>
                      <Shield size={12} color={colors.success} />
                      <Text style={styles.verifiedText}>Verificado</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <TouchableOpacity style={styles.navigateButton}>
                <Navigation size={16} color={colors.white} />
                <Text style={styles.navigateButtonText}>Cómo llegar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapas</Text>
        <Text style={styles.headerSubtitle}>Encuentra lugares y cajeros P2P</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stellar' && styles.activeTab]}
          onPress={() => setActiveTab('stellar')}
        >
          <Text style={[styles.tabText, activeTab === 'stellar' && styles.activeTabText]}>
            Lugares Stellar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'p2p' && styles.activeTab]}
          onPress={() => setActiveTab('p2p')}
        >
          <Text style={[styles.tabText, activeTab === 'p2p' && styles.activeTabText]}>
            Cajeros P2P
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar lugares..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.stellarPrimary} />
        </TouchableOpacity>
      </View>

      {/* Map Notice */}
      <View style={styles.mapNotice}>
        <MapPin size={24} color={colors.stellarPrimary} />
        <Text style={styles.mapNoticeText}>
          Mapa interactivo disponible en la app móvil
        </Text>
      </View>

      {/* Places List */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {getCurrentData().map(renderPlaceCard)}
        
        {getCurrentData().length === 0 && (
          <View style={styles.emptyState}>
            <MapPin size={48} color={colors.gray} />
            <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
            <Text style={styles.emptySubtitle}>
              Intenta cambiar los filtros o buscar con otros términos
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Place Details Modal */}
      {renderPlaceModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginTop: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.stellarPrimary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mapNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.stellarPrimary + '15',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  mapNoticeText: {
    fontSize: 14,
    color: colors.stellarPrimary,
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  placeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeImage: {
    width: '100%',
    height: 120,
  },
  placeInfo: {
    padding: 15,
  },
  placeHeader: {
    marginBottom: 10,
  },
  placeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  placeCategory: {
    fontSize: 12,
    color: colors.stellarPrimary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  placeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  placeAddress: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  placeDistance: {
    fontSize: 13,
    color: colors.stellarPrimary,
    fontWeight: '500',
  },
  placeHours: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  p2pInfo: {
    marginTop: 8,
    padding: 10,
    backgroundColor: colors.light,
    borderRadius: 8,
  },
  p2pDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  p2pText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  p2pCommission: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  currencyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  rating: {
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  actionButton: {
    backgroundColor: colors.stellarPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 10,
  },
  currencyContainer: {
    marginTop: 10,
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  currencies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyChip: {
    backgroundColor: colors.stellarPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  currencyTextWhite: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingTextModal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
    marginRight: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  navigateButton: {
    backgroundColor: colors.stellarPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  navigateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 