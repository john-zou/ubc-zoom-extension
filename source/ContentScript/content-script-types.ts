// Function names
export const hasBreakoutRoomsButton = "hasBreakoutRoomsButton";
export const assignTaggedUsers = "assignTaggedUsers";
export const breakoutRoomsManagementIsOpened = "breakoutRoomsManagementIsOpened";

// Hard-coded room names. These must be lower case to compare case insensitively
export const InstructorsRoomName = "instructors";
export const LoneWolvesRoomName = "lone wolves";
export const ProfTag = "(prof)";
export const TATag = "(ta)";

export type RoomTag = {
    isInstructor: true;
    isLoneWolf: false;
} | {
    isInstructor: false;
    isLoneWolf: true;
} | {
    isInstructor: false;
    isLoneWolf: false;
    roomNumber: number;
}
