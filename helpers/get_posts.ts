import { readdirSync,  } from 'fs'
import path from 'path'

export const categoriesPath = path.join(process.cwd(), 'public/blog')

export const getBlogCategories = () => {
    return readdirSync(categoriesPath).filter((fileName) => !fileName.endsWith('.md'))
}

export const getCategoriesPosts = (category: string): string[] => {
    return readdirSync(path.join(categoriesPath, category))
        .filter((fileName) => !fileName.endsWith('.md'))
}