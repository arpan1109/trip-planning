// import axios from 'axios';

// const API = axios.create({
//     // baseURL: 'http://localhost:5000/api', // Adjust to your server port
//     baseURL: 'https://journeys-api.vercel.app/api', // Adjust to your server port
//     withCredentials: true, // CRUCIAL: Sends the JWT cookie with every request
// });

// export default API;

import axios from 'axios';

const API = axios.create({
    // Utilizes the proxy in production, maintains localhost for local development
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api', 
    withCredentials: true,
});

export default API;