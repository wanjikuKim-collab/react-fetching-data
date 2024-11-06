import React, { useEffect, useState } from "react";

function Fetch() {
    const [deckId, setDeckId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    //Create a new deck on component mount
    useEffect(()=>{
        const createDeck = async ()=>{
            try{
                const promise = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                if(!promise.ok){
                    throw new Error("Error fetching data")
                }
                const data = await promise.json();
                setDeckId(data.deck_id);//store deck ID for future requests
            }catch(error){
                setError("Failed to create a deck")
            }finally{
                setLoading(false)
            }
        };
        createDeck();
    },[])

   
    if(loading) return <p>Loading ...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
        <>
        <h1>Welcome</h1>
        {error && <p>Error: {error}</p>}
        <p>Deck ID: {deckId}</p>
        </>
    )
}

export default Fetch