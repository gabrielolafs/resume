import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Container {
    main_gif: string,
    focused_gif: string,
    link: string | null
}

const PageFlip = () => {
    const [currPage, setCurrPage] = useState(0);

    const mountRef        = useRef(null);
    const isAnimatingRef  = useRef(false);

    const pages = [ // eventually this will be the place that my act
        Array(12).fill(0),
        Array(12).fill(0)
    ]

    useEffect(() => {
        
    })

    const changePage = (direction) => {
      if (isAnimatingRef.current) return;
      setCurrPage(2);
    };

    return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mountRef} />
      
      {/* Navigation arrows */}
      {currPage > 0 && (
        <button
          onClick={() => changePage(-1)}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '15px 25px',
            fontSize: '24px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
        </button>      
      )}
      
      {currentPage < pages.length - 1 && (
        <button
          onClick={() => flipPage(1)}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '15px 25px',
            fontSize: '24px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          →
        </button>
      )}

      {/* Page indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '18px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '20px'
      }}>
        Page {currentPage + 1} of {pages.length}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px 20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        Click any container to zoom in<br/>
        Use arrows to flip pages
      </div>
    </div>
  );
};


export default PageFlip;