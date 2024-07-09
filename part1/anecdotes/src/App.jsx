import { useState } from "react";

const App = () => {
    const anecdotes = [
        "If it hurts, do it more often.",
        "Adding manpower to a late software project makes it later!",
        "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "Premature optimization is the root of all evil.",
        "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
        "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
        "The only way to go fast, is to go well.",
    ];

    const [selected, setSelected] = useState(0);
    const [points, setPoints] = useState({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
    });

    // sort and return the highest key and value from the object
    const highestVote = Object.entries(points).sort(([, a], [, b]) => b - a)[0];

    const NumberOfVotes = ({ points, selected }) => {
        return <p>Has {points[selected]} votes</p>;
    };

    const SelectedAnecdote = ({ anecdotes, value }) => {
        return <p>{anecdotes[value]}</p>;
    };

    return (
        <>
            <div>
                <div>
                    <h1>Anecdote of the day</h1>
                    <SelectedAnecdote anecdotes={anecdotes} value={selected} />
                    <NumberOfVotes points={points} selected={selected} />
                </div>
                <button
                    onClick={() => {
                        const copy = { ...points };
                        copy[selected] += 1;
                        setPoints(copy);
                    }}
                >
                    Vote
                </button>
                <button
                    onClick={() =>
                        setSelected(
                            Math.floor(Math.random() * anecdotes.length)
                        )
                    }
                >
                    Next Anecdote
                </button>
            </div>
            <div>
                <h2>Anecdote with most votes</h2>
                <SelectedAnecdote
                    anecdotes={anecdotes}
                    value={highestVote[0]}
                />
                <NumberOfVotes points={highestVote} selected={1} />
            </div>
        </>
    );
};

export default App;
