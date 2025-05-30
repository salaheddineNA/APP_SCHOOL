import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    birth_date: '',
    gender: '',
    birth_place: '',
    address: '',
    class: '',
    field: '',
    enrollment_date: '',
    description: ''
  });

  
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert("Permission required", "Camera roll permissions are needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (photo) {
      const fileUri = photo.uri;
      const fileName = fileUri.split('/').pop();
      const fileType = photo.type || 'image/jpeg';

      formData.append('photo', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      });
    }

    try {
      const response = await fetch('https://ifiag.pidefood.com/api/auth/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Registration successful', 'You are now registered.');
        router.replace('/dashboard'); // Redirect after registration
      } else {
        Alert.alert('Registration failed', data.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Remplacez par le bon chemin
        style={styles.logo}
      />
      <Text style={styles.title}>Student Registration</Text>

      {[
        ['first_name', 'First Name'],
        ['last_name', 'Last Name'],
        ['email', 'Email'],
        ['password', 'Password', true],
        ['phone', 'Phone'],
        ['birth_date', 'Birth Date (YYYY-MM-DD)'],
        ['gender', 'Gender (Male/Female)'],
        ['birth_place', 'Birth Place'],
        ['address', 'Address'],
        ['class', 'Class'],
        ['field', 'Field'],
        ['enrollment_date', 'Enrollment Date (YYYY-MM-DD)'],
        ['description', 'Description'],
      ].map(([key, label, secure]) => (
        <TextInput
          key={key}
          placeholder={label}
          secureTextEntry={secure}
          style={styles.input}
          value={form[key]}
          onChangeText={(text) => handleChange(key, text)}
        />
      ))}
      
      <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
        <Text style={styles.photoButtonText}>Pick Profile Photo</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}

      <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />
      <View style={styles.linksContainer}>
        <TouchableOpacity
                  style={styles.link}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.linkText}>
                    Don&apos;t have an account? Sign up
                  </Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: '#050f2d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#ffffff',
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    color: '#ffffff',
  },
  photoButton: {
    marginVertical: 10,
    backgroundColor: '#f57e27',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    padding: 10,
  },
  linkText: {
    color: '#f57e27',
    fontSize: 16,
  },
});
