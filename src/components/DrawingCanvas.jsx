import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { fabric } from 'fabric'; 

// Configurações e Constantes ORIGINAIS
const CANVAS_ASPECT_RATIO = 8 / 10; // Proporção Altura/Largura (1000 / 800)
const INITIAL_LINE_WIDTH = 6;

// Estilos de grade (CSS) para o container (Adaptado para Responsividade)
const canvasContainerStyle = {
  position: 'relative',
  display: 'inline-block',
  marginTop: '15px',
  width: '95vw', // Define a largura em 95% da largura da viewport (VW)
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#fff', 
  maxWidth: '800px', // Limite máximo para telas muito grandes
  maxHeight: 'calc(800px * 10 / 8)', // Limite máximo para a altura
  aspectRatio: '8 / 10', // Mantém a proporção do container
};

const DrawingCanvas = forwardRef(({ mode, setMode }, ref) => {
  const canvasRef = useRef(null); 
  const fabricCanvasRef = useRef(null); 
    
  const [canvasDimensions, setCanvasDimensions] = useState({ 
    width: 0, // Começa com 0 para evitar inicialização prematura
    height: 0 
  }); 

// --- NOVO EFEITO 1: LÓGICA DE RESPONSIVIDADE E CALCULA DIMENSÕES ---
  useEffect(() => {
    const updateDimensions = () => {
      // Calcula a largura máxima baseada no container (95% da viewport)
      const containerWidth = Math.min(window.innerWidth * 0.95, 800); 
      // Calcula a altura mantendo a proporção 8:10
      const calculatedHeight = containerWidth / CANVAS_ASPECT_RATIO;
      
      setCanvasDimensions({
        width: containerWidth,
        height: calculatedHeight
      });
      
      // 💡 CORREÇÃO 1: Redimensionar apenas se o Fabric Canvas já existir
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.setWidth(containerWidth);
        fabricCanvasRef.current.setHeight(calculatedHeight);
        fabricCanvasRef.current.renderAll();
      }
    };

    updateDimensions(); 
    window.addEventListener('resize', updateDimensions);

    // Limpeza do listener
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);


// --- NOVO EFEITO 2: INICIALIZAÇÃO DO FABRIC CANVAS (SÓ RODA DEPOIS QUE AS DIMENSÕES SÃO CONHECIDAS) ---
  useEffect(() => {
    // 💡 CORREÇÃO 2: Só inicializa se as dimensões forem válidas (ou seja, diferentes de 0)
    if (canvasDimensions.width === 0 || canvasDimensions.height === 0) {
        return;
    }
    
    const canvasElement = canvasRef.current;
    
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      // Usa as dimensões calculadas
      width: canvasDimensions.width, 
      height: canvasDimensions.height,
      backgroundColor: 'transparent', 
      selection: true, 
    });

    fabricCanvasRef.current = fabricCanvas;
    
    // Aplicação do Fundo Quadriculado via CSS (Mantida)
    if (canvasElement && canvasElement.style) {
        canvasElement.style.backgroundImage = `
            linear-gradient(0deg, transparent 24%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05) 76%, transparent 77%, transparent)
        `;
        canvasElement.style.backgroundSize = '40px 40px';
    }


    // Função de limpeza 
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
    
  }, [canvasDimensions.width, canvasDimensions.height]); // Roda quando as dimensões mudam ou são inicializadas


