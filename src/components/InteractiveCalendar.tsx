import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number): number => {
  return new Date(year, month, 1).getDay();
};

const months: string[] = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const heroImages: string[] = [
  "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1421091242698-34f6ad7fc088?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1632010752286-94f8b0f7be68?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504507926084-34cf0b939964?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1698326560917-ef25ca57da8d?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1664444320083-3c0458bcc2b5?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1683749810427-9f460939f702?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1700675175397-7cc710d56e11?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1530036846422-afb4b7af2fd4?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1554290712-e640351074bd?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1635712707224-233b9a093808?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504253492562-cbc4dc540fcb?w=500&auto=format&fit=crop&q=60",
];

type NotesType = {
  [key: string]: string;
};


function InteractiveCalendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<NotesType>(() => {
    const stored = localStorage.getItem("calendar-notes");
    return stored ? JSON.parse(stored) : {};
  });
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("calendar-notes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-notes", JSON.stringify(notes));
  }, [notes]);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const holidays: Record<string, string> = {
    "0-1": "New Year",
    "0-26": "Republic Day",
    "7-15": "Independence Day",
    "9-2": "Gandhi Jayanti",
    "11-25": "Christmas",
  };

  const isHoliday = (day: number) => holidays[`${currentMonth}-${day}`];

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && clickedDate > startDate) {
      setEndDate(clickedDate);
    } else {
      setStartDate(clickedDate);
    }
  };

  const isInRange = (day: number): boolean => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date >= startDate && date <= endDate;
  };

  const changeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const selectedKey = `${currentYear}-${currentMonth}`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${dark ? "bg-gray-900" : "bg-gray-200"}`}>
      <div className="relative w-full max-w-5xl">

        <div className="flex flex-col items-center mb-[-28px] relative z-20">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-600 rounded-full shadow-lg"></div>
          <div className="w-[2px] h-6 bg-gray-400"></div>
          <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-gray-500 rounded-full bg-white shadow-md"></div>
        </div>

        <motion.div
          initial={{ rotate: -0.8 }}
          animate={{ rotate: [ -0.8, 0.8, -0.8 ] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          style={{ transformOrigin: "top center" }}
          className={`rounded-2xl shadow-2xl overflow-hidden w-full min-h-[100vh] md:min-h-[1000px] ${dark ? "bg-gray-800 text-white" : "bg-white"}`}
        >

          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl font-bold">Interactive Calendar</h1>

            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              {dark ? <Sun /> : <Moon />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentMonth}
              initial={{ y: -80, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ y: 120, opacity: 0, clipPath: "inset(100% 0 0 0)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative h-[35vh] sm:h-[40vh] md:h-[520px]"
            >
              <img
                src={heroImages[currentMonth % heroImages.length]}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1974&auto=format&fit=crop";
                }}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-6 rounded-tl-3xl">
                <h2 className="text-lg">{currentYear}</h2>
                <h1 className="text-3xl font-bold">{months[currentMonth]}</h1>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 p-4 md:p-8">

            <div>
              <h3 className="font-semibold mb-2">Notes</h3>

              <textarea
                value={notes[selectedKey] || ""}
                onChange={(e) => setNotes({ ...notes, [selectedKey]: e.target.value })}
                placeholder="Write monthly notes..."
                className={`w-full h-60 p-3 rounded-lg border resize-none ${dark ? "bg-gray-700 text-white" : "bg-white"}`}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth("prev")} className="p-2 rounded-lg hover:bg-gray-200">
                  <ChevronLeft />
                </button>

                <h2 className="text-lg font-semibold">
                  {months[currentMonth]} {currentYear}
                </h2>

                <button onClick={() => changeMonth("next")} className="p-2 rounded-lg hover:bg-gray-200">
                  <ChevronRight />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center mb-2 text-sm font-semibold">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={i}></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const selected = isInRange(day);

                  return (
                    <motion.button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`p-3 rounded-lg text-sm transition-all ${selected ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{day}</span>
                        {isHoliday(day) && (
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"></span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default InteractiveCalendar;