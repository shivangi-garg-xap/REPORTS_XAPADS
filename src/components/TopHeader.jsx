
import { Layout } from "antd";

import { NavDropdown, Nav, Navbar } from 'react-bootstrap';
import Logo from '../assets/XapadsLogo.svg'

const { Header, Content } = Layout;
export default function TopHeader () {
    return(
        <Header className="top-nav">
        <div className="nav-menu">
            <Navbar expand="lg" className="">
            <Navbar.Brand href="#home">
                <div className="logo">
                <img src={Logo} className="img-fluid" alt="" />
                </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <NavDropdown title="Reporting" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#">RTB Report</NavDropdown.Item>
                    <NavDropdown.Item href="#">ABC Report</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Fraud Reporting" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#">Something</NavDropdown.Item>
                </NavDropdown>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>
        </Header>
    )
}