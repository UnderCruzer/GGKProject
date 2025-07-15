import React, { useState, useRef } from 'react';
import './FileUpload.css';

function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ 성공 메시지 상태 추가

  const fileInputRef = useRef(null);

  const handleIncomingFiles = (incomingFiles) => {
    setSelectedFiles(prevFiles => {
      const newFiles = Array.from(incomingFiles);

      const uniqueNewFiles = newFiles.filter(
        newFile => !prevFiles.some(
          prevFile => prevFile.name === newFile.name && prevFile.size === newFile.size
        )
      );

      return [...prevFiles, ...uniqueNewFiles];
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files.length) {
      handleIncomingFiles(event.target.files);
      event.target.value = '';
    }
  };

  const handleDragEnter = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleIncomingFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      alert("업로드할 파일을 먼저 선택해 주세요.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    // TODO: 실제 서버 업로드 로직 추가
    // fetch("/api/upload", { method: "POST", body: formData })

    // ✅ 성공했다고 가정하고 메시지 표시
    setSuccessMessage("✅ 파일이 성공적으로 업로드되었습니다!");
    setSelectedFiles([]); // 업로드 후 파일 목록 초기화
  };

  return (
    <div className="upload-container">
      <h1>Upload a file</h1>

      <div
        className={`drop-zone ${isDragOver ? 'dragover' : ''}`}
        onClick={handleBrowseClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          hidden
        />
        <p>
          Drag and drop files here, or{' '}
          <span className="browse-link" onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}>
            browse
          </span>{' '}
          your computer.
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-list-container">
          {selectedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="file-list-item">
              <span>{file.name}</span>
              <button
                type="button"
                className="remove-file-btn"
                onClick={() => handleRemoveFile(file)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>

      {/* ✅ 업로드 성공 메시지 표시 */}
      {successMessage && (
        <div style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default FileUpload;