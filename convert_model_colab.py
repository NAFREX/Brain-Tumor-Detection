# ============================================================
# Run this cell in Google Colab to convert & download the model
# ============================================================

# Install tensorflowjs converter
!pip install tensorflowjs -q

import tensorflowjs as tfjs
from tensorflow.keras.models import load_model
import shutil
from google.colab import files

# Load your saved model (adjust path if needed)
model = load_model('/content/drive/MyDrive/Brain Tumor DataSet/best_model.keras')
print("Model loaded successfully!")
print(model.summary())

# Convert to TensorFlow.js format
tfjs.converters.save_keras_model(model, '/content/tfjs_model')
print("Model converted to TF.js format!")

# Zip it for download
shutil.make_archive('/content/tfjs_model_export', 'zip', '/content/tfjs_model')
print("Zipped! Downloading...")

# Download to your computer
files.download('/content/tfjs_model_export.zip')
print("Done! Extract the zip and place the folder as 'tfjs_model' inside your project.")
