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
  "https://plus.unsplash.com/premium_photo-1694743671394-60034a1b2f65?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1421091242698-34f6ad7fc088?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1632010752286-94f8b0f7be68?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504507926084-34cf0b939964?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1698326560917-ef25ca57da8d?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1664444320083-3c0458bcc2b5?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1687067885966-d755107af021?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1671512499810-ac5b5dd3bc2b?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1530036846422-afb4b7af2fd4?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1554290712-e640351074bd?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1635712707224-233b9a093808?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504253492562-cbc4dc540fcb?w=500&auto=format&fit=crop&q=60",
];

type NotesType = {
  [key: string]: string;
};

function InteractiveCalendar({ dark, setDark }: { dark: boolean; setDark: (dark: boolean) => void }) {

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [notes, setNotes] = useState<NotesType>(() => {
    const stored = localStorage.getItem("calendar-notes");
    return stored ? JSON.parse(stored) : {};
  });

  // Holiday list
  const holidays: Record<string, string> = {
    "0-1": "New Year",
    "0-26": "Republic Day",
    "7-15": "Independence Day",
    "9-2": "Gandhi Jayanti",
    "11-25": "Christmas",
  };

  const isHoliday = (day: number) => holidays[`${currentMonth}-${day}`];

  useEffect(() => {
    localStorage.setItem("calendar-notes", JSON.stringify(notes));
  }, [notes]);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const handleDateClick = (day: number) => {
    const clicked = new Date(currentYear, currentMonth, day);

    if (!startDate || endDate) {
      setStartDate(clicked);
      setEndDate(null);
    } else if (clicked > startDate) {
      setEndDate(clicked);
    } else {
      setStartDate(clicked);
    }
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date >= startDate && date <= endDate;
  };

  const changeMonth = (dir: "prev" | "next") => {
    if (dir === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else setCurrentMonth(currentMonth - 1);
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else setCurrentMonth(currentMonth + 1);
    }
  };

  const selectedKey = `${currentYear}-${currentMonth}`;

  return (

    <div className={`min-h-screen flex items-center justify-center p-4 ${dark ? "bg-gray-900" : "bg-gray-200"}`}>

      <div className="relative w-full max-w-5xl">

        <div className="flex flex-col items-center mb-[-30px] z-20 relative">
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-[2px] h-6 bg-gray-400"></div>
          <div className="w-7 h-7 border-2 border-gray-500 rounded-full bg-white"></div>
        </div>

        <motion.div
          initial={{ rotate: -0.8 }}
          animate={{ rotate: [-0.8, 0.8, -0.8] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ transformOrigin: "top center" }}
          className={`rounded-2xl shadow-2xl overflow-hidden w-full h-auto md:h-[92vh] max-h-[900px] flex flex-col ${dark ? "bg-gray-800 text-white" : "bg-white"}`}
        >

          <div className="flex justify-between items-center p-4 border-b">

            <h1 className="text-lg font-bold">
              Calendar
            </h1>

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
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[28vh] md:h-[36vh]"
            >

              <img
                src={heroImages[currentMonth]}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-4 rounded-tl-3xl">

                <div className="text-sm">
                  {currentYear}
                </div>

                <div className="text-xl font-bold">
                  {months[currentMonth]}
                </div>

              </div>

            </motion.div>

          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 flex-1">

            <div>

              <h3 className="font-semibold mb-2">
                Notes
              </h3>

              <textarea
                value={notes[selectedKey] || ""}
                onChange={(e) =>
                  setNotes({
                    ...notes,
                    [selectedKey]: e.target.value
                  })
                }
                className={`w-full h-40 p-3 rounded-lg border resize-none ${
                  dark ? "bg-gray-700 text-white" : "bg-white"
                }`}
              />

            </div>

            <div className="md:col-span-2">

              <div className="flex justify-between mb-4">

                <button onClick={() => changeMonth("prev")}>
                  <ChevronLeft />
                </button>

                <h2 className="font-semibold">
                  {months[currentMonth]} {currentYear}
                </h2>

                <button onClick={() => changeMonth("next")}>
                  <ChevronRight />
                </button>

              </div>

              <div className="grid grid-cols-7 text-center text-sm font-semibold">

                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}

              </div>

              <div className="grid grid-cols-7 gap-1 mt-2">

                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={i}></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {

                  const day = i + 1;
                  const selected = isInRange(day);

                  return (

                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`p-2 rounded-lg ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{day}</span>

                        {isHoliday(day) && (
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"></span>
                        )}

                      </div>
                    </button>

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