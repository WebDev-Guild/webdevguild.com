import rss from "@astrojs/rss";

const postImportResult = import.meta.globEager("./blog/**/*.md");
const posts = Object.entries(postImportResult)
  .filter(([, post]) => post.frontmatter.draft !== true)
  .map(
    ([key, value]) =>
      ({
        ...value,
        slug: key.replace("./blog/", "/blog/").replace(".md", ""),
      } as {
        [key: string]: any;
      })
  );
export const get = () => {
  console.log(posts);

  return rss({
    // `<title>` field in output xml
    title: "WebDev Guild",
    // `<description>` field in output xml
    description: "Helping you find success as a web developer.",
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,
    stylesheet: "/assets/rss/styles.xsl",
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts.map((post) => ({
      link: post.slug,
      title: post.frontmatter.title,
      pubDate: new Date(post.frontmatter.publishDate),
      description: post.frontmatter.description,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
};
