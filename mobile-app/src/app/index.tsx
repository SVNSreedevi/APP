import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const features = [
  { icon: 'brain',        title: 'AI-Powered Analysis',    desc: 'Smart blood loss estimation using advanced algorithms', color: '#8b5cf6' },
  { icon: 'monitor-heart', title: 'Real-Time Monitoring',   desc: 'Live tracking of fluid loss during surgery',            color: '#ef4444', isMaterial: true },
  { icon: 'tint',         title: 'Fluid Tracking',         desc: 'Precise suction, gauze, and urine measurement',        color: '#0ea5e9' },
  { icon: 'shield-alt',   title: 'Emergency Alerts',       desc: 'Instant notifications for critical blood loss levels',  color: '#f59e0b' },
  { icon: 'file-medical', title: 'Patient Management',     desc: 'Complete patient records and surgery history',          color: '#10b981' },
  { icon: 'chart-line',   title: 'Analytics & Reports',    desc: 'Downloadable PDF reports and trend charts',            color: '#3b82f6' },
];

export default function Landing() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Animated Blobs (Static representations for mobile performance) */}
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />

        {/* Navbar */}
        <View style={styles.navbar}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIconBg}>
              <FontAwesome5 name="heartbeat" size={18} color="#fff" />
            </View>
            <View>
              <Text style={styles.logoText}>BloodLoss Monitor</Text>
              <Text style={styles.logoSubtext}>AI-Powered Surgery System</Text>
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>AI-Powered Intra-Operative System</Text>
          </View>

          <Text style={styles.heroTitle}>Blood Loss Estimator</Text>
          <Text style={styles.heroSubtitle}>& Fluid Monitor</Text>

          <Text style={styles.heroDesc}>
            Precision surgical monitoring with AI-powered blood loss estimation, real-time fluid tracking, 
            and instant emergency alerts for doctors and nurses.
          </Text>

          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={[styles.ctaButton, styles.ctaDoctor]} 
              onPress={() => router.push('/auth/doctor-login')}
            >
              <FontAwesome5 name="user-md" size={24} color="#fff" />
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaSmallText}>I'm a</Text>
                <Text style={styles.ctaLargeText}>Doctor</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.ctaButton, styles.ctaNurse]} 
              onPress={() => router.push('/auth/nurse-login')}
            >
              <FontAwesome5 name="user-nurse" size={24} color="#fff" />
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaSmallText}>I'm a</Text>
                <Text style={styles.ctaLargeText}>Nurse</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>99.9%</Text>
              <Text style={styles.statLabel}>Accuracy Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>500+</Text>
              <Text style={styles.statLabel}>Hospitals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>50K+</Text>
              <Text style={styles.statLabel}>Surgeries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Monitoring</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Everything You Need</Text>
          <Text style={styles.sectionDesc}>A complete surgical monitoring platform designed for modern operating theaters</Text>
          
          <View style={styles.featuresGrid}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <View style={[styles.featureIconBg, { backgroundColor: f.color }]}>
                  {f.isMaterial ? (
                    <MaterialIcons name={f.icon as any} size={24} color="#fff" />
                  ) : (
                    <FontAwesome5 name={f.icon} size={22} color="#fff" />
                  )}
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <FontAwesome5 name="heartbeat" size={16} color="#60a5fa" />
          <Text style={styles.footerText}>AI-Powered Intra-Operative System</Text>
          <Text style={styles.footerCopy}>© {new Date().getFullYear()} BloodLoss Monitor. All rights reserved.</Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  blob1: {
    top: -50,
    left: -100,
    backgroundColor: '#3b82f6',
  },
  blob2: {
    bottom: 200,
    right: -100,
    backgroundColor: '#ef4444',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoSubtext: {
    color: '#93c5fd',
    fontSize: 12,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 30,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34d399',
    marginRight: 8,
  },
  badgeText: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#a78bfa',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroDesc: {
    color: '#cbd5e1',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  ctaContainer: {
    flexDirection: width > 400 ? 'row' : 'column',
    gap: 16,
    marginBottom: 40,
    width: '100%',
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 16,
  },
  ctaDoctor: {
    backgroundColor: '#2563eb',
  },
  ctaNurse: {
    backgroundColor: '#059669',
  },
  ctaTextContainer: {
    alignItems: 'flex-start',
  },
  ctaSmallText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  ctaLargeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDesc: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  footerCopy: {
    color: '#64748b',
    fontSize: 11,
  },
});
