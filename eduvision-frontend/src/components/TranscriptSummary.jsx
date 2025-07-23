// import React, { useState } from 'react';

// function TranscriptSummary({ transcript, summary, questions }) {
//   // Initialize state for user answers and results tracking
//   const [userAnswers, setUserAnswers] = useState(
//     () => questions.map(() => ({
//       selectedOption: null,
//       isAnswered: false,
//       isCorrect: null
//     }))
//   );
  
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0);

//   // Handle user selecting a quiz option
//   const handleOptionSelect = (questionIndex, optionIndex) => {
//     // Prevent changes after the quiz is submitted
//     if (showResults) return;

//     const updatedAnswers = [...userAnswers];
//     updatedAnswers[questionIndex] = {
//       selectedOption: optionIndex,
//       isAnswered: true,
//       isCorrect: null
//     };
//     setUserAnswers(updatedAnswers);
//   };

//   // Check the answers and calculate the score
//   const submitQuiz = () => {
//     let correctCount = 0;
//     const updatedAnswers = userAnswers.map((answer, index) => {
//       const question = questions[index];
//       // Find the index of the correct answer string in the options array
//       const correctIndex = question.options.indexOf(question.answer);
//       const isCorrect = answer.selectedOption === correctIndex;
      
//       if (isCorrect) {
//         correctCount++;
//       }
      
//       return { ...answer, isCorrect };
//     });
    
//     setUserAnswers(updatedAnswers);
//     setScore(correctCount);
//     setShowResults(true);
//   };

//   // Reset the quiz to its initial state
//   const resetQuiz = () => {
//     setUserAnswers(questions.map(() => ({ 
//       selectedOption: null, 
//       isAnswered: false,
//       isCorrect: null 
//     })));
//     setShowResults(false);
//     setScore(0);
//   };

//   // Determine the color for the score based on percentage
//   const getScoreColor = () => {
//     const percentage = (score / questions.length) * 100;
//     if (percentage >= 80) return 'text-green-400';
//     if (percentage >= 60) return 'text-yellow-400';
//     return 'text-red-400';
//   };
  
//   // Check if all questions have been answered
//   const allAnswered = userAnswers.every(answer => answer.isAnswered);

//   return (
//     <div className="mt-8 space-y-6">
//       {/* Transcript Section */}
//       <div>
//         <h2 className="text-xl font-bold text-blue-300 mb-2">📝 Transcript</h2>
//         <div className="bg-gray-700 p-4 rounded-md text-sm max-h-60 overflow-y-auto">
//           <p className="whitespace-pre-wrap">{transcript}</p>
//         </div>
//       </div>

//       {/* Summary Section */}
//       <div>
//         <h2 className="text-xl font-bold text-green-300 mb-2">📄 Summary</h2>
//         <p className="bg-gray-700 p-4 rounded-md text-sm">{summary}</p>
//       </div>

//       {/* MCQ Quiz Section */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-yellow-300">🧠 Quiz Time!</h2>
//           {showResults && (
//             // FIXED: Corrected JSX template literal syntax for className
//             <div className={`text-lg font-bold ${getScoreColor()}`}>
//               Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
//             </div>
//           )}
//         </div>

//         <div className="space-y-6">
//           {questions.map((question, questionIndex) => {
//             // FIXED: Derived the correct index from the question's answer string
//             const correctIndex = question.options.indexOf(question.answer);
            
//             return (
//               <div 
//                 key={questionIndex} 
//                 className="bg-gray-700 p-5 rounded-lg border border-gray-600"
//               >
//                 <h3 className="font-semibold text-lg mb-4 text-white">
//                   {questionIndex + 1}. {question.question}
//                 </h3>
                
//                 <div className="space-y-2">
//                   {question.options.map((option, optionIndex) => {
//                     const isSelected = userAnswers[questionIndex].selectedOption === optionIndex;
//                     const isCorrectOption = optionIndex === correctIndex;
                    
//                     let optionClass = "w-full text-left p-3 rounded-md border transition-all duration-200 ";
                    
//                     if (showResults) {
//                       if (isCorrectOption) {
//                         optionClass += "bg-green-600 border-green-500 text-white";
//                       } else if (isSelected && !isCorrectOption) {
//                         optionClass += "bg-red-600 border-red-500 text-white";
//                       } else {
//                         optionClass += "bg-gray-600 border-gray-500 text-gray-300";
//                       }
//                     } else {
//                       if (isSelected) {
//                         optionClass += "bg-blue-600 border-blue-500 text-white";
//                       } else {
//                         optionClass += "bg-gray-600 border-gray-500 text-white hover:bg-gray-500";
//                       }
//                     }

//                     return (
//                       <button
//                         key={optionIndex}
//                         onClick={() => handleOptionSelect(questionIndex, optionIndex)}
//                         disabled={showResults}
//                         className={optionClass}
//                       >
//                         <span className="font-medium mr-2">
//                           {String.fromCharCode(65 + optionIndex)}.
//                         </span>
//                         {option}
//                         {showResults && isCorrectOption && (
//                           <span className="float-right text-green-300">✓</span>
//                         )}
//                         {showResults && isSelected && !isCorrectOption && (
//                           <span className="float-right text-red-300">✗</span>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {showResults && (
//                   <div className="mt-3 p-3 bg-gray-800 rounded-md">
//                     {/* FIXED: Corrected JSX template literal syntax for className */}
//                     <p className={`text-sm font-medium ${userAnswers[questionIndex].isCorrect ? 'text-green-400' : 'text-red-400'}`}>
//                       {userAnswers[questionIndex].isCorrect ? '✅ Correct!' : '❌ Incorrect'}
//                     </p>
//                     {!userAnswers[questionIndex].isCorrect && (
//                       <p className="text-sm text-gray-300 mt-1">
//                         Correct answer: <span className="font-medium text-green-400">
//                           {/* FIXED: Used derived correctIndex and question.answer */}
//                           {String.fromCharCode(65 + correctIndex)}. {question.answer}
//                         </span>
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </div>

//         {/* Quiz Controls */}
//         <div className="mt-6 flex justify-center gap-4">
//           {!showResults ? (
//             <button
//               onClick={submitQuiz}
//               disabled={!allAnswered}
//               className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
//                 allAnswered 
//                   ? 'bg-green-600 hover:bg-green-700 text-white' 
//                   : 'bg-gray-600 text-gray-400 cursor-not-allowed'
//               }`}
//             >
//               Submit Quiz ({userAnswers.filter(a => a.isAnswered).length}/{questions.length})
//             </button>
//           ) : (
//             <button
//               onClick={resetQuiz}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
//             >
//               Try Again
//             </button>
//           )}
//         </div>

//         {showResults && (
//           <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
//             <h3 className="text-lg font-bold text-center mb-2">Quiz Results</h3>
//             <div className="text-center">
//               <p className="text-gray-300">
//                 {/* FIXED: Corrected JSX template literal syntax for className */}
//                 You answered <span className={`font-bold ${getScoreColor()}`}>{score}</span> out of {questions.length} questions correctly.
//               </p>
//               <p className="text-sm text-gray-400 mt-1">
//                 {score === questions.length ? "Perfect score! 🎉" : 
//                  score >= questions.length * 0.8 ? "Great job! 👏" :
//                  score >= questions.length * 0.6 ? "Good effort! 👍" :
//                  "Keep practicing! 💪"}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TranscriptSummary;