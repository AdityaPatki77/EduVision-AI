import React, { useState, useEffect, useRef } from 'react';
// --- NEW: Import Clerk components ---
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// --- Enhanced Header Component with improved dark theme ---
function Header() {
  return (
    <header className="relative z-20 flex justify-between items-center p-6 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-white" viewBox="0 0 16 16">
            <path d="M7.348 2.352a.5.5 0 0 1 .304-.113A.5.5 0 0 1 8 2.5v.025a.5.5 0 0 1 .148.475l.08.24a.5.5 0 0 1-.113.304L7.352 4.652a.5.5 0 0 1-.304.113A.5.5 0 0 1 7 4.5v-.025a.5.5 0 0 1-.148-.475l-.08-.24a.5.5 0 0 1 .113-.304l1.064-1.064zM14 11.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zM2 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm5.5-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-5 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM6.646 5.354a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L8.293 8 6.646 6.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-slate-100">EduVision</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 ml-1">AI</span>
        </h1>
      </div>
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 border border-slate-700/60 hover:border-slate-600/60 shadow-lg hover:shadow-xl">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="p-1 bg-slate-800 rounded-xl border border-slate-700/60">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </header>
  );
}

// --- Enhanced VideoInput Component ---
function VideoInput({ url, setUrl, onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
      <div className="relative group">
        <input
          type="text"
          placeholder="Paste your YouTube video URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-5 rounded-2xl bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/60 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/80 focus:bg-slate-800/80 text-lg"
          aria-label="YouTube video URL input"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      <button
        type="submit"
        disabled={loading || !url}
        className="group w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:shadow-none text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Video...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-3 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 16 16">
              <path d="M8.646 5.354a.5.5 0 0 0 0 .708L11.793 9l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
              <path d="M4.5 5.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
            </svg>
            Generate My Learning Quiz
          </span>
        )}
      </button>

      {error && (
        <div className="bg-red-950/60 border border-red-700/60 text-red-300 p-4 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}
    </form>
  );
}

