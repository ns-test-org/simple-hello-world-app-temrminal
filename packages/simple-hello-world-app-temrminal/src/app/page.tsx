'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Microsoft Windows [Version 3.11]',
    '(C) Copyright Microsoft Corp 1985-1993.',
    '',
    'C:\\WINDOWS> echo Welcome to DOS Echo Terminal',
    'Welcome to DOS Echo Terminal',
    '',
    'C:\\WINDOWS> echo Type something and press Enter to see it echoed back',
    'Type something and press Enter to see it echoed back',
    '',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Global click handler to maintain focus
    const handleGlobalClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when history updates
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Add the command to history
      const newHistory = [
        ...history,
        `C:\\WINDOWS> echo ${input}`,
        input,
        ''
      ];
      setHistory(newHistory);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      // Clear screen like DOS CLS command
      setHistory([
        'Microsoft Windows [Version 3.11]',
        '(C) Copyright Microsoft Corp 1985-1993.',
        '',
        'C:\\WINDOWS> cls',
        '',
      ]);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono text-sm p-4 overflow-hidden">
      <div 
        ref={terminalRef}
        className="h-screen overflow-y-auto pb-20"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="mb-4">
          <div className="text-white bg-blue-600 px-2 py-1 inline-block">
            MS-DOS Prompt - ECHO.EXE
          </div>
        </div>

        {/* Command History */}
        <div className="whitespace-pre-wrap">
          {history.map((line, index) => (
            <div key={index} className="leading-tight">
              {line}
            </div>
          ))}
        </div>

        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="text-green-400">C:\WINDOWS&gt; echo </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-green-400 outline-none flex-1 font-mono"
            placeholder=""
            autoComplete="off"
            spellCheck="false"
          />
          <span className="animate-pulse text-green-400">_</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 right-4 bg-black border border-green-400 p-2 text-xs">
        <div className="text-yellow-400">DOS ECHO TERMINAL v1.0</div>
        <div>Type your message and press ENTER to echo it back</div>
        <div className="text-gray-400">Click anywhere to focus • ESC to clear screen</div>
      </div>
    </div>
  );
}




