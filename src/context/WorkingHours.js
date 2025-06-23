export function amPmTo24(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/*
// Example usage for 24-hour working day:
const WorkingHours = {
  Sunday:    { open24: true }, // Open all day
  Monday:    { open: amPmTo24('12:00 PM'), close: amPmTo24('06:00 PM') },
  // ...
};
*/

const WorkingHours = {
  Sunday:    { open24: true },
  Monday:    { open24: true },
  Tuesday:   { open24: true },
  Wednesday: { open24: true },
  Thursday:  { open24: true },
  Friday:    { open24: true },
  Saturday:  { open24: true },
};

export default WorkingHours; 