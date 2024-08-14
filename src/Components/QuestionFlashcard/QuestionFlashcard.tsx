import "./index.css";
import { useEffect, useState } from "react";
import * as groupClient from "../../Clients/groupClient"
import * as noteClient from "../../Clients/noteClient";
import * as userClient from "../../Clients/userClient";
import { Quiz } from "../../Clients/noteClient";

interface QuestionFlashcardProps {
    group?: groupClient.Group;
    onUpdateGroup: (updatedGroup: groupClient.Group) => void;
}

function QuestionFlashcard({ group, onUpdateGroup }: QuestionFlashcardProps) {
    // Represents the session user's ID
    const [userId, setUserId] = useState<string | null>(null);
    // Represents all quiz objects for the group
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    // Represents the current quiz index the user is on
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    // Represents if all quizzes have been completed
    const [isCompleted, setIsCompleted] = useState(false);
    // Fetch notes uploaded to the group
    useEffect(() => {
        const fetchNotes = async () => {
            if (!group || !group.noteIds || group.noteIds.length === 0) return;
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
        };
        const fetchUserId = async () => {
            try {
                const profile = await userClient.profile();
                setUserId(profile._id);
                if (group?.userProgress) {
                    const userProgress = group.userProgress[profile._id] || 0;
                    setCurrentQuizIndex(userProgress);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchNotes();
        fetchUserId();
    }, [group, quizzes.length]);

    // Handle quiz submission
    const handleAnswerClick = async (selectedAnswer: string) => {
        if (!group || !userId) return;
        try {
            const updatedGroup = { ...group };
            const currentQuiz = quizzes[currentQuizIndex];

            // Increment user's score if the answer is correct
            if (currentQuiz && selectedAnswer === currentQuiz.correctAnswer) {
                updatedGroup.userScores = updatedGroup.userScores || {};
                updatedGroup.userScores[userId] = (updatedGroup.userScores[userId] || 0) + 1;
            }

            // Increment user's progress regardless of the answer
            updatedGroup.userProgress = updatedGroup.userProgress || {};
            updatedGroup.userProgress[userId] = (updatedGroup.userProgress[userId] || 0) + 1;

            // Update the group in the database
            await groupClient.updateGroup(updatedGroup);
            console.log("Group updated successfully");

            // Fetch and update the refreshed group
            const refreshedGroup = await groupClient.findGroupById(group._id);
            onUpdateGroup(refreshedGroup);

            // Move to the next quiz or complete
            if (currentQuizIndex + 1 < quizzes.length) {
                setCurrentQuizIndex(prevIndex => prevIndex + 1);
            } else {
                setIsCompleted(true);
            }
        } catch (error) {
            console.error("Error updating group:", error);
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