// ===== PREDICTOR.JS — Brain Tumor Detection using TensorFlow.js =====

let model = null;
let modelLoaded = false;

// ===== LOAD MODEL =====
async function loadModel() {
  const statusEl = document.getElementById('model-status');
  const loadBtn = document.getElementById('load-model-btn');

  try {
    statusEl.textContent = '⏳ Loading model...';
    statusEl.className = 'model-status loading';
    loadBtn.disabled = true;

    // Load from local tfjs_model folder
    model = await tf.loadLayersModel('./tfjs_model/model.json');
    modelLoaded = true;

    statusEl.textContent = '✅ Model loaded! Upload an MRI image to predict.';
    statusEl.className = 'model-status success';
    loadBtn.textContent = '✅ Model Ready';

    // Enable upload
    document.getElementById('upload-zone').classList.remove('disabled');
    document.getElementById('image-input').disabled = false;

    console.log('Model loaded:', model.inputs, model.outputs);
  } catch (err) {
    const msg = err.message || String(err);
    statusEl.textContent = '❌ Error: ' + msg;
    statusEl.className = 'model-status error';
    loadBtn.disabled = false;
    loadBtn.textContent = '🔄 Retry Load Model';
    console.error('Full model load error:', err);
  }
}

// ===== PREPROCESS IMAGE =====
function preprocessImage(imgElement) {
  return tf.tidy(() => {
    // Convert image to tensor
    let tensor = tf.browser.fromPixels(imgElement, 3); // RGB, 3 channels

    // Resize to 224x224 (same as training)
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);

    // Normalize to [0, 1]
    tensor = tensor.div(255.0);

    // Add batch dimension: [1, 224, 224, 3]
    tensor = tensor.expandDims(0);

    return tensor;
  });
}

// ===== RUN PREDICTION =====
async function predict(imgElement) {
  if (!modelLoaded || !model) {
    alert('Please load the model first!');
    return;
  }

  const resultEl = document.getElementById('prediction-result');
  const confidenceEl = document.getElementById('confidence-bar-fill');
  const confidenceTextEl = document.getElementById('confidence-text');
  const predLabelEl = document.getElementById('pred-label');
  const predIconEl = document.getElementById('pred-icon');

  resultEl.classList.remove('hidden');
  predLabelEl.textContent = 'Analyzing...';
  predIconEl.textContent = '⏳';

  try {
    // Preprocess
    const inputTensor = preprocessImage(imgElement);

    // Predict
    const prediction = await model.predict(inputTensor);
    const score = (await prediction.data())[0]; // sigmoid output [0,1]

    // Cleanup
    inputTensor.dispose();
    prediction.dispose();

    // Interpret result
    const isTumor = score > 0.5;
    const confidence = isTumor
      ? (score * 100).toFixed(1)
      : ((1 - score) * 100).toFixed(1);

    // Update UI
    if (isTumor) {
      predIconEl.textContent = '🔴';
      predLabelEl.textContent = 'TUMOR DETECTED';
      predLabelEl.style.color = '#ff4d6d';
      resultEl.style.borderColor = 'rgba(255,77,109,0.5)';
      resultEl.style.background = 'rgba(255,77,109,0.08)';
      confidenceEl.style.background = 'linear-gradient(90deg, #ff4d6d, #ff8fa3)';
    } else {
      predIconEl.textContent = '🟢';
      predLabelEl.textContent = 'HEALTHY — No Tumor';
      predLabelEl.style.color = '#00c896';
      resultEl.style.borderColor = 'rgba(0,200,150,0.5)';
      resultEl.style.background = 'rgba(0,200,150,0.08)';
      confidenceEl.style.background = 'linear-gradient(90deg, #00c896, #5fffc0)';
    }

    confidenceEl.style.width = confidence + '%';
    confidenceTextEl.textContent = `${confidence}% confidence (raw score: ${score.toFixed(4)})`;

  } catch (err) {
    predLabelEl.textContent = 'Prediction failed. Check console.';
    console.error('Prediction error:', err);
  }
}

// ===== IMAGE UPLOAD HANDLER =====
function handleImageUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert('Please upload a valid image file (JPG, PNG, etc.)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const previewEl = document.getElementById('preview-img');
    const previewWrap = document.getElementById('preview-wrap');
    const uploadPrompt = document.getElementById('upload-prompt');

    previewEl.src = e.target.result;
    previewWrap.classList.remove('hidden');
    uploadPrompt.classList.add('hidden');

    // Wait for image to load, then predict
    previewEl.onload = () => predict(previewEl);
  };
  reader.readAsDataURL(file);
}

// ===== SETUP EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('image-input');
  const uploadZone = document.getElementById('upload-zone');
  const loadBtn = document.getElementById('load-model-btn');

  if (loadBtn) loadBtn.addEventListener('click', loadModel);

  if (input) {
    input.addEventListener('change', (e) => {
      if (e.target.files[0]) handleImageUpload(e.target.files[0]);
    });
  }

  // Drag and drop
  if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    });
    uploadZone.addEventListener('click', () => {
      if (!uploadZone.classList.contains('disabled')) {
        input.click();
      }
    });
  }

  // Reset button
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('preview-wrap').classList.add('hidden');
      document.getElementById('upload-prompt').classList.remove('hidden');
      document.getElementById('prediction-result').classList.add('hidden');
      document.getElementById('image-input').value = '';
    });
  }
});
