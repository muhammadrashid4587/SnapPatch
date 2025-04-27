# # import cv2, numpy as np, tensorflow as tf, tensorflow_hub as hub

# # _MODEL = hub.load(
# #     "https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/5"
# # )
# # _INJURY_LABEL = 767   # ImageNet “band-aid” class

# # def is_injury(img_bytes: bytes, threshold: float = 0.60) -> tuple[bool, float]:
# #     """Return (True/False, confidence) that a wound is present."""
# #     arr = np.frombuffer(img_bytes, np.uint8)
# #     img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
# #     rgb = cv2.cvtColor(cv2.resize(img, (224, 224)), cv2.COLOR_BGR2RGB) / 255.0
# #     logits = _MODEL(rgb[np.newaxis])[0].numpy()
# #     conf = float(logits[_INJURY_LABEL])
# #     return conf >= threshold, conf


# # verify.py
# """
# Cheap 'is this an injury?' detector for SnapPatch tests.

# - If > 1 % of the pixels fall in a red-hue range we say it *looks* like
#   an injury.  The proportion itself is returned as the 'confidence'.
# """

# from __future__ import annotations
# import cv2, numpy as np
# from typing import Tuple


# def _red_ratio(bgr: np.ndarray) -> float:
#     """Return ratio ∈ [0, 1] of red-hue pixels in BGR image."""
#     hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
#     lower, upper = np.array([0, 50, 50]), np.array([10, 255, 255])
#     mask = cv2.inRange(hsv, lower, upper)
#     return mask.mean() / 255.0


# def is_injury(img_b: bytes) -> Tuple[bool, float]:
#     """
#     Heuristic check: if ≥ 1 % of pixels are reddish → True.
#     Returns (ok, confidence) where confidence == red-pixel ratio.
#     """
#     arr = np.frombuffer(img_b, np.uint8)
#     bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
#     if bgr is None:
#         return False, 0.0

#     ratio = _red_ratio(bgr)
#     return ratio >= 0.01, float(ratio)


# verify.py

import cv2, numpy as np, tensorflow as tf, tensorflow_hub as hub

_MODEL = hub.load(
    "https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/5"
)
_INJURY_LABEL = 767   # ImageNet “band-aid” class

def is_injury(img_bytes: bytes, threshold: float = 0.60) -> tuple[bool, float]:
    """Return (True/False, confidence) that a wound is present."""
    arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    # resize + convert to RGB, then normalize to [0..1]
    rgb = cv2.cvtColor(cv2.resize(img, (224, 224)),
                       cv2.COLOR_BGR2RGB) / 255.0

    # <-- insert your cast here
    rgb = rgb.astype(np.float32)

    # now the tensor shape/dtype matches what the SavedModel expects
    logits = _MODEL(rgb[np.newaxis])[0].numpy()
    conf = float(logits[_INJURY_LABEL])
    return conf >= threshold, conf
