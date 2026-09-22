# QuizMe

QuizMe is an Android app that generates multiple-choice quiz questions using Tether's QVAC SDK with on-device AI inference.

## Features

- Runs QVAC inference locally on an Android device
- Uses the `QWEN3_600M_INST_Q4` model
- Loads the model with `loadModel()`
- Generates quiz content with `completion()`
- Displays the generated quiz inside the app
- No cloud API key is required for inference

## Tech Stack

- Expo 54
- React Native 0.81
- Tether QVAC SDK `@qvac/sdk` 0.19.1
- React Native Bare Kit
- Android arm64-v8a

## Requirements

QVAC Android inference requires compatible physical hardware and runtime support.

The test device used for this project is an Android 15 arm64 device.

An Android emulator is not supported for QVAC inference.

## Run the Project

Install dependencies:

```bash
npm install