// import React from "react";
// import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import './index.css';

// const data = [
//   { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
//   { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
//   { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
//   { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
//   { name: "May", uv: 1890, pv: 4800, amt: 2181 },
//   { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
//   { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
// ];

// function App() {
//   return (
//     <div className="bg-gray-900 text-white min-h-screen p-5">
//       <h1 className="text-center text-2xl mb-5">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div className="bg-gray-800 p-5 rounded">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data}>
//               <XAxis dataKey="name" stroke="#ffffff" />
//               <YAxis stroke="#ffffff" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="uv" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-gray-800 p-5 rounded">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={data} dataKey="uv" fill="#82ca9d" label />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-gray-800 p-5 rounded">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data}>
//               <XAxis dataKey="name" stroke="#ffffff" />
//               <YAxis stroke="#ffffff" />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="pv" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer
} from "recharts";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
  }

  .chart-container {
    margin-bottom: 40px;
    margin-inline:20px;
    padding: 20px;
    background-color: #1e1e1e;
    border-radius: 8px;
  }

  .heading2{
    padding-block:20px;
    font-size:1rem;
    color: rgb(130, 202, 157);
    font-weight:500;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  margin-top:30px;
  font-size:1.5rem;
  color: rgb(136, 132, 216);
  font-weight:600;
`;



const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.PUBLIC_URL}/eve.json`)
      .then((response) => {
        const dataArray = response.data.split("\n"); // Split the data into an array of lines
        const parsedData = dataArray.map((line) => {
          try {
            return JSON.parse(line); // Parse each line into a JSON object
          } catch (error) {
            console.error("Error parsing line: ", error);
            return null;
          }
        });
        setData(parsedData.filter(Boolean)); // Filter out any null values
      })
      .catch((error) => console.error("Error fetching the data: ", error));
  }, []);

  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <Title>Dashboard</Title>
      <div className="chart-container">
        <h2 className="heading2">Line Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="timestamp" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="src_port" stroke="#8884d8" />
            <Line type="monotone" dataKey="dest_port" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="heading2">Bar Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="src_port" fill="#8884d8" />
            <Bar dataKey="dest_port" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2 className="heading2">Pie Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="src_port"
              nameKey="timestamp"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Dashboard;
