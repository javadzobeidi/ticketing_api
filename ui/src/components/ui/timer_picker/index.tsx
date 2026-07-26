import {useState} from 'react'
import { Popover } from '@base-ui-components/react/popover';
import { Clock } from 'lucide-react';

import {ClockFace } from './clock_face'
export function TimePicker({ value, onChange, label,inputClass="" }) {
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
      <Popover.Trigger className={`w-full  flex items-center justify-between px-4  rounded-md border-2
       border-gray-300 bg-white text-gray-900 select-none 
       hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 
       focus-visible:-outline-offset-1 focus-visible:outline-indigo-600 transition-colors ${inputClass}`}>
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