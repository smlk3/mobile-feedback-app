import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Button, Text, Alert, StyleSheet, Picker } from 'react-native';

export default function App() {
  const [feedback, setFeedback] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Uyarı', 'Lütfen geri bildirim giriniz.');
      return;
    }
    if (!contactMethod || !contactValue.trim()) {
      Alert.alert('Uyarı', 'Lütfen iletişim yöntemi ve bilgisini doldurunuz.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://localhost:5010/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedback,
          contact_method: contactMethod,
          contact_value: contactValue,
        }),
      });
      if (response.ok) {
        Alert.alert('Teşekkürler', 'Geri bildiriminiz alındı.');
        setFeedback('');
        setContactMethod('');
        setContactValue('');
      } else {
        Alert.alert('Hata', 'Bir hata oluştu, lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya ulaşılamıyor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Geri Bildirim</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Geri bildiriminizi yazın"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />

      <Text style={styles.label}>Geri Dönüş Yöntemi</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={contactMethod}
          onValueChange={setContactMethod}
          style={styles.picker}
        >
          <Picker.Item label="Seçiniz" value="" />
          <Picker.Item label="E-posta" value="email" />
          <Picker.Item label="Telefon" value="phone" />
          <Picker.Item label="SMS" value="sms" />
        </Picker>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder={
          contactMethod === 'email'
            ? 'E-posta adresi girin'
            : contactMethod === 'phone' || contactMethod === 'sms'
            ? 'Telefon numarası girin'
            : 'İletişim bilgisini girin'
        }
        value={contactValue}
        onChangeText={setContactValue}
        keyboardType={contactMethod === 'email' ? 'email-address' : 'phone-pad'}
      />

      <Button title={loading ? "Gönderiliyor..." : "Gönder"} onPress={handleSubmit} disabled={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  label: { fontSize: 16, marginTop: 16, marginBottom: 8, fontWeight: 'bold' },
  textInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    minHeight: 40,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: { height: 50, width: '100%' },
});
