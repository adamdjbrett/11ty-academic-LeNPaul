export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({"src/assets/favicon.ico": "favicon.ico"});
  eleventyConfig.addPassthroughCopy({"src/assets/apple-icon-152x152.png": "apple-icon-152x152.png"});

  eleventyConfig.addFilter("dateFormat", function(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
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
