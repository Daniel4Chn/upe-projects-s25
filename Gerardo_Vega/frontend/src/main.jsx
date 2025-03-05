import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ImageUpload from './ImageUpload.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageUpload />
  </StrictMode>,
)
