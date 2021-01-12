import { useEffect, useState } from "react";
import { useLink } from "../hooks/useLink";

const AddPerson = (props) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState({});
  const link = useLink();

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(`${link}/auth`, {
      method: "POST",
      body: JSON.stringify({
        name,
        password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const body = await response.json();
    if (body.message) {
      setResponse({ message: body.message, type: "danger" });
    } else {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", name);
      setName("");
      setPassword("");
      setResponse({ message: "Logged in", type: "success" });
      props.setIsAuth(true);
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
            <i className="material-icons prefix">vpn_key</i>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="Amount"
              type="password"
              className="validate"
            />
            <label htmlFor="Amount">Password</label>
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
          style={{ marginLeft: "10px" }}
          className="btn pink"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
