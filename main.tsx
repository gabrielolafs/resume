import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PageFlip from './PageFlip';

const root = createRoot(document.getElementById('root'));
root.render(<PageFlip />)