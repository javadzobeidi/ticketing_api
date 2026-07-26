import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Popover } from '@base-ui-components/react/popover';
import { Clock } from 'lucide-react';

import { TimePicker } from '../components/ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';

export default function TestPage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const id = React.useId();
  const [value, onChange] = useState('10:00');
  const [startTime, setStartTime] = useState('09:00');

  const { handleSubmit, control } = useForm({
    defaultValues: {
      startTime: '',
    },
  });

  const onSubmit = (data) => {
    console.log('✅ Form Data:', data);
  };


  return (

    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Main Content */}


      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-blue-100 rounded-lg">
            </div>
            تنظیمات برنامه وقت‌دهی
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            برای ایجاد برنامه وقت‌دهی، فرم زیر را تکمیل کنید. سیستم به صورت خودکار بازه‌های زمانی را بر اساس تنظیمات شما ایجاد می‌کند.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


            <div className="grid grid-cols-3 md:grid-cols-2 gap-4">
              <div className="w-64 bg-red-300">
<TimePicker 
                value={startTime} 
                onChange={setStartTime}
                label="Start Time"
              />
</div>

 <div className="grid gap-2">
   
</div>

              <div className="grid gap-2">
               


              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">


              </div>


            </div>

            <div className="flex justify-end pt-4">

            </div>
          </form>
        </CardContent>
      </Card>

    </div>

  );
}

function ClockFace({ hours, minutes, onHoursChange, onMinutesChange, selectingHours, setSelectingHours }) {
  const handleClockClick = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    const distance = Math.sqrt(x * x + y * y);
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;

    if (selectingHours) {
      const isOuterRing = distance > 85;
      let hour = Math.round(angle / 30) % 12;
      if (isOuterRing) {
        hour = hour === 0 ? 12 : hour + 12;
      }
      if (hour === 12 && !isOuterRing) {
        hour = 0;
      }
      onHoursChange(hour);
      setSelectingHours(false);
    } else {
      const minute = Math.round(angle / 6) % 60;
      onMinutesChange(minute);
    }
  };

  const getHourAngle = (h) => {
    const normalizedHour = h % 12;
    return (normalizedHour * 30) - 90;
  };

  const getMinuteAngle = (m) => (m * 6) - 90;

  const outerHours = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const innerHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minuteMarks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="text-center">
       
        <p className="text-sm text-gray-600">
          {selectingHours ? 'انتخاب ساعت ' : 'Select دقیقه'}
        </p>
      </div>

      <div
        onClick={handleClockClick}
        className="relative w-72 h-72 mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full border-4 border-indigo-200 cursor-pointer shadow-inner"
      >
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-indigo-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30" />

        {selectingHours ? (
          <>
            {outerHours.map((h) => {
              const angle = getHourAngle(h);
              const radius = 105;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isSelected = h === hours;

              return (
                <div
                  key={`outer-${h}`}
                  className={`absolute text-base font-normal transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all pointer-events-none ${
                    isSelected
                      ? 'text-indigo-600 scale-125'
                      : 'text-gray-700'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  {h}
                </div>
              );
            })}

            {innerHours.map((h) => {
              const angle = getHourAngle(h);
              const radius = 65;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isSelected = h === hours;

              return (
                <div
                  key={`inner-${h}`}
                  className={`absolute text-base font-normal transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all pointer-events-none ${
                    isSelected
                      ? 'text-indigo-600 scale-125'
                      : 'text-gray-600'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  {h === 0 ? '00' : h}
                </div>
              );
            })}

            <div
              className="absolute top-1/2 left-1/2 origin-left bg-indigo-600 rounded-full z-20 shadow-md"
              style={{
                width: hours >= 12 ? '105px' : '65px',
                height: '5px',
                transform: `translate(-4px, -2.5px) rotate(${getHourAngle(hours)}deg)`,
              }}
            />
          </>
        ) : (
          <>
            {minuteMarks.map((m) => {
              const angle = getMinuteAngle(m);
              const isMainMark = m % 5 === 0;
              const radius = 105;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isSelected = m === minutes;

              if (isMainMark) {
                return (
                  <div
                    key={m}
                    className={`absolute text-base font-normal transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all pointer-events-none ${
                      isSelected
                        ? 'text-indigo-600 scale-125'
                        : 'text-gray-700'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    {m.toString().padStart(2, '0')}
                  </div>
                );
              }
              return null;
            })}

            <div
              className="absolute top-1/2 left-1/2 origin-left bg-indigo-600 rounded-full z-20 shadow-md"
              style={{
                width: '105px',
                height: '4px',
                transform: `translate(-4px, -2px) rotate(${getMinuteAngle(minutes)}deg)`,
              }}
            />
          </>
        )}
      </div>

      {!selectingHours && (
        <div className="text-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectingHours(true);
            }}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← برگشت به ساعت
          </button>
        </div>
      )}
    </div>
  );
}

function TimePickerPopover({ value, onChange, label }) {
  const [selectingHours, setSelectingHours] = useState(true);

  const parseValue = (val) => {
    if (!val) return { hours: 0, minutes: 0 };
    const [h, m] = val.split(':').map(Number);
    return { hours: h || 0, minutes: m || 0 };
  };

  const { hours: currentHours, minutes: currentMinutes } = parseValue(value);

  const updateTime = (newHours, newMinutes) => {
    const h = newHours.toString().padStart(2, '0');
    const m = newMinutes.toString().padStart(2, '0');
    onChange(`${h}:${m}`);
  };

  const formatTime = () => {
    const h = currentHours.toString().padStart(2, '0');
    const m = currentMinutes.toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <Popover.Root
      onOpenChange={(open) => {
        if (open) {
          setSelectingHours(true);
        }
      }}
    >
      <Popover.Trigger className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 select-none hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-indigo-600 transition-colors">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-indigo-600" aria-label={label || "انتخاب زمان"} />
          <span className="text-lg font-semibold text-gray-700">
            {formatTime()}
          </span>
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-white px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
            <Popover.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              
            </Popover.Arrow>

              <Popover.Description className="text-base text-gray-600">
             <ClockFace
              hours={currentHours}
              minutes={currentMinutes}
              onHoursChange={(h) => updateTime(h, currentMinutes)}
              onMinutesChange={(m) => updateTime(currentHours, m)}
              selectingHours={selectingHours}
              setSelectingHours={setSelectingHours}
            />
            </Popover.Description>

       
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
