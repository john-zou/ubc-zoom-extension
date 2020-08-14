import 'emoji-log';
/* Copyright 2020 University of British Columbia */
// These functions are imported to the content script (index.ts), on pages defined in manifest.json
// They are activated through the Popup React App using executeScript, which treats code as string
// They are defined here for better developer experience rather than as a string in executeScript
import {
    BreakoutRoomAssignButton,
    BreakoutRoomsButton,
    BreakoutRoomsNotStarted,
    BreakoutRoomUserAriaCheckbox,
    BreakoutRoomWithAriaLabel
} from "./zoom-classnames";
import {
    InstructorsRoomName,
    LoneWolvesRoomName,
    ProfTag,
    RoomTag, TATag
} from "./content-script-types";

export const ContentScriptFunctionsNamespace = "UbcZoomExtensionFunctions"

type AriaElement = Element & { ariaLabel: string }
type AriaCheckbox = Element & { ariaLabel: string, click: () => void, ariaChecked: string }

function getBreakoutRoomNames(): string[] {
    const roomNames = Array<string>()
    const roomNameEls = document.getElementsByClassName(BreakoutRoomWithAriaLabel)
    for (const el of roomNameEls) {
        roomNames.push((el as AriaElement).ariaLabel)
    }
    return roomNames
}

function getAssignBreakoutRoomButtons(): HTMLButtonElement[] {
    const buttons = Array<HTMLButtonElement>()
    const els = document.getElementsByClassName(BreakoutRoomAssignButton)
    for (const el of els) {
        buttons.push(el as HTMLButtonElement)
    }
    return buttons
}

function noMoreUnassignedUsers(): boolean {
    return document.getElementsByClassName("bo-room-assign-list-nodata").length > 0
}

function extractNumberFromName(name: string): number {
    const match = name.match(/\d+/)
    if (match && match.length > 0) {
        return parseInt(match[0]);
    } else {
        return NaN
    }
}

function getTagFromRoomName(roomName: string): RoomTag | null {
    if (roomName.trim().toLowerCase() === InstructorsRoomName) {
        return {
            isInstructor: true,
            isLoneWolf: false,
        }
    }

    if (roomName.trim().toLowerCase() === LoneWolvesRoomName) {
        return {
            isInstructor: false,
            isLoneWolf: true,
        }
    }

    // extract number from room name
    const num = extractNumberFromName(roomName)
    if (!isNaN(num)) {
        return {
            isInstructor: false,
            isLoneWolf: false,
            roomNumber: num
        }
    }

    return null;
}

function parseTagFromUsername(username: string): RoomTag | null {
    const name = username.trim().toLowerCase()

    if (name.startsWith(ProfTag) || name.startsWith(TATag)) {
        return {
            isInstructor: true,
            isLoneWolf: false,
        }
    }

    // extract number from user name
    const num = extractNumberFromName(username)
    if (!isNaN(num)) {
        if (num === 0) { // lone wolf
            return {
                isInstructor: false,
                isLoneWolf: true,
            }
        } else return {
            isInstructor: false,
            isLoneWolf: false,
            roomNumber: num
        }
    }

    return null
}

function shouldAssignUserToRoom(username: string, roomTag: RoomTag): boolean {
    const userTag = parseTagFromUsername(username);
    if (!userTag) {
        return false
    }

    if (roomTag.isInstructor) {
        return userTag.isInstructor
    }

    if (roomTag.isLoneWolf) {
        return userTag.isLoneWolf
    }

    return !userTag.isInstructor && !userTag.isLoneWolf && roomTag.roomNumber === userTag.roomNumber
}

const ContentScriptFunctions = {
    test() {
        console.log("test()")
    },

    hasBreakoutRoomsButton(): boolean {
        const ret = document.getElementsByClassName(BreakoutRoomsButton).length > 0
        console.emoji("⚡", `hasBreakoutRoomsButton, returning: ${ret}`)
        return ret
    },

    breakoutRoomsManagementIsOpened(): boolean {
        const ret = document.getElementsByClassName(BreakoutRoomsNotStarted).length > 0
        console.emoji("⚡", `breakoutRoomsManagementIsOpened, returning: ${ret}`)
        return ret
    },

    assignTaggedUsers(): void {
        const breakoutRoomsNotStarted = document.getElementsByClassName(BreakoutRoomsNotStarted).length > 0
        if (breakoutRoomsNotStarted) {
            const roomNames: string[] = getBreakoutRoomNames()
            const assignButtons: HTMLButtonElement[] = getAssignBreakoutRoomButtons()

            for (let i = 0; i < assignButtons.length; ++i) {
                assignButtons[i].click() // open the list of users

                if (noMoreUnassignedUsers()) {
                    break
                }

                const roomName = roomNames[i]
                const roomTag = getTagFromRoomName(roomName)
                if (!roomTag) {
                    continue
                }

                const ariaCheckBoxes = document.getElementsByClassName(BreakoutRoomUserAriaCheckbox)
                const checkBoxes = document.getElementsByClassName("zmu-data-selector-item")
                for (let j = 0; j < ariaCheckBoxes.length; ++j) {
                    const {ariaLabel: username, ariaChecked: isCheckedStr} = ariaCheckBoxes[j] as AriaCheckbox
                    const isChecked = isCheckedStr === "true"
                    if (shouldAssignUserToRoom(username, roomTag) && !isChecked) {
                        (checkBoxes[j] as HTMLInputElement).click()
                    }
                }

                assignButtons[i].click() // close the list of users
            }
        } else {
            const ret = {}
            console.emoji("⚡", `assignTaggedUsers, returning: ${ret}`)
        }
    }
}

export default ContentScriptFunctions;