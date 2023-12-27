import { Calendar } from '@/global/prisma-classes/calendar';
import { CalendarOnUser } from '@/global/prisma-classes/calendar_on_user';
import { User } from '@/global/prisma-classes/user';

export class CalendarWithUsers extends Calendar {
  CalendarOnUser: CalendarOnUserWithUser[];
}

export class CalendarOnUserWithUser extends CalendarOnUser {
  User: User;
}
