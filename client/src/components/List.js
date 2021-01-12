import { useEffect, useRef, useState } from "react";
import moment from "moment";
import M from "materialize-css";
import { Link } from "react-router-dom";
import { useLink } from "../hooks/useLink";

const List = () => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const select = useRef();
  const [showBy, setShowBy] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const link = useLink();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${link}/data`);
      const body = await response.json();
      body.sort(function (a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      setData(body);
      setShowData(body);
    };
    fetchData();
  }, [link]);

  useEffect(() => {
    M.Tabs.init(select.current);
  });

  useEffect(() => {
    const persons = [...data];
    let updatedData = persons.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );
    if (showBy === "all") {
      setShowData(updatedData);
    } else if (showBy === "month") {
      updatedData = updatedData.filter(
        (person) =>
          new Date(person.dueDate).getMonth() === new Date().getMonth()
      );
      setShowData(updatedData);
    } else if (showBy === "today") {
      updatedData = updatedData.filter(
        (person) =>
          new Date(person.dueDate).getDate() === new Date().getDate() &&
          new Date(person.dueDate).getMonth() === new Date().getMonth()
      );
      setShowData(updatedData);
    }
  }, [showBy, data, search]);

  const deletePerson = async (id) => {
    const response = await fetch(`${link}/${id}`, {
      method: "DELETE",
    });
    const body = await response.json();
    if (body.success) {
      const updatedData = data.filter((person) => person._id !== id);
      setData(updatedData);
    } else {
      setError("Unable to delete");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div style={{ width: "90%", maxWidth: "500px", margin: "10px auto" }}>
      <div className="row">
        <div className="col s12">
          <ul className="tabs" ref={select}>
            <li className="tab col s3" onClick={() => setShowBy("all")}>
              <a className="active" href="#test1">
                All
              </a>
            </li>
            <li className="tab col s3" onClick={() => setShowBy("today")}>
              <a href="#test2">Today</a>
            </li>
            <li className="tab col s3" onClick={() => setShowBy("month")}>
              <a href="#test2">Monthly</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">search</i>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="name"
            type="text"
            className="validate"
          />
          <label htmlFor="name">Search</label>
        </div>
      </div>
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "18px",
          }}
        >
          {error}
        </p>
      )}
      <table className="striped centered" style={{ marginBottom: "100px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>

        <tbody>
          {showData.length === 0 ? (
            <tr>
              <td>No Data Available</td>
            </tr>
          ) : (
            showData.map((person) => (
              <tr key={person._id}>
                <td>
                  {" "}
                  <Link
                    style={{ textDecoration: "underline", color: "blue" }}
                    to={`/person/${person._id}`}
                  >
                    {person.name}
                    <i className="material-icons" style={{ fontSize: "15px" }}>
                      edit
                    </i>
                  </Link>{" "}
                </td>
                <td>{person.amount}</td>
                <td>
                  {moment(new Date(person.dueDate)).format("Do MMMM YYYY")}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => deletePerson(person._id)}
                >
                  <i className="material-icons red-text">delete</i>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