// --- Enhanced TranscriptSummary Component ---
function TranscriptSummary({ transcript, summary, questions, onRefresh, isRefreshing }) {
  const [userAnswers, setUserAnswers] = useState(() => questions.map(() => ({ selectedOption: null, isAnswered: false, isCorrect: null })));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

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
    if (percentage >= 80) return 'text-emerald-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const allAnswered = userAnswers.every(answer => answer.isAnswered);

  return (
    <div className="mt-12 space-y-10 bg-slate-800/40 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
      {/* Transcript Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-300">Video Transcript</h2>
        </div>
        <div className="bg-slate-900/60 p-6 rounded-2xl text-sm max-h-56 overflow-y-auto border border-slate-700/50 backdrop-blur-sm">
          <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{transcript}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-emerald-300">Key Insights</h2>
        </div>
        <div className="bg-slate-900/60 p-6 rounded-2xl text-sm border border-slate-700/50 backdrop-blur-sm">
          <p className="text-slate-300 leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Quiz Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-purple-300">Interactive Quiz</h2>
          </div>
          {showResults && (
            <div className={`text-xl font-bold px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 ${getScoreColor()}`}>
              Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </div>
          )}
        </div>

        <div className="space-y-8">
          {questions.map((question, qIndex) => {
            const correctIndex = question.options.indexOf(question.answer);
            return (
              <div key={qIndex} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all duration-300">
                <h3 className="font-semibold text-lg mb-6 text-slate-100 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-full mr-4">
                    {qIndex + 1}
                  </span>
                  {question.question}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, oIndex) => {
                    const isSelected = userAnswers[qIndex].selectedOption === oIndex;
                    const isCorrectOption = oIndex === correctIndex;
                    let optionClass = "w-full text-left p-4 rounded-xl border transition-all duration-300 group ";

                    if (showResults) {
                      if (isCorrectOption) {
                        optionClass += "bg-emerald-950/60 border-emerald-500/60 text-emerald-100 shadow-lg shadow-emerald-500/20";
                      } else if (isSelected && !isCorrectOption) {
                        optionClass += "bg-red-950/60 border-red-500/60 text-red-100 shadow-lg shadow-red-500/20";
                      } else {
                        optionClass += "bg-slate-800/60 border-slate-700/50 text-slate-400";
                      }
                    } else {
                      if (isSelected) {
                        optionClass += "bg-blue-950/60 border-blue-500/60 text-blue-100 shadow-lg shadow-blue-500/20";
                      } else {
                        optionClass += "bg-slate-800/60 border-slate-700/50 text-slate-200 hover:bg-slate-700/60 hover:border-slate-600/50 hover:shadow-lg";
                      }
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleOptionSelect(qIndex, oIndex)}
                        disabled={showResults}
                        className={optionClass}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-bold mr-4 text-lg">{String.fromCharCode(65 + oIndex)}.</span>
                            <span className="text-left">{option}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {showResults && isCorrectOption && (
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {showResults && isSelected && !isCorrectOption && (
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="mt-6">
                    <div className={`p-4 rounded-xl border ${userAnswers[qIndex].isCorrect ? 'bg-emerald-950/40 border-emerald-700/50' : 'bg-red-950/40 border-red-700/50'}`}>
                      <p className={`text-sm font-medium ${userAnswers[qIndex].isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                        {userAnswers[qIndex].isCorrect ? '✅ Perfect! You got it right!' : '❌ Not quite right, but great effort!'}
                      </p>
                      {!userAnswers[qIndex].isCorrect && (
                        <p className="text-sm text-slate-400 mt-2">
                          <span className="text-emerald-400 font-medium">Correct answer:</span> {String.fromCharCode(65 + correctIndex)}. {question.answer}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center items-center gap-6 flex-wrap">
          {!showResults ? (
            <button
              onClick={submitQuiz}
              disabled={!allAnswered}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 text-lg ${allAnswered
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105'
                  : 'bg-slate-700/60 text-slate-400 cursor-not-allowed border border-slate-600/50'
                }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Submit Quiz ({userAnswers.filter(a => a.isAnswered).length}/{questions.length})
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={resetQuiz}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 text-lg"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Try Again
                </span>
              </button>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-lg"
              >
                {isRefreshing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                    </svg>
                    New Questions
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Enhanced Chatbot Component ---
function Chatbot({ chatHistory, onSendMessage, isLoading, error }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="mt-12 bg-slate-800/40 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-violet-300">AI Learning Assistant</h2>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 h-96 flex flex-col backdrop-blur-sm">
        <div className="flex-grow overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {chatHistory.length === 0 && (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Ask me anything about the video!</p>
              </div>
            </div>
          )}

          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-5 py-3 rounded-2xl text-white shadow-lg ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 ml-12'
                  : 'bg-gradient-to-r from-slate-700 to-slate-600 mr-12'
                }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs px-5 py-3 rounded-2xl text-white bg-gradient-to-r from-slate-700 to-slate-600 mr-12">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-slate-300">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the video content..."
              className="flex-grow p-4 rounded-2xl bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 border border-slate-700/60 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/80 focus:bg-slate-800/80"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 disabled:transform-none"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
              </svg>
            </button>
          </form>
          {error && (
            <p className="text-red-400 text-sm mt-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Enhanced HeroSection Component ---
function HeroSection({ url, setUrl, onSubmit, loading, error }) {
  return (
    <div className="text-center w-full max-w-5xl mx-auto pt-8">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center bg-slate-800/60 border border-slate-700/60 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
          <span className="text-slate-300 text-sm font-medium">AI-Powered Learning Platform</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="text-white" viewBox="0 0 16 16">
            <path d="M7.348 2.352a.5.5 0 0 1 .304-.113A.5.5 0 0 1 8 2.5v.025a.5.5 0 0 1 .148.475l.08.24a.5.5 0 0 1-.113.304L7.352 4.652a.5.5 0 0 1-.304.113A.5.5 0 0 1 7 4.5v-.025a.5.5 0 0 1-.148-.475l-.08-.24a.5.5 0 0 1 .113-.304l1.064-1.064zM14 11.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zM2 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm5.5-5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-5 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM6.646 5.354a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L8.293 8 6.646 6.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          <span className="text-slate-100">EduVision</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 ml-2">AI</span>
        </h1>
      </div>

      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
        Transform Any Video
      </h2>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 leading-tight mt-2">
        into Interactive Learning
      </h2>

      <p className="mt-8 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
        Our advanced AI analyzes video content, generates interactive quizzes, and answers your questions instantly. Transform passive watching into active learning.
      </p>

      <div className="mt-12 max-w-3xl mx-auto">
        <VideoInput
          url={url}
          setUrl={setUrl}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
        />

        <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-slate-500 flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span>15,000+ Videos Processed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span>99.2% Accuracy Rate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span>Instant Results</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Enhanced HowItWorks Component ---
function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.708.819-1z" />
          <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.819 1H12a3 3 0 1 0 0-6H9z" />
        </svg>
      ),
      title: '1. Paste Your Link',
      description: 'Simply provide the URL of any YouTube video you want to learn from.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413-1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
        </svg>
      ),
      title: '2. AI Processes',
      description: 'Our advanced AI transcribes, summarizes, and creates personalized quizzes.',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
      ),
      title: '3. Learn & Master',
      description: 'Take interactive quizzes and chat with AI to deepen your understanding.',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <div className="text-center">
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-slate-100 mb-4">How It Works</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Three simple steps to transform any video into an interactive learning experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, index) => (
          <div key={index} className="group">
            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/50 text-center backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className={`inline-flex justify-center items-center mb-6 p-4 bg-gradient-to-br ${step.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-100 mb-4">Ready to Start Learning?</h3>
          <p className="text-slate-400 mb-6">
            Join thousands of learners who are already transforming their video watching experience
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free to Use</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Downloads</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- Main App Component ---
export default function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const handleProcessVideo = async (e) => {
    if (e) e.preventDefault();
    if (!url) {
      setError("Please enter a YouTube video URL.");
      return;
    }
    setError(null);
    setLoading(true);
    setData(null);
    setChatHistory([]);
    setChatError(null);

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
      setError(`Failed to process video: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
      setData(prevData => ({ ...prevData, questions: newQuestionsData.questions }));
    } catch (err) {
      console.error("Error refreshing questions:", err);
      setError(`Failed to refresh questions: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAskQuestion = async (question) => {
    if (!question.trim() || !url) return;
    setIsChatLoading(true);
    setChatError(null);
    const updatedHistoryWithUser = [...chatHistory, { role: 'user', content: question }];
    setChatHistory(updatedHistoryWithUser);
    try {
      const response = await fetch("http://localhost:8000/ask_question", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url, question: question, chat_history: chatHistory }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to get an answer." }));
        throw new Error(errorData.detail);
      }
      const result = await response.json();
      const assistantMessage = { role: 'assistant', content: result.answer };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error asking question:", err);
      const errorMessage = `Sorry, I ran into an error: ${err.message}`;
      setChatError(errorMessage);
      const errorInChat = { role: 'assistant', content: errorMessage };
      setChatHistory(prev => [...prev, errorInChat]);
    } finally {
      setIsChatLoading(false);
    }
  };
  
  // FIXED: Moved the complex background URL into a style object to prevent parsing errors.
  const backgroundStyle = {
    backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%23374151\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans relative overflow-x-hidden">
      {/* Enhanced background with animated gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-from)_0%,_transparent_50%)] from-cyan-900/20"></div>
      {/* FIXED: Applied the background as a style prop instead of an inline Tailwind class */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-40"
        style={backgroundStyle}
      ></div>

      <Header />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <SignedIn>
          {/* Enhanced signed-in user view */}
          <HeroSection
            url={url}
            setUrl={setUrl}
            onSubmit={handleProcessVideo}
            loading={loading}
            error={error}
          />
          {data && (
            <div className="mt-16 animate-fade-in-up">
              <TranscriptSummary
                transcript={data.transcript}
                summary={data.summary}
                questions={data.questions}
                onRefresh={handleRefreshQuestions}
                isRefreshing={refreshing}
              />
              <Chatbot
                chatHistory={chatHistory}
                onSendMessage={handleAskQuestion}
                isLoading={isChatLoading}
                error={chatError}
              />
            </div>
          )}
          <div className="mt-32">
            <HowItWorks />
          </div>
        </SignedIn>

        <SignedOut>
          {/* Enhanced signed-out user view */}
          <div className="text-center w-full max-w-5xl mx-auto pt-20">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center bg-slate-800/60 border border-slate-700/60 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
                <span className="text-slate-300 text-sm font-medium">AI-Powered Learning Platform</span>
              </div>
            </div>

            <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 leading-tight">
              Transform Any Video
            </h2>
            <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 leading-tight mt-2">
              into Learning Gold
            </h2>
            <p className="mt-8 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Our advanced AI analyzes video content, generates interactive quizzes, and answers your questions instantly. Transform passive watching into active learning.
            </p>

            <div className="mt-12">
              <SignInButton mode="modal">
                <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 border border-cyan-400/20">
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    Start Learning Now
                  </span>
                </button>
              </SignInButton>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span>15,000+ Videos Processed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span>99.2% Accuracy Rate</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span>Instant Results</span>
              </div>
            </div>
          </div>

          <div className="mt-32">
            <HowItWorks />
          </div>
        </SignedOut>
      </main>
    </div>
  );
}