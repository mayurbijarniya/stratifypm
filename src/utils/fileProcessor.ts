import Papa from 'papaparse';
import * as ExcelJS from 'exceljs';
import type { FileData } from '../types';

// Define a FileProcessor object to encapsulate file processing and export logic
const FileProcessor = {
  processFile: async (file: File): Promise<FileData> => {
    const fileData: FileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      content: [],
      processed: false,
      insights: [],
    };

    try {
      // Simplified type checking based on file extensions for processFile
      if (file.name.startsWith('~$')) {
        throw new Error('This appears to be a temporary lock file. Please close Excel and upload the actual file, not the one starting with "~$".');
      }

      if (file.name.endsWith('.csv')) {
        fileData.content = await FileProcessor.processCSV(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        fileData.content = await FileProcessor.processExcel(file);
      } else if (file.name.endsWith('.json')) {
        fileData.content = await FileProcessor.processJSON(file);
      } else if (file.name.endsWith('.txt')) {
        fileData.content = await FileProcessor.processText(file);
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      fileData.processed = true;
      fileData.insights = FileProcessor.generateInsights(fileData.content);

      return fileData;
    } catch (error) {
      console.error('File processing error:', error);
      throw error;
    }
  },

  processCSV: (file: File): Promise<unknown[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve(results.data);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  },

  processExcel: async (file: File): Promise<unknown[]> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('Excel file contains no sheets');
      }

      const rawRows: unknown[][] = [];
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const rowValues = Array.isArray(row.values) ? row.values.slice(1) : [];
        rawRows.push(rowValues);
      });

      const cleanRows = rawRows.filter(row =>
        row.length > 0 && row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "")
      );

      if (cleanRows.length === 0) {
        return [];
      }

      const headers = cleanRows[0].map(h => String(h));
      const dataRows = cleanRows.slice(1);

      return dataRows.map(row => {
        const obj: Record<string, unknown> = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] !== undefined ? row[i] : "";
        });
        return obj;
      });
    } catch (error) {
      console.error('Excel parsing error details:', error);
      throw new Error(`Excel parsing error: ${error}`);
    }
  },

  processJSON: (file: File): Promise<unknown[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;

          try {
            // Try standard JSON parsing first
            const jsonData = JSON.parse(text);
            // Ensure we return an array
            const data = Array.isArray(jsonData) ? jsonData : [jsonData];
            resolve(data);
          } catch (parseError) {
            // If standard parsing fails, try JSON Lines (JSONL) format
            console.warn('Standard JSON parsing failed, trying JSONL format:', parseError);

            const lines = text.split('\n').filter(line => line.trim());
            const jsonObjects: unknown[] = [];

            for (const line of lines) {
              try {
                const obj = JSON.parse(line.trim());
                jsonObjects.push(obj);
              } catch (lineError) {
                console.warn(`Failed to parse line as JSON: ${line.substring(0, 50)}...`, lineError);
                // Continue processing other lines
              }
            }

            if (jsonObjects.length > 0) {
              resolve(jsonObjects);
            } else {
              reject(new Error(`JSON parsing error: ${parseError instanceof Error ? parseError.message : String(parseError)}`));
            }
          }
        } catch (error) {
          reject(new Error(`JSON parsing error: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read JSON file'));
      };

      reader.readAsText(file);
    });
  },

  processText: (file: File): Promise<unknown[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;

          // Try to detect if it's structured data (JSON-like, CSV-like, etc.)
          const lines = text.split('\n').filter(line => line.trim());

          // Check if it looks like CSV data
          if (lines.length > 1 && lines[0].includes(',')) {
            // Try to parse as CSV
            try {
              const result = Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
              });
              if (result.data && result.data.length > 0) {
                resolve(result.data);
                return;
              }
            } catch {
              console.warn('Failed to parse as CSV, treating as plain text');
            }
          }

          // Check if it looks like JSON
          if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
            try {
              const jsonData = JSON.parse(text);
              const data = Array.isArray(jsonData) ? jsonData : [jsonData];
              resolve(data);
              return;
            } catch {
              console.warn('Failed to parse as JSON, treating as plain text');
            }
          }

          // Fallback: treat as plain text with line-by-line structure
          const data = lines.map((line, index) => ({
            line_number: index + 1,
            content: line.trim(),
          }));
          resolve(data);
        } catch (error) {
          reject(new Error(`Text parsing error: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };

      reader.readAsText(file);
    });
  },

  generateInsights: (data: unknown[]): string[] => {
    const insights: string[] = [];

    // Basic insights based on data structure
    if (data.length > 0) {
      insights.push(`Dataset contains ${data.length} records`);
      const sample = data[0];
      if (typeof sample === 'object' && sample !== null) {
        insights.push(`Fields detected: ${Object.keys(sample).join(', ')}`);
      }
    }

    return insights;
  },

  exportData: (data: unknown[], format: 'csv' | 'json' | 'excel', filename: string) => {
    switch (format) {
      case 'csv':
        FileProcessor.exportCSV(data, filename);
        break;
      case 'json':
        FileProcessor.exportJSON(data, filename);
        break;
      case 'excel':
        FileProcessor.exportExcel(data, filename);
        break;
    }
  },

  exportCSV: (data: unknown[], filename: string) => {
    const csv = Papa.unparse(data);
    FileProcessor.downloadFile(csv, `${filename}.csv`, 'text/csv');
  },

  exportJSON: (data: unknown[], filename: string) => {
    const json = JSON.stringify(data, null, 2);
    FileProcessor.downloadFile(json, `${filename}.json`, 'application/json');
  },

  exportExcel: (data: unknown[], filename: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const rows = Array.isArray(data) ? data : [];

    if (rows.length > 0 && typeof rows[0] === 'object' && rows[0] !== null) {
      const headers = Object.keys(rows[0] as Record<string, unknown>);
      worksheet.addRow(headers);
      rows.forEach((row) => {
        const rowData = headers.map((header) => (row as Record<string, unknown>)[header]);
        worksheet.addRow(rowData);
      });
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  },

  downloadFile: (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Export the processFile and exportData functions from the FileProcessor object
export const processFile = FileProcessor.processFile;
export const exportData = FileProcessor.exportData;
