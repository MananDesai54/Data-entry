import { useEffect, useRef, useState } from "react";
import M from "materialize-css";
import moment from "moment";

const UpdatePerson = (props) => {
  const [response, setResponse] = useState({});
  const [person, setPerson] = useState({});
  const datePicker = useRef();
  useEffect(() => {
    M.Datepicker.init(datePicker.current);
  });
  const id = props.match.params.id;

  useEffect(() => {
    const getPerson = async () => {
      const response = await fetch(`https://post-data-api.herokuapp.com/${id}`);
      const body = await response.json();
      if (body.message) {
        setResponse({ message: body.message, type: "danger" });
        setTimeout(() => {
          setResponse({});
        }, 3000);
      } else {
        setPerson(body);
        datePicker.current.value = moment(new Date(body.dueDate)).format(
          "Do MMMM YYYY"
        );
      }
    };
    getPerson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://post-data-api.herokuapp.com/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: person.name,
        amount: person.amount,
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
      setPerson({ name: "", amount: "" });
      datePicker.current.value = "";
      setResponse({ message: "Person Added", type: "success" });
      props.history.push("/list");
    }
    setTimeout(() => {
      setResponse({});
    }, 3000);
  };

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
              value={person.name}
              onChange={(e) => setPerson({ name: e.target.value })}
              id="name"
              type="text"
              className="validate"
            />
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">attach_money</i>
            <input
              value={person.amount}
              onChange={(e) => setPerson({ amount: e.target.value })}
              id="Amount"
              type="number"
              className="validate"
            />
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
        <button className="btn pink">Update</button>
      </form>
    </div>
  );
};

export default UpdatePerson;
