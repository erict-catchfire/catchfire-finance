# Data Science Packages
import os

import numpy as np
import pandas as pd

# JSON
import jsbeautifier

opts = jsbeautifier.default_options()
opts.indent_size = 2

# NLP Packages
import re
import contractions
import tensorflow as tf
from nltk.tokenize.toktok import ToktokTokenizer


def lower_case(text):
    return text.lower()


def strip_links(text):
    link_regex = re.compile("((https?):((//)|(\\\\))+([\w\d:#@%/;$()~_?\+-=\\\.&](#!)?)*)", re.DOTALL)
    links = re.findall(link_regex, text)
    for link in links:
        text = text.replace(link[0], ", ")
    return text


def space_comma(text):
    pattern = ","
    text = re.sub(pattern, " , ", text)
    return text


def space_emoji(text):
    try:
        # Wide UCS-4 build
        oRes = re.compile(
            "([" "\U0001F300-\U0001F64F" "\U0001F680-\U0001F6FF" "\u2600-\u26FF\u2700-\u27BF]+)",
            re.UNICODE,
        )
    except re.error:
        # Narrow UCS-2 build
        oRes = re.compile(
            "((" "\ud83c[\udf00-\udfff]|" "\ud83d[\udc00-\ude4f\ude80-\udeff]|" "[\u2600-\u26FF\u2700-\u27BF])+)",
            re.UNICODE,
        )
    text = oRes.sub(r"  \1  ", text)
    return text


def space_period(text):
    pattern = "\."

    if "." in text:
        last_position = text.rindex(".")
        text = text[:last_position] + "" + text[last_position + 1 :]

    text = re.sub(pattern, " ; ", text)
    return text


def consolidate_punc(text):
    pattern = r"[.!?,;\\]"

    if "!" in text:
        excl = True
    else:
        excl = False

    if "?" in text:
        question = True
    else:
        question = False

    text = re.sub(pattern, "", text)

    if excl:
        text = text + " ! "
    elif question:
        text = text + " ? "
    else:
        text = text + " . "

    return text


def remove_chars(text):
    text = text.replace("[", "")
    text = text.replace("]", " , ")
    text = text.replace("(", "")
    text = text.replace(")", " , ")
    text = text.replace("&amp", "")
    text = text.replace("&gt", "")
    text = text.replace("&lt", "")
    text = text.replace("*", "")
    text = text.replace("-", " , ")
    text = text.replace("|", " ")
    text = text.replace(":", " ")
    text = text.replace("@", " ")
    text = text.replace("#", " ")
    text = text.replace("$", " ")
    text = text.replace("/", " ")
    text = text.replace("\\", " ")
    return text


def remove_numbers(text):
    pattern = r"\d+"
    text = re.sub(pattern, "", text)
    return text


def expand_contractions(text):
    text = contractions.fix(text)
    return text


tokenizer = ToktokTokenizer()


def tokenize(text):
    return tokenizer.tokenize(text)


def join_text(text):
    return " ".join(text)


def remove_dup(text):
    text = text.replace(", ,", " ,")
    text = text.replace("; ;", " ;")
    return text


def process_text(text):
    modified_text = pd.Series(text)
    # Make everything lowercase.
    modified_text = modified_text.map(lower_case)
    # Take out all links.
    modified_text = modified_text.map(strip_links)
    # Seperate commas out into seperate token. ',' -> ' , '
    modified_text = modified_text.map(space_comma)
    # Seperate periods out into seperate token and modify. '.' -> ' ; '
    modified_text = modified_text.map(space_period)
    # Seperate emojis out into seperate token and modify.
    modified_text = modified_text.map(space_emoji)
    # Look for special punctuation and add punctuation to end of sentence
    modified_text = modified_text.map(consolidate_punc)
    # Remove certian characters.
    modified_text = modified_text.map(remove_chars)
    # Remove numbers.
    modified_text = modified_text.map(remove_numbers)
    # Expand Contractions
    modified_text = modified_text.map(expand_contractions)
    # Tokenize and Join Text. (Make uniform spaces)
    modified_text = modified_text.map(tokenize)
    modified_text = modified_text.map(join_text)
    # Remove some duplication that could occur from preprocessing
    modified_text = modified_text.map(remove_dup)
    return np.array(modified_text).tolist()


def predict_sentiment(string_array):
    from flask import current_app

    loaded_model = current_app.loaded_model

    model_input = pd.Series(string_array)
    if loaded_model:
        yhat = loaded_model.predict(model_input)
        return np.array(yhat).tolist()
    return np.array([]).tolist()
