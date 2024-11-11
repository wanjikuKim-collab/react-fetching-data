import React, { useEffect, useState } from "react";
import { getRequestWithNativeFetch } from "./FetchingLogic";
import { data } from "autoprefixer";

function FetchPlayers() {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    score: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET: Fetch users from the database
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const playersData = await getRequestWithNativeFetch(
          "http://localhost:3001/players"
        );
        setPlayers(playersData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchPlayers();
  }, []);

  // POST: Add a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPlayers((prevPlayers)=>[...prevPlayers, data]); //update players list with new player
      setFormData({ name: "", email: "", score: 0 }); //Reset input
      console.log("New player added:", data);
    } catch (error) {
      setError(`Failed to fetch players: ${error.message}`);
    }
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="m-6 justify-center">
      <h1>FetchPlayers</h1>
      {error && <p>Error: {error}</p>}
      {/* Add new player */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <input
          name="name"
          className="border p-2"
          type="text"
          placeholder="Player Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="email"
          placeholder="jane@gmail.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <button className="border p-2 bg-slate-500 text-white">
          Add Player
        </button>
      </form>

      <h2>Players</h2>
      {loading ? (
        <>Loading players...</>
      ) : (
        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
            <tr>
              <th>Player</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr className="bg-white border-b " key={player.id}>
                <td className="font-medium text-gray-900 ">{player.name}</td>
                <td>{player.email}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FetchPlayers;
