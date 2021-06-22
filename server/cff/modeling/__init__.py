import os
import tensorflow as tf

LOAD_MODEL = True
MODEL_FILE = os.environ.get("MODEL_FILE")

if LOAD_MODEL and MODEL_FILE:
    import nltk
    import tensorflow_text

    loaded_model = tf.keras.models.load_model(f"./cff/model/{MODEL_FILE}")
    print(f"Loaded model: {MODEL_FILE}")
