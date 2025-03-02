import React from 'react';
import { Editor } from '@monaco-editor/react';
import Button from '../common/Button';
import Card from '../common/Card';
import { RetrievedData } from '../../types';

interface ResultsDisplayProps {
  data: RetrievedData | null;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const renderContent = () => {
    const { data: content, contentType } = data;

    // Handle JSON data
    if (contentType === 'application/json') {
      return (
        <div className="h-96 border rounded overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            defaultValue={JSON.stringify(content, null, 2)}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
      );
    }

    // Handle text data
    if (contentType.includes('text')) {
      return (
        <div className="h-96 border rounded overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={contentType.includes('html') ? 'html' : 'plaintext'}
            defaultValue={content}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
      );
    }

    // Handle image data
    if (contentType.includes('image')) {
      return (
        <div className="flex justify-center">
          <img 
            src={URL.createObjectURL(content)} 
            alt="Retrieved content" 
            className="max-h-96 max-w-full object-contain rounded"
          />
        </div>
      );
    }

    // Handle other binary data
    return (
      <div className="text-center p-8 border rounded">
        <p className="text-lg mb-4">Binary data: {contentType}</p>
        <Button
          onClick={() => {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `download-${data.transactionId.substring(0, 8)}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          Download File
        </Button>
      </div>
    );
  };

  return (
    <Card title="Retrieved Data" className="mt-4">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="font-medium">Transaction ID:</span>
          <span className="font-mono">{data.transactionId}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="font-medium">Content Type:</span>
          <span>{data.contentType}</span>
        </div>
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay; 