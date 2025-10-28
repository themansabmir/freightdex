import React, { useState, DragEvent, ChangeEvent } from 'react';
import { Modal } from '../Modal';
import Button from '../Button';
import { Stack } from '../Stack';
import styles from './FileUpload.module.scss';

interface FileUploadSectionProps {
  title: string;
  description?: string;
  onDownloadTemplate?: () => void;
  onSubmit?: (file: File) => void;
  onCancel?: () => void;
  isOpen: boolean;
  closeModal: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ title, description, onDownloadTemplate, onSubmit, onCancel, isOpen, closeModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validFileTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validFileTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid Excel or CSV file');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validFileTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid Excel or CSV file');
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Please select a file before submitting.');
      return;
    }
    onSubmit?.(selectedFile);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <Modal.Header>
        <div className={`flex justify-between px-4 ${styles.fileUploadHeader}`}>
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {onDownloadTemplate && <Button onClick={onDownloadTemplate}>Download Template</Button>}
        </div>
      </Modal.Header>
      <Modal.Body>
        {/* Header */}

        {/* Drop Zone */}
        <div
          className={`${styles.dropZone} px-4 py-3 ${isDragging ? styles.dragActive : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input type="file" id="fileInput" accept=".csv, .xls, .xlsx" className={styles.fileInput} onChange={handleFileChange} />
          {selectedFile ? (
            <p className={styles.fileSelected}>
              <strong>{selectedFile.name}</strong> ready for upload
            </p>
          ) : (
            <p className={styles.fileHint}>Drag & drop your Excel or CSV file here, or click to browse</p>
          )}
        </div>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer className="px-4">
        <Stack direction="horizontal" justify="end">
          <Button onClick={onCancel} variant="destructive">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile}>
            Submit
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default FileUploadSection;
