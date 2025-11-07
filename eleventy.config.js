import htmlmin from "html-minifier-terser";
import { PurgeCSS } from "purgecss";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fontAwesomePlugin from "@11ty/font-awesome";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(fontAwesomePlugin);
  
  // Static assets passthrough
  eleventyConfig.addPassthroughCopy("src/assets");
  // Map images to top-level /img to match head.njk references
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "img" });

  eleventyConfig.addFilter("dateFormat", function(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  });

  // Shortcode to inline CSS files
  eleventyConfig.addShortcode("inlineCSS", function(filepath) {
    try {
      const absolutePath = path.resolve(__dirname, filepath);
      const cssContent = fs.readFileSync(absolutePath, "utf8");
      return cssContent;
    } catch (error) {
      console.error(`[inlineCSS] Error reading ${filepath}:`, error.message);
      return "";
    }
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });

  eleventyConfig.addCollection("publications", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/publications/*.md");
  });

  eleventyConfig.addCollection("people", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/people/*.md");
  });

  eleventyConfig.addCollection("courses", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/courses/*.md");
  });

  eleventyConfig.addCollection("featuredPublications", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/publications/*.md")
      .filter(item => item.data.featured === true);
  });

  // PurgeCSS transform - runs in production builds only
  eleventyConfig.addTransform("purgecss", async function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html") && process.env.ELEVENTY_RUN_MODE === "build") {
      try {
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
        let match;
        let processedContent = content;
        const replacements = [];

        // Build HTML without inline CSS for PurgeCSS analysis
        const htmlWithoutCss = content.replace(styleRegex, "");

        while ((match = styleRegex.exec(content)) !== null) {
          const originalCSS = match[1];
          if (originalCSS.length < 1000) continue; // Skip small style blocks

          console.log(`[purgecss] ${this.page.outputPath}: Purging ${originalCSS.length} bytes of CSS`);

          const purgeCSSResults = await new PurgeCSS().purge({
            content: [{ raw: htmlWithoutCss, extension: 'html' }],
            css: [{ raw: originalCSS }],
            defaultExtractor: content => content.match(/[\w-/:]+/g) || [],
            safelist: {
              standard: ['active', 'show', 'collapse', 'collapsing', 'fade', 'modal-backdrop'],
              deep: [/^navbar/, /^dropdown/, /^modal/, /^carousel/, /^btn/, /^alert/, /^fa-/, /^svg-/, /^col-/, /^row$/, /^g-/, /^m-/, /^p-/, /^text-/, /^bg-/, /^d-/, /^flex-/, /^align-/, /^justify-/],
              greedy: [/data-bs/]
            }
          });

          const purgedCSS = purgeCSSResults[0]?.css || originalCSS;
          console.log(`[purgecss] ${this.page.outputPath}: Purged to ${purgedCSS.length} bytes`);
          replacements.push({
            original: match[0],
            purged: `<style>${purgedCSS}</style>`
          });
        }

        for (const {original, purged} of replacements) {
          processedContent = processedContent.replace(original, purged);
        }

        return processedContent;
      } catch (error) {
        console.error(`[purgecss] Error:`, error.message);
        return content;
      }
    }
    return content;
  });

  // HTML minification transform
  eleventyConfig.addTransform("htmlmin", function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      try {
        const minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        });
        return minified;
      } catch (error) {
        console.error(`[htmlmin] Error minifying ${this.page.outputPath}:`, error.message);
        return content;
      }
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