// --- FUNÇÕES E EFEITOS REMANESCENTES (TUDO MANTIDO COMO ESTÁ) ---

  useImperativeHandle(ref, () => ({
    limparTudo: () => limparTudo(),
    salvarCroqui: () => salvarCroqui(), 
  }));

  const limparTudo = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.clear();
      canvas.renderAll();
    }
  };
  
  // FUNÇÃO SALVAR CROQUI (Mantida a lógica de grade temporária)
  const salvarCroqui = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      // ... (Lógica de grade temporária e exportação mantida) ...
        const originalBg = canvas.backgroundColor; 
        const gridLines = [];
        const gridSize = 40; 
        const canvasWidth = canvas.width; 
        const canvasHeight = canvas.height; 

        // Desenha linhas de grade VERTICAIS
        for (let i = 0; i <= (canvasWidth / gridSize); i++) {
            const x = i * gridSize;
            const line = new fabric.Line([x, 0, x, canvasHeight], {
                stroke: 'rgba(0,0,0,0.05)', 
                strokeWidth: 1,
                selectable: false,
                evented: false,
                isGridLine: true 
            });
            canvas.add(line);
            gridLines.push(line);
        }

        // Desenha linhas de grade HORIZONTAIS
        for (let i = 0; i <= (canvasHeight / gridSize); i++) {
            const y = i * gridSize;
            const line = new fabric.Line([0, y, canvasWidth, y], {
                stroke: 'rgba(0,0,0,0.05)',
                strokeWidth: 1,
                selectable: false,
                evented: false,
                isGridLine: true
            });
            canvas.add(line);
            gridLines.push(line);
        }

        canvas.getObjects().forEach(obj => {
            if (!obj.isGridLine) {
                canvas.bringToFront(obj);
            }
        });

        canvas.backgroundColor = '#ffffff';
        canvas.renderAll(); 

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2,
        });

        gridLines.forEach(line => canvas.remove(line));
        canvas.backgroundColor = originalBg; 
        canvas.renderAll();

        const link = document.createElement('a');
        link.download = 'croqui.png';
        link.href = dataURL;
        link.click();
    }
  };

  // LÓGICA PARA ADICIONAR TEXTO (Mantida)
  const addText = (e) => {
    // ... (Lógica addText mantida) ...
    const canvas = fabricCanvasRef.current;
    if (!canvas) return; 
    const pointer = canvas.getPointer(e);
    const text = new fabric.Textbox('Digite aqui...', {
        left: pointer.x,
        top: pointer.y,
        width: 150,
        fontSize: 22,
        fill: '#000',
        fontFamily: 'Arial',
    });
    canvas.add(text).setActiveObject(text);
    canvas.renderAll();
    setMode('select'); 
  };
  
  // === EFEITO 3: MUDANÇA DE MODO (Mantido) ===
  useEffect(() => {
    // ... (Lógica de modo 'draw', 'eraser', 'text' e limpeza de listeners, tudo mantido) ...
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true; 
    
    const oldAddTextHandler = canvas.__textModeHandler; 
    if (oldAddTextHandler) {
      canvas.off('mouse:down', oldAddTextHandler);
      canvas.__textModeHandler = null;
    }

    if (mode === 'draw') {
      canvas.isDrawingMode = true; 
      canvas.selection = false; 
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas); 
      canvas.freeDrawingBrush.color = '#000';
      canvas.freeDrawingBrush.width = INITIAL_LINE_WIDTH;
      
    } else if (mode === 'eraser') {
      canvas.isDrawingMode = true; 
      canvas.selection = false; 
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas); 
      canvas.freeDrawingBrush.color = '#ffffff'; 
      canvas.freeDrawingBrush.width = 40; 
      
    } else if (mode === 'text') {
        canvas.selection = true; 
        canvas.isDrawingMode = false; 

        const textModeHandler = (options) => {
            if (!options.target) { 
                addText(options.e);
            }
        };
        canvas.on('mouse:down', textModeHandler);
        canvas.__textModeHandler = textModeHandler; 
    } 
    if (mode === 'select' && !canvas.isDrawingMode) {
      canvas.selection = true;
    }

    canvas.renderAll();

    return () => {
      if (canvas && canvas.__textModeHandler) {
        canvas.off('mouse:down', canvas.__textModeHandler);
        canvas.__textModeHandler = null;
      }
    };
  }, [mode]);

  return (
    <div style={canvasContainerStyle}>
      <canvas 
        ref={canvasRef} 
        id="fabric-canvas" 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%' 
        }} 
      />
    </div>
  );
});

export default DrawingCanvas;