import axios from 'axios';

export const api = axios.create({
    baseURL: "https://podcastr-server-davidlpc1.herokuapp.com/"
})