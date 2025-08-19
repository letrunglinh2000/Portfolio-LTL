# Academic Website - LE TRUNG LINH

A fast, accessible, and mobile-first academic website built with pure HTML, CSS, and JavaScript. Features publications management, dark mode, and responsive design.

## 🚀 Live Demo

Visit the live site: [https://YOURUSERNAME.github.io](https://YOURUSERNAME.github.io)

## ✨ Features

- **Fast & Lightweight**: < 200KB total page weight, optimized for performance
- **Accessible**: WCAG-AA compliant with keyboard navigation and screen reader support
- **Mobile-First**: Responsive design that works on all devices
- **Dark Mode**: System preference detection with manual toggle
- **SEO Optimized**: Meta tags, Open Graph, sitemap, and structured data
- **Easy Content Management**: JSON-based configuration for easy updates
- **Publications Management**: BibTeX support with search and filtering
- **Conference Highlights**: Accessible image carousel with autoplay and manual navigation
- **GitHub Pages Ready**: Automatic deployment with GitHub Actions

## 📁 Project Structure

```
/
├── index.html                 # Homepage
├── css/styles.css            # Main stylesheet
├── js/main.js               # JavaScript functionality
├── data/
│   ├── site.json            # Personal info and configuration
│   ├── publications.json    # Research publications
│   └── news.json           # Latest news and updates
├── pages/
│   ├── publications.html    # Publications page with search/filter
│   ├── talks.html          # Conference talks and presentations
│   ├── teaching.html       # Teaching experience and courses
│   ├── service.html        # Academic service and reviewing
│   └── cv.html            # Curriculum vitae
├── files/
│   └── cv.pdf             # CV download (placeholder)
├── img/
│   ├── profile.jpg        # Profile photo (placeholder)
│   └── conference/        # Conference highlight photos
│       ├── conference1.svg # Placeholder image 1
│       ├── conference2.svg # Placeholder image 2
│       └── conference3.svg # Placeholder image 3
├── .github/workflows/
│   └── pages.yml          # GitHub Actions deployment
├── 404.html              # Custom 404 error page
├── sitemap.xml           # SEO sitemap
├── robots.txt           # Search engine instructions
└── README.md           # This file
```

## 🎯 Quick Start

### 1. Use This Template

1. Click "Use this template" or fork this repository
2. Rename it to `YOURUSERNAME.github.io` (replace with your GitHub username)
3. Enable GitHub Pages in Settings → Pages → Source: GitHub Actions

### 2. Customize Your Content

Edit these files with your information:

#### `data/site.json` - Personal Information
```json
{
  "name": "Your Full Name",
  "title": "Your Job Title",
  "affiliation": "Your Institution",
  "email": "your.email@example.com",
  "location": "Your City, Country",
  "social": {
    "scholar": "https://scholar.google.com/citations?user=YOUR_ID",
    "github": "https://github.com/yourusername",
    "x": "https://twitter.com/yourusername",
    "linkedin": "https://www.linkedin.com/in/yourusername",
    "orcid": "https://orcid.org/0000-0000-0000-0000"
  },
  "interests": [
    "Your Research Interest 1",
    "Your Research Interest 2",
    "Your Research Interest 3"
  ],
  "about": "Your 2-3 sentence bio describing your research focus and current work."
}
```

#### `data/publications.json` - Research Publications
```json
[
  {
    "title": "Your Paper Title",
    "authors": ["LE TRUNG LINH", "Coauthor 1", "Coauthor 2"],
    "venue": "Conference/Journal Name",
    "year": 2024,
    "links": {
      "pdf": "files/paper.pdf",
      "code": "https://github.com/yourusername/project",
      "arxiv": "https://arxiv.org/abs/XXXX.XXXXX"
    },
    "tags": ["Tag1", "Tag2"],
    "abstract": "One paragraph abstract of your paper."
  }
]
```

#### `data/news.json` - Latest Updates
```json
[
  {
    "date": "2024-08-01",
    "text": "Paper accepted at Top Conference 2024!"
  }
]
```

### 3. Add Your Files

- Replace `img/profile.jpg` with your photo (300x300px recommended)
- Add your CV as `files/cv.pdf`
- Update all instances of placeholder text (LE TRUNG LINH, YOURUSERNAME, etc.)

### 4. Deploy

Commit and push your changes. The site will automatically deploy via GitHub Actions.

## 📝 Content Management Guide

### Adding Publications

**Option 1: JSON (Recommended)**
Edit `data/publications.json` and add your publications following the schema above.

**Option 2: BibTeX (Advanced)**
If you have a `publications.bib` file, you can add a build step to convert it to JSON automatically.

### Updating Personal Information

Edit `data/site.json` to update:
- Contact information
- Research interests  
- Bio/about section
- Social media links

### Adding News Items

Add entries to `data/news.json`:
```json
{
  "date": "YYYY-MM-DD",
  "text": "Your news item text here"
}
```

### Managing Conference Highlights

The Conference Highlights section displays a rotating carousel of your conference photos. To add/update photos:

**1. Image Requirements:**
- **Format**: JPG, PNG, or WebP recommended (SVG also supported)
- **Size**: 1200x800px ideal (16:10 aspect ratio)
- **File size**: < 1MB per image for optimal performance
- **Naming**: Use descriptive names like `icml2024-presentation.jpg`

**2. Adding Photos:**
- Place your images in the `img/conference/` directory
- Update the HTML in `index.html` in the Conference Highlights section
- Update the `<img src="">` paths to your new images
- Update the `alt` text with descriptive information
- Update the `<figcaption>` with event details

**3. Carousel Features:**
- **Autoplay**: 3.5-second intervals (respects `prefers-reduced-motion`)
- **Navigation**: Previous/next buttons and dot indicators
- **Touch/Swipe**: Full mobile swipe support
- **Keyboard**: Arrow keys, Home/End navigation
- **Accessibility**: Screen reader announcements and ARIA labels

**4. Example HTML Structure:**
```html
<figure class="carousel-slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
    <img src="img/conference/your-photo.jpg" 
         alt="Presenting research at Conference Name 2024"
         loading="lazy">
    <figcaption class="carousel-caption">
        Brief description of the conference moment
    </figcaption>
</figure>
```

**5. Accessibility Notes:**
- Always include descriptive `alt` text for images
- Keep captions concise and informative
- The carousel automatically pauses on hover/focus
- All navigation is keyboard accessible

### Updating Pages

The content pages (`pages/*.html`) can be edited directly:
- `talks.html` - Conference presentations
- `teaching.html` - Courses and mentoring
- `service.html` - Academic service
- `cv.html` - Detailed CV (also update the PDF in `files/cv.pdf`)

## 🎨 Customization

### Colors and Styling

Edit CSS variables in `css/styles.css`:
```css
:root {
  --primary-color: #2563eb;  /* Main accent color */
  --text-color: #1f2937;     /* Main text color */
  --bg-color: #ffffff;       /* Background color */
  /* ... more variables */
}
```

### Layout and Components

The site uses semantic HTML and CSS Grid/Flexbox for layouts. Key components:
- Navigation: `.nav` and `.nav-menu`
- Sections: `.section` and `.section-title`
- Publications: `.publication-item`
- Cards: `.card` class for content blocks

### Dark Mode

Dark mode is automatically handled by CSS variables and the theme toggle in `js/main.js`. The system respects user preferences and remembers manual selections.

## 🌐 Custom Domain Setup

### 1. Add CNAME File

Create a `CNAME` file in the root directory:
```
yourdomain.com
```

### 2. Configure DNS

Add these DNS records with your domain provider:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A  
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: yourusername.github.io
```

### 3. Enable HTTPS

In GitHub Settings → Pages → Custom domain:
1. Enter your domain
2. Check "Enforce HTTPS"

## 🔧 Development

### Local Development

1. Clone the repository
2. Start a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000`

### Performance Optimization

The site is already optimized for performance:
- Minified and compressed CSS/JS
- Optimized images
- Minimal HTTP requests
- Fast loading times (<2s)

To further optimize:
- Compress images with tools like [TinyPNG](https://tinypng.com/)
- Use WebP format for images
- Enable CDN if using custom domain

## 📊 Analytics (Optional)

### Google Analytics 4

Add to `<head>` of each HTML file:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Plausible Analytics

Add to `<head>` of each HTML file:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🧪 Testing

### Lighthouse Audit

Run Lighthouse audits to ensure:
- Performance ≥ 95
- Accessibility ≥ 95  
- Best Practices ≥ 95
- SEO ≥ 95

### Cross-Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Accessibility Testing

- Use screen readers (NVDA, JAWS, VoiceOver)
- Test keyboard navigation
- Check color contrast ratios
- Validate HTML markup

## 🆘 Troubleshooting

### Site Not Loading
1. Check GitHub Pages settings
2. Verify repository name matches `username.github.io`
3. Ensure `index.html` exists in root

### JavaScript Errors
1. Check browser console for errors
2. Verify JSON files are valid
3. Test data loading in Network tab

### Styling Issues
1. Check CSS file paths
2. Verify CSS syntax
3. Test responsive design in dev tools

### Build Failures
1. Check GitHub Actions logs
2. Verify workflow file syntax
3. Ensure all required files exist

## 📜 License

MIT License - feel free to use this template for your academic website.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- Open an issue for bugs or feature requests
- Check existing issues for solutions
- Contribute improvements via pull requests

---

**Built with ❤️ for the academic community**
