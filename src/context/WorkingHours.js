/*
// Example usage for 24-hour working day:
const WorkingHours = {
  Sunday:    { open24: true }, // Open all day
  Monday:    { open: amPmTo24('12:00 PM'), close: amPmTo24('06:00 PM') },
  // ...
};
*/

export function amPmTo24(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const WorkingHours = {
  Sunday:    { open: amPmTo24('01:00 PM'), close: amPmTo24('04:00 AM') },
  Monday:    { open: amPmTo24('01:00 PM'), close: amPmTo24('04:00 AM') },
  Tuesday:   { open: amPmTo24('01:00 PM'), close: amPmTo24('04:00 AM') },
  Wednesday: { open: amPmTo24('01:00 PM'), close: amPmTo24('04:00 AM') },
  Thursday:  { open: amPmTo24('01:00 PM'), close: amPmTo24('04:00 AM') },
  Friday:    { open: amPmTo24('01:00 PM'), close: amPmTo24('04:00 AM') },
  Saturday:  { open: amPmTo24('01:00 PM'), close: amPmTo24('04:00 AM') },
};

export default WorkingHours;