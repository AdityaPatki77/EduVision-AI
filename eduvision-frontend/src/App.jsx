import React, { useState, useEffect } from 'react';

// Main App Component
export default function App() {
  // State is "lifted" to the parent component to be shared across children
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // For initial video processing
  const [refreshing, setRefreshing] = useState(false); // For refreshing questions
  const [error, setError] = useState(null);

  /**
   * Handles the initial submission to get transcript, summary, and questions.
   */
  const handleProcessVideo = async (e) => {
    if (e) e.preventDefault();
    if (!url) {
      setError("Please enter a YouTube video URL.");
      return;
    }
    setError(null);
    setLoading(true);
    setData(null); // Clear previous results

    try {
      const response = await fetch("http://localhost:8000/process_video", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || "An unknown error occurred.");
      }

      const resultData = await response.json();
      setData(resultData);
    } catch (err) {
      console.error("Error processing video:", err);
      // FIX 1: Used backticks for template literal
      setError(`Failed to process video: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles refreshing only the quiz questions.
   */
  const handleRefreshQuestions = async () => {
    if (!url) {
      setError("Cannot refresh without a video URL.");
      return;
    }
    setError(null);
    setRefreshing(true);

    try {
      const response = await fetch("http://localhost:8000/refresh_questions", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || "An unknown error occurred.");
      }

      const newQuestionsData = await response.json();
      // Update only the questions part of the data state
      setData(prevData => ({ ...prevData, questions: newQuestionsData.questions }));
    } catch (err) {
      console.error("Error refreshing questions:", err);
      // FIX 2: Used backticks for template literal
      setError(`Failed to refresh questions: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };


  // --- Child Components ---

  // VideoInput Component: Now receives state and handlers as props.
  function VideoInput({ url, setUrl, onSubmit, loading, error }) {
    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
        <input
          type="text"
          placeholder="Paste your YouTube video URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-4 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 shadow-md"
          aria-label="YouTube video URL input"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Video...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16"><path d="M8.646 5.354a.5.5 0 0 0 0 .708L11.793 9l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" /><path d="M4.5 5.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" /></svg>
              Generate My Quiz
            </span>
          )}
        </button>
        {error && (
          <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </form>
    );
  }

  // TranscriptSummary Component: Displays transcript, summary, and the quiz.
  function TranscriptSummary({ transcript, summary, questions, onRefresh, isRefreshing }) {
    const [userAnswers, setUserAnswers] = useState(() => questions.map(() => ({ selectedOption: null, isAnswered: false, isCorrect: null })));
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // --- KEY CHANGE FOR SYNCHRONIZATION ---
    // This effect runs whenever the 'questions' prop changes.
    // This ensures that if we get a new set of questions, the quiz UI resets itself.
    useEffect(() => {
      resetQuiz();
    }, [questions]);

    const handleOptionSelect = (questionIndex, optionIndex) => {
      if (showResults) return;
      const updatedAnswers = [...userAnswers];
      updatedAnswers[questionIndex] = { ...updatedAnswers[questionIndex], selectedOption: optionIndex, isAnswered: true };
      setUserAnswers(updatedAnswers);
    };

    const submitQuiz = () => {
      let correctCount = 0;
      const updatedAnswers = userAnswers.map((answer, index) => {
        const question = questions[index];
        const correctIndex = question.options.indexOf(question.answer);
        const isCorrect = answer.selectedOption === correctIndex;
        if (isCorrect) correctCount++;
        return { ...answer, isCorrect };
      });
      setUserAnswers(updatedAnswers);
      setScore(correctCount);
      setShowResults(true);
    };

    const resetQuiz = () => {
      setUserAnswers(questions.map(() => ({ selectedOption: null, isAnswered: false, isCorrect: null })));
      setShowResults(false);
      setScore(0);
    };

    const getScoreColor = () => {
      const percentage = (score / questions.length) * 100;
      if (percentage >= 80) return 'text-green-400';
      if (percentage >= 60) return 'text-yellow-400';
      return 'text-red-400';
    };

    const allAnswered = userAnswers.every(answer => answer.isAnswered);

    return (
      <div className="mt-8 space-y-8 bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-blue-300 mb-3">📝 Transcript</h2>
          <div className="bg-gray-700/50 p-4 rounded-md text-sm max-h-48 overflow-y-auto border border-gray-600">
            <p className="whitespace-pre-wrap">{transcript}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-300 mb-3">📄 Summary</h2>
          <div className="bg-gray-700/50 p-4 rounded-md text-sm border border-gray-600">
            <p>{summary}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-300">🧠 Quiz Time!</h2>
            {showResults && (
              // FIX 3: Used backticks for dynamic className
              <div className={`text-lg font-bold ${getScoreColor()}`}>
                Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
              </div>
            )}
          </div>
          <div className="space-y-6">
            {questions.map((question, qIndex) => {
              const correctIndex = question.options.indexOf(question.answer);
              return (
                <div key={qIndex} className="bg-gray-700/50 p-5 rounded-lg border border-gray-600">
                  <h3 className="font-semibold text-lg mb-4 text-white">{qIndex + 1}. {question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => {
                      const isSelected = userAnswers[qIndex].selectedOption === oIndex;
                      const isCorrectOption = oIndex === correctIndex;
                      let optionClass = "w-full text-left p-3 rounded-md border transition-all duration-200 ";
                      if (showResults) {
                        if (isCorrectOption) optionClass += "bg-green-600 border-green-500 text-white";
                        else if (isSelected && !isCorrectOption) optionClass += "bg-red-600 border-red-500 text-white";
                        else optionClass += "bg-gray-600 border-gray-500 text-gray-300";
                      } else {
                        if (isSelected) optionClass += "bg-blue-600 border-blue-500 text-white";
                        else optionClass += "bg-gray-600 border-gray-500 text-white hover:bg-gray-500";
                      }
                      return (
                        <button key={oIndex} onClick={() => handleOptionSelect(qIndex, oIndex)} disabled={showResults} className={optionClass}>
                          <span className="font-medium mr-2">{String.fromCharCode(65 + oIndex)}.</span>{option}
                          {showResults && isCorrectOption && <span className="float-right text-green-300">✓</span>}
                          {showResults && isSelected && !isCorrectOption && <span className="float-right text-red-300">✗</span>}
                        </button>
                      );
                    })}
                  </div>
                  {showResults && (
                    <div className="mt-4">
                      <div className="p-3 bg-gray-800 rounded-md">
                        {/* FIX 4: Used backticks for dynamic className */}
                        <p className={`text-sm font-medium ${userAnswers[qIndex].isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {userAnswers[qIndex].isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                        </p>
                        {!userAnswers[qIndex].isCorrect && (
                          <p className="text-sm text-gray-300 mt-1">
                            Correct answer: <span className="font-medium text-green-400">{String.fromCharCode(65 + correctIndex)}. {question.answer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-center items-center gap-4">
            {!showResults ? (
              <button
                onClick={submitQuiz}
                disabled={!allAnswered}
                // FIX 5: Used backticks for dynamic className
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${allAnswered ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
              >
                Submit Quiz ({userAnswers.filter(a => a.isAnswered).length}/{questions.length})
              </button>
            ) : (
              <>
                <button onClick={resetQuiz} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200">
                  Try Again
                </button>
                {/* --- NEW REFRESH BUTTON --- */}
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRefreshing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>
                      Refresh Questions
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- UI Sections (Unchanged) ---

  function HeroSection() {
    return (
      <div className="text-center w-full max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center bg-gray-800/80 border border-gray-700 rounded-full px-4 py-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
            <path d="M7.348 2.352a.5.5 0 0 1 .304-.113A.5.5 0 0 1 8 2.5v.025a.5.5 0 0 1 .148.475l.08.24a.5.5 0 0 1-.113.304L7.352 4.652a.5.5 0 0 1-.304.113A.5.5 0 0 1 7 4.5v-.025a.5.5 0 0 1-.148-.475l-.08-.24a.5.5 0 0 1 .113-.304l1.064-1.064zM14 11.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zM2 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm5.5-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-5 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM6.646 5.354a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L8.293 8 6.646 6.354a.5.5 0 0 1 0-.708z" />
          </svg>
          <h1 className="ml-3 text-4xl sm:text-5xl font-extrabold">
            <span className="text-white">EduVision</span> <span className="text-blue-400">AI</span>
          </h1>
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mt-4">
          Transform Any Video
        </h2>
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          into a Learning Experience
        </h2>
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          Our AI analyzes video content and generates interactive quizzes in seconds. Learning just got smarter.
        </p>
        <div className="mt-8 max-w-2xl mx-auto">
          {/* Pass all necessary props to the VideoInput component */}
          <VideoInput
            url={url}
            setUrl={setUrl}
            onSubmit={handleProcessVideo}
            loading={loading}
            error={error}
          />
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-400">
            <span>
              <span className="text-green-400 mr-1">•</span> 10,000+ Videos Processed
            </span>
            <span>
              <span className="text-green-400 mr-1">•</span> 98% Accuracy Rate
            </span>
          </div>
        </div>
      </div>
    );
  }

  function HowItWorks() {
    const steps = [
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.708.819-1z" /><path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.819 1H12a3 3 0 1 0 0-6H9z" /></svg>,
        title: 'Paste a Link',
        description: 'Simply provide the URL of the educational video you want to master.',
      },
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a.5.5 0 0 1 .5.5V3h-1V1.5A.5.5 0 0 1 8 1zm2.5 2.5a.5.5 0 0 1 .5.5V6h-1V4a.5.5 0 0 1 .5-.5zm-5 0a.5.5 0 0 1 .5.5V6h-1V4a.5.5 0 0 1 .5-.5zM8 8a.5.5 0 0 1 .5.5V10h-1V8.5A.5.5 0 0 1 8 8zm-2.5 2.5a.5.5 0 0 1 .5.5v2.293l-1.146-1.147a.5.5 0 0 1 .708-.708L8 12.293l1.146-1.147a.5.5 0 1 1 .708.708L8.5 13.293V11a.5.5 0 0 1 .5-.5zm5-2.5a.5.5 0 0 1 .5.5V10h-1V8.5a.5.5 0 0 1 .5-.5z" /><path d="M4.5 2.5c.625-1.282 2.115-2 3.5-2s2.875.718 3.5 2h-7zM3 4.5c-1.282.625-2 2.115-2 3.5s.718 2.875 2 3.5v-7zm10 0v7c1.282-.625 2-2.115 2-3.5s-.718-2.875-2-3.5zM4.5 13.5h7c-.625 1.282-2.115 2-3.5 2s-2.875-.718-3.5-2z" /></svg>,
        title: 'AI Magic',
        description: 'Our AI processes the transcript, context, and key concepts to build a comprehensive quiz.',
      },
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg>,
        title: 'Start Learning',
        description: 'Test your knowledge with an interactive quiz designed to maximize retention.',
      },
    ];

    return (
      <div className="py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white">How It Works</h2>
          <p className="mt-4 text-lg text-gray-400">
            Three simple steps to never miss the key concepts in any educational video again.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 text-center flex flex-col items-center shadow-lg hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
                  {step.icon}
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-base text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function KeyFeatures() {
    const features = [
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1z" /></svg>,
        title: 'Instant Summaries',
        description: 'Get key takeaways and main concepts from any video in seconds, perfectly organized for quick review.',
      },
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM4 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V1z" /><path d="M6 3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z" /></svg>,
        title: 'Customizable Quizzes',
        description: 'Choose difficulty levels, question types, and quiz length to match your learning preferences.',
      },
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M1 11.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm1-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm-1-4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z" /></svg>,
        title: 'Performance Tracking',
        description: 'Monitor your progress with detailed analytics and see how your knowledge improves over time.',
      },
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.5 6.5A1.5 1.5 0 0 1 6 5h4a1.5 1.5 0 0 1 1.5 1.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 0 10 6H6a.5.5 0 0 0-.5.5v1a.5.5 0 0 1-1 0v-1zM11 10.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z" /></svg>,
        title: 'Multiple Languages',
        description: 'Supports educational content in various languages with accurate transcription and analysis.',
      },
    ];

    return (
      <div className="py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white">Key Features</h2>
          <p className="mt-4 text-lg text-gray-400">
            Built with cutting-edge technology for reliable and intelligent learning management.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-lg hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8 sm:py-16 space-y-12">
      <main className="w-full max-w-7xl mx-auto">
        <HeroSection />
        {data && (
          <div className="mt-12 w-full max-w-4xl mx-auto">
            <TranscriptSummary
              transcript={data.transcript}
              summary={data.summary}
              questions={data.questions}
              onRefresh={handleRefreshQuestions}
              isRefreshing={refreshing}
            />
          </div>
        )}
        <HowItWorks />
        <KeyFeatures />
      </main>
      <footer className="text-center text-gray-500 py-6">
        <p>&copy; 2025 EduVision AI. All rights reserved.</p>
      </footer>
    </div>
  );
}