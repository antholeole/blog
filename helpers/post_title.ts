export const postTitle = (titleSlug: string, metaTitle?: string) => {
    return metaTitle ?? titleSlug.replaceAll('-', ' ')
}