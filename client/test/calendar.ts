import { api } from './_client_gen';
import { PREAUTH } from './preAuths';

async function checkAsCoMember() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.USER.email,
    password: PREAUTH.USER.password,
  });

  console.log('login', login);

  // Me
  client.request.config.TOKEN = login.accessToken;

  // get all calendars
  const calendars = await client.events.appEventsControllerGetCalendars();

  console.log('calendars', calendars);

  if (calendars.length === 0) {
    return console.log('No calendar found');
  }

  // get all events of first calendar

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  const events = await client.events.appEventsControllerGetEvents(
    calendars[0].id,
    startDate.toISOString(),
    endDate.toISOString(),
  );

  console.log('events', events);
}

async function main() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerLogin({
    username: PREAUTH.ADMIN.email,
    password: PREAUTH.ADMIN.password,
  });

  console.log('login', login);

  // Me
  client.request.config.TOKEN = login.accessToken;

  // create calendar
  const createCalendar = await client.events.appEventsControllerCreateCalendar({
    title: 'Hello World',
    backgroundColor: '#000000',
    textColor: '#ffffff',
  });

  console.log('createCalendar', createCalendar);

  // update calendar
  const updateCalendar = await client.events.appEventsControllerUpdateCalendar(
    createCalendar.id,
    {
      title: 'Hello World 2',
    },
  );

  console.log('updateCalendar', updateCalendar);

  // get all calendars
  const calendars = await client.events.appEventsControllerGetCalendars();

  console.log('calendars', calendars);

  // create event

  const createEvent = await client.events.appEventsControllerCreateEvent({
    title: 'Hello World',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    calendarId: createCalendar.id,
    allDay: false,
    backgroundColor: '#000000',
    textColor: '#ffffff',
  });

  console.log('createEvent', createEvent);

  // update event

  const updateEvent = await client.events.appEventsControllerUpdateEvent(
    createEvent.id,
    {
      title: 'Hello World 2',
    },
  );

  console.log('updateEvent', updateEvent);

  // get all events

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  const events = await client.events.appEventsControllerGetEvents(
    createCalendar.id,
    startDate.toISOString(),
    endDate.toISOString(),
  );

  console.log('events', events);

  // add member

  const addMember = await client.events.appEventsControllerAddMembersToCalendar(
    createCalendar.id,
    {
      members: [
        {
          userId: PREAUTH.USER.id,
        },
      ],
    },
  );

  console.log('addMember', addMember);

  // get all events as co member

  await checkAsCoMember();

  // modify member

  const modifyMember =
    await client.events.appEventsControllerUpdateMembersToCalendar(
      createCalendar.id,
      {
        members: [
          {
            userId: PREAUTH.USER.id,
            type: 'EDIT',
          },
        ],
      },
    );

  console.log('modifyMember', modifyMember);

  // get all events as co member

  await checkAsCoMember();

  // remove member

  const removeMember =
    await client.events.appEventsControllerRemoveMembersToCalendar(
      createCalendar.id,
      {
        members: [
          {
            userId: PREAUTH.USER.id,
          },
        ],
      },
    );

  console.log('removeMember', removeMember);

  // get all events as co member

  await checkAsCoMember();

  // delete event

  const deleteEvent = await client.events.appEventsControllerDeleteEvent(
    createEvent.id,
  );

  console.log('deleteEvent', deleteEvent);

  // get all events

  const startDate2 = new Date();
  startDate2.setDate(startDate2.getDate() - 1);
  const endDate2 = new Date();
  endDate2.setDate(endDate2.getDate() + 1);

  const events2 = await client.events.appEventsControllerGetEvents(
    createCalendar.id,
    startDate2.toISOString(),
    endDate2.toISOString(),
  );

  console.log('events', events2);

  // delete calendar

  const deleteCalendar = await client.events.appEventsControllerDeleteCalendar(
    createCalendar.id,
  );

  console.log('deleteCalendar', deleteCalendar);
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
