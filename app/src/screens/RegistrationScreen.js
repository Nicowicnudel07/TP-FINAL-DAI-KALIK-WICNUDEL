import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegistrationScreen() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro inicial</Text>
      <Text style={styles.paragraph}>
        Solo estamos capturando nombre y apellido. La cámara, ubicación, notificaciones y vibración se irán sumando más
        adelante.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          placeholder="Tu apellido"
          value={surname}
          onChangeText={setSurname}
          style={styles.input}
        />
      </View>

      <View style={styles.todoBox}>
        <Text style={styles.todoTitle}>Pendientes</Text>
        <Text style={styles.todoItem}>• Agregar captura con cámara</Text>
        <Text style={styles.todoItem}>• Guardar ubicación del usuario</Text>
        <Text style={styles.todoItem}>• Enviar notificación y vibración de feedback</Text>
      </View>

      <Button title="Confirmar (todavía no disponible)" onPress={() => {}} disabled />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: 15,
    color: '#555',
  },
  field: {
    gap: 6,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  todoBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 12,
    gap: 4,
    backgroundColor: '#f9fafb',
  },
  todoTitle: {
    fontWeight: '600',
  },
  todoItem: {
    fontSize: 14,
  },
});
