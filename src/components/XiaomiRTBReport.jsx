import React, { useState, useEffect } from "react";
import GenerateReportIcon from '../assets/generate_report_icon.svg'
import { Flex, Layout, Table, Select, Tag, Col, DatePicker, Button, Pagination, Space, Button as AntdButton } from "antd";
// import { NavDropdown, Nav, Navbar } from 'react-bootstrap';
import TopHeader from "./TopHeader";
import dayjs from 'dayjs';
import DateRangePicker from "react-bootstrap-daterangepicker";
import axios from "axios";
import { calc } from "antd/es/theme/internal";

const { RangePicker } = DatePicker;

export default function XiaomiRTBReport() {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'day');
  const last7DaysStart = dayjs().subtract(6, 'day');
  const thisMonthStart = dayjs().startOf('month');
  const thisMonthEnd = dayjs().endOf('month');
  const lastMonthStart = dayjs().subtract(1, 'month').startOf('month');
  const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month');

  const shortcuts = {
    Today: [today, today],
    Yesterday: [yesterday, yesterday],
    'Last 7 Days': [last7DaysStart, today],
    'This Month': [thisMonthStart, thisMonthEnd],
    'Last Month': [lastMonthStart, lastMonthEnd],
  };

  const [selectedRange, setSelectedRange] = useState([dayjs().subtract(6, 'day'), dayjs()]);

  const [startDate, setStartDate] = useState(dayjs().subtract(6, 'day').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const handleChange = (dates) => {
    setSelectedRange(dates);
    if (dates) {
      const [start, end] = dates;

      setStartDate(start.format('YYYY-MM-DD'))
      setEndDate(end.format('YYYY-MM-DD'))
      // fetchData();
    } else {
      // console.log('Range cleared', dates);
    }
    // if (rowDataSelectedApply?.length > 0 && columnDataSelectedApply?.length > 0) {
    //     setApicall(!apiCall)
    // }

    setIsFirstLoad(false)
  };

  const handleShortcutClick = (range) => {
    setSelectedRange(range);
  };

  const isRangeEqual = (range1, range2) => {
    if (!range1 || !range2) return false;
    return (
      range1[0].isSame(range2[0], 'day') &&
      range1[1].isSame(range2[1], 'day')
    );
  };

  const matchedShortcutKey = Object.entries(shortcuts).find(([_, range]) =>
    isRangeEqual(selectedRange, range)
  )?.[0];

  const displayValue = matchedShortcutKey
    ? matchedShortcutKey
    : selectedRange
      ? `${selectedRange[0].format('DD/MM/YYYY')} - ${selectedRange[1].format('DD/MM/YYYY')}`
      : 'Select date';

  let initialColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      show: true,
      ellipsis: true,
      fixed: 'left',
      width: 180,
      sorter: (a, b) => Number(a.date) - Number(b.date),
      // render: (val) => dayjs(val.toString()).format("DD-MM-YYYY"),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      show: true,
      ellipsis: true,
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Tag ID",
      dataIndex: "tagId",
      key: "tagId",
      show: true,
      ellipsis: true,
      sorter: (a, b) => a.tagId.localeCompare(b.tagId),
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      show: true,
      ellipsis: true,
      sorter: (a, b) => a.fee - b.fee
    },
    {
      title: "Expose",
      dataIndex: "expose",
      key: "expose",
      show: true,
      ellipsis: true,
      sorter: (a, b) => a.expose - b.expose
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      show: true,
      ellipsis: true,
      sorter: (a, b) => a.clicks - b.clicks
    }];


  const [filteredData, setFilteredData] = useState([]);

  const [selectGroupArr, setSelectGroupArr] = useState([]);

  const [selectOfferArr, setSelectOfferArr] = useState([]);
  const [filterOffer, setFilterOffer] = useState([]);

  const [selectPubArr, setSelectPubArr] = useState([]);
  const [filterPub, setFilterPub] = useState([]);

  const [allData, setAllData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportAllData, setReportAllData] = useState([]);

  const [fileHeader, setFileHeader] = useState([]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [reportLoading, setReportLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // fetch report data
  const fetchReport = () => {

    setReportLoading(true)
    setIsFetching(true)
    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_API_URL}/xiaomi/rtb/report`,
      headers: {
        'access-token': `${import.meta.env.VITE_APP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "startDate": dayjs(startDate).format("YYYYMMDD"),
        "endDate": dayjs(endDate).format('YYYYMMDD'),
        "metrics": [
          "fee",
          "click",
          "expose"
        ],
        "breakdowns": [
          "country",
          "tagId",
          "date"
        ],
        "filters": []
      })
    };

    // console.log("config", config);
    // return 0;
    axios(config).then(function (response) {
      const res = response.data;
      if (res.success) {
        const newData = response.data.result.map((record, key) => ({
          key,
          date: record.date,
          country: record.country,
          tagId: record.tagId,
          fee: record.fee,
          expose: record.expose,
          clicks: record.click
        }))
        setFilteredData(newData);
      } else {
        setFilteredData([]);
      }
    }).catch(function (error) {
      // console.log(error);
      toast.error(error.response?.data?.message, { autoClose: 2000 })

      setFilteredData([]);
      setReportData([])
    }).finally(() => {
      setIsFirstLoad(false)
      setReportLoading(false)
      setIsFetching(false)
    });
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setIsFetching(true);
    if (isFetching) return;

    if (pagination.current !== tableParams.pagination?.current) {
      setSortDirection(sortDirection);
    }
    else {
      if ((sorter.column !== undefined) && (sortType !== sorter.column.columnKey)) {
        setSortDirection(1);
        setSortType(sorter.column.columnKey)
      } else {
        if (sortDirection === 1) {
          setSortDirection(-1);
        } else if (sortDirection === -1) {
          setSortDirection(null);
        } else if (sortDirection === null) {
          setSortDirection(1);
        }
      }
    }

    if (tableParams.pagination.pageSize !== pagination.pageSize) {
      setSortDirection(sortDirection);
    }
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }
    }));
    // debouncedPaginationChange(pagination);
  };

  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    console.log("startDate", startDate)
    if (!isFirstLoad) {
      console.log("fetchReport call")
      fetchReport();
    }
  }, [startDate, endDate]);


  const [searchQuery, setSearchQuery] = useState('')
  const [originalData, setOriginalData] = useState([]);
  useEffect(() => {
    if (!searchQuery) {
      setOriginalData(filteredData);
    }
  }, [filteredData, searchQuery]);

  const handleTableSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) {
      setFilteredData(originalData);
      return;
    }
    const filtered = originalData.filter(item =>
      Object.values(item).some(
        v => v && v.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredData(originalData);
  };

  return (
    <div className="content-wrapper">
      <div className="heading_filter">
        <h2>RTB Report</h2>
        <div className="filters">
          {/* <div className="ant_date_rangepicker"> */}
          {/* <div className="custom-display">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 9.3335C7.81111 9.3335 7.65289 9.2695 7.52533 9.1415C7.39733 9.01394 7.33333 8.85572 7.33333 8.66683C7.33333 8.47794 7.39733 8.3195 7.52533 8.1915C7.65289 8.06394 7.81111 8.00016 8 8.00016C8.18889 8.00016 8.34733 8.06394 8.47533 8.1915C8.60289 8.3195 8.66667 8.47794 8.66667 8.66683C8.66667 8.85572 8.60289 9.01394 8.47533 9.1415C8.34733 9.2695 8.18889 9.3335 8 9.3335ZM5.33333 9.3335C5.14444 9.3335 4.986 9.2695 4.858 9.1415C4.73044 9.01394 4.66667 8.85572 4.66667 8.66683C4.66667 8.47794 4.73044 8.3195 4.858 8.1915C4.986 8.06394 5.14444 8.00016 5.33333 8.00016C5.52222 8.00016 5.68067 8.06394 5.80867 8.1915C5.93622 8.3195 6 8.47794 6 8.66683C6 8.85572 5.93622 9.01394 5.80867 9.1415C5.68067 9.2695 5.52222 9.3335 5.33333 9.3335ZM10.6667 9.3335C10.4778 9.3335 10.3196 9.2695 10.192 9.1415C10.064 9.01394 10 8.85572 10 8.66683C10 8.47794 10.064 8.3195 10.192 8.1915C10.3196 8.06394 10.4778 8.00016 10.6667 8.00016C10.8556 8.00016 11.0138 8.06394 11.1413 8.1915C11.2693 8.3195 11.3333 8.47794 11.3333 8.66683C11.3333 8.85572 11.2693 9.01394 11.1413 9.1415C11.0138 9.2695 10.8556 9.3335 10.6667 9.3335ZM8 12.0002C7.81111 12.0002 7.65289 11.9362 7.52533 11.8082C7.39733 11.6806 7.33333 11.5224 7.33333 11.3335C7.33333 11.1446 7.39733 10.9864 7.52533 10.8588C7.65289 10.7308 7.81111 10.6668 8 10.6668C8.18889 10.6668 8.34733 10.7308 8.47533 10.8588C8.60289 10.9864 8.66667 11.1446 8.66667 11.3335C8.66667 11.5224 8.60289 11.6806 8.47533 11.8082C8.34733 11.9362 8.18889 12.0002 8 12.0002ZM5.33333 12.0002C5.14444 12.0002 4.986 11.9362 4.858 11.8082C4.73044 11.6806 4.66667 11.5224 4.66667 11.3335C4.66667 11.1446 4.73044 10.9864 4.858 10.8588C4.986 10.7308 5.14444 10.6668 5.33333 10.6668C5.52222 10.6668 5.68067 10.7308 5.80867 10.8588C5.93622 10.9864 6 11.1446 6 11.3335C6 11.5224 5.93622 11.6806 5.80867 11.8082C5.68067 11.9362 5.52222 12.0002 5.33333 12.0002ZM10.6667 12.0002C10.4778 12.0002 10.3196 11.9362 10.192 11.8082C10.064 11.6806 10 11.5224 10 11.3335C10 11.1446 10.064 10.9864 10.192 10.8588C10.3196 10.7308 10.4778 10.6668 10.6667 10.6668C10.8556 10.6668 11.0138 10.7308 11.1413 10.8588C11.2693 10.9864 11.3333 11.1446 11.3333 11.3335C11.3333 11.5224 11.2693 11.6806 11.1413 11.8082C11.0138 11.9362 10.8556 12.0002 10.6667 12.0002ZM3.33333 14.6668C2.96667 14.6668 2.65267 14.5364 2.39133 14.2755C2.13044 14.0142 2 13.7002 2 13.3335V4.00016C2 3.6335 2.13044 3.31972 2.39133 3.05883C2.65267 2.7975 2.96667 2.66683 3.33333 2.66683H4V2.00016C4 1.81127 4.06378 1.65283 4.19133 1.52483C4.31933 1.39727 4.47778 1.3335 4.66667 1.3335C4.85556 1.3335 5.014 1.39727 5.142 1.52483C5.26956 1.65283 5.33333 1.81127 5.33333 2.00016V2.66683H10.6667V2.00016C10.6667 1.81127 10.7307 1.65283 10.8587 1.52483C10.9862 1.39727 11.1444 1.3335 11.3333 1.3335C11.5222 1.3335 11.6804 1.39727 11.808 1.52483C11.936 1.65283 12 1.81127 12 2.00016V2.66683H12.6667C13.0333 2.66683 13.3473 2.7975 13.6087 3.05883C13.8696 3.31972 14 3.6335 14 4.00016V13.3335C14 13.7002 13.8696 14.0142 13.6087 14.2755C13.3473 14.5364 13.0333 14.6668 12.6667 14.6668H3.33333ZM3.33333 13.3335H12.6667V6.66683H3.33333V13.3335ZM3.33333 5.3335H12.6667V4.00016H3.33333V5.3335ZM3.33333 5.3335V4.00016V5.3335Z" fill="#7D46B0" />
              </svg> {displayValue}
            </div> */}
          <RangePicker
            value={selectedRange}
            onChange={handleChange}
            dropdownClassName='custom_range_calendar'
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
            // open={true}

            className={displayValue === "Today" ? "date_main" : displayValue === "Yesterday" ? "date_main_1" : displayValue === "Last 7 Days" ? "date_main_1" : displayValue === "This Month" ? "date_main_1" : displayValue === "Last Month" ? "date_main_1" : ""}
            allowClear={false}
            // open={open}
            // onOpenChange={handleOpenChange}
            // onCalendarChange={() => {
            //     fetchData();
            // }}
            renderExtraFooter={() => (
              <Space wrap>
                {Object.entries(shortcuts).map(([label, range]) => (
                  <Button
                    key={label}
                    onClick={() => {
                      handleShortcutClick(range);
                      setStartDate(range[0].format('YYYY-MM-DD'));
                      setEndDate(range[1].format('YYYY-MM-DD'));
                    }}
                    className={matchedShortcutKey === label ? 'active' : undefined}
                  >
                    {label}
                  </Button>
                ))}
              </Space>
            )}
          />
          {/* </div> */}
          <span className="divider"></span>
          <Button type="primary" className="">
            Get Report
          </Button>
        </div>
      </div>

      <div className="view_data_div">
        {filteredData.length <= 0 ?
          <div className="empty-state">
            <img src={GenerateReportIcon} alt="empty" className="img-fluid" />
            <h3>Generate a Report</h3>
            <p>Please select "Date" from above to <br /> generate the report.</p>
          </div>
          :
          <div className="tableFixHead">
            <div className="table_design custom_data_table custom_pagination_cls">
              <Table
                columns={columns}
                dataSource={filteredData}
                scroll={{ y: "calc(100dvh - 32rem)" }}
                pagination={{
                  showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
                  defaultPageSize: 20,   // 👈 ensures initial load = 20
                  // pageSize: 20,
                  showSizeChanger: true,
                  pageSizeOptions: ['20', '50', '100'],

                  selectProps: {
                    showSearch: false,
                    optionFilterProp: null
                  }
                }} />
              {/* <div className="d-flex align-items-center justify-content-between custom_pagination_design_cls">
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
              </div> */}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
