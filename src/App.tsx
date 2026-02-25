import React, { useState } from 'react';
import { Printer, Upload, Layout, Image as ImageIcon, Plus, Trash2, Type, Palette, Maximize, Grid } from 'lucide-react';

// Types
interface DocumentItem {
  title: string;
}

type Theme = 'classic' | 'modern' | 'bold' | 'minimal' | 'industrial' | 'box-archive';
type PrintMode = 'grid' | 'single';

interface LabelData {
  id: number;
  logos: string[];
  documents: DocumentItem[];
  refNumber: string;
  description: string;
  signature?: string; // Optional signature image URL
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

const THEME_OPTIONS: { value: Theme; name: string }[] = [
  { value: 'classic', name: 'Classic Engineering' },
  { value: 'modern', name: 'Modern Clean' },
  { value: 'bold', name: 'Bold Impact' },
  { value: 'minimal', name: 'Minimalist' },
  { value: 'industrial', name: 'Industrial Caution' },
  { value: 'box-archive', name: 'Box Archive' },
];

export default function App() {
  const [isGlobalMode, setIsGlobalMode] = useState(true);
  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<Theme>('classic');
  const [printMode, setPrintMode] = useState<PrintMode>('grid');
  const [labelPadding, setLabelPadding] = useState<number>(24); // Default 24px (p-6)
  
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

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setLabels(prevLabels => {
        const newLabels = [...prevLabels];
        if (isGlobalMode) {
          return newLabels.map(label => ({ ...label, signature: imageUrl }));
        } else {
          newLabels[selectedLabelIndex] = { ...newLabels[selectedLabelIndex], signature: imageUrl };
          return newLabels;
        }
      });
    }
  };

  const removeSignature = () => {
    setLabels(prevLabels => {
      const newLabels = [...prevLabels];
      if (isGlobalMode) {
        return newLabels.map(label => ({ ...label, signature: undefined }));
      } else {
        newLabels[selectedLabelIndex] = { ...newLabels[selectedLabelIndex], signature: undefined };
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

          {/* Print Layout & Padding */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-gray-700 font-medium text-sm mb-3">
                <Printer className="w-4 h-4" />
                <span>Print Layout</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrintMode('grid')}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md border transition-all ${
                    printMode === 'grid'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  A4 Grid (4)
                </button>
                <button
                  onClick={() => setPrintMode('single')}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md border transition-all ${
                    printMode === 'single'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Maximize className="w-4 h-4 mr-2" />
                  Single (1)
                </button>
              </div>
            </div>

            {/* Padding Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Label Padding (Whitespace)</label>
                <span className="text-xs text-gray-500">{labelPadding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={labelPadding}
                onChange={(e) => setLabelPadding(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Theme Selector */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 text-gray-700 font-medium text-sm mb-3">
              <Palette className="w-4 h-4" />
              <span>Design Theme</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setCurrentTheme(theme.value)}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-md border transition-all ${
                    currentTheme === theme.value
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {theme.name}
                  {currentTheme === theme.value && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                </button>
              ))}
            </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm mb-2"
                placeholder="e.g. Box Contents..."
              />
              
              {/* Signature Upload */}
              <div className="flex items-center gap-2">
                {currentData.signature ? (
                  <div className="relative group w-full h-12 border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img src={currentData.signature} alt="Signature" className="max-h-full max-w-full object-contain" />
                    <button 
                      onClick={removeSignature}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs"
                    >
                      Remove Signature
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-xs text-gray-500 gap-2">
                    <Upload className="w-3 h-3" />
                    <span>Upload Signature (PNG)</span>
                    <input type="file" accept="image/png,image/jpeg" onChange={handleSignatureUpload} className="hidden" />
                  </label>
                )}
              </div>
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
          className="bg-white shadow-2xl print:shadow-none relative mx-auto transition-all duration-300"
          style={{
            width: printMode === 'grid' ? '297mm' : '148.5mm',
            height: printMode === 'grid' ? '210mm' : '105mm',
            boxSizing: 'border-box',
          }}
        >
          {/* Grid Layout */}
          <div className={`w-full h-full ${printMode === 'grid' ? 'grid grid-cols-2 grid-rows-2' : 'flex'}`}>
            {labels.map((label, index) => {
              // In single mode, only show the selected label
              if (printMode === 'single' && index !== selectedLabelIndex) return null;

              return (
                <div 
                  key={label.id}
                  onClick={() => !isGlobalMode && setSelectedLabelIndex(index)}
                  className={`
                    relative box-border flex flex-col justify-center items-center
                    ${printMode === 'single' ? 'w-full h-full' : ''}
                    ${!isGlobalMode && selectedLabelIndex === index && printMode === 'grid' ? 'bg-indigo-50' : ''}
                  `}
                  style={{ padding: `${labelPadding}px` }}
                >
                  {/* Inner Content Container - The Label Box */}
                  <div 
                    className={`
                      flex flex-col w-full h-full bg-white shadow-sm print:shadow-none overflow-hidden
                      ${!isGlobalMode && selectedLabelIndex === index && printMode === 'grid' ? 'ring-2 ring-indigo-500 ring-offset-2 print:ring-0' : ''}
                      ${currentTheme === 'classic' ? 'border-[3px] border-black' : ''}
                      ${currentTheme === 'modern' ? 'border border-gray-300 rounded-xl' : ''}
                      ${currentTheme === 'bold' ? 'border-4 border-black' : ''}
                    `}
                    style={{ fontFamily: label.fontFamily }}
                  >
                    
                    {/* === CLASSIC THEME === */}
                    {currentTheme === 'classic' && (
                      <>
                        {/* Section 1: Logos (Top) */}
                        <div className="h-[30%] border-b-[2px] border-black flex items-center justify-around px-4 py-1 bg-white overflow-hidden">
                          {label.logos.length > 0 ? (
                            label.logos.map((logo, i) => (
                              <img key={i} src={logo} alt="Logo" className="h-full w-auto max-w-[150px] object-contain" />
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
                        <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 text-center bg-white relative">
                          <p 
                            className="whitespace-pre-wrap font-bold text-black uppercase leading-tight relative z-10"
                            style={{ fontSize: `${label.fontSizeDesc}px` }}
                          >
                            {label.description}
                          </p>
                          {label.signature && (
                            <img 
                              src={label.signature} 
                              alt="Signature" 
                              className="absolute bottom-2 right-4 h-12 object-contain opacity-80 mix-blend-multiply pointer-events-none" 
                            />
                          )}
                        </div>
                      </>
                    )}

                    {/* === MODERN THEME === */}
                    {currentTheme === 'modern' && (
                      <div className="flex flex-col h-full p-6">
                        {/* Header: Logos Only */}
                        <div className="flex items-center h-[20%] mb-4">
                          <div className="flex gap-4 h-full w-full">
                            {label.logos.length > 0 ? (
                              label.logos.map((logo, i) => (
                                <img key={i} src={logo} alt="Logo" className="h-full w-auto max-w-[150px] object-contain" />
                              ))
                            ) : (
                              <div className="text-gray-300 text-xs italic self-center">Upload Logos</div>
                            )}
                          </div>
                        </div>

                        {/* Body: Titles */}
                        <div className="flex-1 flex flex-col justify-center border-l-4 border-indigo-600 pl-6 my-2">
                          {label.documents.map((doc, i) => (
                            <h2 
                              key={i} 
                              className="font-bold text-gray-900 leading-tight mb-2 last:mb-0"
                              style={{ fontSize: `${label.fontSizeTitle}px` }}
                            >
                              {doc.title || "Document Title"}
                            </h2>
                          ))}
                        </div>

                        {/* Footer: Ref & Desc */}
                        <div className="mt-auto pt-4 border-t border-gray-100 relative">
                          <div className="mb-2">
                            <span 
                              className="font-bold text-gray-900 block"
                              style={{ fontSize: `${label.fontSizeRef}px` }}
                            >
                              {label.refNumber || "REF-NO"}
                            </span>
                          </div>
                          <p 
                            className="whitespace-pre-wrap text-gray-600 relative z-10"
                            style={{ fontSize: `${label.fontSizeDesc}px` }}
                          >
                            {label.description}
                          </p>
                          {label.signature && (
                            <img 
                              src={label.signature} 
                              alt="Signature" 
                              className="absolute bottom-0 right-0 h-12 object-contain opacity-80 mix-blend-multiply pointer-events-none" 
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* === BOLD THEME === */}
                    {currentTheme === 'bold' && (
                      <div className="flex flex-col h-full">
                        {/* Header: Black Bar (Logos Only) */}
                        <div className="bg-black text-white p-4 flex items-center h-[20%]">
                          <div className="flex gap-4 h-full items-center w-full">
                            {label.logos.length > 0 ? (
                              label.logos.map((logo, i) => (
                                <div key={i} className="h-full bg-white p-1 rounded-sm">
                                  <img src={logo} alt="Logo" className="h-full w-auto max-w-[150px] object-contain" />
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-500 text-xs italic">Logos</div>
                            )}
                          </div>
                        </div>

                        {/* Body: Centered Big Text */}
                        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-white">
                          {label.documents.map((doc, i) => (
                            <h2 
                              key={i} 
                              className="font-black text-black uppercase leading-none mb-4 last:mb-0"
                              style={{ fontSize: `${label.fontSizeTitle * 1.2}px` }}
                            >
                              {doc.title || "DOCUMENT TITLE"}
                            </h2>
                          ))}
                        </div>

                        {/* Footer: Gray Bar */}
                        <div className="bg-gray-100 p-4 text-center border-t-4 border-black relative">
                          <div 
                            className="font-mono font-bold tracking-widest mb-2 border-b-2 border-black pb-2 inline-block"
                            style={{ fontSize: `${label.fontSizeRef}px` }}
                          >
                            {label.refNumber || "REF-NO"}
                          </div>
                          <p 
                            className="whitespace-pre-wrap font-bold text-black uppercase relative z-10"
                            style={{ fontSize: `${label.fontSizeDesc}px` }}
                          >
                            {label.description}
                          </p>
                          {label.signature && (
                            <img 
                              src={label.signature} 
                              alt="Signature" 
                              className="absolute bottom-2 right-4 h-12 object-contain opacity-80 mix-blend-multiply pointer-events-none" 
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* === MINIMALIST THEME === */}
                    {currentTheme === 'minimal' && (
                      <div className="flex flex-col h-full p-8 text-left">
                        {/* Header: Logos Only */}
                        <div className="h-[30%] border-b border-gray-200 flex items-center justify-around px-4 py-1 mb-8">
                          {label.logos.length > 0 ? (
                            label.logos.map((logo, i) => (
                              <img key={i} src={logo} alt="Logo" className="h-full w-auto max-w-[150px] object-contain grayscale opacity-80" />
                            ))
                          ) : (
                            <div className="text-gray-300 text-xs italic">Upload Logos</div>
                          )}
                        </div>

                        {/* Body: Titles */}
                        <div className="flex-1 flex flex-col justify-center">
                          {label.documents.map((doc, i) => (
                            <h2 
                              key={i} 
                              className="font-light text-gray-900 leading-tight mb-4 last:mb-0 tracking-tight"
                              style={{ fontSize: `${label.fontSizeTitle * 1.1}px` }}
                            >
                              {doc.title || "Document Title"}
                            </h2>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-6 text-gray-500 border-t border-gray-100 relative">
                          <div 
                            className="font-light text-gray-400 tracking-widest uppercase mb-2"
                            style={{ fontSize: `${label.fontSizeRef * 0.8}px` }}
                          >
                            {label.refNumber || "REF-NO"}
                          </div>
                          <p 
                            className="whitespace-pre-wrap font-normal relative z-10"
                            style={{ fontSize: `${label.fontSizeDesc}px` }}
                          >
                            {label.description}
                          </p>
                          {label.signature && (
                            <img 
                              src={label.signature} 
                              alt="Signature" 
                              className="absolute bottom-0 right-0 h-10 object-contain opacity-60 pointer-events-none" 
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* === INDUSTRIAL THEME === */}
                    {currentTheme === 'industrial' && (
                      <div className="flex flex-col h-full border-4 border-yellow-400 bg-yellow-50">
                        {/* Caution Header */}
                        <div className="bg-yellow-400 p-2 text-center border-b-4 border-black">
                          <div className="flex justify-center items-center gap-2">
                            <div className="h-4 w-4 bg-black rounded-full"></div>
                            <span className="font-black text-black uppercase tracking-widest text-sm">ARCHIVE RECORD</span>
                            <div className="h-4 w-4 bg-black rounded-full"></div>
                          </div>
                        </div>

                        {/* Logos Row */}
                        <div className="flex items-center p-4 border-b-2 border-black border-dashed h-[15%]">
                          <div className="flex gap-3 h-full w-full">
                            {label.logos.length > 0 ? (
                              label.logos.map((logo, i) => (
                                <img key={i} src={logo} alt="Logo" className="h-full w-auto max-w-[150px] object-contain mix-blend-multiply" />
                              ))
                            ) : (
                              <div className="text-gray-400 text-xs italic">Logos</div>
                            )}
                          </div>
                        </div>

                        {/* Body: Titles */}
                        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
                          {label.documents.map((doc, i) => (
                            <h2 
                              key={i} 
                              className="font-black text-black uppercase leading-none mb-3 last:mb-0 transform -rotate-1"
                              style={{ fontSize: `${label.fontSizeTitle * 1.1}px`, textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}
                            >
                              {doc.title || "DOCUMENT TITLE"}
                            </h2>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t-4 border-black bg-white relative">
                          <div 
                            className="font-mono font-bold bg-black text-yellow-400 px-2 py-1 inline-block mb-2"
                            style={{ fontSize: `${label.fontSizeRef}px` }}
                          >
                            {label.refNumber || "REF-NO"}
                          </div>
                          <p 
                            className="whitespace-pre-wrap font-mono font-bold text-black uppercase text-center relative z-10"
                            style={{ fontSize: `${label.fontSizeDesc}px` }}
                          >
                            {label.description}
                          </p>
                          {label.signature && (
                            <img 
                              src={label.signature} 
                              alt="Signature" 
                              className="absolute bottom-2 right-4 h-12 object-contain opacity-90 mix-blend-multiply pointer-events-none transform -rotate-6" 
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* === BOX ARCHIVE THEME === */}
                    {currentTheme === 'box-archive' && (
                      <div className="flex flex-col h-full bg-white border-2 border-gray-300 rounded-3xl overflow-hidden relative p-1">
                        <div className="flex flex-col h-full border border-gray-100 rounded-[1.2rem]">
                          
                          {/* Header */}
                          <div className="flex items-center justify-between px-6 pt-6 pb-2">
                            {/* Logo Area */}
                            <div className="w-1/3 h-12 flex items-center justify-start gap-2">
                               {label.logos.length > 0 ? (
                                  label.logos.map((logo, i) => (
                                    <React.Fragment key={i}>
                                      <img src={logo} alt="Logo" className="h-full object-contain" />
                                      {i < label.logos.length - 1 && (
                                        <div className="h-8 w-px bg-gray-300 mx-1"></div>
                                      )}
                                    </React.Fragment>
                                  ))
                                ) : (
                                  <div className="text-gray-300 text-xs italic">Logo</div>
                                )}
                            </div>
                            {/* Title */}
                            <h1 className="text-4xl font-sans font-black text-gray-800 tracking-tighter uppercase text-right">
                              ARCHIVED FILES
                            </h1>
                          </div>

                          {/* Sub-header Line */}
                          <div className="mx-6 border-b-[3px] border-black mb-1"></div>
                          <div className="mx-6 flex justify-between items-baseline mb-6">
                             <div className="flex gap-2 items-baseline">
                               <span className="font-serif font-bold text-gray-700 uppercase tracking-wider text-sm">Reference:</span>
                               <span className="font-mono font-bold text-lg text-gray-900">{label.refNumber}</span>
                             </div>
                             <div className="font-serif italic text-gray-500 text-xs">
                               {new Date().toLocaleDateString()}
                             </div>
                          </div>

                          {/* Body */}
                          <div className="flex-1 flex flex-col items-center justify-start text-center px-8 pt-4">
                            <div className="font-serif font-bold text-gray-500 text-2xl mb-6 tracking-widest uppercase border-b border-gray-200 pb-2">
                              CONTENTS:
                            </div>
                            {label.documents.map((doc, i) => (
                               <h2 key={i} className="font-serif text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                 {doc.title}
                               </h2>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="mx-6 border-t-[3px] border-black mt-auto mb-1"></div>
                          <div className="mx-6 mb-6 flex h-24">
                             {/* Col 1: Description */}
                             <div className="flex-1 border-r-[3px] border-black pr-4 pt-2">
                                <div className="font-serif font-bold text-gray-600 text-xs uppercase mb-1">Description:</div>
                                <p className="font-sans text-sm leading-tight text-gray-800 whitespace-pre-wrap">{label.description}</p>
                             </div>
                             {/* Col 2: Archived By */}
                             <div className="w-1/4 border-r-[3px] border-black px-4 pt-2 flex flex-col relative">
                                <div className="font-serif font-bold text-gray-600 text-xs uppercase mb-1">Archived by:</div>
                                <div className="mt-auto border-b border-gray-400 w-full h-4 relative">
                                  {label.signature && (
                                    <img 
                                      src={label.signature} 
                                      alt="Signature" 
                                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-12 object-contain mix-blend-multiply pointer-events-none" 
                                    />
                                  )}
                                </div>
                             </div>
                             {/* Col 3: Box # */}
                             <div className="w-1/4 pl-4 pt-2">
                                <div className="font-serif font-bold text-gray-600 text-xs uppercase mb-1">Box #:</div>
                                <p className="font-sans text-3xl font-black text-gray-900">
                                  {String(label.id + 1).padStart(6, '0')}
                                </p>
                             </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: ${printMode === 'grid' ? 'A4 landscape' : 'auto'};
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

