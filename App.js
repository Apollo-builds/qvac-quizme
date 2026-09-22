import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  completion,
  loadModel,
  QWEN3_600M_INST_Q4,
} from '@qvac/sdk';

export default function App() {
  const [modelId, setModelId] = useState(null);
  const [status, setStatus] = useState('Ready to load QVAC');
  const [quiz, setQuiz] = useState('');

  const handleLoadModel = async () => {
    try {
      setStatus('Loading QVAC model...');

      const id = await loadModel({
        modelSrc: QWEN3_600M_INST_Q4,
        modelConfig: { ctx_size: 4096 },
      });

      setModelId(id);
      setStatus(`Model loaded: ${id}`);
    } catch (error) {
      setStatus(`QVAC error: ${error?.message ?? String(error)}`);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!modelId) {
      setStatus('Load the QVAC model first.');
      return;
    }

    try {
      setStatus('Generating quiz...');
      setQuiz('');

      const result = completion({
        modelId,
        history: [
          {
            role: 'user',
            content:
              'Create one multiple-choice quiz question about basic science. Give four answer choices and identify the correct answer.',
          },
        ],
        stream: false,
      });

      const final = await result.final;
      const text = final?.contentText ?? JSON.stringify(final);

      setQuiz(text);
      setStatus('Quiz generated successfully.');
    } catch (error) {
      setStatus(`QVAC error: ${error?.message ?? String(error)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuizMe</Text>
      <Text style={styles.subtitle}>On-device AI quiz generator</Text>

      <Button title="Load QVAC Model" onPress={handleLoadModel} />

      <View style={styles.spacer} />

      <Button
        title="Generate Quiz"
        onPress={handleGenerateQuiz}
        disabled={!modelId}
      />

      <Text style={styles.status}>{status}</Text>

      <ScrollView
        style={styles.resultBox}
        contentContainerStyle={styles.resultContent}
      >
        <Text style={styles.quizText}>
          {quiz || 'Your generated quiz will appear here.'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  spacer: {
    height: 16,
  },
  status: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  resultBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    marginTop: 8,
  },
  resultContent: {
    padding: 16,
  },
  quizText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
