export type Image = {
    src: string;
    alt?: string;
};

export type Link = {
    href: string;
    text: string;
};

export type SocialLink = Link & {
    icon: 'codepen' | 'dev' | 'facebook' | 'github' | 'instagram' | 'linkedin' | 'medium' | 'x-twitter';
};

export type Hero = {
    title?: string;
    text?: string;
    avatar?: Image;
    backgroundImage?: Image;
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    description: string;
    image?: Image;
    primaryNavLinks?: Link[];
    secondaryNavLinks?: Link[];
    socialLinks?: SocialLink[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
};

const siteConfig: SiteConfig = {
    logo: {
        src: '/logo.svg',
        alt: 'Web Dev Guild logo'
    },
    title: 'Web Dev Guild',
    description: 'Helping you find success in web development.',
    image: {
        src: '/social.png',
        alt: 'Web Dev Guild - Helping you find success in web development.'
    },

    socialLinks: [
        {
            text: 'Go to GitHub repo',
            href: 'https://github.com/webdev-guild/',
            icon: 'github'
        },

        {
            text: 'Follow on X',
            href: 'https://twitter.com/webdevguild',
            icon: 'x-twitter'
        }
    ],
    postsPerPage: 15
};

export default siteConfig;
