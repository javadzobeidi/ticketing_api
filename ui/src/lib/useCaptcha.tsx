import { useState, useCallback, useEffect } from 'react';

import axios from 'axios';
import { useCaptchaRequest } from './useQueries';

const useCaptcha = () => {

  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState(null);
  const [captcha, setCaptcha] = useState(null);

  const { data: captchaData, isLoading: captchaLoading ,refetch} = useCaptchaRequest();

  useEffect(() => {
    if (captchaData) {
      setCaptcha({
        imageUrl: captchaData.data,     // backend returns image URL in .data
        captchaToken: captchaData.captchaToken,
      });
      setUserInput('');
      setIsValid(null);
      setError(null);
    }
  }, [captchaData]);

  

  const generateCaptcha = useCallback(async () => {
    try {
      console.log("Generate")
      await refetch(); // React Query refetches the captcha
    } catch (err) {
      console.error(err);
      setError('Failed to load CAPTCHA');
    }
  }, [refetch]);


  return {
    captcha,
    userInput,
    setUserInput,
    isValid,
    error,
    generateCaptcha,
  };
};

export default useCaptcha;