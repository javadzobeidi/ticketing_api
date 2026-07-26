import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Loader2, Star } from 'lucide-react';

type QuestionnaireAnswer = {
  questionId: number;
  rating: number;
};

export type QuestionnaireData = {
  ticketCode: string;
  overallRating: number;
  answers: QuestionnaireAnswer[];
  comment?: string;
};

const questionnaireQuestions = [
  { id: 1, text: 'کیفیت پاسخگویی کارشناس' },
  { id: 2, text: 'سرعت رسیدگی به درخواست' },
  { id: 3, text: 'میزان رضایت از نتیجه' },
  { id: 4, text: 'رفتار و برخورد کارکنان' },
  { id: 5, text: 'کیفیت کلی خدمات' },
];

const RatingModal = ({ 
  isOpen, 
  onClose, 
  ticketCode,
  onSubmit 
}: { 
  isOpen: boolean;
  onClose: () => void;
  ticketCode: string;
  onSubmit: (data: QuestionnaireData) => void;
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [comment, setComment] = useState('');

  const handleQuestionRating = (questionId: number, rating: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = () => {
    const questionnaireData: QuestionnaireData = {
      ticketCode,
      overallRating,
      answers: Object.entries(answers).map(([questionId, rating]) => ({
        questionId: parseInt(questionId),
        rating,
      })),
      comment,
    };
    onSubmit(questionnaireData);
  };

  const isValid = overallRating > 0 && questionnaireQuestions.every(q => answers[q.id] > 0);

  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">ارزیابی تیکت شماره {ticketCode.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Rating */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-semibold mb-3">
              امتیاز کلی شما از این تیکت:
            </label>
            <div className="flex items-center gap-3">
              <StarRating 
                value={overallRating} 
                onChange={setOverallRating}
                size="large"
              />
              {overallRating > 0 && (
                <span className="text-lg font-bold text-yellow-600">{overallRating}/5</span>
              )}
            </div>
          </div>

          {/* Questionnaire */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">سوالات ارزیابی</h3>
            {questionnaireQuestions.map((question, index) => (
              <div key={question.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-block bg-primary/10 text-primary rounded-full w-6 h-6 text-center text-sm font-bold ml-2">
                      {index + 1}
                    </span>
                    <label className="text-sm font-medium">{question.text}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating 
                      value={answers[question.id] || 0} 
                      onChange={(rating) => handleQuestionRating(question.id, rating)}
                    />
                    {answers[question.id] > 0 && (
                      <span className="text-sm font-semibold text-gray-600 min-w-[40px]">
                        {answers[question.id]}/5
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Section */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              نظرات و پیشنهادات (اختیاری):
            </label>
            <textarea
              className="w-full border rounded-lg p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="لطفا نظرات و پیشنهادات خود را در اینجا بنویسید..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid}
            className="min-w-[120px]"
          >
            ثبت ارزیابی
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const StarRating = ({ 
  value, 
  onChange, 
  readonly = false,
  size = 'default'
}: { 
  value: number; 
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'default' | 'large';
}) => {
  const [hover, setHover] = useState(0);
  
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <Star
            className={`${sizeClass} transition-all ${
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};


export default RatingModal;
