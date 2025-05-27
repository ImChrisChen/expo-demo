import CameraDemo from '@/components/CameraDemo';
import { Audio } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * Expo功能演示页面
 * 这个页面展示了Expo框架的主要能力，帮助初学者快速了解可用的功能
 */
export default function DemoScreen() {
  // 状态管理 - 用于存储各种功能的数据
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [accelerometerData, setAccelerometerData] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // 组件挂载时初始化设备信息
  useEffect(() => {
    loadDeviceInfo();
    startAccelerometer();
    
    // 清理函数：组件卸载时清理资源
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  /**
   * 1. 设备信息获取
   * 使用expo-device包获取设备的基本信息
   */
  const loadDeviceInfo = async () => {
    try {
      const info = {
        deviceName: Device.deviceName,           // 设备名称
        deviceType: Device.deviceType,           // 设备类型（手机/平板等）
        brand: Device.brand,                     // 品牌
        manufacturer: Device.manufacturer,        // 制造商
        modelName: Device.modelName,             // 型号
        osName: Device.osName,                   // 操作系统名称
        osVersion: Device.osVersion,             // 操作系统版本
        platformApiLevel: Device.platformApiLevel, // API级别(Android)
        totalMemory: Device.totalMemory,         // 总内存
        isDevice: Device.isDevice,               // 是否为真实设备
      };
      setDeviceInfo(info);
    } catch (error: any) {
      console.error('获取设备信息失败:', error);
    }
  };

  /**
   * 2. 地理位置功能
   * 使用expo-location获取用户当前位置
   */
  const getCurrentLocation = async () => {
    try {
      // 请求位置权限
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限被拒绝', '需要位置权限才能获取当前位置');
        return;
      }

      // 获取当前位置
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // 高精度定位
      });
      setLocation(location);
      
      Alert.alert(
        '位置信息', 
        `纬度: ${location.coords.latitude.toFixed(6)}\n经度: ${location.coords.longitude.toFixed(6)}\n精度: ${location.coords.accuracy}米`
      );
    } catch (error: any) {
      Alert.alert('获取位置失败', error.message || '位置获取失败');
    }
  };

  /**
   * 3. 传感器功能
   * 使用expo-sensors访问设备传感器（加速度计）
   */
  const startAccelerometer = () => {
    // 设置传感器更新频率
    Sensors.Accelerometer.setUpdateInterval(1000); // 每秒更新一次
    
    // 订阅加速度计数据
    const subscription = Sensors.Accelerometer.addListener(accelerometerData => {
      setAccelerometerData(accelerometerData);
    });

    // 返回取消订阅函数（在组件卸载时调用）
    return () => subscription.remove();
  };

  /**
   * 4. 文件系统操作
   * 使用expo-file-system进行文件读写操作
   */
  const demonstrateFileSystem = async () => {
    try {
      const fileName = 'demo.txt';
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const content = `这是一个演示文件\n创建时间: ${new Date().toLocaleString()}`;

      // 写入文件
      await FileSystem.writeAsStringAsync(fileUri, content);
      
      // 读取文件
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      
      // 获取文件信息
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      let fileSize = '未知';
      if (fileInfo.exists && !fileInfo.isDirectory) {
        fileSize = `${(fileInfo as any).size || 0} 字节`;
      }
      
      Alert.alert(
        '文件系统演示',
        `文件已创建并读取成功！\n\n文件内容:\n${fileContent}\n\n文件大小: ${fileSize}`
      );
    } catch (error: any) {
      Alert.alert('文件操作失败', error.message || '文件操作失败');
    }
  };

  /**
   * 5. 剪贴板功能
   * 使用expo-clipboard进行复制粘贴操作
   */
  const demonstrateClipboard = async () => {
    const textToCopy = '这是通过Expo复制到剪贴板的文本！🎉';
    
    try {
      // 复制到剪贴板
      await Clipboard.setStringAsync(textToCopy);
      
      // 从剪贴板读取
      const clipboardContent = await Clipboard.getStringAsync();
      
      Alert.alert(
        '剪贴板演示',
        `已复制文本到剪贴板！\n\n剪贴板内容:\n${clipboardContent}`
      );
    } catch (error: any) {
      Alert.alert('剪贴板操作失败', error.message || '剪贴板操作失败');
    }
  };

  /**
   * 6. 网页浏览器功能
   * 使用expo-web-browser打开外部链接
   */
  const openWebBrowser = async () => {
    try {
      // 打开外部网页
      const result = await WebBrowser.openBrowserAsync('https://expo.dev', {
        toolbarColor: '#6366f1', // 工具栏颜色
        secondaryToolbarColor: '#4f46e5', // 次要工具栏颜色
        showTitle: true, // 显示标题
        enableBarCollapsing: true, // 启用工具栏折叠
      });
      
      console.log('浏览器结果:', result);
    } catch (error: any) {
      Alert.alert('打开浏览器失败', error.message || '打开浏览器失败');
    }
  };

  /**
   * 7. 触觉反馈功能
   * 使用expo-haptics提供触觉反馈
   */
  const demonstrateHaptics = () => {
    // 轻微触觉反馈
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('触觉反馈', '你应该感受到了轻微的震动！');
  };

  /**
   * 8. 相机功能
   * 使用expo-camera进行拍照
   */
  const openCamera = () => {
    setShowCamera(true);
  };

  /**
   * 9. 音频播放功能
   * 使用expo-av播放音频
   */
  const playSound = async () => {
    try {
      Alert.alert('音频功能', '音频播放功能已就绪！\n在真实项目中，你可以加载并播放音频文件。');
    } catch (error: any) {
      Alert.alert('音频播放失败', '无法加载音频文件');
    }
  };

  /**
   * 10. 应用常量信息
   * 使用expo-constants获取应用和设备常量
   */
  const showAppConstants = () => {
    const constants = {
      appVersion: Constants.expoConfig?.version || '未知',
      sdkVersion: Constants.expoConfig?.sdkVersion || '未知',
      platform: Constants.platform,
      statusBarHeight: Constants.statusBarHeight,
      deviceId: Constants.sessionId,
    };

    Alert.alert(
      '应用常量',
      `应用版本: ${constants.appVersion}\nSDK版本: ${constants.sdkVersion}\n平台: ${JSON.stringify(constants.platform)}\n状态栏高度: ${constants.statusBarHeight}px`
    );
  };

  // 演示功能列表
  const demoFeatures = [
    {
      title: '设备信息',
      description: '获取设备基本信息（品牌、型号、系统等）',
      onPress: () => Alert.alert('设备信息', JSON.stringify(deviceInfo, null, 2)),
      color: '#10b981',
    },
    {
      title: '地理位置',
      description: '获取用户当前GPS位置',
      onPress: getCurrentLocation,
      color: '#3b82f6',
    },
    {
      title: '传感器数据',
      description: '实时显示加速度计传感器数据',
      onPress: () => Alert.alert('传感器', accelerometerData ? 
        `当前加速度计数据:\nX: ${accelerometerData.x?.toFixed(3)}\nY: ${accelerometerData.y?.toFixed(3)}\nZ: ${accelerometerData.z?.toFixed(3)}` : 
        '传感器数据加载中...'
      ),
      color: '#f97316',
    },
    {
      title: '文件系统',
      description: '文件的创建、读取和写入操作',
      onPress: demonstrateFileSystem,
      color: '#8b5cf6',
    },
    {
      title: '剪贴板',
      description: '复制和粘贴文本内容',
      onPress: demonstrateClipboard,
      color: '#f59e0b',
    },
    {
      title: '网页浏览器',
      description: '在应用内打开外部网页',
      onPress: openWebBrowser,
      color: '#ef4444',
    },
    {
      title: '触觉反馈',
      description: '提供震动和触觉反馈',
      onPress: demonstrateHaptics,
      color: '#06b6d4',
    },
    {
      title: '相机拍照',
      description: '使用设备相机拍照功能',
      onPress: openCamera,
      color: '#dc2626',
    },
    {
      title: '音频播放',
      description: '播放本地或网络音频文件',
      onPress: playSound,
      color: '#84cc16',
    },
    {
      title: '应用常量',
      description: '获取应用和平台相关的常量信息',
      onPress: showAppConstants,
      color: '#a855f7',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar style="auto" />
        
        {/* 标题区域 */}
        <View style={styles.header}>
          <Text style={styles.title}>🚀 Expo 功能演示</Text>
          <Text style={styles.subtitle}>
            探索Expo框架的强大功能，点击下方按钮体验各种API
          </Text>
        </View>

        {/* 实时传感器数据显示 */}
        {accelerometerData && (
          <View style={styles.sensorCard}>
            <Text style={styles.sensorTitle}>📱 实时加速度计数据</Text>
            <Text style={styles.sensorData}>
              X: {accelerometerData.x?.toFixed(2) || 0}
            </Text>
            <Text style={styles.sensorData}>
              Y: {accelerometerData.y?.toFixed(2) || 0}
            </Text>
            <Text style={styles.sensorData}>
              Z: {accelerometerData.z?.toFixed(2) || 0}
            </Text>
          </View>
        )}

        {/* 功能演示按钮列表 */}
        <View style={styles.featuresContainer}>
          {demoFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureButton, { borderLeftColor: feature.color }]}
              onPress={feature.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 学习提示 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 学习提示</Text>
          <Text style={styles.tipText}>
            • 每个功能都有详细的代码注释，可以查看源码学习
          </Text>
          <Text style={styles.tipText}>
            • 某些功能需要权限，请在弹窗中允许权限请求
          </Text>
          <Text style={styles.tipText}>
            • 在真实设备上测试以获得完整的功能体验
          </Text>
          <Text style={styles.tipText}>
            • 查看Expo官方文档了解更多高级用法
          </Text>
        </View>

        {/* 更多学习资源 */}
        <View style={styles.resourceCard}>
          <Text style={styles.resourceTitle}>📚 学习资源</Text>
          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => WebBrowser.openBrowserAsync('https://docs.expo.dev')}
          >
            <Text style={styles.resourceButtonText}>Expo 官方文档</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => WebBrowser.openBrowserAsync('https://snack.expo.dev')}
          >
            <Text style={styles.resourceButtonText}>Expo Snack 在线编辑器</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => WebBrowser.openBrowserAsync('https://expo.dev/examples')}
          >
            <Text style={styles.resourceButtonText}>示例项目</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 相机模态框 */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
          <CameraDemo />
        </View>
      </Modal>
    </View>
  );
}

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    lineHeight: 22,
  },
  sensorCard: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  sensorData: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  featuresContainer: {
    padding: 16,
  },
  featureButton: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  tipCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 8,
    lineHeight: 20,
  },
  resourceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    marginBottom: 30,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: 12,
  },
  resourceButton: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  resourceButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    zIndex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366f1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
}); 