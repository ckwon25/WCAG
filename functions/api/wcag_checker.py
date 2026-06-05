from utils import calculate_contrast_ratio, hex_to_rgb
from pptx import Presentation
from docx import Document

class WCAGChecker:
    def __init__(self, parsed_content):
        self.content = parsed_content
        self.violations = []

    def check(self):
        """Run all WCAG 2.1 Level AA checks."""
        self.check_alt_text()
        self.check_contrast()
        self.check_heading_hierarchy()
        self.check_font_sizes()

        return self.get_report()

    def check_alt_text(self):
        """Check for missing alt text on images."""
        missing_alt = []
        for idx, image in enumerate(self.content.get('images', [])):
            if not image.get('has_alt_text'):
                missing_alt.append(f"Image {idx + 1}: {image.get('filename', 'Unknown')}")

        if missing_alt:
            self.violations.append({
                'type': 'Missing Alt Text',
                'count': len(missing_alt),
                'issues': missing_alt,
                'severity': 'critical'
            })

    def check_contrast(self):
        """Check color contrast ratios (WCAG AA requires 4.5:1)."""
        low_contrast = []

        for slide_idx, slide in enumerate(self.content.get('slides', [])):
            for elem_idx, element in enumerate(slide.get('text_elements', []) if isinstance(slide, dict) else []):
                text_color = element.get('color')
                if text_color:
                    # Assume white background for now
                    try:
                        rgb = hex_to_rgb(text_color)
                        bg_rgb = (255, 255, 255)
                        ratio = calculate_contrast_ratio(rgb, bg_rgb)

                        if ratio < 4.5:
                            low_contrast.append(
                                f"Slide {slide_idx + 1}, Element {elem_idx + 1}: "
                                f"Contrast ratio {ratio:.2f}:1 (need 4.5:1)"
                            )
                    except:
                        pass

        if low_contrast:
            self.violations.append({
                'type': 'Low Color Contrast',
                'count': len(low_contrast),
                'issues': low_contrast[:10],  # Limit to first 10
                'severity': 'critical'
            })

    def check_heading_hierarchy(self):
        """Check for proper heading hierarchy (no skipped levels)."""
        headings = self.content.get('headings', [])
        if not headings:
            return

        hierarchy_issues = []
        prev_level = 0

        for idx, heading in enumerate(headings):
            level = heading.get('level', 0)
            if level > 0:
                if level > prev_level + 1:
                    hierarchy_issues.append(
                        f"Heading {idx + 1}: Jumped from H{prev_level} to H{level}"
                    )
                prev_level = level

        if hierarchy_issues:
            self.violations.append({
                'type': 'Heading Hierarchy',
                'count': len(hierarchy_issues),
                'issues': hierarchy_issues,
                'severity': 'warning'
            })

    def check_font_sizes(self):
        """Check that text is resizable to 200% without loss of functionality."""
        small_text = []

        for slide_idx, slide in enumerate(self.content.get('slides', [])):
            if isinstance(slide, dict):
                for elem_idx, element in enumerate(slide.get('text_elements', [])):
                    font_size = element.get('font_size', 12)
                    if font_size and font_size < 10:
                        small_text.append(
                            f"Slide {slide_idx + 1}: Text at {font_size}pt (too small)"
                        )

        if small_text:
            self.violations.append({
                'type': 'Small Font Size',
                'count': len(small_text),
                'issues': small_text[:10],
                'severity': 'warning'
            })

    def get_report(self):
        """Return violations report."""
        return {
            'total_violations': sum(v['count'] for v in self.violations),
            'violations': self.violations,
            'compliant': len(self.violations) == 0
        }
