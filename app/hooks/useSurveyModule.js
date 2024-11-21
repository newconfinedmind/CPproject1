// useSurveyModule.js
import { useState, useEffect } from 'react';
import Module from '../../public/SurveyModule'; // 모듈 임포트

export function useSurveyModule() {
  const [surveyModule, setSurveyModule] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadModule() {
      try {
        // 모듈을 초기화하고 로드합니다.
        const instance = await Module();

        if (isMounted) {
          setSurveyModule(instance);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.error('SurveyModule 로드 중 에러 발생:', err);
        }
      }
    }

    loadModule();

    return () => {
      isMounted = false;
    };
  }, []);

  
  return { surveyModule, error };
}
