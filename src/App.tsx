import { useCallback, useState } from 'react';
import InputPage, { type InputEntry } from '@/pages/InputPage';
import ProcessingPage from '@/pages/ProcessingPage';
import RingSelectPage from '@/pages/RingSelectPage';
import ResultsPage from '@/pages/ResultsPage';
import type { AnalysisParams, AnalysisResult, DetectionResult } from '@/lib/diffraction/types';

type Stage = 'input' | 'processing' | 'ringselect' | 'results';

export default function App() {
  const [stage, setStage] = useState<Stage>('input');
  const [entries, setEntries] = useState<InputEntry[]>([]);
  const [params, setParams] = useState<AnalysisParams | null>(null);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleStart = useCallback((ents: InputEntry[], p: AnalysisParams) => {
    setEntries(ents);
    setParams(p);
    setDetections([]);
    setResults([]);
    setErrors([]);
    setStage('processing');
  }, []);

  const handleDetected = useCallback((dets: DetectionResult[], errs: string[]) => {
    setDetections(dets);
    setErrors(errs);
    setStage('ringselect');
  }, []);

  const handleRingSelected = useCallback((res: AnalysisResult[]) => {
    setResults(res);
    setStage('results');
  }, []);

  const handleRestart = useCallback(() => {
    setEntries([]);
    setParams(null);
    setDetections([]);
    setResults([]);
    setErrors([]);
    setStage('input');
  }, []);

  if (stage === 'input') return <InputPage onStart={handleStart} />;
  if (stage === 'processing' && params) return <ProcessingPage entries={entries} params={params} onDone={handleDetected} />;
  if (stage === 'ringselect' && params) return <RingSelectPage detections={detections} params={params} errors={errors} onConfirm={handleRingSelected} onRestart={handleRestart} />;
  return <ResultsPage results={results} errors={errors} onRestart={handleRestart} />;
}
