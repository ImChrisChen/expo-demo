import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 相机功能演示组件
 * 演示如何使用expo-camera进行拍照和录像
 */
export default function CameraDemo() {
  // 相机权限状态
  const [permission, requestPermission] = useCameraPermissions();
  // 相机类型（前置/后置）
  const [facing, setFacing] = useState<CameraType>('back');
  // 相机引用
  const cameraRef = useRef<CameraView>(null);

  // 检查权限
  if (!permission) {
    // 权限加载中
    return <View />;
  }

  if (!permission.granted) {
    // 没有相机权限
    return (
      <View style={styles.container}>
        <Text style={styles.message}>需要相机权限才能使用此功能</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>授予相机权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * 切换相机（前置/后置）
   */
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  /**
   * 拍照功能
   */
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert('拍照成功', `照片已保存到: ${photo?.uri}`);
      } catch (error) {
        Alert.alert('拍照失败', '无法拍摄照片');
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>切换相机</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>拍照</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
}); 