from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public" / "assets" / "tryon-generated"
VARIANT_ROOT = ASSET_ROOT / "color-variants"

PRODUCT_ASSETS = {
    "noir-blazer": ("noir-blazer-blue.png", "noir-blazer-fog-grey.png"),
    "ivory-dress": ("ivory-dress-purple.png", "ivory-dress-black.png"),
    "denim-jacket": ("denim-jacket-red.png", "denim-jacket-indigo.png"),
    "red-knit": ("red-knit-print.png", "red-knit-warm-white.png"),
    "pleated-skirt": ("pleated-skirt-stripe.png", "pleated-skirt-sand-gold.png"),
    "trench-coat": ("trench-coat-yellow.png", "trench-coat-pine-green.png"),
}

LABELED_PROFILE_FOLDERS = {
    "slim-curved": "slim/reference-matched",
    "standard-curved": "reference-matched",
    "full-curved": "full/reference-matched",
}

ADDITIONAL_ASSETS = {
    "slim-straight": {"noir-blazer": 2, "ivory-dress": 1, "denim-jacket": 4, "red-knit": 3, "pleated-skirt": 6, "trench-coat": 7},
    "slim-pear": {"noir-blazer": 5, "ivory-dress": 9, "denim-jacket": 8, "red-knit": 10, "pleated-skirt": 11, "trench-coat": 12},
    "standard-straight": {"noir-blazer": 13, "ivory-dress": 14, "denim-jacket": 15, "red-knit": 22, "pleated-skirt": 18, "trench-coat": 17},
    "standard-pear": {"noir-blazer": 16, "ivory-dress": 21, "denim-jacket": 19, "red-knit": 27, "pleated-skirt": 28, "trench-coat": 25},
    "full-straight": {"noir-blazer": 20, "ivory-dress": 26, "denim-jacket": 24, "red-knit": 29, "pleated-skirt": 30, "trench-coat": 32},
    "full-pear": {"noir-blazer": 23, "ivory-dress": 33, "denim-jacket": 35, "red-knit": 34, "pleated-skirt": 31, "trench-coat": 36},
}

PROFILES = [
    "slim-straight", "slim-curved", "slim-pear",
    "standard-straight", "standard-curved", "standard-pear",
    "full-straight", "full-curved", "full-pear",
]

TARGET_BGR = {
    "noir-blazer": (148, 153, 154),
    "ivory-dress": (39, 39, 39),
}


def source_path(profile_id: str, product_id: str) -> Path:
    source_name = PRODUCT_ASSETS[product_id][0]
    if profile_id in LABELED_PROFILE_FOLDERS:
        return ASSET_ROOT / LABELED_PROFILE_FOLDERS[profile_id] / source_name
    number = ADDITIONAL_ASSETS[profile_id][product_id]
    return ASSET_ROOT / "additional-body-types" / f"body-type-combination-{number:02d}.png"


def skin_color_mask(image_bgr: np.ndarray) -> np.ndarray:
    ycrcb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2YCrCb)
    ycrcb_skin = cv2.inRange(
        ycrcb,
        np.array([45, 132, 76], dtype=np.uint8),
        np.array([255, 180, 138], dtype=np.uint8),
    )
    hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    hue, saturation, value = cv2.split(hsv)
    hsv_skin = (
        ((hue <= 25) | (hue >= 172))
        & (saturation >= 12)
        & (saturation <= 175)
        & (value >= 55)
    )
    return cv2.bitwise_or(ycrcb_skin, hsv_skin.astype(np.uint8) * 255)


