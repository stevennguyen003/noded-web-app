import "./index.css";
import { useEffect, useCallback, useState } from "react";
import * as userClient from "../../Clients/userClient";
import * as groupClient from "../../Clients/groupClient"
import * as noteClient from "../../Clients/noteClient";
import { Note } from "../../Clients/noteClient";
import { Quiz } from "../../Clients/noteClient";

interface QuestionFlashcardProps { group?: groupClient.Group; }

function QuestionFlashcard({ group }: QuestionFlashcardProps) {
    // Represents all the notes associated with the group
    const [notes, setNotes] = useState<Note[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    // Fetch notes uploaded to the group
    const fetchNotes = useCallback(async () => {
        if (!group || !group.noteIds) return;
        try {
            if (group.noteIds && group.noteIds.length > 0) {
                const fetchedNotes = await Promise.all(
                    group.noteIds.map((noteId: any) => noteClient.findNoteById(noteId))
                );
                console.log("Fetched notes:", fetchedNotes);
                setNotes(fetchedNotes);
                const fetchedQuizzes = await noteClient.findAllQuizzes(fetchedNotes[0]._id);
                console.log("Fetched quizzes:", fetchedQuizzes);
                setQuizzes(fetchedQuizzes);
            } else {
                setNotes([]);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }, []);

    useEffect(() => {
        console.log("Rendered");
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div className="question-flashcard-container">
            <div className="question-flashcard-header">
                <h1>Daily Question</h1>
            </div>
            <div className="question-flashcard-body-container">
                <div className="question-container">
                    {quizzes.length > 0 ? quizzes[1].question : "No questions available"}
                </div>
                <div className="choices-container">
                    {quizzes.length > 0 && quizzes[1].options.map((option, index) => (
                        <div className="choice" id={`option-${index}`} key={index}>
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default QuestionFlashcard;