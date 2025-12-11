import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../config/axios.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchMentalHealthEvaluation = async (): Promise<any> => {
  const response = await axiosInstance.get('/api/chat/mental-health-evaluation');
  return response.data;
};

export const useMentalHealthEvaluation = (enable: boolean) => {
  return useQuery({
    queryKey: ['mental-health-evaluation'],
    queryFn: fetchMentalHealthEvaluation,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    enabled: enable,
  });
};
