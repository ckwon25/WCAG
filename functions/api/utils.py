import os
import json
from colorsys import rgb_to_hls, hls_to_rgb

def calculate_contrast_ratio(color1: tuple, color2: tuple) -> float:
    """Calculate WCAG contrast ratio between two RGB colors."""
    def get_luminance(rgb):
        r, g, b = [x / 255.0 for x in rgb]
        r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
        g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
        b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
        return 0.2126 * r + 0.7152 * g + 0.0722 * b

    l1 = get_luminance(color1)
    l2 = get_luminance(color2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def adjust_color_for_contrast(text_color: tuple, bg_color: tuple, target_ratio: float = 4.5) -> tuple:
    """Adjust text color to meet contrast ratio. Returns new RGB tuple."""
    current_ratio = calculate_contrast_ratio(text_color, bg_color)
    if current_ratio >= target_ratio:
        return text_color

    # Try darkening text
    r, g, b = text_color
    h, l, s = rgb_to_hls(r/255, g/255, b/255)

    # Binary search for correct lightness
    lo, hi = 0, l
    while hi - lo > 0.01:
        mid = (lo + hi) / 2
        test_rgb = tuple(int(x * 255) for x in hls_to_rgb(h, mid, s))
        if calculate_contrast_ratio(test_rgb, bg_color) < target_ratio:
            hi = mid
        else:
            lo = mid

    return tuple(int(x * 255) for x in hls_to_rgb(h, lo, s))

def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 6:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    return (0, 0, 0)

def rgb_to_hex(rgb: tuple) -> str:
    """Convert RGB tuple to hex color."""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def save_json(filepath: str, data):
    """Save data as JSON."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(data, f)

def load_json(filepath: str):
    """Load JSON data."""
    with open(filepath, 'r') as f:
        return json.load(f)
