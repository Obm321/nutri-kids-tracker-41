import { useState, useRef } from "react";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const newDate = new Date(currentDate);
    const daysToAdd = direction === 'left' ? -7 : 7;
    newDate.setDate(currentDate.getDate() + daysToAdd);
    setCurrentDate(newDate);
  };

  const getWeekDates = (date: Date) => {
    const dates = [];
    const curr = new Date(date);
    
    // Get Monday of the current week
    const mondayOffset = curr.getDay() === 0 ? -6 : 1 - curr.getDay();
    curr.setDate(curr.getDate() + mondayOffset);
    
    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr);
      dates.push(day);
      curr.setDate(curr.getDate() + 1);
    }
    
    return dates;
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getMonthInJapanese = (date: Date) => {
    return `${date.getMonth() + 1}月`;
  };

  // Handle date selection with proper state updates
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    onDateSelect?.(date);
  };

  return (
    <div 
      className="bg-secondary w-full p-4 text-white select-none"
      onMouseDown={(e) => {
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
      }}
      onMouseMove={(e) => {
        if (!isDraggingRef.current) return;
        
        const diff = startXRef.current - e.clientX;
        if (Math.abs(diff) > 50) {
          handleSwipe(diff > 0 ? 'right' : 'left');
          isDraggingRef.current = false;
        }
      }}
      onMouseUp={() => {
        isDraggingRef.current = false;
      }}
      onMouseLeave={() => {
        isDraggingRef.current = false;
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        startXRef.current = touch.clientX;
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const diff = startXRef.current - touch.clientX;
        
        if (Math.abs(diff) > 50) {
          handleSwipe(diff > 0 ? 'right' : 'left');
          startXRef.current = touch.clientX;
        }
      }}
    >
      <div className="grid grid-cols-7 gap-4 text-center">
        {days.map((day) => (
          <div key={day} className="text-sm font-medium">
            {day}
          </div>
        ))}
        {weekDates.map((date, index) => (
          <div 
            key={index} 
            onClick={() => handleDateSelect(date)}
            className={`relative text-lg cursor-pointer transition-colors
              ${isSameDay(date, selectedDate || today) ? 
                'bg-white text-secondary rounded-full w-12 h-12 flex items-center justify-center mx-auto' : 
                'hover:bg-white/10'}`}
          >
            {isSameDay(date, selectedDate || today) ? (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-secondary rounded-full w-16 h-16 flex flex-col items-center justify-center">
                <span className="text-xs">{getMonthInJapanese(date)}</span>
                <span className="text-xl">{date.getDate()}</span>
              </div>
            ) : (
              date.getDate()
            )}
          </div>
        ))}
      </div>
    </div>
  );
};