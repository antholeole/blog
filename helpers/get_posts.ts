import { readdirSync, readFileSync, } from 'fs'
import path, { join } from 'path'
import { IMeta } from './types'

export const categoriesPath = path.join(process.cwd(), 'blog')

export const getBlogCategories = () => {
    return readdirSync(categoriesPath).filter((fileName) => !fileName.endsWith('.md'))
}

export const getPosts = (): {
    slug: string,
    category: string,
    meta: IMeta
}[] => {
    return getBlogCategories()
        .map((category) => getCategoriesPosts(category).map((postTitle) => ({
            slug: postTitle,
            category,
            meta: JSON.parse(readFileSync(join(process.cwd(), 'blog', category, postTitle, 'meta.json')).toString()),
        })))
        .reduce((posts, categoryPosts) => posts.concat(categoryPosts), [])
}

export const getCategoriesPosts = (category: string): string[] => {
    return readdirSync(path.join(categoriesPath, category))
        .filter((fileName) => !fileName.endsWith('.md'))
}
