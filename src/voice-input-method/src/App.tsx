import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { VoiceTranslationPage } from './pages/VoiceTranslationPage';
import { ManualTranslationPage } from './pages/ManualTranslationPage';
import { DocumentTranslationPage } from './pages/DocumentTranslationPage';
import { ImageTranslationPage } from './pages/ImageTranslationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/voice" element={<VoiceTranslationPage />} />
          <Route path="/manual" element={<ManualTranslationPage />} />
          <Route path="/document" element={<DocumentTranslationPage />} />
          <Route path="/image" element={<ImageTranslationPage />} />
          <Route path="*" element={<Navigate to="/voice" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
