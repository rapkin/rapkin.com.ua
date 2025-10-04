# Agent Guide for rapkin.com.ua Blog

This guide helps AI coding assistants understand and work with this static blog repository.

## Repository Overview

This is a **static blog** built with:
- **Cuttlebelle** - Static site generator using React components
- **React** - For templating (JSX components compile to static HTML)
- **SCSS** - Styling with Dart Sass (modern replacement for node-sass)
- **Rollup** - JavaScript bundler
- **Sharp/Imagemin** - Image optimization
- **Docker** - For deployment
- **gh-pages** - Deployment to GitHub Pages

**Live Site**: rapkin.com.ua  
**Owner**: Mikola Parfenyuck (@rapkin)  
**Language**: Mixed (Ukrainian & English articles)

## Project Structure

```
rapkin.com.ua/
├── content/               # Blog posts and pages (Markdown + YAML)
│   ├── index/            # Homepage content
│   ├── about/            # About page
│   ├── resume/           # Resume page
│   ├── python/           # Python-related articles
│   ├── coffee/           # CoffeeScript articles
│   └── neural-networks/  # ML articles
│
├── code/                 # React components (templates)
│   ├── page.js          # Main page layout wrapper
│   ├── partial.js       # Reusable components
│   ├── layouts/         # Content layout components
│   │   ├── home.js      # Homepage layout (lists posts)
│   │   └── post.js      # Article layout
│   └── utils/           # Helper functions
│       ├── get-image-path.js
│       ├── icon.js
│       └── syntax-hl.js
│
├── assets/              # Static assets
│   ├── css/            # Compiled CSS (from SCSS)
│   ├── js/             # Compiled JS bundle
│   ├── img/            # Original images
│   ├── optimized-img/  # Processed images
│   └── fonts/          # Web fonts
│
├── sass/               # SCSS source files
├── src/                # JavaScript source (for Rollup)
├── root/               # Static files (favicon, robots.txt, etc.)
├── site/               # Generated static site (build output)
│
└── Build scripts:
    ├── markdown.js      # Custom Markdown renderer
    ├── optimize-images.js
    ├── deploy.js
    └── rollup.config.js
```

## Content Structure

### Creating New Articles

Each article/page consists of:
1. A **folder** in `content/` (e.g., `content/python/my-article/`)
2. An **index.yml** with metadata
3. A **body.md** with Markdown content

**Example index.yml**:
```yaml
title: "🇺🇦 Article Title"
image: /assets/img/article-image.png
date: 2019-10-03 21:42:13
description: Short description for SEO and preview
main: body.md
layout: layouts/post  # Optional, defaults to 'post'
```

**Example body.md**:
```markdown
---
layout: layouts/post
---

![Article main image](/assets/img/image.jpg)

Introduction paragraph explaining what we're going to do...

## What do we need?

- **Tool 1** - Description
- **Tool 2** - Description

## Step by step approach

Detailed explanation...

\`\`\`python
def example_function():
    # Code example
    pass
\`\`\`

## Conclusion

Summary of what we learned...
```

### Content Types

