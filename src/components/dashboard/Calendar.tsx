import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
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
  const month = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-secondary w-full p-4 text-white rounded-t-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevWeek} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-white text-secondary rounded-full p-4 text-center">
            <div className="text-sm">{month}</div>
            <div className="text-2xl font-bold">{currentDate.getDate()}</div>
          </div>
        </div>
        <button onClick={handleNextWeek} className="p-2">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4 text-center">
        {days.map((day, index) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}
        {weekDates.map((date, index) => (
          <div key={index} className="text-lg">
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};