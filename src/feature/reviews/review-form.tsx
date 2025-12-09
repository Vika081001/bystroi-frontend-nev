import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';

import { Button } from '@/shared/ui/kit/button';
import { Textarea } from '@/shared/ui/kit/textarea';
import { useCreateReview } from '@/shared/hooks/useReviews';

interface ReviewFormProps {
  entityType: 'nomenclature' | 'warehouse';
  entityId: number;
  contragentPhone?: string;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  entityType,
  entityId,
  contragentPhone,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const createReviewMutation = useCreateReview();

  if (!contragentPhone) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Пожалуйста, выберите оценку');
      return;
    }

    if (!text.trim()) {
      alert('Пожалуйста, напишите отзыв');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        entity_type: entityType,
        entity_id: entityId,
        rating,
        text: text.trim(),
        contragent_phone: contragentPhone,
      });

      setRating(0);
      setText('');
      setHoverRating(0);
      onSuccess?.();
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      alert('Не удалось отправить отзыв. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div className="mt-8 p-6 border border-gray-200 rounded-lg">
      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Оставить отзыв
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Ваша оценка</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  width={32}
                  height={32}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 stroke-yellow-400'
                      : 'fill-gray-200 stroke-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о вашем опыте использования товара..."
            className="min-h-[120px]"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Ваш отзыв поможет другим покупателям сделать правильный выбор
          </p>
          <Button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createReviewMutation.isPending ? 'Отправка...' : 'Отправить отзыв'}
          </Button>
        </div>
      </form>
    </div>
  );
};