module.exports = {
    siteUrl: 'https://ssec.vercel.app',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 1,
    sitemapSize: 5000,

    transform: async (config, path) => {
        return {
          loc: path,
          changefreq: config.changefreq || 'daily',
          priority: config.priority || 1,
          lastmod: new Date().toISOString(),
        };
    },
};