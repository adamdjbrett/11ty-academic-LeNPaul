# Academic Theme for Eleventy

An Eleventy 3.1.2 theme designed for academic websites, converted from the [Jekyll Academic theme by Paul Le](https://github.com/LeNPaul/academic).

## Features

- Showcase research interests and publications
- Display research group members
- List courses taught
- Present curriculum vitae
- Provide contact information
- Blog updates section

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

The site will be available at `http://localhost:8080`

## Build

```bash
npm run build
```

The built site will be in the `_site` directory.

## Structure

- `src/` - Source files
  - `_layouts/` - Layout templates (Nunjucks)
  - `_includes/` - Reusable partials
  - `_data/` - Global data files (ESM modules)
  - `posts/` - Blog posts
  - `publications/` - Publication pages
  - `people/` - Team member pages
  - `courses/` - Course pages
  - `assets/` - Static assets (CSS, images, libraries)

## Customization

### Site Settings

Edit `src/_data/site.js` to change site title and description.

### Menu

Edit `src/_data/menu.js` to customize navigation.

### People

Edit `src/_data/people.js` and create corresponding markdown files in `src/people/`.

### Publications

Edit `src/_data/publicationsData.js` and create corresponding markdown files in `src/publications/`.

### Courses

Edit `src/_data/coursesData.js` and create corresponding markdown files in `src/courses/`.

### Social Links

Edit `src/_data/social.js` to update social media links in the footer.

### Images

Replace placeholder images in `src/assets/img/`:
- `home.jpg` - Home page image
- `primary-investigator.jpg` - Primary investigator photo
- `lab-technician.jpg` - Lab technician photo
- `graduate-student.jpg` - Graduate student photo

## License

MIT License

## Credits

Original Jekyll theme by [Paul Le](https://github.com/LeNPaul/academic)

Converted to Eleventy with ESM by this project.
