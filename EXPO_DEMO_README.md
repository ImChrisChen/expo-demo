# 🚀 Expo 功能演示项目

这是一个专为Expo初学者设计的综合演示项目，展示了Expo框架的主要功能和API。

## 📱 项目功能

### Demo Tab页面包含以下功能演示：

1. **设备信息获取** 📱
   - 获取设备名称、品牌、型号
   - 操作系统信息
   - 内存信息
   - 设备类型检测

2. **地理位置服务** 🌍
   - GPS定位
   - 权限管理
   - 位置精度设置
   - 坐标信息显示

3. **传感器数据** 📊
   - 实时加速度计数据
   - 传感器更新频率控制
   - 数据订阅和取消订阅

4. **文件系统操作** 📁
   - 文件创建和写入
   - 文件读取
   - 文件信息获取
   - 文档目录访问

5. **剪贴板功能** 📋
   - 文本复制到剪贴板
   - 从剪贴板读取内容
   - 跨应用数据共享

6. **网页浏览器** 🌐
   - 应用内网页浏览
   - 自定义浏览器样式
   - 外部链接处理

7. **触觉反馈** 📳
   - 震动反馈
   - 不同强度的触觉体验
   - 用户交互增强

8. **相机功能** 📷
   - 相机权限管理
   - 前后置摄像头切换
   - 拍照功能
   - 全屏相机界面

9. **音频处理** 🎵
   - 音频播放准备
   - 媒体权限处理
   - 音频文件管理

10. **应用常量** ⚙️
    - 应用版本信息
    - SDK版本
    - 平台信息
    - 状态栏高度等系统常量

### Advanced Tab页面包含更多高级功能：

1. **图片选择和处理** 📷
   - 从相册选择图片
   - 使用相机拍照
   - 图片压缩和处理
   - 图片格式转换

2. **通信功能** 📧
   - 邮件发送（支持附件）
   - 短信发送
   - 内容分享到其他应用

3. **文档处理** 📄
   - HTML转PDF生成
   - 文档打印功能
   - 文件分享

4. **数据存储** 💾
   - SQLite数据库操作
   - 安全存储（SecureStore）
   - 本地存储（AsyncStorage）
   - 数据加密保护

5. **身份验证** 🔐
   - 生物识别认证
   - 指纹识别
   - 面部识别

6. **UI组件演示** 🎨
   - 动画效果展示
   - 渐变背景
   - 自定义组件
   - 各种按钮样式
   - 交互控件

## 🛠 技术栈

- **React Native** - 跨平台移动应用开发框架
- **Expo** - React Native开发工具链
- **TypeScript** - 类型安全的JavaScript
- **Expo Router** - 文件系统路由
- **各种Expo SDK包**：
  - expo-device, expo-location, expo-sensors
  - expo-file-system, expo-clipboard, expo-web-browser
  - expo-haptics, expo-camera, expo-av, expo-constants
  - expo-image-picker, expo-image-manipulator
  - expo-mail-composer, expo-sms, expo-sharing
  - expo-print, expo-sqlite, expo-secure-store
  - expo-local-authentication, expo-linear-gradient
- **UI和动画库**：
  - react-native-animatable
  - @react-native-async-storage/async-storage

## 📂 项目结构

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab导航配置
│   │   ├── index.tsx        # 首页
│   │   ├── explore.tsx      # 探索页
│   │   ├── demo.tsx         # 基础功能演示页
│   │   └── advanced.tsx     # 高级功能演示页
├── components/
│   ├── CameraDemo.tsx       # 相机演示组件
│   └── UIDemo.tsx           # UI组件演示
├── constants/               # 常量配置
├── hooks/                   # 自定义Hooks
└── assets/                  # 静态资源
```

## 🚀 使用方法

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器
```bash
npx expo start
```

### 运行应用
- **iOS模拟器**: 按 `i`
- **Android模拟器**: 按 `a` 
- **Web浏览器**: 按 `w`
- **物理设备**: 使用Expo Go扫描二维码

## 📚 学习指南

### 1. 代码学习
每个功能都有详细的中文注释，建议按以下顺序学习：
1. 从基础功能开始：查看 `app/(tabs)/demo.tsx`
2. 进阶到高级功能：查看 `app/(tabs)/advanced.tsx`
3. 学习UI组件设计：查看 `components/UIDemo.tsx`
4. 理解每个功能函数的实现
5. 学习状态管理和副作用处理
6. 了解权限请求的最佳实践

### 2. 实践建议
- 在真实设备上测试所有功能
- 尝试修改代码参数观察效果
- 查看控制台日志了解运行过程
- 实验不同的配置选项

### 3. 进阶学习
- 查看Expo官方文档：https://docs.expo.dev
- 使用Expo Snack在线编辑器：https://snack.expo.dev
- 浏览更多示例项目：https://expo.dev/examples

## ⚠️ 注意事项

1. **权限管理**
   - 某些功能需要用户授权（位置、相机等）
   - 在真实设备上测试权限功能
   - 处理权限被拒绝的情况

2. **平台差异**
   - 某些功能在不同平台表现可能不同
   - Web版本可能缺少某些原生功能
   - iOS和Android的权限处理略有差异

3. **开发环境**
   - 推荐使用真实设备进行测试
   - 确保网络连接稳定
   - 某些传感器功能在模拟器中不可用

## 🔧 故障排除

### 常见问题

1. **模块未找到错误**
   ```bash
   npx expo install --fix
   ```

2. **权限相关错误**
   - 确保在真实设备上测试
   - 检查应用权限设置
   - 重新安装应用

3. **TypeScript错误**
   - 检查类型定义
   - 更新到最新版本的包
   - 清理缓存：`npx expo start --clear`

## 🎯 下一步学习

完成本演示项目后，建议继续学习：

1. **状态管理**: Redux Toolkit, Zustand, Context API
2. **导航**: React Navigation深入使用
3. **网络请求**: axios, React Query, GraphQL
4. **UI组件库**: NativeBase, UI Kitten, React Native Elements
5. **动画库**: React Native Reanimated, Lottie
6. **测试**: Jest, React Native Testing Library
7. **性能优化**: Flipper, React DevTools
8. **推送通知**: Expo Notifications, Firebase
9. **应用发布**: EAS Build, App Store发布
10. **后端集成**: Firebase, AWS Amplify, Supabase

## 📞 获取帮助

- Expo官方论坛：https://forums.expo.dev
- Discord社区：https://discord.gg/expo
- GitHub Issues：https://github.com/expo/expo
- Stack Overflow：搜索 "expo" 标签

---

🎉 祝你学习愉快！这个项目涵盖了Expo的核心功能，是你掌握React Native和Expo开发的绝佳起点。 