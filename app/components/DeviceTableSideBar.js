import React, { useState } from "react";
import classNames from "classnames";

import OrdorColorLegend from "../routes/Dashboards/Monitor/components/OdorColorLegend";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router";

export default function DeviceTableSideBar() {
  let [active, setActive] = useState(false);
  const rootClass = classNames("theme-config", {
    "theme-config--active": active,
  });

  return (
    <div
      className={rootClass}
      style={{
        paddingTop: "43px",
        maxWidth: "380px",
        width: "83vw",
        height: "100vh",
        backgroundColor: "white",
        borderLeft: "1px solid #DEE2E6",
      }}
    >
      <div
        className="btn btn-outline-secondary theme-config__trigger bg-white"
        style={{ width: 40 }}
        onClick={() => {
          setActive((prev) => !prev);
        }}
      >
        <i
          className={`fa fa-fw fa-th-list ${
            active ? "text-dark" : "text-secondary"
          }`}
        ></i>
      </div>
      <div className="container-fluid">
        <div className="row pt-3">
          <div className="col">
            <OrdorColorLegend />
          </div>
        </div>
        <div className="row pt-3" style={{ height: "100%" }}>
          <div className="col">
            <div style={{ maxHeight: "85vh", overflowY: "scroll" }}>
              <DeviceTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DeviceTable = observer(() => {
  // const history = useHistory();
  // let { deviceList } = DeviceStore;

  return (
    <table className="table table-sm table-striped table-bordered bg-white text-center">
      <colgroup>
        <col width="30%" />
        <col width="15%" />
        <col width="15%" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">장비명</th>
          <th scope="col">온오프</th>
          <th scope="col">상태</th>
          <th scope="col">위치</th>
        </tr>
      </thead>
      <tbody>
        {/* {deviceList.map((device) => (
          <tr
            key={device.id}
            className="text-white"
            onClick={() =>
              history.push(`/dashboards/device/info/${device.id}`)
            }
            style={{ backgroundColor: device.levelColor }}
          >
            <td>{device.name}</td>
            <td>{device.status}</td>
            <td>{device.level}</td>
            <td>{device.address}</td>
          </tr>
        ))} */}
      </tbody>
    </table>
  );
});
