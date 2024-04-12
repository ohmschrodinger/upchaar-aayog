import { useState } from 'react';
import "./medicine.css"
// eslint-disable-next-line react/prop-types
function Medicine({inputRef}) {
    const [inputValue, setInputValue] = useState('');
    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setErrorMessage('');
    };

    const handleSubmit = async () => {
        if (!inputValue.trim()) {
            setErrorMessage('Please enter a medicine name');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "contents": [{
                        "parts": [{ "text": `${inputValue}Tablet` }]
                    }]
                })
            });
            const data = await response.json();
            setLoading(false);
            if (data.candidates[0].content.parts.length > 0) {
                const { content } = data.candidates[0];
                const responseTextWithoutAsterisks = content.parts[0].text.replace(/\*/g, ' ');
                setResponseText(responseTextWithoutAsterisks);
            } else {
                setResponseText('No response found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        <div className={"medicine-name-container"} >
            <div className={"medicine-name-input-container"}>
                <input ref={inputRef}  type="text" value={inputValue} placeholder={"Enter Medicine Name"} onChange={handleInputChange} required={true}/>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            { loading ? (<div className={"medicine_loading"}><img src={"/loading.svg"}/></div>):
                <p>{responseText}</p>
            }
        </div>
    );
}

export default Medicine;