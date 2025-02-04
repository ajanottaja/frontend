import { DateTime, Duration } from "luxon";
import { absDuration, isNegativeDuration } from "../../utils/date";

interface StatCardProps {
  title: string;
  date?: DateTime;
  tracked: Duration;
  target: Duration;
}

const formatDuration = (
  d: Duration | undefined = Duration.fromMillis(0),
  includeMinutes = true
) => {
  if (!d) return '';
  const absDur = absDuration(d);
  const hours = absDur.as('hours');
  
  let format = '';
  if (hours < 1) {
    format = "m'm'";
  } else if (hours < 10 && includeMinutes) {
    format = "h'h' m'm'";
  } else {
    format = "h'h'";
  }
  
  return `${isNegativeDuration(d) ? "-" : "+"}${absDur.toFormat(format)}`;
};

const StatCard = ({ title, tracked, target }: StatCardProps) => {
  const diff = tracked.minus(target);
  const value = formatDuration(diff, true);
  const color = diff.as('hours') >= 0 ? 'green' : 'red';

  return (
    <div className="bg-stone-800/50 rounded-lg p-4 flex flex-col w-full">
      <h3 className="text-gray-300 text-sm font-medium mb-1">{title}</h3>
      <div className={`text-${color}-400 text-2xl font-bold mb-2`}>{value}</div>
      <div className="text-gray-300 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Target</span>
          <span className="text-gray-300">{formatDuration(target, true)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tracked</span>
          <span className="text-gray-300">{formatDuration(tracked, true)}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 