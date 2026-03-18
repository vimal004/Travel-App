import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useTheme } from '../../../config/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);

  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: null,
    location: '',
    bio: '',
    placesVisited: '',
    placesToVisit: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  // Autofill location if empty when entering edit mode
  useEffect(() => {
    if (isEditing && (!profile.location || profile.location.trim() === '')) {
      fetchLocation(false);
    }
  }, [isEditing]);

  const loadProfile = async () => {
    try {
      const currentUserEmail = await AsyncStorage.getItem('currentUser');
      if (currentUserEmail) {
        setEmail(currentUserEmail);
        
        let initialName = '';
        // get basic user db info
        const usersStr = await AsyncStorage.getItem('users_db');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          if (users[currentUserEmail]) {
            initialName = users[currentUserEmail].name;
          }
        }

        // load extended profile
        const profileStr = await AsyncStorage.getItem(`profile_${currentUserEmail}`);
        if (profileStr) {
          const savedProfile = JSON.parse(profileStr);
          setProfile({
            ...savedProfile,
            name: savedProfile.name || initialName,
            email: currentUserEmail,
          });
        } else {
          setProfile(prev => ({ ...prev, name: initialName, email: currentUserEmail }));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      if (email) {
        await AsyncStorage.setItem(`profile_${email}`, JSON.stringify({
          name: profile.name,
          avatar: profile.avatar,
          location: profile.location,
          bio: profile.bio,
          placesVisited: profile.placesVisited,
          placesToVisit: profile.placesToVisit,
        }));
        
        // Update users_db to reflect name change globally
        const usersStr = await AsyncStorage.getItem('users_db');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          if (users[email]) {
            users[email].name = profile.name;
            await AsyncStorage.setItem('users_db', JSON.stringify(users));
          }
        }
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async (useCamera = false) => {
    setShowImageModal(false);
    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7, // Slightly higher quality
      };

      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Permission Required", 
            "Camera access is needed to take a profile picture. Please enable it in settings."
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Permission Required", 
            "Gallery access is needed to pick a profile picture. Please enable it in settings."
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfile(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    }
  };

  const handleImageOption = () => {
    if (!isEditing) return;
    setShowImageModal(true);
  };

  const fetchLocation = async (isManual = true) => {
    if (!isEditing) return;
    setLocationLoading(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        // Only alert if the user explicitly clicked the button
        if (isManual) {
          Alert.alert('Permission Denied', 'Location permission is needed to autofill your city. Please enable it in system settings.');
        }
        return;
      }

      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        if (profile.location) {
          Alert.alert('Location Disabled', 'Please enable location services to use this feature.');
        }
        return;
      }

      // Try to get last known position first (much faster)
      let locationResponse = await Location.getLastKnownPositionAsync({});
      
      // If no last known position or it's too old, get current
      if (!locationResponse) {
        locationResponse = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      const { latitude, longitude } = locationResponse.coords;
      let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        
        // Intelligent extraction of city/locality
        const city = address.city || address.subregion || address.district || address.name || address.city;
        const region = address.region;
        const country = address.country;
        
        const locationParts = [];
        if (city && city !== address.region) locationParts.push(city);
        if (region) locationParts.push(region);
        if (country) locationParts.push(country);
        
        const locationString = locationParts.filter(Boolean).join(', ');
        
        if (locationString) {
          setProfile(prev => ({ ...prev, location: locationString }));
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Could not determine location. Ensure location services are enabled.');
    } finally {
      setLocationLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Profile</Text>
        {isEditing ? (
          <TouchableOpacity style={styles.headerButtonAction} onPress={saveProfile} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.headerButtonAction} onPress={() => setIsEditing(true)}>
             <Ionicons name="pencil" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleImageOption} disabled={!isEditing} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={50} color={colors.secondaryText} />
              )}
              {isEditing && (
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={16} color={colors.onPrimary} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Fields */}
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
            <Ionicons name="person-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
              editable={isEditing}
              placeholder="Your Name"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputContainer, styles.inputDisabled]}>
            <Ionicons name="mail-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={profile.email}
              editable={false}
              placeholder="Your Email"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <Text style={styles.label}>Location</Text>
          <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
            <Ionicons name="location-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={profile.location}
              onChangeText={(text) => setProfile(prev => ({ ...prev, location: text }))}
              editable={isEditing}
              placeholder="E.g., New York, USA"
              placeholderTextColor={colors.secondaryText}
            />
            {isEditing && (
              <TouchableOpacity onPress={() => fetchLocation(true)} disabled={locationLoading} style={styles.actionIcon}>
                {locationLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Ionicons name="navigate-outline" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Bio</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer, !isEditing && styles.inputDisabled]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profile.bio}
              onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
              editable={isEditing}
              placeholder="Tell us a few lines about yourself..."
              placeholderTextColor={colors.secondaryText}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Travel Stats Fields */}
          <Text style={styles.label}>Places Visited</Text>
          <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
            <Ionicons name="airplane-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={profile.placesVisited}
              onChangeText={(text) => setProfile(prev => ({ ...prev, placesVisited: text }))}
              editable={isEditing}
              placeholder="e.g. 15 countries"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <Text style={styles.label}>Places to Visit</Text>
          <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
            <Ionicons name="map-outline" size={20} color={colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={profile.placesToVisit}
              onChangeText={(text) => setProfile(prev => ({ ...prev, placesToVisit: text }))}
              editable={isEditing}
              placeholder="e.g. Japan, Iceland"
              placeholderTextColor={colors.secondaryText}
            />
          </View>
        </View>

      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowImageModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowImageModal(false)}>
                <Ionicons name="close" size={24} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalOptions}>
              <TouchableOpacity 
                style={styles.modalOption} 
                onPress={() => pickImage(true)}
              >
                <View style={[styles.modalIconContainer, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="camera" size={24} color={colors.primary} />
                </View>
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalOption} 
                onPress={() => pickImage(false)}
              >
                <View style={[styles.modalIconContainer, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="images" size={24} color={colors.primary} />
                </View>
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              {profile.avatar && (
                <TouchableOpacity 
                  style={styles.modalOption} 
                  onPress={() => {
                    setProfile(prev => ({ ...prev, avatar: null }));
                    setShowImageModal(false);
                  }}
                >
                  <View style={[styles.modalIconContainer, { backgroundColor: colors.error + '15' }]}>
                    <Ionicons name="trash-outline" size={24} color={colors.error} />
                  </View>
                  <Text style={[styles.modalOptionText, { color: colors.error }]}>Remove Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  headerTitle: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 20,
    color: colors.primaryText,
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerButtonAction: {
    padding: 8,
    marginRight: -8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  section: {
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceVariant,
    opacity: 0.8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'GoogleSans-Regular',
    fontSize: 16,
    color: colors.primaryText,
    paddingVertical: 12,
  },
  actionIcon: {
    padding: 8,
    marginRight: -8,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 20,
    color: colors.primaryText,
  },
  modalOptions: {
    gap: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalOptionText: {
    fontFamily: 'GoogleSans-Regular',
    fontSize: 16,
    color: colors.primaryText,
  },
});

export default ProfileScreen;
