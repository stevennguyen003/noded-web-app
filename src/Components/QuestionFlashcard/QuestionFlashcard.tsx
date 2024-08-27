import "./index.css";
import { useEffect, useState } from "react";
import * as groupClient from "../../Clients/groupClient";
import * as noteClient from "../../Clients/noteClient";
import * as userClient from "../../Clients/userClient";
import { Quiz } from "../../Clients/noteClient";

interface QuestionFlashcardProps {
    group?: groupClient.Group;
    onUpdateGroup: (updatedGroup: groupClient.Group) => void;
}

// Component to represent the quiz display on the dashboard
function QuestionFlashcard({ group, onUpdateGroup }: QuestionFlashcardProps) {
    // Represents the session user's ID
    const [userId, setUserId] = useState<string | null>(null);
    // Represents all quiz objects for the group
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    // Represents the current quiz index the user is on
    const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
    // // Represents if all quizzes have been completed
    const [isCompleted, setIsCompleted] = useState(false);
    // Represents if an answer has been selected
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    // Represents if the answer feedback is shown
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        // Large function to fetch session user, notes and quiz data
        const fetchData = async () => {
            // Null checker
            if (!group || !group.noteIds || group.noteIds.length === 0) { return; }
            try {
                // Fetch session user and notes
                const [fetchedNotes, profile] = await Promise.all([
                    Promise.all(group.noteIds.map((noteId: any) => noteClient.findNoteById(noteId))),
                    userClient.profile()
                ]);
                // Fetch quizzes
                const fetchedQuizzes = await noteClient.findAllQuizzes(fetchedNotes[0]._id);
                setQuizzes(fetchedQuizzes);
                setUserId(profile._id);
                // User progress persistence
                if (group.userProgress) {
                    const userProgress = group.userProgress[profile._id] || 0;
                    setCurrentQuizIndex(userProgress);
                    setIsCompleted(userProgress >= fetchedQuizzes.length);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [group]);

    // Handle whenever user clicks on an answer
    const handleAnswerClick = (answer: string) => {
        if (showFeedback) return;
        setSelectedAnswer(answer);
        setShowFeedback(true);
    };

    // Handle user navigating to the next question
    const handleNextQuestion = async () => {
        if (!group || !userId) return;
        const currentQuiz = quizzes[currentQuizIndex];
        // Determine if the answer selected was correct
        const isCorrect = currentQuiz && selectedAnswer === currentQuiz.correctAnswer;
        try {
            const updatedGroup = { ...group };
            // If correct, we update the score
            if (isCorrect) {
                updatedGroup.userScores = updatedGroup.userScores || {};
                updatedGroup.userScores[userId] = (updatedGroup.userScores[userId] || 0) + 1;
            }
            // Update user progress
            updatedGroup.userProgress = updatedGroup.userProgress || {};
            updatedGroup.userProgress[userId] = currentQuizIndex + 1;
            // Update the group in the database
            await groupClient.updateGroup(updatedGroup);
            onUpdateGroup(updatedGroup);
            // Move to next question
            setSelectedAnswer(null);
            setShowFeedback(false);
            // Update quiz index
            if (currentQuizIndex + 1 < quizzes.length) {
                setCurrentQuizIndex((prevIndex) => prevIndex + 1);
            } else {
                setIsCompleted(true);
            }
        } catch (error) {
            console.error("Error updating group:", error);
        }
    };

    const currentQuiz = quizzes[currentQuizIndex];

    return (
        <div className="question-flashcard-container">
            <div className="question-flashcard-header">
                <h3>Daily Questions</h3>
                <div className="question-counter">
                    Question {currentQuizIndex + 1}/5
                </div>
            </div>
            <div className="question-flashcard-body-container">
                {isCompleted ? <h1 className="question-flashcard-completed-title">Congratulations! You've completed all questions.</h1>
                    : <>
                        <div className="question-container">
                            {currentQuiz ? currentQuiz.question : <h1>No questions available</h1>}
                        </div>
                        <div className="choices-container">
                            {currentQuiz && Object.entries(currentQuiz.options).map(([key, option]) => (
                                <div
                                    className={`choice ${selectedAnswer === key ? (key === currentQuiz.correctAnswer ? 'correct' : 'incorrect') : ''}`}
                                    key={key}
                                    onClick={() => handleAnswerClick(key)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                        <div className="feedback-container">
                            <button
                                className={`next-button ${!selectedAnswer ? 'disabled' : ''}`}
                                onClick={handleNextQuestion}
                                disabled={!selectedAnswer}
                            >
                                Next Question
                            </button>
                        </div>
                    </>}
            </div>
        </div>
    );
}

export default QuestionFlashcard;
