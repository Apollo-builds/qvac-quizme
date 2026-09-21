#!/usr/bin/env node
// QuizMe - turn your study notes into a quiz, 100% on-device.
//
// Uses Tether's QVAC SDK: loadModel() to load a small local LLM,
// completion() to generate the quiz. No API keys, no network calls
// at inference time, no data ever leaves this machine.

import { readFileSync } from 'node:fs'
import { loadModel, QWEN3_600M_INST_Q4, completion, unloadModel } from '@qvac/sdk'

const NOTES_PATH = process.argv[2] ?? './sample-notes.txt'
const NUM_QUESTIONS = Number(process.argv[3] ?? 5)

// A 600M model has a small context window - keep the prompt focused.
const MAX_NOTES_CHARS = 4000

function readNotes(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    console.error(`✖ Could not read notes file: ${path}`)
    console.error('  Usage: node index.js <path-to-notes.txt> [number-of-questions]')
    process.exit(1)
  }
}

const notes = readNotes(NOTES_PATH).slice(0, MAX_NOTES_CHARS)

const history = [
  {
    role: 'system',
    content:
      "You are QuizMe, a study assistant. You create short multiple-choice quizzes from the user's own notes. " +
      'Answer only with the quiz: numbered questions, options a) b) c) d), and the correct answer marked after each question.'
  },
  {
    role: 'user',
    content:
      'Here are my study notes:\n' + notes + '\n' +
      'Create a quiz with ' + NUM_QUESTIONS + ' multiple-choice questions based only on these notes. ' +
      'For each question list 4 options (a-d) and then the correct answer.'
  }
]

console.log('🧠 QuizMe - loading on-device model (Qwen3 0.6B Q4)...')
console.log('   (first run downloads ~0.5 GB; after that it is cached locally)\n')

let modelId
try {
  modelId = await loadModel({
    modelSrc: QWEN3_600M_INST_Q4,
    modelType: 'llm',
    onProgress: (p) => {
      const mb = (n) => (n / 1e6).toFixed(1)
      const line = `   ▸ Downloading ${p.percentage.toFixed(0)}% (${mb(p.downloaded)}/${mb(p.total)} MB)`
      process.stderr.write(process.stderr.isTTY ? `\r${line}` : `${line}\n`)
      if (p.percentage >= 100) process.stderr.write('\n')
    }
  })

  console.log(`📚 Notes: ${NOTES_PATH}\n`)
  console.log('📝 Your quiz (generated locally, Wi-Fi optional):\n')
  console.log('─'.repeat(60))

  const result = completion({ modelId, history, stream: true })
  for await (const token of result.tokenStream) {
    process.stdout.write(token)
  }

  console.log('\n' + '─'.repeat(60))
  console.log('\n✅ Done. Nothing was sent to any server.')
} catch (error) {
  console.error('\n✖', error)
  process.exit(1)
} finally {
  if (modelId) await unloadModel({ modelId })
}
