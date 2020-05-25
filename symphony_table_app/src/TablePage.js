import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import Message from "./Message";

const TablePage = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [message, setMessage] = useState("");
  const [receivedData, setReceivedData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [lines, setLines] = useState(2);
  const [delim, setDelim] = useState(",");

  //map recieved data to new object array
  const mapReceivedTableData = (data = receivedData, delim = "|") => {
    debugger;
    console.log("data, delim", delim);
    let tableArr = [];

    data.map((item) => {
      if (!item.includes(delim)) {
        return;
      }
      let obj = {};
      let itemSplitArr = item.split(delim);
      obj.name = itemSplitArr[0];
      obj.address = itemSplitArr[1];
      obj.country = itemSplitArr[2];
      obj.pin = itemSplitArr[3];
      tableArr.push(obj);
    });
    setTableData(tableArr);
  };
  // delim filter
  const delimFilter = (e) => {
    setDelim(e.target.value);
    e.preventDefault();
    mapReceivedTableData(receivedData, e.target.value);
  };
  // number filter
  const numberFilter = (e) => {
    e.preventDefault();
    debugger;
    console.log("e.target.value", e.target.value);
    e.target.value === 0 ? setLines(2) : setLines(e.target.value);
  };
  // update upon file change
  const onFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  //upload file
  const uploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setReceivedData(res.data);
      mapReceivedTableData(res.data);
      setMessage(`uploaded!!!. ${res.data.length} lines of data uploaded`);
    } catch (err) {
      console.log("error");
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };
  return (
    <div>
      <Fragment>
        {message ? (
          <Message msg={message} onCloseBtnClk={() => setMessage("")} />
        ) : null}
        <span>
          <form className="upload_form">
            <input
              className="upload_field"
              type="file"
              id="customFile"
              onChange={onFileChange}
            />
            <button
              className="upload_button"
              type="button"
              onClick={uploadFile}
            >
              Upload file
            </button>
          </form>
          <div className="filter_wrap">
            <span>Filter</span>
            <span>
              Delimiter:
              <input onChange={delimFilter} value={delim} />
            </span>
            <span>
              Lines:
              <input onChange={numberFilter} value={lines} />
            </span>
          </div>
        </span>
      </Fragment>

      <Fragment>
        {tableData.length > 0 && (
          <div>
            <h3>Generated table</h3>

            <ul className="table_container">
              {tableData.map(
                (item, index) =>
                  index + 1 <= lines && (
                    <li className="table_row" key={index}>
                      <span className="table_column">{item.name}</span>
                      <span className="table_column">{item.address}</span>
                      <span className="table_column">{item.country}</span>
                      <span className="table_column">{item.pin}</span>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </Fragment>
    </div>
  );
};

export default TablePage;
