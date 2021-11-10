import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import Link from 'next/link'

export const Header = () => {
    return (
        <Navbar bg="light" variant="light" expand="sm" sticky="top" className="shadow-sm" >
            <Container >
                <Navbar.Brand href="#home">
                    <img src="/memojis/clouds.png" alt="A emoji of Anthony" width="50" height="50" />
                    Anthony&apos;s Blog
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Link href="/" passHref>
                            <Nav.Link>Home</Nav.Link>
                        </Link>
                        <Link href="/blog" passHref>
                            <Nav.Link>Blog</Nav.Link>
                        </Link>
                    </Nav>
                    <Nav>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

