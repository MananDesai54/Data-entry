import { useEffect, useRef, useState } from "react";
import M from "materialize-css";

const AddPerson = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState({});
  const datePicker = useRef();
  useEffect(() => {
    M.Datepicker.init(datePicker.current);
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/", {
      method: "POST",
      body: JSON.stringify({
        name,
        amount,
        dueDate: new Date(datePicker.current.value).getTime(),
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const body = await response.json();
    if (body.message) {
      setResponse({ message: body.message, type: "danger" });
    } else {
      setName("");
      setAmount("");
      datePicker.current.value = "";
      setResponse({ message: "Person Added", type: "success" });
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
              ref={datePicker}
              type="text"
              className="datepicker"
              name="dueDate"
              id="date"
            />
            <label htmlFor="date">Date</label>
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
        <button className="btn pink">Add</button>
      </form>
    </div>
  );
};

export default AddPerson;
