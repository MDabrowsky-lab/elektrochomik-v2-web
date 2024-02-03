import React, { useEffect, useRef, useState } from 'react';
import { data } from '../assets/data.js';
import Timer from '../components/Timer.jsx';
import correctAudio from "../assets/correct.mp3";
import wrongAudio from "../assets/wrong.mp3";
import clickAudio from '../assets/click.mp3'
import logo from "../assets/logo.jpg";
import CustomIcon from '../components/CustomIcon.jsx';

function Quiz() {
    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isEnd, setIsEnd] = useState(false);
    const [buttonClassName, setButtonClassName] = useState({first: "answer-button", second: "answer-button"});
    const [progress, setProgress] = useState(0);
    const [seconds, setSeconds] = useState(0);

    // // Sound Effect by <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=124464">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=124464">Pixabay</a>
    // const audioC = new Audio(correctAudio);
    
    // // Sound Effect by <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=129254">UNIVERSFIELD</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=129254">Pixabay</a>
    // const audioW = new Audio(wrongAudio);

    // Sound Effect by <a href="https://pixabay.com/users/floraphonic-38928062/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=186531">floraphonic</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=186531">Pixabay</a>
    const audioClick = new Audio(clickAudio);
    audioClick.volume = 0.2;

    const div = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, []);

    useEffect(() => {
        generateQuestions();
        console.log("Hello world!");

        useEffect(() => {
            console.log("Hello world v2!");
        })
    }, []);

    useEffect(() => {
        if(progress == 100) finishQuiz();
    }, [progress])

    useEffect(() => {
        setProgress(Math.round(((currentIndex+1)/25)*100));
    }, [currentIndex])

    useEffect(() => {
        if (selectedQuestions.length > 0 && currentIndex < selectedQuestions.length) {
            setCurrentQuestion(selectedQuestions[currentIndex]);
        }
    }, [selectedQuestions, currentIndex]);


    function generateQuestions() {
        const selected = [];
        for (let i = 0; i < 25; i++) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            selected.push(questions[randomIndex]);

            setQuestions((prevQuestions) =>
                prevQuestions.filter((question, index) => index !== randomIndex)
            );
        }
        setSelectedQuestions(selected);
    }

    function checkQuestion(condition) {
        audioClick.play();
        if(currentQuestion) {
            if (currentIndex < 24) {
                if(condition === currentQuestion.answer) {
                    if(condition) setButtonClassName({first: "answer-button correct clicked", second: "answer-button"})
                    else setButtonClassName({first: "answer-button", second: "answer-button correct clicked"});
                    setTimeout(() => {
                        goToAnotherQuestion(true);
                    }, 1000);
                } else {
                    if(condition) setButtonClassName({first: "answer-button wrong clicked", second: "answer-button correct"})
                    else setButtonClassName({first: "answer-button correct", second: "answer-button wrong clicked"});
                    setTimeout(() => {
                        goToAnotherQuestion(false);
                    }, 1000);
                } 
            }
        }
    }

    function goToAnotherQuestion(isCorrect) {
        setButtonClassName({first: "answer-button", second: "answer-button"});

        setAnsweredQuestions([...answeredQuestions, isCorrect]);
        setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore - 2));
        setCurrentIndex((prevIndex) => prevIndex + 1);

        setTimeout(() => {
            div.current.scrollIntoView({ behavior: "smooth", block: "start" })

        }, 500);

    }

    function finishQuiz() {
        setProgress(100);
        setIsEnd(true);
    }


    return (
        <div className="quiz-container">
            {!isEnd && <div className="counter-space">
                <div className="counter-wrapper">
                    <div className="cv-top">
                        <div className="counter-text">Pytanie {currentIndex + 1} z 24</div>
                        <div className="nothing">01010000 01101111 01110111 01101111 01100100 01111010 01100101 01101110 01101001 01100001 00100000 00111011 00101001</div>
                        <div className="counter-timer">
                            <Timer stop={false} color={false} seconds={seconds}/>
                        </div>
                    </div>
                    <div className="counter-visual">
                        <div className='cv-bar' style={{width: `${progress}%`}}></div>
                    </div>
                </div>
            </div>
}
            {!isEnd ? <div className="wrapper">
                <div className="question-space" ref={div}>
                    <div className="question-subtext">
                        <CustomIcon icon={currentQuestion.icon} />
                        {currentQuestion.chapter}</div>
                    <div className="question-text">{currentQuestion.question}</div>
                </div>
                <div className="answers-space">
                    <button className={buttonClassName.first} onClick={() => checkQuestion(true)}>Tak</button>
                    <button className={buttonClassName.second} onClick={() => checkQuestion(false)}>Nie</button>
                </div>
            </div> :  
                <div className="final-answers-container">
                    <div className="final-score">
                       <div className="fs-wrapper">
                            <img src={logo} width={200}/>
                            <div className="fs-text">
                            WYNIK: <span style={{color: score >= 13 ? "green" : "red"}} > {score >= 13 ? "Pozytywny" : "Negatywny"}</span>
                            </div>
                            <div className="fs-subtext">
                                Zdobyłeś/aś <span style={{fontWeight: 500, color: "#2097bb"}}> {score} </span> punktów! <br />
                                Ukończyłeś test w czasie <Timer stop={true} color={true} seconds={seconds}/>
                            </div>
                            <div className="try-again-container">
                                <button onClick={() => window.location.reload(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-reload" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" /><path d="M20 4v5h-5" /></svg>
                                Ponów</button>
                            </div>
                       </div>
                    </div>
                    <ul className='fa-wrapper'>
                        <h2>Twoje odpowiedzi:</h2>
                        {selectedQuestions.map((question, index) => {
                            return <li className={answeredQuestions[index] ? "correct" : "wrong"}>{question.question}</li>
                        })}
                    </ul>
                </div>
                
            }
        </div>
    );
}

export default Quiz;
