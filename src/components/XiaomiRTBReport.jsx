import React, { useState, useEffect, useRef } from "react";
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

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const wrapperEl = wrapperRef.current;
      const isInPickerWrapper = wrapperEl?.contains(event.target);
      const isInDropdown = document.querySelector('.ant-picker-dropdown')?.contains(event.target);

      if (!isInPickerWrapper && !isInDropdown) {
        setOpen(false); // Close if clicked outside both wrapper and calendar popup
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    setOpen(false)
    // if (rowDataSelectedApply?.length > 0 && columnDataSelectedApply?.length > 0) {
    //     setApicall(!apiCall)
    // }

    // setIsFirstLoad(false)
  };

  const handleShortcutClick = (range) => {
    setSelectedRange(range);
    setOpen(false);
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

  // useEffect(() => {
  //   if (!isFirstLoad) {
  //     console.log("fetchReport call")
  //     fetchReport();
  //   }
  // }, []);

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
          <div className="ant_date_rangepicker">
            <div className="custom-display" onClick={() => setOpen(prev => !prev)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="me-2" viewBox="0 0 16 16" fill="none">
                <path d="M10.6667 1.33334V4.00001M5.33333 1.33334V4.00001M2 6.66668H14M3.33333 2.66668H12.6667C13.403 2.66668 14 3.26363 14 4.00001V13.3333C14 14.0697 13.403 14.6667 12.6667 14.6667H3.33333C2.59695 14.6667 2 14.0697 2 13.3333V4.00001C2 3.26363 2.59695 2.66668 3.33333 2.66668Z" stroke="#5052C9" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>{displayValue}
            </div>
            <RangePicker
              value={selectedRange}
              onChange={handleChange}
              dropdownClassName='custom_range_calendar'
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              // open={true}

              className={displayValue === "Today" ? "date_main" : displayValue === "Yesterday" ? "date_main_1" : displayValue === "Last 7 Days" ? "date_main_1" : displayValue === "This Month" ? "date_main_1" : displayValue === "Last Month" ? "date_main_1" : ""}
              allowClear={false}
              open={open}
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
          </div>
          <span className="divider"></span>
          <Button type="primary" className="" onClick={fetchReport}>
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
                scroll={{ y: "calc(100dvh - 30.2rem)" }}
                pagination={{
                  showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
                  defaultPageSize: 20,   // 👈 ensures initial load = 20
                  // pageSize: 20,
                  showSizeChanger: true,
                  pageSizeOptions: ['20', '50', '100'],

                  selectProps: {
                    showSearch: false,
                    filterOption: false,
                    optionFilterProp: null
                  },
                  locale: {
                    items_per_page: '',   // remove " / page"
                  },
                }} />

            </div>
          </div>
        }
      </div>
    </div>
  );
}
