import React, { useEffect, useState } from "react";
import { getRequestWithNativeFetch } from "./FetchingLogic";

function Fetch() {
    const [deckId, setDeckId] = useState('');
    const [cards, setCards] = useState([]);
    const [remaining, setRemaining] = useState(0)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Create a new deck on component mount
    useEffect(() => {
        const createDeck = async () => {
            try {
                const data = await getRequestWithNativeFetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                setDeckId(data.deck_id);//store deck ID for future requests
            } catch (error) {
                setError(`Failed to fetch cards: ${error.message}`)
            } finally {
                setLoading(false)
            }
        };
        createDeck();
    }, [])


    //function to draw cards
    const drawCards = async (count = 2) => {
        try {
            const data = await getRequestWithNativeFetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
            console.log(data)
            setCards(data.cards);
            setRemaining(data.remaining)
        } catch (error) {
            setError("Failed to draw cards")
        }

    }

    // Function to shuffle the deck
    const shuffleDeck = async () => {
        try {
           let response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`)
           let data = await response.json();
           setRemaining(data.remaining);
        }catch(error){
            setError("Failed to shuffle deck")
        }
    };

    if (loading) return <p>Loading ...</p>;
    if (error) return <p className="text-red-700">Error: {error}</p>;

    return (
        <>
            <h1 className="font-extrabold text-5xl p-3">Welcome!</h1>
            {error && <p className="text-red-700">Error: {error}</p>}
            <p>Deck ID: {deckId}</p>
            <p>Remaining: {remaining}</p>

           
            <button className="bg-green-500 hover:bg-green-700 p-2 rounded text-white font-medium m-3" onClick={() => drawCards(2)}>Draw 2 Cards</button>
            <button className="bg-violet-500 hover:bg-violet-700 p-2 rounded text-white font-medium m-3" onClick={() => shuffleDeck}>Shuffle Deck</button>
             {/* Draw Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Display Cards */}
                {cards.map(card => (
                    <div key={card.code} className="flex items-center justify-center flex-col ">
                        <img src={card.image} alt={`${card.suit} - ${card.value}`} />
                        <p>{card.value}-{card.suit}</p>
                    </div>

                ))
                }

            </div>

        </>
    )
}

export default Fetch