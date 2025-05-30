import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from '../../components/LoginForm';

export default function Login() {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 