import React from 'react';
import './Loading.css'; // import the CSS file for styling

function Loading({ loading }) {
  return (
    <>
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </>
  );
}

export default Loading;