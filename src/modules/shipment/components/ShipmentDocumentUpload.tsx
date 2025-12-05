import Button from '@shared/components/Button';
import { AlertCircle, CheckCircle2, FileArchive, File as FileIcon, FileText, Image, Upload, X } from 'lucide-react';
import React, { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useShipmentApi } from '../hooks/useShipmentApi';
import styles from './ShipmentDocumentUpload.module.scss';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface ShipmentDocumentUploadProps {
  shipmentId: string;
  onUploadComplete?: (files: File[]) => void;
  maxFileSize?: number; // in MB
}

const ShipmentDocumentUpload: React.FC<ShipmentDocumentUploadProps> = ({ shipmentId, onUploadComplete, maxFileSize = 20 }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed file types for shipment documents
  const allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain',
  ];

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={24} />;
    if (fileType.includes('pdf')) return <FileText size={24} />;
    if (fileType.includes('zip')) return <FileArchive size={24} />;
    return <FileIcon size={24} />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${maxFileSize}MB limit`,
      };
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported',
      };
    }

    return { valid: true };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      const validation = validateFile(file);

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        status: validation.valid ? 'pending' : 'error',
        progress: 0,
        error: validation.error,
      };

      newFiles.push(uploadedFile);
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const { uploadDocuments } = useShipmentApi();

  const handleUploadAll = async () => {
    const filesToUpload = uploadedFiles.filter((f) => f.status === 'pending');

    if (filesToUpload.length === 0) {
      toast.warning('No files to upload');
      return;
    }

    // Upload files one by one
    for (const fileToUpload of filesToUpload) {
      try {
        // Set status to uploading
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileToUpload.id ? { ...f, status: 'uploading' as const, progress: 0 } : f)));

        // Create FormData for single file
        const formData = new FormData();
        formData.append('file', fileToUpload.file);

        // Simulate progress (since we don't have real progress tracking)
        const progressInterval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => {
              if (f.id === fileToUpload.id && f.progress < 90) {
                return { ...f, progress: f.progress + 10 };
              }
              return f;
            })
          );
        }, 100);

        // Upload to backend
        await uploadDocuments({ shipmentId, files: formData });

        // Clear progress interval
        clearInterval(progressInterval);

        // Mark as success
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileToUpload.id ? { ...f, status: 'success' as const, progress: 100 } : f)));
      } catch (error: any) {
        // Mark as error
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileToUpload.id ? { ...f, status: 'error' as const, error: error.message || 'Upload failed' } : f))
        );
      }
    }

    // Notify parent component of successful uploads
    if (onUploadComplete) {
      const successfulFiles = uploadedFiles.filter((f) => f.status === 'success').map((f) => f.file);
      onUploadComplete(successfulFiles);
    }
  };

  const hasPendingFiles = uploadedFiles.some((f) => f.status === 'pending');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Upload Documents</h3>
        <p>
          Upload documents for shipment {shipmentId}. Maximum file size: {maxFileSize}MB
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragActive : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.zip,.txt"
          className={styles.fileInput}
          onChange={handleFileInputChange}
        />
        <div className={styles.dropZoneContent}>
          <Upload className={styles.uploadIcon} size={48} />
          <p className={styles.dropZoneText}>
            <strong>Drag & drop files here</strong> or click to browse
          </p>
          <p className={styles.dropZoneHint}>Supported formats: PDF, Images, Word, Excel, ZIP, TXT</p>
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.fileListHeader}>
            <h4>Files ({uploadedFiles.length})</h4>
            {hasPendingFiles && (
              <Button onClick={handleUploadAll} size="small">
                Upload All
              </Button>
            )}
          </div>

          <div className={styles.files}>
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className={styles.fileItem}>
                <div className={styles.fileIcon}>{getFileIcon(uploadedFile.file.type)}</div>
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{uploadedFile.file.name}</div>
                  <div className={styles.fileSize}>{formatFileSize(uploadedFile.file.size)}</div>
                  {uploadedFile.status === 'uploading' && (
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${uploadedFile.progress}%` }} />
                    </div>
                  )}
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      <span>{uploadedFile.error}</span>
                    </div>
                  )}
                </div>
                <div className={styles.fileActions}>
                  {uploadedFile.status === 'success' && <CheckCircle2 className={styles.successIcon} size={20} />}
                  {uploadedFile.status === 'uploading' && <span className={styles.uploadingText}>{uploadedFile.progress}%</span>}
                  <button className={styles.removeButton} onClick={() => handleRemoveFile(uploadedFile.id)} aria-label="Remove file">
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className={styles.infoBox}>
        <p>
          <strong>Note:</strong> Files will be associated with shipment ID: <code>{shipmentId}</code>
        </p>
        <p className={styles.supportedFormats}>Supported formats: PDF, JPG, PNG, GIF, DOC, DOCX, XLS, XLSX, ZIP, TXT</p>
      </div>
    </div>
  );
};

export default ShipmentDocumentUpload;
