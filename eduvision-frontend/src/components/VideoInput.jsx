// import React, { useState } from 'react';

// function VideoInput({ onResult }) {
//   const [url, setUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // FIXED: Converted to an async function that handles the form's submit event.
//   const handleSubmit = async (e) => {
//     // Prevent the default browser action of reloading the page on form submission.
//     e.preventDefault();

//     if (!url) {
//       setError("Please enter a YouTube video URL.");
//       return;
//     }

//     setError(null);
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:8000/process_video', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         // FIXED: Added backticks to create a valid template literal.
//         throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       onResult(result);

//     } catch (err) {
//       console.error("Error processing video:", err);
//       // FIXED: Added backticks to create a valid template literal.
//       setError(`Failed to process video: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // FIXED: Used a <form> element for better semantics and accessibility.
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
//       <input
//         type="text"
//         placeholder="Enter YouTube video URL..."
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//         className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400
//                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                    transition-all duration-200 ease-in-out border border-gray-600 shadow-md"
//         aria-label="YouTube video URL input"
//         // REMOVED: onKeyPress is no longer needed due to the form's onSubmit handler.
//       />
      
//       <button
//         // ADDED: type="submit" is explicit and best practice for form buttons.
//         type="submit" 
//         disabled={loading || !url} // Also disable the button if the URL is empty
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4
//                    rounded-lg transition-colors duration-200 ease-in-out transform hover:scale-102
//                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//                    focus:ring-offset-gray-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? (
//           <span className="flex items-center justify-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Processing Video...
//           </span>
//         ) : (
//           <span>🚀 Generate MCQ Quiz</span>
//         )}
//       </button>
      
//       {error && (
//         <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg">
//           <p className="text-sm">{error}</p>
//         </div>
//       )}
//     </form>
//   );
// }

// export default VideoInput;