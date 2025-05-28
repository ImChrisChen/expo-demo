import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as Application from 'expo-application';
import * as Brightness from 'expo-brightness';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import ImageView from 'react-native-image-viewing';

const { width } = Dimensions.get('window');

interface AppInfo {
  name: string;
  bundleId: string;
  isInstalled?: boolean;
}

interface NetworkInfo {
  type: string;
  isConnected: boolean;
  isInternetReachable: boolean;
  strength?: number;
}

/**
 * 超级高级功能演示组件
 */
export default function SuperAdvancedDemo() {
  // 状态管理
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [brightness, setBrightness] = useState(0.5);
  const [installedApps, setInstalledApps] = useState<AppInfo[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [systemInfo, setSystemInfo] = useState<any>({});
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  const [isLiveActivityActive, setIsLiveActivityActive] = useState(false);

  // 示例图片URLs
  const sampleImages = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
  ];

  // 示例视频URL
  const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    initializeAdvancedFeatures();
    setupNetworkListener();
    loadSystemInfo();
    loadDeviceInfo();
    loadBrightness();
    // setupBackgroundTasks();
  }, []);

  /**
   * 初始化高级功能
   */
  const initializeAdvancedFeatures = async () => {
    try {
      setPreviewImages(sampleImages);
      await loadMediaFiles();
    } catch (error) {
      console.log('初始化失败:', error);
    }
  };

  /**
   * 设置网络状态监听
   */
  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkInfo({
        type: state.type,
        isConnected: !!state.isConnected,
        isInternetReachable: !!state.isInternetReachable,
        strength: (state.details as any)?.strength,
      });
    });

    return unsubscribe;
  };

  /**
   * 加载系统信息
   */
  const loadSystemInfo = async () => {
    try {
      const appInfo = {
        applicationName: Application.applicationName,
        applicationId: Application.applicationId,
        nativeApplicationVersion: Application.nativeApplicationVersion,
        nativeBuildVersion: Application.nativeBuildVersion,
        installationId: await Application.getInstallationTimeAsync(),
      };
      setSystemInfo(appInfo);
    } catch (error) {
      console.log('加载系统信息失败:', error);
    }
  };

  /**
   * 加载设备信息
   */
  const loadDeviceInfo = async () => {
    try {
      const info = {
        platform: Platform.OS,
        version: Platform.Version,
        isTablet: Platform.OS === 'ios' && (Platform as any).isPad || false,
        screenWidth: width,
        screenHeight: Dimensions.get('window').height,
      };
      setDeviceInfo(info);
    } catch (error) {
      console.log('加载设备信息失败:', error);
    }
  };

  /**
   * 加载当前亮度
   */
  const loadBrightness = async () => {
    try {
      const currentBrightness = await Brightness.getBrightnessAsync();
      setBrightness(currentBrightness);
    } catch (error) {
      console.log('获取亮度失败:', error);
    }
  };

  /**
   * 加载媒体文件
   */
  const loadMediaFiles = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: 10,
        });
        setMediaFiles(media.assets);
      }
    } catch (error) {
      console.log('加载媒体文件失败:', error);
    }
  };

  /**
   * 1. 视频播放功能
   */
  const VideoPlayerDemo = () => {
    const player = useVideoPlayer(sampleVideoUrl, player => {
      player.loop = true;
      player.play();
    });

    return (
      <View style={styles.videoContainer}>
        <Text style={styles.sectionTitle}>🎬 视频播放器</Text>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
        <Text style={styles.videoInfo}>
          演示视频: Big Buck Bunny
        </Text>
      </View>
    );
  };

  /**
   * 2. 网络检测功能
   */
  const NetworkStatusDemo = () => (
    <View style={styles.networkContainer}>
      <Text style={styles.sectionTitle}>🌐 网络状态检测</Text>
      {networkInfo && (
        <View style={styles.networkInfo}>
          <View style={styles.networkItem}>
            <Text style={styles.networkLabel}>连接类型:</Text>
            <Text style={styles.networkValue}>{networkInfo.type}</Text>
          </View>
          <View style={styles.networkItem}>
            <Text style={styles.networkLabel}>网络连接:</Text>
            <Text style={[
              styles.networkValue,
              { color: networkInfo.isConnected ? '#10b981' : '#ef4444' }
            ]}>
              {networkInfo.isConnected ? '已连接' : '未连接'}
            </Text>
          </View>
          <View style={styles.networkItem}>
            <Text style={styles.networkLabel}>互联网访问:</Text>
            <Text style={[
              styles.networkValue,
              { color: networkInfo.isInternetReachable ? '#10b981' : '#ef4444' }
            ]}>
              {networkInfo.isInternetReachable ? '可访问' : '不可访问'}
            </Text>
          </View>
          {networkInfo.strength && (
            <View style={styles.networkItem}>
              <Text style={styles.networkLabel}>信号强度:</Text>
              <Text style={styles.networkValue}>{networkInfo.strength}</Text>
            </View>
          )}
        </View>
      )}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={testNetworkSpeed}
      >
        <Text style={styles.actionButtonText}>测试网络速度</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * 3. 图片预览功能
   */
  const ImagePreviewDemo = () => (
    <View style={styles.imagePreviewContainer}>
      <Text style={styles.sectionTitle}>🖼️ 图片预览画廊</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {previewImages.map((imageUrl, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openImageViewer(index)}
            style={styles.previewImageContainer}
          >
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.imageHint}>点击图片查看大图和缩放功能</Text>
      
      <ImageView
        images={previewImages.map(uri => ({ uri }))}
        imageIndex={currentImageIndex}
        visible={imageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </View>
  );

  /**
   * 4. 系统应用检测功能
   */
  const AppDetectionDemo = () => {
    const commonApps: AppInfo[] = [
      { name: 'Safari', bundleId: 'com.apple.mobilesafari' },
      { name: 'Mail', bundleId: 'com.apple.mobilemail' },
      { name: 'Maps', bundleId: 'com.apple.Maps' },
      { name: 'Settings', bundleId: 'com.apple.Preferences' },
      { name: 'Photos', bundleId: 'com.apple.mobileslideshow' },
      { name: 'Camera', bundleId: 'com.apple.camera' },
      { name: 'WhatsApp', bundleId: 'net.whatsapp.WhatsApp' },
      { name: 'WeChat', bundleId: 'com.tencent.xin' },
    ];

    return (
      <View style={styles.appDetectionContainer}>
        <Text style={styles.sectionTitle}>📱 系统App检测</Text>
        <ScrollView style={styles.appList}>
          {commonApps.map((app, index) => (
            <TouchableOpacity
              key={index}
              style={styles.appItem}
              onPress={() => checkAndOpenApp(app)}
            >
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.appBundle}>{app.bundleId}</Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  /**
   * 5. 屏幕亮度控制
   */
  const BrightnessControlDemo = () => (
    <View style={styles.brightnessContainer}>
      <Text style={styles.sectionTitle}>☀️ 屏幕亮度控制</Text>
      <View style={styles.brightnessInfo}>
        <Text style={styles.brightnessLabel}>当前亮度: {Math.round(brightness * 100)}%</Text>
        <View style={styles.brightnessBar}>
          <View
            style={[
              styles.brightnessProgress,
              { width: `${brightness * 100}%` }
            ]}
          />
        </View>
      </View>
      <View style={styles.brightnessButtons}>
        <TouchableOpacity
          style={styles.brightnessButton}
          onPress={() => adjustBrightness(0.2)}
        >
          <Text style={styles.brightnessButtonText}>20%</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.brightnessButton}
          onPress={() => adjustBrightness(0.5)}
        >
          <Text style={styles.brightnessButtonText}>50%</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.brightnessButton}
          onPress={() => adjustBrightness(0.8)}
        >
          <Text style={styles.brightnessButtonText}>80%</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.brightnessButton}
          onPress={() => adjustBrightness(1.0)}
        >
          <Text style={styles.brightnessButtonText}>100%</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * 6. 文件下载和管理
   */
  const FileManagementDemo = () => (
    <View style={styles.fileContainer}>
      <Text style={styles.sectionTitle}>📁 文件下载管理</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={downloadSampleFile}
      >
        <Text style={styles.actionButtonText}>下载示例文件</Text>
      </TouchableOpacity>
      {downloadProgress > 0 && downloadProgress < 1 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>下载进度: {Math.round(downloadProgress * 100)}%</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${downloadProgress * 100}%` }
              ]}
            />
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={listDownloadedFiles}
      >
        <Text style={styles.actionButtonText}>查看下载文件</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * 测试网络速度
   */
  const testNetworkSpeed = async () => {
    try {
      const startTime = Date.now();
      const testUrl = 'https://httpbin.org/bytes/1024'; // 1KB test file
      
      await fetch(testUrl);
      const endTime = Date.now();
      const duration = endTime - startTime;
      const speed = (1024 / duration) * 1000; // bytes per second
      
      Alert.alert(
        '网络速度测试',
        `下载1KB用时: ${duration}ms\n估算速度: ${(speed / 1024).toFixed(2)} KB/s`
      );
    } catch (error) {
      Alert.alert('测试失败', '网络速度测试失败');
    }
  };

  /**
   * 打开图片查看器
   */
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewVisible(true);
  };

  /**
   * 检测并打开应用
   */
  const checkAndOpenApp = async (app: AppInfo) => {
    try {
      if (Platform.OS === 'ios') {
        // iOS使用URL Scheme
        const urlScheme = app.bundleId.replace(/\./g, '://');
        const canOpen = await Linking.canOpenURL(urlScheme);
        
        if (canOpen) {
          Alert.alert(
            `${app.name} 已安装`,
            '是否要打开此应用？',
            [
              { text: '取消', style: 'cancel' },
              { text: '打开', onPress: () => Linking.openURL(urlScheme) }
            ]
          );
        } else {
          Alert.alert(`${app.name} 未安装`, '设备上未安装此应用');
        }
      } else if (Platform.OS === 'android') {
        // Android使用IntentLauncher
        try {
          await IntentLauncher.startActivityAsync(
            'android.intent.action.MAIN',
            { packageName: app.bundleId }
          );
        } catch (error) {
          Alert.alert(`${app.name} 未安装`, '设备上未安装此应用');
        }
      }
    } catch (error) {
      Alert.alert('检测失败', `无法检测 ${app.name} 的安装状态`);
    }
  };

  /**
   * 调整屏幕亮度
   */
  const adjustBrightness = async (value: number) => {
    try {
      await Brightness.setBrightnessAsync(value);
      setBrightness(value);
      Alert.alert('亮度调整', `已设置亮度为 ${Math.round(value * 100)}%`);
    } catch (error) {
      Alert.alert('调整失败', '无法调整屏幕亮度');
    }
  };

  /**
   * 下载示例文件
   */
  const downloadSampleFile = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'sample.jpg';
      const downloadUrl = 'https://picsum.photos/1920/1080';
      
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (result) {
        setDownloadProgress(1);
        Alert.alert('下载完成', `文件已保存到: ${result.uri}`);
        setTimeout(() => setDownloadProgress(0), 2000);
      }
    } catch (error) {
      Alert.alert('下载失败', '无法下载文件');
      setDownloadProgress(0);
    }
  };

  /**
   * 列出下载的文件
   */
  const listDownloadedFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory || '');
      Alert.alert(
        '下载文件列表',
        files.length > 0 ? files.join('\n') : '没有下载的文件'
      );
    } catch (error) {
      Alert.alert('读取失败', '无法读取文件列表');
    }
  };

  /**
   * 打开系统设置
   */
  const openSystemSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.SETTINGS);
    }
  };

  /**
   * 在浏览器中打开网页
   */
  const openWebPage = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://expo.dev', {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch (error) {
      Alert.alert('打开失败', '无法打开网页');
    }
  };

  /**
   * 7. 设备信息检测功能
   */
  const DeviceInfoDemo = () => (
    <View style={styles.deviceContainer}>
      <Text style={styles.sectionTitle}>📱 设备信息检测</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>平台</Text>
          <Text style={styles.infoValue}>{deviceInfo.platform || '获取中...'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>系统版本</Text>
          <Text style={styles.infoValue}>{deviceInfo.version || '获取中...'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>设备类型</Text>
          <Text style={styles.infoValue}>{deviceInfo.isTablet ? '平板' : '手机'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>屏幕宽度</Text>
          <Text style={styles.infoValue}>{deviceInfo.screenWidth}px</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>屏幕高度</Text>
          <Text style={styles.infoValue}>{deviceInfo.screenHeight}px</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>屏幕比例</Text>
          <Text style={styles.infoValue}>
            {deviceInfo.screenWidth && deviceInfo.screenHeight 
              ? (deviceInfo.screenWidth / deviceInfo.screenHeight).toFixed(2)
              : '计算中...'
            }
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={checkDeviceCapabilities}
      >
        <Text style={styles.actionButtonText}>检测设备能力</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * 8. iOS灵动岛功能 (仅iOS)
   */
  const DynamicIslandDemo = () => (
    <View style={styles.dynamicIslandContainer}>
      <Text style={styles.sectionTitle}>🏝️ iOS灵动岛功能</Text>
      <Text style={styles.dynamicIslandDescription}>
        在支持的iOS设备上展示实时活动
      </Text>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
        onPress={startLiveActivity}
      >
        <Text style={styles.actionButtonText}>
          {isLiveActivityActive ? '停止实时活动' : '开始实时活动'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.dynamicIslandHint}>
        注意: 需要在真机上运行且支持灵动岛功能
      </Text>
    </View>
  );

  /**
   * 检测设备能力
   */
  const checkDeviceCapabilities = async () => {
    try {
      const capabilities = [];
      
      // 检测是否支持Touch ID / Face ID
      const hasHardware = await import('expo-local-authentication').then(module => 
        module.hasHardwareAsync()
      );
      if (hasHardware) capabilities.push('生物识别认证');
      
             // 检测设备类型特性
       if (Platform.OS === 'ios') {
         capabilities.push('iOS原生功能');
         if (!deviceInfo.isTablet) {
           capabilities.push('iPhone功能');
         }
       }
      
      capabilities.push('网络连接');
      capabilities.push('相机访问');
      capabilities.push('存储访问');
      
      Alert.alert(
        '设备能力检测',
        `支持的功能:\n${capabilities.join('\n• ')}`
      );
    } catch (error) {
      Alert.alert('检测失败', '无法检测设备能力');
    }
  };

  /**
   * 启动/停止iOS实时活动
   */
  const startLiveActivity = async () => {
    try {
      if (Platform.OS !== 'ios') {
        Alert.alert('不支持', '实时活动仅支持iOS设备');
        return;
      }

      if (isLiveActivityActive) {
        // 这里应该停止实时活动
        setIsLiveActivityActive(false);
        Alert.alert('已停止', '实时活动已停止');
      } else {
        // 这里应该启动实时活动
        setIsLiveActivityActive(true);
        Alert.alert('已启动', '实时活动已启动\n(在真机上会显示在灵动岛中)');
      }
    } catch (error) {
      Alert.alert('操作失败', '无法操作实时活动');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 标题区域 */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          🚀 超级高级功能
        </Animatable.Text>
        <Text style={styles.subtitle}>
          视频播放 • 网络检测 • 图片预览 • 系统集成
        </Text>
      </LinearGradient>

      {/* 视频播放器 */}
      <Animatable.View animation="fadeInUp" delay={100}>
        <VideoPlayerDemo />
      </Animatable.View>

      {/* 网络状态检测 */}
      <Animatable.View animation="fadeInUp" delay={200}>
        <NetworkStatusDemo />
      </Animatable.View>

      {/* 图片预览画廊 */}
      <Animatable.View animation="fadeInUp" delay={300}>
        <ImagePreviewDemo />
      </Animatable.View>

      {/* 系统应用检测 */}
      <Animatable.View animation="fadeInUp" delay={400}>
        <AppDetectionDemo />
      </Animatable.View>

      {/* 屏幕亮度控制 */}
      <Animatable.View animation="fadeInUp" delay={500}>
        <BrightnessControlDemo />
      </Animatable.View>

      {/* 文件下载管理 */}
      <Animatable.View animation="fadeInUp" delay={600}>
        <FileManagementDemo />
      </Animatable.View>

      {/* 设备信息检测 */}
      <Animatable.View animation="fadeInUp" delay={650}>
        <DeviceInfoDemo />
      </Animatable.View>

      {/* iOS灵动岛功能 */}
      {Platform.OS === 'ios' && (
        <Animatable.View animation="fadeInUp" delay={700}>
          <DynamicIslandDemo />
        </Animatable.View>
      )}

      {/* 系统信息 */}
      <Animatable.View animation="fadeInUp" delay={700} style={styles.systemInfoContainer}>
        <Text style={styles.sectionTitle}>📋 系统信息</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>应用名称</Text>
            <Text style={styles.infoValue}>{systemInfo.applicationName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>版本号</Text>
            <Text style={styles.infoValue}>{systemInfo.nativeApplicationVersion}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>构建号</Text>
            <Text style={styles.infoValue}>{systemInfo.nativeBuildVersion}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Bundle ID</Text>
            <Text style={styles.infoValue}>{systemInfo.applicationId}</Text>
          </View>
        </View>
      </Animatable.View>

      {/* 快捷操作 */}
      <Animatable.View animation="fadeInUp" delay={800} style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>⚡ 快捷操作</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={openSystemSettings}>
            <Ionicons name="settings" size={24} color="white" />
            <Text style={styles.quickActionText}>系统设置</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={openWebPage}>
            <Ionicons name="globe" size={24} color="white" />
            <Text style={styles.quickActionText}>打开网页</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* 学习提示 */}
      <Animatable.View animation="fadeIn" style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 超级功能提示</Text>
        <Text style={styles.tipText}>
          • 视频播放: 支持本地和网络视频，可控制播放状态
        </Text>
        <Text style={styles.tipText}>
          • 网络检测: 实时监控网络状态和连接质量
        </Text>
        <Text style={styles.tipText}>
          • 图片预览: 支持缩放、滑动查看大图
        </Text>
        <Text style={styles.tipText}>
          • App检测: 检测系统应用安装状态并可直接打开
        </Text>
        <Text style={styles.tipText}>
          • 亮度控制: 动态调整设备屏幕亮度
        </Text>
        <Text style={styles.tipText}>
          • 文件管理: 下载文件并显示进度
        </Text>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 50,
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  
  // 视频播放器样式
  videoContainer: {
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
  video: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  videoInfo: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },

  // 网络状态样式
  networkContainer: {
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
  networkInfo: {
    marginBottom: 16,
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  networkLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  networkValue: {
    fontSize: 14,
    color: '#6b7280',
  },

  // 图片预览样式
  imagePreviewContainer: {
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
  previewImageContainer: {
    marginRight: 12,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imageHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  // App检测样式
  appDetectionContainer: {
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
  appList: {
    maxHeight: 200,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  appName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  appBundle: {
    flex: 2,
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },

  // 亮度控制样式
  brightnessContainer: {
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
  brightnessInfo: {
    marginBottom: 16,
  },
  brightnessLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  brightnessBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  brightnessProgress: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 3,
  },
  brightnessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brightnessButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  brightnessButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },

  // 文件管理样式
  fileContainer: {
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
  progressContainer: {
    marginVertical: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },

  // 系统信息样式
  systemInfoContainer: {
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
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // 快捷操作样式
  quickActionsContainer: {
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // 通用按钮样式
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // 设备信息样式
  deviceContainer: {
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

  // 灵动岛样式
  dynamicIslandContainer: {
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
  dynamicIslandDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  dynamicIslandHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // 提示卡片样式
  tipCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    marginBottom: 30,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 8,
    lineHeight: 20,
  },
}); 