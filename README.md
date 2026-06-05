# WCAG Compliance Tool

Automated WCAG 2.1 Level AA compliance fixer for presentation decks.

## Features

- **Upload Support**: PPTX, DOCX (Google Slides can be exported as PPTX)
- **Automated Fixes**:
  - Alt text generation for images using Claude API
  - Color contrast validation and correction (4.5:1 ratio)
  - Heading hierarchy validation
  - Semantic markup checking
  
- **Four Output Versions**:
  1. **High Contrast**: Dark mode with WCAG AA compliant colors
  2. **Standard**: Original styling with violations fixed
  3. **Large Text**: All text 18pt+, layout adjusted for low vision
  4. **Screen Reader Optimized**: Semantic structure optimized for accessibility

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Python 3.11 + Netlify Functions
- **Document Processing**: python-pptx, python-docx
- **AI**: Anthropic Claude API for alt text generation

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- Netlify account (connected to this GitHub repo)

### Installation

```bash
npm install
pip install -r functions/requirements.txt
```

### Environment Variables

Create `.env` file:

```
ANTHROPIC_API_KEY=your_key_here
```

### Development

```bash
npm run dev
```

Runs Vite dev server on http://localhost:3000 and Netlify Functions locally.

### Build

```bash
npm run build
```

## Deployment

Connected to Netlify via GitHub. Push to main branch to deploy.

## Usage

1. Upload a PPTX or DOCX file
2. Wait for processing (analyzes structure, detects violations, generates fixes)
3. Download any of the 4 compliant versions
4. Review compliance report

## WCAG Standards Compliance

This tool implements WCAG 2.1 Level AA standards per:
- [ADA Web Rule (2024)](https://www.ada.gov/resources/2024-03-08-web-rule/)
- [WCAG2ICT Standard](https://www.w3.org/TR/2025/NOTE-wcag2ict-22-20251211/)
