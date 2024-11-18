// hooks/useSurveyModule.js

import { useState, useEffect } from 'react';


export function useSurveyModule() {
  const [surveyModule, setSurveyModule] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadModule() {
      const Module = await import('../path/to/survey_module.js');
      const SurveyModule = await Module();

      if (isMounted) {
        setSurveyModule(SurveyModule);
      }
    }

    loadModule();

    return () => {
      isMounted = false;
    };
  }, []);

  return surveyModule;
}
