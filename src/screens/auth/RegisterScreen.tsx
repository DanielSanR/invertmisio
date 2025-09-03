import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText,
  SegmentedButtons,
} from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile } from '../../services/authService';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { register, error, clearError, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('worker');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      displayName?: string;
    } = {};

    if (!email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Correo electrónico inválido';
    }

    if (!password) {
      errors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!displayName.trim()) {
      errors.displayName = 'El nombre es requerido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      await register(email, password, {
        displayName,
        organization,
        phoneNumber,
        role,
      });
      // Navigation will be handled by the auth state change in the navigation container
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration error:', err);
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
            Crear Cuenta
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Nombre"
            value={displayName}
            onChangeText={(text) => {
              setDisplayName(text);
              setValidationErrors({ ...validationErrors, displayName: undefined });
            }}
            error={!!validationErrors.displayName}
            style={styles.input}
          />
          <HelperText type="error" visible={!!validationErrors.displayName}>
            {validationErrors.displayName}
          </HelperText>

          <TextInput
            label="Correo Electrónico"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError();
              setValidationErrors({ ...validationErrors, email: undefined });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!validationErrors.email || !!error}
            style={styles.input}
          />
          <HelperText type="error" visible={!!validationErrors.email}>
            {validationErrors.email}
          </HelperText>

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setValidationErrors({ ...validationErrors, password: undefined });
            }}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!validationErrors.password}
            style={styles.input}
          />
          <HelperText type="error" visible={!!validationErrors.password}>
            {validationErrors.password}
          </HelperText>

          <TextInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setValidationErrors({ ...validationErrors, confirmPassword: undefined });
            }}
            secureTextEntry={!showPassword}
            error={!!validationErrors.confirmPassword}
            style={styles.input}
          />
          <HelperText type="error" visible={!!validationErrors.confirmPassword}>
            {validationErrors.confirmPassword}
          </HelperText>

          <TextInput
            label="Organización"
            value={organization}
            onChangeText={setOrganization}
            style={styles.input}
          />

          <TextInput
            label="Teléfono"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text variant="bodyMedium" style={styles.roleLabel}>
            Rol en la Organización
          </Text>
          <SegmentedButtons
            value={role}
            onValueChange={(value: string) => setRole(value as UserProfile['role'])}
            buttons={[
              { value: 'worker', label: 'Trabajador' },
              { value: 'manager', label: 'Gerente' },
              { value: 'admin', label: 'Administrador' },
            ]}
            style={styles.roleButtons}
          />

          {error && (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
          >
            Registrarse
          </Button>

          <View style={styles.loginContainer}>
            <Text variant="bodyMedium">¿Ya tienes una cuenta? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
            >
              Inicia Sesión
            </Button>
          </View>
        </View>
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
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 8,
  },
  roleLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  roleButtons: {
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginButton: {
    marginLeft: -8,
  },
});

export default RegisterScreen;
