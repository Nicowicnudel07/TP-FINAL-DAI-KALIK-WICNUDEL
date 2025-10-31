import { useRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';

export default function CameraModal({ visible, onClose, onCapture }) {
  const cameraRef = useRef(null);

  const handleTakePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    onCapture(photo);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView ref={cameraRef} facing="front" style={styles.camera}>
          <View style={styles.cameraOverlay}>
            <Pressable style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
            <Pressable style={styles.captureButton} onPress={handleTakePicture}>
              <Text style={styles.captureText}>Capturar</Text>
            </Pressable>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    paddingBottom: 48,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  captureButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ffffffcc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    fontWeight: '700',
  },
});
