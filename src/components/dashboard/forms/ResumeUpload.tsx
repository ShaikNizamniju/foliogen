import { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate parsing animation
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 3000);
  };

  const handleFileSelect = () => {
    // Simulate parsing animation
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 3000);
  };

  if (isParsing) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <FileText className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 text-lg font-medium text-foreground">Parsing your resume...</p>
        <p className="text-muted-foreground mt-1">Extracting your experience and skills</p>
        <div className="mt-4 w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-shimmer" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <div className="flex flex-col items-center">
          <div className={`p-4 rounded-full mb-4 transition-colors ${
            isDragging ? 'bg-primary/10' : 'bg-muted'
          }`}>
            <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <p className="text-lg font-medium text-foreground mb-1">
            Drop your resume here
          </p>
          <p className="text-muted-foreground mb-4">
            or click to browse files
          </p>
          
          <button
            onClick={handleFileSelect}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Select File
          </button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Supports PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/50 p-6">
        <h3 className="font-semibold text-foreground mb-2">Coming Soon: AI Resume Parser</h3>
        <p className="text-sm text-muted-foreground">
          Our AI will automatically extract your work experience, skills, and projects from your resume.
          This feature is currently in development and will be available for Pro users.
        </p>
      </div>
    </div>
  );
}
