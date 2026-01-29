import React, { useState } from 'react';
import { Eye, AlertTriangle, CheckCircle, X, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface ContrastIssue {
  id: string;
  element: HTMLElement;
  text: string;
  fgColor: string;
  bgColor: string;
  ratio: number;
  required: number;
  level: 'AA' | 'AAA';
}

const AccessibilityScanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [issues, setIssues] = useState<ContrastIssue[]>([]);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // --- Helper Functions ---

  const parseColor = (color: string): { r: number, g: number, b: number, a: number } | null => {
    const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
    const match = color.match(rgbRegex);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1
      };
    }
    return null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (fg: { r: number, g: number, b: number }, bg: { r: number, g: number, b: number }) => {
    const l1 = getLuminance(fg.r, fg.g, fg.b);
    const l2 = getLuminance(bg.r, bg.g, bg.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const getEffectiveBackgroundColor = (el: HTMLElement): { r: number, g: number, b: number } => {
    let current: HTMLElement | null = el;
    while (current) {
      const style = window.getComputedStyle(current);
      const color = parseColor(style.backgroundColor);
      // If color is found and not fully transparent
      if (color && color.a > 0.1) {
        return { r: color.r, g: color.g, b: color.b };
      }
      current = current.parentElement;
    }
    // Fallback to strict dark mode theme background if no parent bg found (simulating app root)
    return { r: 15, g: 23, b: 42 }; 
  };

  const runScan = () => {
    setIsScanning(true);
    setIssues([]);
    
    // Allow UI to update before heavy calc
    setTimeout(() => {
        const allElements = document.querySelectorAll<HTMLElement>('body *');
        const newIssues: ContrastIssue[] = [];
        
        allElements.forEach((el, index) => {
          // Skip hidden elements
          if (el.offsetParent === null) return;
          
          // Check if element has direct text node
          const hasText = Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length! > 0);
          if (!hasText) return;

          const style = window.getComputedStyle(el);
          
          // Skip if opacity is too low to matter for this simple tool
          if (parseFloat(style.opacity) < 0.5) return;
          
          const fontSize = parseFloat(style.fontSize);
          const isBold = style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 700;
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold); // Simplified PT to PX conversion logic
          
          const fgParsed = parseColor(style.color);
          if (!fgParsed) return;

          const bgParsed = getEffectiveBackgroundColor(el);
          
          const ratio = getContrastRatio(fgParsed, bgParsed);
          const required = isLargeText ? 3.0 : 4.5;
          
          if (ratio < required) {
            // Filter out purely decorative or gradient text that might misreport
            // This is a heuristic: if contrast is super low (invisible), it's likely a gradient text or icon
            if (ratio < 1.1) return; 

            newIssues.push({
              id: `issue-${index}`,
              element: el,
              text: el.innerText.slice(0, 30) + (el.innerText.length > 30 ? '...' : ''),
              fgColor: `rgb(${fgParsed.r}, ${fgParsed.g}, ${fgParsed.b})`,
              bgColor: `rgb(${bgParsed.r}, ${bgParsed.g}, ${bgParsed.b})`,
              ratio: parseFloat(ratio.toFixed(2)),
              required,
              level: 'AA'
            });
          }
        });

        setIssues(newIssues);
        setLastScan(new Date().toLocaleTimeString());
        setIsScanning(false);
    }, 100);
  };

  const highlightElement = (el: HTMLElement) => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const originalOutline = el.style.outline;
    el.style.outline = '3px solid #f43f5e';
    setTimeout(() => {
        el.style.outline = originalOutline;
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-gray-400 hover:text-white hover:bg-white/20 border border-white/10 shadow-lg transition-all hover:scale-110 group"
        title="Check Contrast"
      >
        <Eye size={20} />
        <span className="absolute left-full ml-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Accessibility Check
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 md:w-96 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Eye className="text-brand-400" size={18} />
            <h3 className="font-bold text-white text-sm">Contrast Scanner</h3>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={runScan} 
                className={`p-1.5 rounded-lg bg-brand-600/20 text-brand-400 hover:bg-brand-600/40 transition-colors ${isScanning ? 'animate-spin' : ''}`}
                title="Run Scan"
            >
                <RefreshCw size={14} />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                <X size={16} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {!lastScan ? (
            <div className="text-center py-8 text-gray-500">
                <p className="text-sm mb-4">Check text/background contrast for WCAG AA compliance.</p>
                <button 
                    onClick={runScan}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-500 transition-colors"
                >
                    Run Analysis
                </button>
            </div>
        ) : issues.length === 0 ? (
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">All Clear!</h4>
                <p className="text-xs text-gray-400">No obvious contrast violations found.</p>
            </div>
        ) : (
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Found {issues.length} potential issues</span>
                    <span>Last: {lastScan}</span>
                </div>
                {issues.map((issue) => (
                    <div key={issue.id} className="bg-white/5 border border-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                Fail {issue.ratio}:1
                            </span>
                            <button 
                                onClick={() => highlightElement(issue.element)}
                                className="text-xs text-brand-400 hover:text-brand-300 underline"
                            >
                                Locate
                            </button>
                        </div>
                        <p className="text-sm text-gray-200 font-medium truncate mb-2">"{issue.text}"</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: issue.fgColor }}></div>
                                Text
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: issue.bgColor }}></div>
                                Bg
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-2">Required: {issue.required}:1</p>
                    </div>
                ))}
            </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-black/20 text-[10px] text-gray-400 text-center">
        Note: Tool estimates effective background. Complex gradients may generate false positives.
      </div>
    </div>
  );
};

export default AccessibilityScanner;