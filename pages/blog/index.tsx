import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import path from 'path'
import React from 'react'
import { Layout } from '../../components/layout/layout'
import { getBlogCategories, categoriesPath } from '../../helpers/get_posts'
import { readFileSync } from 'fs'
import { Button, Card } from 'react-bootstrap'
import { capitalizeWords } from '../../helpers/capitalize_words'
import ReactMarkdown from 'react-markdown'

const Home = ({ categories }: InferGetStaticPropsType<typeof getStaticProps>) => {


    return (
        <Layout>
            <h3>Welcome to the Blog!</h3>
            <p>
                I hope you find something interesting :)
            </p>
            <h4>Blog Categories:</h4>
                {categories.map((v) => (<>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{capitalizeWords(v.name)}</Card.Title>
                            <Card.Text>
                                <ReactMarkdown>{v.summary}</ReactMarkdown>  
                            </Card.Text>
                            <Link href={`/blog/${v.name}`} passHref>
                            <Button variant="primary">{`read about ${v.name}`}</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </>))}   
        </Layout>
    )
}

export default Home

export const getStaticProps: GetStaticProps<{
    categories: {
        name: string;
        summary: string;
    }[]
}> = async () => {
    const categories = getBlogCategories()
        .map((category) => ({
            name: category,
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
