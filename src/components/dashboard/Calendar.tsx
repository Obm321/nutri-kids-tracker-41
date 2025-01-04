import { useState } from "react";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    const first = curr.getDate() - curr.getDay() + 1;
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      dates.push(day.getDate());
    }
    
    return dates;
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date().getDate();

  return (
    <div 
      className="bg-secondary w-full p-4 text-white rounded-t-lg"
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const startX = touch.clientX;
        
        const handleTouchEnd = (e: TouchEvent) => {
          const touch = e.changedTouches[0];
          const endX = touch.clientX;
          const diff = startX - endX;
          
          if (Math.abs(diff) > 50) {
            handleSwipe(diff > 0 ? 'right' : 'left');
          }
        };
        
        document.addEventListener('touchend', handleTouchEnd, { once: true });
      }}
    >
      <div className="grid grid-cols-7 gap-4 text-center">
        {days.map((day) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}
        {weekDates.map((date, index) => (
          <div 
            key={index} 
            className={`text-lg p-2 rounded-full ${date === today ? 'bg-white text-secondary' : ''}`}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};