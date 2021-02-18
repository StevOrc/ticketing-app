import axios from "axios";

const LandingPage = ({ color }) => {
  return <div> Landing page {color} </div>;
};

LandingPage.getInitialProps = () => {
  return { color: "red" };
};

export default LandingPage;
