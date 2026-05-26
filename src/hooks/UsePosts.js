import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// ─── Пункт 4: хук з React Query кешуванням ───
// staleTime=5хв → повторний виклик не робить новий запит, дані беруться з кешу

export const usePosts = () =>
  useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=30');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

export const usePostDetail = (postId) =>
  useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const [postRes, commentsRes] = await Promise.all([
        axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`),
        axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`),
      ]);
      return { post: postRes.data, comments: commentsRes.data };
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!postId,
  });