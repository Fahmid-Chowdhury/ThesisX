
const GetStaticImage = (image, query) => {
    if (!image){
        return null
    }
    const apiDomain = import.meta.env.VITE_API_DOMAIN;
    return `${apiDomain}/api/public/image/${image}${query}`;
};


export { GetStaticImage };