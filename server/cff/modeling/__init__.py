import os
import tensorflow as tf

LOAD_MODEL = True
MODEL_FILE = os.environ.get("MODEL_FILE")

global loaded_model
loaded_model = None

if LOAD_MODEL and MODEL_FILE and not loaded_model:
    import nltk
    import tensorflow_text

    loaded_model = tf.keras.models.load_model(f"./cff/modeling/{MODEL_FILE}")
    print(f"Loaded model: {MODEL_FILE}")
