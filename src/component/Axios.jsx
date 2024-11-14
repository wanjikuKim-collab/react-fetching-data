import axios from 'axios'

export const fetchWithAxios = async(url)=>{
    const response = await axios.get(url);
    return response.data;
}

export async function createWithAxios(){
    try{
        const response = await axios.post("http://localhost:3001/players",{
            
                name: "Angel",
                email: "angel@gmail.com",
                score: "20",              
        });
        //this logs the full ressponse object
        console.log("Full response:", response)

        // Check for specific success status code
        if(response.status === 201){
            console.log(`Player successfully created`, response.data);
        }else{
            console.log('Unexpected  response status:', response.status)
        }

    }catch(error){
        console.error('Error adding player:', error.message);
    }
}

createWithAxios()