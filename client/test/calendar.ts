import { AuthResponse } from '../api';
import { api } from './_client_gen';
import { PREAUTH } from './preAuths';

async function checkAsCoMember() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerAuthLogin({
    username: PREAUTH.USER.email,
    password: PREAUTH.USER.password,
  });

  console.log('login', login);

  // Me

  if (login.type === AuthResponse.type.JWT) {
    client.request.config.TOKEN = login.jwt.accessToken;
  }

  // get all calendars
  const calendars =
    await client.events.appEventsControllerCalendarGetCalendarList();

  console.log('calendars', calendars);

  if (calendars.length === 0) {
    return console.log('No calendar found');
  }

  // get all events of first calendar

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  const events = await client.events.appEventsControllerCalendarGetEventsList(
    [calendars[0].id],
    startDate.toISOString(),
    endDate.toISOString(),
  );

  console.log('events', events);
}

async function main() {
  const client = api();

  // Login
  const login = await client.auth.appAuthControllerAuthLogin({
    username: PREAUTH.ADMIN.email,
    password: PREAUTH.ADMIN.password,
  });

  console.log('login', login);

  // Me
  if (login.type === AuthResponse.type.JWT) {
    client.request.config.TOKEN = login.jwt.accessToken;
  }

  // create calendar
  // const createCalendar = await client.events.appEventsControllerCalendarCreate({
  //   title: 'Hello World',
  //   backgroundColor: '#000000',
  //   textColor: '#ffffff',
  // });

  // console.log('createCalendar', createCalendar);

  // // update calendar
  // const updateCalendar = await client.events.appEventsControllerCalendarUpdate(
  //   createCalendar.id,
  //   {
  //     title: 'Hello World 2',
  //   },
  // );

  // console.log('updateCalendar', updateCalendar);

  // get all calendars
  const calendars =
    await client.events.appEventsControllerCalendarGetCalendarList();

  console.log('calendars', calendars);

  // // create event

  // const createEvent =
  //   await client.events.appEventsControllerCalendarCreateEvent({
  //     title: 'Hello World',
  //     start: new Date().toISOString(),
  //     end: new Date().toISOString(),
  //     calendarId: createCalendar.id,
  //     allDay: false,
  //     backgroundColor: '#000000',
  //     textColor: '#ffffff',
  //   });

  // console.log('createEvent', createEvent);

  // // update event

  // const updateEvent =
  //   await client.events.appEventsControllerCalendarUpdateEvent(createEvent.id, {
  //     title: 'Hello World 2',
  //   });

  // console.log('updateEvent', updateEvent);

  // // get all events

  // const startDate = new Date();
  // startDate.setDate(startDate.getDate() - 1);
  // const endDate = new Date();
  // endDate.setDate(endDate.getDate() + 1);
  // const events = await client.events.appEventsControllerCalendarGetEventsList(
  //   [createCalendar.id],
  //   startDate.toISOString(),
  //   endDate.toISOString(),
  // );

  // console.log('events', events);

  // // add member

  // const addMember = await client.events.appEventsControllerCalendarAddMembers(
  //   createCalendar.id,
  //   {
  //     members: [
  //       {
  //         userId: PREAUTH.USER.id,
  //       },
  //     ],
  //   },
  // );

  // console.log('addMember', addMember);

  // // get all events as co member

  // await checkAsCoMember();

  // // modify member

  // const modifyMember =
  //   await client.events.appEventsControllerCalendarUpdateMembers(
  //     createCalendar.id,
  //     {
  //       members: [
  //         {
  //           userId: PREAUTH.USER.id,
  //           type: ManageMembersRequest.type.EDIT,
  //         },
  //       ],
  //     },
  //   );

  // console.log('modifyMember', modifyMember);

  // // get all events as co member

  // await checkAsCoMember();

  // // remove member

  // const removeMember =
  //   await client.events.appEventsControllerCalendarRemoveMembers(
  //     createCalendar.id,
  //     {
  //       members: [
  //         {
  //           userId: PREAUTH.USER.id,
  //         },
  //       ],
  //     },
  //   );

  // console.log('removeMember', removeMember);

  // // get all events as co member

  // await checkAsCoMember();

  // // delete event

  // const deleteEvent =
  //   await client.events.appEventsControllerCalendarDeleteEvent(createEvent.id);

  // console.log('deleteEvent', deleteEvent);

  // // get all events

  const startDate2 = new Date();
  startDate2.setDate(startDate2.getDate() - 1);
  const endDate2 = new Date();
  endDate2.setDate(endDate2.getDate() + 1);

  // const events2 = await client.events.appEventsControllerCalendarGetEventsList(
  //   [createCalendar.id],
  //   startDate2.toISOString(),
  //   endDate2.toISOString(),
  // );

  // console.log('events', events2);

  // // delete calendar

  // const deleteCalendar = await client.events.appEventsControllerCalendarDelete(
  //   createCalendar.id,
  // );

  // console.log('deleteCalendar', deleteCalendar);

  // query events on all calendars
  const events3 = await client.events.appEventsControllerCalendarGetEventsList(
    calendars.map((c) => c.id),
    startDate2.toISOString(),
    endDate2.toISOString(),
  );

  console.log('events', events3);
}

main().catch((e) => {
  console.error(e);
  console.error(JSON.stringify(e));
});
