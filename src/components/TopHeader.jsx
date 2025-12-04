
import { Layout } from "antd";

import { NavDropdown, Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Logo from '../assets/XapadsLogo.svg'

const { Header, Content } = Layout;
export default function TopHeader () {
     console.log("🔄 TopHeader rendered");
    return(
        <Header className="top-nav">
        <div className="nav-menu">
            <Navbar expand="lg" className="">
            <Navbar.Brand as={Link} to="/">
                <div className="logo">
                <img src={Logo} className="img-fluid" alt="" />
                </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <NavDropdown title="Reporting" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/rtb-report">RTB Report</NavDropdown.Item>
                    <NavDropdown.Item href="#">ABC Report</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Fraud Reporting" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/fraud-report">Report</NavDropdown.Item>
                    <NavDropdown.Item href="#">Something</NavDropdown.Item>
                </NavDropdown>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>
        </Header>
    )
}