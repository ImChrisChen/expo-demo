import SuperAdvancedDemo from '@/components/SuperAdvancedDemo';
import UIDemo from '@/components/UIDemo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import * as SecureStore from 'expo-secure-store';
import * as Sharing from 'expo-sharing';
import * as SMS from 'expo-sms';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

/**
 * 高级功能演示页面
 * 展示更多React Native和Expo的实用库功能
 */
export default function AdvancedScreen() {
  // 状态管理
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbData, setDbData] = useState<any[]>([]);
  const [secureData, setSecureData] = useState('');
  const [showUIDemo, setShowUIDemo] = useState(false);
  const [showSuperAdvanced, setShowSuperAdvanced] = useState(false);

  // 初始化数据库
  useEffect(() => {
    initializeDatabase();
    loadSecureData();
  }, []);

  /**
   * 1. 图片选择和处理功能
   * 使用expo-image-picker选择图片，expo-image-manipulator处理图片
   */
  const pickImage = async () => {
    try {
      // 请求权限
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('权限被拒绝', '需要访问相册权限');
        return;
      }

      // 选择图片
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        
        // 演示图片处理功能
        await processImage(imageUri);
      }
    } catch (error) {
      Alert.alert('选择图片失败', '无法选择图片');
    }
  };

  /**
   * 图片处理演示
   */
  const processImage = async (imageUri: string) => {
    try {
      setIsLoading(true);
      
      // 调整图片大小并添加滤镜
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 300, height: 300 } }, // 调整大小
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      Alert.alert(
        '图片处理完成',
        `原图: ${imageUri}\n处理后: ${manipResult.uri}\n大小: ${manipResult.width}x${manipResult.height}`
      );
    } catch (error) {
      Alert.alert('图片处理失败', '无法处理图片');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 2. 拍照功能
   */
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('权限被拒绝', '需要相机权限');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('拍照失败', '无法拍照');
    }
  };

  /**
   * 3. 邮件发送功能
   * 使用expo-mail-composer
   */
  const sendEmail = async () => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('邮件不可用', '设备上没有配置邮件应用');
        return;
      }

      const result = await MailComposer.composeAsync({
        recipients: ['example@email.com'],
        subject: 'Expo邮件测试',
        body: `这是通过Expo发送的测试邮件\n\n发送时间: ${new Date().toLocaleString()}`,
        attachments: selectedImage ? [selectedImage] : undefined,
      });

      Alert.alert('邮件结果', `状态: ${result.status}`);
    } catch (error) {
      Alert.alert('邮件发送失败', '无法发送邮件');
    }
  };

  /**
   * 4. 短信发送功能
   * 使用expo-sms
   */
  const sendSMS = async () => {
    try {
      const isAvailable = await SMS.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('短信不可用', '设备不支持短信功能');
        return;
      }

      const result = await SMS.sendSMSAsync(
        [''], // 电话号码数组
        '这是通过Expo发送的测试短信！'
      );

      Alert.alert('短信结果', `状态: ${result.result}`);
    } catch (error) {
      Alert.alert('短信发送失败', '无法发送短信');
    }
  };

  /**
   * 5. 分享功能
   * 使用expo-sharing
   */
  const shareContent = async () => {
    try {
      if (selectedImage) {
        // 分享图片
        await Sharing.shareAsync(selectedImage, {
          mimeType: 'image/jpeg',
          dialogTitle: '分享图片',
        });
      } else {
        // 分享文本
        await Sharing.shareAsync('data:text/plain;base64,' + btoa('Hello from Expo!'), {
          mimeType: 'text/plain',
          dialogTitle: '分享文本',
          UTI: 'public.plain-text',
        });
      }
    } catch (error) {
      Alert.alert('分享失败', '无法分享内容');
    }
  };

  /**
   * 6. 打印功能
   * 使用expo-print
   */
  const printDocument = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #6366f1; text-align: center; }
              .content { margin: 20px 0; }
              .footer { margin-top: 40px; text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <h1>Expo 打印演示</h1>
            <div class="content">
              <p>这是通过 Expo Print 生成的 PDF 文档。</p>
              <p>生成时间: ${new Date().toLocaleString()}</p>
              <p>备注内容: ${noteText || '无备注'}</p>
            </div>
            <div class="footer">
              <p>Powered by Expo</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      
      Alert.alert(
        '打印完成',
        `PDF已生成: ${uri}`,
        [
          { text: '取消', style: 'cancel' },
          { text: '分享', onPress: () => Sharing.shareAsync(uri) }
        ]
      );
    } catch (error) {
      Alert.alert('打印失败', '无法生成PDF');
    }
  };

  /**
   * 7. SQLite数据库功能
   */
  const initializeDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('demo.db');
      
      // 创建表
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 查询数据
      const result = await db.getAllAsync('SELECT * FROM notes ORDER BY created_at DESC LIMIT 5');
      setDbData(result);
    } catch (error) {
      Alert.alert('数据库错误', '无法初始化数据库');
    }
  };

  /**
   * 向数据库添加笔记
   */
  const addNoteToDatabase = async () => {
    if (!noteText.trim()) {
      Alert.alert('提示', '请输入笔记内容');
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync('demo.db');
      
      await db.runAsync('INSERT INTO notes (content) VALUES (?)', noteText);
      
      // 重新查询数据
      const result = await db.getAllAsync('SELECT * FROM notes ORDER BY created_at DESC LIMIT 5');
      setDbData(result);
      setNoteText('');
      
      Alert.alert('成功', '笔记已保存到数据库');
    } catch (error) {
      Alert.alert('保存失败', '无法保存笔记');
    }
  };

  /**
   * 8. 安全存储功能
   * 使用expo-secure-store
   */
  const saveSecureData = async () => {
    try {
      const dataToSave = `安全数据_${Date.now()}`;
      await SecureStore.setItemAsync('secure_key', dataToSave);
      setSecureData(dataToSave);
      Alert.alert('保存成功', '数据已安全保存');
    } catch (error) {
      Alert.alert('保存失败', '无法保存安全数据');
    }
  };

  const loadSecureData = async () => {
    try {
      const data = await SecureStore.getItemAsync('secure_key');
      if (data) {
        setSecureData(data);
      }
    } catch (error) {
      console.log('加载安全数据失败:', error);
    }
  };

  /**
   * 9. 生物识别认证
   * 使用expo-local-authentication
   */
  const authenticateWithBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('不支持', '设备不支持生物识别');
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('未设置', '请先在设备设置中启用生物识别');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '使用生物识别验证身份',
        cancelLabel: '取消',
        fallbackLabel: '使用密码',
      });

      if (result.success) {
        Alert.alert('认证成功', '生物识别验证通过！');
      } else {
        Alert.alert('认证失败', '生物识别验证失败');
      }
    } catch (error) {
      Alert.alert('认证错误', '无法进行生物识别');
    }
  };

  /**
   * 10. AsyncStorage本地存储
   */
  const saveToAsyncStorage = async () => {
    try {
      const data = {
        note: noteText,
        timestamp: Date.now(),
        user: 'demo_user'
      };
      await AsyncStorage.setItem('user_data', JSON.stringify(data));
      Alert.alert('保存成功', '数据已保存到本地存储');
    } catch (error) {
      Alert.alert('保存失败', '无法保存到本地存储');
    }
  };

  const loadFromAsyncStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('user_data');
      if (data) {
        const parsedData = JSON.parse(data);
        Alert.alert(
          '本地存储数据',
          `笔记: ${parsedData.note}\n时间: ${new Date(parsedData.timestamp).toLocaleString()}\n用户: ${parsedData.user}`
        );
      } else {
        Alert.alert('提示', '本地存储中没有数据');
      }
    } catch (error) {
      Alert.alert('加载失败', '无法从本地存储加载数据');
    }
  };

  // 高级功能列表
  const advancedFeatures = [
    {
      title: '📷 选择图片',
      description: '从相册选择图片并进行处理',
      onPress: pickImage,
      color: '#10b981',
    },
    {
      title: '📸 拍照',
      description: '使用相机拍照',
      onPress: takePhoto,
      color: '#3b82f6',
    },
    {
      title: '📧 发送邮件',
      description: '发送邮件（可附带图片）',
      onPress: sendEmail,
      color: '#8b5cf6',
    },
    {
      title: '💬 发送短信',
      description: '发送短信消息',
      onPress: sendSMS,
      color: '#f59e0b',
    },
    {
      title: '📤 分享内容',
      description: '分享文本或图片到其他应用',
      onPress: shareContent,
      color: '#ef4444',
    },
    {
      title: '🖨️ 打印PDF',
      description: '生成并打印PDF文档',
      onPress: printDocument,
      color: '#06b6d4',
    },
    {
      title: '🔒 安全存储',
      description: '保存和读取加密数据',
      onPress: saveSecureData,
      color: '#dc2626',
    },
    {
      title: '👆 生物识别',
      description: '指纹或面部识别验证',
      onPress: authenticateWithBiometrics,
      color: '#84cc16',
    },
    {
      title: '💾 本地存储',
      description: 'AsyncStorage数据保存',
      onPress: saveToAsyncStorage,
      color: '#a855f7',
    },
    {
      title: '📖 读取存储',
      description: '从AsyncStorage读取数据',
      onPress: loadFromAsyncStorage,
      color: '#0ea5e9',
    },
    {
      title: '🎨 UI组件演示',
      description: '查看各种UI组件和动画效果',
      onPress: () => setShowUIDemo(true),
      color: '#8b5cf6',
    },
    {
      title: '🚀 超级高级功能',
      description: '视频播放、网络检测、图片预览、系统集成',
      onPress: () => setShowSuperAdvanced(true),
      color: '#f59e0b',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar style="auto" />
        
        {/* 渐变标题区域 */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <Animatable.Text 
            animation="fadeInDown" 
            style={styles.title}
          >
            🔥 高级功能演示
          </Animatable.Text>
          <Text style={styles.subtitle}>
            探索更多实用的React Native和Expo库
          </Text>
        </LinearGradient>

        {/* 图片显示区域 */}
        {selectedImage && (
          <Animatable.View animation="fadeIn" style={styles.imageContainer}>
            <Text style={styles.sectionTitle}>📷 选中的图片</Text>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>处理中...</Text>
              </View>
            )}
          </Animatable.View>
        )}

        {/* 笔记输入区域 */}
        <View style={styles.noteContainer}>
          <Text style={styles.sectionTitle}>📝 笔记输入</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="输入你的笔记..."
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={addNoteToDatabase}
          >
            <Text style={styles.saveButtonText}>保存到数据库</Text>
          </TouchableOpacity>
        </View>

        {/* 数据库数据显示 */}
        {dbData.length > 0 && (
          <View style={styles.dbContainer}>
            <Text style={styles.sectionTitle}>🗄️ 数据库记录</Text>
            {dbData.map((item: any) => (
              <View key={item.id} style={styles.dbItem}>
                <Text style={styles.dbContent}>{item.content}</Text>
                <Text style={styles.dbDate}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 安全存储显示 */}
        {secureData && (
          <View style={styles.secureContainer}>
            <Text style={styles.sectionTitle}>🔐 安全存储数据</Text>
            <Text style={styles.secureData}>{secureData}</Text>
          </View>
        )}

        {/* 功能按钮列表 */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>🚀 功能演示</Text>
          {advancedFeatures.map((feature, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={[styles.featureButton, { borderLeftColor: feature.color }]}
                onPress={feature.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        {/* 学习提示 */}
        <Animatable.View animation="fadeIn" style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 高级学习提示</Text>
          <Text style={styles.tipText}>
            • 图片处理: 学习压缩、裁剪、滤镜等操作
          </Text>
          <Text style={styles.tipText}>
            • 数据存储: 对比SQLite、SecureStore、AsyncStorage的使用场景
          </Text>
          <Text style={styles.tipText}>
            • 设备功能: 充分利用原生设备能力提升用户体验
          </Text>
          <Text style={styles.tipText}>
            • 安全性: 敏感数据必须使用SecureStore或生物识别保护
          </Text>
        </Animatable.View>
      </ScrollView>

      {/* UI演示模态框 */}
      <Modal
        visible={showUIDemo}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUIDemo(false)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
          <UIDemo />
        </View>
      </Modal>

      {/* 超级高级功能模态框 */}
      <Modal
        visible={showSuperAdvanced}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSuperAdvanced(false)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
          <SuperAdvancedDemo />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  imageContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  noteContainer: {
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
  noteInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  dbContainer: {
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
  dbItem: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  dbContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  dbDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  secureContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  secureData: {
    fontSize: 14,
    color: '#92400e',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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