def identity_mask(image_bgr: np.ndarray, product_id: str) -> np.ndarray:
    height, width = image_bgr.shape[:2]
    allowed = np.zeros((height, width), dtype=np.uint8)
    allowed[: int(height * 0.20), int(width * 0.34) : int(width * 0.66)] = 255
    allowed[int(height * 0.28) : int(height * 0.67), int(width * 0.12) : int(width * 0.42)] = 255
    allowed[int(height * 0.28) : int(height * 0.67), int(width * 0.58) : int(width * 0.88)] = 255
    if product_id in {"noir-blazer", "red-knit"}:
        allowed[int(height * 0.53) :, int(width * 0.24) : int(width * 0.76)] = 255

    skin = cv2.bitwise_and(skin_color_mask(image_bgr), allowed)
    cv2.ellipse(
        skin,
        (width // 2, int(height * 0.105)),
        (int(width * 0.085), int(height * 0.065)),
        0,
        0,
        360,
        255,
        -1,
    )
    return cv2.morphologyEx(skin, cv2.MORPH_CLOSE, np.ones((3, 3), dtype=np.uint8))


def clean_source_color_residue(image_bgr: np.ndarray, product_id: str, protected: np.ndarray) -> np.ndarray:
    if product_id not in TARGET_BGR:
        return image_bgr

    hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    hue, saturation, value = cv2.split(hsv)
    if product_id == "noir-blazer":
        residue = (hue >= 88) & (hue <= 122) & (saturation >= 24) & (value >= 45)
    elif product_id == "ivory-dress":
        residue = (hue >= 120) & (hue <= 170) & (saturation >= 22) & (value >= 30)
    elif product_id == "denim-jacket":
        residue = ((hue <= 12) | (hue >= 170)) & (saturation >= 65) & (value >= 40)
    else:
        residue = (hue >= 15) & (hue <= 45) & (saturation >= 48) & (value >= 50)

    residue &= protected == 0
    mask = residue.astype(np.uint8) * 255
    if not np.any(mask):
        return image_bgr
    mask = cv2.dilate(mask, np.ones((3, 3), dtype=np.uint8), iterations=1)

    image_lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    target = np.uint8([[TARGET_BGR[product_id]]])
    target_lab = cv2.cvtColor(target, cv2.COLOR_BGR2LAB)[0, 0]
    recolored_lab = image_lab.copy()
    recolored_lab[:, :, 1] = target_lab[1]
    recolored_lab[:, :, 2] = target_lab[2]
    if product_id == "ivory-dress":
        recolored_lab[:, :, 0] = np.clip(image_lab[:, :, 0] * 0.35 + 5, 5, 78).astype(np.uint8)
    recolored = cv2.cvtColor(recolored_lab, cv2.COLOR_LAB2BGR)
    alpha = cv2.GaussianBlur(mask, (0, 0), 0.8).astype(np.float32)[:, :, None] / 255.0
    return np.clip(image_bgr * (1 - alpha) + recolored * alpha, 0, 255).astype(np.uint8)


def restore_variant(profile_id: str, product_id: str) -> None:
    source = cv2.imread(str(source_path(profile_id, product_id)), cv2.IMREAD_COLOR)
    variant_path = VARIANT_ROOT / profile_id / PRODUCT_ASSETS[product_id][1]
    variant = cv2.imread(str(variant_path), cv2.IMREAD_COLOR)
    if source is None or variant is None:
        raise FileNotFoundError(f"Missing source or variant for {profile_id}/{product_id}")
    if variant.shape != source.shape:
        variant = cv2.resize(variant, (source.shape[1], source.shape[0]), interpolation=cv2.INTER_LANCZOS4)

    mask = identity_mask(source, product_id)
    variant = clean_source_color_residue(variant, product_id, mask)
    feather = cv2.GaussianBlur(mask, (0, 0), 1.5).astype(np.float32) / 255.0
    feather = feather[:, :, None]
    restored = np.clip(variant * (1 - feather) + source * feather, 0, 255).astype(np.uint8)
    restored[mask == 255] = source[mask == 255]

    if not np.array_equal(restored[mask == 255], source[mask == 255]):
        raise RuntimeError(f"Identity pixels differ for {profile_id}/{product_id}")
    if not cv2.imwrite(str(variant_path), restored):
        raise RuntimeError(f"Could not write {variant_path}")


def main() -> None:
    restored = 0
    for profile_id in PROFILES:
        for product_id in PRODUCT_ASSETS:
            restore_variant(profile_id, product_id)
            restored += 1
    print(f"Restored source identity and skin pixels in {restored} color variants")


if __name__ == "__main__":
    main()
