// import logo from "./logo.svg";
import diagram from "./aws-ci-cd-with-travis.png";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={diagram} alt="diagram" />
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <a
          className="App-link"
          href="https://docs.travis-ci.com/user/deployment/elasticbeanstalk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CAPGEMINI - Demo:AWS Elastic Beanstalk CI/CD PIPELINE WITH TRAVIS
        </a>
      </header>
    </div>
  );
}

export default App;
