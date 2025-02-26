import React, { useState } from 'react';
import { Upload, FileText, Check, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import Papa from 'papaparse'; // For CSV parsing
import { HistoricalData } from '../types';

export const DataInputForm: React.FC = () => {
  const { setCustomData, resetToDefaultData } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
    
    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'csv') {
      parseCSV(file);
    } else if (fileExt === 'json') {
      parseJSON(file);
    } else {
      setUploadStatus('error');
      setErrorMessage('Unsupported file format. Please upload CSV or JSON.');
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsedData = transformCSVData(results.data);
          setCustomData(parsedData);
          setUploadStatus('success');
        } catch (error) {
          setUploadStatus('error');
          setErrorMessage('Failed to parse CSV data. Please check the format.');
        }
      },
      error: () => {
        setUploadStatus('error');
        setErrorMessage('Failed to parse CSV file.');
      }
    });
  };

  const parseJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Validate and transform JSON to match HistoricalData format
        if (Array.isArray(json) && validateHistoricalData(json)) {
          setCustomData(json);
          setUploadStatus('success');
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setUploadStatus('error');
        setErrorMessage('Failed to parse JSON data. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  // This would need proper implementation based on your data format
  const transformCSVData = (data: any[]): HistoricalData[] => {
    // Transform CSV data into HistoricalData format
    return data.map(row => ({
      year: parseInt(row.year),
      population: {
        palestine: parseFloat(row.population_palestine),
        israel: parseFloat(row.population_israel),
      },
      casualties: {
        palestine: parseFloat(row.casualties_palestine),
        israel: parseFloat(row.casualties_israel),
      },
      prisoners: {
        palestine: parseFloat(row.prisoners_palestine),
        israel: parseFloat(row.prisoners_israel),
      },
      territory: {
        palestine: parseFloat(row.territory_palestine),
        israel: parseFloat(row.territory_israel),
      }
    }));
  };

  // Validate the historical data structure
  const validateHistoricalData = (data: any[]): boolean => {
    // Implement validation logic here
    return data.every(item => 
      typeof item.year === 'number' &&
      item.population && 
      typeof item.population.palestine === 'number' &&
      typeof item.population.israel === 'number'
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Import Your Data</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Drag and drop your data file
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Upload CSV or JSON file with historical data
        </p>
        
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
          <FileText className="w-5 h-5 mr-2" />
          Browse Files
          <input 
            type="file" 
            className="hidden" 
            accept=".csv,.json" 
            onChange={handleFileInput}
          />
        </label>
      </div>

      {uploadStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Data imported successfully!
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {errorMessage}
        </div>
      )}

      {uploadStatus === 'success' && (
        <button
          onClick={resetToDefaultData}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Reset to Default Data
        </button>
      )}
    </div>
  );
};