1. **Blog Posts** - Use `layout: layouts/post` (or omit, it's default)
   - Show in homepage feed
   - Sorted by date (newest first)
   - Display with preview image and description

2. **Static Pages** - Like about/resume
   - Don't appear in post feed
   - Use different layouts or no layout specified

## Build System

### Key Build Commands

```bash
# Development watch mode
npm start              # Watches all files and rebuilds

# Full production build
npm run build         # Complete build pipeline

# Individual build steps
npm run build:clear   # Clear site/ directory
npm run build:sass    # Compile SCSS → CSS
npm run build:js      # Bundle JS with Rollup
npm run build:images  # Optimize images
npm run build:static  # Copy root/ files
npm run build:site    # Generate HTML with Cuttlebelle

# Deploy to GitHub Pages
npm run deploy        # Build + push to rapkin.github.io
```

### Build Pipeline

1. **SCSS Compilation** (`sass/` → `assets/css/`)
   - Compiles `sass/site.scss` 
   - Includes fonts, global styles, syntax highlighting
   - Output: compressed CSS

2. **JavaScript Bundling** (`src/` → `assets/js/bundle.js`)
   - Rollup bundles `src/index.js`
   - Includes Swup (page transitions), LazyLoad, Google Analytics
   - Output: minified IIFE bundle

3. **Image Optimization** (`assets/img/` → `assets/optimized-img/`)
   - Creates optimized versions (max 960px width)
   - Creates preview thumbnails (200x200)
   - Uses Sharp for resizing + Imagemin for compression
   - Skips already processed images

4. **Static Site Generation** (Cuttlebelle)
   - Reads `content/` folders
   - Renders React components to static HTML
   - Uses custom Markdown renderer (`markdown.js`)
   - Outputs to `site/` directory

## Custom Markdown Renderer

Location: `markdown.js`

**Image handling**:
- Calculates image dimensions for proper aspect ratio
- Uses lazy loading with `data-bg` attribute
- Creates clickable full-image links
- Path transformed by `get-image-path.js` (uses optimized versions)

**Link handling**:
- External links: Opens in new tab with `target="_blank"`
- Internal links: Regular navigation

## React Components

### Page Layout (`code/page.js`)

Main wrapper with:
- SEO meta tags (Open Graph, Twitter Cards, Schema.org)
- Header with logo and navigation
- Footer with social links
- Google Analytics integration
- Font preloading

**Props**:
- `title` - Page title
- `description` - Meta description
- `image` - Social media preview image
- `date` - Publication date (for articles)
- `main` - Page content (from layout component)

### Layouts

**Home Layout** (`code/layouts/home.js`):
- Lists all posts with `layout: layouts/post`
- Sorted by date (newest first)
- Shows preview image, title, date, description

**Post Layout** (`code/layouts/post.js`):
- Displays article title as h1
- Renders markdown body
- Adds "Thank you for attention!" footer

## Images

### Image Workflow

1. Add original image to `assets/img/`
2. Run `npm run build:images` (or part of full build)
3. Generates:
   - `assets/optimized-img/[filename]` - Optimized version
   - `assets/optimized-img/preview_[filename]` - Thumbnail

### Image References

In Markdown:
```markdown
![Alt text](/assets/img/image.png)
```

The custom renderer automatically:
- Uses optimized version for display
- Creates lazy-loading container
- Maintains aspect ratio
- Links to original image

## Deployment

### Local Development

```bash
npm start              # Watch mode with auto-rebuild
```

Then manually start a local server or use Docker:

```bash
docker-compose up      # Runs nginx with built site
```

### Production Deployment

```bash
npm run deploy
```

This:
1. Runs full build (`npm run build`)
2. Pushes `site/` directory to `rapkin.github.io` repository (master branch)
3. GitHub Pages serves the site

**Alternative**: Use `update.sh` for Docker deployment
```bash
./update.sh            # Pull, build Docker, restart
```

## Common Tasks for AI Assistants

### Adding a New Blog Post

1. Create folder: `content/category/post-slug/`
2. Create `index.yml`:
   ```yaml
   title: "Post Title"
   image: /assets/img/post-image.png
   date: 2025-10-04 12:00:00
   description: Brief description
   main: body.md
   ```
3. Create `body.md` with content
4. If new images: add to `assets/img/`
5. Run `npm run build` to generate site

### Modifying Styles

1. Edit SCSS files in `sass/` directory
2. Run `npm run build:sass` to compile
3. Changes appear in `assets/css/site.css`

### Updating Page Layout/Template

1. Edit React components in `code/`
   - `code/page.js` - Main layout
   - `code/layouts/*.js` - Content layouts
2. Run `npm run build:site` to regenerate HTML

### Adding New JavaScript Features

1. Edit files in `src/` directory
2. Run `npm run build:js` to bundle
3. Output goes to `assets/js/bundle.js`

### Example: Creating a New Blog Post

Here's a complete workflow example:

```bash
# 1. Create post directory
mkdir -p content/python/my-new-article

# 2. Create index.yml
cat > content/python/my-new-article/index.yml << EOF
title: "How to do something awesome with Python"
image: /assets/img/my-article-image.png
date: 2025-10-04 15:30:00
description: A comprehensive guide to doing something awesome using Python and related libraries
main: body.md
EOF

# 3. Create body.md
cat > content/python/my-new-article/body.md << EOF
---
layout: layouts/post
---

![Article main image](/assets/img/my-article-image.png)

Introduction paragraph explaining what we're going to do...

## What do we need?

- **Python** - for scripting
- **Some Library** - for specific functionality

## Step by step approach

Detailed explanation...

\`\`\`python
def example_function():
    # Code example
    pass
\`\`\`

## Conclusion

Summary of what we learned...
EOF

# 4. Add image to assets
cp ~/Downloads/my-article-image.png assets/img/

# 5. Build and test
npm run build:images  # Optimize the new image
npm run build:site    # Generate HTML
# Test locally before deploying
```

### Troubleshooting

**Images not showing**:
- Ensure `npm run build:images` was run
- Check path starts with `/assets/img/`
- Verify file exists in `assets/img/`

**Styles not updating**:
- Rebuild SCSS: `npm run build:sass`
- Clear browser cache
- Check `sass/site.scss` imports all needed files

**Post not appearing on homepage**:
- Verify `layout: layouts/post` in `index.yml`
- Check date format is correct
- Ensure `index.yml` has all required fields

**Build fails**:
- Run `npm install --legacy-peer-deps` to ensure dependencies
- Project works with Node.js v22+ (uses modern Dart Sass)
- Look for syntax errors in JSX components
- If you see peer dependency errors, use `--legacy-peer-deps` flag

## Technical Details

### Dependencies

**Core Tools**:
- `cuttlebelle` - Static site generator
- `sass` (Dart Sass) - Modern SCSS compiler (replaced deprecated node-sass)
- `rollup` - Module bundler
- `sharp` - Image processing
- `imagemin` - Image compression

**Frontend Libraries** (bundled):
- `swup` - Page transitions
- `vanilla-lazyload` - Lazy image loading
- `highlight.js` - Syntax highlighting

### Configuration Files

- `package.json` - Scripts and dependencies
- `rollup.config.js` - JavaScript bundling config
- `markdown.js` - Custom Markdown renderer
- `docker-compose.yml` - Local Docker setup
- `Dockerfile` - Production Docker image
- `nginx.conf` - Nginx web server config

### Cuttlebelle Integration

Cuttlebelle is configured via `package.json`:
```json
"cuttlebelle": {
  "site": {
    "markdownRenderer": "markdown.js"
  }
}
```

It automatically:
- Discovers content in `content/` folders
- Renders React components to HTML
- Handles routing based on folder structure
- Processes Markdown with custom renderer

## Best Practices

1. **Always run full build before deploy**: `npm run build`
2. **Optimize images**: Don't commit huge unoptimized images
3. **Use emoji in titles**: The blog style embraces emoji 🎨
4. **Date format**: `YYYY-MM-DD HH:MM:SS` in index.yml
5. **Image paths**: Always absolute from root `/assets/img/...`
6. **Alt text**: Provide meaningful alt text for images
7. **Links**: External links automatically get `target="_blank"`

## Writing Style & Content Guidelines

Based on existing content analysis, here are the author's preferences:

### Content Style
- **Bilingual**: Ukrainian posts marked with 🇺🇦 emoji in title, English posts without
- **Technical depth**: Long-form, comprehensive tutorials with step-by-step explanations
- **Code-heavy**: Lots of code examples with proper language tags
- **Visual**: Uses images throughout articles to illustrate concepts
- **Professional but approachable**: Formal technical writing mixed with personality
- **Humor**: Embraces memes and philosophical humor (see about page)

### Article Structure
- Clear heading hierarchy (##, ###)
- Introduction explaining the problem/goal
- "What do we need?" or "What we want to achieve?" sections
- Step-by-step algorithm/approach explanation
- Detailed code snippets with explanations
- Visual examples (images, diagrams)
- Conclusions/summary at the end

### Code Style
**Python**:
- snake_case for variables and functions
- Descriptive variable names (e.g., `water_zones_in_city`, not `wz`)
- Comments in code when logic is complex
- Type hints appreciated but not always required
- Functional programming patterns where appropriate

**JavaScript/TypeScript/React**:
- camelCase for variables and functions
- Modern ES6+ syntax
- Functional components (not class components)
- React hooks patterns (React Query for data fetching)
- Clean, readable code with minimal nesting
- Meaningful variable names
- TypeScript for type safety
- Modern UI libraries: Radix UI primitives, Tailwind CSS for styling

### Technical Preferences
- **Focus areas**: Full-stack development (React/TypeScript, Node.js), Python, GIS/mapping, Neural Networks, OpenStreetMap, AI integration
- **Backend expertise**: Prisma schema design, PostgreSQL, complex relational databases, API architecture, authentication (Ory)
- **Frontend expertise**: React, Radix UI, Tailwind CSS, React Query, TypeScript
- **DevOps & Infrastructure**: Docker, Google Cloud Platform (GCP), Cloud Run, SOC 2 compliance
- **AI/ML**: Document/ticket data extraction, AI integration in production systems, neural networks
- **No unnecessary complexity**: Practical, working solutions over clever tricks
- **Open source friendly**: Credits libraries, links to documentation
- **Real-world examples**: Prefers actual use cases over toy examples

### Content Categories
- **python/**: GIS, data processing, Python libraries
- **coffee/**: CoffeeScript projects (historical)
- **neural-networks/**: ML/AI topics, training techniques, AI integration
- **ai/**: AI-assisted development, LLM usage, development workflow with AI
- Potential new categories: full-stack development, DevOps/cloud infrastructure, database architecture
- Consider creating new categories if topic doesn't fit existing ones

### Metadata Standards
- **Date format**: `YYYY-MM-DD HH:MM:SS`
- **Titles**: Descriptive and specific, emoji for Ukrainian posts
- **Descriptions**: Concise (1-2 sentences), informative, SEO-friendly
- **Images**: Always provide descriptive alt text, use preview images
- **Layout**: `layouts/post` for blog posts (or omit, it's default)

## Questions to Ask User

When working on this blog, you might need to ask:

- "Which category should this post go in?" (python/coffee/neural-networks/etc.)
- "Do you have an image for the post preview?"
- "Should this be in English or Ukrainian?"
- "What date should I use for the post?" (default to current date/time)
- "Should I run the build command, or just create the files?"

## Common User Workflows in Cursor

When user says:
- **"Add a new post about X"** → Create content folder with index.yml and body.md, matching existing style
- **"Update the about page"** → Edit content/about/body.md
- **"Change the header"** → Edit code/page.js
- **"Fix the styling"** → Edit sass/ files
- **"Build the site"** → Run npm run build
- **"Deploy"** → Run npm run deploy
- **"Translate article"** → Create Ukrainian version with 🇺🇦 in title

## Author Profile

**Mikola Parfenyuck (@rapkin)**
- **Location**: Lviv, Ukraine
- **Experience**: 10+ years in software development
- **Current Role**: Full-Stack Developer at Livegistics (3+ years)
- **Education**: Ph.D. candidate in Computer Science (2020-2024)
- **Expertise**:
  - Full-stack development (React, TypeScript, Node.js)
  - Backend architecture & complex database design (Prisma, PostgreSQL)
  - Cloud infrastructure (GCP, Docker, Cloud Run)
  - Security & compliance (SOC 2, Ory authentication)
  - AI integration (document/ticket data extraction in logistics)
  - Frontend: Radix UI, Tailwind CSS, React Query
  - Data science: GIS, neural networks, OpenStreetMap
- **Languages**: Ukrainian (native), English (C2 level)
- **Personality**: Detail-oriented, thorough, values clean code and automation
- **Open Source**: osm2geojson, gulp-bootstrap-configurator, Stand For Ukraine
- **Passions**: Geospatial data analysis, neural networks, philosophy, and creating memes

## Notes

- Site is bilingual (Ukrainian + English)
- Author embraces humor and philosophy in content
- Uses custom fonts: Literata (serif) and Inconsolata (mono)
- Supports syntax highlighting for code blocks
- Has Google Analytics integration
- Deploys to separate repo: rapkin.github.io
- Content is 5+ years old but reflects consistent style and quality standards
