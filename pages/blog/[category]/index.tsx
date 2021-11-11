import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { Layout } from '../../../components/layout/layout'
import { getBlogCategories, getCategoriesPosts } from '../../../helpers/get_posts'
import { capitalizeWords } from '../../../helpers/capitalize_words'
import Link from 'next/link'
import { IMeta } from '../../../helpers/types'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Breadcrumb } from 'react-bootstrap'


export default function CategoryList({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
    const category = useRouter().query.category as string

    return <Layout>
        <Breadcrumb>
        <Link href="/blog" passHref>
          <Breadcrumb.Item href="#">Blog</Breadcrumb.Item>
        </Link>
        <Link href={`/blog/${category}`} passHref>
          <Breadcrumb.Item href="#">{capitalizeWords(category)}</Breadcrumb.Item>
        </Link>
        </Breadcrumb>
        <h2>{capitalizeWords(category)}</h2>
        {posts.map((post) => (
        <div key={post.slug} className="py-3">
        <Link href={`/blog/${category}/${post.slug}`} passHref>
            <a className="link-primary d-block">{post.meta.title ?? post.slug}</a>
        </Link>
        {post.meta.date && <small className="text-muted">{post.meta.date}</small>}
        </div>))}
    </Layout>
}

export const getStaticProps: GetStaticProps<{ posts: { slug: string, meta: IMeta }[] }> = async (context) => {
    const category = context.params!.category as string

    return {
        props: {
            posts: getCategoriesPosts(category).map((postTitle) => ({
                slug: postTitle,
                meta: JSON.parse(readFileSync(join(process.cwd(), 'public/blog', category, postTitle, 'meta.json')).toString()),
            }))
        }
    }
}


export const getStaticPaths: GetStaticPaths = () => {
    const categories = getBlogCategories().map((category) => ({
        params: {
            category
        }
    }))

    return {
        paths: categories,
        fallback: false
    }
}
