import "./index.css";
import { useEffect, useCallback, useState } from "react";
import * as groupClient from "../../Clients/groupClient"
import * as noteClient from "../../Clients/noteClient";
import { Quiz } from "../../Clients/noteClient";

interface QuestionFlashcardProps { group?: groupClient.Group; }

function QuestionFlashcard({ group }: QuestionFlashcardProps) {
    // Represents all quiz objects for the group
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    // Represents the current quiz index the user is on
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    // Represents if all quizzes have been completed
    const [isCompleted, setIsCompleted] = useState(false);
    // Fetch notes uploaded to the group
    const fetchNotes = useCallback(async () => {
        if (!group) return;
        try {
            const fetchedNotes = await Promise.all(
                group.noteIds.map((noteId: any) => noteClient.findNoteById(noteId))
            );
            console.log("Fetched notes:", fetchedNotes);
            const fetchedQuizzes = await noteClient.findAllQuizzes(fetchedNotes[0]._id);
            console.log("Fetched quizzes:", fetchedQuizzes);
            setQuizzes(fetchedQuizzes);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }, [group]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // Handle quiz submission
    const handleAnswerClick = (selectedAnswer: string) => {
        const currentQuiz = quizzes[currentQuizIndex];
        if (currentQuiz && selectedAnswer === currentQuiz.correctAnswer) {
            if (currentQuizIndex + 1 < quizzes.length) {
                setCurrentQuizIndex(prevIndex => prevIndex + 1);
            } else {
                setIsCompleted(true);
            }
        }
    };

    if (isCompleted) {
        return (
            <div className="question-flashcard-container">
                <h1>Congratulations! You've completed all questions.</h1>
            </div>
        );
    }

    const currentQuiz = quizzes[currentQuizIndex];

    return (
        <div className="question-flashcard-container">
            <div className="question-flashcard-header">
                <h1>Daily Question</h1>
            </div>
            <div className="question-flashcard-body-container">
                <div className="question-container">
                    {currentQuiz ? (
                        <>
                            <span>Question {currentQuizIndex + 1}: </span>
                            {currentQuiz.question}
                        </>
                    ) : "No questions available"}
                </div>
                <div className="choices-container">
                    {currentQuiz && Object.entries(currentQuiz.options).map(([key, option]) => (
                        <div
                            className="choice"
                            id={`option-${key}`}
                            key={key}
                            onClick={() => handleAnswerClick(key)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default QuestionFlashcard;