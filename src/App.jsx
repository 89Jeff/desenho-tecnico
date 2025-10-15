// src/App.jsx (VERSÃO SIMPLIFICADA E CORRETA)
import React, { useState, useRef } from 'react';
import DrawingCanvas from './components/DrawingCanvas'; 
import Toolbar from './components/Toolbar'; 

function App() {
  const [mode, setMode] = useState('draw'); 
  const canvasRef = useRef(null); 

  const handleClear = () => {
    if (canvasRef.current && canvasRef.current.limparTudo) {
      canvasRef.current.limparTudo();
      setMode('draw'); 
    } else {
      console.warn("A função Limpar Tudo ainda não está pronta.");
    }
  };

  const handleSave = () => {
    if (canvasRef.current && canvasRef.current.salvarCroqui) {
      canvasRef.current.salvarCroqui();
    } else {
      console.warn("A função Salvar Croqui ainda não está pronta.");
    }
  };
  
  return (
    <div className="App">
      <h1>Desenho Técnico - Croqui Fácil (React)</h1>
      <Toolbar 
        mode={mode} 
        setMode={setMode} // Passa o setMode nativo do useState
        onClear={handleClear} 
        onSave={handleSave}  
      />
      <DrawingCanvas 
        mode={mode} 
        setMode={setMode} 
        ref={canvasRef} 
      />
    </div>
  );
}

export default App;