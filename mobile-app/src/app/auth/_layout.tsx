import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="doctor-login" />
      <Stack.Screen name="nurse-login" />
    </Stack>
  );
}
