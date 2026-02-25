import React, { useState } from 'react';
import { Printer, Upload, Layout, Image as ImageIcon, Plus, Trash2, Type } from 'lucide-react';

// Types
interface DocumentItem {
  title: string;
}

interface LabelData {
  id: number;
  logos: string[];
  documents: DocumentItem[];
  refNumber: string;
  description: string;
  fontFamily: string;
  fontSizeTitle: number;
  fontSizeRef: number;
  fontSizeDesc: number;
}

const INITIAL_LABEL_DATA: LabelData = {
  id: 0,
  logos: [],
  documents: [
    { title: "NITROGEN GENERATOR OPERATION INSTRUCTIONS" }
  ],
  refNumber: "MCCPP-CIT-MPC-E-00013",
  description: "CHEM\nMCCPP- TRANSMITTAL\n3 FILES WITH REF. MCCPP-CIT-MPC-E-00013",
  fontFamily: "sans-serif",
  fontSizeTitle: 20,
  fontSizeRef: 18,
  fontSizeDesc: 12
};

const FONT_OPTIONS = [
  { name: "Sans Serif (Arial)", value: "sans-serif" },
  { name: "Serif (Times)", value: "serif" },
  { name: "Monospace (Courier)", value: "monospace" },
  { name: "System UI", value: "system-ui" },
];

