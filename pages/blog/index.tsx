import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import path from 'path'
import React from 'react'
import { Layout } from '../../components/layout/layout'
import { getBlogCategories, categoriesPath } from '../../helpers/get_posts'
import { readFileSync, readdirSync } from 'fs'
import { Badge, Button, Card } from 'react-bootstrap'
import { capitalizeWords } from '../../helpers/capitalize_words'
import ReactMarkdown from 'react-markdown'

const Home = ({ categories }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout>
            <h3>Welcome to the Blog!</h3>
            <h4>Blog Categories:</h4>
            <div className="multi-column">
                {categories.map((v) => {
                    const name = capitalizeWords(v.name.replace(/-/g, ' '))

                    return <>
                    <Card className="mb-3 d-inline-flex w-100" key={v.name}>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                {name}
                                <Badge bg="secondary">
                                        <span className="font-weight-normal">
                                            {v.size}
                                        </span>
                                </Badge>
                            </Card.Title>
                            <Card.Text as="article">
                                <ReactMarkdown>{v.summary}</ReactMarkdown>
                            </Card.Text>
                            <Link href={`/blog/${v.name}`} passHref>
                            <Button variant="primary">{`read about ${name}`}</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </>})
                }
            </div>
        </Layout>
    )
}

export default Home

export const getStaticProps: GetStaticProps<{
    categories: {
        name: string;
        summary: string;
        size: number;
    }[]
}> = async () => {
    const categories = getBlogCategories()
        .map((category) => ({
            name: category,
            size: readdirSync(path.join(categoriesPath, category)).length - 1,
            summary: readFileSync(
                path.join(categoriesPath, category, 'summary.md')
            ).toString()
        }))


    return {
        props: {
            categories
        },
    }
}
