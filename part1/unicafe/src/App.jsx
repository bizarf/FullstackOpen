import { useState } from "react";

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const total = good + neutral + bad;

    const Statistics = ({ total, good, neutral, bad }) => {
        return (
            <>
                <div>
                    <h1>Give Feedback</h1>
                    <Button handleClick={() => setGood(good + 1)} text="Good" />
                    <Button
                        handleClick={() => setNeutral(neutral + 1)}
                        text="Neutral"
                    />
                    <Button handleClick={() => setBad(bad + 1)} text="Bad" />
                </div>
                <div>
                    <h2>Statistics</h2>
                    {good > 0 || neutral > 0 || bad > 0 ? (
                        <table>
                            <tbody>
                                <StatisticLine text="Good" value={good} />
                                <StatisticLine text="Neutral" value={neutral} />
                                <StatisticLine text="Bad" value={bad} />
                                <StatisticLine text="All" value={total} />
                                <StatisticLine
                                    text="Average"
                                    value={(good * 1 + bad * -1) / total}
                                />
                                <StatisticLine
                                    text="Positive"
                                    value={(good / total) * 100 + "%"}
                                />
                            </tbody>
                        </table>
                    ) : (
                        <p>No feedback given</p>
                    )}
                </div>
            </>
        );
    };

    const Button = ({ handleClick, text }) => {
        return <button onClick={handleClick}>{text}</button>;
    };

    const StatisticLine = ({ text, value }) => {
        return (
            <tr>
                <td>{text}</td>
                <td>{value}</td>
            </tr>
        );
    };

    return (
        <div>
            <Statistics good={good} neutral={neutral} bad={bad} total={total} />
        </div>
    );
};

export default App;
