import { useEffect, useRef, useState } from "react";
import M from "materialize-css";
import { useLink } from "../hooks/useLink";
import moment from "moment";
import { setDue } from "../setDue";

const AddPerson = (props) => {
  const editable = props.location.search.length > 0;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [years, setYears] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [dueDate, setDueDate] = useState("");
  const [date, setDate] = useState("");
  const [response, setResponse] = useState({});
  const selectRef = useRef();

  const link = useLink();

  useEffect(() => {
    M.FormSelect.init(selectRef.current);
    if (editable) {
      const getPerson = async () => {
        const response = await fetch(
          `${link}/${props.location.search.split("=")[1]}`
        );
        const body = await response.json();
        if (body.message) {
          setResponse({ message: body.message, type: "danger" });
          setTimeout(() => {
            setResponse({});
          }, 3000);
        } else {
          setName(body.name);
          setAmount(body.amount);
          setDueDate(new Date(body.dueDate));
          setYears(
            new Date(body.dueDate).getFullYear() -
              new Date(body.date).getFullYear()
          );
          setDate(
            `${new Date(body.date).getDate()}/${
              new Date(body.date).getMonth() + 1
            }/${new Date(body.date).getFullYear()}`
          );
        }
      };
      getPerson();
    } else {
      setName("");
      setAmount("");
      setDate("");
      setYears("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable]);
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(setDue(years, date).getTime());
    const response = await fetch(
      !editable ? link : `${link}/${props.location.search.split("=")[1]}`,
      {
        method: editable ? "PUT" : "POST",
        body: JSON.stringify({
          name,
          amount,
          date: new Date(
            `${date.split("/")[1]}/${date.split("/")[0]}/${date.split("/")[2]}`
          ).getTime(),
          dueDate: setDue(years, date).getTime(),
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const body = await response.json();
    if (body.message) {
      setResponse({ message: body.message, type: "danger" });
    } else {
      setName("");
      setAmount("");
      setDate("");
      setResponse({
        message: editable ? "Person updated" : "Person Added",
        type: "success",
      });
      props.history.push("/list");
    }
    setTimeout(() => {
      setResponse({});
    }, 3000);
  };
  useEffect(() => {
    return () => setResponse("");
  }, []);
  return (
    <div
      className="row"
      style={{ width: "90%", maxWidth: "500px", margin: "10px auto" }}
    >
      <form className="col s12" onSubmit={submitHandler}>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">account_circle</i>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              type="text"
              className="validate"
            />
            <label htmlFor="name">Name</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">attach_money</i>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              id="Amount"
              type="number"
              className="validate"
            />
            <label htmlFor="Amount">Amount</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">event</i>
            <input
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDueDate(setDue(years, date));
              }}
              id="Date"
              type="text"
              className="validate"
            />
            <label htmlFor="Date">Date(DD/MM/YYYY)</label>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <span>Year after Account closes</span>
              <select
                value={years}
                onChange={(e) => {
                  setYears(e.target.value);
                  setDueDate(setDue(years, date));
                }}
                ref={selectRef}
                className="browser-default"
                style={{ borderColor: "black" }}
              >
                <option disabled value="">
                  Year after closes
                </option>
                <option defaultValue="1">1</option>
                <option defaultValue="8.7">8.7</option>
                <option defaultValue="5">5</option>
                <option defaultValue="10">10</option>
              </select>
            </div>
          </div>
          <span>Due date</span>
          <div className="input-field col s12">
            <i className="material-icons prefix">event</i>
            <input
              type="text"
              className="validate"
              name="dueDate"
              id="dueDate"
              disabled
              value={
                date ? moment(setDue(years, date)).format("Do MMMM YYYY") : ""
              }
              onChange={() => setDue(years, date)}
            />
          </div>
        </div>
        {response && (
          <p
            style={{
              color: response.type === "success" ? "green" : "red",
              fontSize: "18px",
            }}
          >
            {response.message}
          </p>
        )}
        <button
          className="btn pink"
          type="button"
          onClick={() => props.history.push("/list")}
        >
          Cancel
        </button>
        <button
          style={{ marginLeft: "10px" }}
          className="btn pink"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
