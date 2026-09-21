# 🧠 QuizMe

Turn your study notes into a multiple-choice quiz — **entirely on your own device**.

QuizMe uses [Tether's QVAC SDK](https://github.com/tetherto/qvac) to run a small
language model locally. There is no API key, no server, no usage bill, and your
notes **never leave your machine**.

## What it does

Give it a plain-text file with your notes and it prints a quiz generated from them:

```bash
node index.js my-notes.txt 5
```

## How it works (QVAC functions used)

| Step | QVAC SDK function |
|------|-------------------|
| Download + load the model into memory | `loadModel()` |
| Generate the quiz from your notes | `completion()` |
| Free the memory afterwards | `unloadModel()` |

- **SDK:** `@qvac/sdk` **v0.19.1** (npm)
- **Model:** `QWEN3_600M_INST_Q4` (~0.5 GB download, cached after first run)
- All inference runs **on-device** via llama.cpp (CPU fallback, works without a GPU)

## Requirements

- **Node.js >= 22.17** (check with `node --version`)
- ~1 GB free disk space for the model cache
- Works on 4 GB RAM machines (runs on CPU, no GPU needed)

## Install & run

```bash
git clone https://github.com/<your-username>/qvac-quizme.git
cd qvac-quizme
npm install

# First run downloads the model (~0.5 GB), then generates a quiz:
node index.js sample-notes.txt 5

# Or use your own notes:
node index.js path/to/your-notes.txt 3
```

> Tip: the first run is the slow one (model download). Every run after that
> reuses the cached model and works fully offline.

## Project structure

```
qvac-quizme/
├── index.js            # the whole app (~70 lines)
├── sample-notes.txt    # example notes so it runs out of the box
├── qvac.config.json    # SDK logging / download settings
└── package.json        # declares @qvac/sdk ^0.19.1
```

## License

MIT — see [LICENSE](LICENSE).
