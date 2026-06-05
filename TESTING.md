# Testing Guide - WCAG Compliance Tool

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

## Testing the App

### 1. Upload a Document
- Open the app in browser
- Click the upload area or drag a PPTX or DOCX file
- Supported formats: `.pptx`, `.docx`

### 2. Processing
- Wait for the processing status screen
- The app will analyze the document for WCAG 2.1 Level AA violations

### 3. Download Results
- View the compliance report showing violations found and fixed
- Download 4 versions:
  - **Standard**: Original styling with violations fixed
  - **High Contrast**: Dark mode with WCAG AA compliant colors
  - **Large Text**: 18pt+ fonts for low vision users
  - **Screen Reader Optimized**: Semantic structure optimized for accessibility

## Compliance Checks

The tool checks for:

### Critical Issues
- **Missing Alt Text**: All images must have descriptive alt text
- **Color Contrast**: Text must have 4.5:1 contrast ratio (WCAG AA) or 3:1 for large text

### Warnings
- **Heading Hierarchy**: No skipped heading levels (H1 → H2 → H3, not H1 → H3)
- **Font Sizes**: Text should be resizable to 200% without loss of functionality

## Deployment

### Netlify Deployment

The app is automatically deployed to Netlify when you push to the `main` branch:

1. Push code to GitHub (`git push origin main`)
2. Netlify automatically builds and deploys
3. Your site is live at your Netlify URL

### Environment Variables

Set these in Netlify's dashboard under **Site Settings → Build & Deploy → Environment**:

```
ANTHROPIC_API_KEY=sk-...  (for Claude API alt text generation)
```

## Troubleshooting

### Build Fails
- Ensure you have Node 18+: `node --version`
- Clear cache: `rm -rf node_modules dist && npm install`
- Check TypeScript: `npm run type-check`

### Upload Not Working
- Ensure file is .pptx or .docx
- Check browser console (F12) for errors
- Verify network request in DevTools Network tab

### Download Links Broken
- Check `/tmp/processed` directory has the files
- Verify file path in browser console

## Sample Test Documents

To test the tool:

1. **Create a PowerPoint in Google Slides**:
   - Add images without alt text
   - Use red text on dark background (low contrast)
   - Use inconsistent heading levels
   - Download as PPTX

2. **Create a Word document**:
   - Add paragraphs with various font sizes
   - Use light gray text (low contrast)
   - Structure with multiple heading levels
   - Export as DOCX

Upload these to test the compliance checker and generator.

## Expected Behavior

### Good Input
- Document processes in 2-5 seconds
- Compliance report shows violations found
- 4 versions available for download
- Each version is a valid PPTX/DOCX file

### Known Limitations

- **Document Processing**: Currently creates 4 copies of the input document (placeholder implementation)
- **Alt Text**: Auto-generation not yet integrated with Claude API
- **Contrast Fixes**: Not yet applied to output documents
- **Full Compliance**: Next phase will integrate python-pptx and python-docx for actual transformation

## Next Steps

1. **Phase 7-8**: Integrate actual document processing
   - Use python-pptx to modify PPTX files
   - Use python-docx to modify DOCX files
   - Apply contrast fixes and alt text

2. **Testing with Real Documents**:
   - Test with Fairfax County sample presentations
   - Validate output with Grackle or axe accessibility checker

3. **Performance Optimization**:
   - Handle large documents (100+ slides)
   - Reduce processing time
   - Cache processed files

## Contact

For issues or feedback, create a GitHub issue at: https://github.com/ckwon25/WCAG
