import { Layout, Menu, Dropdown, DatePicker, Button } from "antd";
import {
  DownOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

export default function ReportsLayout() {
  const reportingMenu = (
    <Menu
      items={[
        { key: "rtb", label: "RTB Report" },
        { key: "abc", label: "ABC Report" }
      ]}
    />
  );

  return (
    <Layout className="reports-layout">

      {/* TOP NAV */}
      <Header className="top-nav">
        <div className="logo">Xapads</div>

        <div className="nav-menu">
          <Dropdown overlay={reportingMenu} trigger={["click"]}>
            <div className="menu-item">
              Reporting <DownOutlined />
            </div>
          </Dropdown>

          <div className="menu-item">Fraud Reporting</div>
        </div>
      </Header>

      <Content className="content-wrapper">

        {/* PAGE TITLE */}
        <h2 className="page-title">RTB Report</h2>

        {/* FILTER BAR */}
        <div className="filters">
          <DatePicker placeholder="Select Date" />
          <Button type="primary" className="report-btn">
            Get Report
          </Button>
        </div>

        {/* EMPTY STATE */}
        <div className="empty-state">
          <img src="/empty-report.png" alt="empty" />
          <h3>Generate a Report</h3>
          <p>Please select "Date" from above to generate the report.</p>
        </div>

      </Content>
    </Layout>
  );
}
