

export function ClockFace({ hours, minutes, onHoursChange, onMinutesChange, selectingHours, setSelectingHours }) {
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