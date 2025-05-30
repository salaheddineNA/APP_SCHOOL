import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, loading, error } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Plus de statistiques virtuelles ajoutées ici
  const [stats, setStats] = useState({
    coursesCompleted: 12,
    attendanceRate: 92, // en %
    upcomingExams: 3,
    projectsSubmitted: 5,
    averageGrade: 15.6,
    eventsAttended: 8,
    libraryBooksBorrowed: 4,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Ici tu pourrais fetcher des vraies données depuis une API
        // await fetch(...);
        // setStats(responseData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.reload()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Section statistiques */}
      <Text style={styles.sectionTitle}>Statistiques</Text>
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#4ECDC4' }]}>
          <Ionicons name="checkmark-done-outline" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.coursesCompleted}</Text>
          <Text style={styles.statLabel}>Cours terminés</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#f57e27' }]}>
          <Ionicons name="calendar-outline" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.attendanceRate}%</Text>
          <Text style={styles.statLabel}>Taux de présence</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#FF6B6B' }]}>
          <Ionicons name="alarm-outline" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.upcomingExams}</Text>
          <Text style={styles.statLabel}>Examens à venir</Text>
        </View>
      </View>

      {/* Nouvelle ligne de statistiques */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#556270' }]}>
          <Ionicons name="folder-open-outline" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.projectsSubmitted}</Text>
          <Text style={styles.statLabel}>Projets soumis</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#C7F464' }]}>
          <Ionicons name="star-outline" size={32} color="#333" />
          <Text style={[styles.statValue, { color: '#333' }]}>{stats.averageGrade}</Text>
          <Text style={[styles.statLabel, { color: '#333' }]}>Moyenne générale</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#FF6F61' }]}>
          <Ionicons name="people-outline" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.eventsAttended}</Text>
          <Text style={styles.statLabel}>Événements assistés</Text>
        </View>
      </View>

      {/* Troisième ligne de statistiques */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#355C7D' }]}>
          <Ionicons name="book-outline" size={32} color="#fff" />
          <Text style={styles.statValue}>{stats.libraryBooksBorrowed}</Text>
          <Text style={styles.statLabel}>Livres empruntés</Text>
        </View>

        {/* Tu peux ajouter d'autres boîtes ici si tu souhaites */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050f2d' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F7' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F7F7F7' },
  errorText: { color: '#FF6B6B', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#f57e27', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f57e27',
    marginBottom: 20,
    textAlign: 'center',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
});
