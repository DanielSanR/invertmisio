import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { resetPassword, error, clearError, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setValidationError('El correo electrónico es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Correo electrónico inválido');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Password reset error:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Recuperar Contraseña
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para
            restablecer tu contraseña.
          </Text>
        </View>

        {resetSent ? (
          <View style={styles.successContainer}>
            <Text variant="titleMedium" style={styles.successTitle}>
              ¡Correo Enviado!
            </Text>
            <Text variant="bodyMedium" style={styles.successText}>
              Hemos enviado las instrucciones para restablecer tu contraseña a {email}.
              Por favor, revisa tu bandeja de entrada.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}
            >
              Volver al Inicio de Sesión
            </Button>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              label="Correo Electrónico"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
                setValidationError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!validationError || !!error}
              style={styles.input}
            />
            <HelperText type="error" visible={!!validationError}>
              {validationError}
            </HelperText>

            {error && (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
              style={styles.resetButton}
            >
              Enviar Instrucciones
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.cancelButton}
            >
              Volver al Inicio de Sesión
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 24,
  },
  cancelButton: {
    marginTop: 8,
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  backButton: {
    marginTop: 24,
  },
});

export default ForgotPasswordScreen;
