import cv2, numpy as np, tensorflow as tf, tensorflow_hub as hub

_MODEL = hub.load(
    "https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/5"
)
_INJURY_LABEL = 767   # ImageNet “band-aid” class

def is_injury(img_bytes: bytes, threshold: float = 0.60) -> tuple[bool, float]:
    """Return (True/False, confidence) that a wound is present."""
    arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    rgb = cv2.cvtColor(cv2.resize(img, (224, 224)), cv2.COLOR_BGR2RGB) / 255.0
    logits = _MODEL(rgb[np.newaxis])[0].numpy()
    conf = float(logits[_INJURY_LABEL])
    return conf >= threshold, conf
