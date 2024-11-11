import React, { useEffect, useState } from "react";
import { getRequestWithNativeFetch } from "./FetchingLogic";

function FetchPlayers() {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    score: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentEditId, setCurrentEditId] = useState(null); // To track the player being edited

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

  //Function to add new player to the state
  const addNewPlayer = (newPlayer) => {
    setPlayers((prevPlayer) => [...prevPlayer, newPlayer]);
  };
  // POST: Add a new player
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
      addNewPlayer(data); //update players list with new player
      setFormData({ name: "", email: "", score: 0 }); //Reset input
      console.log("New player added:", data);
    } catch (error) {
      setError(`Failed to fetch players: ${error.message}`);
    }
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  // Update player state after edits
  function editPlayerDetails(id, updatedPlayer) {
    setPlayers(
      players.map((player) =>
        player.id === id ? { ...player, ...updatedPlayer } : player
      )
    );
  }
  // PUT: handle editing a player
  const handleEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/players/${currentEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      editPlayerDetails(currentEditId, data);
      setCurrentEditId(null); // Clear the current edit ID after saving
      setFormData({ name: "", email: "", score: 0 }); // Clear the form data
    } catch (error) {
      setError(`Failed to update player: ${error.message}`);
    }
  };

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
        /*VIEW STATE*/
        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
            <tr>
              <th>Player</th>
              <th>Email</th>
              <th>Score</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr className="bg-white border-b " key={player.id}>
                {currentEditId === player.id ? (
                   /* EDIT STATE*/
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder={player.name}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        placeholder={player.email}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="score"
                        value={formData.score}
                        placeholder={player.score}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="text-white">
                      <button className="mr-2 bg-green-400 p-2" onClick={handleEdit}>Save</button>
                      <button
                        className="m-2 bg-red-400 p-2"
                        onClick={() => setCurrentEditId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="font-medium text-gray-900 ">
                      {player.name}
                    </td>
                    <td>{player.email}</td>
                    <td>{player.score}</td>
                    <td>
                      <button
                        onClick={() => {
                          setCurrentEditId(player.id); // Set the current player's ID
                          setFormData({
                            name: player.name,
                            email: player.email,
                            score: player.score,
                          }); // Pre-fill the form with current player data
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white p-2"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FetchPlayers;
