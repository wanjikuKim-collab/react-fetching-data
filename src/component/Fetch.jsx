import React, { useEffect, useState } from "react";

function Fetch() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function fetchData(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve("Data fetched from server")
            }, 2000);
        });
    }

    async function handleData(){
        try{
            const data = await fetchData();
            console.log(data);
            console.log("Processing data...");
            console.log("Displaying data...");
        }catch(error){
            console.error("Error:", error);
        }
    }

    handleData();

    if(loading) return <p>Loading ...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
        <>
        <h1>Welcome</h1>
        </>
    )
}

export default Fetch