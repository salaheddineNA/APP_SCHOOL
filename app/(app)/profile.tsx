import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UpdateStudentForm from '../../components/UpdateStudentForm';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

export default function Profile() {
  const { user: initialUser, student: initialStudent } = useAuth();
  const [user, setUser] = useState(initialUser);
  const [student, setStudent] = useState(initialStudent || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        if (response.data) {
          setUser(response.data.user);
          setStudent(response.data.student || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setUser(initialUser);
        setStudent(initialStudent || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      if (response.data) {
        setUser(response.data.user);
        setStudent(response.data.student || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f57e27" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      {user?.photo ? (
        <Image source={{ uri: user.photo }} style={styles.profileImage} />
      ) : (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profileInitials}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Text>
        </View>
      )}
      <Image source={require('../../assets/photo.jpg')} style={styles.photo} />
      <Text style={styles.name}>{user?.full_name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.role}>Role: {user?.role}</Text>

      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations Étudiant</Text>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => setShowUpdateForm(true)}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Matricule:</Text>
          <Text style={styles.value}>{student?.student_id || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Classe:</Text>
          <Text style={styles.value}>{student?.class || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Filière:</Text>
          <Text style={styles.value}>{student?.field || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Statut:</Text>
          <Text style={[styles.value, student?.status === 'active' ? styles.active : styles.inactive]}>
            {student?.status || 'N/A'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Téléphone:</Text>
          <Text style={styles.value}>{student?.phone || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date de naissance:</Text>
          <Text style={styles.value}>{formatDate(student?.birth_date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Sexe:</Text>
          <Text style={styles.value}>{student?.gender || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Adresse:</Text>
          <Text style={styles.value}>{student?.address || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Inscrit depuis:</Text>
          <Text style={styles.value}>{formatDate(student?.enrollment_date || 'N/A')}</Text>
        </View>
      </View>

      <UpdateStudentForm
        visible={showUpdateForm}
        onClose={() => setShowUpdateForm(false)}
        onUpdate={handleUpdate}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050f2d' },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f57e27',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInitials: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  email: { fontSize: 16, color: '#ccc', marginBottom: 4 },
  role: { fontSize: 16, color: '#f57e27', marginBottom: 20 },
  infoSection: {
    backgroundColor: '#1e264a',
    borderRadius: 12,
    padding: 15,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f57e27',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2c366b',
  },
  photo: {
    width: 50,
    height: 50,
    marginBottom: 30,
    borderRadius: 50,
  },
  label: { color: '#bbb', fontSize: 16 },
  value: { color: '#fff', fontSize: 16, fontWeight: '600' },
  active: { color: '#4ECDC4' },
  inactive: { color: '#FF6B6B' },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#f57e27',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
