import React, { useState, useRef, useEffect } from "react";
import Logo from '../assets/XapadsLogo.svg'
import GenerateReportIcon from '../assets/generate_report_icon.svg'
import { Flex, Layout, Table, Select, Tag, Col, DatePicker, Button, Pagination, Tooltip, Checkbox } from "antd";
import { NavDropdown, Nav, Navbar } from 'react-bootstrap';


const { Header, Content } = Layout;
const { Option } = Select;


export default function FraudAnalyticsReport() {

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

    const [open, setOpen] = useState(false);

    // For custom tag input
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");

    // For multi select — store selected values
    const [multiValues, setMultiValues] = useState([]);

    const wrapperRef = useRef(null);

    // Outside click close dropdown but do not clear selects
    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current?.contains(e.target)) return;

            // Don't close when clicking Ant Select dropdown
            if (document.querySelector(".my_custom_SelectPopup")?.contains(e.target))
                return;

            setOpen(false);
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Add tag using Enter key
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    // Remove tag
    const removeTag = (index) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const [selectedValues, setSelectedValues] = useState([]);
    const optionsss = [
        { value: "Campaign ID", label: "Campaign ID" },
        { value: "Date", label: "Date" },
        { value: "Publisher ID", label: "Publisher ID" },
        { value: "P1", label: "P1" },
        { value: "P2", label: "P2" },
        { value: "P3", label: "P3" },
        { value: "P4", label: "P4" },
        { value: "Source", label: "Source" },
    ];
    const handleChangecheckbox = (values) => {
        setSelectedValues(values);
    };
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
                    <h2>Fraud Analytics Report</h2>
                    <div className="filters">
                        <DatePicker placeholder="Select Date" prefix={
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="me-2" viewBox="0 0 16 16" fill="none">
                                <path d="M10.6667 1.33334V4.00001M5.33333 1.33334V4.00001M2 6.66668H14M3.33333 2.66668H12.6667C13.403 2.66668 14 3.26363 14 4.00001V13.3333C14 14.0697 13.403 14.6667 12.6667 14.6667H3.33333C2.59695 14.6667 2 14.0697 2 13.3333V4.00001C2 3.26363 2.59695 2.66668 3.33333 2.66668Z" stroke="#5052C9" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        }
                            suffixIcon={null}
                        />
                        <span className="divider"></span>

                        <div className="custom_wrapper" ref={wrapperRef}>
                            <button className="trigger_btn" onClick={() => setOpen(!open)}>
                                Filters
                                <div className="count_filter_value">2</div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </button>
                            {open && (
                                <div className="dropdown_panel">

                                    <div className="field_block">
                                        <label className="field_label">Campaign ID</label>
                                        <Select
                                            mode="multiple"
                                            className="w-100"
                                            placeholder="Select items"
                                            dropdownClassName="my_custom_SelectPopup"
                                            value={multiValues}
                                            onChange={(val) => setMultiValues(val)}
                                            onDropdownVisibleChange={() => setOpen(true)}
                                            suffixIcon={
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            }
                                        >
                                            <Option value="one">Option 1</Option>
                                            <Option value="two">Option 2</Option>
                                            <Option value="three">Option 3</Option>
                                        </Select>
                                    </div>

                                    <div className="field_block">
                                        <label className="field_label">Publisher ID</label>
                                        <Select
                                            mode="multiple"
                                            className="w-100"
                                            placeholder="Select items"
                                            dropdownClassName="my_custom_SelectPopup"
                                            value={multiValues}
                                            onChange={(val) => setMultiValues(val)}
                                            onDropdownVisibleChange={() => setOpen(true)}
                                            suffixIcon={
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            }
                                        >
                                            {Array.from({ length: 50 }, (_, i) => (
                                                <Option key={i + 1} value={`option-${i + 1}`}>
                                                    Option {i + 1}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="field_block">
                                        <label className="field_label">P1</label>
                                        <div className="tags_input_box">
                                            {tags.map((tag, i) => (
                                                <span className="tag_item" key={i}>
                                                    {tag}
                                                    <span className="remove_tag" onClick={() => removeTag(i)}>
                                                        <svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
                                                    </span>
                                                </span>
                                            ))}
                                            <input type="text" className="tag_input" value={inputValue} placeholder="Type & press Enter" onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                                        </div>
                                    </div>

                                    <div className="field_block">
                                        <label className="field_label">P2</label>
                                        <div className="tags_input_box">
                                            {tags.map((tag, i) => (
                                                <span className="tag_item" key={i}>
                                                    {tag}
                                                    <span className="remove_tag" onClick={() => removeTag(i)}>
                                                        <svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
                                                    </span>
                                                </span>
                                            ))}
                                            <input type="text" className="tag_input" value={inputValue} placeholder="Type & press Enter" onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                                        </div>
                                    </div>

                                    <div className="field_block">
                                        <label className="field_label">P3</label>
                                        <div className="tags_input_box">
                                            {tags.map((tag, i) => (
                                                <span className="tag_item" key={i}>
                                                    {tag}
                                                    <span className="remove_tag" onClick={() => removeTag(i)}>
                                                        <svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
                                                    </span>
                                                </span>
                                            ))}
                                            <input type="text" className="tag_input" value={inputValue} placeholder="Type & press Enter" onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                                        </div>
                                    </div>

                                    <div className="field_block">
                                        <label className="field_label">P4</label>
                                        <div className="tags_input_box">
                                            {tags.map((tag, i) => (
                                                <span className="tag_item" key={i}>
                                                    {tag}
                                                    <span className="remove_tag" onClick={() => removeTag(i)}>
                                                        <svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
                                                    </span>
                                                </span>
                                            ))}
                                            <input type="text" className="tag_input" value={inputValue} placeholder="Type & press Enter" onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                                        </div>
                                    </div>

                                    <div className="field_block mb-0">
                                        <label className="field_label">Source</label>
                                        <div className="tags_input_box">
                                            {tags.map((tag, i) => (
                                                <span className="tag_item" key={i}>
                                                    {tag}
                                                    <span className="remove_tag" onClick={() => removeTag(i)}>
                                                        <svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
                                                    </span>
                                                </span>
                                            ))}
                                            <input type="text" className="tag_input" value={inputValue} placeholder="Type & press Enter" onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        <span className="divider"></span>
                        <Select
                            defaultValue="Select"
                            className="custom_select_cls"
                            onChange={handleChange}
                            // open={true}
                            options={[
                                { value: 'CTET', label: 'CTET' },
                                { value: 'CTIT', label: 'CTIT' },
                            ]}
                            suffixIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            }
                        />
                        <Select
                            defaultValue="Select"
                            onChange={handleChange}
                            className="custom_select_cls"
                            // open={true}
                            options={[
                                { value: 'Percentage', label: 'Percentage' },
                                { value: 'Counts', label: 'Counts' },
                            ]}
                            suffixIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            }
                        />
                        <Select
                            mode="multiple"
                            className="custom_select_cls_diff"
                            placeholder="Please select"
                            value={selectedValues}
                            onChange={handleChangecheckbox}
                            maxTagCount="responsive"
                            maxTagPlaceholder={(omittedValues) => (
                                <Tooltip
                                    styles={{ root: { pointerEvents: "none" } }}
                                    title={omittedValues.map(({ label }) => label).join(", ")}
                                >
                                    <span>+{omittedValues.length} more</span>
                                </Tooltip>
                            )}

                            // 🔥 FIXED CHECKBOX CLICK + LABEL CLICK (WON'T CLOSE)
                            optionRender={(option) => {
                                const checked = selectedValues.includes(option.value);

                                return (
                                    <div
                                        onMouseDown={(e) => e.preventDefault()}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            width: "100%",
                                        }}
                                    >
                                        <Checkbox checked={checked} />
                                        <span>{option.label}</span>
                                    </div>
                                );
                            }}

                            // Dropdown open on checkbox/text click – always stays open
                            dropdownRender={(menu) => (
                                <div
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // MASTER FIX
                                    }}
                                >
                                    {menu}
                                </div>
                            )}

                            suffixIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            }

                            options={optionsss}
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
