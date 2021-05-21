// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

import React from "react";
import EmployeeCard from "./components/EmployeeCard";
import SearchForm from "./components/SearchForm";
import Wrapper from "./components/Wrapper";
import Col from "./components/col";
import API from "./utils/API";
import "./App.css";
import { current } from "immer";

class App extends React.Component {
  state = { employees: [], search: "" };

  componentDidMount() {
    API.search()
      .then((res) => {
        console.log(res);
        this.setState({
          employees: res.data.results.map((e, i) => ({
            firstName: e.name.first,
            lastName: e.name.last,
            picture: e.picture.large,
            email: e.email,
            phone: e.phone,
            city: e.location.city,
            key: i,
          })),
        });
      })
      .catch((err) => console.log(err));
  }

  refreshPage() {
    window.location.reload(false);
  }

  searchEmployee = (filter) => {
    console.log("Search", filter);
    const filteredList = this.state.employees.filter((employee) => {
      // merge data together, then check to see if employee exists
      let values = Object.values(employee).join("").toLowerCase();
      return values.indexOf(filter.toLowerCase()) !== -1;
    });
    // Update the employee list with the filtered value
    this.setState({ employees: filteredList });
  };

  handleInputChange = (e) => {
    // const name = e.target.name;
    // const value = e.target.value;
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log("Handle ", this.state.search);
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Button Clicked", this.state.search, e);
    this.searchEmployee(this.state.search);
  };

  handleSort = (e) => {
    e.preventDefault();
    let currentEmployee = this.state.employees;
    currentEmployee.sort((a, b) => {
      let fa=a.firstName.toLowerCase();
      let fb=b.firstName.toLowerCase();

      if (fa < fb ) {
        return -1;
      }

      if (fa > fb ) {
        return 1;
      }

      return 0

      // return a.firstName - b.firstName;
    });
    console.log (currentEmployee);
    this.setState({ employees: currentEmployee });
  };

  render() {
    return (
      <Wrapper>
        <div className="container">
          <div className="row">
            <Col size="md-4">
              <h2>Employee Directory</h2>
              <SearchForm
                value={this.state.search}
                handleInputChange={this.handleInputChange}
                handleFormSubmit={this.handleFormSubmit}
              />
            </Col>
          </div>

          <div className="row">
            <button onClick={this.handleSort}> sort byFirstName</button>
          </div>

          <div className="row">
            <Col size="md-12">
              <table className="table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                  </tr>
                </thead>
                {[...this.state.employees].map((item) => (
                  <EmployeeCard
                    picture={item.picture}
                    firstName={item.firstName}
                    lastName={item.lastName}
                    email={item.email}
                    phone={item.phone}
                    city={item.city}
                    key={item.key}
                  />
                ))}
              </table>
            </Col>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default App;
