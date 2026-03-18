import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Upload, Download, Image as ImageIcon, Settings2, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState('嚴禁盜用');
  const [color, setColor] = useState('#ffffff');
  const [density, setDensity] = useState(50); // 1-100, maps to spacing
  const [size, setSize] = useState(40); // Font size
  const [opacity, setOpacity] = useState(0.4);
  const [angle, setAngle] = useState(-30);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(img);
    };
    img.src = imageUrl;
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match the image exactly for high quality download
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw base image
    ctx.drawImage(image, 0, 0);

    // If no text, don't draw watermarks
    if (!text.trim()) return;

    // Save context state before applying watermarks
    ctx.save();

    // Set styling
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    
    // Scale font size based on image width to keep it somewhat consistent
    // or just use absolute size. Let's use absolute size for simplicity,
    // but scale it slightly based on image dimensions so it doesn't look tiny on 4K images.
    const baseDimension = Math.min(canvas.width, canvas.height);
    const scaledSize = (size / 100) * (baseDimension / 5); // Just an empirical formula
    
    ctx.font = `bold ${scaledSize}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Calculate diagonal length to ensure watermarks cover the whole image even when rotated
    const diagonal = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
    
    // Move origin to center of canvas for rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);

    // Density: 1 (low density, high spacing) to 100 (high density, low spacing)
    // Map 1-100 to a spacing multiplier. High density -> low spacing.
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = scaledSize;
    
    const maxSpacingX = textWidth * 4;
    const minSpacingX = textWidth * 1.2;
    const maxSpacingY = textHeight * 8;
    const minSpacingY = textHeight * 2;
    
    // Map 1-100 to maxSpacing-minSpacing
    const spacingX = maxSpacingX - ((density - 1) / 99) * (maxSpacingX - minSpacingX);
    const spacingY = maxSpacingY - ((density - 1) / 99) * (maxSpacingY - minSpacingY);

    // Draw grid of watermarks
    const startX = -diagonal / 2;
    const endX = diagonal / 2;
    const startY = -diagonal / 2;
    const endY = diagonal / 2;

    const rows = Math.ceil((endY - startY) / spacingY);
    const cols = Math.ceil((endX - startX) / spacingX);

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = startX + col * spacingX;
        const y = startY + row * spacingY;
        // Offset alternate rows for a brick-like pattern
        const offsetX = (row % 2 === 1) ? spacingX / 2 : 0;
        
        // Add subtle shadow/stroke for better readability across different backgrounds
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(text, x + offsetX, y);
      }
    }

    ctx.restore();
  }, [image, text, color, density, size, opacity, angle]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'watermarked-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">線上浮水印產生器</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Preview Area */}
          <div className="flex-1 space-y-4">
            <div 
              className={`relative bg-white border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px] transition-colors ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              } ${!image ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !image && document.getElementById('file-upload')?.click()}
            >
              {!image ? (
                <div className="text-center p-8">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">點擊或拖曳圖片至此</h3>
                  <p className="text-sm text-gray-500">支援 JPG, PNG 等常見格式</p>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={onFileInputChange}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 bg-gray-100">
                  <canvas 
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain shadow-lg rounded-sm"
                  />
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={onFileInputChange}
                  />
                </div>
              )}
            </div>

            {image && (
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setImage(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  重新選擇圖片
                </button>
                <button 
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  下載圖片
                </button>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings2 className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">浮水印設定</h2>
              </div>

              <div className="space-y-6">
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    浮水印文字
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="輸入浮水印文字..."
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文字顏色
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 uppercase">{color}</span>
                  </div>
                </div>

                {/* Density Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">密度 (Density)</label>
                    <span className="text-sm text-gray-500">{density}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Size Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">大小 (Size)</label>
                    <span className="text-sm text-gray-500">{size}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Opacity Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">透明度 (Opacity)</label>
                    <span className="text-sm text-gray-500">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Angle Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">旋轉角度 (Angle)</label>
                    <span className="text-sm text-gray-500">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

              </div>
              
              {!image && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <SlidersHorizontal className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-800">
                      請先上傳圖片，即可在此調整浮水印的效果並即時預覽。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
