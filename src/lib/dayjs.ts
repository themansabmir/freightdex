// lib/dayjs.ts or utils/dayjs.ts
import dayjs from 'dayjs';

// Built-in plugins
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export { dayjs };
