import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

/**
 * UI组件演示
 * 展示各种UI库和动画效果
 */
export default function UIDemo() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [animationKey, setAnimationKey] = useState(0);

  const animations = [
    'bounce',
    'flash',
    'jello',
    'pulse',
    'rotate',
    'rubberBand',
    'shake',
    'swing',
    'tada',
    'wobble',
    'zoomIn',
    'zoomOut',
    'fadeIn',
    'fadeOut',
    'slideInUp',
    'slideInDown',
    'slideInLeft',
    'slideInRight',
  ];

  const [currentAnimation, setCurrentAnimation] = useState('bounce');

  const playAnimation = (animation: string) => {
    setCurrentAnimation(animation);
    setAnimationKey(prev => prev + 1);
  };

  const gradientColors: string[][] = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a8edea', '#fed6e3'],
  ];

  const [currentGradient, setCurrentGradient] = useState(0);

  return (
    <ScrollView style={styles.container}>
      {/* 动画演示区域 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎬 动画演示</Text>
        <Text style={styles.sectionSubtitle}>react-native-animatable</Text>
        
        <View style={styles.animationContainer}>
          <Animatable.View
            key={animationKey}
            animation={currentAnimation}
            duration={1000}
            style={styles.animationBox}
          >
            <Text style={styles.animationText}>🎯</Text>
          </Animatable.View>
        </View>

        <Text style={styles.currentAnimation}>
          当前动画: {currentAnimation}
        </Text>

        <View style={styles.animationButtons}>
          {animations.slice(0, 6).map((animation) => (
            <TouchableOpacity
              key={animation}
              style={[
                styles.animationButton,
                currentAnimation === animation && styles.activeAnimationButton
              ]}
              onPress={() => playAnimation(animation)}
            >
              <Text style={[
                styles.animationButtonText,
                currentAnimation === animation && styles.activeAnimationButtonText
              ]}>
                {animation}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.moreAnimationsButton}
          onPress={() => {
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            playAnimation(randomAnimation);
          }}
        >
          <Text style={styles.moreAnimationsText}>🎲 随机动画</Text>
        </TouchableOpacity>
      </View>

      {/* 渐变背景演示 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌈 渐变背景</Text>
        <Text style={styles.sectionSubtitle}>expo-linear-gradient</Text>
        
        <LinearGradient
          colors={gradientColors[currentGradient] as [string, string, ...string[]]}
          style={styles.gradientDemo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.gradientText}>美丽的渐变效果</Text>
        </LinearGradient>

        <View style={styles.gradientButtons}>
          {gradientColors.map((colors, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentGradient(index)}
            >
              <LinearGradient
                colors={colors as [string, string, ...string[]]}
                style={[
                  styles.gradientSwatch,
                  currentGradient === index && styles.activeGradientSwatch
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 原生组件演示 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ 原生组件</Text>
        <Text style={styles.sectionSubtitle}>React Native内置组件</Text>
        
        {/* Switch 开关 */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>开关控制:</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsEnabled}
            value={isEnabled}
          />
          <Text style={styles.controlValue}>
            {isEnabled ? '开启' : '关闭'}
          </Text>
        </View>

        {/* 自定义滑块控制 */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>数值控制:</Text>
          <View style={styles.customSlider}>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => setSliderValue(Math.max(0, sliderValue - 10))}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View 
                style={[styles.sliderFill, { width: `${sliderValue}%` }]} 
              />
            </View>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => setSliderValue(Math.min(100, sliderValue + 10))}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.controlValue}>
            {Math.round(sliderValue)}
          </Text>
        </View>

        {/* 动态进度条 */}
        <View style={styles.progressContainer}>
          <Text style={styles.controlLabel}>进度条:</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${sliderValue}%` }
              ]} 
            />
          </View>
          <Text style={styles.controlValue}>{Math.round(sliderValue)}%</Text>
        </View>
      </View>

      {/* 卡片组件演示 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🃏 卡片组件</Text>
        <Text style={styles.sectionSubtitle}>自定义卡片样式</Text>
        
        <Animatable.View animation="fadeInUp" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>基础卡片</Text>
            <Text style={styles.cardBadge}>NEW</Text>
          </View>
          <Text style={styles.cardDescription}>
            这是一个基础的卡片组件，包含标题、描述和操作按钮。
          </Text>
          <TouchableOpacity 
            style={styles.cardButton}
            onPress={() => Alert.alert('卡片', '你点击了卡片按钮！')}
          >
            <Text style={styles.cardButtonText}>查看详情</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.gradientCard}
          >
            <Text style={styles.gradientCardTitle}>渐变卡片</Text>
            <Text style={styles.gradientCardDescription}>
              结合渐变背景的卡片组件，视觉效果更加丰富。
            </Text>
            <TouchableOpacity 
              style={styles.gradientCardButton}
              onPress={() => Alert.alert('渐变卡片', '你点击了渐变卡片！')}
            >
              <Text style={styles.gradientCardButtonText}>立即体验</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>
      </View>

      {/* 按钮样式演示 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔘 按钮样式</Text>
        <Text style={styles.sectionSubtitle}>各种按钮设计</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>主要按钮</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>次要按钮</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>边框按钮</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>危险按钮</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.roundButton}>
          <Text style={styles.roundButtonText}>圆角按钮</Text>
        </TouchableOpacity>

        <LinearGradient
          colors={['#ff9a9e', '#fecfef']}
          style={styles.gradientButton}
        >
          <TouchableOpacity style={styles.gradientButtonInner}>
            <Text style={styles.gradientButtonText}>渐变按钮</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* 提示信息 */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>💡 UI设计提示</Text>
        <Text style={styles.infoText}>• 保持一致的设计语言和颜色主题</Text>
        <Text style={styles.infoText}>• 适当使用动画提升用户体验</Text>
        <Text style={styles.infoText}>• 注意不同设备尺寸的适配</Text>
        <Text style={styles.infoText}>• 遵循平台设计规范（iOS/Android）</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 16,
  },
  animationBox: {
    width: 80,
    height: 80,
    backgroundColor: '#6366f1',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationText: {
    fontSize: 24,
  },
  currentAnimation: {
    textAlign: 'center',
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  animationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  animationButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    width: '48%',
  },
  activeAnimationButton: {
    backgroundColor: '#6366f1',
  },
  animationButtonText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#374151',
  },
  activeAnimationButtonText: {
    color: 'white',
  },
  moreAnimationsButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  moreAnimationsText: {
    color: 'white',
    fontWeight: '600',
  },
  gradientDemo: {
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gradientText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  gradientButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  gradientSwatch: {
    width: 50,
    height: 30,
    borderRadius: 6,
    marginBottom: 8,
  },
  activeGradientSwatch: {
    borderWidth: 3,
    borderColor: '#374151',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  controlValue: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  customSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    marginHorizontal: 10,
  },
  sliderButton: {
    width: 30,
    height: 30,
    backgroundColor: '#6366f1',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 2,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardBadge: {
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: '#6366f1',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cardButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  gradientCard: {
    borderRadius: 8,
    padding: 16,
  },
  gradientCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  gradientCardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  gradientCardButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  gradientCardButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  secondaryButtonText: {
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  outlineButtonText: {
    color: '#6366f1',
    textAlign: 'center',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  dangerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  roundButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
  },
  roundButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  gradientButton: {
    borderRadius: 8,
    marginBottom: 12,
  },
  gradientButtonInner: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  gradientButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  infoSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 6,
    lineHeight: 20,
  },
}); 