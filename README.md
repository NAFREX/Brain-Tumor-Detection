# Brain Tumor Detection | CNN Deep Learning

![Brain Tumor Detection](https://img.shields.io/badge/Brain_Tumor_Detection-CNN-blue)
![Accuracy](https://img.shields.io/badge/Accuracy-95.80%25-success)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-Enabled-yellow)

A binary image classification system that detects the presence of brain tumors in MRI scans using a custom Convolutional Neural Network (CNN) architecture trained on Google Colab with GPU acceleration.

This project also includes a responsive, browser-based web application that uses TensorFlow.js to run the trained model entirely locally, providing real-time inference on user-uploaded MRI scans.

## 🚀 Features

- **High Accuracy Model**: Custom CNN architecture achieving **95.80% test accuracy** on 690 test samples.
- **Dataset**: Trained on 4,600 MRI brain scans (2,513 Tumor / 2,087 Healthy).
- **Web Interface**: A premium, interactive frontend for live, in-browser prediction.
- **Privacy-First**: Thanks to TensorFlow.js, MRI scans uploaded to the web app are processed directly on your device and are never sent to a server.

## 🛠 Tech Stack

- **Machine Learning**: Python, TensorFlow / Keras, scikit-learn
- **Data Processing & Visualization**: NumPy, Pandas, Matplotlib, Seaborn
- **Web Development**: HTML5, Vanilla CSS, JavaScript, TensorFlow.js
- **Environment**: Google Colab (NVIDIA T4 GPU)

## 📊 Dataset & Pipeline

- **Images**: 4,600 MRI scans (JPEG, PNG, TIFF)
- **Preprocessing**: Images are resized to **224×224×3**, converted to RGB, and pixel values are normalized to `[0, 1]`.
- **Data Split**: 
  - 70% Training (3,220 images)
  - 15% Validation (690 images)
  - 15% Testing (690 images)

## 🧠 Model Architecture

A custom CNN designed for binary classification of brain MRI images:
1. **Input**: 224×224×3
2. **Block 1**: Conv2D (32, 3x3) + MaxPooling2D (2x2) + BatchNorm
3. **Block 2**: Conv2D (64, 3x3) + MaxPooling2D (2x2) + BatchNorm
4. **Block 3**: Conv2D (128, 3x3) + MaxPooling2D (2x2) + BatchNorm
5. **Classifier**: Flatten + Dense (256, ReLU) + Dropout (0.5) + Dense (1, Sigmoid)

**Configuration**: Adam Optimizer, Binary Crossentropy Loss.

## 📈 Results

| Metric | Score |
| :--- | :--- |
| **Test Accuracy** | 95.80% |
| **Test Loss** | 0.1691 |
| **Macro F1-Score**| 0.96 |

**Confusion Matrix**:
- True Positives (Tumor): 367
- True Negatives (Healthy): 294
- False Positives: 19
- False Negatives: 10

## 💻 Running the Web App Locally

To use the live prediction demo, you need to serve the web files locally. Browsers block loading local files (like the `model.json` and weights) via the `file://` protocol due to CORS policy.

1. **Get the Model**: Ensure the `tfjs_model` folder (containing `model.json` and weight files `.bin`) is in the root directory alongside `index.html`.
2. **Serve the app**: Use a local server. For example, with Python 3, run the following in your terminal:
   ```bash
   python -m http.server 8000
   ```
3. **Open the App**: Navigate to `http://localhost:8000` in your web browser.
4. **Predict**: Click "Load AI Model", upload an MRI scan, and see the results!

## 📜 License

This project is licensed under the MIT License.
