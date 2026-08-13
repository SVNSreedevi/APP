import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSurgeriesToday: 0,
    totalBloodLossToday: 0,
    criticalPatients: [],
  });

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStats({
        totalPatients: 124,
        totalSurgeriesToday: 3,
        totalBloodLossToday: 850,
        criticalPatients: [
          { _id: '1', patientName: 'Priya Sharma', surgeryType: 'Cardiac Bypass', age: 45 },
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Doctor';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greetingText}>{greeting}, Dr. {firstName} 👋</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.newSurgeryBtn}
            onPress={() => router.push('/doctor/start-surgery')}
          >
            <FontAwesome5 name="plus" size={14} color="#fff" />
            <Text style={styles.newSurgeryText}>Start Surgery</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <FontAwesome5 name="tint" size={20} color="#ef4444" />
            </View>
            <View>
              <Text style={styles.statLabel}>Today's Loss</Text>
              <Text style={styles.statValue}>{stats.totalBloodLossToday} ml</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <FontAwesome5 name="users" size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.statLabel}>Total Patients</Text>
              <Text style={styles.statValue}>{stats.totalPatients}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <FontAwesome5 name="procedures" size={20} color="#f59e0b" />
            </View>
            <View>
              <Text style={styles.statLabel}>Surgeries</Text>
              <Text style={styles.statValue}>{stats.totalSurgeriesToday}</Text>
            </View>
          </View>
          
          <View style={[styles.statCard, { borderColor: 'rgba(244, 63, 94, 0.2)' }]}>
            <View style={styles.statIconContainer}>
              <FontAwesome5 name="exclamation-triangle" size={20} color="#f43f5e" />
            </View>
            <View>
              <Text style={styles.statLabel}>Critical</Text>
              <Text style={[styles.statValue, { color: '#f43f5e' }]}>{stats.criticalPatients.length}</Text>
            </View>
          </View>
        </View>

        {/* Critical Patients */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.dotPulse} />
              <Text style={styles.sectionTitle}>Critical Surveillance</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/doctor/patients')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {stats.criticalPatients.length > 0 ? (
            stats.criticalPatients.map(p => (
              <TouchableOpacity key={p._id} style={styles.criticalCard} onPress={() => router.push(`/doctor/patients/${p._id}` as any)}>
                <View style={styles.criticalCardHeader}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.patientAvatarText}>{p.patientName.charAt(0)}</Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{p.patientName}</Text>
                    <Text style={styles.patientDetails}>{p.surgeryType} • {p.age} YRS</Text>
                  </View>
                  <View style={styles.criticalBadge}>
                    <Text style={styles.criticalBadgeText}>CRITICAL</Text>
                  </View>
                </View>
                
                <View style={styles.vitalsRow}>
                  <View style={styles.vitalItem}>
                    <Text style={styles.vitalLabel}>HR</Text>
                    <Text style={[styles.vitalValue, { color: '#fb7185' }]}>104 bpm</Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <Text style={styles.vitalLabel}>BP</Text>
                    <Text style={[styles.vitalValue, { color: '#60a5fa' }]}>112/70</Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <Text style={styles.vitalLabel}>SpO2</Text>
                    <Text style={[styles.vitalValue, { color: '#34d399' }]}>95%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No critical patients.</Text>
            </View>
          )}
        </View>
        
        {/* Navigation Grid (Quick Actions) */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/doctor/patients')}>
            <FontAwesome5 name="user-injured" size={24} color="#94a3b8" />
            <Text style={styles.actionText}>Patients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/doctor/reports')}>
            <FontAwesome5 name="file-medical-alt" size={24} color="#94a3b8" />
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/doctor/profile')}>
            <FontAwesome5 name="user-md" size={24} color="#94a3b8" />
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  dateText: {
    color: '#93c5fd',
    fontSize: 14,
  },
  newSurgeryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  newSurgeryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'black',
    color: '#fff',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotPulse: {
    width: 6,
    height: 16,
    backgroundColor: '#ef4444',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  criticalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  criticalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientAvatarText: {
    color: '#f43f5e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientDetails: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  criticalBadge: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  criticalBadgeText: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vitalsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  vitalItem: {
    flex: 1,
    alignItems: 'center',
  },
  vitalLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 14,
    fontWeight: 'black',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
