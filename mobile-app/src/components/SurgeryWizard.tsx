import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Step = 'gauze' | 'suction' | 'urine' | 'summary';

export default function SurgeryWizard({ role }: { role: 'doctor' | 'nurse' }) {
  const router = useRouter();
  const isDoctor = role === 'doctor';
  const primaryColor = isDoctor ? '#3b82f6' : '#10b981';

  const [step, setStep] = useState<Step>('gauze');
  
  // Gauze State
  const [smallGauzeCount, setSmallGauzeCount] = useState('');
  const [smallGauzeValue, setSmallGauzeValue] = useState('');
  const [largeGauzeCount, setLargeGauzeCount] = useState('');
  const [largeGauzeValue, setLargeGauzeValue] = useState('');
  const [totalGauze, setTotalGauze] = useState(0);

  // Suction State
  const [bottleVolume, setBottleVolume] = useState('');
  const [salineUsed, setSalineUsed] = useState('');
  const [totalSuction, setTotalSuction] = useState(0);

  // Urine & Fluid State
  const [urineOutput, setUrineOutput] = useState('');
  const [insensibleLoss, setInsensibleLoss] = useState('');

  const handleNext = () => {
    if (step === 'gauze') {
      const sc = parseFloat(smallGauzeCount) || 0;
      const sv = parseFloat(smallGauzeValue) || 0;
      const lc = parseFloat(largeGauzeCount) || 0;
      const lv = parseFloat(largeGauzeValue) || 0;
      
      const small = sc * sv;
      const large = lc * lv;
      setTotalGauze(small + large);
      setStep('suction');
    } else if (step === 'suction') {
      const bottle = parseFloat(bottleVolume) || 0;
      const saline = parseFloat(salineUsed) || 0;
      setTotalSuction(Math.max(0, bottle - saline));
      setStep('urine');
    } else if (step === 'urine') {
      setStep('summary');
    } else if (step === 'summary') {
      Alert.alert('Surgery Complete', 'Surgery workflow data saved.', [
        { text: 'OK', onPress: () => router.push(`/${role}/dashboard` as any) }
      ]);
    }
  };

  const handleBack = () => {
    if (step === 'suction') setStep('gauze');
    else if (step === 'urine') setStep('suction');
    else if (step === 'summary') setStep('urine');
    else router.back();
  };

  const renderGauzeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 1: Gauze Calculation</Text>
      <Text style={styles.stepDesc}>Calculate volume from saturated gauzes</Text>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: primaryColor }]}>Small Gauze</Text>
        <Text style={styles.label}>Quantity (pcs)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={smallGauzeCount} onChangeText={setSmallGauzeCount} placeholderTextColor="#64748b" />
        <Text style={styles.label}>Blood Volume (ml/pc)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={smallGauzeValue} onChangeText={setSmallGauzeValue} placeholderTextColor="#64748b" />
      </View>

      <View style={[styles.card, { borderColor: '#fda4af' }]}>
        <Text style={[styles.cardTitle, { color: '#f43f5e' }]}>Large Gauze</Text>
        <Text style={styles.label}>Quantity (pcs)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={largeGauzeCount} onChangeText={setLargeGauzeCount} placeholderTextColor="#64748b" />
        <Text style={styles.label}>Blood Volume (ml/pc)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={largeGauzeValue} onChangeText={setLargeGauzeValue} placeholderTextColor="#64748b" />
      </View>
    </View>
  );

  const renderSuctionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 2: Suction Blood Loss</Text>
      <Text style={styles.stepDesc}>Calculate blood collected in suction bottles</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Suction Bottle Volume (ml)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={bottleVolume} onChangeText={setBottleVolume} placeholderTextColor="#64748b" />
        <Text style={styles.label}>Total Irrigation / Saline Used (ml)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={salineUsed} onChangeText={setSalineUsed} placeholderTextColor="#64748b" />
      </View>
    </View>
  );

  const renderUrineStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 3: Other Fluid Loss</Text>
      <Text style={styles.stepDesc}>Urine output and insensible loss</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Urine Collected (ml)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={urineOutput} onChangeText={setUrineOutput} placeholderTextColor="#64748b" />
        <Text style={styles.label}>Insensible Loss (ml) (Optional)</Text>
        <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={insensibleLoss} onChangeText={setInsensibleLoss} placeholderTextColor="#64748b" />
      </View>
    </View>
  );

  const renderSummary = () => {
    const totalBlood = totalGauze + totalSuction;
    const totalFluid = totalBlood + (parseFloat(urineOutput) || 0) + (parseFloat(insensibleLoss) || 0);

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 4: Summary</Text>
        <Text style={styles.stepDesc}>Review final calculated loss</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Gauze Blood:</Text>
            <Text style={styles.summaryValue}>{totalGauze.toFixed(1)} ml</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Suction Blood:</Text>
            <Text style={styles.summaryValue}>{totalSuction.toFixed(1)} ml</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total Blood Loss:</Text>
            <Text style={[styles.summaryTotalValue, { color: '#f43f5e' }]}>{totalBlood.toFixed(1)} ml</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Urine Output:</Text>
            <Text style={styles.summaryValue}>{(parseFloat(urineOutput) || 0).toFixed(1)} ml</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Insensible Loss:</Text>
            <Text style={styles.summaryValue}>{(parseFloat(insensibleLoss) || 0).toFixed(1)} ml</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total Fluid Loss:</Text>
            <Text style={[styles.summaryTotalValue, { color: primaryColor }]}>{totalFluid.toFixed(1)} ml</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={18} color="#cbd5e1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Surgery Workflow</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 'gauze' && renderGauzeStep()}
        {step === 'suction' && renderSuctionStep()}
        {step === 'urine' && renderUrineStep()}
        {step === 'summary' && renderSummary()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.nextBtn, { backgroundColor: primaryColor }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>{step === 'summary' ? 'Finish Surgery' : 'Calculate & Next'}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 24,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonContainer: {
    marginTop: 16,
  },
  nextBtn: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '900',
  },
});
