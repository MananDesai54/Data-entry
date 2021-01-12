import AddPerson from "./components/AddPerson";
import "materialize-css/dist/css/materialize.min.css";
import { BrowserRouter, NavLink, Route } from "react-router-dom";
import List from "./components/List";
import UpdatePerson from "./components/UpdatePerson";
import Login from "./components/Login";
import { Fragment, useEffect, useState } from "react";
import { urlBase64ToUint8Array } from "./utils";
import { useLink } from "./hooks/useLink";

function showNotification() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification("Successfully subscribed.", {
        body: "You have successfully subscribed for notifications",
        vibrate: [100, 50, 200],
        renotify: true,
        tag: "Confirm notification",
      });
    });
  }
}

function configureNotificationSubscription(link) {
  let swReg;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((sw) => {
      swReg = sw;
      swReg.pushManager
        .getSubscription()
        .then((subscription) => {
          if (!subscription) {
            const publicVapidKey =
              "BL7B8pa_DikwKC9h8CiYC1oLN5t56Zg2wdVVH7TSz6MsETbD2WfbeA2xHzPmnoFJ7QA0SJCoOmYuxJ9eamA2LSY";
            const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);
            return swReg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });
          } else {
            console.log("You already have one subscription");
          }
        })
        .then((newSubscription) => {
          return fetch(`${link}/subscribe`, {
            method: "POST",
            body: JSON.stringify({ subscription: newSubscription }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
        })
        .then((res) => {
          if (res.ok) {
            showNotification();
          }
        });
    });
  }
}

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const link = useLink();
  /**
   * Notification subscription
   */
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((choice) => {
        console.log(choice);
        if (choice !== "granted") {
          console.log("Not Granted");
        } else {
          configureNotificationSubscription(link);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      setIsAuth(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            {isAuth && (
              <Fragment>
                <ul id="nav-mobile" className="right">
                  <li>
                    <NavLink
                      activeStyle={{
                        color: "black",
                        textDecoration: "underline",
                      }}
                      exact
                      to="/"
                    >
                      Add person
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeStyle={{
                        color: "black",
                        textDecoration: "underline",
                      }}
                      to="/list"
                    >
                      List
                    </NavLink>
                  </li>
                  <li>
                    <a href="#user">{localStorage.getItem("user")}</a>
                  </li>
                  <li
                    onClick={() => {
                      setIsAuth(false);
                      localStorage.clear();
                    }}
                  >
                    <a href="#user">Logout</a>
                  </li>
                </ul>
              </Fragment>
            )}
          </div>
        </nav>
      </div>
      <div className="App">
        {isAuth ? (
          <Fragment>
            <Route path="/" exact component={AddPerson} />
            <Route path="/list" exact component={List} />
            <Route path="/person/:id" exact component={UpdatePerson} />
          </Fragment>
        ) : (
          <Route
            path="/"
            render={(props) => <Login {...props} setIsAuth={setIsAuth} />}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
