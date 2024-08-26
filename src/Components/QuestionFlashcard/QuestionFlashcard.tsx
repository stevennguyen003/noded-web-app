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
    // Represents if all quizzes have been completed
    const [isCompleted, setIsCompleted] = useState(false);
    // Represents the loading state
    const [isLoading, setIsLoading] = useState(true);
    // Represents if an answer has been selected
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    // Represents if the answer feedback is shown
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        // Reset state when group changes
        setIsLoading(true);
        setQuizzes([]);
        setCurrentQuizIndex(0);
        setIsCompleted(false);
        setSelectedAnswer(null);
        setShowFeedback(false);

        const fetchData = async () => {
            if (!group || !group.noteIds || group.noteIds.length === 0) {
                setIsLoading(false);
                return;
            }
            try {
                const [fetchedNotes, profile] = await Promise.all([
                    Promise.all(group.noteIds.map((noteId: any) => noteClient.findNoteById(noteId))),
                    userClient.profile()
                ]);

                const fetchedQuizzes = await noteClient.findAllQuizzes(fetchedNotes[0]._id);
                setQuizzes(fetchedQuizzes);
                setUserId(profile._id);

                if (group.userProgress) {
                    const userProgress = group.userProgress[profile._id] || 0;
                    setCurrentQuizIndex(userProgress);
                    setIsCompleted(userProgress >= fetchedQuizzes.length);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [group]);

    // Handle quiz submission
    const handleAnswerClick = async (answer: string) => {
        if (!group || !userId || showFeedback) return;

        setSelectedAnswer(answer);
        setShowFeedback(true);

        try {
            const updatedGroup = { ...group };
            const currentQuiz = quizzes[currentQuizIndex];

            // Increment user's score if the answer is correct
            if (currentQuiz && answer === currentQuiz.correctAnswer) {
                updatedGroup.userScores = updatedGroup.userScores || {};
                updatedGroup.userScores[userId] = (updatedGroup.userScores[userId] || 0) + 1;
            }

            // Update the group in the database
            await groupClient.updateGroup(updatedGroup);
            console.log("Group updated successfully");

            // Fetch and update the refreshed group
            const refreshedGroup = await groupClient.findGroupById(group._id);
            onUpdateGroup(refreshedGroup);
        } catch (error) {
            console.error("Error updating group:", error);
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setShowFeedback(false);

        if (currentQuizIndex + 1 < quizzes.length) {
            setCurrentQuizIndex((prevIndex) => prevIndex + 1);
        } else {
            setIsCompleted(true);
            // Update user streak here if needed
        }

        // Increment user's progress
        if (group && userId) {
            const updatedGroup = { ...group };
            updatedGroup.userProgress = updatedGroup.userProgress || {};
            updatedGroup.userProgress[userId] = (updatedGroup.userProgress[userId] || 0) + 1;
            groupClient.updateGroup(updatedGroup).then(() => {
                groupClient.findGroupById(group._id).then(onUpdateGroup);
            });
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
            {isLoading ? (
                <div className="loading-spinner"></div>
            ) : (
                <div className="question-flashcard-body-container">
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
                </div>
            )}
        </div>
    );
}

export default QuestionFlashcard;
