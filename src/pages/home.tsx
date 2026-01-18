import { DateTime, Duration } from "luxon";
import React, { useState } from "react";
import DurationPickerDashboard from "../components/atoms/duration-picker-dashboard";
import Timer from "../components/atoms/timer";
import { MonthHeader } from "../components/layout/calendar/headers";
import { MonthCalendar } from "../components/organisms/calendar";
import { Target } from "../schema/calendar";
import { daysOfMonth, tracksOnDate } from "../utils/date";
import { randomInt } from "../utils/functions";
import StatCard from "../components/atoms/stat-card";

const TimerDemo = () => {
  const [beginning, setBeginning] = useState<DateTime>();
  return (
    <Timer
      beginning={beginning}
      startInterval={() => setBeginning(DateTime.now())}
      stopInterval={() => setBeginning(undefined)}
    />
  );
};

const CalendarDemo = () => {
  const today = DateTime.now().startOf("day").plus({ hours: 6 });
  const dates = daysOfMonth(today).map((date) => {
    const numTracks = randomInt(0, 3);
    const tracks = tracksOnDate(date, numTracks).map((i) => ({
      id: i.lower.toMillis().toString(),
      tracked: i,
    }));
    const target: Target = {
      date,
      id: date.toISODate(),
      duration: Duration.fromObject({ hours: numTracks > 0 ? randomInt(5, 8) : 0 }),
    };

    return { date, target, tracks };
  });
  
  return (
    <div className="w-full max-w-full overflow-x-auto -mx-4 px-4">
      <div className="min-w-[320px] md:min-w-[600px] max-w-full">
        <MonthHeader />
        <MonthCalendar date={today} dates={dates} />
      </div>
    </div>
  );
};

const StatsDemo = () => {
  const now = DateTime.now();
  const sampleData = {
    day: {
      tracked: Duration.fromObject({ hours: 8, minutes: 30 }),
      target: Duration.fromObject({ hours: 8 }),
    },
    week: {
      tracked: Duration.fromObject({ hours: 46, minutes: 15 }),
      target: Duration.fromObject({ hours: 40 }),
    },
    month: {
      tracked: Duration.fromObject({ hours: 154, minutes: 45 }),
      target: Duration.fromObject({ hours: 160 }),
    },
    year: {
      tracked: Duration.fromObject({ hours: 2080 }),
      target: Duration.fromObject({ hours: 2012 }),
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        title="Today"
        date={now}
        tracked={sampleData.day.tracked}
        target={sampleData.day.target}
      />
      <StatCard
        title="This Week"
        date={now}
        tracked={sampleData.week.tracked}
        target={sampleData.week.target}
      />
      <StatCard
        title="This Month"
        date={now}
        tracked={sampleData.month.tracked}
        target={sampleData.month.target}
      />
      <StatCard
        title="This Year"
        date={now}
        tracked={sampleData.year.tracked}
        target={sampleData.year.target}
      />
    </div>
  );
};

const DurationPickerDemo = () => {
  const [target, setTarget] = useState<Duration>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-3 bg-stone-800 rounded-lg text-gray-300 font-medium hover:bg-stone-700 transition-all"
      >
        Set Target Duration
      </button>
      <DurationPickerDashboard 
        duration={target} 
        setDuration={setTarget}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      />
    </div>
  );
};

const FeatureSection = ({ 
  title, 
  description, 
  demo,
  fullWidth = false
}: { 
  title: string;
  description: string;
  demo: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-16">
    {fullWidth ? (
      // Full width layout - text above, demo below
      <div className="flex flex-col gap-8 sm:gap-12 items-center text-center">
        <div className="max-w-2xl w-full space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {description}
          </p>
        </div>
        {/* Simplified container structure */}
        <div className="w-full max-w-full">
          {demo}
        </div>
      </div>
    ) : (
      // Stack vertically on mobile, side by side on larger screens
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="w-full lg:flex-1 space-y-4 text-center lg:text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {description}
          </p>
        </div>
        <div className="w-full max-w-full lg:flex-1  rounded-xl p-4 sm:p-6 shadow-xl shadow-stone-900/20">
          {demo}
        </div>
      </div>
    )}
  </div>
);

const SunsetBanner = () => (
  <div className="bg-amber-900/50 border-b border-amber-700/50">
    <div className="max-w-7xl mx-auto px-4 py-3 text-center">
      <p className="text-amber-200 text-sm sm:text-base">
        <span className="font-semibold">Notice:</span> Ajanottaja is no longer actively developed and the service has been shut down. 
        This page will remain up until May 2026. Source code is still available on{" "}
        <a href="https://git.snorre.io/snorre/ajanottaja-frontend" className="underline hover:text-amber-100" target="_blank" rel="noopener noreferrer">Forgejo</a>.
      </p>
    </div>
  </div>
);

const Home = () => {
  const [target, setTarget] = useState<Duration>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <SunsetBanner />
      {/* Hero Section */}
      <div className="relative overflow-hidden flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-stone-900/0 to-stone-900/0" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Ajanottaja
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl w-full mx-auto mb-6 sm:mb-8">
            Your stupid simple time tracking companion. Set targets, track progress, and achieve your goals with precision.
          </p>
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/signup"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white font-medium hover:from-green-500 hover:to-teal-500 transition-all"
            >
              Get Started
            </a>
            <a
              href="/signin"
              className="w-full sm:w-auto px-8 py-3 bg-stone-800 rounded-lg text-gray-300 font-medium hover:bg-stone-700 transition-all"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-stone-800 flex flex-col">
        <FeatureSection
          title="Intuitive Time Tracking"
          description="Start and stop your timer with a single click. Track your work sessions effortlessly and accurately, just like a traditional stopwatch but smarter."
          demo={<TimerDemo />}
        />

        <FeatureSection
          title="Smart Target Setting"
          description="Set daily work targets that match your goals. Ajanottaja helps you maintain a healthy work-life balance by tracking your progress against your targets."
          demo={<DurationPickerDemo />}
        />

        <FeatureSection
          title="Comprehensive Progress Tracking"
          description="Monitor your progress across different time periods. Get instant insights into your daily, weekly, monthly, and yearly performance with beautiful progress indicators."
          demo={<StatsDemo />}
        />

        <FeatureSection
          title="Comprehensive Calendar View"
          description="Visualize your time tracking data in an intuitive calendar interface. Review past performance, identify patterns, and plan future work sessions effectively."
          demo={<CalendarDemo />}
          fullWidth={true}
        />
      </div>

      {/* CTA Section */}
      <div className="border-t border-stone-800 bg-stone-900">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-300 mb-4">
            Ready to Take Control of Your Time?
          </h2>
          <p className="text-gray-400 mb-8">
            Join <span className="line-through">thousands</span> a couple of professionals who trust Ajanottaja for their time tracking needs.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white font-medium hover:from-green-500 hover:to-teal-500 transition-all"
          >
            Start Tracking Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