export default function App() {
  const [isGlobalMode, setIsGlobalMode] = useState(true);
  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number>(0);
  
  // Initialize 4 labels
  const [labels, setLabels] = useState<LabelData[]>([
    { ...INITIAL_LABEL_DATA, id: 0 },
    { ...INITIAL_LABEL_DATA, id: 1 },
    { ...INITIAL_LABEL_DATA, id: 2 },
    { ...INITIAL_LABEL_DATA, id: 3 },
  ]);

  const handleInputChange = (field: keyof LabelData, value: string | number) => {
    setLabels(prevLabels => {
      const newLabels = [...prevLabels];
      if (isGlobalMode) {
        return newLabels.map(label => ({ ...label, [field]: value }));
      } else {
        newLabels[selectedLabelIndex] = { ...newLabels[selectedLabelIndex], [field]: value };
        return newLabels;
      }
    });
  };

  const handleDocumentChange = (docIndex: number, field: keyof DocumentItem, value: string) => {
    setLabels(prevLabels => {
      const newLabels = [...prevLabels];
      if (isGlobalMode) {
        return newLabels.map(label => {
          const newDocs = [...label.documents];
          newDocs[docIndex] = { ...newDocs[docIndex], [field]: value };
          return { ...label, documents: newDocs };
        });
      } else {
        const currentLabel = newLabels[selectedLabelIndex];
        const newDocs = [...currentLabel.documents];
        newDocs[docIndex] = { ...newDocs[docIndex], [field]: value };
        newLabels[selectedLabelIndex] = { ...currentLabel, documents: newDocs };
        return newLabels;
      }
    });
  };

  const addDocument = () => {
    setLabels(prevLabels => {
      const newLabels = [...prevLabels];
      const newDoc = { title: "" };
      if (isGlobalMode) {
        return newLabels.map(label => ({ ...label, documents: [...label.documents, newDoc] }));
      } else {
        const currentLabel = newLabels[selectedLabelIndex];
        newLabels[selectedLabelIndex] = { ...currentLabel, documents: [...currentLabel.documents, newDoc] };
        return newLabels;
      }
    });
  };

  const removeDocument = (docIndex: number) => {
    setLabels(prevLabels => {
      const newLabels = [...prevLabels];
      if (isGlobalMode) {
        return newLabels.map(label => ({
          ...label,
          documents: label.documents.filter((_, i) => i !== docIndex)
        }));
      } else {
        const currentLabel = newLabels[selectedLabelIndex];
        newLabels[selectedLabelIndex] = {
          ...currentLabel,
          documents: currentLabel.documents.filter((_, i) => i !== docIndex)
        };
        return newLabels;
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setLabels(prevLabels => {
        const newLabels = [...prevLabels];
        if (isGlobalMode) {
          return newLabels.map(label => ({ 
            ...label, 
            logos: [...label.logos, imageUrl].slice(0, 3) 
          }));
        } else {
          const currentLogos = newLabels[selectedLabelIndex].logos;
          newLabels[selectedLabelIndex] = { 
            ...newLabels[selectedLabelIndex], 
            logos: [...currentLogos, imageUrl].slice(0, 3) 
          };
          return newLabels;
        }
      });
    }
  };

  const removeLogo = (logoIndex: number) => {
    setLabels(prevLabels => {
      const newLabels = [...prevLabels];
      if (isGlobalMode) {
        return newLabels.map(label => ({
          ...label,
          logos: label.logos.filter((_, i) => i !== logoIndex)
        }));
      } else {
        newLabels[selectedLabelIndex] = {
          ...newLabels[selectedLabelIndex],
          logos: newLabels[selectedLabelIndex].logos.filter((_, i) => i !== logoIndex)
        };
        return newLabels;
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Get current data to display in form
  const currentData = isGlobalMode ? labels[0] : labels[selectedLabelIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans print:bg-white">
      {/* Control Panel - Hidden on Print */}
      <aside className="w-full md:w-96 bg-white shadow-lg z-10 flex-shrink-0 print:hidden overflow-y-auto h-screen sticky top-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-2 text-indigo-600 border-b pb-4">
            <Layout className="w-6 h-6" />
            <h1 className="text-xl font-bold text-gray-800">Archive Label Gen</h1>
          </div>

          {/* Mode Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Editing Mode</label>
              <div className="flex items-center bg-gray-200 rounded-full p-1 cursor-pointer" onClick={() => setIsGlobalMode(!isGlobalMode)}>
                <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${isGlobalMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600'}`}>
                  Global
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!isGlobalMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600'}`}>
                  Individual
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {isGlobalMode ? "Changes apply to ALL 4 labels." : "Select a label in the preview to edit it individually."}
            </p>
          </div>

          {/* Label Selector (Only visible in Individual Mode) */}
          {!isGlobalMode && (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelectedLabelIndex(i)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    selectedLabelIndex === i 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Label {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Style Controls */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center space-x-2 text-gray-700 font-medium text-sm border-b pb-2 mb-2">
              <Type className="w-4 h-4" />
              <span>Typography Settings</span>
            </div>
            
            {/* Font Family */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
              <select
                value={currentData.fontFamily}
                onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {FONT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>

            {/* Font Sizes */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title Size</label>
                <input
                  type="number"
                  value={currentData.fontSizeTitle}
                  onChange={(e) => handleInputChange('fontSizeTitle', parseInt(e.target.value) || 20)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                  min="10" max="40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ref Size</label>
                <input
                  type="number"
                  value={currentData.fontSizeRef}
                  onChange={(e) => handleInputChange('fontSizeRef', parseInt(e.target.value) || 18)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                  min="10" max="30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Desc Size</label>
                <input
                  type="number"
                  value={currentData.fontSizeDesc}
                  onChange={(e) => handleInputChange('fontSizeDesc', parseInt(e.target.value) || 12)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                  min="8" max="20"
                />
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ImageIcon className="w-4 h-4 mr-1" /> Logos (Max 3)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentData.logos.map((logo, idx) => (
                  <div key={idx} className="relative group w-16 h-16 border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    <button 
                      onClick={() => removeLogo(idx)}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {currentData.logos.length < 3 && (
                  <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Documents (Dynamic List) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Documents</label>
                <button 
                  onClick={addDocument}
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Doc
                </button>
              </div>
              
              <div className="space-y-2">
                {currentData.documents.map((doc, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => handleDocumentChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Document Title"
                      />
                    </div>
                    <button 
                      onClick={() => removeDocument(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                      title="Remove Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input
                type="text"
                value={currentData.refNumber}
                onChange={(e) => handleInputChange('refNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. REF-2024-001"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer / Description</label>
              <textarea
                value={currentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                placeholder="e.g. Box Contents..."
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow transition-colors font-medium"
            >
              <Printer className="w-5 h-5" />
              <span>Print Labels</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 p-8 flex items-center justify-center bg-gray-100 print:p-0 print:bg-white overflow-auto">
        {/* A4 Container */}
        <div 
          className="bg-white shadow-2xl print:shadow-none relative mx-auto"
          style={{
            width: '297mm',
            height: '210mm',
            boxSizing: 'border-box',
          }}
        >
          {/* Grid Layout */}
          <div className="w-full h-full grid grid-cols-2 grid-rows-2">
            {labels.map((label, index) => (
              <div 
                key={label.id}
                onClick={() => !isGlobalMode && setSelectedLabelIndex(index)}
                className={`
                  relative box-border flex flex-col p-6 justify-center items-center
                  ${!isGlobalMode && selectedLabelIndex === index ? 'bg-indigo-50' : ''}
                `}
              >
                {/* Inner Content Container - The Label Box */}
                <div 
                  className={`
                    flex flex-col w-full h-full border-[3px] border-black bg-white shadow-sm print:shadow-none
                    ${!isGlobalMode && selectedLabelIndex === index ? 'ring-2 ring-indigo-500 ring-offset-2 print:ring-0' : ''}
                  `}
                  style={{ fontFamily: label.fontFamily }}
                >
                  
                  {/* Section 1: Logos (Top) */}
                  <div className="h-[30%] border-b-[2px] border-black flex items-center justify-around px-4 py-1 bg-white">
                    {label.logos.length > 0 ? (
                      label.logos.map((logo, i) => (
                        <img key={i} src={logo} alt="Logo" className="h-full max-w-[30%] object-contain" />
                      ))
                    ) : (
                      <div className="text-gray-300 text-xs italic">Upload Logos</div>
                    )}
                  </div>

                  {/* Section 2: Title & Ref (Middle) */}
                  <div className="h-[40%] border-b-[2px] border-black flex flex-col justify-center items-center px-4 text-center bg-white overflow-hidden">
                    <div className="flex-1 flex flex-col justify-center w-full">
                      {label.documents.map((doc, i) => (
                        <h2 
                          key={i} 
                          className="font-bold text-black uppercase leading-tight mb-1 last:mb-2"
                          style={{ fontSize: `${label.fontSizeTitle}px` }}
                        >
                          {doc.title || "DOCUMENT TITLE"}
                        </h2>
                      ))}
                    </div>
                    <div className="mt-auto pb-2">
                      <span 
                        className="font-bold text-black pb-0.5 inline-block"
                        style={{ fontSize: `${label.fontSizeRef}px` }}
                      >
                        {label.refNumber || "REF-NO"}
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Footer / Description (Bottom) */}
                  <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 text-center bg-white">
                    <p 
                      className="whitespace-pre-wrap font-bold text-black uppercase leading-tight"
                      style={{ fontSize: `${label.fontSizeDesc}px` }}
                    >
                      {label.description}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

