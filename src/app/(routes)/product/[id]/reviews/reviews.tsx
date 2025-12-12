"use client"

import { Star, ThumbsDown, ThumbsUp, FilterX, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/shared/ui/kit/avatar";
import { Badge } from "@/shared/ui/kit/badge";
import { Button } from "@/shared/ui/kit/button";
import { Separator } from "@/shared/ui/kit/separator";
import { useReviews, useCreateReview } from "@/shared/hooks/useReviews";
import { EntityType, ReviewStatus } from "@/shared/types/review";
import { useContragentPhone } from "@/shared/hooks/useContragentPhone";
import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
import { Progress } from "@/shared/ui/kit/progress";

interface ProductReviewsProps {
  entityType: EntityType;
  entityId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  entityType,
  entityId,
}) => {
  const contragentPhone = useContragentPhone();
  const [sort, setSort] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [reviewData, setReviewData] = useState({
    name: "",
    phone: "",
    text: "",
    rating: 0,
  });
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { data: reviewsData, isLoading, refetch } = useReviews({
    entity_type: entityType,
    entity_id: entityId,
    page: 1,
    size: 100,
  });

  const allReviews = useMemo(() => reviewsData?.result || [], [reviewsData]);
  const totalReviews = useMemo(() => reviewsData?.count || 0, [reviewsData]);
  const averageRating = useMemo(() => reviewsData?.avg_rating || 0, [reviewsData]);

  const filteredReviews = useMemo(() => {
    let filtered = [...allReviews];
    
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(review => 
        selectedRatings.includes(review.rating)
      );
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      switch (sort) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return dateB - dateA;
      }
    });
    
    return filtered;
  }, [allReviews, selectedRatings, sort]);

  const ratingDistribution = useMemo(() => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    allReviews.forEach((review: any) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    
    return distribution;
  }, [allReviews]);

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);
  const hasMoreReviews = filteredReviews.length > 3;

  const formatDate = useCallback((dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours} час. назад`;
    } else if (diffDays < 30) {
      return `${diffDays} дн. назад`;
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }, []);

  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex items-center gap-0.5 cursor-default">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            width={16}
            height={16}
            strokeWidth={1}
            className={star <= rating ? "fill-yellow-400 stroke-yellow-400" : "fill-gray-200 stroke-gray-300"}
          />
        ))}
      </div>
    );
  }, []);

  const createReviewMutation = useCreateReview();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reviewData.rating === 0) {
      toast.error("Пожалуйста, выберите оценку");
      return;
    }
    
    if (!reviewData.text.trim()) {
      toast.error("Пожалуйста, напишите текст отзыва");
      return;
    }
    
    const phoneToSend = contragentPhone || reviewData.phone;
    
    if (!phoneToSend) {
      toast.error("Пожалуйста, укажите телефон");
      return;
    }

    const reviewPayload = {
      entity_type: entityType,
      entity_id: entityId,
      rating: reviewData.rating,
      text: reviewData.text.trim(),
      contragent_phone: phoneToSend,
    };

    try {
      await createReviewMutation.mutateAsync(reviewPayload);
      
      toast.success("Отзыв успешно отправлен!");
      
      setReviewData({ 
        name: "", 
        phone: "", 
        text: "", 
        rating: 0 
      });
      
      refetch();
      
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      toast.error("Не удалось отправить отзыв. Пожалуйста, попробуйте еще раз.");
    }
  };

  const handleRatingSelect = (rating: number) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const handleRatingFilterClick = (rating: number) => {
    setSelectedRatings(prev => {
      if (prev.includes(rating)) {
        return prev.filter(r => r !== rating);
      } else {
        return [...prev, rating];
      }
    });
  };

  const getReviewWord = useCallback((count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "отзывов";
    }
    
    if (lastDigit === 1) {
      return "отзыв";
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return "отзыва";
    }
    
    return "отзывов";
  }, []);

  const isReviewVisible = (status: ReviewStatus) => {
    return status === "visible";
  };

  return (
    <section className="pt-8 mt-8 border-t border-gray-200">
      <h2 className="font-medium text-lg tracking-tight">Отзывы</h2>
      <div className="flex pt-8 gap-8 flex-col lg:flex-row">
        <div className="h-fit md:max-w-xs w-full border border-gray-200 rounded-lg p-4">
          <div className="flex gap-4">
            <div>
              <p className="text-6xl">{averageRating.toFixed(1)}</p>
              <div className="flex items-center gap-0.5 pt-2">
                {Array.from({ length: 5 }).map((_, index) => {          
                  const roundedRating = Math.round(averageRating);
                  const isFilled = index < roundedRating;
                  
                  return (
                    <Star
                      key={index}
                      width={16}
                      height={16}
                      strokeWidth={1}
                      fill={isFilled ? "gold" : "none"}
                      stroke={isFilled ? "gold" : "gray"}
                    />
                  );
                })}
              </div>
              <span className="text-xs text-gray-500">{totalReviews} {getReviewWord(totalReviews)}</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              {[5, 4, 3, 2, 1].map((ratingValue) => {
                const count = ratingDistribution[ratingValue as keyof typeof ratingDistribution];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={ratingValue} className="flex items-center gap-2">
                    <span className="text-sm block w-3 text-center">{ratingValue}</span>
                    <Progress value={percentage} className="w-full h-1.5" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 order-2 lg:order-1">
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`h-7 cursor-pointer ${sort === "newest" ? "border-blue-600 bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setSort("newest")}
            >
              Новые
            </Badge>
            <Badge
              variant="outline"
              className={`h-7 cursor-pointer ${sort === "oldest" ? "border-blue-600 bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setSort("oldest")}
            >
              Старые
            </Badge>
            <Badge
              variant="outline"
              className={`h-7 cursor-pointer ${sort === "highest" ? "border-blue-600 bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setSort("highest")}
            >
              Сначала высокие
            </Badge>
            <Badge
              variant="outline"
              className={`h-7 cursor-pointer ${sort === "lowest" ? "border-blue-600 bg-blue-50 text-blue-600" : ""}`}
              onClick={() => setSort("lowest")}
            >
              Сначала низкие
            </Badge>
            
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <Badge
                key={ratingValue}
                variant="outline"
                className={`h-7 cursor-pointer flex items-center gap-1 ${
                  selectedRatings.includes(ratingValue) ? "border-blue-600 bg-blue-50 text-blue-600" : ""
                }`}
                onClick={() => handleRatingFilterClick(ratingValue)}
              >
                <Star width={16} height={16} fill="gold" stroke="gold" />
                <span>{ratingValue}</span>
              </Badge>
            ))}
            
            <Badge
              variant="outline"
              className="h-7 cursor-pointer text-red-600 hover:bg-red-50"
              onClick={() => {
                setSort("newest");
                setSelectedRatings([]);
              }}
            >
              
              Сбросить
            </Badge>
          </div>

          <div className="pt-8">
            <p className="font-medium tracking-tight mb-4">
              Все отзывы ({filteredReviews.length} {getReviewWord(filteredReviews.length)})
            </p>
            
            {isLoading ? (
              <div className="pt-6 text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-2">Загрузка отзывов...</p>
              </div>
            ) : allReviews.length === 0 ? (
              <div className="pt-6 text-center text-gray-500 mb-6">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Отзывов пока нет</p>
                <p className="text-sm text-gray-400">Будьте первым, кто оставит отзыв!</p>
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-4 pt-6 mb-6">
                  {displayedReviews
                    .filter(review => isReviewVisible(review.status as ReviewStatus))
                    .map((review, index) => (
                      <React.Fragment key={review.id}>
                        <li>
                          <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  X
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-medium">
                                Анонимный пользователь
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-0.5 pt-2">
                            {Array.from({ length: 5 }).map((_, index) => {         
                              const isFilled = index < review.rating;
                              return (
                                <Star
                                  key={index}
                                  width={16}
                                  height={16}
                                  strokeWidth={1}
                                  fill={isFilled ? "gold" : "none"}
                                  stroke={isFilled ? "gold" : "gray"}
                                />
                              );
                            })}
                          </div>
                          <div className="pt-1">
                            <p className="font-medium tracking-tight">
                              {review.text.substring(0, 50)}...
                            </p>
                            <p className="text-sm">
                              {review.text}
                            </p>
                          </div>
                          <div className="pt-4 flex gap-2 items-center flex-wrap">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-blue-600 cursor-pointer hover:bg-blue-50"
                              onClick={() => {
                                toast.success("Спасибо за вашу оценку!");
                              }}
                            >
                              <ThumbsUp width={16} height={16} />
                              <span className="text-sm ml-1">Полезно</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 cursor-pointer hover:bg-red-50"
                              onClick={() => {
                                toast.error("Мы учтем ваше мнение!");
                              }}
                            >
                              <ThumbsDown width={16} height={16} />
                              <span className="text-sm ml-1">Не полезно</span>
                            </Button>
                          </div>
                        </li>
                        {index < displayedReviews.length - 1 && <Separator/>}
                      </React.Fragment>
                    ))}
                </ul>

                {hasMoreReviews && (
                  <div className="mt-6 text-center mb-4">
                    <Button
                      variant="link"
                      className="p-0 text-blue-600 cursor-pointer"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                    >
                      {showAllReviews ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Скрыть отзывы
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Показать все отзывы ({filteredReviews.length})
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pt-8 border-t border-gray-200 mb-3">
            <h3 className="font-medium text-lg mb-6">Оставить отзыв</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              {!contragentPhone && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя (необязательно)</Label>
                    <Input
                      id="name"
                      value={reviewData.name}
                      onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                      placeholder="Ваше имя"
                      disabled={createReviewMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={reviewData.phone}
                      onChange={(e) => setReviewData({...reviewData, phone: e.target.value})}
                      placeholder="7 999 123 45 67"
                      maxLength={11}
                      required={!contragentPhone}
                      disabled={createReviewMutation.isPending}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Ваша оценка *</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => handleRatingSelect(star)}
                      disabled={createReviewMutation.isPending}
                    >
                      <svg 
                        width="26" 
                        height="26" 
                        viewBox="0 0 24 24" 
                        fill={star <= reviewData.rating ? "currentColor" : "none"} 
                        xmlns="http://www.w3.org/2000/svg"
                        className={
                          star <= reviewData.rating 
                            ? "text-yellow-500 stroke-yellow-500" 
                            : "text-gray-300 stroke-gray-300 hover:text-yellow-400 hover:stroke-yellow-400"
                        }
                        strokeWidth="1.5"
                      >
                        <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" 
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
                            
              <div className="space-y-2">
                <Label htmlFor="text">Текст отзыва *</Label>
                <textarea
                  id="text"
                  value={reviewData.text}
                  onChange={(e) => setReviewData({...reviewData, text: e.target.value})}
                  className="w-full min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Поделитесь вашим опытом использования товара..."
                  required
                  disabled={createReviewMutation.isPending}
                />
                <p className="text-xs text-gray-500">
                  Оставляя отзыв, пожалуйста, будьте вежливы и конструктивны.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <Button 
                  type="submit" 
                  className="cursor-pointer min-w-[160px]"
                  disabled={createReviewMutation.isPending || reviewData.rating === 0 || !reviewData.text.trim()}
                >
                  {createReviewMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    "Отправить отзыв"
                  )}
                </Button>
                
                <div className="text-xs text-gray-500">
                  {contragentPhone ? (
                    <p>Отзыв будет опубликован от вашего номера: {contragentPhone}</p>
                  ) : (
                    <p>Ваш телефон будет использован только для идентификации отзыва</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;