import axios from "axios";

const instance = axios.create({
  baseURL: "http://178.128.206.150:7000/",
});

export default instance;
