import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const students = [
  { id: '1', fullName: 'Ali Bennani', branch: 'Informatique' },
  { id: '2', fullName: 'Sofia El Amrani', branch: 'Gestion' },
  { id: '3', fullName: 'Omar Boulhrouz', branch: 'Marketing' },
  { id: '4', fullName: 'Sara Mounir', branch: 'Finance' },
  { id: '5', fullName: 'Youssef Khalladi', branch: 'Logistique' },
];

export default function Students() {
  const renderItem = ({ item }: { item: typeof students[0] }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.fullName}</Text>
      <Text style={styles.branch}>{item.branch}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050f2d',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f57e27',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  branch: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 4,
  },
});
