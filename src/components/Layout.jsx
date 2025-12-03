import React from "react";
import Logo from '../assets/XapadsLogo.svg'
import GenerateReportIcon from '../assets/generate_report_icon.svg'
import { Flex, Layout, Table, Select, Tag, Col, DatePicker, Button, Pagination } from "antd";
import { NavDropdown, Nav, Navbar } from 'react-bootstrap';


const { Header, Content } = Layout;

export default function ReportsLayout() {

  const handleChange = value => {
    console.log(`selected ${value}`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <Flex gap="small" align="center" wrap>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </Flex>
      ),
    },

  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];


  return (
    <div className="reports-layout">
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

      <div className="content-wrapper">

        <div className="heading_filter">
          <h2>RTB Report</h2>
          <div className="filters">
            <DatePicker placeholder="Select Date" prefix={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="me-2" viewBox="0 0 16 16" fill="none">
                <path d="M10.6667 1.33334V4.00001M5.33333 1.33334V4.00001M2 6.66668H14M3.33333 2.66668H12.6667C13.403 2.66668 14 3.26363 14 4.00001V13.3333C14 14.0697 13.403 14.6667 12.6667 14.6667H3.33333C2.59695 14.6667 2 14.0697 2 13.3333V4.00001C2 3.26363 2.59695 2.66668 3.33333 2.66668Z" stroke="#5052C9" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            }
              suffixIcon={null}
            />
            <span className="divider"></span>
            <Button type="primary" className="">
              Get Report
            </Button>
          </div>
        </div>

        <div className="view_data_div">
          {/* <div className="empty-state">
            <img src={GenerateReportIcon} alt="empty" className="img-fluid" />
            <h3>Generate a Report</h3>
            <p>Please select "Date" from above to <br /> generate the report.</p>
          </div> */}
          <div className="tableFixHead">
            <div className="table_design custom_data_table">
              <Table columns={columns} dataSource={data} pagination={false} />
              <div className="d-flex align-items-center justify-content-between custom_pagination_design_cls">
                <Col span={12}>
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="dropdown_select_pagination">
                      <Select
                        defaultValue="10"
                        onChange={handleChange}
                        // open={true}
                        options={[
                          { value: '10', label: '10' },
                          { value: '20', label: '20' },
                          { value: '30', label: '30' },
                          { value: '40', label: '40' },
                        ]}
                        suffixIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        }
                      />
                      <p> 197 records</p>
                    </div>
                    <div>
                      <p><strong>1-10</strong> of 197 records</p>
                    </div>
                  </div>
                </Col>
                <Col span={12}>

                  <div className="new_custom_pagination_design">
                    <Pagination
                      defaultCurrent={6}
                      total={500}
                      className="custom_pagination"
                      showSizeChanger={false}
                      itemRender={(page, type, originalElement) => {
                        if (type === "prev") {
                          return <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                              <path d="M4.64844 0.649902L0.648437 4.6499L4.64844 8.6499" stroke="#514F6E" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </a>;
                        }
                        if (type === "next") {
                          return <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6 12L10 8L6 4" stroke="#514F6E" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </a>;
                        }
                        return originalElement;
                      }}
                    />
                  </div>
                </Col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
