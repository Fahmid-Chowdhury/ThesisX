
const GetStaticImage = (image, query) => {
    if (!image){
        return null
    }
    const apiDomain = import.meta.env.VITE_API_DOMAIN;
    return `${apiDomain}/api/public/image/${image}${query}`;
};
const GetStaticPreview = (image, query) => {
    if (!image){
        return null
    }
    const apiDomain = import.meta.env.VITE_API_DOMAIN;
    return `${apiDomain}/api/public/preview/${image}${query}`;
};


export { GetStaticImage, GetStaticPreview };