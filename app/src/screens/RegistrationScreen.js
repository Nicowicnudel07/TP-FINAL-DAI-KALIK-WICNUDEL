import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegistrationScreen() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Registro inicial</Text>
        <Text style={styles.subtitle}>
          Empezamos con lo básico: completá tu nombre y apellido. Las demás funcionalidades se irán sumando de a poco.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Ingresá tu nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            placeholder="Ingresá tu apellido"
            value={surname}
            onChangeText={setSurname}
            style={styles.input}
          />
        </View>

        <View style={styles.pendingBox}>
          <Text style={styles.pendingTitle}>Próximos pasos</Text>
          <Text style={styles.pendingItem}>• Captura con cámara (pendiente)</Text>
          <Text style={styles.pendingItem}>• Ubicación del usuario (pendiente)</Text>
          <Text style={styles.pendingItem}>• Notificación + vibración (pendiente)</Text>
        </View>

        <Pressable style={styles.button} disabled>
          <Text style={styles.buttonText}>Confirmar (se habilitará más adelante)</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
  },
  pendingBox: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  pendingItem: {
    fontSize: 14,
    color: '#475569',
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#94a3b8',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
  },
});
